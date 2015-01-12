
/*
 * 新版2.0 header js
 * author：huangjia
 * Date： 20140818 二级菜单 增强 及bug修复
 * update: 20140926 1、一级菜单一个都没选中 或者 首页默认/hover选中下 隐藏二级菜单容器； 2、hover二级菜单为空情况下 展现当前所选对应二级菜单(首页隐藏)；
 * depend  1、placeholder jquery插件
 */

(function($, window){

    // 固定常量
    var LIA_INDEX = 'data-item',    // data-item 从0开始,与 一级导航 一一对应，也是从0开始！
        NAVSELECTEDCLS = 'nav_selected',
        NAVHOVERCLS = 'hover_nav',
        NOTICEDATA = 'data-hasdata',
        HIDECS = 'hide',
        OFFFIXNO = 15;              // 修正二级菜单偏移量


    // 一级菜单 a标签 导航元素
    var navListLi = $('.header-navlist .nav_link');

    // 二级菜单 ul列表容器
    var child_menu_content = $('.leveltwo-list-content'),
        child_menu_uls = $('.level-two-ulist', child_menu_content);

    // 当前hover 导航index
    var CURRENTHOVERINDEX = null;


    // 头部 通知样式 显示10秒隐藏
    noticeRender();


    // 初始化 导航nav菜单 编号
    navListLi.each(function(index, el){
        $(el).attr(LIA_INDEX, index);
    });


    // 是否首页 - 首页2级菜单不固定展现 || 否则其他固定展现(有数据)
    var initSelectFirstMenu = getSelectedNavEl(),
        isIndexSelet = isIndexPage(initSelectFirstMenu);

    if(initSelectFirstMenu && isIndexSelet){
        child_menu_content.hide();
    }
    showSecondMenuUl(initSelectFirstMenu);

    // resize 响应式 二级菜单定位 / 只有存在二级菜单并且选中情况下
    var resetChildMenu;
    $(window).resize(function(){
        resetChildMenu && clearTimeout(resetChildMenu);
        resetChildMenu = setTimeout(function(){
            showSecondMenuUl(initSelectFirstMenu);
        }, 150);
    });

    // 一级菜单 hover
    navListLi.mouseenter(function(el){
        navHoverStyle(this);
        showSecondMenuUl(this);
    }).mouseleave(function(){
        var elNode = $(this);
        elNode.removeClass(NAVHOVERCLS);
    });

    // 二级菜单 hover
    child_menu_content.mouseenter(function(){
        var navaEl = $(navListLi[ CURRENTHOVERINDEX ]),
            hasSelect = navaEl.hasClass(NAVSELECTEDCLS);

        !hasSelect && navaEl.addClass(NAVHOVERCLS);
    }).mouseleave(function(){
        $(navListLi[ CURRENTHOVERINDEX ]).removeClass(NAVHOVERCLS);
        showSecondMenuUl(initSelectFirstMenu);
    });

    // 鼠标离开导航菜单监控
    $('#J_nav-menu').mouseleave(function(){
        if(!initSelectFirstMenu){
            child_menu_content.hide();
            return;
        }
        showSecondMenuUl(initSelectFirstMenu);
    });


    /*
     * 二级导航菜单 js逻辑 方法
     */

    // 获取 初始化选中导航 nav 一级 a标签元素
    function getSelectedNavEl(){
        var selectedEl = null;

        navListLi.each(function(index, el){
            var hasSelected = $(el).hasClass(NAVSELECTEDCLS);

            if(hasSelected){
                selectedEl = $(el);
                return false;
            }
        });

        return selectedEl;
    }

    // 是否首页
    function isIndexPage(el){
        if(!el){
            return;
        }

        return parseInt($(el).attr(LIA_INDEX), 10) === 0;
    }

    // mouseover 鼠标hover菜单时候 多个 ul二级菜单 元素 区分展现逻辑
    function showSecondMenuUl(el){
        var elNode = el && $(el) || null;

        // 在没有任何一级菜单被选中情况下(二手房|租房特殊情况) 隐藏所有二级菜单 | 不能隐藏容器，接下来还有hover
        if(!elNode){
            child_menu_uls.hide();
            return;
        }

        //  首页被选中
        if(isIndexPage(elNode)){
            child_menu_content.hide();
            return;
        }

        // 有ul 和 没ul 定位逻辑
        ulPostiton(elNode);
    }

    // mouseover 鼠标hover菜单时候 多个 ul二级菜单 元素 区分展现逻辑
    function showSecondMenuUl(elNode){

    // 二级菜单定为 展现
    function ulPostiton(elNode){
        var ulLeftPostion = elNode.offset().left,
            lia_Index = parseInt(elNode.attr(LIA_INDEX), 10),           // nav a 个数 序列号
            ulNode = getNavUl(lia_Index),
            child_ulwidht = 0;


        // 没有二级菜单 则将 一级菜单选中 所对应的ul 作为当前hover 对对应的ul
        if(!ulNode){

            // 没有默认选中 或 选中的是首页；   这里是为了兼容 特殊情况 --- 即 二手房|租房 一级菜单 一个都没选中
            if(!initSelectFirstMenu || isIndexSelet ){
                child_menu_content.hide();
                return;
            }

            ulLeftPostion = initSelectFirstMenu.offset().left;
            lia_Index = parseInt(initSelectFirstMenu.attr(LIA_INDEX), 10);           // nav a 个数 序列号
            ulNode = getNavUl(lia_Index);
        }

        // 存储hover个数序号
        CURRENTHOVERINDEX = lia_Index;

        child_menu_content.show();

        // 获取定位值
        child_ulwidht = ulNode.outerWidth(true);               // 二级ul菜单自身宽度
        ulLeftPostion = ulLeftPostion - child_ulwidht/3 + OFFFIXNO;       // 偏移量

        // 隐藏所有 ul 二级菜单元素
        child_menu_uls.hide();

        // 设置二级菜单对齐
        ulNode.css({
            position: 'absolute',
            top: 0,
            left: ulLeftPostion
        }).show();
    }


    // nav 一级导航 hover效果 || 已经默认选中则 退出
    function navHoverStyle (el) {
        var elNode = $(el),
            hasSelect = elNode.hasClass(NAVSELECTEDCLS);            // 是否选中状态

        // 置为hover效果
        !hasSelect && elNode.addClass(NAVHOVERCLS);
    }

    // 获取 当前 nav a下的 ul 元素
    function getNavUl(num){
        var elNode = null;

        child_menu_uls.each(function(index, el){
            var jqEl = $(el),
                item = parseInt(jqEl.attr(LIA_INDEX), 10);

            if(item === num){
                elNode = jqEl;
                return false;
            }
        });

        return elNode;
    }


    /* **** 二级菜单处理方法 end **** */







    /*
     * 页面其他逻辑
     */

    // 表单 输入框 placeHolder
    if($('input, textarea').placeholder){
        $('input, textarea').placeholder();
    }

    // 头部 通知样式 显示10秒隐藏
    function noticeRender (){
        var headerEl = $('#J_head-notice'),
            pEl = headerEl.first(),
            pHasText = $.trim( pEl.text() ),
            hasData = parseInt( headerEl.attr(NOTICEDATA), 10) !== 0 ? true : false;

        if(pHasText && hasData){
            headerEl.removeClass(HIDECS);
            setTimeout(function(){
                $('#J_head-notice').hide(800);
            }, 10000);
        }else{
            headerEl.addClass(HIDECS);
        }
    }


//    // 搜索框 房屋类型 选择
//    $('.j_house-type-set').click(function(ev){
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

})(jQuery || $, window);