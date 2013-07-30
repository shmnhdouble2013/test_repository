/** 
* @fileOverview 品牌运营后台--创建晒图
* @extends  KISSY.Base
* @creator  黄甲(水木年华double)<huangjia2015@gmail.com>
* @depends  ks-core
* @version 1.0  
* @update 2013-07-16
* @example
*   new Bp_creat({
	});
*/	
KISSY.add('tm/tbs-back/blue_print/bp_creat', function(S, Editor, Validation, Calendar, O) {
	var DOM = S.DOM,
		Ajax = S.io,
		Event = S.Event,
		S_Date = S.Date;

	function Bp_creat(config){
		var _self = this;

		if( !(_self instanceof Bp_creat) ){
			return new Bp_creat(config);
		}

		Bp_creat.superclass.constructor.call(_self, config);

		_self._init();
	}

	S.extend(Bp_creat, S.Base);
	S.augment(Bp_creat, { 
		// 控件 初始化
		_init: function(){
			var _self = this;

			_self._uploadImg();
			_self._renderEditer();
			_self._timeRender();
			_self._eventRender();
			_self._validaRender();		
		},

		// 校验实例化
		_validaRender: function(){
			var _self = this;

			_self.form = S.get('#J_tablForm');

			Validation.Rule.add('startEndtime', '', function(value, text, config){
				var startValue = DOM.val(config.startInput),
					endValue = DOM.val(config.endInput);
				
				if(!startValue || !endValue){
					return '开始或结束时间不能为空！';
				}	

				if(startValue == endValue){
					return '开始时间和结束时间不能相同！';
				}
			});	

			// 校验实例 
			_self.validform = new Validation('#J_tablForm', {
		        style:'under'
		    });	

			// 校验开始结束时间
			Event.on('#ac_startTime', 'change blur', function(){
				_self.validform.get('ac_endTime') && _self.validform.get('ac_endTime').isValid();
			});	
		},

		// 事件初始化
		_eventRender: function(){
			var _self = this;

			// 确定创建晒图活动
			Event.on('#sureCreate', 'click', function(){
				_self._sureCreatActiv();
			});

			// 日期控件 不可编辑
			Event.add('#ac_startTime, #ac_endTime', 'keyup', function(ev){
				DOM.val(ev.target, '');
			});
		},

		// 日期vs时间控件 实例化
		_timeRender: function(){
			var _self = this;

			_self.renderCalendar('#ac_startTime');
			_self.renderCalendar('#ac_endTime');
		},

		// Editor 参数 初始化
		_editorPlugInit: function(){
			var _self = this;

	        _self.plugins = ("source-area" +
	            ",separator" +
	            ",bold" +
	            ",italic," +
	            "font-family," +
	            "font-size," +
	            "strike-through," +
	            "underline," +
	            "separator," +
	            "checkbox-source-area" +
	            ",image" +
	            ",link" +
	            ",fore-color" +
	            ",back-color" +
	            ",resize" +
	            ",draft" +
	            ",undo" +
	            ",indent" +
	            ",outdent" +
	            ",unordered-list" +
	            ",ordered-list" +
	            //",elementPath" +
	            ",page-break" +
	            ",preview" +
	            ",maximize" +
	            ",remove-format" +
	            ",heading" +
	            ",justify-left" +
	            ",justify-center" +
	            ",justify-right" +
	            ",table" +	                    	            
	            ",drag-upload").split(",");

			// ",video" +    ",xiami-music" +  ",smiley" +     ",flash" +	  ",multiple-upload" +  

	        _self.fullPlugins = [];

	        S.each(_self.plugins, function (p, i) {
	            _self.fullPlugins[i] = "editor/plugin/" + p + "/";
	        });	 

    	},
    	// editer 插件初始
    	_plugAugums: function(){
    		var _self = this;

    		_self.pluginConfig = {
	            "link": {
	                target: "_blank"
	            },
	            "image": {
	                defaultMargin: 0,
	                // remote:false,
	                upload: {
	                    serverUrl: _self.get('photoUrl') || '', // 图片上传
	                    serverParams: {
	                        waterMark: function () {
	                            return S.one("#ke_img_up_watermark_1")[0].checked;
	                        }
	                    },
	                    suffix: "png,jpg,jpeg,gif",
	                    fileInput: "Filedata",
	                    sizeLimit: 1000, //k
	                    extraHtml: "<p style='margin-top:10px;'><input type='checkbox' id='ke_img_up_watermark_1' checked='checked'> 图片加水印，防止别人盗用</p>"
	                }
	            },
	            "flash": {
	                "defaultWidth": "300",
	                "defaultHeight": "300"
	            },
	            "templates": [
	                {
	                    demo: "模板1效果演示html",
	                    html: "<div style='border:1px solid red'>模板1效果演示html</div><p></p>"
	                },
	                {
	                    demo: "模板2效果演示html",
	                    html: "<div style='border:1px solid red'>模板2效果演示html</div>"
	                }
	            ],
	            "multiple-upload": {
	                serverUrl: _self.get('photoMultipleUrl') || '',  // 图片批量上传url  该插件使用 flash 技术, 根域名下提供 crossdomain.xml 配置文本
	                serverParams: {	// 额外参数   http://docs.kissyui.com/docs/html/api/component/editor/plugin/multiple-upload.html
	                    waterMark: function () {
	                        return S.one("#ke_img_up_watermark_2")[0].checked;
	                    },
	                    cookie: function () { //解决非ie下不会携带cookie bug
					        return document.cookie;
					    }
	                },

	                "previewWidth": "80px",
	                sizeLimit: 1000, //k,, numberLimit:15,
	                extraHtml: "<p style='margin-top:10px;'>" +
	                    "<input type='checkbox' " +
	                    "style='vertical-align:middle;margin:0 5px;' " +
	                    "id='ke_img_up_watermark_2'>" +
	                    "<span style='vertical-align:middle;'>图片加水印，防止别人盗用</span></p>"
	            },
	            "video": {
	                urlCfg: [
	                    {
	                        reg: /tudou\.com/i,
	                        url: "http://bangpai.daily.taobao.net/json/getTudouVideo.htm",
	                        paramName: "url"
	                    }
	                ],
	                "urlTip": "请输入优酷网、土豆网、酷6网的视频播放页链接...",
	                "providers": [
	                    {
	                        // 允许白名单
	                        reg: /taohua\.com/i,
	                        //默认高宽
	                        width: 480,
	                        height: 400,
	                        detect: function (url) {
	                            return url;
	                        }
	                    },
	                    {
	                        reg: /youku\.com/i,
	                        width: 480,
	                        height: 400,
	                        detect: function (url) {
	                            var m = url.match(/id_([^.]+)\.html(\?[^?]+)?$/);
	                            if (m) {
	                                return "http://player.youku.com/player.php/sid/" + m[1] + "/v.swf";
	                            }
	                            m = url.match(/v_playlist\/([^.]+)\.html$/);
	                            if (m) {
	                                return;
	                                //return "http://player.youku.com/player.php/sid/" + m[1] + "/v.swf";
	                            }
	                            return url;
	                        }
	                    },
	                    {
	                        reg: /tudou\.com/i,
	                        width: 480,
	                        height: 400,
	                        detect: function (url) {
	                            return url;
	                        }
	                    },
	                    {
	                        reg: /ku6\.com/i,
	                        width: 480,
	                        height: 400,
	                        detect: function (url) {
	                            var m = url.match(/show[^\/]*\/([^\/]+)\.html(\?[^?]+)?$/);
	                            if (m) {
	                                return "http://player.ku6.com/refer/" + m[1] + "/v.swf";
	                            }
	                            return url;
	                        }
	                    }
	                ]
	            },
	            "draft": {
	                // 当前编辑器的历史是否要单独保存到一个键值而不是公用
	                // saveKey:"xxx",
	                interval: 5,
	                limit: 10,
	                "helpHtml": "<div " +
	                    "style='width:200px;'>" +
	                    "<div style='padding:5px;'>草稿箱能够自动保存您最新编辑的内容，" +
	                    "如果发现内容丢失，" +
	                    "请选择恢复编辑历史</div></div>"
	            },
	            "resize": {
	                //direction:["y"]
	            },

	            "drag-upload": { // 上传插件
	                suffix: "png,jpg,jpeg,gif",
	                fileInput: "Filedata",
	                sizeLimit: 1000, // kb
	                serverUrl: _self.get('photoUrl') || '',  // 拖拽 图片上传地址
	                serverParams: {
	                    waterMark: function () {
	                        return true;
	                    }
	                }
	            }
	        };
    	},
    	// editer 初始化对象
    	_renderEditer: function(){
    		var _self = this,
    			cfg = {
		            // 是否初始聚焦
		            focused: true,
		            attachForm: true,
		            // 自定义样式
		            // customStyle:"p{line-height: 1.4;margin: 1.12em 0;padding: 0;}",
		            // 自定义外部样式
		            // customLink:["http://localhost/customLink.css","http://xx.com/y2.css"],
		            // render:"#container",
		            srcNode: '#editorEl',
		            width: '70%',
		            height: "400px"
		        };

		    _self._editorPlugInit();
		    _self._plugAugums();    

		    KISSY.use(_self.fullPlugins, function (S) {
	            var args = S.makeArray(arguments);
	            args.shift();

	            S.each(args, function(arg, i){
	                var argStr = _self.plugins[i],
	                	cfg;

	                if (cfg = _self.pluginConfig[argStr]) {
	                   args[i] = new arg(cfg);
	                }
	            });

	            cfg.plugins =args;

	            _self.editor = new Editor(cfg).render();
	         });    
    	},

    	// 上传图片
    	_uploadImg: function(){
    		var _self = this;

    		S.use('gallery/uploader/1.4/index,gallery/uploader/1.4/themes/imageUploader/index,gallery/uploader/1.4/themes/imageUploader/style.css', function (S, Uploader, ImageUploader) {

    			//上传组件插件
		        var plugins = 'gallery/uploader/1.4/plugins/auth/auth,' +
		                'gallery/uploader/1.4/plugins/urlsInput/urlsInput,' +
		                'gallery/uploader/1.4/plugins/proBars/proBars,' +
		                'gallery/uploader/1.4/plugins/filedrop/filedrop,' +
		                'gallery/uploader/1.4/plugins/preview/preview,' +
		                'gallery/uploader/1.4/plugins/tagConfig/tagConfig';

		        S.use(plugins,function(S,Auth,UrlsInput,ProBars,Filedrop,Preview,TagConfig){
		            
		            var uploader = new Uploader('#J_UploaderBtn',{
		                //处理上传的服务器端脚本路径
		                action: _self.get('actWindUrl')
		            });

		            _self.set('uploaderObj', uploader);

		            //使用主题
		            uploader.theme(new ImageUploader({
		                queueTarget:'#J_UploaderQueue'
		            }));

		            //验证插件
		            uploader.plug(new Auth({
		                        //最多上传个数
		                        max:1,
		                        //图片最大允许大小
		                        maxSize:1000
		                    }))
		                //url保存插件
		                    .plug(new UrlsInput({target:'#J_Urls'}))
		                //进度条集合
		                    .plug(new ProBars())
		                //拖拽上传
		                    .plug(new Filedrop())
		                //图片预览
		                    .plug(new Preview())
		                    .plug(new TagConfig());

		            //渲染默认数据
           			uploader.restore();    

           			_self._uploaderEvent();		  
		        });				
    		});
    	},

    	// 上传事件
    	_uploaderEvent: function(){
         	var _self = this,
         		uploaderObj = _self.get('uploaderObj'),
         		Queue = uploaderObj.get('queue'),
         		authObj = _self.get('uploaderObj').getPlugin('auth'),
    			authPass = authObj.testRequired();

            // 在选择后 清空 队列中已经存在的 --- 只允许传递1张
            uploaderObj.on('select', function(ev){
               Queue.clear();
            });   

            // 上传 成功 or 失败 手动触发校验
            uploaderObj.on('error success',function(ev){
			    _self.validform.get('J_Urls') && _self.validform.get('J_Urls').isValid();
			});       
      },

    	// 确认创建活动
    	_sureCreatActiv: function(){
    		var _self = this;

    		_self.set('returnMsg', '很抱歉，晒图活动创建失败！');

			if(_self.validform.isValid()){
				S.all(".valid-text").hide();

				// 写入edter编辑器 数据
				// DOM.val('#activestr', _self.editor.get("data") );
				
				var ajaxConfig = {
                    'url': _self.get('ajaxSubUrl') || '',
                    'data': S.TL.serializeToObject(_self.form) || ''
	            };         
				_self._ajaxAllConfig(ajaxConfig , _self._onlyAjaxMsg);			
			}
    	},

    	// 日历控件  公用 初始化方法
    	renderCalendar: function(container, cfg){
    		var _self = this;

    		if(!container){
    			return;
    		}

    		var calenderCfg = S.merge({
					showTime:true,
					popup:true,
		            triggerType:['click'],
		            closable:true // 选择后 关闭日历窗口
				}, cfg),
				calendarStr = container+'_obj',
				calendarObj = _self.get(calendarStr) || null; 

			if(!calendarObj){
				_self.set(calendarStr, new Calendar(container, calenderCfg) );
			}

			_self.get(calendarStr).render();

			// 点击后 填写日期数据
        	_self.get(calendarStr).on('timeSelect', function(e){
	            DOM.val(container,  S_Date.format(e.date, 'yyyy-mm-dd HH:MM:ss') );
	            _self.validform && _self.validform.isValid(); // 这里方便验证
	        });

	        return _self.get(calendarStr);
    	},

        // 提示方法
		_alertFn: function(msg, callback){
			var _self = this;

			var d = new O.Alert(msg, callback);            
            d.show();
		},		

		// ajax 信息提示 作用 回调函数
		_onlyAjaxMsg: function(data){
			var _self = this;

			if(data.success){
				_self.form.submit();					
			}else{
				_self._alertFn( data.message || _self.get('returnMsg') || '操作失败！' );
				_self.set('returnMsg', '')
			}
		},

		// 公用的ajax方法 如果需要配置 dataType则 需要开发 配置项{'url':, 'data':, 'dataType': } --- fn 里再 根据 返回数据 调用 相应不同 回调函数
		_ajaxAllConfig: function(configObj, fn){ 
			var _self = this,
				ajaxConfig = {
				type:'post',
				charset : 'charset',
				dataType:'json',
				success: function(data){
					if( S.isFunction(fn) ){
						fn.call(_self, data);
					}
				},
				error: function(){ 
					_self._alertFn('请求异常！');
				}
			},
			endAjaxConfig = S.merge( ajaxConfig, configObj);

			Ajax(endAjaxConfig);
		}

	});

return Bp_creat;

}, {'requires':['editor', 'gallery/validation/1.0/', 'calendar', 'calendar/assets/dpl.css', 'mui/overlay','mui/overlay/overlay.css', 'TL']});