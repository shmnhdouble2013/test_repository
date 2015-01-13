/** 
* @fileOverview More 添加更多业务组件
* @author  huang'jia
* @version 1.0
*/
KISSY.add('hf-zt/more', function(S){
    /**
        @exports S.LP as KISSY.LP
    */
	var DOM = S.DOM,
		Event = S.Event;

	var CUT_LINE = '<p class="cut-line"></p>',
		DEL_GROUP_CLS = 'J_DelGroup';

	/**
	* More添加一项组件类
	* @memberOf S.LP
	* @description 添加一组表单项
	* @class More添加一项组件类
	* @param {Object} config 配置项
	* @param {Object} config.tempId 必填 组的模板的Id
	* @param {Object} config.groupClass 必填 生成的组的class
	* @param {Object} config.addGroupId 必填 ‘添加一项’的按钮Id 用来定位整个组件的渲染位置
	* @param {Object} [config.validater] 表单校验对像 默认为 null
	* @param {Object} [config.delText] 删除按钮的文案 默认为 ‘删除该组’
	* @param {Object} [config.inputAction] 组内各个表单项的actionl列表 默认为 {}  每个需要绑定action的表单项以name为key，action有三种类型：rules(校验规则)、func(可执行的方法)、ev(需要绑定的事件)
	* @param {Object} [config.minGroup] 最小的组的数量 默认为 1 
	* @param {Object} [config.maxGroup] 最大的组的数量 默认为 100
	* @param {Function} [config.minFunc] 达到最小组时执行的方法 默认为 alert
	* @param {Function} [config.maxFunc] 达到最大组时执行的方法 默认为 alert
	* @example 
	* //配置示例
	*	var moreConfig = {
	*		tempId: 'J_FactoryTemp',
	*		groupClass: 'J_Factory',
	*		addGroupId: 'J_AddGroup',
	*		validater: formValidater,
	*		delText: '删除该工厂',
	*		maxGroup: 5,
	*		inputAction: {
	*			'a1.b.c.d': {
	*				rules: {
	*					required: true
	*				}
	*			},
	*			'factoryAddr': {
	*				rules: {
	*					required: true
	*				}
	*			},
	*			'time-start': {
	*				func: More.initJoinCalendar({
	*					endTimeName: 'time-end',
	*					rules: {required: true}
	*				})
	*			},
	*			'name1': {
	*				events: [{
	*					type: 'click',
	*					callback: func
	*				}]
	*			}
	*		}
	*	};
	*/
	function More(config){
		var _self = this;
		config = S.merge(More.config, config);
		if(!config.tempId || !DOM.get('#' + config.tempId)){
			throw 'please assign the id of template Dom!';
		}
		if(!config.addGroupId || !DOM.get('#' + config.addGroupId)){
			throw 'please assign the id of Add More Button!';
		}
		if(!config.groupClass){
			throw 'please assign the class of New Group!';
		} 
		More.superclass.constructor.call(_self, config);
		// 支持的事件
		_self.events = [
			/**  
			* 添加一个group之前触发该事件 返回false则不添加
			* @name S.LP.More#beforeAddGroup
			* @event  
			*/
			'beforeAddGroup',
			/**  
			* 添加一个group之后触发该事件
			* @name S.LP.More#afterAddGroup
			* @event  
			* @param {event} e  事件对象
			* @param {Object} e.group 新增的group对象
			*/
			'afterAddGroup',
			/**  
			* 根据group的dom初始化group之后触发的事件
			* @name S.LP.More#initGroup
			* @event  
			* @param {event} e  事件对象
			* @param {Object} e.group 初始化的group对象
			*/
			'initGroup',
			/**  
			* 当组的数目达到最小限制时触发的事件
			* @name S.LP.More#alreadyMin
			* @event  
			* @param {event} e  事件对象
			* @param {Number} e.min 最小限制的值
			*/
			'alreadyMin',
			/**  
			* 当组的数目达到最大限制时触发的事件
			* @name S.LP.More#alreadyMax
			* @event  
			* @param {event} e  事件对象
			* @param {Number} e.max 最大限制的值
			*/
			'alreadyMax'
		];
		
		_self._init();
	}
	More.config = {
		tempId: null,
		groupClass: null,
		addGroupId: null,
		validater: null,
		inputAction: {},
		delText: '删除该组',
		minGroup: 1,
		maxGroup: 100,
		minFunc: function(min){
			alert('最少' + min + '组，不能继续删除！');
		},
		maxFunc: function(max){
			alert('最多' + max + '组，不能继续添加！');
		}
	};
	S.extend(More, S.Base);
	S.augment(More, 
	/** @lends  S.LP.More.prototype */		
	{
		/**
		* 重写 S.Base 的set 方法，默认设置时不触发事件
		* @protect
		*/
		set:function(key,value){
			More.superclass.set.call(this,key,value,{silent:1});
		},	
		/**
		* 添加新的组
		* @return {Object} 添加的新组对象
		*/
		addNewGroup: function(){
			var _self = this,
				nameNum,
				newConfig,
				newGroup;
			if(_self.fire('beforeAddGroup') === false){
				return;
			}
			// 获取name的序号
			nameNum = _self._getNameNum();
			// 配置group的配置项
			newConfig = {
				tempId: _self.get('tempId'),
				addGroup: _self.get('addGroup'),
				nameNum: nameNum,
				delGroupStr: _self.get('delGroupStr'),
				validater: _self.get('validater'),
				groupClass: _self.get('groupClass'),
				inputAction: _self.get('inputAction')
			};
			// 实例化group
			newGroup = new GroupFormTemp(newConfig);
			// 将group放在groupManager里面管理
			_self.setGroup(nameNum, newGroup);
			// 触发事件
			_self.fire('afterAddGroup', {group: newGroup});
			return newGroup;
		},
		/**
		* 获取group管理器
		* @return {Object} group管理器
		*/
		getGroupManager: function(){
			return this.get('groupManager');
		},
		/**
		* 获取group对象
		* @param {Number} nameNum name序号
		* @return {Object} group对象
		*/
		getGroup: function(nameNum){
			var _self = this,
				groupManager = _self.getGroupManager();
			return groupManager[nameNum] || null;
		},
		/**
		* 将group对象放到groupManager里面管理
		* @param {Number} nameNum name序号
		* @param {Object} group group对象
		* @return {Object} group管理器
		*/
		setGroup: function(nameNum, group){
			var _self = this,
				groupManager = _self.getGroupManager();
			// 初始话组的事件
			_self._initGroupEvent(group);
			if(!groupManager[nameNum]){
				// 组管理器的长度加1
				_self._setGroupLength(_self._getGroupLength() + 1);
			}
			groupManager[nameNum] = group;
			return groupManager;
		},
		/**
		* 将group对象从groupManager里面删除
		* @param {Number} nameNum name序号
		* @return {Object} group管理器
		*/
		delGroup: function(nameNum){
			var _self = this,
				groupManager = _self.getGroupManager();
			delete groupManager[nameNum];		
			// 组管理器的长度减1
			_self._setGroupLength(_self._getGroupLength() - 1);
			return groupManager;
		},
		/**
		* 销毁组
		* @param {Number} nameNum name序号
		
		destroyGroup: function(nameNum){
			var _self = this,
				group = _self.getGroup(nameNum);
			// 若组没有被销毁，则运行group的destroy方法
			if(group.getGroupEl()){
				group.destroy();
			}
			// 将group对象从groupManager里面删除
			_self.delGroup(nameNum);
		},*/
		/**
		* 销毁more对象
		*/
		destroy: function(){
			var _self = this,
				groupManager = _self.getGroupManager(),
				addGroup = _self.get('addGroup');
			// 销毁对象的标志
			_self.set('isDestroy', true);
			// 依次销毁组管理器中的组
			S.each(groupManager, function(group){
				group.destroy();
			});
			// 去掉增加一项按钮的事件
			addGroup.detach();
			// 去掉对象本身上的事件
			_self.detach();
		},
		// 对象初始化
		_init: function(){
			var _self = this,
				addGroup = S.one('#' + _self.get('addGroupId'));
			// 增添一项按钮
			_self.set('addGroup', addGroup);
			// 删除一项按钮
			_self.set('delGroupStr', '<p class="del-group ' + DEL_GROUP_CLS + '">' + _self.get('delText') + '</p>');
			// 初始化组管理器
			_self.set('groupManager', {});
			// 初始化组管理器长度
			_self.set('groupManagerLength', 0);
			// 初始化组编号
			_self.set('nameNum', 0);
			// 初始化需要回显的组
			_self._initEchoGroups();
			// 初始化事件
			_self._initEvent();
		},
		// 初始化事件
		_initEvent: function(){
			var _self = this,
				addGroup = _self.get('addGroup');
			// 增加一项按钮事件
			addGroup.on('click', function(){
				_self.addNewGroup();
			});
			// 增加时检查范围
			_self.on('beforeAddGroup', function(){
				return _self._checkNumRange(1);
			});
		},
		// 初始化group的事件，这些事件要用到more中的方法，所以必须在more中初始化
		_initGroupEvent: function(group){
			var _self = this;
			// 删除组之前检查组数量范围
			group.on('deleting', function(){
				if(!_self.get('isDestroy')){
					return _self._checkNumRange(-1);
				}else{
					return true;
				}
			});
			// 删除组后通知more, more将从组管理器中释放改组
			group.on('deleted', function(ev){
				_self.delGroup(ev.nameNum);
			});
		},
		// 实例化需要回显的组
		_initEchoGroups: function(){
			var _self = this,
				validater = _self.get('validater'),
				inputAction = _self.get('inputAction'),
				groupClass = _self.get('groupClass'),
				echoGroups,
				nameNum,
				echoConfig,
				echoGroup;
			// 获取需要实例化的dom列表
			echoGroups = DOM.query('.' + groupClass);
			S.each(echoGroups, function(echoItem){
				// 获取name序号
				nameNum = _self._getNameNum();
				// 配置项
				echoConfig = {
					domEl: echoItem,
					nameNum: nameNum,
					validater: validater,
					inputAction: inputAction
				};
				// 实例化
				echoGroup = new GroupFormDom(echoConfig);
				// 将group放到管理器中管理
				_self.setGroup(nameNum, echoGroup);
				// 触发事件
				_self.fire('initGroup', {group: echoGroup});
			});
		},
		// 检测组的数量的范围
		_checkNumRange: function(num){
			var _self = this,
				checkStatus = false,
				minGroup = _self.get('minGroup'),
				maxGroup = _self.get('maxGroup'),
				minFunc = _self.get('minFunc'),
				maxFunc = _self.get('maxFunc'),
				groupLength = _self._getGroupLength();
			if(groupLength + num < minGroup){
				minFunc(minGroup);
				_self.fire('alreadyMin', {min: minGroup});
			}else if(groupLength + num > maxGroup){
				maxFunc(maxGroup);
				_self.fire('alreadyMax', {max: maxGroup});
			}else{
				checkStatus = true;
			}
			return checkStatus;
		},
		// 获取组管理器中 组的数量
		_getGroupLength: function(){
			return this.get('groupManagerLength');
		},
		// 设置组管理器中 组的数量
		_setGroupLength: function(l){
			var _self = this;
			_self.set('groupManagerLength', l);
			return _self._getGroupLength();
		},
		// 获取name的序号
		_getNameNum: function(){
			var _self = this,
				nameNum = _self.get('nameNum');
			nameNum ++;
			_self.set('nameNum', nameNum);
			return nameNum;
		}
	});
	S.mix(More, 
	/** @lends  S.LP.More */
	{
		/**
		* 根据name获取表单项
		* @param {String} name name
		* @param {Object} conText 上下文对象
		* @param {String} [tagName] tagName 默认为 input
		* @return {Object} 表单项
		*/
		getDomFromName: function(name, conText, tagName){
			tagName = tagName || 'input';
			var targetDom = DOM.filter(tagName, function(el){
					return DOM.attr(el, 'name') === name;
				}, conText);
			return targetDom[0] ? S.one(targetDom[0]) : null;
		},
		/**
		* 初始化日历的方法
		* @param {object} config 配置项
		* @param {object} [config.timeConfig] 日期的配置信息
		* @param {object} [config.rules] 校验规则集
		* @return {Function} 返回一个方法供More配置项使用
		*/
		initCalendar: function(config){
			config = S.merge({
				timeConfig: {},
				rules: {}
			}, config);
			return function(item){
				var _self = this,
					validater = _self.get('validater'),
					timeId,
					c = null;
				if(S.LP.Calendar){
					// 若没有id则指定一个唯一id
					timeId = item.attr('id') || S.guid();
					item.attr('id', timeId);
					c = new S.LP.Calendar(timeId, config.timeConfig, {'validater': validater, 'rules': config.rules});
				}
				return c;
			};
		},
		/**
		* 初始化联合校验日历的方法
		* @param {object} config 配置项
		* @param {object} config.endTimeName 结束日期的name
		* @param {object} [config.startConfig] 开始日期的配置信息
		* @param {object} [config.endConfig] 结束日期的配置信息
		* @param {object} [config.rules] 联合校验规则集
		* @return {Function} 返回一个方法供More配置项使用
		*/
		initJoinCalendar: function(config){
			if(!config || !config.endTimeName){
				throw 'please assign the name of endTime!';
			}
			config = S.merge({
				startConfig: {},
				endConfig: {},
				rules: {}
			}, config);
			return function(item){
				var _self = this,
					getGroupEl = _self.get('groupEl'),
					validater = _self.get('validater'),
					startTimeEl = item,
					endTimeEl = More.getDomFromName(config.endTimeName, getGroupEl),
					startTimeId,
					endTimeId,
					jc = null;
				if(endTimeEl && S.LP.JoinCalendar){
					// 若没有id则指定一个唯一id
					startTimeId = startTimeEl.attr('id') || S.guid();
					endTimeId = endTimeEl.attr('id') || S.guid();
					startTimeEl.attr('id', startTimeId);
					endTimeEl.attr('id', endTimeId);
					jc = new S.LP.JoinCalendar([startTimeId, config.startConfig], [endTimeId, config.endConfig], {'validater': validater, 'rules': config.rules});
				}
				return jc;
			};
		}
	});


	/**
	* GroupBase 基类
	* @description 实例化一组表单项
	* @class GroupBase group组件基类
	* @param {Object} config 配置项
	* @param {Number} [config.nameNum] name序号 默认为 0
	* @param {Object} [config.validater] 表单校验对象 默认为null
	* @param {Object} [config.inputAction] 组内各个表单项的actionl列表 默认为 {}  每个需要绑定action的表单项以name为key，action有三种类型：rules(校验规则)、func(可执行的方法)、ev(需要绑定的事件)
	*/
	function GroupBase(config){
		var _self = this;
		config = S.merge(GroupBase.config, config);
		GroupBase.superclass.constructor.call(_self, config);
		_self.events = [
			/**  
			* 删除一个group之前触发该事件 返回false则不删除
			* @name GroupBase#deleting
			* @event 
			* @param {event} e  事件对象
			* @param {Object} e.nameNum 要删除的group的name序号
			*/
			'deleting',
			/**  
			* 删除一个group之后触发该事件
			* @name GroupBase#deleted
			* @event 
			* @param {event} e  事件对象
			* @param {Object} e.nameNum 要删除的group的name序号
			*/
			'deleted'
		];
		_self.__init();
	}
	GroupBase.config = {
		nameNum: 0,
		validater: null,
		inputAction: {}
	};
	S.extend(GroupBase, S.Base);
	S.augment(GroupBase, {
		/**
		* 重写 S.Base 的set 方法，默认设置时不触发事件
		* @protect
		*/
		set:function(key,value){
			GroupBase.superclass.set.call(this,key,value,{silent:1});
		},	
		/**
		* 获取group的Dom对象
		* @return {Object} group的Dom对象
		*/
		getGroupEl: function(){
			var _self = this;
			return _self.get('groupEl');
		},
		/**
		* 让所有表单项都执行某方法
		* @param {Functio} func 待执行的方法，参数为表单项的node对象
		*/
		getGroupDo: function(func){
			var _self = this,
				groupEl = _self.getGroupEl(),
				initList = ['input', 'select', 'textarea'];
			S.each(initList, function(list){
				S.each(S.all(list, groupEl), function(item){
					func.call(_self, S.one(item));
				});
			});		
		},
		/**
		* 销毁group对象
		*/
		destroy: function(){
			var _self = this,
				groupEl = _self.getGroupEl(),
				nameNum = _self.get('nameNum'),
				delGroup = _self.get('delGroup');
			if(_self.fire('deleting', {nameNum: nameNum}) === false){
				return;
			}
			// 销毁group内部各表单项之前绑定的action
			_self.getGroupDo(_self._destroyElAction);
			// 移除删除一组按钮上的事件
			delGroup.detach();
			// 整体移除dom
			groupEl.remove();
			_self.set('groupEl', null);
			// 触发事件
			_self.fire('deleted', {nameNum: nameNum});
			// 移除自身上的所有事件
			_self.detach();
		},
		// 对象初始化
		__init: function(){
			var _self = this;
			// 初始化新对象管理器，这个管理器用来管理由于表单项绑定action所生成的对象
			_self.set('newObj', {});
		},
		// 初始化事件
		_initEvent: function(){
			var _self = this,
				groupEl = _self.getGroupEl(),
				delGroup = S.one('.' + DEL_GROUP_CLS, groupEl);
			// 删除一项按钮事件
			delGroup.on('click', function(){
				_self.destroy();
			});
			_self.set('delGroup', delGroup);
		},
		// 初始化group, 给表单项绑定action
		_initGroup: function(){
			var _self = this;
			_self.getGroupDo(_self._initElAction);
		},
		// 根据inputAction，给表单项绑定action
		_initElAction: function(item){
			var _self = this,
				inputAction = _self.get('inputAction'),
				elName = item.attr('name'),
				elAction = inputAction[elName],
				elId;
			// 如果有该表单项有对应的inputAction，则绑定action
			if(elName && elAction && !S.isEmptyObject(elAction)){
				// 给表单项设置id
				elId = item.attr('id') || S.guid();
				item.attr('id', elId);
				// 绑定校验规则
				_self._bindRule(item, elAction.rules);
				// 绑定function
				_self._bindFunc(item, elAction.func);
				// 绑定事件
				_self._bindEv(item, elAction.events);			
			}
			// 设置表单项name
			_self._setName(item);
		},
		// 绑定校验规则
		_bindRule: function(item, rules){
			var _self = this,
				validater = _self.get('validater'),
				elId = item.attr('id');
			if(rules && validater){
				validater.add('#' + elId, rules);
			}
		},
		// 绑定function
		_bindFunc: function(item, func){
			var _self = this,
				newObj = _self.get('newObj'),
				elId = item.attr('id'),
				obj = null;
			if(!!func && S.isFunction(func)){
				obj = func.call(_self, item) || null;
				if(obj){
					// 把返回的新对象放到newObj中进行管理
					newObj[elId] = [].concat(obj);
				}
			}
		},
		// 绑定事件
		_bindEv: function(item, events){
			if(events && events.length > 0){
				S.each(events, function(evItem){
					item.on(evItem.type, evItem.callback);					
				});			
			}
		},
		// 销毁input上绑定的action
		_destroyElAction: function(item){
			var _self = this;
			_self._delRule(item);
			_self._delEv(item);		
			_self._delObj(item);
		},
		// 移除校验规则
		_delRule: function(item){
			var _self = this,
				validater = _self.get('validater'),
				elId = item.attr('id') || '';
			if(elId && validater){
				validater.fields.remove(elId);
			}
		},
		// 移除事件
		_delEv: function(item){
			item.detach();
		},
		// 销毁因绑定action所生成的对象
		_delObj: function(item){
			var _self = this,
				newObj = _self.get('newObj'),
				elId = item.attr('id');
			if(newObj[elId]){
				S.each(newObj[elId], function(obj){
					// 运行对象的destroy方法 销毁该对象
					if(S.isFunction(obj.destroy)){
						obj.destroy();
					}
					obj = null;
				});
				delete newObj[elId];
			}
		},
		// 根据name序号 给input重新设置name
		_setName: function(item){
			var _self = this,
				nameNum = _self.get('nameNum'),
				itemName = item.attr('name') || '',
				newName = _self._getNewName(itemName, nameNum);
			item.attr('name', newName);
		},
		// 多种方式生成新name
		_getNewName: function(oldName, nameNum){
			var newName = '',
				nameArr = oldName.split('.');
			if(nameArr.length === 4){
				// 'a.b.c.d' => 'a.b.c1.d'
				nameArr[2] += nameNum;
				newName = nameArr.join('.');
			}else{
				// 'a' => 'a1'
				newName = oldName + nameNum;
			}
			return newName;
		}
	});


	/**
	* GroupFormTemp 类
	* @description 从模板实例化一组表单项
	* @class GroupFormTemp GroupFormTemp组件类
	* @param {Object} config 配置项
	* @param {Number} config.tempId  必填 模板Id
	* @param {Object} config.addGroup 必填 添加一项按钮的对象
	* @param {Object} config.groupClass 必填 新组的class
	* @param {Object} config.delGroupStr 必填 删除按钮的dom字符串
	*/
	function GroupFormTemp(config){
		var _self = this;
		if(!config.tempId || !DOM.get('#' + config.tempId)){
			throw 'please assign the id of template Dom!';
		}
		config = S.merge(GroupFormTemp.config, config);
		GroupFormTemp.superclass.constructor.call(_self, config);
		_self.events = _self.events.concat([
			/**  
			* 把新组加到文档中后触发的事件
			* @name GroupFormTemp#added
			* @event 
			* @param {event} e  事件对象
			* @param {Object} e.group 新组对象
			* @param {Object} e.nameNum name序号
			*/
			'added'
		]);
		_self._init();
	}
	GroupFormTemp.config = {
		tempId: null,
		addGroup: null,
		groupClass: null,
		delGroupStr: null
	};
	S.extend(GroupFormTemp, GroupBase);
	S.augment(GroupFormTemp, {
		// 初始化对象
		_init: function(){
			var _self = this,
				tempId = _self.get('tempId'),
				groupEl = S.one(DOM.create(['<div>', CUT_LINE, S.get('#' + tempId).innerHTML, _self.get('delGroupStr'), '</div>'].join('')));
			groupEl.addClass(_self.get('groupClass'));
			_self.set('groupEl', groupEl);
			_self._appendToDoc();
			_self._initEvent();
			_self._initGroup();		
		},
		// 将新组加入到文档中
		_appendToDoc: function(){
			var _self = this,
				groupEl = _self.getGroupEl(),
				addGroup = _self.get('addGroup');
			// 加在增加一项按钮的上方
			groupEl.insertBefore(addGroup);		
			_self.fire('added', {group: _self, nameNum: _self.get('nameNum')});
			return _self;
		}
	});

	/**
	* GroupFormDom 类
	* @description 从DOM实例化一组表单项
	* @class GroupFormDom GroupFormDom组件类
	* @param {Object} config 配置项
	* @param {Number} config.domEl  必填 dom对象
	*/
	function GroupFormDom(config){
		var _self = this;
		if(!config.domEl){
			throw 'please assign the Dom!';
		}
		config = S.merge(GroupFormDom.config, config);
		GroupFormDom.superclass.constructor.call(_self, config);
		_self._init();
	}
	GroupFormDom.config = {
		domEl: null
	};
	S.extend(GroupFormDom, GroupBase);
	S.augment(GroupFormDom, {
		// 对象初始化
		_init: function(){
			var _self = this,
				domEl = _self.get('domEl'),
				groupEl = S.one(domEl);
			_self.set('groupEl', groupEl);
			_self._initEvent();
			_self._initGroup();
		}
	});

	S.namespace('LP');
	S.LP.More = More;

},{requires: ['lpmodule/css/module.css']});

/*
TODO
1、绑定事件
2、移除事件
3、输入框name编号
4、最多做少数目
5、灵活配置需要添加的内容
6、回显

*/
