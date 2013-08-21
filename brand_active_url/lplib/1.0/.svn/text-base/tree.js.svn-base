/** @fileOverview 层级展开控件
* 类似于树的层级展开，支持无限层级，不过在总结点数超过1千条时，在ie6下tree控件在构造时候会有明显的延迟
* @author <a href="mailto:rui_xing_zhou@sina.com">周瑞星 旺旺：ruixingzhou</a>  
* @version 1.0
*/
KISSY.add(function(S){	

	/** 
  	*	@exports S.LP as KISSY.LP
  	*/

	/**	 
  	 * @memberOf S.LP
	 * @class tree控件
	 * @param {object} config tree的配置参数和数据源
	 * @example 
	 * //config包含的字段
	 * {
		  "nodeData":object,
		  "useAjax":bool,
		  "ajaxUrl":"",
		  "containId":"包含tree的元素的id",
		  "showCheckbox":bool,
		  "checkBoxName":"树中checkbox的name":"",
		  "showAll":bool,
		  "selectValue":""
		}
	 * @param {object} config.nodeData：
	 * 		@example 
	 *     //config.nodeData里的字段:
	 * 		 [
				{
					"text":"节点一",
					"value":"本节点的值",
					"isLeaf":false/true,
					"child":[与config.nodeData的结构一样的元素,...]
				 },
				 ...
			 ]
	 * 		说明：
	 *		text:节点文本
	 *		value:本节点的值
	 *		isLeaf:是否是叶节点，即没有子节点的最外层节点，false:不是；true：是；
	 *		child:子节点列表
	 * 		
	 * @param {bool} config.useAjax：
	 * 		boolan，点击每个节点后，是否通过ajax向服务器端获取数据
	 * @param {string} config.ajaxUrl 
	 *		@example
	 *	//config.ajaxUrl的说明
	 *		当config.useAjax为true时，此项才有意义
	 * 		ajax请求数据的url路径，如 "/index.php",
	 *		method:post
	 *		传递参数：参数名：dataPath,格式 "n-n-n-..."，如"2-1-0"获取的数据是：
	 *		从最外层开始，第三个元素的第二个子元素的第一个子元素的子节点
	 *		返回值：json格式的子元素列表，结构同config.nodeData
	 * @param {string} config.containId：
	 * 		包含本控件的元素id，默认id="tree"
	 * @param {bool} config.showCheckbox：
			是否显示checkbox
	 * @param {string} config.checkBoxName:
	 * 		树中checkbox的name
	 * @param {bool} config.showAll:
	 *		初始化时，是否全部展开
	 * @param {string} config.selectValue:
	 *		默认选中的节点的value	
	 */
	function Tree(config)
	{
		var treeConfig={'nodeData':[],'useAjax':false,'ajaxUrl':'','containId':'tree','showCheckbox':false,'checkBoxName':'a','containId':'tree','showAll':false,'selectValue':''};
		treeConfig=S.merge(treeConfig,config);
		
		this.selectedNodeId='';
		var _self=this;
		
		//当treeConfig.showAll等于true的时候，本字段有意义，初始化tree的时候使用
		var firestShowAll=true;
		
		//tree支持的事件列表
		this.events=[
				/**  
				* 点选叶子节点的时候触发本事件
				* @name S.LP.Tree#select
				* @event
				* @param {event} e  事件对象	
				* @param {object} e.oData 本节点的数据
				* @param {string} e.oData.text 本节点的展示字符串
				* @param {string} e.oData.value 本节点的值，跟后台交互时需要
				* @param {array} e.aDes 本节点的层级描述，每个元素对应一个层级
				*，如:["节点一","节点二","节点三"]，指选中了"节点一"的子节点"节点二"
				*的子节点“节点三”
				*/
				'select'
			];

		/**
		 * 初始化树，根据nodeData生成html的DOM结构
		 * @private
		 */
		function _init()
		{
			//去掉事件的绑定，在一个页面包含多个tree的时候有用
			S.Event.remove('.min','click');
			S.Event.remove('.more','click');
			S.Event.remove('.emptyMore','click');

			var aHtml=['<ul class="tree">'];		
			//获取子节点的html
			aHtml[aHtml.length]=getChildHtml();	
			firestShowAll=false;
			aHtml[aHtml.length]='</ul>';
			//显示出来
			S.one('#'+treeConfig['containId']).html(aHtml.join(''));
			
			//绑定点击事件
			addEvent();			
		}
		
		/**
		* 根据config里的值，初始化上次用户的选择
		* 
		*/
		this.initSelect=function(){
			if(treeConfig.selectValue !== ''){
				var selectNode=S.one('.selectNode');
				if(selectNode.length>0){
					selectClickNode.call(S.one('.selectNode')[0]);
					//触发绑定的select事件
					_self.fire('select',_self.getSelectValue());	
				}				
			}
		};
	
		
		/**
			获取选择的数据与层级结构，返回值为对象，其中的字段：
			oData:本节点的数据，有text和value两个字段组成
			aDes:本节点的层级描述，每个元素对应一个层级
			@private
		*/
		this.getSelectValue=function(){
			var aDes=[];
			var oData={};
			var aIndex=this.selectedNodeId.split('-');			

			if(aIndex.length>1)
			{
				var thisData=treeConfig.nodeData;
				for(var i=1;i<aIndex.length-1;i++){
					aDes[aDes.length]=thisData[parseInt(aIndex[i])]['text'];
					thisData=thisData[parseInt(aIndex[i])]['child'];
				}
				aDes[aDes.length]=thisData[parseInt(aIndex[aIndex.length-1])]['text'];
				oData=thisData[parseInt(aIndex[aIndex.length-1])];
			}
			var selectData={'oData':{'text':oData.text,'value':oData.value},'aDes':aDes};
			return selectData;			
		};
				
		/**
		 * +或-被点击后的动作，在事件处理函数中调用本函数
		 * @private
		 */
		function minOrMoreClick(icoName)
		{		
			var thisLiId=this.parentNode.id;		
			//本次增加的li的id
			var aAddLi=[];
			var that=this;
				
			//移除本节点下所有的子节点
			if(icoName==='min')
			{
				S.all('li[id ^= "'+thisLiId+'-"]').remove();
				eventHandler.call(this,icoName,aAddLi);	
			}
			else if(icoName==='more')//显示本节点下的字节点
			{				
				//找出本节点对应的数据
				var nodeObject=nameToObject(thisLiId);			
				//有子节点
				if(!nodeObject['isLeaf'])
				{
					//当数据为异步获取，并且本次没有获取时
					if(treeConfig['useAjax'])
					{
						if(treeConfig['getting']){
							return;
						}
						//同一时间只能有一个ajax请求
						treeConfig['getting']=true;
						//添加等待图标				
						var sWait=getOneNodeHtml('', parseInt(that.parent()[0].getAttribute('emptynum'))+1, 'treeCacheImg',true);
						if(S.one('#treeCacheImg'))
						{
							S.one('#treeCacheImg').remove();	
						}	
						S.one(S.DOM.create(sWait)).insertAfter(this.parentNode);
						
						//异步请求数据
						S.ajax({
							type:'POST',
							url:treeConfig['ajaxUrl'],
							data:{'dataPath':thisLiId.substr(2)},
							dataType:'json',
							success:function(result){
								//移除等待图标
								if(S.one('#treeCacheImg'))
								{
									S.one('#treeCacheImg').remove();	
								}
								treeConfig['getting']=false;
								
								nodeObject.child=result;								
								writeHtml.call(that,nodeObject,thisLiId,aAddLi);
								eventHandler.call(that,icoName,aAddLi);	
							}
						});
					}
					else
					{
						writeHtml.call(that,nodeObject,thisLiId,aAddLi);						
						eventHandler.call(that,icoName,aAddLi);						
					}	
				}				
			}else{				
				selectClickNode.call(that);				
			}
		}
		
		/**
		* @private
		*/
		function selectClickNode(){
			//清除上次选择的节点
				if(_self.selectedNodeId !== '' && document.getElementById(_self.selectedNodeId)){					
					S.one('#'+_self.selectedNodeId)[0].children[0].style.backgroundColor='';
					S.one('#'+_self.selectedNodeId)[0].style.color='#333333';
				}
				_self.selectedNodeId=this.id;
				
				this.children[0].style.backgroundColor='#4058b2';
				this.style.color='white';
				
				//触发绑定的select事件
				_self.fire('select',_self.getSelectValue());				
		}
		
		
		/**
		 * 
		 * @param {string} icoName "min"或"more"
		 * @param {Object} aAddLi
		 * @private
		 */
		function eventHandler(icoName,aAddLi)
		{
			//+和-互换
			S.one(this).replaceClass(icoName,icoName==='more'?'min':'more');
			
			//移除本节点的事件	
			S.one(this).detach();
			S.one(this).on('click',function(e){				
				minOrMoreClick.call(this,icoName==='more'?'min':'more');			
			});		
			
			//为增加的节点添加事件
			//因为S.all().datch()有问题，所以需要一个一个删除		
			for(var i=0;i<aAddLi.length;i++)
			{
				if(document.getElementById('t'+aAddLi[i]))
				{
					S.one(document.getElementById('t'+aAddLi[i])).detach();
					S.one(document.getElementById('t'+aAddLi[i])).on('click',function(e){					
						minOrMoreClick.call(this,this.className);						
					});
				}
			}
		}
		
		/**
		* @private
		*/
		function writeHtml(nodeObject,thisLiId,aAddLi)
		{		
			var aLiHtml=[];				
			for(var i=0;i<nodeObject['child'].length;i++)
			{					
					aLiHtml[aLiHtml.length] = getOneNodeHtml(nodeObject['child'][i], parseInt(this.parentNode.getAttribute('emptynum'))+1, thisLiId + '-' + i);					
					aAddLi[aAddLi.length]=thisLiId + '-' + i;						
			}
			
			S.one(S.DOM.create(aLiHtml.join(''))).insertAfter(this.parentNode);
		}
		
		/**绑定点击事件
		* @private
		*/
		function addEvent()
		{		
			//增加事件
			S.all('.min').on('click',function(e){			
				minOrMoreClick.call(this,'min');			
			});
			S.all('.more').on('click',function(e){			
				minOrMoreClick.call(this,'more');			
			});
			S.all('.emptyMore').on('click',function(e){			
				minOrMoreClick.call(this,'emptyMore');			
			});
		}
		
		/**
		 * i-0-1，在数据对象中对应：
				treeConfig["nodeData"][0]["child"][1]
		 * nodeId 格式为"i-0-1"的节点id
		 * @private
		 */ 
		function nameToObject(nodeId)
		{		
			var aNodeId=nodeId.split('-');
			var nodeObject=treeConfig['nodeData'][aNodeId[1]];
			for(var i=2;i<aNodeId.length;i++)
			{
				nodeObject=nodeObject['child'][aNodeId[i]];
			}
			
			return nodeObject;
		}	
		
		/**
		 * 获取本节点的子节点的html
		 * node 本次处理的节点
		 * emptyNum 本节点前面的空格数
		 * liId：本li的id，格式为数据对象中的完整路径，如 i-0-1，在数据对象中对应：
		 * 		treeConfig["nodeData"][0]["child"][1]
		 * @private
		 */
		function getChildHtml(node,emptyNum,liId)
		{
			var aHtml=[],
				showAll=treeConfig.showAll;
			//获取对应节点的子节点的html
			if(node)
			{
				//当本节点有子节点时
				if(!node['isLeaf'])
				{
					var childNodes=node['child'];
					//循环本节点下的所有子节点
					for(var i=0;i<childNodes.length;i++)
					{					
							aHtml[aHtml.length] = getOneNodeHtml(childNodes[i], emptyNum, liId + '-' + i);
							if(showAll){
								aHtml[aHtml.length] = getChildHtml(childNodes[i], emptyNum + 1, liId + '-' + i);
							}												
					}
				}
			}//获取顶节点的子节点的html
			else
			{
				var nodeData=treeConfig['nodeData'];
				for(var i=0;i<nodeData.length;i++)
				{									
						aHtml[aHtml.length]=getOneNodeHtml(nodeData[i],0,'i-'+i);
						if(showAll){
							aHtml[aHtml.length]=getChildHtml(nodeData[i],1,'i-'+i);		
						}								
				}
			}
			
			return aHtml.join('');
		}
		
		/**
		 * 获取一个节点的html	 
		 * nodeObject：节点对象，就是节点名对应的对象
		 * emptyNum：本节点前面应该有几个空格
		 * liId：本li的id，格式为数据对象中的完整路径，如 i-0-1，在数据对象中对应：
		 * 		treeConfig["nodeData"][0]["child"][1]
		 * isCache，要显示正在获取数据的等待
		 * @private
		 */
		function getOneNodeHtml(nodeObject,emptyNum,liId,isCache)
		{
			emptyNum=parseInt(emptyNum);
			var nodeHtml;
			if(isCache)
			{				
				nodeHtml='<li id="'+liId+'" emptynum="'+emptyNum+'">'+new Array(emptyNum+1).join('<span class="empty" ></span>')+'<img src="http://img02.taobaocdn.com/tps/i2/T16WJqXaXeXXXXXXXX-32-32.gif" width="20" height="20" /></li>';	
			}	
			else
			{
				var isMore='more';
				if(treeConfig.showAll && firestShowAll){
					isMore='min';					
				}
				//移除等待图标
				if(S.one('#treeCacheImg'))
				{
					S.one('#treeCacheImg').remove();	
				}
				/*<ul class="tree">
					<li emptynum="0" id="i-1"><span id="ti-1" class="min"><label>节点二</label></span></li>
				  <ul>*/
				var aNodeHtml=[];
				aNodeHtml[aNodeHtml.length]='<li id="'+liId;
				aNodeHtml[aNodeHtml.length]='" emptynum="'+emptyNum;
				aNodeHtml[aNodeHtml.length]='">'+new Array(emptyNum+1).join('<span class="empty" ></span>');
				aNodeHtml[aNodeHtml.length]='<span class="'+(nodeObject['isLeaf']?'emptyMore':isMore);
				if(nodeObject['value']===treeConfig.selectValue){
					aNodeHtml[aNodeHtml.length]=' selectNode"';
				}else{
					aNodeHtml[aNodeHtml.length]='"';
				}
				aNodeHtml[aNodeHtml.length]=' id="t'+liId+'">';
				aNodeHtml[aNodeHtml.length]=(!nodeObject['isLeaf'] ||  !treeConfig.showCheckbox?'':'<input type="checkbox" id="c-'+liId+'" name="'+treeConfig['checkBoxName']+'[]" value="'+nodeObject['value']+'" class="selectInput" />');
				aNodeHtml[aNodeHtml.length]='<label>'+nodeObject['text'];
				aNodeHtml[aNodeHtml.length]='</label></span></li>';				
				
				nodeHtml=aNodeHtml.join('');				
			}		
			
			return nodeHtml;
		}
		
		//初始化树
		_init();
	}
	//继承S.Base，使得tree可支持on和fire
	S.extend(Tree,S.Base);

	S.namespace('LP');
	S.LP.Tree=Tree;
},{requires: ['core','sizzle','./css/tree.css']
});
