/** 
* @fileOverview SelectTree 多级联动框
* @author  fuzheng
* @version 1.0
*/
KISSY.add(function(S){
    /**
        @exports S.LP as KISSY.LP
	*/
	var DOM = S.DOM,
		Event = S.Event;

	var HTML_SELECT = '<select></select>';

	/**
	* SelectTree 多级联动框
	* @memberOf S.LP
	* @description 列表目录树 基于treeBase 的多级联动框
	* @class SelectTree 多级联动框
	* @param {Object} config 配置项 请参照TreeBase的配置项
	*/
	function SelectTree(config){
		var _self = this;
		config = S.merge(SelectTree.config, config);
		SelectTree.superclass.constructor.call(_self, config);
		_self._init();
	}
	SelectTree.config = 
	/** @lends  S.LP.SelectTree.prototype */		
	{
		/**
		* select元素的class (选填)
		* @field
		* @type String
		*/
		selectCls: 'form-field-select'
	};
	S.extend(SelectTree, S.LP.TreeBase);
	S.augment(SelectTree, 
	/** @lends  S.LP.SelectTree.prototype */		
	{
		// 初始化
		_init: function(){
			var _self = this;
			_self._initListTree();
			_self._initEvent();
		},
		// 初始化事件
		_initEvent: function(){},

		// 重写 - 初始化视图
		_initList: function(data, index){
			var _self = this,
				list = {},
				listConDom;

			if(data.length === 0){
				return {};
			}
			listConDom = _self._initListDom(list, index);
			_self._initListData(list, listConDom, index);

			// 加入selectTree逻辑
			var nullOptionData = {
					id: null,
					value: '请选择...'					
				},
				nullOption = _self._initListItemsDom(list, nullOptionData);
			_self._initListItemsData(nullOption, nullOptionData, index);
			// 加入selectTree逻辑 - end


			_self._initListItems(list, data, index);
			_self._initListEvent(list);

			// 加入selectTree逻辑
			if(!list.selectedItem){
				_self._getItems(list)[0].selected = true;
			}
			// 加入selectTree逻辑 - end

			return list;
		},		
		// 重写 - 初始化视图dom
		_initListDom: function(list, index){
			var _self = this,
				selectDom = DOM.create(HTML_SELECT),
				container = _self.get('container');

			container.append(selectDom);

			DOM.addClass(selectDom, _self.get('selectCls'));

			return S.one(selectDom);
		},
		// 重写 - 初始化视图事件
		_initListEvent: function(list){
			var _self = this;

			list.dom.on('change', function(){
				var selectOption = this.options[this.selectedIndex];
				_self._itemChangeSelect(S.one(selectOption));
			});
		},
		// 重写 - 初始化视图节点dom
		_initListItemsDom: function(list, nodeData){
			var optionStr,
				optionEl;

			optionStr = ['<option value="', nodeData.id, '">',
				nodeData.value,
				'</option>'
			].join('');

			optionEl = DOM.create(optionStr);
			list.dom.append(optionEl);
			optionEl = S.one(optionEl);

			return optionEl;
		},
		// 重写 - 获取视图节点
		_getItems: function(list){
			return S.all('option', list.dom);
		},
		// 重写 - 判断节点是否选中
		_isItemSelect: function(item){
			return item[0].selected;
		},
		// 重写 - 添加节点选中状态
		_addItemSelect: function(item){
			item[0].selected = true;
		},
		// 重写 - 移除节点选中状态
		_removeItemSelect: function(item){
			item[0].selected = false;	
		},
		// 重写 - 移除所有节点选中状态
		_removeAllSelectByItem: function(item){
			S.each(item.siblings(), function(o){
				item[0].selected = false;
			});
		}

	});

	S.namespace('LP');

	S.LP.SelectTree = SelectTree;

},{requires: ['lpmodule/treebase', 'lpmodule/css/module.css']});

/**
TODO


*/