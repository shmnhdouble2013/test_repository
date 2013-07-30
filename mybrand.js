/** 
* @fileOverview 天猫品牌站 标准版页面 - 左侧导航--关注 +分享 模块 js
* @extends  KISSY.Base
* @creator 黄甲（旺旺：水木年华double）<huangjia2015@gmail.com>
* @depends  ks-core、tml/share
* @version 1.0
* @update 2013-05-20
* @example
*     new Mybrand({
*		 attentionContanier:'TMLSharaae1', // 关注容器id
		 attentionNoClass:'TMLSharfae1'	   // 关注 数 class
*	  });
*/

KISSY.add('brandsite/1.0/widget/mybrand', function(S, Share, Brand){ 
	var Event = S.Event,
		DOM = S.DOM,
		Anim = S.Anim,
		Ajax = S.io,
		UA = S.UA,
		win = window,
		doc = document;
		
	function Mybrand(config){	
		var _self = this;
			
		Mybrand.superclass.constructor.call(_self, config);	  	
		
		_self._init();	
	}

	S.extend(Mybrand, S.Base);
	S.augment(Mybrand, {		
		// 初始化操作
		_init: function(){
			var _self = this;
			
			_self._eventInit();
			_self._renderLeftBrand();
		},		
		
		// 事件初始化
		_eventInit: function(){
			var _self = this;
			
			// 鼠标移动到 logo效果
			Event.on( S.query('.j_logoContainer'), 'mouseenter mouseleave', function(el){
				var eventType = el.type,					
					eventTarget = el.target;
				_self._goBrandHover(eventType);
			});	
			
			// 蒙版监控打开链接
			Event.on('div.j_logo_mask', 'click', function(el){
				var eventTarget = el.target,
					urlStr = DOM.attr( DOM.first(eventTarget, 'a'), 'href' ) || '';
					
				_self._openUrl(urlStr);
			});	
		},
		
		// 初始化 左边栏 --关注 
		_renderLeftBrand: function(){
			var _self = this;
			var shareAttemtionConfig = {
				container: '#'+_self.get('attentionContanier'),  // 组件外层容器
				numEl: '.'+_self.get('attentionNoContainer'),    // 关注数容器
				cancelCls: '.tm-bLb-cancel'						 // 取消关注样式 写死
			};
			
			new Brand(shareAttemtionConfig);
		},
		
		// 去品牌站首页 hover效果
		_goBrandHover: function(eventType){
			var _self = this;
				
			if(eventType === 'mouseenter'){
				DOM.show('div.j_logo_mask');
			}else if(eventType === 'mouseleave'){	
				DOM.hide('div.j_logo_mask');
			}
		},
		
		// 打开链接方法
		_openUrl:function(url){
			var _self = this,
				isUrl = /^http:\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]':+!]*([^<>""])*$/.test(url);
			
			if(isUrl){			
				window.open(url);
			}	
		}
	});	
	
	return Mybrand;	
},{requires:['tml/share', 'brandsite/1.0/widget/brand']});