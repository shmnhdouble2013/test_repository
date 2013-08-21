KISSY.add(function(S,Template){

	var DOM = S.DOM,
		CLS_ROOT = 'work-flow',
		COLOR_NODE = '#c8cbcf',
		COLOR_LINE = '#bbbdc0',
		CLS_INFO = 'node-info-container',
		CLS_SELECTED = CLS_INFO + '-selected',
		NS_SVG = 'http://www.w3.org/2000/svg';
	/**
	 * 流程图
	 * @name Workflow
	 */
	var workflow = function(config){
		workflow.superclass.constructor.call(this, config);
		this._init();
	}
	
	workflow.ATTRS = 
	/**
	 * @lends Workflow
	 */
	{
		/**
		 * 活动节点的半径
		 * @type {Number}
		 * @default 5
		 */
		actionRadio : {
			value : 5
		},
		/**
		 * 线的弧度
		 * @type {Number}
		 * @default 10
		 */
		lineCurve : {
			value : 10	
		},	
		/**
		 * 线的配置项
		 * @type {Object}
		 * @default 
		 * {
		 *	fill :'none',
		 *		stroke : '#c8cbcf',
		 *		'stroke-width' : 2
		 *	}
		 */
		lineAttr : {
			value : {
				fill :'none',
				stroke : COLOR_LINE,
				'stroke-width' : 2
			}
		},
		/**
		 * 线的标签名
		 * @type {String}
		 * @default 默认 'line'
		 */
		lineTag : {
			value : 'line'
		},
		/**
		 * 节点的配置项
		 * @type {Object}
		 * {
		 *		fill : '#c8cbcf'
		 *	}	
		 */
		nodeAttr :{
			value : {
				fill : COLOR_NODE
			}	
		},
		/**
		 * 节点集合
		 * @type {Array}
		 */
		nodes : {
			value : []
		},
		/**
		 * 节点的标签名
		 * @type {String}
		 * @default 'circle'
		 */
		nodeTag : {
			value : 'circle'
		},
		/**
		 * 线的集合
		 * @type {Array}
		 */
		lines : {
			value : []	
		},
		/**
		 * 线的颜色
		 * @type {String}
		 * @default lineColor
		 */
		lineColor : {
			value : 'blue'	
		},
		pathTag : {
			value : 'path'
		},
		pathAttr : {
			value : 'd'
		},
		/**
		 * 容器Id
		 * @type {String}
		 */
		renderTo : {
			
		},
		/**
		 * 根节点
		 * @type {Dom}
		 */
		rootDom : {
				
		},
		/**
		 * 根目录的标签
		 * @type {String}
		 * @default 'svg'
		 */
		rootTag : {
			value : 'svg'
		},
		/**
		 * title的模版
		 * @type {String}
		 */
		titleTpl : {

		},
		/**
		 * 宽度
		 * @type {Number}
		 */
		width : {
			value : 500
		},
		/**
		 * 高度
		 * @type {Number}
		 */
		height:{
			value : 200
		},
		/**
		 * 横坐标的单位长度
		 * @type {Number}
		 */
		xCell : {
			value : 100	
		},
		/**
		 * 纵坐标
		 * @type {Number}
		 */
		yCell : {
			value : 40	
		},
		/**
		 * 图例Src
		 * @type {String}
		 */
		cutline : {
			value : ''	
		}
	}

	S.extend(workflow,S.Base);

	S.augment(workflow,{
		_appendElement : function(type,attrs,parent){
			var _self = this,
				el = _self._createElement(type);
			
			DOM.attr(el,attrs);
			DOM.appendTo(el,parent);
			return el;
		},
		_createElement : function(type){
			return document.createElementNS(NS_SVG,type); 
		},
		//创建节点信息，展示在节点下面
		_createNodeInfo : function(node,nodeEl){
			var _self = this,
				title = node.title,
				info = node.info,
				infoPos = node.infoPos,
				container = _self.get('container'),
				nodesTemplate = _self.get('nodesTemplate'),
				containerOffset = container.offset(),
				offset = nodeEl.offset(),
				nodeTop = offset.top-containerOffset.top,
				nodeLeft = offset.left-containerOffset.left,
				offHeight = _self.get('actionRadio') + 10,
				temp = null;
			if(!title)
				return;
			//set title
			temp = '<div class="node-title-container">' + title + '</div>';
			var titleEl = new S.Node(temp).appendTo(container);
			titleEl.css({top : nodeTop - offHeight,left : nodeLeft});

			if(info && nodesTemplate){
				var nodeTpl = nodesTemplate[node.id],
					iconArrow = infoPos == 1? 'x-caret-down' :'x-caret-up';
				if(nodeTpl){

					temp = '<div class="node-info-container"><span class="x-caret ' + iconArrow + '"></span>'+Template(nodeTpl).render(info)+ '</div>';
					var infoEl = new S.Node(temp).appendTo(container);
					if(infoPos === 1){
						var infoHeight = infoEl.outerHeight();
						infoEl.css({top : nodeTop - (infoHeight + offHeight + 10),left : nodeLeft});
						infoEl.addClass('node-pos-top');
					}else{
						infoEl.css({top : (nodeTop + offHeight + 10),left : nodeLeft});
					}	
				}
			}
		},
		//获取根目录的对齐方式
		_getRootConfig : function(){
			var _self = this,
				width =  _self.get('width'),
				height = _self.get('height'),
				rootConfig= {
					width : width,
					height : height,
					viewBox : '0 0 ' + width + ' ' + height
				};
			return rootConfig;
		},
		//初始化
		_init : function(){
			var _self = this;
			_self._initDom();
			_self._initNodes();
			_self._initLines();
			_self._initEvent();
			_self._initCutline();
		},
		//初始化DOM
		_initDom : function(){
			var _self = this,
				rootDom = _self.get('rootDom'),
				renderTo = _self.get('renderTo'),
				container = S.one('#'+renderTo),
				rootConfig= _self._getRootConfig();
			_self.set('container',container);
			if(!rootDom){
				rootDom = _self._appendElement(_self.get('rootTag'),rootConfig,container);
				_self.set('rootDom',rootDom);
			}
			container.addClass('flow-chart');
			container.css({position : 'relative'});
		},
		//根据Id获取 node
		_getNode : function(id){
			var _self = this,
				nodes = _self.get('nodes'),
				result = null;
			S.each(nodes,function(node){
				if(node.id == id){
					result = node;
					return false;
				}
			});
			return result;
		},
		//获取节点配置信息
		_getNodeConfig : function(node){
			var _self = this,
				nodeAttr = _self.get('nodeAttr'),
				nodeConfig = S.merge(nodeAttr,{
					cx : _self._getX(node.x),
					cy : _self._getY(node.y),
					r : _self.get('actionRadio')
				},node.attrs);

			return nodeConfig;
		},
		//获取水平坐标
		_getX : function(x){
			var _self = this,
				radio = _self.get('actionRadio');
			return x * _self.get('xCell') + radio;
		},
		//get the y 坐标
		_getY : function(y){
			var _self = this,
				radio = _self.get('actionRadio');
			return y * _self.get('yCell') + radio;
		},
		_getPosition : function(node){
			var _self = this;

			return {x : _self._getX(node.x), y : _self._getY(node.y)};
		},
		//初始化事件
		_initEvent : function(){
			var _self = this,
				container = _self.get('container');

			container.delegate('click','.'+CLS_INFO,function(ev){
				var sender = S.one(ev.currentTarget);
				_self._clearInfoSelected();
				sender.addClass(CLS_SELECTED);
			});
		},
		_clearInfoSelected:function(){
			var _self = this,
				container = _self.get('container');
			container.all('.' + CLS_SELECTED).removeClass(CLS_SELECTED);
		},
		//初始化节点
		_initNodes : function(){
			var _self = this,
				nodes = _self.get('nodes');
			S.each(nodes,function(node){
				_self._initNode(node);
			});
		},
		//初始化节点
		_initNode : function(node){
			var _self = this,
				nodeConfig = _self._getNodeConfig(node),
				el = _self._appendElement(_self.get('nodeTag'),nodeConfig,_self.get('rootDom'));
			if(node.css){
				DOM.addClass(el,node.css);
			}
			_self._createNodeInfo(node,S.one(el));
		},
		//初始化线
		_initLines : function(){
			var _self = this,
				lines = _self.get('lines');

			S.each(lines,function(line){
				var node1 = _self._getNode(line.begin),
					pos1 = _self._getPosition(node1),
					node2 = _self._getNode(line.end),
					pos2 = _self._getPosition(node2);
				if(node1.y == node2.y|| node1.x == node2.x){
					_self._createLine(pos1,pos2,line.attrs);
				}else{
					_self._createPath(pos1,pos2,line.attrs);
				}
			});
		},
		_getLineConfig : function(pos1,pos2,attrs){
			var _self = this,
				radio = _self.get('actionRadio'),
				lineAttr = S.merge(_self.get('lineAttr'),{
					x1 : pos1.x + radio,
					y1 : pos1.y,
					x2 : pos2.x - radio,
					y2 : pos2.y
					
				},attrs);
			return lineAttr;
		},
		//画直线
		_createLine : function(pos1,pos2,attrs){
			var _self = this,
				lineAttr = _self._getLineConfig(pos1,pos2,attrs)

			_self._appendElement(_self.get('lineTag'),lineAttr,_self.get('rootDom'));
		},
		//画带有弧度的折线
		_createPath : function(pos1,pos2,attrs){
			var _self = this,
				points = _self._getPathPoints(pos1.x,pos1.y,pos2.x,pos2.y),
				pathAttr = S.merge(_self.get('lineAttr'),attrs);

			pathAttr[_self.get('pathAttr')] = points.join(' ');

			_self._appendElement(_self.get('pathTag'),pathAttr,_self.get('rootDom'));
		},
		_getPathPoints : function(x1,y1,x2,y2){//pos1,pos2
			var _self = this,
				r =  _self.get('actionRadio'),
				lineCurve = _self.get('lineCurve'),
				points = [],
				qx =Math.floor(x1 +( x2 - x1)/2 - lineCurve),
				qcx = qx + lineCurve,//1/4 横轴，加上弧度半径
				direct = y2 > y1 ? 1 : -1;

			points.push('M ' + (x1 + r) + ',' + y1);
			points.push('L ' + qx + ',' + y1);
			//弧度
			points.push('C '+ [qcx , y1,qcx,y1,qcx,y1 + (lineCurve * direct)].join(' '));

			points.push('L ' + qcx + ',' + (y2 - (lineCurve * direct)));

			//弧度
			points.push('C '+ [qcx , y2,qcx,y2,qcx + lineCurve,y2].join(' '));

			points.push('L' + (x2 - r) + ',' + y2);
			return points;
		},
		// 初始化图例
		_initCutline: function(){
			var _self = this,
				container = _self.get('container'),
				cutline = _self.get('cutline');
			if(!!cutline){
				container.prepend('<div class="node-info-container workflow-cutline"><img src="' + cutline + '"/></div>');
			}
		},
		destroy:function(){
			var _self = this,
				container = _self.get('container');
			container.children().remove();
			container.undelegate();
			_self.detach();
			_self.__attrVals = {};
		}
		
	});

	var workflowVml = function(config){
		workflowVml.superclass.constructor.call(this, config);
	};

	workflowVml.ATTRS = {
		nodeAttr : {
			value : {
				filled:true,
				FillColor : COLOR_NODE,
				StrokeColor : COLOR_NODE
			}
		},
		pathAttr : {
			value : 'path'
		},
		rootTag:{
			value:'div'
		},
		elementNS : {
			value : ''
		},
		lineAttr : {
			value : {
				StrokeColor : COLOR_LINE,
				StrokeWeight : 2,
				FillOpacity : 0
			}
		},
		nodeTag : {
			value : 'v:oval'
		},
		lineTag : {
			value : 'v:line'
		},
		pathTag : {
			value : 'v:shape'
		}
	};

	S.extend(workflowVml,workflow);

	S.augment(workflowVml,{
		//创建节点
		_createElement : function(type){
			return document.createElement(type); 
		},
		_createPath : function(pos1,pos2,attrs){
			var _self = this,
				radio = _self.get('actionRadio'),
				points = _self._getPathPoints(pos1.x + radio,
					pos1.y + radio,
					pos2.x + radio,
					pos2.y + radio
				),
				width = Math.abs(pos2.x - pos1.x),
				height = Math.abs(pos2.y - pos1.y),
				styleObj = {
					position : 'absolute',
					width : width + 'px',
					height : height + 'px'
				},
				pathAttr = S.merge(_self.get('lineAttr'),{style:_self._getStyle(styleObj)},attrs,{CoordSize: width + ',' + height});

			pathAttr[_self.get('pathAttr')] = points.join(' ');
			S.log(points.join(' '));
			_self._appendElement(_self.get('pathTag'),pathAttr,_self.get('rootDom'));
		},
		//获取线配置
		_getLineConfig : function(pos1,pos2,attrs){
			var _self = this,
				radio = _self.get('actionRadio'),
				styleObj = {position:'absolute'},
				lineAttr = S.merge(_self.get('lineAttr'),{
					'from' : (pos1.x + radio * 2) +','+(pos1.y + radio),
					'to' : (pos2.x) + ',' + (pos2.y + radio)
				},{style:_self._getStyle(styleObj)},attrs);
			return lineAttr;
		},
		//获取节点配置信息
		_getNodeConfig : function(node){
			var _self = this,
				radio = _self.get('actionRadio'),
				nodeAttr = _self.get('nodeAttr'),
				styleObj = {
					position : 'absolute',
					left : _self._getX(node.x) + 'px',
					top : _self._getY(node.y) +'px',
					width: radio * 2 + 'px',
					height:radio * 2 + 'px'
				},
				nodeConfig = S.merge(nodeAttr,{style:_self._getStyle(styleObj)},node.attrs);
			
			return nodeConfig;
		},
		_getRootConfig : function(){
			var _self = this,
				styleObj = {
					width : _self.get('width') + 'px',
					height : _self.get('height') + 'px'
				};
			return {style:_self._getStyle(styleObj),'class':CLS_ROOT};
		},
		_getStyle : function(obj){
			var arr = [];
			for (var name in obj) {
				if(obj.hasOwnProperty(name)){
					arr.push(name + ':' + obj[name]);
				}
			}
			return arr.join(';')
		}
	});

	workflow.vml = workflowVml;
	return  workflow;

},{
	requires: ["template"]
});