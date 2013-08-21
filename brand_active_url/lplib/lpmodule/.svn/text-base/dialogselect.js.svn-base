/** 
* @fileOverview DialogSelect 弹出框选择组件
* @author  fuzheng
* @version 1.0
*/
KISSY.add(function(S){
    /**
        @exports S.LP as KISSY.LP
	*/
	var DOM = S.DOM,
		Event = S.Event;

	var HANDLE_HTML = '<input class="form-field-text" type="text" readonly="readonly"/>',
		TEMP_HTML = '<div class="ks-hidden"></div>',
		HANDLE_ID = 'handle',
		TEMP_ID = 'temp',
		SELECT_ID = 'select',
		DIALOG_WIDTH_FIX = 55,
		DIALOG_HEIGHT_FIX = 130,
		RESULT_JOIN = ', ';

	/**
	* DialogSelect 弹出框选择组件
	* @memberOf S.LP
	* @description 弹出框选择组件 基于Dialog和GroupSelect
	* @class DialogSelect 弹出框选择组件
	* @param {Object} config 配置项 
	*/
	function DialogSelect(config){
		var _self = this;
		config = S.merge(DialogSelect.config, config);
		if(!config.renderTo || !DOM.get('#' + config.renderTo)){
			throw 'please assign the id of render Dom!';
		}
		DialogSelect.superclass.constructor.call(_self, config);
		_self._init();
	}
	DialogSelect.config = 
	/** @lends  S.LP.DialogSelect.prototype */		
	{
		/**
		* 渲染组件的容器ID（必填）
		* @field
		* @type String
		*/
		renderTo: null,
		/**
		* groupSelectConfig.resultId 的简写形式，保存结果的容器ID （选填，不填则不记录结果）
		* @field
		* @type String
		*/
		resultId: null,
		/**
		* groupSelectConfig.gridColumns 的简写形式，表格列属性（必填）
		* @field
		* @type Array
		*/
		columns: [],
		/**
		* groupSelectConfig.gridWidth 的简写形式，表格宽度（选填）
		* @field
		* @type Number
		* @default  250
		*/
		width: 250,
		/**
		* groupSelectConfig.gridHeight 的简写形式，表格高度（选填）
		* @field
		* @type Number
		* @default  250
		*/
		height: 250,
		/**
		* groupSelectConfig.sourceData 的简写形式，源列表默认数据（选填，也可以用url的方式）
		* @field
		* @type Array
		*/
		data: [],
		/**
		* groupSelectConfig.checkable 的简写形式，表格是否行可多选（选填）
		* @field
		* @type Boolean
		* @default  true
		*/
		checkable: true,
		/**
		* groupSelectConfig.sourceData 的简写形式，数据去重、回显时的参照字段 （必填）
		* @field
		* @type String
		*/
		mainIndex: null,
		/**
		* 显示文本时的参照字段 （必填）
		* @field
		* @type String
		*/
		textIndex: null,
		/**
		* 弹出框标题 （选填）
		* @field
		* @type String
		* @default '请选择'
		*/
		title: '请选择',
		/**
		* GroupSelect配置项 （选填）
		* @field
		* @type Object
		*/
		groupSelectConfig: {}
	};
	S.extend(DialogSelect, S.Base);
	S.augment(DialogSelect, 
	/** @lends  S.LP.DialogSelect.prototype */		
	{
		/**
		* 显示选择框
		*/
		showSelect: function(){
			var _self = this;
			// 初始化dialog
			_self._initDialog();
			// 初始化groupSelect
			_self._initGroupSelect();
		},
		/**
		* 销毁组件
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
		// 初始化
		_init: function(){
			var _self = this,
				id = S.guid('J_LP_');
			// 各组件需要用到的随机id前缀
			_self.set('id', id);

			_self._initDom();
			_self._initEvent();
			// 回显数据
			_self._initSelectResult();

		},
		// 初始化dom
		_initDom: function(){
			var _self = this;
			// 显示框
			_self._initHandleDom();
			// 对话框模板
			_self._initTempDom();
		},
		// 初始化显示框
		_initHandleDom: function(){
			var _self = this,
				id = _self.get('id'),
				renderContainer = S.one('#' + _self.get('renderTo')),
				handleEl = new S.Node(HANDLE_HTML);
			handleEl.attr('id', id + HANDLE_ID);
			renderContainer.append(handleEl);

			_self.set('handleEl', handleEl);			
		},
		// 初始化对话框模板
		_initTempDom: function(){
			var _self = this,
				id = _self.get('id'),
				tempEl = new S.Node(TEMP_HTML);
			tempEl.attr('id', id + TEMP_ID);
			tempEl[0].innerHTML = '<div><div class="dialog-select" id="' + id + SELECT_ID + '"></div></div>';
			S.one(document.body).append(tempEl);
			_self.set('tempEl', tempEl);
		},
		// 初始化事件
		_initEvent: function(){
			var _self = this,
				handleEl = _self.get('handleEl');
			// 点击触发显示选择框
			handleEl.on('click', function(){
				_self.showSelect();
			});
			// 对话框确认，显示数据
			_self.on('dialogOk', function(){
				_self._setSelectResult();
				_self.get('selectDialog').close();
			});

		},
		// 初始化dialog
		_initDialog: function(){
			var _self = this,
				dialog = _self.get('selectDialog') || null,
				dialogConfig;

			if(dialog){
				dialog.show();	
				return;
			}

			dialogConfig = {
				title: _self.get('title'),
				width: _self.get('width') + DIALOG_WIDTH_FIX, 
				height: _self.get('height') + DIALOG_HEIGHT_FIX,
				mask:true,						
				scroll:true,  			
				collapsible:false,          		
				maximizable:false,          		
				resizable:false,            		
				drag:true,  
				buttonPosition:'center',
				contentID: _self.get('id') + TEMP_ID,
				buttonZone:true,
				isDestroy:false,
				buttons: [{
					text:'确定',
					eventType:'click',
					handler:function(){
						_self.fire('dialogOk');
					}
				},
				{
					text:'取消',
					eventType:'click',
					handler:function(){
						this.close();
					}
				}]
			};

			dialog = new S.LP.Dialog(dialogConfig);
			dialog.show();
			_self.set('selectDialog', dialog);
		},
		// 初始化groupSelect
		_initGroupSelect: function(){
			var _self = this,
				groupSelect = _self.get('groupSelect') || null;
			if(groupSelect){
				return;
			}

			var id = _self.get('id'),
				groupSelectConfig = _self.get('groupSelectConfig');

			groupSelectConfig = S.merge({
				'renderTo': id + SELECT_ID,
				'resultId': _self.get('resultId'),
				'gridColumns': _self.get('columns'),
				'gridWidth': _self.get('width'),
				'gridHeight': _self.get('height'),
				'sourceData': _self.get('data'),
				'isTarget': false,
				'checkable': _self.get('checkable'),
				'mainIndex': _self.get('mainIndex'),
				'isSearch': false,
				'sourceTip': ''
			}, groupSelectConfig);

			groupSelect = new S.LP.GroupSelect(groupSelectConfig);
			_self.set('groupSelect', groupSelect);
		},
		// 获取select的值 更新到显示框中
		_setSelectResult: function(){
			var _self = this,
				groupSelect = _self.get('groupSelect'),
				data = null;
			if(groupSelect){
				data = _self.get('groupSelect').getSourceSelectedData();
			}
			_self._updateSelectResult(data);
		},
		// 获取result的值 回显更新到显示框中
		_initSelectResult: function(){
			var _self = this,
				resultEl = S.one('#' + _self.get('resultId'));
				data = null;
			if(resultEl && !!resultEl.val()){
				data = S.JSON.parse(resultEl.val()).result || null;
			}
			_self._updateSelectResult(data);
		},
		// 更新显示框中的值
		_updateSelectResult: function(data){
			var _self = this,
				handleEl = _self.get('handleEl'),
				textIndex = _self.get('textIndex') || _self.get('mainIndex'),
				strList = [],
				str = '';
			if(data && data.length > 0){
				S.each(data, function(d){
					strList.push(d[textIndex]);
				});
				str = strList.join(RESULT_JOIN);
			}
			handleEl.val(str);
		}

	});

	S.namespace('LP');

	S.LP.DialogSelect = DialogSelect;

},{requires: ['1.0/dialog', 'lpmodule/groupselect-v2', 'lpmodule/css/module.css']});

/**
TODO
0、弹出框的temp自动生成 ok 
1、弹出框选择 单选或多选 支持搜索 ok 
2、支持回显 ok 
3、支持校验必填 ok 自己在输入框中写必填校验即可





*/