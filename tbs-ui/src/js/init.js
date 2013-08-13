KISSY.ready(function(S){
    S.use('tbsui,mui/select,calendar,node,calendar/assets/dpl.css',function(S,Tbsui,Select,Calendar,Node){
        // var OTbsui = new Tbsui({
        //     selector:['select','radio','checkbox']
        // });

        var OTbsui = new Tbsui({
                selector:[]
            });
			
		//tbsui -- 模拟radio checkbox方法  -- by 黄甲	
        OTbsui._renderRidoCheckbox("radio",Node.one("#J_radio"));
        OTbsui._renderRidoCheckbox("checkbox",Node.one("#J_checkbox"));


        OTbsui.on('checkboxClick radioClick', function(el){
            console.log("fire事件外部接收到并执行："+el.inputTarget);
        });
        
        S.Event.on('#abcd', 'click', function(el){
            // el.stopPropagation();
            console.log('原生input触发了'+ el.target);
        });

		
        // mui select
        var data = [{text:'10',value:10},{text:'20',value:20},{text:'30',value:30}];
        new Select({
            renderTo : "mui-select-sample",
            resultId : "mui-select-result",
            data     : data     ,
            checkable: false
        });

        new Select({
            renderTo : "mui-select-sample-2",
            resultId : "mui-select-result-2",
            data     : data     ,
            checkable: false
        });

        new Select({
            renderTo : "mui-select-sample-3",
            resultId : "mui-select-result-3",
            data     : data     ,
            checkable: true
        });

        //calendar
        var S_Date = S.Date;
        new Calendar(Node.one("#calA"), {
            popup:true,
            triggerType:['click'],
            closable:true
        }).on('select', function(e) {
            Node.one("#calA").val(S_Date.format(e.date, 'yyyy年mm月dd日'));
        });

        new Calendar(Node.one("#calB"), {
            popup:true,
            triggerType:['click'],
            closable:true,
            showTime:true,
            disabled:[new Date(2013,7,2)]
        }).on('timeSelect', function(e) {
            Node.one("#calB").val(S_Date.format(e.date, 'yyyy年mm月dd日 HH:MM'));
        });
		
		
		
		//tbsui -- 验证框架 提示样式  -- by 黄甲
		S.use('Validation', function(S, Validation){
		
			var form = new Validation('#J_form',{
				style: 'tbsUiValid_under'
			});
			
			KISSY.Event.on('#sub_form', "click", function(){
				form.isValid();
			});
		});
    })
});