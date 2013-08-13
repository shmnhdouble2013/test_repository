/**
 * @Description: ģ��ؼ���ƽ��
 * @Author:      dafeng.xdf[at]taobao.com  jia.huangj
 * @Date:        2013.7.3
 */

KISSY.add('tbsui', function (S, XTemplate) { // , TbsUiValid Validation,
    'use strict';

    var D = S.DOM,
        E = S.Event,
        EMPTY = '';

    /**
     * @name Tbsui
     * @class ģ��ؼ���ƽ��
     * @constructor
     */

    function Tbsui(cfg) {
        var self = this;		

        self.selector = cfg? cfg.selector : null;
        self.selectPrifix = 'slct-block';
		
        self.init();
    }
	
    S.augment(Tbsui, S.EventTarget, {
        init:function(){
            var self = this;
            self.detecte();            
        },
        detecte:function(){
            var self = this;
            if(!self.selector){
                return;
            }

            S.each(self.selector,function(i){

                S.each(S.query(i),function(j,_key){
                    if (j.nodeName === 'SELECT' && D.hasClass(j,'slct')){
                        self.createSelect(j,_key);
                    }
                });

                // �жϳ�ʼ��Ԫ��
                switch(i){
                    case 'radio' : self._renderRidoCheckbox('radio');
                        break;
                    case 'checkbox' : self._renderRidoCheckbox('checkbox');
                        break;
						
                }
            });
        },
        createSelect:function(elm,indexKey){
            var _num = 100;
            _num -=indexKey;
            var self = this,
                tpl = '<div class="'+self.selectPrifix+'" style="z-index:1'+_num+'0;">' +
                    '<div class="clearfix title">' +
                    '<span class="option">{{optionName}}</span>' +
                    '<span class="icon"></span>' +
                    '</div>' +
                    '<ul class="menu">{{#options}}' +
                    '<li data-index="{{index}}" class="{{selected}}">' +
                    '{{text}}' +
                    '</li>{{/options}}'+
                    '</ul></div>',
                _options = [],
                selectedOption = 0;
            S.each(elm.options,function(i,key){
                var _selected = EMPTY;
                if(i.selected){
                    _selected = 'selected';
                    selectedOption = key;
                }
                _options.push({index:key,text:i.text,selected:_selected});
            });
            var data = {
                    optionName: elm.options[selectedOption].text,
                    options: _options
                },
                render = new XTemplate(tpl).render(data);
            D.insertAfter(D.create(render),elm);
            var selectBlock = D.next(elm),
                panel = D.get('.menu',selectBlock),
                title = D.get('.title',selectBlock);
            D.width(title, D.width(panel)+4);
            E.delegate(selectBlock,'click','.title',function(e){
                if(D.hasClass(e.target,'title')){
                    self.restoreOption(panel,elm);
                }
            });
            E.delegate(selectBlock,'click mouseenter mouseleave','li',function(e){
                switch(e.type){
                    case 'click':
                        self.selectOption(elm,D.attr(e.target,'data-index'), D.get('.option', D.next(elm)));
                        D.hide(panel);
                        break;
                    case 'mouseenter':
                        D.addClass(e.target,'selected');
                        break;
                    case 'mouseleave':
                        D.removeClass(e.target,'selected');
                        break;
                }
            });
            E.delegate(selectBlock,'click','span',function(e){
                if(e.target.nodeName == 'SPAN'){
                    self.restoreOption(panel,elm);
                }
            });
            E.delegate(document,'click','div',function(e){
                if(!D.contains(D.next(elm),e.target)){
                    D.hide(panel);
                }
            });
        },
        restoreOption:function(panel,elm){
            S.each(D.query('li',panel),function(i){
                D.removeClass(i,'selected');
            });
            D.addClass(D.query('li',panel)[elm.options.selectedIndex],'selected');
            D.toggle(panel);
        },
        selectOption:function(elm,index,title){
            elm.options[index].selected = 'selected';
            D.html(title,elm.options[index].text);
			E.fire(elm, 'slchange');
        },
       
	   
        //��ʼ�� checkbox radio --  by huangj
        /*
        * @description ���÷���--��ʼ�� input
        * @param {string|HTMLCollection|Array<HTMLElement>, document}
        * @return {null}
        */
        _renderRidoCheckbox: function(inputType, thatDoc){
            var self = this,
                thatDoc = thatDoc || document, 
				evtStr = inputType == 'radio' ? '.j_rado' : (inputType == 'checkbox' ?  '.j_Box' : '');
                
            // �趨radio��dom ��������ʽ ������-invalid
             if( !self.hasGlobalAttr ){                
                self.labelSpanCls = '.radoBox-icons';
                self.protyInptCls = '.radoBox-cls';
                self.radioDisabTypeCls = '.cursor-disabled';

                self.hasGlobalAttr = true;
            }     

            // ��ȡ radio/checkbox����
            self.radios = S.query('input[type="'+inputType+'"]', thatDoc);
            if(self.radios.length < 1){
                return;
            }else{
                self.radios = S.filter(self.radios, function(els){
                   return D.hasClass(els, self.protyInptCls); 
                }, self);
            }

            // ����ԭʼ radio/checkbox���� �����Զ���radio��ʽ
            self.radioBox_UiRender(self.radios);
			
			// radio/checkbox label�¼���� -- ľ��-invalid �Ѱ�-invalid
            if( evtStr && !self[evtStr] ){
               // var radioBoxClickObj = S.buffer(self._radioBoxClick, 150, self);

                E.delegate(document, 'click', evtStr, function(el){
                    self._radioBoxClick(el);
                }); 

                self[evtStr] = evtStr;
            }               					
        },
		
        // �趨 ȫ�� radio checkbox��ʽ
        _setGlobalRdChkls: function(inputType){
            var self = this;
            // radio �� checkbox 4��״̬��ʽ
            if(inputType == 'radio') {
                self.radioChecdTypeCls = '.radio-checked';
                self.radioUnchecdTypeCls = '.radio-unchecked';
                self.radioChecdDisabCls = '.raido-disabled-checked';
                self.radioUnchecdDisabCls = '.raido-disabled-unchecked';
            }else if (inputType == 'checkbox') {
                self.radioChecdTypeCls = '.checkbox-checked';
                self.radioUnchecdTypeCls = '.checkbox-unchecked';
                self.radioChecdDisabCls = '.checkbox-disabled-checked';
                self.radioUnchecdDisabCls = '.checkbox-disabled-unchecked';
            };
        },

		/*
		* @description ���÷���--- �������� ͬ��radio/checkbox, ����checked״̬
		* @param HtmlElement/ѡ��ȡ�� booleanֵ
		* @return {null}
		*/
        radioBox_Checked_Set: function(elName, isChecked){
            var self = this,
                nameStr = S.isString(elName) ? elName : D.attr(elName, 'name'),
                groupRadios = S.query('input[name="'+nameStr +'"]');

            S.each(groupRadios, function(el){
			
				if(isChecked){
					el.checked = 'checked';
				}else{
					el.checked = '';
					D.removeAttr(el, 'checked');
				}               
                self.radioBox_updater(el);
            });
        },

        // ˽�й��� ���������� radio ���� checkbox ��ʽЧ�� ����
        _radioBoxClick: function(el){
			el.halt(true);  
			
			// console.log('������-radioBoxClick�ѵ���');
						
			var self = this,
                protoRadio = D.children(el.currentTarget, self.protyInptCls)[0];
			
			// ������ �ȶ��� input Ԫ��
			if(!protoRadio){
				throw new Error('δ�ҵ�classΪ: "'+self.protyInptCls+'" ��inputԪ�أ�');
				return;
			}	
			
			var isdisable = protoRadio.disabled || D.attr(protoRadio, 'disabled'),
                isChecked = protoRadio.checked || D.attr(protoRadio, 'checked'),
                radioOrBoxStr = protoRadio.type || D.attr(protoRadio, 'type');

            // ����� ���� ��ֱ���˳�
            if(isdisable){
                return;
            }
			
			// ��� �¼����� ����ȡ�� -- �����radio, ������checkbox ȡ����ֵ
			if(radioOrBoxStr == 'radio'){
				if(isChecked){
					return;
				}else{					
					// ����radio���� ȡ��ͬ��ȫ��ѡ��״̬
					self.radioBox_Checked_Set(protoRadio);	
					
					// �ѵ�ǰԪ��ѡ��
					protoRadio.checked = 'checked';
				}
			}else if(radioOrBoxStr == 'checkbox'){
				protoRadio.checked = isChecked ? '' : 'checked';
			}else{
				return;
			}           
			
			self.radioBox_updater(protoRadio);
			
			var fireObj = {
				'inputTarget': protoRadio, 
				'inputType': radioOrBoxStr, 
				'inpuValue': D.val(protoRadio), 
				'isChecked': protoRadio.checked || '', 
				'isdisable': protoRadio.disabled || ''
			};	
				
			// �ؼ�fire�¼�
			var fireName = radioOrBoxStr+'Click';
			self.fire(fireName, fireObj);

            // ����ԭ��click�¼� 
            // E.fire(protoRadio, 'click');			
        },

		/*
		* @description ���÷��� -- ��ʼ�� radio/checkbox, ���� ui�滻/���� �� ԭ������
		* @param array[els]
		* @return {null}
		*/
        radioBox_UiRender:function(radios){
            var self = this;

            S.each(radios, function(el){
                self.radioBox_updater(el);
                D.addClass(el, 'hidd-el');
            });
        },
		
		/*
		* @description ���÷��� -- radio �� checkbox ui���� �� ԭ������ͬ��
		* @param { HtmlElement | string-- radio/checkbox }
		* @return {null}
		*/
        radioBox_updater: function(el){
            var self = this,
                isdisable = el.disabled || D.attr(el, 'disabled'),
                isChecked = el.checked || D.attr(el, 'checked'),
                sefRadio = D.prev(el, 'span'),
                labContainer = D.parent(el, 'label'),
				radioOrBoxStr = el.type || D.attr(el, 'type');
			
			// ���¸�ֵȫ��״̬��ʽ
            self._setGlobalRdChkls(radioOrBoxStr);		

            // �Ƿ����  -- ��ѡ�����
            if(isdisable){
                el.disabled = 'disabled';
                D.addClass(labContainer, self.radioDisabTypeCls);

                if(isChecked){
                    el.checked = 'checked';
                    D.removeClass(sefRadio, self.radioUnchecdDisabCls);
                    D.addClass(sefRadio, self.radioChecdDisabCls);
                }else{
                    el.checked = '';
                    D.removeClass(sefRadio, self.radioChecdDisabCls);
                    D.addClass(sefRadio, self.radioUnchecdDisabCls);
                }
            }else{
                el.disabled = '';
                D.removeClass(labContainer, self.radioDisabTypeCls);

                if(isChecked){
                    el.checked = 'checked';
                    D.removeClass(sefRadio, self.radioUnchecdTypeCls);
                    D.addClass(sefRadio, self.radioChecdTypeCls);
                }else{
                    el.checked = '';
                    D.removeClass(sefRadio, self.radioChecdTypeCls);
                    D.addClass(sefRadio, self.radioUnchecdTypeCls);
                }
            }
        }

    });
    return Tbsui;
}, {requires: ['xtemplate','dom','event','sizzle']});



/**
* @Description  tbs-ui ��֤�����ʾ��
* @Author       jia.huangj  ������ˮľ�껪double
* @param  		{form || config}
* @return 		{validation}
* @Date 		2013.8.13 
*/
KISSY.add("Validation", function(S, Validation){
	
	/**
	* �Զ�����ʾ��
	* ����У�����
	*/	
	function tbsUiValid() {
		var S = KISSY,
			DOM = S.DOM,
			Event = S.Event;
			
		return {

			//��дinit
			init:function () {
				var self = this, 
					tg = self.target,
					panel = DOM.create(self.template), 
					estate = DOM.get('.estate', panel),
					label = DOM.get('.label', panel);

				S.ready(function(){
					DOM.append( panel, DOM.parent(tg) );
				});
				
				S.mix(self,{
					panel: S.one(panel),
					estate: S.one(estate),
					label: S.one(label)
				});

				//�󶨶���		
				self._bindEvent(self.el, self.event, function(ev){
					var result = self.fire("valid", {event:ev.type});
					
					if(S.isArray(result) && result.length==2){
						self.showMessage(result[1], result[0], ev.type, ev.target);
					}
				});
			},
			
			//����У����
			showMessage:function (result, msg, evttype, target) {
				var self = this, 
					panel = self.panel, 
					estate = self.estate, 
					label = self.label;		

				if (result == true || result === 1 || result === 3) {
					DOM.removeClass(estate, 'error');
					DOM.addClass(estate, 'ok');					
				}else{
					DOM.removeClass(estate, 'ok');
					DOM.addClass(estate, 'error');						
					label.html(msg);					
				}
			},

			style: {			
				tbsUiValid_under: {
					template: '<div class="tbsUiValid-under"><p class="estate"><span class="label"></span></p></div>',
					event: 'focus blur keyup'
				},			
				tbsUiValid_text: {
					template: '<label class="tbsUiValid-text"><span class="estate"><em class="label"></em></span></label>',
					event: 'focus blur keyup'
				}
			}
		}
	}
	
	//������ʾ�� -- tbsUiValid
	Validation.Warn.extend("tbsUiValid", tbsUiValid);
	
	return Validation;

}, { requires: ["gallery/validation/1.1/"] });
