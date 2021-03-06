/** 
* @fileOverview 品牌运营后台--晒图内容管理
* @extends  KISSY.Base
* @creator  黄甲(水木年华double)<huangjia2015@gmail.com>
* @depends  ks-core
* @version 1.0  
* @update 2013-07-22
* @example
*   new BpContMgt({
	});
*/	
KISSY.add('tm/tbs-back/blue_print/BpContMgt', function(S, Tbsui, O, LightBox, TL, IO) {
	var DOM = S.DOM,
		Ajax = IO,
		Event = S.Event,
		S_Date = S.Date;

	function BpContMgt(config){
		var _self = this;

		if( !(_self instanceof BpContMgt) ){
			return new BpContMgt(config);
		}

		BpContMgt.superclass.constructor.call(_self, config);

		_self._init();
	}

	S.extend(BpContMgt, S.Base);
	S.augment(BpContMgt, { 
		// 控件 初始化
		_init: function(){
			var _self = this;
			
			_self.form = S.get('#J_hideform');

			// ui库 模拟框
			_self.Otbsui = new Tbsui({
	            selector:['checkbox']
	        });

	        // 批量初始化 浏览大图	       
        	new LightBox({
	            container: '.ui-table', 	//父级盒子ID
	          	eles: ".J_lightbox", 		//需要弹出的图片外部链接样式
	            layer: "#lightbox",			//弹出层ID
	          	prev: "#lightbox .prevbtn", //上一张按钮
	          	next: "#lightbox .nextbtn"  //下一张按钮
	        });

	        _self._eventRender();
		},

		// 校验实例化
		_validaRender: function(){
			var _self = this;

		},

		// 事件初始化
		_eventRender: function(){
			var _self = this;

			// 全局变量
			_self._tb_token_ = DOM.val('#J_csrf_token') || '';
			_self.selectInpt = S.query('.j_select'); 						// tr checkbox 复选框 nodelist 
			_self.select_all_Inpt = S.query('input[name="select-num"]'); 	// 全选按钮 + 每条tr 数据 复选框 checkbox

			_self.allDownloadTagA = S.get('#J_allSelect'), 					// 全部导出按钮			
			_self.selectDownloadTagA = S.get('#J_selectDown'), 				// 勾选导出按钮

			_self.allSelectDownBeforeCls = DOM.attr(_self.allDownloadTagA, 'class'); //全部导出 正常class 
			_self.selectDownBeforeCls = DOM.attr(_self.selectDownloadTagA, 'class'); //勾选导出 正常class


			// 勾选导出
			Event.on(_self.selectDownloadTagA, 'click', function(el){
				_self._selectDownBefore(el);
			});

			// 全部导出
			Event.on(_self.allDownloadTagA, 'click', function(el){
				_self._allSelectDownBefore(el);
			});

			// 晒图活动 置顶
			Event.on(S.query('.J_topSetBp'), 'click', function(el){
				_self._topSetBefore(el);
			});

			// 隐藏/显示 晒图
			Event.add(S.query('.J_hideShowBp'), 'click', function(el){
				_self._hideShowPb(el);
			});

			// 监控排序写入 排序字段和排序方法
		    Event.add('th a', 'click', function(ev){
		        _self._sortfn(ev);
		        _self.form.submit();	
		    });

			// checkox 勾选
			_self.Otbsui.on('checkboxClick', function(el){
				// 全部选中
				_self._allSelected(el);				
			});			
		},



		// ********** 勾选导出前置初始化 ********  
		_selectDownBefore: function(){
			var _self = this,
				isLoading = DOM.attr(_self.selectDownloadTagA, 'data-loading'),
				selectAry = _self._addTrId();

			if(!isLoading){

				// 若选中为空则提示勾选
				if(selectAry.length <= 0){
					_self._alertFn('当前选择为空，请选择勾选后再导出！');
				}else{
					// 禁用 所有 导出 btn
					_self._disabledDownloadBtn();

					// 勾选
					_self._selectDown(selectAry);
				}
			}
		},
		// 勾选导出操作
		_selectDown: function(selectAry){
			var _self = this;
		
			// 异步请求 导出
			var ajaxConfig = {
                'url': _self.get('selectDown_url') || '',
                'data': {
					'curTrId': selectAry.join(','),
					'oprationType':'selectDown',
					'_tb_token_':_self._tb_token_
				}
            };           
			_self._ajaxAllConfig(ajaxConfig, _self._cancelSelect, _self._selectFailFn, _self._selectFailFn);	
		},
		// 勾选成功后 取消选择 + 解禁btn
		_cancelSelect: function(){
			var _self = this;
 			
 			_self._enabledDownloadBtn();

			_self.Otbsui.radioBox_Checked_Set('select-num', false);
		},
		// 勾选导出失败回调
		_selectFailFn: function(data){
			var _self = this;

			_self._enabledDownloadBtn();
			//_self._alertFn( data.message || '操作失败！' );
		},
		// 添加trid 方法
		_addTrId: function(){
			var _self = this,
				selectedAry = [];			

			S.each(_self.selectInpt, function(el){
				var hasSelect = DOM.hasClass(el, 'j_select'),
					trID = DOM.attr(el, 'data-no');

				if(!hasSelect){
					return;
				}	

				if(el.checked){
					selectedAry.push(trID);
				}
			});	

			// DOM.val('#J_tr-idstr', selectedAry.join(',') );
			return selectedAry;
		},



		// ********** 全部导出前置初始化 ******** 
		_allSelectDownBefore: function(){
			var _self = this,	
				isLoading = DOM.attr(_self.allDownloadTagA, 'data-loading');

			if(!isLoading){

				// 禁用 所有 导出 btn
				_self._disabledDownloadBtn();

				// 全部导出
				_self._dlayTimeDo('interValFineDowload', function(){ 
	            	_self._allSelect();
	       		}, true, 1000);	
			}
		},
		// 全部导出 
		_allSelect: function(){
			var _self = this;

			// 异步请求 导出
			var ajaxConfig = {
	                'url': _self.get('selectAllDown_url') || '',
	                'data': {
						'curTrId': 'all',
						'oprationType':'allDownload',
						'_tb_token_':_self._tb_token_
					}
            };   		
           _self._ajaxAllConfig(ajaxConfig, _self._pollOkCall, _self._erorReqst, _self._pollOkCall);            
		},		
		// 轮询正常情况 callback -- 取消轮询 和 loading状态
		_pollOkCall: function(){
			var _self = this;

			_self._cancelTimeout('interValFineDowload', true);
			_self._enabledDownloadBtn();
		},
		// 轮询 非正常错误提示
		_erorReqst: function(data){
			var _self = this;

			if(!data.success){
				if(data.error){
					_self._pollOkCall();				
				}else{
					_self._empotyFn();
				}		
			}					
		},


		// ********** 勾选 和 全部导出 公用代码 -- 禁用 导出按钮 **********
		_disabledDownloadBtn: function(){
			var _self = this;

			// 勾选btn
			_self._preventRepeatClick(_self.selectDownloadTagA, true);

			// 全选btn
			_self._preventRepeatClick(_self.allDownloadTagA, true);
		},
		// 勾选 和 全部导出 公用代码 -- 解禁还原 导出按钮
		_enabledDownloadBtn: function(){
			var _self = this;

			// 勾选btn
			_self._preventRepeatClick(_self.selectDownloadTagA, false, _self.selectDownBeforeCls);

			// 全选btn
			_self._preventRepeatClick(_self.allDownloadTagA, false, _self.allSelectDownBeforeCls);
		},


		// 全选操作
		_allSelected: function(el){
			var _self = this,
				inputPro = el.inputTarget,			
				hasAllSelect = DOM.attr(inputPro, 'id') == 'j_select_all' ? true : false,
				checkedStr;

			if(hasAllSelect){

				if(el.isChecked){
					// checkedStr = 'checked';					
				}else{
					// checkedStr = '';
				}					

				// S.each(_self.selectInpt, function(elm){
				// 	elm.checked = checkedStr;
				// });

				_self.Otbsui.radioBox_Checked_Set(inputPro, el.isChecked);
			}

			// _self.Otbsui.radioBox_UiRender(_self.selectInpt);
		},

		// 隐藏 显示 晒图活动
		_hideShowPb: function(el){
			var _self = this,
				trID = DOM.attr(el.target, 'data-no');

			_self.hideShowEl = el;

			// 异步请求
			var ajaxConfig = {
                'url': _self.get('showhide_url') || '',
                'data': {
					'curTrId': trID,
					'oprationType':'showHidePb',
					'_tb_token_':_self._tb_token_
				}
            };   

			_self._ajaxAllConfig(ajaxConfig , _self._hideShowOk);	
		},
		// 显示隐藏晒图ok
		_hideShowOk: function(){
			var _self = this,
				btnTarget = _self.hideShowEl.target,
				tggleValue = DOM.text(btnTarget) == '隐藏晒图' ? '显示晒图' : '隐藏晒图',
				curTr = S.one(btnTarget).parent('td').parent('tr');

			// 改变文字颜色	
			DOM.toggleClass(curTr, 'gray-color');

			// 更改文字			
			DOM.text(btnTarget, tggleValue);
		},


		// ********** 置顶 前置初始化 ********  
		_topSetBefore: function(el){
			var _self = this,
			    targetSelectA = el.target,
				classStr = DOM.attr(targetSelectA, 'class'),
				isLoading = DOM.attr(targetSelectA, 'data-first');
			
			_self.topSetBeforeA = targetSelectA;

			if(!isLoading){
				_self._topSet(el);
			}			
		},
    	// 置顶操作
    	_topSet: function(el){
    		var _self = this,
    			trID = DOM.attr(el.target, 'data-no');

    		// 异步请求
			var ajaxConfig = {
                'url': _self.get('topset_url') || '',
                'data': {
					'curTrId': trID,
					'oprationType':'topsite',
					'_tb_token_':_self._tb_token_
				}
            };   

			_self._ajaxAllConfig(ajaxConfig, _self._seTopOk, null, _self._empotyFn);		
    	},
    	// 置顶成功后 禁用btn
		_seTopOk: function(){
			var _self = this;

			DOM.text(_self.topSetBeforeA, '已置顶晒图');
			DOM.attr(_self.topSetBeforeA, 'data-first', 'no');
			DOM.attr(_self.topSetBeforeA, 'class', 'ui-btn-l ui-btn-disable');
		},

		
		// 添加 排序字段 和 排序方式 到隐藏域
		_sortfn: function(ev){
		    var _self = this,
	            ascStr = '',
	            trget = ev.target,
	            eli = DOM.first(trget, 'i'), 
	            sortStr = DOM.attr(trget, 'data-value');

	        if( DOM.hasClass(eli, 'dsc') ){
	            ascStr = 'asc';
	        }else if( DOM.hasClass(eli, 'asc') ){
	            ascStr = 'dsc';
	        }else{
	            sortStr = '';
	        }     

	        DOM.val('#J_sortStr', sortStr); // 排序字段
	        DOM.val('#J_dsc', ascStr); 		// 排序方式 direction -- asc dsc
		},		


    	// 以下为公用方法 ********** 空函数，应对特殊 情况啥也不做或者初始化方法 **********
    	_empotyFn: function(){
    		var _self = this;
    	},

    	// loading状态 和 tag标示 + tag样式标签
		_preventRepeatClick: function(elem, isLoading, disableCls){
			var _self = this,
				disableCls = disableCls || 'ui-btn-l ui-btn-disable';

			if(isLoading){				
				DOM.attr(elem, 'data-loading', 'Loading');
				DOM.show('#J_loading');
			}else{
				DOM.attr(elem, 'data-loading', '');
				DOM.hide('#J_loading');
			}
			DOM.attr(elem, 'class', disableCls);
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
				// _self.form.submit();	
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
		},

		// 公用 ajax方法 状态 only one 
		ajaxState: function(startfn, endfn, errorfn){
			var _self = this;
			 // var	errorfn = errorfn || endfn;

			// start 状态
			Ajax.on("send", function(){
			    S.isFunction(startfn) && startfn.call(_self);
			});
			// end 状态
			Ajax.on("complete", function(){
			    S.isFunction(endfn) && endfn.call(_self);
			});
			// error 状态
			Ajax.on("error", function(){
			    S.isFunction(errorfn) && errorfn.call(_self);
			});
		},

		// 公用方法 ------ 延迟处理方法
        _dlayTimeDo: function(cancelName, callback, isIntervalfn, time){
           var _self = this,
                time = time || 300;
               
           	if(time<1){
                return;
           	}
           
           	if(isIntervalfn){                    
                _self.set(cancelName, setInterval(callback, time) );
           	}else{
                _self.set(cancelName, setTimeout(callback, time) );
           	}          
        },
          
      	// 取消延迟执行 
     	_cancelTimeout: function(cancelTimeText, isIntervalfn){
           var _self = this,
	            cancelTimeobj = _self.get(cancelTimeText);
	                
            if(!cancelTimeobj){
                return;
            }
           
            if(isIntervalfn){
                clearInterval(cancelTimeobj);
            }else{
                clearTimeout(cancelTimeobj);
	   		}               
      	}

	});

return BpContMgt;

}, {'requires':['tbsui', 'mui/overlay','mui/overlay/overlay.css', 'gallery/lightBox/1.0/index','gallery/lightBox/1.0/index.css', 'TL', 'ajax', 'sizzle']});