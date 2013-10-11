/*
* javaScript 基础 方法应用 代码片段集合
* 2013 07
*/


/**
* charAt substring  实例应用 -- 获取 for in 变量 objStr 类名，且将第一个字符大写
*/
function capitalFirst(s) {
	s += '';
	return s.charAt(0).toUpperCase() + s.substring(1); 
}

/**
 * 根据属性变化设置 UI
 */
_bindUI: function() {
	var self = this,
		attrs = self.__attrs,
		attr, 
		m;

	for (attr in attrs) {
		if (attrs.hasOwnProperty(attr)) { // 本地属性
			self.on('after' + capitalFirst(attr) + 'Change', function(ev) {
				self[attr] = ev.newVal;
			});
			m = UI_SET + capitalFirst(attr);
			if (self[m]) {
				// 自动绑定事件到对应函数
				(function(attr, m) {
					self.on('after' + capitalFirst(attr) + 'Change', function(ev) {
						self[m](ev.newVal, ev);
					});
				})(attr, m);
			}
		}
	}
}


//调用基类的初始化事件
this.constructor.superclass._initEvent.call(this);




// validation 自定义校验规则 --日历基本校验 
_validaRender: function(){
	var _self = this;

	_self.form = S.get('#J_tablForm');

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


// 获取时间
getDateParse: function(dateStr){
	return Date.parse(dateStr.replace(/\-/g,'/'));
},

// kissy 原生 日历控件 带时间 公用 初始化方法
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

	// 点击后 填写日期数据 http://docs.kissyui.com/docs/html/api/component/calendar/index.html#calendar.popup
_self.get(calendarStr).on('timeSelect', function(e){ // 注意：监控时间 若没有 具体时间则 应该监控 select
    DOM.val(container,  S_Date.format(e.date, 'yyyy-mm-dd HH:MM:ss') );
    _self.validform && _self.validform.isValid(); // 这里方便验证
});

return _self.get(calendarStr);
},

// 附：dom结构
 //<li class="ui-form-field">               
	// <span class="ui-form-label"><em class="ui-form-req">*</em>活动时间：</span>
	// <label>
	// <input value="" type="text" data-valid="{'startEndtime':[{startInput:'#ac_startTime',endInput:'#ac_endTime'}]}" id="ac_startTime" name="ac_startTime" class="clendar_width ks-select-calendar" />&nbsp;至&nbsp;<input value="2013-07-18 15:45:00" type="text" id="ac_endTime" name="ac_endTime" class="clendar_width ks-select-calendar" /></label>          
 //</li>

// arguments 转化数组这样写的意义何在？
KISSY.use(_self.fullPlugins, function (S) {
    var args = S.makeArray(arguments);
    args.shift();
});


// 监控日期控件，禁止手动输入编辑
Event.add('#ac_startTime, #ac_endTime', 'keyup', function(ev){
	var evtype = ev.type;

	switch(evtype){
		case 'keyup': DOM.val(ev.target, ''); // 清空字段	
	}				
});
