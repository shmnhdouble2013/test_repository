KISSY.add(function(S,Workflow){

	var UA = S.UA,
		attrs = {
			stroke : 'StrokeColor',
			'stroke-width' : 'StrokeWeight',
			fill : 'FillColor'
		};

	function createGetter(config){
		return function(){
			if(UA.ie && UA.ie < 9){
				return parseVML(config);//ieConfig;
			}else{
				return config;
			}
		};
	}
	
	function getConfig(config){
		if(UA.ie && UA.ie < 9){
			return parseVML(config);
		}else{
			return config;
		}
	}


	function parseVML(config){
		var newConfig = {};
		S.each(config,function(v,k){
			if(attrs[k]){
				newConfig[attrs[k]] = v;
			}else{
				newConfig[k] = v;
			}
		});
		return newConfig; 
	}
	/**
	 * 供应链对象，用于显示供应链
	 * @name SupplyChain
	 * @param  {[type]} config 配置项
	 */
	var supplyChain = function(config){
		supplyChain.superclass.constructor.call(this, config);
		this._init();
	}

	supplyChain.ATTRS ={
		nodeTypes : {
			value : {
				"1" : {
					stroke:'#c8cbd0',
					'stroke-width':2,
					fill:'#c8cbd0'
				},
				"2" : {
					stroke:'#535c6f',
					'stroke-width':2,
					fill:'#16e4d8'
				},
				"3" : {
					stroke:'#535c6f',
					'stroke-width':2,
					fill:'#ffbd3f'
				},
				"4" : {
					stroke:'#535c6f',
					'stroke-width':2,
					fill:'#f8273f'
				},
				"5" : {
					stroke:'#626e84',
					'stroke-width':2,
					fill:'#626e84'
				}
			}
		},
		/**
		 * 活动的节点样式
		 * @type {Object}
		 */
		activeNodeAttrs:{
			getter :  createGetter({
					stroke:'#535c6f',
						'stroke-width':2,
						fill:'#16e4d8'
					},{

						FillColor : '#16e4d8',
						StrokeWeight:2,
						StrokeColor : '#535c6f'
					})
		},
		unstartType : {
			value : '1'
		},
		/**
		 * 活动节点的值
		 * @type {Nunmber}
		 * @default 1
		 */
		activeType:{
			value: 2
		},
		/**
		 * 完成的节点样式
		 * @type {Object}
		 * @default {fill:'#626e84'}
		 */
		completeNodeAttrs:{
			getter  : createGetter({fill:'#626e84'},{FillColor : '#626e84'})
		},
		/**
		 * 完成的节点类型值
		 * @type {Number}
		 * @defalut 2
		 */
		completeType : {
			value : 5
		},
		/**
		 * 完成的节点相邻的线的样式
		 * @type {Object}
		 * @default {stroke:'#626e84'}
		 */
		completeLineAttrs:{
			getter  : createGetter({stroke:'#626e84'})
		},
		workflowConfig: {
			setter: function(v){
				v = S.merge({
					cutline: 'http://img02.taobaocdn.com/tps/i2/T1zVAjXXXaXXb_mJfL-354-29.png'
				}, v);
				return v;
			}	
		}
	};

	S.extend(supplyChain,S.Base);

	S.augment(supplyChain,{
		//初始化
		_init : function(){
			var _self = this,
				workflowConfig = _self.get('workflowConfig');
			_self._initNodes(workflowConfig.nodes);
			_self._initLines(workflowConfig.lines,workflowConfig.nodes);
			_self._initWorksflow(workflowConfig);
				
		},
		//初始化连接线
		_initLines : function(lines,nodes){
			var _self = this;

			S.each(lines,function(line){
				var endNode = _self._getNode(line.end,nodes);
				if(endNode && endNode.type &&  endNode.type != _self.get('unstartType')){
					line.attrs = _self.get('completeLineAttrs');
				}
			});

		},
		_getNodeAttrs : function(type){
			var _self = this,
				nodeTypes = _self.get('nodeTypes');
			if(!type){
				return nodeTypes[_self.get('unstartType')];
			}
			return getConfig(nodeTypes[type]);
		},
		//初始化节点
		_initNodes : function(nodes){
			var _self = this;

			S.each(nodes,function(node){
				node.attrs = _self._getNodeAttrs(node.type);
				//如果有内容决定内容的位置
				if(node.info){
					var downNode = _self._findNode(node.x,node.y+1);
					if(downNode){
						node.infoPos = 1;
					}
				}
			});

		},
		_findLastX : function(){
			var _self = this,
				workflowConfig = _self.get('workflowConfig'),
				nodes = workflowConfig.nodes,
				max = 0;

			S.each(nodes,function(node){
				if(node.x > max){
					max = node.x;
				}
			});
			return max;
		},
		_findLastY : function(){
			var _self = this,
				workflowConfig = _self.get('workflowConfig'),
				nodes = workflowConfig.nodes,
				max = 0;

			S.each(nodes,function(node){
				if(node.y > max){
					max = node.y;
				}
			});
			return max;
		},
		//查找节点
		_findNode : function(x,y){
			var _self = this,
				workflowConfig = _self.get('workflowConfig'),
				nodes = workflowConfig.nodes,
				result = null;
			S.each(nodes,function(node){
				if(node.x == x && node.y == y){
					result = node;
					return false;
				}
			});
			return result;
		},
		//根据Id获取节点
		_getNode : function(id,nodes){
			var result = null;
          S.each(nodes,function(node){
            if(node.id == id){
              result = node;
              return false;
            } 
          });
          return result;
		},
		//初始化流程对象
		_initWorksflow : function(workflowConfig){
			var _self = this,
				tplName = _self.get('tplName'),
				xCell = workflowConfig.xCell,
				yCell = workflowConfig.yCell,
				workflow;
			if(!workflowConfig.width){
				workflowConfig.width = (_self._findLastX() + 1) * xCell;
			}
			if(!workflowConfig.height){
				workflowConfig.height = (_self._findLastY() + 1) * yCell;
			}

			if(tplName){
				S.use(tplName,function(S,tpl){
					workflowConfig.nodesTemplate = tpl;
					_self._createWorkflow(workflowConfig);
				});
			}else{
				_self._createWorkflow(workflowConfig);
			}		
		},
		_createWorkflow:function(workflowConfig){
			var _self = this;
			workflow = UA.ie && UA.ie < 9 ? new Workflow.vml(workflowConfig) : new Workflow(workflowConfig);
			_self.set('workflow',workflow);
		},
		/**
		 * 获取显示工作流的对象
		 * @return {Workflow} 工作流图
		 */
		getWorkflow : function(){
			return this.get('workflow');
		},
		destroy:function(){
			var _self = this;
			_self.get('workflow').destroy();
			_self.__attrVals = {};
		}
	});

	return supplyChain;
},{requires : ['2.0/workflow']});