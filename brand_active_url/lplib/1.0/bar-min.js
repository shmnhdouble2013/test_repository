KISSY.add(function(f){var w=f.DOM,s=f.Node;function E(L){L+="";return L.charAt(0).toUpperCase()+L.substring(1)}var J="_uiSet",i="disabled",t="lp-item-disabled",y="bar-item",m="bar-btn-container",n="bar-btn-custom",A="bar-item-btn",z="bar-item-over",h="bar-item-separator",e="pb-item-input",x="pb-input-container",B="pb-text-container",j="pb-total-count",d="pb-total-page",v="bar-icon-button",c="pb-page-first",K="pb-page-last",D="pb-page-next",g="pb-page-prev",l="pb-page-ok",o="pagging-bar",k="bar-icon",F="button-bar";function u(M){var L=this;M=f.merge({isBarItem:true,css:""},M);f.mix(L,M);u.superclass.constructor.call(L,M);L._init()}f.extend(u,f.Base);f.augment(u,{attachEvent:function(){var L=this,M=L.get("el");if(M){if(L.handler){M.on("click",L.handler)}}},renderTo:function(N){if(this.get("el")){this.get("el").addClass(y);return this.get("el")}var L=this,M=L._getItemTemplate(),O=new f.Node(M).appendTo(N);O.addClass(y);L.set("el",O);return O},_bindUI:function(){var N=this,O=N.__attrs,M,L;for(M in O){if(O.hasOwnProperty(M)){N.on("after"+E(M)+"Change",function(P){N[M]=P.newVal});L=J+E(M);if(N[L]){(function(Q,P){N.on("after"+E(Q)+"Change",function(R){N[P](R.newVal,R)})})(M,L)}}}},_getItemTemplate:function(){return""},_init:function(){var L=this;L._bindUI()},destroy:function(){var L=this,M=L.get("el");M.remove();L.detach();L.__attrVals={}}});function I(M){var L=this;I.superclass.constructor.call(L,M)}f.extend(I,u);f.augment(I,{attachEvent:function(){var L=this,M=L.get("el");I.superclass.attachEvent.call(L);if(M){M.on("mouseover",function(N){if(!M.hasClass(t)){M.addClass(z)}}).on("mouseout",function(N){M.removeClass(z)})}},_getItemTemplate:function(){var L=this,R=L.disabled?t:"",O=L.disabled?'disabled="disabled"':"",M=L.text?n:"",P=L._getIconTpl(L.icon),Q=P?v:"",N=['<div data-id="',L.id,'" class="',m," ",R," ",L.containerCss,' "><button class="bar-item-btn ',Q,'" autocomplete="off" hidefocus="true" ',O,' type="button">',P,L.text,"</button></div>"].join("");return N},_getIconTpl:function(L){if(L){return' <div class="x-icon x-icon-small x-icon-'+L.type+'">'+L.content+"</div>"}return""},_uiSetDisabled:function(O){var L=this,N=L.get("el"),M=N.one("button");if(O){N.addClass(t);M.attr(i,"");N.removeClass(z)}else{N.removeClass(t);M.removeAttr(i)}}});var a=function(M){var L=this;a.superclass.constructor.call(L,M)};f.extend(a,I);f.augment(a,{_getItemTemplate:function(){var L=this,P=L.disabled?t:"",O=L.disabled?'disabled="disabled"':"",M=L.text?n:"",N=['<div id="',L.id,'" class="',m," ",P," ",L.containerCss,'"><button class="',A," pb-page-btn ",L.css,'" autocomplete="off" hidefocus="true" ',O,' type="button">',L.text,"</button></div>"].join("");return N}});function p(M){var L=this;p.superclass.constructor.call(L,M)}f.extend(p,u);f.augment(p,{_getItemTemplate:function(){var L=this;return['<div id="',L.id,'"  class="',B,L.css,'">',L.text,"</div>"].join("")}});function q(M){var L=this;q.superclass.constructor.call(L,M)}f.extend(q,u);f.augment(q,{_getItemTemplate:function(){var L=this;return'<div class="'+h+'"></div>'}});function C(M){var L=this;C.superclass.constructor.call(L,M)}f.extend(C,u);f.augment(C,{_getItemTemplate:function(){var L=this;return['<div id="',L.id,'"  class="',B,'"><a class="',L.css,'" href = "',L.href,'">',L.text,"</a></div>"].join("")}});function b(M){var L=this;b.superclass.constructor.call(L,M)}f.extend(b,u);f.augment(b,{_getItemTemplate:function(){var L=this;return f.substitute(L.template,L)}});u.types={button:I,pageButton:a,text:p,link:C,custom:b,seperator:q};function H(M){var L=this;M=M||{};H.superclass.constructor.call(L,M);L._init()}f.extend(H,f.Base);f.augment(H,{CLS_BAR:"",_findItem:function(L){if(w.hasClass(L,m)){return L}else{return w.parent(L,"."+m)}},_getBarTemplate:function(){return'<div class="lp-bar-container"></div>'},_init:function(){var L=this,N=L.get("items"),R=L.get("defaults"),Q=null,M=null;for(var O=0,P=N.length;O<P;O++){Q=f.merge(R,N[O]);if(f.isUndefined(Q.id)){Q.id=O}if(!Q.isBarItem){M=u.types[Q.type||"text"];if(!M){M=u.types.text}N[O]=new M(Q)}}L._initDOM();L._initEvent()},_initDOM:function(){var L=this,P=L._getBarTemplate(),Q=L.get("renderTo"),M=f.isObject(Q)?Q:w.get("#"+Q),O=L.get("items"),N=new s(P).appendTo(M);L.set("bar",N);f.each(O,function(S,R){S.renderTo(N)});w.addClass(M,L.CLS_BAR);w.show(M)},_initEvent:function(){var L=this.get("items");f.each(L,function(M){M.attachEvent()})}});function r(M){var L=this;M=L._formatConfig(M||{});r.superclass.constructor.call(L,M)}f.extend(r,H);f.augment(r,{CLS_BAR:F,_formatConfig:function(N){var L={renderTo:N.renderTo,items:[]},M=N.buttons||N.items;f.each(M,function(O){var P=f.merge({type:"button"},O);L.items.push(P)});return L}});function G(M){var L=this;M=L._formatConfig(M||{});f.mix(L,{start:0,end:0,totalCount:0,curPage:1,totalPage:1});G.superclass.constructor.call(L,M)}f.extend(G,H);f.augment(G,{CLS_BAR:o,_afterStoreLoad:function(S,M){var R=this,Q=R.get("pageSize"),L=0,N=0,T=0,P=1,O=1;if(M){L=M.start||0}else{L=0}T=S.getTotalCount();N=T-L>Q?L+S.getCount():T;O=parseInt((T+Q-1)/Q,10);O=O>0?O:1;P=parseInt(L/Q,10)+1;R.start=L;R.end=N;R.totalCount=T;R.curPage=P;R.totalPage=O;R._setAllButtonsState();R._setNumberPages()},_findItem:function(L){if(w.hasClass(L,m)){return L}else{return w.parent(L,"."+m)}},_getBarTemplate:function(){return'<div class="fr"></div>'},_getButtonConfig:function(P,M,N,O){var L=this;return{id:P,type:"pageButton",css:M,text:O,containerCss:O?n:"",disabled:!!N,handler:function(S){var R=L._findItem(S.target),Q=f.one("button",R);if(!w.hasClass(R,t)){L._pageAction(Q)}}}},_getPageInfoConfig:function(){var L=['<div><span class="',B," ",d,'">\u5171 0 \u9875</span><span class="',B,'">\u7b2c</span><span class="',x,'"><input type="text" autocomplete="off" class="',e,'" size="20" name="inputItem"> \u9875</span></div>'].join("");return{type:"custom",template:L}},_getCountInfoConfig:function(){var L=['<div class="',B,'">\u5171 <span class="',j,'">0</span> \u6761\u8bb0\u5f55</div>'].join("");return{type:"custom",template:L}},_formatConfig:function(O){var M=this,N=[],L=f.merge(O,{items:N});N.push(M._getButtonConfig("btnfirst",c,true));N.push(M._getButtonConfig("btnpre",g,true));N.push({type:"seperator"});N.push(M._getPageInfoConfig());N.push(M._getButtonConfig("btnok",l,false,"\u8df3\u8f6c"));N.push({type:"seperator"});N.push(M._getButtonConfig("btnnext",D,true));N.push(M._getButtonConfig("btnlast",K,true));N.push({type:"seperator"});N.push(M._getCountInfoConfig());return L},_initEvent:function(){this.constructor.superclass._initEvent.call(this);var L=this,M=L.get("store"),N=L.get("bar");if(M){M.on("load",function(O){L._afterStoreLoad(M,O)})}N.one("."+e).on("keyup",function(P){P.stopPropagation();if(P.keyCode===13){var O=f.one(this),Q=parseInt(O.val(),10);if(L._isPageAllowRedirect(Q)){L.skipToPage(Q)}else{O.val(L.curPage)}}})},_isPageAllowRedirect:function(M){var L=this;return M&&M>0&&M<=L.totalPage&&M!==L.curPage},_pageAction:function(M){var L=this,P=1;if(M.hasClass(c)){P=1}else{if(M.hasClass(D)){P=L.curPage+1}else{if(M.hasClass(g)){P=L.curPage-1}else{if(M.hasClass(K)){P=L.totalPage}else{if(M.hasClass(l)){var N=L.get("bar"),Q=N.one("."+e),O=parseInt(Q.val(),10);if(L._isPageAllowRedirect(O)){P=O}else{Q.val(L.curPage);return}}}}}}L.skipToPage(P)},skipToPage:function(P){var L=this,N=L.get("store"),M=L.get("pageSize"),O=P-1,R=O*M;var Q=L.fire("beforepagechange",{from:L.curPage,to:P});if(N&&Q!==false){N.load({start:R,limit:M,pageIndex:O})}},_setAllButtonsState:function(){var L=this,N=L.get("store"),M=L.get("items");function O(Q,P){f.each(M,function(R){if(f.inArray(R.id,Q)){R.set("disabled",!P)}})}if(N){O(["btnpre","btnnext","btnfirst","btnlast","btnok"],true)}if(L.curPage===1){O(["btnpre","btnfirst"],false)}if(L.curPage===L.totalPage){O(["btnnext","btnlast"],false)}},_setNumberPages:function(){var L=this,O=L.get("bar"),N=O.one("."+e),P=O.one("."+d),M=O.one("."+j);if(N&&P){N.val(L.curPage);P.text("\u5171 "+L.totalPage+" \u9875")}if(M){M.text(L.totalCount)}}});f.namespace("LP");f.LP.Bar=H;f.LP.ButtonBar=r;f.LP.PaggingBar=G;f.LP.BarItem=u;f.LP.ButtonBarItem=I;f.LP.TextBarItem=p;f.LP.LinkBarItem=C;f.LP.CustomBarItem=b;f.LP.SeperatorBarItem=q},{requires:["core","./uicommon","./css/bar.css"]});