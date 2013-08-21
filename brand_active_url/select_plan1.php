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

<link rel='stylesheet' type='text/css' href='http://<?php echo $hostName; ?>/tm/tbs-back/<?php echo $lab_version; ?>/brand_active_url/select_plan.css'/>
<script type="text/javascript" src='http://<?php echo $hostName; ?>/tm/tbs-back/<?php echo $lab_version; ?>/brand_active_url/select_plan.js'></script>
 
<div class='select-data-container'>	
	
	<form name="hideform" action="#" method="post" id="J_hideform">
		<input type="hidden" value="sd5fsd5f6afafafa3" name="_csrf_token" id="J_csrf_token" /> <!-- _csrf_token -->  
	</form>	 

	<!-- 步骤条 -->   
	<div class="tbsui-step-3 els-height">
	    <ol class="tbsui-step-bar">
	        <li class="tbsui-step-cur">选择投放媒体</li>
	        <li class="tbsui-step-done"><i></i>描述投放</li>
	        <li class="tbsui-step-end"><i></i>保存投放链接</li>
	    </ol>
	</div>

	<!-- 主操作table容器 -->
	<div class="main-table-container">

		<!--- 查询模板 data-valid="{maxLength:[30, false, ' 最大长度为{0}个字符']}" -->
		<div class="els-height j_serch-container">
			<span>媒体域名：</span>
            <label>
                <input value="" type="text"  class="large-inpt" name="acname" id="J_inptuEle" />
                <a href="javascript:void(0)" class="ui-btn-s" id="J_finedData" data-type="findall" >查询</a>
                <span class="ui-form-tip">媒体一级域名(如:sina.com)</span>   
            </label>      			
		</div>
	
		<!-- 选择池 表格模板 -->
		<table class="ui-table" id="J_selectPoolTable">			       
	        <thead>			           
	            <tr class="capitons">
	            	<th style="width:50px"><input type="checkbox" value="all" name="seletall" calass="j_select_all" />全选</th>
	            	<th style="width:50px">序号</th>
	                <th>活动类型</th>
	                <th>媒体名称</th>
	                <th style="width:50px">操 作</th>
	            </tr>
	        </thead>
			<tbody></tbody>
	    </table>

		<!-- 分页 -->	
	    <div id="J_Page"></div>
	</div>

	<div class="tr-opraition-btn">
		<a href="javascript:void(0)" class="ui-btn-m-primary add-btn" id="J_addMore">批量添加>></a><br/>
		<a href="javascript:void(0)" class="ui-btn-m" id="J_removeMore"><<批量移除</a> 
	</div>

    <!-- 表格选中模板 -->
	<div class="select-talbe-container">
		<p class="els-height text-agncener">已选中区</p>	

		<table class="ui-table" id="J_selectCandTable">			       
		  	<thead>			           
	            <tr class="capitons">
	            	<th style="width:50px"><input type="checkbox" value="all" name="seletall" calass="j_select_all" />全选</th>
	            	<th style="width:50px">序号</th>
	                <th>活动类型</th>
	                <th>媒体名称</th>
	                <th style="width:50px">操 作</th>
	            </tr>
	        </thead> 
			<tbody></tbody>
	    </table>
	</div>    

</div>


<!-- 数据保存模板 -->
<div  class="els-height btn-style">
	<a href="javascript:void(0)" class="ui-btn-m-primary" id="J_selectDown">重新选择活动</a>&nbsp;&nbsp;
	<a href="javascript:void(0)" class="ui-btn-m center-btn" id="J_allSelect">保存选择</a> 
</div>

<script type="text/javascript">

	// 选择池 静态数据
	var mainData = [
        {nos:1, id:"fa32f3a2f3", actype:"站外", medianame:"youku.com" },
        {nos:2, id:"2152afaf5525", actype:"站外2", medianame:"youku2.com" },
        {nos:3, id:"fa32faf63a2f3", actype:"站外3", medianame:"youku3.com" },
        {nos:4, id:"fafa6f65", actype:"站外4", medianame:"youku4.com" },
        {nos:5, id:"fa2666666", actype:"站外5", medianame:"youku4.com" },
        {nos:6, id:"faf2a2f6", actype:"站外6", medianame:"youku6.com" },
        {nos:7, id:"faf262f6a66", actype:"站外7", medianame:"youku7.com" },
        {nos:8, id:"afa236f23a62f", actype:"站外8", medianame:"youku8.com" },
        {nos:9, id:"faf23a2fa6", actype:"站外9", medianame:"youku9.com" },
        {nos:10, id:"faf36af6a6", actype:"站外10", medianame:"youku10.com" },
        {nos:11, id:"afa266969fa", actype:"站外11", medianame:"youku11.com" },
        {nos:12, id:"af23", actype:"站外12", medianame:"youku12.com" },
        {nos:13, id:"fa33", actype:"站外13", medianame:"youku13.com" }
    ];

    // 候选区 选中数据
    var selectData = [
    	{nos:2, id:"2152afaf5525", actype:"站外2", medianame:"youku2.com" },
    	{nos:7, id:"faf262f6a66", actype:"站外7", medianame:"youku7.com" },
    	{nos:11, id:"afa266969fa", actype:"站外11", medianame:"youku11.com" }
    ];

    // 选择池table tr模板 class="selected-tr"
    var main_table = '{{#each data}}'+
	    '<tr>'+
	     	'<td><input type="checkbox" value="{{id}}" name="addtr" class="j_pool_checkobx" /></td>'+
	    	'<td>{{xindex+1}}</td>'+
	        '<td>{{actype}}</td>'+
	        '<td>{{medianame}}</td>'+
	        '<td>'+
				'<a href="javascript:void(0)" class="ui-btn-m-primary j_add_remove" data-no="{{id}}" data-operationState="addtr">添加</a>'+
			'</td>'+
	    '</tr>'+
	'{{/each}}';    

    // 候选区table tr模板  class="delete-tr"
    var select_table = '{{#each data}}'+
        '<tr>'+
         	'<td><input type="checkbox" value="{{id}}" name="removetr" class="j_candidate_checkobx" /></td>'+
        	'<td>{{xindex+1}}</td>'+
            '<td>{{actype}}</td>'+
            '<td>{{medianame}}</td>'+
			'<td>'+
				'<a href="javascript:void(0)" class="ui-btn-m j_add_remove" data-no="{{id}}" data-operationState="removetr">移除</a>'+  
			'</td>'+	
        '</tr>'+  
    '{{/each}}';


	KISSY.ready(function(S){
	    S.use('tm/tbs-back/brand_active_url/Select_plan', function(S, Select_plan){        
	        new Select_plan({	
	        	poolTableId: '#J_selectPoolTable', 					// 选择池 table id钩子
	        	candTableId: '#J_selectCandTable', 					// 候选 table id钩子

	        	addMoreId: '#J_addMore', 							// 批量添加 id
	        	removeMoreId: '#J_removeMore' ,						// 批量移除 id

	        	ajaxUrl: 'result.php?message=546876489745454',      // 异步查询url  
	        	pagepation: 'result.php?message=服务器端返回信息',	// 翻页url 	   	

	       		pool_table_tpl: main_table,							// 选择池 table tbody tr 模板
				poolData: mainData, 								// 选择池 静态数据 

				candidate_table_tpl: select_table,					// 已候选 table tbody tr 模板
				candidateData: selectData, 							// 已候选 table 静态数据

	        	isMoveData: false,									// 是否 移动 选择池数据? 默认copy数据 false
	        	isPagination:true,									// 是否有分页 默认 为false
	        	isAjaxData:true										// 是否是异步数据 默认 为false
	        });
	    });
	});
</script>

<?php
include_once('../operator/foot.php');
?>
