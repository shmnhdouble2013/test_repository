KISSY.ready(function(S){
    S.use('tbsui,mui/select,calendar,node,calendar/assets/dpl.css',function(S,Tbsui,Select,Calendar,Node){

        // 初始化全局 'select','radio','checkbox'
        // var OTbsui = new Tbsui({
        //     selector:['select','radio','checkbox']
        // });
    
        // 也可以 仅仅 初始化 tbsui对象实例
        var OTbsui = new Tbsui();
			
		//tbsui 指定容器范围 初始化 模拟的 radio checkbox，默认document  -- by 黄甲	
        OTbsui._renderRidoCheckbox("radio", Node.one("#J_radio"));
        OTbsui._renderRidoCheckbox("checkbox", Node.one("#J_checkbox"));

        // checkbox radio 事件监控 -- by 黄甲 
        OTbsui.on('checkboxClick radioClick', function(el){
            console.log("fire事件外部接收到并执行："+el.inputTarget);
        });
        
        S.Event.on('input', 'click', function(el){
            console.log('原生input触发了'+ el.target);
        });

		
        //tbsui -- 验证框架 提示样式 2种方式 -- by 黄甲
        S.use('Validation', function(S, Validation){
        
            var form = new Validation('#J_form',{
                style: 'tbsUiValid_under'  // 若只显示 校验文本 style则配置  tbsUiValid_text
            });
            
            KISSY.Event.on('#sub_form', "click", function(){
                alert('校验结果：'+form.isValid());
            });
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
		
    });
});