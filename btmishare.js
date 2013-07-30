/** 
* @fileOverview 天猫品牌站 标准版页面首页----右侧图片 分享模块独立 js 
* @extends  KISSY.Base
* @creator 黄甲（旺旺：水木年华double）<huangjia2015@gmail.com>
* @depends  ks-core、tml/share
* @version 1.0
* @update 2013-05-20
* @example
*     new LoveShare({
*		container:'shareaip',   // 分享组件的 id str
		id:'6',
		type:'8',
		url:'http://www.baidu.cn',
*		piclist:['http://img.daily.taobaocdn.net/L1/97/39909/siteCover/subjectc1072.jpg']             // 分享图片src
*	  }); 
*/

KISSY.add('brandsite/1.0/widget/btmishare', function(S, Share){
	var Event = S.Event,
		DOM = S.DOM,
		Anim = S.Anim,
		Ajax = S.io,
		UA = S.UA,
		win = window,
		doc = document;
		
	function LoveShare(config){	
		var _self = this;
		
		LoveShare.superclass.constructor.call(_self, config);	  	
		
		_self._init();	
	}

	S.extend(LoveShare, S.Base);
	S.augment(LoveShare, {		
		// 初始化操作
		_init: function(){
			var _self = this;
			
			_self._renderImgShres();
		},
		
		// 事件初始化
		_eventnit: function(){
			var _self = this;
		},		
		
		// 初始化 爱分享 向左滑动 组件
		_renderImgShres: function(){
			var _self = this,
				shareConfig = {
					key: _self.get('type') === 'item' ? 'itemId' : '',
					id:_self.get('id') || '',
					type:_self.get('type') || 'act',
					picList: _self.get('piclist'),
					container:'#'+_self.get('container'),
					title:_self.get('title') || '分享',
					url:_self.get('url') || '分享链接',
					comment:_self.get('sharText') || '看最有营养的品牌杂志专题，又可以立刻购买，我在天猫品牌街，推荐给亲哦~~',
					style:_self.get('style') || 'mini',
					dir: _self.get('dir') || 'left',				// 组件hover展开方向
					copySucText:'擦，之前没考虑到~'
				};
			var afterConfig = {
				mask:_self.get('mask'),				
				showRecTip:_self.get('showRecTip'),
				style:_self.get('style'),
				dir:_self.get('dir'),
				copySucText:_self.get('copySucText')
			};
			/*
				// full 横向配置 --- 世显 vs 墨冥
				mask:true,
				key: _self.get('type')==='item' ? 'itemId' : '',
				showRecTip:false
				
				style:_self.get('style') || '',
				dir: '',				// 组件hover展开方向
				copySucText:''
					
			*/
			shareConfig = S.merge(shareConfig, afterConfig);
			
			new Share(shareConfig);
		}
	});	
	
	return LoveShare;	
},{requires:['tml/share']});