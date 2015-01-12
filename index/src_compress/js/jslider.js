
/*
 * 简单的轮播组件 banner轮播、tab切换、textarea懒加载优化
 * author: huangjia
 * Date: 20140806
 * Update: 20140812 增加响应式体验 功能
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

            _self.config = $.extend({
                "autoSlide": false,                 // 是否自动轮播
                "effect": "hSlide",                 // 轮播形式 水平轮播
                "eventType" : "click",              // 手动切换形式
                "hoverStop" : true,                  // 鼠标经过内容是否停止播放
                "contentClass" : "slide-content",    // 轮播容器 class 钩子
                "pannelClass" : "tab-pannel",       // 面板class 钩子
                "navClass" : "tab_list",             // 控制轮播按钮 class 钩子
                "triggerSelector" : "li",           // 面板Dom元素
                "selectedClass" : "selected",       // 选中元素 class样式
                "viewTime" : 3000,                  // 可视停留时间 单位ms
                "speed" : 300,                       // 切换 动画 速度，单位ms
                "lazyloadCls" : "ks_data-lazyload", // 懒加载容器 class钩子 | 存放在 面板 下面 textarea上
                "defaultIndex" : 0,                 // 默认展现第几帧
                "autoResponsiveLayout": false,      // 是否自动响应 窗口变化
                "initStyleCallback" : null          // 初始化render callback方法
            }, config);

            _self.slidContainr = $('#'+container);

            if(!_self.slidContainr){
                console.log('请指定轮播容器Id！');
                return;
            }

            // 轮播面板pannel 容器
            _self.pannelContainer = $('.'+_self.config.contentClass, _self.slidContainr);

            // 面板pannel
            _self.aPnnels = $('.'+_self.config.pannelClass, _self.pannelContainer);
            _self.pannelLength = _self.aPnnels.length;

            // 懒加载textarea元素
            _self.pannelTextareas = $('.'+_self.config.lazyloadCls, _self.aPnnels);

            // 控制 轮播面板 tab-list 容器
            _self.navListContent = $('.'+_self.config.navClass, _self.slidContainr);
            _self.tabListDom = $(_self.config.triggerSelector, _self.navListContent);

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
                _self.isRuning(_self.config.autoSlide);

                // 默认展现面板
                _self.setPannelIndex(_self.config.defaultIndex);
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
                }, 100);
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

                // 单击tab-list 切换轮播
                _self.tabListDom.on(_self.config.eventType, function(ev){
                    var targetEl = $(ev.target).parent(_self.config.triggerSelector),
                        indexNum = targetEl.attr(DATAINDEX);

                    _self.slideChange(indexNum);
                });


                // 鼠标 hover 暂停轮播 效果 -- 自动轮播有效
                if( _self.config.autoSlide && _self.config.hoverStop ){
                    _self.pannelContainer.delegate(_self.aPnnels, 'mouseover mouseout', function(ev){
                        var evtType = ev.type;

                        if(evtType === 'mouseover'){
                            _self.isRuning(false);
                        }else{
                            _self.isRuning(true);
                        }
                    });
                }

                // slider 自动响应式 方法
                if( _self.config.autoResponsiveLayout){
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
                            }, 300);

                        }, 200);
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
            isRuning : function(isrun){
                var _self = this;

                if(isrun){
                    if(!_self.setInterval_obj){
                        _self.setInterval_obj = setInterval(function(){
                            _self.slideChange();
                        }, _self.config.viewTime );
                    }
                }else{
                    clearInterval(_self.setInterval_obj);
                    _self.setInterval_obj = null;
                }
            },

            /**
             * 具体轮播方法
             * @param Number  index
             */
            slideChange : function(index){
                var _self = this,
                    index = parseInt(index, 10);

                if(_self.pannelWidth && !isNaN(_self.pannelWidth) ){
                    var nexPanLeft = _self.moveBoxLeft + _self.pannelWidth,
                        endPanLeft = _self.scrollWidth - _self.pannelWidth;

                    // 如果是最后一帧
                    if( nexPanLeft > endPanLeft ){
                        _self.moveBoxLeft = 0;
                    }else{
                        _self.moveBoxLeft += _self.pannelWidth;
                    }


                    // 指定某帧
                    if(!isNaN(index)){
                        _self.moveBoxLeft = index * _self.pannelWidth;
                        _self.moveBoxLeft = _self.moveBoxLeft < 0 ? 0 : _self.moveBoxLeft;
                    }
                }

                _self.renderDataLazyLoad( _self.aPnnels[_self.getPannelIndex()] );
                _self.tabListChange(index);


                var leftNo = _self.moveBoxLeft <= 0 ? 0 : -_self.moveBoxLeft;

                _self.scrollBox.animate({
                    left: leftNo
                }, _self.config.speed, function() {
                    // 暂无回调方法
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

                var textareas_cls = $('.'+_self.config.lazyloadCls, el);

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

                _self.tabListDom.removeClass(_self.config.selectedClass);
                $(el).addClass(_self.config.selectedClass);
            },


            /**
             * 轮播 面板 样式初始化
             */
            styleInit : function(){
                var _self = this;

                // 每次样式初始化 执行操作
                if(_self.config.initStyleCallback && $.isFunction(_self.config.initStyleCallback)){
                    _self.config.initStyleCallback.call(_self);
                }

                // 隐藏textarea显示
                _self.pannelTextareas.css(DEFHIDECONG);

                // 水平滑动 -- 面板容器 宽高
                var effect = $.trim(_self.config.effect);

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
//                var pannelIndex = _self.getDefaultIndex(_self.config.defaultIndex),
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