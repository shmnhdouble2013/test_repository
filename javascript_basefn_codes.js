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
