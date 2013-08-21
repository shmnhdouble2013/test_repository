/**
 * KISSY Validetor
 * @creator 云谦<sorrycc@gmail.com>, 阿大<zhj3618@gmail.com>, 仁无痕<congjun.zhaocj@alibaba-inc.com>
 */
KISSY.add(function(S) {

    var doc = document,
        DOM = S.DOM, Event = S.Event,
        previous={},
		
        DEPENDENCY_MISMATCH = 'dependency-mismatch',

		/**
		 * 默认配置参数
		 */
        defaultConfig = {

            /**
             * 调试模式
             * @type {Boolean}
             */
            debug: S.Config.debug,

            /**
             * 是否在表单提交时验证
             * @type {Boolean}
             */
            onSubmit: true,

            /**
             * 是否即时校验
             * @type {Boolean}
             */
            singleCheck:true,
            /**
             * @type {Boolean}
             */
            isLazy: false,

            rules: {},
            messages: {},

            focusCleanUp: false,
            focusInvalid: true,

            errorClass: 'ks-validator-error',
            validClass: 'ks-validator-valid',
            messageTag: 'label',
            messageContainer: null,
            ignoreList: [],

            errorPlacement: null,

            onclick: function(el, v) {
                if(S.one(el).val()===""){
                    return
                }
                if (el.name in v.submitted || (el = el.parentNode).name in v.submitted) {
                    v.validate(el);
                }
            },
            onfocusin: function(el, v) {
                v.lastActive = el;
                if (v.config.focusCleanUp) {
                    DOM.hide(v.getMessage(el));
                }

                //显示提示信息
                var self=this,
                    play=false;
                S.Validator.tipsBox(el,self,play);
            },
			
            onfocusout: function(el, v) {
                if ( !v.checkable(el) && (el.name in v.submitted) && S.one(el).val()!=="") {
                    v.validate(el);
                }

                /* 单个校验 */
                if (!v.checkable(el) && v.config.singleCheck && S.one(el).val() !== ""){
                    v.validate(el);
                }else if(!v.checkable(el) && v.config.singleCheck && DOM.get(el).nodeName == "SELECT"){
                    v.validate(el);
                }

                /* 提示信息 */
                var self=this,
                    play=true;
                S.Validator.CancelTipsBox(el,self,play);
            },

            onkeyup: function(el, v) {
                if (Boolean(el.name) ? ((el.name in v.submitted) && S.one(el).val()!=="" && Boolean(v.config.rules[el.name]) && Boolean(v.config.rules[el.name].remote)) : false) {
                    v.validate(el);
                }
            },
            onchange:function(el,v){
                //针对chrome下file无法通过onfocusout事件实时校验
                if(Boolean(S.UA.chrome) && el.type=="file"){
                    v.validate(el);
                }
            }
        };

    /**
     * @constructor
     */
    function Validator(form, config) {
        /**
         * 表单元素
         * @type {HTMLElement|String} 表单元素或 Selector
         */
        this.form = DOM.get(form);

        /**
         * 配置参数
         * @type {Object}
         */
        this.config = S.merge(defaultConfig, config);
        if (this.config.messageContainer) {
            this.config.messageContainer = DOM.get(this.config.messageContainer);
        }

        /**
         * 激活元素
         * @type {HTMLElement}
         */
        this.lastActive = null;

        /**
         * 验证过的元素
         * @type {Object}
         */
        this.submitted = {};

        this._init();
    }
    S.augment(Validator, S.EventTarget);
    S.augment(Validator, {

        /**
         * @private
         */
        _init: function() {
            if (!this.form || this.form.tagName !== 'FORM') return S.log('error: 传入的不是表单元素');
            this._reset();
            this._bindEvents();
        },

        /**
         * @private
         */
        _bindEvents: function() {
            var self = this, config = self.config, form = self.form;

            function delegate(e, _target) {
                if (config['on'+e.type]
                        && (_target = e.target)
                        && ((e.type === 'click' && (self.checkable(_target) || /select|option/i.test(_target.nodeName)))
                             || (/text|password|file/i.test(_target.type) || /select|textarea/i.test(_target.nodeName)))) {
                    config['on'+e.type].call(self, _target, self);
                }
            }

            if (!config.isLazy) {
                Event.on(form, 'click focusin focusout keyup change', delegate);
            }
            if (config.onSubmit) {
                Event.on(form, 'submit', function(e) {
                    var invalid = !self.validate(), last;

                    if (config.debug || invalid) {
                        e.preventDefault();
                        self.fire('onValidateFail',{'invalid':invalid,'event':e});
                    }
                    if (invalid && config.focusInvalid) {
                        S.each(self.errorList, function(item){
                            if (item.element === self.lastActive) {
                                last = self.lastActive;
                                return false;
                            }
                        });

                        try {
                            (last || self.errorList[0].element).focus();
                        } catch(e) {
                            // ignore IE throwing errors when focusing hidden elements
                        }
                    }
                    self.fire('onValidateSucess',{'invalid':invalid,'event':e});
                });
            }
        },

        /**
         * 获取元素规则
         * @param element {HTMLElement}
         * @private
         */
        _getRules: function(element) {
            var rules = S.merge(
                    this._getAttributeRules(element),
                    this._getStaticRules(element)
                    );

            // 提升 required 的优先级
            if (rules.required) {
                var val = rules.required;
                delete rules.required;
                rules = S.merge({required:val}, rules);
            }

            return rules;
        },

        /**
         * 获取元素属性规则
         * @param element {HTMLElement}
         */
        _getAttributeRules: function(element) {
            var rules = {}, value;

            S.each(Validator.methods, function(func, method) {
                if ( (value = element.getAttribute(method)) !== null) {
                    rules[method] = value;
                }
            });

            // maxlength may be returned as -1, 2147483647 (IE) and 524288 (safari) for text inputs
            if (rules.maxlength && /-1|2147483647|524288/.test(rules.maxlength)) {
                delete rules.maxlength;
            }

            return rules;
        },

        /**
         * 获取元素静态规则
         * @param element {HTMLElement}
         */
        _getStaticRules: function(element) {
            return this._normalizeRule(this.config.rules[element.name]) || {};
        },

        /**
         * 获取较验元素列表
         * @private
         */
        _getElmts: function() {
            var self = this, elements = [], cache = {};

            S.each(self.form.elements, function(element) {
                if (!(/submit|reset|image/i.test(element.type)
                        || !element.name
                        || element.disabled
                        || element.name in cache
                        || self._isIgnore(element))
                        || !self._isOption(element)) {
                    elements.push(element);
                    cache[element.name] = true;
                }
            });

            return elements;
        },

        /**
         * 检查是否忽略
         * @param element {HTMLElement}
         * @private
         */
        _isIgnore: function(element) {
            var ignoreList = this.config.ignoreList;
            if (!ignoreList.length) return false;
            if (element.name && S.indexOf(element.name, ignoreList) !== -1
                    || S.indexOf(element, ignoreList) !== -1) {
                return true;
            }
        },

        /**
         * @private
         */
        _reset: function() {
            this.successList = [];
            this.errorList = [];
        },

        /**
         * 检查是否较验通过
         * // TODO: 这个方法有问题，检查单个通过后 length 为 0，但不能说明是 valid
         */
        isValid: function() {
            return this.errorList.length === 0;
        },

        /**
         * 验证表单(元素)
         * @param elements {HTMLElement|HTMLCollection|undefined}
         */
        validate: function(elements) {
            var self = this;
            //elements = elements ? self._isOption(elements) : self._getElmts();
			elements = elements ? self._isCheck(elements) : self._getElmts();
            self._reset();
            S.each(S.makeArray(elements), function(element) {
				//if(element.name!=undefined)
				self.submitted[element.name] = true;
                self._check(element);
            });
            self.updateMessages();
            return self.isValid();
        },

        /**
         * 验证元素
         * @param element {HTMLElement}
         */
        _check: function(element) {
            var methods = Validator.methods, message,
                rules, method, result,
                theregex = /\$?\{(\d+)\}/g;

            if (this.checkable(element)) {
                element = this.findByName(element.name);
            }

            rules = this._getRules(element);
            for (method in rules) {
                if (!methods[method]) {
                    S.log('error: 对应规则的方法'+method+'未声明');
                    continue;
                }

                message = this._getCustomMessage(element.name, method) || Validator.messages[method];
                if (S.isFunction(message)) {
                    message = message.call(this, rules[method], element);
                } else if (theregex.test(message)) {
                    message = Validator.format(message.replace(theregex, '{$1}'), rules[method]);
                    theregex.lastIndex = 0;
                }

                result = methods[method].call(this, element.value, element, rules[method]);
                if (result === DEPENDENCY_MISMATCH) continue;
                //添加pending状态，方法有待优化
                if (result === 'pending'){
                    this._pending(this,element);
                    return;
                }
                if (!result) {
                    this.errorList.push({element:element, message:message, type:'error'});
                    return;
                }
            }

            this.successList.push({element:element, type:'success'});
        },

        /**
         * 更新提示信息显示
         */
        updateMessages: function() {
            var self = this, label, error, pending;
            S.each([].concat(self.errorList, self.successList), function(item) {
                label = self.getMessage(item.element, item.message);
                error = item.type === 'error';
                pending = item.type === 'pending';

                DOM[error?'addClass':'removeClass'](item.element, self.config.errorClass);
                DOM[error?'removeClass':'addClass'](item.element, self.config.validClass);

                // (self.config.messageWrapper ? label.parentNode : label).style.display = error ? '' : 'none';

                if (!error && self.config.success) {
                    typeof self.config.success === 'string'
                            ? DOM.addClass(label, self.config.success)
                            : self.config.success(label);
                }

                if(pending){
                    label.className = 'loading';
                }
            });
        },

        /**
         * 获取提示信息元素
         * @param element {HTMLElement}
         * @param message {String}
         * @private
         */
        getMessage: function(element, message) {
            var config = this.config, label,
                selector = config.messageTag + '.' + config.errorClass,
                container = config.messageContainer || this.form;

            if (DOM.data(element, 'ks-validator-label')) {
                label = DOM.data(element, 'ks-validator-label');
            } else {
                label = DOM.filter(selector, function(el) {
                    return DOM.contains(container, el) && DOM.attr(el, 'for') === element.name;
                })[0];
            }

            if (label) {
                label.className = config.errorClass;
                if (label.getAttribute('generated')) {
                    label.innerHTML = message;
                }
            } else {
                label = DOM.create('<'+config.messageTag+'>', {
					'class': config.errorClass,
                    'for': element.name,
                    'generated': 'generated'
                });
                label.innerHTML = message;

                if (config.messageWrapper) {
                    var labelInner = label;
                    label = DOM.create(config.messageWrapper);
                    label.appendChild(labelInner);
                }
                if (config.messageContainer) {
                    config.messageContainer.appendChild(label);
                } else {
                    config.errorPlacement
                            ? config.errorPlacement(label, element)
                            : element.parentNode.appendChild(label);
                }
            }

            DOM.data(element, 'ks-validator-label', label);
            return label;
        },

        /**
         * @param element {HTMLElement}
         * @private
         */
        checkable: function(element) {
			return /radio|checkbox/i.test(element.type);
        },

        /**
         * 通过 name 找到第一个符合的元素
         * @param name {String}
         */
        findByName: function(name) {
            var form = this.form, ret = null;
            S.each(doc.getElementsByName(name), function(element) {
                return element.form === form && (ret = element).disabled;
            });
            return ret;
        },

        /**
         * @param element {HTMLElement}
         */
        optional: function(element) {
            return !Validator.methods['required'].call(this, S.trim(element.value), element) && DEPENDENCY_MISMATCH;
        },

        /**
         * @param value {String}
         * @param element {HTMLElement}
         */
        getLength: function(value, element) {
            var len = 0, form = this.form;
			switch (element.nodeName) {
            case 'SELECT':
                S.each(element.options, function(el) {
                    el.selected && len++;
                });
                return len;
            case 'INPUT':
                if (this.checkable(element)) {
                    S.each(doc.getElementsByName(element.name), function(el) {
                        el.form === form && el.checked && len++;
                    });
                    return len;
                }
			}
			return value.length;
        },

        /**
         * @param param {Boolean|String|Function}
         * @param element {HTMLElement}
         */
		depend: function(param, element) {
			return this._dependTypes[typeof param]
				? this._dependTypes[typeof param](param, element)
				: true;
		},

        /**
         * @type {Object}
         */
		_dependTypes: {
			'boolean': function(param) {
				return param;
			},
			'string': function(param, element) {
				return !!$(param, element.form).length;
			},
			'function': function(param, element) {
				return param(element);
			}
		},

        /**
         * 格式化规则
         * @param data {String|Object}
         * @private
         */
        _normalizeRule: function(data) {
            if (typeof data == 'string') {
                var transformed = {};
                S.each(data.split(/\s/), function(method) {
                    transformed[method] = true;
                });
                data = transformed;
            }
            return data;
        },

        /**
         * 获取自定义消息
         * @param name {String}
         * @param method {String}
         */
        _getCustomMessage: function(name, method) {
			var m = this.config.messages[name];
			return m && (typeof m === 'string' ? m : m[method]);
        },


        _previousValue: function(element) {
            if (DOM.data(element, "old") || DOM.data(element, "valid")) {
                previous.old = DOM.data(element, 'old');
                previous.valid = DOM.data(element, 'valid');
                return previous;
            }
            previous = {
                old:null,
                valid:'pending'
            };
            DOM.data(element, 'old', null);
            DOM.data(element, 'valid', 'pending');
            return previous;
        },

        /**
         * ajax延时等待
         */
        _pending:function(self, element) {
            var pendingL = {element:element, message:'验证中', type:'pending'};
            self.errorList.push(pendingL);
        },

        /**
         * 获取select选中的option
         * @param element {HTMLElement}
         */
        _isOption:function(element){
            if (/select/i.test(element.type)) {
                if(element.selectedIndex === -1){
                    return null;
                }
                return S.one(element);
            }
            return element;
        },
		
		/**
         * 检测元素是否校验
         * @param element {HTMLElement}
         */
		 _isCheck:function(element){
			var _self = this;
			if(_self._isIgnore(element)){
				return undefined;
			}
			return _self._isOption(element);
		 }
    });

    S.mix(Validator, {

        /**
         * 验证方法
         * @type {Object}
         */
        methods: {
            required: function(value, element, param) {
                if ( !this.depend(param, element) )
                    return DEPENDENCY_MISMATCH;

                switch( element.nodeName) {
                case 'SELECT':
                    var val = DOM.val(element);
                    return val && val.length > 0;
                case 'INPUT':
                    if (this.checkable(element)) {
                        return this.getLength(value, element) > 0;
                    }
                }
                return S.trim(value).length > 0;
            },
            minlength: function(value, element, param) {
                return this.optional(element) || this.getLength(S.trim(value), element) >= param;
            },
            maxlength: function(value, element, param) {
                return this.optional(element) || this.getLength(S.trim(value), element) <= param;
            },
            min: function(value, element, param) {
                return this.optional(element) || value >= param;
            },
            max: function(value, element, param) {
                return this.optional(element) || value <= param;
            },
            email: function(value, element) {
				var value = S.trim(value);
                return this.optional(element) ||/^[a-zA-Z0-9_.-]+\@([a-zA-Z0-9-]+\.)+[a-zA-Z0-9]{2,4}$/.test(value);
            },
            equalTo: function(value, element, param) {
                var self = this, target = DOM.get(param);
                if (target) {
                    Event.remove(target, 'keyup');
                    Event.on(target, 'keyup', function() {
                        self.validate(element);
                    });
                }
                return target ? value === target.value : true;
            },
            rangeLength: function(value, element, param) {
                var length = this.getLength(S.trim(value), element);
                return this.optional(element) || ( length >= param[0] && length <= param[1] );
            },
            range: function( value, element, param ) {
                return this.optional(element) || ( value >= param[0] && value <= param[1] );
            },
            url: function(value, element) {
                return this.optional(element) || /^(http|https|ftp):\/\/(([A-Z0-9][A-Z0-9_-]*)(\.[A-Z0-9][A-Z0-9_-]*)+)(:(\d+))?\/?/i.test(value);
            },
            number: function(value, element) {
                return this.optional(element) || /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(value);
            },
            digits: function(value, element) {
                return this.optional(element) || /^\d+$/.test(value);
            },
            accept: function(value, element, param) {
                param = typeof param == "string" ? param.replace(/,/g, '|') : "png|jpe?g|gif";
                return this.optional(element) || value.match(new RegExp(".(" + param + ")$", "i"));
            },
            mobile_cn: function(value, element) {
                return this.optional(element) || /^\+?(86)*0*1[3|5|6|8]\d{9}$/.test(value);
            },
            postcode_cn: function(value, element) {
                return this.optional(element) || /^[1-9]{1}(\d+){5}$/.test(value);
            },
			digitsandline:function(value,element){
				return this.optional(element)||/^\d{3,4}-\d+$/.test(value);
			},
			digitsandword:function(value,element){
				return this.optional(element)||/^(\d|[a-zA-Z])*$/.test(value);
			},
			digitsandwordandtag:function(value,element){
				return this.optional(element)||(/^[A-Za-z0-9]+$/.test(value));
			},
            remote:function(value, element, param) {
                var self = this;

                if (this.optional(element))
                    return "dependency-mismatch";

                this._previousValue(element);

                if (previous.old !== value) {
                    DOM.data(element, 'old', value);
                    var data = {};
					
					if(S.isFunction(param.data)){
						data = param.data();
					}else{
						data[element.name] = encodeURIComponent(value);
					}
                    
                    param.url = param.url + "?t=" + new Date().getTime();
                    S.io({
                        type:param.type,
                        url:param.url,
                        data:data,
                        dataType: "json",
                        success:function(d, textStatus, xhr) {
                            if (xhr.status === 200) {
                                previous.valid = d;
                                DOM.data(element, 'valid', d);
                                if (previous.valid) {
                                    self.successList[0]={element:element, type:'success'};
                                    self.errorList.shift();
                                    self.updateMessages();
                                   // S.one('#test').html(previous.valid)
                                } else {
                                    var message = self._getCustomMessage(element.name, 'remote') || S.Validator.messages['remote'];
                                    self.errorList[0]={element:element, message:message, type:'error'};
                                    self.updateMessages();
                                    //S.one('#test').html(previous.valid)
                                }
                            }
                        }
                    });
                    return 'pending';
                }
                return previous.valid;
            }
//            maxsize:function(value, element, param) {
//                var size,
//                    cycle,
//                    maxSize=512000/1024;
//                if (S.UA.core == 'webkit' || S.UA.core == 'gecko') {
//                    size = Math.floor(element.files[0].size / 1024);
//                    if (size > maxSize && size > param) {
//                        return false
//                    }
//                }
//                if (S.UA.core == 'trident') {
//                    var img = new Image();//动态创建img
//                    img.src = element.value;
//                    img.style.display = "none";
//                    cycle=S.later(function(){
//                        alert('complete:'+img.complete);
//                        alert('readyState:'+img.readyState);
//                        if(img.readyState == 'complete' && img.complete == true){
//                            size = Math.floor(img.fileSize / 1024);
//                            alert('size:'+size);
//                            cycle.cancel();
//                            if (size > maxSize && size > param) {
//                                return false
//                            }
//                        }
//                    },300,true);
//                    //document.body.removeChlid(img);//获取大小结束，移除图片
//                }
//                return true
//            }
        },

        /* 验证信息 */
        messages: {
            required : '该项必填项',
            minlength : '要求为最少{0}字',
            maxlength : '要求为最多{0}字',
			min : '要求为大于等于{0}的数字',
            max : '要求为小于等于{0}的数字',
            remote : '验证未通过',
			postcode_cn : '邮政编码格式错误',
			mobile_cn : '手机号码格式错误',
			digitsandline : '只能用数字加-',
			email : 'Email地址格式错误',
            equalTo : '两次输入的内容不相同',
            rangeLength : '要求为{0}-{1}字',
            range : '要求为介于{0}-{1}之间的数字',
            url : 'URL地址格式错误',
            number : '要求必须是数字',
            digits : '要求必须是整数',
            accept : '请输入一个有效的扩展名得值',
			digitsandword : '只能用数字加英文字母',
			digitsandwordandtag : '数字英文在一起，单独的数字、英文、符号不行'
            //maxsize:'上传的图片不能大于500KB！'
        },

		/** 
		 * 设置默认配置参数
		 * @param {object} config 配置参数
		 * @return  {Validetor}
		 */
        setDefaults: function(config) {
            defaultConfig = S.merge(defaultConfig, config);
            return this;
        },

        /**
         * 添加验证方法
         * @param name {String}
         * @param method {Function}
         * @param message {String}
         */
        addMethod: function(name, method, message) {
            this.methods[name] = method;
            this.messages[name] = message || defaultConfig.messages && defaultConfig.messages[name];
            return this;
        },

        /**
         * 模板替换
         * @param source
         * @param params
         */
        format: function(source, params) {
            if(arguments.length == 1)
                return function() {
                    var args = S.makeArray(arguments);
                    args.unshift(source);
                    return Validator.format.apply( this, args );
                };
            if (arguments.length > 2 && !S.isArray(params)) {
                params = S.makeArray(arguments).slice(1);
            }
            S.each(S.makeArray(params), function(n, i) {
                source = source.replace(new RegExp("\\{" + i + "\\}", "g"), n);
            });
            return source;
        },

         /**
          * 通过id获取name值
          * @param config
          */
        getID:function (config) {
            var config_clone = {},
                rules_clone = {},
                messages_clone = {};

            for (var n in config.rules) {
                var name = S.one('#' + n).attr('name');
                rules_clone[name] = config.rules[n];
            }

            for (var m in config.messages) {
                var msg = S.one('#' + m).attr('name');
                messages_clone[msg] = config.messages[m];
            }

            config_clone.rules = rules_clone;
            config_clone.messages = messages_clone;

            return S.merge(config, config_clone);
        },

        /**
         * 提示信息
         */
        tipsBox:function(el, self, play) {
            var elCls = S.one(el).attr('class');

            if(el.nodeName == 'SELECT' || el.type == 'file' || el.type == 'checkbox' || el.type == 'radio'){ return; }
            
            if (S.one(el).val() === "" && self.config.tips[el.id]) {
                S.one(self.getMessage(el, self.config.tips[el.id])).html("&nbsp;").removeAttr('class');
                self.config.tipsPlacement(self.getMessage(el, self.config.tips[el.id]));
                return
            }

            if (!self.config.singleCheck && play && elCls != self.config.errorClass && elCls != self.config.validClass) {
                S.one(self.getMessage(el, self.config.tips[el.id])).html("&nbsp;").removeAttr('class');
                return
            }
        },

        /**
         * 取消提示信息
         */
        CancelTipsBox:function(el, self, play) {
            var elCls = S.one(el).attr('class');
            if(self.config.tips[el.id]==undefined) return ;

            if(el.nodeName == 'SELECT' || el.type == 'file' || el.type == 'checkbox' || el.type == 'radio'){ return; }

            if (!DOM.hasClass(el,self.config.errorClass) && !DOM.hasClass(el,self.config.validClass)) {
                S.one(self.getMessage(el, self.config.tips[el.id])).html("&nbsp;").removeAttr('class');
                return
            }

            if (DOM.hasClass(el,self.config.validClass) && S.one(el).val() === "") {
                S.one(self.getMessage(el, self.config.tips[el.id])).html("&nbsp;").removeAttr('class');
                return
            }

            if (DOM.hasClass(el,self.config.errorClass) && S.one(el).val() === "") {
                S.one(self.getMessage(el, self.config.tips[el.id])).html("&nbsp;").removeAttr('class');
                return
            }

        }
    });
	
	S.namespace('Validator');
    S.Validator = Validator;

},{
	requires:['core']
});

/**
 * NOTES:
 *
 * - Validator 其实就是收集校验规则，然后通过不同的方式对表单元素进行验证
 * - 他解决的不是安全问题，而是体验问题
 *
 * - 重点：
 *     规则, 较验方法, 表单元素, 提示信息
 *
 * - API:
 *     isValid, validate, updateMessage, getMessage
 *
 */
