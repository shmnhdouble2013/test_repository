/** 
* @fileOverview GroupSelect 高级选择
* @author  fuzheng
* @version 2.0
*/
KISSY.add(function(S){
    /**
        @exports S.LP as KISSY.LP
	*/
	var DOM = S.DOM,
		Event = S.Event;

	var CLS_ADD_BUTTON = 'J_AddSelect',
		CLS_DEL_BUTTON = 'J_DelSelect',
		CLS_SEARCH_INPUT = 'J_SearchInput',
		CLS_SEARCH_BUTTON =	'J_SearchBtn',
		CLS_SEARCH_TIP = 'J_SearchTip',
		CLS_SOURCE_SELECT = 'source-select',
		CLS_TARGET_SELECT = 'target-select',
		CLS_SELECT_TIP = 'select-tip',
		ID_GRID = 'grid',
		CLS_CONTAINER = 'group-select ks-clear',
		HTML_TIP = '<div class="select-tip"></div>',
		HTML_SEARCH = ['<div class="select-search">',
			'<input type="text" class="', CLS_SEARCH_INPUT, '"/>',
			'<a class="small-white-button" href="javascript:void(0);">',
				'<button type="button" class="', CLS_SEARCH_BUTTON, '">搜 索</button>',
			'</a>',
			'<p class="', CLS_SEARCH_TIP, '"></p>',
		'</div>'].join(''),
		HTML_BTN = ['<div class="add-del-select">',
			'<a class="small-white-button" href="javascript:void(0);">',
				'<button type="button" class="', CLS_ADD_BUTTON, '">添加 &gt;&gt;</button>',
			'</a>',
			'<a class="small-white-button" href="javascript:void(0);">',
				'<button type="button" class="', CLS_DEL_BUTTON, '">&lt;&lt; 移除</button>',
			'</a>',
		'</div>'].join('');

	/**
	* SelectGrid 选择列表基类
	* @memberOf S.LP
	* @description 选择列表基类
	* @class SelectGrid 选择列表基类
	* @param {Object} config 配置项
	*/
	function SelectGrid(config){
		var _self = this;
		config = S.merge(SelectGrid.config, config);
		if(!config.container){
			throw 'please assign the dom of select container!';
		}
		SelectGrid.superclass.constructor.call(_self, config);
		//支持的事件
		_self.events = [
			/**  
			* 数据加载完成是触发此事件（load/setData 都会触发）
			* @name S.LP.SelectGrid#load
			* @event  
			* @param {event} e  事件对象
			* @param {Array} e.data 加载后的数据
			*/
			'load'
		];
		_self._init();
	};
	SelectGrid.config = 
	/** @lends  S.LP.SelectGrid.prototype */		
	{
		/**
		* 列表渲染的容器 （必填）
		* @field
		* @type Object
		*/
		container: null,
		/**
		* 列表数据加载URL（选填，不填则认为需要手动添加数据，需要填写 data 字段）
		* @field
		* @type String
		*/
		url: null,
		/**
		* 列表数据加载参数（选填，当填写了URL字段后，并且不需要搜索框时，可以填写该字段进行默认数据的加载时配合url使用）
		* @field
		* @type Object
		*/
		param: {},
		/**
		* 列表默认数据（选填，当不填写URL字段时，可用这个字段初始化数据）
		* @field
		* @type Array
		*/
		data: null,
		/**
		* 表格列属性（必填）
		* @field
		* @type Array
		*/
		columns: null,
		/**
		* 表格宽度（选填）
		* @field
		* @type Number
		* @default  250
		*/
		width: 250,
		/**
		* 表格高度（选填）
		* @field
		* @type Number
		* @default  200
		*/
		height:200,
		/**
		* 表格是否行可多选（选填）
		* @field
		* @type Boolean
		* @default  false
		*/
		checkable: false,
		/**
		* 表格是否显示单选框，只是标识单行选中，只适用于单选表格（选填）
		* @field
		* @type Boolean
		* @default  false
		*/
		isRadio: false,
		/**
		* 数据去重时的参照字段、回显时参照的字段 （选填，不填的话则比较整行行数据， 回显时参照数据中第一个字段）
		* @field
		* @type String
		*/
		mainIndex: null,
		/**
		* 列表是否需要搜索功能（选填）
		* @field
		* @type Boolean
		* @default  true
		*/
		isSearch: true,
		/**
		* 列表搜索提示文案（选填，默认为空，仅当 isSearch 字段为 true 时有用）
		* @field
		* @type String
		* @default  ''
		*/
		searchTip: '',
		/**
		* 列表搜索参数的Key（选填，仅当 isSearch 字段为 true 时有用）
		* @field
		* @type String
		* @default  'key'
		*/
		searchKey: 'key',
		/**
		* 列表搜索参数的初始值（选填，仅当 isSearch 字段为 true 时有用）
		* @field
		* @type String
		*/
		searchValue: '',
		/**
		* 列表搜索提示文案（选填，默认为空，仅当 isSearch 字段为 true 时有用）
		* @field
		* @type String
		* @default  ''
		*/
		tip: '',
		/**
		* 表格配置项，优先级最高，会覆盖上面的配置项，请慎重填写 （选填）
		* @field
		* @type Object
		* @default  null
		*/
		gridConfig: null
	};
	S.extend(SelectGrid, S.Base);
	S.augment(SelectGrid, 
	/** @lends  S.LP.SelectGrid.prototype */		
	{
		/**
		* 加载数据 若没有url 则自动调用 setData() 设置数据
		* @param {Object} [param] 加载参数 若没有，则自动调用初始参数或上次加载的参数
		*/
		load: function(param){
			var _self = this,
				store = _self.getStore();
			if(_self.get('url')){
				param = param || _self.get('param');
				store.load(param);
				_self.set('param', param);			
			}else{
				_self.setData();
			}
		},
		/**
		* 设置数据 若没有data 则自动调用 setData() 设置数据
		* @param {Array} [data] 要设置的数组数据 若没有data 则调用初始的data
		*/
		setData: function(data){
			var _self = this,
				store = _self.getStore();
			data = data || _self.get('data');
			store.setResult(data);			
		},
		/**
		* 获取表格对象
		* @return {Object} 表格对象
		*/
		getGrid: function(){
			return this.get('grid');
		},
		/**
		* 获取store对象
		* @return {Object} store对象
		*/
		getStore: function(){
			return this.get('store');
		},
		/**
		* 获取数据
		* @return {Array} store内的数据
		*/
		getData: function(){
			var _self = this,
				store = _self.getStore();
			return store.getResult();
		},
		/**
		* 获取表格内选中的数据
		* @return {Array} 选中的数据
		*/
		getSelectedData: function(){
			var _self = this,
				grid = _self.getGrid();
			return grid.getSelection();
		},
		setSelection: function(data){
			var _self = this,
				grid = _self.getGrid(),
				field = _self.get('mainIndex'),
				values = [];
			if(field === null){
				S.each(data[0], function(n, k){
					field = k;
					return false;
				});
			}
			S.each(data, function(d){
				values.push(d[field]);
			});
			grid.setSelection(field, values);
		},
		/**
		* 销毁组件
		*/
		destroy: function(){
			var _self = this,
				store = _self.getStore(),
				grid = _self.getGrid(),
				isSearch = _self.get('isSearch'),
				container = _self.get('container');

			grid.destroy();
			store.destroy();

			if(isSearch){
				var searchTip = _self.get('searchTip'),
					searchInput = _self.get('searchInput'),
					searchBtn = _self.get('searchBtn');
				searchTip.detach();
				searchInput.detach();
				searchBtn.detach();
			}
			container.innerHTML = '';
			
			_self.detach();
			_self = null;
		},
		/**
		* 重写 S.Base 的set 方法，默认设置时不触发事件
		* @protect
		*/
		set:function(key,value){
			GroupSelect.superclass.set.call(this,key,value,{silent:1});
		},
		// 初始化
		_init: function(){
			var _self = this;

			_self._initDom();
			_self._initGrid();
			_self._initEvent();
		},
		// 初始化 dom
		_initDom: function(){
			var _self = this,
				isSearch = _self.get('isSearch'),
				container = _self.get('container'),
				gridId = S.guid(ID_GRID),
				selectStr = '';

			selectStr += isSearch ? HTML_SEARCH : HTML_TIP;
			selectStr += ['<div id="', gridId, '"></div>'].join('');

			container.innerHTML = selectStr;
			// 需要搜索的情况
			if(isSearch){
				var searchTip = _self.get('searchTip'),
					searchValue = _self.get('searchValue'),
					searchTipEl = S.one('.' + CLS_SEARCH_TIP, container),
					searchInput =  S.one('.' + CLS_SEARCH_INPUT, container),
					searchBtn =  S.one('.' + CLS_SEARCH_BUTTON, container);

				searchTipEl.text(searchTip);
				// 初始化value 和 tip的状态
				if(!!searchValue){
					searchInput.val(searchValue);
					searchTip.hide();
				}

				_self.set('searchTip', searchTipEl);
				_self.set('searchInput', searchInput);
				_self.set('searchBtn', searchBtn);
				
			}else{
				var tip = _self.get('tip'),
					tipEl = S.one('.' + CLS_SELECT_TIP, container);
				tipEl.text(tip);
			}

			_self.set('gridId', gridId);			
		},
		// 初始化 store
		_initStore: function(){
			var _self = this,
				isSearch = _self.get('isSearch'),
				url = _self.get('url'),
				param,
				data = _self.get('data') || [],
				store;

			if(url){
				// 有url 用load操作数据
				if(isSearch){
					param = {};
					param[_self.get('searchKey')] = _self.get('searchValue');
				}else{
					param = _self.get('param');
				}
				store = new S.LP.Store({
					url: url,
					params: param,
					autoLoad: true
				});
			}else{
				// 没有url 用 data 操作数据
				store = new S.LP.Store({
					autoLoad: false
				});				
			}
		
			_self.set('store', store);
			return store;
		},
		// 初始化 grid
		_initGrid: function(){
			var _self = this,
				gridId = _self.get('gridId'),
				checkable = _self.get('checkable'),
				columns = S.clone(_self.get('columns')),
				isRadio = _self.get('isRadio'),
				mainIndex = _self.get('mainIndex'),
				width = _self.get('width'),
				height = _self.get('height'),
				store,
				grid,
				gridConfig;

			if(!gridId){
				return;			
			}
			store = _self._initStore();
			
			if(isRadio){
				columns.unshift({
					title: '',
					dataIndex: mainIndex,
					width: 30,
					renderer: function(value, obj){
						return '<input type="radio" name="' + mainIndex + '" value="' + value + '"/>';
					}
				});
			}

			// 实例化表格
			gridConfig = {
				renderTo: gridId,
				width: width,
				height: height,
				checkable: checkable,
				columns: columns,
				forceFit: true,
				store: store,
				loadMask: true
			};
			gridConfig = S.merge(gridConfig, _self.get('gridConfig'));
			grid = new S.LP.EditGrid(gridConfig);
			
			_self.set('grid', grid);
			// 如果没有url 则初始化数据
			if(!_self.get('url')){
				_self.setData();
			}
			return grid;
		},
		// 初始化事件
		_initEvent: function(){
			var _self = this,
				store = _self.getStore(),
				grid = _self.getGrid(),
				isSearch = _self.get('isSearch'),
				isRadio = _self.get('isRadio'),
				searchTip,
				searchInput,
				searchBtn;
			// 代理load事件
			store.on('load', function(){
				_self.fire('load', {data: _self.getData()});
			});

			if(isSearch){
				searchTip = _self.get('searchTip');
				searchInput = _self.get('searchInput');
				searchBtn = _self.get('searchBtn');

				// 设置searchTip的显示状态
				searchTip.on('click', function(){
					searchTip.hide();
					searchInput[0].focus();
				});
				searchInput.on('focus', function(){
					searchTip.hide();
				});
				searchInput.on('blur', function(){
					if(!searchInput.val()){
						searchTip.show();
					}
				});
				// 搜索按钮点击搜索源列表
				searchBtn.on('click', function(){
					var param = {};
					param[_self.get('searchKey')] = searchInput.val();
					_self.load(param);
				});
			}	
			
			if(isRadio){
				// 配置点选点击事件联动单选框
				grid.on('rowselected',function(event){
					var radio = S.get('input', event.row);
					radio.checked = true;
				});
			}

		}

	});


	/**
	* GroupSelect 高级选择组件类
	* @memberOf S.LP
	* @description 高级选择组件 通过搜索获取源列表，通过数据填充目标列表
	* @class GroupSelect 高级选择组件类
	* @param {Object} config 配置项
	* @example 
	* //配置示例
	*	var config = {
	*		renderTo: 'J_GroupSelect',
	*		resultId: 'J_Result',
	*		gridColumns: [
	*			{
	*				title: '供应商编码',
	*				width: 100,
	*				dataIndex: 'code'
	*			},
	*			{
	*				title: '供应商名称',
	*				width: 150,
	*				dataIndex: 'name'
	*			}
	*		],
	*		sourceUrl: 'sourcedata.html',
	*		targetData: [],
	*		targetTip: '已选择供应商：',
	*		searchTip: '请输入SPU编码',
	*		checkable: true,
	*		mainIndex: 'code',
	*		maxCount: 10,
	*	};
	*/

	function GroupSelect(config){
		var _self = this;
		config = S.merge(GroupSelect.config, config);
		if(!config.renderTo || !DOM.get('#' + config.renderTo)){
			throw 'please assign the id of render Dom!';
		}
		GroupSelect.superclass.constructor.call(_self, config);
		//支持的事件
		_self.events = [
			/**  
			* 目标列表数据变动时触发此事件
			* @name S.LP.GroupSelect#targetChange
			* @event  
			* @param {event} e  事件对象
			* @param {String} e.changeType 变动的类型 'add'/'del'
			* @param {Array} e.data 变动的数据
			*/
			'targetChange'
		];
		_self._init();
	};
	GroupSelect.config = 
	/** @lends S.LP.GroupSelect.prototype */	
	{
		/**
		* 渲染组件的容器ID（必填）
		* @field
		* @type String
		*/
		renderTo: null,
		/**
		* 保存结果的容器ID（选填，不填则不记录结果）
		* @field
		* @type String
		*/
		resultId: null,
		/**
		* 表格列属性（必填）
		* @field
		* @type Array
		*/
		gridColumns: null,
		/**
		* 表格宽度（选填）
		* @field
		* @type Number
		* @default  250
		*/
		gridWidth: 250,
		/**
		* 表格高度（选填）
		* @field
		* @type Number
		* @default  200
		*/
		gridHeight:200,
		/**
		* 表格是否行可多选（选填）
		* @field
		* @type Boolean
		* @default  false
		*/
		checkable: false,
		/**
		* 源列表数据加载URL（选填，不填则认为需要手动添加数据，需要填写 sourceData 字段）
		* @field
		* @type String
		*/
		sourceUrl: null,
		/**
		* 源列表数据加载参数（选填，当填写了URL字段后，并且不需要搜索框时，可以填写该字段进行默认数据的加载时配合url使用）
		* @field
		* @type Object
		*/
		sourceParam: {},
		/**
		* 源列表默认数据（选填，当不填写URL字段时，可用这个字段初始化数据）
		* @field
		* @type Array
		*/
		sourceData: null,

		/**
		* 源列表是否需要搜索功能（选填）
		* @field
		* @type Boolean
		* @default  true
		*/
		isSearch: true,
		/**
		* 源列表搜索提示文案（选填，默认为空，仅当 isSearch 字段为 true 时有用）
		* @field
		* @type String
		* @default  ''
		*/
		searchTip: '',
		/**
		* 源列表搜索参数的Key（选填，仅当 isSearch 字段为 true 时有用）
		* @field
		* @type String
		* @default  'key'
		*/
		searchName: 'key',
		/**
		* 源列表搜索参数的初始值（选填，仅当 isSearch 字段为 true 时有用）
		* @field
		* @type String
		*/
		searchValue: '',

		/**
		* 源列表提示文案（选填，仅当 isSearch 字段为 false 时有用）
		* @field
		* @type String
		* @default  '可选项:'
		*/
		sourceTip: '可选项:',

		/**
		* 是否需要目标列表 （选填，默认为true）
		* @field
		* @type Boolean
		* @default  true
		*/
		isTarget: true,
		/**
		* 目标列表数据加载URL（选填，不填则认为需要手动添加数据，需要填写 targetData 字段）
		* @field
		* @type String
		*/
		targetUrl: null,
		/**
		* 目标列表数据加载参数（选填，当填写了URL字段后，需要填写该字段进行默认数据的加载时配合url使用）
		* @field
		* @type Object
		*/
		targetParam: {},
		/**
		* 目标列表默认数据（选填，当不填写URL字段时，可用这个字段初始化数据）
		* @field
		* @type Array
		*/
		targetData: null,

		/**
		* 目标列表搜索提示文案（选填）
		* @field
		* @type String
		* @default  '已选项:'
		*/
		targetTip: '已选项:',

		/**
		* 是否启用源列表过滤已选项功能 （选填）
		* @field
		* @type Boolean
		* @default  false
		*/
		isFilterSource: false,

		/**
		* 数据去重时的参照字段 （选填，不填的话则比较整行行数据）
		* @field
		* @type String
		*/
		mainIndex: null,
		/**
		* 目标列表可以容纳数据数量的上限 （选填， 不填则没有上限）
		* @field
		* @type Number
		*/
		maxCount: null,
		/**
		* 目标列表可以容纳数据数量达到上限时触发的提示方法 （选填）
		* @field
		* @type Function
		* @default  alert('最多可选择' + max + '项！');
		*/
		maxFunc: function(max){
			alert('最多可选择' + max + '项！');
		},
		/**
		* 源列表表格配置项，优先级最高，会覆盖上面的配置项，请慎重填写 （选填）
		* @field
		* @type Object
		* @default  null
		*/
		sourceGridConfig: null,
		/**
		* 目标列表表格配置项，优先级最高，会覆盖上面的配置项，请慎重填写 （选填）
		* @field
		* @type Object
		* @default  null
		*/
		targetGridConfig: null

	};
	S.extend(GroupSelect, S.Base);
	S.augment(GroupSelect, 
	/** @lends  S.LP.GroupSelect.prototype */		
	{
		/**
		* 获取源列表对象
		* @return {Object} 源列表对象
		*/
		getSource: function(){
			return this.get('source');
		},
		/**
		* 获取源列表Store对象
		* @return {Object} 源列表Store对象
		*/
		getSourceStore: function(){
			return this.getSource().getStore();
		},
		/**
		* 获取源列表Grid对象
		* @return {Object} 源列表Grid对象
		*/
		getSourceGrid: function(){
			return this.getSource().getGrid();
		},
		/**
		* 获取源列表数据
		* @return {Array} 源列表数据
		*/
		getSourceData: function(){
			return this.getSource().getData();
		},
		/**
		* 获取源列表选中数据
		* @return {Array} 源列表选中数据
		*/
		getSourceSelectedData: function(){
			return this.getSource().getSelectedData();
		},
		/**
		* 设置源列表数据
		* @param {Array} data 数据
		*/
		setSourceData: function(data){
			this.getSource().setData(data);
		},
		setSourceSelection: function(data){
			var _self = this,
				source = _self.getSource();
			source.setSelection(data);
		},
		/**
		* 重新加载源列表数据
		* @return {Object} param 参数对象
		*/
		sourceLoad: function(param){
			this.getSource().load(param);
		},
		/**
		* 获取目标列表对象
		* @return {Object} 目标列表对象
		*/
		getTarget: function(){
			return this.get('target');
		},
		/**
		* 获取目标列表Store对象
		* @return {Object} 目标列表Store对象
		*/
		getTargetStore: function(){
			return this.getTarget().getStore();
		},
		/**
		* 获取目标列表Grid对象
		* @return {Object} 目标列表Grid对象
		*/
		getTargetGrid: function(){
			return this.getTarget().getGrid();
		},
		/**
		* 获取目标列表数据
		* @return {Array} 目标列表数据
		*/
		getTargetData: function(){
			return this.getTarget().getData();
		},
		/**
		* 获取目标列表选中的数据
		* @return {Array} 目标列表选中的数据
		*/
		getTargetSelectedData: function(){
			return this.getTarget().getSelectedData();
		},
		/**
		* 设置目标列表数据
		* @param {Array} data 数据
		*/
		setTargetData: function(data){
			this.getTarget().setData(data);
		},
		/**
		* 重新加载目标列表数据
		* @return {Object} param 参数对象
		*/
		targetLoad: function(param){
			this.getTarget().load(param);
		},
		/**
		* 从源列表向目标列表添加数据
		* @return {Array} 返回实际添加的数据
		*/
		addDataFromSource: function(){
			var _self = this,
				data = _self.getSourceSelectedData() || [];
			return _self._addToTarget(data);
		},
		/**
		* 从目标列表删除数据
		* @return {Array} 返回实际删除的数据
		*/
		delDateFromTarget: function(){
			var _self = this,
				data = _self.getTargetSelectedData() || [];
			return _self._delFromTarget(data);
		},
		/**
		* 数据初始化
		*/
		initData: function(){
			var _self = this,
				resultCon = _self.get('resultCon'),
				isTarget = _self.get('isTarget'),
				data = null;
			if(resultCon && resultCon.val() !== ''){
				data = S.JSON.parse(resultCon.val()).result;
				if(isTarget){
					_self.setTargetData(data);
				}else{
					_self.setSourceSelection(data);
				}
			}
		},
		/**
		* 设置结果集
		* @param {Array} data 数据 选填 不填则组源列表或目标列表的数据
		*/
		setResult: function(data){
			var _self = this,
				isTarget = _self.get('isTarget');
			if(data){
				_self._updateResult(data);
			}else{
				if(isTarget){
					_self._setResultFromTarget();
				}else{
					_self._setResultFromSource();
				}
			}
		},
		/**
		* 销毁对象
		*/
		destroy: function(){
			var _self = this,
				source = _self.getSource(),
				container = _self.get('container'),
				isTarget = _self.get('isTarget'),
				target,
				addButton,
				delButton;

			source.destroy();

			if(isTarget){
				target = _self.getTarget();
				addButton = _self.get('addButton');
				delButton = _self.get('addButton');

				target.destroy();

				addButton.detach();
				delButton.detach();
			}

			container[0].innerHTML = '';
			_self.detach();
			_self = null;
		},
		/**
		* 重写 S.Base 的set 方法，默认设置时不触发事件
		* @protect
		*/
		set:function(key,value){
			GroupSelect.superclass.set.call(this,key,value,{silent:1});
		},
		// 初始化
		_init: function(){
			var _self = this,
				renderTo = _self.get('renderTo'),
				container = S.one('#' + renderTo),
				resultId = _self.get('resultId'),
				resultCon,
				isFilterSource = _self.get('isFilterSource');

			_self.set('container', container);

			if(resultId){
				resultCon = S.one('#' + resultId);
				_self.set('resultCon', resultCon);
			}

			_self._initDom();
			_self._initEvent();
			
			// 当绑定事件事，grid已经load结束时，补充初始化一下数据
			if(!_self.get('isInit')){
				_self.initData();
				_self.set('isInit', true);			
			}

			// 若需要源列表过滤功能，则初始化一下
			/*if(isFilterSource){
				_self._filterSourceData();
			}*/
		},
		// 初始化 dom
		_initDom: function(){
			var _self = this,
				container = _self.get('container'),
				isTarget = _self.get('isTarget'),
				sourceHTML = ['<div class="', CLS_SOURCE_SELECT, '"></div>'].join(''),
				targetHTML = isTarget ? [HTML_BTN, '<div class="', CLS_TARGET_SELECT, '"></div>'].join('') : '',
				containerHTML = ['<div class="', CLS_CONTAINER, '">', sourceHTML, targetHTML, '</div>'].join(''),
				sourceContainer,
				targetContainer,
				selectBaseConfig = {
					columns: _self.get('gridColumns'),
					width: _self.get('gridWidth'),
					height: _self.get('gridHeight'),
					checkable: _self.get('checkable'),
					mainIndex: _self.get('mainIndex')
				},
				addButton,
				delButton;
		
			container[0].innerHTML = containerHTML;

			sourceContainer = S.get('.' + CLS_SOURCE_SELECT, container);
			_self._initSource(sourceContainer, selectBaseConfig);

			if(isTarget){
				targetContainer = S.get('.' + CLS_TARGET_SELECT, container);
				_self._initTarget(targetContainer, selectBaseConfig);
					
				addButton = S.one('.' + CLS_ADD_BUTTON, container);
				delButton = S.one('.' + CLS_DEL_BUTTON, container);

				_self.set('addButton', addButton);
				_self.set('delButton', delButton);
			}

			// 初始化result的值
			//_self.setResult();
		},
		// 初始化 source
		_initSource: function(container, baseConfig){
			var _self = this,
				source;
			source = new SelectGrid(S.merge(baseConfig,{
				container: container,
				url: _self.get('sourceUrl'),
				data: _self.get('sourceData') || [],
				param: _self.get('sourceParam'),
				isSearch: _self.get('isSearch'),
				searchTip: _self.get('searchTip'),
				searchKey: _self.get('searchName'),
				searchValue:  _self.get('searchValue'),				
				tip: _self.get('sourceTip'),
				isRadio: !_self.get('isTarget') && !_self.get('checkable'),
				gridConfig: _self.get('sourceGridConfig')
			}));
			_self.set('source', source);
			_self._addMatchFunction(_self.getSourceStore());
		},
		// 初始化 target
		_initTarget: function(container, baseConfig){
			var _self = this,
				target;
			target = new SelectGrid(S.merge(baseConfig,{
				container: container,
				url: _self.get('targetUrl'),
				data: _self.get('targetData') || [],
				param: _self.get('targetParam'),
				isSearch: false,
				tip: _self.get('targetTip'),
				gridConfig: _self.get('targetGridConfig')
			}));
			_self.set('target', target);
			_self._addMatchFunction(_self.getTargetStore());
		},
		// 初始化事件
		_initEvent: function(){
			var _self = this,
				container = _self.get('container'),
				isTarget = _self.get('isTarget'),
				sourceGrid = _self.getSourceGrid(),
				targetGrid,
				addButton,
				delButton,
				isFilterSource;

			// 数据初始化
			_self.getSource().on('load', function(e){
				if(!isTarget || !_self.get('isInit')){
					_self.initData();
					_self.set('isInit', true);
				}
			});

			if(isTarget){
				targetGrid = _self.getTargetGrid();
				addButton =_self.get('addButton');
				delButton = _self.get('delButton');
				isFilterSource = _self.get('isFilterSource');

				// 添加按钮
				addButton.on('click', function(){
					_self.addDataFromSource();
				});
				// 删除按钮
				delButton.on('click', function(){
					_self.delDateFromTarget();
				});
				// 源列表行双击时事件 触发添加
				sourceGrid.on('rowdblclick', function(e){
					_self._addToTarget([e.data]);
				});
				// 目标列表行双击事件 触发删除
				targetGrid.on('rowdblclick', function(e){
					_self._delFromTarget([e.data]);
				});
				// 选择结果改变时，更新result
				_self.on('targetChange', function(e){
					_self._setResultFromTarget();
				});
				
				// 启用自动过滤源列表已选项功能
				if(isFilterSource){
					// 当目标列表数据加载完成时，过滤源列表
					_self.getTarget().on('load', function(){
						_self._filterSourceData();
					});
					// 当源列表数据加载完成时，过滤源列表
					_self.getSource().on('load', function(){
						_self._filterSourceData();
					});
					// 当目标列表数据发生变化时，过滤源列表
					_self.on('targetChange', function(e){
						_self._filterSourceData(e.data, e.changeType);
					});	
				}
			}else{
				// 点击源列表时，改变结果集
				sourceGrid.on('rowselectchanged', function(e){
					_self._setResultFromSource();
				});
			}
		},
		// 添加对象对比函数
		_addMatchFunction: function(store){
			var _self = this,
				mainIndex = _self.get('mainIndex');
			if(mainIndex){
				store.matchFunction = function(obj1, obj2){
					return obj1[mainIndex] === obj2[mainIndex];
				};
			}
		},
		// 添加至目标列表
		_addToTarget: function(data){
			if(!data || !(data.length > 0)){
				return;
			}
			var _self = this,
				targetStore = _self.getTargetStore();

			data = _self._filterRepeatData(data);
			data = _self._filterMaxData(data);

			if(data.length > 0){
				// 添加数据
				targetStore.add(data, true);
				// 触发事件
				_self.fire('targetChange', {changeType: 'add', data: data});
			}
			return data;
		},
		// 数据去重
		_filterRepeatData: function(data){
			var _self = this,
				targetData = _self.getTargetData(),
				mainIndex = _self.get('mainIndex'),
				_data = [];
			
			S.each(data, function(d){
				var isRepeat = false;
				S.each(targetData, function(td){
					if((mainIndex && td[mainIndex] === d[mainIndex]) || (!mainIndex && td === d)){
						isRepeat = true;
						return false;
					}
				});
				if(!isRepeat){
					_data.push(d);
				}			
			});

			return _data;
		},
		// 过滤超过上线的数据
		_filterMaxData: function(data){
			var _self = this,
				targetStore = _self.getTargetStore(),
				maxCount = _self.get('maxCount'),
				num = targetStore.getCount(),
				_data = data;
			if(S.isNumber(maxCount) && num + data.length > maxCount){
				// 截取data
				_data = data.slice(0, maxCount - num);
				// 执行达到最大值时的方法
				_self.get('maxFunc')(maxCount);
			}
			// 返回过滤后的data
			return _data;
		},
		// 从目标列表删除
		_delFromTarget: function(data){
			if(!data || !(data.length > 0)){
				return;
			}
			var _self = this,
				targetStore = _self.getTargetStore();
			// 移除数据
			targetStore.remove(data);
			// 触发事件
			_self.fire('targetChange', {changeType: 'del', data: data});
			return data;
		},
		// 自动过滤源列表已选项功能
		_filterSourceData: function(data, changeType){
			var _self = this,
				sourceStore = _self.getSourceStore();
			if(changeType === 'add'){
				sourceStore.remove(data);
			}else if(changeType === 'del'){
				sourceStore.add(data, true);
			}else{
				sourceStore.remove(_self.getTargetData());
			}
		},
		// 根据源列表的选项 设置result
		_setResultFromSource: function(){
			var _self = this;
			_self._updateResult(_self.getSourceSelectedData());
		},
		// 根据目标列表的结果集 设置result
		_setResultFromTarget: function(){
			var _self = this;
			_self._updateResult(_self.getTargetData());
		},

		_updateResult: function(data){
			var _self = this,
				resultCon = _self.get('resultCon');
			// 值为数组的序列化字符串
			if(resultCon){
				resultCon.val(data.length > 0 ? S.JSON.stringify({'result': data}) : '');
			}
		}

		

	});
	
	S.namespace('LP');
	S.LP.SelectGrid = SelectGrid;
	S.LP.GroupSelect = GroupSelect;

},{requires: ['2.0/grid', 'lpmodule/css/module.css']});

/* TODO 
	6、单独源列表的选择数据回显功能


*/


