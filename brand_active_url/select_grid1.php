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

<link rel='stylesheet' type='text/css' href='http://<?php echo $hostName; ?>/tm/tbs-back/<?php echo $lab_version; ?>/brand_active_url/selectgrid.css'/>
<script type="text/javascript" src='http://<?php echo $hostName; ?>/tm/tbs-back/<?php echo $lab_version; ?>/brand_active_url/selectgrid.js'></script>
<script type="text/javascript" src='http://<?php echo $hostName; ?>/tm/tbs-back/<?php echo $lab_version; ?>/brand_active_url/grid.js'></script>
<script type="text/javascript" src='http://<?php echo $hostName; ?>/tm/tbs-back/<?php echo $lab_version; ?>/brand_active_url/store.js'></script>
<script type="text/javascript" src='http://g.tbcdn.cn/tm/tbs-back/1.1.3/blue_print/uicommon.js'></script>

<div class="iner-body"> 

	<!-- ������ -->   
	<div class="tbsui-step-3">
	    <ol class="tbsui-step-bar">
	        <li class="tbsui-step-cur">ѡ��Ͷ��ý��</li>
	        <li class="tbsui-step-done"><i></i>����Ͷ��</li>
	        <li class="tbsui-step-end"><i></i>����Ͷ������</li>
	    </ol>
	</div>

	<div class='select-data-container'>	

		<!-- ������table���� -->
		<div class="main-table-container" id="J_selectPoolTable">

				<!--- ��ѯģ�� data-valid="{maxLength:[30, false, ' ��󳤶�Ϊ{0}���ַ�']}" -->
				<form name="hideform" action="#" method="post" id="J_hideform">
					<input type="hidden" value="sd5fsd5f6afafafa3" name="_csrf_token" id="J_csrf_token"> <!-- _csrf_token -->  
					<input type="hidden" value="" name="selectedData" id="J_selectTableData"> 			 <!--ѡ�� ���� �ύ�ֶ� --> 
					<input type="hidden" value="" name="resetActive" id="J_resetActive"> 				 <!--����ѡ����ʾ --> 

					<div class="search-index">
						<span class="lab-cls">ý��һ��������</span>
						<label> <!--  data-valid="{{maxLength:[50, false, &#39; ��󳤶�Ϊ{0}���ַ�&#39;]}}"  -->
		                    <input value="" type="text" class="large-inpt j_search-input" name="acname" id="J_inptuEle" placeholder="��:youku.com" /> 
		                	<a href="javascript:void(0)" class="ui-btn-s" id="J_search_btn" data-type="findall">��ѯ</a>
		            	</label>  
					</div>
				</form>	 
		
				<!-- ѡ��� ���ģ�� -->
				<div class="table-container">
					<table class="ui-table">			       
				        <thead>			           
							<tr class="capitons grid-row">
								<th style="width:30px;"><input type="checkbox" value="all" name="seletall" class="j_select_all"></th>
								<th>id</th>
								<th>�����</th>
								<th>ý������</th>
								<th style="width:65px;">�� ��</th>
				            </tr>
				        </thead>
						<tbody></tbody>
				    </table>
				</div>	

				<!-- ��ҳ -->	
				<div class="page-container skin-tb" id="J_Page"></div>
		</div>

		<div class="tr-opraition-btn">
			<a href="javascript:void(0)" class="ui-btn-m-primary add-btn" id="J_addMore">�������&gt;&gt;</a><br>
			<a href="javascript:void(0)" class="ui-btn-m" id="J_removeMore">&lt;&lt;�����Ƴ�</a> 
		</div>

	    <!-- ���ѡ��ģ�� -->
		<div class="select-talbe-container" id="J_selectCandTable">
			<p class="text-agncener margin-top20">��ѡ����</p>	

			<div class="table-container selet-table-container">
				<table class="ui-table">			       
				  	<thead>			           
						<tr class="capitons grid-row">
							<th style="width:30px;"><input type="checkbox" value="all" name="seletall" class="j_select_all"></th>
							<th>id</th>
							<th>�����</th>
			                <th>ý������</th>
			                <th style="width:65px;">�� ��</th>
			            </tr>
			        </thead> 
					<tbody></tbody>
			    </table>
			</div>   

			<!-- ��ҳ -->	
			<div class="page-container skin-tb" id="J_Page-selct"></div>
		</div>	
	
	</div>	

	<!-- ���ݱ���ģ�� -->
	<div class="text-agncener margin-top50">
		<a href="javascript:void(0)" class="ui-btn-m-primary" id="J_resetBack">����ѡ��</a>&nbsp;&nbsp;
		<a href="javascript:void(0)" class="ui-btn-m center-btn" id="J_saveSelectData">����ѡ��</a> 
	</div>

</div>

<script type="text/javascript">

	// ѡ��� ��̬����
	var mainData = [];

    // ��ѡ�� ѡ������
    var selectData = [
    	{"nos":5, "id":"fa32f3a2f5", "actype":"վ��", "medianame":"youku.com"},
    	{"nos":7, "id":"faf262f6a66_1", "actype":"վ��7", "medianame":"youku7.com" },
    	{"nos":11, "id":"afa266969fa_2", "actype":"վ��11", "medianame":"youku11.com" },    
        {"nos":7, "id":"fa32f3a2f7", "actype":"վ��", "medianame":"youku.com"}
    ];

    // ѡ���table trģ��
    var main_table = 
	    '<tr class="grid-row">'+
	     	'<td class="grid-cell"><input type="checkbox" value="{{id}}" name="box" class="grid-checkbox" /></td>'+
	    	'<td class="grid-cell">{{id}}</td>'+
	        '<td class="grid-cell">{{actype}}</td>'+
	        '<td class="grid-cell">{{medianame}}</td>'+
	        '<td class="grid-cell">'+
				'<a href="javascript:void(0)" class="ui-btn-m-primary j_add_remove" data-no="{{id}}" data-operationState="addtr">���</a>'+
			'</td>'+
	    '</tr>';    

    // ��ѡ��table trģ��
    var select_table = 
        '<tr class="grid-row">'+
         	'<td class="grid-cell"><input type="checkbox" value="{{id}}" name="removetr" class="grid-checkbox" /></td>'+
        	'<td class="grid-cell">{{id}}</td>'+
            '<td class="grid-cell">{{actype}}</td>'+
            '<td class="grid-cell">{{medianame}}</td>'+
			'<td class="grid-cell">'+
				'<a href="javascript:void(0)" class="ui-btn-m j_add_remove" data-no="{{id}}" data-operationState="removetr">�Ƴ�</a>'+  
			'</td>'+	
        '</tr>';


	KISSY.ready(function(S){
	    S.use('mui/selectGrid', function(S, SelectGrid){  
		
	        new SelectGrid({	
			
				poolGridConfig:{
					tableContainerId: '#J_selectPoolTable',				// table ���� id
					isPagination:true,									// �Ƿ��з�ҳ Ĭ�� Ϊfalse
					totalPage:10,										// ��ҳ����
					limit: 10,											// ��ҳ��С
					isAjaxData:true,									// �Ƿ����첽���� Ĭ�� Ϊfalse
					ajaxUrl: 'result.php',     							 // �첽��ѯurl  
					trTpl: main_table									// ѡ��� table tbody tr ģ��												
				},
				
				candGridConfig:{
					tableContainerId: '#J_selectCandTable',				// table ���� id
					staticData: selectData, 							// ��ѡ table ��̬���� 
					trTpl: select_table									// ��ѡ table tbody tr ģ��
				},
				
				//isMoveData: false,								// �Ƿ� �ƶ� ѡ�������? Ĭ��copy���� false
				addMoreId: '#J_addMore', 							// ������� id
	        	removeMoreId: '#J_removeMore', 						// �����Ƴ� id
	        	trIndex:'id'										// ���ݶԱ����� Ĭ�� Ϊid 
	        });
	    });
	});
</script>

<?php
include_once('../operator/foot.php');
?>
