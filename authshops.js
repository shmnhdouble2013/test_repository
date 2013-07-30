/**
* @fileOverview 猫品牌站 标准版页面--左侧导航栏--分销商 轮播列表模块js 
* @extends  KISSY.Base
* @creator 黄甲（旺旺：水木年华double）<huangjia2015@gmail.com>
* @depends  ks-core、gallery/slide/1.0/--Slide
* @version 1.0
* @update 2013-04-18
* @example
*    new AuthShops('distribList', {
*		triggerSelector:'li a',
*		autoSlide:false,
*		hoverStop:true, 
*		effect:'none' // 无效果
*	});
*/
KISSY.add('brandsite/1.0/widget/authshops', function(S, Slide){ 
	var Event = S.Event,
		DOM = S.DOM,
		Anim = S.Anim,
		Ajax = S.io,
		UA = S.UA,
		win = window,
		doc = document;
		
	function AuthShops(container, config){	
		var _self = this;
		
		_self.container = container;  	
		_self.config = S.get(config);  	
		
		AuthShops.superclass.constructor.call(_self, config);	  	
		
		_self._init();	
	}

	S.extend(AuthShops, S.Base);
	S.augment(AuthShops, {		
		// 初始化操作
		_init: function(){
			var _self = this;
			
			_self._renderSwitchable();
		},
				
		// 初始化 授权店铺li轮播 组件
		_renderSwitchable: function(){
			var _self = this;
			var slideConfig = {
				eventType:'mouseenter',
				navClass:'ui-slide-nav-mini', 		 //导航控制条 ul class 
				contentClass:'j_scrolLableContent',  // 轮播容器 class， 轮播内容div 外层大容器 
				pannelClass:'j_scrolLableContent',   // 轮播内容div class 
				selectedClass:'j_active',			// 当前轮播 控制条 class 
				triggerSelector:'li',				// 轮播 控制条 dom结构
				autoSlide:true,
				hoverStop:true, 
				effect:'none' // 垂直切换
			};
			
			slideConfig = S.merge(slideConfig, _self.config);
			new Slide( _self.container, slideConfig);
		}
	});	
	
	return AuthShops;	
},{requires:['gallery/slide/1.0/']});