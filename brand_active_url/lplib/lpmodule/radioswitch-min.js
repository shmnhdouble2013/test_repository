KISSY.add(function(c,f){var d=c.DOM,a=c.Event;var b="ks-hidden";function e(g){e.superclass.constructor.call(this,g);this._init()}e.ATTRS={container:{},trigger:{value:"input"},triggers:{value:[]},panels:{value:{}},attrname:{value:"data-show"},type:{value:"radio"}};c.extend(e,c.Base);c.augment(e,{_init:function(){this._initDOM();this._initEvent()},_initDOM:function(){this._initTrigger();this._initPanels()},_initEvent:function(){},_initTrigger:function(){var g=this,h=d.get(g.get("container"))||undefined,i=g.get("trigger"),j;if(i){j=d.query(i,h);g.set("container",h);g.set("triggers",j);g._TriggerEvent(j)}},_checkTrigger:function(h,g){var i=d.attr(h,"checked");if(i){d.removeClass(g,b)}else{d.addClass(g,b)}},_initPanels:function(){var g=this,h=g.get("container"),j=g.get("triggers"),k=g.get("attrname"),i={};c.each(j,function(o,n){var m=d.attr(o,k),l;if(m){l=d.get("#"+m,h);i[m]=l}else{j.splice(n,1)}});g.set("triggers",j);g.set("panels",i)},_TriggerEvent:function(h){var g=this,i=g.get("type"),j=g.get("attrname");a.on(h,"click",function(n){var p=this,l=g.get("panels"),o=g.get("current"),q=d.attr(p,j),k,m={};if(q&&(!o||i==="checkbox"||q!==o.name)){k=l[q];m.name=q;m.trigger=p;m.panel=k;if(false===g.fire("beforeChange",{current:o,next:m})){n.preventDefault();return}if(i==="radio"){g._hideOther(q)}g._checkTrigger(p,k);g.set("current",m);g.fire("change",{current:m})}})},_hideOther:function(i){var g=this,h=g.get("panels");c.each(h,function(j,k){if(k!==i){d.addClass(j,b)}})},setActived:function(i){var g=this,j=g.get("triggers"),h=j[i];a.fire(h,"click")},hideAll:function(){var g=this,i=g.get("triggers"),h=g.get("panels");c.each(i,function(j){d.attr(j,"checked",false)});c.each(h,function(j){d.addClass(j,b)});g.set("current",null)},addDependValid:function(i){if(!i){return}var g=this,j=g.get("triggers"),h=g.get("panels"),k=g.get("attrname");c.each(j,function(n){var m=d.attr(n,k),l=h[m];g._addDependRule(i,l,n)})},_addDependRule:function(h,g,l){if(!g){return}var j=d.query("*",g),i=h.config.attrname,m,k;c.each(j,function(n){var o=d.attr(n,i);if(o){m=d.attr(n,"id");k=h.get(m);if(k){k.addRule("depend",function(){if(d.attr(l,"checked")){return true}})}}})}});return e},{requires:["validation"]});
