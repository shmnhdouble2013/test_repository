<?php
// 后台页面
$title = '选择投放媒体';

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

	<!-- 步骤条 -->   
	<div class="tbsui-step-3">
	    <ol class="tbsui-step-bar">
	        <li class="tbsui-step-cur">选择投放媒体</li>
	        <li class="tbsui-step-done"><i></i>描述投放</li>
	        <li class="tbsui-step-end"><i></i>保存投放链接</li>
	    </ol>
	</div>

	<div class='select-data-container'>	

		<!-- 主操作table容器 -->
		<div class="main-table-container" id="J_selectPoolTable">

				<!--- 查询模板 data-valid="{maxLength:[30, false, ' 最大长度为{0}个字符']}" -->
				<form name="hideform" action="#" method="post" id="J_hideform">
					<input type="hidden" value="sd5fsd5f6afafafa3" name="_csrf_token" id="J_csrf_token"> <!-- _csrf_token -->  
					<input type="hidden" value="" name="selectedData" id="J_selectTableData"> 			 <!--选中 数据 提交字段 --> 
					<input type="hidden" value="" name="resetActive" id="J_resetActive"> 				 <!--重新选择活动标示 --> 

					<div class="search-index">
						<span class="lab-cls">媒体一级域名：</span>
						<label> <!--  data-valid="{{maxLength:[50, false, &#39; 最大长度为{0}个字符&#39;]}}"  -->
		                    <input value="" type="text" class="large-inpt j_search-input" name="acname" id="J_inptuEle" placeholder="如:youku.com" /> 
		                	<a href="javascript:void(0)" class="ui-btn-s" id="J_search_btn" data-type="findall">查询</a>
		            	</label>  
					</div>
				</form>	 
		
				<!-- 选择池 表格模板 -->
				<div class="table-container">
					<table class="ui-table">			       
				        <thead>			           
							<tr class="capitons grid-row">
								<th style="width:30px;"><input type="checkbox" value="all" name="seletall" class="j_select_all"></th>
								<th>id</th>
								<th>活动类型</th>
								<th>媒体名称</th>
								<th style="width:65px;">操 作</th>
				            </tr>
				        </thead>
						<tbody></tbody>
				    </table>
				</div>	

				<!-- 分页 -->	
				<div class="page-container skin-tb" id="J_Page"></div>
		</div>

		<div class="tr-opraition-btn">
			<a href="javascript:void(0)" class="ui-btn-m-primary add-btn" id="J_addMore">批量添加&gt;&gt;</a><br>
			<a href="javascript:void(0)" class="ui-btn-m" id="J_removeMore">&lt;&lt;批量移除</a> 
		</div>

	    <!-- 表格选中模板 -->
		<div class="select-talbe-container" id="J_selectCandTable">
			<p class="text-agncener margin-top20">已选中区</p>	

			<div class="table-container selet-table-container">
				<table class="ui-table">			       
				  	<thead>			           
						<tr class="capitons grid-row">
							<th style="width:30px;"><input type="checkbox" value="all" name="seletall" class="j_select_all"></th>
							<th>id</th>
							<th>活动类型</th>
			                <th>媒体名称</th>
			                <th style="width:65px;">操 作</th>
			            </tr>
			        </thead> 
					<tbody></tbody>
			    </table>
			</div>   

			<!-- 分页 -->	
			<div class="page-container skin-tb" id="J_Page-selct"></div>
		</div>	
	
	</div>	

	<!-- 数据保存模板 -->
	<div class="text-agncener margin-top50">
		<a href="javascript:void(0)" class="ui-btn-m-primary" id="J_resetBack">重新选择活动</a>&nbsp;&nbsp;
		<a href="javascript:void(0)" class="ui-btn-m center-btn" id="J_saveSelectData">保存选择</a> 
	</div>

</div>

<script type="text/javascript">

	// 选择池 静态数据
	var mainData = [];

    // 候选区 选中数据
    var selectData = [
    	{"nos":5, "id":"fa32f3a2f5", "actype":"站外", "medianame":"youku.com"},
    	{"nos":7, "id":"faf262f6a66_1", "actype":"站外7", "medianame":"youku7.com" },
    	{"nos":11, "id":"afa266969fa_2", "actype":"站外11", "medianame":"youku11.com" },    
        {"nos":7, "id":"fa32f3a2f7", "actype":"站外", "medianame":"youku.com"}
    ];

    // 选择池table tr模板
    var main_table = 
	    '<tr class="grid-row">'+
	     	'<td class="grid-cell"><input type="checkbox" value="{{id}}" name="box" class="grid-checkbox" /></td>'+
	    	'<td class="grid-cell">{{id}}</td>'+
	        '<td class="grid-cell">{{actype}}</td>'+
	        '<td class="grid-cell">{{medianame}}</td>'+
	        '<td class="grid-cell">'+
				'<a href="javascript:void(0)" class="ui-btn-m-primary j_add_remove" data-no="{{id}}" data-operationState="addtr">添加</a>'+
			'</td>'+
	    '</tr>';    

    // 候选区table tr模板
    var select_table = 
        '<tr class="grid-row">'+
         	'<td class="grid-cell"><input type="checkbox" value="{{id}}" name="removetr" class="grid-checkbox" /></td>'+
        	'<td class="grid-cell">{{id}}</td>'+
            '<td class="grid-cell">{{actype}}</td>'+
            '<td class="grid-cell">{{medianame}}</td>'+
			'<td class="grid-cell">'+
				'<a href="javascript:void(0)" class="ui-btn-m j_add_remove" data-no="{{id}}" data-operationState="removetr">移除</a>'+  
			'</td>'+	
        '</tr>';


	KISSY.ready(function(S){
	    S.use('mui/selectGrid', function(S, SelectGrid){  
		
	        new SelectGrid({	
			
				poolGridConfig:{
					tableContainerId: '#J_selectPoolTable',				// table 容器 id
					isPagination:true,									// 是否有分页 默认 为false
					totalPage:10,										// 分页总数
					limit: 10,											// 分页大小
					isAjaxData:true,									// 是否是异步数据 默认 为false
					ajaxUrl: 'result.php',     							 // 异步查询url  
					trTpl: main_table									// 选择池 table tbody tr 模板												
				},
				
				candGridConfig:{
					tableContainerId: '#J_selectCandTable',				// table 容器 id
					staticData: selectData, 							// 候选 table 静态数据 
					trTpl: select_table									// 候选 table tbody tr 模板
				},
				
				//isMoveData: false,								// 是否 移动 选择池数据? 默认copy数据 false
				addMoreId: '#J_addMore', 							// 批量添加 id
	        	removeMoreId: '#J_removeMore', 						// 批量移除 id
	        	trIndex:'id'										// 数据对比依据 默认 为id 
	        });
	    });
	});
</script>

<?php
include_once('../operator/foot.php');
?>
