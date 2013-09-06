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

KISSY.add('mui/selectGrid', function(S, Grid, Validation, TL, placeholder, O) {
	var DOM = S.DOM,
		Ajax = S.IO,
		JSON = S.JSON,
		Event = S.Event,
		S_Date = S.Date;

	// 设定全局 参数 变量 
	var	TROPRATIONCLS = '.j_add_remove'			// 添加/移除 btn cls钩子
	
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
	
	SelectGrid.VERSION = 1.0;

	// 继承于KISSY.Base  
	S.extend(SelectGrid, S.Base);

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
						
			// 默认表单
			_self.formEl = S.get(_self.get('formId')) || S.get('#J_pageForm');

			// tr数据标示 默认为 id
			_self.trIndex = _self.get('trIndex') || 'id'; 

			var toGridParm = {
				'formEl': _self.formEl,
				'trIndex' : _self.trIndex 
			};	

			
			// 候选 grid对象
			_self.candGrid = new Grid( S.merge(_self.get('candGridConfig'), toGridParm) );
			_self.candStore = _self.candGrid.store;

			// 选择池grid对象 -- 必须等 候选grid回显完成后 --- 因为要根据 候选gird数据回显选中状态
			_self.poolGrid = new Grid( S.merge(_self.get('poolGridConfig'), toGridParm) );
			_self.poolStore = _self.poolGrid.store;

			// input文本提示
			placeholder.textHolder( S.query('.j_sourcesinput') );
		},

		// 校验实例化
		_validaRender: function(){
			var _self = this;

			if(_self.formEl){
				_self.ValiForm = new Validation(_self.formEl, {
			        style: 'tbsUiValid_under' 				 // 若只显示 校验文本 style则配置  tbsUiValid_text  tbsUiValid_under  mui里引用kissy
			    });
			}
		},

		// 事件初始化
		_eventRender: function(){
			var _self = this,
				addMoreBtn = _self.get('addMoreBtnId') || '#J_addMore', 
				removeMorBtn = _self.get('removeMorBtnId') || '#J_removeMore',
				searchBtn = _self.get('searchBtnId') || S.get('#J_search_btn');

			/******* 选择池table 事件监控 *******/	
			
			/* 选择池-点击查询 */
			Event.on(searchBtn, 'click', function(){
				_self.searchPageEvent();
			});	
			
			// 监听页码变化
			_self.poolGrid.pagination.on('afterPageChange', function(e) {
				var curPage = e.idx,
					parms = { 		
						currentPage: curPage
					};
				
				_self.searchPageEvent(parms);
			});
			
			
			// 全选 批量添加
			Event.on(addMoreBtn, 'click', function(){
				var data = _self.poolGrid.getSelection();
				
				if(data.length<1){
					_self._alertFn('当前选择为空！');					
				}else{									
					_self.candStore.add(data, true); 		// 添加数据 并 去重
					_self.poolGrid._setDataSelect(data, true);	// 取消表格 所有checkbox 选中状态
				}				
			});
			
			// 选择池 table 单项数据 btn添加事件
			_self.poolGrid.on('cellClick', function(event){				
				_self._poolGridClick(event);						
			});
						
			
			/******* 候选table 事件监控 *******/
			
			// 批量移除
			Event.on(removeMorBtn, 'click', function(){
				var data = _self.candGrid.getSelection();
				
				if(data.length<1){
					_self._alertFn('当前选择为空！');					
				}else{									
					_self.candStore.remove(data); 		// 删除数据 
					_self.candGrid._setHeaderChecked(false); 

					// 取消选中 选择池选中状态
					_self.poolGrid._setDataSelect(data, false);
				}				
			});	

			// 候选table 单项数据 btn删除事件 -- // 自动 取消 选择池表格相应数据选中状态
			_self.candGrid.on('cellClick', function(event){				
				_self._candGridClick(event);						
			});

			// 根据候选区 表格数据 回显 选择池选中状态-并标示禁用	-- 支持 异步查询 和 分页
			_self.poolGrid.on('aftershow', function(){
				var candData = _self.candStore.getResult();

				_self.poolGrid._setDataSelect(candData, true);	
			}); 


			// 行选中 vs 全选 匹配 
			_self.poolGrid.on('rowselected rowunselected', function(ev){
				_self.autoSelect.call(this, ev);
			});
			_self.candGrid.on('rowselected rowunselected', function(ev){
				_self.autoSelect.call(this, ev);
			});			  	

			/******* 页面操作 *******/
			
			// 重新选择活动
			// Event.on('#J_resetBack', 'click', function(){
			// 	var selectLength = _self.candStore.getCount();
				
			// 	if(selectLength>1){
			// 		_self._alertFn('当前选择数据为空！');
			// 	}else{
			// 		_self.saveData('Y');
			// 	}
			// });

			// 保存数据
			Event.on('#J_saveSelectData', 'click', function(){
				var selectLength = _self.candStore.getCount();

				if(selectLength<1){
					_self._alertFn('当前选择数据为空！');
				}else{
					_self.saveData('');
				}
			});

			// 阻止表单回车刷新
			Event.on(_self.formEl, 'submit', function(){
				return false;
			});
		},

		// 智能匹配 数据勾选 与 全选状态
		autoSelect: function(ev){
			var type = 	ev.type;

			if(type === 'rowselected'){
				this._isAllRowsSelected() && this._setHeaderChecked(true);
			}else{
				this._setHeaderChecked(false); 
			}
		},

		// 保存数据公用方法
		saveData: function(isResetActive){
			var _self = this,
				selectData = _self.candStore.getResult(),
				stringiFy = JSON.stringify(selectData);

			DOM.val('#J_resetActive', isResetActive);
			DOM.val('#J_selectTableData', stringiFy);
			_self.formEl.submit(); // 同步提交表单
		},
	
		// 选择池 grid 操作
		_poolGridClick: function(event){
			var _self = this,
				data = event.data,
				row = event.row,
				target = event.domTarget;	

			// 添加按钮	
			if( DOM.hasClass(target, TROPRATIONCLS) ){
				_self.candStore.add(data, true); 	 			 // 添加数据 并 去重 				
				_self.poolGrid.setSelectLock(row, true); 		// 锁定tr选中状态	
			}	
		},
		
		// 候选区 grid 操作
		_candGridClick: function(event){
			var _self = this,
				data = event.data,
				row = event.row,
				target = event.domTarget;
			
			// 移除按钮	
			if( DOM.hasClass(target, TROPRATIONCLS) ){
				_self.candStore.remove(data); 					// 移除数据	

				// 取消选中 选择池选中状态
				_self.poolGrid._setDataSelect(data, false);							
			}			
		},
	
		// 点击查询 或者 分页 公用-- 异步数据方法
		searchPageEvent: function(pageObj){
			var _self = this;

			if(!_self.ValiForm.isValid()){
				return;
			}

			var	data = TL.encodeURIParam( TL.serializeToObject(_self.formEl) ), // encodeURI				
				endData = S.isObject(pageObj) ? S.merge(data, pageObj) : data;

			if(!endData['acname']){
				endData['acname'] = '';
			}	

			_self.poolStore.load(endData);
		},

    	// 提示方法
		_alertFn: function(msg, callback){
			var _self = this;

			(new O.Alert(msg, callback)).show();            
		}
	});

return SelectGrid;

}, {'requires':['mui/grid', 'Validation', 'TL', 'mui/placeholder', 'mui/overlay','mui/overlay/overlay.css', 'sizzle']});


