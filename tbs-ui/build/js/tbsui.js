/* build 2013-07-25 12:25:15 */
KISSY.add("tbsui",function(S,XTemplate){"use strict";var D=S.DOM,E=S.Event,EMPTY="";function Tbsui(cfg){var self=this;self.selector=cfg.selector;self.selectPrifix="slct-block";self.init()}S.augment(Tbsui,S.EventTarget,{init:function(){var self=this;self.detecte()},detecte:function(){var self=this;S.each(self.selector,function(i){S.each(S.query(i),function(j,_key){if(j.nodeName==="SELECT"&&D.hasClass(j,"slct")){self.createSelect(j,_key)}});switch(i){case"radio":self._renderRidoCheckbox("radio");break;case"checkbox":self._renderRidoCheckbox("checkbox");break}})},createSelect:function(elm,indexKey){var _num=100;_num-=indexKey;var self=this,tpl='<div class="'+self.selectPrifix+'" style="z-index:1'+_num+'0;">'+'<div class="clearfix title">'+'<span class="option">{{optionName}}</span>'+'<span class="icon"></span>'+"</div>"+'<ul class="menu">{{#options}}'+'<li data-index="{{index}}" class="{{selected}}">'+"{{text}}"+"</li>{{/options}}"+"</ul></div>",_options=[],selectedOption=0;S.each(elm.options,function(i,key){var _selected=EMPTY;if(i.selected){_selected="selected";selectedOption=key}_options.push({index:key,text:i.text,selected:_selected})});var data={optionName:elm.options[selectedOption].text,options:_options},render=new XTemplate(tpl).render(data);D.insertAfter(D.create(render),elm);var selectBlock=D.next(elm),panel=D.get(".menu",selectBlock),title=D.get(".title",selectBlock);D.width(title,D.width(panel)+4);E.delegate(selectBlock,"click",".title",function(e){if(D.hasClass(e.target,"title")){self.restoreOption(panel,elm)}});E.delegate(selectBlock,"click mouseenter mouseleave","li",function(e){switch(e.type){case"click":self.selectOption(elm,D.attr(e.target,"data-index"),D.get(".option",D.next(elm)));D.hide(panel);break;case"mouseenter":D.addClass(e.target,"selected");break;case"mouseleave":D.removeClass(e.target,"selected");break}});E.delegate(selectBlock,"click","span",function(e){if(e.target.nodeName=="SPAN"){self.restoreOption(panel,elm)}});E.delegate(document,"click","div",function(e){if(!D.contains(D.next(elm),e.target)){D.hide(panel)}})},restoreOption:function(panel,elm){S.each(D.query("li",panel),function(i){D.removeClass(i,"selected")});D.addClass(D.query("li",panel)[elm.options.selectedIndex],"selected");D.toggle(panel)},selectOption:function(elm,index,title){elm.options[index].selected="selected";D.html(title,elm.options[index].text);E.fire(elm,"slchange")},_renderRidoCheckbox:function(inputType){var self=this,evtStr=inputType=="radio"?".j_rado":inputType=="checkbox"?".j_Box":"";self.labelSpanCls=".radoBox-icons";self.protyInptCls=".radoBox-cls";self.radioDisabTypeCls=".cursor-disabled";self._setGlobalRdChkls(inputType);self.radios=S.query('input[type="'+inputType+'"]');self.radioBox_UiRender(self.radios);E.delegate(document,"click",evtStr,function(el){self._radioBoxClick(el)})},_setGlobalRdChkls:function(inputType){var self=this;if(inputType=="radio"){self.radioChecdTypeCls=".radio-checked";self.radioUnchecdTypeCls=".radio-unchecked";self.radioChecdDisabCls=".raido-disabled-checked";self.radioUnchecdDisabCls=".raido-disabled-unchecked"}else if(inputType=="checkbox"){self.radioChecdTypeCls=".checkbox-checked";self.radioUnchecdTypeCls=".checkbox-unchecked";self.radioChecdDisabCls=".checkbox-disabled-checked";self.radioUnchecdDisabCls=".checkbox-disabled-unchecked"}},radioBox_Checked_Set:function(elName,isChecked){var self=this,nameStr=S.isString(elName)?elName:D.attr(elName,"name"),groupRadios=S.query('input[name="'+nameStr+'"]');S.each(groupRadios,function(el){if(isChecked){el.checked="checked"}else{el.checked="";D.removeAttr(el,"checked")}self.radioBox_updater(el)})},_radioBoxClick:function(el){el.halt(true);var self=this,protoRadio=D.children(el.currentTarget,self.protyInptCls)[0],isdisable=protoRadio.disabled||D.attr(protoRadio,"disabled"),isChecked=protoRadio.checked||D.attr(protoRadio,"checked"),radioOrBoxStr=protoRadio.type||D.attr(protoRadio,"type");if(isdisable){return}if(radioOrBoxStr=="radio"){if(isChecked){return}else{self.radioBox_Checked_Set(protoRadio);protoRadio.checked="checked"}}else if(radioOrBoxStr=="checkbox"){protoRadio.checked=isChecked?"":"checked"}else{return}self.radioBox_updater(protoRadio);var fireObj={inputTarget:protoRadio,inputType:radioOrBoxStr,inpuValue:D.val(protoRadio),isChecked:protoRadio.checked||"",isdisable:protoRadio.disabled||""};var fireName=radioOrBoxStr+"Click";self.fire(fireName,fireObj)},radioBox_UiRender:function(radios){var self=this;S.each(radios,function(el){self.radioBox_updater(el);D.addClass(el,"hidd-el")})},radioBox_updater:function(el){var self=this,isdisable=el.disabled||D.attr(el,"disabled"),isChecked=el.checked||D.attr(el,"checked"),sefRadio=D.prev(el,"span"),labContainer=D.parent(el,"label"),radioOrBoxStr=el.type||D.attr(el,"type");self._setGlobalRdChkls(radioOrBoxStr);if(isdisable){el.disabled="disabled";D.addClass(labContainer,self.radioDisabTypeCls);if(isChecked){el.checked="checked";D.removeClass(sefRadio,self.radioUnchecdDisabCls);D.addClass(sefRadio,self.radioChecdDisabCls)}else{el.checked="";D.removeClass(sefRadio,self.radioChecdDisabCls);D.addClass(sefRadio,self.radioUnchecdDisabCls)}}else{el.disabled="";D.removeClass(labContainer,self.radioDisabTypeCls);if(isChecked){el.checked="checked";D.removeClass(sefRadio,self.radioUnchecdTypeCls);D.addClass(sefRadio,self.radioChecdTypeCls)}else{el.checked="";D.removeClass(sefRadio,self.radioChecdTypeCls);D.addClass(sefRadio,self.radioUnchecdTypeCls)}}}});return Tbsui},{requires:["xtemplate","dom","event","sizzle"]});