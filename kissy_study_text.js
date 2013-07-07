
																序  言																
																
1、KISSY加载的2种方式， a、jquer的方式 一次性加载文件库，即 <script src="kissy/build/kissy-min.js"></script>；
						b、yui方式， 颗粒化 懒加载 所需模块；引入“seed-min.js”（只包含kissy核心），大小为9.5 KB，通过新的“loader”功能按需加载模块
							<script src="kissy/build/seed-min.js"></script>
2、在页面中引入kissy的base.css；
						<link href="kissy/build/cssbase/base-min.css" rel="stylesheet" type="text/css" />
						kissy的base.css包含CSS Reset（重置标签的默认样式）、Common（通用样式）、Grids（布局样式）
						
* 为什么引入base.css？
					1）kissy的base.css提供一套普适通用的基础样式
					2）减少由于标签的默认样式引起的各种问题
					3）基于最新主流浏览器
					4）适应中文
					5）语义化，通俗易懂
3、KISSY的含义： KISSY是引入kissy库后kissy创建的一个变量，起到命名空间的作用，类似于jquery中的jQuery、YUI中的YAHOO等，是kissy所有方法的基点。

4、加载模块： 	S.use('core',function(){  // 需要用到 KISSY的DOM方法集，所以使用 loader中的use()加载“core”（kissy的核心功能模块，包含dom操作、事件处理、动画、ajax等）
					S.DOM.html('body',helloWorld); // KISSY.use()有二个参数，第一个参数为模块名，第二个参数为模块加载结束后的回调函数。 多个 模块 ","分割多个参数
				});		// 如果想 想创造环境 则直接和jquery样 S.ready( function(){ *** } )  如果是use方法，则资源文件可以字符串，如果是通过 requires方式引入资源文件 必须是数组现实[*,*,*...]

1.1、kissy selecter 选择器 为了短小精悍 支持主流3个 css选择器 id、class、tag；最多支持3层筛选，一般2层结构； 

2、简化对象  var Event=S.Event, $=S.all, DOM = S.DOM , Validation = S.Validation,Ajax = S.Ajax;

2.1、 kissy与jquery 、js的对象操作不同之处， 模块化/方法 调用，对象？对象就是参数获取！当然也可以原始写法，但是不常用----？ 风格 vs 灵活性； 

* S.guid('J_LP_') 方法, 返回全局唯一变量；确切的说是为了 定义id号数字，在自定义字符串上追加不重复的数字

* kissy 的 DOM 和 Node 方法 参数支持 string、nodeList、DOM等，故 Node.query(document)  或者 S.get(document);


 

																	开 始 使 用

1、引入 kissy框架 2方案：
	a、引入压缩文件！直接script标签 引入”build”文件夹下的完整的”kissy.js”压缩版的为”kissy-min.js”=======>>> <script src="kissy/build/kissy-min.js"></script>
	b、引入“seed-min.js”（只包含kissy核心），大小为9.5 KB，通过新的“loader”功能按需加载模块 kissy 其他模块~
	
2、引入kissy的base.css样式基础文件
	包含CSS Reset（重置标签的默认样式）、Common（通用样式）、Grids（布局样式） <link href="kissy/build/cssbase/base-min.css" rel="stylesheet" type="text/css" />


3、kissy常用方法： * S.isUndefined()  * S.makeArray()   * ...

@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@


																	事	件 Event  ('目标对象', '事件对象')

// 所有事件 尽在 kissy.Event 中...  最主要： add()/on() 、 remove() 标准事件 和 自定义事件；
// 1、多个元素 目标用 '，'分开，多个事件 '事件名' 以 '空格' 分开;   例如：Event.on('#J_YQC, #J_NQC', 'click focus', fun);
			
			

*添加1个事件：event.add(" cssSelector","type",function(){}, scope  );
	Event.add('#demo1','click',function(ev){  alert('你触发了'+ev.type+'事件,目标对象id为'+ev.target.id);}); 
	
*add() 方法详解：	KISSY.Event.add()接受四个参数：( target事件目标对象、 type事件类型、 fn监听函数、  scope监听函数的 this Object ); 
	注：scope 默认指向target事件目标dom对象，当然可以是css选择器或数组("#demo1")/['#faf','.cls']; 这个参数用于 修改监听函数内部this上下文的指向，如果添加则this指向添加上下文目标；应用场景如 "日期控件的弹出层"；
	如：Event.add('#demo5','click',function(ev){ alert('你触发了'+ev.type+'事件,目标对象id为'+ev.target.id+'，但是this指向id为'+this.id+'的对象'},"#person" );	

*事件对象(ev) 4大属性！ type：类型、target：触发事件的对象('如:li')、currentTarget ：当前事件目标对象('父容器 如：ul ')、pageX、pageY：鼠标的x、y坐标;
								原因在于javascript事件的冒泡机制

*取消事件监听  remove() ======>  Event.remove('#demo1','click');

*on ( 目标字符串格式选择器、事件 多个隔开、fn、scope )  ====== add是 on() 的别名~ 不能够在对象等上注册事件！对于多个事件 如何判断哪个事件执行了呢？
	在回调函数传入形参event然后判类型不就知道了吗？这个在回车或者失去焦点 录入属性值 已经实践过！

* mouseenter和mouseleave主要用于用于解决mouseout的bug，mouseout会在你的鼠标离开子元素的时候把事件冒泡到父元素上，也就是说不管你的鼠标是否还在父元素中，只要你一离开子元素，就会触发mouseout。而mouseleave没有这个问题。

// 自定义事件 
*事件高级篇 自定义事件 *为什么需要自定义事件？哪些场景需要自定义事件？
	当你希望 模块或组件 在供第三方使用时能够提供更强的可定制性和扩展性时，就需要一批自定义事件！
   
	1)继承 S.EventTarget  想要使你的组件可以自定义 “事件”，必须继承KISSY.EventTarget，或者继承KISSY.Base。-----> S.extend(Steps, S.Base/S.EventTarget);

	2)fire组件内触发事件, 想要用户在外部触发事件，必须在组件相应位置fire该事件(fire 执行符合匹配的 dom 节点的相应事件的 事件处理器和默认行为(selecter、event、外部数据) )
	   this.fire('render',{author:'明河共影'});
	
	3）监听事件  steps.on('render',function(ev){   S.log('组件已经运行！' + '作者名称：' + ev.author);  }); on的用法与基础 用法类似 一样

	4）KISSY.Base内置的自定义事件----->>>  当你的组件继承于KISSY.Base，会自动带有属性事件,KISSY.Base会自动为定义的属性创建自定义事件，
		包括“ afterAttrChange”（Attr为属性名称，第一个字母大写，比如Color）、“beforeAttrChange”; 本案例讲述 监听颜色改变事件 
	
	5）使用detach即可注销事件监听




~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

																	DOM 操 作
																	
// 注意 选择器和参考条件的顺序； query选择器, 容器下的 元素，不同于 children 有DOM结构层次， 注意查看 kissy API 选择器情况 ---- selecter [filter,]	/ container 																 																
// 如果要使用 css属性等选择器 则需呀引入 kissy sizzle模块才可以；

																
* radios = S.query('input', '#J_radiosContainer');  

* dom-traversal 模块  parent、children、prev、next四个主要方法 children

* S.get() vs S.query(); 	  // 到底啥区别呢？ 前者 获取一个， 后者 获取多个；so easy！ kissy 选择器说明：支持 S.get('#fjs tag.class'); 
							 // kissy有个“sizzle”模块，当加载了 sizzle 模块时，KISSY 支持 jQuery 支持的所有 CSS 选择器;

* DOM.show() / DOM.hide()   // DOM方法， 也可以 var nextMenu = DOM.next(ev.target);  DOM.show(nextMenu); 

* var display = DOM.css('#jfja','display'); // 获取和设置值 其他这些方法比如 val() text() height() width() 只会设置或获取一个值， 尽管元素有多个！

* children、 next、prev、parent、siblings 第一个参数 是选择 元素， 第二个参数是一个过滤器，只需用到div，就只取div节点了。

*  DOM.html(secondUl,'<li class="new"><a href="http://www.36ria.com/?cat=113" target="_blank">明河共影</a></li>');
*  var newLi = DOM.children(secondUl,'.new');
*  var newLi = DOM.create('<li class="new"><a href="http://www.36ria.com/?cat=113" target="_blank">明河共影</a></li>';
*  var sibItems = DOM.siblings(menuChildrens[1]);
* DOM.addClass(children,'arrow-down');
*   var secondUl = DOM.children(menuChildrens[1],'ul'); // 获取 第二个子菜单   node 方法则是：  S.one("#menu").children().item(1).children('ul')；

S.query('input[type="radio"]'); // css选择器 必须引入kissy的 'sizzle'模块  query方法返回数组；

附：

* attr()  / removeAttr()	// 注意 如果不存在时 返回 undefined 而不是 null；
* DOM.val() / DOM.text()	// 为空时返回空字符串 '';  这个在 回写option时 大大简化代码量



  * var len = S.one("#menu").children().length; 注意调用方法---链式！既然有children()，还有prev()、next()、parent()、text()等，只要是dom模块中的方法，node模块都有对应接口

  * 例如 向第二个子菜单 添加新的菜单项 node方法案例 要比Dom方法 省力的多：
    Event.on('#demo3-1','click',function(evt){  S.one("#menu").children().item(1).children('ul').append('<li class="new"><a href="http://www.36ria.com/">明河共影</a></li>');})

  *KISSY 的 DOM 模块子模板 和 方法众多--> var DOM = S.DOM; 以下3块必须掌握：

基本必须掌握：
	selector： CSS 选择器，关键方法：get、query  [ 用于获取符合选择器的第一个元素，如果不存在所选择的元素，返回空、
                   还有名为one（隶属于node模块）的方法也是用于获取合选择器的元素; 如果参数为选择字符串, 找不到则返回 null其他情况下等同于 NodeList.all( args... );
						   query:KISSY.query用于获取符合选择器的所有元素，不管所选取的元素是几个，返回的都是一个数组 ]  

	注意：留意get、query、one方法不是隶属于DOM命名空间，而是直接隶属于KISSY命名空间，上述说明了区别! 

	dom-class： class 属性相关操作，关键方法：addClass、removeClass、hasClass --------> 这个 相对简单 注意kissy不同与jquery的对象操作方式，而是 事件.add（元素、type、fun）
	dom-attr：通用属性操作，关键方法：attr、removeAttr添加删除属性， 要留意的是属性不存在时，返回的是undefined而不是null。
					  val 、text  -------->是对元素value属性和text文本值的处理。无值时，返回" "及null。-------->>>  DOM.val("#J_username"); DOM.val("#J_username","张三");
					 


以下三个子模块是次掌握的：

	dom-style：样式操作，关键方法：css、width、height、show、hide 尽管获取元素是一批 但是设置只获取/设置 第一个 元素的 值； 另外 宽高设置/获取 值简单
	dom-traversal：遍历操作，关键方法：parent、children(存在自然属性哦) 、next、prev--父、子集、下、上 	var nextMenu = DOM.next(ev.target); DOM.show(nextMenu);

	dom-create：创建操作，关键方法：create（html代码==innerHTML）、remove（objec）；	appendChild、html(element, "htmlCode"  ) 如果无第二个参数时 为获取节点html代码

以下二个模块可最后掌握：

	dom-offset：位置操作，关键方法：offset
	dom-insertion：插入操作
	dom-data：扩展属性操作


*、向指定dom节点 添加 元素  S.DOM.html( "targetElement ","addElementText " )；注意必须先 颗粒化 use（） 加载kissy核心库 core ，然后简化变量名 调用DOM方法集

*、var nextItemTitle = DOM.children(nextItem,'div'); 元素 层级选择器 的过滤器！ （元素, " 过滤器 " ）过滤器可以是支持的任何 常见tag、class、id、组合；

*、DOM.addClass(children,'arrow-down'); （元素，字符串值）

*如何 实现指定元素之外的元素 隐藏呢？   利用sibling层级DOM 实现 即可！ ？ 指定上下即可，本身自然保留了嘛~

*如何获取 容器 相对于页面 偏移？ DOM.offset('header'); // 返回 { left: 0, top: 0 }   ---  return json Obj 
*如何获取文档的高度？ DOM.docHeight();

*如何把 新创建的节点 插入到指定DOM节点 后面？ var div = DOM.create('<div>');  DOM.insertAfter(div,'header');

*如何把新创建的节点追加到DOM中？ var div = DOM.create('<div>');  DOM.append(div,'body');

*如何创建新的DOM节点？DOM.create('<div>');		DOM.create('<a>', { href: 'http://www.36ria.com', title: 'RIA之家' });

* 案例解决： 获取dom结构对象了如何 调用dom 方法呢》？ 习惯了链式方法故 可能不习惯， 竟然是dom对象 直接S.DOM.attr(container, 'attributeText'); 不就调用了dom方法了么？

var inputRaido = DOM.get( '.grid-radio', row),
	skuText = DOM.attr(inputRaido, 'data-tabindex'), 	// inputRaido.getAttribute('data-tabindex') || inputRaido.tabindex, // 这是 js 原始的方法，本身存在兼容问题故 写2种方法，但是使用框架了 还是用框架方法；
	skuCodes =  DOM.attr(inputRaido, 'skuCodes');	 	// 
															
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
															
																													
																	Node 方式 DOM 操 作 ------ one()、all()主要方法！
																											

* Dom操作 不只可以借助kissy的dom模块，还有node模块一样用于dom的处理，只是二者的代码风格不同;
     a、dom模块偏向YUI，node模块偏向jquery;具体：比如绑定事件(yui参数和node实例对象. );
     b、二者的返回值也是不同的，dom方法 返回的是 节点元素； node返回的是对象实例；可以链式操作，但仅仅支持常见的 kissy操作
	 
	a、kissy的dom模块，偏向YUI,S.get()== query,返回 HTMLUListElement;b、node 模块一样用于dom的处理，偏向jquery 常见用 S.one(),返回 object实例；其实 one方法是对get的二次封装，源码：

	S.one = function(selector, context) {		// 只要是dom模块中的方法，node模块都有对应的接口
    		var elem = S.get(selector, context);
    		return elem ? new Node(elem) : null; // Node节点 返回实例 就意味着 可以使用类似jquery的链式调用，继续调用node的其他方法，如果 不存在返回null。
	};

* KISSY.one();  // one 属于 node模块； 在DOM方法中  DOM.get(); 注意隶属空间是 kissy

* S.one(“#menu”).children(‘li’)--- 返回的是KISSY.NodeList('模块') 的实例，而不是KISSY.Node的实例; 如何判断呢？ S.one("#menu").children('li') instanceof KISSY.Node




return self.form.isValid() && DOM.css('#errormsg', 'display') === 'none'; // 注意这种写法 && 相当于2个if条件

										

*nodeList模块 比如要获得 所有li   那么 S.all("#menu li");

	S.one(“#menu”).children(‘li’)返回的是 KISSY.NodeList 的实例，而不是 KISSY.Node 的实例 如果你确定 有js2中原生方法判断 1、instanceof 2、typeof


*each的参数为一个函数，该函数带有2个参数，一个是元素（KISSY.Node的实例），一个是元素索引值。 比如：获取一级菜单标题文本值为'flex'的菜单项索引值
	S.all("#menu div ").each(function( o,i  ){ var tex=o.text(); if(tex=="flex"){alert(i) }   })

*如何创建新的DOM节点？
  DOM.create('<div>');	//创建一个层
  DOM.create('<a>', { href: 'http://www.36ria.com', title: 'RIA之家' }); //创建一个a标签 属性值一json方式给予

*如何把新创建的节点追加到DOM中？
	var div = DOM.create('<div>'); DOM.append(div,'body');

* 如何把新创建的节点插入到指定DOM节点后面？
	var div = DOM.create('<div>');  DOM.insertAfter(div,'header');

*如何获取文档的高度？document
	var S = KISSY, DOM = S.DOM;  alert(DOM.docHeight());  // 使用docHeight可以获取 document 的 height 值。

*如何获取容器相对于页面的偏移？  
	 DOM.offset('header'); // 返回 { left: 0, top: 0 }  获取容器偏移值，还是颇为常见的操作，可以使用DOM.offset()。 返回  一个  json对象 

*css vs dom
DOM.css('.widget', {position: 'absolute', top: '10px', left: '10px'});
S.one('#reasonForm').addClass({padding-top:'30px',padding-left:'25px',padding-right:'25px'});
S.one('#reasonForm').attr('class',"smallMsgSty");

NodeList 解释：'对象'代表一个'有顺序的节点列表'。

'NodeList 对象'： 
	a、我们可通过节点列表中的'节点索引号'来访问列表中的'节点（索引号由0开始）'。
	b、节点列表可保持其自身的更新。如果节点列表或 文档中的某个元素被删除或添加，列表也会被自动更新。
	c、注释：在一个节点列表中，节点被返回的顺序与它们在文档中被规定的顺序相同。

					
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
									
																animate 动 画

一、什么是anim模块？

* anim模块是kissy的动画模块，共有三个子模块：

* anim： 动画基础模块；即Anim类，5个参数（元素、动画属性css、动画时长、缓动函数、动画结束后的回调函数。）、 2个方法   // S.Anim只有前二个参数是必须的，第三个参数为动画时长，默认为 1。
* anim-easing：文档上的解释是” 提供 easeIn/Out, elasticIn/Out, backIn/Out, bounceIn/Out 等平滑函数 “，明河觉得这更像描述，比较准确的应该称之为缓动模块更恰当些；
* anim-node-plugin：文档上的解释是” 将动画方法耦合到 Node/NodeList 中 “，简单点理解就是让one、all返回的Node实例支持动画函数。show()/ hide()/ slideDown/slideUp/toggle

*实例1、 var anim = new S.Anim('#demo-2-div', {'width':'200px','height':'50px'}, 0.5, S.Easing.bounceOut, function(){  // 第4个参数 kissy 内置很多，比如：easeIn、easeOut、easeBoth、easeInStrong、easeOutStrong、easeBothStrong、elasticIn、elasticOut、elasticBoth、backIn、backOut、backBoth、bounceIn、bounceOut、bounceBoth 试试看看；
				var anim2 = new S.Anim('#demo-4-div',{'width':'50px'},1);  // 注意 css参数 既可以是字符串('width:200px')， 也可以是json对象 {'width':'200px'} (推荐)， px单位是必不可少的哦！ 
				anim2.run();
			});
  
		
		anim.run();     // 在实例化S.Anim后，run方法是必不可少的   

*  KISSY. Anim() === node节点对象中 animate() 方法，参数一样！ 
* 注 1: 如果不需要缓动函数即第4个参数，但要添加第5个参数 ，那么第4个参数也必须写上，必须置为S.Easing.easeNone 即可；
* 每个Anim类 实例化后 真正执行的是该 实例掉 run()方法；多个多调用!	相应的 还有stop() 中止方法；
* stop方法有无参数的区别：stop() 无参数 彻底不执行动画函数； 有参数 stop( true ) 实则终止的是 缓动函数的 第二个效果fun, 表面上看是 跳到最终 动画结果！
*


//kissy的height\width方法，当元素的display:none时，获取的高度\高度为负数，BUG ，另外注意不要设置宽高auto， 否则 反复的操作中 会存在 宽高值丢失获取不及时不准的问题；
// kissy的css()存在bug，不返回KISSY.Node，导致断链  
//show/hide方法  使用hide的方法直接报错  那么我们就用动画的 1条腿即可 展示  可以传递参数 number类型 0-1数值；
slideDown/slideUp/toggle方法   由于都存在fadeOut类似的问题 丢失元素宽高 操作无效；



-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


															ajax 异步交互 第九天

* kissy的ajax有独立的命名空间：KISSY.IO; 始于1.16版本~    KISSY.io() === KISSY.ajax()；

* KISSY.getScript (url , config);  { success : success , charset : charset, error:function(){}, timeout:5} timeout:默认为5秒，超时后触发error回调函数；

*简单的获取 一个jsonp文件 
	
	var CALLBACK = "getPublic";    ------->>>  	S.getScript( "http://api.zuosa.com/statuses/public_timeline.json?callback=" + CALLBACK ); // 因为是jsonp 所以自动调用
	
	function getPublic(data){
		if(data.length > 0){
			var arrHtml = [],
				_li = null,
				user;
			
			S.each(data,function(item){  //数据处理
				user = item["user"];
				_li = "<li class='clearfix'><div class='user l'><img src='"+user['profile_image_url']+"' /><p>"+user["screen_name"]+"</p></div>"+item["text"]+"</li>";
				arrHtml.push(_li);
			});
			
			S.DOM.html( S.get('#zuosa-public-list'), arrHtml.join("") );  //将生成的li添加到列表内
		}
	}


*演示使用kissy的ajax获取json、xml、html的情况

a、获取json数据  ajax()   ---------- 1.16 新增了ajax() 方法！  S.io ==== S.ajax();
     S.io({			
         type : 'GET',										// 默认为 get
         url : jsonUrl,
         data : null,										// 默认
         dataType : 'json',						   			// 请求数据类型,将决定返回值 data 的类型,若不指定，返回值data的类型由响应头决定，可取值为 json | jsonp | script | xml | html | text         
         success : function(data, textStatus, xhr ){		// 请求成功的回调,参数为 data(内容), textStatus(请求状态), xhr(ajax对象)            
              processJson('#demo1-ul', data);    			// 处理返回回来的数据
         }
     })
});


b、注意注意！ 发送 jsonp！可以直接在kissy.ajax/io() 内部使用jsonp!  这是KISSY的ajax的 '亮点'； 当然kissy 还有jsonp的方法  S.io.jsonp(url, data, callback);

	Event.on('#btn-demo3','click',function(){
		 S.io({
			 type : 'GET',
			 url : jsonpUrl,
			 dataType : 'jsonp',			
			 
			 jsonp : 'callback',				 // 指定 callback 的别名,请求url会生成 "url?{$jsonp}=jsonp123456"			 
			 jsonpCallback : 'processJsonp'		// 指定 callback 的参数,实则是 回调函数！  请求 url 会生成 "url?callback={$jsonpCallback}"
		 });
	});
		
	function processJsonp(data){
		processJson('#demo3-ul',data);
	}
    
	
* end 简化方法  同jquery 样 配置 url function即可；    s.io/ajax.get/ post/ json/ jsonp(url, date, dateType, function(){} );

	Event.on('#btn-demo4', 'click', function(){
		S.IO.get(jsonUrl, function(data, textStatus, xhr){  // io.getJSON(url, data, callback)    // io.post = function(url, data, callback, dataType)
			processJson('#demo4-ul', data);
		},'json');
	});


* 附： kissy 常见问题排查

1、导入js模块时提示没有被导入？ ucool host未绑定或绑定错误 -----> ucool 绑定目录不对 或者 使用服务器 Assets 目录没有被打开 ---> use 模块 包和 实际路径任意一个不对 -----> 引入模块的js 格式 有错误(比如 json格式)

2、 post 请求从来不会被缓存，因此 io.cfg.cache 配置可以不用配置; ajax 配置 缓存

1、 ajax请求json数据成功了，没有报任何错误，但 不执行 ajax的success 回调函数 的问题；基本是js 语法 问题，如果没有错 那就是 数据源问题 ！ 无外乎 就这2种情况；

{site : "RIA之家", author : "明河共影"} 不执行~  而换成  {"site" : "RIA之家","author" : "明河共影"}就ok了， 

其实这在json这一章是 我们讲过 json的标准写法 ，在query css方法中 我们同样申明遇到！ 标准  真的很重要~  kissy的ajax对json的数据源要求很严格，单引号 也是会出现类似问题。而且不能有 注释


********************************************************************************************************************************************************************************


																		高级 类库 扩展 
									
S.namespace： 根据参数创建命名空间对象！

S.namespace('app', 'test'); // 创建 KISSY.app 和 KISSY.test 对象；
S.namespace('app.Shop'); // 创建 KISSY.app.Shop 对象；
S.namespace("TC.mods",true); //创建 window.TC.mods 对象；


* kissy 的继承机制：mix、merge、augment、extend这四个核心方法是非常重要的方法   接下来明河将通过二个demo说特别明下merge和extend的用法

1、KISSY.merge(a,b)有个很经典的应用场景：合并配置参数，比如合并b对象与a对象，b的对象成员会覆盖a的对象成员。" 合并之前的二个对象 并不因为合并  操作而改变  本身的值 "。例子如：步骤条3   个参数 宽度、颜色、步骤，默认步骤为0，如果外置配参数 配置了 宽度和颜色，则 var newConfig=S.merge({width:200,color:red,acton:0},{width:300,color:yellowht,aciton:2})  注意：merge 不单单 2个对象的合并，支持多个；

2.extend 类与类的继承（js中没有 类的概念，精准的表达是 函数对象） 举个例子： a 函数 类有一个方法，他是原始json申明的， S.extend（b，a） 后b 也就拥有了a的 这个方法；这是jqrery的   深度克隆继承实现的！ 我们常说js的继承机制：对象冒充 作为属性，call和apply，还有就是原始继承 poroperty ，另外的就是克隆了 

3、S.augment用于  复制原型prototype方法。 S.augment(Steps, {   } ) //复制 和扩展 原型方法 

4、mix： Object KISSY.mix (receiver , supplier [ , overwrite = true , whitelist , deep ])； 将 supplier 对象的成员复制到 receiver 对象上.
	Parameters: 	
		receiver (object) – 属性接受者对象.
		supplier (object) – 属性来源对象.
		overwrite (boolean) – 是否覆盖接受者同名属性.
		whitelist (Array<string>) – 属性来源对象的属性白名单, 仅在名单中的属性进行复制.
		deep (boolean) –
		New in version 1.2: 是否进行深度 mix (deep copy)
	Returns: 		receiver 属性接受者对象.
	Return type: 	object
	
	可以很方便的实现特性的 "静态复制" 和 "动态修改".

* kissy.merge   将多个对象的成员 "合并" 到一个新对象上. 参数中, 后面的对象成员会覆盖前面的.
* kissy.mix	将 supplier 对象的成员 "复制" 到 receiver 对象上.	
	
这就是KISSY.Base的意义。有兴趣的朋友，可以看下1.1.6中的suggest.js（采用旧的kissy模块写法）和imagezoom.js（采用继承KISSY.Base的模块写法），具体体会下二者之间代码风格的差异。imagezoom供配置的参数相当丰富，如果采用旧式的写法，你会发现API非常的繁琐。
继承KISSY.Base，另外一个好处是可以直接自定义事件，而无需再继承KISSY.EventTarget，什么是自定义事件？如何自定义事件？这是系列教程事件高级篇的内容，明河将整合到构建步骤条组件里面讲，现在只是提一下，继续我们的KISSY.Base。

imagezoom.js（采用继承 KISSY.Base 的模块写法）

* 如果不想把 控件挂到 kissy 根目录下 就为 kissy 创建一个 命名空间吧！ S.namespace('LP'); 然后再将其挂到 自定义命名空间下： S.LP.role = role; (role为自定义构造的类组件);

* /*
		function Base(config){
			this.name=config.name;
			this.age=config.age;
			this.password=config.password;
		}
		function base(config){
			this.a=config.a……
		}
		
		这个是基于Ext的框架来的 想彻底明白得把extend的那个原函数研究透彻

		base.superclass.constructor.call(this,config);//第一个参数this是什么意思？不太明白
		这个意思就是调用父类的构造函数 作用域是当前子类 传入config参数 将来config中有什么属性 会为子类构造出什么属性
		例如:

		var a = new base({a:1,name:2}).showMessage();
		弹出name=2 a=1
		
		而
		var a = new base({name:2,b=3}).showMessage();
		弹出name=2 a=undefined
	*/	


	
作用域思考： 2种情况-------- 1、有无引用，谁引用指向谁；  2、无调用 则 看变量申明在何处， 在何处申明作用域 上下文即是 何处；	
	
	
	
var CurrOpenWin = null;
function repairDate(id){					  
	CurrOpenWin = window.showModalDialog("showpack.php?id="+id, "", "dialogWidth=800px;dialogHeight=628px;status=no;help=no;scrollbars=yes");
}

* '<option value="'+key+'">'+ value +'</option>' 还记得 这个噩梦吗？ 花了2个小时才找出来， '字符串的拼接注意 不留意的空格害死人呀！!!!! ' 所以获取value值中多了一个空格 导致取值就是取不到；

----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

																	kissy flash本地存储 ---------- kissy是如何调用flash的本地共享对象的呢？

																	
* flash 本地存储 ==== 加强版的 cookie！同样有 安全、跨域 限制问题！不会主动记忆用户信息；想要在web页面 js调用flash的本地共享对象，这里必然要借助flash的actionscript 和javascript的通信接口：ExternalInterface(外部 网络 接口)。
																	
* 1.使用本地共享对象，需要引入的kissy模块
	<script type="text/javascript" src="kissy/flash/flash-pkg-min.js"></script>
	<script type="text/javascript" src="kissy/ajbridge/ajbridge/ajbridge-pkg-min.js"></script>
	<script type="text/javascript" src="kissy/ajbridge/store/store-pkg-min.js"></script>
	
* 1.0 flash-pkg.js: kissy的flash模块中，有个很重要的子模块叫：flash-embed，通过flash-embed，你可以快速的向DOM插入flash对象，你这里自由的控制flashvars（向flash对象传递一些复杂数据的参数）。
	F.add('#test-flash3', {
		src: '36ria.com/test.swf',
		version: 9,
		attrs: {
			width: 100,
			height: 100
		},
		params: {
			flashvars: {
				site : '36ria.com',
				author : '明河共影'
			}
		}
	});
	上述代码会在id为test-flash3的层上，生成一个宽高为100像素，flashvars为site=36ria.com&author=明河共影的flash对象。
	
* 1.1 ajbridge-pkg.js:  ajbridge是kissy独立项目， Actionscript 和 Javascript集合应用，包括flash文件上传、flash本地共享对象等。
* 1.2 store-pkg.js   :  ajbridge的store, store是flash本地存储模块，继承于ajbridge，同时会调用kissy的flash模块，所以想要使用store模块，'必须保证flash模块和ajbridge模块已经引入'。

* 1.请确保在服务器端运行demo页面 ----> 如果你打开的路劲类似file:// 和 http://localhost/ 都是无效的，在本地运行demo请使用ip 如：http://127.0.3.6.1008.com


<?xml version="1.0" encoding="utf-8"?>
<domain-policy>
    <allow-access-from domain="*"/>
</domain-policy>
'*'允许保存所有的域的数据。


* 实例demo完整代码：

	var S = KISSY, Event = S.Event, DOM = S.DOM, F = KISSY.Flash, A = AJBridge, Store = A.Store,
        config={id:"ks-ajb-store",attrs: {width: 1,height: 1},src : "kissy/ajbridge/store/store.swf", params:{bgcolor:"#C4C4C4" }},  // id（flash对象的id）是必不可少的,src为swf路径，也是必不可少
        storeContainer = 'ks-fl-store',  // 准备一个flash容器层层, 留意不可设置这个层的display:none！
        
	//实例化Store
        demoStore = new Store(storeContainer,config);
    
	//本地存储就绪后触发
		demoStore.on('contentReady',function(ev){  // contentReady（本地存储就绪后触发）事件是非常重要的事件，从理论上来讲针对Store的所有操作要在flash本地存储准备完成后才能操作。
			var user = demoStore.getItem('user'),	email = demoStore.getItem('email'),	site = demoStore.getItem('site');  // 获取指定字段的值
			user && DOM.val('#user', user);
			email && DOM.val('#email', email);  // 左侧3行代码，将获取本地存储三个字段：用户名、邮箱、网站信息，并把三个信息写入到对应的输入框
			site && DOM.val('#site', site);
		});
    
	//设置存储字段
		Event.on('#save', 'click', function(ev){
			demoStore.setItem('user', DOM.val('#user'));  // 设定的字段名 ， 存储的值；
			demoStore.setItem('email', DOM.val('#email'));
			demoStore.setItem('site', DOM.val('#site'));
			alert('保存成功！请重新打开浏览器试下！');
		});												

----------------------------------------------  验证 validation  -----------------------------------------------------
				
				
// 验证规则查看上方：   console.log( Validation.Rule.toString("func") );				
				
a、内置的校验规则可能很难满足各式各样的需求，复杂的逻辑你可以使用func自定义函数校验
	{
		func:function(){
			//...
			if(false){
				return 'error mssage';
			}
		}
	}
b、简单的可以直接使用regex正则校验（这里提供一个正则网站http://www.regexlib.com/，你可以直接搜索到很多实用的正则表达式）				
				
d、// 注意 这是在引入模块时进行添加，然后再 生成实例验证，否则 重新再实例化一次 ！这就是 
	
	//三个参数分别是 规则名称，默认提示信息，校验函数体（校验函数体前两个参数value,text是固定的，分别是检测vlaue 和 提示text，key等开始才是自定义的东东！）
	Validation.Rule.add('exclude','不能包含关键字{0}。',function(value,text,key){ // {0} 固定写法，正则替换value值；
		if(new RegExp(key,"ig").test(value)){
			return Validation.Util.format(text,key);  
		}
	});

	
data-valid="{required:[true,'请输入验证码']}" // required:[ boolean, '']
		
 // validation 增加校验 的3种方法：1、validation.field() -- add() 增加实例 
									2、直接 add() 配置增加  
									3、单一元素 addRule() 添加自定义规则
 
 //添加 验证规则的 2种方式 在KISSY.Validation中，每一个字段其实都是以KISSY.Validation.Field的实例形式存在的  
	var check = new Validation(form,{
		style: "under"
	});    
	// 方法一： 增加Auth.Field实例 和 规则
	f1 = new Validation.Field("#password",{
		style: "under",
		length:[6,30,true] 
	});	 
	check.add(f1); // check 就是 验证对象	   备注：如果不想通过伪属性配置 data-valid，可以实例化Validation后 用add方法增加 校验实例
				 
	//方法二： 通过配置增加
	check.add("#username", {
		email:true
	});	
	//方法三：添加自定义 规则  得到验证对象后  addRule removeRule 添加删除 rule 或者是自定义rule！ 
	f1.addRule("depend",function(){
		if(S.get("#girl").checked){
			return true;
		}
	})	
			
	// 触发校验 全局触发 和 单一触发！
    username.isValid();--单一触发！

	   
	   
	//是否退回  选择是进行强制验证  
	Event.on('#isreturnback', 'change', function(eva){
		var isback= (eva.target.value=="yes");	
		var AddresseeEml = html_form.get("AddresseeEml");	
		
		AddresseeEml.addRule("depend", function(){
			if(isback){
				return true; 
			}else{
				return false;
			}
		});
		
		if(!isback){
			S.all(".valid-text").hide();
		}				
	});
			
	   
	   
	   
// 配置 validatinon  设置 提示 样式
	data-valid="{}"  // 默认会追加 required:true, 验证规则； 此外 配置 错误信息提示样式 是在Vlidation 实例化的时候 穿进去的，如果想单独设置某种样式呢？
					 // 那就在 data-valid = "{ style:'siderr' }"  传入错误样式 css类

					 
validation kissy 3大 依赖校验 增加 删除 校验 总结：
					 
 *a、加减法, 通过验证实例对象 addRule() + removeRule() 逐个添加删除法;    (不推荐使用)	
 
 *b、全局法, 通过 dom data-valid="{}" 已经存在校验实例，利用全局 add() 这个实例  (注意：如后后续从全局 验证域里 移除了该验证实例， 在取是木有， 所以必须js 保存验证实例对象), 或者通过 remove() 验证实例的id字符串(没有#号) 去除验证规则 达到 依赖效果！
 
 *c、标准法, 仅仅返回 是否校验的 required 布尔值 决定 是否校验，当然是在已经应用验证实例的基础上 添加一个规则 决定是否验证的； f1.addrule('depend',function(){ .... });


// 公用方法 添加 删除 依赖校验   参数说明: 验证对象 目标id的字符串  是否 添加/删除校验实例 required	 全 	
_validationProPersion: function(domIDstr, isValidBllen){				 
	var _self = this;
		
	if(!_self.get('beforeVldo') ){
		_self.set('beforeVldo', _self.get('validationObj').get(domIDstr) );				
	}	
	
	if(isValidBllen){
		validationObj.add( _self.get('beforeVldo') );
		// beforeVldo.addRule('required', [true]); 
	}else{
		validationObj.remove(domIDstr);
		// beforeVldo.addRule('required', [false]);
	}
	_self.get('beforeVldo').isValid();
},
	

	
formValidater.fields.remove(id);
formValidater.add('#' + id, rules); 
					 
// Validation 表达验证
									  //配置错误信息的显示样式通常都是在实例化的时候传入样式名称：
	var check = new Validation(form,{
		attrname: "data-check",		 //这里是重置 伪属性名 默认为：data-valid
    	style: "under"  			//错误信息提示样式文件名 text under 的区别 right 和 bottom的区别 可以通过 requires 引用进来 覆盖掉原有样式
	}); 							// 默认用 text 简单明了 文字描述



/^[1-9]\d*$/  正整数 正则

//    /^(\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3});)+$/; 多个email 地址检测 
	
//常见 验证 伪属性	验证实例：
{required:false,maxLength:[120,false,&#39;最大长度为{0}个字符&#39;]} //当 required:false时 无提示信息 不强制验证 但是输入了 就要验证了 
{required:[true,'请输入有效的开始时间'],dateCompare:[{start:'#startTime',end:'#endTime'}]}

data-valid="{chinese:&#39;只能是中文&#39;,maxLength:[6,false,&#39;最大长度为{0}个汉字&#39;]}"

data-valid="{ required:false,
			  maxLength:[20,false,&#39;最大长度为{0}个字符&#39;],
			  regex: [/^[a-z0-9A-Z]+$/,&#39;只能由数字和字母组成&#39;]
			}"

data-valid="{email:true,maxLength:[40,false,&#39;最大长度为{0}个字符&#39;]}"

data-valid="{maxLength:[20,false,&#39;最大长度为{0}个字符&#39;],regex: [/^\d+$/,&#39;只能由数字组成&#39;]}" }"

data-valid="{}"	//在其中一个 selector 放一个 空的 伪属性 然后 one on 事件监控了 isValid（）验证


	
data-valid="{email:true}"
data-valid="{url:true}"
data-valid="{mobile:true}"
data-valid="{phone:true}"/* 框架有bug  */ regex:[/^1[0-9]{10}$/,'请输入正确的手机号']

data-valid="{currency:'请输入正确的价格'}"

data-valid="{english:'只能是英文字母'}"
data-valid="{chinese:'只能是中文'}"

data-valid="{trim:'姓名两端不能含有空格'}"
data-valid="{ltrim:'左侧不能含有空格'}"
data-valid="{rtrim:'右侧不能含有空格'}"

data-valid="{group:[2,4,'请选2~4项爱好']}"//放到最后 1个 input checkbook中就是了	
data-valid="{range:[18,35,'只能是18~35周岁']}"//数字范围


data-valid="{required:false,fiter:['gif,jpg','只允许的格式为{0}']}"/> 	
	
data-valid="{minLength:[5,false,'最小长度为{0}个字符']}"
data-valid="{maxLength:[5,false,'最大长度为{0}个字符']}"

data-valid="{length:[2,10,false,'姓名为2~10个字符']}"
data-valid="{length:[6,10,true,'密码6~10个字符，一个中文算两个字符']}"	

//金额小数点 2位数
data-valid="{maxLength:[12,false,'最大长度为{0}个字符'],currency:['请输入正确的金额'],regex:[/^[0-9]+(\.)?[0-9]{0,2}$/,'金额最多保留两位小数'],required:false}"

// 匹配 大于 0的 整数， 支持 2位 小数点；/^[1-9]\d* (\.\d{1,2})?$/  [1-9]\d* 已经解释；():定义 操作符的 范围和优先度 ?出现0次或者1次； 那么小数点的匹配 就好写了 \.\d{1,2}即可；
data-valid="{required:false, regex:[/^([1-9]\d*(\.\d{1,2})?|0\.\d{1,2})$/, '请输入大于0的数字,支持2位小数！']}"  记住这是一个组；而不是多个  /^[1-9][0-9]*(\.[0-9]{1,2})?|0\.[0-9]{1,2}$/

data-valid="{regex:[/^[1-9]\d*$/,'请输入大于0的整数!']}"

data-valid="{regex:[/^(0|[1-9][0-9]*)$/,'请输入大于或者等于0的整数!']}"  正则写的无误时候 就 调整下顺序或者 ()把他们都括起来就好了 ！！！ 关键是量词写在后面，默认1个写在前面
 


// 常规 重复性校验 equalTo:["#12",'error msg']
<input class="text" type="text"  data-valid="{regex:[/\S{6,30}/,'密码必须是6~30位']}"/>
<input class="text" type="text"  data-valid="{equalTo:['#password','两次密码不一致']}"/>

//正则校验 规则属性key :[rule,"alert msg"]	
data-valid="{regex: [/\S{5,30}/,'姓名必须为5~30个字符']}" 

// 长度校验 length:[ startNo, endNo,true区分大小写,'error msg {0} '] ,此外 minlenth、maxlenth:[maxNo,false,'error msg {0} ']	

// 文件判断 fiter:['gif,jpg','只允许的格式为{0}']
	<input type="file" name="fiter" id="fiter" data-valid={fiter:['xls,xlsx',"只允许的格式为{0}"] } /> //上传文件验证 因为格式限制是 " 字符串，字符串 " 所以一起提示
// 范围校验   range:[18,35,'只能是18~35周岁'] 

// 复选框 数量校验 group:[2,4,'请选2~4项爱好']

// url校验： url:true

data-valid="{required:[false],length:[3,6,true],remote:['interface.txt']}"//ajax 校验
S.each([["chinese",/^[\u0391-\uFFE5]+$/,"只能输入中文"],
			["english",/^[A-Za-z]+$/,"只能输入英文字母"],
			["currency",/^\d+(\.\d+)?$/,"金额格式不正确。"],
			["phone",/^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/,"电话号码格式不正确。"],  // 一般分机号 4位数，最多5位数
			["mobile",/^((\(\d{2,3}\))|(\d{3}\-))?13\d{9}$/,"手机号码格式不正确。"],
			["url",/^http:\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]':+!]*([^<>""])*$/,"url格式不正确。"],
			["email",/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,"请输入正确的email格式"]
//只能够是数字 和 字母 			
data-valid="{required:false,trim:'两端不能含有空格',regex:[/^[a-zA-Z0-9]{11}$/,'只能是字母和数字,最大11位字符']}"

//合同协议号
data-valid="{regex:[/^[0-9a-zA-Z]{11}$/,'只能是字母和数字，共11位']}"
		
{//只能够是 txt文件的 正则校验
    regex:[^(([a-zA-Z]:)|(\\{2}\w+)\$?)(\\(\w[\w ]*))+\.(txt|TXT)$,'只能是txt文件']
}	
	
	
//增加验证add 和 addrule的区别，前者扩展、后者 添加删除已有的；
	
// 座机和手机号码  联合校验 自定义开展规则	
Validation.Rule.add("phonTel","输入正确的手机或座机号码",function(value,text){   
	var isphon = /^1[0-9]{10}$/.test(value), 
		istelep = /^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/.test(value);
		
	if( !isphon && !istelep ){
		return text
	 }        
});		



----------------------------

// 省市 接下来具体地址的自定义输入  添加1个省市区 自定义 校验实例

// 初始化验证框架
_initValid : function () {
	var _self = this ;
	
	S.Validation.Rule.add('addressRequires', '', function(value, text, config){
		var proProvince = DOM.val(config.proProvince),
			proCity = DOM.val(config.proCity),
			proAddress = DOM.val(config.proAddress);
	
		if(!proProvince){
			return '请选择省';
		}
		if(!proCity){
			return '请选择市';
		}
		if(!proAddress){
			return '请填写除省市的详细地址';
		}
	}); 
	
	// 表单验证
	_self.set('check', new Validation('#J_ApplyForm', {style : 'text'}));
},
<!-- html 结构 -->
<div class="row">
	 <div class="span24">
		<label class="control-label"><s>*</s>货品所在地：</label>
			<div class="terms controls" id="J_SelectCity">
				<span class="J_provinceTr">
					<select class="J_province form-field-select" id="J_proProvince">
						<option value="">- 请选择省 -</option>
					</select>
				</span>
				<input type="hidden" class="J_provinceName" name="goodsProvince" value=""/>
				<input type="hidden" class="J_provinceValue"  value="" />
				<label class="form-label">省</label>
				<span class="J_cityTr">
					<select class="J_city form-field-select" id="J_proCity">
						<option value="">- 请选择市 -</option>
					</select>
				</span>
				<input type="hidden" class="J_cityName" name="goodsCity" value=""/>
				<input type="hidden" class="J_cityValue" value="" />
				<label class="form-label">市</label>
				<span class="ks-hidden">
					<span class="J_countyTr">
						<select class="J_county" name="">
							<option value="">- 请选择县 -</option>
						</select>
					</span>
					<input type="hidden" class="J_countyName" name="" value="" />
					<input type="hidden" class="J_countyValue" name="" value="" />
					<label class="form-label">县</label>
				</span>
				<input id="J_proAddress" class="form-field-text" type="text" name="goodsAddress" value=""  data-valid="{required:[true,'请填写商品所在地详细地址'],addressRequires:[{proProvince:'#J_proProvince',proCity:'#J_proCity',proAddress:'#J_proAddress'}],maxLength:[128,false,'最大长度为{0}个字符']}"/>
				<label class="auxiliary-text">该地址将用于入库排仓，请填写商品所在详细地址</label>
			</div>        		
	 </div>
</div>

//Validation 表达验证 自定义样式 全局/ 个别字段样式
	a、配置错误信息的显示样式通常都是在实例化的时候传入样式名称：
	var check = new Validation(form,{
    		style: "under"  //错误信息提示样式文件名
	});

	如何想针对个别字段单独配置，传入参数即可
	<input class="text" type="text" data-valid="{style:'siderr'}"/>

	
//三个参数分别是 规则名称 ---- 默认提示信息 ---- 校验函数体（校验函数体前两个参数value,text是固定的，后面 '可以随意增减参数' ）
Validation.Rule.add('exclude', '不能包含关键字{0}', function(value,text,key){
    if(new RegExp(key,"ig").test(value)){
        return Validation.Util.format(text,key);
    }
});
<input value="woshitaobaode" class="text" type="text" name="username" id="username" data-valid="{exclude:['taobao']}"/>

// validation 参数 详解 一组检验规则 的 参数 解析 ---- 记住：都是在 一个数组里 所以参数 都在 一个 数组里
S.Validation.Rule.add('selectInput', '', function(value, text, config){
	var selectValue = DOM.val(config.selctid),
		selectAfterInput = DOM.val(config.inpusvalue);

	if(!selectValue){
		return '下拉框不能为空，必选！';
	}
	if(!selectAfterInput){
		return '输入框必填！';
	}
}); 

<input type="text" class="control-text" id="storeIDselectInput" data-valid="{'selectInput':[{selctid:'#storeIDselect', inpusvalue:'#storeIDselectInput'},'a', 'b', 'c']}">	

那么， 验证规则内部接受到的 参数是： ["q", "c", Object, "a", "b"]   // 3、q就是 当前输入的值  1、Object, "a", "b" 是参数； 2、c是数组 最后一个就是显示 自定义text提示文本， 

// 获取验证规则 验证实例对象 get 验证id名； 除此 之法还有别的吗？？？

// validation问题故障排查
	* 一般当验证规则 无法生效时 都是html 书写规范问题，比如说 radio 的name没有填写, js验证无法区分一组校验规则； select 初始值未填写 <optin>请输入</option>
	* 规则配置参数不正确 data-valid= 后面的配置问题最为突出， 比如数组格式、 json配置项格式不对；
	* form 嵌套form 等 人为错误
	
// 手动 添加删除 某个 校验规则
	ev.halt();
	 
	//移除email校验
	username.removeRule("email");
	 
	//增加中文校验
	username.addRule("chinese",['必须为中文']);
	 
	//触发校验
	username.isValid();//触发校验

// 联合校验  配合Event
Validation.Rule.add('randomInput', '输入数字不正确！', function(value, text, config){
		var minxNosValue = S.trim( DOM.val('#minxNos') ), 
			manxNosValue = S.trim( DOM.val('#manxNos') ),
			regexRule = /^[0-9]+$/;
			
		if( minxNosValue && !regexRule.test(minxNosValue) || manxNosValue && !regexRule.test(manxNosValue) ){
			return text;
		}
	});	





----------------------------------------------------------------------------------------------------------------------------
															组件设计
关注5大点:
														
如何实现构思 ---- 全局变量(静态变量、默认值) ----- 回显机制 ------- 验证(可与回显/验证 互通 1个Dom2个功能) ----- 销毁机制 ------ 扩展 															
															
															
1、由粗到细，从大的模块拆分！一层一层向下、向细的实现；
2、展示组件、那么就有相应的 销毁(detach事件绑定，remove DOM节点)实现；这才是完整的；
3、初始化dom 容器、 初始化事件、 包括给组件自定义事件(当然是当前组件对象——— _self/_that 了 fire下吧！ );

4、写组件时 注意对象的实例化控制，如果已经实例化则无需实例化，减少内存开销；而只是改变对象内容 比如dialog 如果只是改变 内容，则只需要实例化一次；kissy的做法是 在方法之初 取得 kissy 静态变量上对象 
	检测，实例化后 将当前实例化对象 存入 kissy 静态变量上； 
5、设置全局变量的 好处 S.guid('buld_grid_name'); 全局唯一性，dom Id；

6、回显方法，控件的支持；

7、 业务分层拆分， 按照业务单一功能组合-----按照 同一类操作 集合------ 公用方法的抽取(避免重复 效率高呀， 比如只用一个对象实例 反复调用等、 不可以因为某个特殊需求 耦合公用方法，此时应该 放到调用方法里去处理)

8、组件的销毁  detach()   destroy()  remove()  _self.detach();	
delete imageUploadResult[name];								delete 语法：删除对象属性；
detach() 销毁对象事件监控 的性能优化！ kissy Node方法；
		
	/**
	* 销毁组件  detach()   destroy()  remove()  _self.detach();	
	*/
	destroy: function(){
		var _self = this,
			handleEl = _self.get('handleEl'),
			tempEl = _self.get('tempEl'),
			groupSelect = _self.get('groupSelect'),
			dialog = _self.get('selectDialog');

		handleEl.detach().remove();
		groupSelect.destroy(); 
		dialog.destroy();
		tempEl.remove();
		_self.detach();			
	},

	
		
----------------------------------------------------------------------------------------------
kissy 工具	

json： KISSY.JSON.stringify/parse  将对象转换字符串/json对象;
		
!!resultEl.val() // 强制转换true值？

*each 方法		
S.each(formValues,function(value, key){  // 注意each的用法  value和key的意义，2种情况----数组和对象  1、如果是 obj， value为值， key为 key； 2、为数组 value一个值 即数组 的 index 
	if(value!="" &&( key!='suppId'|| key!="_csrf_token" ) ){isemptyValue=true; }
})

* inArray   Boolean KISSY.inArray (elem, arr) 判断元素 elem(可以是任意元素对象) 是否在数组 arr 中.	
		
*map Array KISSY.map (arr, fn[,context])  创建一个新数组, 数组结果是在对每个原数组元素调用指定函数的返回值.  遍历 对象 返回数组 元素中
	arr (Array) – 需要遍历的数组.
	fn (function) – 能够根据原数组当前元素返回新数组元素的函数.
	context (object) – 执行 fn 时的 this 值.

ids = S.map(records, function(record){  return record['id']; });	
		
		
		
	
		
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
															kissy 1.2升级指南
															
1、弃用KISSY.app() 用于创建 应用命名空间; 由于kissy1.2 引入全新的loader机制实现 命名空间隔离，每个模块都是封闭的，直接使用KISSY.add() 加入KISSY环境中，不再需要额外的应用命名空间。							

2、DOM.clone(dom, true, true);  原生的DOM克隆方法存在浏览器差异，比如深度拷贝上的差异，有些浏览器无法克隆源元素的事件监听data 等；只要设置第三个参数，即withDataAndEvent=true，克隆元素的同时可以把源元素的事件和data一并克隆过来，而且当你设置第二个参数，即deep=true时可以开启深度克隆，将克隆源元素的子节点（文本也算子节点哦）。
		
3、DOM.outerWidth()/DOM.innerWidth() 
	DOM.outerWidth()用于获取元素的完整盒容器宽度（可以理解为width+padding+border（+margin））；
	DOM.innerWidth()用于获取元素盒容器内部空间宽度（可以理解为width+padding），请留意二者的区别。

4、DOM.hasAttr(); 	 判断元素是否含有特定属性，非常简单的方法，

5、DOM.prop()/DOM.hasProp();  DOM.prop()和DOM.attr()的功能极其相似，都是用于获取/设置元素的特定属性，区别用DOM.prop()可以获取DOM节点的'任意'属性,而DOM.attr()却只能获取html标签有指定的属性

		
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

															使用手册----kissy 配置！
															

*KISSY.config({   										//为默认配置项，如果 
	packages:[{
		name:"1.0",									   //默认寻找 该路径下的该目录
		tag:"2011080911381",
		path:"http://assets.lp.alibaba.com/s/lplib",  //将自动配置 服务器ip/url + ucool外层目录 == 最终合并成 "http://assets.lp.alibaba.com" url，然后再找 s/lplib/1.0
		charset:'utf-8'
	}
   ]
})

// packages 范例: 包配置
KISSY.config({
    packages:[
        {
            name:"tc", // 包名
            tag:"20110323", // 动态加载包内的模块js文件时,
                            // 自动加上 ?t=20110323, 用于文件更新
            path:"../", // 包对应路径, 相对路径指相对于当前页面路径
            charset:"gbk" // 包里模块文件编码格式
        }
    ]
});

当要在包内添加模块时, 必须遵守一些约定：
	一个模块的文件必须放在以包名命名的目录中
	一个包下的所有目录的代码都应属于这个包，即包之间不能有重合目录。例如
	tc 的 path 为 http://x.com/y/
	tm 的 path 为 http://x.com/
这样就不行，在 ie 下会有包名不确定问题.
模块的名字必须取名从包目录开始到当前模块文件的文件路径名称, 例如 mod1.js 位于 tc/mods 下, 则 mod1.js 的模块取名：
KISSY.add("tc/mods/mod1",function(){});



*// kissy 报配置 打开 degug模式
KISSY.Config.debug = true;  // 注意大小写

debug 模式默认关闭, 但在以下情况下会自动开启：
	1、引入的 js 文件是未压缩版本, 比如 <script src=”kissy.js”></script>
	2、访问的 url 路径中, 带有 ks-debug 参数, 比如 http://www.taobao.com/?ks-debug


* kissy.app 创建应用对象, 为全局 window 中名字为 name 的变量.

* s.mix     将 supplier 对象的成员复制到 receiver 对象上.

* <script src="http://a.tbcdn.cn/s/kissy/1.2.0/kissy.js" charset="utf-8"></script>  -----> 可以指定script 引入编码！




//关于 配置项  配置项 初始文件 html 模块路径使用


// 给kissy 添加 业务模块  
KISSY.add( function(S){
	function moudleNane(config){		//html页面 传入的参数 配置项 独立的js逻辑代码
		var self=this;
		urladd=self.config.urladd;	//这个地方一定要定义 获取 对象参数哦 因为是json，所以需要在参数传入的上下文中 引用对象 再引用 对象名得到 配置项数据！
		//逻辑代码
	}
	
	S.extend(moudleNane, S.Base);
	S.argument(moudleNane, {
		_init: function(){
			var _self = this;
		},
		_domRender: function(){
			var _self = this;
		}	
	});
	
	return moudleName;

},{ requires:["模块1","模块2"] } );		      //加载依赖的模块



//html 应用 页面 调用 自定义 业务逻辑模块
KISSY.ready(function(S){
	S.use('path/moudleName',function(S, moudleName){	//关于 配置项  配置项 初始文件 html 模块路径使用
		new moudleName({	//配置项
			name:value	//名值对
		});
	});
});



// 注意 在利用kissy use模块时多个模块引入用 ',' 逗号分开，如过末尾 多了一个逗号 则会报出 kissy文件 载入错误， 莫名其妙 下面例子 就会报错
KISSY.use("stock/shipments/producup-base, stock/shipments/producup , ", function(S, base, procup){ // 注意多了与给逗号

});	
		
--------------------------------------------------------------------------------------------------
javascript 高级应用		

js 语言精粹 ---- 第4章 函数 (前几张 记在笔记本子上)

* 函数对象
a、对象字面量对象 --  原型对象 链接到 Object.prototype; 函数对象 链接到 Function.prototype (实则本身 最终也是链接到 同一个原型对象 Object.prototype) ;
b、每个函数在 创建时 隐藏的 附加 2个属性 ---- 上下文作用域 this 和 参数对象 及 执行代码；
c、每个函数对象在创建 时 都带有 一个 prototype 属性，1、该属性的 值为该本身的 函数对象；2、这个对象拥有constructor属性  ss.prototype.constructor  注意和隐藏链接到 原型链的情况完全不同，不要混为一谈呀~
d、一个 通过函数字面量 创建的 函数对象 包含一个 连接到外部上下文的链接，这个就是闭包； var ss = function (a, b){return a+b;} // 4部分 关键字function 函数名(没有即为匿名函数) 参数 函数代码体 参数只有在调用时被替换成实际的参数 

* 函数的调用 - invocation 
a、本质 调用一个函数将暂停当前函数的执行，新建一个函数 并给他传递 控制权-this 和 参数组 - arguments ！！！
b、控制权 this 有种调用模式：
	1.1、 方法调用模式 -- 绑定到当前对象；------ Conobjs/this.thatfun;  ------ json对象的方法，this
	1.2、 函数调用模式 -- 全局变量即 window， 设计缺陷，如果内部函数被调用是，this应该指向 外部函数的环境this； 故可以采取 保存 this作用域变量的 做法进行调用； --- var ss = add(5, 3);
		 ps下： 如果是 匿名函数 它的作用域 是全局的，即 --- windows
	
	1.3、 构造器调用模 -- new 关键字 隐藏创建 连接到 该构造函数的 propertype成员的 新对象， this 将 指向这个 新对象(实例 对象)；
	1.4、 apply调用模式-- js是函数式 面相对象编程语言，他有方法！ apply 方法就是： 创建一个参数数组 并调用 函数， 也允许我们选择this指向；

* 闭包 
	作用域的好处就是 '内部函数' 能够访问 '定义他外部函数'的 '实际 参数和变量' （this 和 arguments 除外,这也是 在创建函数时 隐式 添加的2个属性；）； 内部函数 能够访问 外部函数的实际变量 而无需 复制很重要；
	一个最 '经典 糟糕'的例子，为什么 木有 按照期望 逐个 绑定 事件呢？ 因为 '事件处理器 绑定了 变量i'， 而不是 '函数在构造时的变量 i的值'---- 这一句很重要~；
	function NodeEvent(){
		var NodesLi = S.all('li'),
			lilength = NodesLi.length,
			i = 0;
		for(i; i<lilength; i+=1){
			NodesLi[i].onclick = function(){
				alert(i);
			};
		}		
	}

	
	// 闭包 最经典 闭包解决办法 先执行匿名函数并传相应的 变量i 然后再返回 处理函数给 事件注册供其调用；
	function NodeEvent(){
		var NodesLi = S.all('li'),
			lilength = NodesLi.length,
			i = 0;
		for(i; i<lilength; i+=1){
			NodesLi[i].onclick = function(i){
				return function(e){ // 每次都保存变量 的匿名函数  注册给事件 通过return来解决的； 这样事件处理函数 每次调用的是 当时传递进去的i的值，而不是 函数体外才创建它 函数体内的 变量i
					alert(i);
				}
			}(i);
		}
	}

* 函数里 最经典的 应用思想 --- 模块 module --> 模块是 提供接口 隐藏实现和状态的 函数或者对象；******************************************** 
	一般来说，使用闭包和函数 来构造模块；
	保存数据变量的问题-- 数据结构vs性能vs全局变量 问题，举例说明 替换特殊字符转换成html 映射表对象(json) 该放在模块什么地方呢？
	a、全局变量 显然不可取，全局变量是魔鬼呀!谁敢用？
	b、放到构造函数本身 那么将造成损耗，因为每次实例化都将 重新求值一次，个人认为倒是无妨； js精粹推荐方式 放入闭包中
	最佳实践是 
	
	String.prototype.deentityify = function(){
		var entity = { // 相当于 静态属性
			quot:'"',
			lt:'<',
			gt:'>'
		};
	
		return function{
			return this.replace(/&([^&;]+);/g, function(a, b){
				var r = entity[b]; // 利用 作用域 才使得 该方法能够访问 entity对象映射表 变量
				return	typeof r === 'string' ? r : a;
			});
		}	
	}(); // 立刻执行 构造函数 返回一个函数方法 闭包了

	总结： 模块的一般模式 --- 一个定义 私有变量和函数的 函数， 利用闭包创建 可以访问 私有变量 和函数的 特权函数； 
		   使用模块模式 可以摒弃 全局变量的使用，促进信息的隐蔽和优秀的设计， 程序封装和 构造单列对象， 模块模式非常有效；
		   function onlyObj(){
				var s = 0,
					t = '';
					
				return { // 单列对象模式
					sets:function(s){
						s = s; // 设置器 能够访问私有变量 只有这个方法 能够改变 s的值
					}, 
					b: function(){ // 只能够使用该方法
						return s+t+t;
					}
				}
			}
			
	* js精髓里说的级联 其实就是以 jquery 为代表的 DOM对象 链式操作； ------  构造一个DOM类，提供相应的方法； 通过改 DOM类 选择器 实例化该DOM对象，进而各种应用， 记住他们每个方法都返回了自身;
	
	* 套用： 函数是个值，从而 可以 操作函数值， 套用 允许我们-----  函数 + 传递给他的参数相结合  =  产生 新的函数； 什么意思呢？ 第一次'产生一个函数，第二次调用这个 '产生' 函数 再得到值； 应用场景？？
	Function.prototype.cuury = function(){
		var that = this,
			slice = Array.prototype.slice, // 返回一个数组一段，默认为全部 这里就可以将 arguments对象转换为 数组了
			argsOne = slice.apply(null, arguments); // 才应用 数组方法  因为 arguments 并不是真正的数组；   				这两句是 调用 原型链方法的 超常规方法，一般通过 实例调用，这里是通过原型调用 
		
		return function(){
			return that.apply(null, argsOne.concat( slice.apply(null, arguments) ) );  // 链接数组 所以用apply 第二个参数必须是 数组 或者 arguments对象 否则报错
		}
	}
		
	var ss = add.cuury(1); // 第一次 产生新 函数 add 举例 为某个对象实例，都是function的实例
		ss(6); ==== 7;	  //  第二次 产生结果
	
	
	
	

* 模块构建 数据管理--- 
	'常量-全局变量'---的申明，构造函数外的 全局变量； 	
	'对象-属性'--- 如果每次根据控件 产生的 即可写在构造函数内部，伴随着模块的实例化而实例化；比如步骤条控件: self.container = S.get(container); 和 self._allowColor = [];	
	'对象-静态属性' --- 静态属性 和上述 极为密切，不同之处在于 不随着 实例化而被实例化，但是又不是全局变量，而是属于对的 全局属性，故而采用静态变量较为合理； 
	'kissy S.Base静态 属性管理' ---  模拟出的 get、set 静态属性 设值/取值器/重置器 set()、get()和reset()三个方法
		autoRender : {					// 属性名称
			value : false,				// 属性默认值
			setter : function(v){		// 覆写 set方法 --- 内部名为 setter 注意必须返回值，这是kissy的 处理方式， 如何取到 设值 这个值，base会处理，这里只要关注 用户该操作你需要添加的 额外调用
				this.render();			// 额外调用 this不用解释就是 对象本身
				return v; 				// 留意getter和setter方法必须有返回值，即必须有return。
			}
		}
	
* 	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
-----------------------------
// jsdoc 文档注解 规范

/**
* @fileOverview 备货渠道查询  
* @extends  KISSY.Base
* @creator 黄甲（jack）<huangjia2015@gmail.com>
* @depends  ks-core
* @version 1.0
* @update 2012-02-15
* @example
*     new Order4Pl({config});
*/

	
/**  构造函数之前的注解
* 收藏编辑表单处理
* @class xx
* @constructor
* @param {Object} container 表单容器
* @param {Object} config 配置对象
*/
	

/** 方法注解
 * 获取步骤条组件允许设置的颜色值
 * @return {Array} 颜色数组
	
	
------------------------------------------------------------------------------------------------------	
// 
think in scm 项目 前端技术  2012 jack think 

* demo 环境 和 测试部署
* 基础控件 Message - Dialog '后台应用' 为代表的 展现提示工具； 验证 - 提示字段 '前台页面级别'应用 效果展示；
* DPL css + html 标准化 应用；

	
	
	
	
	
	
	
	
	
	
	
-------------------------------------------------	
// PHP知识
	
// php 获取 get 参数值， 这里以 callback 为例：
<?php echo $_GET["callback"]; ?>({"message":"这是jsonp调用的数据"})	
	





------------------------------------------------------------------------------------------------------

// JAVASCRIPT继承方如此简单 !!!

       看了很多的js继承方式都觉得不是很好，总是觉得不是很方便，用起来也不顺。所以一直在查这方面的资料思考这个问题，终于有所收获。忍不住要贴出来与大家共享，让大家一起享受javascript继承的快乐。

优点：只要声明一个简单的函数即可方便使用JAVASCRIPT的继承，使用方法也只要一行代码调用继承方法即可，调用方式非常自然。         

下面是示例源代码：
   <script>
    /**
       首先给Object类添加继承方法extends,
       前两句起继承父类的作用，使得调用的子类能够获得父类的所有属性和方法
       后一句保存对一个对父类的引用，以便在需要的时候可以调用父类的方法
       如果不需要使用父类的方法，最后一句可以删除
       方法名不能为extends，因为IE认为是关键字不让用火狐下是可以的。属性superClass也不能用super，也是关键字。不然看起来就更舒服了(那就太像java了)。
    */
    Object.prototype.extend = function(SuperClass){
      this.SuperClass=SuperClass;
      this.SuperClass();
      this.superClass=new SuperClass();
    }

	
    //声明父类:第一个方法show将得到继承，第二个方法将被覆盖
    function SuperClass(){
      this.show=function(){
        alert('Call SuperClass.show()');
      }
      this.override=function(){
        alert('Call SuperClass.override() width "superClass.override()"');
      }
    }
	
	
    //声明子类:继承父类，同时覆盖了父类的方法override
    function SubClass(){
      //调用继承方法继承父类的属性和方法
      this.extend(SuperClass);
      this.override=function(){
        alert('I have overrided SuperClass.override method.\nCall SubClass.override()');
      }
    }
	
	
    //测试继承的结果：
    var s=new SubClass();
    s.show(); //将调用父类的方法
    s.override();//将调用子类覆盖后的方法
    s.superClass.override();//将调用父类的override方法
	
 </script>
	
	
// 继承的实质 js高级经典 原型链
ApplyStorage.superclass.constructor.call(_self, config);  // 这句话的意思是 初始化超类 的构造函数 并给他传递配置项； // 继承父类 S.extend方法就继承了！ 
Dialog.superclass.destroy.call(_self);					  // 这句话是 继承dialog 父类的 destroy方法 
destroy: function(){ // 这里就是 覆写destroy 方法
	var _self = this;
	_self.fire('beforeDistroy');
	Dialog.superclass.destroy.call(_self);
}
	

---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------



-------------------------------------------------------------------------------------------------------------------------------------------------------------

js 报错机制：

try catch
throw



-------------------------------------------------------

最佳实践代码:




<!DOCTYPE HTML>
<html>
<body>
<head>
<meta charset="utf-8" />
</head>
<script type="text/javascript">

	/* 地址  编码 和 解码
	 * 编码：escape  ,   encodeURI  ,   encodeURIComponent
	 * 解码：unescape  , decodeURI  ,   decodeURIComponent
	*/
	
	// escape ---- unescape  escape(['必需','要被转义或编码的字符串']) js函数可对字符串进行编码，这样就可以在所有的计算机上读取该字符串
	// escape方法不会对 ASCII 字母和数字进行编码，也不会对下面这些 ASCII 标点符号进行编码： * @ - _ + . /, 同 encodeURI
	
	// ECMAScript v3 反对使用该方法，应用使用 decodeURI() 和 decodeURIComponent() 替代它，它们直接的 最大区别 encodeURIComponent转义用于分隔 URI 各个部分的标点符号
</script>
</body>
</html>


// 网页内嵌 iframe 高度自适应 问题
$("#ineriframe").load(function(){       
        var height = $(this).contents().height();  			
        $(this).height( height );   // height < 400 ? 400 : height
    });  
	

// 自动设置 iframe 高度
var sethash = function(){
		var iframeSrc = $('#ineriframe').attr('src') , 			 //设置iframeA的 src
			hashH = document.documentElement.scrollHeight;		 //获取自身高度
		$('#ineriframe').attr('src', iframeSrc+"#"+hashH);		//将高度作为参数传递					
		
		if(iframeSrc){
			pseth();
		}		
	}
	var pseth = function() {
	  var iObjH = window.frames["ineriframe"].location.hash;	//访问自己的location对象获取hash值
	  $("#ineriframe").height( iObjH.split("#")[1]+"px");		//操作dom
	}
	
	window.onload = sethash;

	
//  可编辑 文本  实现 代码；
// 添加一项  关键不能够用keyup 因为你再快 事件已经发生了，来不及阻止，所以用keypress则可以解决；
	Event.on('.addInputGroup','click',function(){ 		
		var node = new S.Node( '<label><input type="checkbox" checked="checked" value=""/><input class="addinputcs" type="text" value=""/></label>' ).appendTo(divBox),
			inputNode = DOM.get('.addinputcs',node[0]);		

			inputNode.focus();											//添加完成后激活光标 ie double
			inputNode.focus();	

		S.one('.addinputcs',node).on('click',function(){	   			//输入状态下 失焦后再次获取焦点
			this.focus();
			return false;
		});
				
		S.one('.addinputcs',node).on('blur keypress',function(ev){		//失去焦点或者Enter键 改变dom结构
			var addvalue = S.trim( S.one(ev.target).val() ),
				keycodeType = ev.keyCode,
				evetType = ev.type;
			
			if( ev.keyCode==13 ){										//如果是 Enter 则阻止默认提交行为
				ev.preventDefault();
			}	
			
			if( addvalue && (evetType=="blur" || keycodeType==13) ){	//正常则 写入dom和值，否则删除 输入框			
				DOM.remove(node);
				new S.Node('<label><input type="checkbox" checked="checked" value="'+ addvalue +'"/><span>'+addvalue+'</span></label>').appendTo(divBox);

			}else if( !addvalue && (evetType=="blur" || keycodeType==13) ){
				DOM.remove(node);
			}
	  });
	  
	
// 旺旺点灯 链接 代码
// 旺旺点灯 代码 --- DOM 部分
<span class="J_WangWang" data-icon="small" data-nick="嗨傅铮"></span> 
// 点灯代码2 -- 引入js控制
<script src="http://a.tbcdn.cn/p/header/webww-min.js"></script> 
// 旺旺点灯代码 调用 3
	Light.light();

	

//多邮箱 分割 校验规则扩展 由于多个字段 校验，效率低下，故采取提交时校验
Validation.Rule.add('moreBigEmail', '', function(value, text, config){
	var reruleOnly =  /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
	
	if(!value){
		return '此项为必填项';
	}
	
	// 要么使用 ;号分隔，要么 使用回车分隔 邮箱；
	if( value.indexOf(';') !== -1 ){
		emails = value.split(';');
	}else{
		emails = value.split('\n');
	}
	// 三目表达式 value.indexOf(';') !== -1 ? emails = value.split(';') : emails = value.split('\n');
	
	// 组合 另外一个校验对象 处理，这里不该处理  '最大只能输入200个字符！'
	
	// 再细拆分 邮箱 校验
	for( var i= 0, emailsleng= emails.length; i<emailsleng; i++ ){					
		var EmailConten = S.trim( emails[i] ),
			isemilText = reruleOnly.test(EmailConten), 
			EmailContenBefore = EmailConten.split('@')[0].length;
			
		if( (EmailConten !=='' || i<emailsleng-1) && !isemilText ){
			return '邮箱地址格式不正确！';
			break; 
		}else if(isemilText && (EmailContenBefore<3 || EmailContenBefore>49) ){  // 定制特色
			return '邮箱地址不正确，@之前最低3个字符，最大49个字符！';
			break;
		}		
	}		
});


// 变换 img 的 url  加上随机码
function changeImg(img, url){
	var random = Math.random(),
		targetUrl = url + "&update=" + random;
	img.src = targetUrl;
}

// 清除浮动 float的 方法一：
<div style="height:0; clear:both;"></div>

// css 方法
.ks-clear:after {
	content: '20';
	display: block;
	height: 0;
	clear: both;
}


// 匹配 大于 0的 整数， 支持 2位 小数点；/^[1-9]\d* (\.\d{1,2})?$/  [1-9]\d* 已经解释；():定义 操作符的 范围和优先度 ?出现0次或者1次； 那么小数点的匹配 就好写了 \.\d{1,2}即可；
 data-valid="{required:false, regex:[/^[1-9]\d*(\.\d{1,2})?$/, '请输入大于0的数字,支持2位小数！']}" />


// 回写dialog数据 借助 为类属性 操作 --- 会写只存在2种情况 input value 和 span 文本，那么写什么值 就巧妙的借助 为类属性 获取就好了
_inputBackData:function(ev, data){  
	var _self = this,
		nodeTypeName = (ev[0].tagName).toLowerCase(), // 统一 格式化 nodeName text
		targetNoed = S.one(ev),
		dataIndex = targetNoed.attr('data-index'),
		value = data[dataIndex] || '';
		
	// 如果不是 字符串 则进行序列化 说明是tree回写数据 	value = S.isArray(value) ? JSON.stringify(treeBackObj) : value;  依赖数组有误 广泛
	value = targetNoed.attr('id') ==='J_Result' ? JSON.stringify({"id":value}) : value; 
	
	if(nodeTypeName === 'span'){
		targetNoed.text(value);	
	}else{
		targetNoed.val(value);		
	}			
},


// 公用 方法  Dialog dialog配置项 弹出窗口  2.0 皮肤
_initDialogConfig: function(dialogObjText, afterConfig, backFn){ ---- {'testDialogObj', {title:"Title", contentId:"ks-userTemplate"}, _self._agetSelectedDataid}
	var _self = this,
		thisDialogObj = _self.get(dialogObjText) || null,
		hasBackFun = S.isFunction(backFn);
		
	if(!thisDialogObj){
		var dialogDefaultConfig = {
			width:500, 	
			height:280,
			zIndex:1050,
			success:function(){
				if(hasBackFun){
					backFn.call(_self);						
				}else{
					this.hide();
				}
			}
		};
	   
		thisDialogObj = new S.LP.Dialog( S.merge(dialogDefaultConfig, afterConfig) );		
		_self.set(dialogObjText, thisDialogObj );
	}			
	thisDialogObj.show();	
}


// 防止多次 提交  屏蔽超级链接	
	
		
// 解决条形码扫描问题 阻止提交问题
	Event.on('#findTextvalue','keydown',function(ev){
		if(ev.keyCode==13){
			return false;
			ev.preventDefault();   // 取消事件的默认行为 
		}			
	});	
	
	
//这是 grid 里的资源文件 uicommon.js 里的方法 主要作用在于 用户自定义的config覆盖默认设置 merge合并  mix复制；
function store(config){
		var _self = this;
		config = config || {};
		config = S.merge({
			root: 'rows', 
			totalProperty: 'results', 
			dataType: 'json', 
			autoLoad: false,
			sortInfo: { field: '', direction: 'ASC' },
			proxy: { method: 'post' },
			params:{},
			remoteSort: false
		},config);
		
		S.mix(_self,config,{ // 注意这句话： mix复制 store属性 到了_self上，这样就方便 在任何地方读取数据
			resultRows : [],
			rowCount : 0,
			totalCount : 0
		});		
	}
	
	
	
// 序列化  格式化  获取 form 数据 对象 form变量数据 组合对象 ？？？ 实现方法？
var formObjValue = S.LP.FormHelpr.serializeToObject( DOM.get('#searchForm') );


// lp updoer 上传控件 

* application/x-www-form-urlencoded 		在发送前编码所有字符（默认）
* multipart/form-data  						不对字符编码。 在使用包含 '文件上传' 控件的表单时，必须使用该值。 
* text/plain								空格转换为 "+" 加号，但不对特殊字符编码。
  
<div class="form-line">
	<span class="form-field-container">
		<label class="form-field-label"><s>*</s>企业法人营业执照副本：</label>
		<div class="form-upload-item" id="J_uploadArea">
			
			/* 实则生成的代码				
			<form action="?" target="iframe_upload_119" method="post" enctype="multipart/form-data" id="hid_form_119"> 
				<span class="file-field-container">
					<input id="lp_file_119" class="fileInput" type="file" style="width: 238px; height: 20px; display: block;" hidefocus="true" name="file" size="28" />
					<input id="lp_filename_119" class="textInput" type="text" /> 
					
					<a class="btn-small-container" href="javascript:void(0);" id="browserBtn_119">
						<button type="button" class="form-field-button btn-small">浏览</button>
					</a>
					<a class="btn-small-container" href="javascript:void(0);" id="submit_upload_119" style="display:none;">
						<button type="submit" class="form-field-button btn-small">开始上传</button>
					</a>
					<input type="hidden" name="J_hid_upload" value="}" id="J_hid_upload">
				</span>
			</form>
			
			<iframe name="iframe_upload_119" id="J_iframe_upload_119" style="display:none;"></iframe>
			*/
		</div>
	</span>
</div>
	
		
// 验证input输入框 信息， a标签 button 属性动态操作 target ='_blank' 新开页面 
_finedIdVlid: function(){
	var _self = this,
		url = _self.get('prodcutDetailurl');
	
	if( _self.form.get('J_prodcutIdNos').isValid() ){
		// 拼接id参数
		url =  url + '?id=' + DOM.val('#J_prodcutIdNos');
		
		// 设置 a标签 属性
		DOM.attr( '#btnSearch', {target:'_blank', href: url } );
	}else{
		// 清空a标签 属性
		DOM.attr( '#btnSearch', {target:'', href:'javaScript:void(0)' } );
	}
},		
	

// 对个别校验规则的添加删除
	<span class="form-field-container form-field-item form-field-mix">
		<label class="form-field-label">唯一ID：</label>
		<select id="idSelect" class="form-field-select">
			<option class="" value="" selected="selected">请选择内容</option>
			<option class="" value="123">123456789</option>
			<option class="" value="223">asdfdsd</option>
			<option class="" value="923">ijkdjsj</option>
		</select>
		<input type="text" id="idInfo" class="form-field-text form-field form-field-text2" data-valid="{}"/>
	</span>

// js代码 对 单独的元素进行校验 用 addRule(ruleName, function/ [arguments]) or removeRule(规则名称) ;		 required 控制 依赖关系 即：必定校验 或者 不校验
	if(S.get('#idSelect').selectedIndex === 0 ){
		form.get('idInfo').addRule('required',[false]) ;
	}

	Event.on('#idSelect', 'change', function(ev){
		if(S.get('#idSelect').selectedIndex==0){
			form.get('idInfo').removeRule('required');
		}else{
			// addRule 具体实例 快速添加规则 方法 1
			form.get('idInfo').addRule('required',[true]);
			
			// addRule 具体实例 添加规则方法 2
			form.get('idInfo').addRule('depend', function(){
				if( S.one('#operateType').val() == "3" ){
					return true;
				}else{
					return false;
				}
			});
	
		}
		form.isValid();
	});
		

// 根据 已经申请状态 控制grid 勾选 可操作
_checkBoxOK: function(event){
	var _self = this;
		data = event.data,
		row = event.row,
		checkbox = S.one('.grid-checkbox', row);
		
	if(checkbox && data[ _self.get('stateCheckbox') ] !== _self.get('CheckboxokText') ){
	   checkbox.attr('disabled','disabled');
	}
},

// calendar 层级 z-index 问题 z-index:91000;  .ks-cal-call

// document 对象 domain属性 可以返回当前页面的服务器名， 有此处可以 利用js的特性 给domain设置 段域名，从而 避免 跨域  问题；

if(document.domain.indexOf('alibaba.com') > -1){
	document.domain = 'alibaba.com';
}


// 日期 时间段 比如说 8号 --- 9日 具体时间段是那一段呢？ 8号 00:00:00 --- 9号 00:00:00
 /**
      * 获取日期的毫秒数
      * @param {String} dateStr 日期字符串 '2011-02-03 12:00:00'
      * @return {Number} 日期的毫秒数
      */
      getDateParse: function(dateStr){
         return Date.parse(dateStr.replace(/\-/g,'/'));
      },
      /**
      * 获取日期对象，可用来配置日历的参数
      * @param {String} [dateStr] 日期字符串 '2011-02-03 12:00:00' 默认为当天
      * @param {Number} [offset] 天数偏移量 可为负数 默认为0
      * @return {Date} 日期对象
      */
      getDateObj: function(dateStr, offset){
         var dataParse = dateStr ? Calendar.getDateParse(dateStr) : (new Date).getTime(),
            offsetParse = offset ? offset * 86400000 : 0;
         return new Date(dataParse + offsetParse);
      },


	  
	  // 公用方法 多个.隔开的 dataIndex 字符串， 遍历obj 得到最终 对象值  ----- 注意这个目标 对象obj, 引用里面值的路径 obj.aa.bb.cc.dd.ee 获取最终值； index = 'aa.bb.cc.dd.ee' 
	getFiledValue: function(obj, index){
		if( !obj && !index){
				return;
		}
		
		var resultData = obj,      			// 利用一个变量的 赋值判断 和 自我遍历循环 
			aindex = index.split('.');
		
		S.each(aindex, function(dataIndex){
			if(resultData){
				resultData = resultData[dataIndex] 
			}
		});
		return resultData;
	},

// 提交表单时候监控 form比较好，效率高， 
Event.on('#form','submit', function(){				
	if( !formStockInput.isValid() ){
		return false;
	}
});

	
	
//隐藏显示 focus文字的js 	
(function initInput(){
	var EMPTY = '',					
		input = S.one('#J_roles'),	
		label = S.one('#J_rolesLabel');
	
	//添加监听事件
	input.on('focusin', function() {	label.hide();});				
	label.on('click',function(){
		label.hide();
		input.focus();	
	});
		

	input.on('focusout', function() {
		if (input.val() === EMPTY){
			label.show();
		}
	});   
})();


// 公用方法 比较数据 自己写的 比较方法  写了一点儿 ？？？？？
_compresData: function(valueObj, oarry){
	var _self = this,
		isExist = false;
	
	// 检测 比对值是否有效 有值 -- 数组
	if( !valueObj || !S.isArray(oarry) ){
		return;
	}
	
	// 比对值是 非对象
	S.each(oarry, function(item){
		if( item === valueObj ){
			isExist = true;
		}
	});
	
	
	// 比对值 是 json 对象
	if( S.isArray(oarry) ){	
		S.each(oarry, function(item){
			if(item && valueObj[indexText] === item[indexText]){
				isExist = true;
			}
		});
	}
	return isExist;
},		






// 操作 radio 单选框 时注意 记得 checked 选中状态，别 忽视了 选中值的 正确获取
// 监控radios 
_radiosChage: function(){
	var _self = this;
	
	// 初始化 检查选中情况
	_self._showInputDom();
	
	// 事件操作时 检查选中情况
	Event.on( S.query('input', '#J_radisContainer'), 'change', function(ev){
		_self._showInputDom();
	});		
},
// 当选择否是提示输入框 
_showInputDom: function(){
	var _self = this,
		inpus = S.query('input', '#J_radisContainer'),
		nextDom = S.one('#J_radisContainer').next();
		
	S.each(inpus, function(inputDom){
		if(DOM.attr(inputDom, 'checked') === 'checked'){
			if(DOM.val(inputDom) === 'N'){
				nextDom.show();
			}else{
				nextDom.hide();
			}	
		}	
	});	
},


// 依赖校验 2个 都必须输入  另外的触发是由 Event监控 调用 验证实例 实现
S.Validation.Rule.add('selectInput', '', function(value, text, config){
	var selectValue = DOM.val(config.selctid),
		selectAfterInput = DOM.val(config.inpusvalue);

	if(!selectValue){
		return text || '下拉框不能为空，必选！';
	}
	if(!selectAfterInput){
		return text || '输入框必填！';
	}
}); 
			
_self.set('check2', new Validation('#J_ApplyForm2', {style:'underText'}) );

Event.on('#storeIDselect', 'change', function(){
	_self.get('check2').get('storeIDselectInput').isValid();
});

 html： data-valid="{'selectInput':[{selctid:'#storeIDselect', inpusvalue:'#storeIDselectInput'}]}"




* 加载优化 kissy 文档 导入问题
(function(){
    var h=window.location.href,
		d=document;
		
    if(h.indexOf("localhost/kissy_git/")!=-1){
        d.write('<script src="http://localhost/kissy_git/kissy/build/kissy.js"'+' charset="utf-8"><'+'/script>');
    }else if(h.indexOf("fed.ued.taobao.net/kissy-team/kissyteam/")!=-1){
        d.write('<script src="http://fed.ued.taobao.net/kissy-team/kissy/build/kissy.js"'+' charset="utf-8">'+'<'+'/script>');
    }else{
        d.write('<script src="http://docs.kissyui.com/kissy/build/kissy.js"'+' charset="utf-8">'+'<'+'/script>');
    }
})();


_replaceData: function(startTimeText, endTimeText){						 //判断时间是否在允许的范围内；
	var _self = this,			
		timeLeng = 24*60*60*1000* _self.get('setDays'),
		startTimeText = startTimeText.replace( /\-/g,'/' ),
		endTimeText = endTimeText.replace( /\-/g,'/' ),
		startTimeSeconds = new Date(startTimeText).getTime(),
		endTimeSeconds = new Date(endTimeText).getTime(),
		nowTimeLeng = endTimeSeconds-startTimeSeconds;
	
	if( nowTimeLeng > timeLeng || nowTimeLeng < 0){						// 都转换为毫秒进行高度精确比较 同时 检测是否为负数
		return false;
	}else{
		return true;
	}
},
_errorAlert: function(addText){											// 错误提示信息
	var _self = this,
		titleText = addText + ':错误信息',
		messageText = '导出数据天数限制在'+ _self.get('setDays') +'天,请缩小查询范围再试!';
	S.LP.Message.show({
		title: titleText,
		message: messageText,
		icon: 'error',
		button: [{
			text:'确定'
		}]
	});	
	return false;
},




 d.write('<script src="http://docs.kissyui.com/kissy/build/kissy.js"'+' charset="utf-8">'+'<'+'/script>');  为何不做一句写？
 
 http://img03.taobaocdn.com/tps/i3/T1HViwXXNKXXXXXXXX-700-23.jpg 步骤条图片


// 文字滚动 html 自定义

<MARQUEE class=publish onmouseover=this.stop() title=工作台首页，消息和任务只展示待处理待读的点击到查看所有时把条件带到list页面-待处理。 onmouseout=this.start() direction=up height=37 behavior=scroll scrollAmount=1>工作台首页，消息和任务只展示待处理待读的点击到查看所有时把条件带到list页面-待处理。</MARQUEE>


// 当多个相同的对象 执行时 想引用 各自的对象 怎么办？
*实例 执行 _importUpdater()5次 那么就有5个实例产生；如何能够调用到 5个不同的 对象呢？ ----------- 保存起来吧！

_importUpdater: function(filetype, url, faxdate, renderTo, callback ){			
	var self = this
		uploadManage = self.get('uploadManage'),				
		oupload = new S.LP.Upload({ 
			extendName:filetype,
			url:url,
			params:faxdate,
			renderTo:'#' + renderTo
		});
	oupload.on('uploadCompeleted', function(Info){
		if(callback){
			callback();
		}				
	}); 
	uploadManage[renderTo] = oupload;			
},



data-valid="{required:[true,'请输入验证码']}"




// 注意 循环 each 遍历 数组时 不要直接在  each 方法里 return 结果； 注意； 
	function isShowfn(stateValue, nowIndex){ // 判断 是否显示方法
		var isshow = false;
		if( S.isArray(stateValue) ){
			S.each(stateValue, function(item, value){
				if(item === nowIndex){
					isshow = true;
				}		
			});	
			return isshow;
		}
	}


colorpicker的简单实现，需要用的自己复制
http://docs.kissyui.com/kissy/src/color/demo/colorpicker.html


返回对象 在数组中的序号： 
Number KISSY.indexof (elem,arr)
返回元素 elem 在数组 arr 中的序号.
Parameters:
 	
elem – 任意对象
arr – 数组
Returns:
 	
elem 在数组 arr 中的序号.
Return type:
 	
number



----------------------------------------------------------------------------------------------------------------

业务逻辑分层 经典 分享：


//2012 06 28 添加聚划算 团购类型 + 工厂选择 + 时间限制 等多情况 判断 回写状态 代码重构2天笔记：

状态值					需求条件								影响点
资质				出口优品 类型 + 厂值				出口类型 + 工厂
疲劳度				出口优品 类型 + 工厂值 + 日期		出口类型 + 工厂 + 时间
验厂 				工厂 								工厂

此外 需求： 1、工厂为空 提示 及方提交功能；
			2、工厂有 但是为选中情况；
			3、改变 出口类型 显示不同字段；
			4、公共模块 ajax方法 + 获取时间方法 + 获取radio值方法 + 回写label状态值方法
			5、复用模块 2队 * 3组 ==== 回写label状态值3个独立方法； 资质+疲劳度+验厂 3个判断方法
			6、监控方法 radio 团购类型和工厂变了 调用方法集合操作； 时间监控特殊：需要写 调用逻辑，如果 遍历调用 方法集 造成重复执行 效率问题；
			
设计思路： 按照正常 条件 准入方法非常复杂，从分析可知，重复性高 且不易扩展； 故 从结果入手 整理如上图 集合3大方法 实现 分层拆分设计；

思考： 代码 和 逻辑的关系； === 代码公用(功能的通用 复用) 、 逻辑的公用(业务模型的复用)，功能是不可以 公用的，即一个方法只做一件事儿；
		在本例中比如资质认证 和 疲劳度认证 尽管相似性很高但是 就是不够公用，必须分开写，可以抽取公共代码、 但是主干逻辑是不可以 公用的；

--------------------------------------------------------------------------------------------------------------------------------------------------------



经典ued资料 知识库地址

taobao ued 维基百科
http://wiki.ued.taobao.net/doku.php

淘宝工具中心 http://tools.taobao.net/site/

// 在TMS中 spm 服务器自动 埋点，a 点击次数
tms中 自动会统计的 spm淘宝的统计系统，这种链接 访问的时候 后台就知道了，放在前台做不合理~ 另外 tms生成的页面 psm系统都会自动统计


// 图片 验证码 参数 ---- sessionID、type、update 自动变化 
http://ccv2.china.alibaba.com/service/checkcode?sessionID=JZ966G91-0QJ51CZHLIHH9R7IKIUU1-31MZWM2H-RE&type=small&update=0.6885283314622939

-------------------------------------------------------------------------------------------------------------------------------------



















------------------------------------------------------------------------

项目经验

each // 注意 循环 S.each 遍历 对象时 不要直接在  each 方法里 return 结果， 注意作用域的问题；

设计思路很重要，一旦方向错了，你就会发现 实现的诸多 复杂、麻烦和别扭， 比如在scm 11年10左右商家 多个 邮箱验证及其支持回车或者';'分割 
就应该 把诸多精力放在 验证规则 validation的扩展上，而不用自定义 同时兼顾展现层dom和css效果的控制; 同时也反映另外一个问题：逻辑封层的思想
其核心就是数据的变化，这里小狮子采用的 数据对象的方法很好 集中处理了这个问题



一切 Js bug 无非就是2个问题------------ 语法 与 数据源！

看文档要看全（头尾） 因为他们都是依赖关系 所以 在这里找不到 要在相关 加载文件里面找，查找 API文档也是如此

consol.log/s.log(event)/debugger 很容易看到他支持那些  然后更具体的去分别 查找 引用； 

html dom 写在一起
* html 排版  文本节点 根据字体大小 占用的 页面像素宽度， 即：写成一行 和 空格 或者 另起 一行的 宽度


一、cdn:
     a.tbcdn.cn 可以用combo ??aa.js,bb.js
     assets.lp.alibaba.com  不能用combo

二、编码
     前台所有文件都要用gbk编码，并且一定要修改压缩方式为gbk方式

三、尽量不要依赖外部代码，一定要放到本项目中，避免编码问题、压缩问题等不一致问题
四、测试
测试节点一定不能绑定ucool,一定要将assets拉到测试机上测试



// 数据的操作 对同一数据的 同时操作 存在问题--- 例： 数组的 读取遍历 和 删除， 解决之道 分开操作，既 读写分开，2个方法
S.each(editStoreData, function(item){
	if( !S.inArray(item, checkedStoreData) && item ){   // !S.inArray(item, checkedStoreData)
		readyArrayData.push(item); 					// 数组在 store里 既要读取又要删除 同事操作 导致 getSelection最初得到的数据无法正常循环，故而这里用数组缓冲
	}
});	



--------------------------------------------------------------------------------------------------------------------

附： 脑残的代码示例

// 公用的 radio事件监控方法  审核该代码中的问题 ？？？ 返回值能够 返回出来么？ 为什么？   答案：// 不会返回出值，原因： 虽然避开了 作用域不一样的问题， 但是这是事件监控，函数执行完毕后 返回原始值， 而事件后操作 跳出了函数体外 故返回无效； 
_onradioclick: function(radioClass, evtendfun){
	var _self = this,
		addtarget = S.all(radioClass),
		selectedValuedom;
	
	if(!addtarget.length){					
		return false;
	}
	
	// _self.form.get(eventidtext).isValid();  // 提醒选择radio	
	Event.add(addtarget, 'click', function(ev){
		var targetDom = ev.target,
			ischecked = DOM.attr( targetDom, 'checked');
		if(ischecked){						
			selectedValuedom = DOM.val(targetDom);
			if(evtendfun){
				evtendfun(selectedValuedom);
			}
		}
	});		
	return selectedValuedom;
},











































---------------------------------------------------------------


framework 骨架 架子 框架

file overview  文件概述

required	需要
requires	要求

augment		增加 扩大

argument	论点
arguments	参数

Overview 综述，概要

traversal 遍历

packages  软件包

Store     存储

remote    远程

scope	  范围

triggers  触发器

panels	  面板

commodity 商品

Fatigue	  疲劳度
Exception 例外
Code Review 代码审查

Enforce 强制

网站性能优化 WPO