/**
 * author:zengyue.yezy
 * Date:2012-3-19
 * version:1.1
 */
KISSY.add('message/base', function (S, DD, O) {
	var	Node = S.Node,
		UA = S.UA;

	/** 
	*@exports S.LP as KISSY.LP
	*/

	/**
     * @name S.LP.Message
	 * @class message的基类
	 * @constructor
     * @requires dd
     * @requires overlay
	 * @description 消息框类，包含show、Alert、Confirm，继承自KISSY Dialog，可以使用dialog的配置项
     */
	function Base(config) {
		var self = this;
		Base.superclass.constructor.call(self, config);
	}
	
	var CLS_PREFIX = 'message-',
        CLS_ICON = 'x-icon',
        CLS_ICON_HOVER = 'x-icon-hover',
        TEMP_ICONS = {
            info : {css:'x-icon-info',inner:'i'},
            error : {css:'x-icon-error',inner:'!'},
            success : {css:'x-icon-success',inner:'<i class="icon-ok icon-white"></i>'},
            question : {css:'x-icon-info',inner:'?'},
            warning: {css:'x-icon-warning',inner:'!'},
            right : {css:'x-icon-success',inner:'<i class="icon-ok icon-white"></i>'} //以前版本的兼容
        };

	Base.ATTRS = /** @lends S.LP.Message.prototype*/ {
		/**
         * 显示标题
         * @type string
         */
		title: {},
		hasClose: {
			value: true
		},
		/**
         * 消息类型
         * @type string
         * @description 默认值为info,可选值为 info,error,right,question,warning,对应不同的icon
         */
		icon: {
			value: 'info'
		},
		/**
         * 消息内容
         * @type string || Node
         */
		message: {},
		/**
         * 按钮
         * @type array
         */
		button: {},
		/**
         * 显示的宽度
         * @type num || object
         * @description 可以直接设置，也可设个范围值 如 {min:270,max:440};
         */
		width: {
			value: {
				min: 270,
				max: 440
			}
			
		}
	};

	S.extend(Base, O.Dialog, {
		initializer: function () {

		},
		renderUI: function () {

			var prefixCls = this.get('prefixCls'),
				el = this.get('el');
			S.one(el).replaceClass(prefixCls + 'dialog', prefixCls + 'message');

			this.get('body').addClass('ks-clear').append('<div class="' + CLS_ICON + '"></div><div class="' + prefixCls + CLS_PREFIX + 'content"></div>');
		},
        bindUI : function(){
            var self = this,
                header = self.get('header'),
                closeEl = header.one('.'+CLS_ICON);
            closeEl.on('click',function(){
                self.hide();
            }).on('mouseenter',function(){
                closeEl.addClass(CLS_ICON_HOVER);
            }).on('mouseleave',function(){
                closeEl.removeClass(CLS_ICON_HOVER);
            });
        },
		_uiSetHasClose: function(hasClose){
			var self = this,
                header = self.get('header'),
				hasClose = self.get('hasClose'),
                closeEl = header.one('.'+CLS_ICON);
			if(hasClose){
				closeEl.show();
			}
			else{
				closeEl.hide();
			}
		},
		_uiSetTitle: function (title) {

			if (title) {
				this.get('header').one('.lp-message-title').html(title);
			}
		},
		_uiSetIcon: function (icon) {

			var prefixCls = this.get('prefixCls'),
				messageIcon = this.get('body').one('.' + CLS_ICON),
                iconInfo = TEMP_ICONS[icon] || TEMP_ICONS['info'];
			messageIcon[0].className = CLS_ICON;//清除class 还原为初始值
			messageIcon.addClass(iconInfo.css);
            messageIcon.html(iconInfo.inner);
		},
		_uiSetMessage: function (message) {

			var DATA_TYPE = 'data-type',
				prefixCls = this.get('prefixCls'),
				content = this.get('body').one('.' + prefixCls + CLS_PREFIX + 'content');
			
			if (content.attr(DATA_TYPE)) {
				Node.one('body').append(content.children());
			}
			
			if (S.isString(message)) {
				content.removeAttr(DATA_TYPE);
				content.html(message);
			}
			else {
				content.html('').append(message);
				content.attr(DATA_TYPE, 'node');
			}

			//ie6需要设置宽度
			if(UA.ie < 7){
				this._setWidth(this.get('width')); //设置message的宽度
			}
		},
		_uiSetButton: function (buttons) {

			var self = this,
				button = null,
				prefixCls = this.get('prefixCls'),
				footer = this.get('footer');
			if (buttons && buttons.length > 0) {
				footer.html('');
				S.each(buttons, function (item, index) {
					button = new Node('<button class="button button-primary">' + item.text + '</button>').appendTo(footer);
					if (index === 0) {
						button.addClass('mb-first');
					}
					button.on('click', function (ev) {
						self.hide();
						if (item.fn) {
							item.fn(ev);
						}
					});
				});
			}
		},
		_setWidth: function (width) {

			var el = this.get('el'),
				prefixCls = this.get('prefixCls'),
				correct = -131,
				content = el.one('.' + prefixCls + CLS_PREFIX + 'content');
			if ('number' === typeof width) {
				width += correct;
			}
			else {
				width = this._getAutoWidth(width, correct);
			}
			
			
			content.width(width);
			el.width(width - correct);
			
		},
		
		/**
		* 获取自适应的宽度
		* @function
		* @param {String}
		* @return {Number} 宽度的值
		*/
		_getAutoWidth: function (width, correct) {

			var el = this.get('el'),
				prefixCls = this.get('prefixCls'),
				content = el.one('.' + prefixCls + CLS_PREFIX + 'content'),
				contentWidth,
				min = width.min + correct,
				max = width.max + correct;
			content.width('auto');
			el.width('auto');
			contentWidth = content.width();
			contentWidth = contentWidth < min ? min : (contentWidth > max ? max : contentWidth);
			
			return contentWidth;
		},
		_reset: function (config) {


			//将原来的配置项icons 换为icon
			if (!config['icon'] && config['icons']) {
				config['icon'] = config['icons'] ;
			}

			for (var i in config) {
				this.set(i, config[i]);
			}
		}

	});
	
	return Base;

}, {
    requires: ['dd', 'overlay']
});
KISSY.add(function (S, Base) {

	var defaultConfig = {
			prefixCls: 'lp-',
			mask: true,
            headerContent:'<h2 class="lp-message-title"></h2><span class="x-icon  x-icon-small x-icon-normal">×</span>',
			draggable: true,
			align: {
				points: ['cc', 'cc']
			},
			elStyle: {
				position: 'absolute'
			},
			hasClose: true,
			title: '',
			button: [{text: '确定'}],
            closable: false
		},
		base = new Base(defaultConfig);
	
	function show(config) {
		var param = S.merge(defaultConfig, config);
		base.hide();
		base._reset(param);
		base.center();
		base.show();
		return base;
	}
	
	
	var Message = /** @lends S.LP.Message */ {
			/**
			* 显示一个消息框
			* @function
			* @param {Object}
			* @return 当前Message对象的实例
			* @description 同show,建议直接调用show
			*/
			Base: show,
			/**
			 * 创建一个message框，但不会自动调用show函数，需要手动调用
			 * @function
			 * @param {Object} 消息框的配置项
			 * @return 当前Message对象的实例
			 * @description 可进行更多的自定义设置
			 * @example
			 * var info = Message.create({
			 *				mask:true,				//这个是继承的配置项
			 *				title:'这是一个提示',
			 *				message:'这里是内容',
			 *				icon:'warning',
			 *				width:270,
			 *				button:[{
			 *						text:'yes',
			 *						fn:function(){
			 *							alert('click yes');
			 *						}
			 *					},{
			 *						text:'cancel',
			 *						fn:function(){
			 *							alert('click cancel');
			 *						}
			 *					}]
			 *			});
			 * info.show(); 
			 */
			create: function (config) {
				var param = S.merge(defaultConfig, config);
				base._reset(param);
				return base;
			},
			/**
			* 显示一个消息框
			* @function
			* @param {Object} 消息框的配置项
			* @return 当前Message对象的实例
			* @description 可进行更多的自定义设置，参数同create
			* @example
			* Message.show({
			*	mask:true,				//这个是继承的配置项
			*	title:'这是一个提示',
			*	message:'这里是内容',
			*	icon:'warning',
			*	width:270,
			*	button:[{
			*				text:'yes',
			*				fn:function(){
			*					alert('click yes');
			*				}
			*			},{
			*				text:'cancel',
			*				fn:function(){
			*					alert('click cancel');
			*				}
			*			}]
			*	});
			*	
			*/
			show: show,
			/**
			* 消息框
			* @function
			* @param {String} icon类型
			* @param {String || Node} message 确认框的消息内容
			* @param {Function} callback 回调函数
			* @return 当前Message对象的实例
			* @description 提示可选类型 info,error,right,question,warning
			*/
			Alert: function () {
				var param = this._buildParam(arguments);
				return this.show(param);
			},
			/**
			* 确认框
			* @function
			* @param {String} icon类型
			* @param {String || Node} message 确认框的消息内容
			* @param {Function} callback 回调函数
			* @return 当前Message对象的实例
			* @description 提示可选类型 info,error,right,question,warning
			*/
			Confirm: function () {
				var param = this._buildParam(arguments);
				var button = param['button'];
				button.push({text: '取消'});
				return this.show(param);
			},
			_buildParam: function (arg) {
				var len = arg.length,
					param = {};
				switch (len) {
				case 1:
					param['message'] = arg[0];
					break;
				case 2:
					if (S.isFunction(arg[1])) {
						param['message'] = arg[0];
						param['button'] = [{text: '确定', fn: arg[1]}];
					}
					else if ('info,error,success,right,question,warning'.indexOf(arg[0]) !== -1) {
						param['icon'] = arg[0];
						param['message'] = arg[1];
					}
					else {
						param['message'] = arg[0];
						param['title'] = arg[1];
					}
					break;
				case 3:
					if ('info,error,right,question,warning'.indexOf(arg[0]) !== -1) {
						param['icon'] = arg[0];
						param['message'] = arg[1];
					}
					else {
						param['message'] = arg[0];
						param['title'] = arg[1];
					}
					param['button'] = [{text: '确定', fn: arg[2]}];
					break;
				default:
					param['icon'] = arg[0];
					param['message'] = arg[1];
					param['title'] = arg[2];
					param['button'] = [{text: '确定', fn: arg[3]}];
					break;
				}
				return S.merge(defaultConfig, param);
			}
		};

	S.namespace('LP.Message');
	S.LP.Message = Message;

	return Message;
}, {
    requires: ['message/base','./uicommon']
});

