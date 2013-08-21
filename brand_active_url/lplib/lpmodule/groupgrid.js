/** 
* @fileOverview GroupGrid 分组表格
* @author  fuzheng
* @version 2.0
*/
KISSY.add(function(S){
    /**
        @exports S.LP as KISSY.LP
	*/
	var DOM = S.DOM,
		Event = S.Event
        Node = S.Node,

		//Grid 常量	
		CLS_GRID_CELL = 'grid-body-cell',
		CLS_GRID_ROW_SELECTED = 'grid-row-selected',
		CLS_GRID_CELL_INNER = 'grid-body-cell-inner',
		DATA_ELEMENT = 'row-element',
		CLS_CHECKBOX = 'grid-checkbox',
		
		CLS_GRID_GROUP_ROW = 'grid-group-row',
		CLS_GRID_GROUP_ROW_FIRST = 'grid-group-row-first',
		CLS_GRID_GROUP_CELL = 'grid-group-cell',
		CLS_GRID_GROUP_TITLE = 'grid-group-title',
		CLS_GRID_GROUP_TEXT = 'grid-group-text',
		DATA_GROUP_ROW = 'groupRowData',
		CLS_GROUP_ROW_SELECTED = 'grid-group-selected';


	/**
	* GroupGrid 分组表格
	* @memberOf S.LP
	* @description 在数据结构不改变的基础上，对表格数据进行分组
	* @class GroupGrid 分组表格 继承于Grid
	* @param {Object} config 配置项 拥有所有Grid的配置项
	*/
	function GroupGrid(config){
		var _self = this;
		config = config || {};
		config = S.merge(GroupGrid.config, config);
		GroupGrid.superclass.constructor.call(_self, config);
		//支持的事件
		_self.events = [
			/**  
			* 分组行点击事件
			* @name S.LP.GroupGrid#grouprowclick
			* @event  
			* @param {event} e  事件对象
			* @param {Object} e.row  点击行的dom
			* @param {Object} e.data  行所携带的数据
			*/
			'grouprowclick',
			/**  
			* 分组行新建完成后 触发此事件（此事的行上所携带的数据为空）
			* @name S.LP.GroupGrid#grouprowcreated
			* @event  
			* @param {event} e  事件对象
			* @param {Object} e.row  新建行的dom
			*/
			'grouprowcreated',
			/**  
			* 分组行选中事件
			* @name S.LP.GroupGrid#grouprowselected
			* @event  
			* @param {event} e  事件对象
			* @param {Object} e.row  行对象
			* @param {Object} e.data  行上的数据
			*/
			'grouprowselected',
			/**  
			* 分组行取消选中事件
			* @name S.LP.GroupGrid#grouprowunselected 
			* @event  
			* @param {event} e  事件对象
			* @param {Object} e.row  行对象
			* @param {Object} e.data  行上的数据
			*/
			'grouprowunselected',
			/**  
			* 分组行选中状态改变事件
			* @name S.LP.GroupGrid#grouprowselectchanged 
			* @event  
			* @param {event} e  事件对象
			* @param {Object} e.row  行对象
			* @param {Object} e.data  行上的数据
			* @param {Boolean} e.selected  改变后的选中状态
			*/
			'grouprowselectchanged'
		];
		_self._initGroupGrid();
	}
	GroupGrid.config = 
	/** @lends  S.LP.GroupGrid.prototype */		
	{
		/**
		* 分组表格需要分组的数据 (必填)
		*	title : 字段标题(String)（必填）<br>
		*	dataIndex : 字段数据的key(String)（必填）<br>
		*	renderer(value, obj) : 自定义渲染方法(Function)<br>
		* @field
		* @type Array
		*/
		groupColumns: [],
		/**
		* 分组依据字段 (选填)
		* @field
		* @type String
		* @default groupColumns[0].dataIndex
		*/
		groupIndex: null
	};
	S.extend(GroupGrid, S.LP.Grid);
	S.augment(GroupGrid, 
	/** @lends  S.LP.GroupGrid.prototype */		
	{
		// 初始化分组表格
		_initGroupGrid: function(){
			var _self = this,
				groupColumns = _self.get('groupColumns');
			if(S.isEmptyObject(groupColumns)){
				return;
			}
			_self._initGroupManager();
			_self._initGroupEvent();
		},
		// 初始化分组管理器
		_initGroupManager: function(){
			var _self = this,
				groupColumns = _self.get('groupColumns'),
				groupIndex = _self.get('groupIndex'),
				groupManager = {
					columns: {},
					rowTemp: null,
					index:  groupIndex || groupColumns[0].dataIndex
				};
			
			S.each(groupColumns, function(groupColumn){
				var groupObj = {};
				groupObj.value = '';
				groupObj.title = groupColumn.title;
				groupObj.renderer = groupColumn.renderer || null;

				groupManager.columns[groupColumn.dataIndex] = groupObj;
			});

			_self.set('groupManager', groupManager);
		},
		// 初始化事件
		_initGroupEvent: function(){
			var _self = this;
			// 给新创建的分组行 绑定点击事件
			_self.on('grouprowcreated', function(e){
				Event.on(e.row, 'click', function(ev){
					_self._groupRowClick(ev.target);
				});
			});
			// 分组行选中状态改变时事件
			_self.on('grouprowselectchanged', function(e){
				_self._groupRowSelect(e.row, e.data, e.selected);
			});
			// 每次加载都重新初始化 groupManager
			_self.on('beginshow', function(){
				_self._initGroupManager();
			});
		},

		// 重写Grid方法 - 创建行
		_createRow : function (element, index) {
			var _self = this,
				body = _self.get('tbody'),
				rowTemplate,
				rowEl,
				dom,
				lastChild;
	
			// 以groupManager 作为标志，加入gridGroup逻辑
			var groupManager = _self.get('groupManager'),
				groupRow = null;
			if(groupManager){
				if(groupManager.columns[groupManager.index].value !== element[groupManager.index]){
					groupManager.columns[groupManager.index].value = element[groupManager.index];
					groupRow = _self._creatGroupRow(element, index);
					groupManager.rowTemp = groupRow;
				}
			}
			// end

			rowTemplate = _self._getRowTemplate(index, element);
			rowEl = new Node(rowTemplate).appendTo(body);
			dom = rowEl.getDOMNode();
			lastChild = dom.lastChild;
		
			// 以groupManager 作为标志，加入gridGroup逻辑
			if(groupManager && groupManager.rowTemp){
				var groupRowData = DOM.data(groupManager.rowTemp, DATA_GROUP_ROW);
				groupRowData.childrenRow.push(dom);
			}
			// end

			DOM.data(dom, DATA_ELEMENT, element);
			DOM.addClass(lastChild, 'lp-last');
			_self.fire('rowcreated',{data : element,row : dom});
            return rowEl;
		},
		// 新建分组行
		_creatGroupRow: function(obj, index){
			var _self = this,
				body = _self.get('tbody'),
				groupRowTemplate = _self._getGroupRowTemplate(obj),
				groupRowEl = new Node(groupRowTemplate).appendTo(body);

			groupRowEl.data(DATA_GROUP_ROW, {
				childrenRow: []
			});

			if(index === 0){
				groupRowEl.addClass(CLS_GRID_GROUP_ROW_FIRST);
			}

			_self.fire('grouprowcreated',{row : groupRowEl[0]});

            return groupRowEl[0];
		},
		// 获取分组行的模板
		_getGroupRowTemplate: function(obj){
			var _self = this,
				groupManager = _self.get('groupManager'),
				cellTempArray = []
				groupRowTempArray = [],
				cellSpan = _self.get('columns').length,
				checkable = _self.get('checkable'),
				checkCell = "";

			if (checkable) {
				checkCell = _self._getCheckedCellTemplate('grid-row-checked-column', CLS_GRID_CELL);
			}

			S.each(groupManager.columns, function(groupObj, dataIndex){
				var cellValue = groupObj.renderer ? groupObj.renderer(obj[dataIndex], obj) : obj[dataIndex];
				cellTempArray.push(['<span class="', CLS_GRID_GROUP_TITLE,'">', groupObj.title, ':</span><span class="', CLS_GRID_GROUP_TEXT,'">', cellValue, '</span>'].join(''));
			});

			groupRowTempArray = ['<tr class="', CLS_GRID_GROUP_ROW, '">', checkCell, '<td class="', CLS_GRID_GROUP_CELL, '" colspan="', cellSpan, '"><div class="', CLS_GRID_CELL_INNER,'">', cellTempArray.join(''), '</div></td></tr>'];
			return groupRowTempArray.join('');
		},

		// 判断分组行是否选中
		_isGroupRowSelected : function (row) {
			return S.one(row).hasClass(CLS_GROUP_ROW_SELECTED);
		},
		// 设置分组行的选中状态
		_setGroupRowSelected: function(row, selected){
			var _self = this,
				checkbox = DOM.get('.' + CLS_CHECKBOX, row),
				hasSelected = DOM.hasClass(row, CLS_GROUP_ROW_SELECTED);
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
				DOM.addClass(row, CLS_GROUP_ROW_SELECTED);
				_self._onGroupRowSelectChanged(row, selected);
			} else {
				DOM.removeClass(row, CLS_GROUP_ROW_SELECTED);
				_self._setHeaderChecked(false);
				_self._onGroupRowSelectChanged(row, selected);
			}
		},
		// 触发分组行选中状态改变的事件
		_onGroupRowSelectChanged: function(row, selected){
			var _self = this,
				data = DOM.data(row, DATA_GROUP_ROW);
			if(selected){
				_self.fire('grouprowselected', {data : data, row : row});
			}else{
				_self.fire('grouprowunselected', {data : data, row : row});
			}
			_self.fire('grouprowselectchanged', {data : data, row : row, selected : selected});
		},

		// 分组行点击事件
		_groupRowClick: function(target){
			var _self = this,
				rowCheckable = _self.get('checkable'),
				row = _self._lookupByClass(target, CLS_GRID_GROUP_ROW),
				data;
			if(row){
				data = DOM.data(row, DATA_GROUP_ROW);
				_self.fire('grouprowclick', {data : data, row : row});
				if(rowCheckable) {
					if(!_self._isGroupRowSelected(row)) {
						_self._setGroupRowSelected(row, true);
					}else{
						_self._setGroupRowSelected(row, false);
					}
				}else{
					var selectedGroupRow = S.one('.' + CLS_GROUP_ROW_SELECTED, row.parentNode);
					if(selectedGroupRow){
						selectedGroupRow.removeClass(CLS_GROUP_ROW_SELECTED);
						_self._onGroupRowSelectChanged(selectedGroupRow[0], false);
					}
					DOM.addClass(row, CLS_GROUP_ROW_SELECTED);
					_self._onGroupRowSelectChanged(row, true);
				}
			}
		},
		// 分组行选中状态改变事件
		_groupRowSelect: function(row, data, selected){
			var _self = this,
				rowCheckable = _self.get('checkable');
			if(rowCheckable){
				S.each(data.childrenRow, function(_row){
					_self._setRowSelected(_row, selected);
				});
			}
			/* 当表格为单选表格时，点击分组行，不触发子行选中事件
			else{
				S.all('.' + CLS_GRID_ROW_SELECTED, row.parentNode).removeClass(CLS_GRID_ROW_SELECTED);
				if(selected){
					_self._setRowSelected(data.childrenRow[0], selected);
				}
			}
			*/
		}

	});

	S.namespace('LP');
	S.LP.GroupGrid = GroupGrid;

},{requires: ['1.0/grid']});

/*
TODO
1、表格的所有操作皆以子订单位单位，主订单只是在显示上合并显示
2、查询结果前面若带有复选框，则按子订单分别勾选，不提供主订单勾选
3、可能会出现一个主订单分两页显示的情况
4、选中子订单时，该子订单所在主订单的单元格也是选中状态
5、划过子订单时，子订单高亮，该子订单所在的主订单单元格也高亮
6、选中主订单单元格时，该主订单下所有子订单皆选中
7、划过主订单单元格时，该主订单下所有子订单皆高亮
8、主订单单元格的奇偶不做特殊处理，以第一个子订单的奇偶为准


*/