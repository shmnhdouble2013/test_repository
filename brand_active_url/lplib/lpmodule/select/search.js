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


