
/*
 * 新版2.0 header js
 * author：huangjia
 * Date： 20140916
 * update: 将jquery 改造为 kissy模块化写法
 */

KISSY.add('pinganfang-gallary/header_kissy', function(S, Node, Event, Anim, Placeholder){

    var $ = S.all;

    // 固定常量
    var LIA_INDEX = 'data-item',    // data-item 从0开始,与 一级导航 一一对应，也是从0开始！
        NAVSELECTEDCLS = 'nav_selected',
        NAVHOVERCLS = 'hover_nav',
        NOTICEDATA = 'data-hasdata',
        HIDECS = 'hide',
        OFFFIXNO = 15;              // 修正二级菜单偏移量

    // 一级菜单 a标签 导航元素
    var NAVLISTLI = $('.nav_link', '.header-navlist');

    // 二级菜单 ul列表容器
    var CHILD_MENU_CONTENT = $('.leveltwo-list-content'),
        CHILD_MENU_ULS = $('.level-two-ulist', CHILD_MENU_CONTENT);

    // 当前hover 导航index
    var CURRENTHOVERINDEX = null;

    function PageHeader(){
        var _self = this;

//        PageHeader.superclass.constructor.call(_self);

        _self._init();
    }

//    S.extend(PageHeader, S.Base);

    S.augment(PageHeader, {

        /**
         * 初始化方法
         * @private
         */
        _init: function(){
            var _self = this;

            _self.curnavel = _self._getSelectedNavEl();

            // 表单 输入框 placeHolder
            new Placeholder({
                node : '#headerSearchContent'
            });


            // 头部 通知样式 显示10秒隐藏
            _self._noticeRender();

            _self._headerInit();

            _self._eventInit();
        },

        _eventInit: function(){
            var _self = this;
            var resetChildMenu;

            // resize 响应式 二级菜单定位 / 只有存在二级菜单并且选中情况下
            $(window).on('resize', function(){
                resetChildMenu && clearTimeout(resetChildMenu);
                resetChildMenu = setTimeout(function(){
                    _self._showSecondMenuUl(_self.curnavel);
                }, 150);
            });

            // 一级菜单 hover
            NAVLISTLI.on('mouseenter', function(el){
                _self._navHoverStyle(this);
                _self._showSecondMenuUl(this);
            }).on('mouseleave', function(){
                var elNode = $(this);
                elNode.removeClass(NAVHOVERCLS);
            });

            // 二级菜单 hover
            CHILD_MENU_CONTENT.on('mouseenter', function(){
                var navaEl = $(NAVLISTLI[ CURRENTHOVERINDEX ]),
                    hasSelect = navaEl.hasClass(NAVSELECTEDCLS);

                !hasSelect && navaEl.addClass(NAVHOVERCLS);
            }).on('mouseleave', function(){
                $(NAVLISTLI[ CURRENTHOVERINDEX ]).removeClass(NAVHOVERCLS);
                _self._showSecondMenuUl(_self.curnavel);
            });

            // 鼠标离开导航菜单监控
            $('#J_nav-menu').on('mouseleave', function(){
                _self._showSecondMenuUl(_self.curnavel);
            });

            // 搜索框 房屋类型 后操作 -- 修改form action
            Event.on('.j_house-type-set', 'click', function(ev){
                selectHouseType (ev);
            });

            // 导航栏 搜索框 房屋类型 选择 -- js控制 房屋类型选择 显示隐藏
            Event.on('.search_type_box', 'mouseenter mouseleave', function(ev){
                var dispEl =  S.one(this).children('.hd_search_pop'),
                    evType = ev.type;

                if(evType == 'mouseenter'){
                    dispEl.show();
                }else{
                    dispEl.hide();
                }
            });


            // 搜索框 房屋类型 选择 文本和url 写入方法
            function selectHouseType (ev){
                var curEl = S.one(ev.target),
                    elText = curEl.text(),
                    dataHref = curEl.attr('data-href');
                debugger;

                DOM('#headerSearchType').text(elText)
                DOM('#J_serch-form').attr('action', dataHref);
            }


            //        /**
            //         * 轮播控制
            //         * @param boolean 是否轮播
            //         * @param el 当前hover li 元素
            //         */
            //        function isTopRun (isrun, el){
            //
            //            // 搜索输入框逻辑 -- jquery placeholder.js
            //
            //            if(!isrun){
            //                clearInterval(setInterval_obj);
            //                setInterval_obj = null;
            //                DOM.removeClass(top_li_list, curCls);
            //                DOM.addClass(el, curCls);
            //            }
            //        }
            //
            //        // 监控li hover效果
            //        Event.delegate('#J_hot-top', 'mouseenter mouseleave', '.lp-name', function(ev){
            //            var curLi = S.one(ev.currentTarget).parent().parent('li'),
            //                evtType = ev.type;
            //
            //            if(evtType === 'mouseenter'){
            //                isTopRun(false, curLi);
            //            }else{
            //                isTopRun(true);
            //            }
            //        });


                        // 广告投放


            //    // 搜索框 房屋类型 选择
            //    $('.j_house-type-set').on('click', function(ev){
            //        selectHouseType (ev);
            //    });

            //    // 导航栏 搜索框 房屋类型 选择 -- js控制 房屋类型选择 显示隐藏 || 暂时业务取消掉 不展开
            //    $('.search_type_box').mouseenter(function(){
            //        $(this).children('.hd_search_pop').show();
            //    }).mouseleave(function(){
            //        $(this).children('.hd_search_pop').hide();
            //    });

            //    // 搜索框 房屋类型 选择 文本和url 写入方法
            //    function selectHouseType (ev){
            //        var curEl = $(ev.target),
            //            elText = curEl.text(),
            //            dataHref = curEl.attr('data-href');
            //
            //        $('#headerSearchType').text(elText)
            //        $('#J_serch-form').attr('action', dataHref);
            //        curEl.parent('.hd_search_pop').hide();
            //    }

        },

        _headerInit: function(){
            var _self = this;

            // 初始化 导航nav菜单 编号
            NAVLISTLI.each(function(el, index){
                $(el).attr(LIA_INDEX, index);
            });

            // 是否首页 - 首页2级菜单不固定展现 || 否则其他固定展现(有数据)
            _self._showSecondMenuUl(_self.curnavel);
        },

        // 获取 初始化选中导航 nav 一级 a标签元素
        _getSelectedNavEl: function(){
            var _self = this;
            var selectedEl = null;

            NAVLISTLI.each(function(el, index){ // index, el 与jquery 差异性，kissy 是 元素 序号：jquery 是序号 元素
                var hasSelected = $(el).hasClass(NAVSELECTEDCLS);

                if(hasSelected){
                    selectedEl = $(el);
                    return false;
                }
            });

            return selectedEl;
        },

         // mouseover 鼠标hover菜单时候 多个 ul二级菜单 元素 区分展现逻辑
         _showSecondMenuUl: function(el){
             var _self = this;

             var elNode = $(el),
                lia_Index = parseInt(elNode.attr(LIA_INDEX), 10),           // nav a 个数 序列号
                ulNode = _self._getNavUl(lia_Index),
                child_ulwidht = 0,
                ulLeftPostion = elNode.offset().left;

            // 存储hover个数序号
            CURRENTHOVERINDEX = lia_Index;

            // 展现容器 方便计算
            CHILD_MENU_CONTENT.show();

            // 没有二级菜单 隐藏二级菜单容器 并退出
            if(!ulNode){
                CHILD_MENU_CONTENT.hide();
                return;
            }else{
                // 获取定位值
                child_ulwidht = ulNode.outerWidth(true);               // 二级ul菜单自身宽度
                ulLeftPostion = ulLeftPostion - child_ulwidht/3 + OFFFIXNO;       // 偏移量
            }

            // 隐藏所有 ul 二级菜单元素
            CHILD_MENU_ULS.hide();

            // 设置二级菜单对齐
            ulNode.css({
                position: 'absolute',
                top: 0,
                left: ulLeftPostion
            }).show();
        },

         // nav 一级导航 hover效果 || 已经默认选中则 退出
         _navHoverStyle: function (el) {
             var _self = this;

             var elNode = $(el),
                hasSelect = elNode.hasClass(NAVSELECTEDCLS);            // 是否选中状态

            // 置为hover效果
            !hasSelect && elNode.addClass(NAVHOVERCLS);
        },

         // 获取 当前 nav a下的 ul 元素
         _getNavUl: function(num){
             var _self = this;

             var elNode = null;

            CHILD_MENU_ULS.each(function(el, index){
                var jqEl = $(el),
                    item = parseInt(jqEl.attr(LIA_INDEX), 10);

                if(item === num){
                    elNode = jqEl;
                    return false;
                }
            });

            return elNode;
        },

         // 头部 通知样式 显示10秒隐藏
         _noticeRender : function(){
             var _self = this;

             var headerEl = $('#J_head-notice'),
                pEl = headerEl.first(),
                pHasText = S.trim( pEl.text() ),
                hasData = parseInt( headerEl.attr(NOTICEDATA), 10) !== 0 ? true : false;

            if(pHasText && hasData){
                headerEl.removeClass(HIDECS);
                setTimeout(function(){
                    Anim(headerEl, {
                        height: 0,
                        opacity: 0,
                    }).run ();

//                    headerEl.fadeOut();
                }, 10000);
            }else{
                headerEl.addClass(HIDECS);
            }
        }

    });

    return PageHeader;

}, {requires: ['node', 'event', 'anim', 'kg/placeholder/2.0.0/index']});