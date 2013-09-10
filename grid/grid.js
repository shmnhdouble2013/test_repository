/** 
* @fileOverview grid���
* @extends  KISSY.Base
* @creator  �Ƽ�(ˮľ�껪double)<huangjia2015@gmail.com>
* @depends  ks-core
* @version 1.0  
* @update 2013-08-30
* @example
*   new Grid('#poolTable', {
		tr_tpl: tpltr,					// tr��Ⱦģ��
		gridData:[{},{}],				// ָ������
		isAjaxData:true,				// �Ƿ����첽���� Ĭ�� Ϊfalse
		ajaxUrl: 'result.php',		    // �첽��ѯurl  
		checkable: true					// �Ƿ���checkbox
	});
*/

KISSY.add('mui/grid', function(S,  XTemplate, Store, Pagination, TL) { // O,  
	var DOM = S.DOM,
		Node = S.Node,
		Ajax = S.IO,
		UA = S.UA,
		Event = S.Event,
		S_Date = S.Date,
        win = window,
        doc = document;		

	// �趨ȫ�� ���� ���� 
	var	CONTAINERCLS = 'j_tableContent',			// table ��������

		CHECKRDIOTH = 'j_checkRdio',				// checkbox radio �� ���cls

		DATA_ELEMENT = 'row-element',				 // row Ԫ��index
		CLS_GRID_ROW_SELECTED = 'grid-row-selected', // row ѡ��class��ʾ
		ATTR_COLUMN_FIELD = 'data-column-field',	// �����ֶα�ʾ

		CHECKBOX_TD_INDEX = 'checkbox-index',		// ����ŵ� checkbox ����ˮƽ����

		CLS_GRID_ROW = 'grid-row',					// grid tr row��ʾ
		CLS_GRID_TH = 'grid-th',					// grid th
		CLS_GRID_CELL = 'grid-cell',				// grid cell��ʾ
		COMMAND_BTN = 'command-btn',				// ������ btn ��ʾ -- ��Ҫ��ֹ ѡ��״̬

		CHECKBOXW = '45px',  						// checkbox ��ʾ �������к� �Ŀ��
		CHECKBOXS = '30px',							// checkbox ����ʾ ��� Ĭ�� ���
		
		DRECTION_TAGS = 'drection-tags',			// �����ֶα�ʾ
		DRECTION_ASC = 'asc',						// ���� cls
		DRECTION_DSC = 'desc',						// ���� cls
		
		CLS_ROW_ODD = 'odd-tr', 					// ���� tr cls
		CLS_ROW_EVEN = 'even-tr', 					// ż�� tr cls
		
		CLS_CHECKBOX = 'grid-checkbox', 			// checkbox row
		
		CLS_GRID_ROW_OVER = 'grid-row-over',		// �� mouseover class ��ʽ
		
		SELECTALLCLS = 'j_select_all',				// ȫ��ѡ�� checkbox cls����

		THEADCLS = '.j_thead',						// thead css ����
		TBODYCLS = '.j_tbody',						// tbody css ����
		TFOOTCLS = '.j_tfoot',						// tfoot css ����

		CLS_HIDDEN = '.cls-hide', 					// �Ƿ����� �� ���ع���

		GRIDTPL = 									
			'<div class="table-container j_tableContent">'+

				'<div>'+
					'<table class="ui-table">'+			       
					  	'<thead class="j_thead">'+		           	
				       '</thead>'+ 
				    '</table>'+
				'</div>'+

				'<div class="tbody-container">'+
					'<table class="ui-table">'+
						'<tbody class="j_tbody"></tbody>'+
				    '</table>'+
				'</div>'+ 
				
				'<div class="j_tfoot page-container"></div>'+ 

			'</div>',										// table tpl		

	    LOADMASKTPL = '<div class="loading-mask"></div>'; 	// �����������ֹ���
		


	// grid Ĭ������
	var POLLGRIDDEFAULT = {
			columns:[],								// row ���� ���ö��� ���磺{title: 'id', width: 110, sortable: true, dataIndex: 'id'}	

			ajaxUrl: null,      					// �첽��ѯurl  
			isJsonp: false,							// �Ƿ� Ϊjsonp Ĭ��Ϊfalse			

			staticData: [],							// ѡ��� ��̬���� 

			checkable:false,						// �Ƿ�ѡ�� checkbox
			isShowCheckboxText: false, 				// checkbox����£��Ƿ�th��ͷ�Ƿ���ʾ ȫѡ �ַ� ��  checkbox ���
			
			isPagination:true,						// �Ƿ��з�ҳ Ĭ�� ��

			pageSize: 10, 							// ��ҳ��С
			// isLocalPagination: false,			// �Ƿ� ���ط�ҳ

			dataField:'id',							// ���� josn ���� ��ʾ

			isOuterTpl: false						// �Ƿ��ⲿ�Զ��� tr ģ��
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

	function Grid(container, config){
		var _self = this,
			config = S.merge(POLLGRIDDEFAULT, config);

		if(!container){
			throw 'please assign the id of rendered Dom, of the container of this grid!';
			return;
		}	

		_self.container = S.get(container) ? S.get(container) : S.get('#'+container);
		

		if( !(_self instanceof Grid) ){
			return new Grid(container, config);
		}

		Grid.superclass.constructor.call(_self, config);		
		

		// ֧�ֵ��¼�
		_self.events = [
			/**  
			* ��ʼ��������
			* @name Grid#beginappend 
			* @event  
			* @param {event} e  �¼�����
			* @param {Array} e.data ������ʾ������
			*/
			'beginappend',
			
			/**  
			* �����������
			* @name Grid#afterappend 
			* @event  
			* @param {event} e  �¼�����
			* @param {Array} e.data ������ʾ������
			* @param {Array} e.rows ������ʾ��������DOM�ṹ
			*/
			'afterappend',

			/**  
			* ��ʼ��ʾ���ݣ�һ��������Դ���������ݣ���ʼ�ڱ������ʾ����
			* @name Grid#beginshow
			* @event  
			* @param {event} e  �¼�����
			*/			
			'beginshow',

			/**  
			* ��ʾ������ɣ�һ��������Դ���������ݣ����ڱ������ʾ���
			* @name Grid#aftershow
			* @event  
			* @param {event} e  �¼�����
			*/
			'aftershow',

			/**  
			* �Ƴ��У�һ��������Դ�Ƴ����ݺ󣬱���Ƴ���Ӧ��������
			* @name Grid#rowremoved
			* @event  
			* @param {event} e  �¼�����
			* @param {Object} e.data �ж�Ӧ�ļ�¼
			* @param {Object} e.row �ж�Ӧ��DOM����
			*/
			'rowremoved',

			/**  
			* ����У�һ��������Դ������ݡ��������ݺ󣬱����ʾ��Ӧ���к󴥷�
			* @name Grid#rowcreated
			* @event  
			* @param {event} e  �¼�����
			* @param {Object} e.data �ж�Ӧ�ļ�¼
			* @param {Object} e.row �ж�Ӧ��DOM����
			*/
			'rowcreated',

			/**  
			* ��ҳǰ���� ���� mui/Pagination ��ҳ, ת����ҳ�¼�
			* @name Grid# afterPageChanged
			* @event  
			* @return ��ҳ��Ϣ����
			*/
			'afterPageChanged',

			/**  
			* �е���¼�
			* @name Grid#rowclick
			* @event  
			* @param {event} e  �¼�����
			* @param {Object} e.data �ж�Ӧ�ļ�¼
			* @param {Object} e.row �ж�Ӧ��DOM����
			* 
			*/
			'rowclick',

			/**  
			* ��Ԫ�����¼�
			* @name Grid#cellclick
			* @event  
			* @param {event} e  �¼�����
			* @param {Object} e.data �ж�Ӧ�ļ�¼
			* @param {Object} e.row ����ж�Ӧ��DOM����
			*/
			'cellclick',

			/**  
			* ��˫���¼�
			* @name Grid#rowdblclick
			* @event  
			* @param {event} e  �¼�����
			* @param {Object} e.data �ж�Ӧ�ļ�¼
			* @param {Object} e.row �ж�Ӧ��DOM����
			* 
			*/
			'rowdblclick',

			/**  
			* ��Ԫ��˫���¼�
			* @name Grid#celldblclick
			* @event  
			* @param {event} e  �¼�����
			* @param {Object} e.data �ж�Ӧ�ļ�¼
			* @param {Object} e.row ����ж�Ӧ��DOM����
			*/
			'celldblclick',

			/**  
			* ��ѡ���¼�
			* @name Grid#rowselected
			* @event  
			* @param {event} e  �¼�����
			* @param {Object} e.data �ж�Ӧ�ļ�¼
			* @param {Object} e.row �ж�Ӧ��DOM����
			*/
			'rowselected',

			/**  
			* ��ȡ��ѡ���¼�
			* @name Grid#rowunselected
			* @event  
			* @param {event} e  �¼�����
			* @param {Object} e.data �ж�Ӧ�ļ�¼
			* @param {Object} e.row �ж�Ӧ��DOM����
			*/
			'rowunselected',

			/**  
			* ��ѡ��״̬�ı��¼�
			* @name Grid#rowselectchanged
			* @event  
			* @param {event} e  �¼�����
			* @param {Object} e.data �ж�Ӧ�ļ�¼
			* @param {Object} e.row �ж�Ӧ��DOM����
			* @param {Object} e.selected ѡ�е�״̬
			*/
			'rowselectchanged',			 

			/**  
			* ȫѡ�¼� ����
			* @name Grid#allRowsSelected
			* @event  
			*/
			'allRowsSelected',

			/**  
			* ȡ��ȫѡ�¼� ����
			* @name Grid#unAllRowsSelected
			* @event  
			*/
			'unAllRowsSelected'
		];

		_self._init();
	}

	// �̳���KISSY.Base  
	S.extend(Grid, S.Base);
	Grid.VERSION = 1.0;
	S.augment(Grid, {

		// �ؼ� ��ʼ��
		_init: function(){
			var _self = this;

			_self._augmsConfig();
			_self._initStore();	
			_self._initGrid();
			_self._eventRender();
		},

		// ������ʼ��
		_augmsConfig: function(){
			var _self = this;
			
		},

		// �¼���ʼ�� -- click -- mouseout -- mouseover
		_eventRender: function(){
			var _self = this,
				hedEv = S.query('.'+CLS_GRID_TH, _self.thead);

			// thead�¼� -- ǰ�� ���� vs ȫѡ 
			Event.delegate(hedEv, 'click', function(ev){				
				// ǰ�� ����
				_self.sortableFn(ev); 

				// ȫѡ
				_self._allSlectEvt(ev);	
			}); 
			
			// tbody�¼�
			S.one(_self.tbody).on('click', function (event) {
				_self._rowClickEvent(event.target);
			}).on('mouseover', function (event) {
				_self._rowOverEvent(event.target);
			}).on('mouseout', function (event) {
				_self._rowOutEvent(event.target);
			});		

			// ת�� ��ҳ�¼� afterPageChange --> afterPageChanged
			_self.pagination && _self.pagination.on('afterPageChange', function(e) {
				var curPage = e.idx;

				// �����첽��Ϊ ��˷�ҳ���� ���� ��Ϊ ���ط�ҳ ����
				if(_self.get('ajaxUrl')){
					_self.store.load({ 		
						currentPage: curPage
					});
				}else{
					_self.store.setCurrentPage(curPage);
					
					var results = _self.store._localPagination();			
					_self.showData(results); 
				}				

				_self.fire('afterPageChanged', _self.store.pageInfo);
			});	


			// ��ѡ�� vs ȫѡ �Զ�ƥ�� 
			_self.on('rowselected rowunselected', function(ev){
				_self.autoSelect(ev);
			});				
		},
		
		// ��ʼ�� table Dom �ṹ
		_initTableDom: function(data){
			var _self = this,
				thRow = '',
				table = DOM.create(GRIDTPL);

			// ����ȫ������ table
			_self.table = table;
				
			// ��ȡ -- ��� ͷ �� ��  ������
			_self.tbody = S.get(TBODYCLS, table);
			_self.thead = S.get(THEADCLS, table);
			_self.tfoot = S.get(TFOOTCLS, table);

			// ��ȡ������	
			_self.columns = S.isArray(_self.get('columns')) ? _self.get('columns') : [];

			// if(data){
				thRow = DOM.create(_self._getThRowTemplate(data, 0));
			// }

			// ��� ͷ	
			DOM.append(thRow, _self.thead);	

			// ����a ��ǩ ��ʾ i	
			_self.sortAui = S.query('.'+DRECTION_TAGS, _self.thead);

			// �Ƿ��ҳ
			if(_self.get('isPagination')){
				_self.addPagePation(_self.table);
			}		
			
			// �������div
			_self.loadingMaster(_self.table);	

			// ����Dom����
			DOM.append(_self.table, _self.container);
		},		

		//��ȡ�е�ģ�� -- tr
		_getRowTemplate: function (obj, index){
			var _self = this;

			var	oddCls = index % 2 === 0 ? CLS_ROW_ODD : CLS_ROW_EVEN, 				// ��� tr �����ɫ��ʾ wait
				cellTempArray = [],
				rowTemplate = null,
				cellTemp = null,
				emptyTd = '';
			
			// ����� checkbox �������			
			if(_self.get('checkable')) {
				cellTemp = _self._getCheckedCellTemplate(CLS_GRID_CELL, CLS_CHECKBOX, index);
				cellTempArray.push(cellTemp);
			}

			S.each(_self.columns, function (column, colindex) {
				var value = _self._getFieldValue(obj, column.dataIndex),//obj[column.dataIndex.*.*],
					text = _self._getRenderText(column, value, obj),
					temp = _self._getCellTemplate(colindex, column, text);

				cellTempArray.push(temp);
			});

			rowTemplate = ['<tr rowIndex="', index, '" class="', CLS_GRID_ROW, ' ', oddCls,'">', cellTempArray.join(''), emptyTd, '</tr>'].join('');
			
			return rowTemplate;
		},

		//��ȡ��Ԫ���ģ�� -- td
		_getCellTemplate: function (index, column, text){
			var _self = this,
				width = _self.setPxCheck(column.width),
				dataIndex = column.dataIndex,
				hideText = column.hide ? CLS_HIDDEN : '',
				template = ['<td width="'+width+'" class="', CLS_GRID_CELL, hideText, '" colindex="', index, '" data-field="',dataIndex,'">', text, '</td>'].join('');
			
			return template;
		},

		// ��checkbox ��ѡ�� -- td checkbox
		_getCheckedCellTemplate: function(clscell, clsCheck, index){
			var _self = this,
				currentPage = _self.store.getCurrentPage(),
				pageSize = _self.store.getPageSize(), 
				emptyTd = ' ',
				defWidth = _self.get('isShowCheckboxText') ? CHECKBOXW : CHECKBOXS,	
				index = _self.get('isShowCheckboxText') ? ++index : '',
				index = currentPage === 1 ? index : pageSize + index;

			return '<td width="'+defWidth+'" class="'+clscell+emptyTd+CHECKBOX_TD_INDEX+'"><input type="checkbox" value="" name="checkboxs" class="'+clsCheck+'">'+index+'</td>';
		},	

		/**
		* ��ȡ�е�ģ�� -- th
		* @param {obj || string} ��� ���ݶ��� �� ��Ӧ��index
		* @return {string} ����th�� tr html�ַ���
		*/
		_getThRowTemplate: function(obj, index){
			var _self = this;

			// ֻ��Ⱦ tr th ͷ����
			if(index > 1){
				return;
			}

			var	cellTempArray = [],
				rowTemplate = null,
				cellTemp = null,
				thTpl = '',
				emptyTd = ' ',
				defWidth = _self.get('isShowCheckboxText') ? CHECKBOXW : CHECKBOXS,	
				selectAllText = _self.get('isShowCheckboxText') ? 'ȫѡ': ''; // �Ƿ���ʾ ȫѡ �ַ�
			
			// ��ѡ��	
			if( _self.get('checkable') ){
				thTpl = '<th width="'+defWidth+'" class="'+CLS_GRID_TH + emptyTd +'"><input type="checkbox" value="" name="checkboxs" class="'+SELECTALLCLS+'" data-field="">'+selectAllText+'</th>';
				cellTempArray.push(thTpl);
			}		

			S.each(_self.columns, function(column, index) {
				var value = _self._getFieldValue(column, column.dataIndex), //obj[column.dataIndex.*.*],
					text = _self._getRenderText(column, value, obj),
					temp = _self._getThTemplate(column, text, value);

				cellTempArray.push(temp);
			});

			rowTemplate = ['<tr rowIndex="', index, '" class="', CLS_GRID_ROW, '">', cellTempArray.join(''), emptyTd, '</tr>'].join('');
			
			return rowTemplate;
		},

		/**
		* ��ȡ th html
		* @param {obj||string} ������������obj��render����html��dataIndex��ȡ��ֵ
		* @return {string} th html
		*/
		_getThTemplate: function(obj, text, value){
			var _self = this;
				
			var	hideCls = obj.hide ? CLS_HIDDEN : '',
				width = _self.setPxCheck(obj.width),
				title = obj.title,
				isSortCols = obj.sortable,
				dataIndex = obj.dataIndex,				
				text = title || text,
				emptyTd = ' ',
				thTpl = '',
				thAry = [];	
			
			// ֧�� string || float || int || date
			var dataType = obj.dataType || S.TL.strToDataType(value) || 'string';	

			// ��������
			if(isSortCols){
				thTpl = '<th width="'+width+'" class="'+CLS_GRID_TH + emptyTd + hideCls+'"><a href="javascript:void(0)" title="�������" data-field="'+dataIndex+'" data-dataType="'+dataType+'">'+text+'<i class="'+DRECTION_TAGS+'">&nbsp;</i></a></th>';
				thAry.push(thTpl);
			}else{
				thTpl = '<th width="'+width+'" class="'+CLS_GRID_TH + emptyTd + hideCls+'" data-field="'+dataIndex+'">'+text+'</th>';
				thAry.push(thTpl);
			}	

			return thAry.join('');
		},	

		
		
		// ���� ���ݹ�ѡ״̬, �Զ��ж� ȫѡ��� ��ʾ״̬
		autoSelect: function(ev){
			var _self = this,
				type = 	ev.type;

			if(type === 'rowselected'){
				_self._isAllRowsSelected() && _self._setHeaderChecked(true);
			}else{
				_self._setHeaderChecked(false); 
			}
		},

		sortableFn: function(ev){
			var _self = this,
				direction = '',
				itagIndex = DOM.first(ev, 'i'),
				field = DOM.attr(ev, 'data-field'),
				cssCls = DOM.attr(itagIndex, 'class'),
				dataType = DOM.attr(ev, 'data-dataType'),
				isSort = DOM.hasClass(itagIndex, DRECTION_TAGS);
				
			if(!isSort){
				return;
			}
			
			// ��һ�ε�� vs �������
			if(cssCls === DRECTION_TAGS){
				direction = (_self.store.sortInfo.direction).toLowerCase() === DRECTION_ASC ? DRECTION_DSC : DRECTION_ASC; // ��ȡstoreĬ������ʽ asc ����
			}else{
				direction = DOM.hasClass(itagIndex, DRECTION_ASC) ? DRECTION_DSC : DRECTION_ASC;
			}
			
			_self.store.sort(field, direction.toLocaleUpperCase(), dataType); 	
			
			// �Ƴ����� �����Ǳ�ʾ  -- ��ʾ��ǰ ������ 
			S.each(_self.sortAui, function(tag){
				DOM.removeClass(tag, DRECTION_ASC);
				DOM.removeClass(tag, DRECTION_DSC);
			});			
			DOM.addClass(itagIndex, direction);
		},
		
		// ����·�� ��ȡ����ֵ
		_getFieldValue: function(obj, dataIndex){
			var _self = this;

			if(!dataIndex){
				return '';
			}
	    	var arr = dataIndex.split('.'),
	    		curObj = obj,
	    		result;

	    	if(arr.length<2){
	    		result = curObj[dataIndex];
	    	}else{
	    		S.each(arr, function(name){
		    		if(curObj){
		    			result = curObj[name];
		    			curObj = result;
		    		}else{
		    			return false;
		    		}
		    	});
	    	}

	    	return result;
	    },

		// ��ȡ��ʽ��������
        _getRenderText : function(column, value, obj){
        	var _self = this,
            	text = value,
            	fn = column.renderer,
            	domRender = S.isFunction(fn) ? fn : null;

            if(domRender){
                try{
                    text = domRender(value, obj);
                }catch(ex){
                    S.error('renderer error, occurred in column: ' + column.title);
                }
            }
            return text;
        },

		// ��ʼ��gird �� ��ҳ��
		_initGrid: function(){
			var _self = this,				
				width = _self.get('width'),
				height = _self.get('height');							
			
			// ���� ����table�ṹ
			_self._initTableDom();		

			// ����첽 ���첽�������ݣ�������� ��̬���� --Store
			if(_self.get('ajaxUrl')){
				_self.store.load();
			}else if(_self.get('staticData')){	
				_self.store.setResult( _self.get('staticData') );				
			}else{
				throw 'Grid Data Source Error!';
			}	
			
			// ����Grid Body�� ��� ��
			if(width) { 			
				_self.setWidth(width);
			}
			if (height) { 			
				_self.setHeight(height);
			}
		},
		
		// ��ʼ��Store jsonp
		_initStore: function(data){
			var _self = this,
				dataType = _self.get('isJsonp') ? 'jsonp': 'json';

			// ��ʼ��Store ָ�� url���Ƿ�jsonp��	���з�ҳ(��ҳ��С �� ��ҳ����)
			_self.store = new Store({ 
				url: _self.get('ajaxUrl'),
				dataType: dataType,
				limit: _self.get('pageSize'), 
				localSort: _self.get('isLocalSort'),
				isPagination: _self.get('isPagination') 
				// localPagination: _self.get('isLocalPagination')	
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
			_self.store.on('load', function(obj){
				var data = obj.data,
					curPage = this.getTotalPage(),
					results = this.getResult();			
			
				_self.showData(results); 	

				// ���·�ҳ ʵʱ����
				if(_self.pagination){		
					_self.pagination.setTotalPage(curPage);
				}	

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
			
			// ǰ��������
			_self.store.on('localsort', function(){
				var results = this.getResult();			
				_self.showData(results); 
			});
		},
		

		// ����Grid Body�Ŀ��
		setWidth: function(width){
			var _self = this,				
				outerWidth = DOM.width(_self.container), 
				width = parseInt( _self.setPxCheck(width) );
				
			if(width ){ // && width >= outerWidth
				DOM.css(_self.table, 'width', width+'px' );
			}
		},

		// ����Grid Body�ĸ߶�
		setHeight: function(height){
			var _self = this,
				tbodyContainer = S.get('.tbody-container', _self.container), 
				theadHeight = DOM.height(_self.thead), 
				tfootHeight = DOM.height(_self.tfoot), 
				height = parseInt( _self.setPxCheck(height) ),
				height = height - theadHeight - tfootHeight;

			if(height>0){ //  && height >= outerHeight
				DOM.css(tbodyContainer, 'height', height+'px' );
			}	
			_self.tbodyContainer = tbodyContainer;
		},
		
		// ���� �趨 ���ؿ�߹��˺���
		setPxCheck: function(px){
			var _self = this,
				endVaue = 'auto';				

			if(!px){
				return; 
			}

			// �������auto
			if(S.trim(px) === endVaue){
				return endVaue;
			}

			if(S.isNumber(px)){
				endVaue = px+'px';
			}else if(S.isString(px)){

				var isPercentage = px.split('%'),
					hasPx = px.split('px');

				if(isPercentage.length>1){
					console.log('The percentage of CSS values is not supported!'); 
					return;
				}	

				if(hasPx.length>1){					
					endVaue = px;
				}
			}else{
				console.log('Invalid height or width value!'); 
			}

			return endVaue;
		},

		// ��ӷ�ҳ
		addPagePation: function(container){
			var _self = this;

			if(!container){
				return;
			}	

			var pagContainer = S.get('.page-container', container);

			// ��ʼ��
			_self.pagination = new Pagination({
				container: pagContainer
			});
			// ��ֹ ��ҳ ���ύ
		    Event.delegate(pagContainer, 'submit', 'form', function(e){
		       	e.preventDefault();
		    });
		},

		// �ֶ� ǿ�� �趨 ��ҳ����
		_enforcePageTal: function(totalPage){
			var _self = this,
				totalPage = _self.store.getTotalPage(),
				totalPage = S.isNumber(totalPage) ? totalPage : parseInt(totalPage, 10);

			if(totalPage<1){
				totalPage = 1;
			}

			if(totalPage > totalPage){
				totalPage = totalPage;
			}
			
			if(totalPage !== totalPage && _self.pagination){				
				_self.pagination.setTotalPage(totalPage);
				_self.store.setTotalPage(totalPage);
			}			
		},

		// ������ֹ��� -- �Զ���ģ��
		loadingMaster: function(tableContainer){
			var _self = this,
				mastNode = DOM.create( _self.get('maskTpl') || LOADMASKTPL);

			if(mastNode){
				DOM.prepend(mastNode, tableContainer);
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
				isBtn = DOM.hasClass(target, COMMAND_BTN),
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
				
				// ����� btn
				if(isBtn){
					return;
				}
				
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
			var _self = this,
				trs = [];

			_self.fire('beginshow');

			_self.clearData();

			S.each(data, function (obj, index) {
				trs.push(_self._createRow(obj, index));
			});

			// _self._afterShow(); ����Ӧ��� ����
			
			DOM.html(_self.tbody, trs.join(''));
			
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
		* render table Dom  -- ֧�� �û� �Զ���table ҳ��, trģ�� �� Ĭ���ڽ�Ĭ������ģ��
		*/
		_createRow : function(element, index) {
			var _self = this,				
				rowTemplate = '';				

			if(_self.get('isOuterTpl')){
				rowTemplate = _self.trRender(element, _self.get('trTpl') );
			}else{
				rowTemplate = _self._getRowTemplate(element, index);
			}	

			var rowEl = new Node(rowTemplate),
				dom = rowEl.getDOMNode();

			DOM.data(dom, DATA_ELEMENT, element);
			_self.fire('rowcreated',{data: element, row: dom});

            return rowTemplate;
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

		// ��Ⱦ -- ���÷���
		tplRender: function(data, tpl){
    		var _self = this,
    			htmlText,
    			creatNode;

    		if(!tpl){
				throw 'Template is undefined!';    
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
				checkEl = S.one('.'+SELECTALLCLS, _self.thead);
			
			if(checkEl) {
				checkEl.attr('checked', checked);
			}
		},
		
		//����row ȫѡ
		_setAllRowsSelected: function (selected) {
			var _self = this;			
			
			S.each(_self.tbody.rows, function(row) { 
				_self._setRowSelected(row, selected);
			});

			if(selected){
				_self.fire('allRowsSelected'); 
			}else{
				_self.fire('unAllRowsSelected');
			}
		},

		// ������ ��� ����� data --- �趨����е� ��Ӧ��rowѡ��״̬
		_setDataSelect: function(data, isSelected){
			var _self = this;

			if(!data || isSelected == undefined){
				console.log('���봫����Ӧ���ݻ�ѡ��״̬');
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
				var checkbox = DOM.get('.'+CLS_CHECKBOX, row),
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
				checkbox = DOM.get('.'+CLS_CHECKBOX, row),
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
				checkbox = DOM.get('.'+CLS_CHECKBOX, row),
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
		}
	
	});

return Grid;

}, {'requires':['xtemplate', 'mui/gridstore', 'mui/pagination', 'TL', 'sizzle']}); // , 'mui/overlay','mui/overlay/overlay.css',}, {'requires':['xtemplate', 'mui/gridstore', 'TL', 'mui/pagination']}); // 'mui/overlay','mui/overlay/overlay.css',
