/** 
* @fileOverview 描述投放媒体位置
* @extends  KISSY.Base
* @creator  黄甲(水木年华double)<huangjia2015@gmail.com>
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
		// 控件 初始化
		_init: function(){
			var _self = this;
			
			placeholder.textHolder( S.query('.j_search-input') );
			
			_self._validaRender();	
			_self._eventRender();			
		},

		// 校验实例化
		_validaRender: function(){
			var _self = this;

			_self.form = S.get('#J_tablForm');
			
			if(_self.form){
				// 校验实例 
				_self.validform = new Validation(_self.form, {
					style:'tbsUiValid_under'
				});	
			}			
		},

		// 事件初始化
		_eventRender: function(){
			var _self = this;

			// 确定创建晒图活动
			Event.on('#J_next', 'click', function(){
				_self._sureCreatActiv();
			});
		},

    	// 描述投放下一步
    	_sureCreatActiv: function(){
    		var _self = this;

    		// _self.set('returnMsg', '很抱歉，晒图活动创建失败！');

			if(_self.validform.isValid()){
				S.all(".valid-text").hide();
				
				_self.form.submit();
				
				/* // 写入edter编辑器 数据
				 _self.editor.sync();
				// DOM.val('#activestr', _self.editor.get("data") );

				// 获取表单数据
				var formDate = S.TL.serializeToObject(_self.form);

				// encodeURI 参数
				formDate = S.TL.encodeURIParam(formDate);
				
				var ajaxConfig = {
                    'url': _self.get('ajaxSubUrl') || '',
                    'data':  formDate || ''
	            };         
				_self._ajaxAllConfig(ajaxConfig , _self._onlyAjaxMsg);		 */	
				
				
			}
    	},

        // 提示方法
		_alertFn: function(msg, callback){
			var _self = this;

			var d = new O.Alert(msg, callback);            
            d.show();
		},		

		// ajax 信息提示 作用 回调函数
		_onlyAjaxMsg: function(data){
			var _self = this;

			if(data.success){
				_self.form.submit();					
			}else{
				_self._alertFn( data.message || _self.get('returnMsg') || '操作失败！' );
				_self.set('returnMsg', '')
			}
		},

		// 公用的ajax方法 如果需要配置 dataType则 需要开发 配置项{'url':, 'data':, 'dataType': } --- fn 里再 根据 返回数据 调用 相应不同 回调函数
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
						_self._alertFn('请求异常！');
					}
				},

				endAjaxConfig = S.merge( ajaxConfig, configObj);

			Ajax(endAjaxConfig);
		}

	});

return Descriptiont;

}, {'requires':['Validation', 'mui/overlay','mui/overlay/overlay.css', 'mui/placeholder']}); // , 'TL'