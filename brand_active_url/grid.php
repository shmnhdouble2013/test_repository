<?php
// ��̨ҳ��
$title = 'griddemo';

$curr_path = __DIR__;
$app_path = explode('brandsite', $curr_path);
$app_path = $app_path[0] . '/brandsite/';
include_once($app_path . 'libs/php/define.php');
include_once('../operator/head.php');

$hostName = 'g.assets.daily.taobao.net';
$lab_version = '1.1.9';
?>



<!--
	<script type="text/javascript" src='http://<?php echo $hostName; ?>/tm/tbs-back/<?php echo $lab_version; ?>/brand_active_url/??selectgrid.js,store.js,grid.js'></script>
-->


<link rel='stylesheet' type='text/css' href='http://<?php echo $hostName; ?>/tm/tbs-back/<?php echo $lab_version; ?>/brand_active_url/grid.css'/>

<script type="text/javascript" src='http://<?php echo $hostName; ?>/tm/tbs-back/<?php echo $lab_version; ?>/brand_active_url/grids.js'></script>
<script type="text/javascript" src='http://<?php echo $hostName; ?>/tm/tbs-back/<?php echo $lab_version; ?>/brand_active_url/store.js'></script>

<script type="text/javascript" src='http://g.tbcdn.cn/tm/tbs-back/1.1.3/blue_print/uicommon.js'></script>





<div style="margin:50px;"> 

    <!-- ���ѡ��ģ�� -->
	<div id="J_selectCandTable">

		<div class="table-container j_tableContent">

			<!-- ��ͷ th-->
			<div class="j_thead">
				<table class="ui-table">			       
				  	<thead>			           
						<tr class="grid-row">
							<th><input type="checkbox" value="all" name="seletall" class="j_select_all"></th>

							<th>id</th>

							<th><a href="javascript:void(0)" title="�������" data-value="views">�����<i class="drection-tags dsc">&nbsp;</i></a></th>

			            </tr>
			        </thead> 
			    </table>
			</div>
			
			<!-- ���� rows -->
			<div class="j_tbody">
				<table class="ui-table">
					<tbody></tbody>
			    </table>
			</div> 
			
			<!-- ��� bottom bar -->
			<div class="j_tfoot"></div> 

		</div>

	</div>		

</div>

<script type="text/javascript">

    // ��ѡ�� ѡ������
    var selectData = [
    	{"nos":5, "id":"fa32f3a2f5", "actype":"վ��", "medianame":"youku.com"},
    	{"nos":7, "id":"faf262f6a66_1", "actype":"վ��7", "medianame":"youku7.com" },
    	{"nos":11, "id":"afa266969fa_2", "actype":"վ��11", "medianame":"youku11.com" },    
        {"nos":7, "id":"fa32f3a2f7", "actype":"վ��", "medianame":"youku.com"}
    ];

	KISSY.ready(function(S){
	    S.use('mui/grid', function(S, Grid){ 

	        new Grid({	
					containerId: '#J_selectCandTable',				// table ���� id
					staticData: selectData, 						// ��ѡ table ��̬���� 
					columns: [
						{title: 'id',width: 110, sortable: true, dataIndex: 'id'},
						{title: '�����',width: 110, sortable: true, dataIndex: 'actype'},
						{title: 'ý������',width: 100, sortable: true, dataIndex: 'medianame'},
						{title: '����',width: 100, sortable: true, dataIndex: '', domRender:function(value, obj){}}
					] 

	   		});
	});
</script>

<?php
include_once('../operator/foot.php');
?>
