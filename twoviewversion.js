/** 
* @fileOverview 浏览器 窗口宽度 监控 公共通用方法 
* @extends  KISSY.Base
* @creator 黄甲 (旺旺：水木年华double_2) <huangjia2015@gmail.com>
* @depends  ks-core
* @version 1.0
* @update 2013-05-29
* @example
*     new MoreViewVersion([720, 750, 990, 1080, 1190]);
*/

KISSY.add(function(S){ // 'wedget_j/twoviewversion',  
	var Event = S.Event,
		DOM = S.DOM,
		Anim = S.Anim,
		Ajax = S.io,
		UA = S.UA,
		win = window,
		doc = document,
		body = doc.body;
		
	var RESNO = 10,						  				  // 增益 监控 范围值 
		RANGENO = [550, 750, 850, 950, 990, 1190, 1280]; // 监控分辨率范围  
		
	function MoreViewVersion(config){	
		var _self = this;
		
		_self.config = config;
		
		if( !(_self instanceof MoreViewVersion) ){
			return new MoreViewVersion(config);
		}
		
		MoreViewVersion.superclass.constructor.call(_self);	  	
		
		_self._init();	
	}
	
	S.extend(MoreViewVersion, S.Base);
	S.augment(MoreViewVersion, {		
		
		// 初始化操作
		_init: function(){
			var _self = this;
			
			// 判断引用数据
			_self._arguIf();
			
			// 初始化 宽度标示
			_self._numbCompar();
			
			// 窗口resize事件监控
			_self._eventnit();
		},

		// 数组参数 调用判断 + 数组参数处理
		_arguIf: function(){
			var _self = this;
			
			if(S.isArray(_self.config)){
				RANGENO = _self.config;
			}else{
				S.log('未指定监控范围或者不是数组！');
			}
			_self._setWindowsView();			
		},			
		
		// 处理参数
		_setWindowsView: function(){
			var _self = this;
			
			S.each(['_validAry', '_addRangeValue', 'sortAry'], function(str){
				RANGENO = _self[str](RANGENO);
			});	
		},		
		
		// 增加容差范围值
		_addRangeValue: function(ary){
			var _self = this,
				addNo = [];
			
			S.each(ary, function(val){
				addNo.push( val+RESNO );
			});
			
			return addNo;
		},
		
		// 排序数组 --- 大到小
		sortAry: function(ary){
			var _self = this;
			
			ary.sort(sortfn);
			
			function sortfn(a, b){
				return b-a;
			}
			return ary;
		},
		
		// 去重 + 数字  验证
		_validAry: function(ary){
			var _self = this,
				afterAry = [],
				ary = S.unique(ary);
				
			S.each(ary, function(val){
				if(S.isNumber(val)){
					afterAry.push(val);
				}/* else{
					if( S.isNumber( parseInt(val, 10) ) ){
						afterAry.push(val);
					}
				} */
			});			
			return afterAry;
		},
				
		// 数值 范围比对 -- 写入标志class
		_numbCompar: function(){
			var _self = this,
				compreValue = _self.oldViewWidth + RESNO,
				view = DOM.viewportWidth(),
				aryEndIdx = RANGENO.length-1,
				thatWidth;
				
			// 边界值判断 如果当前值 >= / <= 数组 最大/最小值  且 上次class为 最大/最小 值标示，则退出 
			if(view >= compreValue && compreValue === RANGENO[0] ){
				return;
			}else if(view <= compreValue && compreValue === RANGENO[aryEndIdx] ){
				return;
			}
						
			// 大于等于 数组 从大到小 某一值 或者 小于 数组任何值 
			S.each(RANGENO, function(val, index){					
				if( view < val && index === aryEndIdx ){ 
					thatWidth = val;
					return false;
				}else if( view >= val ){ 
					thatWidth = val;
					return false;
				}
			});
			_self._writeBodyWth(thatWidth, _self.oldViewWidth);
		},
				
		// 事件初始化
		_eventnit: function(){
			var _self = this,
				oCompare = S.buffer(_self._numbCompar, 300, _self);
			
			// 监控浏览器大小
			Event.on(win, 'resize', oCompare);
		},	
		
		// body写入 宽度标识  只要一个有值即可 --- 先移除 再写入 的顺序
		_writeBodyWth: function(newView, oldView){
			var _self = this,
				newView = newView - RESNO;// 当前宽度-容差值 = class设定标示宽度 ---- 将宽度值还原到 容差之前的值
			
			// 如果写入值 和 移除值一样 则不处理
			if(newView === oldView){
				return;
			}
			
			// 若有值则写入 标志class
			if(oldView){
				DOM.removeClass(body, 'w' + oldView);
			}
			
			if(newView){
				DOM.addClass(body, 'w' + newView);				
				// 标示宽度值 -- 控制台提示
				_self.oldViewWidth = newView;
				S.log('当前body宽度class标示：'+'w' + newView);
			}else{
				S.log('无效的宽度值！');
			}			
		}
	});
		
	return MoreViewVersion;
}, {requires:['core']});