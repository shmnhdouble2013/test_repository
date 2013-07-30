/** 
* @fileOverview 天猫品牌站 标准版页面首页----右侧图片 模块js 
* @extends  KISSY.Base
* @creator 黄甲（旺旺：水木年华double）<huangjia2015@gmail.com>
* @depends  ks-core
* @version 1.0
* @update 2013-05-08
* @example
*     new SubjectList(); 
*/
KISSY.add('brandsite/1.0/widget/subjectlist', function(S){ 
	var Event = S.Event,
		DOM = S.DOM,
		Anim = S.Anim,
		Ajax = S.io,
		UA = S.UA,
		win = window,
		doc = document;
		
	function SubjectList(config){	
		var _self = this;
			
		SubjectList.superclass.constructor.call(_self, config);	  	
		
		_self._init();	
	}

	S.extend(SubjectList, S.Base);
	S.augment(SubjectList, {		
		// 初始化操作
		_init: function(){
			var _self = this;
			
			_self._eventnit();
		},
		
		// 事件初始化
		_eventnit: function(){
			var _self = this;
			
			// 查看专辑 动画效果 修补 mouseout 不断冒泡 和 使用 mouseleave 不冒泡的原因 ---- 修补方法  this === currentTarget永远指向监听事件的目标对象 vs target 当前对象
			Event.on(S.query('.j_designer'), 'mouseenter mouseleave', function(el){
				var eventType = el.type,					
					eventTarget = el.target; // 是否是查看专辑 a标签;				
				_self._finedDetailPageOnly(eventType, this);
			});	
			
			//大海报 hover --- click --效果
			Event.on( S.query('.j_imgContainer'), 'mouseenter mouseleave click', function(el){
				var eventType = el.type,
					thisobj = el.currentTarget,
					eventTarget = el.target,
					isAtagAubum = DOM.hasClass(eventTarget, 'j_toaudum'); // 是否是查看专辑 a标签;				
				_self._PosterHover(isAtagAubum, eventType, thisobj);
			});	
		},		
		
		// 查看专辑 -- 动画效果和 由大背景切入时 背景蒙版 隐藏显示控制 --修复mouseleave 不冒泡的bug
 		_finedDetailPageOnly: function(eventType, eventTarget){ 
			var _self = this,
				contantmaskingDom = S.one(eventTarget).parent().parent().last('.j_contantMasking'), 
				OutimeAnimObj = 'animObjOutime',  	// 离开时的 延时处理 对象名称
				OverimeAnimObj = 'animObjOverime';  // hover时的 延时处理 对象名称
			
			if( eventType === 'mouseenter'){
				DOM.hide(contantmaskingDom);
				_self._cancelTimeout(OutimeAnimObj);	
				_self._dlayTimeDo(OverimeAnimObj, function(){
					_self._newAminobj({
						node:eventTarget,
						cssobj:{'left':'0px'},
						runTime:0.2
					});
				});			
			}else if(eventType === 'mouseleave'){	
				DOM.show(contantmaskingDom);
				_self._cancelTimeout(OverimeAnimObj);	
				_self._dlayTimeDo(OutimeAnimObj, function(){				
					_self._newAminobj({
						node:eventTarget,
						cssobj:{'left':'-80px'},
						runTime:0.2
					});
				});
			}
		},
		
		// 大海报 hove效果
		_PosterHover: function(isAtagAubum, eventType, thisObj){
			var _self = this,
				imghref = DOM.attr(thisObj, 'data-href'),
				nodeDom = DOM.last(thisObj);
				
			if(isAtagAubum){
				DOM.hide(nodeDom);  //确保从 a标签 离开时 总区域时蒙版消失
				return;				//确保从 a标签 hover out 总区域不受 起影响 跟随变动 及其屏蔽 大背景点击跳转
			}
			if( eventType === 'mouseenter'){
				DOM.show(nodeDom);
			}else if(eventType === 'mouseleave'){	
				DOM.hide(nodeDom);
			}if(eventType === 'click'){			
				window.open(imghref);
			}	
		},
		
		// 公用方法 ------ 延迟处理方法
		_dlayTimeDo: function(cancelName, callback, isIntervalfn, time){
			var _self = this,
				time = 200 || time;
			
			if(time<1){
				return;
			}
			
			if(isIntervalfn){				
				_self.set(cancelName, setInterval( callback, time) );
			}else{
				_self.set(cancelName, setTimeout( callback, time) );
			}		
		},
		
		// 取消延迟执行 
		_cancelTimeout: function(cancelTimeText, isIntervalfn){
			var _self = this,
				cancelTimeobj = _self.get(cancelTimeText);
				
			if(!cancelTimeobj){
				return;
			}
			
			if(isIntervalfn){
				clearInterval(cancelTimeobj);
			}else{
				clearTimeout(cancelTimeobj);
			}			
		},
		
		// 实例化动画
		/*
		*config
		*{
			node:_self.get('parentNode'),
			cssobj:{'left':'-80px'},
			runTime:0.3,
			EasingFn:''
			callBack:''		
		}
		*
		**/
		_newAminobj: function(config){
			var _self = this;
						
			if(!config.node || !config.cssobj){
				return;
			}
				
			var oldAminiObj = new Anim(config.node, config.cssobj, config.runTime || '', config.EasingFn || '', config.callBack || '' );
			oldAminiObj.run();
		}
	});	
	
	return SubjectList;	
},{requires:[]});