KISSY.ready(function(S){
    S.use('tbsui,mui/select,calendar,node,calendar/assets/dpl.css',function(S,Tbsui,Select,Calendar,Node){

        // ��ʼ��ȫ�� 'select','radio','checkbox'
        // var OTbsui = new Tbsui({
        //     selector:['select','radio','checkbox']
        // });
    
        // Ҳ���� ���� ��ʼ�� tbsui����ʵ��
        var OTbsui = new Tbsui();
			
		//tbsui ָ��������Χ ��ʼ�� ģ��� radio checkbox��Ĭ��document  -- by �Ƽ�	
        OTbsui._renderRidoCheckbox("radio", Node.one("#J_radio"));
        OTbsui._renderRidoCheckbox("checkbox", Node.one("#J_checkbox"));

        // checkbox radio �¼���� -- by �Ƽ� 
        OTbsui.on('checkboxClick radioClick', function(el){
            console.log("fire�¼��ⲿ���յ���ִ�У�"+el.inputTarget);
        });
        
        S.Event.on('input', 'click', function(el){
            console.log('ԭ��input������'+ el.target);
        });

		
        //tbsui -- ��֤��� ��ʾ��ʽ 2�ַ�ʽ -- by �Ƽ�
        S.use('Validation', function(S, Validation){
        
            var form = new Validation('#J_form',{
                style: 'tbsUiValid_under'  // ��ֻ��ʾ У���ı� style������  tbsUiValid_text
            });
            
            KISSY.Event.on('#sub_form', "click", function(){
                alert('У������'+form.isValid());
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
            Node.one("#calA").val(S_Date.format(e.date, 'yyyy��mm��dd��'));
        });

        new Calendar(Node.one("#calB"), {
            popup:true,
            triggerType:['click'],
            closable:true,
            showTime:true,
            disabled:[new Date(2013,7,2)]
        }).on('timeSelect', function(e) {
            Node.one("#calB").val(S_Date.format(e.date, 'yyyy��mm��dd�� HH:MM'));
        });
		
    });
});