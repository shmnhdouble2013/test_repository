/** 
* @fileOverview 自动时间更新 及其丰富 的时间方法 js
* @extends  KISSY.Base
* @creator  黄甲(水木年华double)<huangjia2015@gmail.com>
* @depends  ks-core
* @version  1.0  
* @update 2013-11-21  本地、模拟、ajax异步 3套 时间更新机制
*/        
 
KISSY.add('spike_gallery/real-time', function(S){
        var Event = S.Event,
            DOM = S.DOM,
            Ajax = S.io,
            S_Date = S.Date;

        // 常量 2       
        var ONE_SECONDS = 1000,
            ONE_MINUTES = 1000*60,
            ONE_HOURS = 1000*60*60,
            ONE_DAY = 1000*60*60*24;

        var DAY_HOURS = 24,
            TIME = S.now();      
            
        // 默认配置
        var defCfg = {

            // 服务器初始化时间 默认 毫秒数 number、支持 标准时间字符串如：'2013-11-20 17:30:32'
            serviceTime: null,

            // 服务器时间接口
            url: '',
			
			// 是否是jsonp  --默认
			isJsonp: true,
			
			// 是否开启 自动更新
			isAutoUpdate: true,
			
            // 异步更新服务器时间 配置，需要大于等于1分钟 -- 默认
            ajaxUpMinutes: 1,

            // 本地时间更新频率 秒
            localTimeUpdate: 1              
        };  


        function RealTime(config){
            var _self = this;               

            _self.config = S.merge(defCfg, config);

            if( !(_self instanceof RealTime) ){
                return new RealTime(container, _self.config);
            }

            RealTime.superclass.constructor.call(_self, _self.config);

            _self._init();
        }


        // 支持的事件
        RealTime.events = [

            /**  _self.fire('localTimeUpdateMod', {"time": _self.mainTime});
            * 本地时间更新 模式发生
            * @event localTimeUpdateMod 
			* @param {number} ev.time 当前时间
            */
            'localTimeUpdateMod',
            
            /**  
            * 异步更新服务器时间 模式发生
            * @event ajaxTimeUpdateMod  
			* @param {number} ev.time 当前时间
            */
            'ajaxTimeUpdateMod',

            /**  
            * 本地时间差模拟 服务器时间 模式发生
            * @event simulationServerTimeMod  
			* @param {number} ev.time 当前时间
            */
            'simulationServerTimeMod'				
        ];    


        S.extend(RealTime, S.Base);
        S.augment(RealTime, {

                // 控件 初始化
                _init: function(){
                    var _self = this;    
                       
                    _self._argumentsInit();
                    _self._eventRender();
					
					if(_self.get('isAutoUpdate') ){
                        _self.startAutoUpdateTime();  
                    }else{
                        _self.stopAutoUpdateTime();
                    }                                   
                },

                // 全局变量初始化
                _argumentsInit: function(){
                    var _self = this;

                    _self._renderMainTime();               
                },
				
				// 获取当前时间 年月日 字符串
				getTimeYMDstr: function(){
					var _self = this;
					
					return S_Date.format(_self.mainTime, 'yyyy-mm-dd');
				},
				
				// 获取当前时间 时分秒 字符串
                getTimeHMSstr: function(){
                    var _self = this;
					
					return _self.getAllHMSstr(_self.mainTime);
                },

                // 初始化 主时间 
                _renderMainTime: function(){
                    var _self = this,
                        jsRenderTime = S.now() - TIME,
                        serviceTime = _self.get('serviceTime');

                    if(!S.isNumber(serviceTime)){
                        serviceTime = _self.getDateParse(serviceTime);
                    }    

                    if(!serviceTime && !_self.get('url') ){
                        _self.mainTime = S.now();
                        _self.hasServiceTime = false;
                        return;
                    }

                    if(serviceTime){
                        _self.mainTime = serviceTime + 0;   // 载入时间修正 

                        // 校正大小 和 差异重置
                        _self.serverLocalCompara();
                    }        
                },

                // 事件初始化
                _eventRender: function(){
                    var _self = this;
                  
                },

                // 获取服务器时间
                getCurrTime: function(){
                    var _self = this,
                        time = !_self.hasServiceTime ? _self.mainTime : null;

                    return _self.mainTime;
                },

                // 获取 服务器 与 本地差异
                getServerLocalDiff: function(){
                    var _self = this,
                        diffTime = _self.differenceTime ? _self.differenceTime : null;

                    return diffTime;
                },

                // 比较服务器与本地时间关系值
                serverLocalCompara: function(){
                    var _self = this,
                        localTime = S.now();

                    if(!_self.mainTime){
                        return;
                    }    
                        
                    // 获取 初始化 时间差
                    _self.differenceTime = Math.abs( localTime - _self.mainTime ); 

                    // 确定 初始化 大小关系
                    if(localTime > _self.mainTime){
                        _self.localTimeMax = true;
                    }else if( localTime < _self.mainTime){
                        _self.localTimeMax = false;
                    }     

                    return _self.localTimeMax;              
                },

                // 差异修正方法
                _correctionTime: function(){
                    var _self = this,
                        localTime = S.now();

                    _self.differenceTime = _self.differenceTime ? _self.differenceTime : 0;                           

                    if(_self.localTimeMax){
                        _self.mainTime = localTime - _self.differenceTime;
                    }else{
                        _self.mainTime = localTime + _self.differenceTime;
                    }
                },  

                // 是否在时间段内 -  01':00" -- 02':00"
                isInTimeRange: function(startTime, curTime, endTime){
                    var _self = this;

                    if( startTime < curTime && curTime < endTime ){
                        return true;
                    }else{
                        return false;
                    }
                },

                // jsonp 获取服务端时间
                getServerTime : function(){
                    var _self = this, 
                        stratTime = S.now(),                    
						dataType = _self.get('isJsonp') ? 'jsonp' : 'json',
						type = dataType === 'jsonp' ? 'get': 'post'; 
					
					Ajax({
						cache: false,
						url: _self.get('url'),
						dataType: dataType,
						type: type,
						data: null,
						success : function (data, textStatus, XMLHttpRequest) {
                            var localServerDiff = S.now() - stratTime;

							if(S.isObject(data)){
								_self.mainTime = data['serviceTime'];
							}
						
							if(S.isString(data)){
								try{
									data = S.json.parse(data);
								}catch(ec){
									S.log('json数据转换出错：' + ec);
								}  
								
								_self.mainTime = data['serviceTime'];						
							}

                            // 减少时差
                            _self.mainTime = _self.mainTime + localServerDiff;

                            // 校正大小 和 差异重置
                            _self.serverLocalCompara();
						}
					});
                },

                // 对 时分字符串时间 数组 从小到大 进行排序
                sortHMtimeArray: function(ary){
                    var _self = this;

                    if(!S.isArray(ary)){
                        return;
                    }

                    return ary.sort(timeStrSort);

                    function timeStrSort(a, b){
                        var a = _self.getMillisecond(a),
                            b = _self.getMillisecond(b);

                        return a - b;    
                    }
                },

                // 输出<10 数字 补全0 字符串
                addZeroFn: function(num){
                    var _self = this,
                        num = parseInt(num, 10);

                    if(!num && num !== 0 ){
                        return '';
                    }

                    return num < 10 ? '0'+ num : num;
                },

                /**
                * 根据时分秒 残缺信息 自动补全完整 合法时间字符串
                * @method autoComplement
                * @param {string} 时间字符串 小时 '3'
                * @param {string} 时间字符串 分钟 '19'
                * @param {string} 时间字符串 秒 null
                * @param {boolean} 是否不显示秒 false
                * @return {string} 时分秒字符串 如： '03:19:00'
                **/ 
                autoComplement: function(hour, minutes, seconds, isHideSeconds){
                    var _self = this,
                        ary,
                        zeroNorml = '00',
                        concat = ":";

                    var hour = hour ? _self.addZeroFn(hour) : zeroNorml,
                        minutes = minutes ? _self.addZeroFn(minutes) : zeroNorml,
                        seconds = seconds ? _self.addZeroFn(seconds) : zeroNorml;

                    if(isHideSeconds){
                        ary = [hour, minutes];   
                    }else{
                        ary = [hour, minutes, seconds];   
                    }
                        
                    return ary.join(concat); 
                },

                /**
                * 根据日期时间 获取 时分秒 字符串 -- 毫秒数 输入
                * @method getAllHMSstr(d)
                * @param {number} 毫秒数
                * @return {string} 时分秒 字符串
                */ 
                getAllHMSstr: function(d){
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

                /**
                * 根据 时分秒 字符串 获取 3段指定 时分秒 值
                * @method getSelectHMS(date, dateType)
                * @param {data} 日期时间
                * @param {string} 要获取的 时分秒 类型 H M S
                * @return {number || undefined}
                */
                getSelectHMS: function(hourMinutesStr, dateType){
                    var _self = this,
                        timeNum,
                        AateStr = hourMinutesStr ? hourMinutesStr.split(':') : [];

                    switch(dateType){
                        case 'H' : timeNum = parseInt(AateStr[0], 10);
                            break;

                        case 'M' : timeNum = parseInt(AateStr[1], 10);
                            break; 

                        case 'S' : timeNum = parseInt(AateStr[2], 10);
                            break;         
                    }

                    return timeNum; 
                },
                
                /**
                * 根据 时分秒 毫秒数 获取 时分 字符串
                * @method getHMstr(number)
                * @param {number} 时分秒 毫秒数
                * @return {string} 时分 字符串
                */
                getHMstr: function(hourMinutes){
                    var _self = this;

                    if(!S.isNumber(hourMinutes)){
                        return;
                    }

                    var alhours = hourMinutes/ONE_HOURS,
                        hour = parseInt(alhours, 10),
                        minuteses = (alhours - hour)*ONE_HOURS/ONE_MINUTES,
                        roundMinutes = Math.round(minuteses),
                        IntMinutes = parseInt( minuteses, 10), 
                        endTime = Math.abs(roundMinutes - minuteses) <= 0.0000000001 ? roundMinutes : IntMinutes; // 四舍五入 减少1分钟误差

                    return _self.autoComplement(hour, endTime, null, true);
                },

                /**
                * 根据 时分秒 字符串 获取毫秒数
                * @method getMillisecond(str)
                * @param {str} 时分秒 时间
                * @return {number} 时分秒 毫秒数 之和
                */
                getMillisecond: function(hourMinutesStr){
                    var _self = this;

                    if(S.isNumber(hourMinutesStr)){
                        return hourMinutesStr;
                    }

                    var hour = _self.getSelectHMS(hourMinutesStr, 'H'),
                        minutes = _self.getSelectHMS(hourMinutesStr, 'M'),
                        seconds = _self.getSelectHMS(hourMinutesStr, 'S');

                    var hourMillisecond = hour ? hour*ONE_HOURS : 0,
                        minutesMillisecond = minutes ? minutes*ONE_MINUTES : 0,
                        secondsMillisecond = seconds ? seconds*ONE_SECONDS : 0;
                        
                    return (hourMillisecond + minutesMillisecond + secondsMillisecond); 
                },

                // 小时偏移量 计算 -- 返回毫秒数
                offsetDateSeconds: function(date, offset, PreviousLater){
                    var _self = this,
                        dataParse = S.isString(date) ? _self.getDateParse(date) : ( S.isNumber(date) ? date : (new Date()).getTime() ),
                        offsetParse = offset ? offset : 0, 
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
                    var _self = this;

                    if(!dateStr){
                        return;
                    }

                    var dateOjb = S_Date.parse(dateStr.replace(/\-/g,'/')),
                        nums = dateOjb ? dateOjb.getTime() : 0;

                    return nums;
                },

                // 开启时间更新 和 ui更新
                startAutoUpdateTime: function(){
                    var _self = this;

					_self._ajaxUpdateTime();
                    _self._renderNewTime();
                },

                // 本地 时间 更新方法
                _renderNewTime: function(){
                    var _self = this,
                        updateTime = _self.get('localTimeUpdate') < 1 ? 1 : _self.get('localTimeUpdate'),
                        interTime = updateTime*ONE_SECONDS;

                    if(_self.autoCorrectionIntvl){
                        return;
                    }

                    _self.autoCorrectionIntvl = setInterval(autofn, interTime);                     

                    function autofn(){
                        // 更新主时间
                        _self._correctionTime();                       
                    }    
                },

                // 远程异步接口更新时间
                _ajaxUpdateTime: function(){
                    var _self = this,
                        ajaxUpMinutes = _self.get('ajaxUpMinutes') < 1 ? 1 : _self.get('ajaxUpMinutes'),
                        updateTime = ajaxUpMinutes*ONE_MINUTES;

                    // 无 url 或者 已经存在 循环定时器 退出    
                    if(!_self.get('url') || _self.ajaxTimeUpdate){
                        return;
                    }

                    _self.ajaxTimeUpdate = setInterval(function(){
                        _self.getServerTime();
                    }, updateTime);          
                },

                // 停止时间自动更新 -- 时间、ajax异步、本地纠正 循环
                stopAutoUpdateTime: function(){
                    var _self = this;

                    // 清除 ajax 异步更新服务器时间 循环
                    _self.ajaxTimeUpdate && clearInterval(_self.ajaxTimeUpdate);
					
					// 清除 本地 时间纠正 循环
                    _self.autoCorrectionIntvl && clearInterval(_self.autoCorrectionIntvl);
                }
        });

    return RealTime;

}, {'requires':['calendar']});