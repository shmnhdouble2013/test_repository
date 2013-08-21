/** 
* @fileOverview Multiple 下拉选择框-多选插件
* @author  fuzheng
* @version 1.0
*/
KISSY.add('lpmodule/select/multiple', function(S){

	var DOM = S.DOM,
		Event = S.Event;

	var CHECKBOX_CLS = 'lp-select-item-checkbox',
		ITEM_CLS = 'lp-select-item',
		ITEM_SELECTED_CLS = 'lp-select-item-selected',
		MULTIPLE_CLS = 'lp-select-multiple',
		ITEM_DISABLED_CLS = 'lp-select-item-disabled';

	/**
	* Multiple 下拉选择框-多选插件
	*/
	function Multiple(){}

	Multiple.config = {
		itemTemplate: '<li class="lp-select-item{{#if disabled}} lp-select-item-disabled{{/if}}" title="{{text}}"><input type="checkbox" value="{{value}}" class="lp-select-item-checkbox" {{#if disabled}}disabled="disabled"{{/if}}/> {{text}}</li>'
	};

	S.augment(Multiple, {
		// 重写-item点击事件
		itemClick: function(item){
			var _self = this;
			if(!item.hasClass(ITEM_DISABLED_CLS)){
				if(item.hasClass(ITEM_SELECTED_CLS)){
					_self.removeSelect(item);
				}else{
					_self.addSelect(item);				
				}
			}
		},
		// 设置checkbox的选中状态
		_setCheckboxStatus: function(item){
			var _self = this,
				itemCheckbox = S.get('.' + CHECKBOX_CLS, item),
				itemHasClass = item.hasClass(ITEM_SELECTED_CLS);
			itemCheckbox.checked = itemHasClass;
		}

	});

	S.mix(Multiple, {
		init: function(){},
		// 事件初始化
		initEvent: function(){
			var _self = this;

			// 联动改变checkbox的选中状态
			_self.on('addSelect removeSelect', function(e){
				_self._setCheckboxStatus(e.dom);
			});
			_self.on('clearSelect', function(e){
				e.dom.each(function(i){
					_self._setCheckboxStatus(S.one(i));
				});
			});

			_self.on('itemCreated', function(e){
				var checkbox = S.one('.' + CHECKBOX_CLS, e.dom);
				checkbox.on('mouseup', function(e){
					e.halt();
					this.checked = !S.one(this).parent('.' + ITEM_CLS).hasClass(ITEM_SELECTED_CLS);
				});
			});
			_self.on('selectCreated', function(e){
				var items = _self.get('items');
				items.addClass(MULTIPLE_CLS);
			});
		}		
	
	});

	return Multiple;

},{requires: []});


/** 
* @fileOverview Search 下拉选择框-搜索插件
* @author  fuzheng
* @version 1.0
*/
KISSY.add('lpmodule/select/search', function(S){

	var DOM = S.DOM,
		Event = S.Event;

	var ITEM_CLS = 'lp-select-item',
		ITEM_SELECTED_CLS = 'lp-select-item-selected',
		SEARCH_CLS = 'lp-select-search-input',
		SEARCH_HTML = ['<input type="text" class="control-text ', SEARCH_CLS, '"/>'].join(''),
		SELECT_ITEM_HTML = ['<li class="', ITEM_CLS, '"></li>'].join('');

	/**
	* Search 下拉选择框-多选插件
	*/
	function Search(){}

	Search.config = {};


	S.augment(Search, {
		// 重写 - 包装text
		_getItemInner: function(obj){
			var _self = this,
				itemTemplate = _self.get('itemTemplate'),
				text = _self.get('searchText') || '',
				_text = obj.text,
				innerStr = _text;
			if(!!text){
				innerStr = _text.replace(text, '<s>' + text + '</s>');
			}
			if(itemTemplate){
				innerStr = S.Template(itemTemplate).render({
					text: _text,
					value: obj.value
				});
			}
			return innerStr;
		},
		// 重写 - 获取内部实际高度，加入搜索框的24像素
		_getInnerHeight: function(){
			var _self = this,
				itemsCon = _self.get('itemsCon'),
				itemsHeight = itemsCon.outerHeight(true) + 24;
			return itemsHeight;
		},

		// 通过text筛选数据
		getDataByText: function(text){
			var _self = this,
				data = _self.getData(),
				_data = [];
			if(!!text){
				S.each(data, function(d){
					if(d.text.indexOf(text) > -1){
						_data.push(d);
					}			
				});
			}else{
				_data = data;
			}
			return _data;
		},

		// 根据text进行搜索
		_search: function(text){
			var _self = this,
				text = text === undefined ? '' : text,
				_text = _self.get('searchText') || '',
				data;
			if(text !== _text){
				data = _self.getDataByText(text);
				_self._destroyItems();
				_self.set('searchText', text);
				_self.createItems(data);
				_self.open();
				_self._initData(false);
				// 重置搜索框的值
				_self.get('searchInput').val(text);
			}
		},
		// 判断两组数据是否相同
		/*_isSameData: function(data1, data2){
			var isSame = true;
			if(data1.length === data2.length){
				S.each(data1, function(d, i){
					if(d.value !== data2[i].value){
						isSame = false;
						return false;
					}
				});
			}else{
				isSame = false;
			}
			return isSame;
		},*/
		// 初始化搜索框
		_initSearchInput: function(){
			var _self = this,
				searchInput = S.one(DOM.create(SEARCH_HTML)),
				items = _self.get('items');

			items.prepend(searchInput);
			_self.set('searchInput', searchInput);

			_self._initSearchInputEvent();			
		},
		// 设置input事件
		_initSearchInputEvent: function(){
			var _self = this,
				searchInput = _self.get('searchInput'),
				searchTimer;
			// 阻止冒泡
			searchInput.on('click', function(e){
				e.halt();
			});
			// 自动搜索
			searchInput.on('keyup', function(e){
				if(e.which === 32 || e.which === 8 || e.which === 46 || (e.which >= 65 && e.which <= 90) || (e.which >= 48 && e.which <= 57) || (e.which >= 96 && e.which <= 105)){
					var _input = S.one(this);
					if(searchTimer){
						searchTimer.cancel();
					}
					searchTimer = S.later(function(){
						_self.fire('search', {text: S.trim(_input.val())});
					}, 200);
				}
			});
			// 屏蔽回车事件
			searchInput.on('keydown', function(e){
				if(e.which === 13){
					return false;
				}
			});
		}

	});

	S.mix(Search, {
		init: function(){},
		// 事件初始化
		initEvent: function(){
			var _self = this;
			// 在外框创建好时，初始化searchInput
			_self.on('selectCreated', function(){
				_self._initSearchInput();			
			});
			// 开始搜索
			_self.on('search', function(e){
				_self._search(e.text);
			});
			// 去掉选择时重新搜索
			_self.on('changeSelect', function(e){
				if(e.action === 'remove'){
					_self._search();
				}
			});
		}		
	
	});

	return Search;

},{requires: []});


/** 
* @fileOverview Select 模拟下拉框
* @author  fuzheng
* @version 1.0
*/
KISSY.add('lpmodule/select', function(S, Multiple, Search){
    /**
        @exports S.LP as KISSY.LP
	*/
	var DOM = S.DOM,
		Event = S.Event;

	var HANDLE_CLS = 'lp-select-handle',
		INPUT_CLS = 'lp-select-input',
		ICON_CLS = 'lp-select-icon',
		ITEMS_CLS = 'lp-select-items',
		ITEMS_CON_CLS = 'lp-select-items-con',
		ITEM_CLS = 'lp-select-item',
		ITEM_HOVER_CLS = 'lp-select-item-hover',
		ITEM_SELECTED_CLS = 'lp-select-item-selected',
		ITEM_DISABLED_CLS = 'lp-select-item-disabled',
		SELECT_HTML = ['<div class="lp-select">',
				'<div class="', HANDLE_CLS, '">',
					'<input type="text" class="control-text ', INPUT_CLS, '" readonly="readonly"/>',
					'<s class="', ICON_CLS, '"></s>',
				'</div>',
				'<div class="', ITEMS_CLS, '">',
					'<ul class="', ITEMS_CON_CLS, '">',
					'</ul>',
				'</div>',
			'</div>'].join('');

	/**
	* Select 模拟下拉框
	* @memberOf S.LP
	* @description 模拟下拉框 可以配置插件 变成多选下拉 或者搜索下拉
	* @class Select 模拟下拉框
	* @param {Object} config 配置项 
	*/
	function Select(config){
		var _self = this;
		config = S.merge(Select.config, config);
		// 初始化插件
		_self._initPlugins(config);
		
		if(!config.renderTo || !DOM.get('#' + config.renderTo)){
			throw 'please assign the id of render Dom!';
		}
		Select.superclass.constructor.call(_self, config);
		_self.events = [
			/**
			* 代理store的load事件，标志着数据加载完成
			* @name S.LP.Select#load
			* @event
			* @param {event} e 事件对象
			*/
			'load',
			/**
			* select外框创建完毕之后，触发该事件
			* @name S.LP.Select#selectCreated
			* @event
			* @param {event} e 事件对象
			* @param {String} e.dom select外框节点
			*/
			'selectCreated',
			/**
			* item节点创建完毕之后，触发该事件
			* @name S.LP.Select#itemCreated
			* @event
			* @param {event} e 事件对象
			* @param {String} e.dom item节点
			*/
			'itemCreated',
			/**
			* 所有item节点全部创建完毕之后，触发该事件
			* @name S.LP.Select#itemsCreated
			* @event
			* @param {event} e 事件对象
			*/
			'itemsCreated',
			/**
			* item被点击时，触发该事件
			* @name S.LP.Select#itemClick
			* @event
			* @param {event} e 事件对象
			* @param {String} e.dom 节点对象
			*/
			'itemClick',
			/**
			* 节点被选择后 触发此事件，此时结果还没有更新
			* @name S.LP.Select#addSelect
			* @event
			* @param {event} e 事件对象
			* @param {String} e.dom 节点对象
			* @param {String} e.data 节点上绑定的数据
			*/
			'addSelect',
			/**
			* 节点呗移除选择后 触发此事件，此时结果还没有更新
			* @name S.LP.Select#removeSelect
			* @event
			* @param {event} e 事件对象
			* @param {String} e.dom 节点对象
			* @param {String} e.data 节点上绑定的数据
			*/
			'removeSelect',
			/**
			* 所有节点的选择状态都清空后 触发此事件，此时结果还没有更新
			* @name S.LP.Select#clearSelect
			* @event
			* @param {event} e 事件对象
			*/
			'clearSelect',
			/**
			* 节点选择状态改变后 触发此事件 （addSelect、removeSelect，clearSelect后都会触发该事件），结果将更新
			* @name S.LP.Select#changeSelect
			* @event
			* @param {event} e 事件对象
			* @param {event} e.action 结果变更原因 'add' 'remove' 'clear' 'init'
			*/
			'changeSelect',
			/**
			* 结果管理器更新之后 触发此事件
			* @name S.LP.Select#resultUpdate
			* @event
			* @param {event} e 事件对象
			* @param {String} e.result 结果管理器
			*/
			'resultUpdate'
		];
		_self._init();
	}
	Select.config = 
	/** @lends  S.LP.Select.prototype */		
	{
		/**
		* 渲染dom的容器ID (必填)
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
		* 初始化select的数据源列表，key 必须为 text、value [{text:'...', value:'...'}]
		* @field
		* @type Array
		*/
		data: null,
		/**
		* 初始化select的数据源链接
		* @field
		* @type String
		*/
		url: null,
		/**
		* 调用数据源时的参数，配合url使用
		* @field
		* @type Object
		*/
		params: null,
		/**
		* 数据项的模板(选填)，运用了kissy的模板工具进行解析，两个变量为： {{text}} , {{value}} , {{disabled}}
		* @field
		* @type String
		*/
		itemTemplate: '<li class="lp-select-item{{#if disabled}} lp-select-item-disabled{{/if}}" title="{{text}}">{{text}}</li>',
		/**
		* 是否可多选（选填）
		* @field
		* @type Boolean
		* @default false
		*/
		checkable: false,
		/**
		* 是否可内部搜索（选填）
		* @field
		* @type Boolean
		* @default false
		*/
		searchable: false,
		/**
		* 是否可自适应宽度（选填）
		* @field
		* @type Boolean
		* @default false
		*/
		fitWidth: false,
		/**
		* 最小宽度（选填）
		* @field
		* @type Number
		* @default 148
		*/
		width:148,
		/**
		* 最大高度（选填）
		* @field
		* @type Number
		* @default 200
		*/
		height:200

	};
	S.extend(Select, S.Base);
	S.augment(Select, 
	/** @lends  S.LP.Select.prototype */		
	{
		/**
		* 创建Select外框，触发selectCreated事件
		* @return {Object} 外框的节点对象
		*/
		createSelect: function(){
			var _self = this,
				container = _self.get('container'),
				selectDom = S.one(DOM.create(SELECT_HTML)),
				handleDom = S.one('.' + HANDLE_CLS, selectDom),
				itemsDom = S.one('.' + ITEMS_CLS, selectDom),
				itemsConDom = S.one('.' + ITEMS_CON_CLS, selectDom),
				inputDom = S.one('.' + INPUT_CLS, selectDom);
			container.append(selectDom);
			
			_self.set('handle', handleDom);
			_self.set('items', itemsDom);
			_self.set('itemsCon', itemsConDom);
			_self.set('input', inputDom);

			_self.fire('selectCreated', {dom: selectDom});

			return selectDom;
		},
		/**
		* 创建所有items，触发itemsCreated事件
		*/
		createItems: function(data){
			var _self = this,
				data = data || _self.getData();
			if(!data || data.length === 0){
				return false;
			}
			S.each(data, function(o){
				_self.createItem(o);
			});
			_self.fire('itemsCreated');
		},
		/**
		* 创建item节点，触发itemCreated事件
		* @param {Object} obj 数据对象
		* @return {Object} item的节点对象
		*/
		createItem: function(obj){
			var _self = this,
				itemsConDom = _self.get('itemsCon'),
				itemDom = S.one(DOM.create(_self._getItemDom(obj)));

			itemDom.data('data', obj);
			
			itemsConDom.append(itemDom);

			_self.fire('itemCreated', {dom: itemDom});
			return itemDom;
		},
		/**
		* 重新渲染数据
		* @param {Array} | {Object} data 数据 | 参数 若有数据 则直接置数据 若无则load()
		*/
		reload: function(data){
			var _self = this,
				store = _self.get('store');

			if(S.isArray(data)){
				store.setResult(data);
			}else{
				store.load(data);
			}		
		},
		/**
		* 获取所有数据
		* @return {Array} 数据
		*/
		getData: function(){
			var _self = this,
				store = _self.get('store');
			return store.getResult();
		},
		/**
		* 获取item上的数据
		* @param {Object} item 节点对象
		* @return {Object} 数据对象
		*/
		getDataByItem: function(item){
			var _self = this;
			return item.data('data');
		},
		/**
		* 从结果管理器中获取结果value组成的字符串，用逗号分隔
		* @return {String} 结果字符串
		*/
		getValueStrFromResult: function(){
			var _self = this,
				resultManage = _self.getResultManage(),
				valueList = [];

			S.each(resultManage, function(r){
				valueList.push(r.value);
			});

			return valueList.join(',');			
		},
		/**
		* 从结果管理器中获取结果text组成的字符串，用逗号分隔
		* @return {String} 结果字符串
		*/
		getTextStrFromResult: function(){
			var _self = this,
				resultManage = _self.getResultManage(),
				textList = [];

			S.each(resultManage, function(r){
				textList.push(r.text);
			});

			return textList.join(',');			
		},
		/**
		* 获取结果管理器
		* @return {Array} 结果管理器
		*/
		getResultManage: function(){
			var _self = this,
				resultManage = _self.get('resultManage');
			return resultManage || [];
		},
		/**
		* item被点击时所执行的方法，重写此方法可以改变点击后的行为
		* @param {Object} item 节点对象
		*/
		itemClick: function(item){
			var _self = this;	
			if(!item.hasClass(ITEM_DISABLED_CLS)){
				if(item.hasClass(ITEM_SELECTED_CLS)){
					_self.removeSelect(item);
				}else{
					_self.clearSelect(false);
					_self.addSelect(item);
				}
				_self.close();
			}
		},
		/**
		* 增加选择状态，可以选择不触发事件
		* @param {Object} item 节点对象
		* @param {Boolean} isFireEvent 是否触发changeSelect事件
		*/
		addSelect: function(item, isFireEvent){
			var _self = this,
				isFireEvent = isFireEvent === undefined ? true : isFireEvent;
			if(_self.fire('beforeAddSelect', {dom: item, data: _self.getDataByItem(item)}) === false){
				return null;
			}
			item.addClass(ITEM_SELECTED_CLS);
			_self.fire('addSelect', {dom: item, data: _self.getDataByItem(item)});
			if(isFireEvent){
				_self.fire('changeSelect', {action: 'add'});
			}
		},
		/**
		* 移除选择状态，可以选择不触发事件
		* @param {Object} item 节点对象
		* @param {Boolean} isFireEvent 是否触发changeSelect事件
		*/
		removeSelect: function(item, isFireEvent){
			var _self = this,
				isFireEvent = isFireEvent === undefined ? true : isFireEvent;
			if(_self.fire('beforeRemoveSelect', {dom: item, data: _self.getDataByItem(item)}) === false){
				return null;
			}
			item.removeClass(ITEM_SELECTED_CLS);		
			_self.fire('removeSelect', {dom: item, data: _self.getDataByItem(item)});
			if(isFireEvent){
				_self.fire('changeSelect', {action: 'remove'});
			}
		},
		/**
		* 清除所有选中状态，可以选择不触发事件
		* @param {Boolean} isFireEvent 是否触发changeSelect事件
		*/
		clearSelect: function(isFireEvent){
			var _self = this,
				isFireEvent = isFireEvent === undefined ? true : isFireEvent,
				itemList = _self._getItemList();
			if(_self.fire('beforeClearSelect') === false){
				return null;
			}
			itemList.removeClass(ITEM_SELECTED_CLS);
			_self.fire('clearSelect', {dom: itemList});
			if(isFireEvent){
				_self.fire('changeSelect', {action: 'clear'});
			}
		},
		/**
		* 显示下拉框
		*/
		open: function(){
			this.get('items').show();
		},
		/**
		* 关闭下拉框
		*/
		close: function(){
			this.get('items').hide();
		},
		/**
		* 切换下拉框显示状态
		*/
		toggle: function(){
			this.get('items').toggle();
		},
		/**
		* 清空下拉列表
		*/
		clear: function(){
			var _self = this,
				itemList = _self._getItemList();
			if(itemList.length > 0){
				_self.clearSelect();
				_self._destroyItems();
			}
		},
		/**
		* 变更所选
		* @param {Array} data 需要选中的数据
		*/
		changeSelect: function(data, isFireEvent){
			var _self = this,
				itemList = _self._getItemList(),
				isFireEvent = isFireEvent === undefined ? true : isFireEvent;

			if(S.isArray(data) && data.length > 0){
				_self.clearSelect(false);
				S.each(data, function(d){
					itemList.each(function(item){
						var _data = _self.getDataByItem(item);
						if(_data.value === d.value){
							_self.addSelect(item, false);
						}
					});				
				});
				// 最后再触发选择变更事件
				if(isFireEvent){
					_self.fire('changeSelect', {action: 'init'});
				}
			}		
		},
		/**
		* 销毁组件
		*/
		destroy: function(){
			var _self = this,
				container = _self.get('container'),
				handle = _self.get('handle'),
				items = _self.get('items');

			_self._destroyItems();

			handle.detach().remove();
			items.detach().remove();
			Event.detach('body', 'click', _self._bodyClickEvent, _self);
			Event.detach('body', 'closeAnother', _self._bodyClickEvent, _self);
			container.html('');

			_self.detach();	
			_self = null;	
		},		

		// 初始化
		_init: function(){
			var _self = this,
				container = S.one('#' + _self.get('renderTo')),
				resultCon = null,
				resultManage = [];

			_self.set('container', container);
			_self.set('resultManage', resultManage);
			_self.set('isLoaded', false);
			
			// 如果有结果存储对象，则将会存储结果，并可以触发回显机制
			if(_self.get('resultId')){
				resultCon = S.one('#' + _self.get('resultId'));
				_self.set('resultCon', resultCon);
			}
			// 初始化事件
			_self._initEvent();
			// 创建外框
			_self.createSelect();
			// 初始化数据
			_self._initStore();
		},
		// 初始化事件
		_initEvent: function(){
			var _self = this;
			// 数据加载后，开始初始化dom
			_self.on('load', function(){
				// 清空dom
				_self.clear();
				// 创建列表节点dom
				_self.createItems();
				// 初始化回显
				_self._initData();		
			});
			// 外框创建完成后，绑定事件，并开始创建节点
			_self.on('selectCreated', function(){
				_self._initSelectEvent();
			});
			// item创建完成后，绑定事件
			_self.on('itemCreated', function(e){
				_self._initItemEvent(e.dom);
			});
			// item全部创建完成后，设置dom宽高样式
			_self.on('itemsCreated', function(){
				_self._setDomStyle();			
			});
			// 	item被点击后
			_self.on('itemClick', function(e){
				_self.itemClick(e.dom);
			});
			// item选择状态改变后，触发结果管理器的更新
			_self.on('changeSelect', function(){
				_self._resetResult();
			});
			// 结果管理器更新之后，触发结果显示的更新
			_self.on('resultUpdate', function(){
				_self._updateResult();
			});
			
			// 初始化插件的事件
			_self._initPluginsEvent();
		},
		// 初始化数据源
		_initStore: function(){
			var _self = this,
				data = _self.get('data') || [],
				url = _self.get('url'),
				params,
				store = new S.LP.Store({
					url: url
				});
			// 代理store的load事件
			store.on('load', function(){
				_self.set('isLoaded', true);
				_self.fire('load');
			});

			_self.set('store', store);

			if(data.length > 0 || !url){
				store.setResult(data);
			}else{
				params = _self.get('params');
				store.load(params);
			}

		},
		// 初始化select外框的事件
		_initSelectEvent: function(){
			var _self = this,
				handle = _self.get('handle');
			
			handle.on('click', function(e){
				e.halt();
				_self.toggle();
				S.one('body').fire('closeAnother', {selectObj: _self});
			});

			Event.on('body', 'click', _self._bodyClickEvent, _self);
			Event.on('body', 'closeAnother', _self._bodyClickEvent, _self);
		},
		// 初始化item的事件
		_initItemEvent: function(item){
			var _self = this;
		
			item.on('mouseenter', function(){
				S.one(this).addClass(ITEM_HOVER_CLS);
			});
			item.on('mouseleave', function(){
				S.one(this).removeClass(ITEM_HOVER_CLS);
			});

			item.on('click', function(e){
				e.halt();
				_self.fire('itemClick', {dom: S.one(this)});
			});
		},
		// body上绑定的事件，主要用于解除绑定
		_bodyClickEvent: function(e){
			var _self = this;
			if(!e.selectObj || e.selectObj !== _self){
				_self.close();
			}
		},
		// 数据初始化，回显数据
		_initData: function(isFireEvent){
			var _self = this,
				resultCon = _self.get('resultCon'),
				result = [],
				isFireEvent = isFireEvent === undefined ? true : isFireEvent;

			if(resultCon && !!resultCon.val()){
				// 获取结果存储器中的值
				result = S.JSON.parse(resultCon.val());
				_self.changeSelect(result, isFireEvent);
			}
		},
		//	更新结果管理器
		_resetResult: function(){
			var _self = this,
				resultManage = _self.getResultManage(),
				items = _self.get('items'),
				selectItemList = S.all('.' + ITEM_SELECTED_CLS, items);

			resultManage.length = 0;
			selectItemList.each(function(item){
				resultManage.push(_self.getDataByItem(item));
			});

			_self.fire('resultUpdate', {result: resultManage});

			return resultManage;
		},
		// 更新结果显示
		_updateResult: function(){
			var _self = this,
				resultManage = _self.getResultManage(),
				resultCon = _self.get('resultCon'),
				input = _self.get('input'),
				textStr = _self.getTextStrFromResult();
			if(resultCon){
				resultCon.val(resultManage.length === 0 ? '' : S.JSON.stringify(resultManage));
			}
			input.val(textStr).attr('title', textStr);
		},
		// 根据模板获取item内容
		_getItemDom: function(obj){
			var _self = this,
				itemTemplate = _self.get('itemTemplate'),
				innerStr = '';
			if(itemTemplate){
				innerStr = S.Template(itemTemplate).render({
					text: obj.text,
					value: obj.value,
					disabled: obj.disabled
				});
			}
			return innerStr;
		},
		// 获取所有item项列表
		_getItemList: function(){
			var _self = this,
				items = _self.get('items'),
				itemList = S.all('.' + ITEM_CLS, items);
			return itemList;
		},
		// 设置宽高样式
		_setDomStyle: function(){
			var _self = this,
				items = _self.get('items'),
				fitWidth = _self.get('fitWidth'),
				height = _self.get('height'),
				width = _self.get('width'),
				itemsWidth,
				itemsHeight;

			// 展开
			items.css('visibility', 'hidden');	
			_self.open();
			// 获取
			itemsWidth = _self._getInnerWidth();
			itemsHeight = _self._getInnerHeight();
			// 宽度
			if(fitWidth){
				var _w = width;
				if(itemsWidth > width){
					_w = itemsWidth;
					if(itemsHeight > height){
						_w += 18;
					}
				}
				items.css('width', _w);
			}else{
				items.css('width', width).css('overflow-x', 'hidden');
			}
			// 高度
			if(itemsHeight > height){
				items.css('height', height).css('overflow-y', 'scroll');
			}else{
				items.css('height', itemsHeight).css('overflow-y', 'inherit');
			}			
			// 隐藏
			_self.close();
			items.css('visibility', 'inherit');	
		},
		// 获取内部实际宽度
		_getInnerWidth: function(){
			var _self = this,
				items = _self.get('items'),
				itemsCon = _self.get('itemsCon'),
				itemsWidth;
			items.css('width', 'auto');
			itemsWidth = itemsCon.outerWidth();
			return itemsWidth;
		},
		// 获取内部实际高度
		_getInnerHeight: function(){
			var _self = this,
				itemsCon = _self.get('itemsCon'),
				itemsHeight = itemsCon.outerHeight(true);
			return itemsHeight;
		},
		// 销毁items
		_destroyItems: function(){
			var _self = this,
				itemList = _self._getItemList();
			itemList.detach().remove();
		},

		// 插件初始化		
		_initPlugins: function(config){
			var _self = this,
				pluginManage = [];

			if(config.checkable){
				pluginManage.push(Multiple);
			}
			if(config.searchable){
				pluginManage.push(Search);
			}

			S.each(pluginManage, function(plugin){
				S.mix(config, plugin.config, true);
				S.mix(_self, plugin.prototype, true);
			});

			config.pluginManage = pluginManage;
		},
		// 插件事件初始化
		_initPluginsEvent: function(){
			var _self = this,
				pluginManage = _self.get('pluginManage');

			S.each(pluginManage, function(plugin){
				plugin.initEvent.call(_self);
			});
		}

	});

	S.namespace('LP');
	S.LP.Select = Select;

},{requires: ['lpmodule/select/multiple', 'lpmodule/select/search', '2.0/uicommon', 'template', 'lpmodule/css/module.css']});

/**
TODO
1、工具类可以外框和里面的选择项可以分开使用，也可以一起初始化
2、结果管理，可管理单结果和多结果
3、回显管理
4、高度管理
5、宽度管理
6、可函数式调用

7、插件式 可多选 可搜索

*/

