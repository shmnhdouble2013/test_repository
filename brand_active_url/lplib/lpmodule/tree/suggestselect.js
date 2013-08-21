/** 
* @fileOverview SuggestSelect 可搜索多级下拉框
* @author  dengbin
* @version 1.0
*/
KISSY.add('lpmodule/tree/suggestselect',function(S, View){
	/**
        @exports S.LP.Tree as KISSY.LP.Tree
	*/
	var win = window,
		DOM = S.DOM,
		Event = S.Event,
		doc = document,
		body = S.one('body');
	var CLS_ITEM = 'list-li',
		LI = 'LI', li = 'li', DIV = '<div>',OL = 'ol',HIDDEN = 'hidden',UNDEFINED = 'undefined',EMPTY = '',
		SELECT_FIELD_CLS = 'select-field',
		SELECTED_ITEM_CLS = 'ks-selected',
		HOVER_CLS = 'suggest-hover',
		SUGGEST_KEY_CLS = 'suggest-key',
		CLS_ITEM_SELECTED = 'suggest-selected',
		SUGGEST_SELECT_INPUT = 'suggest-select-input',
		HTML_SUGGEST_SELECT = '<div class="suggest-select"><input class="suggest-select-input" /><s class="suggest-select-icon"></s></div>',
		HTML_SUGGEST_SELECT_CONTAINER = ['<div class="suggest-container">',
										'<div class="suggest-content">',
										'<ol class="ks-clear">',
										'</ol>',
										'</div>',
										'</div>'].join('');
	
	/**
	* SuggestSelect 可搜索多级下拉框
	* @memberOf S.LP.Tree
	* @description 可搜索多级下拉框 基于Tree.View 提供树的视图功能，并支持视图内搜索
	* @class List 可搜索多级下拉框
	* @param {Object} config 配置项 请参照Tree.View的配置项
	*/
	function SuggestSelect(config){
		var _self = this;
		config = S.merge(SuggestSelect.config, config);
		SuggestSelect.superclass.constructor.call(_self, config);
		_self._initSuggestSelect();
	}
	SuggestSelect.config = 
	/** @lends  S.LP.Tree.SuggestSelect.prototype */		
	{
		/**
		* 视图下拉框的距离输入框的位置 (选填)
		* @field
		* @type Number
		*/
		offset : -1,
		/**
		* 视图下拉框的宽度 (选填)
		* @field
		* @type String
		*/
		containerWidth : 'auto'
	};
	S.extend(SuggestSelect, View);
	S.augment(SuggestSelect,{
		//初始化
		_initSuggestSelect : function(){
			var _self = this;
			_self._initSuggestSelectEvent();
		},
		//初始化事件
		_initSuggestSelectEvent : function(){
			var _self = this;
			//store对象更新后，更新结果
			_self.on('changeSelectByStore',function(e){
				var input = e.list.input,
					container = e.list.itemsCon,
					item = e.item;
				if(item){
					DOM.val(input,item.data('nodeData').value);
					_self.hide(container);
				}
			});
		
		},
		//重写-初始化视图dom
		_initListDom : function(list, index){
			var _self = this,
				selectDom = DOM.create(HTML_SUGGEST_SELECT),
				divDom = S.Node(DOM.create('<div class="'+SELECT_FIELD_CLS+'"></div>')),
				container = _self.get('container');

			divDom.append(selectDom);
			container.append(divDom);

			list.itemsSel = S.one(selectDom);
			list.input = S.one('.'+SUGGEST_SELECT_INPUT,selectDom);
			list.input.data('index', index);
			//list.input.val('请选择...');

			var minWidth = 'min-width:'+list.input.width()+'px;',
				maxWidth = '*max-width:'+list.input.width()+'px;',
				selectConDom = DOM.create(HTML_SUGGEST_SELECT_CONTAINER,{style:'position:absolute;visibility:hidden;z-index:9999;'+maxWidth+minWidth});

			list.itemsCon = selectConDom;
			list.itemsOl = DOM.get(OL,selectConDom) ;

			divDom.append(selectConDom);
			_self._setContainerRegion(list);

			return S.one(divDom);
		},
		//重写-初始化视图事件
		_initListEvent : function(list){
			var _self = this,
				select = list.itemsSel,
				input = list.input,
				container = list.itemsCon,
				searchTimer;
			//鼠标点击事件
			Event.on(select,'click',function(ev){
				_self.show(list);
				ev.halt();
			});	
			//body点击事件
			Event.on(doc,'click',function(ev){
				_self.hide(container);
			});
			//键盘起来事件
			list.input.on('keyup', function(e){
				if(e.which === 32 || e.which === 8 || e.which === 46 || (e.which >= 65 && e.which <= 90) || (e.which >= 48 && e.which <= 57) || (e.which >= 96 && e.which <= 105)){
					var input = S.one(this);
					if(searchTimer){
						searchTimer.cancel();
					}
					searchTimer = S.later(function(){
						_self._searchList(input.val(), input.data('index'));
					}, 200);
				}
			});
			// 屏蔽回车事件
			list.input.on('keydown', function(e){
				if(e.which === 13){
					return false;
				}
			});
		},
		// 重写 - 初始化视图节点dom
		_initListItemsDom: function(list, nodeData, index, id, text){
			var itemCls = CLS_ITEM,
				itemText = nodeData.value,
				itemTemp = itemText,
				itemStr,
				itemEl;

			if(text){
				itemText = itemText.replace(text, '<s>' + text + '</s>');
			}

				itemStr = ['<li class="', itemCls, '" title="',itemTemp ,'">',
					itemText,
					'</li>'
				].join('');
			

			itemEl = DOM.create(itemStr);
			S.Node(list.itemsOl).append(itemEl);
			itemEl = S.one(itemEl);

			return itemEl;
		},
		// 重写 - 初始化视图节点事件
		_initListItemsEvent : function(itemEl, list){
			var _self = this;
			itemEl.on('click', function(ev){
				var item = S.one(this);
				if(!_self._isItemSelect(item)){
					_self._itemChangeSelect(S.one(this));
				}else if(item.data('nodeData').value !== list.input.value){
					_self._itemChangeSelect(S.one(this));
				}
			});
			itemEl.on('mouseenter', function (ev){
				var target = ev.target;
				_self._setHoverItem(target);
			});
			itemEl.on('mouseleave', function (ev){
				var target = ev.target;
				_self._removeHoverItem();
			});
			
		},
		//移出节点高亮
		_removeHoverItem : function(){
			if (this.selectedItem.nodeName !== LI) {
				this.selectedItem = DOM.parent(this.selectedItem, li);
			} 
			DOM.removeClass(this.selectedItem, HOVER_CLS);
			this.selectedItem = undefined;
		},
		//增加节点高亮
		_setHoverItem : function(item){
			DOM.addClass(item, HOVER_CLS);
            this.selectedItem = item;
		},
		/**
		* 隐藏下拉框
		*/
		hide : function(element){
			if(!this.isVisible(element))return;
			this.invisible(element);
		},
		/**
		* 显示下拉框
		*/
		show:function (list) {
			var _self = this;
			if (_self.isVisible(list.itemsCon)) return;
			var container = DOM.get(list.itemsCon);
			// 每次显示前，都重新计算位置，这样能自适应 input 的变化（牺牲少量性能，满足更普适的需求）
			_self._setContainerRegion(list);
			_self.visible(list.itemsCon);
		}, 
		//判断已经显示
		isVisible : function(element){
			return element.style.visibility != HIDDEN;
		},
		//隐藏
		invisible : function(element){
			DOM.style(element,'visibility',HIDDEN);
		},
		//出现
		visible : function(element){
			DOM.style(element,'visibility',EMPTY);
		},
		
		// 重写 - 获取视图节点
		_getItems: function(list){
			return S.all('.' + CLS_ITEM, list.dom);
		},
		// 重写 - 判断节点是否选中
		_isItemSelect: function(item){
			return item.hasClass(CLS_ITEM_SELECTED);
		},

		// 重写 - 添加节点选中状态
		_addItemSelect: function(item){
			item.addClass(CLS_ITEM_SELECTED);
		},
		// 重写 - 移除节点选中状态
		_removeItemSelect: function(item){
			item.removeClass(CLS_ITEM_SELECTED);		
		},
		// 重写 - 移除所有节点选中状态
		_removeAllSelectByItem: function(item){
			item.siblings().removeClass(CLS_ITEM_SELECTED);	
		},
		// 重写 - 移除所有节点选中状态
		_removeAllSelectByList: function(list){
			var _self = this,
				items = _self._getItems(list);
			items.removeClass(CLS_ITEM_SELECTED);		
		},
		//下拉框定位
		_setContainerRegion:function (list) {
			var _self = this,
			suggestSelect = list.itemsSel,
			p = DOM.offset(suggestSelect),
			container = DOM.get(list.itemsCon);
			DOM.offset(container, {
				left:p.left,
				top:p.top + suggestSelect.offsetHeight + _self.get('offset')
			});
			// 默认 container 的边框为 1, padding 为 0, 因此 width = offsetWidth - 2
			DOM.width(container, _self.get('containerWidth') || suggestSelect.offsetWidth - 2);
		}	
	});
	return SuggestSelect;

},{requires: ['./view']});