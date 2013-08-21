/** @fileOverview 对KISSY进行扩展的一些帮助函数
* 包括：屏蔽层，格式化函数，Form帮助类，数据缓冲类
* @author <a href="mailto:dxq613@gmail.com">董晓庆 旺旺：dxq613</a>  
* @version 1.0.1  
*/
KISSY.add(function(S){
	
	var DOM = S.DOM, 
		Event = S.Event,
        win = window, 
        UA=S.UA;

	/** 
		@namespace 良权限控件命名控件
		@exports S.LP as KISSY.LP
		@description 所有良权限控件库的命名控件
	*/
	S.LP = S.namespace('LP');

	S.mix(S.LP,
	/** @lends  S.LP */
	{
		/**
		 * 版本
		 * @type {String}
		 */
		version : '2.0',
		/**
		* @description 屏蔽整个页面: <br> 1）ie 6,ie 7下设置100%无效 <br> 2) 兼容浏览器的可视区域和内容区域
		* @example 
		*	S.LP.mask();	//屏蔽窗口
		*	S.LP.unmask();	//解除屏蔽窗口
		*/
		mask : function(){
			var bodyEl = S.one('body'),
				bodyHeight = bodyEl.height(),
				viewHeight = DOM.viewportHeight(),
				height = bodyHeight > viewHeight ?bodyHeight :viewHeight,
				maskEl = S.LP.maskElement(bodyEl),
				funcId =null;
			
			/**
			 * 设置mask 的高度
			 * @private
			 */
			function setHeight(){
				var viewHeight = DOM.viewportHeight(),
					height = bodyHeight > viewHeight ?bodyHeight :viewHeight;
				maskEl.height(height);
			}
			/**
			 * 窗口发生改变时屏蔽自动改变大小
			 * @private 
			 */
			function resizeEvent(){

				if(funcId)
				{
					clearTimeout(funcId);
				}
				funcId = setTimeout(setHeight,300);
			}
			
			maskEl.height(height);
			Event.on(win,'resize',resizeEvent);
			maskEl.data('reszieFunc',resizeEvent);
			
		},
		/**
			@description 取消屏蔽整个页面
		*/
		unmask :function(){
			var bodyEl = S.one('body'),
				maskEl = bodyEl.children('.lp-el-mask'),
				func = maskEl.data('reszieFunc');
			if(func){
				Event.remove(win,'resize',func);
				maskEl.data('reszieFunc',null);
			}
			S.LP.unmaskElement(bodyEl);
		},
		/**
		* @description 屏蔽指定元素
		* @param {[String|DOM|Node]} element 屏蔽的元素，可以使用选择器、Dom元素，Node元素
		* @param {String} msg 屏蔽层上显示的信息，可以为空
		* @param {String} msgCls 屏蔽信息上应用的CSS,可以为空，此项仅在 msg有效时起作用
		* @example 
		*	S.LP.maskElement('#domId');	//屏蔽元素，暂时只屏蔽选择器的第一个元素
		*/
		maskElement: function (element, msg, msgCls) {
			var maskedEl = S.one(element),
				maskedNode = maskedEl.getDOMNode(),
				maskDiv = S.one(maskedEl.children('.lp-el-mask')),//S.one('',maskedNode),
				template = null,
				msgDiv = null,
				top = null,
				left = null;
			if (!maskDiv) {
				maskDiv = S.one(DOM.create('<div class="lp-el-mask"></div>')).appendTo(maskedNode);
				maskedEl.addClass('x-masked-relative x-masked');
				if(UA.ie === 6){
					maskDiv.height(maskedEl.height());
				}
				if (msg) {
					template = ['<div class="lp-el-mask-msg"><div>', msg, '</div></div>'].join('');
					msgDiv = S.one(DOM.create(template)).appendTo(maskedNode);
					if (msgCls) {
						msgDiv.addClass(msgCls);
					}
					try{
						top = (maskedEl.height() - msgDiv.height()) / 2;
						left = (maskedEl.width()- msgDiv.width()) / 2;
							
						msgDiv.css({ left: left, top: top });
					}catch(ex){
						
					}
				}
			}
			return maskDiv;
		},
		/**
		* @description 解除对应元素的屏蔽
		* @param {[String|DOM|Node]} element 屏蔽的元素，可以使用选择器、Dom元素，Node元素
		* @example 
		*	S.LP.unmaskElement('#domId');	//解除屏蔽元素，暂时只支持选择器的第一个元素
		*/ 
		unmaskElement: function (element) {
			var maskedEl = S.one(element),
				msgEl = maskedEl.children('.lp-el-mask-msg'),
				maskDiv = maskedEl.children('.lp-el-mask');
			if(msgEl){
				msgEl.remove();
			}
			if(maskDiv){
				maskDiv.remove();
			}
			maskedEl.removeClass('x-masked-relative x-masked');

		},
		/**
		 * 页面上的一点是否在用户的视图内
		 * @param {Object} offset 坐标，left,top
		 * @return {Boolean} 是否在视图内
		 */
		isInView : function(offset){
			var left = offset.left,
				top = offset.top,
				viewWidth = DOM.viewportWidth(),
				wiewHeight = DOM.viewportHeight(),
				scrollTop = DOM.scrollTop(),
				scrollLeft = DOM.scrollLeft();
			//判断横坐标
			
            if(left < scrollLeft ||left > scrollLeft + viewWidth){
				return false;
			}
			//判断纵坐标
			if(top < scrollTop || top > scrollTop + wiewHeight){
				return false;
			}
			return true;
		},
		/**
		 * 页面上的一点纵向坐标是否在用户的视图内
		 * @param {Object} top  纵坐标
		 * @return {Boolean} 是否在视图内
		 */
		isInVerticalView : function(top){
			var wiewHeight = DOM.viewportHeight(),
				scrollTop = DOM.scrollTop();
			
			//判断纵坐标
			if(top < scrollTop || top > scrollTop + wiewHeight){
				return false;
			}
			return true;
		},
		/**
		 * 页面上的一点横向坐标是否在用户的视图内
		 * @param {Object} left 横坐标
		 * @return {Boolean} 是否在视图内
		 */
		isInHorizontalView : function(left){
			var viewWidth = DOM.viewportWidth(),			
				scrollLeft = DOM.scrollLeft();
			//判断横坐标
			if(left < scrollLeft ||left > scrollLeft + viewWidth){
				return false;
			}
			return true;
		}
	});
	
	/**
		格式化数据的帮助方法
		@description 用于格式化文本，常用于表格
		@class 格式化帮助类
	*/
	S.LP.Format = (function(){
		/** @lends  S.LP.Format */	
		return {
			/**
				@description 日期格式化函数
				@param {Number|Date} date 格式话的日期，一般为1970 年 1 月 1 日至今的毫秒数 
				@return {String} 格式化后的日期格式为 2011-10-31
				@example
			* 一般用法：<br> 
			* S.LP.Format.dateRenderer(1320049890544);输出：2011-10-31 <br>
			* 表格中用于渲染列：<br>
			* {title:"出库日期",dataIndex:"date",renderer:S.LP.Format.dateRenderer}
			*/
			dateRenderer: function (d) {
				if(!d){
					 return '';
				}
				if(S.isString(d)){
					return d;
				}
				var date = null;
                try {
                    date =new Date(d);
                } catch (e) {
                    return '';
                }
                if (!date || !date.getFullYear){
                    return '';
                }
                return S.Date.format(d,'yyyy-mm-dd');
            },
			/**
				@description 日期时间格式化函数
				@param {Number|Date} date 格式话的日期，一般为1970 年 1 月 1 日至今的毫秒数 
				@return {String} 格式化后的日期格式时间为 2011-10-31 16 : 41 : 02
			*/
			datetimeRenderer: function (d) {
				if(!d){
					 return '';
				}
				if(S.isString(d)){
					return d;
				}
				var date = null;
                try {
                    date =new Date(d);
                } catch (e) {
                    return '';
                }
                if(!date || !date.getFullYear){
                	return '';
                }
                return S.Date.format(d,'yyyy-mm-dd HH:MM:ss');
			},
			/**
				@description 文本截取函数，当文本超出一定数字时，会截取文本，添加...
				@param {Number} length 截取多少字符
				@return {function} 返回处理函数 返回截取后的字符串，如果本身小于指定的数字，返回原字符串。如果大于，则返回截断后的字符串，并附加...
			*/
			cutTextRenderer : function(length){
				return function(value){
					value = value || '';
					if(value.toString().length > length){
						return value.toString().substring(0,length)+'...';
					}
					return value;
				};
			},
			/**
			* @description 枚举格式化函数
			* @param {Object} enumObj 键值对的枚举对象 {"1":"大","2":"小"}
			* @return {Function} 返回指定枚举的格式化函数
			* @example 
			* //Grid 的列定义
			*  {title:"状态",dataIndex:"status",renderer:S.LP.Format.enumRenderer({"1":"入库","2":"出库"})}
			*/
			enumRenderer : function(enumObj){
				return function(value){
					return enumObj[value] || '';
				};
			},
			/*
			* @description 将多个值转换成一个字符串
			* @param {Object} enumObj 键值对的枚举对象 {"1":"大","2":"小"}
			* @return {Function} 返回指定枚举的格式化函数
			* @example 
			* //Grid 的列定义
			*  {title:"状态",dataIndex:"status",renderer:S.LP.Format.multipleItemsRenderer({"1":"入库","2":"出库","3":"退货"})}
			*  //数据源是[1,2] 时，则返回 "入库,出库"
			*  
			*/
			multipleItemsRenderer : function(enumObj){
				var enumFun = S.LP.Format.enumRenderer(enumObj);
				return function(values){
					var result = [];
					if(!values){
						return '';
					}
					if(S.isArray(values)){
						values = values.toString().split(',');
					}
					S.each(values,function(value){
						result.push(enumFun(value));
					});
					
					return result.join(',');
				};
			},
			/*
			* @description 将财务数据分转换成元
			* @param {Number|String} enumObj 键值对的枚举对象 {"1":"大","2":"小"}
			* @return {Number} 返回将分转换成元的数字
			*/
			moneyCentRenderer : function(v){
				if(S.isString(v)){
					v = parseFloat(v);
				}
				if(S.isNumber(v)){
					return (v * 0.01).toFixed(2);
				}
				return v;
			}
		};
	}());
	/**
	* 屏蔽指定元素，并显示加载信息
	* @memberOf S.LP
	* @class 加载屏蔽类
	* @property {String|DOM|Node} el 要屏蔽的元素，选择器、Dom元素或Node元素
	* @param {String|DOM|Node} element 要屏蔽的元素，选择器、Dom元素或Node元素
	* @param {Object} config 配置信息<br>
	* 1) msg :加载时显示的加载信息<br>
	* 2) msgCls : 加载时显示信息的样式
	*/
    function LoadMask (element, config) {
		var _self = this;
		
        _self.el = element;
		LoadMask.superclass.constructor.call(_self, config);
		_self._init();
    }

	S.extend(LoadMask, S.Base);
    //对象原型
    S.augment(LoadMask, 
	/** @lends S.LP.LoadMask.prototype */	
	{
		/**
		* 加载时显示的加载信息
		* @field 
		* @default Loading...
		*/
        msg: 'Loading...',
		/**
		* 加载时显示的加载信息的样式
		* @field
		* @default x-mask-loading
		*/
        msgCls: 'x-mask-loading',
		/**
		* 加载控件是否禁用
		* @type Boolean
		* @field
		* @default false
		*/
        disabled: false,
		_init:function(){
			var _self =this;
			_self.msg = _self.get('msg')|| _self.msg;
		},
        /**
		* @description 设置控件不可用
		*/
        disable: function () {
            this.disabled = true;
        },
        /**
		* @private 设置控件可用
		*/
        enable: function () {
            this.disabled = false;
        },

        /**
		* @private 加载已经完毕，解除屏蔽
		*/ 
        onLoad: function () {
            S.LP.unmaskElement(this.el);
        },

        /**
		* @private 开始加载，屏蔽当前元素
		*/ 
        onBeforeLoad: function () {
            if (!this.disabled) {
                S.LP.maskElement(this.el, this.msg, this.msgCls);

            }
        },
        /**
        * 显示加载条，并遮盖元素
        */
        show: function () {
            this.onBeforeLoad();
        },

        /**
        * 隐藏加载条，并解除遮盖元素
        */
        hide: function () {
            this.onLoad();
        },

        /*
		* 清理资源
		*/
        destroy: function () {
			this.el = null;   
        }
    });

	S.LP.LoadMask = LoadMask;
	
	/**
	* 数据缓冲类，缓存数据在浏览器中
	* @memberOf S.LP
	* @class 数据缓冲类
	* @param {Object} config 配置项，store上面的field字段可以传入配置项中
	* @property {String} url 是字段 proxy.url的简写方式，可以直接写在配置信息中
	* @example 
	* var store = new S.LP.Store({
	*	url : 'data.php',
	*	autoLoad : true
	*});
	*/
	function Store(config){
		var _self = this;

		config = config || {};

		config = S.merge(
		/** @lends S.LP.Store.prototype */	
		{
			/**
			* 加载数据时，返回数据的根目录
			* @field
			* @type String
			* @default  "rows"
			* @example 
			* '{"rows":[{"name":"abc"},{"name":"bcd"}],"results":100}'
			*/
			root: 'rows', 
			/**
			* 加载数据时，符合条件的数据总数，用于分页
			* @field
			* @type String
			* @default  "results"
			* @example
			*
			* '{"rows":[{"name":"abc"},{"name":"bcd"}],"results":100}'
			*/
			totalProperty: 'results', 
			/**
			* 加载数据时，返回的格式,目前只支持"json、jsonp"格式<br>
			* @field
			* @type String
			* @default "json"
			*/
			dataType: 'json', 
			/**
			* 创建对象时是否自动加载
			* @field
			* @type Boolean
			* @default false
			*/
			autoLoad: false,
			/**
			* 排序信息
			* @field 
			* @type Object
			* @default { field: '', direction: 'ASC' }
			* @example 
			* var store = new S.LP.Store({
			*		url : 'data.php',
			*		autoLoad : true,
			*		sortInfo: { field: 'name', direction: 'DESC' }//按照'name' 字段降序排序
			*	});
			*/
			sortInfo: { field: '', direction: 'ASC' },
			/**
			* 连接信息，包含2个字段:<br>
			* url : 加载数据的地址<br>
			* method : 加载数据的方式"get","post"，默认值为"post"
			* @field 
			* @type Object
			* @default { method: 'post' }
			* @example 
			* var store = new S.LP.Store({
			*		autoLoad : true,
			*		proxy: {url : 'data.php', method: 'get' }//按照'name' 字段降序排序
			*	});
			*/
			proxy: { method: 'post' },
			/**
			* 自定义参数，用于加载数据时发送到后台
			* @field
			* @type Object
			* @example
			* var store = new S.LP.Store({
			*		url :'data',
			*		autoLoad : true,
			*		params: {id:'124',type:1}//自定义参数
			*	});
			*/
			params:{},
			/**
			* 是否后端排序，如果为后端排序，每次排序发送新请求，否则，直接前端排序
			* @field
			* @type Boolean
			* @default false
			*/
			remoteSort: false,
			/**
			* 对象的匹配函数，验证两个对象是否相当
			* @field
			* @type Function
			* @default function(obj1,obj2){return obj1==obj2};
			* 
			*/
			matchFunction : function(obj1,obj2){
				return obj1 === obj2;
			},
			/**
			*
			*
			*/
			compareFunction : function(obj1,obj2){
				if(obj1 === undefined)
				{
					obj1 = '';
				}
				if(obj2 === undefined){
					obj2 = '';
				}
				if(S.isString(obj1)){
					return obj1.localeCompare(obj2);
				}

				if(obj1 > obj2){
					return 1;
				}else if(obj1 === obj2){
					return 0;
				}else{
					return  -1;
				}
			}
		},config);
		S.mix(_self,config);
		S.mix(_self , {
			hasLoad : false,
			resultRows : [],
			newRecords : [],
			modifiedRecords : [],
			deletedRecords : [],
			rowCount : 0,
			totalCount : 0
		});
		//声明支持的事件
		_self.events = [
			/**  
			* 数据接受改变，所有增加、删除、修改的数据记录清空
			* @name S.LP.Store#acceptchanges
			* @event  
			*/
			'acceptchanges',
			/**  
			* 当数据加载完成后
			* @name S.LP.Store#load  
			* @event  
			* @param {event} e  事件对象，包含加载数据时的参数
			*/
			'load',

			/**  
			* 当数据加载前
			* @name S.LP.Store#beforeload
			* @event  
			*/
			'beforeload',

			/**  
			* 发生在，beforeload和load中间，数据已经获取完成，但是还未触发load事件，用于获取返回的原始数据
			* @name S.LP.Store#beforeProcessLoad
			* @event  
			* @param {event} e  事件对象
			* @param {Object} e.data 从服务器端返回的数据
			*/
			'beforeProcessLoad',
			
			/**  
			* 当添加数据时触发该事件
			* @name S.LP.Store#addrecords  
			* @event  
			* @param {event} e  事件对象
			* @param {Array} e.data 添加的数据集合
			*/
			'addrecords',
			/**
			* 
			*/
			'exception',
			/**  
			* 当删除数据是触发该事件
			* @name S.LP.Store#removerecords  
			* @event  
			* @param {event} e  事件对象
			* @param {Array} e.data 删除的数据集合
			*/
			'removerecords',
			
			/**  
			* 当更新数据指定字段时触发该事件
			* @name S.LP.Store#updaterecord  
			* @event  
			* @param {event} e  事件对象
			* @param {Object} e.record 更新的数据
			* @param {Object} e.field 更新的字段
			* @param {Object} e.value 更新的值
			*/
			'updaterecord',
			/**  
			* 前端发生排序时触发
			* @name S.LP.Store#localsort
			* @event  
			* @param {event} e  事件对象
			* @param {Object} e.field 排序的字段
			* @param {Object} e.direction 排序的方向 'ASC'，'DESC'
			*/
			'localsort'
		];
		_self._init();
	}
	S.augment(Store,S.EventTarget);

	S.augment(Store, 
	/** @lends S.LP.Store.prototype */	
	{
		/**
		* 接受数据改变，将缓存的修改、新增、删除的集合清除
		*/
		acceptChanges : function(){
			var _self = this;

			_self._clearChanges();
			_self.fire('acceptchanges');
		},
		
		/**
		* 添加记录
		* @param {Array|Object} data 添加的数据，可以是数组，可以是单条记录
		* @param {Boolean} [noRepeat = false] 是否去重,可以为空，默认： false 
		* @param {Function} [match] 匹配函数，可以为空，默认是：<br>
		*  function(obj1,obj2){
		*	 return obj1 == obj2;
		*  }
		* 
		*/
		add :function(data,noRepeat,match){
			var _self=this,
				newData=[];
			match = match || _self._getDefaultMatch();
			if(!S.isArray(data)){
				data = [data];
			}

			S.each(data,function(element){
				if(!noRepeat || !_self.contains(element,match)){
					_self._addRecord(element);
					newData.push(element);
					_self.newRecords.push(element);
					_self._removeFrom(element,_self.deletedRecords);
					_self._removeFrom(element,_self.modifiedRecords);
				}
			});
			_self.fire('addrecords',{data:newData});
		},
		/**
		* 清除数据,清空所有数据
		*/
		clear : function(){
			var _self = this;
			_self.setResult([]);
		},
		/**
		* store的比较函数
		* @param {Object} obj1 进行比较的记录1
		* @param {Object} obj2 进行比较的记录2
		* @param {String} [field] 进行排序的字段,默认为 sortInfo.field
		* @param {String} [direction] 进行排序的方向,默认为 sortInfo.direction 包括‘ASC’，‘DESC'
		* @return {Number} 
		* 当 obj1 > obj2 时返回 1
		* 当 obj1 = obj2 时返回 0 
		* 当 obj1 < obj2 时返回 -1
		*/
		compare : function(obj1,obj2,field,direction){

			var _self = this,
				dir = 1;
			field = field || _self.sortInfo.field;
			direction = direction || _self.sortInfo.direction;
			//如果未指定排序字段，或方向，则按照默认顺序
			if(!field || !direction){
				return 1;
			}
			dir = direction === 'ASC' ? 1 : -1;

			return this.compareFunction(obj1[field],obj2[field]) * dir;
		},
		/**
		* 验证是否存在指定记录
		* @param {Object} record 指定的记录
		* @param {Function} [match = function(obj1,obj2){return obj1 == obj2}] 默认为比较2个对象是否相同
		* @return {Boolean}
		*/
		contains :function(record,match){
			return this.findIndexBy(record,match)!==-1;
		},
		/**
		* 查找数据所在的索引位置,若不存在返回-1
		* @param {Object} target 指定的记录
		* @param {Function} [func = function(obj1,obj2){return obj1 == obj2}] 默认为比较2个对象是否相同
		* @return {Number}
		*/
		findIndexBy :function(target,func){
			var _self = this,
				position = -1,
				records = this.resultRows;
			func = func || _self._getDefaultMatch();
			if(S.isUndefined(target)||S.isNull(target)){
				return -1;
			}
			S.each(records,function(record,index){
				if(func(target,record)){
					position = index;
					return false;
				}
			});
			return position;
		},
		/**
		* 查找记录，仅返回第一条
		* @param {String} field 字段名
		* @param {String|Function} value 字段值 或过滤方法
		* @return {Object|null}
		*/
		find : function(field, value, func){
			var result = null,
				records = this.resultRows;
			S.each(records,function(record,index){
				if((func && func(record[field], value)) || record[field] === value){
						result = record;
						return false;
				}
			});
			return result;
		},
		/**
		* 根据索引查找记录
		* @param {Number} index 索引
		* @return {Object} 查找的记录
		*/
		findByIndex : function(index){
			return this.resultRows[index];
		},
		/**
		* 查找记录，返回所有符合查询条件的记录
		* @param {String} field 字段名
		* @param {String|Function} value 字段值 或过滤方法
		* @return {Array}
		*/
		findAll : function(field, value, func){
			var result = [],
				records = this.resultRows;
			S.each(records,function(record,index){
				if((func && func(record[field], value)) || record[field] === value){
					result.push(record);
				}
			});
			return result;
		},
		/**
		* 获取下一条记录
		* @param {Object} record 当前记录
		* @return {Object} 下一条记录
		*/
		findNextRecord : function(record){
			var _self = this,
				index = _self.findIndexBy(record);
			if(index >= 0){
				return _self.findByIndex(index + 1);
			}
			return undefined;
		},
		/**
		* 加载数据,若不提供参数时，按照上次请求的参数加载数据
		* @param {Object} [params] 自定义参数以对象形式提供
		* @example 
		* store.load({id : 1234, type : 1});
		*/
		load :function (params){
			//_self.hasLoad = true;
			this._loadData(params);
		},
		/**
		* 获取加载完的数据
		* @return {Array}
		*/
		getResult : function(){
			return this.resultRows;
		},
		/**
		* 获取加载完的数据的数量
		* @return {Number}
		*/
		getCount : function () {
            return this.resultRows.length;
        },
		/**
		* 获取添加的数据
		* @return {Array} 返回新添加的数据集合
		*/
		getNewRecords : function(){
			return this.newRecords;
		},
		
		/**
		* 获取更改的数据
		* @return {Array} 返回更改的数据集合
		*/
		getModifiedRecords : function(){
			return this.modifiedRecords;
		},
		/**
		* 获取删除的数据
		* @return {Array} 返回删除的数据集合
		*/
		getDeletedRecords : function(){
			return this.deletedRecords;
		},
		/**
		* 获取表格源数据的总数
		* @return {Number}
		*/
        getTotalCount : function () {
            return this.totalCount;
        },
		/**
		* 删除记录触发 removerecords 事件.
		* @param {Array|Object} data 添加的数据，可以是数组，可以是单条记录
		* @param {Function} [match = function(obj1,obj2){return obj1 == obj2}] 匹配函数，可以为空
		*/
		remove :function(data,match){
			var _self =this,
				delData=[];
			match = match || _self._getDefaultMatch();
			if(!S.isArray(data)){
				data = [data];
			}
			S.each(data,function(element){
				var index = _self.findIndexBy(element,match),
				    record = _self._removeAt(index);
				//添加到已删除队列中,如果是新添加的数据，不计入删除的数据集合中
				if(!S.inArray(record,_self.newRecords) && !S.inArray(record,_self.deletedRecords)){
					_self.deletedRecords.push(record);
				}
				_self._removeFrom(record,_self.newRecords);
				_self._removeFrom(record,_self.modifiedRecords);
				
				delData.push(record);
			});
			
			_self.fire('removerecords',{data:delData});
		},
		/**
		* 设置数据，在不自动加载数据时，可以自动填充数据，会触发 load事件
		* @param {Array} data 设置的数据集合，是一个数组
		*/
		setResult:function(data){
			data= data||[];
			var _self =this;
			_self.resultRows = data;
			_self.rowCount = data.length;
			_self.totalCount = data.length;
			 _self._sortData();
			_self.fire('load',_self.oldParams);
		},
		/**
		* 设置记录的值 ，触发 updaterecord 事件
		* @param {Object} obj 修改的记录
		* @param {String} field 修改的字段名
		* @param {Any Type} value 修改的值
		* @param {Boolean} [isMatch = false] 是否需要进行匹配，检测指定的记录是否在集合中
		*/
		setValue : function(obj,field,value,isMatch){
			var record = obj,
				_self = this,
				match = null,
				index = null;
			if(isMatch){
				match =  _self._getDefaultMatch();
				index = _self.findIndexBy(obj,match);
				if(index >=0){
					record = this.resultRows[index];
				}
			}
			record[field]=value;
			if(!S.inArray(record,_self.newRecords) && !S.inArray(record,_self.modifiedRecords)){
					_self.modifiedRecords.push(record);
			}
			_self.fire('updaterecord',{record:record,field:field,value:value});
		},
		/**
		* 排序，根据Store的配置进行，前端排序或发送请求重新加载数据
		* 远程排序，触发load事件，前端排序触发localsort事件
		* @param {String} field 排序字段
		* @param {String} direction 排序方向
		*/
		sort : function(field,direction){
			var _self =this;
			_self.sortInfo.field = field || _self.sortInfo.field;
			_self.sortInfo.direction = direction || _self.sortInfo.direction;
			if(_self.remoteSort){	//如果远程排序，重新加载数据
				this.load();
			}else{
				_self._sortData(field,direction);
				_self.fire('localsort',{field : field , direction : direction});
			}
		},
		/**
		* 更新记录 ，触发 updaterecord 事件
		* @param {Object} obj 修改的记录
		* @param {Boolean} [isMatch = false] 是否需要进行匹配，检测指定的记录是否在集合中
		*/
		update : function(obj,isMatch){
			var record = obj,
				_self =this,
				match = null,
				index = null;
			if(isMatch){
				match = _self._getDefaultMatch();
				index = _self.findIndexBy(obj,match);
				if(index >=0){
					record = this.resultRows[index];
				}
			}
			record = S.mix(record,obj);
			if(!S.inArray(record,_self.newRecords) && !S.inArray(record,_self.modifiedRecords)){
					_self.modifiedRecords.push(record);
			}
			_self.fire('updaterecord',{record:record});
		},
		/**
		* 销毁
		*/
        destroy: function () {
			var _self = this;
			_self.detach();
			_self = null;
        },
		//添加记录
		_addRecord :function(record,index){
			var records = this.resultRows;
			if(S.isUndefined(index)){
				index = records.length;
			}
			records[index] = record;
			//_self.fire('recordadded',{record:record,index:index});
		},
		//清除改变的数据记录
		_clearChanges : function(){
			var _self = this;
			_self.newRecords.splice(0);
			_self.modifiedRecords.splice(0);
			_self.deletedRecords.splice(0);
		},
		//加载数据
		_loadData : function(params){
			var _self = this,
			loadparams = params || {},
			data = null;
			
			/**
			* @private 设置结果
			*/
			function setResult(resultRows,rowCount,totalCount){
				_self.resultRows=resultRows;
				_self.rowCount=rowCount;
				_self.totalCount=totalCount;

			}
			_self.fire('beforeload');
			loadparams = S.merge(_self.oldParams, _self.sortInfo,loadparams);
			_self.oldParams = loadparams;
			data = _self.proxy.method === 'post' ? loadparams : (loadparams ? S.param(loadparams) : '');
			S.ajax({
				cache: false,
                url: _self.proxy.url,
                dataType: _self.dataType,
                type: _self.proxy.method,
                data: data,
                success : function (data, textStatus, XMLHttpRequest) {
					_self.fire('beforeProcessLoad',{data:data});
					var resultRows=[],
						rowCount = 0,
						totalCount = 0;
					if(data.hasError){
						setResult(resultRows,rowCount,totalCount);
						_self.fire('exception',{error:data.error});
						return;
					}
					if(S.isString(data)){
						data = S.json.parse(data);
					}
                    if (S.isArray(data) || S.isObject(data)) {
						if(S.isArray(data)){
							resultRows = data;
							rowCount = resultRows.length;
							totalCount = rowCount;
						}else if (data) {
                            resultRows = data[_self.root];
                            if (!resultRows) {
                                resultRows = [];
                            }
                            rowCount = resultRows.length;
                            totalCount = parseInt(data[_self.totalProperty], 10);
                        } 
                    } 
					setResult(resultRows,rowCount,totalCount);
                    if (!_self.remoteSort) {
                        _self._sortData();
                    } 
					
					_self.fire('load',loadparams);
					_self._clearChanges();
                },
                error : function (XMLHttpRequest, textStatus, errorThrown) {
                   setResult([],0,0);
				   _self.fire('exception',{error:textStatus,responseText:errorThrown.responseText});
                }
			});
			
			
		},
		//移除数据
		_removeAt:function(index,array){
			if(index < 0){
				return;
			}
			var records = array || this.resultRows,
				record = records[index];
			records.splice(index,1);
			return record;
		},
		_removeFrom :function(record,array){
			var _self = this,
				index = S.indexOf(record,array);
			if(index >= 0){
				_self._removeAt(index,array);
			}
		},
		//排序
		_sortData : function(field,direction){
			var _self = this;

			field = field || _self.sortInfo.field;
			direction = direction || _self.sortInfo.direction;
			//如果未定义排序字段，则不排序
			if(!field || !direction){
				return;
			}
			_self.resultRows.sort(function(obj1,obj2){
				return _self.compare(obj1,obj2,field,direction);
			});
		},
		//获取默认的匹配函数
		_getDefaultMatch :function(){
			return this.matchFunction;
		},
		//初始化
		_init : function(){
			var _self =this;

			_self.oldParams =_self.params ||{};
			if (!_self.proxy.url) {
                _self.proxy.url = _self.url;
            }
			_self.resultRows = [];
			/*if(_self.autoLoad){
				_self._loadData();
			}*/
		}
	});

	S.LP.Store = Store;
	
	/**
	* 表单的一些工具方法
	* @class 表单帮助类
	*/
	S.LP.FormHelpr={
		/**
		* 将表单数据序列化成为字符串
		* @param {HTMLForm} form 表单元素
		* @return {String} 序列化的字符串
		*/
		serialize:function(form){
			return S.param(S.LP.FormHelpr.serializeToObject(form));
		},
		/**
		* 将表单数据序列化成对象
		* @param {HTMLForm} form 表单元素
		* @return {Object} 表单元素的
		*/
		serializeToObject:function(form){
			var originElements = null,
				elements = null,
				arr =[],
				checkboxElements = null,
				result={};
			if(S.isArray(form)){
				originElements = form;
			}else{
				originElements =  S.makeArray(form.elements);
			}
			elements = S.filter(originElements,function(item){
				return (item.id ||item.name) && !item.disabled &&
					(item.checked || /select|textarea/i.test(item.nodeName) ||
						/text|hidden|password/i.test(item.type));
			});
			//checkbox 做特殊处理，如果所有checkbox都未选中时,设置字段为空
			checkboxElements = S.filter(originElements,function(item){
				return (item.id ||item.name) && !item.disabled &&(/checkbox/i.test(item.type));
			});
			S.each(elements,function(elem){
				var val = S.one(elem).val(),
					name = elem.name||elem.id,
					obj = val == null ? {name:  name, value: ''} : S.isArray(val) ?
					S.map( val, function(val, i){
						return {name: name, value: val};
					}) :
					{name:  name, value: val};
				if(obj){
					arr.push(obj);
				}
			});
			//组合对象
			S.each(arr,function(elem){
				var prop = result[elem.name],
					a = []; //临时变量
				if(!prop){
					result[elem.name] = elem.value;
				}else if(S.isArray(prop)){
					prop.push(elem.value);
				}else{
					a.push(prop);
					a.push(elem.value);
					result[elem.name]=a;
				}
			});
			//检查checkbox的字段是否在对象中，不在则置为空
			S.each(checkboxElements,function(elem){
				var name = elem.name||elem.id;
				if(!result.hasOwnProperty(name)){
					result[name] = '';
				}
			});
			
			return result;
		},
		/**
		* 设置表单字段
		* @param {HTMLForm} form 表单元素
		* @param {string} field 字段名 
		* @param {string} value 字段值
		*/
		setField:function(form,fieldName,value){
			var fields = form.elements[fieldName];
			if(S.isArray(fields)){
				S.each(fields,function(field){
					if(field.type === 'checkbox'){
						if(field.value === value || S.inArray(field.value,value)){
							S.one(field).attr('checked',true);
						}
					}else if(field.type === 'radio' && field.value === value){
						S.one(field).attr('checked',true);
					}else{
						S.one(field).val(value);
					}
				
				});
			}else{
				S.one(fields).val(value);
			}
			
		}

	};
	/**
	 * 检测传入参数的类型
	 * @function $type 
	 * @param  目标检测对象
	 * @return  如下
	 * 'element' - (string) DOM元素节点
	 * 'textnode' - (string) DOM文本节点
	 * 'whitespace' - (string) DOM空白节点
	 * 'arguments' - (string) arguments
	 * 'array' - (string) 数组
	 * 'object' - (string) Object对象
	 * 'string' - (string) 字符串
	 * 'number' - (string) 数字
	 * 'infinity' - (string) 无穷大
	 * '-infinity' - (string) 无穷小
	 * 'date' - (string) 日期对象
	 * 'boolean' - (string) 布尔值
	 * 'function' - (string) 函数对象
	 * 'regexp' - (string) 正则表达式对象
	 * 'class' - (string) Class (由new Class创建, 或由其他Class对象扩展而来).
	 * 'collection' - (string) 原生htmlelements集合, 如由方法childNodes, getElementsByTagName等获取到的结果
	 * 'window' - (string) window
	 * 'document' - (string) document
	 * false - (boolean) undefined, null, NaN 或以上列出的类型都不是
	*/

	function $type(o){
		if(o === null||o===undefined)return false;
		switch(Object.prototype.toString.apply(o)){
			case '[object Boolean]': return 'boolean';
			case '[object Array]':return 'array';
			case '[object Function]':return 'function'; 
			case '[object Date]':return 'date';
			case '[object RegExp]':return 'regexp';
			case '[object String]':return 'string';
			case '[object Number]':
				if(isFinite(o)){
					return 'number'
				}else{
					if(o===Infinity)return 'infinity';
					if(o===-Infinity)return '-infinity'; 
					return false
				}
			
		}
		if(o === window)return 'window';
		if(o === document)return 'document';
		if (o.nodeName) {
			switch (o.nodeType) {
				case 1: return 'element';
				case 3: return (/\S/).test(o.nodeValue) ? 'textnode' : 'whitespace';
			}
		} else if (typeof o.length === 'number') {
			if (o.callee) return 'arguments';
			else if (o.item) return 'collection';
		}
		if(typeof o === 'object')return 'object';
		return false;
	};
	/**
	 * 日期、数字、字符的一些方法
	 * @class 日期、数字、字符帮助类
	 */
	S.LP.Util={
		DateUtil : {
			/**
			 * 日期对象转为"yyyy-mm-dd"格式文本
			 * @param {Date} oDate
			 * @return {String} yyyy-mm-dd
			 */
			toYYYYMMDD: function(oDate){
				  var sMonth = (oDate.getMonth() + 1).toString();
				  var sDay = (oDate.getDate()).toString();
				  if(sMonth.length < 2) sMonth = '0' + sMonth; 
				  if(sDay.length < 2) sDay = '0' + sDay; 
				  
				  return oDate.getFullYear() + '-' + sMonth + '-' + sDay;
			},
			/**
			 * 取得年份
			 * @param {Date|String} oDate，支持yyyy-mm-dd格式
			 * @return {Int} 四位年份
			 */
			getYear: function(oDate){
				if(S.isString(oDate)) return parseInt(oDate.split('-')[0],10);
				return oDate.getFullYear();
			},
			/**
			 * 取得月份值(0-11)
			 * @param {Date|String} oDate，支持yyyy-mm-dd格式
			 * @return {Int} 月份值
			 */
			getMonth: function(oDate){
				if(S.isString(oDate)) return parseInt(oDate.split('-')[1],10)-1;
				return oDate.getMonth();
			},
			/**
			 * 取得月的天数(1-31)
			 * @param {Date|String} oDate，支持yyyy-mm-dd格式
			 * @return {Int} 天数
			 */
			getMonthDay: function(oDate){
				if(S.isString(oDate)) return parseInt(oDate.split('-')[2],10);
				return oDate.getDate();
			},	
			/**
			 * 取得小时数(0-23)
			 * @param {Date} oDate
			 * @return {Int} 小时数
			 */
			getHours:function(oDate){
				return oDate.getHours();
			},
			/**
			 * 取得分钟数(0-59)
			 * @param {Date} oDate
			 * @return {Int} 分钟数
			 */
			getMinutes:function(oDate){
				return oDate.getMinutes();
			},
			/**
			 * 是否是“yyyy-mm-dd”日期字符串
			 * @param {String} sDate
			 * @return {Boolean} 是或否
			 */
			isYYYYMMDD: function(sDate){
				if(!sDate || typeof sDate != 'string') return false;
				if(!(new RegExp (/^(\d{1,4})(-)(\d{1,2})\2(\d{1,2})$/)).test(sDate)) return false;
				
				var y = this.getYear(sDate);
				if(y < 1970) return false;
				var m = this.getMonth(sDate);
				if(m < 0 || m > 11) return false;
				var d = this.getMonthDay(sDate);
				if(d < 1 || d > 31) return false;
				
				return true;
			},
			/**
			 * "yyyy-mm-dd"转换为日期对象。
			 * @param {Object} sYMD "yyyy-mm-dd"格式日期
			 * @return {Date}
			 */
			toDate: function(sYMD){
				if(!this.isYYYYMMDD(sYMD)) return null;
				return new Date(this.getYear(sYMD), this.getMonth(sYMD), this.getMonthDay(sYMD));
			},
			/**
			 * 比较两个日期的数值差
			 * @param {Date|String} oDate1
			 * @param {Date|String} oDate2
			 * @return {Int} 两个日期的毫秒差值
			 */
			compare: function(oDate1, oDate2){
				if(!oDate1 || !oDate2) return null;
				var o1 = (typeof oDate1 == 'string')?this.toDate(oDate1):oDate1;
				var o2 = (typeof oDate2 == 'string')?this.toDate(oDate2):oDate2;
				
				return Date.parse(o1) - Date.parse(o2);
			},
			/**
			 * 重置当前日期为当日的00:00:00
			 * @param {Date|String} date
			 * @return {Date}
			 */
			clearTime:function(date){
				this.parse(date);
				date.setHours(0); 
				date.setMinutes(0); 
				date.setSeconds(0);
				date.setMilliseconds(0); 
				return date;
			},
			/**
			 * 创建当前日期的拷贝
			 * @param {Date|String} date
			 * @return {Date}
			 */
			clone:function(date){
				this.parse(date);
				return new Date(date.getTime()); 	
			},
			/**
			 * 获取今天，时间为00:00:00
			 * @param {Date|String} date
			 * @return {Date}
			 */
			today:function(){
				return this.clearTime(new Date());	
			},
			/**
			 * 获取当前的date
			 * @param {Date|String} date
			 * @return {Date}
			 */
			now:function(){
				return new Date();
			},
			/**
			 * 判断是否为闰年
			 * @param {Date|String} date
			 * @return {Boolean}
			 */
			isLeapYear : function (year) { 
				return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0)); 
			},
			/**
			 * 获取某月的天数
			 * @param {Date|String} date
			 * @return {Int}
			 */
			getDaysInMonth:function (year, month) {
				return [31, (this.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
			},
			_addMs : function (date,value) {
				date.setMilliseconds(date.getMilliseconds() + value);
				return date;
			},
			_addSeconds:function(date,value){
				 return this._addMs(date,value * 1000);
			},
			_addMinutes:function(date,value){
				return this._addMs(date,value * 60000);
			},
			_addHours:function(date,value){
				return this._addMs(date,value * 3600000);
			},
			_addDays : function (date,value) {
				return this._addMs(date,value * 86400000);
			},
			_addWeeks :function(date,value){
				return this._addMs(date,value * 604800000);
			},
			_addMonths:function(date,value){
				var n = date.getDate();
				date.setDate(1);
				date.setMonth(date.getMonth() + value);
				date.setDate(Math.min(n, this.getDaysInMonth(date.getFullYear(), date.getMonth())));
				return date;
			},
			_addYears:function(date,value){
				return this._addMonths(date,value * 12);
			},
			/**
			 * 解析日期，包括日期的运算
			 * @param {Date|String} 第一个参数可以为date或者string，若为string则第一个参数作为日期运算的表达式
			 * @param {String} 运算的字符串
			 * @return {Date}
			 * FormatSpecifiers :
			 *	Format 			Description
			 *	Y				年
			 *	M				月
			 *	D				日
			 *	W				周
			 *	h				小时
			 *	m				分钟
			 *	s				秒
			 *	today			今天
			 *	now				当前日期和时间
			 * -------------------------------
			 * ex. :
			 * 	S.LP.Util.DateUtil.parse('2011-01-08');
			 * 	S.LP.Util.DateUtil.parse('2011-01-08 9:18:22 - 1M');
			 * 	S.LP.Util.DateUtil.parse(' 2011/4/2 - 2.2h ');
			 * 	S.LP.Util.DateUtil.parse('today - 1D ');
			 * 	S.LP.Util.DateUtil.parse('now + 1Y');
			 * 	S.LP.Util.DateUtil.parse(new Date());
			 * 	S.LP.Util.DateUtil.parse(new Date(),'+1W');
			 */
			parse:function(date,s){
				if($type(date) === 'string'){
					s = date;	
				}else if(!s){
					return date;	
				}
				s = s.replace(/^\s+|\s+$/g, '');
				var self =this;
				var dateRep = /(?:((?:(today|now)|(?:^(\d{4})[-\/](0?[1-9]|1[0-2])[-\/]([0-2][0-9]|3[01]|[0-9])))\s*(?:(?:([01][0-9]|2[0-3]|[0-9])(?:[:]([0-5]?\d))?(?:[:](\d+))?)?)?)?\s*(?:([+-])\s*(\d|\d*.?\d+)\s*([smhDWMY])$)?)?/;
				var delInitioZero = function(v){
					if($type(v) === 'string'){
						return  v.replace(/^0/,"")-0;
					}
					return v;
				};
				var execute = function(date,op,value,mark){
					value = (op==='+')?value:(0-value);
					switch(mark){
						case 'Y' :
							return self._addYears(date,value);	
						break;
						case 'M' :
							return self._addMonths(date,value);	
						break;
						case 'W':
							return self._addWeeks(date,value);
						break;
						case 'D' :
							return self._addDays(date,value);	
						break;
						case 'h' :
							return self._addHours(date,value);	
						break;
						case 'm' :
							return self._addMinutes(date,value);	
						break;
						case 's' :
							return self._addSeconds(date,value);	
						break;
					}
				};
				var temp = dateRep.exec(s),result = [];
				if(!dateRep.test(s) || ($type(date)!=='date'&& !temp[1])){
					throw new Error('Format error!');
				}
				$each(temp ,function(item,i){
					if(item===undefined){
						item = null;	
					}else if(i > 3 && i<9){
						item = delInitioZero(item);
					}
					result.push(item);				
				});			
				var _sdate = result[2],
					_Y = result[3],
					_M = result[4]?(result[4]-1):null,
					_D = result[5],
					_h = result[6],
					_m = result[7],
					_s = result[8],
					_op = result[9],
					_value = result[10],
					_mark = result[11];	
				if(result[1]){
					if(_sdate){
						var d = null;
						switch(_sdate){
							case 'now':
								d = this.now();
							break;
							case 'today':
								d = this.today();
							break;	
						}
						return execute(d,_op,_value,_mark);
					}else if(_op){
						return execute(new Date(_Y,_M,_D,_h,_m,_s),_op,_value,_mark);
					}else{
						return new Date(_Y,_M,_D,_h,_m,_s);
					}
				}else{
					return execute(date,_op,_value,_mark);
				}

			},
			/**
			 * 为某日期添加或减少n毫秒
			 * @param {Date|String} date
			 * @param {Int|Float|} number
			 * @return {Date}
			 */
			addMs : function (date,value) {
				date = this.parse(date);
				return this._addMs(date,value)
			},
			/**
			 * 为某日期添加或减少n秒
			 * @param {Date|String} date
			 * @param {Int|Float|} number
			 * @return {Date}
			 */
			addSeconds:function(date,value){
				date = this.parse(date);
				return this._addSeconds(date,value)
			},
			/**
			 * 为某日期添加或减少n分钟
			 * @param {Date|String} date
			 * @param {Int|Float|} number
			 * @return {Date}
			 */
			addMinutes:function(date,value){
				date = this.parse(date);
				return this._addMinutes(date,value)
			},
			/**
			 * 为某日期添加或减少n小时
			 * @param {Date|String} date
			 * @param {Int|Float|} number
			 * @return {Date}
			 */
			addHours:function(date,value){
				date = this.parse(date);
				return this._addHours(date,value)
			},
			/**
			 * 为某日期添加或减少n天
			 * @param {Date|String} date
			 * @param {Int|Float|} number
			 * @return {Date}
			 */
			addDays : function (date,value) {
				date = this.parse(date);
				return this._addDays(date,value)
			},
			/**
			 * 为某日期添加或减少n周
			 * @param {Date|String} date
			 * @param {Int|Float|} number
			 * @return {Date}
			 */
			addWeeks :function(date,value){
				date = this.parse(date);
				return this._addWeeks(date,value)
			},
			/**
			 * 为某日期添加或减少n月
			 * @param {Date|String} date
			 * @param {Int|Float|} number
			 * @return {Date}
			 */
			addMonths:function(date,value){
				date = this.parse(date);
				return this._addMonths(date,value)
			},
			/**
			 * 为某日期添加或减少n年
			 * @param {Date|String} date
			 * @param {Int|Float|} number
			 * @return {Date}
			 */
			addYears:function(date,value){
				date = this.parse(date);
				return this._addYears(date,value)
			},
			/**
			 * 获取某日所在周的所有日期
			 * @param {Date|String} date
			 * @return {Array} 该周日期的date数组
			 */
			getWeekDays:function(date){
				var index = this.parse(date).getDay(),
					i = 1;l = 7,days = [];
				for(;i<=l;i++){
					days.push(this._addDays(this.clone(date),i-index));				
				}
				return days;
			},
			/**
			 * 判断某日是否为工作日
			 * @param {Date|String} date
			 * @return {Boolean}
			 */
			isWeekday : function (date) { 
				return date.getDay()<6;
			},
			/**
			 * 判断某日是否在另一天之前
			 * @param {Date|String} 需要判断的日期
			 * @param {Date|String} 对比的目标日期
			 * @return {Boolean}
			 */
			isBefore:function(date,target){
				return this.parse(date).getTime()>this.parse(target).getTime()
			},
			/**
			 * 判断某日是否在另一天之后
			 * @param {Date|String} 需要判断的日期
			 * @param {Date|String} 对比的目标日期
			 * @return {Boolean}
			 */
			isAfter :function(date,target){
				return this.parse(date).getTime()<this.parse(target).getTime()
			},
			/**
			 * 判断两个日期是否相等
			 * @param {Date|String} 日期1
			 * @param {Date|String} 日期2
			 * @return {Boolean}
			 */
			isEquals:function(date1,date2){
				return  this.parse(date1).getTime() === this.parse(date2).getTime()
			},
			/**
			 * 判断某个日期是否在一个或多个日期区间范围内
			 * @param {Date|String} date
			 * @param {Date|String} 日期区间,该参数可以是一个数组，或多个区间的2维数组，如['2001-9-25','2011-8-20'],数组的第一个值为开始日期，第二个值为结束日期，值可以为date对象或者YYYY-MM-DD格式的字符串
			 * @return {Boolean}
			 */
			hasDate :function(date,range){
				var self = this,
					isBetween = function(date,start,end){
						var t = self.parse(date).getTime();
						start =  self.parse(start).getTime();
						if(end){
							end = self.parse(end).getTime();
						}else{
							return t === start;
						}
						return t >= start && t <= end;		
					};
				if($type(range[0]) === 'array'){
					var i = 0,l = range.length;
					for(;i<l;i++){
						if(isBetween(date,range[i][0],range[i][1])){
							return true;	
						};	
					}
					return false;
				}else{
					return isBetween(date,range[0],range[1]);	
				}
			}
		},
		numberUtil : {

		},
		stringUtil : {

		}
	} 
		
}, {
    requires: ['core','calendar','./css/controls.css']
});