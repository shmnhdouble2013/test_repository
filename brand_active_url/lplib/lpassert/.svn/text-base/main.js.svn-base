/**
* 2012 06-12 添加分辨率信息统计
*/
KISSY.add(function(S){
	var DOM = S.DOM,
		UA = S.UA,
		Node = S.Node;

	function main(config){

		var	CLS_SELECTE = 'lp-selected',//选中的模块样式
			CLS_HIDDEN = 'ks-hidden',//隐藏的模块样式
			CLS_LAST = 'lp-last',//最后一个元素
            CLS_HOVER = 'lp-hover',
			CLS_ITEM = 'nav-item',
            CLS_ITEM_MASK = 'nav-item-mask',
			CLS_LEFT_SLIB_CON = 'lp-second-slib-con',
			CLS_LEFT_SLIB = 'lp-second-slib',
			CLS_TAB_ITEM = 'lp4-tab-item',
			CLS_CALLAPSE = 'lp-collapse',
			ATTTR_INDEX ='data-index',
			WIDTH_ITERM = 145,
			TYPE_MODULE = 0,
			TYPE_PAGE = 1,
			GM_URL = 'http://www.atpanel.com/ued.1.1.2?type=9&_gm:id=lp_xiaoqing.dong',
			navList=S.one('#J_mainNav'),//模块列表
			navItems = navList.children('.nav-item'),//模块列表内的具体元素
			navContent = S.one('#J_mainNavContent'),//对应模块的内容
			navTabs = null,//模块内的Tab元素，模块内部包含2部分，菜单、和Tab
			currentModelIndex = null,//当前模块
			urlSuffix = config.urlSuffix || '.htm',
			hideList = null,
			lastShowItem = null,
			hideItmes = [],
			modulesConfig = config.modulesConfig,//模块配置
            newVesion = getItemHeight() < 50;

        WIDTH_ITERM = getItemWidth();
		initModuleConfig(modulesConfig);
		initContents();

		navTabs=navContent.children('.'+CLS_TAB_ITEM);
		////设置用户工作区域高度
		autoSetHeight();
		
		//初始化一级菜单
		S.each(navItems,function(item,index){
			S.one(item).on('click',function(){
				var sender =S.one(this);
				if(sender.hasClass(CLS_SELECTE)){
					return;
				}
				setModuleSelected(index,sender);
			}).on('mouseenter',function(){
				
				S.one(this).addClass('lp-hover');
			}).on('mouseleave',function(){
				S.one(this).removeClass('lp-hover');
			});
			
		});

		navList.on('mouseover',function(event){
			var item = findItem(event.target),
				el = S.one(item),
				offset = null;

			if(el && el.hasClass(CLS_LAST) && hideList){
				offset = el.offset();
				if(!newVesion){
                    offset.top += 7;
                }else{
                    offset.top += 39;
                }
				offset.left += 7;
				showHideList(offset);
			}
		}).on('mouseout',function(event){
			var toElement = event.toElement;
			if(toElement && hideList && (!hideList.contains(toElement) && toElement !== hideList[0])){
				hideHideList();
			}
			
		});
        
        if(hideList){
            hideList.delegate('mouseenter','.'+CLS_ITEM,function(e){
                var sender = S.one(e.currentTarget);
                sender.addClass(CLS_HOVER);
            });
            hideList.delegate('mouseleave','.'+CLS_ITEM,function(e){
                var sender = S.one(e.currentTarget);
                 sender.removeClass(CLS_HOVER);
            });
        }

		// 打开tab页面 - fuzheng
		S.Event.delegate(document, 'click', '.page-lnk', function(event){
			event.preventDefault();
			var sender = S.one(event.currentTarget),
				id = sender.attr('data-id') || sender.attr('id'),
				pageId = sender.attr('data-page'),
				title = sender.attr('title'),
				moduleId = sender.attr('data-module'),
				href = sender.attr('data-href');
			if(window.pageManger){
				if(pageId){
					window.pageManger.redirectPage(moduleId, pageId);
				}else{
					window.pageManger.openPage(moduleId, id, title, href);
				}
			}
		});
		
		//（二级菜单）
		var modules ={};

		//添加页面切换方法，方便子页面调用
		window.pageManger={
			//打开页面，此方法包含回调函数，便于目标页面调用源页面的方法
			openPage : function(moduleId,id,title,href,callback,isClose){

				moduleId = moduleId || getCurrentModuleId();
				var module = getModule(moduleId);
				if(module){
					var tab = module.tab,
						curTabPage = tab.getActiveTab(),
                        sourceId = curTabPage ? curTabPage.get('tabId') : null;
                    if(moduleId != getCurrentModuleId()){
                        setModuleSelected(getModuleIndex(moduleId));
                    }
					tab.addTab({tabId: id, tabName: title, conUrl: href, sourceId: sourceId,isReload:true});
					// by fuzheng
					//tab.addCallback({id:id,func:callback,type:'refresh'});
					window.pageManger.tabBindEvent(moduleId, id, 'refresh', callback);
					if(isClose){
						curTabPage.closeTab();
					}
					emit(moduleId,TYPE_PAGE,href);
				}
			},
			//转到目标页面
			redirectPage : function(moduleId,id,isClose,isReload,search){
				moduleId = moduleId || getCurrentModuleId();
				var module = getModule(moduleId);
				if(moduleId != getCurrentModuleId()){
					setModuleSelected(getModuleIndex(moduleId));
				}
				if(module){
					var tab = module.tab,
						activeTab = tab.getActiveTab();
					setPageSelected(moduleId,id,isReload,search);
					if(isClose && activeTab){
						activeTab.closeTab();
					}
				}
			},
			//关闭Tab，如果什么参数不提供则关闭当前Tab
			closePage : function(moduleId,tabId){
				moduleId = moduleId || getCurrentModuleId();
				var module = getModule(moduleId);
				if(module){
					// by fuzheng
					var tabPage = tabId ? module.tab.getTab(tabId) : module.tab.getActiveTab();
					if(tabPage){
						tabPage.closeTab();
					}
				}
				return tabId;
			},
			//刷新源页面，例如用于从列表导航到编辑页面，编辑完成后刷线源页面
			refreshSource : function(moduleId){
				moduleId = moduleId || getCurrentModuleId();
				var model = getModule(moduleId);
				if(model){
					var tab = model.tab;
					// by fuzheng
					//tab.refreshSourceTab();
					var activeTabPage = tab.getActiveTab();
					if(tab.getSourceTab()){
						activeTabPage.fire('refresh',{tabPage: activeTabPage});					
					}
				}
			},
			//设置页面标题
			setPageTitle : function(title,moduleId,tabId,autoLoad){
				moduleId = moduleId || getCurrentModuleId();
				var module = getModule(moduleId);
				if(module){
					// by fuzheng
					//module.tab.resetTitle({title : title,tabId : tabId,load : autoLoad});
					var tabPage = tabId ? module.tab.getTab(tabId) : module.tab.getActiveTab();
					if(tabPage){
						tabPage.resetTitle({title: title, load: autoLoad});
					}						
				}
				return tabPage;
			},

			// 给tab或tabPage绑定事件 by fuzheng
			// 若 tabId = null 则给 tab对象绑定事件
			tabBindEvent: function(moduleId, tabId, type, func){
				moduleId = moduleId || getCurrentModuleId();
				var module = getModule(moduleId);
				if(module){
					var targetTab = tabId ? module.tab.getTab(tabId) : module.tab;
					if(targetTab && type && func){
						targetTab.on(type, func);
					}					
				}
			},

			// 移除tab或tabPage绑定事件 by fuzheng
			tabDetachEvent: function(moduleId, tabId, type, func){
				moduleId = moduleId || getCurrentModuleId();
				var module = getModule(moduleId);
				if(module){
					var targetTab = tabId ? module.tab.getTab(tabId) : module.tab;
					if(targetTab && type && func){
						targetTab.detach(type, func);
					}					
				}
			},
			
			// 触发tabPage事件 只是适用于tabPage, 不触发tab的事件
			tabFireEvent: function(moduleId, tabId, type){
				moduleId = moduleId || getCurrentModuleId();
				var module = getModule(moduleId);
				if(module){
					var targetTab = module.tab.getTab(tabId);
					if(targetTab && type){
						targetTab.fire(type, {'tabPage': targetTab});
					}					
				}
			},

			/**
			* 获取tabPage的id by fuzheng
			* @param {String} tabIdType 要获取的目标tabPage对象，必填项 
			* tabIdType = null || 'active' 获取当前tabPage的id
			* tabIdType = 'source' 获取当前tabPage的源页面的tabPage的id
			* @return {String} tabPage对象的id
			*/
			getTabId: function(moduleId, tabIdType){
				moduleId = moduleId || getCurrentModuleId();
				var module = getModule(moduleId),
					tabPage = null,
					tabId = null;
				if(module){
					if(!tabIdType || tabIdType === 'active'){
						tabPage = module.tab.getActiveTab();
					}else if(tabIdType === 'source'){
						tabPage = module.tab.getSourceTab();
					}
					if(tabPage){
						tabId = tabPage.get('tabId') || null;
					}
				}
				return tabId;		
			},
			/**
			* 绑定父页面事件 必须是 KISSY.LP 下的对象
			* @param {String} objName 对象名
			* @param {String} type 事件类型 
			* @param {Function} func 需要执行的方法
			* @param {Obj} win 子页面window对象
			*/
			bindTopEvent: function(objName, type, func, win){
				if(KISSY.LP[objName]){
					KISSY.LP[objName].on(type, func);
					S.one(win).on('unload', function(){
						S.log('unload');
						KISSY.LP[objName].detach(type, func);					
					});
				}
			},
			/**
			* 目录树数据（只读）
			*/
			menuTreeData: S.clone(modulesConfig)

		};

		initLocation();

		//发送埋点信息
		function emit(moduleId,type,url){
			/*var winh = window.screen.height,
				winw = window.screen.width,
				obj = {type : type,mid: moduleId,url : url,locl : location.href,_r_ : new Date().getTime(),winh : winh,winw : winw},
				src = GM_URL + '&'+S.param(obj),
				img = new Image();
			img.src = src;
            */
		}
		
        function getItemWidth(){
            var item = navItems[0];
            if(item){
                return S.one(item).outerWidth();
            }
            return 100;
        }
        function getItemHeight(){
            var item = navItems[0];
            if(item){
                return S.one(item).outerHeight();
            }
            return 50;
        }
		//清理权限系统带来的 “,“引起的Bug
		function initModuleConfig(mconfig){
			if(!S.isArray(mconfig)){
				return;
			}
			var emptyIndex = findEmptyIndex(mconfig);
			while(emptyIndex !== -1){
				mconfig.splice(emptyIndex,1);
				emptyIndex = findEmptyIndex(mconfig);
			}
		}

		function findEmptyIndex(array){
			var result = -1;
			S.each(array,function(item,index){
				if(item === null || item === undefined){
					result = index;
					return false;
				}
			});
			return result;
		}

		//初始化选中的模块和页面
		function initLocation(){

			//从链接中获取用户定位到的模块，便于刷新和转到指定模块使用
			var defaultSetting = getNavPositionSetting();
			if(defaultSetting){
				var pageId = defaultSetting.pageId,		//页面编号
					search = defaultSetting.search;		//附加参数
				setModuleSelected(defaultSetting.moduleId);
				setPageSelected(currentModelIndex,pageId,true,search);
			}else{
				if(currentModelIndex == null){
					setModuleSelected(0);
				}else{
					setNavPosition(currentModelIndex);
				}
			}
		}

		//窗口变化，改变用户工作区大小
		/*var funcId=null;
		Event.on(window,'resize',function(){
			if(funcId)
			{
				clearTimeout(funcId);
			}
			funcId = setTimeout(autoSetHeight,200);
		});*/

		function findItem(element){
			if (DOM.hasClass(element, CLS_ITEM)) {
				return element;
			}
			return DOM.parent(element, '.' + CLS_ITEM);
		}
		function initContents(){
			//初始化导航
			initNavItems();
			//清空模块容器
			navContent.children().remove();

			//初始化二级菜单一级Tab
			S.each(modulesConfig,function(module){
				var id = module.id,
					temp =['<li class="lp4-tab-item ks-hidden"><div class="lp4-second-nav"><div class="lp4-second-tree" id="J_',id,'Tree"></div><div class="', CLS_LEFT_SLIB_CON, '"><div class="', CLS_LEFT_SLIB, '"></div></div></div><div class="lp4-inner-tab" id="J_',id,'Tab"></div></li>'].join('');
				new S.Node(temp).appendTo(navContent);
			});
		}

		function initNavItems(){
			//如果不存在导航项，不用进行自适应计算
			if(navItems.length === 0)
			{
				return;
			}
			
			var count =  navItems.length,
				clientWidth = getAutoWidth(),
				itemWidth = WIDTH_ITERM,
				totalWidth = itemWidth * count,
				showCount = 0;

            //初始化dataIndex
			S.each(navItems,function(item,index){
                new S.Node('<div class="'+CLS_ITEM_MASK+'"></div>').appendTo(item);
				DOM.attr(item,ATTTR_INDEX,index);
				DOM.removeClass(item,CLS_LAST);
			});

			//如果导航项总宽度小于用户可视区域，不用进行自适应计算
			if(totalWidth <= clientWidth){
				return;
			}
			
			

			showCount = parseInt(clientWidth / itemWidth);
			setLastItem(navItems[showCount - 1]);
			hideItmes.push(DOM.clone(lastShowItem,true));
			for(var i = showCount; i < count; i++){
				var item = navItems[i],
					cloneItme = null;
				
				cloneItme = DOM.clone(item,true);
				hideItmes.push(cloneItme);
				DOM.addClass(item,CLS_HIDDEN);
			}

			initHideList();
		}

		function setLastItem(item){
			if(lastShowItem === item){
				return;
			}
				

			var appendNode = null;
			if(lastShowItem){
				appendNode = S.one(lastShowItem).one('.lp-hide-current');
				DOM.removeClass(lastShowItem,CLS_LAST);
				DOM.addClass(lastShowItem,CLS_HIDDEN);
			}
			DOM.addClass(item,CLS_LAST);
			DOM.removeClass(item,CLS_HIDDEN);
			if(!appendNode){
				appendNode = new Node('<span class="lp-hide-current">&nbsp;&nbsp;</span>');
			}
			appendNode.appendTo(S.one(item).children('.nav-item-inner'));
			lastShowItem = item;
		}

		
		function initHideList(){
			if(hideList !== null){
				return;
			}
			
			var template = '<ul class="lp4-hide-list ks-hidden"></ul>',
				hideListEl = new S.Node(template).appendTo('body');
			hideList = hideListEl;
			S.each(hideItmes,function(item){
				DOM.appendTo(item,hideList);
			});

			initHideListEvent();
		}

		function initHideListEvent(){
			if(hideList == null){
				return;
			}
				
			hideList.on('mouseleave',function(){
				hideHideList();
			});

			hideList.on('click',function(event){
				var item = findItem(event.target),
					el = null,
					dataIndex = 0;
				if(item){
					el = S.one(item);
					dataIndex = el.attr(ATTTR_INDEX);
					setModuleSelected(dataIndex);
					hideHideList();
				}
			});
		}
		//显示隐藏列表
		function showHideList(offset){

			hideList.css('left',offset.left);
			hideList.css('top',offset.top);
			hideList.show();
		}
		//隐藏列表不显示
		function hideHideList(){
			hideList.hide();
		}

		function setSelectHideItem(dataIndex){
			var currentItem = null,
				selectItem = null,
				selectEl = null,
				appendNode = null;
			S.each(hideItmes,function(item){
				if(DOM.attr(item,ATTTR_INDEX) == dataIndex){
					selectItem = item;
				}

				if(DOM.hasClass(item,CLS_LAST)){
					currentItem = item;
				}
			});

			if(currentItem !== selectItem){
				if(currentItem){
					appendNode = S.one(currentItem).one('.lp-hide-current');
					DOM.removeClass(currentItem,CLS_LAST);
				}
				DOM.addClass(selectItem,CLS_LAST);
				if(!appendNode){
					appendNode = new Node('<span class="lp-hide-current">&nbsp;&nbsp;</span>');
				}
				selectEl = S.one(selectItem);
				appendNode.appendTo(selectEl.children('.nav-item-inner'));
				selectEl.prependTo(hideList);
			}

		}

		//设置选中的模块
		function setModuleSelected(index,sender){
			if(currentModelIndex !==index){
				var moduleId = getModuleId(index),
					module = null,
					isCreated = true;//模块是否已经创建
                    
				if(!isModuleInitial(moduleId)){
					isCreated = false;
					module = createModule(moduleId);
				}else{
                    module =  getModule(moduleId);
                }

				sender = sender ||S.one(navItems[index]); 
				//如果模块隐藏
				if(sender.hasClass(CLS_HIDDEN) && lastShowItem){
					setLastItem(sender[0]);
					setSelectHideItem(index);
				}
				navItems.removeClass(CLS_SELECTE);
				sender.addClass(CLS_SELECTE);
				navTabs.addClass(CLS_HIDDEN);
				S.one(navTabs[index]).removeClass(CLS_HIDDEN);
			
				currentModelIndex = index;
                curPageId = getCurrentPageId();
				setNavPosition(index,curPageId);
                
                if(!curPageId && module.mainPage){
                    setPageSelected(index,module.mainPage);
                }
				//如果是初次创建，初始化一下Tab的宽度，fix bug of tab
				if(UA.ie === 6 && !isCreated){
					module.tab.autoSetTabNavWidth();
				}
				emit(moduleId,TYPE_MODULE);
			}
		}
		
		//设置选中的页面
		function setPageSelected(moduleIndex,pageId,isReload,search){
			var moduleId = getModuleId(moduleIndex)||moduleIndex,
				module = getModule(moduleId);
			if(module && pageId){
				module.menu.setMenuActive(pageId);
				var item = module.menu.getSelectedItem(),
					href = '',
					suffixIndex = -1;
				if(item && item.id === pageId){
					href = search ? (item.href + '?' + search) : item.href;
					module.tab.addTab({tabId: item.id, tabName: item.text, conUrl: href,isReload:!!isReload});
				}else if(pageId){

					var subDir = pageId.replace('-','/');
					if(subDir.indexOf('/') === -1){
						subDir = moduleId + '/' + subDir;
					}
					if((suffixIndex = pageId.indexOf('.')) === -1){
						subDir += urlSuffix;
					}
					href = search ? (subDir + '?' + search) : subDir;
					module.tab.addTab({tabId:pageId,tabName:'',conUrl:href,isReload:!!isReload});
				}/**/
				emit(moduleId,TYPE_PAGE,href);
			}
		}
		//获取Tab的配置
		function getTabConfig(tabId,height){
			return {
				conId: tabId,
				tabWidth: 140,
				tabRevision: -12,
				conHeight: height
			};
		}
		//获取菜单的配置
		function getMenuConfig(menuId,items){
			return {
				items:items,
				collapible:true,
				renderTo:'#'+menuId//,
			};
		}
		
		//创建菜单和Tab，并绑定关联,是否收缩，是否有首页
		function tabNav(tabConfig,menuConfig,collapse,mainPage){
			
			var _self =this,
				menu = new S.LP.Menu(menuConfig),
				tab = new S.LP.Tab(tabConfig),
				menuContainerEl = S.one(menuConfig.renderTo),
				slibEl = menuContainerEl.next('.' + CLS_LEFT_SLIB_CON),
				navContainerEl = menuContainerEl.parent('.'+CLS_TAB_ITEM);

			if(slibEl){
				slibEl.on('click',function(){
					navContainerEl.toggleClass(CLS_CALLAPSE);
					tab.resizeTab();
				});
			}
            if(collapse){
                navContainerEl.addClass(CLS_CALLAPSE);
				//tab.resizeTab();
            }
			//点击菜单，切换Tab，并刷新
			menu.on('menuclick',function(obj){
				_self.tab.addTab({tabId: obj.id, tabName: obj.text, conUrl: obj.href,isReload:true});
				emit(getCurrentModuleId(),TYPE_PAGE, obj.href);
			});
			//选中的菜单发生改变后，更新链接上的页面编号
			menu.on('selectchanged',function(obj){				
				setNavPosition(currentModelIndex,obj.id);
			});
			//切换Tab激活菜单
			tab.on('tabChanging',function(obj){
				_self.menu.setMenuActive(obj.tabId);
			});
			_self.tab = tab;
			_self.menu = menu;
            _self.mainPage = mainPage;
			
		}
		
		//根据编号获取配置项
		function getModuleConfig(id){
			var result =null;
			S.each(modulesConfig,function(conf){
				if(conf.id === id){
					result = conf;
					return false;
				}
			});
			return result;
		}
		
		//模块是否初始化
		function isModuleInitial(id){
			return !!modules[id];
		}
		
		//获取模块
		function getModule(id){
            var module = modules[id];
            if(!module){
                module = createModule(id);
            }
			return module;
		}
		
		//创建模块
		function createModule(id){
			var item= getModuleConfig(id);
            if(!item){
                return null;
            }
		    var id =item.id,
				tabId = 'J_'+id+'Tab',
				treeId = 'J_'+id+'Tree';
			module = new tabNav(getTabConfig(tabId,getAutoHeight()- 35),getMenuConfig(treeId,item.menu),item.collapse,item.mainPage);
			modules[id]= module;
			return module;
		}

		//获取用户工作区域
		function getAutoHeight(){
			var height = DOM.viewportHeight(),
				subHeight = newVesion ? 70 : 100;
			return height - subHeight;	
		}

		function getAutoWidth(){
			return DOM.viewportWidth();
		}
		//自动设置工作区高度
		function autoSetHeight(){
			var contentHeight = getAutoHeight();
			if(!newVesion && UA.ie === 7){
				contentHeight += 65;
			}
			S.all('.lp4-tab-item').height(contentHeight);
		}
		
		//根据索引获取模块的ID
		function getModuleId(index){
			if(modulesConfig[index]){
				return modulesConfig[index].id;
			}else{
				return index;
			}
		}
		//获取模块索引
		function getModuleIndex(id){
			var result = 0;

			S.each(modulesConfig,function(conf,index){
				if(conf.id === id){
					result = index;
					return false;
				}
			});
			return result;
		}
		//获取当前模块ID
		function getCurrentModuleId(){
			return getModuleId(currentModelIndex);
		}
		//获取当前页ID
		function getCurrentPageId(){
			var moduleId = getCurrentModuleId(),
				module = getModule(moduleId),
				pageId ='';
			if(module){
				var item = module.menu.getSelectedItem();
				if(item){
					pageId = item.id;
				}
			}
			return pageId;
		}
		//获取当前模块的索引
		function getCurrentModuleIndex(){
			var selectedModule = navList.children('.'+CLS_SELECTE);
			return selectedModule.attr(ATTTR_INDEX);
		}
		//从链接上获取当前模块索引，当前页面的ID
		function getNavPositionSetting(){
			var pos = location.hash,
				moduleIndex = 0,
				pageId ='',
				splitIndex = pos.indexOf('/'),
				search = null;
			if(!pos){
				return null;
			}
				
			if(splitIndex >= 0){
				moduleIndex = pos.substring(1,splitIndex);
				pageId = pos.substring(splitIndex + 1);
				search = getParam(pageId);
				if(search){
					pageId = pageId.replace('?'+search,'');
				}
			}else{
				moduleIndex=pos.substring(1);
			}
			// by fuzheng 为了适应数字hash
			//if(isNaN(moduleIndex)){ 
				moduleIndex = getModuleIndex(moduleIndex);
			//}

			return {moduleId : moduleIndex,pageId : pageId,search : search};
		}
		//获取页面的参数
		function getParam(pageId){
			var index = pageId.indexOf('?');
			if(index >= 0){
				return pageId.substring(index + 1);
			}
			return null;
		}
		//设置模块索引
		function setNavPosition(moduleIndex,pageId){
			pageId = pageId||'';

			var moduleId = getModuleId(moduleIndex),
				str = '#'+moduleId;
			if(pageId){
				str += '/'+pageId;
			}
			location.hash =str;
		}
	}


	// 轮询
	function Loop(config){
		var _self = this;
		config = S.merge(Loop.config, config);
		Loop.superclass.constructor.call(_self, config);
		//支持的事件
		_self.events = [
			'timeup'	
		];
		_self._init();
	};
	Loop.config = {
		speed: 10000
	};
	S.extend(Loop, S.Base);
	S.augment(Loop, {
		_init: function(){
			var _self = this,
				timer = window.setInterval(function(){
					_self.fire('timeup');
				}, _self.get('speed'));
			_self.set('timer', timer);
		},
		// 异步
		ajaxFunc: function(config, func, isJsonp){
			var _self = this,
				ajaxConfig = {
				type: 'post',
				dataType: 'json',
				success: function(d){
					func.call(_self, d);
				}
			};
			isJsonp = isJsonp === undefined ? false : isJsonp;
			if(isJsonp){
				ajaxConfig = S.merge(ajaxConfig, {
					type: 'get',
					dataType: 'jsonp',
					cache: false,
					crossDomain: true
				});
			}
			ajaxConfig = S.merge(ajaxConfig, config);
			S.io(ajaxConfig);
		}
	});

	S.namespace('LP');
	S.LP.Loop = Loop;

	//S.app('mainUtil');兼容 kissy 1.3
    window.mainUtil = {};
	mainUtil.mainPage = main;
	return main;
},{
	requires: ['core']
});