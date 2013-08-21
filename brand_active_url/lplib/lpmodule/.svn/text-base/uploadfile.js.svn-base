/** 
* @fileOverview UploadFile 文件异步上传业务组件，继承于Upload
* @author  fuzheng
* @version 1.0
*/
KISSY.add(function(S){
    /**
        @exports S.LP as KISSY.LP
	*/
	var DOM = S.DOM,
		Event = S.Event;

	/**
	* UploadFile 文件异步上传业务组件，继承于Upload
	* @memberOf S.LP
	* @description 文件异步上传业务组件，主要实现结果管理与渲染
	* @class UploadFile 文件异步上传业务组件，继承于Upload
	* @param {Object} config 配置项
	*/
	function UploadFile(config){
		var _self = this;
		config = S.merge(UploadFile.config, config);
		if(!config.renderTo || !DOM.get('#' + config.renderTo)){
			throw 'please assign the id of render Dom!';
		}
		UploadFile.superclass.constructor.call(_self, config);
		//支持的事件
		_self.events = [
			/**  
			* 增加一个文件时触发该事件
			* @name S.LP.UploadFile#addResult
			* @event  
			* @param {event} e  事件对象
			* @param {Object} e.add 增加的项 
			* @param {Array} e.result 结果集
			*/
			'addResult',
			/**  
			* 删除一个文件时触发该事件
			* @name S.LP.UploadFile#delResult
			* @event  
			* @param {event} e  事件对象
			* @param {Object} e.del 删除的项 
			* @param {Array} e.result 结果集
			*/
			'delResult',
			/**  
			* 结果集更新时触发该事件
			* @name S.LP.UploadFile#updateResult
			* @event  
			* @param {event} e  事件对象
			* @param {Array} e.result 结果集
			*/
			'updateResult',
			/**  
			* 结果容器更新时触发该事件
			* @name S.LP.UploadFile#updateResultCon
			* @event  
			* @param {event} e  事件对象
			* @param {Array} e.value 更新的结果集字符串
			*/
			'updateResultCon'
		];
		_self._init();
	}
	UploadFile.config = 
	/** @lends  S.LP.UploadFile.prototype */		
	{
		/**
		* 上传控件渲染容器ID（必填）
		* @field
		* @type String
		*/
		renderTo: null,
		/**
		* 文件接受的url（必填）
		* @field
		* @type String
		*/
		url: null,
		/**
		* 上传控件可以接收的文件类型, （选填，不填则为任意文件）
		* @field
		* @type Array
		* @default  []
		*/
		extendName: [],
		/**
		* 保存结果的容器ID （选填，不填不保存结果）
		* @field
		* @type String
		*/
		resultId: null,
		/**
		* 可上传文件数目的最大限制 （选填，不填则不做限制）
		* @field
		* @type Number
		*/
		max: null,
		/**
		* 是否启用图片预览 （选填，默认为false）
		* @field
		* @type Boolean
		* @default  false
		*/
		isImage: false
	};
	S.extend(UploadFile, S.Base);
	S.augment(UploadFile, 
	/** @lends  S.LP.UploadFile.prototype */		
	{
		/**
		* 增加文件至结果集 会触发 delResult、addResult、updateResult事件
		* @param {String} name 文件名
		* @param {String} path 文件路径
		* @return {Array} 结果集
		*/
		addResult: function(name, path){
			var _self = this,
				result = _self.getResult(),
				max = _self.get('max'),
				isNew = _self._isNewResult(name),
				pop,
				newResult = {
					name: name,
					path: path
				};

			if(isNew === true){
				if(max && max < result.length + 1){
					pop = result.pop();
					_self.fire('delResult', {del: pop, result: result});
				}
				result.push(newResult);			
				_self.fire('addResult', {add: newResult, result: result});
			}else{
				result[isNew].path = path;
			}	
			_self.fire('updateResult', {result: result});
			return result;
		},
		/**
		* 从结果集删除文件 会触发 delResult、updateResult事件
		* @param {String} name 文件名
		* @return {Object} 删除的文件
		*/
		delResult: function(name){
			var _self = this,
				result = _self.getResult(),
				index = null,
				del = null;
			S.each(result, function(r, i){
				if(r.name === name){
					index = i;
					return false;
				}
			});
			if(index !== null){
				del = result.splice(index, 1);
				_self.fire('delResult', {del: del[0], result: result});
			}
			_self.fire('updateResult', {result: result});
			return del;
		},
		/**
		* 初始化已上传文件的文件名渲染
		* @param {Array} result 结果集
		*/
		initShow: function(result){
			var _self = this;
			_self.set('result', result);
			S.each(result, function(r){
				_self._addShow(r.name, r.path);
			});
		},
		/**
		* 获取文件上传对象 upload
		* @return {Object} 文件上传对象
		*/
		getUpload: function(){
			return this.get('upload');
		},
		/**
		* 获取结果集
		* @return {Array} 结果集
		*/
		getResult: function(){
			return this.get('result');
		},
		/**
		* 从结果集获取文件路径列表
		* @return {Array} 文件路径列表
		*/
		getPathListFromResult: function(){
			var _self = this,
				result = _self.getResult(),
				pathList = [];
			S.each(result, function(r){
				pathList.push(r.path);			
			});
			return pathList;		
		},
		
		// 初始化
		_init: function(){
			var _self = this,
				resultId = _self.get('resultId'),
				resultCon = resultId ? S.one('#' + resultId) : null;

			_self._initUpload();
			_self._initDom();
			_self._initEvent();

			_self.set('result', []);

			if(resultCon){
				_self.set('resultCon', resultCon);
				// 已上传文件的回显
				if(!!resultCon.val()){
					var result = S.JSON.parse(resultCon.val());
					if(S.isPlainObject(result)){
						_self.initShow(result.result);
					}
				}
			}			
		},
		// 初始化上传组件
		_initUpload: function(){
			var _self = this,
				upload = new S.LP.Upload({
					renderTo: '#' + _self.get('renderTo'),
					extendName: _self.get('extendName'),
					url: _self.get('url')
				});
			_self.set('upload', upload);
		},
		// 初始化事件
		_initEvent: function(){
			var _self = this,
				upload = _self.getUpload();
			// 上传结束的回调
			upload.on('uploadCompeleted', function(e){
				_self._uploadCallback(S.JSON.parse(e.msg));
			});
			// 增加结果集
			_self.on('addResult', function(e){
				_self._addShow(e.add.name, e.add.path);
			});
			// 减少结果集
			_self.on('delResult', function(e){
				_self._delShow(e.del.name);
			});
			// 更新结果
			_self.on('updateResult', function(){
				_self._updateResult();
			});
		},
		// 上传结束的回调
		_uploadCallback: function(data){
			var _self = this;
			if(data){
				if(data.success){
					_self.addResult(data.fileName, data.filePath);
				}else{
					new S.LP.Message.Base({
						title:'上传错误',
						message: data.message || '操作失败，请重新再试！',
						icons:'error',
						button:[{text:'确定'}]
					});
				}
			}
		},
		// 判断结果是否是新的 是新的返回true  不是新的 返回在数组中的索引值
		_isNewResult: function(name){
			var _self = this,
				result = _self.getResult(),
				isNew = true;
			S.each(result, function(r, i){
				if(r.name === name){
					isNew = i;
					return false;
				}
			});
			return isNew;
		},
		// 初始化文件名渲染的dom
		_initDom: function(){
			var _self = this,
				showAreaStr = '<span class="fileshow-area"></span>',
				showArea = DOM.create(showAreaStr);

			DOM.insertAfter(showArea, '#' + _self.get('renderTo'));

			_self.set('showArea', S.one(showArea));
			_self.set('showManage', {});
		},
		// 增加文件名渲染
		_addShow: function(name, path){
			var _self = this,
				showArea = _self.get('showArea'),
				showInfo = _self.get('isImage') ? '<img src="' + path + '" title="' + name + '"/>' : name,
				showStr = ['<span class="fileshow" data-name="', name, '" data-path="', path, '">', showInfo, '<s>X</s></span>'].join(''),
				showEl = new S.Node(showStr),
				delBtn = S.one('s', showEl),
				showManage = _self.get('showManage');
			
			showArea.append(showEl);

			delBtn.on('click', function(){
				var n = S.one(this).parent('span').attr('data-name');
				_self.delResult(n);
			});

			showManage[name] = {
				path: path,
				showEl: showEl,
				delBtn: delBtn
			};
		},
		// 删除文件名渲染
		_delShow: function(name){
			var _self = this,
				showManage = _self.get('showManage');

			showManage[name].delBtn.detach();
			showManage[name].showEl.remove();

			delete showManage[name];
		},
		// 更新结果
		_updateResult: function(){
			var _self = this,
				resultCon = _self.get('resultCon') || null,
				result = _self.getResult();
			if(resultCon){
				if(result.length === 0){
					resultCon.val('');
				}else{
					resultCon.val(S.JSON.stringify({result: result}));
				}
				_self.fire('updateResultCon', {value: resultCon.val()});
			}
			//S.log(resultCon.val());
		}

	});

	S.namespace('LP');
	S.LP.UploadFile = UploadFile;

},{requires: ['lpmodule/upload', '1.0/message', 'lpmodule/css/module.css']});

/**
TODO

*/