KISSY.ready(function(S){
    S.use('tbsui', function(S, Tbsui){
        var OTbsui = new Tbsui({
            selector:['select','radio','checkbox']
        });

  		OTbsui.on('checkboxClick radioClick', function(el){
			console.log("fire事件外部接收到并执行："+el.inputTarget);
		});
		
		S.Event.on('#abcd', 'click', function(el){
			// el.stopPropagation();
			console.log('原生input触发了'+ el.target);
		});
    });
});