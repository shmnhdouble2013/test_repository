/** 
* @fileOverview Tab控件
* @author  fuzheng
* @version 2.0
*/
KISSY.add(function(S){
    /**
        @exports S.LP as KISSY.LP
	*/
	var DOM = S.DOM,
		Event = S.Event,
        Node = S.Node;

	var ID_CONTAINER = 'J_TabContainer',
		CLS_CONTAINER = 'lpui-tab-container',
		CLS_NAV_LEFT = 'J_TabNavLeft',
		CLS_NAV_RIGHT = 'J_TabNavRight',
		CLS_NAV_ARROR_ACTIVE = 'lpui-tab-nav-arror-active',
		CLS_NAV_CON = 'J_TabNavCon',
		CLS_ITEM_CON = 'J_TabItemCon',
		ID_NAV_ID = 'J_TabNavId_',
		ID_CON_ID = 'J_TabConId_',
		CLS_NAV_ACTIVE = 'lpui-tab-nav-active',
		CLS_CON_ACTIVE = 'lpui-tab-con-active',
		CLS_TAB_CLOSE = 'lpui-tab-nav-close',
		CLS_TAB_TITLE = 'lpui-tab-nav-title',
		CLS_NAV_TAB = 'lpui-tab-nav-item',
		CLS_NAV = 'lpui-tab-nav',
		CLS_NAV_CONTAINER = 'lpui-tab-nav-con',
		ATTR_SOURCEID = 'data-sourceid';

	/**
	* Tab控件
	* @memberOf S.LP
	* @description 用于生成和管理系统Tab标签与页面
	* @class Tab标签类
	* @param {Object} config 配置项
	* @param {String} [config.conId] 生成Tab组件的ID，默认为 'J_TabContainer'
	* @param {Number} [config.tabWidth] 单个tab的宽度，默认为 140
	* @param {Number} [config.tabRevision] 单个tab的调整宽度，默认为 0 
	* @param {Number} [config.conHeight] 内容页面高度，默认为 500
	* @example 
	* //配置示例
	* var config = {
	*	conId: 'J_TabContainer',
	*	tabWidth: 140,
	*	tabRevision: -12,
	*	conHeight: 500
	* };
	*/
	function Tab(config){
		var _self = this;

		config = config || {};
		if(!config.conId || !DOM.get('#' + config.conId)){
			throw 'please assign the id of rendered Dom!';
		}
		config = S.merge(Tab.config,config);

		Tab.superclass.constructor.call(_self, config);
		//支持的事件
		_self.events = [
			/**  
			* 切换tab之前触发的事件，若返回false，则不切换tab
			* @name S.LP.Tab#tabChanging 
			* @event  
			* @param {event} e  事件对象
			* @param {Object} e.tabId 切换的目标tab的ID
			* @param {Object} e.tabPage 切换的目标tabPage
			*/
			'tabChanging',
			/**  
			* 切换tab之后触发的事件
			* @name S.LP.Tab#tabChanged 
			* @event  
			* @param {event} e  事件对象
			* @param {Object} e.tabId 切换的目标tab的ID
			* @param {Object} e.tabPage 切换的目标tabPage
			*/
			'tabChanged'
		];

		_self._init();
	}

	Tab.config = {
		conId: ID_CONTAINER,
		tabWidth: 140,
		tabRevision: 0,
		conHeight: 500
	};
	S.extend(Tab, S.Base);
	S.augment(Tab, 
	/** @lends  S.LP.Tab.prototype */		
	{
		/**
		* 添加Tab
		* @param {Object} config 配置项
		* @param {String} config.tabId 目标tab的ID，必填项 
		* @param {String} config.conUrl 目标页面的URL，必填项 
		* @param {String} [config.tabName] 目标页面的标题名称，默认为 ‘’，若不填，则取目标页面的title 
		* @param {Number} [config.conType] 目标页面的填充类型，默认为 0，即 iframe模式（目前只有这种模式）
		* @param {String} [config.sourceId] 打开目标tab的源页面的ID，默认为 ‘’ 
		* @param {Boolean} [config.isReload] 当目标tab已存在时，是否刷新一下，默认为 false 
		* @return {Object} 添加的tabPage对象
		*/
		addTab: function(config){
			var tabId = config.tabId,
				conUrl = config.conUrl,
				isReload = config.isReload || false;

			if(!tabId || !conUrl){
				return null;
			}
			var _self = this,
				tabPage = null;

			if(_self.getTab(tabId)){
                tabPage = _self.getTab(tabId);
				_self.changeTab(tabId);
				if(isReload){
					tabPage.reloadTab(conUrl);
				}
			}else{
				// 初始化tabPage对象
				tabPage = new TabPage(config);
				// 绑定 changeTab 事件
				tabPage.on('changeTab', function(ev){
					// 是否添加tab
					if(ev.isAddTab){
						_self._resetNavConWidth();
						_self._addTabPage(ev.tabId, tabPage);
					}
					_self.changeTab(ev.tabId);
				});
				// 绑定 tabDestroyed 事件
				tabPage.on('tabDestroyed', function(ev){
					_self._resetNavConWidth();
					_self._rollStatus().isBlank();
					_self._destroyTabPage(ev.tabPage.get('tabId'));
				});
				// 添加tabPage
				tabPage.addTab(_self.get('navConElm'), _self.get('itemConElm'), _self.get('conHeight'));

			}

			return tabPage;

		},

		/**
		* 切换Tab
		* @param {String} tabId 要切换的目标tab的ID，必填项 
		* @return {Object} 切换的tabPage对象
		*/
		changeTab: function(tabId){
			var _self = this,
				tabPage = _self.getTab(tabId);
			if(_self.fire('tabChanging', {'tabId': tabId, 'tabPage': tabPage}) === false){
				return null;
			}
			if(tabId === 'none'){
				_self.setActiveId(null);
				return null;
			}
			if(!tabPage){
				return null;
			} 
			var	tabEl = tabPage.get('tabObj'),
				conEl = tabPage.get('conObj');
			if(tabEl.hasClass(CLS_NAV_ACTIVE)){
				return tabPage;
			}
			if(_self.getActiveTab()){
				var activeTabPage = _self.getActiveTab(),
					acticeTabEl = activeTabPage.get('tabObj'),
					acticeConEl = activeTabPage.get('conObj');
				acticeTabEl.removeClass(CLS_NAV_ACTIVE);
				acticeConEl.removeClass(CLS_CON_ACTIVE);			
			}
			tabEl.addClass(CLS_NAV_ACTIVE);
			conEl.addClass(CLS_CON_ACTIVE);
			
			_self.setActiveId(tabId);

			if(_self._rollStatus().isRoll()){
				_self._rollNav('activeTab');
			}

			_self.fire('tabChanged', {'tabId': tabId, 'tabPage': tabPage});

			return tabPage;

		},

		/**
		* 关闭Tab
		* @param {String} tabId 要关闭的tab的ID，必填项 
		* @return {Object} 关闭的tabPage对象
		*/
		closeTab: function(tabId){
			var _self = this,
				tabPage = _self.getTab(tabId);
			if(tabPage){
				tabPage.closeTab();
			}
			return tabPage;
		},

		/**
		* 获取tabPage对象
		* @param {String} tabId 要获取的目标tabPage对象，必填项 
		* @return {Object} tabPage对象
		*/
		getTab: function(tabId){
			var _self = this;
			return tabId ? (_self.get('tabManage')[tabId] || null) : null;
		},

		/**
		* 获取当前激活的tabPage对象
		* @return {Object} tabPage对象
		*/
		getActiveTab: function(){
			var _self = this,
				activeId = _self.getActiveId();
			return _self.getTab(activeId);
		},

		/**
		* 获取某一个页面的源页面
		* @param {String} [tabId] tabpage的id，不填则默认取当前页面 
		* @return {Object} tabPage对象
		*/
		getSourceTab: function(tabId){
			var _self = this,
				targetTab = tabId ? _self.getTab(tabId) : _self.getActiveTab(),
				sourceTabId,
				sourceTab = null;

			if(targetTab){
				sourceTabId = targetTab.get('tabObj').attr(ATTR_SOURCEID);
				if(sourceTabId){
					sourceTab = _self.getTab(sourceTabId);
				}
			}
			return sourceTab;		
		},

		getActiveId: function(){
			var _self = this;
			return _self.get('activeTabId');		
		},
		
		setActiveId: function(tabId){
			var _self = this,
				tabPage = _self.getTab(tabId),
				oldTabPage = _self.getActiveTab();
			_self.set('activeTabId', tabId);
			if(oldTabPage){
				oldTabPage.setActive(false);
			}
			if(tabPage){
				tabPage.setActive(true);
			}
		},

		/**
		* 重置tab尺寸
		* @return {Object} tab对象
		*/
		resizeTab: function(){
			var _self = this,
				tabManage = _self.get('tabManage'),
				eventName = 'tabResize';
			// nav的自适应操作
			_self.autoSetTabNavWidth();
			if(_self._rollStatus().isRoll()){
				_self._rollNav('activeTab');
			}
			_self._rollStatus().isBlank();
			// 通知tabPage
			S.each(tabManage, function(tabPage){
				if(tabPage.getActive()){
					tabPage.fire(eventName, {'tabPage': tabPage});
				}else{
					tabPage.lazyFire(eventName, 'active');
				}
			});
			return _self;
		},

		/**
		* 销毁tab对象
		*/
		destroyTab: function(){
			var _self = this,
				container = _self.get('container'),
				tabManage = _self.get('tabManage');
			S.each(tabManage, function(tabPage){
				tabPage.destroyTabPage();			
			});			
			_self.detach();
			container.innerHTML = '';
		},

		// 初始化
		_init: function(){
			var _self = this,
				container = _self.get('container'),
				conId = _self.get('conId');

			if(!container){
				container = DOM.get('#'+conId);
				DOM.addClass(container, CLS_CONTAINER);
				_self.set('container', container);
			}

			// 初始化tab容器
			var	tabContainerStr = ['<div class="', CLS_NAV, '">',
					'	<s class="lpui-tab-nav-arror lpui-tab-nav-arror-left ', CLS_NAV_LEFT, '">&lt;</s>',
					'	<div class="lpui-tab-nav-border">',
					'		<div class="', CLS_NAV_CONTAINER, '">',
					'			<ul class="lpui-tab-nav-con-inner ks-clear ', CLS_NAV_CON, '">',
					'			</ul>',
					'		</div>',
					'	</div>',
					'	<s class="lpui-tab-nav-arror lpui-tab-nav-arror-right ', CLS_NAV_RIGHT, '">&gt;</s>',
					'</div>',
					'<div class="lpui-tab-con ', CLS_ITEM_CON, '">',
					'</div>'].join(''),
				tabContainerEl = new Node(tabContainerStr);

			tabContainerEl.appendTo(container);
			_self.autoSetTabNavWidth();
			_self.set('navConElm', DOM.get('.' + CLS_NAV_CON, container));
			_self.set('itemConElm', DOM.get('.' + CLS_ITEM_CON, container));

			// 绑定左右滚动事件
			var navLeft = S.one('.' + CLS_NAV_LEFT, container),
				navRight = S.one('.' + CLS_NAV_RIGHT, container);

			navLeft.on('click', function(){
				if(S.one(this).hasClass(CLS_NAV_ARROR_ACTIVE)){
					_self._rollNav('left');
				}
			});
			navRight.on('click', function(){
				if(S.one(this).hasClass(CLS_NAV_ARROR_ACTIVE)){
					_self._rollNav('right');
				}

			});

			_self.set('navLeft', navLeft);
			_self.set('navRight', navRight);		
			
			// 建立tabPage管理对象
			_self.set('tabManage', {});

		},
		// 设置tab导航容器外部容器的宽度
		autoSetTabNavWidth: function(){
			if(S.UA.ie === 6){
				var _self = this,
					container = _self.get('container'),
					width = S.one('.' + CLS_NAV).width() - 50;	
				S.one('.' + CLS_NAV_CONTAINER).css('width', width + 'px');		
			}
		},
		
		// 添加tabPage对象的引用
		_addTabPage: function(tabId, tabPage){
			var _self = this,
				tabManage = _self.get('tabManage');
			tabManage[tabId] = tabPage;
			return _self;
		},

		// 销毁tabPage对象的引用
		_destroyTabPage: function(tabId){
			var _self = this,
				tabManage = _self.get('tabManage');
			delete tabManage[tabId];

			if(_self.getActiveId() === tabId){
				_self.setActiveId(null);
			}
		},

		// 重置当前nav容器宽度
		_resetNavConWidth: function(){
			var _self = this,
				tabWidth = _self.get('tabWidth'),
				tabRevision = _self.get('tabRevision'),
				navConElm = _self.get('navConElm'),
				_width = DOM.children(navConElm).length * (tabWidth + tabRevision) - tabRevision;

			DOM.width(navConElm, _width + 'px');
			_self.set('navWidth', _width);
			return _self;
		},

		// 判断是否需要滚动
		_rollStatus: function(){
			var _self = this,
				navConElm = _self.get('navConElm'),
				navContainer = DOM.parent(navConElm, '.' + CLS_NAV_CONTAINER),
				navConWidth = _self.get('navWidth'),
				navContainerWidth = navContainer.offsetWidth,
				navConLeft = DOM.css(navConElm, 'left').replace('px', '') * 1 || 0,
				navLeft = _self.get('navLeft'),
				navRight = _self.get('navRight');
			
			var resetArrow = function(){
				if(navConWidth + navConLeft - navContainerWidth > 0){
					navRight.addClass(CLS_NAV_ARROR_ACTIVE);
				}else{
					navRight.removeClass(CLS_NAV_ARROR_ACTIVE);
				}
				if(navConLeft < 0){
					navLeft.addClass(CLS_NAV_ARROR_ACTIVE);
				}else{
					navLeft.removeClass(CLS_NAV_ARROR_ACTIVE);
				}
			};

			var isRoll = function(){
				resetArrow();
				if(navContainerWidth < navConWidth){
					return true;
				}
				return false;
			};

			var isBlank = function(){
				var navConLeftAbs = Math.abs(navConLeft);
				if(navContainerWidth + navConLeftAbs > navConWidth){
					_self._rollNav({'target': 1, 'distance': navContainerWidth + navConLeftAbs - navConWidth});
					return true;
				}
				return false;
			};

			return {
				resetArrow: resetArrow,
				isRoll: isRoll,
				isBlank: isBlank
			};
		},
		
		/**
		* 导航滚动
		* @param {Object} rollType 滚动模式，必填项 
		* rollType = 'left'
		* rollType = 'right'
		* rollType = 'activeTab'
		* rollType = {'target': 1, 'distance': 100}
		*/
		_rollNav: function(rollType){
			var _self = this,
				navConElm = _self.get('navConElm'),
				tabWidth = _self.get('tabWidth'),
				tabRevision = _self.get('tabRevision'),
				navContainer = DOM.parent(navConElm, '.' + CLS_NAV_CONTAINER),
				navConWidth = _self.get('navWidth'),
				navContainerWidth = navContainer.offsetWidth,
				navConLeft = DOM.css(navConElm, 'left').replace('px', '') * 1 || 0;
						
			var roll = function(target, distance){
				/* target = 1 => roll right
				   target = -1 => roll left */
				var targetPos = navConLeft + target * distance;
				targetPos = targetPos > 0 ? 0 : 
					navContainerWidth - navConWidth - targetPos> 0 ? navContainerWidth - navConWidth : targetPos;
				
				//DOM.css(navConElm, {'left': targetPos + 'px'});
				_self._rollTabAnim(targetPos, function(){
					_self._rollStatus().resetArrow();
				}).run();

			};
			
			if(rollType === 'left'){
				roll(1, tabWidth);
			}else if(rollType === 'right'){
				roll(-1, tabWidth);
			}else if(rollType === 'activeTab'){
				var tabPage = _self.getActiveTab(),
					tabEl = tabPage.get('tabObj'),
					tabPosToNav = S.indexOf(tabEl[0], DOM.children(navConElm)) * (tabWidth + tabRevision),
					navConLeftAbs = Math.abs(navConLeft),
					viewRang = [navConLeftAbs, navConLeftAbs + navContainerWidth - tabWidth];
				
				if(tabPosToNav < viewRang[0]){
					roll(1, navConLeftAbs - tabPosToNav);
				}else if(tabPosToNav > viewRang[1]){
					roll(-1, tabPosToNav + tabWidth - navConLeftAbs - navContainerWidth);
				}
			}else if(rollType.target && rollType.distance){
				roll(rollType.target, rollType.distance);
			}

		},

		// 导航滚动动画
		_rollTabAnim: function(targetPos, func){
			var _self = this;
			return S.Anim(_self.get('navConElm'), {'left': targetPos + 'px'}, 0.5, 'easeOut', func);			
		}

	});





	/**
	* TabPage 对象类
	* @memberOf S.LP
	* @description 单个tab页面的类
	* @class TabPage类
	* @param {Object} config 配置项
	* @param {String} config.tabId 目标tab的ID，必填项 
	* @param {String} config.conUrl 目标页面的URL，必填项 
	* @param {String} [config.tabName] 目标页面的标题名称，默认为 ‘’，若不填，则取目标页面的title 
	* @param {Number} [config.conType] 目标页面的填充类型，默认为 0，即 iframe模式（目前只有这种模式）
	* @param {String} [config.sourceId] 打开目标tab的源页面的ID，默认为 ‘’ 
	*/
	function TabPage(config){
		var _self = this;

		config = config || {};
		if(!config.tabId || !config.conUrl){
			throw 'please assign the id and the url of rendered Tab!';
		}
		config = S.merge(TabPage.config, config);

		TabPage.superclass.constructor.call(_self, config);
		//支持的事件
		_self.events = [
			/**  
			* 增加tab之前触发的事件，若返回false，则不切换tab
			* @name S.LP.TabPage#tabAdding 
			* @event  
			* @param {event} e  事件对象
			* @param {Object} e.tabPage tabPage对象
			*/
			'tabAdding',
			/**  
			* 增加tab之后触发的事件，若返回false，则不切换tab
			* @name S.LP.TabPage#tabAdded
			* @event  
			* @param {event} e  事件对象
			* @param {Object} e.tabPage tabPage对象
			*/
			'tabAdded',
			/**  
			* 关闭tab之前触发的事件，若返回false，则不切换tab
			* @name S.LP.TabPage#tabClosing 
			* @event  
			* @param {event} e  事件对象
			* @param {Object} e.tabPage tabPage对象
			*/
			'tabClosing',
			/**  
			* 关闭tab之后触发的事件，若返回false，则不切换tab
			* @name S.LP.TabPage#tabClosed 
			* @event  
			* @param {event} e  事件对象
			* @param {Object} e.tabPage tabPage对象
			*/
			'tabClosed',
			/**  
			* tab对象变成当前tab
			* @name S.LP.TabPage#active
			* @event  
			* @param {event} e  事件对象
			* @param {Object} e.tabPage tabPage对象
			*/
			'active',
			/**  
			* tab对象变成非当前tab
			* @name S.LP.TabPage#inactive
			* @event  
			* @param {event} e  事件对象
			* @param {Object} e.tabPage tabPage对象
			*/
			'inactive',
			/**  
			* tab切换触发器 主要供内部使用
			* @name S.LP.TabPage#changeTab
			* @event  
			* @param {event} e  事件对象
			* @param {Object} e.tabId 切换的目标tab的ID
			* @param {Object} e.isAddTab 是否是增加tab时的切换
			*/
			'changeTab',
			/**  
			* tabPage对象销毁后触发的事件 主要供内部使用
			* @name S.LP.TabPage#tabDestroyed
			* @event  
			* @param {event} e  事件对象
			* @param {Object} e.tabPage tabPage对象
			*/
			'tabDestroyed',
			/**  
			* 通知tabPage重置大小
			* @name S.LP.TabPage#resizeTab
			* @event  
			* @param {event} e  事件对象
			* @param {Object} e.tabPage tabPage对象
			*/
			'tabResize'
		];
	}
	
	TabPage.config = {
		tabName: '',
		conType: 0,
		sourceId: ''
	};

	S.extend(TabPage, S.Base);
	S.augment(TabPage, 
	/** @lends  S.LP.TabPage.prototype */		
	{	
		/**
		* 添加Tab
		* @param {Object} navConElm nav容器，必填项
		* @param {Object} itemConElm con容器，必填项
		* @param {Number} conHeight tab页面容器高度，必填项
		* @return {Object} tabPage对象
		*/
		addTab: function(navConElm, itemConElm, conHeight){
			var _self = this;

			if(_self.fire('tabAdding', {'tabPage': _self}) === false){
				return;
			}

			var tabId = _self.get('tabId'),
				sourceId = _self.get('sourceId'),
				tabName = _self.get('tabName'),

				tabSrc = ['<li class="', CLS_NAV_TAB, '" id="', ID_NAV_ID, tabId, '" ', ATTR_SOURCEID, '="', sourceId, '" title="', tabName, '"><span class="', CLS_TAB_TITLE, '">', tabName, '</span><s class="', CLS_TAB_CLOSE, '">X</s></li>'].join(''),
				conSrc = ['<div class="lpui-tab-con-item" id="', ID_CON_ID, tabId, '"></div>'].join(''),
				
				tabObj = new Node(tabSrc),
				conObj = new Node(conSrc);

			_self.set('tabObj', tabObj);
			_self.set('conObj', conObj);

			tabObj.css('opacity', '0')
				.on('click', function(){
					_self.fire('changeTab', {'tabId': tabId});
				})
				.appendTo(navConElm)
				.children('.' + CLS_TAB_CLOSE)
				.on('click', function(ev){
					_self.closeTab();
					ev.stopPropagation();
				});

			_self._setConInner(itemConElm, conHeight);

			_self.fire('changeTab', {'tabId': tabId, 'isAddTab': true});

			
			// 动画
			_self._addTabAnim(function(){
				_self.fire('tabAdded', {'tabPage': _self});
			}).run();

			if(tabName === ''){
				_self.resetTitle({'load':true});
			}

			return _self;
		
		},

		/**
		* 关闭Tab
		* @return {Object} tabPage对象
		*/
		closeTab: function(){
			var _self = this,
				tabEl = _self.get('tabObj'),
				conEl = _self.get('conObj');
			
			if(!tabEl || !conEl){
				return;
			}	

			if(_self.fire('tabClosing', {tabPage: _self}) === false){
				return;
			}

			if(tabEl.hasClass(CLS_NAV_ACTIVE)){
				_self.fire('changeTab', {'tabId': _self._findNearTab()});
			}
			
			// 动画
			_self._closeTabAnim(function(){
				_self.fire('tabClosed', {'tabPage': _self});
				_self.destroyTabPage();
			}).run();

			return _self;
		},
		
		getActive: function(){
			var _self = this;
			return _self.get('active') || false;
		},
		setActive: function(isActive){
			var _self = this;
			_self.set('active', isActive);
			if(isActive){
				_self.fire('active', {'tabPage': _self});
			}else{
				_self.fire('inactive', {'tabPage': _self});
			}
		},

		/**
		* 销毁tabPage对象
		*/
		destroyTabPage: function(){
			var _self = this;
			_self.get('tabObj').remove();
			_self._destroyTabCon();
			_self.fire('tabDestroyed', {'tabPage': _self});
			_self.detach();
		},
		// 销毁iframe
		_destroyTabCon: function(){
			var _self = this,
				conEl = _self.get('conObj'),
				iframe = conEl.children('iframe')[0];
			// 关闭窗口
			iframe.src = '';
			conEl.remove();		
		},

		/**  
		* 重置Tab标题
		* @param {Object} config 配置项
		* @param {String} [config.title] 重置的title，默认为 '' ，若不提供title, 则去内部页面的title 
		* @param {Boolean} [config.load] 是否在页面载入之后再取title，默认为false 
		* @return {Object} tabPage对象
		*/
		resetTitle: function(config){
			// config: title load(boolean)
			var _self = this,
				targetTitle = config.title || null,
				isLoad = config.load || false,
				conType = _self.get('conType'),
				tabEl, 
				conEl, 
				targetIframe;

			tabEl = _self.get('tabObj');
			conEl = _self.get('conObj');

			var _setTitle = function(iframe){
				if(iframe){
					targetTitle = iframe.contentWindow.document.title;
				}
				tabEl.attr('title', targetTitle).children('.' + CLS_TAB_TITLE)[0].innerHTML = targetTitle;
			};

			if(targetTitle){
				_setTitle();
			}else if(conType === 0){
				targetIframe = conEl.children('iframe')[0];
				if(isLoad){
					Event.on(targetIframe, 'load', function(){
						_setTitle(targetIframe);
						Event.detach(targetIframe, 'load');
					});			
				}else{
					_setTitle(targetIframe);
				}
			}
			return _self;
		},

		/** 
		* 重新加载tab页面
		* @return {Object} tabPage对象
		*/
		reloadTab: function(href){
			var _self = this,
				conEl = _self.get('conObj'),
				conUrl = href || _self.get('conUrl'),
				conType = _self.get('conType');
			
			if(conType === 0){
				var iframeEl = conEl.children('iframe');
				iframeEl.attr('src', conUrl);
			}else{				

			}
			return _self;
		},

		/**
		* 事件懒触发，根据bindCase 来触发事件
		* @param {String} bindType 需要触发的事件 
		* @param {Object} bindCase 触发条件 
		*/
		lazyFire: function(bindType, bindCase){
			if(!bindType || !bindCase){
				 return;
			}
			var _self = this,
				lazyFireManager = _self.get('lazyFire') || {};
			if(!_self.get('lazyFire')){
				_self.set('lazyFire', lazyFireManager);
			}
			if(lazyFireManager[bindType]){
				_self.detach(bindCase, lazyFireManager[bindType]);
			}
			lazyFireManager[bindType] = function(){
				if(bindType){
					_self.fire(bindType, {'tabPage': _self});
					_self.detach(bindCase, lazyFireManager[bindType]);
					delete lazyFireManager[bindType];		
				}					
			};
			_self.on(bindCase, lazyFireManager[bindType]);
		},

		// 当关闭tab时，寻找就近的tab进行切换，返回tabId 或 ‘none’
		_findNearTab: function(){
			var _self = this,
				tabEl = _self.get('tabObj'),
				nearTabId = 'none',
				nearTab = tabEl.prev('.' + CLS_NAV_TAB) || tabEl.next('.' + CLS_NAV_TAB);
			if(nearTab){
				nearTabId = nearTab.attr('id').replace(ID_NAV_ID, '');
			}			
			return nearTabId;		
		},

		// 填充tab容器内容
		_setConInner: function(itemConElm, conHeight){
			var _self = this,
				_itemEl = null,
				conEl = _self.get('conObj'),
				conUrl = _self.get('conUrl'),
				conType = _self.get('conType');

			var _getIframe = function(conUrl){
				var iframeSrc = ['<iframe src="', conUrl, '" width="100%" height="', conHeight, '" frameborder="0"></iframe>'].join(''),
					iframeEl = DOM.create(iframeSrc);
				return iframeEl;
			};

			var _getDomData = function(conUrl){
				
			};

			/*	conType = 0 或默认 => iframe
				conType = 1 => domData	*/
			if(conType === 0){
				_itemEl = _getIframe(conUrl);
			}else{
				_itemEl = _getDomData(conUrl);
			}
			conEl.append(_itemEl).appendTo(itemConElm);
			return _self;
		},

		// 添加tab动画
		_addTabAnim: function(func){
			var _self = this,
				tabEl = _self.get('tabObj'),
				tabWidth = tabEl.css('width'),
				tabPaddingLeft = tabEl.css('padding-left'),
				tabPaddingRight = tabEl.css('padding-right');
			tabEl.css('width', '0');
			tabEl.css('padding-left', '0');
			tabEl.css('padding-right', '0');
			return S.Anim(tabEl, {'width': tabWidth, 'padding-left': tabPaddingLeft, 'padding-right': tabPaddingRight, 'opacity': '1'}, 0.5, 'easeOut', func);			
		},
		
		// 关闭tab动画
		_closeTabAnim: function(func){
			var _self = this,
				tabEl = _self.get('tabObj');
			return S.Anim(tabEl, {'width': '0', 'padding-left': '0', 'padding-right': '0', 'opacity': '0'}, 0.5, 'easeOut', func);			
		}

	});

	S.namespace('LP');
	S.LP.Tab = Tab;

}, {
    requires: ['core']
});

/*
UPDATE 2.0 :
建立TabPage类，将每一页tab对象化管理，可以绑定事件、单个销毁、支持丰富事件供触发使用

TODO：
1、控件销毁  ok
2、tabPage支持domData

*/








