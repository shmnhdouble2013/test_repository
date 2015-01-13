
/**
 * @fileOverview  全新页面框架页 kissy 模块化js
 * @auther  水木年华double
 * @date    2014-11-17
 */

KISSY.add('bui/main', function(S, Menu, Tab){

    // 全局公用方法
    var DOM = S.DOM,
        Event = S.Event,
        UA = S.UA;

    // 全局公用变量
    var	CLS_SELECTE = 'lp-selected',                 // 一级菜单 选中的模块样式
           ATTTR_INDEX ='data-index',                   // 一级菜单 序号标示

           CLS_HIDDEN = 'ks-hidden',                    // 隐藏的模块样式
           CLS_TAB_ITEM = 'lp4-tab-item',               // 根据配置 生成的 一级菜单 大面板 li

           CLS_CALLAPSE_CONTENT = 'lp-second-slib-con', // 收缩容器
           CLS_CALLAPSE = 'lp-collapse',                // 收缩 展开class

           SLIDERTREEMENUCONTENTCLS = 'lp4-second-nav', // 侧边栏 树菜单 容器 cls 钩子
           TABMENUCONTENTCLS = 'lp4-inner-tab',         // 页面tab菜单 容器 cls 钩子

           NAVLIST = S.one('#J_mainNav'),               // 置顶横向 业务模块 列表  例如：用户、商品、商家 大模块
           NAVITEMS = NAVLIST.children('.nav-item'),    // 模块列表内业务模块 li

           NAVCONTENT = S.one('#J_mainNavContent'),     // slideMenu 和 tab content容器
           NAVTABS = null,                              // 模块内的Tab元素，模块内部包含2部分，菜单和Tab
           FUNCID = null,                               // 窗口响应式适配

           SLIDERTREEMENUOBJ = {},                      // sliderTreeMenu obj 二级左边树菜单 对象 ==> 用于 大的一级 菜单tab 切换 相应的 二级树菜单 和 tab 选项菜单
           TABMENUOBJ = {};                             // tabMenu obj tab菜单 对象

    var TREE_MENU_TPL = '<div class="'+CLS_CALLAPSE_CONTENT+'"><div class="lp-second-slib"></div></div>', // 左边栏 收起来 模板
        MENU_MASK_TL = '<div class="nav-item-mask"></div>', // 一级菜单 hover浮层效果
        SUBHEIGHT = UA.ie == 7 ? 65 : 70;           // 浏览器高度判断  header: 37; menu:52; tab:21;  89 - 19 = 70;


    function Main(config){
        var _self = this;

        if(!(_self instanceof Main) ){
            return new Main(config);
        }

        Main.superclass.constructor.call(_self, config);

        _self.init();
    }

    S.extend(Main, S.Base);
    S.augment(Main, {

        // 初始化加载
        init: function(){
            var _self = this;

            // 初始化容器 slideMenu 和 tabMenu Dom结构 和 class样式
            _self.initContents();

            // 实例化 相应菜单 选中 页面 tab切换菜单
            _self._renderTabMenu();

            // 实例化 侧边栏 tree slideMenu菜单
            _self._renderSlideMenu();

            // 设置 默认业务模块 选中 相应页面
            _self.defaultSelectModule();

            //设置用户工作区域高度 li 面板
            _self.autoSetHeight();

            // 事件初始化
            _self.initEvent();

            // 定义topManger
            _self.setTopManager();
        },

        // 初始化加载 ok
        initEvent : function(){
            var _self = this;

            //窗口变化，改变用户工作区大小
            Event.on(window, 'resize',function(){
                FUNCID && clearTimeout(FUNCID);
                FUNCID = setTimeout(function(){
                    _self.autoSetHeight();
                }, 350);
            });


            // 一级菜单 click 事件绑定  ===> 单击选中|| mouseHover || mouseOut
            NAVITEMS.on('click', function(ev){
                var itemEl = S.one(ev.currentTarget),
                    index = parseInt(itemEl.attr(ATTTR_INDEX), 10);

                if(!itemEl.hasClass(CLS_SELECTE)){
                    _self.setModuleSelected(index);
                }
            }).on('mouseenter',function(ev){
                var itemEl = S.one(ev.currentTarget);

                itemEl.addClass('lp-hover');
            }).on('mouseleave',function(ev){
                var itemEl = S.one(ev.currentTarget);

                itemEl.removeClass('lp-hover');
            });

            // 收缩 和 展开
            Event.delegate(document, 'click', '.'+CLS_CALLAPSE_CONTENT, function(ev){
                var currentTarget = S.one(ev.currentTarget),
                    navContainerEl = currentTarget.parent().parent( '.'+CLS_TAB_ITEM);

                navContainerEl.toggleClass(CLS_CALLAPSE);
            });
        },

        /**
         * 默认选中模块 2个功能：
         * 1、默认展现哪个 菜单面板；
         * 2、从链接中获取用户定位到的模块，便于刷新 和 转到指定模块使用 ok
         */
        defaultSelectModule: function(){
            var _self = this,
                defaultSetting = _self.getNavPositionSetting();

            // 如果有hash路由 根据 路径标示打开 slideTreeMenu菜单 和 tabMenu菜单页面 || 防止乱输入处理
            if(defaultSetting){
                var moduleIdConfig = _self.getModuleConfig(defaultSetting.moduleId),
                    moduleIdStrToItem = moduleIdConfig ? moduleIdConfig[ATTTR_INDEX] : null;

                if( moduleIdStrToItem >= 0 ){
                    _self.setModuleSelected(moduleIdStrToItem);
                    _self.setPageSelected(moduleIdStrToItem, defaultSetting.pageId);
                }

                // 如果 没有hash路由 则检查是否 有默认homePage页面
            }else if( _self.get('homePage') ){
                var modIdStr = _self.get('homePage')['moduleId'],
                    pageIdStr = _self.get('homePage')['pageId'];

                if(modIdStr && pageIdStr){
                    _self.setModuleSelected( _self.getModuleConfig(modIdStr)[ATTTR_INDEX] );
                    _self.setPageSelected(modIdStr, pageIdStr);
                }

                // 否则默认打开 第一个菜单模块
            }else{
                _self.setModuleSelected(0);
            }
        },

        /**
         * 初始化菜单容器
         * 1、初始化一级模块菜单 ===> 设置编号
         * 2、清空左菜单 和 tab菜单 dom元素
         * 3、根据menuConfig配置 初始化li面板页面  || 添加 展开和收起 Dom结构
         * 4、li面板 添加 class样式 || 并存储 到全局变量 NAVTABS 上
         */
        initContents: function(){
            var _self = this;

            // 初始化一级模块菜单 ===> 设置编号 和 hover DOM模板
            S.each(NAVITEMS, function(item, index){
                S.one(item).attr(ATTTR_INDEX, index);
                S.one(item).append( new S.Node(MENU_MASK_TL) );
            });

            // 清空左菜单 和 tab菜单
            NAVCONTENT.children().remove();

            // 根据menuConfig配置 初始化li面板页面
            S.each(_self.get('menuConfig'), function(module){
                var id = module.id,
                    slideTreeMenuId = 'J_'+id+'Tree',
                    temp =['<li class="'+CLS_TAB_ITEM+' ks-hidden"><div class="'+SLIDERTREEMENUCONTENTCLS+'" id="'+slideTreeMenuId+'"></div><div class="'+TABMENUCONTENTCLS+'" id="J_'+id+'Tab"></div></li>'].join('');

//              example:
//                <li class="lp4-tab-item">
//                    <div class="lp4-second-nav" id="J_storageTree"></div>
//                    <div class="lp4-inner-tab" id="J_storageTab"></div>
//                </li>

                var slideTree_tab_Menu = new S.Node(temp),
                    slideTree_Menu = S.get('#'+slideTreeMenuId, slideTree_tab_Menu );

                slideTree_tab_Menu.appendTo(NAVCONTENT);

                // 添加 展开和收起 Dom结构
                new S.Node(TREE_MENU_TPL).appendTo(slideTree_Menu);
            });

            // li面板 添加 class样式 || 模块内的Tab元素，模块内部包含2部分，菜单和Tab
            NAVTABS = NAVCONTENT.children('.'+CLS_TAB_ITEM);
        },

        /**
         * 实例化 二级菜单树 || 添加监控调用tab对象打开tab页面 || 设置菜单树选中状态 || 全局换成菜单树对象
         * @param { string } slideTreeMenuId 二级菜单树 索引ID  对应着 一级菜单
         */
        _renderSlideMenu: function(sliderTreeId){
            var _self = this,
                item = _self.getModuleConfig( sliderTreeId || 0 ),
                id = item.id,
                treeId = '#J_'+id+'Tree';

            var slideMenuObj = {
                render: treeId,
//                width: '136px',
                items : item.menu
            };

            /* SideMenu example format：
             * items: [
             {
             text:'基本结构',
             items:[
             {
             text : '上部导航',
             href:'1.php'
             },
             {
             id:'ss1',
             text:'左边导航',
             href:'2.php'
             }
             ]
             }
             ]
             * */

            // 如果 实例化对象 已经存在 直接返回退出
            if(SLIDERTREEMENUOBJ[id]){
                return SLIDERTREEMENUOBJ[id];
            }

            var sideMenu = new Menu.SideMenu(slideMenuObj);
            sideMenu.render();

            // 点击菜单，新增 || 切换Tab 菜单选项
            sideMenu.on('menuclick', function(ev){
                _self.setPageSelected(id, ev.item.get('id') ); // _self.getNavPositionSetting().pageId
            });

            // 选中的菜单发生改变后，更新链接上的页面编号 ==> 主要用于 非手动 click事件触发性 url hash 路由控制
            sideMenu.on('selectedchange',function(ev){
                ev.item && _self.setUrlHash(id, ev.item.get('id') );
            });

            SLIDERTREEMENUOBJ[id] = sideMenu;

            _self.sideMenu = sideMenu;

            return sideMenu;
        },


        /**
         * 单击菜单树时候 先判断tab是 新增 还是 刷新
         * @param {eventObj} ev 二级菜单树 ev对象
         * @param {string} id 模块id
         */

        // 实例化 相应菜单 选中 页面 tab切换菜单
        _renderTabMenu: function(tabTreeId){
            var _self = this,
                item = _self.getModuleConfig( tabTreeId || 0 ),
                id = item.id,
                tabId = '#J_'+id+'Tab';

            var tabConfig = {
                render: tabId,
//                forceFit : true,
                height: _self.getAutoHeight() - 5,
                children : []
            };

            /* tabMenu 数据格式
             * [
             {
             id: 'chose-see',
             title : '测试标签',
             href : 'http://www.baidu.com',
             actived:true
             }
             ]
             * */

            // 如果对象 已经存在 直接返回退出
            if(TABMENUOBJ[id]){
                return TABMENUOBJ[id];
            }

            // 如果页面已经存在 刷新页面
            var tabMenu = new Tab.NavTab(tabConfig, true);
            tabMenu.render();

            TABMENUOBJ[id] = tabMenu;

            // tab 菜单 单击 与  sliderTreeMenu 菜单进行关联 联动
            tabMenu.on('activedchange', function(ev){
                var pageId = ev.item.get('id');

                // 只有config menu 菜单配置中的 pageId 才会被路由
                if( pageId === _self.getCurrentPageId(id) ){
                    SLIDERTREEMENUOBJ[id].setSelectedByField('id', pageId );
                    _self.setUrlHash(id, pageId );
                }
            });

            // tab 关闭  ===>  如果所有的 tab都关闭了，清理左边菜单树 选中状态
            tabMenu.on('afterRemoveChild', function(ev){
                if( this.get('children').length == 0 ){
                    SLIDERTREEMENUOBJ[id].clearSelection();
                    _self.setUrlHash(id, '');
                };
            });

            _self.tabMenu = tabMenu;

            return tabMenu;
        },

        /**
         * 1、根据 一级菜单菜单序号 ===> 获取相应模块 slideMenu菜单配置
         * 2、根据 指定tree id 字符串 ===> 获取相应模块 slideMenu菜单配置
         * @param {Number} id 一级导航 数字下标
         * @param {string} id sliderTreeMenu module id string;
         * @return {object} sliderTreeMenu obj config
         */
        getModuleConfig: function(id){
            var _self = this,
                result = null;

            if(S.isNumber(id)){
                return _self.get('menuConfig')[id] || {};
            }else{
                S.each(_self.get('menuConfig'), function(config, index){
                    if(config.id === id){
                        // 存储 大配置菜单 序号，方便后续和一级菜单序号对应关联 ATTTR_INDEX
                        config[ATTTR_INDEX] = index;
                        result = config;
                        return false;
                    }
                });
                return result;
            }
        },

        /**
         * 根据 一级导航菜单 索引对应的 菜单树id字符串  获取模块的ID
         * @param {string} index 一级菜单 对应的 模块ID 字符串
         * @param {number} index 一级菜单 对应的 数字序列号
         * @returns {string} 模块ID 字符串
         */
        getModuleId: function (index){
            var _self = this;

            if(S.isString(index)){
                return index;
            }

            if(_self.get('menuConfig')[index]){
                return _self.get('menuConfig')[index].id;
            }else{
                return null;
            }
        },

        /**
         * 获取当前一级菜单 选中模块 序号
         * @returns {number} indexNum
         * @private
         */
        _getCurrentFirstMenuIndex: function(){
            var _self = this,
                indexNum = null;

            S.each(NAVITEMS, function(el, index){
                if( S.one(el).hasClass(CLS_SELECTE) ){
                    indexNum = index;
                    return false;
                }
            });

            return indexNum;
        },

        /**
         * 打开页面，此方法包含回调函数，便于目标页面调用源页面的方法
         * @param {string} moduleId     对象模块id
         * @param {string} id           url 页面id
         * @param {boolean} isClose     是否关闭当前tab 页面？       默认false
         * @param {boolean} isReload    是否重载已经打开的 tab 页面？ 默认false
         * @param {function} callback   回调函数
         */
        openPage: function(moduleId, id, isClose, isReload, callback){
            var _self = this,
                moduleIdStr = moduleId || _self.getModuleId( _self._getCurrentFirstMenuIndex() ),
                module = SLIDERTREEMENUOBJ[moduleIdStr] || null;

            // 检测参数 关闭
            if( !S.isBoolean(isClose) ){
                isClose = false;
            }

            module && _self.redirectPage (moduleIdStr, id || null, isClose, isReload, callback);
        },

        /**
         * 转到目标页面
         * @param {string | number}  moduleId   一级模块id字符串 或者 数字下标编号
         * @param {string}  pageId              tab页面id
         * @param {boolean} isClose             是否关闭当前页面
         * @param {boolean} isReload            如果打开页面是当前页面 是否重载刷新
         */
        redirectPage: function(moduleId, pageId, isClose, isReload, callback){
            var _self = this,
                moduleStr = _self.getModuleId(moduleId),
                menuObj = _self.getSlidTabMenuObj(moduleId),
                sliderTreeMenu = menuObj.sliderTreeMenu,
                tabMenu = menuObj.tabMenu;

            // 检测参数 重载
            if( !S.isBoolean(isReload) ){
                isReload = false;
            }

            // 检测参数 关闭
            if( !S.isBoolean(isClose) ){
                isClose = true;
            }

            isClose && _self.closePage(moduleStr);
            tabMenu && _self.setPageSelected(moduleStr, pageId, isReload);

            // 执行回调
            S.isFunction(callback) && callback.call(_self);
        },

        /**
         * 刷新 当前tab页面 或 指定 模块 id页面
         * 当没有 指定页面 id时候 刷新当前模块下的 当前页面
         * @param {string | number} moduleId 一级模块id字符串 或者 数字下标编号
         * @param {string} pageId            tab 页面 id字符串
         */
        refreshSource : function(moduleId, pageId){
            var _self = this,
                menuObj = _self.getSlidTabMenuObj(moduleId),
                sliderTreeMenu = menuObj.sliderTreeMenu,
                tabMenu = menuObj.tabMenu;

            if(sliderTreeMenu && tabMenu){
                var itemObj = sliderTreeMenu.getSelected(),
                    selectedPageId = itemObj ? itemObj.get('id') : null;

                var item = tabMenu.getItemById( pageId || selectedPageId ) || tabMenu.getActivedItem();

                // 刷新 已经打开页面
                item && item.reload();
            }
        },

        /**
         * 根据tab id 关闭指定Tab || 如果什么参数不提供则关闭当前Tab || 如果 当前没有任何 tab 页面打开 则 执行关闭所有 tab 命令
         * @param {string | number} moduleId    一级模块id字符串 或者 数字下标编号
         * @param {string} tabId                tab链接页面id字符串
         * @param {function} callback           关闭页面后 回调函数
         */
        closePage: function(moduleId, tabId, callback) {
            var _self = this,
                modId = S.isString(moduleId) ? moduleId : null,
                menuObj = _self.getSlidTabMenuObj(modId),
                sliderTreeMenu = menuObj.sliderTreeMenu,
                tabMenu = menuObj.tabMenu;

            if(!tabMenu){
                return;
            }

            var item = tabMenu.getItemById(tabId) || tabMenu.getActivedItem();

//            if(item){
            item && tabMenu._closeItem(item);
//            }else{
//                tabMenu.closeAll();
//            }

            setTimeout(function(){
                S.isFunction(callback) && callback.call(_self);
            }, 500);
        },

        /**
         * 设置 一级菜单 选中后续 操作:
         * 1、plan面板切换
         * 2、sliderTreeMenu 和 tabMenu 对象若不存在 则进行实例化
         * 3、打开tab页面
         * 4、url hash 路由标示
         * @param {number} index 一级导航 序号
         * @param {el || htmlElement || Node} sender
         */
        setModuleSelected: function(index, sender){
            var _self = this,
                curMenuEl = S.one(NAVITEMS[index]),
                sender = sender || curMenuEl;

            if( _self._getCurrentFirstMenuIndex() !== index ){
                var moduleId = _self.getModuleId(index);

                if(!_self.isModuleInitial(moduleId)){
                    _self.createModule(moduleId);
                }

                NAVITEMS.removeClass(CLS_SELECTE);
                sender.addClass(CLS_SELECTE);

                // 隐藏所以li主体面板
                NAVTABS.addClass(CLS_HIDDEN);

                // 显示 当前主体面板
                S.one(NAVTABS[index]).removeClass(CLS_HIDDEN);

                // 获取 二级菜单 sliderTreeMenu 选中项目 页面 ID
                var sldItem = SLIDERTREEMENUOBJ[moduleId].getSelected(),
                    pageId = sldItem ? sldItem.get('id') : '';

                // 写入url路由
                _self.setUrlHash(moduleId, pageId );
            }
        },

        /**
         * 根据一级导航模块序号 和 页面id   设置 tabMenu 选中状态及打开相应的页面
         *
         * @param  {number} moduleIndex 一级导航数字序号
         * @param  {string} moduleIndex 模块id字符串
         *
         * @param  {string} pageId      页面id字符串
         * @param  {boolean} isReload   是否重载已经打开页面？
         * @param  {json} tabObj        打开一个页面不存在的tab 页面 json对象
         */
        setPageSelected: function (moduleIndex, pageId, isReload, tabObj){
            var _self = this,
                moduleIdStr = moduleIndex || _self.getModuleId( _self._getCurrentFirstMenuIndex() ),
                menuObj = _self.getSlidTabMenuObj(moduleIdStr),
                sliderTreeMenu = menuObj.sliderTreeMenu,
                tabMenu = menuObj.tabMenu;

            if( !sliderTreeMenu || !tabMenu ){
                return;
            }

            // 设置 slideMenuTree 根据页面id选中状态  ==> 2种情况： 配置中的 id 和 页面a标签 非配置中的id
            if(pageId){
                sliderTreeMenu.setSelectedByField('id', pageId);

                var itemObj = sliderTreeMenu.getSelected(),
                    item = tabMenu.getItemById(pageId); // tabMenu.getActivedItem()


                // 如果有有选中二级tree菜单，则读取； 还有一种情况，有id但是不是配置中的； 保存当前选中 tab 配置
                if(itemObj){
                    var tabConfig = {
                        title : itemObj.get('text'),
                        href : itemObj.get('href'),
                        id: itemObj.get('id'),
                        actived: true
                    };
                }

                // 如果存在tab page已经打开 刷新|新增
                if(item){
                    // 防止数据丢失, 默认不刷新 已经打开页面
                    isReload && item.reload();
                }else{
                    // 在菜单树中 配置过的 才新增打开
                    itemObj && tabMenu.addTab( tabConfig );
                }

                setTimeout(function(){
                    tabMenu.setActived(pageId);
                }, 500);
            }

            // 如果是新打开 不在配置中的tab 页面
            if(tabObj && tabObj.href ){
                tabConfig = S.merge(tabConfig, {
                    "title" : tabObj.title,
                    "href" : tabObj.href,
                    "id" : tabObj.id
                });

                tabMenu.addTab( tabConfig );
            }
        },

        /**
         * 根据一级导航id 字符串 或者 数字序号 获取 左侧二级菜单树对象 和 tabMenu三级菜单对象
         * 如果没有传递 模块id 字符串或者 数字序号 则取值当前一级菜单选中的模块id 作为菜单对象引用
         * @param moduleIndex {string || number} 一级导航id 字符串 或者 数字序号
         * @returns {{sliderTreeMenu: Object, tabMenu: Object }}
         */
        getSlidTabMenuObj: function(moduleIndex){
            var _self = this,
                moduleIdStr = moduleIndex || _self.getModuleId( _self._getCurrentFirstMenuIndex() );

            return {
                sliderTreeMenu: SLIDERTREEMENUOBJ[moduleIdStr],
                tabMenu: TABMENUOBJ[moduleIdStr]
            }
        },

        // 菜单模块 是否 实例初始化 过？
        isModuleInitial: function (id){
            var _self = this;

            return !!SLIDERTREEMENUOBJ[id] || null;
        },

        /**
         * 创建实例化菜单和
         * 1、sliderTreeMenu
         * 2、tab 横向菜单
         */
        createModule: function (id){
            var _self = this,
                module = SLIDERTREEMENUOBJ[id] || null;

            if(module){
                return module;
            }

            var item = _self.getModuleConfig(id),
                id = item.id;

            _self._renderSlideMenu(id);
            _self._renderTabMenu(id);
        },

        // 获取用户工作区域 ok 除去了头部header 和 一级大的导航菜单
        getAutoHeight: function(){
            var _self = this,
                height = DOM.viewportHeight();

            return height - SUBHEIGHT;
        },

        // 自动设置li 工作区高度 ok
        autoSetHeight: function(){
            var _self = this,
                heightPx = _self.getAutoHeight(),
                liItems = S.all('.'+TABMENUCONTENTCLS + ' .bui-nav-tab'),
                tabContents = S.all('.'+TABMENUCONTENTCLS + ' .bui-nav-tab .tab-content-container');

            S.all('.'+CLS_TAB_ITEM).height(heightPx);

            liItems.height(heightPx);
            tabContents.height(heightPx);
        },

        /**
         * 获取当前页 page ID str
         * @param {string}      moduleIndex
         * @returns {string}    tab page ID str
         */
        getCurrentPageId: function (moduleIndex){
            var _self = this,
                moduleIdStr = moduleIndex || _self.getModuleId( _self._getCurrentFirstMenuIndex() ),
                sliderTreeMenu = SLIDERTREEMENUOBJ[moduleIdStr] || null,
                pageId = '';

            if(sliderTreeMenu){
                var itemObj = sliderTreeMenu.getSelected();

                pageId = itemObj ? itemObj.get('id') : '';
            }

            return pageId;
        },

        /**
         * 从链接上获取当前模块索引，当前页面的ID  example: location.hash ===> "#gather/search"
         * return object {number}  moduleId 一级导航 序号数字
         * return object {string}  pageId   页面id string
         */
        getNavPositionSetting: function (){
            var _self = this,
                pos = location.hash,
                moduleId = 0,
                pageId = '',
                splitIndex = pos.indexOf('/');

            if(!pos){
                return null;
            }

            if(splitIndex >= 0){
                moduleId = pos.substring(1, splitIndex);
                pageId = pos.substring(splitIndex + 1);
            }else{
                moduleId = pos.substring(1);
            }

            return {
                moduleId: moduleId,
                pageId: pageId
            };

        },

        /**
         * 设置模块索引 url页面路径 hash值
         * @param {number} moduleIndex 一级导航 数字序号
         * @param {string} pageId 页面id
         */
        setUrlHash: function (moduleIndex, pageId){
            var _self = this,
                str = '#'+moduleIndex,
                pageIdStr = pageId || '';

            if(pageIdStr){
                str += '/'+pageIdStr;
            }

            location.hash = str;
        },

        /**
         * 设置当前对象挂载window上面
         */
        setTopManager: function(){
            var _self = this;

            window.pageManger = _self;
        },

        //设置页面标题
        setPageTitle: function(title, moduleId, tabId){
            var _self = this,
                menuObj = _self.getSlidTabMenuObj(moduleId),
                tabMenu = menuObj.tabMenu;

            if(!tabMenu){
                return;
            }

            var item = tabMenu.getItemById(tabId) || tabMenu.getActivedItem();

            if(item && title && S.isString(title) ){
                tabMenu.set('title', title);
            }

            return tabMenu;
        }

    });

    return Main;
},{
    requires: ['bui/menu', 'bui/tab', 'sizzle']
});
