/**
 * @fileOverview 查询页面下载按钮样式
 * @autor <a href="ximing.huxm@alibaba-inc.com">胡锡铭 旺旺：huximing1688</a>
 * @version 1.0
 */
KISSY.add(function (S) {
	var Event = S.Event;
	Event.on('.form-download-button', 'click', function (event) {
		var target = S.one(event.target),
			second = S.trim(target.attr('data-ms')) || 5,
			inputVal = target.val();
		
		S.later(buttonDisabled, 100);
		S.later(buttonEnabled, second*1000);
		
		//设置按钮不可用
		function buttonDisabled() {
			target.attr('disabled','disabled');
		}
		//设置按钮可用
		function buttonEnabled() {
			target.removeAttr('disabled');
		}
	});
},{requires:['core']});