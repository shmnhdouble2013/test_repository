/** @fileOverview 菜单控件
* @author  孙炯军(jiongjun.sunjj@alibaba-inc.com)，冯红燕(样式支持),董晓庆	1. 添加menuclick事件，2. 获取当前选中的节点（配置）
* @version 1.0
*/
KISSY.add(function(S)
{
	/** 
  	* @exports S.LP as KISSY.LP
  	*/
	var DOM=S.DOM,
		E=S.Event,
		Node = S.Node,
		CLS_MENU_ACTIVE = 'menu-item-active', // active 样式
		CLS_MENU_MINUS='menu-minus',  //close 样式
		CLS_MENU_TAG='menu-tag', // 获取 一级Menu 项 提取 CLASS
		CLS_MENU_PLUS='menu-plus', // open 样式
		CLS_MENU_CONTAINER='menu-container', // Menu 容器样式
		CLS_MENU_UL='menu-ul', //menu-ul 最外层ul
		CLS_CLEAR_FLOAT='ks-clear',  //清除float
		CLS_FISRT_CONTAINER='menu-first-container',
		CLS_MENU_LI='menu-li', //一级UL下LI的样式 
		CLS_MENU_ITEM='menu-item', // 一级目录 内容项
		CLS_MENU_SP='menu_sp', //Menu 分割线样式
		CLS_MENU_UL_NEXT='menu-ul-next', //下级menu-ul
		CLS_MENU_UL_NEXT_CLOSE='menu-ul-next-close', //下级menu-ul close样式
		CLS_MENU_NEXT_ITEM='menu-item-next',  //下级Menu item 样式
		CLS_MENU_ITEM_BODY='menu-p-content', //Menu 中间 部门样式（可以适应大小变化）
		CLS_FONT='menu-font',
		DATA_ITEM = 'data-item',
		PREFIX_MENU_ITEM = 'menu-item-', // 一级内容项前缀
		PREFIX_MENU_ITEM_NEXT='menu-item-next_', //二级内容项前缀
		NOT_FOUND_NODE='对不起,绑定时，找不到绑定节点.',
		WIDTH_SET_VALUE='对不起，你设置的宽度不是正确的值！',
		HEIGHT_SET_VALUE='对不起，你设置的高度不是正确的值！',
		DATA_MIN_ITEM_WIDTH=100,
		DATA_LEFT_WIDTH=25,
		COLOR_NORMAL='#5c637b',
		COLOR_NORMAL_HOVER='#414da7',
		COLOR_ACTIVE='#FFF';
	
	/**  
	* 当外界改变Menu的选中状态
	* @name S.LP.Menu#selectchanged  
	* @event  
	* @param {String}  text  将要选中的菜单项的文本值
	* @param {String} id  将要选中的菜单项的ID
	* @param {String} href   将要选中的菜单项的地址
	* @example  leftMenu(menu 对象).on('selectchanged',{text,id,href}
	*                    { alert('hasChanged')}) //里面可以获取到将被更改的值
	*/
	
	/**  
	* 当Menu进行 主动 点击菜单时
	* @name S.LP.Menu#menuclick  
	* @event  
	* @param {String}  text  选中的菜单项的文本值
	* @param {String} id  选中的菜单项的ID
	* @param {String} href   选中的菜单项的地址
	* @example  leftMenu(menu 对象).on('menuclick',{obj}
	*                    { alert('clicked')}) //里面可以获取到被点击的Obj[text,id,href]
	*/
	var menu=function(config){
		var defaultConfig={
			collapsible:true, //是否可以折叠
			items:[

			],//菜单项
			renderTo:'body'
		};
		var _self=this;
		var _config=S.merge(defaultConfig, config); //合并配置方案
		menu.superclass.constructor.call(_self, _config);
		S.mix(_self,_config); //复制到自身上
		_self._init();
	};
	S.extend(menu,S.Base); 
	S.augment(menu,
	/** @lends S.LP.Menu.prototype */	
	{ 
		msg: 'Loading...',
		NOT_FOUND_TAB:'对不起，找不到配套使用的Tab卡对象',
		TAB_FUNCTION_ERROR:'对不起，调用tab函数出错！',
		
		//初始化HTML 代码
		_html:function() 
		{
			var _self=this;
			var	appendNode=S.one(_self.renderTo);
			
			if(appendNode===null){
				_self.exception(NOT_FOUND_NODE);
				return ;
			}
			_self.set('container',appendNode);
			
			if(_self.items.length!==0){
				var tempHtml='<div class="'+CLS_MENU_CONTAINER+'"><ul class="'+CLS_MENU_UL+' '+CLS_CLEAR_FLOAT+'"></ul></div>';
				var 	menuEl = new Node(tempHtml).appendTo(appendNode),
						list= menuEl.children('ul'),
						items = _self.items;
				for(var i=0;i<items.length;i++)
				{
					_self._createMenuItem(items[i],list);
				}
				DOM.css('.'+CLS_MENU_ITEM,{cursor:'pointer'});
				DOM.css('.'+CLS_MENU_TAG,{cursor:'pointer'});
			}
		},
		//创建菜单项（一级菜单）
		_createMenuItem:function(item,parent){
			if(!item)
			{
				return;
			}
			var	_self = this,
					id='',
					tempHtml='',
					itemEl=null;
			if	(item.id){
					id=PREFIX_MENU_ITEM+item.id;
			}
			else{
					id=PREFIX_MENU_ITEM+S.guid(); //设置ID
					S.log('auto set id for  item');
			}
			var  isOpenTag = '';
			if (item.isOpen === false){
				isOpenTag = CLS_MENU_MINUS;
			}	
			else{
				isOpenTag = CLS_MENU_PLUS; 
			}
			tempHtml+='<li class="'+CLS_MENU_LI+'"><div class="'+CLS_FISRT_CONTAINER+'"><p class="'+CLS_MENU_ITEM+'" id="'+id+' ks-clear" ><span class="'+isOpenTag+' '+CLS_MENU_TAG+'"></span><span class="'+CLS_FONT+'">'+(item.text || '') +'</span></p></div> ';
			tempHtml+='</li>';
			itemEl = new Node(tempHtml).appendTo(parent);
			itemEl.data(DATA_ITEM,item);
			if(item.items)
			{
				var ultemp = '';
				if(item.isOpen===false){
					ultemp='<ul class="'+CLS_MENU_UL_NEXT+' '+CLS_MENU_UL_NEXT_CLOSE+'" ></ul>';
				}
				else{
					ultemp='<ul class="'+CLS_MENU_UL_NEXT+'" ></ul>';
				}
				var ulEl = new Node(ultemp).appendTo(itemEl);
				if(item.items.length!==0)
				{
					var  nextitem=item.items;
					for(var j=0;j<nextitem.length;j++)
					{
						_self._createSubMenuItem(nextitem[j],ulEl);
					}
				}
			}
			return  itemEl;
		},
		// 设置子菜单
		_createSubMenuItem:function(item,parent){
			if(!item)
			{
				return;
			}
			var id='',
				tempHtml = '';
				if(item.id){
					id=PREFIX_MENU_ITEM_NEXT+item.id;
				}
				else{
					id=PREFIX_MENU_ITEM_NEXT+S.guid(); //设置ID 
				}
			tempHtml+='<li ><a class="'+CLS_MENU_NEXT_ITEM+'" id="'+id+'" href="' + ( item.href === undefined ? '#' : item.href ) +'"><em class="'+CLS_MENU_ITEM_BODY+'">'+item.text+'</em></a></li>';
			var itemEl = new Node(tempHtml).appendTo(parent);
			itemEl.data(DATA_ITEM,item);
		},
		
		//设置宽度和高度
		_setUI:function(){  
			var _self=this,
				mathReg=/^\d{0,10}$/;
			if(_self.height){
				var tempHeight=_self.height.replace('px','');
				if(tempHeight!==''){
					if(tempHeight.match(mathReg)===null){
						_self.exception(HEIGHT_SET_VALUE);
					}
					else{
						DOM.css('.menu-container',{height:tempHeight+'px'});
					}
				}
			}
			if(_self.width){
				var tempWidth=_self.width.replace('px','');
				if(tempWidth!==''){
					if(tempWidth.match(mathReg)===null){
						_self.exception(WIDTH_SET_VALUE);
					}
					else{
						DOM.css('.'+CLS_MENU_CONTAINER,{width : tempWidth + 'px'});
					}
				}
			}
			DOM.css('.'+CLS_FONT,{width : (tempWidth-DATA_LEFT_WIDTH) + 'px'});
		},
		//设置是否可以收缩
		_setCollapible:function() {  
			var _self=this;
			if(_self.collapible){
				var containerEl = _self.get('container');
				//item 主体事件
				containerEl.all('.'+CLS_MENU_ITEM).on('click',function(event){
				var  _eventthis=this;
				event.preventDefault();
				var 	ulDom=DOM.siblings(DOM.parent(_eventthis))[0],
						ctrolTag=DOM.children(_eventthis)[0];
					if(DOM.css(ulDom,'display')==='block'){
						DOM.css(ulDom,{display:'none'});
					}
					else{
						DOM.css(ulDom,{display:'block'});   
					}	
					if(DOM.attr(ctrolTag,'class')===CLS_MENU_MINUS +' '+ CLS_MENU_TAG ){
						DOM.attr(ctrolTag,'class',CLS_MENU_PLUS +' '+ CLS_MENU_TAG);
					}
					else{
						DOM.attr(ctrolTag,'class',CLS_MENU_MINUS +' '+ CLS_MENU_TAG );
					}
				});
				//控制按钮+- 事件
				containerEl.all('.'+CLS_MENU_TAG).on('click',function(event){
				var  _eventthis=this,
						siblings=DOM.siblings(DOM.parent(DOM.parent(_eventthis)));
					if(siblings.length>0){
						var ulDom=siblings[0];
						if(DOM.css(ulDom,'display')==='block'){
							DOM.css(ulDom,{display:'none'});
						}
						else{
							DOM.css(ulDom,{display:'block'});
						}		
					}
					if(DOM.attr(_eventthis,'class')===CLS_MENU_MINUS +' '+ CLS_MENU_TAG){
						DOM.attr(_eventthis,'class',CLS_MENU_PLUS +' '+ CLS_MENU_TAG);
					}
					else{
						DOM.attr(_eventthis,'class',CLS_MENU_MINUS +' '+ CLS_MENU_TAG);
					}
					event.stopPropagation();
				});
			}
		},
		//与外部tab 通讯 事件
		_setTabEvent:function(){
		var	 _self=this,
				containerEl = _self.get('container');
			containerEl.all('.'+CLS_MENU_NEXT_ITEM).on('click',function(event){
			var  _eventself=this;
			event.preventDefault();
			var id=DOM.attr(this,'id'),
				postid=id.replace(id.split('_')[0]+'_',''),
				text = DOM.text(this),
				href = DOM.attr(this,'href');
			_self.fire('menuclick',{text:text,id:postid,href:href});
			if(DOM.attr(this,'class')===CLS_MENU_NEXT_ITEM) {  //如果已被选中，则不促发
					_self.setMenuActive(postid);
				}
				_eventself.blur(); // 失焦，去掉虚线框
			});
		},
		//设置 下级 字体事件
		_setNextItemFontEvent:function(){
		var	 _self=this,
				containerEl = _self.get('container');
			containerEl.all('.'+CLS_MENU_NEXT_ITEM).on('mouseover',function(){
					DOM.css(this,{color:COLOR_NORMAL_HOVER});
			});
			containerEl.all('.'+CLS_MENU_NEXT_ITEM).on('mouseleave',function(){
					DOM.css(this,{color:COLOR_NORMAL});
			});
		},
		//设置菜单项选中
		getSelectedItem :function(){
			var _self=this,
				containerEl = _self.get('container'),
				activeEl = containerEl.one('.'+CLS_MENU_ACTIVE);
			if(!activeEl){
				return null;
			}
			var menuItemEl = activeEl.parent(),
			item = menuItemEl.data(DATA_ITEM);
			return item;
		},
		
	// 设置选中菜单
		setMenuActive:function(id){	
			var _self=this,
			containerEl = _self.get('container');
			if(id==='none'){   //修复全部关闭后不选中
				DOM.replaceClass(containerEl.all('.'+CLS_MENU_ACTIVE),CLS_MENU_ACTIVE,CLS_MENU_NEXT_ITEM); //设置为normal
				DOM.css(containerEl.all('.'+CLS_MENU_NEXT_ITEM),{color:COLOR_NORMAL});
				return;
			}	
			var ulDom=DOM.parent(DOM.parent('#'+PREFIX_MENU_ITEM_NEXT+id));
			if(!ulDom){
				return;
			}
			if(DOM.css(ulDom,'display')==='none') { //如果被收缩着，就展开
				var ctrolTag=DOM.children(DOM.children(DOM.prev(ulDom))[0])[0];
				DOM.attr(ctrolTag,'class',CLS_MENU_PLUS);
				DOM.css(ulDom,{display:'block'});
			}
			var href=DOM.attr('#'+PREFIX_MENU_ITEM_NEXT+id,'href');
			var text=DOM.text('#'+PREFIX_MENU_ITEM_NEXT+id);
			_self.fire('selectchanged',{text:text,id:id,href:href}); //触发外部注册事件
			
			DOM.replaceClass(containerEl.all('.'+CLS_MENU_ACTIVE),CLS_MENU_ACTIVE,CLS_MENU_NEXT_ITEM); //设置为normal
			DOM.replaceClass('#'+PREFIX_MENU_ITEM_NEXT+id,CLS_MENU_NEXT_ITEM,CLS_MENU_ACTIVE); //设置选中
			
			//字体样式代码设置
			DOM.css(containerEl.all('.'+CLS_MENU_NEXT_ITEM),{color:COLOR_NORMAL});
			DOM.css(containerEl.all('.'+CLS_MENU_ACTIVE),{color:COLOR_ACTIVE});
			containerEl.all('.'+CLS_MENU_ACTIVE).on('mouseover',function(){
				var _eventself=this;
				if(DOM.attr(_eventself,'class')===CLS_MENU_NEXT_ITEM){
					DOM.css(_eventself,{color:COLOR_NORMAL_HOVER});
				}
				else{
					DOM.css(_eventself,{color:COLOR_ACTIVE});
				}
			});
			containerEl.all('.'+CLS_MENU_ACTIVE).on('mouseleave',function(){
				var _eventself=this;
				if(DOM.attr(_eventself,'class')===CLS_MENU_NEXT_ITEM){
					DOM.css(_eventself,{color:COLOR_NORMAL});
				}
				else{
					DOM.css(_eventself,{color:COLOR_ACTIVE});
				}
			});
		},
		exception:function(msg)
		{
			S.log(msg); //出错显示
		},
		_initDom:function(){
		var _self=this;
			_self._html();
			_self._setUI();
		},
		//init dom event
		_initEvent:function(){
			var	_self=this;
					_self._setNextItemFontEvent();
					_self._setCollapible();
					_self._setTabEvent();
		},
		//初始化事件
		_init:function(){
			var _self=this;
			_self._initDom();
			_self._initEvent();
		}
		});
	
	S.namespace('LP');
	/**
	* 屏蔽指定元素，并显示加载信息
	* @class 菜单控件
	* @param {Object} config 配置信息<br>
	* 1) collapsible :是否可以折叠<br>
	* 2) items : 配置项（现在支持二级）<br>
	*3）renderTo: 渲染到那个DOM节点
	* @example  var leftMenu=S.LP.Menu({collapsible:true, items:[id:'1',text:'菜单1',href:'lp.taobao.com'],
	    renderTo:'#mainContainer'});
	*/
	S.LP.Menu=menu;
}, {
    requires: ['core']
});
	
	