/** 
 * jsdoc标准注释 2.0 03-28 修订 by jakc
 * @fileOverview 步骤条组件
 * @extends  KISSY.Base
 * @creator 剑平（明河共影）<riahome@126.com>
 * @depends  ks-core
 * @version 2.0
 * @update 2011-01-02
 * @example
 *     var steps = new S.Steps("#steps-1");  
 */
 
// 添加模块名 or 匿名； 一个文件 可以包含 多个组件，推荐一个组件一个js文件 ，发布时用 ant或combo将模块文件合并成一个js 解决文件多请求的问题 ； 模块组件名 用小写，建议与js文件名一致

KISSY.add('steps', function(S) { // 模块名，函数体，依赖文件；requires为一个数组，存储所有该模块的依赖模块。kissy会自动检查模块依赖，然后会自动加载依赖模块。；
    var DOM = S.DOM,
		EMPTY = '',
		LI = 'li';
		
    /**
    * 收藏编辑表单处理
    * @class xx
    * @constructor
    * @param {Object} container 表单容器
    * @param {Object} config 配置对象
    */
	
	
    function Steps(container, config){		// 构造函数 ，传递 容器和参数	模块对象；	
        var self = this; 					// this 的作用域 当前对象

        if (!(self instanceof Steps)) {		// 倘若用户不是通过new实例化的组件的，那么this这个关键字是不会指向Steps对象而是 局限在函数体内部，为了防止这种情况出现，在构造函数内部做个判断，确保实例化Steps，否则steps仅仅是个 变量名称 而已；  或 雇主调用对象(实例化后 指向Steps 实例对象 )；
            return new Steps(config);
        } 

		// 属性的定义统一放在构造函数，便于管理
        self.container = S.get(container);  // 目标容器 @type HTMLElement		  可以这样写 S.get(container) ===  S.one(container)
        self._allowColor = [];				// 支持的颜色
        self.isRender = false;				// 是否已经运行		
		
		// 这是继承base步骤 一  
        Steps.superclass.constructor.call(self, config);    // 超类初始化 ,超类/父类 是哪个呢？ 当然是S.Base  如果缺少这个语句，KISSY.Base就没办法处理配置参数；其实指的是attrs 中的 取值器的作用； 这个在getter、setter都说了；      
        self._init();						 //初始化 注意仅仅是 实例化对象，根本没有运行哦
    }
   
    // extend方法 继承于KISSY.Base   继承base步骤 二 
    S.extend(Steps, S.Base);  // Base是方法集，模拟出了 取值器、设值器、 和监听 参数值的作用； 
    Steps.VERSION = 2.0;
   
   // javascript并没有真正的常量的概念（所谓常量即一旦被赋值后不能被改变的变量，而在javascript中一切都是可变的），所以我们只能约定，在js中全部大写的变量为常量
   /* 静态属性设置， 直面量 无须实例化 即可访问，也就意味着 只能够使用 对象名或者类名 访问这些属性值 */
   /* 为什么使用常量？
	* ORANGE:’orange’是不是觉得就是一句废话，为什么我们需要常量？
	* 使程序更易于修改，达到一改全改的目的；
	* 增加可读性（通过color这个对象，你可以很直观的知道组件支持哪些颜色）和移值性；
	* 使程序调试起来更方便（举个简单例子：你需要对颜色进行判断比如if(c == ‘orage’) alert(c);结果没出现弹出框，why？原来拼写错误了！应该是‘orange’，别少看这个错误，很多朋友都犯过拼写错误，而且还找半天，没发现原因，如果你使用常量if(c == Steps.color.ORAGE) alert(c);报错了！于是你就定位到这一行的代码，就很容易发现ORANGE拼错了！）
  */
	// 支持的事件列表
    Steps.event = {RENDER :'render'};
	
    //步骤条的所有颜色
    Steps.color = {ORANGE:'orange',BLUE:'blue',GREEN:'green',RED:'red',PINK:'pink',GRAY:'gray'};
	
    //组件用到的内部样式名
    Steps.cls = {STEPS : "ks-steps",ITEM : "ks-steps-item",CURRENT : "current",DONE : "done",FIRST:'first',LAST:'last'};
	
    //步骤的起始索引
    Steps.ZINDEX = 500;
	
    //箭头模板
    Steps.ARROW_TPL = '<div class="trigon">' + '<span class="bor"></span><span class="blo"></span>' + '</div>';
   
   /**
     * 设置参数 注意这里相当于 set ，基于Base 方法的 将属性值 植入对象、类里面； 初始化值和设置值； 继承base步骤 三
	 * ATTRS是Steps的静态对象（采用大写），每个对象成员对应着一个参数，每个参数又有三个成员：value（默认值）、getter（取值器，可以不用）、setter（设值器，可以不用）： reset后width变成初始值
	 * 当继承KISSY.Base后，组件自动带有set()、get()和reset()三个方法，用法简单明了，你无须再写setWidth()，resetWidth()之类的方法。其实 你拥有了动态 获取、写入、重置 参数的方法了；也是 set植入 ATTRS 静态属性 里面！set 也是调用 setter，或者说 是他的别名；  
     */
	 
 /**
  * 写步骤条组件的时候，最开始做的一件事，不是敲代码，而是思考这个组件需要满足用户哪些需求，并将这些需求记录成清单，然后根据这些需求设计参数和方法。
  * 步骤条组件需要下面的功能：
  * 可以控制什么时候生成步骤条
  * 用户可以自定义步骤条颜色
  * 可以自定义单个步骤的宽度
  * 自由控制是激活第几个步骤
 */
 
 /*
 var steps = new S.Steps(),width;
        steps.set('width',300);
        width = steps.get('width');
        steps.reset();
        DOM.html('#demo3-container','新的width为'+width+'，reset后width变成初始值'+steps.get('width'));    

	当继承KISSY.Base后，组件实例对象 自动带有set()、get()和reset()三个方法，用法简单明了，你无须再写setWidth()，resetWidth()之类的方法。
 
 */
 
 
    Steps.ATTRS = {						// 静态属性 对象	主要用于设置参数 参数（1、默认值；  2、getter；  3、setter 这里是重写了 base get方法 或者说 setter ==== set， set是setter的别名； 动态set的时候也是 写入 attrs静态属性 key及value值
        //是否自动运行
        autoRender : {					// 原型链 上的方法
            value : false,
            setter : function(v){		// 原型链体内 的方法
                this.render();			// 此处this 有何难理解？就相当于 property 上的fun 内的 方法，雇主对象 不就是Steps么？
                return v; 				// 留意getter和setter方法必须有返回值，即必须有return。
            }
        },
        //步骤宽度
        width : {
            value : EMPTY,
            setter : function(v){
                var self = this;
                self.isRender && self._setWidth(v);
                return v;
            }
        },
        //步骤条颜色
        color : {
            value : Steps.color.ORANGE,
            setter : function(v) {
                var self = this;
                self.isRender && self._setColor(v);
                return v;
            }
        },
        //激活
        act : {
            value : 0,
            setter : function(v){
                var self = this;
                self.isRender && self._setAct(v);
                return v;
            }
        }
    };
   

   /**
     * 方法  再次强调下 extend() 类与类的继承；S.augment用于复制原型prototype方法。； 扩展组件方法
     */
  /**
  与设计参数一样，明河的建议是先思考，组件需要哪些方法，哪些是共有的，用户可以调用的；哪些是私有的方法；方法的函数名采用什么更合理。
  */
  
  /*
  在步骤条组件中，_init函数中，没有任何一行代码，为什么呢？
	_init可以理解为初始化，kissy的不少组件_init作用和render是类似的，但这种方式有个不合理的地方，实例化组件即运行组件，不够颗粒化，有时候我们希望实例化组件，但不运行，只有符合一定条件或在符合一个时间点的时候再运行。
	为了保持和kissy其他组件的风格一致，明河这里依旧保留_init这个方法。
  */
    S.augment(Steps, {  				// 复制 或 者扩展 原型链方法；  extend 才是继承；											
         _init : function(){   

         },
      
        render : function(){  			// 运行   @return {Object} 对象  render是最重要的组件方法，在实例化组件后，用户还需要调用下该方法，表示真正运行组件
            var self = this,
				event = Steps.event,
				container = self.container,
				steps,cls = Steps.cls;
            
            if(container == null) return false;				//不存在容器，直接退出           
				steps = DOM.children(container, LI);			//步骤列表li元素  注意Children(selecter,filter) 元素和过滤条件 不能够有空格哦
				DOM.addClass(container, cls.STEPS); 			//给容器添加“ks-steps”样式
				self.steps = steps;							//设置steps属性（li元素集合）  再此处设置 属性值 为静态属性；           
            if(steps.length == 0) return false;				//如果不存在li直接退出          
				self.isRender = true;						//isRender属性标示组件已经运行
            
			//设置每个步骤的样式 注意这里的this 作用域其实 是steps这个类
            self._setItemStyle();
			
            //设置宽度
            self._setWidth();
			
            //设置颜色
            self._setColor();
			
            //设置激活的当前步骤
            self._setAct();
			
            //向每个步骤添加三角
            self._addTrigon();
			
            self.fire(event.RENDER,{'steps':steps});  // 选择器调用 fire() 方法
			
            return self;
        },
		
        /**
         * 获取步骤条组件允许设置的颜色值
         * @return {Array} 颜色数组
         */
        allowColor : function(){
            var self = this,
				colors = self._allowColor;
				
            if(colors.length == 0){
                S.each(Steps.color,function(v){
                    colors.push(v);
                });
            }
            return colors;
        },
		
        /**
         * 是否是允许设置的颜色
         * @param {String} color 颜色
         * @return {Boolean}
         */
        isAllowColor : function(color){
            var self = this,
				allowColor = self.allowColor(),
				Bool = false;
				
            S.each(allowColor,function(v){
                if(v == color){
                    Bool = true;
                    return true;
                }
            });
            return Bool;
        },
		
        /**
         * 设置每个步骤的样式  这个方法有二个目的，给li增加“ks-steps-item”样式，同时设置li的z-index（保证li和li之间箭头正确的覆盖关系）。
         */
        _setItemStyle : function(){
            var self = this,
				steps = self.steps,
				cls = Steps.cls,
				zIndex = Steps.ZINDEX;
				
            //遍历li
            S.each(steps,function(elem){
                DOM.addClass(elem, cls.ITEM);	 //给li增加“ks-steps-item”样式
                DOM.css(elem,'zIndex', zIndex);	 //设置li的z-index 注意：css()的用法，如果是单一的可以用参数，如果多个则 用json对象传入吧；
                zIndex --;						//这里之所以 zIndex-- 是因为后一个li 步骤条 遮盖前一个的关系；
            });
        },
        /**
         * 设置宽度
         * @param {Number} w 宽度
         * @return {Number}
         */
        _setWidth : function(w){
            var self = this,
				width = w || self.get('width'),
				container = self.container,
				steps = self.steps,
				itemLen = steps.length,
				containerWidth;
				
            if(width == EMPTY){
                if(itemLen == 0) return false;
                containerWidth = DOM.width(container); 		//获取 容器宽度 然后平分宽度  在后再格式话数字类型！
                width = Number(containerWidth/itemLen);
            }
            DOM.width(steps, width); 						//因为steps是 数组 所以Dom.width([array], number) 自动予以平分li宽度
            return width;
        },
		
        /**
         * 设置颜色
         * @param {String} c 颜色
         * @return {String}
         */
        _setColor : function(c){
            var self = this,
				color = c || self.get('color'),
				container = self.container,
				allowColors = self.allowColor(),
				isAllowColor = self.isAllowColor(color);
				
            //如果组件不支持该颜色直接退出
            if(color == EMPTY || !isAllowColor) return false;
			
            //移除步骤条容器的所有颜色样式名 -- 注意：这里不是 操作 容器下 dom元素，而是 巧妙的 利用css 选择器的关系来改变li的 背景颜色  .ks-steps.red li.done
            DOM.removeClass(container, allowColors.join(' ') ); 
			
            //给步骤条容器添加指定颜色样式名
            DOM.addClass(container, color);
			
            return color;
        },
		
        /**
         * 设置激活的当前步骤
         * @param {Number} i 当前步骤
         * @return {Number}
         */
        _setAct : function(i){
            var self = this,
			act = i || self.get('act'),
			cls = Steps.cls,
			steps = self.steps,
			itemLen = steps.length;
			
            //当参数为空或值超过允许或小于1时移除全部样式
            if(act == EMPTY || act > itemLen || act < 1){
                DOM.removeClass(steps,cls.DONE + ' ' + cls.CURRENT);
                return 0;
            }
			
            //遍历li
            steps.each(function(elem,i){
                //给第一个步骤增加“first”样式名
                i == 0 && DOM.addClass(elem, cls.FIRST);
				
                //给最后一个步骤增加"last"样式名 first and last 都是设置圆角样式
                i == itemLen - 1 && DOM.addClass(elem, cls.LAST);
				
                //移除所有步骤的"done"和"current"样式名
                DOM.removeClass(elem, cls.DONE + ' ' + cls.CURRENT);
            });
			
			//添加'current'当前样式
            act--;			
            DOM.addClass(steps[act], cls.CURRENT);	

			//添加'done'已完成样式
            steps.each(function(elem, i){
                if(i >= act) return false;
                DOM.addClass(elem, cls.DONE);
            });
			
            return act;
        },
		
        /**
         * 向每个步骤添加三角
         * @return {Object} 对象
         */
		_addTrigon : function(){
			var self = this,
				steps = self.steps,
				stepLen = steps.length,
			    html = Steps.ARROW_TPL;
				
            S.each(steps,function(elem, i){
                //除了最后一个步骤之外全部添加三角样式
                i < stepLen - 1 && DOM.append(DOM.create(html),elem);
            });
			
            return self;
		}
    });
    S.Steps = Steps;
}, { requires: ['core'] });