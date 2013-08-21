/** 
* @fileOverview 表格
* @extends  KISSY.Base
* @creator  黄甲(水木年华double)<huangjia2015@gmail.com>
* @depends  ks-core
* @version 1.0  
* @update 2013-08-21
* @example
*   new Grid({
		tableId: '#poolTable',			// table 容器 id
		gridData:[{},{}],				// 指定数据
		isAjaxData:true,				// 是否是异步数据 默认 为false
		ajaxUrl: 'result.php'		    // 异步查询url  
	});
*/

KISSY.add('tm/tbs-back/grid', function(S, O, XTemplate, Store) {
	var DOM = S.DOM,
		Ajax = IO,
		Event = S.Event,
		S_Date = S.Date;

	// 设定全局 参数 变量 
	var	SELECTALLCLS = '.j_select_all',				// 全部选中 checkbox cls钩子

		POOLCHECKBOXCLS = '.j_pool_checkobx', 		// 选择池 table tr checkbox cls钩子
		CANDCHECKBOXCLS = '.j_candidate_checkobx', 	// 候选 table tr checkbox cls钩子

		TROPRATIONCLS = '.j_add_remove', 			// 添加/移除 btn cls钩子

		TROPRATIONENABLE = 'enableTr',   			// 添加/移除 btn 操作标示 --- 允许
		TROPRATIONDISABLE = 'disableTr';			// 添加/移除 btn 操作标示 --- 禁止

	function Grid(config){
		var _self = this,
			config = S.merge({
				isAjaxData:false							// 是否是异步数据 默认 为false	
			}, config);

		if( !(_self instanceof Grid) ){
			return new Grid(config);
		}

		Grid.superclass.constructor.call(_self, config);		

		_self._init();
	}

	// 继承于KISSY.Base  
	S.extend(Grid, S.Base);
	Grid.VERSION = 1.0;

	S.mix(Grid, {
		tbody : S.get(this.get('tableId')).tbody;
	});

	S.augment(Grid, {

		// 控件 初始化
		_init: function(){
			var _self = this;

			_self.tbody = S.get(_self.get('tableId')).tbody;

			_self._initStore();
	        _self._eventRender();
		},

		// 初始化Store
		_initStore: function(){
			var _self = this;

			// 如果异步 则异步加载数据，否则加载 静态数据 --Store
			if(_self.get('isAjaxData')){
				_self.store = new store({
					url : _self.get('ajaxUrl')
				});
			}else{
				_self.store = new store();
				_self.store.setResult( _self.get('girdData') );
			}	

			// 准备加载数据前 --- 添加 屏幕遮罩 delay
			_self.store.on('beforeload', function () {
				var loadMask = _self.get('loadMask');
				if (loadMask) {
					loadMask.show();
				}
			});

			// 数据加载完成后 - 取消 屏幕遮罩 delay
			_self.store.on('load', function () {
				var results = store.getResult(),
					loadMask = _self.get('loadMask');

				_self.showData(results);

				if (loadMask) {
					loadMask.hide();
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
				var loadMask = _self.get('loadMask');
				if (loadMask) {
					loadMask.hide();
				}
			});
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
		* 清空表格
		*/
		clearData : function(){
			var _self = this,
				rows = _self.tbody.rows;

			// 移除行，一般是数据源移除数据后，表格移除对应的行数据	
			// S.each(rows, function(row){
			// 	_self.fire('rowremoved', {data : DOM.data(row, DATA_ELEMENT), row : row} );
			// });

			S.all(rows).remove();
		},

		/**
		* 创建tr
		*/
		_createRow : function (element, index) {
			var _self = this,

				rowTemplate = _self._getRowTemplate(index, element),
				rowEl = new Node(rowTemplate).appendTo(_self.get('tbody')),
				dom = rowEl.getDOMNode(),
				lastChild = dom.lastChild;

			DOM.data(dom, DATA_ELEMENT, element);
			DOM.addClass(lastChild, 'lp-last');

			_self.fire('rowcreated',{data : element,row : dom});
            return rowEl;
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

		trRender: function(targetContainer, data, tpl){
    		var  _self = this,
    			htmlText,
    			creatNode;

    		if(!targetContainer){
				throw '渲染容器未传入！';    
			}

    		try{
    			htmlText = new XTemplate(tpl).render(data);
    			creatNode = DOM.create(htmlText);

    			DOM.Html(targetContainer, creatNode); 
    		}catch(e){
    			

    			

    			throw e;
    			throw '渲染模板未传入，默认渲染全部数据！';    			
    		}


    		// 静态数据渲染 -- 非异步 有数据 模板
			if( !_self.get('isAjaxData') && _self.get('poolData') && _self.get('pool_table_tpl') ){				
				_self.fire('loading');

				var render = new XTemplate(tpl).render(data);
			}
    	},

    	// 渲染data json 扁平化数据  _self.poolCheckBoxCls  _self.candCheckBoxCls
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

}, {'requires':['mui/overlay','mui/overlay/overlay.css', 'xtemplate', 'store', 'sizzle']});