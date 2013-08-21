KISSY.add(function(d){var i=d.DOM,h=d.Event;var b="readonly",e="ks-select-calendar",g="calendar-time";function c(k){var j=this;k=d.merge(c.validation,k);c.superclass.constructor.call(j,k)}c.validation={validater:null,rules:{}};d.extend(c,d.Base);d.augment(c,{set:function(j,k){c.superclass.set.call(this,j,k,{silent:1})},getOutSideRules:function(){var k=this,l=k._rules?k._rules():{},m=d.merge(l,k.get("rules")),j={};d.each(m,function(o,n){if(d.isFunction(o)){j[n]=o.call(k)}else{j[n]=o}});return j},addRules:function(l){l=d.merge({required:false},l);var j=this,k={};d.each(l,function(n,m){if(!d.isFunction(n)){k[m]=n}else{j._setFuncRules(m,n)}});if(!d.isEmptyObject(j._getFuncRules())){k.func=j._runFuncRules()}if(!d.isEmptyObject(k)){j._addRule(k)}return j},_setFuncRules:function(l,m){var j=this,k=j.get("funcRules")||{};if(d.isEmptyObject(k)){j.set("funcRules",k)}if(d.isFunction(m)){k[l]=m}},_getFuncRules:function(){var j=this;return j.get("funcRules")},_runFuncRules:function(){var j=this;return function(m){var l=this,k=null;d.each(j._getFuncRules(),function(o,n){k=o.call(l,m);if(k){return false}});return k}}});function a(m,l,k){var j=this;if(!m||!d.get("#"+m)){throw"please assign the id of rendered Dom!"}j.set("triggerId",m);j.set("trigger",d.one("#"+m));l=d.merge(a.config,l);j.set("config",l);k=d.merge(a.validation,k);a.superclass.constructor.call(j,k);j.events=["dateclear"];j._init()}a.config={popup:true,triggerType:["click"],showTime:false};a.validation={};d.extend(a,c);d.augment(a,{getTrigger:function(){return this.get("trigger")},getValidaterField:function(){var j=this,k=j.get("validater"),l=j.get("triggerId");return k?k.get(l):null},getCalendar:function(){return this.get("calendar")},destroy:function(){var j=this,m=j.getCalendar(),l=j.get("validater"),k=j.getTrigger(),n=j.get("triggerId");m.detach();m.destroy();k.detach();if(l){l.fields.remove(n)}k.remove();j.detach();return j},isValid:function(){var j=this;return j.getValidaterField()?j.getValidaterField().isValid():!!j.getTrigger().val()},_init:function(){var j=this,m=j.getTrigger(),l=j.get("config"),k=l.showTime,p,o,n;if(m.hasAttr(b)){m.removeAttr(b)}if(!m.hasClass(e)){m.addClass(e)}if(k&&!m.hasClass(g)){m.addClass(g)}l=j._echoDate();p=new d.Calendar(m,l);j.set("calendar",p);o=k?"yyyy-mm-dd HH:MM:ss":"yyyy-mm-dd";j.set("format",o);n=k?"timeSelect":"select";j.set("selectEvent",n);j._initEvent();j._initRule()},_initEvent:function(){var j=this,n=j.getCalendar(),k=j.getTrigger(),m=j.get("format"),l=j.get("selectEvent");n.on(l,function(o){k.val(a.formatDate(o.date,m));k[0].focus();this.hide()});k.on("keydown",function(p){if(p.keyCode===8||p.keyCode===46){var o=i.val(this);i.val(this,"");j.fire("dateclear",{value:o})}});k.on("valuechange",function(o){i.val(this,"")})},_initRule:function(){var j=this,k=j.getOutSideRules()||{};if(!d.isEmptyObject(k)){j.addRules(k)}},_echoDate:function(){var j=this,m=j.get("trigger").val(),k=j.get("config"),l;if(a.getDateParse(m)){l=a.getDateObj(m);k=d.merge({date:l,selected:l},k);j.set("config",k)}return k},_addRule:function(l){var j=this,k=j.get("validater"),m=j.get("triggerId");if(k){k.add("#"+m,l)}}});d.mix(a,{formatDate:function(j,k){return d.Date.format(j,k)},getDateParse:function(j){return Date.parse(j.replace(/\-/g,"/"))},getDateObj:function(j,l){var m=j?a.getDateParse(j):(new Date).getTime(),k=l?l*86400000:0;return new Date(m+k)},formatText:function(k){var j=Array.prototype.slice.call(arguments,1);return k.replace(/\{(\d+)\}/g,function(l,n){return j[n]})},clearTime:function(j){var k=j||new Date();if(d.isString(j)){k=a.getDateObj(j)}k.setHours(0);k.setMinutes(0);k.setSeconds(0);k.setMilliseconds(0);return k},dataValidation:function(j){j=j||{};return function(){var k=this,l=j.validateCondition?"\u6821\u9a8c\u5931\u8d25":"\u65e5\u671f\u4e0d\u80fd\u5927\u4e8e\u4eca\u5929\uff01",p=j.text||l,o=j.compareData||"",n=o?a.getDateParse(o):a.clearTime().getTime(),m=j.validateCondition||function(q,r){return q>r};return function(r){var q=a.getDateParse(r);if(!q){return"\u8bf7\u8f93\u5165\u6709\u6548\u7684\u65f6\u95f4\uff01"}else{if(m(q,n)){return a.formatText(p,o)}}}}},rules:{beforeDate:function(j){return a.dataValidation({text:"\u65e5\u671f\u4e0d\u80fd\u5927\u4e8e{0}\uff01",compareData:j})},afterDate:function(j){return a.dataValidation({text:"\u65e5\u671f\u5c0f\u80fd\u5927\u4e8e{0}\uff01",compareData:j,validateCondition:function(k,l){return k<l}})},beforeNow:function(){return a.dataValidation()},afterNow:function(){return a.dataValidation({text:"\u65e5\u671f\u4e0d\u80fd\u5c0f\u4e8e\u4eca\u5929\uff01",validateCondition:function(j,k){return j<k}})}}});function f(m,k,l){var j=this;j.set("configStart",m);j.set("configEnd",k);l=d.merge(f.validation,l);f.superclass.constructor.call(j,l);j._init()}f.validation={isSupportSeparate:false};d.extend(f,c);d.augment(f,{getStartCalendar:function(){var j=this;return j.get("calendarStart")},getEndCalendar:function(){var j=this;return j.get("calendarEnd")},isJoin:function(){var j=this,p=j.getStartCalendar(),o=j.getEndCalendar(),m=p.getTrigger().val(),l=o.getTrigger().val(),n=j.get("isSupportSeparate"),k=true;if(n&&(!m||!l)){k=false}return k},isValid:function(){var j=this,l=j.get("validater"),k,n,m;if(l){k=j._getProxyValidaterField();return k.isValid()}else{n=j.getStartCalendar();m=j.getEndCalendar();return n.isValid()&&m.isValid()}},initValue:function(){this._setProxyValue()},destroy:function(){var j=this,n=j.getStartCalendar(),m=j.getEndCalendar(),k=j._getProxy(),l=j.get("validater");n.destroy();m.destroy();k.detach();if(l){l.fields.remove(k.attr("id"))}k.remove();j.set("proxyInput",null);return j},_init:function(){var j=this,l=j.get("configStart"),k=j.get("configEnd"),n,m;j._checkValidater();n=new a(l[0],l[1],l[2]);m=new a(k[0],k[1],k[2]);j.set("calendarStart",n);j.set("calendarEnd",m);j._initProxyInput();j._initEvent();j._initRule();j._setProxyValue()},_initEvent:function(){var j=this,l=j.getStartCalendar(),k=j.getEndCalendar();l.getCalendar().on(l.get("selectEvent"),function(m){j._setProxyValue(a.formatDate(m.date,l.get("format")),0);j.fire("datechange")});l.on("dateclear",function(){j._setProxyValue("",0)});k.getCalendar().on(k.get("selectEvent"),function(m){j._setProxyValue(a.formatDate(m.date,k.get("format")),1);j.fire("datechange")});k.on("dateclear",function(){j._setProxyValue("",1)})},_initRule:function(){var j=this,l=j.getStartCalendar(),k=j.getOutSideRules()||{};if(!d.isEmptyObject(k)){j.addRules(k)}},_initProxyInput:function(){var j=this,k=d.one(i.create('<input type="hidden"/>'));k.attr("id",d.guid()).insertAfter(j.get("calendarEnd").getTrigger());j.set("proxyInput",k)},_getProxy:function(){return this.get("proxyInput")},_getProxyValidaterField:function(){var j=this,k=j.get("proxyValidaterField")||undefined,l;if(k===undefined){l=j.get("validater");k=l?l.get(j._getProxy().attr("id")):null;j.set("proxyValidaterField",k)}return k},_setProxyValue:function(m,k){var j=this,l=j._getProxy(),o=(l.val()||"|").split("|"),n="";if(m===undefined){o[0]=j.getStartCalendar().getTrigger().val();o[1]=j.getEndCalendar().getTrigger().val()}else{o[k]=m}if(o.join("|")!=="|"){n=o.join("|")}l.val(n);j.isValid()},_addRule:function(m){var j=this,l=j.get("validater"),k=j._getProxy().attr("id");if(l){l.add("#"+k,m)}},_checkValidater:function(){var j=this,m=j.get("validater"),l=j.get("configStart"),k=j.get("configEnd"),n=function(o){var p=o.length,q;for(q=p;q<3;q++){o.push({})}o[2]["validater"]=m};if(m){n(l);n(k)}},_rules:function(){return{required:false,starBeforeEnd:f.dataValidation()}}});d.mix(f,{dataValidation:function(j){j=j||{};return function(){var k=this,l=j.validateCondition?"\u6821\u9a8c\u5931\u8d25":"\u5f00\u59cb\u65f6\u95f4\u4e0d\u80fd\u5927\u4e8e\u7ed3\u675f\u65f6\u95f4!",p=j.text||l,o=j.compareData||"",n=o?a.getDateParse(o):a.clearTime().getTime(),m=j.validateCondition||function(q,r,s,t){if(t){return q>r}else{return false}};return function(s){var q=a.getDateParse(k.getStartCalendar().getTrigger().val()),r=a.getDateParse(k.getEndCalendar().getTrigger().val()),t=k.isJoin();if(t&&!q){return"\u8bf7\u8f93\u5165\u6709\u6548\u7684\u5f00\u59cb\u65f6\u95f4!"}else{if(t&&!r){return"\u8bf7\u8f93\u5165\u6709\u6548\u7684\u7ed3\u675f\u65f6\u95f4!"}else{if(m(q,r,n,t)){return a.formatText(p,o)}}}}}},rules:{endBeforeNow:function(){return f.dataValidation({text:"\u7ed3\u675f\u65e5\u671f\u4e0d\u80fd\u5927\u4e8e\u4eca\u5929\uff01",validateCondition:function(j,k,l,m){return k>l}})},startAfterNow:function(){return f.dataValidation({text:"\u5f00\u59cb\u65e5\u671f\u4e0d\u80fd\u5c0f\u4e8e\u4eca\u5929\uff01",validateCondition:function(j,k,l,m){return j<l}})}}});d.namespace("LP");d.LP.Calendar=a;d.LP.JoinCalendar=f},{requires:["calendar","lpmodule/css/module.css"]});
