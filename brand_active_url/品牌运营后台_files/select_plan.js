/* local file:D:\Apache2.2\htdocs\assets/trunk/g/tm/tbs-back/src/brand_active_url/select_plan.js */ /** 
* @fileOverview Ʒ����Ӫ��̨--Ʒ�ƻý��ѡ��
* @extends  KISSY.Base
* @creator  �Ƽ�(ˮľ�껪double)<huangjia2015@gmail.com>
* @depends  ks-core
* @version 1.0  
* @update 2013-08-19
* @example
*   new Select_plan({
	});
*/	
KISSY.add('tm/tbs-back/blue_print/select_plan', function(S, O, Pagination, XTemplate, Validation, Store) {
	var DOM = S.DOM,
		Ajax = IO,
		Event = S.Event,
		S_Date = S.Date;

	// �趨ȫ�� ���� ���� 
	var	SELECTALLCLS = '.j_select_all',				// ȫ��ѡ�� checkbox cls����

		POOLCHECKBOXCLS = '.j_pool_checkobx', 		// ѡ��� table tr checkbox cls����
		CANDCHECKBOXCLS = '.j_candidate_checkobx', 	// ��ѡ table tr checkbox cls����

		TROPRATIONCLS = '.j_add_remove', 			// ���/�Ƴ� btn cls����

		TROPRATIONENABLE = 'enableTr',   			// ���/�Ƴ� btn ������ʾ --- ����
		TROPRATIONDISABLE = 'disableTr';			// ���/�Ƴ� btn ������ʾ --- ��ֹ


	function Select_plan(config){
		var _self = this,
			config = S.merge({
				isMoveData: false,							// �Ƿ� �ƶ� ѡ�������? Ĭ��copy���� false
				isPagination:false,							// �Ƿ��з�ҳ Ĭ�� Ϊfalse
				isAjaxData:false							// �Ƿ����첽���� Ĭ�� Ϊfalse	
			}, config);

		if( !(_self instanceof Select_plan) ){
			return new Select_plan(config);
		}

		Select_plan.superclass.constructor.call(_self, config);		

		_self._init();
	}

	// �̳���KISSY.Base  
	S.extend(Select_plan, S.Base);
	Select_plan.VERSION = 1.0;

	
	// _self.get('poolTableId'), 							// ѡ��� table id���� ������ѡʹ��
	// _self.get('candTableId'), 							// ��ѡ table id����

	// _self.get('addMoreId'), 								// ������� id
	// _self.get('removeMoreId'), 							// �����Ƴ� id

	// ajaxUrl: 'result.php?message=546876489745454',      	// �첽��ѯurl  
	// pagepation: 'result.php?message=�������˷�����Ϣ',	// ��ҳurl 	        	

	// pool_table_tpl: main_table,							// ѡ��� table tbody tr ģ��
	// poolData: mainData, 									// ѡ��� ��̬���� 

	// candidate_table_tpl: select_table,					// �Ѻ�ѡ table tbody tr ģ��
	// candidateData: selectData, 							// �Ѻ�ѡ table ��̬����


	S.augment(Select_plan, {

		// �ؼ� ��ʼ��
		_init: function(){
			var _self = this;


			_self._domRender();
			_self._validaRender();

			_self._initStore();
	        _self._eventRender();
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
				poolTable = _self.get('poolTableId'),
				candTable = _self.get('candTableId');

			/******* ѡ���table �¼���� *******/

			// �� ѡ���table ȫѡ�¼�
			Event.delegate(poolTable, 'click', SELECTALLCLS, function(el){
				var el = el.target,
					isChecked = el.checked || D.attr(el, 'checked');

                _self.poolAllCheckData = self.selectedAllBox(poolTable, POOLCHECKBOXCLS, isChecked);
            });

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

			});
		},




		
		
		


    	// ����Ϊ���÷��� ********** �պ�����Ӧ������ ���ɶҲ�������߳�ʼ������ **********

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

return Select_plan;

}, {'requires':['mui/overlay','mui/overlay/overlay.css', 'gallery/pagination/2.0/index', 'xtemplate', 'Validation', 'store', 'sizzle']});