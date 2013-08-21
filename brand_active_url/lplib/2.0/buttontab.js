KISSY.add(function(S){

	var Node = S.Node,
		CLS_BUTTON_TAB = 'button-tabs',
		CLS_NAV_TAB = 'nav-tabs',
		CLS_ITEM = 'tab-item',
		CLS_ACTIVE = 'tab-item-active',
		CLS_HOVER = 'tab-item-hover',
		CLS_ITEM_TEXT = 'tab-item-text',
		CLS_LINK_TAB = 'link-tabs',
		DATA_ITEM = 'data-item';

	/**
	 * 按钮样式的标签切换
	 * @name KISSY.LP.ButtonTab
	 * @class 按钮样式的标签
	 * @param  {Object} config 配置项
	 */
	var buttonTab = function(config){
		buttonTab.superclass.constructor.call(this,config);
		this._init();
	};

	buttonTab.ATTRS = 
	/**
	 * @lends KISSY.LP.ButtonTab.propotype
	 */
	{

		tpl: {
			value : '<ul class="'+CLS_BUTTON_TAB+'"></ul>'
		},
		/**
		 * 包含的标签项
		 * @type {Array}
		 */
		items : {
			value : []
		},
		/**
		 * 子项的模版
		 * @type {String}
		 * @default ''
		 */
		itemTpl : {
			value : '<li class="tab-item" data-value="{value}">{text}</li>'
		},
		/**
		 * 是否是表单元素，如果是表单元素，会生成隐藏域，将值附加到隐藏域上
		 * @type {Object}
		 */
		isFormField : {
			value : false
		},
		/**
		 * 所属的表单，如果此控件已经在form表单内无需填写此项
		 * @type {Object}
		 */
		form : {

		},
		/**
		 * 隐藏域的模版
		 * @type {String}
		 */
		hiddenTpl : {
			value : '<input type="hidden" name="{name}">'
		},
		/**
		 * 生成此name的隐藏域，便于表单提交
		 * @type {String}
		 * @default 'tab-name'
		 */
		name : {
			value : 'tab-name'
		},
		/**
		 * 容器id，
		 * @type {Object}
		 */
		renderTo : {

		},
		events : {
			value : [
				/**
				 * 标签发生切换
				 * @event KISSY.LP.ButtonTab#change
				 * @param {Object} e 事件对象
				 * @param {Object} e.item 当前选中的标签项纪录
				 * @param {Object} e.preItem 选中前的标签项纪录
				 */
				'change'
			]
		}
	};

	S.extend(buttonTab,S.Base);

	S.augment(buttonTab,
	/**
	 * @lends  KISSY.LP.ButtonTab.propotype
	 */
	{
		/**
		 * 获取当前选中项的值
		 * @return {Object} 值
		 */
		getActiveValue : function(){
			var _self = this,
				item = _self.getActiveItem(),
				value = null;
			if(item){
				value = item.value;
			}
			return value;
		},
		/**
		 * 获取选中的项
		 * @return {Object} 选中的项
		 */
		getActiveItem : function(){
			var _self = this,
				el = _self.get('el'),
				activeEl = el.one('.' + CLS_ACTIVE),
				item = null;
			if(activeEl){
				item = activeEl.data(DATA_ITEM);
			}
			return item;
		},
		/**
		 * 设置选中的标签
		 * @param {Object} value 标签纪录的值
		 */
		setActive: function (value) {
			var _self = this,
				item = _self._getItem(value);
			_self._setItemActive(item);
		},
		/**
		 * 根据索引设置选中的标签
		 * @param {Number} index 索引
		 */
		setActiveByIndex: function (index) {
			var _self = this;
			_self._setItemActive(_self.get('items')[index]);
		},
		//初始化入口
		_init : function(){
			var _self = this;
			_self._initDom();
			_self._initEvent();
		},
		//初始化DOM
		_initDom : function(){
			var _self = this,
				renderTo = _self.get('renderTo'),
				container = S.one('#' + renderTo),
				hiddenTpl = '',
				el = new Node(_self.get('tpl')).appendTo(container),
				hideEl = null;

			
			_self.set('el',el);
			if(_self.get('isFormField')){
				hiddenTpl = S.substitute(_self.get('hiddenTpl'),{name:_self.get('name')});

				hideEl = new Node(hiddenTpl);
				if(_self.get('form')){
					hideEl.appendTo(_self.get('form'));
				}else{
					hideEl.appendTo(container);
				}
				
				_self.set('hideEl',hideEl);
			}
			
			_self._initItems();
			
		},
		//初始化所有选项
		_initItems : function(){
			var _self = this,
				items = _self.get('items');

			S.each(items,function (item) {
				_self._initItem(item);
			});
		},
		/**
		 * 重置选项
		 * @param  {Array} items 
		 */
		resetItems : function(items){
			var _self = this;

			if(items){
				_self.set('items',items);
			}
			_self._initItem();
		},
		//初始化项
		_initItem : function(item){
			var _self = this,
				tpl = S.substitute(_self.get('itemTpl'),item),
				itemEl = new Node(tpl).appendTo(_self.get('el'));
			itemEl.data(DATA_ITEM,item);
			if(item.active){
				_self._setItemActive(item,itemEl);
			}
		},
		//初始化事件
		_initEvent : function(){
			var _self = this,
				el = _self.get('el'),
				itemCls = '.'+CLS_ITEM;

			el.delegate('click',itemCls,function(e){
				e.preventDefault();
				_self._itemClickEvent(S.one(e.currentTarget));
			}).delegate('mouseover',itemCls,function(e){
				var itemEl = S.one(e.currentTarget);

				itemEl.addClass(CLS_HOVER);
			}).delegate('mouseout',itemCls,function(e){
				var itemEl = S.one(e.currentTarget);
				itemEl.removeClass(CLS_HOVER);
			});

		},
		//点击事件
		_itemClickEvent : function(itemEl){
			var _self = this,
				item = itemEl.data(DATA_ITEM);

			_self._setItemActive(item,itemEl);

		},
		//清理活动状态
		_clearActive : function(){
			var _self = this,
				el = _self.get('el');
			el.all('.' + CLS_ITEM).removeClass(CLS_ACTIVE);
		},
		//根据值获取选项
		_getItem : function(value){
			var _self = this,
				items = _self.get('items'),
				result = null;
			S.each(items,function(item){
				if(item.value === value){
					result = item;
					return false;
				}
			});
			return result;
		},
		//获取数据相关的记录
		_getItemEl : function(item){
			var _self = this,
				el = _self.get('el'),
				items = el.all('.' + CLS_ITEM),
				result = null;
			items.each(function(itemEl){
				if(itemEl.data(DATA_ITEM) === item){
					result = itemEl;
					return false;
				}
			});
			return result;
		},
		//设置选中
		_setItemActive : function(item,itemEl){
			var _self = this,
				preItem = _self.getActiveItem();
				
			_self._clearActive();
			itemEl = itemEl || _self._getItemEl(item);
			if(itemEl && !itemEl.hasClass(CLS_ACTIVE)){
				
				itemEl.addClass(CLS_ACTIVE);
				if(_self.get('isFormField')){
					_self.get('hideEl').val(item.value);
				}
				_self.fire('change',{item : item,preItem : preItem});
			}
		},
		/**
		 * 析构函数
		 */
		destroy:function(){
			var _self = this,
				el = _self.get('el');

			el.remove();
			_self.detach();
			_self.__attrVals = {};
		}
	});

	var navTab = function(config){
		navTab.superclass.constructor.call(this,config);
	};

	navTab.ATTRS = S.merge(buttonTab,{
		tpl: {
			value : '<ul class="'+CLS_NAV_TAB+'"></ul>'
		},
		itemTpl : {
			value : '<li class="tab-item" data-value="{value}"><span class="'+CLS_ITEM_TEXT+'">{text}</span></li>'
		}
	});
	S.extend(navTab,buttonTab);

	buttonTab.Nav = navTab;

	var linkTab = function(config){
		linkTab.superclass.constructor.call(this,config);
	};

	S.extend(linkTab,buttonTab);

	linkTab.ATTRS = {
		tpl: {
			value : '<ul class="'+CLS_LINK_TAB+'"></ul>'
		},
		itemTpl : {
			value : '<li class="tab-item" data-value="{value}"><a href="#" class="'+CLS_ITEM_TEXT+'">{text}</a></li>'
		}
	};

	buttonTab.Link = linkTab;
	return buttonTab;

});