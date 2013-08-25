/* @fileOverview 品牌运营后台--品牌活动媒体选择
* @extends  KISSY.Base
* @creator  黄甲(水木年华double)<huangjia2015@gmail.com>
* @depends  ks-core
* @version 1.0  
* @update 2013-08-19
* @example
*   new SelectGrid({
	});
*/	
KISSY.add('mui/selectGrid', function(S, Grid, Validation, TL) { // O, 
	var DOM = S.DOM,
		Ajax = S.IO,
		JSON = S.JSON,
		Event = S.Event,
		S_Date = S.Date;

	// 设定全局 参数 变量 
	var	TROPRATIONCLS = '.j_add_remove', 			// 添加/移除 btn cls钩子
		TROPRATIONENABLE = 'enableTr',   			// 添加/移除 btn 操作标示 --- 允许
		TROPRATIONDISABLE = 'disableTr';			// 添加/移除 btn 操作标示 --- 禁止
		
	// _self.get('addMoreId'), 								// 批量添加 id
	// _self.get('removeMoreId'), 							// 批量移除 id	

	
	function SelectGrid(config){ 
		var _self = this,
			config = S.merge({
				isMoveData: false							// 是否 移动 选择池数据? 默认copy数据 false				
			}, config);

		if( !(_self instanceof SelectGrid) ){
			return new SelectGrid(config);
		}

		SelectGrid.superclass.constructor.call(_self, config);		

		_self._init();
	}
	
	// 继承于KISSY.Base  
	S.extend(SelectGrid, S.Base);
	SelectGrid.VERSION = 1.0;

	S.augment(SelectGrid, {

		// 控件 初始化
		_init: function(){
			var _self = this;

			_self._domRender();
			_self._validaRender();

	        _self._eventRender();
		},

		// DOM初始化
		_domRender: function(){
			var _self = this;

			// 全局变量
			_self._tb_token_ = DOM.val('#J_csrf_token') || '';
			
			// 默认表单
			_self.formEl = S.get(_self.get('formId')) || S.get('#J_hideform'),

			// 查询按钮 -- 优先用户配置，否则用默认id
			_self.searchBtn = 

			// tr数据标示 默认为 id
			_self.trIndex = _self.get('trIndex') || 'id'; 

			// 存储全局表单 及其验证域
			_self.form = S.get('#J_hideform');

			// 选择池grid对象
			_self.poolGrid = new Grid( S.merge(_self.get('poolGridConfig'), {'formEl': _self.formEl}) );
			_self.poolStore = _self.poolGrid.store;
			
			// 候选 grid对象
			_self.candGrid = new Grid( S.merge(_self.get('candGridConfig'), {'formEl': _self.formEl}) );
			_self.candStore = _self.candGrid.store;
		},

		// 校验实例化
		_validaRender: function(){
			var _self = this;

			if(_self.form){
				_self.ValiForm = new Validation(_self.form, {
			        style: 'tbsUiValid_text' 				 // 若只显示 校验文本 style则配置  tbsUiValid_text
			    });

			    _self.textValidInput = _self.ValiForm.get('J_inptuEle');
			}
		},

		// 事件初始化
		_eventRender: function(){
			var _self = this,
				addMoreBtn = _self.get('addMoreBtnId') || '#J_addMore',
				removeMorBtn = _self.get('removeMorBtnId') || '#J_removeMore',
				searchBtn = _self.get('searchBtnId') || S.get('#J_search_btn');

			/******* 选择池table 事件监控 *******/	
			
			/* 点击查询 */
			Event.on(searchBtn, 'click', function(){
				_self.searchPageEvent();
			});	
			
			// 监听页码切换
			_self.poolGrid.pagination.on('switch', function(e) {
				var curPage = e.toPage;
				
				DOM.val('#J_currentPage', curPage);
				
				_self.searchPageEvent();
				
				// { 	start: 0, 
					// currentPage: 1, 
					// limit: 10, 
					// totalPage:10 
				// }
			});
			
			
			// 全选 批量添加
			Event.on(addMoreBtn, 'click', function(){
				var data = _self.poolGrid.getSelection();
				
				if(data.length<1){
					alert('当前选择为空！');					
				}else{									
					_self.candStore.add(data, true); 		// 添加数据 并 去重
					_self.poolGrid.clearSelection(); // 取消表格 选中状态
				}				
			});
			
			// 单项 选择池table 添加事件
			_self.poolGrid.on('cellClick', function(event){				
				_self._poolGridClick(event);						
			});
			
			
			
			/******* 候选table 事件监控 *******/
			
			// 全选 批量移除
			Event.on(removeMorBtn, 'click', function(){
				var data = _self.candGrid.getSelection();
				
				if(data.length<1){
					alert('当前选择为空！');
					
				}else{									
					_self.candStore.remove(data); // 添加数据 并 去重
					_self.candGrid.clearSelection(); // 取消表格 选中状态
				}				
			});	

			// 单项 选择池table 添加事件
			_self.candGrid.on('cellClick', function(event){				
				_self._candGridClick(event);						
			});
			
			// 保存数据
			Event.on('#J_saveSelectData', 'click', function(){
				var selectData = _self.candStore.getResult(),
					selectLength = _self.candStore.getCount(),
					stringiFy = JSON.stringify(selectData);
				
				if(selectLength<1){
					alert('当前选择为空！');
				}else{									
					DOM.val('#J_selectTableData', stringiFy);
				}
			});
		},
	
		// 选择池 grid 操作
		_poolGridClick: function(event){
			var _self = this,
				data = event.data,
				row = event.row,
				target = event.domTarget;	

			// 添加按钮	
			if( DOM.hasClass(target, TROPRATIONCLS) ){
				_self.candStore.add(data, true); 	 // 添加数据 并 去重 
				_self.poolGrid._setRowSelected(row, false);				 // 取消表格 选中状态
			}			
		},
		
		// 候选区 grid 操作
		_candGridClick: function(event){
			var _self = this,
				data = event.data,
				row = event.row,
				target = event.domTarget;
			
			// 添加按钮	
			if( DOM.hasClass(target, TROPRATIONCLS) ){
				_self.candStore.remove(data); 					// 添加数据 并 去重
				
				
				_self.candGrid._setRowSelected(row, false); 	// 取消表格 选中状态
			}			
		},
	
		// 点击查询 或者 分页 异步数据方法
		searchPageEvent: function(pageObj){
			var _self = this,
				data = TL.encodeURIParam( TL.serializeToObject(_self.formEl) ),
				endData = S.isObject(pageObj) ? S.merge(data, pageObj) : data;
				
			_self.poolStore.load(endData);
		},

    	// 以下为公用方法 ********** 空函数，应对特殊 情况啥也不做或者初始化方法 **********
    	_empotyFn: function(){
    		var _self = this;
    	},

    	// 提示方法
		_alertFn: function(msg, callback){
			var _self = this;

			(new O.Alert(msg, callback)).show();            
		},		

		// ajax 信息提示 作用 回调函数
		_onlyAjaxMsg: function(data){
			var _self = this;

			if(data.success){
				_self._alertFn( data.message || '操作成功！' );				
			}else{
				_self._alertFn( data.message || '操作失败！' );
			}			
		},

		/* 公用的ajax方法 
		* 如果需要配置 dataType则 需要开发 配置项{'url':, 'data':, 'dataType': } 
		* errorCallBack, okCallBack  errorfn 分别为失败 成功方法 异常回调方法
		*/
		_ajaxAllConfig: function(configObj, okCallBack, errorCallBack, errorfn){ 
			var _self = this,
				ajaxConfig = {
					type:'post',
					charset : 'charset',
					dataType:'json',
					success: function(data){
						if(data.success){	
							if(okCallBack){
								S.isFunction(okCallBack) && okCallBack.call(_self, data);
							}else{
								if(_self.form){
									_self.form.submit();
								}else{
									_self._alertFn( data.message || '操作成功！' );
									//console.log('成功执行啦');
								}  
							};		
						}else{
							if(errorCallBack){
								S.isFunction(errorCallBack) && errorCallBack.call(_self, data);
								//console.log('失败执行啦');
							}else{
								_self._alertFn( data.message || '操作失败！' );
							};			
						}
					},
					error: function(){ 						
						S.isFunction(errorfn) && errorfn.call(_self);
						_self._alertFn('请求异常！');
						//console.log('错误执行啦');
					}
			},
			endAjaxConfig = S.merge( ajaxConfig, configObj);

			Ajax(endAjaxConfig);
		}
	});

return SelectGrid;

}, {'requires':['mui/grid', 'Validation', 'TL', 'sizzle']}); // 'mui/overlay','mui/overlay/overlay.css', 