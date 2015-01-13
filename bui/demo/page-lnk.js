/**
* @fileOverview 页面跳转
* @fileOverview 支持2种跳转: 1、根据id跳转;  2、根据Url跳转
* @author huangjia
* @version 1.0.1  
*/
KISSY.add('page-lnk', function(S){

    var Event = S.Event;

    // 获取全局 管理对象，全局变量
    var PAGEMANGER = top.pageManger;

    // 如果不是存在于 框架页中，则退出
    if(!PAGEMANGER) {
        return;
    }

    // 设置Tab间跳转
	Event.delegate(document, 'click', '.page-lnk', function(event){
		event.preventDefault();

		var sender = S.one(event.currentTarget),
			id = sender.attr('data-id') || sender.attr('id'),
			pageId = sender.attr('page-id'),
			title = sender.attr('title'),
			href = sender.attr('data-href') || sender.attr('href');

        if(pageId){
            PAGEMANGER.redirectPage(null, pageId);
        }else {
            var tabConfig = {
                title: title,
                href: href,
                id : id
            }
            PAGEMANGER.setPageSelected(null, null, false, tabConfig );
        }
	});

	// 直接跳转链接 填写Class '.direct-lnk'
	Event.delegate(document, 'click', '.direct-lnk', function(event){
        event.preventDefault();

        var sender = S.one(event.currentTarget),
			title = sender.attr('title'),
			href = sender.attr('href');

        PAGEMANGER.setPageTitle(title);
        location.href = href;
	});

}, {requires:['core']} );