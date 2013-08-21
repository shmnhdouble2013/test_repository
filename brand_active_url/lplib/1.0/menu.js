/** @fileOverview �˵��ؼ�
* @author  �ﾼ��(jiongjun.sunjj@alibaba-inc.com)�������(��ʽ֧��),������	1. ���menuclick�¼���2. ��ȡ��ǰѡ�еĽڵ㣨���ã�
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
		CLS_MENU_ACTIVE = 'menu-item-active', // active ��ʽ
		CLS_MENU_MINUS='menu-minus',  //close ��ʽ
		CLS_MENU_TAG='menu-tag', // ��ȡ һ��Menu �� ��ȡ CLASS
		CLS_MENU_PLUS='menu-plus', // open ��ʽ
		CLS_MENU_CONTAINER='menu-container', // Menu ������ʽ
		CLS_MENU_UL='menu-ul', //menu-ul �����ul
		CLS_CLEAR_FLOAT='ks-clear',  //���float
		CLS_MENU_LI='menu-li', //һ��UL��LI����ʽ 
		CLS_MENU_ITEM='menu-item', // һ��Ŀ¼ ������
		CLS_MENU_SP='menu_sp', //Menu �ָ�����ʽ
		CLS_MENU_UL_NEXT='menu-ul-next', //�¼�menu-ul
		CLS_MENU_UL_NEXT_CLOSE='menu-ul-next-close', //�¼�menu-ul close��ʽ
		CLS_MENU_NEXT_ITEM='menu-item-next',  //�¼�Menu item ��ʽ
		CLS_MENU_ITEM_LEFT='menu-p-lf', //menu ѡ�� ��ɫ��ͷ��߲�����ʽ
		CLS_MENU_ITEM_RIGHT='menu-p-rt', //menu ѡ�� ��ɫ��ͷ�ұ߲�����ʽ
		CLS_MENU_ITEM_BODY='menu-p-content', //Menu �м� ������ʽ��������Ӧ��С�仯��
		DATA_ITEM = 'data-item',
		PREFIX_MENU_ITEM = 'menu-item-', // һ��������ǰ׺
		PREFIX_MENU_ITEM_NEXT='menu-item-next_', //����������ǰ׺
		NOT_FOUND_NODE='�Բ���,��ʱ���Ҳ����󶨽ڵ�.',
		WIDTH_SET_VALUE='�Բ��������õĿ�Ȳ�����ȷ��ֵ��',
		HEIGHT_SET_VALUE='�Բ��������õĸ߶Ȳ�����ȷ��ֵ��',
		DATA_MIN_ITEM_WIDTH=100,
		DATA_MIN_ITEM_BODY_WIDTH=45,
		DATA_FIX_LEFT_RIGHT_WIDTH=55; // �̶�item ��ߺ��ұ� width ֵ
	
	/**  
	* �����ı�Menu��ѡ��״̬
	* @name S.LP.Menu#selectchanged  
	* @event  
	* @param {String}  text  ��Ҫѡ�еĲ˵�����ı�ֵ
	* @param {String} id  ��Ҫѡ�еĲ˵����ID
	* @param {String} href   ��Ҫѡ�еĲ˵���ĵ�ַ
	* @example  leftMenu(menu ����).on('selectchanged',{text,id,href}
	*                    { alert('hasChanged')}) //������Ի�ȡ���������ĵ�ֵ
	*/
	
	/**  
	* ��Menu���� ���� ����˵�ʱ
	* @name S.LP.Menu#menuclick  
	* @event  
	* @param {String}  text  ѡ�еĲ˵�����ı�ֵ
	* @param {String} id  ѡ�еĲ˵����ID
	* @param {String} href   ѡ�еĲ˵���ĵ�ַ
	* @example  leftMenu(menu ����).on('menuclick',{obj}
	*                    { alert('clicked')}) //������Ի�ȡ���������Obj[text,id,href]
	*/
	var menu=function(config){
		var defaultConfig={
			collapsible:true, //�Ƿ�����۵�
			items:[

			],//�˵���
			renderTo:'body'
		};
		var _self=this;
		var _config=S.merge(defaultConfig, config); //�ϲ����÷���
		menu.superclass.constructor.call(_self, _config);
		S.mix(_self,_config); //���Ƶ�������
		_self._init();
	};
	S.extend(menu,S.Base); 
	S.augment(menu,
	/** @lends S.LP.Menu.prototype */	
	{ 
		msg: 'Loading...',
		NOT_FOUND_TAB:'�Բ����Ҳ�������ʹ�õ�Tab������',
		TAB_FUNCTION_ERROR:'�Բ��𣬵���tab��������',
		
		//��ʼ��HTML ����
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
		//�����˵��һ���˵���
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
					id=PREFIX_MENU_ITEM+S.guid(); //����ID
					S.log('auto set id for  item');
			}
			var  isOpenTag = '';
			if (item.isOpen === false){
				isOpenTag = CLS_MENU_MINUS;
			}	
			else{
				isOpenTag = CLS_MENU_PLUS; 
			}
			tempHtml+='<li class="'+CLS_MENU_LI+'"><p class="'+CLS_MENU_ITEM+'" id="'+id+'" ><span class="'+isOpenTag+' '+CLS_MENU_TAG+'"></span>'+item.text||''+'</p> ';
			tempHtml+='<div class="'+CLS_MENU_SP+'"></div>';
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
		// �����Ӳ˵�
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
					id=PREFIX_MENU_ITEM_NEXT+S.guid(); //����ID 
				}
			tempHtml+='<li ><a class="'+CLS_MENU_NEXT_ITEM+'" id="'+id+'" href="' + ( item.href === undefined ? '#' : item.href ) +'"><em class="'+CLS_MENU_ITEM_LEFT+'"></em><em class="'+CLS_MENU_ITEM_BODY+'">'+item.text+'</em><em class="'+CLS_MENU_ITEM_RIGHT+'"></em></a></li>';
			var itemEl = new Node(tempHtml).appendTo(parent);
			itemEl.data(DATA_ITEM,item);
		},
		
		//���ÿ�Ⱥ͸߶�
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
						var numWidth=parseInt(tempWidth);
						//������Сֵ
						if(numWidth<DATA_MIN_ITEM_WIDTH) {  
							tempWidth=DATA_MIN_ITEM_WIDTH;
							DOM.css('.'+CLS_MENU_ITEM_BODY,{width:DATA_MIN_ITEM_BODY_WIDTH+'px'});
						}
						else {
							DOM.css('.'+CLS_MENU_ITEM_BODY,{width : ( numWidth - DATA_FIX_LEFT_RIGHT_WIDTH )+'px'});
						}
						DOM.css('.'+CLS_MENU_CONTAINER,{width : tempWidth + 'px'});
					}
				}
			}
			
		},
		//�����Ƿ��������
		_setCollapible:function() {  
			var _self=this;
			if(_self.collapible){
				var containerEl = _self.get('container');
				//item �����¼�
				containerEl.all('.'+CLS_MENU_ITEM).on('click',function(event){
				var  _eventthis=this;
				event.preventDefault();
				var 	ulDom=DOM.siblings(_eventthis)[1],
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
				//���ư�ť+- �¼�
				containerEl.all('.'+CLS_MENU_TAG).on('click',function(event){
					
				var  _eventthis=this;
					
					
					if(DOM.siblings(DOM.parent(_eventthis)).length>1){
						var ulDom=DOM.siblings(DOM.parent(_eventthis))[1];
						
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
		//���ⲿtab ͨѶ �¼�
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
			if(DOM.attr(this,'class')===CLS_MENU_NEXT_ITEM) {  //����ѱ�ѡ�У��򲻴ٷ�
					_self.setMenuActive(postid);
				}
				_eventself.blur(); // ʧ����ȥ�����߿�
			});
		},
		//���� �¼� �����¼�
		_setNextItemFontEvent:function(){
		var	 _self=this,
				containerEl = _self.get('container');
			containerEl.all('.'+CLS_MENU_NEXT_ITEM).on('mouseover',function(){
					DOM.css(this,{color:'#FF6600'});
			});
			containerEl.all('.'+CLS_MENU_NEXT_ITEM).on('mouseleave',function(){
					DOM.css(this,{color:'#263E74'});
			});
		},
		//���ò˵���ѡ��
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
		
	// ����ѡ�в˵�
		setMenuActive:function(id)
		{	
			var _self=this,
			containerEl = _self.get('container');
			if(id==='none'){   //�޸�ȫ���رպ�ѡ��
				DOM.replaceClass(containerEl.all('.'+CLS_MENU_ACTIVE),CLS_MENU_ACTIVE,CLS_MENU_NEXT_ITEM); //����Ϊnormal
				DOM.css(containerEl.all('.'+CLS_MENU_NEXT_ITEM),{color:'#263E74'});
				return;
			}
		
			var ulDom=DOM.parent(DOM.parent('#'+PREFIX_MENU_ITEM_NEXT+id));
			if(!ulDom){
				return;
			}
			if(DOM.css(ulDom,'display')==='none') //����������ţ���չ��
			{
				var ctrolTag=DOM.children(DOM.siblings(ulDom)[0])[0];
				DOM.attr(ctrolTag,'class',CLS_MENU_PLUS);
				DOM.css(ulDom,{display:'block'});
			}
			
			var href=DOM.attr('#'+PREFIX_MENU_ITEM_NEXT+id,'href');
			var text=DOM.text('#'+PREFIX_MENU_ITEM_NEXT+id);
			_self.fire('selectchanged',{text:text,id:id,href:href}); //�����ⲿע���¼�
			
			DOM.replaceClass(containerEl.all('.'+CLS_MENU_ACTIVE),CLS_MENU_ACTIVE,CLS_MENU_NEXT_ITEM); //����Ϊnormal
			DOM.replaceClass('#'+PREFIX_MENU_ITEM_NEXT+id,CLS_MENU_NEXT_ITEM,CLS_MENU_ACTIVE); //����ѡ��
			
			//������ʽ��������
			DOM.css(containerEl.all('.'+CLS_MENU_NEXT_ITEM),{color:'#263E74'});
			DOM.css(containerEl.all('.'+CLS_MENU_ACTIVE),{color:'#fff'});
			containerEl.all('.'+CLS_MENU_ACTIVE).on('mouseover',function(){
				var _eventself=this;
				if(DOM.attr(_eventself,'class')===CLS_MENU_NEXT_ITEM){
					DOM.css(_eventself,{color:'#FF6600'});
				}
				else{
					DOM.css(_eventself,{color:'#fff'});
				}
			});
			containerEl.all('.'+CLS_MENU_ACTIVE).on('mouseleave',function(){
				var _eventself=this;
				if(DOM.attr(_eventself,'class')===CLS_MENU_NEXT_ITEM){
					DOM.css(_eventself,{color:'#263E74'});
				}
				else{
					DOM.css(_eventself,{color:'#fff'});
				}
			});
		},
		exception:function(msg)
		{
			S.log(msg); //������ʾ
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
		//��ʼ���¼�
		_init:function(){
			var _self=this;
			_self._initDom();
			_self._initEvent();
		}
		});
	
	S.namespace('LP');
	/**
	* ����ָ��Ԫ�أ�����ʾ������Ϣ
	* @class �˵��ؼ�
	* @param {Object} config ������Ϣ<br>
	* 1) collapsible :�Ƿ�����۵�<br>
	* 2) items : ���������֧�ֶ�����<br>
	*3��renderTo: ��Ⱦ���Ǹ�DOM�ڵ�
	* @example  var leftMenu=S.LP.Menu({collapsible:true, items:[id:'1',text:'�˵�1',href:'lp.taobao.com'],
	    renderTo:'#mainContainer'});
	*/
	S.LP.Menu=menu;
}, {
    requires: ['core','./uicommon']
});
	
	