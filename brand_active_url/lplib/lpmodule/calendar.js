/** 
* @fileOverview Calendar业务组件
* @author  fuzheng
* @version 1.0
*/
KISSY.add(function(S){
    /**
        @exports S.LP as KISSY.LP
	*/
	var DOM = S.DOM,
		Event = S.Event;

	var CLS_READONLY = 'readonly',
		CLS_CALENDAR = 'ks-select-calendar',
		CLS_CALENDARTIME = 'calendar-time';

	/**
	* Calendar校验基类
	* @description 管理日历组件校验的一些方法
	* @class Calendar校验基类
	* @param {Object} validation 校验配置项
	* @param {Object} [validation.validater] 表单校验对象 默认为 null
	* @param {Object} [validation.rules] 校验规则集 默认为 {}
	*/
	function CalendarValidation(validation){
		var _self = this;
		validation = S.merge(CalendarValidation.validation, validation);
		CalendarValidation.superclass.constructor.call(_self, validation);
	}
	CalendarValidation.validation = {
		validater: null,
		rules: {}
	};
	S.extend(CalendarValidation, S.Base);
	S.augment(CalendarValidation, {
		/**
		* 重写 S.Base 的set 方法，默认设置时不触发事件
		* @protect
		*/
		set:function(key,value){
			CalendarValidation.superclass.set.call(this,key,value,{silent:1});
		},	
		/**
		* 获取外部写入的校验方法，将其绑定当前对象作为上下文
		* @return {Object} 返回绑定好上下文的校验方法集
		*/
		getOutSideRules: function(){
			var _self = this,
				defaultRules = _self._rules ? _self._rules() : {},
				outSideRules = S.merge(defaultRules, _self.get('rules')),
				_outSideRules = {};
			S.each(outSideRules, function(rule, key){
				if(S.isFunction(rule)){
					_outSideRules[key] = rule.call(_self);
				}else{
					_outSideRules[key] = rule;
				}
			});
			return _outSideRules;
		},
		/**
		* 添加校验规则
		* @param {Object} rules 规则集
		* @return {Object} 当前对象
		*/
		addRules: function(rules){
			rules = S.merge({required: false}, rules);
			var _self = this,
				_rules = {};
			S.each(rules, function(rule, key){
				if(!S.isFunction(rule)){
					_rules[key] = rule;
				}else{
					_self._setFuncRules(key, rule);
				}
			});
			if(!S.isEmptyObject(_self._getFuncRules())){
				_rules['func'] = _self._runFuncRules();
			}
			if(!S.isEmptyObject(_rules)){
				_self._addRule(_rules);			
			}	
			return _self;
		},
		// 增加自定义验证方法
		_setFuncRules: function(key, rule){
			var _self = this,
				funcRules = _self.get('funcRules') || {};
			if(S.isEmptyObject(funcRules)){
				_self.set('funcRules', funcRules);
			}
			if(S.isFunction(rule)){
				funcRules[key] = rule;
			}
		},
		// 获取自定义验证方法集合
		_getFuncRules: function(){
			var _self = this;
			return _self.get('funcRules');
		},
		// 执行自定义验证方法
		_runFuncRules: function(){
			var _self = this;
			return function(value){
				var that = this,
					result = null;
				S.each(_self._getFuncRules(), function(rule, key){
					result = rule.call(that, value);
					if(result){
						return false;					
					}
				});	
				return result;
			};
		}			
	});


	/**
	* Calendar组件类
	* @memberOf S.LP
	* @description 生成单个日历并可以绑定校验规则
	* @class Calendar单日历组件
	* @param {String} triggerId 触发日历的文本框的ID
	* @param {Object} [config] 日历配置项 完全符合kissy的日历配置项
	* @param {Object} [validation] 校验配置项
	* @param {Object} [validation.validater] 表单校验对象 默认为 null
	* @param {Object} [validation.rules] 校验规则集 默认为 {}
	* @example 
	* //配置示例
	*	new Calendar('time', {showTime: true},{'validater': formValidater, 'rules': {
	*		beforeNow: Calendar.rules.beforeNow(),
	*	}});
	*/
	function Calendar(triggerId, config, validation){
		var _self = this;
		if(!triggerId || !S.get('#' + triggerId)){
			throw 'please assign the id of rendered Dom!';
		}	
		_self.set('triggerId', triggerId);
		_self.set('trigger', S.one('#' + triggerId));

		config = S.merge(Calendar.config,config);
		_self.set('config', config);

		validation = S.merge(Calendar.validation, validation);
		Calendar.superclass.constructor.call(_self, validation);
		//支持的事件
		_self.events = [
			/**  
			* 手动清空输入框里的值时触发该事件
			* @name S.LP.Calendar#dateclear
			* @event  
			* @param {event} e  事件对象
			* @param {String} e.value 清空前的值
			*/
			'dateclear'	
		];

		_self._init();
	}
	Calendar.config = {
		popup:true,
		triggerType:['click'],
		showTime: false
	};
	Calendar.validation = {};
	S.extend(Calendar, CalendarValidation);
	S.augment(Calendar, 
	/** @lends  S.LP.Calendar.prototype */		
	{
		/**
		* 获取日历输入框对象
		* @return {Object} 日历输入框对象
		*/
		getTrigger: function(){
			return this.get('trigger');
		},
		/**
		* 获取日历输入框的校验对象
		* @return {Object} 日历输入框的校验对象
		*/
		getValidaterField: function(){
			var _self = this,
				validater = _self.get('validater'),
				triggerId = _self.get('triggerId');
				return validater ? validater.get(triggerId) : null;
		},
		/**
		* 获取日历对象
		* @return {Object} 日历对象
		*/
		getCalendar: function(){
			return this.get('calendar');
		},
		/**
		* 销毁Calendar对象
		* @return {Object} 当前对象
		*/
		destroy: function(){
			var _self = this,
				calendar = _self.getCalendar(),
				validater = _self.get('validater'),
				trigger = _self.getTrigger(),
				triggerId = _self.get('triggerId');

			calendar.detach();
			calendar.destroy();

			trigger.detach();
			if(validater){
				validater.fields.remove(triggerId);
			}
			trigger.remove();

			_self.detach();
			return _self;
		},
		/**
		* 触发当前日历对象的校验
		* @return {Boolean} 是否校验通过，若没有校验规则，则有值就为true
		*/
		isValid: function(){
			var _self = this;
			return _self.getValidaterField() ? _self.getValidaterField().isValid() : !!_self.getTrigger().val();
		},
		// 初始化
		_init: function(){
			var _self = this,
				trigger = _self.getTrigger(),
				config = _self.get('config'),
				showTime = config.showTime,
				calendar,
				format,
				selectEvent;

			// 取消只读，设置样式
			if(trigger.hasAttr(CLS_READONLY)){
				trigger.removeAttr(CLS_READONLY);
			}
			if(!trigger.hasClass(CLS_CALENDAR)){
				trigger.addClass(CLS_CALENDAR);
			}
			if(showTime && !trigger.hasClass(CLS_CALENDARTIME)){
				trigger.addClass(CLS_CALENDARTIME);
			}	
			// 设置回显
			config = _self._echoDate();
			// 实例化日历
			calendar = new S.Calendar(trigger, config);
			_self.set('calendar', calendar);
			// 设置格式化格式
			format = showTime ? 'yyyy-mm-dd HH:MM:ss' : 'yyyy-mm-dd';
			_self.set('format', format);			
			// 设置选中事件
			selectEvent = showTime ? 'timeSelect' : 'select';
			_self.set('selectEvent', selectEvent);

			// 绑定事件
			_self._initEvent();
			// 添加校验
			_self._initRule();
		},
		// 初始化事件
		_initEvent: function(){
			var _self = this,
				calendar = _self.getCalendar(),
				trigger = _self.getTrigger(),
				format = _self.get('format'),
				selectEvent = _self.get('selectEvent');

			// 绑定选中事件
			calendar.on(selectEvent, function(ev){
				trigger.val(Calendar.formatDate(ev.date, format));
				trigger[0].focus();
				this.hide();
			});			
			//删除、清空数据
			trigger.on('keydown', function(ev){
				if(ev.keyCode === 8 || ev.keyCode === 46){
					var v = DOM.val(this);
					DOM.val(this, '');
					_self.fire('dateclear', {value: v});
				}			
			});
			//禁止手工输入
			trigger.on('valuechange', function(ev){
				DOM.val(this,'');
			});	
		},
		// 初始化校验规则
		_initRule: function(){
			var _self = this,
				rules = _self.getOutSideRules() || {};
			if(!S.isEmptyObject(rules)){
				_self.addRules(rules);
			}
		},
		// 设置日期的回显参数
		_echoDate: function(){
			var _self = this,
				initDate = _self.get('trigger').val(),
				config = _self.get('config'),
				initDateObj;
			if(Calendar.getDateParse(initDate)){
				initDateObj = Calendar.getDateObj(initDate);
				config = S.merge({
					date: initDateObj,
					selected: initDateObj
				}, config);
				_self.set('config', config);
			}
			return config;
		},
		// 添加规则核心函数
		_addRule: function(rule){
			var _self = this,
				validater = _self.get('validater'),
				triggerId = _self.get('triggerId');
			if(validater){
				validater.add('#' + triggerId, rule);
			}
		}
	});
	
	S.mix(Calendar, 
	/** @lends  S.LP.Calendar */
	{
		/**
		* 将日期对象格式化成日期字符串
		* @param {Date} date date对象
		* @param {String} format 格式化格式 'yyyy-mm-dd HH:MM:ss'
		* @return {String} 日期字符串
		*/
		formatDate: function(date, format){
			return S.Date.format(date, format);
		},
		/**
		* 获取日期的毫秒数
		* @param {String} dateStr 日期字符串 '2011-02-03 12:00:00'
		* @return {Number} 日期的毫秒数
		*/
		getDateParse: function(dateStr){
			return Date.parse(dateStr.replace(/\-/g,'/'));
		},
		/**
		* 获取日期对象，可用来配置日历的参数
		* @param {String} [dateStr] 日期字符串 '2011-02-03 12:00:00' 默认为当天
		* @param {Number} [offset] 天数偏移量 可为负数 默认为0
		* @return {Date} 日期对象
		*/
		getDateObj: function(dateStr, offset){
			var dataParse = dateStr ? Calendar.getDateParse(dateStr) : (new Date).getTime(),
				offsetParse = offset ? offset * 86400000 : 0;
			return new Date(dataParse + offsetParse);
		},
		/**
		* 格式化文本信息
		* @param {String} str 文本模板 '金额必须在{0}至{1}之间'
		* @param {String|Number} arguments 传入的参数
		* @return {String} 格式化后的文本
		* @example 
		* //配置示例
		*	formatText('金额必须在{0}至{1}之间',80,100);
		*	result:'金额必须在80至100之间'		
		*/
		formatText: function(str) {
            var args = Array.prototype.slice.call(arguments, 1);
            return str.replace(/\{(\d+)\}/g, function(m, i) {
                return args[i];
            });
        },
		/**
		 * 重置当前日期为当日的00:00:00
		 * @param {Date|String} date 为空的话 默认为当天
		 * @return {Date}
		 */
		clearTime:function(date){
			var d = date || new Date();
			if(S.isString(date)){
				d = Calendar.getDateObj(date);				
			}
			d.setHours(0); 
			d.setMinutes(0); 
			d.setSeconds(0);
			d.setMilliseconds(0); 
			return d;
		},
		/**
		* 通用时间校验规则
		* @param {Object} [config] 配置项
		* @param {Object} [config.text] 校验失败提示信息 默认为 '校验失败'
		* @param {String} [config.compareData] 参与比较的日期字符串 默认为当天
		* @param {Function} [config.validateCondition] 校验方法，此方法有2个参数，分别为：baseDataParse 基准日期，输入框里输入的日期；compareDataParse 比较日期 2个参数都是毫秒数形式，可以直接比较。默认比较日期不大于今天。
		* @return {Function} 返回校验规则
		* @example 
		* //配置示例
		*	Calendar.dataValidation({
		*		text: '日期不能大于{0}！',
		*		compareData: dateStr,
		*		validateCondition: function(baseDataParse, compareDataParse){
		*			return baseDataParse > compareDataParse;
		*		}
		*	});
		*/
		dataValidation: function(config){
			config = config || {};
			return function(){
				var _self = this,
					defaultText = config.validateCondition ? '校验失败' : '日期不能大于今天！',
					text = config.text || defaultText,
					compareData = config.compareData || '',
					compareDataParse = compareData ? Calendar.getDateParse(compareData) : Calendar.clearTime().getTime(),
					validateCondition = config.validateCondition || function(baseDataParse, compareDataParse){ return baseDataParse > compareDataParse; };
				return function(value){
					var baseDataParse = Calendar.getDateParse(value);
					if(!baseDataParse){
						return '请输入有效的时间！';
					}else if(validateCondition(baseDataParse, compareDataParse)){
						return Calendar.formatText(text, compareData);
					}
				};						
			};
		},
		/**
		* 单日历校验规则扩展集
		* @example 
		* //在外部使用自定义规则的方式
		*	var custom2Fun = function(config){
		*		return function(){
		*			var _self = this;
		*			return function(value){
		*				...
		*				// _self: Calendar对象
		*				// value: 输入框的值
		*				// config: 自己传入的参数
		*			};			
		*		};
		*	};
		*	new Calendar('time', {},{
		*		'validater': formValidater, 
		*		'rules': {
		*			// 完全自定义
		*			custom1: function(){
		*				var _self = this;
		*				return function(value){
		*					...
		*					// _self: Calendar对象
		*					// value: 输入框的值
		*				};			
		*			},
		*			// 可传入参数的自定义
		*			custom2: custom2Fun(config),
		*			// 使用dataValidation定义
		*			custom3: Calendar.dataValidation(config),
		*			// 使用提供的规则
		*			custom4: Calendar.rules.beforeNow()
		*		}
		*	});
		*/
		rules: {
			/**
			* 日期不能大于所传入的日期
			* @param {String} dateStr 日期字符串 '2011-02-03 12:00:00'
			* @return {Function} 校验规则
			*/
			beforeDate: function(dateStr){
				return  Calendar.dataValidation({
					text: '日期不能大于{0}！',
					compareData: dateStr
				});
			},
			/**
			* 日期不能小于所传入的日期
			* @param {String} dateStr 日期字符串 '2011-02-03 12:00:00'
			* @return {Function} 校验规则
			*/
			afterDate: function(dateStr){
				return  Calendar.dataValidation({
					text: '日期小能大于{0}！',
					compareData: dateStr,
					validateCondition: function(baseDataParse, compareDataParse){
						return baseDataParse < compareDataParse;
					}
				});
			},
			/**
			* 日期不能大于今天（过去日期）
			* @return {Function} 校验规则
			*/
			beforeNow: function(){
				return Calendar.dataValidation();
			},
			/**
			* 日期不能小于今天（将来日期）
			* @return {Function} 校验规则
			*/
			afterNow: function(){
				return  Calendar.dataValidation({
					text: '日期不能小于今天！',
					validateCondition: function(baseDataParse, compareDataParse){
						return baseDataParse < compareDataParse;
					}
				});
			}
		}
	});

	/**
	* JoinCalendar组合日历类
	* @memberOf S.LP
	* @description 双日期组件，可以联合校验
	* @class JoinCalendar组合日历组件
	* @param {Array} configStart 开始日期日历组件的配置参数
	* @param {Array} configEnd 结束日期日历组件的配置参数
	* @param {Object} [validation] 校验配置项
	* @param {Object} [validation.validater] 表单校验对象 默认为 null
	* @param {Object} [validation.rules] 校验规则集 默认为 {}
	* @param {Object} [validation.isSupportSeparate] 是否支持单独分开输入 默认为false
	* @example 
	* //配置示例
	*	new JoinCalendar(['startTime'], ['endTime'], {'validater': formValidater, 'rules': {
	*		beforeNow: JoinCalendar.rules.endBeforeNow(),
	*		required: true
	*	}});
	*/
	function JoinCalendar(configStart, configEnd, validation){
		var _self = this;
		_self.set('configStart', configStart);
		_self.set('configEnd', configEnd);
		
		validation = S.merge(JoinCalendar.validation, validation);
		JoinCalendar.superclass.constructor.call(_self, validation);

		_self._init();
	}
	JoinCalendar.validation = {
		isSupportSeparate: false
	};
	S.extend(JoinCalendar, CalendarValidation);
	S.augment(JoinCalendar, 
	/** @lends  S.LP.JoinCalendar.prototype */		
	{
		/**
		* 获取开始日期对象
		* @return {Object} 开始日期对象
		*/
		getStartCalendar: function(){
			var _self = this;
			return _self.get('calendarStart');
		},
		/**
		* 获取结束日期对象
		* @return {Object} 结束日期对象
		*/
		getEndCalendar: function(){
			var _self = this;
			return _self.get('calendarEnd');
		},
		/**
		* 判断是否启用联合校验
		* @return {Boolean} 是否启用联合校验
		*/
		isJoin: function(){
			var _self = this,
				calendarStart = _self.getStartCalendar(),
				calendarEnd = _self.getEndCalendar(),
				startVal = calendarStart.getTrigger().val(),
				endVal = calendarEnd.getTrigger().val(),
				isSupportSeparate = _self.get('isSupportSeparate'),
				_isJoin = true;
			if(isSupportSeparate && (!startVal || !endVal)){
				_isJoin = false;
			}
			return _isJoin;
		},
		/**
		* 触发两个日历对象的联合校验
		* @return {Boolean} 是否校验通过 若没有绑定校验规则，只要两个输入框都有值，就为true
		*/
		isValid: function(){
			var _self = this,
				validater = _self.get('validater'),
				proxyValidaterField,
				calendarStart,
				calendarEnd;
			if(validater){
				proxyValidaterField = _self._getProxyValidaterField();
				return proxyValidaterField.isValid();			
			}else{
				calendarStart = _self.getStartCalendar();
				calendarEnd = _self.getEndCalendar();
				return calendarStart.isValid() && calendarEnd.isValid();
			}
		},
		/**
		* 初始化值
		*/
		initValue: function(){
			this._setProxyValue();
		},
		/**
		* 销毁JoinCalendar对象
		* @return {Object} 当前对象
		*/
		destroy: function(){
			var _self = this,
				calendarStart = _self.getStartCalendar(),
				calendarEnd = _self.getEndCalendar(),
				proxy = _self._getProxy(),
				validater = _self.get('validater');

			calendarStart.destroy();
			calendarEnd.destroy();

			proxy.detach();
			if(validater){
				validater.fields.remove(proxy.attr('id'));
			}
			proxy.remove();
			_self.set('proxyInput', null);

			return _self;
		},
		// 初始化
		_init: function(){
			var _self = this,	
				configStart = _self.get('configStart'),
				configEnd = _self.get('configEnd'),
				calendarStart,
				calendarEnd;

			_self._checkValidater();

			calendarStart = new Calendar(configStart[0], configStart[1], configStart[2]);
			calendarEnd = new Calendar(configEnd[0], configEnd[1], configEnd[2]);
			_self.set('calendarStart', calendarStart);
			_self.set('calendarEnd', calendarEnd);

			_self._initProxyInput();

			_self._initEvent();
			_self._initRule();
			_self._setProxyValue();
		},
		// 初始化事件
		_initEvent: function(){
			var _self = this,
				calendarStart = _self.getStartCalendar(),
				calendarEnd = _self.getEndCalendar();

			calendarStart.getCalendar().on(calendarStart.get('selectEvent'), function(e){
				_self._setProxyValue(Calendar.formatDate(e.date, calendarStart.get('format')), 0);
				_self.fire('datechange');
			});
			calendarStart.on('dateclear', function(){
				_self._setProxyValue('', 0);
			});

			calendarEnd.getCalendar().on(calendarEnd.get('selectEvent'), function(e){
				_self._setProxyValue(Calendar.formatDate(e.date, calendarEnd.get('format')), 1);
				_self.fire('datechange');
			});
			calendarEnd.on('dateclear', function(){
				_self._setProxyValue('', 1);
			});
		},
		// 初始化校验
		_initRule: function(){
			var _self = this,
				calendarStart = _self.getStartCalendar(),
				rules = _self.getOutSideRules() || {};
			if(!S.isEmptyObject(rules)){
				_self.addRules(rules);		
			}
		},
		// 初始化代理校验隐藏域
		_initProxyInput: function(){
			var _self = this,
				proxyInput = S.one(DOM.create('<input type="hidden"/>'));
			proxyInput.attr('id', S.guid()).insertAfter(_self.get('calendarEnd').getTrigger());
			_self.set('proxyInput', proxyInput);
		},
		// 获取代理校验隐藏域
		_getProxy: function(){
			return this.get('proxyInput');
		},
		// 获取代理校验隐藏域的校验对象
		_getProxyValidaterField: function(){
			var _self = this,
				proxyValidaterField = _self.get('proxyValidaterField') || undefined,
				validater;
			if(proxyValidaterField === undefined){
				validater = _self.get('validater');
				proxyValidaterField = validater ? validater.get(_self._getProxy().attr('id')) : null;
				_self.set('proxyValidaterField', proxyValidaterField);
			}
			return proxyValidaterField;
		},
		// 给代理校验隐藏域设值
		_setProxyValue: function(val, index){
			var _self = this,
				proxy = _self._getProxy(),
				proxyValArr = (proxy.val() || '|').split('|'),
				_val = '';
			if(val === undefined){
				proxyValArr[0] = _self.getStartCalendar().getTrigger().val();
				proxyValArr[1] = _self.getEndCalendar().getTrigger().val();
			}else{
				proxyValArr[index] = val;
			}
			if(proxyValArr.join('|') !== '|'){
				_val = proxyValArr.join('|');
			}
			proxy.val(_val);
			// 校验
			_self.isValid();
		},
		// 添加规则核心函数
		_addRule: function(rule){
			var _self = this,
				validater = _self.get('validater'),
				fieldId = _self._getProxy().attr('id');
			if(validater){
				validater.add('#' + fieldId, rule);
			}
		},
		// 用联合校验的validater重置两个日历上的
		_checkValidater: function(){
			var _self = this,
				validater = _self.get('validater'),
				configStart = _self.get('configStart'),
				configEnd = _self.get('configEnd'),
				setVObj = function(cfg){
					var cfgLength = cfg.length,
						i;
					for(i = cfgLength; i < 3; i++){
						cfg.push({});
					}
					cfg[2]['validater'] = validater;
				};
			if(validater){
				setVObj(configStart);
				setVObj(configEnd);
			}		
		},
		// 默认要执行的校验
		_rules: function(){
			return {
				required: false,
				starBeforeEnd: JoinCalendar.dataValidation()
			};
		}
	});
	S.mix(JoinCalendar, 
	/** @lends  S.LP.JoinCalendar */
	{
		/**
		* 通用时间校验规则
		* @param {Object} [config] 配置项
		* @param {Object} [config.text] 校验失败提示信息 默认为 '校验失败'
		* @param {String} [config.compareData] 参与比较的日期字符串 默认为当天
		* @param {Function} [config.validateCondition] 校验方法，此方法有4个参数，分别为：startDataParse 开始日期、endDataParse 结束日期、compareDataParse 比较日期、isJoin 是否启用联合校验 3个参数都是毫秒数形式，可以直接比较。默认比较开始时间不能大于结束时间。
		* @return {Function} 返回校验规则
		* @example 
		* //配置示例
		*	JoinCalendar.dataValidation({
		*		text: '结束日期不能大于{0}！',
		*		compareData: dateStr,
		*		validateCondition: function(startDataParse, endDataParse, compareDataParse){
		*			return endDataParse > compareDataParse;
		*		}
		*	});
		*/
		dataValidation: function(config){
			config = config || {};
			return function(){
				var _self = this,
					defaultText = config.validateCondition ? '校验失败' : '开始时间不能大于结束时间!',
					text = config.text || defaultText,
					compareData = config.compareData || '',
					compareDataParse = compareData ? Calendar.getDateParse(compareData) : Calendar.clearTime().getTime(),
					validateCondition = config.validateCondition || function(startDataParse, endDataParse, compareDataParse, isJoin){
						if(isJoin){
							return startDataParse > endDataParse;
						}else{
							return false;
						}
					};
				return function(value){
					var startDataParse = Calendar.getDateParse(_self.getStartCalendar().getTrigger().val()),
						endDataParse = Calendar.getDateParse(_self.getEndCalendar().getTrigger().val()),
						isJoin = _self.isJoin();
					if(isJoin && !startDataParse){
						return '请输入有效的开始时间!';
					}else if(isJoin && !endDataParse){
						return '请输入有效的结束时间!';
					}else if(validateCondition(startDataParse, endDataParse, compareDataParse, isJoin)){
						return Calendar.formatText(text, compareData);
					}
				};						
			};
		},
		/**
		* 日历联合校验规则扩展集
		*/
		rules: {
			/**
			* 结束日期不能大于今天（过去时间段）
			* @return {Function} 校验规则
			*/
			endBeforeNow: function(){
				return JoinCalendar.dataValidation({text: '结束日期不能大于今天！', validateCondition: function(startDataParse, endDataParse, compareDataParse, isJoin){
					return endDataParse > compareDataParse;
				}});
			},
			/**
			* 开始日期不能小于今天（将来时间段）
			* @return {Function} 校验规则
			*/
			startAfterNow: function(){
				return JoinCalendar.dataValidation({text: '开始日期不能小于今天！', validateCondition: function(startDataParse, endDataParse, compareDataParse, isJoin){
					return startDataParse < compareDataParse;
				}});
			}
		}
	});

	S.namespace('LP');
	S.LP.Calendar = Calendar;
	S.LP.JoinCalendar = JoinCalendar;

},{requires: ['calendar', 'lpmodule/css/module.css']});

/* TODO 较优先
*  联合校验输入框支持单独输入
*  1、配置 isSupportSeparate 默认为false
*  2、输入一个时，只校验当前输入框
*  3、两个都输入时，才启动联合校验
*  4、isValid 也要支持两种情况
*/
/* TODO
*	将表单校验对象做接口适配器，以适应不同的表单校验对象，现阶段只支持kissy的校验对象
*	用到表单校验对象的方法：
*	1、validater.get(triggerId) 获取表单项的校验对象
*	2、validater.add('#' + triggerId, rule) 给表单项添加规则
*	3、表单项校验对象.isValid() 触发校验 
*/
