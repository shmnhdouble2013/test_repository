KISSY.add(function(b){var d=b.DOM,a=b.Node;function c(f){var e=this;f=f||{};f=b.merge(c.config,f);c.superclass.constructor.call(e,f);e._init()}c.config={};b.extend(c,b.Base);b.augment(c,{_init:function(){var e=this;e._initDOM();e._initEvent()},_initDOM:function(){var e=this,g=b.one(e.get("fileInputId"));g.attr({size:28});g.addClass("fileInput");f();function f(){var i='<input type="text" id="filename" class="textInput"/> <input type="button" id="browserBtn" value="\u6d4f\u89c8" class="fileInputBtn" />',h=b.one(e.get("fileInputId")).parent();return new a(i).appendTo(h)}},_initEvent:function(){var e=this,f=b.one(e.get("fileInputId"));b.one("#browserBtn").on("mouseover",function(){f.css({display:"inline",width:"238px",height:"22px"})});f.on("change",function(){b.one("#filename").val(b.trim(f.val()))})}});return c},{requires:["core"]});