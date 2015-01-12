
/*
 * 简单的轮播组件 banner轮播、tab切换、textarea懒加载优化
 * author: huangjia
 * Date: 20140806
 * Update: 20140812 增加响应式体验 功能
 * Update: 20150112 1、单击控制面板 停留时间优化 --- 清除计时, 当控制点离开时候再 重新按照既定时间计算 继续轮播； 2、支持轮播前后 回调函数; 3、hover暂停|启动触发事件延迟性能优化
 **/

(function($){

    // 常量
    var DATAINDEX = 'data-tab-index',       // 控制面板 序号
        DEFHIDECONG = {                     // 隐藏元素默认css
            "width" : 0,
            "height" : 0,
            "overflow":"hidden",
            "border" : "none",
            "display" : "none"
        },
        DEFAULTSTYLE = {                    // 默认样式
            "overflow" : "hidden",
            "position": "relative"
        };

    function jSlider (container, config){
            var _self = this;

            $.extend(_self, {
                "autoSlide": false,
                "effect": "hSlide",
                "eventType" : "click",
                "hoverStop" :true,                 //鼠标经过内容是否停止播放
                "contentClass" :"slide-content",
                "pannelClass" : "tab-pannel",
                "navClass" :"tab_list",
                "triggerSelector" : "li",
                "selectedClass" : "selected",
                "viewTime" : 3000,                  // 可视停留时间 单位ms
                "speed" :300,                       // 切换 动画 速度，单位ms
                "lazyloadCls" : "ks_data-lazyload",
                "defaultIndex" : 0,                  // 默认展现第几帧
                "autoResponsiveLayout": true,        // 是否自动响应 窗口变化
                "initStyleCallback" : null,           // 初始化render callback方法
                "slideBefore": null,                  // 轮播切换 前 回调方法
                "slideAfter": null                   // 轮播切换后回调方法
            }, config);

            _self.slidContainr = $('#'+container);

            if(!_self.slidContainr){
                console.log('请指定轮播容器Id！');
                return;
            }

            // 轮播面板pannel 容器
            _self.pannelContainer = $('.'+_self.contentClass, _self.slidContainr);

            // 面板pannel
            _self.aPnnels = $('.'+_self.pannelClass, _self.pannelContainer);
            _self.pannelLength = _self.aPnnels.length;

            // 懒加载textarea元素
            _self.pannelTextareas = $('.'+_self.lazyloadCls, _self.aPnnels);

            // 控制 轮播面板 tab-list 容器
            _self.navListContent = $('.'+_self.navClass, _self.slidContainr);
            _self.tabListDom = $(_self.triggerSelector, _self.navListContent);

            // 组件初始化
            _self.init();
        }


    jSlider.prototype = {
            construcotr: jSlider,

            /**
             * 组件初始化
             */
            init : function(){
                var _self = this;

                // 获取当前页面宽高
                _self.getContentPannelWh();

                // 样式初始化
                _self.styleInit();

                // 初始化控制面板 序号
                _self.addTabIndex();

                // 事件初始化
                _self.eventInit();

                // 是否 启动自动轮播
                _self.isAutoRun(_self.autoSlide);

                // 默认展现面板
                _self.setPannelIndex(_self.defaultIndex);
            },

            /**
             * 清除style 样式
             */
            clearStyle: function(){
                var _self = this;

                _self.pannelContainer.attr('style', '');
                _self.scrollBox && _self.scrollBox.attr('style', '');
                _self.aPnnels.attr('style', '');
            },

            /**
             * 重新设置轮播宽高
             */
            resetSlierWidthHeight: function(){
                var _self = this;

                // 获取当前页面宽度 下容器 宽度
                _self.clearStyle();

                // 样式初始化
                setTimeout(function(){
                    _self.getContentPannelWh();
                    _self.styleInit();
                }, 150);
            },

            /**
             * 获取容器、轮播面板元素 宽高
             */
            getContentPannelWh: function(){
                var _self = this;

                // 容器宽高
                _self.pannelContWidth = _self.pannelContainer.width();
                _self.pannelContheigth = _self.pannelContainer.height();

                // 面板宽高
                _self.pannelWidth = _self.aPnnels.width();
                _self.pannelHeight = _self.aPnnels.height();

//            _self.pannelOuterWidth = _self.aPnnels.outerWidth(true);
//            _self.pannelOuterHeight = _self.aPnnels.outerHeight(true);

            },

            /**
             * 事件初始化
             */
            eventInit: function(){
                var _self = this;

                // 单击tab-list 切换轮播 -- 暂停自动轮播 -- 设定view时间后 继续下个轮播
                _self.tabListDom.on(_self.eventType, function(ev){
                    var targetEl = $(ev.target).parent(_self.triggerSelector),
                        indexNum = targetEl.attr(DATAINDEX);

                    _self.isAutoRun(false);
                    _self.slideChange(indexNum);
                });

                // 单击指定某帧后 停止自动轮播， mouseout 鼠标离开后 开启自动轮播
                _self.autoSlide && _self.tabListDom.on('mouseout', function(ev){
                    _self.isAutoRun(true);
                });

                // 鼠标 hover 暂停轮播 效果 -- 自动轮播有效
                if( _self.autoSlide && _self.hoverStop ){
                    _self.pannelContainer.delegate(_self.aPnnels, 'mouseover mouseout', function(ev){
                        var evtType = ev.type;

                        if(evtType === 'mouseover'){
                            _self.isAutoRun(false);
                        }else{
                            _self.isAutoRun(true);
                        }
                    });
                }

                // slider 自动响应式 方法
                if( _self.autoResponsiveLayout){
                    var setTimeObj;

                    $(window).resize(function(ev) {
                        ev.stopPropagation();

                        if(_self.isResetSlierWidthHeight){
                            return;
                        }

                        setTimeObj && clearTimeout(setTimeObj);

                        _self.isResetSlierWidthHeight = true;

                        setTimeObj = setTimeout(function(){
                            _self.resetSlierWidthHeight();
                            _self.slideChange(0);

                            setTimeout(function(){
                                _self.isResetSlierWidthHeight = false;
                            }, 200);

                        }, 300);
                    });
                }
            },

            /**
             * 添加控制tab-list面板 序号
             */
            addTabIndex : function(){
                var _self = this,
                    i = 0,
                    length = _self.tabListDom.length;

                for(i; i<length; i++){
                    $(_self.tabListDom[i]).attr(DATAINDEX, i);
                }
            },

            /**
             * 自动轮播控制
             * @param boolean isrun 是否轮播
             */
            isAutoRun : function(isrun, index){
                var _self = this;

                setTimeout(function(){
                    if(isrun){
                        if(!_self.setInterval_obj){
                            _self.setInterval_obj = setInterval(function(){
                                _self.slideChange(index);
                            }, _self.viewTime );
                        }
                    }else{
                        clearInterval(_self.setInterval_obj);
                        _self.setInterval_obj = null;
                    }
                }, 200);
            },

            /**
             * 具体轮播方法
             * @param Number  index pannel 面板序号
             * @param function callback  回调方法
             */
            slideChange : function(index, callback){
                var _self = this,
                    index = parseInt(index, 10),
                    index = (index >= 0) ? index : null;

                if(_self.pannelWidth && !isNaN(_self.pannelWidth) ){

                    // 自动计算
                    var nexPanLeft = _self.moveBoxLeft + _self.pannelWidth,
                        endPanLeft = _self.scrollWidth - _self.pannelWidth;

                    // 如果是最后一帧 特殊处理
                    if( nexPanLeft > endPanLeft ){
                        _self.moveBoxLeft = 0;
                    }else{
                        _self.moveBoxLeft += _self.pannelWidth;
                    }

                    // 指定某帧
                    if( typeof index == 'number' ){
                        _self.moveBoxLeft = index * _self.pannelWidth;
                    }
                }

                _self.renderDataLazyLoad( _self.aPnnels[_self.getPannelIndex()] );
                _self.tabListChange(index);


                var leftNo = _self.moveBoxLeft <= 0 ? 0 : -_self.moveBoxLeft;


                // 当前模板 jquery Node
                var curPannel = _self.tabListDom[index || _self.getPannelIndex() ];

                // 轮播切换 前 回调方法
                $.isFunction( _self.slideBefore ) && _self.slideBefore.call(_self, curPannel);

                _self.scrollBox.animate({
                    left: leftNo
                }, _self.speed, function() {
                    // 轮播切换后回调方法
                    $.isFunction(callback) && callback.call(_self, curPannel);
                    $.isFunction( _self.slideAfter ) && _self.slideAfter.call(_self, curPannel);
                });
            },

            /**
             * 渲染 textarea 懒加载资源
             * @param htmlElement el 懒加载容器
             */
            renderDataLazyLoad: function(el){
                var _self = this;

                if(!el){
                    return;
                }

                var textareas_cls = $('.'+_self.lazyloadCls, el);

                if(textareas_cls.length > 0){
                    _self.loadAreaData(textareas_cls);
                }
            },

            /**
             * 从 textarea 中加载数据
             * @param  htmlElement textarea
             */
            loadAreaData: function (textarea) {
                var _self = this,
                    content = $(textarea).parent(),
                    htmlEle = $(textarea).text() || '';

                $(textarea).remove();

                // textarea 父级元素添加 包装元素div
                content.append( $(htmlEle) );
            },

            /**
             * 自动滚动时候 tab 样式 改变
             * @param Number index 序号
             */
            tabListChange : function(index){
                var _self = this,
                    tabListIndex;

                if(index){
                    tabListIndex = index;
                }else{
                    tabListIndex = _self.getPannelIndex();
                }
                _self.setTabCls(_self.tabListDom[tabListIndex]);
            },

            /**
             * 获取当前 轮播模板 元素序号
             * @returns {number}
             */
            getPannelIndex: function(){
                var _self = this,
                    tabListIndex = _self.moveBoxLeft / _self.pannelWidth;

                return tabListIndex <= 0 ? 0 : tabListIndex;
            },


            /**
             * 改变tab-list 控制样式
             * @param el   当前控制目标 dom
             */
            setTabCls : function(el){
                var _self = this;

                _self.tabListDom.removeClass(_self.selectedClass);
                $(el).addClass(_self.selectedClass);
            },


            /**
             * 轮播 面板 样式初始化
             */
            styleInit : function(){
                var _self = this;

                // 每次样式初始化 执行操作
                if(_self.initStyleCallback && $.isFunction(_self.initStyleCallback)){
                    _self.initStyleCallback.call(_self);
                }

                // 隐藏textarea显示
                _self.pannelTextareas.css(DEFHIDECONG);

                // 水平滑动 -- 面板容器 宽高
                var effect = $.trim(_self.effect);

                if( effect == 'hSlide' ){
                    _self.aPnnels.css({ "float" : "left"});
                    _self.scrollWidth = _self.pannelLength * _self.pannelWidth;
                    _self.scrollHeight = _self.pannelHeight;
                }

                // 垂直滑动 -- 面板容器 宽高
//                if(effect == 'vSlide'){
//                    _self.scrollWidth = _self.pannelWidth;
//                    _self.scrollHeight = _self.pannelLength * _self.pannelHeight;
//                }

                // 设置面板 容器宽高
                _self.pannelContainer.css(DEFAULTSTYLE).css({
                    "width" : _self.pannelContWidth,
                    "heigh" : _self.pannelContheigth
                });

                // 设置面板 自身 容器宽高
                _self.aPnnels.css(DEFAULTSTYLE).css({
                    "width" : _self.pannelWidth,
                    "heigh" : _self.pannelHeight
                });

//                // 设置默认 显示面板
//                var pannelIndex = _self.getDefaultIndex(_self.defaultIndex),
//                    scrollLeftPx = pannelIndex * _self.pannelWidth;
//
//                _self.moveBoxLeft = scrollLeftPx === 0 ? 0 : -scrollLeftPx;
//
//                _self.renderDataLazyLoad( _self.aPnnels[pannelIndex] );


                var scroBoxClsDef = {
                    "width" : _self.scrollWidth,
                    "height" : _self.scrollHeight,
                    "padding" : 0,
                    "margin" : 0,
                    "left" : 0,
                    "top" : 0
                };

                // 如果已经实例化过
                if(_self.scrollBox){
                    _self.scrollBox.css(scroBoxClsDef).css(DEFAULTSTYLE);
                    return;
                }

                _self.scrollBox = $('<div>').css(scroBoxClsDef).css(DEFAULTSTYLE);
                _self.scrollBox.append(_self.aPnnels);
                _self.pannelContainer.append(_self.scrollBox);
            },

            /**
             * 设置显示那个面板(内置调用 参数过滤方法！)
             * @param index
             */
            setPannelIndex: function(index){
                var _self = this;

                _self.slideChange( _self.getDefaultIndex(index) );
            },

            /**
             * 获取 默认或 用户指定 初始化展现面板
             * @param number index
             * @returns {number}
             */
            getDefaultIndex : function(index){
                var _self = this;

                if( isNaN(index) ){
                    return 0;
                }

                return index <= 0 ? 0 : (index > _self.pannelLength) ? _self.pannelLength : index;
            }

        }


    $.fn.jSlider = jSlider;

})(jQuery || $);