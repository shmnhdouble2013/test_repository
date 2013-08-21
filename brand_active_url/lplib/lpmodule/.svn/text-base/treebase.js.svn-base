/** 
* @fileOverview TreeBase 树的基类
* @author  fuzheng
* @version 1.0
*/
KISSY.add(function(S){
    /**
        @exports S.LP as KISSY.LP
	*/
	var DOM = S.DOM,
		Event = S.Event;

	/**
	* TreeBase 树的基类
	* @memberOf S.LP
	* @description 树的基类 拥有视图控制功能
	* @class TreeBase 树的基类
	* @param {Object} config 配置项
	*/
	function TreeBase(config){
		var _self = this;
		config = S.merge(TreeBase.config, config);
		if(!config.renderTo || !DOM.get('#' + config.renderTo)){
			throw 'please assign the id of render Dom!';
		}
		TreeBase.superclass.constructor.call(_self, config);
		//支持的事件
		_self.events = [
			/**  
			* 代理TreeStore的load事件 树的数据加载完成后 触发此事件
			* @name S.LP.TreeBase#load
			* @event  
			* @param {event} e  事件对象
			* @param {String} e.data 加载的数据
			* @param {Array} e.id 父节点id
			* @param {Array} e.param 加载参数
			*/
			'load',
			/**  
			* 代理TreeStore的searchTree事件 通过text遍历搜索树后 触发此事件
			* @name S.LP.TreeBase#searchTree
			* @event  
			* @param {event} e  事件对象
			* @param {String} e.text 搜索的文本值
			* @param {Array} e.pathList 搜索的路径id集合
			* @param {Array} e.valuePathList 搜索的路径value集合
			* @param {Object} e.result 搜索结果
			*/
			'searchTree',
			/**  
			* 增加堆栈结果集时触发该事件
			* @name S.LP.TreeBase#resultPush
			* @event  
			* @param {event} e  事件对象
			* @param {Object} e.resultObj 新增的结果对象
			* @param {Array} e.result 当前结果集
			*/
			'resultPush',
			/**  
			* 减少堆栈结果集时触发该事件
			* @name S.LP.TreeBase#resultPop
			* @event  
			* @param {event} e  事件对象
			* @param {Object} e.resultObj 减少的结果对象
			* @param {Array} e.result 当前结果集
			*/
			'resultPop',
			/**  
			* 结果集更新是时触发该事件 pop和push都会触发
			* @name S.LP.TreeBase#resultUpdate
			* @event  
			* @param {event} e  事件对象
			* @param {Array} e.result 当前结果集
			*/
			'resultUpdate',
			/**  
			* 在销毁对象前 触发此事件
			* @event  
			* @name S.LP.TreeBase#beforeDestroy
			*/
			'beforeDestroy',
			/**  
			* 增加堆栈list时触发此事件
			* @name S.LP.TreeBase#pushList
			* @event  
			* @param {event} e  事件对象
			* @param {Object} e.list 新增的list对象
			*/
			'pushList',
			/**  
			* 减少堆栈list时触发此事件
			* @name S.LP.TreeBase#popList
			* @event  
			* @param {event} e  事件对象
			* @param {Object} e.list 减少的list对象
			*/
			'popList',
			/**  
			* 手动触发改变选项时 触发此事件
			* @name S.LP.TreeBase#itemChangeSelect
			* @event  
			* @param {event} e  事件对象
			* @param {Object} e.item 触发的选项对象
			* @param {Object} e.data 该选项上绑定的数据
			* @param {Number} e.index 该视图在视图管理器中的索引值
			*/
			'itemChangeSelect',
			/**  
			* 通过视图的主动点击 从而改变视图的已选项时 触发此事件
			* @name S.LP.TreeBase#changeSelectByClick
			* @event  
			* @param {event} e  事件对象
			* @param {Object} e.list 改变的视图对象
			* @param {Object} e.item 改变的数据项
			* @param {Number} e.index 视图在视图管理器中的索引值
			*/
			'changeSelectByClick',
			/**  
			* 通过treeStore对象触发 从而改变视图的已选项时 触发此事件
			* @name S.LP.TreeBase#changeSelectByStore
			* @event  
			* @param {event} e  事件对象
			* @param {Object} e.list 改变的视图对象
			* @param {Object} e.item 改变的数据项
			*/
			'changeSelectByStore',
			/**  
			* 视图管理器的视图路径更新时触发此事件 用于驱动视图的更新
			* @name S.LP.TreeBase#pathUpdate
			* @event  
			* @param {event} e  事件对象
			* @param {Array} e.path 更新后的path
			*/
			'pathUpdate'
		];
		_self.__init();
	}
	TreeBase.config = 
	/** @lends  S.LP.TreeBase.prototype */		
	{
		/**
		* 树渲染dom的容器ID (必填)
		* @field
		* @type String
		*/
		renderTo: null,
		/**
		* 存储选择结果的容器Id（选填, 没有则不写入结果，此处写入的是选择节点的id）
		* @field
		* @type String
		*/
		resultId: null,
		/**
		* 获取结果的类型 可选填的值有：'result', 'id', 'value', 'path', 'valuePath', 'valueStr' 可以组合多个类型的值 用空格隔开
		* @field
		* @type String
		* @default  'result'
		*/
		resultType: 'result',
		/**
		* 传入treeStore对象
		* @field
		* @type Object
		*/
		store: null,
		/**
		* 这里是 treeStoreConfig.url 的简写形式，用于数据异步读取url（选填，不填的话可以手动设置树的数据）
		* @field
		* @type String
		*/
		url: null,
		/**
		* 这里是 treeStoreConfig.idKey 的简写形式，用于标识节点数据中，id的key（选填, 不填的话默认是 adapterForNode.id）
		* @field
		* @type String
		*/
		idKey: null,
		/**
		* 这里是 treeStoreConfig.param 的简写形式，用于数据读取的初始化参数，与 url 配合适用（选填）
		* @field
		* @type Object
		* @default  {}
		*/
		param: {},
		/**
		* 在这里进行treeStore的配置，具体配置项请参见treeSore（选填）
		* @field
		* @type Object
		*/
		treeStoreConfig: {}
	};
	S.extend(TreeBase, S.Base);
	S.augment(TreeBase, 
	/** @lends  S.LP.TreeBase.prototype */		
	{
		// 关于树
		/**
		* 调用treeStore的load方法，载入tree的数据
		* @param {Object|String} [param] 参数对象 或 需要加载的id (不填则取默认的参数对象，若是String，则会用idKey配置参数对象)
		*/
		treeStoreLoad: function(param){
			var _self = this,
				treeStore = _self.getTreeStore();
			treeStore.load(param);
		},
		/**
		* 获取treeStore对象
		* @return {Object} treeStore对象
		*/
		getTreeStore: function(){
			return this.get('treeStore');
		},
		/**
		* 调用treeStore的searchTree方法，通过文本搜索树 此方法会触发searchTree事件
		* @param {String} searchText 要搜索的文本
		* @return {Object} 搜索结果
		*/
		searchTree: function(searchText){
			var _self = this,
				treeStore = _self.getTreeStore();
			return treeStore.searchTree(searchText);
		},

		// 关于结果
		/**
		* 获取结果对象
		* @return {Array} 结果集列表
		*/
		getResult: function(){
			return this.get('result');
		},		
		/**
		* 获取选中结果的ID
		* @return {Number|String} 选中结果的ID
		*/
		getIdFromResult: function(){
			var _self = this,
				result = _self.getResult();
			if(result.length === 0){
				return null;
			}			
			return result[result.length - 1].id;
		},
		/**
		* 获取选中结果的velue
		* @return {String} 选中结果的velue
		*/
		getValueFromResult: function(){
			var _self = this,
				result = _self.getResult();
			if(result.length === 0){
				return null;
			}			
			return result[result.length - 1].value;
		},
		/**
		* 获取结果的ID路径
		* @return {Array} ID路径
		*/
		getPathFromResult: function(){
			var _self = this,
				result = _self.getResult(),
				path = [];

			S.each(result, function(_result){
				path.push(_result.id);			
			});

			return path;
		},
		/**
		* 获取结果的value路径
		* @return {Array} value路径
		*/
		getValuePathFromResult: function(){
			var _self = this,
				result = _self.getResult(),
				valuePath = [];

			S.each(result, function(_result){
				valuePath.push(_result.value);			
			});

			return valuePath;
		},
		/**
		* 获取结果的value路径字符串形式
		* @return {String} value路径字符串形式
		*/
		getValueStrFromResult: function(){
			var _self = this,
				result = _self.getResult(),
				valuePath = [],
				STR_NEXT_NODE = ' > ',
				value;

			S.each(result, function(_result){
				var valueStr = _result.value;
				if(!_result.isleaf){
					valueStr += STR_NEXT_NODE;
				}
				valuePath.push(valueStr);
			});

			return valuePath.join('');
		},
		/**
		* 根据resultInput的值 初始化数据
		*/
		initData: function(){
			var _self = this,
				resultInput = _self.get('resultInput'),
				resultTypeList = _self.get('resultType').split(' '),
				result = null,
				id = null;
			if(resultInput){
				result = S.JSON.parse(resultInput.val());
				if(result !== null){
					if(S.inArray('result', resultTypeList)){
						id = result['result'][result['result'].length - 1].id;
					}else if(S.inArray('id', resultTypeList)){
						id = result['id'];
					}else if(S.inArray('path', resultTypeList)){
						id  = result['path'][result['path'].length - 1];
					}
				}
			}
			_self.updateListsById(id);
		},
		/**
		* 判断当前结果集是否为空
		* @return {Boolean} 是否为空
		*/
		isBlankResult: function(){
			var _self = this,
				result = _self.get('result'),
				isBlank = false;
			if(result.length === 0){
				isBlank = true;
			}
			return isBlank;
		},
		/**
		* 判断当前结果是不是叶子节诶点
		* @return {Boolean} 是否是叶子节点 若结果集为空，也会返回false
		*/
		isLeafResult: function(){
			var _self = this,
				result = _self.get('result'),
				isLeaf = false;
			if(!_self.isBlankResult()){
				isLeaf = result[result.length - 1].isleaf;
			}
			return isLeaf;
		},

		// 关于视图
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
				treeStore = _self.getTreeStore();
			treeStore.getViewsByPath(path);
		},
		/**
		* 根据id更新视图
		* @param {Number|String} id 目标id
		*/
		updateListsById: function(id){
			var _self = this,
				treeStore = _self.getTreeStore();
			treeStore.getViewsById(id);
		},


		/**
		* 销毁tree对象
		*/
		destroy: function(){
			var _self = this,
				treeStore = _self.get('treeStore'),
				container = _self.get('container'),
				listManager = _self.getListManager();

			_self.fire('beforeDestroy');

			S.each(listManager.lists, function(list){
				_self._destroyList(list);
			});
			treeStore.destroy();
			container[0].innerHTML = '';			
			_self.detach();		
			_self = null;
		},


		// tree初始化
		__init: function(){
			var _self = this,
				container = S.one('#' + _self.get('renderTo')),
				resultInput = S.one('#' + _self.get('resultId')),
				result = [];

			_self._initTreeStore();

			_self.set('container', container);
			if(resultInput){
				_self.set('resultInput', resultInput);
			}
	
			_self.set('result', result);

			_self.__initEvent();
		},
		// 初始化事件
		__initEvent: function(){
			var _self = this,
				treeStore = _self.getTreeStore();

			// 代理treeStore的searchTree事件
			treeStore.on('searchTree', function(e){
				_self.fire('searchTree', {
					text: e.text,
					pathList: e.pathList,
					valuePathList: e.valuePathList,
					result: e.result
				});
			});
			// 代理treeStore的load事件
			treeStore.on('load', function(e){
				_self.fire('load', {
					data: e.data,
					id: e.id, 
					param: e.param
				});
			});
		},
		// 获取整理treeStore的配置项
		_getTreeStoreConfig: function(){
			var _self = this,
				treeStoreConfig = _self.get('treeStoreConfig');
			S.mix(treeStoreConfig, {
				url: _self.get('url'),
				idKey: _self.get('idKey'),
				param: _self.get('param'),
				autoLoad: false
			});
			return treeStoreConfig;
		},
		// 初始化treeStore
		_initTreeStore: function(){
			var _self = this,
				treeStore = _self.get('store'),
				treeStoreConfig;
			if(!treeStore){
				treeStoreConfig = _self._getTreeStoreConfig();
				treeStore = new S.LP.TreeStore(treeStoreConfig);			
			}
			_self.set('treeStore', treeStore);
		},

		// 增加结果集堆栈
		_pushResult: function(nodeData){
			var _self = this,
				result = _self.getResult(),
				_result = {},
				valueStr;

			_result.id = nodeData.id;
			_result.value = nodeData.value;
			_result.isleaf = nodeData.isleaf;

			result.push(_result);

			_self.fire('resultPush', {result: result, resultObj: _result});
			_self.fire('resultUpdate', {result: result});		
		},
		// 较少结果集堆栈
		_popResult: function(){
			var _self = this,
				result = _self.getResult(),
				popResult = result.pop();

			_self.fire('resultPop', {result: result, resultObj: popResult});
			_self.fire('resultUpdate', {result: result});
		},

		// Tree视图控制功能
		// 视图逻辑控制层
		// 初始化带有视图功能的tree
		_initListTree: function(){
			var _self = this;
			_self._initListManager();
			_self._initListTreeEvent();
			_self.treeStoreLoad();
		},
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
				treeStore = _self.getTreeStore();
			treeStore.searchView(searchText, index);
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
		// 更新结果
		_updateResult: function(){
			var _self = this,
				resultInput = _self.get('resultInput'),
				resultTypeList = _self.get('resultType').split(' '),
				result = {}
				_result = null;
			if(resultInput){
				if(S.inArray('result', resultTypeList)){
					_result = _self.getResult();
					if(_result && _result.length > 0){
						result['result'] = _result;
					}
				}
				if(S.inArray('id', resultTypeList)){
					_result = _self.getIdFromResult();
					if(_result !== null && _result !== ''){
						result['id'] = _result;
					}
				}
				if(S.inArray('value', resultTypeList)){
					_result = _self.getValueFromResult();
					if(_result !== null && _result !== ''){
						result['value'] = _result;
					}
				}
				if(S.inArray('path', resultTypeList)){
					_result = _self.getPathFromResult();
					if(_result && _result.length > 0){
						result['path'] = _result;
					}
				}
				if(S.inArray('valuePath', resultTypeList)){
					_result = _self.getValuePathFromResult();
					if(_result && _result.length > 0){
						result['valuePath'] = _result;
					}
				}
				if(S.inArray('valueStr', resultTypeList)){
					_result = _self.getValueStrFromResult();
					if(_result !== null && _result !== ''){
						result['valueStr'] = _result;
					}
				}
				resultInput.val(S.isEmptyObject(result) ? '' : S.JSON.stringify(result));
			}
		},
		
		// 视图核心控制逻辑
		_initListTreeEvent: function(){
			var _self = this,
				treeStore = _self.getTreeStore();

			_self.on('load', function(){
				treeStore.getViewsByPath();
				if(!_self.get('isInit')){
					_self.initData();
					_self.set('isInit', true);
				}
			});

			treeStore.on('popView', function(){
				_self._popList();
			});
			treeStore.on('pushView', function(e){
				_self._pushList(e.view.list);
			});

			treeStore.on('changeSelect', function(e){
				_self._changeSelectByStore(e.id);
			});

			treeStore.on('searchView', function(e){
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
			
			_self.on('resultUpdate', function(e){
				_self._updateResult();
			});
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
		// 根据treeStore 更新选择的节点
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
				adapterForNode = _self.getTreeStore().get('adapterForNode');
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

				_self._initListItemsEvent(itemEl);
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
		_initListItemsEvent: function(itemEl){},

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
		}

	});

	S.namespace('LP');
	S.LP.TreeBase = TreeBase;

},{requires: ['lpmodule/treestore']});

/**
TODO

*/