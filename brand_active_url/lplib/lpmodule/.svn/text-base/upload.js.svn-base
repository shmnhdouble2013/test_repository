/**
 * @fileoverview 文件上传组件
 * @author 孙炯军(jiongjun.sunjj@alibaba-inc.com)
 * @version 1.0
 **/
 
KISSY.add(function(S) {
	var DOM = S.DOM,
		E = S.Event,
		ATTR_ADD_WIDTH=10; //额外宽度，用于补宽度；
	/** 
  		@exports S.LP as KISSY.LP
  	*/
	
	/**  
	* 点击上传按钮前促发的事件
	*  @name S.LP.Upload#beforeUpload  
	*  @event  
	*  @example  uf(upload 对象).on('beforeUpload',{}<br>
	* { alert('BeforeUpload')}) ;//上传前的准备事件
	*/
	
	/**  
	* 文件上传完促发的事件
	*  @name S.LP.Upload#uploadCompeleted  
	*  @event  
	*  @param {String}  text  选中的菜单项的文本值
	*  @param {String} id  选中的菜单项的ID
	*  @param {String} href   选中的菜单项的地址
	*  @example  uf(upload 对象).on('uploadCompeleted',{info}<br>
	*  { alert(info.msg)}) ;//可以操作返回的Info.msg 进行 上传完的操作
	*/
	var  upload = function(config) {
		var defaultConfig = {
			mode: 'single', // multiple
			uploadType:'asyn', //normal
			extendName: [],
			//可上传的文件后缀
			params: {},
			url: '',
			selectBtnText:'浏览',
			uploadBtnText:'开始上传',
			renderTo: 'body' 
		};
		var _self = this;
		var _config = S.merge(defaultConfig, config); //合并配置方案
		upload.superclass.constructor.call(_self, _config);
		S.mix(_self, _config); //复制到自身上
		_self._init();
	};
	S.extend(upload, S.Base); //继承S.Base属性，可以直接get等操作
	S.augment(upload,
	/** @lends S.LP.Upload.prototype */	
	{ //扩展属性
		msg: 'Loading...',
		NOT_FOUND_NODE: '对不起,绑定时，找不到绑定节点.',
		NOT_VALID_EXTENDNAME: '对不起，文件后缀名不符合规则！',
		//转成html代码
		_html: function() 
		{
			var _self = this;
			var appendNode = S.one(_self.renderTo);
			_self.set('container', appendNode);
			if (appendNode === null) {
				_self.exception(_self.NOT_FOUND_NODE);
				return;
			}
			var id = S.guid(),
					url_params = '?',
					jsonParams='{',
					tempHtml='';
				_self.set('_id_guid', id);
			for (var attr in _self.params){
					url_params += '&' + attr + '=' + _self.params[attr];
					jsonParams+='\''+attr+'\':'+'\''+ _self.params[attr]+'\',';
			}
			jsonParams=jsonParams.substring(0,jsonParams.length-1);
			jsonParams+='}';
			/*  init  html here */
			if(_self.uploadType ==='normal'){
					tempHtml+='<span class="file-field-container"><input id="lp_file_' + id + '" class="fileInput" type="file" style="width:240px;height: 20px; display: block;" hidefocus="true" name="file" size="28"/>';
					tempHtml+='<input id="lp_filename_' + id + '" class="textInput" type="text" /> 	<a class="btn-small-container hmargin" href="javascript:void(0);"  id="browserBtn_' + id + '"><button  type="button" class="form-field-button btn-small">浏览</button></a></span>';
			}
			else{
				if (_self.mode === 'single') { //单文件上传
					tempHtml = '<form data-break="false" action="' + _self.url + url_params + '" target="iframe_upload_' + id + '" method="post" enctype="multipart/form-data" id="hid_form_'+id+'">';
					tempHtml+='<span class="file-field-container"><input id="lp_file_' + id + '" class="fileInput" type="file" style="width:240px;height: 20px; display: block;" hidefocus="true" name="file" size="28"/>';
					tempHtml+='<input id="lp_filename_' + id + '" class="textInput" type="text" /> 	<a class="btn-small-container hmargin" href="javascript:void(0);"  id="browserBtn_' + id + '"><button  type="button" class="form-field-button btn-small">浏览</button></a>';
					tempHtml+='<a class="btn-small-container hmargin" href="javascript:void(0);"  id="submit_upload_'+id+'" style="display:none;"><button  type="submit" class="form-field-button btn-small">上传</button></a><input type="hidden" name="J_hid_upload" value="'+jsonParams+'" id="J_hid_upload"/></span></form><iframe name="iframe_upload_' + id + '" id="J_iframe_upload_' + id + '" style="display:none;" ></iframe>';
				} else {  //多文件上传 ( remark)	
						tempHtml+='<iframe name="iframe_upload_' + id + '" id="J_iframe_upload_' + id + '" style="display:none;" ></iframe>';
						tempHtml += '<form  data-break="false" action="' + _self.url + url_params + '" target="iframe_upload_' + id + '" method="post" enctype="multipart/form-data" id="hid_form_'+id+'">';
						tempHtml+='<div class="uploadArea" id="uploadArea-'+id+'"><span class="file-field-container"><input id="lp_file_' + id + '" class="fileInput" type="file" style="width: 100px; height: 22px; display: block;" hidefocus="true" name="file" size="3" />';
						tempHtml+='<a class="btn-small-container " href="javascript:void(0);"  id="browserBtn_' + id + '"><button  type="button" class="form-field-button btn-small">添加上传文件</button></a><a class="btn-small-container " href="javascript:void(0);"  id="submit_upload_'+id+'" style="display:none;"><button  type="submit" class="form-field-button btn-small">上传</button></a>';
						tempHtml+='<input type="hidden" name="J_hid_upload" value="'+jsonParams+'" id="J_hid_upload"//></span></div><div class="uploadteam" id="uploadteam-'+id+'"><p id="file-team-'+id+'"><label id="file-label-'+id+'" class="file-label"></label></p></div></form>';
				}
			
			}
			_self.set('pubid',id);
			S.one(DOM.create(tempHtml)).appendTo(appendNode);
		},
		/**
		*  中断上传，JS控制是否可以点击上传按钮
		*/
		breakUpload:function(){  //中断上传
			var _self = this,
				  pubid=_self.get('pubid');
			DOM.attr('#hid_form_'+pubid,'data-break','true');
		},
		/**
		*  清楚上传文件
		*/
		clearFiles:function(){
			var	_self = this,
					pubid=_self.get('pubid');
			if(_self.mode === 'single'){
					S.get('#hid_form_' + pubid).reset();
					DOM.attr('#lp_filename_' + pubid, 'value', ''); //清空textbox
			}
			else{
				var	files = DOM.query('.fileInput','#uploadArea-'+pubid),
						fileLabels = DOM.query('p','#uploadteam-'+pubid);
				S.each(files,function(item,index){
					if(index >0){
						DOM.remove(item);
					}
				});
				S.each(fileLabels,function(item,index){
					if(index >0){
						DOM.remove(item);
					}
				});
			}
			DOM.css('#submit_upload_' + pubid, {display:'none'});

		},
		/**
		*  获取待上传文件的数量
		*/
		getUploadFileCount:function(){
			var	_self = this,
					pubid=_self.get('pubid'),
					files=DOM.query('.fileInput','#uploadArea-'+pubid);
			if (_self.mode === 'single') { //单文件上传
				if(files[0].value!==''){
					return 1;
				}
				else{
					return 0;
				}
			}
			else{
				return  files.length-1;
			}	
		},
		 // 上传前 的准备
		_beforeUpload: function()
		{
			var _self = this;
			_self.fire('beforeUpload'); //调用外部上传前事件
		},
		//点击上传 操作
		_upload: function() { 
			var _self = this;
			if (_self.mode === 'single') { //单文件上传
				_self._singleUpload();
				E.on('#submit_upload_' + _self.get('_id_guid'), 'click',
				function() {
					DOM.attr('#hid_form_'+pubid,'data-break','false');
					 _self._beforeUpload();
					 var   pubid=_self.get('pubid');
					 if(DOM.attr('#hid_form_'+pubid,'data-break') === 'true'){
						return false;
					 }
					if (DOM.attr('#lp_file_' + _self.get('_id_guid'), 'value') === ''){  //如果 有文件
						return false;
					}
					else{
						_self._finishUpload();
					}
				});
			}
			else{
				_self._multipleUpload();
				var  pubid=_self.get('pubid');
				E.on('#submit_upload_'+pubid, 'click',function() {
					DOM.attr('#hid_form_'+pubid,'data-break','false');
					 _self._beforeUpload();
					 if(DOM.attr('#hid_form_'+pubid,'data-break') === 'true'){
						return false;
					 }
					var  files=DOM.query('.fileInput','#uploadArea-'+pubid);
					var  teamfont=DOM.query('p','#uploadteam-'+pubid);
					DOM.remove(files[0]);
					DOM.remove(teamfont[0]);
					_self._finishUpload();
				});
			}
		},
		_normalUpload:function(){ //普通上传使用方法
			var _self =this ;
			E.on('#lp_file_' + _self.get('_id_guid'), 'change',function() { // 进行 文件名检测等操作
				var	tag =_self._checkfile(this);
				if(tag){
					var fileName = this.value.split('\\'),
							id =_self.get('_id_guid');
					DOM.attr('#lp_filename_' +id, 'value', fileName[fileName.length - 1]);
				}
				else{
					S.LP.Message.Alert('error', '对不起，你只能上传' + _self.extendName + ' 为后缀的文件') ;
					DOM.attr('#lp_filename_' + _self.get('_id_guid'), 'value', ''); //清空textbox
					_self.exception(_self.NOT_VALID_EXTENDNAME);
				}
			});
		},
		_singleUpload:function(){
			var _self = this;
			E.on('#lp_file_' + _self.get('_id_guid'), 'change',function() { // 进行 文件名检测等操作
				var	tag =_self._checkfile(this);
				if(tag){
					var fileName = this.value.split('\\'),
							id =_self.get('_id_guid');
					DOM.attr('#lp_filename_' +id, 'value', fileName[fileName.length - 1]);
					DOM.css('#submit_upload_'+id, {display:'inline-block'});
				}
				else{
					S.LP.Message.Alert('error', '对不起，你只能上传' + _self.extendName + ' 为后缀的文件') ;
					DOM.attr('#lp_filename_' + _self.get('_id_guid'), 'value', ''); //清空textbox
					_self.exception(_self.NOT_VALID_EXTENDNAME);
					DOM.css('#submit_upload_'+id, {display:'none'});
				}
			});
		},
		_multipleUpload:function(){
			var  _self = this;
			E.on('#lp_file_' + _self.get('_id_guid'),'change',function(){
				_self._multipleFileChange(this);
			});
		},
		_addUploadFile:function(){  // 添加 上传文件
			var	_self = this ,
					id=S.guid(),
					pubid=_self.get('pubid'),
					span = DOM.children('#uploadArea-'+pubid)[0],
					uploadteam =S.get('#uploadteam-'+pubid);
			if(_self.mode==='multiple'){
				var  item=DOM.create('<input id="lp_file_'+id+'" class="fileInput" type="file" style="width: 100px; height: 22px; display: block;" hidefocus="true" name="file" size="3" />');
				DOM.prepend(item,span);
				var  guid=_self.get('_id_guid'),
						p=DOM.create('<p id="file-team-'+id+'"><label id="file-label-'+id+'" class="file-label"></label></p>');
				DOM.prepend(p,uploadteam);
				_self.set('_id_guid',id);
				E.on('#lp_file_' +id,'change',function(){
					_self._multipleFileChange(this);
				});
			}
		},
		_multipleFileChange:function(obj){  //文件上传事件
			var	_self = this ;
			var	tag =_self._checkfile(obj);
			if(tag){
				var 	fileName = obj.value.split('\\'),
						id = _self.get('_id_guid');
				var  pubid=_self.get('pubid');
				DOM.html('#file-label-'+id ,fileName[fileName.length - 1]+'<a class="file-cancel-upload" id="file-cancel-upload-'+id+'" href="javascript:void(0)"></a>');
				DOM.css(obj,{display:"none"});
				E.on('#file-cancel-upload-'+id,'click',function(){
					DOM.remove('#lp_file_'+id);
					DOM.remove('#file-team-'+id);
					var  p=DOM.query('.file-label','#uploadteam-'+pubid);
					if(p.length<2){
						DOM.css('#submit_upload_'+pubid, {display:'none'});
					}
				});
				if(_self.get('max')){
					var  tempnum = _self.get('max') ;
					if(/^[1-9]\d*$/.test(tempnum)){
						var  p=DOM.query('.file-label','#uploadteam-'+pubid);
						if( p.length>tempnum){
							_self._removefile(obj);
							S.LP.Message.Alert('error', '对不起，您一次只能上传'+tempnum+'个文件') ;
						}
						else{
								_self._addUploadFile();
						}
					}
				}
				DOM.css('#submit_upload_'+pubid, {display:'inline-block'});
			}
			else{
				S.LP.Message.Alert('error', '对不起，你只能上传' + _self.extendName + ' 为后缀的文件') ;
			}
		},
		_checkfile:function(obj){
			var  _self = this;
			if( ! RegExp('\.(' + _self.extendName.join('|') + ')$', 'i').test(obj.value) ){
				if(_self.uploadType !== 'normal'){
					_self._removefile(obj);
				}
				return false;
			}
			else{
				return true;
			}
		},
		_checkIsHasFile:function(obj){   //重复性先不做验证
		},
		_removefile:function(obj){
			var  _self = this;
			if(_self.mode === 'multiple'){
				var  id= obj.id,
						guid=id.split('_')[2];
				_self._addUploadFile();
				DOM.remove('#lp_file_'+guid);
				DOM.remove('#file-team-'+guid);
			}
			else{
				DOM.css('#submit_upload_' + _self.get('pubid'), {display:'none'});
			}
		},
		//上传完 的相关操作
		_finishUpload: function() 
		{
			var _self = this,
					id=_self.get('pubid');
			E.on('#J_iframe_upload_' +id , 'load',function() {
				DOM.css('#submit_upload_' + id, {display:'none'});
				S.get('#hid_form_' + id).reset();
				if(_self.mode=== 'single'){
					DOM.attr('#lp_filename_' + id, 'value', ''); //清空textbox
				}
				else{
					var  uploadfile = DOM.query('.fileInput','#uploadArea-'+id);
					S.each(uploadfile,function(item,index){
						DOM.remove(item);
					});
					var  p= DOM.query('p','#uploadteam-'+id);
					S.each(p,function(item,index){
							DOM.remove(item);
					});
					_self._addUploadFile();
				}
				var doc = this.contentWindow.document,
				body = doc.body || doc.documentElement;
				var innerMsg = body.innerHTML;
				if (innerMsg.length !== 0){
				_self.fire('uploadCompeleted', {msg:DOM.text(body)}); //调用外部完成事件
				}
			E.detach('#J_iframe_upload_' +id , 'load');
			});
		},
		_init: function() {
			var _self = this;
			_self._html();
			if(_self.uploadType ==='normal'){
				_self._normalUpload();  // 平常上传，只使用检验文件名
			}
			else{
				_self._upload();
			}
		},
		/**
		*  设置上传参数，用于动态改变上传
		*/
		setParams:function(params){
				var _self=this,
					url_params = '?',
					jsonParams='{';
				for (var attr in params) {
					url_params += '&' + attr + '=' + params[attr];
					jsonParams+='\''+attr+'\':'+'\''+ params[attr]+'\',';
				}
				jsonParams=jsonParams.substring(0,jsonParams.length-1);
				jsonParams+='}';
				DOM.attr('#hid_form_'+ _self.get('_id_guid'),'action', _self.url + url_params );
				DOM.attr('#J_hid_upload','value',jsonParams);	
		},
		/**
		*  异常信息log
		*/
		exception: function(msg) {
			S.log(msg); //出错显示
		}

	});
	S.namespace('LP');

	/**
	* 文件上传，edit by sunjiongjun
	* @class 上传控件
	* @constructor
	* @param {Object} config 配置信息<br>
	* 1)  {Array} extendName:允许上传的extendName<br>
	* 2) {String} url : 上传地址<br>
	*3）{Object} params: 上传的参数<br>
	*4）{String} renderTo: 渲染到那个DOM节点<br>
	*5）{String} mode: 是否是多文件上传，单个single/multiple<br>
	*6）{String} uploadType: 是否是异步上传，异步asyn/normal<br>
	* @example  var uf=new S.LP.upload({extendName:['exe'],url:'default.aspx',params:{id:1},renderTo:'#J_uploadArea'});
	*/
	S.LP.Upload = upload;
},
{
	requires: ['core','1.0/message','lpmodule/css/upload.css']
});