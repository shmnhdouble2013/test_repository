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
KISSY.add('mui/selectGrid', function(S, Pagination, XTemplate, Validation, Grid) { // O, 
	var DOM = S.DOM,
		Ajax = S.IO,
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

	        // _self._eventRender();
		},

		// DOM��ʼ��
		_domRender: function(){
			var _self = this;

			// ȫ�ֱ���
			_self._tb_token_ = DOM.val('#J_csrf_token') || '';

			// ��ѯ��ť
			_self._findData = _self.get('findBtn') || S.get('#J_finedData');

			// tr���ݱ�ʾ Ĭ��Ϊ id
			_self.trIndex = _self.get('trIndex') || 'id'; 

			// �洢ȫ�ֱ� ������֤��
			_self.form = S.get('#J_hideform');

			// ѡ���grid����
			_self.poolGrid = new Grid( _self.get('poolGridConfig') );
			
			// ��ѡ grid����
			// _self.candGrid = new Grid( _self.get('candGridConfig') );

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
				poolTable = _self.get('candTableId'),
				candTable = _self.get('candTableId');

			/******* ѡ���table �¼���� *******/			

            // �� ѡ���table ����¼�
			Event.delegate(poolTable, 'click', TROPRATIONCLS, function(el){
                self._radioBoxClick(el);
            });

            // ����������¼�
			Event.on(_self.get('addMoreId'), 'click', function(){
				// ����id��ȡ����
				_self.poolStore.getCount()

				// ���غ�ѡtable����
				_self.candStore.setResult();
			});

			
			/******* ��ѡtable �¼���� *******/

            // �� ��ѡtable ȫѡ�¼�
			Event.delegate(candTable, 'click', SELECTALLCLS, function(el){
                var el = el.target,
					isChecked = el.checked || D.attr(el, 'checked');

                _self.candAllCheckData = self.selectedAllBox(candTable, CANDCHECKBOXCLS, isChecked);
            });

			// �� ��ѡtable �Ƴ��¼�
			Event.delegate(candTable, 'click', TROPRATIONCLS, function(el){
                self._radioBoxClick(el);
            });

            // �������Ƴ��¼�
			Event.on(_self.get('removeMoreId'), 'click', function(){

			});

			// 
			Event.add(S.query('.J_hideShowBp'), 'click', function(el){
				_self._hideShowPb(el);
			});


			// ��ѯ����
			Event.on('#J_finedData', 'click', function(){
				//
			});
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

}, {'requires':['gallery/pagination/2.0/index', 'xtemplate', 'Validation', 'mui/grid', 'sizzle']}); // 'mui/overlay','mui/overlay/overlay.css', 