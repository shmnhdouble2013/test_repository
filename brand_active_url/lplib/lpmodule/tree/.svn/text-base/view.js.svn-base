/** 
* @fileOverview View 视图功能的Tree
* @author  fuzheng
* @version 2.0
*/
KISSY.add('lpmodule/tree/view', function(S, Base, ViewStore){
    /**
        @exports S.LP.Tree as KISSY.LP.Tree
	*/
	var DOM = S.DOM,
		Event = S.Event;

	/**
	* View 视图功能的Tree
	* @memberOf S.LP.Tree
	* @description 视图功能 负责视图的管理、视图内搜索 继承自Tree.Base 拥有其全部配置项、方法及事件
	* @class View 视图功能的Tree
	* @param {Object} config 配置项 同 Tree.Base配置项
	*/
	function View(config){
		var _self = this;
		config = S.merge(View.config, config);
		if(!config.renderTo || !DOM.get('#' + config.renderTo)){
			throw 'please assign the id of render Dom!';
		}
		View.superclass.constructor.call(_self, config);
		//支持的事件
		_self.events = [
			/**  
			* 增加堆栈list时触发此事件
			* @name S.LP.Tree.View#pushList
			* @event  
			* @param {event} e  事件对象
			* @param {Object} e.list 新增的list对象
			*/
			'pushList',
			/**  
			* 减少堆栈list时触发此事件
			* @name S.LP.Tree.View#popList
			* @event  
			* @param {event} e  事件对象
			* @param {Object} e.list 减少的list对象
			*/
			'popList',
			/**  
			* 手动触发改变选项时 触发此事件
			* @name S.LP.Tree.View#itemChangeSelect
			* @event  
			* @param {event} e  事件对象
			* @param {Object} e.item 触发的选项对象
			* @param {Object} e.data 该选项上绑定的数据
			* @param {Number} e.index 该视图在视图管理器中的索引值
			*/
			'itemChangeSelect',
			/**  
			* 通过视图的主动点击 从而改变视图的已选项时 触发此事件
			* @name S.LP.Tree.View#changeSelectByClick
			* @event  
			* @param {event} e  事件对象
			* @param {Object} e.list 改变的视图对象
			* @param {Object} e.item 改变的数据项
			* @param {Number} e.index 视图在视图管理器中的索引值
			*/
			'changeSelectByClick',
			/**  
			* 通过store对象触发 从而改变视图的已选项时 触发此事件
			* @name S.LP.Tree.View#changeSelectByStore
			* @event  
			* @param {event} e  事件对象
			* @param {Object} e.list 改变的视图对象
			* @param {Object} e.item 改变的数据项
			*/
			'changeSelectByStore',
			/**  
			* 视图管理器的视图路径更新时触发此事件 用于驱动视图的更新
			* @name S.LP.Tree.View#pathUpdate
			* @event  
			* @param {event} e  事件对象
			* @param {Array} e.path 更新后的path
			*/
			'pathUpdate'
		];
		_self._initView();
	}
	S.extend(View, Base);
	S.augment(View, 
	/** @lends  S.LP.Tree.View.prototype */		
	{
		/**
		* 获取视图管理器
		* @return {Object} 视图管理器对象
		*/
		getListManager: function(){
			return this.get('listManager');
		},
		/**
		* 根据id路径更新视图
		* @param {Array} path id路径
		*/
		updateListsByPath: function(path){
			var _self = this,
				store = _self.getStore();
			if(path){
				store.getViewsByPath(path);
			}
		},
		/**
		* 根据id更新视图
		* @param {Number|String} id 目标id
		*/
		updateListsById: function(id){
			var _self = this,
				store = _self.getStore();
			id = id || null;
			store.getViewsById(id);
		},


		// 初始化store 重写该方法 实例化ViewStore
		_initStore: function(){
			var _self = this,
				store = _self.get('store'),
				storeConfig;
			if(!store){
				storeConfig = _self._getStoreConfig();
				store = new ViewStore(storeConfig);			
			}
			_self.set('store', store);
		},

		// tree初始化
		_initView: function(){
			var _self = this;
			_self._initListManager();
			_self._initViewEvent();
			_self.storeLoad();
		},
		// 初始化事件 视图核心控制逻辑
		_initViewEvent: function(){
			var _self = this,
				store = _self.getStore();

			_self.on('loadTree', function(e){
			});

			_self.on('initData', function(e){
				store.getViewsByPath();
				_self.updateListsById(e.id);			
			});

			store.on('popView', function(){
				_self._popList();
			});
			store.on('pushView', function(e){
				_self._pushList(e.view.list);
			});

			store.on('changeSelect', function(e){
				_self._changeSelectByStore(e.id);
			});

			store.on('searchView', function(e){
				_self._updataListForSearch(e.data, e.index, e.text);
			});

			_self.on('itemChangeSelect', function(e){
				_self._changeSelectByClick(e.item, e.index);
			});

			_self.on('changeSelectByClick', function(e){
				_self._getSelectedPath(e.index);
			});

			_self.on('pathUpdate', function(e){
				_self.updateListsByPath(e.path);
			});

			_self.on('changeSelectByStore', function(e){
				var _self = this;
				if(e.item){
					_self._pushResult(e.item.data('nodeData'));					
				}else{
					_self._popResult();					
				}
			});	

			// 切换树的数据
			_self.on('beforeReload', function(){
				_self._destroyView();				
			});

			_self.on('beforeDestroy', function(){
				_self._destroyView();
			});

		},

		// Tree视图控制功能
		// 视图逻辑控制层
		// 初始化视图管理器
		_initListManager: function(){
			var _self = this,
				listManager = {
					listPath: [],
					lists: []
				};
			_self.set('listManager', listManager);
		},
		// 增加视图
		_pushList: function(data){
			var _self = this,
				listManager = _self.getListManager(),
				newList = _self._initList(data, listManager.lists.length);
			listManager.lists.push(newList);
			_self.fire('pushList', {list: newList});
			return newList;			
		},
		// 减少视图
		_popList: function(){
			var _self = this,
				listManager = _self.getListManager(),
				popList = listManager.lists.pop();
			_self._destroyList(popList);
			_self.fire('popList', {list: popList});
			return popList;
		},
		// 手动选择所触发的方法
		_itemChangeSelect: function(item){
			var _self = this,
				itemNodeData = item.data('nodeData') || {};
			_self.fire('itemChangeSelect', {item: item, data: itemNodeData, index: itemNodeData.index});		
		},
		// 获取当前所选的路径，触发视图的更新
		_getSelectedPath: function(index){
			var _self = this,
				listManager = _self.getListManager(),
				path = [];
			if(index === null || index === undefined){
				index = listManager.lists.length - 1;
			}
			S.each(listManager.lists, function(list, i){
				if(i > index){
					return false;
				}
				if(list.selectedId){
					path.push(list.selectedId);
				}
			});

			listManager.listPath = path;

			_self.fire('pathUpdate', {path: path});
		},
		// 视图内搜索功能
		_searchList: function(searchText, index){
			var _self = this,
				store = _self.getStore();
			store.searchView(searchText, index);
		},
		// 根据搜索结果更新视图
		_updataListForSearch: function(data, index, text){
			var _self = this,
				listManager = _self.getListManager(),
				list = listManager.lists[index],
				selectedId = list.selectedId;

			_self._destroyListItems(list);

			_self._initListItems(list, data, index, selectedId, text);
		},
		
		// 视图模板逻辑层
		// 根据点击更新选择的节点
		_changeSelectByClick: function(item, index){
			var _self = this,
				listManager = _self.getListManager(),
				changList = listManager.lists[index];

			if(!_self._isItemSelect(item)){
				_self._removeAllSelectByItem(item);
				_self._addItemSelect(item);
			}

			_self._setListSelected(changList, item, item.data('nodeData').id);

			_self.fire('changeSelectByClick', {list: changList, item: item, index: index});
		},
		// 根据store 更新选择的节点
		_changeSelectByStore: function(id){
			var _self = this,
				listManager = _self.getListManager(),
				changList = listManager.lists[listManager.lists.length - 1],
				items = _self._getItems(changList),
				selectedItem = changList.selectedItem,
				selectedId = changList.selectedId;

			if(!(id && selectedId && selectedId === id)){
				if(selectedItem){
					_self._removeItemSelect(selectedItem);
				}
				if(id){
					S.each(items, function(item){
						item = S.one(item);
						if(item.data('nodeData').id === id){
							selectedItem = item;
							selectedId = id;
							return false;
						}
					});
					_self._addItemSelect(selectedItem);
				}else{
					selectedItem = null;
					selectedId = null;
				}
				_self._setListSelected(changList, selectedItem, selectedId);
			}			

			_self.fire('changeSelectByStore', {list: changList, item: selectedItem});
				
			return selectedItem;
		},
		// 设置视图管理其中的选中节点
		_setListSelected: function(list, item, id){
			list.selectedItem = item;			
			list.selectedId = id;
		},
		// 判断该节点是否为选择
		_isItemSelect: function(item){},
		// 添加该节点的选中状态
		_addItemSelect: function(item){},
		// 移除该节点的选中状态
		_removeItemSelect: function(item){},
		// 根据节点，移除该视图下所有节点的选中状态
		_removeAllSelectByItem: function(item){},
		// 根据视图，移除该视图下所有节点的选中状态
		_removeAllSelectByList: function(list){},

		// 视图模板层
		// 初始化视图
		_initList: function(data, index){
			var _self = this,
				list = {},
				listConDom;

			if(data.length === 0){
				return {};
			}

			listConDom = _self._initListDom(list, index);

			_self._initListData(list, listConDom, index);

			_self._initListItems(list, data, index);

			_self._initListEvent(list);

			return list;
		},
		// 初始化视图数据
		_initListData: function(list, listDom, index){
			var _self = this;
			list.dom = listDom;
			list.index = index;
			_self._setListSelected(list, null, null);
		},
		// 初始化视图dom结构
		_initListDom: function(list, index){},
		// 初始化视图的事件
		_initListEvent: function(list){},
		
		// 初始化视图节点
		_initListItems: function(list, data, index, id, text){
			var _self = this,
				adapterForNode = _self.getStore().get('adapterForNode');
			S.each(data, function(node){ 
				var itemEl,
					nodeData = {
					id: node[adapterForNode.id],
					parent: node[adapterForNode.parent],
					value: node[adapterForNode.value],
					isleaf: node[adapterForNode.isleaf]
				};				
				itemEl = _self._initListItemsDom(list, nodeData, index, id, text);		
				
				if(id && id === nodeData.id){
					_self._addItemSelect(itemEl);
					_self._setListSelected(list, itemEl, id);
				}

				_self._initListItemsEvent(itemEl, list);
				_self._initListItemsData(itemEl, nodeData, index);
			});
		},
		// 初始化视图节点的数据
		_initListItemsData: function(itemEl, nodeData, index){
			nodeData.index = index;
			itemEl.data('nodeData', nodeData);			
		},
		// 初始化视图节点的Dom结构
		_initListItemsDom: function(list, nodeData, index, id, text){},
		// 初始化视图节点的事件
		_initListItemsEvent: function(itemEl, list){},

		// 获取视图下所有节点的对象
		_getItems: function(list){},
		
		// 销毁视图
		_destroyList: function(list){
			var _self = this,
				items;
			if(!S.isEmptyObject(list)){
				_self._destroyListItems(list);
				list.dom.detach().remove();
				list = {};
			}
		},
		// 销毁视图节点
		_destroyListItems: function(list){
			var _self = this,
				items = _self._getItems(list);
			items.detach().remove();	
		},
		// 销毁view对象
		_destroyView: function(){
			var _self = this,
				listManager = _self.getListManager(),
				store = _self.getStore();

			S.each(listManager.lists, function(list){
				_self._destroyList(list);
			});

			listManager.listPath = [];
			listManager.lists = [];	

			store._destroyView();
		}

	});

	return View;

},{requires: ['./base', './viewstore']});



