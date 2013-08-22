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
		ajaxUrl: 'result.php'		    // �첽��ѯurl  
	});
*/

KISSY.add('mui/grid', function(S,  XTemplate, Store) { // O,
	var DOM = S.DOM,
		Node = S.Node,
		Ajax = S.IO,
		UA = S.UA,
		Event = S.Event,
		S_Date = S.Date,
        win = window,
        doc = document;		

	// �趨ȫ�� ���� ���� 
	var	DATA_ELEMENT = 'row-element',				// row Ԫ��index
		CLS_GRID_ROW_SELECTED = 'grid-row-selected', // row ѡ��class��ʾ
		
		CLS_CHECKBOX = 'grid-checkbox', 			// checkbox
		
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
			staticData: [] 							// ѡ��� ��̬���� 						
		}
	/**
	* 	ajaxUrl �������ݸ�ʽ
	*	{ 	
	*		"success":true,
	*		"message":"",
	*		"rows":[], 
	*		"results":0 
	*	}			
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

	// S.mix(Grid, {
	// 	tbody : S.get(this.get('tableId')).tbody
	// });

	S.augment(Grid, {

		// �ؼ� ��ʼ��
		_init: function(){
			var _self = this;

			_self.tbody = S.get('tbody', _self.get('tableId'));
			
			
			_self._initStore();			
	        _self._eventRender();
			_self._initGrid();
		},
		
		// �¼���ʼ��
		_eventRender: function(){
			var _self = this;
			
			//_self.store.addData( {} );
		},

		// ��ʼ��gird
		_initGrid: function(){
			var _self = this;	
			
			_self.store.setResult( _self.get('staticData') );
			
			
			// Event.delegate(self.get('tableId'), 'click', SELECTALLCLS, function(el){ �� ѡ���table ȫѡ�¼�
				// var el = el.target,
					// isChecked = el.checked || D.attr(el, 'checked');

                // _self.poolAllCheckData = self.selectedAllBox(self.get('tableId'), POOLCHECKBOXCLS, isChecked);
            // });
			
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
			var _self = this;
			
			// ����첽 ���첽�������ݣ�������� ��̬���� --Store
			if(_self.get('isAjaxData') && _self.get('ajaxUrl')){
				_self.store = new Store({
					url : _self.get('ajaxUrl'),
					root: 'rows',
					totalProperty: 'results', 	 // ��������
					params: {type:'all', id:'DJKFJDKFJ94944'}	//�Զ������
				});
			}else{
				_self.store = new Store({
					autoLoad: false				// �Ƿ��Զ�����
				});
			}
			
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

				if (loadMask) {
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
				rowTemplate = _self.trRender(element, _self.get('trTpl') ), // �ֶ�ȫ����ʾ ���� ���� ģ�崴��
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
				tbody = _self.get('tbody'),
				rows = S.makeArray(_self.tbody.rows);

            S.each(rows, function (row) {
                var obj = DOM.data(row, DATA_ELEMENT);
                if (obj && S.inArray(obj, data)) {
					_self.fire('rowremoved',{data : obj,row : row});
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

    	/*
		* @description ���÷���--- ���� ѡ��/ȡ�� �ȶ��ĵ�������, ָ��cls���ӵ� checkbox, ����checked״̬
		* @param {string|boolean|document} class ����-- �Ƿ�ѡ�� --- �ĵ�������
		* @return {array} ѡ�е�checkbox valueֵ ����
		*/
    	selectedAllBox: function(thatDoc, cls, isChecked){
    		var self = this,
    		    selectedAry = [],	
    			thatDoc = thatDoc || document, 
                groupRadios = S.query(cls, thatDoc);
                
            S.each(groupRadios, function(el){
            	var trID = DOM.val(el);

				if(isChecked){
					el.checked = 'checked';
					selectedAry.push(trID);
				}else{
					el.checked = '';
					DOM.removeAttr(el, 'checked');
				}               
            });

			return selectedAry;
    	},
		
		/**
		* ȡ��ѡ�еļ�¼
		*/
		clearSelection : function () {
			var _self = this;
			
			_self._setAllRowsSelected(false);
		},
		
		//����ȫѡ
		_setAllRowsSelected : function (selected) {
			var _self = this,
				body = _self.get('tbody');
			//_self._setHeaderChecked(true);
			S.each(body.rows, function (row) {
				_self._setRowSelected(row, selected);
			});
		},
		//������ѡ��
		_setRowSelected : function (row, selected) {
			var _self = this,
				checkbox = DOM.get('.' + CLS_CHECKBOX, row),
				data = DOM.data(row, DATA_ELEMENT),
				hasSelected = DOM.hasClass(row, CLS_GRID_ROW_SELECTED);
			if (hasSelected === selected) {
				return;
			}
			
			if (checkbox) {
				//���ѡ��򲻿��ã����в���ѡ��
				if(DOM.attr(checkbox,'disabled')){
					return;
				}
				checkbox.checked = selected;
			}
			if (selected) {
				DOM.addClass(row, CLS_GRID_ROW_SELECTED);
				//_self.fire('rowselected', {data : data, row : row});
				_self._onRowSelectChanged(row, selected);
			} else {
				DOM.removeClass(row, CLS_GRID_ROW_SELECTED);
				_self._setHeaderChecked(false);
				//_self.fire('rowunselected', {data : data, row : row});
				_self._onRowSelectChanged(row, selected);
			}
			//_self.fire('rowselectchanged', {data : data, row : row});
		},
		//������ѡ�У�ȡ��ѡ���¼�
		_onRowSelectChanged : function(row,selected){
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

}, {'requires':['xtemplate', 'mui/gridstore', 'sizzle']}); // 'mui/overlay','mui/overlay/overlay.css',