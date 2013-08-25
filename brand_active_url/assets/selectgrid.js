/* @fileOverview Ʒ����Ӫ��̨--Ʒ�ƻý��ѡ��
* @extends  KISSY.Base
* @creator  �Ƽ�(ˮľ�껪double)<huangjia2015@gmail.com>
* @depends  ks-core
* @version 1.0  
* @update 2013-08-19
* @example
*   new SelectGrid({
	});
*/	
KISSY.add('mui/selectGrid', function(S, Grid, Validation, TL) { // O, 
	var DOM = S.DOM,
		Ajax = S.IO,
		JSON = S.JSON,
		Event = S.Event,
		S_Date = S.Date;

	// �趨ȫ�� ���� ���� 
	var	TROPRATIONCLS = '.j_add_remove', 			// ���/�Ƴ� btn cls����
		TROPRATIONENABLE = 'enableTr',   			// ���/�Ƴ� btn ������ʾ --- ����
		TROPRATIONDISABLE = 'disableTr';			// ���/�Ƴ� btn ������ʾ --- ��ֹ
		
	// _self.get('addMoreId'), 								// ������� id
	// _self.get('removeMoreId'), 							// �����Ƴ� id	

	
	function SelectGrid(config){ 
		var _self = this,
			config = S.merge({
				isMoveData: false							// �Ƿ� �ƶ� ѡ�������? Ĭ��copy���� false				
			}, config);

		if( !(_self instanceof SelectGrid) ){
			return new SelectGrid(config);
		}

		SelectGrid.superclass.constructor.call(_self, config);		

		_self._init();
	}
	
	// �̳���KISSY.Base  
	S.extend(SelectGrid, S.Base);
	SelectGrid.VERSION = 1.0;

	S.augment(SelectGrid, {

		// �ؼ� ��ʼ��
		_init: function(){
			var _self = this;

			_self._domRender();
			_self._validaRender();

	        _self._eventRender();
		},

		// DOM��ʼ��
		_domRender: function(){
			var _self = this;

			// ȫ�ֱ���
			_self._tb_token_ = DOM.val('#J_csrf_token') || '';
			
			// Ĭ�ϱ�
			_self.formEl = S.get(_self.get('formId')) || S.get('#J_hideform'),

			// ��ѯ��ť -- �����û����ã�������Ĭ��id
			_self.searchBtn = 

			// tr���ݱ�ʾ Ĭ��Ϊ id
			_self.trIndex = _self.get('trIndex') || 'id'; 

			// �洢ȫ�ֱ� ������֤��
			_self.form = S.get('#J_hideform');

			// ѡ���grid����
			_self.poolGrid = new Grid( S.merge(_self.get('poolGridConfig'), {'formEl': _self.formEl}) );
			_self.poolStore = _self.poolGrid.store;
			
			// ��ѡ grid����
			_self.candGrid = new Grid( S.merge(_self.get('candGridConfig'), {'formEl': _self.formEl}) );
			_self.candStore = _self.candGrid.store;
		},

		// У��ʵ����
		_validaRender: function(){
			var _self = this;

			if(_self.form){
				_self.ValiForm = new Validation(_self.form, {
			        style: 'tbsUiValid_text' 				 // ��ֻ��ʾ У���ı� style������  tbsUiValid_text
			    });

			    _self.textValidInput = _self.ValiForm.get('J_inptuEle');
			}
		},

		// �¼���ʼ��
		_eventRender: function(){
			var _self = this,
				addMoreBtn = _self.get('addMoreBtnId') || '#J_addMore',
				removeMorBtn = _self.get('removeMorBtnId') || '#J_removeMore',
				searchBtn = _self.get('searchBtnId') || S.get('#J_search_btn');

			/******* ѡ���table �¼���� *******/	
			
			/* �����ѯ */
			Event.on(searchBtn, 'click', function(){
				_self.searchPageEvent();
			});	
			
			// ����ҳ���л�
			_self.poolGrid.pagination.on('switch', function(e) {
				var curPage = e.toPage;
				
				DOM.val('#J_currentPage', curPage);
				
				_self.searchPageEvent();
				
				// { 	start: 0, 
					// currentPage: 1, 
					// limit: 10, 
					// totalPage:10 
				// }
			});
			
			
			// ȫѡ �������
			Event.on(addMoreBtn, 'click', function(){
				var data = _self.poolGrid.getSelection();
				
				if(data.length<1){
					alert('��ǰѡ��Ϊ�գ�');					
				}else{									
					_self.candStore.add(data, true); 		// ������� �� ȥ��
					_self.poolGrid.clearSelection(); // ȡ����� ѡ��״̬
				}				
			});
			
			// ���� ѡ���table ����¼�
			_self.poolGrid.on('cellClick', function(event){				
				_self._poolGridClick(event);						
			});
			
			
			
			/******* ��ѡtable �¼���� *******/
			
			// ȫѡ �����Ƴ�
			Event.on(removeMorBtn, 'click', function(){
				var data = _self.candGrid.getSelection();
				
				if(data.length<1){
					alert('��ǰѡ��Ϊ�գ�');
					
				}else{									
					_self.candStore.remove(data); // ������� �� ȥ��
					_self.candGrid.clearSelection(); // ȡ����� ѡ��״̬
				}				
			});	

			// ���� ѡ���table ����¼�
			_self.candGrid.on('cellClick', function(event){				
				_self._candGridClick(event);						
			});
			
			// ��������
			Event.on('#J_saveSelectData', 'click', function(){
				var selectData = _self.candStore.getResult(),
					selectLength = _self.candStore.getCount(),
					stringiFy = JSON.stringify(selectData);
				
				if(selectLength<1){
					alert('��ǰѡ��Ϊ�գ�');
				}else{									
					DOM.val('#J_selectTableData', stringiFy);
				}
			});
		},
	
		// ѡ��� grid ����
		_poolGridClick: function(event){
			var _self = this,
				data = event.data,
				row = event.row,
				target = event.domTarget;	

			// ��Ӱ�ť	
			if( DOM.hasClass(target, TROPRATIONCLS) ){
				_self.candStore.add(data, true); 	 // ������� �� ȥ�� 
				_self.poolGrid._setRowSelected(row, false);				 // ȡ����� ѡ��״̬
			}			
		},
		
		// ��ѡ�� grid ����
		_candGridClick: function(event){
			var _self = this,
				data = event.data,
				row = event.row,
				target = event.domTarget;
			
			// ��Ӱ�ť	
			if( DOM.hasClass(target, TROPRATIONCLS) ){
				_self.candStore.remove(data); 					// ������� �� ȥ��
				
				
				_self.candGrid._setRowSelected(row, false); 	// ȡ����� ѡ��״̬
			}			
		},
	
		// �����ѯ ���� ��ҳ �첽���ݷ���
		searchPageEvent: function(pageObj){
			var _self = this,
				data = TL.encodeURIParam( TL.serializeToObject(_self.formEl) ),
				endData = S.isObject(pageObj) ? S.merge(data, pageObj) : data;
				
			_self.poolStore.load(endData);
		},

    	// ����Ϊ���÷��� ********** �պ�����Ӧ������ ���ɶҲ�������߳�ʼ������ **********
    	_empotyFn: function(){
    		var _self = this;
    	},

    	// ��ʾ����
		_alertFn: function(msg, callback){
			var _self = this;

			(new O.Alert(msg, callback)).show();            
		},		

		// ajax ��Ϣ��ʾ ���� �ص�����
		_onlyAjaxMsg: function(data){
			var _self = this;

			if(data.success){
				_self._alertFn( data.message || '�����ɹ���' );				
			}else{
				_self._alertFn( data.message || '����ʧ�ܣ�' );
			}			
		},

		/* ���õ�ajax���� 
		* �����Ҫ���� dataType�� ��Ҫ���� ������{'url':, 'data':, 'dataType': } 
		* errorCallBack, okCallBack  errorfn �ֱ�Ϊʧ�� �ɹ����� �쳣�ص�����
		*/
		_ajaxAllConfig: function(configObj, okCallBack, errorCallBack, errorfn){ 
			var _self = this,
				ajaxConfig = {
					type:'post',
					charset : 'charset',
					dataType:'json',
					success: function(data){
						if(data.success){	
							if(okCallBack){
								S.isFunction(okCallBack) && okCallBack.call(_self, data);
							}else{
								if(_self.form){
									_self.form.submit();
								}else{
									_self._alertFn( data.message || '�����ɹ���' );
									//console.log('�ɹ�ִ����');
								}  
							};		
						}else{
							if(errorCallBack){
								S.isFunction(errorCallBack) && errorCallBack.call(_self, data);
								//console.log('ʧ��ִ����');
							}else{
								_self._alertFn( data.message || '����ʧ�ܣ�' );
							};			
						}
					},
					error: function(){ 						
						S.isFunction(errorfn) && errorfn.call(_self);
						_self._alertFn('�����쳣��');
						//console.log('����ִ����');
					}
			},
			endAjaxConfig = S.merge( ajaxConfig, configObj);

			Ajax(endAjaxConfig);
		}
	});

return SelectGrid;

}, {'requires':['mui/grid', 'Validation', 'TL', 'sizzle']}); // 'mui/overlay','mui/overlay/overlay.css', 