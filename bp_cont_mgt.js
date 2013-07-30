/** 
* @fileOverview Ʒ����Ӫ��̨--ɹͼ���ݹ���
* @extends  KISSY.Base
* @creator  �Ƽ�(ˮľ�껪double)<huangjia2015@gmail.com>
* @depends  ks-core
* @version 1.0  
* @update 2013-07-22
* @example
*   new BpContMgt({
	});
*/	
KISSY.add('tm/tbs-back/blue_print/BpContMgt', function(S, Tbsui, O, LightBox, TL, IO) {
	var DOM = S.DOM,
		Ajax = IO,
		Event = S.Event,
		S_Date = S.Date;

	function BpContMgt(config){
		var _self = this;

		if( !(_self instanceof BpContMgt) ){
			return new BpContMgt(config);
		}

		BpContMgt.superclass.constructor.call(_self, config);

		_self._init();
	}

	S.extend(BpContMgt, S.Base);
	S.augment(BpContMgt, { 
		// �ؼ� ��ʼ��
		_init: function(){
			var _self = this;
			
			_self.form = S.get('#J_hideform');

			// ui�� ģ���
			_self.Otbsui = new Tbsui({
	            selector:['checkbox']
	        });

	        // ������ʼ�� �����ͼ	       
        	new LightBox({
	            container: '.ui-table', 	//��������ID
	          	eles: ".J_lightbox", 		//��Ҫ������ͼƬ�ⲿ������ʽ
	            layer: "#lightbox",			//������ID
	          	prev: "#lightbox .prevbtn", //��һ�Ű�ť
	          	next: "#lightbox .nextbtn"  //��һ�Ű�ť
	        });

	        _self._eventRender();
		},

		// У��ʵ����
		_validaRender: function(){
			var _self = this;

		},

		// �¼���ʼ��
		_eventRender: function(){
			var _self = this;

			// ȫ�ֱ���
			_self._tb_token_ = DOM.val('#J_csrf_token') || '';
			_self.selectInpt = S.query('.j_select'); 						// tr checkbox ��ѡ�� nodelist 
			_self.select_all_Inpt = S.query('input[name="select-num"]'); 	// ȫѡ��ť + ÿ��tr ���� ��ѡ�� checkbox

			_self.allDownloadTagA = S.get('#J_allSelect'), 					// ȫ��������ť			
			_self.selectDownloadTagA = S.get('#J_selectDown'), 				// ��ѡ������ť

			_self.allSelectDownBeforeCls = DOM.attr(_self.allDownloadTagA, 'class'); //ȫ������ ����class 
			_self.selectDownBeforeCls = DOM.attr(_self.selectDownloadTagA, 'class'); //��ѡ���� ����class


			// ��ѡ����
			Event.on(_self.selectDownloadTagA, 'click', function(el){
				_self._selectDownBefore(el);
			});

			// ȫ������
			Event.on(_self.allDownloadTagA, 'click', function(el){
				_self._allSelectDownBefore(el);
			});

			// ɹͼ� �ö�
			Event.on(S.query('.J_topSetBp'), 'click', function(el){
				_self._topSetBefore(el);
			});

			// ����/��ʾ ɹͼ
			Event.add(S.query('.J_hideShowBp'), 'click', function(el){
				_self._hideShowPb(el);
			});

			// �������д�� �����ֶκ����򷽷�
		    Event.add('th a', 'click', function(ev){
		        _self._sortfn(ev);
		        _self.form.submit();	
		    });

			// checkox ��ѡ
			_self.Otbsui.on('checkboxClick', function(el){
				// ȫ��ѡ��
				_self._allSelected(el);				
			});			
		},



		// ********** ��ѡ����ǰ�ó�ʼ�� ********  
		_selectDownBefore: function(){
			var _self = this,
				isLoading = DOM.attr(_self.selectDownloadTagA, 'data-loading'),
				selectAry = _self._addTrId();

			if(!isLoading){

				// ��ѡ��Ϊ������ʾ��ѡ
				if(selectAry.length <= 0){
					_self._alertFn('��ǰѡ��Ϊ�գ���ѡ��ѡ���ٵ�����');
				}else{
					// ���� ���� ���� btn
					_self._disabledDownloadBtn();

					// ��ѡ
					_self._selectDown(selectAry);
				}
			}
		},
		// ��ѡ��������
		_selectDown: function(selectAry){
			var _self = this;
		
			// �첽���� ����
			var ajaxConfig = {
                'url': _self.get('selectDown_url') || '',
                'data': {
					'curTrId': selectAry.join(','),
					'oprationType':'selectDown',
					'_tb_token_':_self._tb_token_
				}
            };           
			_self._ajaxAllConfig(ajaxConfig, _self._cancelSelect, _self._selectFailFn, _self._selectFailFn);	
		},
		// ��ѡ�ɹ��� ȡ��ѡ�� + ���btn
		_cancelSelect: function(){
			var _self = this;
 			
 			_self._enabledDownloadBtn();

			_self.Otbsui.radioBox_Checked_Set('select-num', false);
		},
		// ��ѡ����ʧ�ܻص�
		_selectFailFn: function(data){
			var _self = this;

			_self._enabledDownloadBtn();
			//_self._alertFn( data.message || '����ʧ�ܣ�' );
		},
		// ���trid ����
		_addTrId: function(){
			var _self = this,
				selectedAry = [];			

			S.each(_self.selectInpt, function(el){
				var hasSelect = DOM.hasClass(el, 'j_select'),
					trID = DOM.attr(el, 'data-no');

				if(!hasSelect){
					return;
				}	

				if(el.checked){
					selectedAry.push(trID);
				}
			});	

			// DOM.val('#J_tr-idstr', selectedAry.join(',') );
			return selectedAry;
		},



		// ********** ȫ������ǰ�ó�ʼ�� ******** 
		_allSelectDownBefore: function(){
			var _self = this,	
				isLoading = DOM.attr(_self.allDownloadTagA, 'data-loading');

			if(!isLoading){

				// ���� ���� ���� btn
				_self._disabledDownloadBtn();

				// ȫ������
				_self._dlayTimeDo('interValFineDowload', function(){ 
	            	_self._allSelect();
	       		}, true, 1000);	
			}
		},
		// ȫ������ 
		_allSelect: function(){
			var _self = this;

			// �첽���� ����
			var ajaxConfig = {
	                'url': _self.get('selectAllDown_url') || '',
	                'data': {
						'curTrId': 'all',
						'oprationType':'allDownload',
						'_tb_token_':_self._tb_token_
					}
            };   		
           _self._ajaxAllConfig(ajaxConfig, _self._pollOkCall, _self._erorReqst, _self._pollOkCall);            
		},		
		// ��ѯ������� callback -- ȡ����ѯ �� loading״̬
		_pollOkCall: function(){
			var _self = this;

			_self._cancelTimeout('interValFineDowload', true);
			_self._enabledDownloadBtn();
		},
		// ��ѯ ������������ʾ
		_erorReqst: function(data){
			var _self = this;

			if(!data.success){
				if(data.error){
					_self._pollOkCall();				
				}else{
					_self._empotyFn();
				}		
			}					
		},


		// ********** ��ѡ �� ȫ������ ���ô��� -- ���� ������ť **********
		_disabledDownloadBtn: function(){
			var _self = this;

			// ��ѡbtn
			_self._preventRepeatClick(_self.selectDownloadTagA, true);

			// ȫѡbtn
			_self._preventRepeatClick(_self.allDownloadTagA, true);
		},
		// ��ѡ �� ȫ������ ���ô��� -- �����ԭ ������ť
		_enabledDownloadBtn: function(){
			var _self = this;

			// ��ѡbtn
			_self._preventRepeatClick(_self.selectDownloadTagA, false, _self.selectDownBeforeCls);

			// ȫѡbtn
			_self._preventRepeatClick(_self.allDownloadTagA, false, _self.allSelectDownBeforeCls);
		},


		// ȫѡ����
		_allSelected: function(el){
			var _self = this,
				inputPro = el.inputTarget,			
				hasAllSelect = DOM.attr(inputPro, 'id') == 'j_select_all' ? true : false,
				checkedStr;

			if(hasAllSelect){

				if(el.isChecked){
					// checkedStr = 'checked';					
				}else{
					// checkedStr = '';
				}					

				// S.each(_self.selectInpt, function(elm){
				// 	elm.checked = checkedStr;
				// });

				_self.Otbsui.radioBox_Checked_Set(inputPro, el.isChecked);
			}

			// _self.Otbsui.radioBox_UiRender(_self.selectInpt);
		},

		// ���� ��ʾ ɹͼ�
		_hideShowPb: function(el){
			var _self = this,
				trID = DOM.attr(el.target, 'data-no');

			_self.hideShowEl = el;

			// �첽����
			var ajaxConfig = {
                'url': _self.get('showhide_url') || '',
                'data': {
					'curTrId': trID,
					'oprationType':'showHidePb',
					'_tb_token_':_self._tb_token_
				}
            };   

			_self._ajaxAllConfig(ajaxConfig , _self._hideShowOk);	
		},
		// ��ʾ����ɹͼok
		_hideShowOk: function(){
			var _self = this,
				btnTarget = _self.hideShowEl.target,
				tggleValue = DOM.text(btnTarget) == '����ɹͼ' ? '��ʾɹͼ' : '����ɹͼ',
				curTr = S.one(btnTarget).parent('td').parent('tr');

			// �ı�������ɫ	
			DOM.toggleClass(curTr, 'gray-color');

			// ��������			
			DOM.text(btnTarget, tggleValue);
		},


		// ********** �ö� ǰ�ó�ʼ�� ********  
		_topSetBefore: function(el){
			var _self = this,
			    targetSelectA = el.target,
				classStr = DOM.attr(targetSelectA, 'class'),
				isLoading = DOM.attr(targetSelectA, 'data-first');
			
			_self.topSetBeforeA = targetSelectA;

			if(!isLoading){
				_self._topSet(el);
			}			
		},
    	// �ö�����
    	_topSet: function(el){
    		var _self = this,
    			trID = DOM.attr(el.target, 'data-no');

    		// �첽����
			var ajaxConfig = {
                'url': _self.get('topset_url') || '',
                'data': {
					'curTrId': trID,
					'oprationType':'topsite',
					'_tb_token_':_self._tb_token_
				}
            };   

			_self._ajaxAllConfig(ajaxConfig, _self._seTopOk, null, _self._empotyFn);		
    	},
    	// �ö��ɹ��� ����btn
		_seTopOk: function(){
			var _self = this;

			DOM.text(_self.topSetBeforeA, '���ö�ɹͼ');
			DOM.attr(_self.topSetBeforeA, 'data-first', 'no');
			DOM.attr(_self.topSetBeforeA, 'class', 'ui-btn-l ui-btn-disable');
		},

		
		// ��� �����ֶ� �� ����ʽ ��������
		_sortfn: function(ev){
		    var _self = this,
	            ascStr = '',
	            trget = ev.target,
	            eli = DOM.first(trget, 'i'), 
	            sortStr = DOM.attr(trget, 'data-value');

	        if( DOM.hasClass(eli, 'dsc') ){
	            ascStr = 'asc';
	        }else if( DOM.hasClass(eli, 'asc') ){
	            ascStr = 'dsc';
	        }else{
	            sortStr = '';
	        }     

	        DOM.val('#J_sortStr', sortStr); // �����ֶ�
	        DOM.val('#J_dsc', ascStr); 		// ����ʽ direction -- asc dsc
		},		


    	// ����Ϊ���÷��� ********** �պ�����Ӧ������ ���ɶҲ�������߳�ʼ������ **********
    	_empotyFn: function(){
    		var _self = this;
    	},

    	// loading״̬ �� tag��ʾ + tag��ʽ��ǩ
		_preventRepeatClick: function(elem, isLoading, disableCls){
			var _self = this,
				disableCls = disableCls || 'ui-btn-l ui-btn-disable';

			if(isLoading){				
				DOM.attr(elem, 'data-loading', 'Loading');
				DOM.show('#J_loading');
			}else{
				DOM.attr(elem, 'data-loading', '');
				DOM.hide('#J_loading');
			}
			DOM.attr(elem, 'class', disableCls);
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
				// _self.form.submit();	
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
		},

		// ���� ajax���� ״̬ only one 
		ajaxState: function(startfn, endfn, errorfn){
			var _self = this;
			 // var	errorfn = errorfn || endfn;

			// start ״̬
			Ajax.on("send", function(){
			    S.isFunction(startfn) && startfn.call(_self);
			});
			// end ״̬
			Ajax.on("complete", function(){
			    S.isFunction(endfn) && endfn.call(_self);
			});
			// error ״̬
			Ajax.on("error", function(){
			    S.isFunction(errorfn) && errorfn.call(_self);
			});
		},

		// ���÷��� ------ �ӳٴ�����
        _dlayTimeDo: function(cancelName, callback, isIntervalfn, time){
           var _self = this,
                time = time || 300;
               
           	if(time<1){
                return;
           	}
           
           	if(isIntervalfn){                    
                _self.set(cancelName, setInterval(callback, time) );
           	}else{
                _self.set(cancelName, setTimeout(callback, time) );
           	}          
        },
          
      	// ȡ���ӳ�ִ�� 
     	_cancelTimeout: function(cancelTimeText, isIntervalfn){
           var _self = this,
	            cancelTimeobj = _self.get(cancelTimeText);
	                
            if(!cancelTimeobj){
                return;
            }
           
            if(isIntervalfn){
                clearInterval(cancelTimeobj);
            }else{
                clearTimeout(cancelTimeobj);
	   		}               
      	}

	});

return BpContMgt;

}, {'requires':['tbsui', 'mui/overlay','mui/overlay/overlay.css', 'gallery/lightBox/1.0/index','gallery/lightBox/1.0/index.css', 'TL', 'ajax', 'sizzle']});