/** @fileOverview 搜索页面业务控件
* 集成了查询页面的业务场景
* @author <a href="mailto:dxq613@gmail.com">董晓庆 旺旺：dxq613</a>  
* @version 1.0.1  
*/
KISSY.add(function(S,localStorage){
	var pageUtil = S.app('pageUtil'),
		Event = S.Event,
		UA = S.UA;
	
	//常量
	var CLS_LINE = 'form-line',
		CLS_LINE_NEW = 'row',
		CLS_HIDDEN = 'ks-hidden',
		CLS_DOWN = 'icon-down',
		CLS_UP = 'icon-up',
		CLS_STRETCH_BOX = 'stretch-box', //隐藏搜索项的容器
		CLS_STRETCH_LINE = 'stretch-line',//隐藏搜索项的icon
		ENTER_KEY = 13,
		APPEND_HEIHGT = 5; //计算表格宽度时，额外减少的高度避免出现滚动条
	/**
	* 集成了搜索页的业务逻辑
	*/
	var pageSeach = function (config){
		var _self = this;
		config = S.merge({
			formId:'searchForm',
			btnId:'btnSearch',
			autoSearch :true,
			validator:function(){return true;},
			isCrossPage: true
		},config);
		pageSeach.superclass.constructor.call(_self, config);
		_self._init();

	};
	
	S.extend(pageSeach,S.Base);
	S.augment(pageSeach,{
		//获取最后显示的表单行
		_getLastVisibleLine : function(){
			var _self = this,
				lines = S.all('.' + CLS_LINE,_self.form),
				result = null;
			if(!lines || lines.length === 0){
				lines = S.all('.' + CLS_LINE_NEW, _self.form);
			}
			lines.each(function(line){
				if(_self._isShow(line)){
					result = line;
				}
			});
			return result;
		},
		//当前表单行是否显示
		_isShow : function(formLine){
			var el = S.one(formLine);
			return el.css('visibility')!=='hidden' && el.height() > 0;
		},
		//初始化
		_init:function(config){
			var _self =this,
				gridConfig = _self.get('gridConfig'),
				autoFit = gridConfig.autoFit,
				form = S.DOM.get('#'+_self.get('formId')),
				btnEl = S.one('#'+_self.get('btnId')),
				grid = null; 
			
			if(_self.get('groupGrid')){
				grid = new S.LP.GroupGrid(gridConfig);
			}else if(_self.get('editGrid')){
				grid = new S.LP.EditGrid(gridConfig);
			}else{
				grid = new S.LP.Grid(gridConfig);
			}

			_self.store =_self.get('store');
			_self.grid = grid;
			_self.form = form;
			_self.btn = btnEl;
			_self.autoFit = autoFit;
			_self.renderTo = gridConfig.renderTo;
			_self._initFormFocus();
			_self._initEvent();
			
			
			if(_self.get('autoSearch')){
				_self._getData(true);
			}
		},
		_initFormFocus : function(){
			var _self = this,
				formEl = S.one(_self.form);
			//_self.form.focus();
			formEl.attr('tabindex',0);
			if(UA.ie){
				formEl.attr('hideFocus',true);
			}else{
				formEl.css({'outline':'none'});
			}
		},
		//初始化事件
		_initEvent:function(){
			var _self =this;

			_self._initFormEvent();
			_self._initGridEvent();
			_self._initStrethEvent();
			_self._initDataEvent();
			_self._initResizeEvent();
		},
		//初始化查询事件
		_initFormEvent : function(){
			var _self =this,
				validator = _self.get('validator');//验证函数

			//点击按钮前验证，通过后查询数据
			_self.btn.on('click',function(event){
				event.preventDefault();
				if(validator()){
					_self._getData(true);
				}
			});
			
			S.all('textarea',_self.form).on('keydown',function(e){
				if(e.keyCode === ENTER_KEY){
					e.stopPropagation();
				}
			});
			//点击enter键查询
			Event.on(_self.form,'keydown',function(e){
				if(e.keyCode === ENTER_KEY){
					if(validator()){
						_self._getData(true);
					}
				}
			});
		},
		//初始化表格事件
		_initGridEvent : function(){
			var _self =this,
				grid = _self.grid;
			//从表格中打开新页面
			grid.on('aftershow',function(){
				S.all('.grid-command','#'+_self.renderTo).on('click',function(event){
					event.preventDefault();
					var sender = S.one(this),
						href = sender.attr('data-href'),
						id = sender.attr('data-id'),
						type = sender.attr('data-type'),
                        moduleId = sender.attr('data-module'),
						text = sender.attr('data-title');
					if(sender.hasClass('command-btn')){
						return;
					}
					if(_self.get('isCrossPage') && top.pageManger){
						top.pageManger.openPage(moduleId,type+id,text,href,function(){
							_self._getData();
						});
						return false;
					}
				});
			});
			//列隐藏
			grid.on('columnhide',function(event){
				_self._lazySetHidenConfig();
			});
			//列显示
			grid.on('columnshow',function(event){
				_self._lazySetHidenConfig();
			});
		},
		//初始化收缩事件
		_initStrethEvent : function(){
			var _self =this,
				strethLineEl = S.one('.'+CLS_STRETCH_LINE,_self.form),
				strethBoxEl = S.one('.'+CLS_STRETCH_BOX,_self.form); //收缩条

			//收缩、展开搜索项
			if(strethLineEl && strethBoxEl){
				strethLineEl.on('click',function(){
					strethBoxEl.toggleClass(CLS_HIDDEN);
					if(strethBoxEl.hasClass(CLS_HIDDEN)){
						strethLineEl.addClass(CLS_DOWN);
						strethLineEl.removeClass(CLS_UP);
					}else{
						strethLineEl.removeClass(CLS_DOWN);
						strethLineEl.addClass(CLS_UP);
					}
					var lastLine = _self._getLastVisibleLine(),
						btnParent = _self.btn.parent('.form-field-container');
					if(!btnParent){
						btnParent = _self.btn.parent('.form-actions');
					}
					if(lastLine && btnParent){
						btnParent.appendTo(lastLine);
					}
                    if(_self.get('gridConfig').autoFit){
					    _self.autoFitHeight();
                    }
				});
			}
		},
		//初始化Store事件
		_initDataEvent : function(){
			var _self =this,
				store = _self.store;

			//处理异常
			store.on('exception',function(event){
				if(event.responseText && S.indexOf(event.responseText,'DOCTYPE html')>= 0){
					top.location.reload();
				}else{
					var version = S.LP.version == 2.0 ? '2.0' : '1.0';
					S.use( version +'/message',function(S,message){
						S.LP.Message.Alert(event.error);
					});
				}
			});
		},
		//初始化窗口改变事件，通过外层框架的Tab触发
		_initResizeEvent : function(){
			var _self = this,
				curTabId = null;

			function resizeEvent(){
				_self.autoFitWidth();
				_self.autoFitHeight();
			}

			if(_self.get('isCrossPage') && top.pageManger &&  _self.get('gridConfig').autoFit){
				curTabId = top.pageManger.getTabId();
				//当Tab触发Resize事件时，表格自适应，暂时只做宽度调整
				top.pageManger.tabBindEvent('',curTabId,'tabResize',resizeEvent);
				S.Event.on(window,'unload',function(){
					top.pageManger.tabDetachEvent('',curTabId,'tabResize',resizeEvent);
				});
			}
			
		},
		//获取查询结果
		_getData:function(reset){
			var _self =this,
				form = _self.form,
				store = _self.store,
				param = S.LP.FormHelpr.serializeToObject(form);
			if(reset){
				param.start=0;
				param.pageIndex = 0;
			}
			store.load(param);
			_self.fire('reloadGrid', {param: param});
		},
		//延迟将隐藏的列，本地存储
		_lazySetHidenConfig : function(){
			var _self = this,
				func = _self.get('func');
			if(func){
				func.cancel();
			}
			func = S.later(_self._setHidenConfig,500,false,_self);
			_self.set('func',func);
		},
		//设置隐藏列的配置项
		_setHidenConfig : function(){
			var _self = this,
				arrs = [],
				columns = _self.get('gridConfig').columns;
			S.each(columns,function(column){
				if(column.hide === true){
					var name = column.dataIndex;
					arrs.push(name);
				}
			});
			localStorage.setItem(getHideColumnKey(),arrs.join(';'));
			_self.set('func',null);
		},
		autoFitWidth : function(){
			var _self = this,
				grid = _self.grid,
				width = getGridWidth();
			grid.setWidth(width);
		},
		//自动设置表格高度
		autoFitHeight : function(){
			var _self = this,
				grid = _self.grid,
				height = getGridHeight(_self.renderTo);
			grid.setHeight(height);
		},
		/**
		* 获取查询结果
		* @param {Boolean} [reset = false] 是否从第0页开始查询，默认为false
		*/
		getData:function(reset){
			this._getData(reset);
		},
		/**
		* 获取表单的查询项
		* @return {Object} 返回键值对的对象
		*/
		getParam:function(){
			var _self =this,
				form = _self.form,
				param = S.LP.FormHelpr.serializeToObject(form);
			return param;
		}
		
	});
    //一开始名字写错了
	pageUtil.pageSeach = pageSeach;

    pageUtil.pageSearch = pageSeach;
	/**
	* util 方法，生成表格内的链接
	*/
	pageUtil.getGridCommandTemp = function(obj){
		return ['<span class="grid-command ',obj.css,'" data-title="',obj.title,'" data-id="',obj.id,'" data-type="',obj.type,'" data-href="',obj.href,'" href="',obj.href,'" data-module="',obj.moduleId,'">',obj.text,'</span>'].join('');
	};

    /**
	*  util 方法,多
	*/
	pageUtil.getOperationTemp = function(conf){
        var items = conf.items,
            arr = [],
            temp = null;
        S.each(items,function(item){
            arr.push('<li>' + pageUtil.getGridCommandTemp(item) + '</li>');
        });
        temp = ['<span class="grid-command command-btn">', conf.text, '<span class="grid-command-trigger"></span><ul class="ks-hidden">', arr.join('') ,'</ul></span>'].join('');
        return temp;
    }

	/**
	* 创建Store的 util方法
	* @param {String} url 设置url
	* @param {String} dataType,默认为json ,可以设置jsonp格式
	*/
	pageUtil.createStore = function(url,dataType){
		return new S.LP.Store({
				url : url,
				autoLoad : false,
				dataType : dataType
		});
	};


	
	//初始化隐藏的列，从本地获取隐藏列的信息
	function initHideColumns(columns){
		var hideStr = localStorage.getItem(getHideColumnKey());
		if(hideStr){
			var arrs = hideStr.split(';');
			S.each(columns,function(column){
				var name = column.dataIndex;
				if(S.inArray(name,arrs)){
					column.hide = true;
				}
			});
		}
	}

	//获取隐藏列的键
	function getHideColumnKey(){
		var url = location.href,
			array = url.split('/'),
			count = array.length,
			lastStr = array[count-1],
			index = lastStr.indexOf('.'),
			lastName = lastStr.substring(0,index);
		if(count <= 2){
			return lastName;
		}
		return array[count - 2] + '-' + lastName;
	}
	
	//获取表格自适应的宽度
	function getGridWidth(){
		var clientWidth = S.DOM.viewportWidth(),
			subWidth = 40;
		if(S.UA.ie <= 7){
			subWidth = 60;
		}
		return clientWidth - subWidth;

	}
	//获取表格自适应的高度
	function getGridHeight(renderId){
		var container = S.one('#' + renderId),
			clientHeight = S.DOM.viewportHeight(),
			offset = container.offset();
		if(clientHeight > offset.top){
			return clientHeight - offset.top - APPEND_HEIHGT;
		}

		return 0;
	}
	
	/**
	 * 生成表格的配置项
	 * @param {Array} columns 列定义
	 * @param {Store} store 数据缓冲对象
	 * @param {Object} custom 自定义的列表配置项
	 * @param {Number} pageSize 单页记录数
	 */
	pageUtil.createGridConfig = function(columns,store,custom,pageSize){

		custom = custom || {};
		var renderId = (custom && custom.renderTo) || 'grid',
			autoFit = custom ? custom.autoFit : false,
			height = null;
		pageSize = pageSize || 50;

		initHideColumns(columns);
		//设置表格宽度
		var columnsWidth = 0,
			showCount = 0,
			gridWidth =getGridWidth(),
			checkWidth = (custom&&custom.checkable) ? 31 : 0,
			times = 1, //窗口宽度跟列宽度和的比例
			realWidth = 0; //Grid自适应后的宽度

		S.each(columns,function(column){
			column.width = column.width ||80;
			if(!column.hide){
				columnsWidth += column.width;
				showCount += 1;
			}
		});
		
		if(!autoFit){
			times = (gridWidth-2 - checkWidth- showCount*2)/columnsWidth;
			if(times <=  1)
			{
				gridWidth = columnsWidth;
			}
			custom.forceFit = true;
		}else{
			height = getGridHeight(renderId);
			times = (gridWidth-2 - checkWidth- showCount*2 - 17)/columnsWidth;
			if(times > 1){
				S.each(columns,function(column){
					if(!column.hide){
						column.width = Math.floor(column.width * times);
						realWidth +=column.width;
					}
				});
				//如果设置高度，则滚动条会影响宽度 17 为滚动条宽度
				gridWidth = realWidth + showCount*2 +2+checkWidth + 17;
			}
		}


		var defaultSetting = {
			renderTo : renderId,
			columns : columns,
			store : store,
			height : height,
			showMenu : true,
			bbar : {pageSize : pageSize},
			loadMask : true,
			width : gridWidth
		};
		
		if(custom){
			S.mix(defaultSetting, custom);
		}

		return defaultSetting;
	};
	

	

}, {requires: ['1.0/local-storage']});