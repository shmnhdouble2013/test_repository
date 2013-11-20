/** 
* @fileOverview 天猫双十一秒杀页面控制js -- 固定间隔时间 和 自定义 时/分时间字符串 数组 时间轴生成 和 状态控制
* @extends  KISSY.Base
* @creator  黄甲(水木年华double)<huangjia2015@gmail.com>
* @depends  ks-core
* @version  2.0  
* @update 2013-11-20  时间更新逻辑 抽出
**/
 
KISSY.add('spike_gallery/spikectrl', function(S){
        var Event = S.Event,
            DOM = S.DOM,
            Ajax = S.io;

        // 常量 1       
        var DONECLS = 'doneCls',
            CURRCLS = 'currCls',
            FUTRUECLS = 'futrueCls',
            VIEW_INDEX = 'data-index',
            BLOCK_DATA_TIME = 'data-time',
            BLOCK_TIME_LENGTH = 'data-timelength'; 

        // 常量 2       
        var ONE_SECONDS = 1000,
            ONE_MINUTES = 1000*60,
            ONE_HOURS = 1000*60*60,
            ONE_DAY = 1000*60*60*24;

        var DAY_HOURS = 24;      
            
        // 默认配置
        var defCfg = {
           
		    // 时间对象
			timeObj: null,	
		   
            // 时间配置
            startTime: '',  
            endTime: '',

            // 无效时间 是否 隐藏 数据
            isInvalidTimeHide: true,

            // 是否 html 自定义 不规则 时间段 -- 若此处开启 则需要 配置 下列 customTime 时间点数组
            isCustomTimePeriod: false,

            // 自定义时间点 数组 --- 支持 时间大小顺序 随机排列
            customTime: [], 

            // 秒杀时间 固定 间隔 -- 支持时分秒
            timeLength: null, 

            // 浏览其他区块 停留 时间 --  分钟
            viewResidenceTime: 2,

            // 秒杀结束 是否 可查看
            isPastView: false,

            // 秒杀结束 点击查看 标示样式
            clickPastTimeBlockCls: 'clickPastTimeBlock',

            // 即将秒杀是否 可查看
            isFutureView: true, 

            // 即将秒杀 点击查看 标示样式
            clickFutureTimeBlock: 'clickFutureTimeBlock',

            // 时间模块 css钩子
            timeBlockCls: '.j_timeBlock',

            // 小时时间容器
            hoursContainerCls: '.hours',

            // 状态文本 容器 钩子
            stateTextCls: '.state',

            // 过去文本
            pastStateText: '',

            // 当前文本
            currtStateText: '开抢',

            // 即将开始文本
            futureStateText: '即将开抢',
			
			// 是否开启 自动更新
			isAutoUpdateUi: true,

            // ui更新时间 -- 秒 -- 默认1秒钟 无需对外开放
            updateUiSeconds: 1,

            // 秒杀商品内容区块容器
            merchContainer: '#J_secondContent',

            // 时间段 展现商品 容器
            merchBlockCls: '.j_ul',

            // 活动区块内容 图片 伪类src属性 钩子 --- 若 图片懒加载 则为 data-ks-lazyload,否则图片展现不出来哈！ 不填写 默认为 data-src
            lazyLoadSrc: 'data-src'             
        };  


        function SpikeCtrl(container, config){
            var _self = this;               

            _self.container = S.get(container);
            _self.config = S.merge(defCfg, config);

            if( !(_self instanceof SpikeCtrl) ){
                return new SpikeCtrl(container, _self.config);
            }

            SpikeCtrl.superclass.constructor.call(_self, _self.config);

            _self._init();
        }


        // 支持的事件
        SpikeCtrl.events = [
            /**  
            * 秒杀时间时间段 超时
            * @event passSpikeChange  
            * @param {event} el对象
            * @param {Array} el.elTarget Dom元素
            */
            'passSpikeChange',
            
            /**  
            * 秒杀时间时间段 超时
            * @event currSpikeChange  
            * @param {event} el对象
            * @param {Array} el.elTarget Dom元素
            */
            'currSpikeChange',

            /**  
            * 秒杀时间时间段 超时
            * @event futureSpikeChange  
            * @param {event} el对象
            * @param {Array} el.elTarget Dom元素
            */
            'futureSpikeChange'   
        ];    


        S.extend(SpikeCtrl, S.Base);		
        S.augment(SpikeCtrl, {

                // 控件 初始化
                _init: function(){
                    var _self = this;    
                       
                    _self._argumentsInit();
					
                    _self._hideAllAcitve(); 					
                    _self._blockStateRender(); 

                    _self._eventRender();
					
					if(_self.get('isAutoUpdateUi') ){
                        _self._startUpdateUi(); 
                    }else{
                        _self.stopAutoUpdateUi();
                    }                                   
                },
				
                // 全局变量初始化
                _argumentsInit: function(){
                    var _self = this;
					
					S.extend(SpikeCtrl, _self.get('timeObj') );

                    _self._getRealTime();

                    // 时间段 导航 集合
                    _self.timeBlock = S.query( _self.get('timeBlockCls'),  _self.container );

                    // 各个时间段 秒杀 区块儿 活动内容区 集合
                    _self.aBlocks = S.query( _self.get('merchBlockCls'), S.get(_self.get('merchContainer')) );                    
                },

                // 获取 实时 时间参数
                _getRealTime: function(){
                    var _self = this;
					
                    _self.dataYMD = _self.getTimeYMDstr();
                },      

                // 初始化 时间 和 状态/文字
                _blockStateRender: function(){
                    var _self = this;

                    if(!_self.isValidDate() || _self.timeBlock.length === 0){
                        return;
                    }  

                    // 是否 自定义 不规则时间段 
                    if(_self.get('isCustomTimePeriod')) {
                        _self.renderSelfTimeBlock();
                    }else{
                        _self.renderTimeBlock();
                    }
                   
                    _self._setStateText();
                },

                // 渲染懒加载图片
                renderImgLazyLoad: function(container){
                    var _self = this,
                        Aimgs = S.query('img', container);

                    S.each(Aimgs, function(el){
                        var src = DOM.attr( el, _self.get('lazyLoadSrc'));

                        if(src){
                            DOM.attr( el, 'src', src);
                        }                        
                    }); 
                },

                // 事件初始化
                _eventRender: function(){
                    var _self = this;

                    // 监控点击事件
                    Event.on(_self.timeBlock, 'click', function(el){
                        _self._timeClickIf(this);
                    });
                },

                // 根据状态--判断是否查看 相应活动区块 
                _timeClickIf: function(el){
                    var _self = this,
                        tgsContainer = el,
                        hasPastTime = DOM.hasClass(tgsContainer, DONECLS),
                        hasCurrTime = DOM.hasClass(tgsContainer, CURRCLS),
                        hasFutureTime = DOM.hasClass(tgsContainer, FUTRUECLS);

                    // 过去是否可以查看    
                    if(_self.get('isPastView') && hasPastTime){                       
                        _self._showRangeTimeMeched(tgsContainer);
                        _self._clearAllClickCls();
                        DOM.addClass(el, _self.get('clickPastTimeBlockCls'));
                        _self._layzBackCurrView();
                    }    

                    // 即将开始 是否可以查看 
                    if(_self.get('isFutureView') && hasFutureTime){                        
                        _self._showRangeTimeMeched(tgsContainer);
                        _self._clearAllClickCls();
                        DOM.addClass(el, _self.get('clickFutureTimeBlock'));
                        _self._layzBackCurrView();
                    }

                    // 点击 当前查看     
                    if(hasCurrTime){
                        _self._clearAllClickCls();
                        _self._showRangeTimeMeched(tgsContainer);
                        _self.lazyBackTimeOut && clearTimeout(_self.lazyBackTimeOut);
                    }                      
                },

                // 点击 查看过去 或者 未来 活动视图后 延迟指定时间返回当前时间段面板
                _layzBackCurrView: function(){
                    var _self = this;

                    // 定时重启 自动更新
                    _self.lazyBackTimeOut && clearTimeout(_self.lazyBackTimeOut);
                    _self.lazyBackTimeOut = setTimeout(backfn, _self.get('viewResidenceTime')*ONE_MINUTES );

                    function backfn(){
                        // 显示 当前时间 活动
                        _self._showRangeTimeMeched(_self.currTimeBlock); 

                        // 清除click样式
                        _self._clearAllClickCls();
                    }
                },

                // 清除样式
                _clearClickBlockCls: function(j_cls, stateCls){
                    var _self = this,
                        pastBlocks = S.query( '.'+j_cls , _self.container);

                    S.each(pastBlocks, function(el){
                        DOM.removeClass(el, _self.get(stateCls));
                    });  
                },  

                // 清除 所有 click样式
                _clearAllClickCls: function(){
                    var _self = this;

                    _self._clearClickBlockCls(DONECLS, 'clickPastTimeBlockCls');
                    _self._clearClickBlockCls(FUTRUECLS, 'clickFutureTimeBlock');
                },

                // 1、传入元素参数--判断显示指定时间段活动内容;   2、不传递参数 默认 隐藏 所有 秒杀商品 区块
                _showRangeTimeMeched: function(el){
                    var _self = this,
                        showIndex = parseInt(DOM.attr(el, VIEW_INDEX), 10),
                        elNode = _self.aBlocks[showIndex];

                    _self._hideAllAcitve();

                    DOM.show(elNode);
                    _self.renderImgLazyLoad(elNode);  
                },

                // 隐藏所有秒杀 活动区块
                _hideAllAcitve: function(){
                    var _self = this;

                    S.each(_self.aBlocks, function(em){                       
                        DOM.hide(em);                     
                    });
                },

                
                // 根据 容器 个数 和 时间 配置参数 初始化 时间段  --- 自定义 不规则时间间隔 及 分 时间
                renderSelfTimeBlock: function(){
                    var _self = this,
                        tiems = _self.sortHMtimeArray(_self.get('customTime'));

                    if(!tiems){
                        return;
                    }    

                    S.each(_self.timeBlock, function(el, num){

                        var hoursContainer = S.one(el).first(_self.get('hoursContainerCls')),
                            data_hour = tiems[num],                         
                            nextDataHour = tiems[num+1] ? tiems[num+1] : ONE_DAY,
                            hourTimeLength = _self.getMillisecond(nextDataHour) - _self.getMillisecond(data_hour);    

                        if( _self.getSelectHMS(data_hour, 'H') > 23){
                            DOM.remove(el);
                            S.log('时间点 ' + BLOCK_DATA_TIME+ '="' + data_hour + '" 配置无效！');
                            return;
                        } 

                        if(!_self.getSelectHMS(data_hour, 'M')){
                            data_hour = _self.autoComplement(data_hour, null, null, true); 
                        }                     

                        // 写入 活动区块序号、时间、长度标示 和 文本字符串 小时时间  
                        DOM.attr(el, VIEW_INDEX, num); 
                        DOM.attr(el, BLOCK_DATA_TIME, data_hour);
                        DOM.attr(el, BLOCK_TIME_LENGTH, hourTimeLength);
                        hoursContainer && hoursContainer.text(data_hour);
                    });
                },

                
                // 根据 容器 个数 和 时间 配置参数 初始化 时间段  ---  参数配置 固定的 整点秒杀间隔小时
                renderTimeBlock: function(){
                    var _self = this,
						startSeconds = _self.getDateParse(_self.get('startTime')),
						beginTimeStr = _self.getAllHMSstr(startSeconds),
						
						beginHour = _self.getSelectHMS(beginTimeStr, 'H');
                        beginMinutes = _self.getSelectHMS(beginTimeStr, 'M'),
						beginEndStr = _self.autoComplement(beginHour, beginMinutes, null, true),
						beginSeconds = _self.getMillisecond(beginEndStr), 	
						
                        secondesTims = _self.getMillisecond(_self.get('timeLength')),
                        length = _self.timeBlock.length-1;
						
                    S.each(_self.timeBlock, function(el, num){
                        var hoursContainer = S.one(el).first(_self.get('hoursContainerCls')),
                            timeRange = !num ? beginSeconds : beginSeconds + num*secondesTims,
                            timeText = timeRange ? _self.getHMstr(timeRange) : beginTimeStr,
                            hour = _self.getSelectHMS(timeText, 'H');
                            minutes = _self.getSelectHMS(timeText, 'M'),
							endStr = _self.autoComplement(hour, minutes, null, true);

                        if( hour > 23 || (hour === 23 && minutes > 59) ){
                            DOM.remove(_self.timeBlock[num]);
                            return;
                        }    

                        // 写入 活动区块序号、时间、长度标示 和 文本字符串 小时时间  
                        DOM.attr(el, VIEW_INDEX, num); 
                        DOM.attr(el, BLOCK_DATA_TIME, endStr);
                        DOM.attr(el, BLOCK_TIME_LENGTH, secondesTims);
                        hoursContainer && hoursContainer.text(endStr);
                    });
                },
               

                // 状态 文本 和 样式 -循环
                _setStateText: function(){
                    var _self = this;

                    if(!_self.isValidDate()){                        
                        _self.allShowHideFn();
                        return;
                    } 

                    S.each(_self.timeBlock, function(el, index){
                        _self._renderStateAll(el, index);
                    });
                },

                // 隐藏 和 显示数据
                allShowHideFn: function(){
                    var _self = this;

                    if(_self.get('isInvalidTimeHide')){
                        _self.showHideFn( _self.timeBlock, false );
                        _self._hideAllAcitve(); 
                    }
                },

                // 设定 文本状态 方法
                _renderStateAll: function(el, index){
                    var _self = this,
                        timeStr = DOM.attr(el, BLOCK_DATA_TIME),
                        hour = _self.getSelectHMS(timeStr, 'H'),
                        minutes = _self.getSelectHMS(timeStr, 'M');

                    if(hour >= DAY_HOURS){
                        return;
                    }  

                    var timeLengthSeconds = parseInt(DOM.attr(el, BLOCK_TIME_LENGTH), 10);
                        curDateStr = _self.dataYMD +' '+ _self.autoComplement(hour, minutes);
                        spikeTimeStart = _self.getDateParse(curDateStr),
                        spikeTimeEnd = _self.offsetDateSeconds(curDateStr, timeLengthSeconds, '+'),                      
                        isLastBlock = (_self.timeBlock.length-1) === index,
                        dayEndTimeSeconds = _self.getDateParse(_self.dataYMD +' 23:59:59') + ONE_SECONDS;    

                    if(!el){
                        return;
                    }  
  
                    // 3段 判断法：除去 过去和现在，剩下将来； 是否 过去 时间 - 逻辑判断改为 结束终点
                    if(spikeTimeEnd < _self.mainTime){ 
                        _self._addPastState(el);

                    // 是否 当前 时间 段:  < 设定-1秒  && <= 设定+间隔- 1秒  vs // 不足24小时情况, 则停留最后 一个时间点上     
                    }else if( _self.isInTimeRange(spikeTimeStart, _self.mainTime, spikeTimeEnd) || _self.isInTimeRange(spikeTimeStart, _self.mainTime, dayEndTimeSeconds) && isLastBlock ){                       
                        _self._addCurrState(el);

                    // 是否 未来 时间  
                    }else{
                        _self._addFutureState(el);                    
                    }
                },

                // 添加过去样式
                _addPastState: function(el){
                    var _self = this,
                        hasPastTime = DOM.hasClass(el, DONECLS),                      
                        textContainer = S.one(el).first(_self.get('stateTextCls'));
                    
                    if(hasPastTime){
                        return;
                    }   

                    // 操作前 先 清空状态( 样式和文案 )
                    _self._clearCls(el);     

                    DOM.addClass(el, DONECLS);
                    DOM.text(textContainer, _self.get('pastStateText'));

                    _self.fire('passSpikeChange', {"elTarget":el});  
                },

                // 添加当前样式
                _addCurrState: function(el){
                    var _self = this,
                        hasCurrTime = DOM.hasClass(el, CURRCLS),
                        textContainer = S.one(el).first(_self.get('stateTextCls'));
                    
                    if(hasCurrTime){
                        return;
                    }   

                    // 操作前 先 清空状态( 样式和文案 )
                    _self._clearCls(el);
                      
                    DOM.addClass(el, CURRCLS);
                    DOM.text(textContainer, _self.get('currtStateText'));
                    
                    // 展现当前 秒杀内容
                    _self._showRangeTimeMeched(el);

                    // 存储目标
                    _self.currTimeBlock = el;    

                    _self.fire('currSpikeChange', {"elTarget":el});
                },

                // 添加即将秒杀样式
                _addFutureState: function(el){
                    var _self = this,                        
                        hasFutureTime = DOM.hasClass(el, FUTRUECLS),
                        textContainer = S.one(el).first(_self.get('stateTextCls')); 
                    
                    if(hasFutureTime){
                        return;
                    }                      
                     
                    // 操作前 先 清空状态( 样式和文案 )
                    _self._clearCls(el);
                      
                    DOM.addClass(el, FUTRUECLS);
                    DOM.text(textContainer, _self.get('futureStateText'));

                    _self.fire('futureSpikeChange', {"elTarget":el});
                },

                // 清空 样式 钩子 和 状态值
                _clearCls: function(el){
                    var _self = this,
                        textContainer = S.one(el).first(_self.get('stateTextCls'));

                    DOM.removeClass(el, DONECLS);
                    DOM.removeClass(el, CURRCLS);
                    DOM.removeClass(el, FUTRUECLS);

                    if(textContainer){
                        DOM.text(textContainer, '');
                    }
                }, 

                // 判断日期 总区段 有效性
                isValidDate: function(){
                    var _self = this,
                        startTime = _self.getDateParse(_self.get('startTime')),
                        endTime = _self.getDateParse(_self.get('endTime'));
                    
                    return _self.isInTimeRange(startTime, _self.mainTime, endTime);
                },  

                // 隐藏或者显示所有 时间 段区块儿
                showHideFn: function(ary, isShow, callBack){
                    var _self = this,
                        callBack = S.isFunction(callBack) ? callBack : null;

                    S.each(ary, function(em, index){   
                        if(isShow){
                            DOM.show(em);
                        }else{
                            DOM.hide(em);
                        } 

                        callBack && callBack.call(_self, em, index);                      
                    });
                },

                // 有效期间内 设定时间段是否已经全部过时  
                _isAllPastDone: function(){
                    var _self = this,
                        isAllDone = true;

                    S.each(_self.timeBlock, function(el){
                        if(!DOM.hasClass(el, DONECLS)){
                            isAllDone = false;
                            return false;
                        }
                    });
                    
                    return isAllDone;
                },

                // 本地更新：时间、ui 方法
                _startUpdateUi: function(){
                    var _self = this,
                        updateTime = _self.get('updateUiSeconds') < 1 ? 1 : _self.get('updateUiSeconds');

                    if(_self.autoUpdateIntvl){
                        return;
                    }

                    _self.autoUpdateIntvl = setInterval(autofn, updateTime*ONE_SECONDS );                     

                    function autofn(){
						// 更新 当前时间 年月日
						_self._getRealTime();
					
                        // 调用 ui 更新方法
                        _self._setStateText();                          
                    }    
                },

                // 停止自动更新 -- 清除 时间、ui、ajax异步 更新 循环
                stopAutoUpdateUi: function(){
                    var _self = this;

                    // 清除 本地 ui 时间更新 循环
                    _self.autoUpdateIntvl && clearInterval(_self.autoUpdateIntvl);                   
                }
        });

    return SpikeCtrl;

}, {'requires':['./spikectrl.css']});