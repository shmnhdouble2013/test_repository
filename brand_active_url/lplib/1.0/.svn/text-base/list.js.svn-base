KISSY.add(function(S){

    var Node = S.Node,
    	DOM = S.DOM,
		DATA_ELEMENT = 'list-element';

	/**
	* 列表控件
	* @memberOf S.LP
	* @description 可以循环展示一组数据，以List的方式
	* @class 列表类
	*/
	function List(config){
		var _self = this;
		config = config || {};
		if (!config.renderTo) {
			throw 'please assign the id of rendered Dom!';
		}
		List.superclass.constructor.call(_self, config);

		_self._init();

	}
	
	S.extend(List, S.Base);
	S.augment(List, 
	/** @lends  S.LP.List.prototype */		
	{
		/**
		* 显示数据
		* @param {Array} data 显示的数据，每行生成对应的记录
		*/
		showData : function(data){
			var _self = this;	
			_self._clearData();
			_self.fire('beforeshow',{data : data});
			S.each(data,function(obj,index){
				_self._createItem(obj,index);
			});
			_self.fire('aftershow',{data : data});		
		},
		/**
		* 附加数据
		* @param {Array} data 附加数据，生成对应的行
		*/
		_appendData : function(data){
			var _self = this;
			S.each(data,function(obj,index){
				_self._createItem(obj,index);
			});
		},
		/**
		* 清除所有数据
		*/
		_clearData : function(data){
			var _self = this,
				body = _self.get('body');
			S.one(body).children().remove();
		},
		/**
		* 移除数据
		* @param {Array} data 移除数据对应的行
		*/
		_removeData : function(data){
			var _self = this,
				body = _self.get('body'),
				items = S.one(body).children();
            S.each(items, function (item) {
                var obj = DOM.data(item, DATA_ELEMENT);
                if (obj && S.inArray(obj, data)) {
					_self.fire('itemremoved',{data : obj,item : item});
					DOM.remove(item);
                }
            });
		},
		//创建列表项
		_createItem : function(obj,index){
			var _self = this,
				body = _self.get('body'),
				temp = '<li class="list-item">' + S.substitute(_self._getListItemTemplate(),obj) + '</li>',
				itemEl = new Node(temp).appendTo(body);
			itemEl.data(DATA_ELEMENT,obj);
			_self.fire('itemcreated',{data : obj,item : itemEl[0]});
			return itemEl;
		},
		//获取列表项的模板
		_getListItemTemplate : function(){
			return this.get('template');
		},
		//初始化入口
		_init : function(){
			var _self = this;

			_self._initDom();			
			_self._initEvent();
			_self._initDataEvent();
			_self._initData();
			
		},
		//初始化数据
		_initData:function(){
			var _self = this,
				store = _self.get('store'),
				loadMask = _self.get('loadMask'),
				el = _self.get('el');
			if (loadMask) {
				loadMask = new S.LP.LoadMask(el, {msg : 'Loading...'});
				_self.set('loadMask', loadMask);
			}
			if (store && store.autoLoad) {
				//if(!sotre.hasLoad){
					store.load();
				//}
			}
		},
		//初始化 DOM节点
		_initDom : function(){
			var _self = this,
				renderTo = _self.get('renderTo'),
				container = DOM.get('#'+renderTo),
				width = _self.get('width'),
				height = _self.get('height'),
				template = ['<div id="',renderTo+'list','" class="list-panel"><div id="',renderTo+'tbar','" class="list-bar list-tbar"></div><div class="list-view"><ul class="list-content"></ul></div><div  id="',renderTo+'bbar','"class="list-bar list-bbar"></div>'].join(''),
				el = new Node(template).appendTo(container),
				view = el.one('.list-view'),
				tbarEl = el.one('.list-tbar'),
				bbarEl = el.one('.list-bbar'),
				body = el.one('.list-content');
				
			_self.set('el',el);
			_self.set('view',view);
			_self.set('body',body);
			_self.set('tbarEl',tbarEl);
			_self.set('bbarEl',bbarEl);
			
			_self._initBar();
			_self._setSize(width,height);

		},
		//初始化事件
		_initEvent : function(){
			
		},
		//初始化数据事件
		_initDataEvent : function(){
			var _self = this,
				store = _self.get('store');
			if (store) {
				store.on('beforeload', function () {
					var loadMask = _self.get('loadMask');
					
					if (loadMask) {
						loadMask.show();
					}
				});
				store.on('load', function () {
					var results = store.getResult(),
						loadMask = _self.get('loadMask');
					_self.showData(results);
					if (loadMask) {
						loadMask.hide();
					}
				});
				store.on('addrecords', function (event) {
					var data = event.data;
					_self.appendData(data);
					//TODO
				});
				store.on('removerecords', function (event) {
					var data = event.data;
					_self.removeData(data);
					//TODO
				});
				store.on('exception', function () {
					var loadMask = _self.get('loadMask');
					if (loadMask) {
						loadMask.hide();
					}
				});
			}
		},
		//初始化Bar
		_initBar : function(){
			var _self = this,
				renderTo = _self.get('renderTo'),
				tbarConfig = _self.get('tbar'),
				bbarConfig = _self.get('bbar'),
				store = _self.get('store'),
				pageSize = 0,
				tpbar = null,//上面的分页栏
				tbbar = null,//上面的按钮栏
				bpbar = null,
				params = null;

			/**
			* @private
			*/
			function createPaggingBar(config, renderTo) {
				var barconfig = S.merge(config, {renderTo : renderTo});
				if (store && !barconfig.store) {
					barconfig.store = store;
				}
				return new S.LP.PaggingBar(barconfig);
			}

			/**
			* @private
			*/
			function createButtonBar(config,renderTo){
				var btnConfig = S.merge(config,{renderTo : renderTo});
				return new S.LP.ButtonBar(btnConfig);
			}
			/**
			* private
			*/
			function createBars(config,prefix){
				if(config.pageSize){
					tpbar = createPaggingBar(config, renderTo + prefix + 'bar');
					_self.set(prefix + 'paggingBar', tpbar);
					pageSize = config.pageSize;
				}
				if(config.buttons){
					tbbar = createButtonBar(config, renderTo + prefix + 'bar');
					_self.set(prefix + 'buttonBar', tbbar);
				}
			}

			if (tbarConfig) {
				createBars(tbarConfig,'t');
			}
			if (bbarConfig) {
				createBars(bbarConfig,'b');
			}
			if (pageSize && store) {
				params = store.params;
				if (!params.start) {
                    params.start = 0;
					params.pageIndex = 0;
				}
				if (!params.limit || params.limit !== pageSize) {
					params.limit = pageSize;
				}
			}
		},
		//设置大小
		_setSize : function(width,height){
			var _self = this,
				el = _self.get('el'),
				view = _self.get('view'),
				tbar= _self.get('tbarEl'),
				bbar = _self.get('bbarEl');

			el.width(width);
			el.height(height);
			view.width(width - 2);
			//可视区域的高度 = 总高度 - tbar高度 - bbar高度
			view.height(height - tbar.height() - bbar.height() - 2);
				
		},
		/**
		* 析构函数
		*/
		destroy : function(){
			var _self = this,
				el = _self.get('el');
				
			
			el.remove();
			_self.detach();
			_self.__attrVals = {};
		}
	});
	
	S.LP.List = List;
}, {
    requires : ['core', './uicommon','./bar','./css/list.css']
});