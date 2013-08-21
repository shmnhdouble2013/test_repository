/** 
* @fileOverview Store 树专用数据缓冲对象
* @author  fuzheng
* @version 2.0
*/
KISSY.add('lpmodule/tree/store', function(S){
    /**
    *   @exports S.LP.Tree as KISSY.LP.Tree
	*/
	var DOM = S.DOM,
		Event = S.Event;

	/**
	* Store 树专用数据缓冲对象
	* @memberOf S.LP.Tree
	* @description 树专用数据缓冲对象 树的遍历、树的数据管理
	* @class Store 树专用数据缓冲对象
	* @param {Object} config 配置项
	*/
	function Store(config){
		var _self = this;
		config = S.merge(Store.config, config);
		Store.superclass.constructor.call(_self, config);
		//支持的事件
		_self.events = [
			/**  
			* 数据加载完成时 触发此事件（load/setTreeData 都会触发)
			* @name S.LP.Tree.Store#load
			* @event  
			* @param {event} e  事件对象
			* @param {Array} e.data 加载的数据
			* @param {String} e.id 所在节点的id
			* @param {Object} e.param 加载的参数（setTreeData触发时没有此属性）
			*/
			'load',
			/**  
			* 通过text遍历搜索树后 触发此事件
			* @name S.LP.Tree.Store#searchTree
			* @event  
			* @param {event} e  事件对象
			* @param {String} e.text 搜索的文本值
			* @param {Array} e.pathList 搜索的路径id集合
			* @param {Array} e.valuePathList 搜索的路径value集合
			* @param {Object} e.result 搜索结果
			*/
			'searchTree'
		];
		_self._init();
	}
	Store.config = 
	/** @lends  S.LP.Tree.Store.prototype */		
	{
		/**
		* 数据异步读取url（选填，不填的话可以手动设置树的数据）
		* @field
		* @type String
		*/
		url: null,
		/**
		* 节点数据中，id的key（选填, 不填的话默认是 adapterForNode.id）
		* @field
		* @type String
		*/
		idKey: null,
		/**
		* 数据读取的初始化参数，与 url 配合适用（选填）
		* @field
		* @type Object
		* @default  {}
		*/
		param: {},
		/**
		* 给store初始化用的数据
		* @field
		* @type Array
		* @default  []
		*/
		data: [],
		/**
		* 是否用jsonp形式发送请求
		* @field
		* @type Boolean
		* @default  false
		*/
		isJsonp: false,
		/**
		* 数据是否自动加载（选填）
		* @field
		* @type Boolean
		* @default  true
		*/
		autoLoad: true,
		/**
		* node数据的适配器（选填）
		* @field
		* @type Object
		* @default  {
						id: 'id',
						value: 'value',
						children: 'children',
						parent: 'parent',
						isleaf: 'isleaf'
					}
		*/
		adapterForNode: {
			id: 'id',
			value: 'value',
			children: 'children',
			parent: 'parent',
			isleaf: 'isleaf'
		},
		/**
		* 数据的适配器（选填）
		* @field
		* @type Object
		* @default  {
						success: 'success',
						nodes: 'nodes',
						message: 'message'
					}
		*/
		adapterForData: {
			success: 'success',
			nodes: 'nodes',
			message: 'message'
		},
		/**
		* 当数据加载失败的回调方法（选填）
		* @field
		* @type Function
		* @default  alert(msg);
		*/
		dataErrorFunc: function(msg){
			S.error(msg);
		}
	};
	S.extend(Store, S.Base);

	S.augment(Store, 
	/** @lends  S.LP.Tree.Store.prototype */		
	{
		/**
		* 检查树的数据是否加载完成
		* @param {Object} [node] 要检查的节点对象 （选填，不填则检查整个树对象）
		* @param {Function} [func] 若没有完成时，加载数据是需要回调的方法 （选填）
		* @return {Boolean} 是否准备完成
		*/
		isTreeReady: function(node, func){
			var _self = this,
				adapterForNode = _self.get('adapterForNode'),
				nodeData,
				isReady = true;
			
			if(node){
				if(node[adapterForNode.isleaf]){
					return true;
				}else{
					nodeData = node[adapterForNode.children];
				}
			}else{
				nodeData = _self.getTreeData();
			}

			if(nodeData.length === 0){
				isReady = false;
			}
			// 若没有准备好，则加载数据
			if(!isReady){
				var id = node ? node[adapterForNode.id] : null;
				_self.load(id, null, func);
			}

			return isReady;
		},
		/**
		* 加载树数据 此方法会触发load事件
		* @param {Object|String} [param] 参数对象 或 需要加载的id (不填则取默认的参数对象，若是String，则会用idKey配置参数对象)
		* @param {String} [url] 加载数据的url （选填，没有则取默认的url）
		* @param {Function} [func] 加载完成时需要回调的方法 （选填）
		* @param {Boolean} [isTreeData] 是否加载整树数据 （选填，默认为false）
		*/
		load: function(param, url, func, isTreeData){
			var _self = this,
				adapterForData = _self.get('adapterForData'),
				idKey = _self.get('idKey'),
				isTreeData = isTreeData || false,
				loadParam = _self._getParam(param),
				ajaxConfig = {
					type: 'post',
					dataType: 'json'
				};

			url = url || _self.get('url');
			// 若调用load 则 url 必填
			if(!url){
				throw 'please assign the URL of Data for Tree!';
			}
			// 是否用jsonp方式请求
			if(_self.get('isJsonp')){
				ajaxConfig = S.merge(ajaxConfig, {
					type: 'get',
					dataType: 'jsonp',
					cache: false,
					crossDomain: true
				});
			}

			S.io(S.merge(ajaxConfig, {
				url: url,
				data: loadParam,
				success: function(data){
					if(data[adapterForData.success] === true || data[adapterForData.success] === 'true'){
						_self.fire('load', {
							data: data[adapterForData.nodes],
							id: isTreeData ? null : loadParam[idKey] || null, 
							param: loadParam
						});
						if(func){
							func();
						}
					}else{
						_self._dataError(data[adapterForData.message]);
					}
				},
				error: function(){
					_self._dataError('请求异常！');
				}				
			
			}));
		},
		/**
		* 初始化加载store
		*/
		initLoad: function(){
			var _self = this;
			if(_self.get('url')){
				_self.load();
			}else{
				_self.setTreeData(_self.get('data'));
			}
		},
		/**
		* 遍历树，通过id搜索节点
		* @param {String|Number} id 目标id。 若没有，则返回的皆为空值
		* @return {Object} 返回值： 
				obj.path => 该节点的路径id
				obj.valuePath => 该节点的路经value
				obj.pathNode => 该节点的路经node
				obj.node => 该节点对象
		*/
		traverseTreeById: function(id){
			var _self = this,
				adapterForNode = _self.get('adapterForNode'),
				treeData = _self.getTreeData(),
				path = [],
				valuePath = [],
				pathNode = [],
				_traverse;

			_traverse = function(nodeData, deep){
				deep = deep || 0;
				if(nodeData){
					for(var i = 0; i < nodeData.length; i++){
						if(nodeData[i][adapterForNode.id] === id || (!nodeData[i][adapterForNode.isleaf] && _traverse(nodeData[i][adapterForNode.children], deep + 1))){
							path[deep] = nodeData[i][adapterForNode.id];
							valuePath[deep] = nodeData[i][adapterForNode.value];
							pathNode[deep] = nodeData[i];
							return true;
						}
					}
				}
				return false;			
			};

			if(id){
				_traverse(treeData);
			}

			return {
				path: path,
				valuePath: valuePath,
				pathNode: pathNode,
				node: pathNode[pathNode.length - 1] || null
			};
		},
		/**
		* 遍历树，通过text搜索节点列表
		* @param {String} text 目标文本。 若没有，则返回的皆为空值
		* @return {Object} 返回值： 
				obj.pathList => 路径id列表
				obj.valuePathList => 路径value列表
				obj.pathNodeList => 路径node列表
		*/
		traverseTreeByText: function(text){
			var _self = this,
				adapterForNode = _self.get('adapterForNode'),
				treeData = _self.getTreeData(),
				path = [],
				pathNode = [],
				valuePath = [],
				pathList = [],
				pathNodeList = [],
				valuePathList = [],
				_traverse;

			_traverse = function(nodeData, deep){
				deep = deep || 0;
				if(nodeData){
					for(var i = 0; i < nodeData.length; i++){
						var l = path.length - deep - 1;
						for(var j = 0; j < l; j++){
							path.pop();
							valuePath.pop();
							pathNode.pop();
						}
						path[deep] = nodeData[i][adapterForNode.id];
						valuePath[deep] = nodeData[i][adapterForNode.value];
						pathNode[deep] = nodeData[i];
						if(nodeData[i][adapterForNode.value].indexOf(text) > -1){
							pathList.push(S.clone(path));
							valuePathList.push(S.clone(valuePath));
							pathNodeList.push(_self.dataFilter(pathNode));
						}
						if(!nodeData[i][adapterForNode.isleaf]){
							_traverse(nodeData[i][adapterForNode.children], deep + 1);
						}
					}
				}
			};

			if(text){
				_traverse(treeData);
			}

			return {
				pathList: pathList,
				pathNodeList: pathNodeList,
				valuePathList: valuePathList
			};
		},
		/**
		* 通过id 获取节点对象
		* @param {String|Number} id 目标id。 若没有，则返回空值
		* @return {Object} 节点对象
		*/
		getNodeById: function(id){
			var _self = this;
			return _self.traverseTreeById(id).node;
		},
		/**
		* 通过Path 获取节点对象
		* @param {Array} path 目标path。 若没有，则返回空值
		* @return {Object} 节点对象
		*/
		getNodeByPath: function(path){
			path = path || [];
			var _self = this,
				adapterForNode = _self.get('adapterForNode'),
				treeData = _self.getTreeData(),
				node = null,
				nodeChildren = treeData;
			S.each(path, function(id){
				S.each(nodeChildren, function(n){
					if(n[adapterForNode.id] === id){
						node = n;
						return false;
					}
				});
				nodeChildren = node[adapterForNode.children];
			});

			return node;
		},
		/**
		* 通过id 获取节点路径
		* @param {String|Number} id 目标id。 若没有，则返回[]
		* @return {Array} 节点路径
		*/
		getPathById: function(id){
			var _self = this;
			return _self.traverseTreeById(id).path;
		},
		/**
		* 通过id 获取该节点的父节点对象
		* @param {String|Number} id 目标id。 （必填）
		* @return {Object} 父节点对象
		*/
		getParentById: function(id){
			var _self = this,
				adapterForNode = _self.get('adapterForNode'),
				node = _self.getNodeById(id),
				parentId = node[adapterForNode.parent];
			return _self.getNodeById(parent);
		},
		/**
		* 通过id 获取子节点列表
		* @param {String|Number} id 目标id。 若没有，则返回[]
		* @return {Array} 子节点列表
		*/
		getChildrenById: function(id){
			var _self = this,
				adapterForNode = _self.get('adapterForNode'),
				node = _self.getNodeById(id);
			return node ? node[adapterForNode.children] || [] : [];
		},
		/**
		* 通过Path 获取子节点列表
		* @param {Array} path 目标path。 若没有，则返回 treeData
		* @return {Array} 子节点列表
		*/
		getChildrenByPath: function(path){
			path = path || [];
			var _self = this,
				adapterForNode = _self.get('adapterForNode'),
				node = null;
			if(path.length === 0){
				return _self.getTreeData();
			}else{
				node = _self.getNodeByPath(path);
				return node ? node[adapterForNode.children] || [] : [];
			}
		},
		/**
		* 获取节点的子节点列表
		* @param {Object} node 目标节点
		* @return {Array} 子节点列表
		*/
		getChildrenByNode: function(node){
			var _self = this,
				adapterForNode = _self.get('adapterForNode'),
				children = [];
			if(node){
				children = node[adapterForNode.children] || [];			
			}else{
				children = [];
			}
			return children;
		},
		/**
		* 获取树的数据
		* @return {Array} 树数据
		*/
		getTreeData: function(){
			var _self = this;
			return _self.get('treeData');
		},
		/**
		* 手动填充树的数据 此方法会触发load事件
		* @param {Array} nodeData 带填充的节点列表
		* @param {String|Number} [id] 需要填充的节点id, (选填，若不填则当作整个树数据填充)
		*/
		setTreeData: function(nodeData, id){
			var _self = this;
			_self.fire('load', {data: nodeData, id: id});
		},
		/**
		* 通过文本搜索树 此方法会触发searchTree事件
		* @param {String} searchText 要搜索的文本
		* @return {Object} 搜索结果
		*/
		searchTree: function(searchText){
			var _self = this,
				searchResult = _self.traverseTreeByText(searchText);

			_self.fire('searchTree', {
				text: searchText,
				pathList: searchResult.pathList,
				valuePathList: searchResult.valuePathList,
				result: searchResult
			});

			return searchResult;
		},
		/**
		* 将节点中的children属性过滤掉
		* @param {Array} data 需要过滤的数据
		* @return {Array} 过滤后的数据
		*/
		dataFilter: function(data){
			var _self = this,
				adapterForNode = _self.get('adapterForNode'),
				_data = [];
			S.each(data, function(n){
				var filterData = S.clone(n, function(v, k){
					if(k === adapterForNode.children){
						return false;
					}
				});
				_data.push(filterData);			
			});
			return _data;
		},
		/**
		* 获取特定层级的树
		* @param {Number} level 目标层级 跟节点为0级
		* @return {Array} 过滤后获取的数据
		*/
		getTreeByLevel: function(level){
			var _self = this,
				treeData = _self.getTreeData(),
				adapterForNode = _self.get('adapterForNode'),
				data = S.clone(treeData),
				_traverse;
			
			_traverse = function(nodeData, deep){
				deep = deep || 0;
				if(nodeData){
					for(var i = 0; i < nodeData.length; i++){
						if(deep === level - 1){
							nodeData[i][adapterForNode.children] = [];
							nodeData[i][adapterForNode.isleaf] = true;
						}else{
							_traverse(nodeData[i][adapterForNode.children], deep + 1);
						}
					}
				}
			};
			
			if(level > 0){
				_traverse(data);
			}else{
				data = [];
			}

			return data;		
		},

		/**
		* 对象销毁
		*/
		destroy: function(){
			var _self = this;
			_self.detach();
			_self = null;
		},
		// 初始化
		_init: function(){
			var _self = this;
			_self.set('treeData', []);

			_self._initIdKey();

			_self._initEvent();

			if(_self.get('autoLoad')){
				_self.initLoad();
			}

		},
		// 初始化事件
		_initEvent: function(){		
			var _self = this;
			// 当load后把数据填充进treeData
			_self.on('load', function(e){
				_self._fillInTreeData(e.data, e.id);
			});
		},
		// 初始化idKey
		_initIdKey: function(){
			var _self = this,
				adapterForNode = _self.get('adapterForNode'),
				idKey = _self.get('idKey');
			if(!idKey){
				_self.set('idKey', adapterForNode.id);
			}
		},
		// 填充数据到treeData 若无id则作为整个树填充
		_fillInTreeData: function(data, id){
			var _self = this,
				adapterForNode = _self.get('adapterForNode'),
				nodeChildren = _self.getTreeData(),
				node;
			if(id){
				node = _self.getNodeById(id);
				if(node){
					nodeChildren = node[adapterForNode.children];
				}
			}
			nodeChildren.length = 0;
			S.each(data, function(n){
				nodeChildren.push(n);
			});
		},
		// 载入数据出错时调用
		_dataError: function(msg){
			var _self = this;
			if(msg){
				_self.get('dataErrorFunc')(msg);
			}
		},
		// 获取重载参数
		_getParam: function(param){
			var _self = this,
				idKey = _self.get('idKey'),
				lastParam = _self.get('lastParam') || _self.get('param'),
				loadParam = {};

			if(!param || S.isEmptyObject(param)){
				// 取上一次参数或默认参数
				loadParam = lastParam;
			}else if(S.isNumber(param) || S.isString(param)){
				// 若 param是id 则用idKey 配置参数对象
				loadParam[idKey] = param;
				loadParam = S.merge(lastParam, loadParam);
			}else if(S.isPlainObject(param)){
				loadParam = param;
			}
			
			_self.set('lastParam', loadParam);
			return loadParam;		
		}

	});

	return Store;

},{requires: []});

/*
TODO
1、tree的专属数据缓冲对象
2、功能
	根据id 直接获取节点     ok
	根据id 计算出节点路径	ok	
	跟节点路径取到该节点	ok
	根据id 获取父节点		ok

	获取数据					ok
	缓冲对象节点列表的填充		ok

	支持每个节点异步加载 ok

	支持手动加载 ok

	支持回显
		全数据		ok
		每个节点异步加载 ok 需要先load出所需要节点的数据 再查询 
*/


