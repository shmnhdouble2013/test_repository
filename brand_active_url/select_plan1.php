<?php
// ��̨ҳ��
$title = 'ѡ��Ͷ��ý��';

$curr_path = __DIR__;
$app_path = explode('brandsite', $curr_path);
$app_path = $app_path[0] . '/brandsite/';
include_once($app_path . 'libs/php/define.php');
include_once('../operator/head.php');

$hostName = 'g.assets.daily.taobao.net';
$lab_version = '1.1.4';
?>

<link rel='stylesheet' type='text/css' href='http://<?php echo $hostName; ?>/tm/tbs-back/<?php echo $lab_version; ?>/brand_active_url/select_plan.css'/>
<script type="text/javascript" src='http://<?php echo $hostName; ?>/tm/tbs-back/<?php echo $lab_version; ?>/brand_active_url/select_plan.js'></script>
 
<div class='select-data-container'>	
	
	<form name="hideform" action="#" method="post" id="J_hideform">
		<input type="hidden" value="sd5fsd5f6afafafa3" name="_csrf_token" id="J_csrf_token" /> <!-- _csrf_token -->  
	</form>	 

	<!-- ������ -->   
	<div class="tbsui-step-3 els-height">
	    <ol class="tbsui-step-bar">
	        <li class="tbsui-step-cur">ѡ��Ͷ��ý��</li>
	        <li class="tbsui-step-done"><i></i>����Ͷ��</li>
	        <li class="tbsui-step-end"><i></i>����Ͷ������</li>
	    </ol>
	</div>

	<!-- ������table���� -->
	<div class="main-table-container">

		<!--- ��ѯģ�� data-valid="{maxLength:[30, false, ' ��󳤶�Ϊ{0}���ַ�']}" -->
		<div class="els-height j_serch-container">
			<span>ý��������</span>
            <label>
                <input value="" type="text"  class="large-inpt" name="acname" id="J_inptuEle" />
                <a href="javascript:void(0)" class="ui-btn-s" id="J_finedData" data-type="findall" >��ѯ</a>
                <span class="ui-form-tip">ý��һ������(��:sina.com)</span>   
            </label>      			
		</div>
	
		<!-- ѡ��� ���ģ�� -->
		<table class="ui-table" id="J_selectPoolTable">			       
	        <thead>			           
	            <tr class="capitons">
	            	<th style="width:50px"><input type="checkbox" value="all" name="seletall" calass="j_select_all" />ȫѡ</th>
	            	<th style="width:50px">���</th>
	                <th>�����</th>
	                <th>ý������</th>
	                <th style="width:50px">�� ��</th>
	            </tr>
	        </thead>
			<tbody></tbody>
	    </table>

		<!-- ��ҳ -->	
	    <div id="J_Page"></div>
	</div>

	<div class="tr-opraition-btn">
		<a href="javascript:void(0)" class="ui-btn-m-primary add-btn" id="J_addMore">�������>></a><br/>
		<a href="javascript:void(0)" class="ui-btn-m" id="J_removeMore"><<�����Ƴ�</a> 
	</div>

    <!-- ���ѡ��ģ�� -->
	<div class="select-talbe-container">
		<p class="els-height text-agncener">��ѡ����</p>	

		<table class="ui-table" id="J_selectCandTable">			       
		  	<thead>			           
	            <tr class="capitons">
	            	<th style="width:50px"><input type="checkbox" value="all" name="seletall" calass="j_select_all" />ȫѡ</th>
	            	<th style="width:50px">���</th>
	                <th>�����</th>
	                <th>ý������</th>
	                <th style="width:50px">�� ��</th>
	            </tr>
	        </thead> 
			<tbody></tbody>
	    </table>
	</div>    

</div>


<!-- ���ݱ���ģ�� -->
<div  class="els-height btn-style">
	<a href="javascript:void(0)" class="ui-btn-m-primary" id="J_selectDown">����ѡ��</a>&nbsp;&nbsp;
	<a href="javascript:void(0)" class="ui-btn-m center-btn" id="J_allSelect">����ѡ��</a> 
</div>

<script type="text/javascript">

	// ѡ��� ��̬����
	var mainData = [
        {nos:1, id:"fa32f3a2f3", actype:"վ��", medianame:"youku.com" },
        {nos:2, id:"2152afaf5525", actype:"վ��2", medianame:"youku2.com" },
        {nos:3, id:"fa32faf63a2f3", actype:"վ��3", medianame:"youku3.com" },
        {nos:4, id:"fafa6f65", actype:"վ��4", medianame:"youku4.com" },
        {nos:5, id:"fa2666666", actype:"վ��5", medianame:"youku4.com" },
        {nos:6, id:"faf2a2f6", actype:"վ��6", medianame:"youku6.com" },
        {nos:7, id:"faf262f6a66", actype:"վ��7", medianame:"youku7.com" },
        {nos:8, id:"afa236f23a62f", actype:"վ��8", medianame:"youku8.com" },
        {nos:9, id:"faf23a2fa6", actype:"վ��9", medianame:"youku9.com" },
        {nos:10, id:"faf36af6a6", actype:"վ��10", medianame:"youku10.com" },
        {nos:11, id:"afa266969fa", actype:"վ��11", medianame:"youku11.com" },
        {nos:12, id:"af23", actype:"վ��12", medianame:"youku12.com" },
        {nos:13, id:"fa33", actype:"վ��13", medianame:"youku13.com" }
    ];

    // ��ѡ�� ѡ������
    var selectData = [
    	{nos:2, id:"2152afaf5525", actype:"վ��2", medianame:"youku2.com" },
    	{nos:7, id:"faf262f6a66", actype:"վ��7", medianame:"youku7.com" },
    	{nos:11, id:"afa266969fa", actype:"վ��11", medianame:"youku11.com" }
    ];

    // ѡ���table trģ�� class="selected-tr"
    var main_table = '{{#each data}}'+
	    '<tr>'+
	     	'<td><input type="checkbox" value="{{id}}" name="addtr" class="j_pool_checkobx" /></td>'+
	    	'<td>{{xindex+1}}</td>'+
	        '<td>{{actype}}</td>'+
	        '<td>{{medianame}}</td>'+
	        '<td>'+
				'<a href="javascript:void(0)" class="ui-btn-m-primary j_add_remove" data-no="{{id}}" data-operationState="addtr">���</a>'+
			'</td>'+
	    '</tr>'+
	'{{/each}}';    

    // ��ѡ��table trģ��  class="delete-tr"
    var select_table = '{{#each data}}'+
        '<tr>'+
         	'<td><input type="checkbox" value="{{id}}" name="removetr" class="j_candidate_checkobx" /></td>'+
        	'<td>{{xindex+1}}</td>'+
            '<td>{{actype}}</td>'+
            '<td>{{medianame}}</td>'+
			'<td>'+
				'<a href="javascript:void(0)" class="ui-btn-m j_add_remove" data-no="{{id}}" data-operationState="removetr">�Ƴ�</a>'+  
			'</td>'+	
        '</tr>'+  
    '{{/each}}';


	KISSY.ready(function(S){
	    S.use('tm/tbs-back/brand_active_url/Select_plan', function(S, Select_plan){        
	        new Select_plan({	
	        	poolTableId: '#J_selectPoolTable', 					// ѡ��� table id����
	        	candTableId: '#J_selectCandTable', 					// ��ѡ table id����

	        	addMoreId: '#J_addMore', 							// ������� id
	        	removeMoreId: '#J_removeMore' ,						// �����Ƴ� id

	        	ajaxUrl: 'result.php?message=546876489745454',      // �첽��ѯurl  
	        	pagepation: 'result.php?message=�������˷�����Ϣ',	// ��ҳurl 	   	

	       		pool_table_tpl: main_table,							// ѡ��� table tbody tr ģ��
				poolData: mainData, 								// ѡ��� ��̬���� 

				candidate_table_tpl: select_table,					// �Ѻ�ѡ table tbody tr ģ��
				candidateData: selectData, 							// �Ѻ�ѡ table ��̬����

	        	isMoveData: false,									// �Ƿ� �ƶ� ѡ�������? Ĭ��copy���� false
	        	isPagination:true,									// �Ƿ��з�ҳ Ĭ�� Ϊfalse
	        	isAjaxData:true										// �Ƿ����첽���� Ĭ�� Ϊfalse
	        });
	    });
	});
</script>

<?php
include_once('../operator/foot.php');
?>
