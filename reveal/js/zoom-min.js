(function(){var a=true;document.querySelector(".reveal").addEventListener("mousedown",function(b){if(b.altKey&&a){b.preventDefault();zoom.to({element:b.target,pan:false})}});Reveal.addEventListener("overviewshown",function(){a=false});Reveal.addEventListener("overviewhidden",function(){a=true})})();
/*
 * zoom.js 0.2 (modified version for use with reveal.js)
 * http://lab.hakim.se/zoom-js
 * MIT licensed
 *
 * Copyright (C) 2011-2012 Hakim El Hattab, http://hakim.se
 */
var zoom=(function(){var a=1;var f=0,d=0;var e=-1,i=-1;var b=null;var h="WebkitTransform" in document.body.style||"MozTransform" in document.body.style||"msTransform" in document.body.style||"OTransform" in document.body.style||"transform" in document.body.style;if(h){document.body.style.transition="transform 0.8s ease";document.body.style.OTransition="-o-transform 0.8s ease";document.body.style.msTransition="-ms-transform 0.8s ease";document.body.style.MozTransition="-moz-transform 0.8s ease";document.body.style.WebkitTransition="-webkit-transform 0.8s ease"}document.addEventListener("keyup",function(k){if(a!==1&&k.keyCode===27){zoom.out()}},false);document.addEventListener("mousemove",function(k){if(a!==1){f=k.clientX;d=k.clientY}},false);function g(q,o,p,n,m){if(h){var k=q+"px "+o+"px",l="translate("+-p+"px,"+-n+"px) scale("+m+")";document.body.style.transformOrigin=k;document.body.style.OTransformOrigin=k;document.body.style.msTransformOrigin=k;document.body.style.MozTransformOrigin=k;document.body.style.WebkitTransformOrigin=k;document.body.style.transform=l;document.body.style.OTransform=l;document.body.style.msTransform=l;document.body.style.MozTransform=l;document.body.style.WebkitTransform=l}else{if(m===1){document.body.style.position="";document.body.style.left="";document.body.style.top="";document.body.style.width="";document.body.style.height="";document.body.style.zoom=""}else{document.body.style.position="relative";document.body.style.left=(-(q+p)/m)+"px";document.body.style.top=(-(o+n)/m)+"px";document.body.style.width=(m*100)+"%";document.body.style.height=(m*100)+"%";document.body.style.zoom=m}}a=m;if(a!==1&&document.documentElement.classList){document.documentElement.classList.add("zoomed")}else{document.documentElement.classList.remove("zoomed")}}function j(){var k=0.12,n=window.innerWidth*k,m=window.innerHeight*k,l=c();if(d<m){window.scroll(l.x,l.y-(1-(d/m))*(14/a))}else{if(d>window.innerHeight-m){window.scroll(l.x,l.y+(1-(window.innerHeight-d)/m)*(14/a))}}if(f<n){window.scroll(l.x-(1-(f/n))*(14/a),l.y)}else{if(f>window.innerWidth-n){window.scroll(l.x+(1-(window.innerWidth-f)/n)*(14/a),l.y)}}}function c(){return{x:window.scrollX!==undefined?window.scrollX:window.pageXOffset,y:window.scrollY!==undefined?window.scrollY:window.pageXYffset}}return{to:function(l){if(a!==1){zoom.out()}else{l.x=l.x||0;l.y=l.y||0;if(!!l.element){var m=20;l.width=l.element.getBoundingClientRect().width+(m*2);l.height=l.element.getBoundingClientRect().height+(m*2);l.x=l.element.getBoundingClientRect().left-m;l.y=l.element.getBoundingClientRect().top-m}if(l.width!==undefined&&l.height!==undefined){l.scale=Math.max(Math.min(window.innerWidth/l.width,window.innerHeight/l.height),1)}if(l.scale>1){l.x*=l.scale;l.y*=l.scale;var k=c();if(l.element){k.x-=(window.innerWidth-(l.width*l.scale))/2}g(k.x,k.y,l.x,l.y,l.scale);if(l.pan!==false){e=setTimeout(function(){i=setInterval(j,1000/60)},800)}}b=l}},out:function(){clearTimeout(e);clearInterval(i);var k=c();if(b&&b.element){k.x-=(window.innerWidth-(b.width*b.scale))/2}g(k.x,k.y,0,0,1);a=1},magnify:function(k){this.to(k)},reset:function(){this.out()},zoomLevel:function(){return a}}})();
