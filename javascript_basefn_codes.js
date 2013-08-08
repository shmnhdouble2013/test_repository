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




// 校验实例化
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

