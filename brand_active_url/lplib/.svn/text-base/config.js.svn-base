KISSY.config({
	packages:[{
		name:"gallery",
		tag:"20130301",
		path:"http://a.tbcdn.cn/s/kissy",
		charset:'utf-8'
	},{
		name:"2.0",
		tag:"201303221307",
		path:"http://assets.lp.alibaba.com/s/lplib",
		charset:'utf-8'
	},{
		name:"1.0",
		tag:"201303221307",
		path:"http://assets.lp.alibaba.com/s/lplib",
		charset:'utf-8'
	},{
		name:"lpassert",
		tag:"201303221307",
		path:"http://assets.lp.alibaba.com/s/lplib",
		charset:'utf-8'
	},{
		name:"lpmodule",
		tag:"201303221307",
		path:"http://assets.lp.alibaba.com/s/lplib",
		charset:'utf-8'
	},{
		name:"lp4js",
		tag:"201303221307",
		path:"http://assets.lp.alibaba.com/lp4pl",
		charset:'utf-8'
	},{
		name:"csjs",
		tag:"201303221307",
		path:"http://assets.lp.alibaba.com/lp4cs",
		charset:'utf-8'
	}]
});

if(document.domain.indexOf('alibaba.com') > -1){
	document.domain = 'alibaba.com';
}
KISSY.ready(function(S){
	S.use('core', function(S){
		if (!S.Config.debug) {
			// 老的埋点(量子统计)
			/*if(document.location.href.indexOf('lp.alibaba.com') > -1){
				var  img=document.createElement('img');
				img.src='http://img.tongji.linezing.com/2898864/tongji.gif';
				S.one(img).css({
					'display':'none'
				});
				document.body.appendChild(img); 
			}*/
			// 新的埋点(cnzz)
			if(document.location.href.indexOf('alibaba.com') > -1){
				S.getScript('http://s85.cnzz.com/stat.php?id=5092112&web_id=5092112');
			}
		}
	});
});


