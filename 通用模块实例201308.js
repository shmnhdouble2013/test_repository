/** 
* @fileOverview 天猫首页抽奖页面 -- 砸天猫
* @extends  KISSY.Base
* @creator  黄甲(水木年华double)<huangjia2015@gmail.com>
* @depends  ks-core
* @version 1.0  
* @update 2013-07-09
* @example
*   new TmallLottery('.talet', {
  	animatName:[],
		runAnimaTime:{
			:
		}
	});
*/	

KISSY.add('tmallLottery', function(S, Validation, Calendar, O){
	var Event = S.Event,
		DOM = S.DOM,
		Anim = S.Anim,
		Ajax = S.io,
		S_Date = S.Date,
		JSON = S.JSON,
		UA = S.UA,
		win = window,
		doc = document;

	function TmallLottery(container, config){
		var _self = this;

		_self.container = S.query(container);
		_self.config = config;

		if( !(_self instanceof TmallLottery) ){
			return new TmallLottery(container, config);
		}

		TmallLottery.superclass.constructor.call(_self, config);

		_self._init();
	}

	S.extend(TmallLottery, S.Base);
	S.augment(TmallLottery, {

		// 控件 初始化
		_init: function(){
			var _self = this;
	
			_self._backDate();
			_self._validaRender();			
			_self._eventRender();
		},
		
		_DomRender: function(){
			var _self = this;

			// to do ..
		},

		// 校验实例化
		_validaRender: function(){
			var _self = this;

			Validation.Rule.add('startEndtime', '', function(value, text, config){
				var startValue = DOM.val(config.startInput),
					endValue = DOM.val(config.endInput),
					startTimes = _self.getDateParse(startValue),
					endTimes = _self.getDateParse(endValue);
									
				if(!startValue || !endValue){
					return '开始或结束时间不能为空！';
				}	

				if(startValue == endValue){
					return '开始时间和结束时间不能相同！';
				}

				if(startTimes> endTimes){
					return '开始时间不能大于结束时间！';
				}
			});	

			// 校验实例 
			_self.validform = new Validation('#J_tablForm', {
		        style:'under'
		    });	

			// 校验开始结束时间
			Event.on('#ac_startTime', 'change blur', function(){
				_self.validform.get('ac_endTime') && _self.validform.get('ac_endTime').isValid();
			});	
		},
		
		// 事件初始化
		_eventRender: function(){
			var _self = this;
			
			// 确定创建晒图活动
			Event.on('#sureCreate', 'click', function(){
				_self._sureCreatActiv();
			});

			// 日期控件 不可编辑
			Event.add('#ac_startTime, #ac_endTime', 'keyup', function(ev){
				DOM.val(ev.target, '');
			});
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
	       		}, true, 1500);	
			}
		},
		// 全部导出 
		_allSelect: function(){
			var _self = this;

			// 异步请求 导出
			var ajaxConfig = {
	                'url': _self.get('selectAllDown_url') || '',
	                'data': {
						'curTrId': DOM.val('#allDownloadId'),
						'operationType':'allDownload',
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

			// 全部导出 仅仅写入类型
			DOM.val('#operationType', 'allDownload');

			_self.form.submit();
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
		
		// 日历控件  公用 初始化方法
    	renderCalendar: function(container, cfg){
    		var _self = this;

    		if(!container){
    			return;
    		}

    		var calenderCfg = S.merge({
					showTime:true,
					popup:true,
		            triggerType:['click'],
		            closable:true // 选择后 关闭日历窗口
				}, cfg),
				calendarStr = container+'_obj',
				calendarObj = _self.get(calendarStr) || null; 

			if(!calendarObj){
				_self.set(calendarStr, new Calendar(container, calenderCfg) );
			}

			_self.get(calendarStr).render();

			// 点击后 填写日期数据
        	_self.get(calendarStr).on('timeSelect', function(e){
	            DOM.val(container,  S_Date.format(e.date, 'yyyy-mm-dd HH:MM:ss') );
	            _self.validform && _self.validform.isValid(); // 这里方便验证
	        });

	        return _self.get(calendarStr);
    	},

    	// 获取时间
    	getDateParse: function(dateStr){
			return Date.parse(dateStr.replace(/\-/g,'/'));
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

return TmallLottery;

}, {'requires':['gallery/validation/1.0/', 'calendar', 'calendar/assets/dpl.css', 'mui/overlay','mui/overlay/overlay.css']});
