/** 
* @fileOverview ���
* @extends  KISSY.Base
* @creator  �Ƽ�(ˮľ�껪double)<huangjia2015@gmail.com>
* @depends  ks-core
* @version 1.0  
* @update 2013-08-21
* @example
*   new Grid({
		tableId: '#poolTable',			// table ���� id
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
	var	DATA_ELEMENT = 'row-element',				 // row Ԫ��index
		CLS_GRID_ROW_SELECTED = 'grid-row-selected', // row ѡ��class��ʾ
		ATTR_COLUMN_FIELD = 'data-column-field',	// �����ֶα�ʾ
		CLS_GRID_ROW = 'grid-row',					// grid row��ʾ
		CLS_GRID_CELL = 'grid-cell',					// grid row��ʾ
		
		CLS_CHECKBOX = '.grid-checkbox', 			// checkbox
		
		CLS_GRID_ROW_OVER = 'grid-row-over',		// �� mouseover class ��ʽ
		
		SELECTALLCLS = '.j_select_all',				// ȫ��ѡ�� checkbox cls����

		TROPRATIONCLS = '.j_add_remove', 			// ���/�Ƴ� btn cls����

		TROPRATIONENABLE = 'enableTr',   			// ���/�Ƴ� btn ������ʾ --- ����
		TROPRATIONDISABLE = 'disableTr';			// ���/�Ƴ� btn ������ʾ --- ��ֹ
		
	// grid Ĭ������
	var POLLGRIDDEFAULT = {
			tableId: null, 							// table id����			
			isPagination:false,						// �Ƿ��з�ҳ Ĭ�� Ϊfalse
			pageSize: 10, 							// ��ҳ��С
			isAjaxData:false,						// �Ƿ����첽���� Ĭ�� Ϊfalse
			ajaxUrl: null,      					// �첽��ѯurl  
			trTpl: null,							// ѡ��� table tbody tr ģ��
			staticData: [],							// ѡ��� ��̬���� 
			checkable:true							// �Ƿ�ѡ�� checkbox
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
		
		_self.config = config;
		
		_self._init();
	}

	// �̳���KISSY.Base  
	S.extend(Grid, S.Base);
	Grid.VERSION = 1.0;

	// S.mix(Grid, {
	// 	tbody : S.get(this.get('tableId')).tbody
	// });

	S.augment(Grid, {

		// �ؼ� ��ʼ��
		_init: function(){
			var _self = this;

			_self.tbody = S.get('tbody', _self.get('tableId'));
			_self.thead = S.get('thead', _self.get('tableId'));
			_self.tfoot = S.get('tfoot', _self.get('tableId'));
			
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
		
		// ��ʼ��gird
		_initGrid: function(){
			var _self = this,
				pagContainer = _self.get('pageConterId') || '#J_Page';	
			
			// ����첽 ���첽�������ݣ�������� ��̬���� --Store
			if(_self.get('isAjaxData')){
				if(_self.get('ajaxUrl')){
					_self.store.load();
				}else{
					throw 'ajax url error��';
				}				
			}else if(_self.get('staticData')){
				_self.store.setResult( _self.get('staticData') );				
			}
			
			// �Ƿ��ҳ
			if(_self.get('isPagination')){
				// ��ʼ�����ʵ��
				_self.pagination = new Pagination(pagContainer);
				/*
					{
						currentPage: 1, 		// Ĭ��ѡ�е�7ҳ
						totalPage: 12, 			// һ����12ҳ
						firstPagesCount: 2, 	// ��ʾ��ǰ���2ҳ
						preposePagesCount: 1, 	// ��ǰҳ�Ľ���ǰ��ҳΪ1ҳ
						postposePagesCount: 2,	// ��ǰҳ�Ľ��ں���ҳΪ2ҳ
						lastPagesCount: 1 		// ��ʾ������1ҳ
					}
				
				*/				
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
				data = TL.serializeToObject(_self.get('formEl'));				
			
			_self.store = new Store({
				dataType:'jsonp',	
				autoLoad: _self.get('autoLoad'),				
				proxy: {url : _self.get('ajaxUrl'), method: 'get' },
				params: TL.encodeURIParam(data)
			});
			
			// ����store���Ƴ���
			if(!_self.store){
				return;
			}
			
			// ׼����������ǰ --- ��� ��Ļ���� delay
			_self.store.on('beforeload', function(){
				var loadMask = _self.get('loadMask');
				if (loadMask) {
					loadMask.show();
				}
			});
			
			// ���ݼ�����ɺ� - ȡ�� ��Ļ���� delay
			_self.store.on('load', function(){
				var results = this.getResult(),
					loadMask = _self.get('loadMask');

				_self.showData(results);

				if(loadMask) {
					loadMask.hide();
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
				var loadMask = _self.get('loadMask');
				if (loadMask) {
					loadMask.hide();
				}
			});
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
		
		//�е� click �¼�
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
		* ��������
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
		_setHeaderChecked : function (checked) {
			var _self = this,
				header = S.get('thead', _self.get('tableId') ),
				checkEl = S.one(SELECTALLCLS, header);
			
			if(checkEl) {
				checkEl.attr('checked', checked);
			}
		},
		
		//����ȫѡ
		_setAllRowsSelected : function (selected) {
			var _self = this;			
			
			S.each(_self.tbody.rows, function(row) { 
				_self._setRowSelected(row, selected);
			});
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
		
		//������ѡ��
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
		
		//������ѡ�У�ȡ��ѡ���¼�
		_onRowSelectChanged : function(row, selected){
			var _self = this,
				data = DOM.data(row, DATA_ELEMENT);
				
			if(selected){
				_self.fire('rowselected', {data : data, row : row});
			}else{
				_self.fire('rowunselected', {data : data, row : row});
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