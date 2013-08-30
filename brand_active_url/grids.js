/** 
* @fileOverview grid���
* @extends  KISSY.Base
* @creator  �Ƽ�(ˮľ�껪double)<huangjia2015@gmail.com>
* @depends  ks-core
* @version 1.0  
* @update 2013-08-30
* @example
*   new Grid({
		tableContainerId: '#poolTable',	// table ���� id
		tr_tpl: tpltr,					// tr��Ⱦģ��
		gridData:[{},{}],				// ָ������
		isAjaxData:true,				// �Ƿ����첽���� Ĭ�� Ϊfalse
		ajaxUrl: 'result.php',		    // �첽��ѯurl  
		checkable: true					// �Ƿ���checkbox
	});
*/

KISSY.add('mui/grid', function(S,  XTemplate, Store, TL, Pagination) { // O,
	var DOM = S.DOM,
		Node = S.Node,
		Ajax = S.IO,
		UA = S.UA,
		Event = S.Event,
		S_Date = S.Date,
        win = window,
        doc = document;		

	// �趨ȫ�� ���� ���� 
	var	containerCls = '.j_tableContent',			// table ��������

		DATA_ELEMENT = 'row-element',				 // row Ԫ��index
		CLS_GRID_ROW_SELECTED = 'grid-row-selected', // row ѡ��class��ʾ
		ATTR_COLUMN_FIELD = 'data-column-field',	// �����ֶα�ʾ

		CLS_GRID_ROW = 'grid-row',					// grid row��ʾ
		CLS_GRID_CELL = 'grid-cell',				// grid row��ʾ
		
		CLS_CHECKBOX = '.grid-checkbox', 			// checkbox
		
		CLS_GRID_ROW_OVER = 'grid-row-over',		// �� mouseover class ��ʽ
		
		SELECTALLCLS = '.j_select_all',				// ȫ��ѡ�� checkbox cls����

		pagContenTpl = '<div class="page-container skin-tb"></div>';	// ��ҳ����


		main_table = 
	    '<tr class="grid-row">'+
	     	'<td class="grid-cell"><input type="checkbox" value="{{id}}" name="box" class="grid-checkbox" /></td>'+

	    	'<td class="grid-cell">{{id}}</td>'+
	        '<td class="grid-cell">{{actype}}</td>'+
	        '<td class="grid-cell">{{medianame}}</td>'+
	        '<td class="grid-cell">'+
				'<a href="javascript:void(0)" class="ui-btn-m-primary j_add_remove" data-no="{{id}}" data-operationState="addtr">���</a>'+
			'</td>'+
	    '</tr>';  
		


	// grid Ĭ������
	var POLLGRIDDEFAULT = {
			tableContainerId: null, 				// table ���� id����			
			isPagination:false,						// �Ƿ��з�ҳ Ĭ�� Ϊfalse
			pageSize: 10, 							// ��ҳ��С
			isAjaxData:false,						// �Ƿ����첽���� Ĭ�� Ϊfalse
			ajaxUrl: null,      					// �첽��ѯurl  
			trTpl: null,							// ѡ��� table tbody tr ģ��
			staticData: [],							// ѡ��� ��̬���� 
			checkable:true,							// �Ƿ�ѡ�� checkbox
			loadMaskTpl: '<div class="loading-mask"></div>', // �����������ֹ���
			currentPage:1,										// Ĭ�Ϸ�ҳ���
			totalPage: 10,										// ��ҳ����
			pageLenght:10,										// ��ҳ����
			dataField:'id'							// ���� josn ���� ��ʾ


		}
	/**
	* 	ajaxUrl �������ݸ�ʽ
	*	{ 	
	*		"success":true,
	*		"message":"",
	*		"rows":[], 
	*		"results":0 
	*	}	
				new Store({
					url : _self.get('ajaxUrl'),
					root: 'rows',
					totalProperty: 'results', 	 // ��������
					params: {type:'all', id:'DJKFJDKFJ94944'}	//�Զ������
				});	
	*/	

	function Grid(config){
		var _self = this,
			config = S.merge(POLLGRIDDEFAULT, config);
			
		if( !(_self instanceof Grid) ){
			return new Grid(config);
		}

		Grid.superclass.constructor.call(_self, config);		
		
		_self._init();
	}

	// �̳���KISSY.Base  
	S.extend(Grid, S.Base);
	Grid.VERSION = 1.0;
	S.augment(Grid, {

		// �ؼ� ��ʼ��
		_init: function(){
			var _self = this;

			_self.container = _self.get('tableContainerId');
			_self.tbody = S.get('tbody', _self.container);
			_self.thead = S.get('thead', _self.container);
			_self.tfoot = S.get('tfoot', _self.container);
			
			if(!_self.container){
				throw 'δָ�����������';
			}

			_self.loadingMaster();
			_self._initStore();	
			_self._initGrid();
			_self._eventRender();
		},
		
		// �¼���ʼ�� -- click -- mouseout -- mouseover
		_eventRender: function(){
			var _self = this;
			
			// thead�¼�
			Event.on(_self.thead, 'click', function(event){
				_self._allSlectEvt(event.target);	
			});
						
			// tbody�¼�
			S.one(_self.tbody).on('click', function (event) {
				_self._rowClickEvent(event.target);
			}).on('mouseover', function (event) {
				_self._rowOverEvent(event.target);
			}).on('mouseout', function (event) {
				_self._rowOutEvent(event.target);
			});				
		},
		
		// ��ʼ��gird �� ��ҳ��
		_initGrid: function(){
			var _self = this;					
			
			// ��ʼ����� ����

			// ����첽 ���첽�������ݣ�������� ��̬���� --Store
			if(_self.get('isAjaxData')){
				if(_self.get('ajaxUrl')){
					_self.store.load({ 
						limit: _self.get('limit'), 
						totalPage: _self.get('totalPage') 
					});
				}else{
					throw 'ajax url error��';
				}				
			}else if(_self.get('staticData')){
				_self.store.setResult( _self.get('staticData') );				
			}
			
			// �Ƿ��ҳ -- ����ָ������ģ��
			if(_self.get('isPagination')){
				_self.addPagePation( _self.get('pagContenTpl') || pagContenTpl, _self.container);
			}	

			
			
			// if (!_self._isAutoFitWidth()) {//��������˿�ȣ���ʹ�ô˿��
				// width = _self.get('width');
				// _self._setWidth(width);
			// } else {						//���������еĿ������Grid���
				// width = _self._getColumnsWidth();
				// _self._setWidth(width + 2);
			// }
            // if(_self.get('allowScroll')){
                // gridEl.addClass(CLS_ALLOW_SCROLL);
            // }

			// if (height) { 			��������˸߶ȣ�����Grid Body�ĸ߶ȣ�
				// _self.setHeight(height);
			// }

		},
		
		// ��ʼ��Store
		_initStore: function(){
			var _self = this,
				data = TL.serializeToObject(_self.get('formEl')),
				data = S.merge(data, {"currentPage": _self.get('currentPage')});				
			
			_self.store = new Store({
				autoLoad: _self.get('autoLoad'),
				url: _self.get('ajaxUrl'),
				params: TL.encodeURIParam(data)
			});
			
			// ����store���Ƴ���
			if(!_self.store){
				return;
			}
			
			// ׼����������ǰ --- ��� ��Ļ���� delay
			_self.store.on('beforeload', function(){
				if (_self.loadMask) {
					_self.loadMask.show();
				}
			});
			
			// ���ݼ�����ɺ� - ȡ�� ��Ļ���� delay
			_self.store.on('load', function(){
				var results = this.getResult();

				_self.showData(results);

				if(_self.loadMask) {
					_self.loadMask.hide();
				}
			});

			// �������ʱ�������¼�
			_self.store.on('addrecords', function (event) {
				var data = event.data;
				_self.appendData(data);
			});

			// ɾ�������Ǵ������¼�
			_self.store.on('removerecords', function (event) {
				var data = event.data;
				_self.removeData(data);				
			});

			// ����ʱ��
			_self.store.on('exception', function () {
				if (_self.loadMask) {
					_self.loadMask.hide();
				}
			});
		},
		
		// ��ӷ�ҳ
		addPagePation: function(tpl, container){
			var _self = this,
				pageCont = DOM.create(tpl);

			if(!pageCont || !container){
				return;
			}	

			DOM.append(pageCont, container);

			var pagContainer = S.get('.page-container', container);

			// ��ʼ�����ʵ��
			_self.pagination = new Pagination(pagContainer, {
				currentPage: _self.get('currentPage'), 		// Ĭ��ѡ�е�7ҳ
				totalPage: _self.get('totalPage'), 			// һ���ж���ҳ
				firstPagesCount: 3, 	// ��ʾ��ǰ���3ҳ
				preposePagesCount: 2, 	// ��ǰҳ�Ľ���ǰ��ҳΪ1ҳ
				postposePagesCount: 2,	// ��ǰҳ�Ľ��ں���ҳΪ2ҳ
				lastPagesCount: 2 		// ��ʾ������1ҳ
			});	
		},

		// ������ֹ���
		loadingMaster: function(){
			var _self = this,
				mastNode = DOM.create( _self.get('loadMaskTpl') );

			if(mastNode){
				DOM.prepend(mastNode, _self.container);
				_self.loadMask = S.one(mastNode);
			}				
		},

		// ȫѡ�¼�
		_allSlectEvt: function(target){
			var _self = this,
				hasAllSelect = DOM.hasClass(target, SELECTALLCLS);
				
			if(hasAllSelect){					
                _self._setAllRowsSelected(target.checked);
			}
		},
		
				
		// ���� row
		_findRow: function (element) {
			return this._lookupByClass(element, CLS_GRID_ROW);
		},	
		
		// ���� cell
		_findCell: function (element) {
			return this._lookupByClass(element, CLS_GRID_CELL);
		},
		
		// ͨ��class���ҷ�������ľ���򷵻ظ������µ���ʽԪ�� td tr
		_lookupByClass: function(element, css){
			if(DOM.hasClass(element, css)) {
				return element;
			}
			return DOM.parent(element, '.' + css);
		},
		
		// row�Ƿ�ѡ��
		_isRowSelected: function(row) {
			return S.one(row).hasClass(CLS_GRID_ROW_SELECTED);
		},
		
		// �� click �¼�
		_rowClickEvent: function (target) {
			var _self = this,
				row = _self._findRow(target),
				cell = _self._findCell(target),
				rowCheckable = _self.get('checkable'), // �Ƿ���checkbox				
				data = null,
				eventResult = null;
				
			if(row){
				data = DOM.data(row, DATA_ELEMENT);
				
				if(cell){
					eventResult = _self.fire('cellClick', {data: data, row: row, cell: cell, field: DOM.attr(cell, ATTR_COLUMN_FIELD), domTarget: target});
					if(eventResult === false){ // ����¼��������˳�
						return;
					}
				}
				_self.fire('rowclick', {data: data, row: row});
				
				// ������ѡ��״̬
				if(rowCheckable){// checkbox
					if(!_self._isRowSelected(row)) {
						_self._setRowSelected(row, true);						
					}else{
						_self._setRowSelected(row, false);
					}
				}
			}
		},
		
		// �е�˫���¼�
		_rowDoubleClickEvent: function(target){
			var _self = this,
				row = _self._findRow(target),
				cell = _self._findCell(target),
				data = null;
			if (row) {
				data = DOM.data(row, DATA_ELEMENT);
				if(cell) {
					_self.fire('celldblclick', {data : data, row : row, cell : cell, field : DOM.attr(cell, ATTR_COLUMN_FIELD), domTarget : target});
				}
				_self.fire('rowdblclick', {data : data, row : row});
			}
		},
		
		//�е� mouseover �¼�
		_rowOverEvent : function (target) {
			var _self = this,
				row = _self._findRow(target);
				
			if(row) {
				S.one(row).addClass(CLS_GRID_ROW_OVER);
			}
		},
		
		//�е� mouseout �¼�
		_rowOutEvent : function (target) {
			var _self = this,
				row = _self._findRow(target);
			if (row) {
				S.one(row).removeClass(CLS_GRID_ROW_OVER);
			}
		},		
		
		/**
		* ��ʾ����
		* @param {Array} data ��ʾ������
		* 
		*/		
		showData : function (data) {
			var _self = this;

			_self.fire('beginshow');

			_self.clearData();

			S.each(data, function (obj, index) {
				_self._createRow(obj, index);
			});

			// _self._afterShow(); ����Ӧ��� ����

			_self.fire('aftershow');
		},

		/**
		* ��ձ��
		*/
		clearData : function(){
			var _self = this,
				rows = _self.tbody.rows;

			// �Ƴ��У�һ��������Դ�Ƴ����ݺ󣬱���Ƴ���Ӧ��������	
			S.each(rows, function(row){
				_self.fire('rowremoved', {data : DOM.data(row, DATA_ELEMENT), row : row} );
			});

			S.all(rows).remove();
		},

		/**
		* ���tr ��tbody��
		*/
		_createRow : function (element, index) {
			var _self = this,
				rowTemplate = _self.trRender(element, _self.get('trTpl') ), // ��ʱ֧�� �û� �Զ���trģ�� ����tr
				rowEl = new Node(rowTemplate).appendTo( _self.tbody ),
				dom = rowEl.getDOMNode();

			DOM.data(dom, DATA_ELEMENT, element);
			_self.fire('rowcreated',{data : element,row : dom});
            return rowEl;
		},

		/**
		* �Ƴ�����
		* @private
		* @param {Array} data �Ƴ�������
		* 
		*/
		removeData : function (data) {
			var _self = this,
				rows = S.makeArray(_self.tbody.rows);

            S.each(rows, function (row) {
                var obj = DOM.data(row, DATA_ELEMENT);
                if (obj && S.inArray(obj, data)) {
					_self.fire('rowremoved',{data: obj, row: row});
					DOM.remove(row);
                }
            });
		},

		/**
		* �������� ������store ����������Ⱦ���
		* @private
		* @param {Array} data ��ӵ�����ϵ�����
		*/
		appendData : function (data) {
			var _self = this,
				rows = [];
				// count = _self._getRowCount();

			_self.fire('beginappend',{data : data});
			S.each(data, function (obj, index) {
				var row = _self._createRow(obj, index);  // count + index
				rows.push(row);
			});
			_self.fire('afterappend', {rows : rows, data : data});
		},

		// ��Ⱦtr
		trRender: function(data, tpl){
    		var _self = this,
    			htmlText,
    			creatNode;

    		if(!tpl){
				throw '��Ⱦģ��δ���룡';    
			}

    		try{
    			htmlText = new XTemplate(tpl).render(data);
    			creatNode = DOM.create(htmlText);
    		}catch(e){
    			throw e;			
    		}

    		return creatNode;
    	},
		
		/**
		* ȡ��ѡ�еļ�¼ 
		*/
		clearSelection : function(){
			var _self = this;
			
			_self._setAllRowsSelected(false);
			_self._setHeaderChecked(false);
		},
		
				
		//���ñ�ͷѡ��״̬
		_setHeaderChecked: function (checked) {
			var _self = this,
				checkEl = S.one(SELECTALLCLS, _self.thead);
			
			if(checkEl) {
				checkEl.attr('checked', checked);
			}
		},
		
		//����rowȫѡ
		_setAllRowsSelected: function (selected) {
			var _self = this;			
			
			S.each(_self.tbody.rows, function(row) { 
				_self._setRowSelected(row, selected);
			});
		},

		// ������ ��� ����� data --- �趨����е� ��Ӧ��rowѡ��״̬
		_setDataSelect: function(data, isSelected){
			var _self = this;

			if(!data || isSelected == undefined){
				throw '���봫����Ӧ���ݻ�ѡ��״̬';
				return;
			}

			data = S.isArray(data) ? data : [data];

			S.each(data, function(obj){
				transition(obj, isSelected);
			});
			
			function transition(obj, isSelected){
				S.each(_self.tbody.rows, function(row){
					_self._setLockRecords(row, obj, isSelected);
				});
			}
		},

		// �趨��� ѡ��״̬ --������
		_setLockRecords: function (row, compareData, selected){
			var _self = this,
				data = DOM.data(row, DATA_ELEMENT),
				isFind = _self.store.matchFunction(data, compareData);

			if(isFind) { 
				_self.setSelectLock(row, selected);		
			}		
		},
		
		// ����rows״̬
		_isLocalRows: function(rows, isDisabled){
			var _self = this;
			
			rows = S.isArray(rows) ? rows : [rows];
			
			S.each(rows, function(row){
				var checkbox = DOM.get(CLS_CHECKBOX, row),
					data = DOM.data(row, DATA_ELEMENT);
			
				// ���ø�ѡ ����ѡ��״̬
				if(checkbox){
					DOM.attr(checkbox, 'disabled', isDisabled);
				}			
			});						
		},

		// �趨ѡ����� �� �������
		setSelectLock: function(row, selected){
			var _self = this,
				checkbox = DOM.get(CLS_CHECKBOX, row),
				isDisabled = DOM.attr(checkbox, 'disabled');
			
			// ��������״̬����ѡ����			
			if(isDisabled) {
				DOM.attr(checkbox, 'disabled', false);
			}
			
			// �趨ѡ�� �� ���� ״̬
			_self._setRowSelected(row, selected);		
			_self._isLocalRows(row, selected);	
		},


		//�Ƿ�rowȫ��ѡ��
		_isAllRowsSelected: function(){
			var _self = this,
				rows = _self.tbody.rows,
				val = true;

			if(rows.length<1){
				return;
			}else{
				S.each(rows, function(row) { 
					if( !_self._isRowSelected(row) ){
						val = false;
					}
				});				
				return val;		
			}					
		},

		
		/**
		* ��ȡѡ�е�����
		* @return {Array} ����ѡ�е�����
		*/
		getSelection : function(){
			var _self = this,
				selectedRows = S.all('.' + CLS_GRID_ROW_SELECTED, _self.tbody),
				objs = [];

			S.each(selectedRows, function(row) {
				var obj = DOM.data(row, DATA_ELEMENT);
				if(obj) {
					objs.push(obj);
				}
			});
			return objs;
		},
		
		// ������ѡ��
		_setRowSelected : function (row, selected) {
			var _self = this,
				checkbox = DOM.get(CLS_CHECKBOX, row),
				data = DOM.data(row, DATA_ELEMENT),
				hasSelected = DOM.hasClass(row, CLS_GRID_ROW_SELECTED);
				
			if(hasSelected === selected) {
				return;
			}
			
			if(checkbox) {
				//���ѡ��򲻿��ã����в���ѡ��
				if(DOM.attr(checkbox,'disabled')){
					return;
				}
				checkbox.checked = selected;
			}
			
			if(selected) {
				DOM.addClass(row, CLS_GRID_ROW_SELECTED);
				_self._onRowSelectChanged(row, selected);
			}else{
				DOM.removeClass(row, CLS_GRID_ROW_SELECTED);
				_self._onRowSelectChanged(row, selected);
			}
		},
		
		// ������ѡ�У�ȡ��ѡ���¼�
		_onRowSelectChanged : function(row, selected){
			var _self = this,
				data = DOM.data(row, DATA_ELEMENT);
				
			if(selected){
				_self.fire('rowselected', {data : data, row : row, type:'rowselected'}); 
			}else{
				_self.fire('rowunselected', {data : data, row : row, type:'rowunselected'});
			}
			_self.fire('rowselectchanged', {data : data, row : row, selected : selected});
		},
    	
		// ��Ⱦdata json ��ƽ������  delay
    	_renderTd: function(data, isPoolTr){
    		var _self = this,
    			htmlAry = [];

    		S.each(data, function(val){
				rendtd(val);
			});

			function rendtd(trData){

				htmlAry.push( '<tr><td><input type="checkbox" value="'+trData.id+'" name="addtr" class="'+_self.poolCheckBoxCls+'" /></td>' );

				S.each(trData, function(val, index){					
					if(isPoolTr){
						if(!index){ // ��һ����Ԫ��
							
						}else{
							htmlAry.push( '<td><input type="checkbox" value="'+val+'" name="addtr" class="'+_self.poolCheckBoxCls+'" /></td>' );
						}
						
					}else{
						htmlAry.push( '<td><input type="checkbox" value="'+val+'" name="rmtr" class="'+_self.candCheckBoxCls+'" /></td>' );
					}					
				});
			}
    	}
	
	});

return Grid;

}, {'requires':['xtemplate', 'mui/gridstore', 'TL', 'gallery/pagination/2.0/index', 'sizzle']}); // 'mui/overlay','mui/overlay/overlay.css',