/** 
* @fileOverview 天猫双十一整点秒杀页面控制js -- 支持固定时间自动计算 和 自定义 不不规律时间
* @extends  KISSY.Base
* @creator  黄甲(水木年华double)<huangjia2015@gmail.com>
* @depends  ks-core
* @version  2.0  
* @update 2013-11-16 代码逻辑review 和 微调
*/        
 
KISSY.add('act/double11-come-on/spikectrl', function(S){
        var Event = S.Event,
            DOM = S.DOM,
            Ajax = S.io,
            S_Date = S.Date;

        // 常量 1       
        var DONECLS = 'doneCls',
            CURRCLS = 'currCls',
            FUTRUECLS = 'futrueCls',
            BLOCK_DATA_TIME = 'data-hour',
            BLOCK_TIME_LENGTH = 'data-timeLength'; 

        // 常量 2       
        var ONE_SECONDS = 1000,
            ONE_MINUTES = 1000*60,
            ONE_HOURS = 1000*60*60,
            ONE_DAY = 1000*60*60*24;

        var DAY_HOURS = 24;    
            
        // 默认配置
        var defCfg = {
           
            // 时间配置
            startTime: '2013-11-04 00:00:00',  
            endTime: '2013-11-11 23:59:59',

            // 无效时间 是否 隐藏 数据
            isInvalidTimeHide: true,

            // servic time 毫秒数
            serviceTime: 0,

            // 服务器时间接口
            url: 'http://www.tmall.com/go/rgn/get_server_time.php?spm=0.0.0.0.c01Zvr',

            // 是否 html 自定义 不规则 时间段 -- 若此处开启 则需要自己在 DOM结构上行 定义 伪类属性：data-timeLength 距离下个整点时间长度，直到24点
            isCustomTimePeriod: false,

            // 秒杀 间隔 小时
            hourLength: 2, 

            // 浏览其他区块 停留 时间 --  分钟
            viewResidenceTime: 0.5,

            // 本地对比时间误差值设置 主要是 初次差值 和 后续主动更新差值比较
            deviationSeconds: 2,

            // 秒杀结束 是否 可查看
            isPastView:false,

            // 秒杀结束 点击查看 标示样式
            clickPastTimeBlockCls: 'clickPastTimeBlock',

            // 即将秒杀是否 可查看
            isFutureView:true, 

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

            // ui更新时间 -- 秒
            updateUiSeconds: 5,

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
            * @param {Array} el.HtmlEl Dom元素
            */
            'passSpikeChange',
            
            /**  
            * 秒杀时间时间段 超时
            * @event currSpikeChange  
            * @param {event} el对象
            * @param {Array} el.HtmlEl Dom元素
            */
            'currSpikeChange',

            /**  
            * 秒杀时间时间段 超时
            * @event futureSpikeChange  
            * @param {event} el对象
            * @param {Array} el.HtmlEl Dom元素
            */
            'futureSpikeChange'   
        ];    


        S.extend(SpikeCtrl, S.Base);
        S.augment(SpikeCtrl, {

                // 控件 初始化
                _init: function(){
                    var _self = this;    
                       
                    _self._argumentsInit();
					
                    _self._showRangeTimeMeched(); 					
                    _self._blockStateRender(); 

                    _self._eventRender();
                    _self.startAutoUpdateUi();                      
                },

                // 全局变量初始化
                _argumentsInit: function(){
                    var _self = this;

                    _self._checkServiceTime();

                    _self._getRealTime();

                    // 时间段 导航 集合
                    _self.timeBlock = S.query( _self.get('timeBlockCls'),  _self.container );

                    // 各个时间段 秒杀 区块儿 活动内容区 集合
                    _self.aBlocks = S.query( _self.get('merchBlockCls'), S.get(_self.get('merchContainer')) );                    
                },

                // 获取 实时 时间参数
                _getRealTime: function(){
                    var _self = this;

                    _self.dataYMD = S_Date.format(_self.mainTime, 'yyyy-mm-dd');
                    _self.dataHMS = _self.getALLHMSstr(_self.mainTime);
                },

                // 检查 服务器 时间- 初始化 -- 无须修正
                _checkServiceTime: function(){
                    var _self = this,
                        localTime = S.now();

                    if(!_self.get('serviceTime')){
                        _self.mainTime = localTime;
                        _self.hasServiceTime = false;
                        return;
                    }

                    _self.mainTime = _self.get('serviceTime'); 
                    _self.hasServiceTime = true;

                    // 获取 初始化 时间差
                    _self.differenceTime = Math.abs( localTime - _self.mainTime ); 

                    // 确定 初始化 大小关系
                    if(localTime > _self.mainTime){
                        _self.localTimeMax = true;
                    }else if( localTime < _self.mainTime){
                        _self.localTimeMax = false;
                    }                   
                },

                // 差异修正方法
                _updateTime: function(localTime, differenceTime){
                    var _self = this,
                        localTime = S.now(),
                        diffRange = _self.get('deviationSeconds')*ONE_SECONDS;

                    // // 获取时间差 第二次模拟服务器和本地差异 vs 第一二次差异比较 、误差范围
                    // var secondSecondDiff = Math.abs( localTime - _self.mainTime ), 
                    //     firstSecondDiff = Math.abs( _self.differenceTime - secondSecondDiff );           

                    // 在允许误差内 视为 -- 无差异
                    // if(differenceTime <= diffRange){
                    //     _self.mainTime = localTime;
                    //     return;
                    // } 

                    // if(firstSecondDiff > diffRange){
                    //     S.log('时间错误! 你可能修改了您的电脑时间，为了保持秒杀精准度，请重新刷新您的页面确保时间准确性~'); 
                    // }

                    // 根据第一次 标尺 大小关系 修正 模拟服务器 时间差, 保持同步
                    if(_self.localTimeMax){
                        _self.mainTime = localTime - _self.differenceTime;
                    }else{
                        _self.mainTime = localTime + _self.differenceTime;
                    }
                },                

                // // 判断 服务器 和 本地时间
                // _updateTime: function(){
                //     var _self = this,
                //         localTime = S.now(),
                //         deviationRange = _self.get('deviationSeconds')*ONE_SECONDS;

                //     // 获取时间差 第二次模拟服务器和本地差异 vs 第一二次差异比较 、误差范围
                //     var secondSecondDiff = Math.abs( localTime - _self.mainTime ), 
                //         firstSecondDiff = Math.abs( _self.differenceTime - secondSecondDiff );                       

                //     // 修正时差    
                //     _self.timeCorrectFn(localTime, secondSecondDiff);

                //     if(firstSecondDiff > deviationRange){
                //         S.log('时间错误! 你可能修改了您的电脑时间，为了保持秒杀精准度，请重新刷新您的页面确保时间准确性~'); 
                //     }

                //     // // 纠正 模拟服务器 时间差, 保持同步- 增量/减量 推移
                //     // if( localTime > _self.mainTime ){
                //     //     S.log('时间错误! 你可能--"从当前向未来穿越时光"，修改了您的电脑时间，为了保持秒杀精准度，请重新刷新您的页面确保时间准确性~');    
                //     // }else if( localTime < _self.mainTime ){      
                //     //     S.log('时间错误! 你可能--"从当前向过去时光倒流"，修改了您的电脑时间，为了保持秒杀精准度，请重新刷新您的页面确保时间准确性~');       
                //     // }
                // },

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
                        curTime = DOM.attr(el, BLOCK_DATA_TIME);

                    S.each(_self.aBlocks, function(em){
                        var  blockTime = DOM.attr(em, BLOCK_DATA_TIME);

                        if(curTime === blockTime){
                            DOM.show(em);
                            _self.renderImgLazyLoad(em);
                        }else{
                            DOM.hide(em);
                        }                       
                    });
                },

                // 输出<10 数字 补全0 字符串
                getFullTimeStr: function(num){
                    var _self = this,
                        num = parseInt(num, 10);

                    if(!num && num !== 0 ){
                        return '';
                    }

                    return num < 10 ? '0'+ num : num;
                },

                // 根据 容器 个数 和 时间 配置参数 初始化 时间段  --- 自定义 整点 时间
                renderSelfTimeBlock: function(){
                    var _self = this;

                    S.each(_self.timeBlock, function(el, num){
                        var hoursContainer = S.one(el).first(_self.get('hoursContainerCls')),
                            curHourTime = parseInt(DOM.attr(el, BLOCK_DATA_TIME), 10),
                            nextEl = S.one(el).next(),
                            nextHourTime = nextEl ? parseInt( nextEl.attr(BLOCK_DATA_TIME), 10) : DAY_HOURS,
                            hourTimeLength = nextHourTime - curHourTime,
                            timeText = curHourTime + ':00';    

                        if(curHourTime > 23){
                            DOM.remove(el);
                            S.log('时间点 ' + BLOCK_DATA_TIME+ '="' + curHourTime + '" 配置无效！');
                            return;
                        }                       

                        // 写入 时间长度标示 和 文本字符串 小时时间    
                        DOM.attr(el, BLOCK_TIME_LENGTH, _self.getFullTimeStr(hourTimeLength));
                        hoursContainer.text(timeText);
                    });
                },

                // 根据 容器 个数 和 时间 配置参数 初始化 时间段  ---  参数配置 固定的 秒杀间隔小时 hourLength
                renderTimeBlock: function(){
                    var _self = this,
                        hourTimeLength = _self.get('hourLength');

                    S.each(_self.timeBlock, function(el, num){
                        var num = num + 1,
                            hoursContainer = S.one(el).first(_self.get('hoursContainerCls')),
                            timeRange = num*hourTimeLength - hourTimeLength,
                            timeRult = timeRange <= 0 ? '00' : ( timeRange < 10 ? '0'+ timeRange : timeRange ),
                            timeText = timeRult + ':00';
                        
                        if(timeRange > 23){
                            return;
                        }  

                        // 写入 时间标示 和 文本字符串 小时时间 
                        DOM.attr(el, BLOCK_DATA_TIME, timeRult);
                        hoursContainer.text(timeText);
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
                        _self._showRangeTimeMeched(); 
                    }
                },

                // 设定 文本状态 方法
                _renderStateAll: function(el, index){
                    var _self = this, 
                        hourTime = DOM.attr(el, BLOCK_DATA_TIME);

                    if(hourTime >= DAY_HOURS){
                        return;
                    }    

                    var hourLength = _self.get('isCustomTimePeriod') ? DOM.attr(el, BLOCK_TIME_LENGTH) : _self.get('hourLength'),                      
                        curDateStr = _self.dataYMD +' '+ hourTime + ':00:00',

                        spikeTimeStart = _self.getDateParse(curDateStr),
                        spikeTimeEnd = _self.offsetDateSeconds(curDateStr, hourLength, '+'),                       
                        
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

                // 是否在时间段内 - 包右不包左: 59':59" -- 59':59"
                isInTimeRange: function(startTime, curTime, endTime){
                    var _self = this;

                    if( startTime < curTime && curTime < endTime ){
                        return true;
                    }else{
                        return false;
                    }
                },

                // 有效期间内 设定时间段是否已经全部过时  
                /* _isAllPastDone: function(){
                    var _self = this,
                        isAllDone = true;

                    S.each(_self.timeBlock, function(el){
                        if(!DOM.hasClass(el, DONECLS)){
                            isAllDone = false;
                            return false;
                        }
                    });
					
                    return isAllDone;
                }, */

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

                // jsonp 获取服务端时间
                getServerTime : function(){
                    var _self = this;                   

                    Ajax.jsonp(_self.get('url'), function(data){
                        if(S.isString(data)){
                            try{
                                data = S.json.parse(data);
                            }catch(ec){
                                S.log('json数据转换出错：' + ec);
                            }                                    
                        }

                        _self.mainTime = data['serviceTime'];
                    });                    
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

                // 获取时分秒字符串 -- 毫秒数 输入
                getALLHMSstr: function(d){
                    var _self = this,
                        date = null;

                    if(!d){
                        return '';
                    }

                    if(S.isString(d)){
                        return d;
                    }

                    try {
                        date = new Date(d);
                    }catch(e){
                        return '';
                    }

                    if (!date || !date.getFullYear){
                        return '';
                    }

                    return S_Date.format(d, 'HH:MM:ss');
                },     

                // 选择性 获取 分 - 秒 3段指定 字符串 'HH:MM:ss' -- 为扩展 精确度 准备
                getSelectHMSstr: function(date, dateType){
                    var _self = this,
                        returnStr,
                        AateStr = _self.getALLHMSstr(date).split(':');

                    switch(dateType){
                        case 'H' : returnStr = AateStr[0];
                            break;

                        case 'M' : returnStr = AateStr[1];
                            break; 

                        case 'S' : returnStr = AateStr[2];
                            break;

                        default: returnStr = AateStr;             
                    }

                    return returnStr; 
                },
                
                // 小时偏移量 计算 -- 返回毫秒数
                offsetDateSeconds: function(date, offset, PreviousLater){
                    var _self = this,
                        dataParse = S.isString(date) ? _self.getDateParse(date) : ( S.isNumber(date) ? date : (new Date()).getTime() ),
                        offsetParse = offset ? (offset * ONE_HOURS) : 0, 
                        dataTime;

                    switch(PreviousLater){
                        case '+' : dataTime = dataParse + offsetParse;
                            break;

                        case '-' : dataTime = dataParse - offsetParse;
                            break;

                        default: dataTime = dataParse;
                    }

                    return dataTime;
                },

                // 根据日期时间字符串 返回日期对象 毫秒数
                getDateParse: function(dateStr){
                    return S_Date.parse(dateStr.replace(/\-/g,'/')).getTime();
                },

                // 自动刷新ui
                startAutoUpdateUi: function(){
                    var _self = this;

                    // 系统自动 轮询 监控 时间状态 
                    _self.stopAutoUpdateUi();
                    _self.autoUpdateIntvl = setInterval(autofn, _self.get('updateUiSeconds')*ONE_SECONDS );                     

                    function autofn(){
                        // 验证有效性
                        if(!_self.isValidDate()){                        
                            _self.allShowHideFn();
                            return;
                        } 

                        // 无服务器时间 ---- 更新本地时间
                        if(!_self.hasServiceTime){
                            _self.mainTime = S.now();

                        // 异步更新服务器时间    
                        }else if(_self.get('url')){
                            _self.getServerTime();
							
                        }else{
                        // 更新 修正 比较 时间
                            _self._updateTime();
                        }

                        // 更新实时 时间 数据
                        _self._getRealTime();

                        // 调用 ui 更新方法
                        _self._setStateText();                          
                    }
                },

                // 停止自动刷新
                stopAutoUpdateUi: function(){
                    var _self = this;

                    _self.autoUpdateIntvl && clearInterval(_self.autoUpdateIntvl);
                }
        });

    return SpikeCtrl;

}, {'requires':['calendar', './spikectrl.css']});