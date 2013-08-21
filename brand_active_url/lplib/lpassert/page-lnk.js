/** @fileOverview 页面跳转
* 支持2种跳转，根据id跳转，根据Url跳转
* @author <a href="mailto:dxq613@gmail.com">董晓庆 旺旺：dxq613</a>  
* @version 1.0.1  
*/
KISSY.add(function(S){
	
	//设置Tab间跳转
	S.Event.delegate(document, 'click', '.page-lnk', function(event){
		event.preventDefault();

		var sender = S.one(event.currentTarget),
			id = sender.attr('data-id') || sender.attr('id'),
			pageId = sender.attr('data-page'),
			title = sender.attr('title'),
			href = sender.attr('data-href');
		if(top.pageManger){
			if(pageId){
				top.pageManger.redirectPage('',pageId,true);
			}else{
				top.pageManger.openPage('',id,title,href);
			}
		}
	});
	/*S.all('.page-lnk').on('click',function(event){
		event.preventDefault();

		var sender = S.one(this),
			id = sender.attr('id') || sender.attr('data-id'),
			pageId = sender.attr('data-page'),
			title = sender.attr('title'),
			href = sender.attr('data-href');
		if(top.pageManger){
			if(pageId){
				top.pageManger.redirectPage('',pageId,true);
			}else{
				top.pageManger.openPage('',id,title,href);
			}
		}

	});*/
	//直接链接时填写，Class '.direct-lnk'
	S.Event.delegate(document, 'click', '.direct-lnk', function(event){
		var sender = S.one(event.currentTarget),
			title = sender.attr('title'),
			href = sender.attr('href');
		if(top.pageManger){
			top.pageManger.setPageTitle(title);
			location.href=href;
		}
	});
	/*S.all('.direct-lnk').on('click',function(event){
		var sender = S.one(this),
			title = sender.attr('title'),
			href = sender.attr('href');
		if(top.pageManger){
			top.pageManger.setPageTitle(title);
			location.href=href;
		}
	});*/
},{requires:['core']});