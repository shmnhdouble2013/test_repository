/** 
* @fileOverview grid表格
* @extends  KISSY.Base
* @creator  黄甲(水木年华double)<huangjia2015@gmail.com>
* @depends  ks-core
* @version 1.0  
* @update 2013-08-30
* @example
*   new Grid({
		tableContainerId: '#poolTable',	// table 容器 id
		tr_tpl: tpltr,					// tr渲染模板
		gridData:[{},{}],				// 指定数据
		isAjaxData:true,				// 是否是异步数据 默认 为false
		ajaxUrl: 'result.php',		    // 异步查询url  
		checkable: true					// 是否有checkbox
	});
*/

KISSY.add('mui/grid', function(S,  XTemplate, Store, TL, Pagination) { // O,
	var DOM = S.DOM,
		Node = S.Node,
		Ajax = S.IO,
		UA = S.UA,
		Event = S.Event,
		S_Date = S.Date,
        win = window,
        doc = document;		

	// 设定全局 参数 变量 
	var	containerCls = '.j_tableContent',			// table 容器钩子

		DATA_ELEMENT = 'row-element',				 // row 元素index
		CLS_GRID_ROW_SELECTED = 'grid-row-selected', // row 选中class标示
		ATTR_COLUMN_FIELD = 'data-column-field',	// 数据字段表示

		CLS_GRID_ROW = 'grid-row',					// grid row标示
		CLS_GRID_CELL = 'grid-cell',				// grid row标示
		
		CLS_CHECKBOX = '.grid-checkbox', 			// checkbox
		
		CLS_GRID_ROW_OVER = 'grid-row-over',		// 行 mouseover class 样式
		
		SELECTALLCLS = '.j_select_all',				// 全部选中 checkbox cls钩子

		pagContenTpl = '<div class="page-container skin-tb"></div>';	// 分页容器


		main_table = 
	    '<tr class="grid-row">'+
	     	'<td class="grid-cell"><input type="checkbox" value="{{id}}" name="box" class="grid-checkbox" /></td>'+

	    	'<td class="grid-cell">{{id}}</td>'+
	        '<td class="grid-cell">{{actype}}</td>'+
	        '<td class="grid-cell">{{medianame}}</td>'+
	        '<td class="grid-cell">'+
				'<a href="javascript:void(0)" class="ui-btn-m-primary j_add_remove" data-no="{{id}}" data-operationState="addtr">添加</a>'+
			'</td>'+
	    '</tr>';  
		


	// grid 默认配置
	var POLLGRIDDEFAULT = {
			tableContainerId: null, 				// table 容器 id钩子			
			isPagination:false,						// 是否有分页 默认 为false
			pageSize: 10, 							// 分页大小
			isAjaxData:false,						// 是否是异步数据 默认 为false
			ajaxUrl: null,      					// 异步查询url  
			trTpl: null,							// 选择池 table tbody tr 模板
			staticData: [],							// 选择池 静态数据 
			checkable:true,							// 是否复选框 checkbox
			loadMaskTpl: '<div class="loading-mask"></div>', // 加载数据遮罩功能
			currentPage:1,										// 默认分页起点
			totalPage: 10,										// 分页总数
			pageLenght:10,										// 分页长度
			dataField:'id'							// 单条 josn 数据 标示


		}
	/**
	* 	ajaxUrl 返回数据格式
	*	{ 	
	*		"success":true,
	*		"message":"",
	*		"rows":[], 
	*		"results":0 
	*	}	
				new Store({
					url : _self.get('ajaxUrl'),
					root: 'rows',
					totalProperty: 'results', 	 // 数据条数
					params: {type:'all', id:'DJKFJDKFJ94944'}	//自定义参数
				});	
	*/	

	function Grid(config){
		var _self = this,
			config = S.merge(POLLGRIDDEFAULT, config);
			
		if( !(_self instanceof Grid) ){
			return new Grid(config);
		}

		Grid.superclass.constructor.call(_self, config);		
		
		_self._init();
	}

	// 继承于KISSY.Base  
	S.extend(Grid, S.Base);
	Grid.VERSION = 1.0;
	S.augment(Grid, {

		// 控件 初始化
		_init: function(){
			var _self = this;

			_self.container = _self.get('tableContainerId');
			_self.tbody = S.get('tbody', _self.container);
			_self.thead = S.get('thead', _self.container);
			_self.tfoot = S.get('tfoot', _self.container);
			
			if(!_self.container){
				throw '未指定表格容器！';
			}

			_self.loadingMaster();
			_self._initStore();	
			_self._initGrid();
			_self._eventRender();
		},
		
		// 事件初始化 -- click -- mouseout -- mouseover
		_eventRender: function(){
			var _self = this;
			
			// thead事件
			Event.on(_self.thead, 'click', function(event){
				_self._allSlectEvt(event.target);	
			});
						
			// tbody事件
			S.one(_self.tbody).on('click', function (event) {
				_self._rowClickEvent(event.target);
			}).on('mouseover', function (event) {
				_self._rowOverEvent(event.target);
			}).on('mouseout', function (event) {
				_self._rowOutEvent(event.target);
			});				
		},
		
		// 初始化gird 和 分页器
		_initGrid: function(){
			var _self = this;					
			
			// 初始化表格 容器

			// 如果异步 则异步加载数据，否则加载 静态数据 --Store
			if(_self.get('isAjaxData')){
				if(_self.get('ajaxUrl')){
					_self.store.load({ 
						limit: _self.get('limit'), 
						totalPage: _self.get('totalPage') 
					});
				}else{
					throw 'ajax url error！';
				}				
			}else if(_self.get('staticData')){
				_self.store.setResult( _self.get('staticData') );				
			}
			
			// 是否分页 -- 可以指定容器模板
			if(_self.get('isPagination')){
				_self.addPagePation( _self.get('pagContenTpl') || pagContenTpl, _self.container);
			}	

			
			
			// if (!_self._isAutoFitWidth()) {//如果设置了宽度，则使用此宽度
				// width = _self.get('width');
				// _self._setWidth(width);
			// } else {						//根据所有列的宽度设置Grid宽度
				// width = _self._getColumnsWidth();
				// _self._setWidth(width + 2);
			// }
            // if(_self.get('allowScroll')){
                // gridEl.addClass(CLS_ALLOW_SCROLL);
            // }

			// if (height) { 			如果设置了高度，设置Grid Body的高度，
				// _self.setHeight(height);
			// }

		},
		
		// 初始化Store
		_initStore: function(){
			var _self = this,
				data = TL.serializeToObject(_self.get('formEl')),
				data = S.merge(data, {"currentPage": _self.get('currentPage')});				
			
			_self.store = new Store({
				autoLoad: _self.get('autoLoad'),
				url: _self.get('ajaxUrl'),
				params: TL.encodeURIParam(data)
			});
			
			// 若无store则推出绑定
			if(!_self.store){
				return;
			}
			
			// 准备加载数据前 --- 添加 屏幕遮罩 delay
			_self.store.on('beforeload', function(){
				if (_self.loadMask) {
					_self.loadMask.show();
				}
			});
			
			// 数据加载完成后 - 取消 屏幕遮罩 delay
			_self.store.on('load', function(){
				var results = this.getResult();

				_self.showData(results);

				if(_self.loadMask) {
					_self.loadMask.hide();
				}
			});

			// 添加数据时触发该事件
			_self.store.on('addrecords', function (event) {
				var data = event.data;
				_self.appendData(data);
			});

			// 删除数据是触发该事件
			_self.store.on('removerecords', function (event) {
				var data = event.data;
				_self.removeData(data);				
			});

			// 出错时候
			_self.store.on('exception', function () {
				if (_self.loadMask) {
					_self.loadMask.hide();
				}
			});
		},
		
		// 添加分页
		addPagePation: function(tpl, container){
			var _self = this,
				pageCont = DOM.create(tpl);

			if(!pageCont || !container){
				return;
			}	

			DOM.append(pageCont, container);

			var pagContainer = S.get('.page-container', container);

			// 初始化组件实例
			_self.pagination = new Pagination(pagContainer, {
				currentPage: _self.get('currentPage'), 		// 默认选中第7页
				totalPage: _self.get('totalPage'), 			// 一共有多少页
				firstPagesCount: 3, 	// 显示最前面的3页
				preposePagesCount: 2, 	// 当前页的紧邻前置页为1页
				postposePagesCount: 2,	// 当前页的紧邻后置页为2页
				lastPagesCount: 2 		// 显示最后面的1页
			});	
		},

		// 添加遮罩功能
		loadingMaster: function(){
			var _self = this,
				mastNode = DOM.create( _self.get('loadMaskTpl') );

			if(mastNode){
				DOM.prepend(mastNode, _self.container);
				_self.loadMask = S.one(mastNode);
			}				
		},

		// 全选事件
		_allSlectEvt: function(target){
			var _self = this,
				hasAllSelect = DOM.hasClass(target, SELECTALLCLS);
				
			if(hasAllSelect){					
                _self._setAllRowsSelected(target.checked);
			}
		},
		
				
		// 查找 row
		_findRow: function (element) {
			return this._lookupByClass(element, CLS_GRID_ROW);
		},	
		
		// 查找 cell
		_findCell: function (element) {
			return this._lookupByClass(element, CLS_GRID_CELL);
		},
		
		// 通过class查找方法，若木有则返回父容器下的样式元素 td tr
		_lookupByClass: function(element, css){
			if(DOM.hasClass(element, css)) {
				return element;
			}
			return DOM.parent(element, '.' + css);
		},
		
		// row是否选中
		_isRowSelected: function(row) {
			return S.one(row).hasClass(CLS_GRID_ROW_SELECTED);
		},
		
		// 行 click 事件
		_rowClickEvent: function (target) {
			var _self = this,
				row = _self._findRow(target),
				cell = _self._findCell(target),
				rowCheckable = _self.get('checkable'), // 是否有checkbox				
				data = null,
				eventResult = null;
				
			if(row){
				data = DOM.data(row, DATA_ELEMENT);
				
				if(cell){
					eventResult = _self.fire('cellClick', {data: data, row: row, cell: cell, field: DOM.attr(cell, ATTR_COLUMN_FIELD), domTarget: target});
					if(eventResult === false){ // 如果事件出错，则退出
						return;
					}
				}
				_self.fire('rowclick', {data: data, row: row});
				
				// 设置行选中状态
				if(rowCheckable){// checkbox
					if(!_self._isRowSelected(row)) {
						_self._setRowSelected(row, true);						
					}else{
						_self._setRowSelected(row, false);
					}
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
				if(cell) {
					_self.fire('celldblclick', {data : data, row : row, cell : cell, field : DOM.attr(cell, ATTR_COLUMN_FIELD), domTarget : target});
				}
				_self.fire('rowdblclick', {data : data, row : row});
			}
		},
		
		//行的 mouseover 事件
		_rowOverEvent : function (target) {
			var _self = this,
				row = _self._findRow(target);
				
			if(row) {
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

			// _self._afterShow(); 自适应宽高 方法

			_self.fire('aftershow');
		},

		/**
		* 清空表格
		*/
		clearData : function(){
			var _self = this,
				rows = _self.tbody.rows;

			// 移除行，一般是数据源移除数据后，表格移除对应的行数据	
			S.each(rows, function(row){
				_self.fire('rowremoved', {data : DOM.data(row, DATA_ELEMENT), row : row} );
			});

			S.all(rows).remove();
		},

		/**
		* 添加tr 到tbody中
		*/
		_createRow : function (element, index) {
			var _self = this,
				rowTemplate = _self.trRender(element, _self.get('trTpl') ), // 暂时支持 用户 自定义tr模板 创建tr
				rowEl = new Node(rowTemplate).appendTo( _self.tbody ),
				dom = rowEl.getDOMNode();

			DOM.data(dom, DATA_ELEMENT, element);
			_self.fire('rowcreated',{data : element,row : dom});
            return rowEl;
		},

		/**
		* 移除数据
		* @private
		* @param {Array} data 移除的数据
		* 
		*/
		removeData : function (data) {
			var _self = this,
				rows = S.makeArray(_self.tbody.rows);

            S.each(rows, function (row) {
                var obj = DOM.data(row, DATA_ELEMENT);
                if (obj && S.inArray(obj, data)) {
					_self.fire('rowremoved',{data: obj, row: row});
					DOM.remove(row);
                }
            });
		},

		/**
		* 附加数据 不依赖store 根据数据渲染表格
		* @private
		* @param {Array} data 添加到表格上的数据
		*/
		appendData : function (data) {
			var _self = this,
				rows = [];
				// count = _self._getRowCount();

			_self.fire('beginappend',{data : data});
			S.each(data, function (obj, index) {
				var row = _self._createRow(obj, index);  // count + index
				rows.push(row);
			});
			_self.fire('afterappend', {rows : rows, data : data});
		},

		// 渲染tr
		trRender: function(data, tpl){
    		var _self = this,
    			htmlText,
    			creatNode;

    		if(!tpl){
				throw '渲染模板未传入！';    
			}

    		try{
    			htmlText = new XTemplate(tpl).render(data);
    			creatNode = DOM.create(htmlText);
    		}catch(e){
    			throw e;			
    		}

    		return creatNode;
    	},
		
		/**
		* 取消选中的记录 
		*/
		clearSelection : function(){
			var _self = this;
			
			_self._setAllRowsSelected(false);
			_self._setHeaderChecked(false);
		},
		
				
		//设置表头选中状态
		_setHeaderChecked: function (checked) {
			var _self = this,
				checkEl = S.one(SELECTALLCLS, _self.thead);
			
			if(checkEl) {
				checkEl.attr('checked', checked);
			}
		},
		
		//设置row全选
		_setAllRowsSelected: function (selected) {
			var _self = this;			
			
			S.each(_self.tbody.rows, function(row) { 
				_self._setRowSelected(row, selected);
			});
		},

		// 纯根据 外界 传入的 data --- 设定表格中的 对应的row选中状态
		_setDataSelect: function(data, isSelected){
			var _self = this;

			if(!data || isSelected == undefined){
				throw '必须传入相应数据或选中状态';
				return;
			}

			data = S.isArray(data) ? data : [data];

			S.each(data, function(obj){
				transition(obj, isSelected);
			});
			
			function transition(obj, isSelected){
				S.each(_self.tbody.rows, function(row){
					_self._setLockRecords(row, obj, isSelected);
				});
			}
		},

		// 设定表格 选中状态 --带锁定
		_setLockRecords: function (row, compareData, selected){
			var _self = this,
				data = DOM.data(row, DATA_ELEMENT),
				isFind = _self.store.matchFunction(data, compareData);

			if(isFind) { 
				_self.setSelectLock(row, selected);		
			}		
		},
		
		// 锁定rows状态
		_isLocalRows: function(rows, isDisabled){
			var _self = this;
			
			rows = S.isArray(rows) ? rows : [rows];
			
			S.each(rows, function(row){
				var checkbox = DOM.get(CLS_CHECKBOX, row),
					data = DOM.data(row, DATA_ELEMENT);
			
				// 禁用复选 保持选中状态
				if(checkbox){
					DOM.attr(checkbox, 'disabled', isDisabled);
				}			
			});						
		},

		// 设定选中情况 及 锁定情况
		setSelectLock: function(row, selected){
			var _self = this,
				checkbox = DOM.get(CLS_CHECKBOX, row),
				isDisabled = DOM.attr(checkbox, 'disabled');
			
			// 若是锁定状态，首选解锁			
			if(isDisabled) {
				DOM.attr(checkbox, 'disabled', false);
			}
			
			// 设定选中 及 锁定 状态
			_self._setRowSelected(row, selected);		
			_self._isLocalRows(row, selected);	
		},


		//是否row全部选中
		_isAllRowsSelected: function(){
			var _self = this,
				rows = _self.tbody.rows,
				val = true;

			if(rows.length<1){
				return;
			}else{
				S.each(rows, function(row) { 
					if( !_self._isRowSelected(row) ){
						val = false;
					}
				});				
				return val;		
			}					
		},

		
		/**
		* 获取选中的数据
		* @return {Array} 返回选中的数据
		*/
		getSelection : function(){
			var _self = this,
				selectedRows = S.all('.' + CLS_GRID_ROW_SELECTED, _self.tbody),
				objs = [];

			S.each(selectedRows, function(row) {
				var obj = DOM.data(row, DATA_ELEMENT);
				if(obj) {
					objs.push(obj);
				}
			});
			return objs;
		},
		
		// 设置行选择
		_setRowSelected : function (row, selected) {
			var _self = this,
				checkbox = DOM.get(CLS_CHECKBOX, row),
				data = DOM.data(row, DATA_ELEMENT),
				hasSelected = DOM.hasClass(row, CLS_GRID_ROW_SELECTED);
				
			if(hasSelected === selected) {
				return;
			}
			
			if(checkbox) {
				//如果选择框不可用，此行不能选中
				if(DOM.attr(checkbox,'disabled')){
					return;
				}
				checkbox.checked = selected;
			}
			
			if(selected) {
				DOM.addClass(row, CLS_GRID_ROW_SELECTED);
				_self._onRowSelectChanged(row, selected);
			}else{
				DOM.removeClass(row, CLS_GRID_ROW_SELECTED);
				_self._onRowSelectChanged(row, selected);
			}
		},
		
		// 触发行选中，取消选中事件
		_onRowSelectChanged : function(row, selected){
			var _self = this,
				data = DOM.data(row, DATA_ELEMENT);
				
			if(selected){
				_self.fire('rowselected', {data : data, row : row, type:'rowselected'}); 
			}else{
				_self.fire('rowunselected', {data : data, row : row, type:'rowunselected'});
			}
			_self.fire('rowselectchanged', {data : data, row : row, selected : selected});
		},
    	
		// 渲染data json 扁平化数据  delay
    	_renderTd: function(data, isPoolTr){
    		var _self = this,
    			htmlAry = [];

    		S.each(data, function(val){
				rendtd(val);
			});

			function rendtd(trData){

				htmlAry.push( '<tr><td><input type="checkbox" value="'+trData.id+'" name="addtr" class="'+_self.poolCheckBoxCls+'" /></td>' );

				S.each(trData, function(val, index){					
					if(isPoolTr){
						if(!index){ // 第一个单元格
							
						}else{
							htmlAry.push( '<td><input type="checkbox" value="'+val+'" name="addtr" class="'+_self.poolCheckBoxCls+'" /></td>' );
						}
						
					}else{
						htmlAry.push( '<td><input type="checkbox" value="'+val+'" name="rmtr" class="'+_self.candCheckBoxCls+'" /></td>' );
					}					
				});
			}
    	}
	
	});

return Grid;

}, {'requires':['xtemplate', 'mui/gridstore', 'TL', 'gallery/pagination/2.0/index', 'sizzle']}); // 'mui/overlay','mui/overlay/overlay.css',