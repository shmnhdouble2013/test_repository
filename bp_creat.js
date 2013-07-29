/** 
* @fileOverview Ʒ����Ӫ��̨--����ɹͼ
* @extends  KISSY.Base
* @creator  �Ƽ�(ˮľ�껪double)<huangjia2015@gmail.com>
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
		// �ؼ� ��ʼ��
		_init: function(){
			var _self = this;

			_self._uploadImg();
			_self._renderEditer();
			_self._timeRender();
			_self._eventRender();
			_self._validaRender();		
		},

		// У��ʵ����
		_validaRender: function(){
			var _self = this;

			_self.form = S.get('#J_tablForm');

			Validation.Rule.add('startEndtime', '', function(value, text, config){
				var startValue = DOM.val(config.startInput),
					endValue = DOM.val(config.endInput);
				
				if(!startValue || !endValue){
					return '��ʼ�����ʱ�䲻��Ϊ�գ�';
				}	

				if(startValue == endValue){
					return '��ʼʱ��ͽ���ʱ�䲻����ͬ��';
				}
			});	

			// У��ʵ�� 
			_self.validform = new Validation('#J_tablForm', {
		        style:'under'
		    });	

			// У�鿪ʼ����ʱ��
			Event.on('#ac_startTime', 'change blur', function(){
				_self.validform.get('ac_endTime') && _self.validform.get('ac_endTime').isValid();
			});	
		},

		// �¼���ʼ��
		_eventRender: function(){
			var _self = this;

			// ȷ������ɹͼ�
			Event.on('#sureCreate', 'click', function(){
				_self._sureCreatActiv();
			});

			// ���ڿؼ� ���ɱ༭
			Event.add('#ac_startTime, #ac_endTime', 'keyup', function(ev){
				DOM.val(ev.target, '');
			});
		},

		// ����vsʱ��ؼ� ʵ����
		_timeRender: function(){
			var _self = this;

			_self.renderCalendar('#ac_startTime');
			_self.renderCalendar('#ac_endTime');
		},

		// Editor ���� ��ʼ��
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
    	// editer �����ʼ
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
	                    serverUrl: _self.get('photoUrl') || '', // ͼƬ�ϴ�
	                    serverParams: {
	                        waterMark: function () {
	                            return S.one("#ke_img_up_watermark_1")[0].checked;
	                        }
	                    },
	                    suffix: "png,jpg,jpeg,gif",
	                    fileInput: "Filedata",
	                    sizeLimit: 1000, //k
	                    extraHtml: "<p style='margin-top:10px;'><input type='checkbox' id='ke_img_up_watermark_1' checked='checked'> ͼƬ��ˮӡ����ֹ���˵���</p>"
	                }
	            },
	            "flash": {
	                "defaultWidth": "300",
	                "defaultHeight": "300"
	            },
	            "templates": [
	                {
	                    demo: "ģ��1Ч����ʾhtml",
	                    html: "<div style='border:1px solid red'>ģ��1Ч����ʾhtml</div><p></p>"
	                },
	                {
	                    demo: "ģ��2Ч����ʾhtml",
	                    html: "<div style='border:1px solid red'>ģ��2Ч����ʾhtml</div>"
	                }
	            ],
	            "multiple-upload": {
	                serverUrl: _self.get('photoMultipleUrl') || '',  // ͼƬ�����ϴ�url  �ò��ʹ�� flash ����, ���������ṩ crossdomain.xml �����ı�
	                serverParams: {	// �������   http://docs.kissyui.com/docs/html/api/component/editor/plugin/multiple-upload.html
	                    waterMark: function () {
	                        return S.one("#ke_img_up_watermark_2")[0].checked;
	                    },
	                    cookie: function () { //�����ie�²���Я��cookie bug
					        return document.cookie;
					    }
	                },

	                "previewWidth": "80px",
	                sizeLimit: 1000, //k,, numberLimit:15,
	                extraHtml: "<p style='margin-top:10px;'>" +
	                    "<input type='checkbox' " +
	                    "style='vertical-align:middle;margin:0 5px;' " +
	                    "id='ke_img_up_watermark_2'>" +
	                    "<span style='vertical-align:middle;'>ͼƬ��ˮӡ����ֹ���˵���</span></p>"
	            },
	            "video": {
	                urlCfg: [
	                    {
	                        reg: /tudou\.com/i,
	                        url: "http://bangpai.daily.taobao.net/json/getTudouVideo.htm",
	                        paramName: "url"
	                    }
	                ],
	                "urlTip": "�������ſ���������������6������Ƶ����ҳ����...",
	                "providers": [
	                    {
	                        // ���������
	                        reg: /taohua\.com/i,
	                        //Ĭ�ϸ߿�
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
	                // ��ǰ�༭������ʷ�Ƿ�Ҫ�������浽һ����ֵ�����ǹ���
	                // saveKey:"xxx",
	                interval: 5,
	                limit: 10,
	                "helpHtml": "<div " +
	                    "style='width:200px;'>" +
	                    "<div style='padding:5px;'>�ݸ����ܹ��Զ����������±༭�����ݣ�" +
	                    "����������ݶ�ʧ��" +
	                    "��ѡ��ָ��༭��ʷ</div></div>"
	            },
	            "resize": {
	                //direction:["y"]
	            },

	            "drag-upload": { // �ϴ����
	                suffix: "png,jpg,jpeg,gif",
	                fileInput: "Filedata",
	                sizeLimit: 1000, // kb
	                serverUrl: _self.get('photoUrl') || '',  // ��ק ͼƬ�ϴ���ַ
	                serverParams: {
	                    waterMark: function () {
	                        return true;
	                    }
	                }
	            }
	        };
    	},
    	// editer ��ʼ������
    	_renderEditer: function(){
    		var _self = this,
    			cfg = {
		            // �Ƿ��ʼ�۽�
		            focused: true,
		            attachForm: true,
		            // �Զ�����ʽ
		            // customStyle:"p{line-height: 1.4;margin: 1.12em 0;padding: 0;}",
		            // �Զ����ⲿ��ʽ
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

    	// �ϴ�ͼƬ
    	_uploadImg: function(){
    		var _self = this;

    		S.use('gallery/uploader/1.4/index,gallery/uploader/1.4/themes/imageUploader/index,gallery/uploader/1.4/themes/imageUploader/style.css', function (S, Uploader, ImageUploader) {

    			//�ϴ�������
		        var plugins = 'gallery/uploader/1.4/plugins/auth/auth,' +
		                'gallery/uploader/1.4/plugins/urlsInput/urlsInput,' +
		                'gallery/uploader/1.4/plugins/proBars/proBars,' +
		                'gallery/uploader/1.4/plugins/filedrop/filedrop,' +
		                'gallery/uploader/1.4/plugins/preview/preview,' +
		                'gallery/uploader/1.4/plugins/tagConfig/tagConfig';

		        S.use(plugins,function(S,Auth,UrlsInput,ProBars,Filedrop,Preview,TagConfig){
		            
		            var uploader = new Uploader('#J_UploaderBtn',{
		                //�����ϴ��ķ������˽ű�·��
		                action: _self.get('actWindUrl')
		            });

		            _self.set('uploaderObj', uploader);

		            //ʹ������
		            uploader.theme(new ImageUploader({
		                queueTarget:'#J_UploaderQueue'
		            }));

		            //��֤���
		            uploader.plug(new Auth({
		                        //����ϴ�����
		                        max:1,
		                        //ͼƬ��������С
		                        maxSize:1000
		                    }))
		                //url������
		                    .plug(new UrlsInput({target:'#J_Urls'}))
		                //����������
		                    .plug(new ProBars())
		                //��ק�ϴ�
		                    .plug(new Filedrop())
		                //ͼƬԤ��
		                    .plug(new Preview())
		                    .plug(new TagConfig());

		            //��ȾĬ������
           			uploader.restore();    

           			_self._uploaderEvent();		  
		        });				
    		});
    	},

    	// �ϴ��¼�
    	_uploaderEvent: function(){
         	var _self = this,
         		uploaderObj = _self.get('uploaderObj'),
         		Queue = uploaderObj.get('queue'),
         		authObj = _self.get('uploaderObj').getPlugin('auth'),
    			authPass = authObj.testRequired();

            // ��ѡ��� ��� �������Ѿ����ڵ� --- ֻ������1��
            uploaderObj.on('select', function(ev){
               Queue.clear();
            });   

            // �ϴ� �ɹ� or ʧ�� �ֶ�����У��
            uploaderObj.on('error success',function(ev){
			    _self.validform.get('J_Urls') && _self.validform.get('J_Urls').isValid();
			});       
      },

    	// ȷ�ϴ����
    	_sureCreatActiv: function(){
    		var _self = this;

    		_self.set('returnMsg', '�ܱ�Ǹ��ɹͼ�����ʧ�ܣ�');

			if(_self.validform.isValid()){
				S.all(".valid-text").hide();

				// д��edter�༭�� ����
				// DOM.val('#activestr', _self.editor.get("data") );
				
				var ajaxConfig = {
                    'url': _self.get('ajaxSubUrl') || '',
                    'data': S.TL.serializeToObject(_self.form) || ''
	            };         
				_self._ajaxAllConfig(ajaxConfig , _self._onlyAjaxMsg);			
			}
    	},

    	// �����ؼ�  ���� ��ʼ������
    	renderCalendar: function(container, cfg){
    		var _self = this;

    		if(!container){
    			return;
    		}

    		var calenderCfg = S.merge({
					showTime:true,
					popup:true,
		            triggerType:['click'],
		            closable:true // ѡ��� �ر���������
				}, cfg),
				calendarStr = container+'_obj',
				calendarObj = _self.get(calendarStr) || null; 

			if(!calendarObj){
				_self.set(calendarStr, new Calendar(container, calenderCfg) );
			}

			_self.get(calendarStr).render();

			// ����� ��д��������
        	_self.get(calendarStr).on('timeSelect', function(e){
	            DOM.val(container,  S_Date.format(e.date, 'yyyy-mm-dd HH:MM:ss') );
	            _self.validform && _self.validform.isValid(); // ���﷽����֤
	        });

	        return _self.get(calendarStr);
    	},

        // ��ʾ����
		_alertFn: function(msg, callback){
			var _self = this;

			var d = new O.Alert(msg, callback);            
            d.show();
		},		

		// ajax ��Ϣ��ʾ ���� �ص�����
		_onlyAjaxMsg: function(data){
			var _self = this;

			if(data.success){
				_self.form.submit();					
			}else{
				_self._alertFn( data.message || _self.get('returnMsg') || '����ʧ�ܣ�' );
				_self.set('returnMsg', '')
			}
		},

		// ���õ�ajax���� �����Ҫ���� dataType�� ��Ҫ���� ������{'url':, 'data':, 'dataType': } --- fn ���� ���� �������� ���� ��Ӧ��ͬ �ص�����
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
					_self._alertFn('�����쳣��');
				}
			},
			endAjaxConfig = S.merge( ajaxConfig, configObj);

			Ajax(endAjaxConfig);
		}

	});

return Bp_creat;

}, {'requires':['editor', 'gallery/validation/1.0/', 'calendar', 'calendar/assets/dpl.css', 'mui/overlay','mui/overlay/overlay.css', 'TL']});