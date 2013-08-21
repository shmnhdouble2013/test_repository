/** @fileOverview 基于KISSY框架编写的window对话框
* @author <a href="mailto:congjun.zhaocj@alibaba-inc.com">赵丛君 旺旺：仁无痕</a>  
* @version 1.0.1  
*/
KISSY.add(function(S) {

	/** 
		@exports S.LP as KISSY.LP
		@description 所有良无限控件库的命名控件
	*/
	
    var DOM = S.DOM, 
    	Event = S.Event, 
    	win = window, 
    	doc = document;

	/**  
	* 显示Dialog触发该事件
	* @name S.LP.Dialog#onShow  
	* @event  
	* @param {event}  e  事件对象
	* @param {Object} e.dialog 实例对象
	* @param {Object} e.template 模板
	*/
	
	/**  
	* 注销Dialog触发该事件
	* @name S.LP.Dialog#onDestroy  
	* @event  
	* @param {event}  e  事件对象
	* @param {Object} e.dialog 实例对象
	*/
	
	/**  
	* 隐藏Dialog触发该事件
	* @name S.LP.Dialog#onHidden  
	* @event  
	* @param {event}  e  事件对象
	* @param {Object} e.dialog 实例对象
	*/
    function dialog(config) {
        var _self = this;
        if (!(_self instanceof dialog)) {
            return new dialog(config);
        }
        var defaults = {
            width:200,                  // 设置宽
            height:200,                 // 设置高
            minWidth:300,               // 最小宽
            minHeight:200,              // 最小高
            title:'Title',              // 标题
            mask:true,                  // 是否开启遮罩层
			scroll:true,				// 是否有滚动条
            collapsible:false,          // 是否可折叠
            maximizable:false,          // 是否可最大化
            resizable:false,            // 是否可改变大小
            drag:true,                  // 是否可拖拽
            dropZone:doc.body,          // 拖拽区域
            buttonZone:true,            // 是否显示button
            buttonPosition:'center',    // button位置
            template:null,              // 模板
            closeBtn:'ks-close',        // 关闭按钮
            contentType:'custom',       // 模板类型
            contentID:'ks-userTemplate',    // 用户模板ID
            isDestroy:true                  // 是否注销Dialog
            /*buttons:[{
                    text:'提交',
                    eventType:'click',
                    handler:function() {
                        alert('提交');
                    }
                },{
                    text:'关闭',
                    eventType:'click',
                    handler:function() {
                        dialog1.close();
                    }
            }]*/
        };
        config = S.merge(defaults, config);//将多个对象的成员合并到一个新对象上. 参数中, 后面的对象成员会覆盖前面的.
        dialog.superclass.constructor.call(_self, config);
        _self._init();
    }

    S.extend(dialog, S.Base);
    dialog.ATTRS = {
        isMousedown:{value:false},
        userContentTemplate:{value:null},
        mouseX:{value:null},
        mouseY:{value:null},
        elmX:{value:null},
        elmY:{value:null},
        windowID:{value:null},
        ZIndex:{value:9000},
        topZIndex:{value:9100},
        dragZIndex:{value:10000}, 
        hasInitEvent:{value:true}
    };
    S.augment(dialog, 
	/** @lends  S.LP.Dialog.prototype */
	{
        _init:function() {
            var _self = this;
            _self.set('windowID', 'ks-dialog-' + (new Date).getTime() + Math.round(Math.random() * 10000));
            _self._selectTemplateType(_self.get('contentType'));
            _self.set('template', _self._window());
        },
        _initStruct:function() {
        },
        _initEvent:function() {
            var _self = this, 
            	footer, 
            	buttons;

            // 绑定close事件
            S.one('#' + _self.get('windowID') + ' .' + _self.get('closeBtn')).on('click', _self.close, _self);
            // 置顶
            S.one('#' + _self.get('windowID')).on('click', _self._toTop, _self);

            // 绑定拖拽
            if (_self.get('drag')) {
                S.one('#' + _self.get('windowID') + ' .x-panel-header-draggable').on('mousedown', _self._drag, _self);
                S.one(doc).on('mousemove', _self._drag, _self);
            }

            //绑定折叠
            if(_self.get('collapsible')){
                S.one('#' + _self.get('windowID') + ' .x-tool-collapse-top').on('click', _self._collapsible, _self);
            }

            // 绑定button回调事件
            if (_self.get('buttonZone')) {
                footer = DOM.get('#' + _self.get('windowID') + ' .x-toolbar-footer');
                buttons = _self.get('buttons');
                (function() {
                    var i = 0;
                    for (i; i < footer.children.length; i++) {
                        if (buttons[i].handler && buttons[i].eventType) {
                            S.one(footer.children[i]).on(buttons[i].eventType, buttons[i].handler, _self);
                        }
                    }
                })();
            }
        },
        //window定位
        _position:function() {
            var TWidth, 
            	THeight, 
            	docWidth, 
            	docHeight, 
            	crollLeft, 
            	crollTop, 
            	_self = this;
            
				docWidth = DOM.viewportWidth();
				docHeight = DOM.viewportHeight();
				
				TWidth = _self.get('width');
				THeight = _self.get('height');
				
				crollLeft =  DOM.scrollLeft( DOM.get('window') );  //增加滚动条情况
				crollTop = DOM.scrollTop( DOM.get('window') );
            return{
                tc:function() {
                    var cssTop, 
                    	cssLeft;
                    cssLeft = crollLeft +(docWidth - TWidth) / 2; //重新计算左右值
                    cssTop = crollTop + (docHeight - THeight) / 2;
					if(cssLeft<0){								  //检测当top left 为负值时 修正为0；
						cssLeft=0;					
					}else if(cssTop<0){
						cssTop=0;				
					}
                    return{top:cssTop, left:cssLeft};
                }};
        },
        
        //拖拽
        _drag:function(e) {
            var _self = this, 
            	win = S.one('#' + _self.get('windowID'));
            if (e.type === 'mousedown') {
                win.addClass('window-opacity');
                _self.set('mouseX', parseInt(e.clientX));
                _self.set('mouseY', parseInt(e.clientY));
                _self.set('elmX', parseInt(win.css('left')));
                _self.set('elmY', parseInt(win.css('top')));
                _self.set('isMousedown', true);
                doc.getElementById(_self.get('windowID')).style.zIndex = _self.get('dragZIndex');
				S.one(doc).on('mouseup', _self._drag, _self);
            }
            if (e.type === 'mouseup') {
                win.removeClass('window-opacity');
                _self.set('isMousedown', false);
                doc.getElementById(_self.get('windowID')).style.zIndex = _self.get('ZIndex');
				S.one(doc).detach('mouseup');
            }
            if (e.type === 'mousemove' && _self.get('isMousedown') == true) {
                var top, 
                	left;
                top = e.clientY - _self.get('mouseY') + _self.get('elmY');
                left = e.clientX - _self.get('mouseX') + _self.get('elmX');

				e.clientY > 0 ? win.css('top', top + 'px') : win.css('top', '0px');
                
				win.css('left', left + 'px');
            }
        },
        
        //折叠
        _collapsible:function(){
            var _self = this,
                easing = 'easeNone',
                windowDefaultElm = S.get('#'+_self.get('windowID') + ' .window-default'),
                windowElm = S.get('#'+_self.get('windowID')),
                collapseElm = S.get('#'+_self.get('windowID') + ' .J_collapse');
            
            if(!S.Anim.isRunning(windowDefaultElm) && !S.Anim.isRunning(windowElm)){
                if(DOM.hasClass(collapseElm, 'x-tool-collapse-top')){
                    DOM.style(windowDefaultElm, 'overflow', 'hidden');
                    S.Anim(windowDefaultElm,{
                        height:'18px'
                    }, 0.2, easing, function(){
                        DOM.replaceClass(collapseElm, 'x-tool-collapse-top', 'x-tool-collapse-bottom');
                    }).run();
                    S.Anim(windowElm,{
                        height:'28px'
                    }, 0.2, easing, function(){
                        DOM.replaceClass(collapseElm, 'x-tool-collapse-top', 'x-tool-collapse-bottom');
                    }).run();
                }else{
                    DOM.style(windowDefaultElm, 'overflow', '');
                    S.Anim(windowDefaultElm,{
                        height: _self.get('height') - 10
                    }, 0.2, easing, function(){
                        DOM.replaceClass(collapseElm, 'x-tool-collapse-bottom', 'x-tool-collapse-top');
                    }).run();
                    S.Anim(windowElm,{
                        height: _self.get('height')
                    }, 0.2, easing, function(){
                        DOM.replaceClass(collapseElm, 'x-tool-collapse-bottom', 'x-tool-collapse-top');
                    }).run();
                }
            }
        },

        //置顶
        _toTop:function(e) {
            var _self = this, 
            	elmArray;
            elmArray = DOM.query('.ks-window-css-shadow');
            for (var i = 0; i < elmArray.length; i++) {
                elmArray[i].style.zIndex = _self.get('ZIndex');
            }
            e.currentTarget.style.zIndex = _self.get('topZIndex');
        },

        //遮罩层
        _mask:function() {
            var _self = this;
            if (_self.get('mask')) {
                S.LP.mask();
            }
        },
        
        //window模板
        _window:function(data) {
            var _self, 
            	htmlStr, 
            	htmlTemplate, 
            	htmlTemplate1, 
            	htmlTemplate2, 
            	htmlTemplate3, 
            	HTML;
            
            _self = this;
            data = {
                windowID:_self.get('windowID'),
                closeBtn:_self.get('closeBtn'),
                title:_self.get('title'),
                cssShadowWidth:_self.get('width'),
                cssShadowHeight:_self.get('height'),
                windowDefaultWidth:_self.get('width') - 10,
                windowDefaultHeight:_self.get('height') - 10,
                buttonZone:_self.get('buttonZone'),
                //position:_self._position().tc(),
                drag:_self.get('drag'),
				scroll:_self.get('scroll'),
                userContentTemplate:_self.get('userContentTemplate'),
                buttons:_self.get('buttons'),
                buttonPosition:_self.get('buttonPosition'),
                maximizable:_self.get('maximizable'),
                collapsible:_self.get('collapsible'),
                ZIndex:_self.get('ZIndex')
            };
            htmlTemplate1 = '<div class="ks-window-css-shadow" id="{{windowID}}" style="width:{{cssShadowWidth}}px;height:{{cssShadowHeight}}px;position:absolute;z-index:{{ZIndex}};overflow:hidden;">' +
                '<div class="window-default" style="width:{{windowDefaultWidth}}px;height:{{windowDefaultHeight}}px;">' +
                    '<div class="ks-clear {{#if drag}}x-panel-header-draggable{{/if}}">' +
                        '<div class="x-component x-component-default x-window-header-title"> ' +
                            '<span class="x-window-header-text x-window-header-text-default">{{title}}</span> ' +
                        '</div>' +
                        '<div class="x-window-header-tools"> ' +
                        '{{#if collapsible}}' +
                        '<span class="x-tool x-tool-default"><img class="x-tool-collapse-top J_collapse" src="http://img02.taobaocdn.com/tps/i2/T1dOl5XnRwXXXXXXXX-1-1.gif"></span>' +
                        '{{/if}}' +
                        '{{#if maximizable}}' +
                        '<span class="x-tool x-tool-default"><img class="x-tool-maximize" src="http://img02.taobaocdn.com/tps/i2/T1dOl5XnRwXXXXXXXX-1-1.gif"></span>' +
                        '<span class="x-tool x-tool-default" style="display:none"><img class="x-tool-restore" src="http://img02.taobaocdn.com/tps/i2/T1dOl5XnRwXXXXXXXX-1-1.gif"></span>' +
                        '{{/if}}' +
                        '<span class="x-tool x-tool-default {{closeBtn}}"><img class="x-tool-close" src="http://img02.taobaocdn.com/tps/i2/T1dOl5XnRwXXXXXXXX-1-1.gif"> </span>' +
                    '</div>' +
                '</div>' +
                '<div class="x-window-body-default ks-clear" style="height:{{#if buttonZone}}{{cssShadowHeight - 60}}{{#else}}{{cssShadowHeight - 32}}{{/if}}px;width:{{windowDefaultWidth - 2}}px;{{#if scroll}}overflow:auto{{/if}}">';

            htmlTemplate2 = '{{userContentTemplate}}';

            htmlTemplate3 = '</div>' +
                    '{{#if buttonZone}}' +
                    '<div class="x-toolbar-footer" style = "text-align:{{buttonPosition}}">' +
                        '{{#each buttons as buttons}}' +
                        '<span class="x-btn x-btn-default-small">' +
                            '<button autocomplete="off" hidefocus="true" type="button">{{buttons.text}}</button>' +
                                //'<span class="x-btn-inner">{{buttons.text}}</span>' +
                        '</span>' +
                        '{{/each}}' +
                    '</div>' +
                    '{{/if}}' +
                '</div><iframe style="width:{{cssShadowWidth}}px;height:{{cssShadowHeight}}px; border: 0 none;position:absolute;left:0;top:0"></iframe>' +
            '</div>';

            if (typeof data.userContentTemplate === 'string') {
                htmlTemplate = htmlTemplate1 + htmlTemplate2 + htmlTemplate3;
                htmlStr = S.Template(htmlTemplate).render(data);
                return DOM.create(htmlStr);
            } else {
                htmlTemplate = htmlTemplate1 + htmlTemplate3;
                HTML = DOM.create(S.Template(htmlTemplate1 + htmlTemplate3).render(data));
                S.one(HTML).one('.x-window-body-default').append(data.userContentTemplate);
                return HTML;
            }
        },
        
        //选择模板类型
        _selectTemplateType:function(type) {
            var _self = this;
            switch (type) {
                case 'custom':
                    _self.set('userContentTemplate', _self.templataLib.custom.call(this, _self.get('contentID')));
                    break;
                default:
            }
        },
		
		//设置位置
		//修正原先的高度超过一屏时不居中的bug
		_setPosition:function(){
			var _self = this,
				position = _self._position().tc();
			S.one('#' + _self.get('windowID')).css({
				left:position.left,
				top:position.top
			});
		},

		/**
 		 * 显示模板
		 */
        show:function() {
            var _self = this, 
            	script, 
            	i, 
            	windowElm;
            
            if (!DOM.get('#' + _self.get('windowID'))) {
                _self.get('dropZone').appendChild(_self.get('template'));
                if (typeof _self.get('userContentTemplate') === 'string') {
                    windowElm = DOM.get('#' + _self.get('windowID'));
                    script = windowElm.getElementsByTagName('script');
                    for (i = 0; i < script.length; i++) {
                        S.globalEval(script[i].text);
                    }
                }
                if (_self.get('hasInitEvent')) {
                    _self._initEvent();
                    _self.set('hasInitEvent', false);
                }
                _self._mask();
				_self._setPosition();
                _self.fire('onShow', {dialog:_self, template:_self.get('template')});
            } else {
                S.Anim(_self.get('template'), {opacity:'0.5'}, 0.1, 'easeNone',
                    function() {
                        S.Anim(_self.get('template'), {opacity:'1'}, 0.1, 'easeNone').run();
                    }).run();
            }
        },

		/**
 		 * 关闭模板
		 */
        close:function() {
            var _self = this, 
            	userTemplate = doc.getElementById(_self.get('contentID'));
            if (_self.get('isDestroy')) {
				if(_self.get('userContentTemplate')){
					if (typeof _self.get('userContentTemplate') === 'string') {
						userTemplate.value = _self.get('userContentTemplate');
					} else {
						S.one(userTemplate).append(S.one('#' + _self.get('windowID')).one('.x-window-body-default').children());
					}
				}
				_self.fire('onDestroy', {dialog:_self});	
				_self.detach();
				DOM.remove(_self.get('template'));
				_self.set('template', null);
				_self.set('userContentTemplate', null);						
            } else {
				_self.fire('onHidden', {dialog:_self});
                _self.get('template').parentNode.removeChild(_self.get('template'));
            }
			if (_self.get('mask')) {
                S.LP.unmask();
            }
        },

        // 模板库
        templataLib:{
            custom:function(contentID) {
                var _self = this, 
                	htmlStr, 
                	userTemplate = doc.getElementById(contentID);
                
                if (!userTemplate) {
                    throw'Please specify the contentID';
                }
                if (userTemplate.type === 'textarea') {
                    htmlStr = userTemplate.value;
                } else {
                    htmlStr = userTemplate.children;
                }
                _self.on('onClose', function(e) {
                    if (!(userTemplate.type === 'textarea')) {
                    } else {
                        userTemplate.value = htmlStr;
                    }
                });
                return htmlStr;
            }
		}
	});
    S.namespace('LP');
	/**
	 *	对话框控件
	 *	@description 常用于对话框、弹出层等<br><br>
	 *  @example 
//config参数的构成：
{
	width:200,                  	// 设置宽
	height:200,                 	// 设置高
	minWidth:300,               	// 最小宽
	minHeight:200,              	// 最小高
	title:"Title",              	// 标题
	mask:true,                  	// 是否开启遮罩层
	scroll:true,			// 是否有滚动条
	collapsible:false,          	// 是否可折叠
	maximizable:false,          	// 是否可最大化
	resizable:false,            	// 是否可改变大小
	drag:true,                  	// 是否可拖拽
	dropZone:doc.body,          	// 拖拽区域
	buttonZone:true,            	// 是否显示button
	buttonPosition:"center",    	// button位置
	template:null,              	// 模板
	contentType:"custom",		// 模板类型
	contentID:"ks-userTemplate",    // 用户模板ID
	isDestroy:true                  // 是否注销Dialog
	buttons:[{			// 配置提交或关闭按钮等				 
		text:'提交',
		eventType:'click',
		handler:function() {
			alert('提交');
		}
	},{
		text:'关闭',
		eventType:'click',
		handler:function() {
			dialog1.close();
		}
	}]
}
	 *  @example 
//实例
KISSY.use('1.0/dialog',function(S){	
	var config1 = {			
			width: 500,
			height: 500,
			title: '标题',
			mask:true,
			scroll:true,
			drag:true,
			buttonZone:true,
			contentType:'custom',
			contentID:'ks-userTemplate',
			buttons:[{
				text:'提交',
				eventType:'click',
				handler:function(){
					alert('提交');
				}
			},{
				text:'关闭',
				eventType:'click',
				handler:function(){
					dialog1.close();
				}
			}]
		};
					
	S.one('#btn').on('click',function(){	
		var dialog1 = new S.LP.Dialog(config1);	
		dialog1.show();
	});
})		
	 *	@class 对话框控件类
	 *	@param {Object} config 配置项
	 */
    S.LP.Dialog = dialog;
}, {requires:['core', 'uibase', 'template', './uicommon', './css/dialog.css', './css/uicommon.css']});

