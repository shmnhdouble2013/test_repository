/** @fileOverview 表格控件
* 包括：表格，可编辑表格，表格编辑器
* @author <a href="mailto:dxq613@gmail.com">董晓庆 旺旺：dxq613</a>  
* @version 1.0.1  
*/
KISSY.add(function (S) {
	/** 
		@exports S.LP as KISSY.LP
	*/

	var DOM = S.DOM,
		UA = S.UA,
        Node = S.Node,
        Event = S.Event,
        win = window,
        doc = document,
		//Grid 常量	
		ATTR_COLUMN_NAME = 'data-column-name',
		ATTR_COLUMN_FIELD = 'data-column-field',
		CLS_HEADER_TH = 'grid-header-th',
		CLS_HEADER_TH_EMPTY = 'grid-header-th-empty',
		CLS_HEADER_TH_INNER = 'grid-header-th-inner',
        CLS_HEADER_TITLE = 'grid-header-inner-title',
		CLS_CELL_TEXT = 'grid-body-cell-text',
		CLS_CHECKBOX = 'grid-checkbox',
		CLS_GRID_ROW = 'grid-row',
		CLS_GRID_ROW_SELECTED = 'grid-row-selected',
		CLS_GRID_ROW_OVER = 'grid-row-over',
		CLS_GRID_CELL = 'grid-body-cell',
		CLS_GRID_CELL_INNER = 'grid-body-cell-inner',
        CLS_GRID_HIGHT = 'grid-height',
        CLS_GRID_WIDTH = 'grid-width',
		CLS_HOVER = 'hover',
		CLS_HIDDEN = 'ks-hidden',
        CLS_ALLOW_SCROLL = 'grid-allow-scroll',
		CLS_SORT = 'sortable',
		CLS_SORT_ASC = 'sorted-asc',
		CLS_SORT_DESC = 'sorted-desc',
		CLS_ROW_ODD = 'grid-row-odd',
		CLS_ROW_EVEN = 'grid-row-even',
		CLS_COLUMN_TRIGGER = 'grid-column-menu-trigger',
		CLS_PREFIX_HEADER_COLUMN = 'grid-header-column-',
		DATA_ELEMENT = 'row-element',
		COLUMN_DEFAULT_WIDTH = 80,
		HEADER_HIGHT = 25,
		BAR_HIGHT = 25,
		COLUMN_WIDTH_CHECKED = 30,
		COLUMN_WIDTH_DEFAULT = 80,
		COLUMN_WIDTH_EMPTY = 15,
		//GridMenu 常量
		DATA_COLUMN = 'data-column',
		CLS_MENU_ACTIVE = 'ks-active',
		CLS_MENU_ITEM = 'grid-menu-item',
		CLS_COLUMN_MENU_ITEM = 'grid-column-menu-item',
		CLS_MENU_CKECKED = 'menu-item-checked',
		CLS_MENU_UNCKECKED = 'menu-item-unchecked',
		CLS_DISABLED = 'lp-item-disabled',
		EMPTY_IMG = '<span class="menu-item-icon"/>',
		MENU_WIDTH = 148,
		//可编辑表格常量
		KEY_COLUMN_PREFIX = 'col',
		CLS_CELL_EDITABLE = 'grid-editable-cell',
		CLS_DIRTY_CELL = 'grid-dirty-cell',
		CLS_CELL_ERROR = 'grid-error-cell',
		CLS_CELL_ERROR_ICON = 'grid-cell-error-icon',
        CLS_CELL_EDIT_ICON = 'grid-cell-edit-icon',
		PREFIX_CLS_CELL = 'grid-body-td-',
		//编辑器样式常量
		CLS_EDITOR_ERROR = 'grid-error-editor',
		CLS_EDITOR_ERROR_ICON = 'grid-error-editor-icon',
		KEY_ENTER_CODE = 13,
		KEY_ESC_CODE = 27,
		KEY_TAB_CODE = 9;
	/**
	* 表格控件
	* @memberOf S.LP
	* @description 用于展示数据
	* @class 表格控件类
	* @param {Object} config 配置项
	* @param {String} config.renderTo 渲染到目标的Id
	* @param {Array} config.columns 列的配置项
	* @param {String} config.columns[0].title 标题
	* @param {Number} [config.columns[0].width=80] 列宽度
	* @param {String} config.columns[0].dataIndex 对应的列字段
	* @param {Boolean} [config.columns[0].sortable=false] 此列是否可排序
	* @param {Boolean} [config.columns[0].hide = false] 是否隐藏此列
	* @param {Function} [config.columns[0].renderer] 一个格式化函数，将数据转换成对应的格式显示，或者提供具体的Dom结构。
	* @param {Boolean} [config.columns[0].showTip=false]  显示完整信息，截断文本时使用,showTip 如果是Function时,执行此函数，函数原型 function(value,obj);
	* @param {String} [config.columns[0].cls]  表头应用的样式，多个样式用 “,” 分割
	* @example 
	* //列配置
	* columns:[
	*      { title: '点击', sortable: true,  dataIndex: 'Clicks',  showTip: true,renderer:function(value,obj){
    *               return value + obj.TotalCost;
    *      } },
    *      { title: '总花费', sortable: true,  dataIndex: 'TotalCost',cls :'custom1,custom2'}
    *      
	* },
	* @param {Number} [config.width] 表格宽度，默认下表格的宽度等于父元素的宽度，如果内容宽度超过设置的宽度，会出现横向滚动条
	* @param {Number} [config.height] 表格高度，默认状态表格高度根据内容自动扩展，如果内容高度超过设置的宽度，会出现纵向滚动条
	* @param {S.LP.Store} [config.store] 数据缓冲对象，对数据的操作集成在此对象中 @see S.LP.Store
	* @param {Bar} [config.tbar] 表格上部的按钮栏，如果内部包含 pageSize属性则为分页栏，否则为普通按钮栏
	* @param {Number} [config.tbar.pageSize] 分页栏的单页记录条数，用于计算分页
	* @param {Array} [config.tbar.buttons] 按钮栏的按钮配置
	* @example
	* //分页栏配置
	* tbar:{pageSize : 30}
	* //按钮栏配置
	* tbar:{buttons:[{id:' ',text:'添加一项',handler:function(event){},css:'bar-btn-add'}]
	* @param {Bar} config.bbar 同 config.tbar
	* @param {Boolean} [config.loadMask = true] 加载数据时，是否显示屏蔽,
	* @param {Boolean} [config.checkable = false]: 是否多选，显示选择框,
	* @param {Boolean} [config.showMenu = false] 是否显示菜单，用于操纵列
	* @param {Boolean} [config.forceFit=false]: 当指定了表格宽度时，有时候会出现横向滚动条，此配置项强制列适应表格宽度
	* @example 
	* 表格配置项
	* var config = {
	*	renderTo:'mygrid', //容器Id
	*	width:500,// 宽度
	*	height:300,//高度
	*	checkable:true,//是否允许多选
	*	columns: [//列定义
	*			   { title: ' ', width: 30, sortable: false, dataIndex: 'SearchEngine',hide : true, renderer: function(data){
	*						if(data===4){
	*								 return '百度';
	*						}else{
	*								 return '谷歌';
	*						}
	*			   }
	*			   },
	*			   { title: '编号', width: 100, sortable: true, dataIndex: 'AccountId', selectable: true },
	*	 
	*			   { title: '账户', width: 200, sortable: false, dataIndex: 'AccountName', selectable: true,renderer:function(value){
	*						if(S.isArray(value)){
	*								 return value.join('');
	*						}
	*						return value;
	*			   } },
	*			   { title: '点击', sortable: true,  dataIndex: 'Clicks',  showTip: true,renderer:function(value,obj){
	*						return value + obj.TotalCost;
	*			   } },
	*			   { title: '总花费', sortable: true,  dataIndex: 'TotalCost',editor:{type:'number'}
	*			   },
	*			   { title: '总花费', sortable: true,  dataIndex: 'sum',renderer:function(value,obj){
	*								 return obj.TotalCost *2;
	*						}
	*			   }       
	*			  
	*	],
	*	forceFit:true,//强制列自适应，使表格无滚动条
	*	store:store,//数据缓冲对象
	*	showMenu : true, //是否显示菜单，用于操作列
	*	tbar:{buttons:[{id:' ',text:'添加一项',handler:function(event){},css:'bar-btn-add'}]
	*	},//上面按钮栏
	*	bbar:{pageSize:30},//下面翻页栏
	*	loadMask:true//是否显示加载，当加载数据时，会屏蔽表格并显示，Loading...信息
	*	};
	*/
	function Grid(config) {
		var _self = this;
		config = config || {};
		if (!config.renderTo && !config.container) {
			throw 'please assign the id of rendered Dom,of the container of this grid!';
		}
		config = S.merge(Grid.config, config);

		Grid.superclass.constructor.call(_self, config);
		//支持的事件
		_self.events = [
			/**  
			* 开始附加数据
			* @name S.LP.Grid#beginappend 
			* @event  
			* @param {event} e  事件对象
			* @param {Array} e.data 附加显示的数据
			*/
			'beginappend',
			/**  
			* 附加数据完成
			* @name S.LP.Grid#afterappend 
			* @event  
			* @param {event} e  事件对象
			* @param {Array} e.data 附加显示的数据
			* @param {Array} e.rows 附加显示的数据行DOM结构
			*/
			'afterappend',
			/**  
			* 开始显示数据，一般是数据源加载完数据，开始在表格上显示数据
			* @name S.LP.Grid#beginshow
			* @event  
			* @param {event} e  事件对象
			*/
			'beginshow',
			/**  
			* 显示数据完成，一般是数据源加载完数据，并在表格上显示完成
			* @name S.LP.Grid#aftershow
			* @event  
			* @param {event} e  事件对象
			*/
			'aftershow',
			/**  
			* 移除行，一般是数据源移除数据后，表格移除对应的行数据
			* @name S.LP.Grid#rowremoved
			* @event  
			* @param {event} e  事件对象
			* @param {Object} e.data 行对应的记录
			* @param {Object} e.row 行对应的DOM对象
			*/
			'rowremoved',
			/**  
			* 添加行，一般是数据源添加数据、加载数据后，表格显示对应的行后触发
			* @name S.LP.Grid#rowcreated
			* @event  
			* @param {event} e  事件对象
			* @param {Object} e.data 行对应的记录
			* @param {Object} e.row 行对应的DOM对象
			*/
			'rowcreated',
			/**  
			* 翻页前触发，可以通过 return false ,阻止翻页
			* @name S.LP.Grid#beforepagechange
			* @event  
			* @param {event} e  事件对象
			* @param {Number} e.from 当前页
			* @param {Number} e.to 目标页
			*/
			'beforepagechange',
			/**  
			* 行点击事件
			* @name S.LP.Grid#rowclick
			* @event  
			* @param {event} e  事件对象
			* @param {Object} e.data 行对应的记录
			* @param {Object} e.row 行对应的DOM对象
			* 
			*/
			'rowclick',
			/**  
			* 单元格点击事件
			* @name S.LP.Grid#cellclick
			* @event  
			* @param {event} e  事件对象
			* @param {Object} e.data 行对应的记录
			* @param {Object} e.row 点击行对应的DOM对象
			*/
			'cellclick',
			/**  
			* 行双击事件
			* @name S.LP.Grid#rowdblclick
			* @event  
			* @param {event} e  事件对象
			* @param {Object} e.data 行对应的记录
			* @param {Object} e.row 行对应的DOM对象
			* 
			*/
			'rowdblclick',
			/**  
			* 单元格双击事件
			* @name S.LP.Grid#celldblclick
			* @event  
			* @param {event} e  事件对象
			* @param {Object} e.data 行对应的记录
			* @param {Object} e.row 点击行对应的DOM对象
			*/
			'celldblclick',
			/**  
			* 行选中事件
			* @name S.LP.Grid#rowselected
			* @event  
			* @param {event} e  事件对象
			* @param {Object} e.data 行对应的记录
			* @param {Object} e.row 行对应的DOM对象
			*/
			'rowselected',
			/**  
			* 行取消选中事件
			* @name S.LP.Grid#rowunselected
			* @event  
			* @param {event} e  事件对象
			* @param {Object} e.data 行对应的记录
			* @param {Object} e.row 行对应的DOM对象
			*/
			'rowunselected',
			/**  
			* 行选中状态改变事件
			* @name S.LP.Grid#rowselectchanged
			* @event  
			* @param {event} e  事件对象
			* @param {Object} e.data 行对应的记录
			* @param {Object} e.row 行对应的DOM对象
			* @param {Object} e.selected 选中的状态
			*/
			'rowselectchanged'
		];
		_self._init();

	}

	Grid.config = {
		showMenu : false
	};
	S.extend(Grid, S.Base);
	S.augment(Grid,
	/** @lends  S.LP.Grid.prototype */
	{
		/**
		* 重写 S.Base 的set 方法，默认设置时不触发事件
		* @protect
		*/
		set:function(key,value){
			Grid.superclass.set.call(this,key,value,{silent:1});
		},	
		/**
		* 附加数据
		* @private
		* @param {Array} data 添加到表格上的数据
		*/
		appendData : function (data) {
			var _self = this,
				rows = [],
				count = _self._getRowCount();
			_self.fire('beginappend',{data : data});
			S.each(data, function (obj, index) {
				var row = _self._createRow(obj, count + index);
				rows.push(row);
			});
			_self.fire('afterappend', {rows : rows, data : data});
		},
		/**
		* 添加汇总数据
		* @param {Object} summary 汇总数据
		*/
		addSummary : function (summary){
			var _self = this,
				foot = _self.get('tfoot');
			S.all(foot.rows).remove();
			this._createSummaryRow(summary);
		},
		/**
		* 清空表格
		*/
		clearData : function () {
			var _self = this,
				body = _self.get('tbody'),
				rows = body.rows;
			_self._setHeaderChecked(false);
			S.each(rows,function(row){
				_self.fire('rowremoved',{data : DOM.data(row,DATA_ELEMENT),row : row});
			});
			S.all(rows).remove();
		},
		/**
		* 取消选中的记录
		*/
		clearSelection : function () {
			this._setAllRowsSelected(false);
		},
		/**
		* 过滤显示数据，根据字段名和字段值过滤数据
		* @param {String} field 字段名 
		* @param {Object|Function} 过滤字段的值，或者匹配函数
		* @example 
		*	grid.filter('id',124); //仅显示 id ==124的行
		*	
		*	grid.filter('id',function(value){
		*		if(value>124)
		*			return true;//返回true显示
		*		return false;	//返回false 不显示
		*	});
		*/
		filter : function (field, value) {
			var _self = this,
				body = _self.get('tbody'),
				rows = S.makeArray(body.rows),
				func = typeof value === 'function' ? value : function (val) {return val === value; };
			S.each(rows, function (row) {
				var rowEl = S.one(row),
					obj = DOM.data(row, DATA_ELEMENT);
				if (value === null) {
					rowEl.show();
				} else if (!obj || !func(obj[field])) {
					rowEl.hide();
				} else {
					rowEl.show();
				}
			});
		},
		/**
		* 获取表格宽度
		* @return {Number}
		*/
		getWidth : function () {
			var _self = this;
			return _self.get('width') || _self.get('gridEl').width();
		},
		/**
		* 获取选中的数据
		* @return {Array} 返回选中的数据
		*/
		getSelection : function () {
			var _self = this,
				tbody = _self.get('tbody'),
				selectedRows = S.all('.' + CLS_GRID_ROW_SELECTED, tbody),
				objs = [];

			S.each(selectedRows, function (row) {
				var obj = DOM.data(row, DATA_ELEMENT);
				if (obj) {
					objs.push(obj);
				}
			});
			return objs;
		},
		/**
		* 获取选中的第一条数据
		* @return {Object} 返回选中的第一条数据
		*/
		getSelected : function () {
			var _self = this,
				tbody = _self.get('tbody'),
				row = S.one('.' + CLS_GRID_ROW_SELECTED, tbody);

			return row ? DOM.data(row, DATA_ELEMENT) : null;
		},
		/**
		* 隐藏列
		* @param {String} field 要隐藏列的字段名称 
		*/
		hideColumn : function(field){
			this._setColumnVisible(field,false);
		},
		/**
		* 设置选中所有行
		*/
		setAllSelection :function(){
			this._setAllRowsSelected(true);
		},
		/**
		* 设置选中的数据
		* @param {String} field 字段名称 
		* @param {Array} values 选中行的对应字段的值
		* @example
		*	grid.setSelection('id',['123','22']);
		*/
		setSelection : function (field, values) {
			var _self = this,
				tbody = _self.get('tbody'),
				rows = tbody.rows;
            S.each(rows, function (row) {
                var obj = DOM.data(row, DATA_ELEMENT);
                if (obj && S.inArray(obj[field], values)) {
					_self._setRowSelected(row, true);
                }
            });
		},
		/**
		* 设置表格高度
		* @param {Number} 设置表格的高度
		*/
		setHeight : function(height){
			var _self = this,
				gridEl = _self.get('gridEl'),
				subHeight = HEADER_HIGHT,
				body = _self.get('body'),
				bodyEl = S.one(body);
			gridEl.height(height);
			if (_self.get('tbar')) {
				subHeight += (BAR_HIGHT + 2);
				if(_self.get('tbar').buttons){
					subHeight += 4;
				}
			}
			if (_self.get('bbar')) {
				subHeight += (BAR_HIGHT + 2);
			}
			if (height - subHeight > 0) {
				bodyEl.height(height - subHeight);
				bodyEl.css('overflow-y','scroll');
			}
            gridEl.addClass(CLS_GRID_HIGHT);
		},
		/**
		* 设置表格宽度
		* @param {Number} 设置表格的宽度
		*/
		setWidth : function (width) {
			var _self = this;
			_self.set('width',width);
			_self._setWidth(width);
		},
		/**
		* 显示列
		* @param {String} field 列对应的字段值
		*/
		showColumn : function(field){
			this._setColumnVisible(field,true);
		},
		/**
		* 
		* 排序 
		* @private
		* @param {String|Object} column 排序的字段名或者配置项
		* @param {String} sortDirection 排序方向 ASC、DESC
		* @example
		* grid.sort('id','ASC');//表格按 id 字段升序排列
		*/
		sort : function (column, sortDirection) {
			var _self = this,
				field,
				store = _self.get('store'),
				direct = S.isString(sortDirection)? sortDirection : (sortDirection === 1 ? 'ASC' : 'DESC');
			if (typeof column === 'string') {
				field = column;
			} else {
				field = column.dataIndex;
			}

			if (store) {
				store.sort(field, direct);
			}else{
				_self._localSort(field, sortDirection);
			}
		},
		/**
		* 显示数据
		* @param {Array} data 显示的数据
		* 
		*/
		showData : function (data) {
			var _self = this;
			_self.fire('beginshow');
			_self.clearData();
			S.each(data, function (obj, index) {
				_self._createRow(obj, index);
			});
			_self._afterShow();
			_self.fire('aftershow');
		},
		/**
		* 移除数据
		* @private
		* @param {Array} data 移除的数据
		* 
		*/
		removeData : function (data) {
			var _self = this,
				tbody = _self.get('tbody'),
				rows = S.makeArray(tbody.rows);
            S.each(rows, function (row) {
                var obj = DOM.data(row, DATA_ELEMENT);
                if (obj && S.inArray(obj, data)) {
					_self.fire('rowremoved',{data : obj,row : row});
					DOM.remove(row);
                }
            });
		},
		//添加列表显示数据区域的事件
		_addBodyEvent : function (tbody) {
			var _self = this,
				head = _self.get('head'),
				body = _self.get('body'),
				bodyEl = S.one(body);
			S.one(tbody).on('click', function (event) {
				_self._rowClickEvent(event.target);
			}).on('mouseover', function (event) {
				_self._rowOverEvent(event.target);
			}).on('mouseout', function (event) {
				_self._rowOutEvent(event.target);
			}).on('dblclick', function(event){
				_self._rowDoubleClickEvent(event.target);
			});
			bodyEl.on('scroll', function (event) {
				var left = bodyEl.scrollLeft();
                //允许表头随页面滚动时，scrollleft不起作用
                if(_self.get('allowScroll')){
                    S.one(head).one('.grid-table').css({left : left * -1});
                }else{
				    S.one(head).scrollLeft(left);
                }
			});
		},
		_afterShow : function () {
			var _self = this,
				tbody = _self.get('tbody'),
				body = _self.get('body'),
				bodyEl = S.one(body),
				height,
				bodyWidth,
				tbodyHeight,
				bodyScroolWidth;
			if (UA.ie === 6 || UA.ie === 7) {
				height = _self.get('height');
				if (!height) {
					bodyWidth = bodyEl.width();
					bodyScroolWidth = body.scrollWidth;
					if (bodyScroolWidth > bodyWidth) {
						tbodyHeight = S.one(tbody).height();
						bodyEl.height(tbodyHeight + 17);
					}else{
						bodyEl.css('height','auto');
					}
				}
			}
		},
		_createRow : function (element, index) {
			var _self = this,
				body = _self.get('tbody'),
				rowTemplate = _self._getRowTemplate(index, element),
				rowEl = new Node(rowTemplate).appendTo(body),
				dom = rowEl.getDOMNode(),
				lastChild = dom.lastChild;
			DOM.data(dom, DATA_ELEMENT, element);
			DOM.addClass(lastChild, 'lp-last');
			_self.fire('rowcreated',{data : element,row : dom});
            return rowEl;
		},
		_createSummaryRow : function (summary) {
			var _self = this,
				foot = _self.get('tfoot'),
				rowTemplate = _self._getSummaryTemplate(summary),
				rowEl = new Node(rowTemplate).appendTo(foot);
			return rowEl;
		},
		_lookupByClass : function (element, css) {
			if (DOM.hasClass(element, css)) {
				return element;
			}
			return DOM.parent(element, '.' + css);
		},
		_findRowByRecord : function (record) {
			var _self = this,
				tbody = _self.get('tbody'),
				rows = tbody.rows,
				result = null;
            S.each(rows, function (row) {
                var obj = DOM.data(row, DATA_ELEMENT);
                if (obj === record) {
					result = row;
					return false;
                }
            });
			return result;
		},
		_findRow : function (element) {
			return this._lookupByClass(element, CLS_GRID_ROW);
		},
		_findCell : function (element) {
			return this._lookupByClass(element, CLS_GRID_CELL);
		},
		//获取单元格
		_getCell : function(record,columnId){
			var _self = this,
				row = _self._findRowByRecord(record),
				cls = PREFIX_CLS_CELL + columnId,
				cell = S.one('.' + cls, row);
			return cell;
		},
		//强制列自适应表格宽度
		_forceFitColumns : function (columns) {
			var _self = this,
				gridWidth = _self.getWidth(),
				setHeight = _self.get('height'),
				columnsWidth = 0,
				showCount = 0,
				checkWidth = _self.get('checkable') ? COLUMN_WIDTH_CHECKED + 1 : 0,
				extraWidth = 0,
				times = 1,
				realWidth = 0,
				count = 0,
				lastShowColumn = null,
				appendWidth = 0;
			columns = columns || _self.get('columns');
			count = columns.length;
			S.each(columns, function (column) {
				column.width = column.width || COLUMN_WIDTH_DEFAULT;
				var colWidth = column.originWidth || column.width;
				if (!column.hide) {
					columnsWidth += colWidth;
					showCount += 1;
				}
			});

			extraWidth = showCount * 1 + 2 + checkWidth + (setHeight ? COLUMN_WIDTH_EMPTY + 2 : 0);
			times = (gridWidth - extraWidth) / columnsWidth;
			realWidth = 0;
			if (times !== 1) {
				S.each(columns, function (column) {
					if (!column.hide) {
						column.originWidth = column.originWidth || column.width;
						column.width = Math.floor(column.originWidth * times);
						realWidth += column.width;
						lastShowColumn = column;
					}
				});
				appendWidth = gridWidth - (realWidth + extraWidth);
				if (count && lastShowColumn) {
					lastShowColumn.width += appendWidth;
				}
			}
		},
		_forceFitWidth : function(){
			var _self = this,
				columns = _self.get('columns');
			_self._forceFitColumns();
			S.each(columns,function(column){
				if(!column.hide){
					_self._setColumnWidth(column);
				}
			});
		},
		_getRowCount : function(){
			var _self = this,
				tbody = _self.get('tbody');
			return S.all('.' + CLS_GRID_ROW,tbody).length;
		},
		_getCheckedCellTemplate : function (clsCheck, clscell) {
			return ['<td width="30px" align="center" class="', clsCheck, ' ', clscell, '"><div class="', clscell, '-inner"><span class="gwt-CheckBox"><input type="checkbox" class="', CLS_CHECKBOX, '" tabindex="0"></span></div></td>'].join('');
		},
		//通过DataIndex获取列
		_getColumn : function(field){
			var _self = this,
				columns = _self.get('columns'),
				result = null;
			S.each(columns,function(column){
				if(column.dataIndex === field){
					result = column;
					return false;
				}
			});
			return result;
		},
		//通过编号获取列
		_getColumnById : function(id){
			var _self = this,
				columns = _self.get('columns'),
				result = null;
			S.each(columns,function(column){
				if(column.id === id){
					result = column;
					return false;
				}
			});
			return result;
		},
		//获取列的表头
		_getHeadCell : function(columnId){
			var _self = this,
				thead = _self.get('thead'),
				clsTh = '.'+ CLS_PREFIX_HEADER_COLUMN + columnId,
				headCell = S.one(clsTh,thead);
			return headCell;
		},
		//获取行的模版
		_getRowTemplate : function (index, obj) {
			var _self = this,
				cells = _self.get('columns'),
				oddCls = index % 2 === 0 ? CLS_ROW_ODD : CLS_ROW_EVEN,
				cellTempArray = [],
				rowTemplate = null,
				cellTemp = null,
				emptyTd = '',
				checkable = _self.get('checkable');
			if (checkable) {
				cellTemp =  _self._getCheckedCellTemplate('grid-row-checked-column', CLS_GRID_CELL);
				cellTempArray.push(cellTemp);
			}
			S.each(cells, function (column, colindex) {
				var value = _self._getFieldValue(obj,column.dataIndex),//obj[column.dataIndex],
					text = _self._getRenderText(column,value,obj),
					temp = _self._getCellTemplate(colindex, column, text,value,obj);
				cellTempArray.push(temp);
			});

			rowTemplate = ['<tr rowIndex="', index, '" class="', CLS_GRID_ROW, ' ',oddCls,'">', cellTempArray.join(''), emptyTd, '</tr>'].join('');
			return rowTemplate;
		},
        //获取格式化的数据
        _getRenderText : function(column,value,obj){

            var text = value;
            if(column.renderer){
                try{
                    text =  column.renderer(value, obj);
                }catch(ex){
                    S.error('renderer error,occurred in column: ' + column.title);
                }
            }

            return text;
        },
    _getFieldValue:function(obj,dataIndex){
		if(!dataIndex){
			return '';
		}
    	var arr = dataIndex.split('.'),
    		curObj = obj,
    		result;

    	S.each(arr,function(name){
    		if(curObj){
    			result = curObj[name];
    			curObj = result;
    		}else{
    			return false;
    		}
    	});
    	return result;
    },
		//获取汇总行的记录
		_getSummaryTemplate : function (summary) {
			var _self = this,
				cells = _self.get('columns'),
				cellTempArray = [],
				prePosition = -1,	//上次汇总列的位置
				currentPosition = -1,//当前位置
				rowTemplate = null,
				checkable = _self.get('checkable');
			if(checkable){
				currentPosition += 1;
			}
			
			/**
			* @private
			*/
			function getEmptyCellTemplate(colspan){
				if(colspan > 0) {
					return '<td class="' + CLS_GRID_CELL + '" colspan="' + colspan + '"></td>';
				} 
				return '';
			}
			S.each(cells, function (column, colindex) {
				if(!column.hide){
					currentPosition += 1;
					if(column.summary){
						cellTempArray.push(getEmptyCellTemplate(currentPosition-prePosition - 1));
						var value = _self._getFieldValue(summary,column.dataIndex), //summary[column.dataIndex],
							text = '总计：' + _self._getRenderText(column,value,summary),
							temp = _self._getCellTemplate(colindex, column, text,summary);
						cellTempArray.push(temp);
						prePosition = currentPosition;
					}
				}
			});
			if(prePosition !== currentPosition){
				cellTempArray.push(getEmptyCellTemplate(currentPosition-prePosition));
			}

			rowTemplate = ['<tr class="', CLS_GRID_ROW, '">', cellTempArray.join(''), '</tr>'].join('');
			return rowTemplate;

		},
		//获取单元格的模版
		_getCellTemplate : function (colindex, column, text,value,obj) {

			var _self = this,
				dataIndex = column.dataIndex,
				width = column.width,
				tipText = _self._getShowTip(column,value,obj, true),
				hideText = column.hide ? CLS_HIDDEN : '',
				template = ['<td  class="grid-body-cell grid-body-td-', column.id, ' ', hideText, '" data-column-name="', column.id, '" colindex="', colindex, '" data-column-field = "',dataIndex,'" width="', width, 'px">',
						'<div class="', CLS_GRID_CELL_INNER ,'" style="width : ', width, 'px"><span class="', CLS_CELL_TEXT, ' " ' , tipText, '>', text, '</span></div></td>'].join('');
			return template;
		},
		//获取显示的tip
		_getShowTip : function(column, value, obj, isTitle){
			var showTip = column.showTip,
				text = value,
				tip = '';
			if(!showTip){
				return '';
			}
			if(S.isFunction(showTip)){
				text =  showTip(value,obj);
			}
			if(!!isTitle){
				tip = 'title="' + (text || '') + '"';
			}else{
				tip = text || '';
			}
			return tip;
		},
		//获取列的累加宽度，包含列的Border
		_getColumnsWidth : function () {
			var _self = this,
				columns = _self.get('columns'),
				checkable = _self.get('checkable'),
				totalWidth = 0;
			if (checkable) {
				totalWidth += 31;
			}
			S.each(columns, function (column) {
				if (!column.hide) {
					totalWidth += column.width + 1;
				}
			});
			return totalWidth;
		},
		//初始化Grid
		_init : function () {
			var _self = this,
				gridId = _self.get('gridId'),
				container = _self.get('container'),
				renderTo = _self.get('renderTo'),
				gridTemp = null,
				gridEl = null,
				header = null,
				headerTable = null,
				body = null,
				table = null,
				width = 0,
				height = _self.get('height');
				//subHeight = 0;//内部显示数据部分的高度
			if (!container) {
				container = DOM.get('#' + renderTo);
				_self.set('container', container);
			}
			if (!gridId) {
                gridId =  renderTo + 'grid';
				_self.set('gridId', gridId);
            }
			gridTemp = ['<div id="', gridId, '" class="grid-panel"><div id="', gridId + 'tbar', '" class="grid-tbar" style="display : none;"></div><div class="grid-view"><div class="grid-header"><table  cellspacing="0" cellpadding="0" class="grid-table"><thead></thead></table></div><div class="grid-body grid-body-scroll"><table  cellspacing="0" cellpadding="0" class="grid-table"><tbody><tfoot></tfoot></tbody></table></div></div><div id="', gridId + 'bbar', '" class="grid-bbar" style="display : none;"></div></div>'].join('');
			//创建表格的框架
            gridEl = new Node(gridTemp);
			gridEl.appendTo(container);
			_self.set('gridEl', gridEl);
			//table元素，展现表头、表格
			header = DOM.get('.grid-header', container);
			headerTable = DOM.get('.grid-table', header);
			body = DOM.get('.grid-body', container);
			table = DOM.get('.grid-table', body);
			_self.set('head', header);
            _self.set('headerTable',headerTable);
			_self.set('body', body);
			_self.set('tbody', table.tBodies[0]);
			_self.set('tfoot', table.tFoot);
			_self.set('thead', headerTable.tHead);

			_self._initHeader();

			if (!_self._isAutoFitWidth()) {//如果设置了宽度，则使用此宽度
				width = _self.get('width');
				_self._setWidth(width);
			} else {						//根据所有列的宽度设置Grid宽度
				width = _self._getColumnsWidth();
				_self._setWidth(width + 2);
			}
            if(_self.get('allowScroll')){
                gridEl.addClass(CLS_ALLOW_SCROLL);
            }
			//如果设置了高度，设置Grid Body的高度，
			if (height) {
				_self.setHeight(height);
			}

			_self._initListeners();
			//_self._initMenu();//延迟初始化菜单
			_self._initPaggingBar();
			_self._initEvent();
			_self._initData();
			
		},
		//初始化事件
		_initEvent : function () {
			this._initHeaderEvent();
			this._initBodyEvent();
			this._initDataEvent();
			this._initPaggingBarEvent();
			if(this.get('allowScroll')){
                this._initScrollEvnet();
            }
		},
        _initScrollEvnet : function(){
            var _self = this,
                header = _self.get('head'),
                headerTable = _self.get('headerTable');

            
            Event.on(win,'scroll',function(){
                var offset = DOM.offset(headerTable),
                    headOffset = DOM.offset(header),
                    scrollTop = DOM.scrollTop();
                if(scrollTop <= headOffset.top){
                    DOM.css(headerTable,{top : 0});
                }else if(!S.LP.isInVerticalView(offset.top)){
                    DOM.css(headerTable,{top : scrollTop - headOffset.top});
                }else if(offset.top > scrollTop && scrollTop > headOffset.top){
                    DOM.css(headerTable,{top : scrollTop - headOffset.top});
                }
            });
        },
		//列表内容的事件初始化
		_initBodyEvent : function () {
			var _self = this,
				body = _self.get('tbody');
			_self._addBodyEvent(body);
		},
		//初始化数据，如果设置了Store，则根据情况自动加载数据
		_initData : function () {
			var _self = this,
				store = _self.get('store'),
				loadMask = _self.get('loadMask'),
				gridEl = _self.get('gridEl');
			if (loadMask) {
				loadMask = new S.LP.LoadMask(gridEl, {msg : 'Loading...'});
				_self.set('loadMask', loadMask);
			}
			if (store && store.autoLoad) {
				//if(!sotre.hasLoad){
					store.load();
				//}
			}
		},
		_initMenu : function(){
			var _self = this,
				showMenu = _self.get('showMenu'),
				columns = _self.get('columns'),
				menu = null;
			if(showMenu){
				menu = new GridMenu({columns : columns});
				_self.set('menu',menu);
				_self._initMenuEvent();
			}
			return menu;
		},
		_initMenuEvent : function(){
			var _self = this,
				//thead = _self.get('thead'),
				menu = _self.get('menu');
			if(!menu) {
				return;
			}
			menu.on('columnsort',function(event){
				var column = event.column,
					direction = event.direction;
				if(column.sortable){
					_self._setSortIcon(column.id,direction);
					_self.sort(column,direction);
				}
			});
			
			menu.on('columnhide',function(event){
				var column = event.column;
				if(!_self._isLastVisibleColumn(column)){
					_self._setColumnVisible(column,false);
					_self.fire('columnhide',{column:column});
				}
			});
			
			menu.on('columnshow',function(event){
				var column = event.column;
				_self._setColumnVisible(column,true);
				_self.fire('columnshow',{column:column});
			});

			menu.on('menuhide',function(event){
				var column = event.column,
					headCell = _self._getHeadCell(column.id);
				if(headCell){
					headCell.removeClass(CLS_HOVER);
				}
			});
		},
		//初始化Store相关的事件
		_initDataEvent : function () {
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
				store.on('localsort', function (event) {
					var direct = event.direction === 'ASC' ? 1 : -1;
					_self._localSort(event.field , direct);
				});
				store.on('addrecords', function (event) {
					var data = event.data;
					_self.appendData(data);
				});
				store.on('removerecords', function (event) {
					var data = event.data;
					_self.removeData(data);				
				});
				store.on('exception', function () {
					var loadMask = _self.get('loadMask');
					if (loadMask) {
						loadMask.hide();
					}
				});
				store.on('updaterecord', function (event) {
					var record = event.record;
					_self._updateRow(record);
				});
			}
		},
		//初始化表头事件
		_initHeaderEvent : function () {
			var _self = this,
				header = _self.get('thead'),
				checkable = _self.get('checkable'),
				menu = _self.get('menu'),
				thCollections = S.all('.' + CLS_HEADER_TH_INNER, header);
			

			/**
			* @private
			*/
			function headMouseOver(event) {
				S.one(this).parent().addClass(CLS_HOVER);
			}

			/**
			* @private
			*/
			function headClick(event) {
				var tdInner = _self._lookupByClass(event.target,CLS_HEADER_TH_INNER),//S.one(this),
					target = S.one(event.target),
					parentEl = null,// sender.parent(),
					id = null,//,
					column = null,//_self._getColumnById(id),
					sortDirect = null,
					offset = null,
					sender = null;
					//sortNum = null;
				if(!tdInner){
					return;
				}
				sender = S.one(tdInner);
				parentEl = sender.parent();
				id = parentEl.attr(ATTR_COLUMN_NAME);
				column = _self._getColumnById(id);

				if(target.hasClass(CLS_COLUMN_TRIGGER)){
					event.stopPropagation();
					offset = target.offset();
					if(!menu){
						menu = _self._initMenu();
					}else{
						if(!menu.isHide()){
							menu.hide();
						}
					}
					menu.setCurrentColumn(column);
					menu.setSortable(column.sortable);
					menu.show({top : offset.top + 24,left:offset.left});
					
				}else if (parentEl.hasClass(CLS_SORT)) {
					sortDirect = sender.hasClass(CLS_SORT_ASC) ? 'DESC' : 'ASC';
					_self._setSortIcon(column.id,sortDirect,parentEl,thCollections);
					_self.sort(column, sortDirect);
				}
			}
			/**
			* @private
			*/
			function headMouseLeave(event) {
				var tdEl = S.one(this).parent(),
					id = tdEl.attr(ATTR_COLUMN_NAME);

				tdEl.removeClass(CLS_HOVER);
				if(menu && !menu.isHide() && menu.isCurrentColumn(id)){
					S.one(this).parent().addClass(CLS_HOVER);
				}
			}

			S.one(header).on('click',headClick);

			thCollections.on('mouseover', headMouseOver)
				.on('mouseleave', headMouseLeave);
				//.on('click', headClick)
			if (checkable) {
				S.one('.' + CLS_CHECKBOX, header).on('click', function () {
					_self._setAllRowsSelected(S.one(this).attr('checked'));
				});
			}
		},
		//初始化表头
		_initHeader : function () {
			var _self = this,
				showMenu = _self.get('showMenu'),
				columns = _self.get('columns'),
				header = _self.get('thead'),
				tr = header.insertRow(0),
				checkable = _self.get('checkable'),
				//totalWidth = 0,
				checkColumnTemplate = null,
				//emptyWidth = 0,
				emptyTh = null;

			
			/**
			* 内部函数，只在次函数内有用
			* @private
			*/
			function createColumn(column) {
				var sortable = column.sortable ? CLS_SORT : '',
					sortIcon = sortable ? '<span class="grid-header-sort-icon">&nbsp;</span>' : '',
					hideText = column.hide ? CLS_HIDDEN : '',
					menuText = showMenu ? '<span class="grid-column-menu-trigger"></span>' :'',
					width = column.width,
					cls = column.cls,
					temp = ['<th align="left" class="', CLS_HEADER_TH, ' ', hideText, ' ', CLS_PREFIX_HEADER_COLUMN + column.id, ' ', sortable, '" data-column-name="', column.id, '" data-column-field = "',column.dataIndex,'">',
                                                '<div class ="', CLS_HEADER_TH, '-inner ',cls,' "><span class="', CLS_HEADER_TITLE, '">', column.title, '</span>',
                                                sortIcon , menuText,'</div>',
                                            '</th>'].join(''),
					thEl = new Node(temp);
				thEl.attr('width',width+'px');
				thEl.appendTo(tr);
			}

			if (checkable) {
				checkColumnTemplate = _self._getCheckedCellTemplate('grid-header-checked-column', CLS_HEADER_TH);
                new Node(checkColumnTemplate).appendTo(tr);
			}

			//创建列头，计算宽度
			S.each(columns, function (column) {
				var width =  column.width || COLUMN_DEFAULT_WIDTH;
				if(!column.id){
					column.id = S.guid('col');
				}
				column.width = width;
				createColumn(column);
			});
			if (!_self._isAutoFitWidth()) {
				emptyTh = new Node('<th class="' + CLS_HEADER_TH + ' grid-header-th-empty"><div class ="' + CLS_HEADER_TH + '-inner"></div></th>');
				emptyTh.appendTo(tr);
			}
		},
		//初始化事件处理函数
		_initListeners : function () {
			var _self = this,
				listeners = _self.get('listeners'),
				name = null;
			if(listeners){
				for(name in listeners){
					if(listeners.hasOwnProperty(name)) {
						_self.on(name, listeners[name]);
					}
				}
			}
		},
		//验证是否最后一个显示的列
		_isLastVisibleColumn : function(column){
			var _self = this,
				columns = _self.get('columns'),
				result = true;
				
			if(column.hide){
				result =  false;
			}

			S.each(columns,function(item){
				if(column !== item && !item.hide){
					result = false;
					return false;
				}
			});
			return result;
		},
		// 更新行数据
		_updateRow: function(record){
			var _self = this,
				row = _self._findRowByRecord(record),
				columns = _self.get('columns');
			if(row){
				S.each(columns, function (column) {
					var field = column.dataIndex,
						id = column.id,
						cls = PREFIX_CLS_CELL + id,
						cell = S.one('.' + cls, row),
						textEl = cell.one('.' + CLS_CELL_TEXT),
						text = null;
					if(textEl){
						text = _self._getRenderText(column,record[field],record); 
						text = text === undefined ? '' : text;
						if(textEl.html() !== text){
							textEl.html(text);
							if(column.showTip){
								textEl.attr('title', _self._getShowTip(column, record[field], record, false));
							}
						}
					}
				});
			}
		},
		//添加表头额外的宽度，适应横向、纵向滚动条
		_setEmptyHeadCellWidth : function (emptyWidth) {
			var _self = this,
				header = _self.get('thead'),
				emptyEl = S.one('.' + CLS_HEADER_TH_EMPTY, header);
			if(!emptyEl){
				return;
			}
			if (emptyWidth <= 0) {
				emptyEl.hide();
			} else {
				emptyEl.attr('width', emptyWidth + 'px');
				emptyEl.show();
			}
		},
		//设置表头、和表格内容的宽度，如果超出，会出现滚动条
		_autoSetInnerWidth : function () {
			var _self = this,
				header = _self.get('thead'),
				body = _self.get('tbody'),
				height = _self.get('height'),
				width = _self._getColumnsWidth(),
				headerWidth = 0,
				forceFit = _self._isForceFit(),
				gridWidth = _self.getWidth(),
				emptyWidth = forceFit ? COLUMN_WIDTH_EMPTY : gridWidth < (width + 2) ? COLUMN_WIDTH_EMPTY : gridWidth - (width + 2);

			if(emptyWidth > 0 && emptyWidth < COLUMN_WIDTH_EMPTY){
				emptyWidth = COLUMN_WIDTH_EMPTY;
			}
			_self._setEmptyHeadCellWidth(emptyWidth);
			headerWidth = width + (emptyWidth ? emptyWidth + 2 : 0);
			S.one(header).parent().width(headerWidth);
			if (height && !UA.firefox) {
				width -= (COLUMN_WIDTH_EMPTY + 2);
			}
			S.one(body).parent().width(width);
		},
		_initPaggingBar : function () {
			var _self = this,
				gridId = _self.get('gridId'),
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

			if (tbarConfig) {
				if(tbarConfig.pageSize){
					tpbar = createPaggingBar(tbarConfig, gridId + 'tbar');
					_self.set('tpaggingBar', tpbar);
					pageSize = tbarConfig.pageSize;
				}
				if(tbarConfig.buttons){
					tbbar = createButtonBar(tbarConfig, gridId + 'tbar');
					_self.set('tbuttonBar', tbbar);
				}
			}
			if (bbarConfig) {
				bpbar = createPaggingBar(bbarConfig, gridId + 'bbar');
				_self.set('bpaggingBar', bpbar);
				pageSize = bbarConfig.pageSize;
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
		_initPaggingBarEvent : function () {
			var _self = this,
				tbar = _self.get('tpaggingBar'),
				bbar = _self.get('bpaggingBar');
			if (tbar) {
				tbar.on('beforepagechange', function (event) {
					_self.fire('beforepagechange', event);
				});
			}

			if (bbar) {
				bbar.on('beforepagechange', function (event) {
					_self.fire('beforepagechange', event);
				});
			}
		},
		_isAutoFitWidth : function () {
			return !this.get('width');
		},
		//当未设定宽度时，强制适应列宽度不起效
		_isForceFit : function(){
			var _self = this,
				width = _self.get('width'),
				forceFit = _self.get('forceFit');
			return width && forceFit;
		},
		_isRowSelected : function (row) {
			return S.one(row).hasClass(CLS_GRID_ROW_SELECTED);
		},
		_localSort : function (field, sortDirection) {
			var _self = this,
				tbody = _self.get('tbody'),
				store = _self.get('store'),
				rows = S.makeArray(tbody.rows);
			
			/**
			* @private
			*/
			function getCellValue(row, key) {
				var obj = DOM.data(row, DATA_ELEMENT);
				return obj ? obj[key] : '';
			}
			if(store){
				rows.sort(function (a, b) {
					var obj1 = DOM.data(a, DATA_ELEMENT),
						obj2 = DOM.data(b, DATA_ELEMENT);
					return store.compare(obj1,obj2);
				});
			}else{
				rows.sort(function (a, b) {
					var aText = getCellValue(a, field),
						bText = getCellValue(b, field);
					if (aText < bText) {
						return -sortDirection;
					}
					if (aText > bText) {
						return sortDirection;
					}
					return 0;
				});
			}

			S.each(rows, function (row) {
				var rowEl = S.one(row);
				rowEl.appendTo(tbody);
			});
		},
		//行的 click 事件
		_rowClickEvent : function (target) {
			var _self = this,
				row = _self._findRow(target),
				cell = _self._findCell(target),
				rowCheckable = _self.get('checkable'),
				data = null,
				eventResult = null;
			if (row) {
				data = DOM.data(row, DATA_ELEMENT);
				if (cell) {
					eventResult = _self.fire('cellclick', {data : data, row : row, cell : cell, field : DOM.attr(cell, ATTR_COLUMN_FIELD), domTarget : target});
					if(eventResult === false){
						return;
					}
				}
				_self.fire('rowclick', {data : data, row : row});
				if (rowCheckable) {
					if (!_self._isRowSelected(row)) {
						_self._setRowSelected(row, true);
					} else {
						_self._setRowSelected(row, false);
					}
				} else {
					var selectedRow = S.one('.' + CLS_GRID_ROW_SELECTED, row.parentNode);
					if(selectedRow){
						S.all('.' + CLS_GRID_ROW_SELECTED, row.parentNode).removeClass(CLS_GRID_ROW_SELECTED);
						_self._onRowSelectChanged(selectedRow[0],false);
					}
					DOM.addClass(row, CLS_GRID_ROW_SELECTED);
					_self._onRowSelectChanged(row,true);
				}
			}
		},
		// 行的双击事件
		_rowDoubleClickEvent: function(target){
			var _self = this,
				row = _self._findRow(target),
				cell = _self._findCell(target),
				data = null;
			if (row) {
				data = DOM.data(row, DATA_ELEMENT);
				if (cell) {
					_self.fire('celldblclick', {data : data, row : row, cell : cell, field : DOM.attr(cell, ATTR_COLUMN_FIELD), domTarget : target});
				}
				_self.fire('rowdblclick', {data : data, row : row});
			}
		},
		//行的 mouseover 事件
		_rowOverEvent : function (target) {
			var _self = this,
				row = _self._findRow(target);
			if (row) {
				S.one(row).addClass(CLS_GRID_ROW_OVER);
			}
		},
		//行的 mouseout 事件
		_rowOutEvent : function (target) {
			var _self = this,
				row = _self._findRow(target);
			if (row) {
				S.one(row).removeClass(CLS_GRID_ROW_OVER);
			}
		},
		//设置列宽
		_setColumnWidth : function(column,width){

			if(typeof(column) ==='string'){
				column = this._getColumn(column);
			}
			var _self = this,
				id = column.id,
				clsTh = '.'+ CLS_PREFIX_HEADER_COLUMN + id,
				clsTd = '.grid-body-td-' + id,
				thead = _self.get('thead'),
				tbody = _self.get('tbody'),
				cellList = null;
			if(column.width !== width){
				if(width){
					column.width = width;
				}else{
					 width = column.width;
				}
				S.one(clsTh,thead).attr('width',width + 'px');
				cellList = S.all(clsTd,tbody);
				cellList.each(function(cell){
					cell.attr('width',width + 'px').children('.grid-body-cell-inner').width(width);
				});
			}
		},
		//设置列是否可见
		_setColumnVisible : function(column,visible){
			if(typeof(column) ==='string'){
				column = this._getColumn(column);
			}
			if(column){
				var _self = this,
					id = column.id,
					forceFit = _self._isForceFit(),
					clsTh = '.' + CLS_PREFIX_HEADER_COLUMN + id,
					clsTd = '.grid-body-td-' + id,
					thead = _self.get('thead'),
					tbody = _self.get('tbody');
				if(visible){
					column.hide = false;
					S.one(clsTh,thead).removeClass(CLS_HIDDEN);
					S.all(clsTd,tbody).removeClass(CLS_HIDDEN);
				}else{
					column.hide = true;
					S.one(clsTh,thead).addClass(CLS_HIDDEN);
					S.all(clsTd,tbody).addClass(CLS_HIDDEN);
				}
				//如果表格列自适应宽度
				if(forceFit){
					_self._forceFitWidth();
				}else{
					_self._autoSetInnerWidth();
				}
			}
		},
		//设置表头选中状态
		_setHeaderChecked : function (checked) {
			var _self = this,
				header = _self.get('thead'),
				checkEl = S.one('.' + CLS_CHECKBOX, header);
			if (checkEl) {
				checkEl.attr('checked', checked);
			}
		},
		//设置排序图标
		_setSortIcon : function(columnId,direction,headCell,thCollections){
			var _self = this,
				thead = _self.get('thead'),
				cellInnder = null,
				sortDirect = null;
			
			headCell = headCell || _self._getHeadCell(columnId);
			cellInnder = S.one('.' + CLS_HEADER_TH_INNER , headCell);
			thCollections = thCollections || S.all('.' + CLS_HEADER_TH_INNER, thead);

			sortDirect = direction === 'DESC' ? CLS_SORT_DESC : CLS_SORT_ASC;
			thCollections.removeClass(CLS_SORT_ASC).removeClass(CLS_SORT_DESC);
			cellInnder.addClass(sortDirect);
		},
		//设置行选择
		_setRowSelected : function (row, selected) {
			var _self = this,
				checkbox = DOM.get('.' + CLS_CHECKBOX, row),
				data = DOM.data(row, DATA_ELEMENT),
				hasSelected = DOM.hasClass(row, CLS_GRID_ROW_SELECTED);
				
			if (hasSelected === selected) {
				return;
			}
			
			if (checkbox) {
				//如果选择框不可用，此行不能选中
				if(DOM.attr(checkbox,'disabled')){
					return;
				}
				checkbox.checked = selected;
			}
			if (selected) {
				DOM.addClass(row, CLS_GRID_ROW_SELECTED);
				//_self.fire('rowselected', {data : data, row : row});
				_self._onRowSelectChanged(row, selected);
			} else {
				DOM.removeClass(row, CLS_GRID_ROW_SELECTED);
				_self._setHeaderChecked(false);
				//_self.fire('rowunselected', {data : data, row : row});
				_self._onRowSelectChanged(row, selected);
			}
			//_self.fire('rowselectchanged', {data : data, row : row});
		},
		//触发行选中，取消选中事件
		_onRowSelectChanged : function(row,selected){
			var _self = this,
				data = DOM.data(row, DATA_ELEMENT);
			if(selected){
				_self.fire('rowselected', {data : data, row : row});
			}else{
				_self.fire('rowunselected', {data : data, row : row});
			}
			_self.fire('rowselectchanged', {data : data, row : row, selected : selected});
		},
		//设置全选
		_setAllRowsSelected : function (selected) {
			var _self = this,
				body = _self.get('tbody');
			//_self._setHeaderChecked(true);
			S.each(body.rows, function (row) {
				_self._setRowSelected(row, selected);
			});
		},
		_setWidth : function (width) {
			var _self = this,
				body = _self.get('body'),
				gridEl = _self.get('gridEl'),
				
				forceFit = _self._isForceFit();
			
			gridEl.width(width);
			S.one(body).width(width - 2);
			gridEl.children('.grid-view').width(width - 2);
			//如果表格列自适应宽度
			if(forceFit){
				_self._forceFitWidth();
			}

			_self._autoSetInnerWidth(width);
            gridEl.addClass(CLS_GRID_WIDTH);
		},
		destroy : function () {
		}
	});
	
	function GridMenu (config){
		GridMenu.superclass.constructor.call(this, config);
		this._init();
	}

	S.extend(GridMenu, S.Base);
	S.augment(GridMenu, {
		/**
		* 菜单是否包含指定的元素
		*/
		contains : function(element){
			if(!element){
				return false;
			}
			var _self = this,
				menuEl = _self.get('menuEl'),
				columnMenuEl = _self.get('columnMenuEl');
			return menuEl[0] === element || columnMenuEl[0] === element || menuEl.contains(element) || columnMenuEl.contains(element);
		},
		/**
		* 获取当前列
		*/
		getCurrentColumn : function(){
			return this.get('currentColumn');
		},
		/**
		* 隐藏菜单
		*/
		hide : function(){
			var _self = this,
				menuEl = _self.get('menuEl');
			menuEl.css({visibility : 'hidden'});
			_self.hideColumnMenu();
			_self.fire('menuhide',{column : _self.getCurrentColumn()});
		},
		/**
		* 隐藏列配置菜单
		*/
		hideColumnMenu :function(){
			var _self = this,
				columnMenuEl = _self.get('columnMenuEl');
			columnMenuEl.css({visibility: 'hidden'});
		},
		/**
		* 是否在当前列显示菜单
		*/
		isCurrentColumn : function(id){
			var _self = this,
				current = _self.getCurrentColumn();
			if(!id || !current){
				return false;
			}
			if(S.isObject(id)){
				return id === current;
			}
			return id === current.id;
		},
		/**
		* 菜单是否处于显示状态
		*/
		isHide : function(){
			var _self = this,
				menuEl = _self.get('menuEl');
			return menuEl.css('visibility') !== 'visible';
		},
		/**
		* 设置当前列
		*/
		setCurrentColumn : function(column){
			var _self = this;

			_self.set('currentColumn',column);
		},
		
		/**
		* 设置是否可排序
		*/
		setSortable : function(sortable){
			var _self = this,
				ascSortItem = _self.get('ascSortItem'),
				descSortItem = _self.get('descSortItem');
			if(!sortable){
				ascSortItem.addClass(CLS_DISABLED);
				descSortItem.addClass(CLS_DISABLED);
			}else{
				ascSortItem.removeClass(CLS_DISABLED);
				descSortItem.removeClass(CLS_DISABLED);
			}
		},
		/**
		* 显示菜单
		*/
		show : function(offset){
			var _self = this,
				menuEl = _self.get('menuEl'),
				width = _self._getMenuWidth();
			_self._resetColumnsVisible(); //重置菜单状态
			if(!S.LP.isInHorizontalView(offset.left + width)){
				offset.left -= width;
			}
			menuEl.css({visibility: 'visible',left : offset.left, top : offset.top});
			_self.fire('menushow',{column : _self.getCurrentColumn()});
		},
		/**
		 * 显示列设置菜单 
		 */
		showColumnMenu : function(offset){
			var _self = this,
				width = _self._getColumnMenuWidth(),
				columnMenuEl = _self.get('columnMenuEl');
			if(!S.LP.isInHorizontalView(offset.left + width)){
				offset.left -= (2 * width) - 10;
			}
			columnMenuEl.css({visibility: 'visible',left : offset.left, top : offset.top});
		},
		/**
		* 创建表格菜单项
		*/
		_createMenuItem : function(text,cls){
			var _self = this,
				menuEl = _self.get('menuEl'),
				temp = '<div class="' + CLS_MENU_ITEM + ' "><a class="menu-item-link ' + cls + '" href="#">' + EMPTY_IMG + '<span class="menu-item-text">' + text + '</span></a></div>';
			return new Node(temp).appendTo(menuEl);
		},
		/**
		* 创建表格 列的菜单项
		*/
		_createColumnMenuItem : function(column,parent){
			var _self = this,
				columnMenuEl = parent || _self.get('columnMenuEl'),
				checkCls = column.hide ? CLS_MENU_UNCKECKED:CLS_MENU_CKECKED,
				temp = ['<div class="', CLS_COLUMN_MENU_ITEM ,' ', checkCls ,'"><a class="menu-item-link" href="#">' + EMPTY_IMG + '</span><span class="menu-item-text">',column.title,'</span></a></div>'].join(''),
				el = new Node(temp).appendTo(columnMenuEl);
			el.data(DATA_COLUMN,column);
			return el;
		},
		//创建分割条
		_createSeperator : function(){
			var _self = this,
				menuEl = _self.get('menuEl'),
				temp = '<div class="grid-menu-item-separator"></div>';
			return new Node(temp).appendTo(menuEl);
		},
		//获取菜单的宽度
		_getMenuWidth : function(){
			return MENU_WIDTH;
		},
		//获取列菜单的宽度
		_getColumnMenuWidth : function(){
			return MENU_WIDTH;
		},
		//初始化
		_init : function(){
			var _self = this;

			_self._initDom();
			_self._initEvent();
		},
		//初始化DOM结构
		_initDom : function(){
			var _self = this,
				menuTemp = '<div class="grid-menu" style = "visibility: hidden; top:-1000px;left;-1000px"></div>',
				columnTemp = '<div class="grid-column-menu" style = "visibility: hidden; top:-1000px;left;-1000px"></div>',
				menuEl = new Node(menuTemp).appendTo('body'),
				columnMenuEl = new Node(columnTemp).appendTo('body'),
				ascSortItem = null,
				descSortItem = null,
				columnItem = null;

			_self.set('menuEl',menuEl);
			_self.set('columnMenuEl',columnMenuEl);
			
			ascSortItem = _self._createMenuItem('升序','menu-sort-asc');
			descSortItem = _self._createMenuItem('降序','menu-sort-desc');
			_self._createSeperator();
			columnItem = _self._createMenuItem('设置列','menu-cols-icon');
			//添加箭头
			new Node(EMPTY_IMG)
				.addClass('menu-item-arrow')
				.appendTo(columnItem);

			_self.set('ascSortItem',ascSortItem);
			_self.set('descSortItem',descSortItem);
			_self.set('columnItem',columnItem);
			_self._initColumnMenu();
			

		},
		//初始化列菜单
		_initColumnMenu : function(){
			var _self = this,
				columns = _self.get('columns'),
				columnMenuEl = _self.get('columnMenuEl'),
				columnItems = null;
			
			S.each(columns,function(column){
				_self._createColumnMenuItem(column,columnMenuEl);
			});
			columnItems = columnMenuEl.all('.' + CLS_COLUMN_MENU_ITEM);
			_self.set('columnItems',columnItems);

		},
		//初始化事件
		_initEvent : function(){
			var _self = this,
				menuEl = _self.get('menuEl'),
				columnMenuEl = _self.get('columnMenuEl'),
				ascSortItem = _self.get('ascSortItem'),
				descSortItem = _self.get('descSortItem'),
				columnItem = _self.get('columnItem'),
				columnItems = _self.get('columnItems');

			function itemOver(event){
				var el = S.one(this);
				if(!el.hasClass(CLS_DISABLED)){
					el.addClass(CLS_MENU_ACTIVE);
				}
			}

			function itemOut(event){
				var el = S.one(this);
				el.removeClass(CLS_MENU_ACTIVE);
			}
			
			//menuEl.on('click',function(event){});
			menuEl.all('.'+CLS_MENU_ITEM)
				.on('click',function(event){
					event.preventDefault();
					event.stopPropagation();
				})
				.on('mouseover',itemOver)
				.on('mouseout',itemOut);
			//正向排序
			ascSortItem.on('click',function(){
				if(!ascSortItem.hasClass(CLS_DISABLED)){
					_self.fire('columnsort',{column : _self.getCurrentColumn() , direction:'ASC'});
				}
			});
			//反向排序
			descSortItem.on('click',function(){
				if(!descSortItem.hasClass(CLS_DISABLED)){
					_self.fire('columnsort',{column : _self.getCurrentColumn() , direction:'DESC'});
				}
			});
			
			//显示/隐藏列设置
			columnItem.on('mouseenter',function(){
				var offset = columnItem.offset(),
					width = columnItem.width();
				_self.showColumnMenu({top : offset.top,left : offset.left + (width - 2)});
			}).on('mouseleave',function(event){
				var toEl = S.one(event.toElement);
				if(toEl && !toEl.hasClass('grid-column-menu') && !columnMenuEl.contains(toEl)){
					_self.hideColumnMenu();
				}				
			});

			//点击隐藏、显示列
			columnItems.on('click',function(event){
				event.preventDefault();
				event.stopPropagation();
				var el = S.one(this),
					column = el.data(DATA_COLUMN);
				if(el.hasClass(CLS_MENU_CKECKED)){
					el.removeClass(CLS_MENU_CKECKED);
					el.addClass(CLS_MENU_UNCKECKED);
					_self.fire('columnhide',{column : column});
				}else{
					el.addClass(CLS_MENU_CKECKED);
					el.removeClass(CLS_MENU_UNCKECKED);
					_self.fire('columnshow',{column : column});
				}
			})
			.on('mouseover',itemOver)
			.on('mouseout',itemOut);/*;*/
			
			S.one(doc).on('click',function(event){
				var target = event.target;
				if(!_self.isHide() && !_self.contains(target)){
					_self.hide();
				}
			});
			
		},
		//向上查找对象
		_lookupByClass : function (element, css) {
			if (DOM.hasClass(element, css)) {
				return element;
			}
			return DOM.parent(element, '.' + css);
		},
		//重新设置列是否隐藏
		_resetColumnsVisible : function(){
			var _self = this,
				columnItems = _self.get('columnItems');
			columnItems.each(function(item){
				var column = item.data(DATA_COLUMN);
				if(item.hasClass(CLS_MENU_UNCKECKED) !== column.hide){
					if(column.hide){
						item.removeClass(CLS_MENU_CKECKED);
						item.addClass(CLS_MENU_UNCKECKED);
					}else{
						item.addClass(CLS_MENU_CKECKED);
						item.removeClass(CLS_MENU_UNCKECKED);
					}
				}
			});
		}
	});

	/**
	* 可编辑表格控件
	* @memberOf S.LP
	* @description 编辑表格数据
	* @class 可编辑的表格类
	* @augments KISSY.LP.Grid 
	* @param {Object} conifg 配置项,同父类{@link KISSY.LP.Grid},差别在于列的配置上
	* @param {Object} conifg.showError 是否直接在列表中显示错误提示
	* @param {Object} conifg.columns[0].editor 列上的编辑器配置<br>
	* 1) type 编辑器的类型，目前支持 "text","number","select"<br>
	* 2) items 当类型为 "select"时，items中包含下拉列表中的键值对<br>
	* 3) validator ,函数原型 Function(value,obj)验证器，当返回值为字符串时，将其显示成错误信息<br>
	* 4) editableFun 函数原型 Function(value,obj) 决定当前单元格是否可以编辑，如果返回值为true 则可以编辑。否则不可以编辑
	*  默认值为返回 function(){return true};
	* @example 
	* //数字编辑器，并附加验证
	* { title: '总花费', sortable: true,  dataIndex: 'TotalCost',editor:{type:'number',validator:function(value,obj){
	*		if(value > 100){
	*			return '总花费不大于100';
	*		}
	*	}}
	* }
	* //下拉列表编辑器
	* { title: '选择', sortable: true,  dataIndex: 'check',editor:{type:'select',items:[{name:'选择1',value:'1'},{name:'选择2',value:'2'}]}}
	* @see KISSY.LP.Grid
	*/
	function EditGrid(config) {
		EditGrid.superclass.constructor.call(this, config);
	}

	S.extend(EditGrid, Grid, 
	/** @lends S.LP.EditGrid.prototype */	
	{
		/**
		* 清除错误，如果还处于编辑状态，则取消编辑状态
		*/
		clearError : function(){
			var _self = this;//,
				//result = false,
				//showError = _self.get('showError');
				
			_self.cancelEdit();
		},
		/**
		* 取消编辑状态，隐藏所有的编辑器，无论是否当前编辑器内的数据通过验证
		*/
		cancelEdit : function(){
			var _self = this,
				columns = _self.get('columns');
			S.each(columns,function(column){
					var editor = column.editor;
				if(editor && !editor.isHide()){
					editor.hide();
				}
			});
		},
		/**
		* 是否包含错误
		*/
		hasError : function(){
			var _self = this,
				result = false,
				showError = _self.get('showError'),
				columns = null,
				tbody = null;
			if(showError){
				tbody = _self.get('tbody');
				result = !! S.one(tbody).one('.' + CLS_CELL_ERROR);
			}
			if(!result){
				columns = _self.get('columns');
				S.each(columns,function(column){
					var editor = column.editor;
					if(editor && !editor.isHide() && editor.hasError()){
						result = true;
						return false;
					}
				});
			}
			return result;
		},
		/**
		* 设置单元格进入编辑状态
		* @param {Object} record 编辑的记录
		* @param {String} field 编辑的字段
		*/
		setCellToEdit : function(record,field){
			var _self = this,
				column = _self._getColumn(field),
				cell = null,
				editor = null;
			if(column){
				cell = _self._getCell(record,column.id);
				editor = _self._getEditor(field);
			}
			if(DOM.hasClass(cell,CLS_CELL_EDITABLE)){
				_self._showEditor(editor,cell, record[field],record);
			}
		},
		//初始化编辑事件
		_attachEditEvent : function(column){
			var _self = this,
				editor = column.editor;
			editor.on('change',_self._getChangeEvent(column));

			editor.on('hide',function(event){
				_self.set('editRecord',null);
				_self.set('editor',null);
			});

			editor.on('next',_self._getNextEvent(column));
		},
		//编辑下一个单元格
		_getNextEvent : function(column){
			var _self = this;
			return function(event){
				var record = event.record,
					field = column.dataIndex,
					nextCellInfo = _self._getNextEditCellInfo(record,field),
					nextCell = nextCellInfo.cell,
					field = nextCellInfo.field,
					record = nextCellInfo.record,
					editor = null;
				if(nextCell && DOM.hasClass(nextCell,CLS_CELL_EDITABLE)){
					editor = _self._getEditor(field);
					_self._showEditor(editor,nextCell, record[field],record);
				}
			};
		},
		//获取下一个编辑的单元格
		_getNextEditCellInfo : function(record,field){
			var _self = this,
				cell = null,
				beginField = field,
				nextColumn = null;
			while(record && (!cell || !_self._isEditableCell(cell))){
				nextColumn = _self._getNextEditColumn(beginField);
				if(nextColumn){
					cell = _self._getCell(record,nextColumn.id);
					beginField = nextColumn.dataIndex;
				}else{
					record = _self._getNextRecord(record);
					beginField = null;
				}
			}
			return {cell : cell,field :beginField,record : record};
		},
		//获取下一个可编辑的字段
		_getNextEditColumn : function(field){
			var _self = this,
				columns = _self.get('columns'),
				index = -1,
				count = columns.length,
				result = null;
			//指定字段时，从字段位置开始往后遍历
			if(field){
				//查找字段所在列的索引
				for(var i = 0; i < count; i++){
					if(columns[i].dataIndex === field){
						index = i;
						break;
					}
				}
			}
			//向后查找可编辑的字段
			for(var i = index + 1 ;i < count; i++){
				if(columns[i].editor){
					result = columns[i];
					break;
				}
			}
			return result;

		},
		//获取吓一跳记录
		_getNextRecord : function(record){
			var _self = this,
				store = _self.get('store');
			return store.findNextRecord(record);
		},
		//数据改变触发的事件
		_getChangeEvent : function(column){
			var _self = this;
			return function(event){
				var value = event.value,
					record = event.record,
					field = column.dataIndex,
					store = _self.get('store');
				if(record[field] !== value){
					store.setValue(record, field, value);
				}
			};
		},
		//展示错误信息
		_addError : function (cell, msg) {
			var innerEl = cell.one('.' + CLS_GRID_CELL_INNER),
				errorEl = cell.one('.' + CLS_CELL_ERROR_ICON),
				temp = ['<span class="', CLS_CELL_ERROR_ICON, '" title="', msg, '"></span>'].join('');
			if(!errorEl){
				innerEl.addClass(CLS_CELL_ERROR);
				errorEl = new Node(temp).appendTo(innerEl);
			}else{
				errorEl.attr('title',msg);
			}
		},
		//清除错误
		_clearError : function(cell){
			var innerEl = cell.one('.' + CLS_GRID_CELL_INNER),
				errorEl = cell.one('.' + CLS_CELL_ERROR_ICON);
			innerEl.removeClass(CLS_CELL_ERROR);
			if(errorEl){
				errorEl.remove();
			}
		},
		//清除脏数据显示标志
		_clearDirtyIcons : function(){
			var _self = this,
				tbody = _self.get('tbody');
			S.all('.'+CLS_DIRTY_CELL,tbody).removeClass(CLS_DIRTY_CELL);
		},
		//获取编辑器
		_getEditor : function (field) {
			var _self = this,
				columns = _self.get('columns'),
				editor = null;
			S.each(columns, function(column){
				if(column.dataIndex === field){
					editor = column.editor; 
					return false;
				}
			});
			return editor;
		},
		//获取单元格的模版/**/
		_getCellTemplate : function (colindex, column, text,value,obj) {
			var _self = this,
				dataIndex = column.dataIndex,
				width = column.width,
				tipText = _self._getShowTip(column,value,obj, true),//column.showTip ? 'title = "' + (value||'') + '"' : '',
				hideText = column.hide ? CLS_HIDDEN : '',
				editor = column.editor,
				eitable = editor ? (editor.editableFun && !editor.editableFun(value,obj) ? '' : CLS_CELL_EDITABLE) : '',
                editIcon = eitable ? '<span class="x-icon x-icon-mini x-icon-success ' + CLS_CELL_EDIT_ICON + '"><i class="icon-ok icon-white icon-pencil"></i></span>' :'',
				showError = _self.get('showError'),
				validText = showError ? (editor && editor.getError(value,obj)): '',
				errorText = validText ?  '<span class="' + CLS_CELL_ERROR_ICON + ' x-icon x-icon-mini x-icon-error" title="' + validText + '">×</span>' : '',
				errorCls =  validText ? CLS_CELL_ERROR : '',
				template = ['<td  class="grid-body-cell grid-body-td-', column.id, ' ', hideText, ' ', eitable ,'" data-column-name="', column.id, '" colindex="', colindex, '" data-column-field = "' , dataIndex , '" width="', width, 'px">',
						'<div class="',CLS_GRID_CELL_INNER,' ', errorCls ,'" style="width : ', width, 'px"><span class="', CLS_CELL_TEXT, ' " ' , tipText, '>', text, '</span>', errorText,editIcon, '</div></td>'].join('');
			return template;
		},
		//获取行数据
		_getRowDataByCell : function (cell){
			var _self = this,
				row = _self._findRow(cell),
				obj = DOM.data(row, DATA_ELEMENT);
			return obj;
		},
		//获取单元格上文本信息
		_getCellValue : function (cell, field) {
			var _self = this,
				row = _self._findRow(cell),
				obj = DOM.data(row, DATA_ELEMENT),
				value = obj ? obj[field] : null;
			return value;
		},
		_hasEditor : function (field) {
			return this.hasAttr(KEY_COLUMN_PREFIX + field);
		},
		_hideEditor : function (editor) {
			editor.css({visibility : 'hidden', left : -10000, top : -10000});
		},
		_isEditableCell : function(cell){
			return DOM.hasClass(cell,CLS_CELL_EDITABLE);
		},
		//初始化
		_init : function () {
			EditGrid.superclass._init.call(this);
			var _self = this,
				columns = _self.get('columns');
			S.each(columns, function (column) {
				var editor = column.editor,
					Cls = null;
				if (!editor || editor.isEditor) {
					return;
				}
				Cls = gridEditor.types[editor.type||'text'];
				column.editor = new Cls(editor);
				_self._attachEditEvent(column);
			});
		},
		//初始化事件
		_initEvent : function(){
			var _self = this;
			S.Event.on(doc,'click',function(event){
				var editor = _self.get('editor'),
					sender = event.target,
					cell = _self._findCell(event.target);
				if(!cell && editor && !editor.isHide() && !editor.hasError() && !editor.isContains(sender)){
					editor.hide();
				}
			});/**/
			_self.constructor.superclass._initEvent.call(_self);
		},
		//初始化数据事件
		_initDataEvent : function () {

			var _self = this,
				store = _self.get('store');
			//更新记录
			store.on('updaterecord', function (event) {
				var record = event.record;
				_self._setRowValue(record,event.field);
			});
			//移除数据时，隐藏编辑器
			_self.on('rowremoved',function(event){
				var record = _self.get('editRecord'),
					editor = _self.get('editor');
				if(record && editor){
					if(record === event.data && !editor.isHide()){
						editor.hide();
					}
				}
			});
			//清除编辑痕迹
			store.on('acceptchanges', function (event) {
				_self._clearDirtyIcons();
			});
			
			_self.constructor.superclass._initDataEvent.call(this);
		},
		//点击行事件，决定是否显示编辑器
		_rowClickEvent : function (target) {
			var _self = this,
				cell = _self._findCell(target),
				field = null,
				editor = null,
				formerEditor = null,
				result = null,
				record = null;
			if (cell) {
				field = DOM.attr(cell, ATTR_COLUMN_FIELD);
				editor = _self._getEditor(field);
				formerEditor = _self.get('editor');
				if(formerEditor && formerEditor !== editor){
					if(!formerEditor.isHide() && !formerEditor.hasError()){
						formerEditor.hide();
					}
				}
				if (field && editor) {
					
					if(!editor.isHide() && editor.hasError()){
						editor._focus();
						return;
					}
					record = _self._getRowDataByCell(cell);
					if(record){
						//验证是否可以编辑，如果不可编辑则不显示编辑器
						if(!_self._isEditableCell(cell))
						{
							return ;
						}
						result =_self.fire('beforeedit',{cell : cell , field : field , data : record,editor:editor});
						if(result !== false){
							
							_self._showEditor(editor,cell, record[field],record);
						}
					}
					return;
				}
			}
			_self.constructor.superclass._rowClickEvent.call(this, target);
		},
		//设置行的值
		_setRowValue : function (obj,changeField) {
			var _self = this,
				row = _self._findRowByRecord(obj),
				columns = _self.get('columns');
			if (row) {
				S.each(columns, function (column) {
					var field = column.dataIndex,
						id = column.id,
						cls = PREFIX_CLS_CELL + id,
						cell = S.one('.' + cls, row),
						textEl = cell.one('.' + CLS_CELL_TEXT),
						editor = column.editor,
						validText = editor && editor.getError(obj[field],obj),
						text = null,
						showError = _self.get('showError');
					
					if (textEl) {
                        if(changeField === field){
                            cell.addClass(CLS_DIRTY_CELL);
                        }
						text = _self._getRenderText(column,obj[field],obj);
						text = text === undefined ? '' : text;
						textEl.html(text);
						if(column.showTip){
							textEl.attr('title', _self._getShowTip(column, obj[field], obj, false));
						}
						if(!showError){
							return;
						}
						if(validText){
							_self._addError(cell,validText);
						}else{
							_self._clearError(cell);
						}
					}
				});
			}
		},
		//显示编辑器
		_showEditor : function (editor,cell, value,record) {
			var _self = this,
				offset = DOM.offset(cell),
				inner = DOM.get('.' + CLS_GRID_CELL_INNER,cell),
                width = DOM.width(inner),
				height = DOM.height(inner),
				preEditor = _self.get('editor');
				
			
			if(preEditor && !preEditor.isHide() && !preEditor.hasError()){
				preEditor.hide();
			}
			_self.set('editRecord',record);
			_self.set('editor',editor);
			if( UA.ie === 6){
				editor.setWidth(width - 12);
			}else{
				editor.setWidth(width - 10);
			}
			//editor.setHeight(height - 2);
			editor.setValue(value,record);
			//editor.show(offset);
			editor.show({container:inner,left:0,top:2});
		}
	});

	function gridEditor(config){
		var _self = this;
		config = S.merge({isEditor:true},config);
		S.mix(_self,config);
		gridEditor.superclass.constructor.call(_self, config);
		_self._init();
		_self.events = ['beforechange','change'];
	}

	S.extend(gridEditor, S.Base);
	S.augment(gridEditor,{
		/**
		* 触发改变的事件
		*/
		CHANGE_EVENT : 'blur',
		/**
		* 初始化值
		*/
		INIT_VALUE : '',
		/**
		* 重写 S.Base 的set 方法，默认设置时不触发事件
		* @protect
		*/
		set:function(key,value){
			gridEditor.superclass.set.call(this,key,value,{silent:1});
		},
		hasError : function(){
			var _self = this,
				el = _self.get('el');
			return el.hasClass(CLS_EDITOR_ERROR);
		},
		/**
		* 隐藏编辑器
		*/
		hide : function(){
			var _self = this,
				el = _self.get('el');
			_self._clearError();
			el.css({visibility : 'hidden', left : -10000, top : -10000});
			_self.fire('hide',{record : _self.get('record'),editor : _self});
			//隐藏数据前清空数据
			_self._setValue(_self.INIT_VALUE);
			S.one('body').append(el);
		},
		/**
		* 获取值
		* @return {Object} 任意类型的数据，可能为空
		*/
		getValue : function(){
			var _self = this,
				editEl = _self.get('editEl');
			
			return editEl ? _self._getValue() : _self.INIT_VALUE;
		},
		/**是否隐藏*/
		isHide : function(){
			var _self = this,
				el = _self.get('el');
			return el.css('visibility') === 'hidden';
		},
		/**
		* 是否包含元素
		*/
		isContains : function(element){
			var _self = this,
				el = _self.get('el');
			return el.contains(element);
		},
		/**
		* 设置值
		*/
		setValue : function(value,record){
			var _self = this,
				editEl = _self.get('editEl');

			_self.set('record',record);
			if(editEl){
				_self._setValue(value);
				_self._validate(value,record);
			}
		},
		/**
		* 显示编辑器
		* @param {Object} offset 相对页面的位置
		* @param {Number} offset.left 相对页面的 left位置
		* @param {Number} offset.top 相对页面的 top 位置
		*/
		show : function(offset){
			var _self = this,
				el = _self.get('el'),
				container = offset.container;
			if(container){
				S.one(container).append(el);
			}
			el.css({visibility : 'visible', left : offset.left, top : offset.top});
			_self._focus();
			_self.fire('show',{record : _self.get('record'),editor : _self});
		},
		/**
		* 设置编辑器宽度
		* @param {Number} width 编辑器宽度
		*/
		setWidth : function(width){
			var _self = this,
				editEl = _self.get('editEl');
			editEl.width(width);
		},
		/**
		* 设置编辑器宽度
		* @param {Number} height 编辑器高度
		*/
		setHeight :function(height){
			var _self = this,
				editEl = _self.get('editEl');
			editEl.height(height);
		},
		//基本的验证
		_basicValidator : function(value,obj){
			var _self = this;
			if(_self.required && (value === undefined || value ===null || S.trim(value.toString()) === '')){
				return '不能为空';
			}
			return '';
		},
		//基本的格式化
		_basicFormat : function(value){
			if(value === undefined || S.trim(value.toString()) === ''){
				return undefined;
			} 
			return value;
		},
		//清除错误信息
		_clearError : function(){
			var _self = this,
				el = _self.get('el'),
				errorEl = el.one('.'+CLS_EDITOR_ERROR_ICON);
			el.removeClass(CLS_EDITOR_ERROR);
			errorEl.attr('title','');
		},
		//编辑器设置焦点
		_focus : function(){
			var _self = this,
				editEl = _self.get('editEl');
			editEl[0].focus();
		},
		//获取编辑器的模版
		_getTemplate : function(){
			var temp = ['<input type="text" name=""autocomplete="off" size="20" class="control-text lp-editor-field">'].join('');
				
			return temp;
		},
        //获取错误icon的模板
        _getErrorIconTpl : function(){
            return '<span class="x-icon ' + CLS_EDITOR_ERROR_ICON + ' x-icon-mini x-icon-error">×</span>';
        },
		//获取输入文本的区域
		_getEditElemnt : function(){
			var _self = this,
				el = _self.get('el');/*,
				children = el.children();
			if(children.length){
				return S.one(children[0]);
			}*/
			return S.one(el[0].firstChild);
		},
		_getValue : function(editElemnt){
			var _self = this;
			editElemnt = editElemnt || _self.get('editEl');

			return editElemnt.val();
		},
		//初始化
		_init : function(){
			var _self = this;
			_self._initDom();
			_self._initPreventEvent();
			_self._initEvent();
			_self._initKeyEvent();

		},
		//初始化Dom
		_initDom : function(){
			var _self = this,
				el = null,
				editEl = null,
				temp = ['<div class="grid-editor" style="position : absolute; z-index : 1000; visibility : hidden; left : -10000px; top : -10000px; overflow : auto;">',_self._getTemplate(),_self._getErrorIconTpl(),'</div>'].join(''),
				container = _self.get('container') || DOM.get('body');
			el = new Node(temp).appendTo(container);
			

			_self.set('container',container);
			_self.set('el',el);

			editEl = _self._getEditElemnt();
			_self.set('editEl',editEl);

		},
		//初始化事件
		_initEvent : function(){
			var _self = this,
				el = _self.get('el'),
				editEl = _self.get('editEl');
			
			el.on('click',function(event){
				event.stopPropagation();
			});
			editEl.on(_self.CHANGE_EVENT,function(event){
				if(!_self.isHide()){
					var sender = S.one(this),
						valid = _self._valueChange(sender);
					if (!valid) {
						event.preventDefault();
					}
				}
			});
		},
		//阻止冒泡
		_initPreventEvent : function(){
			var _self = this,
				el = _self.get('el');
				
			el.on('click',function(event){
				event.stopPropagation();
			});
		},
		_initKeyEvent : function(){
			var _self = this,
				editEl = _self.get('editEl');

			editEl.on('keydown',function(event){
				var keyCode = event.keyCode;
				switch(keyCode){
					case KEY_ENTER_CODE :
						_self._keyEnterEvent(editEl);
						break;
					case KEY_ESC_CODE :
					
						_self._keyCancelEditEvent();
						break;
					case KEY_TAB_CODE :
						event.halt();
						_self._keyTabEvent(editEl);
						break;
					default:
						break;
				}
			});
		},
		//按下确定键，编辑完成
		_keyEnterEvent : function(editEl){
			this._completeEdit(editEl);
		},
		//按下esc键取消编辑
		_keyCancelEditEvent : function(){
			var _self = this;
			_self.hide();

		},
		//按下Tab键进入下一个编辑
		_keyTabEvent : function(editEl){
			var _self = this,
				valid = _self._completeEdit(editEl);
			if(valid){
				_self.fire('next',{record : _self.get('record')});
			}
		},
		//完成编辑
		_completeEdit : function(editEl){
			var _self = this,
				valid = _self._valueChange(editEl);
			if(valid){
				_self.hide();
			}
			return valid;
		},
		//值改变后，返回验证结果
		_valueChange : function(sender,value){
			var _self = this,
				record = _self.get('record'),
				valid = null;
			value = value || _self._getValue(sender);
			valid = _self._validate(value,record);
			value = _self._basicFormat(value);
			value = _self.format ? _self.format(value) : value;
			if (valid) {
				_self.fire('change',{value : value,record : record});
				return true;
			}
			return false;
		},
		//设置错误
		_setError : function(msg){
			var _self = this,
				el = _self.get('el'),
				errorEl = el.one('.'+CLS_EDITOR_ERROR_ICON);
			el.addClass(CLS_EDITOR_ERROR);
			errorEl.attr('title',msg);
		},
		_setValue : function(value,editElemnt){
			var _self = this;
			editElemnt = editElemnt || _self.get('editEl');
			editElemnt.val(value);
		},
		//验证数据返回错误
		getError : function(value,obj){
			return this._basicValidator(value) || (this.validator && this.validator(value,obj));;
		},
		//验证编辑器
		_validate : function(value,obj){
			var _self = this,
				errorText = null,
				valid = true;
			errorText = _self.getError(value,obj);//_basicValidator(value) || (_self.validator && _self.validator(value,obj));
			valid = errorText ? false : true ;
			if(valid){
				_self._clearError();
			}else{
				_self._setError(errorText);
			}
			return valid;
		},
		destroy : function(){
			var _self = this,
				el = _self.get('el');
			
			el.remove();
			_self.detach();
			_self.__attrVals = {};
		}
	});

	
	function textGridEditor(config){
		textGridEditor.superclass.constructor.call(this, config);
	}
	S.extend(textGridEditor, gridEditor);
	S.augment(textGridEditor, {
		_basicFormat : function(value){
			if(value){
				value =  value.replace(/</g,'&lt;').replace(/>/,'&gt;').replace(/\"/,'&quot;');
				
			}
			
			return value;
		},
		_setValue : function(value,editElemnt){
			if(value){
				value =  value.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"');
			}
			this.constructor.superclass._setValue.call(this,value,editElemnt);
		}
	});

	function numberGridEditor(config){
		numberGridEditor.superclass.constructor.call(this, config);
	}
	S.extend(numberGridEditor, gridEditor);
	S.augment(numberGridEditor, {
		_basicFormat : function(value){
			if(value === undefined || S.trim(value.toString()) === ''){
				return undefined;
			} 
			return parseFloat(value);
		},
		_basicValidator : function(value){
			var validText = this.constructor.superclass._basicValidator.call(this,value);
			if(!validText && value && isNaN(value)){
				validText = '请输入数字';
			}
			return validText;
		}
	});
	
	/**
	* checkBox 编辑器
	*/
	function checkGridEditor(config){
		checkGridEditor.superclass.constructor.call(this, config);
	}
	S.extend(checkGridEditor, gridEditor);
	S.augment(checkGridEditor,{
		CHANGE_EVENT : 'change',
		INIT_VALUE : false,
		setHeight :function(height){
			return ;
		},
		//获取编辑器的模版
		_getTemplate : function(){
			var temp = ['<input type="checkbox" name="" class="lp-form-checkbox-field lp-editor-field">'].join('');
			return temp;
		},
		_getValue : function(editElemnt){
			editElemnt = editElemnt || this.get('editEl');
			var checked = editElemnt.attr('checked');

			return checked ? true : false;
		},
		_setValue : function(value,editElemnt){
			var _self = this;
			editElemnt = editElemnt || _self.get('editEl');
			editElemnt.attr('checked', value);
		}
	});

	//下拉选择框
	function selectGridEditor(config){
		selectGridEditor.superclass.constructor.call(this, config);
	}
	S.extend(selectGridEditor, gridEditor);
	S.augment(selectGridEditor,{
		
       
		//覆盖设置高度
		setWidth :function(width){
			this.constructor.superclass.setWidth.call(this,width + 9);
		},
		_getTemplate : function(){
            var temp = [ '<select class="lp-form-select-field lp-editor-field" tabindex="1" id="sel',S.guid(),'" ></select>'].join('');
               
            return temp;
        },
       
		_initDom : function(){
			this.constructor.superclass._initDom.call(this);

			var _self = this,
				editEl = _self.get('editEl'),
				items = _self.items,
				id = null;
			if(!_self.required){
				_self._createItem('请选择',_self.INIT_VALUE, editEl);
			}
			if(S.isArray(items)){
				S.each(items,function(item){
					_self._createItem(item.name, item.value, editEl);
				});	
			}else{
				for(id in items){
					if(items.hasOwnProperty(id)){
						_self._createItem(items[id],id,  editEl);
					}
				}
			}
		},
		_createItem : function(name,value,container){
			var temp = '<option value="' + value + '">' + name + '</option>';
			new Node(temp).appendTo(container);
		}
	});

	//日期选择器
	function dateGridEditor(config){
		dateGridEditor.superclass.constructor.call(this, config);
	}
	S.extend(dateGridEditor, gridEditor);
	S.augment(dateGridEditor,{
		CHANGE_EVENT : 'change',
		_basicValidator : function(value){
			var _self = this;
				validText = this.constructor.superclass._basicValidator.call(this,value);
			if(!validText && value && !_self._isDate(value)){
				validText = '不是有效的日期格式！';
			}
			return validText;
		},
		
		//验证是否日期
		_isDate : function(value){
			if(S.isNumber(value)){
				return true;
			}
			if(S.isString(value)){
				value = Date.parse(value.replace(/-/g,'/'));
			}
			return S.isNumber(value) && !isNaN(value);
		},
		//验证编辑器
		_validate : function(value,obj){
			var _self = this,
				errorText = null,
				valid = true;
			errorText = _self._basicValidator(value) || (_self.validator && _self.validator(_self._basicFormat(value),obj));
			valid = errorText ? false : true ;
			if(valid){
				_self._clearError();
			}else{
				_self._setError(errorText);
			}
			return valid;
		},
		//是否包含此元素
		isContains : function(element){
			var _self = this;
				
			return _self.constructor.superclass.isContains.call(this,element) || S.one(element).parent('.ks-cal-box');
		},
		//隐藏，如果日期控件仍然处于显示状态，同时隐藏
		hide : function(){
			var _self = this,
				datepicker = _self.get('datepicker');
			datepicker.hide();
			_self.constructor.superclass.hide.call(this);
			
		},
		//覆盖设置宽度的函数
		setHeight : function(){
			return;
		},
		//覆盖设置高度
		setWidth :function(width){
			this.constructor.superclass.setWidth.call(this,width - 6);
		},
		//最基本的格式化函数，将文本转换成日期
		_basicFormat : function(value){
			if(S.isString(value)){
				value = value.replace(/-/g,'/');
			}
			return new Date(value).getTime();
		},
		//获取模板
		_getTemplate : function(){
            var temp = ['<input type="text" name=""autocomplete="off" size="20" style="height:18px" class="control-text lp-editor-field">'].join('');
                
            return temp;
        },
		_init : function(){
			var _self = this;
			if(_self.showTime){
				//_self.CHANGE_EVENT = 'timeSelect';
			}
			S.use('lpassert/calendar',function(S,Calendar){
				_self.set('Calendar',Calendar);
				_self.constructor.superclass._init.call(_self);
			});
			
		},
		_initDom : function(){
			this.constructor.superclass._initDom.call(this);

			var _self = this,
				editEl = _self.get('editEl'),
				Calendar = _self.get('Calendar'),
				id = 'grid-date'+S.guid(),
				datepicker = null;
			editEl.attr('id',id);

			datepicker =new Calendar([
				{selector:'#'+id , showTime : _self.showTime,allowEdit : true}
			]);

			_self.set('datepicker',datepicker['#'+id]);
			
		},
		_setValue : function(value,editElement){
			var _self = this,
				valueText = _self.showTime ? S.LP.Format.datetimeRenderer(value) : S.LP.Format.dateRenderer(value),
				datepicker = _self.get('datepicker');
				
				editElement = editElement || _self.get('editEl');
				editElement.val(valueText);
			if(value && value !== _self.INIT_VALUE){
				datepicker.render({selected : new Date(value),date : new Date(value)});
			}
		}
	});

	function multipleSelectEditor(config){
		multipleSelectEditor.superclass.constructor.call(this, config);
	}

	S.extend(multipleSelectEditor, gridEditor);
	S.augment(multipleSelectEditor,{
		//隐藏，如果选择器仍然处于显示状态，同时隐藏
		hide : function(){
			var _self = this;
			if(_self._isSelectShow()){
				_self._hideSelect();
			}

			_self.constructor.superclass.hide.call(this);
			
		},
		//是否包含此元素
		isContains : function(element){
			var _self = this;
				
			return _self.constructor.superclass.isContains.call(this,element) || S.one(element).parent('.lp-multiple-wrap');
		},
		//设置值，覆盖父类，当value 为 undefined 时，用空数组代替
		setValue : function(value,record){
			var _self = this;
			value = value || [];
			_self.constructor.superclass.setValue.call(this,value,record);
		},
		//阻止设置高度
		setHeight : function(){
			return;
		},
		//创建元素
		_createItem : function(text,value,container){
			var temp = '<li class="multiple-item"> <input class="multiple-item-checkbox"  type="checkbox" name="' + value + '" />' + text + '</li>';
			new Node(temp).appendTo(container);
		},
		//获取选择器的坐标
		_getSelectOffset : function(){
			var _self = this,
				editEl = _self.get('editEl'),
				offset = editEl.offset();
			offset.top += editEl.height() + 2;
			return offset;
		},
		_getText : function(value){
			var _self = this,
				items = _self.items,
				renderer = _self.get('renderer');
			
			value = value || _self._getValue();
			if(!renderer){
				renderer = S.LP.Format.multipleItemsRenderer(items);
				_self.set('renderer',renderer);
			}

			return renderer(value);
		},
		//选择选中的值
		_getValue : function(){
			var _self = this,
				results = [],
				listEl = _self.get('listEl'),
				checks = listEl.all('.multiple-item-checkbox');
			S.each(checks,function(checkbox){
				if(checkbox.checked){
					results.push(checkbox.name);
				}
			});

			return results;	
		},
		//模板
		_getTemplate : function(){
			var temp = ['<input type="text" readonly = "true" name=""autocomplete="off" size="20" class="lp-form-multiple-field control-text lp-editor-field" >'].join('');
			return temp;
		},
		//隐藏选择器
		_hideSelect : function(){
			var _self = this,
				selectEl = _self.get('selectEl');
			selectEl.css({visibility : 'hidden', left : -10000, top : -10000});
		},
		//选择器是否显示
		_isSelectShow : function(){
			var _self = this,
				selectEl = _self.get('selectEl');
			return	selectEl.css('visibility') !== 'hidden' && selectEl.width() !== 0;
		},
		//初始化选择列表
		_initDom : function(Calendar){
			this.constructor.superclass._initDom.call(this);

			var _self = this,
				//editEl = _self.get('editEl'),
				items = _self.get('items'),
				temp = '<div class="lp-multiple-wrap"  style="position : absolute; z-index : 1200; visibility : hidden; left : -10000px; top : -10000px; overflow : auto;"><ul class="multiple-list ks-clear"></ul><div class="multiple-footer" style="text-align:center"><span class="x-btn x-btn-default-small"><button class="button button-small" autocomplete="off" hidefocus="true" type="button"><span class="x-btn-inner">确认</span></button></span></div></div>',
				wraperEl = new Node(temp).appendTo('body'),
				listEl = wraperEl.one('.multiple-list'),
				btnEl =  wraperEl.one('button'),
				id = null;
			_self.set('selectEl',wraperEl);
			_self.set('listEl',listEl);
			_self.set('btnEl',btnEl);
			
			if(S.isArray(items)){
				S.each(items,function(item){
					_self._createItem(item.name, item.value, listEl);
				});	
			}else{
				for(id in items){
					if(items.hasOwnProperty(id)){
						_self._createItem(items[id],id,  listEl);
					}
				}
			}
		},		
		//初始化事件，当点击确定时，获取选中的值
		_initEvent : function(){
			var _self = this,
				listEl = _self.get('listEl'),
				editEl = _self.get('editEl'),
				btnEl = _self.get('btnEl');
			
			
			editEl.on('click',function(event){
				event.stopPropagation();

				_self._toggleSelect();
			});
			listEl.on('click',function(event){
				event.stopPropagation();
			});
			btnEl.on('click',function(event){
				event.stopPropagation();

				var value = _self.getValue();
				_self._setText( _self._getText(value));
				_self._hideSelect();
				_self._valueChange(editEl,value);
			});

			
		},
		//设置输入框的文本
		_setText : function(text){
			var _self = this,
				editEl = _self.get('editEl');
			editEl.val(text);
		},
		//设置选择器选中的选项
		_setSelectValue : function(value){
			var _self = this,
				listEl = _self.get('listEl'),
				checks = listEl.all('.multiple-item-checkbox'),
				selectChecks = null;
			checks.attr('checked',false);
			selectChecks = S.filter(checks,function(checkbox){
				return S.inArray(checkbox.name,value);
			});

			S.all(selectChecks).attr('checked','checked');
		},
		//设置编辑器值，覆盖父类
		_setValue : function(value){
			var _self = this,
				text = _self._getText(value);
			_self._setText(text);
			_self._setSelectValue(value);
		},
		//显示选择器
		_showSelect : function(offset){
			var _self = this,
				selectEl = _self.get('selectEl');
			
			offset = offset || _self._getSelectOffset();
			selectEl.css({visibility : 'visible', left : offset.left, top : offset.top});
		},
		//交替显示隐藏选择器
		_toggleSelect : function(){
			var _self = this;
			if(_self._isSelectShow()){
				_self._hideSelect();
			}else{
				_self._showSelect();
			}
		}
	});


	gridEditor.types = {
		text : textGridEditor,
		number : numberGridEditor,
		check : checkGridEditor,
		select : selectGridEditor,
		date : dateGridEditor,
		multipleSelect : multipleSelectEditor
	};

	S.namespace('LP');

	
	S.LP.Grid = Grid;

	S.LP.EditGrid = EditGrid;
}, {
    requires : ['core', './uicommon','./bar']
});