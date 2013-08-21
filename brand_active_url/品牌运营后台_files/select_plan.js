/* local file:D:\Apache2.2\htdocs\assets/trunk/g/tm/tbs-back/src/brand_active_url/select_plan.js */ /** 
* @fileOverview 品牌运营后台--品牌活动媒体选择
* @extends  KISSY.Base
* @creator  黄甲(水木年华double)<huangjia2015@gmail.com>
* @depends  ks-core
* @version 1.0  
* @update 2013-08-19
* @example
*   new Select_plan({
	});
*/	
KISSY.add('tm/tbs-back/blue_print/select_plan', function(S, O, Pagination, XTemplate, Validation, Store) {
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


	function Select_plan(config){
		var _self = this,
			config = S.merge({
				isMoveData: false,							// 是否 移动 选择池数据? 默认copy数据 false
				isPagination:false,							// 是否有分页 默认 为false
				isAjaxData:false							// 是否是异步数据 默认 为false	
			}, config);

		if( !(_self instanceof Select_plan) ){
			return new Select_plan(config);
		}

		Select_plan.superclass.constructor.call(_self, config);		

		_self._init();
	}

	// 继承于KISSY.Base  
	S.extend(Select_plan, S.Base);
	Select_plan.VERSION = 1.0;

	
	// _self.get('poolTableId'), 							// 选择池 table id钩子 多组表格勾选使用
	// _self.get('candTableId'), 							// 候选 table id钩子

	// _self.get('addMoreId'), 								// 批量添加 id
	// _self.get('removeMoreId'), 							// 批量移除 id

	// ajaxUrl: 'result.php?message=546876489745454',      	// 异步查询url  
	// pagepation: 'result.php?message=服务器端返回信息',	// 翻页url 	        	

	// pool_table_tpl: main_table,							// 选择池 table tbody tr 模板
	// poolData: mainData, 									// 选择池 静态数据 

	// candidate_table_tpl: select_table,					// 已候选 table tbody tr 模板
	// candidateData: selectData, 							// 已候选 table 静态数据


	S.augment(Select_plan, {

		// 控件 初始化
		_init: function(){
			var _self = this;


			_self._domRender();
			_self._validaRender();

			_self._initStore();
	        _self._eventRender();
		},

		// DOM初始化
		_domRender: function(){
			var _self = this;

			// 全局变量
			_self._tb_token_ = DOM.val('#J_csrf_token') || '';

			// 查询按钮
			_self._findData = _self.get('findBtn') || S.get('#J_finedData');

			// tr数据标示 默认为 id
			_self.trIndex = _self.get('trIndex') || 'id'; 

			// 存储全局表单 及其验证域
			_self.form = S.get('#J_hideform');


			

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
				poolTable = _self.get('poolTableId'),
				candTable = _self.get('candTableId');

			/******* 选择池table 事件监控 *******/

			// 绑定 选择池table 全选事件
			Event.delegate(poolTable, 'click', SELECTALLCLS, function(el){
				var el = el.target,
					isChecked = el.checked || D.attr(el, 'checked');

                _self.poolAllCheckData = self.selectedAllBox(poolTable, POOLCHECKBOXCLS, isChecked);
            });

            // 绑定 选择池table 添加事件
			Event.delegate(poolTable, 'click', TROPRATIONCLS, function(el){
                self._radioBoxClick(el);
            });

            // 绑定批量添加事件
			Event.on(_self.get('addMoreId'), 'click', function(){
				// 根据id获取数据
				_self.poolStore.getCount()

				// 加载候选table数据
				_self.candStore.setResult();
			});

			
			/******* 候选table 事件监控 *******/

            // 绑定 候选table 全选事件
			Event.delegate(candTable, 'click', SELECTALLCLS, function(el){
                var el = el.target,
					isChecked = el.checked || D.attr(el, 'checked');

                _self.candAllCheckData = self.selectedAllBox(candTable, CANDCHECKBOXCLS, isChecked);
            });

			// 绑定 候选table 移除事件
			Event.delegate(candTable, 'click', TROPRATIONCLS, function(el){
                self._radioBoxClick(el);
            });

            // 绑定批量移除事件
			Event.on(_self.get('removeMoreId'), 'click', function(){

			});

			// 
			Event.add(S.query('.J_hideShowBp'), 'click', function(el){
				_self._hideShowPb(el);
			});


			// 查询数据
			Event.on('#J_finedData', 'click', function(){

			});
		},




		
		
		


    	// 以下为公用方法 ********** 空函数，应对特殊 情况啥也不做或者初始化方法 **********

    	/*
		* @description 公用方法--- 遍历 选中/取消 既定文档作用域, 指定cls钩子的 checkbox, 设置checked状态
		* @param {string|boolean|document} class 钩子-- 是否选中 --- 文档作用域
		* @return {array} 选中的checkbox value值 数组
		*/
    	selectedAllBox: function(thatDoc, cls, isChecked){
    		var self = this,
    		    selectedAry = [],	
    			thatDoc = thatDoc || document, 
                groupRadios = S.query(cls, thatDoc);
                
            S.each(groupRadios, function(el){
            	var trID = DOM.val(el);

				if(isChecked){
					el.checked = 'checked';
					selectedAry.push(trID);
				}else{
					el.checked = '';
					DOM.removeAttr(el, 'checked');
				}               
            });

			return selectedAry;
    	},

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

return Select_plan;

}, {'requires':['mui/overlay','mui/overlay/overlay.css', 'gallery/pagination/2.0/index', 'xtemplate', 'Validation', 'store', 'sizzle']});