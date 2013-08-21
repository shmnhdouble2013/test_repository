/** 
* @fileOverview Select 多级联动框
* @author  fuzheng
* @version 2.0
*/
KISSY.add('lpmodule/tree/select', function(S, View){
    /**
        @exports S.LP.Tree as KISSY.LP.Tree
	*/
	var DOM = S.DOM,
		Event = S.Event;

	var HTML_SELECT = '<select></select>';

	/**
	* Select 多级联动框
	* @memberOf S.LP.Tree
	* @description 列表目录树 基于Tree.View 的多级联动框
	* @class Select 多级联动框
	* @param {Object} config 配置项 请参照Tree.View的配置项
	*/
	function Select(config){
		var _self = this;
		config = S.merge(Select.config, config);
		Select.superclass.constructor.call(_self, config);
		_self._initSelecrtTree();
	}
	Select.config = 
	/** @lends  S.LP.Tree.Select.prototype */		
	{ 
		/**
		* 形成select的模版，
		* @field
		* @default '&lt;select&gt;&lt;/select&gt;'
		*/
		selectTpl : '<select></select>',
		/**
		* select元素的class (选填)
		* @field
		* @type String
		*/
		selectCls: 'form-field-select'
	};
	S.extend(Select, View);
	S.augment(Select, 
	/** @lends  S.LP.Tree.Select.prototype */		
	{
		// 初始化
		_initSelecrtTree: function(){
			var _self = this;
			_self._initSelecrtTreeEvent();
		},
		// 初始化事件
		_initSelecrtTreeEvent: function(){},

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
				el = null,
				selectDom = null,
				container = _self.get('container');

			el = new S.Node(_self.get('selectTpl')).appendTo(container);
			selectDom = _self._getSelect(el);
			selectDom.addClass( _self.get('selectCls'));

			return el;
		},
		// 重写 - 初始化视图事件
		_initListEvent: function(list){
			var _self = this;

			_self._getSelect(list.dom).on('change', function(){
				var selectOption = this.options[this.selectedIndex];
				_self._itemChangeSelect(S.one(selectOption));
			});
		},
		// 重写 - 初始化视图节点dom
		_initListItemsDom: function(list, nodeData){
			var _self = this,
				optionStr,
				optionEl;

			optionStr = ['<option value="', nodeData.id, '" title="', nodeData.value, '">',
				nodeData.value,
				'</option>'
			].join('');


			optionEl = DOM.create(optionStr);
			//提供模版之后，list.dom不一定是select
			_self._getSelect(list.dom).append(optionEl);
			optionEl = S.one(optionEl);

			return optionEl;
		},
		// 重写 - 获取视图节点
		_getItems: function(list){
			return S.all('option', list.dom);//
		},
		_getSelect : function(dom){
			dom = S.one(dom);
			if(dom){
				if(dom[0].tagName.toUpperCase() === 'SELECT'){
					return dom;
				}else{
					return dom.one('select');
				}
			}
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

	return Select;

},{requires: ['./view']});



