/**
*	使用ifame异步提交表单，此种方式可以上传文件
*   create by dxq 2011-9-15
*/

KISSY.add(function(S){
	var DOM = S.DOM,
		Event = S.Event;

	var FRAME_PREFIX = 'i_frame';
	//构造函数
	function asyncForm(config){
		var _self = this;
        if (!(_self instanceof asyncForm)) {
            return new asyncForm(config);
        }
		
		config = config || {};
		if(!config.formId || !S.one('#'+config.formId)){
			throw 'please assign the id of form!';
		}
			

		asyncForm.superclass.constructor.call(_self, config);
		_self._init();
	}

	S.extend(asyncForm,S.Base);

	S.augment(asyncForm,{
		//是否初始化
		_isInitLoad : false,

		//初始化，生成隐藏的iframe，并将form的target指向此iframe
		_init:function(){
			var _self = this,
				formId = _self.get('formId'),
				frameId = FRAME_PREFIX + S.guid(),
				formEl = S.one('#'+formId),
				temp = ['<iframe id="',frameId,'" name="',frameId,'" frameborder="0" src="" style="display:none"></iframe>'].join(''),
				frameEl = S.Node(temp).appendTo(document.body);

			formEl.attr('target',frameId);
			_self.set('formEl',formEl);
			_self.set('frameEl',frameEl);
			_self._initEvent();
			//_self._initLoadEvent();
		},
		//初始化事件
		_initEvent:function(){
			var _self = this,
				formId = _self.get('formId');
			S.one('#'+formId).on('submit',function(){
				if(!_self._isInitLoad){
					_self._isInitLoad = true;
					_self._initLoadEvent();
				}
			});
		},
		//初始化Iframe加载事件
		_initLoadEvent : function(){
			var _self = this,
				frameEl = _self.get('frameEl'),
				callback = _self.get('callback');
			function frameEvent(evnet){
				var frame = frameEl[0];
				var doc = frame.contentWindow.document,
					body = doc.body||doc.documentElement;
				if(callback){
					callback(body.innerHTML);
				}
			}
			frameEl.on('load',frameEvent);
			_self.set('frameEvent',frameEvent);
		},
		//释放资源
		_destroy : function(){
			var _self = this,
				frameEl = _self.get('frameEl'),
				frameEvent = _self.get('frameEvent');
			Event.remove(frameEl[0],'load',frameEvent);
			frameEl.remove();

			_self.set('formEl',null);
			_self.set('frameEl',null);
			_self.set('frameEvent',null);
		}
	});

	S.namespace('LP');
	S.LP.AsyncForm = asyncForm;
	return asyncForm;

},{requires:['core']});