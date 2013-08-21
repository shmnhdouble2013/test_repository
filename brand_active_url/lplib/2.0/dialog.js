/**
 * @fileOverview 窗口对话框
 * @author <a href="mailto:ximing.huxm@alibaba-inc.com">胡锡铭 旺旺：huximing1688</a>
 * @version 1.0
 */
KISSY.add(function(S, O, DD, R) {
	/**
	 * @exports S.LP as KISSY.LP
	 */
	var Node = S.Node,
		DOM = S.DOM,
		Event = S.Event,
		UA = S.UA;

	/**
	 * @name S.LP.Dialog#center
	 * @description 使dialog居中
	 * @function
	 */

	/**
	 * @name S.LP.Dialog#destroy
	 * @description 销毁悬浮层，继承的方法
	 * @function
	 */

	/**
	 * @name S.LP.Dialog#hide
	 * @description 隐藏悬浮层，继承的方法
	 * @function
	 */

	/**
	 * @name S.LP.Dialog#show
	 * @description 显示悬浮层，继承的方法
	 * @function
	 */

	/**
	 * @name S.LP.Dialog#beforeDestroy
	 * @description 销毁悬浮层前触发
	 * @event
	 * @param {event} e 事件对象
	 */

	/**
	 * @name S.LP.Dialog#destroy
	 * @description 销毁悬浮层触发destroy事件，继承的事件
	 * @event
	 * @param {event} e 事件对象
	 */

	/**
	 * @name S.LP.Dialog#hide
	 * @description 隐藏悬浮层触发hide事件，继承的事件
	 * @event
	 * @param {event} e 事件对象
	 */

	/**
	 * @name S.LP.Dialog#show
	 * @description 显示悬浮层触发show事件，继承的事件
	 * @event
	 * @param {event} e 事件对象
	 */

	/**
	* @memberOf S.LP
	* @class Dialog 窗口对话框
	* @constructor
	* @extends Overlay.Dialog
	* @param {Object} config 配置项
	* @param {String} config.contentId 用户模板的id
	* @param {String} [config.title] dialog标题
	* @param {String} [config.width] dialog宽度. 整数表示单元为 px.
	* @param {String} [config.height] dialog高度. 整数表示单元为 px.
	* @param {Boolean|String} [config.constrain] 
		取值选择器字符串时, 则在限制拖动范围为根据该选择器字符串取到的第一个节点所在区域.<br/>
		取值 true 时, 只能在当前视窗范围内拖动.<br/>
		取值 false 时, 可任意移动.
	* @param {Boolean} [config.mask] 浮层显示时是否使用遮罩层盖住页面其他元素,默认是true
	* @param {String} [config.elCls] 添加到悬浮层根元素的样式,默认是“lp-overlay”.
	* @param {Number} [config.zIndex] 默认为 9999, 设置悬浮层的 z-index 值.
	* @param {Boolean} [config.closable]  对话框右上角是否包括关闭按钮.
	* @param {String} [config.closeAction] 点击关闭按钮的动作。默认 “hide” 隐藏，也可设置 “destroy” 销毁该组件.
	* @example
* //config参数的构成：
	{
	  width:400,                  	// 设置宽,默认400px
	  height:400,              	// 设置高 ,默认400px
	  title:'标题',              	// 标题,默认“标题”
	  mask:true,                  	// 是否开启遮罩层，默认true
	  draggable:true,               // 是否可拖拽,默认true
	  constrain:true,          	// 拖拽区域，取值 true 时,只能在当前视窗范围内拖动,默认true
	  contentId:'lp-userTemplate',  // 用户模板id,必须用户配置
	  elCls:'lp-overlay',		//添加到悬浮层根元素的样式,默认是“lp-overlay”
	  zIndex:1050,			//设置悬浮层的 z-index 值，默认为 1050
	  closable:true, 		//对话框右上角是否包括关闭按钮，默认true
	  closeAction:'hide', 		//默认 “hide” 隐藏，也可设置 “destroy” 销毁该组件
	  success : function(){ alert('提交');}, //当使用默认buttons时，提供成功的回调
  	  //Dialog默认提供确定和取消按钮，自定义按钮可以覆盖此属性，同时无需提供success属性
	  buttons:[{
	    text:'确定',
	    eventType:'click',		//默认为click
	    toggleCls:'btn-cancel', //该按钮如果存在值为 'btn-cancel' 的 class, 则移除掉, 反之添加.
	    handler:function() {

	    }
	  },{
	    text:'取消',
	    eventType:'click',		//默认为click
	    toggleCls:'btn-cancel', //该按钮如果存在值为 'btn-cancel' 的 class, 则移除掉, 反之添加.
	    handler:function() {
	      this.hide();		//this 表示dialog
	    }
	  }]
	}
	* @example
*KISSY.use('2.0/dialog', function(S) {
	var dailog = new S.LP.Dialog({
		//初始化宽度
		width: 300,
		//初始化高度
		height: 200,
		//标题
		title: '标题',
		//设置模板id
		contentId: 'lp-userTemplate',
		//当使用默认buttons时，提供成功的回调
		success:function(){
		    alert('提交');
		}
	});
});
	*/
	function Dialog(config) {
		var _self = this,
			defaults = {
				buttons: [{
					text: '确 认',
					handler: config.success
				}, {
					text: '取 消',
					handler: function() {
						if (config.closeAction === 'destroy') {
							_self.destroy();
						} else {
							_self.hide();
						}
					}
				}],
				//限制拖拽区域
				constrain: true,
				//拖拽
				draggable: true,
				prefixCls:'lp-',
				height: 400,
				//遮罩
				mask: true,
				//折叠
				collapse: false,
				title: '标题',
				width: 400,
				zIndex: 1050
			},
			config = S.merge(defaults, config, {
				//强制禁用部分功能
				resize: false,
				destroy: false
			});
		//删除禁用不掉的属性，过滤掉用户的配置
		//delete config['prefixCls'];
		if (!(_self instanceof Dialog)) {
			return new Dialog(config);
		}
		Dialog.superclass.constructor.call(_self, config);
	}

	S.extend(Dialog, O.Dialog, {
		//生命周期 Begin
		renderUI: function() {
			var _self = this;
			//重新设置关闭按钮
			_self._setCloseIcon();
		},
		bindUI: function() {
			var _self = this;
			_self._initIconEvent();
			_self._initDestroyEvent();
		},
		_uiSetHeader: function() {
			var _self = this,
				title = _self.get('title');
			if (title) {
				var header = '<div class="header-title">' + title + '</div>'
				_self.get('header').append(header);
			}
		},
		_uiSetBody: function() {
			var _self = this,
				temp = _self._getTemp();
			_self.set('bodyContent', temp);
		},
		_uiSetFooter: function() {
			var _self = this,
				footer = _self.get('footer'),
				buttons = _self.get('buttons'),
				prefixCls = _self.get('prefixCls');
			if (buttons) {
				footer.html('');
				S.each(buttons, function(item, index) {
					var button = new Node('<button class="button button-primary ' + prefixCls + 'stdmod-button">' + item.text + '</button>');
					if (item.toggleCls) {
						button.toggleClass(item.toggleCls);
					}
					if (index === 0) {
						button.addClass(prefixCls + 'stdmod-button-first');
					}
					button.appendTo(footer);
					var eventType = item.eventType ? item.eventType : 'click';
					if (eventType && item.handler) {
						Event.on(button, eventType, item.handler, _self);
					}
				});
			}
		},
		_uiSetCollapse: function(collapse) {
			if (!collapse) {
				return;
			}
			var _self = this,
				el = _self.get('el'),
				prefixCls = _self.get('prefixCls'),
				collapseNode = new Node('<a tabindex="1" href="javascript:void(0)" class="' + prefixCls + 'ext-collapse" hidefocus="true"><span class="x-icon x-icon-normal ' + prefixCls + 'ext-collapse-icon">▲</span></a>');
			el.append(collapseNode);
			_self.set('culcollapse', 'fold');
		},
		syncUI: function() {
			var _self = this;
			_self._autoSetBodySize();
		},
		//覆写show方法
		show: function() {
			var _self = this;
			_self.render();
			//使居中
			_self.center();
			Dialog.superclass.show.call(_self);
		},
		//覆写destroy方法
		destroy: function() {
			var _self = this;
			_self.fire('beforeDestroy');
			Dialog.superclass.destroy.call(_self);
		}
		//生命周期 End
	});

	S.augment(Dialog, {
		/**
		 * @lends S.LP.Dialog.prototype
		 */
		//自动设置body的大小
		_autoSetBodySize: function() {
			var _self = this,
				header = _self.get('header'),
				body = _self.get('body'),
				footer = _self.get('footer'),
				el = _self.get('el'),
				prefixCls = _self.get('prefixCls'),
				//横向
				//外层装饰器margin总和
				contentBoxMarginX = el.one('.' + prefixCls + 'contentbox').outerWidth(true) - el.one('.' + prefixCls + 'contentbox').outerWidth(),
				//body的padding总和
				bodyPaddingX = body.innerWidth() - body.width(),
				//body的边框总和
				bodyBorderX = body.outerWidth() - body.innerWidth(),
				//body的margin总和
				bodyMarginX = body.outerWidth(true) - body.outerWidth(),
				width = el.width() - contentBoxMarginX - bodyBorderX - bodyMarginX - bodyPaddingX,
				//纵向
				//外层装饰器margin总和
				contentBoxMarginY = el.one('.' + prefixCls + 'contentbox').outerHeight(true) - el.one('.' + prefixCls + 'contentbox').outerHeight(),
				//body的padding总和
				bodyPaddingY = body.innerHeight() - body.height(),
				//body的边框总和
				bodyBorderY = body.outerHeight() - body.innerHeight(),
				//body的margin总和
				bodyMarginY = body.outerHeight(true) - body.outerHeight(),
				height = el.height() - contentBoxMarginY - header.height() - footer.height() - bodyBorderY - bodyPaddingY;
			body.css({
				width: width,
				height: height
			});
		},
		//获取将要加载到dialog中的模板
		_getTemp: function() {
			var _self = this,
				pattern = /^#/;
			if (!_self.get('contentId')) {
				return;
			}
			var contentId = pattern.test(_self.get('contentId')) ? _self.get('contentId') : '#' + _self.get('contentId'),
				tempWrap = S.one(contentId);
			if (!tempWrap) {
				throw new Error('未找到"id"为"' + _self.get('contentId') + '"的容器');
			}
			temp = tempWrap.children(); //不用html()的原因是防止事件丢失
			_self.set('tempWrap', tempWrap);
			_self.set('temp', temp);
			return temp;
		},
		//重设关闭按钮的显示
		_setCloseIcon: function() {
			var _self = this,
				prefixCls = _self.get('prefixCls');
			if (!_self.get('closable')) {
				return;
			}
			var el = _self.get('el'),
				closeIcon = el.one('.' + prefixCls + 'ext-close-x');
			closeIcon.addClass('x-icon x-icon-normal');
			closeIcon.html('×');
		},
		/**
		 * 设置Dialog的内容
		 * @param {String|KISSY.Node} temp 对话框的体 html 或体节点.
		 */
		setBodyContent: function(temp) {
			var _self = this;
			_self.set('bodyContent', temp);
		},
		_initIconEvent: function() {
			var _self = this,
				el = _self.get('el'),
				prefixCls = _self.get('prefixCls');
			//icon hover
			Event.delegate('.' + prefixCls + 'dialog', 'mouseenter mouseleave', '.x-icon', function(event) {
				var target = S.one(event.target);
				target.toggleClass('x-icon-hover');
			});
			//折叠
			Event.delegate('.' + prefixCls + 'dialog', 'click', '.' + prefixCls + 'ext-collapse', function(event) {
				var target = S.one(event.target);
				if (_self.get('culcollapse') === 'fold') {
					el.css({
						height: '22px',
						overflow: 'hidden'
					});
					_self.set('culcollapse', 'unfold');
					target.html('▼');
				} else {
					el.css({
						height: 'auto',
						overflow: ''
					});
					_self.set('culcollapse', 'fold');
					target.html('▲');
				}
			});
			/*if (UA.ie === 6) {
				return;
			}
			//获得焦点移动时变透明,IE6除外
			Event.on('.lp-stdmod-header', 'mousedown', drag);
			
			function drag(event) {
				if (event.type === 'mousedown') {
					el.addClass('lp-dialog-active');
					Event.on(document, 'mouseup', drag);
				}
				if (event.type === 'mouseup') {
					el.removeClass('lp-dialog-active');
				}
			}*/
		},
		_initDestroyEvent: function() {
			var _self = this;
			_self.on('beforeDestroy', function() {
				var tempWrap = _self.get('tempWrap'),
					temp = _self.get('temp');
				tempWrap.append(temp);
			});
		}
	});
	S.namespace('LP');
	S.LP.Dialog = Dialog;
}, {
	requires: ['overlay', 'dd', 'resizable', './css/controls.css']
});