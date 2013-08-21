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


