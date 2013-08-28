/** 
* @fileOverview ����Ͷ��ý��λ��
* @extends  KISSY.Base
* @creator  �Ƽ�(ˮľ�껪double)<huangjia2015@gmail.com>
* @depends  ks-core
* @version 1.0  
* @update 2013-08-23
* @example
*   new Descriptiont({
	});
*/	
KISSY.add('tm/tbs-back/active-rul/descriptiont', function(S, Validation, O, placeholder) {
	var DOM = S.DOM,
		Ajax = S.io,
		Event = S.Event,
		S_Date = S.Date;

	function Descriptiont(config){
		var _self = this;

		if( !(_self instanceof Descriptiont) ){
			return new Descriptiont(config);
		}

		Descriptiont.superclass.constructor.call(_self, config);

		_self._init();
	}

	S.extend(Descriptiont, S.Base);
	S.augment(Descriptiont, { 
		// �ؼ� ��ʼ��
		_init: function(){
			var _self = this;
			
			placeholder.textHolder( S.query('.j_search-input') );
			
			_self._validaRender();	
			_self._eventRender();			
		},

		// У��ʵ����
		_validaRender: function(){
			var _self = this;

			_self.form = S.get('#J_tablForm');
			
			if(_self.form){
				// У��ʵ�� 
				_self.validform = new Validation(_self.form, {
					style:'tbsUiValid_under'
				});	
			}			
		},

		// �¼���ʼ��
		_eventRender: function(){
			var _self = this;

			// ȷ������ɹͼ�
			Event.on('#J_next', 'click', function(){
				_self._sureCreatActiv();
			});
		},

    	// ����Ͷ����һ��
    	_sureCreatActiv: function(){
    		var _self = this;

    		// _self.set('returnMsg', '�ܱ�Ǹ��ɹͼ�����ʧ�ܣ�');

			if(_self.validform.isValid()){
				S.all(".valid-text").hide();
				
				_self.form.submit();
				
				/* // д��edter�༭�� ����
				 _self.editor.sync();
				// DOM.val('#activestr', _self.editor.get("data") );

				// ��ȡ������
				var formDate = S.TL.serializeToObject(_self.form);

				// encodeURI ����
				formDate = S.TL.encodeURIParam(formDate);
				
				var ajaxConfig = {
                    'url': _self.get('ajaxSubUrl') || '',
                    'data':  formDate || ''
	            };         
				_self._ajaxAllConfig(ajaxConfig , _self._onlyAjaxMsg);		 */	
				
				
			}
    	},

        // ��ʾ����
		_alertFn: function(msg, callback){
			var _self = this;

			var d = new O.Alert(msg, callback);            
            d.show();
		},		

		// ajax ��Ϣ��ʾ ���� �ص�����
		_onlyAjaxMsg: function(data){
			var _self = this;

			if(data.success){
				_self.form.submit();					
			}else{
				_self._alertFn( data.message || _self.get('returnMsg') || '����ʧ�ܣ�' );
				_self.set('returnMsg', '')
			}
		},

		// ���õ�ajax���� �����Ҫ���� dataType�� ��Ҫ���� ������{'url':, 'data':, 'dataType': } --- fn ���� ���� �������� ���� ��Ӧ��ͬ �ص�����
		_ajaxAllConfig: function(configObj, fn){ 
			var _self = this,
				ajaxConfig = {
					type:'post',
					// contentType:false,
					charset : 'gbk',
					dataType:'json',
					success: function(data){
						if( S.isFunction(fn) ){
							fn.call(_self, data);
						}
					},
					error: function(){ 
						_self._alertFn('�����쳣��');
					}
				},

				endAjaxConfig = S.merge( ajaxConfig, configObj);

			Ajax(endAjaxConfig);
		}

	});

return Descriptiont;

}, {'requires':['Validation', 'mui/overlay','mui/overlay/overlay.css', 'mui/placeholder']}); // , 'TL'