/*
	新增校验规则
*/
KISSY.add(function(S, Validation) {

	var DOM = S.DOM, Event = S.Event ;

	Validation.Rule.add('dateCompare','',function(value,text,config){
		var startDate = Date.parse(DOM.val(config.start).replace(/\-/g,"/")),
			endDate = Date.parse(DOM.val(config.end).replace(/\-/g,"/")) ;
		if(!startDate){
			return config.startText ? config.startText : "请输入有效的开始时间!" ;
		}
		else if(!endDate){
			return config.endText ? config.endText : "请输入有效的结束时间!" ;
		}
		else if(startDate > endDate){
			return config.bigText ? config.bigText : "开始时间不能大于结束时间!" ;
		}else if(config.days){
			var subDay = (endDate - startDate)/(1000 * 60 * 60 * 24);
			if(subDay > config.days){
				return config.bigText ? config.bigText : "结束时间不能大于开始时间" + config.days + "天!" ;
			}
		}
	});

	Validation.Rule.add('date','请输入有效的时间!',function(value,text,isDate){
		if(isDate){
			var time = Date.parse(value.replace(/\-/g,"/"));
			if(!time){
				return text;
			}
		}
	});

	Validation.Rule.add("cardId","身份证号码不正确",function(value,text){
		if(!(/^(\d{6})(18|19|20)?(\d{2})([01]\d)([0123]\d)(\d{3})(\d|x|X)?$/.test(value))){
			return text;
		}
	});

	Validation.Rule.add('grouprequires','体积填写不正确！',function(value,text,group){
		var flag = "" ;
		S.each(group,function(item){
			if(flag) return ; 
			var node = DOM.get(item),
				val = DOM.val(node);
			if(!(/^\d+(\.\d+)?$/.test(val))){
				flag = text ;
				return ;
			}
			else if(val.length > 9){
				flag = "长度不能大于9个字符！" ;
				return ;
			}
		});
		if(flag) return flag ;
	});

	Validation.Rule.add('exclude','不能包含关键字{0}。',function(value,text,key){
		var flag = "" ;
		S.each(key,function(val){
			if(new RegExp(val,"ig").test(value)){
				flag = Validation.Util.format(text,val);
				return ;
			}
		});
		return flag ;
	});

	Validation.Rule.add('empty','不能为空！',function(value,text){
		if(!S.trim(value)){
			return text;
		}
	});

	Validation.Rule.add('unique','不能有重复项！',function(value,text,itemList){
		var flag = 0 ,
			DomList = DOM.query(itemList) ;
		S.each(DomList,function(item){
			if(S.trim(value) === S.trim(DOM.val(item))){
				flag ++ ;
			}
		});
		if(flag > 1) return text ;
	});

	var symbol = Validation.Define.Const.enumvalidsign;

	function FloatTips() {
        return {
            init: function() {
                var self = this, tg = self.target,
                    panel,label,estate,tipBox;

                panel = DOM.create(self.template);
                estate = DOM.get('.estate', panel),
				label = DOM.get('.label', panel),
				tipBox = DOM.get(".float-tip-box", panel);
                tg.parentNode.appendChild(panel);
                DOM.hide(panel);
				DOM.hide(tipBox) ;

                S.mix(self, {
                        panel: panel,
                        estate: estate,
                        label: label
                    });

                self._bindEvent(self.el, self.event, function(ev) {
                    var result = self.fire("valid", {event:ev.type});
                    if (S.isArray(result) && result.length == 2) {
                        self.showMessage(result[1], result[0], ev.type);
                    }
                });

				Event.on(panel,'mouseenter',function(){
					if(self.result != symbol.ok){
						DOM.show(tipBox);
					}
				});
				Event.on(panel,'mouseleave',function(){
					DOM.hide(tipBox) ;
				});
            },

            showMessage: function(result, msg) {
                var self = this,
                    panel = self.panel, estate = self.estate, label = self.label;

				self.result = result ;

                if (self.invalidClass) {
                    if (result == symbol.ignore && result == symbol.ok) {
                        DOM.removeClass(self.el, self.invalidClass);
                    } else {
                        DOM.addClass(self.el, self.invalidClass);
                    }
                }

                if (result == symbol.ignore) {
                    DOM.hide(panel);
                } else {
                    var est = "error";
                    if (result == symbol.error) {
                        est = "error";
                    } else if (result == symbol.ok) {
                        est = "ok";
                    } else if (result == symbol.hint) {
                        est = "tip";
                    }
                    DOM.removeClass(estate, "ok tip error");
                    DOM.addClass(estate, est);
                    DOM.html(label, msg);
                    DOM.show(panel);
                }
            },

            style: {
                floatTips: {
                    template: '<span class="validation-float-tips"><span class="estate"><em class="estate-icon"></em><span class="float-tip-box"><label class="label"></label><span class="pointyTipShadow"></span><span class="pointyTip"></span></span></span></span>',
                    event: 'focus blur keyup'
                }
            }


        };
    }

	Validation.Warn.extend("floatTips",FloatTips);

    var CLS_UNDER_TEXT = 'valid-text';

    function underText(){
        return {
            //初始化
            init : function(){
                var _self = this,
                    targetEl = S.one(_self.target),
                    parentNode = targetEl.parent();
                _self.parentNode = parentNode;
            },
            //显示错误信息
            showMessage : function(result, msg){
                var _self = this,
                    temp = '';
                _self._clearMessage();

                if(result === symbol.error){
                    temp = _self._getTemplate(msg);
                    new S.Node(temp).appendTo(_self.parentNode);
                }
            },
            //清除信息
            _clearMessage : function(){
               var _self = this,
                   msgEl = this.parentNode.one('.' + CLS_UNDER_TEXT);
                if(msgEl){
                    msgEl.remove();
                }
               
            },
            //获取模板
            _getTemplate : function(msg){
                return ['<span class="', CLS_UNDER_TEXT, '"><span class="estate error"><span class="x-icon x-icon-mini x-icon-error" >!</span><em>' , msg , '</em></span></span>'].join('');
            },
            //覆写样式
            style: {
                underText: {
                    template: '',
                    event: 'focus blur keyup'
                }
            }
        };
    }

    Validation.Warn.extend("underText",underText);

	return Validation;

}, { requires: ["validation"] });