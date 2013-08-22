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

KISSY.add('mui/grid', function(S, O, XTemplate, Store) {
	var DOM = S.DOM,
		Ajax = S.IO,
		Event = S.Event,
		S_Date = S.Date;

	// �趨ȫ�� ���� ���� 
	var	DATA_ELEMENT = 'row-element',				// row Ԫ��index
		SELECTALLCLS = '.j_select_all',				// ȫ��ѡ�� checkbox cls����

		POOLCHECKBOXCLS = '.j_pool_checkobx', 		// ѡ��� table tr checkbox cls����
		CANDCHECKBOXCLS = '.j_candidate_checkobx', 	// ��ѡ table tr checkbox cls����

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

			_self.tbody = S.get(_self.get('tableId')).tbody;

			_self._initStore();
	        //_self._eventRender();
		},
		
		// �¼���ʼ��
		_eventRender: function(){
			var _self = this;

		},

		// ��ʼ��gird
		_initGrid: function(){
			var _self = this;	
			
			// �� ѡ���table ȫѡ�¼�
			Event.delegate(self.get('tableId'), 'click', SELECTALLCLS, function(el){
				var el = el.target,
					isChecked = el.checked || D.attr(el, 'checked');

                _self.poolAllCheckData = self.selectedAllBox(self.get('tableId'), POOLCHECKBOXCLS, isChecked);
            });

		},
		
		// ��ʼ��Store
		_initStore: function(){
			var _self = this;

			// ����첽 ���첽�������ݣ�������� ��̬���� --Store
			if(_self.get('isAjaxData') && _self.get('ajaxUrl')){
				_self.store = new Store({
					url : _self.get('ajaxUrl')
				});
			}else{
				_self.store = new Store();
				_self.store.setResult( _self.get('girdData') );
			}	

			// ׼����������ǰ --- ��� ��Ļ���� delay
			_self.store.on('beforeload', function(){
				var loadMask = _self.get('loadMask');
				if (loadMask) {
					loadMask.show();
				}
			});

			_self.store.on('load', function(){
				alert(1);
				debugger;
			});

			// ���ݼ�����ɺ� - ȡ�� ��Ļ���� delay
			_self.store.on('load', function(){
				alert(1);
				debugger;

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

}, {'requires':['mui/overlay','mui/overlay/overlay.css', 'xtemplate', 'mui/gridstore', 'sizzle']});