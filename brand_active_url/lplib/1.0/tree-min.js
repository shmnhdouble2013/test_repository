KISSY.add(function(a){function b(e){var d={nodeData:[],useAjax:false,ajaxUrl:"",containId:"tree",showCheckbox:false,checkBoxName:"a",containId:"tree",showAll:false,selectValue:""};d=a.merge(d,e);this.selectedNodeId="";var l=this;var j=true;this.events=["select"];function k(){a.Event.remove(".min","click");a.Event.remove(".more","click");a.Event.remove(".emptyMore","click");var p=['<ul class="tree">'];p[p.length]=m();j=false;p[p.length]="</ul>";a.one("#"+d.containId).html(p.join(""));g()}this.initSelect=function(){if(d.selectValue!==""){var p=a.one(".selectNode");if(p.length>0){o.call(a.one(".selectNode")[0]);l.fire("select",l.getSelectValue())}}};this.getSelectValue=function(){var t=[];var u={};var p=this.selectedNodeId.split("-");if(p.length>1){var s=d.nodeData;for(var r=1;r<p.length-1;r++){t[t.length]=s[parseInt(p[r])]["text"];s=s[parseInt(p[r])]["child"]}t[t.length]=s[parseInt(p[p.length-1])]["text"];u=s[parseInt(p[p.length-1])]}var q={oData:{text:u.text,value:u.value},aDes:t};return q};function h(t){var q=this.parentNode.id;var r=[];var s=this;if(t==="min"){a.all('li[id ^= "'+q+'-"]').remove();f.call(this,t,r)}else{if(t==="more"){var u=c(q);if(!u.isLeaf){if(d.useAjax){if(d.getting){return}d.getting=true;var p=n("",parseInt(s.parent()[0].getAttribute("emptynum"))+1,"treeCacheImg",true);if(a.one("#treeCacheImg")){a.one("#treeCacheImg").remove()}a.one(a.DOM.create(p)).insertAfter(this.parentNode);a.ajax({type:"POST",url:d.ajaxUrl,data:{dataPath:q.substr(2)},dataType:"json",success:function(v){if(a.one("#treeCacheImg")){a.one("#treeCacheImg").remove()}d.getting=false;u.child=v;i.call(s,u,q,r);f.call(s,t,r)}})}else{i.call(s,u,q,r);f.call(s,t,r)}}}else{o.call(s)}}}function o(){if(l.selectedNodeId!==""&&document.getElementById(l.selectedNodeId)){a.one("#"+l.selectedNodeId)[0].children[0].style.backgroundColor="";a.one("#"+l.selectedNodeId)[0].style.color="#333333"}l.selectedNodeId=this.id;this.children[0].style.backgroundColor="#4058b2";this.style.color="white";l.fire("select",l.getSelectValue())}function f(r,q){a.one(this).replaceClass(r,r==="more"?"min":"more");a.one(this).detach();a.one(this).on("click",function(s){h.call(this,r==="more"?"min":"more")});for(var p=0;p<q.length;p++){if(document.getElementById("t"+q[p])){a.one(document.getElementById("t"+q[p])).detach();a.one(document.getElementById("t"+q[p])).on("click",function(s){h.call(this,this.className)})}}}function i(t,p,r){var s=[];for(var q=0;q<t.child.length;q++){s[s.length]=n(t.child[q],parseInt(this.parentNode.getAttribute("emptynum"))+1,p+"-"+q);r[r.length]=p+"-"+q}a.one(a.DOM.create(s.join(""))).insertAfter(this.parentNode)}function g(){a.all(".min").on("click",function(p){h.call(this,"min")});a.all(".more").on("click",function(p){h.call(this,"more")});a.all(".emptyMore").on("click",function(p){h.call(this,"emptyMore")})}function c(r){var q=r.split("-");var s=d.nodeData[q[1]];for(var p=2;p<q.length;p++){s=s.child[q[p]]}return s}function m(u,v,t){var p=[],s=d.showAll;if(u){if(!u.isLeaf){var w=u.child;for(var r=0;r<w.length;r++){p[p.length]=n(w[r],v,t+"-"+r);if(s){p[p.length]=m(w[r],v+1,t+"-"+r)}}}}else{var q=d.nodeData;for(var r=0;r<q.length;r++){p[p.length]=n(q[r],0,"i-"+r);if(s){p[p.length]=m(q[r],1,"i-"+r)}}}return p.join("")}function n(v,u,t,r){u=parseInt(u);var q;if(r){q='<li id="'+t+'" emptynum="'+u+'">'+new Array(u+1).join('<span class="empty" ></span>')+'<img src="http://img02.taobaocdn.com/tps/i2/T16WJqXaXeXXXXXXXX-32-32.gif" width="20" height="20" /></li>'}else{var s="more";if(d.showAll&&j){s="min"}if(a.one("#treeCacheImg")){a.one("#treeCacheImg").remove()}var p=[];p[p.length]='<li id="'+t;p[p.length]='" emptynum="'+u;p[p.length]='">'+new Array(u+1).join('<span class="empty" ></span>');p[p.length]='<span class="'+(v.isLeaf?"emptyMore":s);if(v.value===d.selectValue){p[p.length]=' selectNode"'}else{p[p.length]='"'}p[p.length]=' id="t'+t+'">';p[p.length]=(!v.isLeaf||!d.showCheckbox?"":'<input type="checkbox" id="c-'+t+'" name="'+d.checkBoxName+'[]" value="'+v.value+'" class="selectInput" />');p[p.length]="<label>"+v.text;p[p.length]="</label></span></li>";q=p.join("")}return q}k()}a.extend(b,a.Base);a.namespace("LP");a.LP.Tree=b},{requires:["core","sizzle","./css/tree.css"]});