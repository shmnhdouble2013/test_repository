/**
* 代码修改自gallery
* dafeng.xfd@taobao.com
*/
KISSY.add('tbs-back/anti-ie6', function (S) {
    ;(function(doc, undefined) {

        var anti_ie6 = {

            //template
            template: [ '亲~看见您还在使用这么古老的浏览器，小猫非常心痛，建议您升级浏览器享受更棒的体验',
                '<a class="anti-ie6-top-ie8" href="http://www.google.cn/intl/zh-CN/chrome" target="_blank">chrome浏览器</a>',
                '<a class="anti-ie6-top-taobao" href="http://download.taobaocdn.com/client/browser/download.php">淘宝浏览器</a>',
                '<i class="anti-ie6-top-close" id="fieKeepIE6">k</i>'].join(''),

            //css
            style: ".anti-ie6-top{zoom:1;position:relative;height:25px;text-align:center;padding-top:4px;background:#901200;color:white;font-size:14px}.anti-ie6-top a{color:white;text-decoration:none}.anti-ie6-top a:hover{text-decoration:underline}.anti-ie6-top-taobao,.anti-ie6-top-ie8{background:url(http://img03.taobaocdn.com/tps/i3/T1XwB9FoXXXXaI9AYa-19-46.png) no-repeat}.anti-ie6-top-close{position:absolute;top:0px;right:12px;width:20px;height:20px;font-family: 'tmallbrandsite';font-style:normal;font-size:22px;cursor:pointer;font-weight:bold;}.anti-ie6-top-taobao{padding-left:22px;margin-left:25px;background-position:0 -25px}.anti-ie6-top-ie8{padding-left:22px;margin-left:30px;background-position:0 -1px;}",

            init: function() {
                var tmpl = this.template;
                var styleString = this.style;
                var body = doc.body;
                var head = doc.getElementsByTagName('head')[0];

                //create style
                var style = doc.createElement('style');
                style.type = "text/css";
                style.media = "screen";

                if (style.styleSheet) { //for ie
                    style.styleSheet.cssText = styleString;
                } else {
                    style.appendChild(doc.createTextNode(styleString));
                }
                head.appendChild(style);

                //create wrapper
                this.div = doc.createElement('div');
                this.div.className = 'anti-ie6-top';
                this.div.innerHTML = tmpl;
                body.insertBefore(this.div, body.firstChild);

                //bind events
                this.bindEvents();
            },

            bindEvents: function () {
                var _this = this;
                var fieKeepIE6 = doc.getElementById('fieKeepIE6');
                fieKeepIE6.onclick = function(e) {
                    _this.div.parentNode.removeChild(_this.div);
                };
            }
        };

        S.ready(function(){
            if(S.UA.ie !==6 && S.UA.ie !==7 ){
                return;
            }
            anti_ie6.init();
        });
    })(document);
});
/**
 *品牌运营后台布局导航模块
 */
;KISSY.add('tbs-back/nav',function(S,Template){
    'use strict';
    var D = S.DOM,E = S.Event,Base = S.Base,
        header = '#header',
        mainNav = '#mainNav',
        headerCon = '.headerCon',
        subNav = '#subNav',
        tmallLogo = '#mallLogo',
        subLogo = '#subLogo',
        iconFontMap = {
            101:'d',
            102:'B',
            103:'a',
            104:'b',
			105:'c',
			106:'A',
			107:'e',
			108:'f'
        },
        ajaxAPI = '/json/navMenu.htm';
    /**
     * @constructor
     */
    function Nav(){
        var self = this;
        self.TPL = '{{#each data}}'+
                    '<li class="autoShow {{shortName}} fireButton">'+
                        '<a class="item {{shortName}}" href="{{href}}">'+
                            '<i class="icon">{{iconIndex}}</i>'+
                            '<span class="label">{{title}}</span>'+
                        '</a>'+
						'<div class="show-sub" data="{{id}}"></div>'+
                    '</li>'+
                    '{{/each}}';
        self.hideTPL = '<li class="autoHide fireButton">'+
                            '<b class="arrow">j</b>'+
							'<div>'+
								'<ul>'+ self.TPL +'</ul>'+
							'</div>'+
						'</li>';
		self.showTPL = '<ul>'+
		                    '{{#each data}}'+
							'<li><a href="{{href}}">{{title}}</a></li>'+
							'{{/each}}'
						'</ul>';
        self.init();
    }
    S.augment(Nav,Base,{
        init:function(){
            var self = this;
            self.set('getData',false);
            self._data ={};
            self.d = {};
            self.bindEvent();
            self.subNavMap = {};
        },
        addIconFont:function(d){
            var self = this;
            S.each(d.data,function(i){
                i['iconIndex'] = (iconFontMap[i.id]);
            });
            return d;
        },
        createNav:function(num){
            var self = this;
            D.css(headerCon,{
                'overflow':'hidden'
            });
            if(!self.get('getData')){
               S.io({
                   url: ajaxAPI,
                   type:'post',
                   success:function(d){
                       self.set('getData',true);
                       self.d = S.JSON.parse(d);
                       if(self.d.success){
                          self.renderNav(num);
                       }else{

                       }
                   }
               });
             }else{
                   self.renderNav(num);
             }
        },
        renderNav:function(num){
            var self = this,
                HTML,hideHTML='',
                tempData = S.clone(self.addIconFont(self.d));
                self._data.data = [];
            if(typeof(num) !== undefined){
              switch(num){
                 case 4:
                     for(var i = 0;i<6;i++){
                         if(!tempData.data.length){
                           break;
                         }
                         self._data.data.push(tempData.data.shift());
                     }
                     break;
                 case 3:
                     for(var i = 0;i<4;i++){
                       if(!tempData.data.length){
                         break;
                       }
                        self._data.data.push(tempData.data.shift());
                     }
                     break;
                 case 2:
                     for(var i = 0;i<2;i++){
                       if(!tempData.data.length){
                         break;
                       }
                        self._data.data.push(tempData.data.shift());
                     }
                     break;
                 case 1:
                     self._data.data.push();
                     break;
              }
              HTML =  new Template(self.TPL).render(self._data);
              if(tempData.data.length){
                  hideHTML = new Template(self.hideTPL).render(tempData);
              }
              D.html(mainNav,HTML+hideHTML);
            }else{
              HTML =  new Template(self.TPL).render(tempData);
            }
            D.html(mainNav,HTML+hideHTML);
            S.each(S.query('.show-sub'),function(i){
                self.renderSubNav(i,num);
            });
        },
        bindEvent:function(){
            var self = this;
            E.delegate(mainNav,'mouseenter mouseleave','.fireButton',function(e){
                var _target = e.target,
					_currentTarget = e.currentTarget,
                    _type = e.type;
                    D.css(headerCon,{
                        'overflow':'visible'
                    });

                if(D.hasClass(_target,'autoHide')){
                    var _div = D.get('div',_target);
                    if(_type =='mouseenter'){
                        D.show(_div);
                        D.removeClass((D.get('.active',headerCon)),'active');
                    }else if(_type == 'mouseleave'){
					    D.hide(_div);
                    }
                }else if(_target.nodeName == 'A'){
                     if(D.contains('.autoHide',_target)){
                         if(_type =='mouseleave'){
                             D.hide(D.parent(_target,3));
                         }else if(_type =='mouseenter'){
                             D.show(D.parent(_target,3));
                         }
                     }else{
                        if(D.hasClass(D.next(_target),'show-sub')){
                            var _next = D.next(_target),
                                _prev = D.prev(_target);
                            if(_type =='mouseleave'){
                                 self.hideSubNav(_next);
                            }else if(_type =='mouseenter'){
                                D.removeClass((D.get('.active',headerCon)),'active');
                                D.addClass(D.parent(_target),'active');
                                self.showSubNav(D.next(_target));
                            }
                        }else if(D.hasClass(D.parent(_target,3),'show-sub')){
                            if(_type =='mouseleave'){
                                 self.hideSubNav(D.parent(_target,3));
                                 D.removeClass(D.parent(_target,4),'active');
                            }
                        }
                     }
                 }else if(_target.nodeName == 'DIV'){
                     if(D.hasClass(_target,'show-sub')){
                         if(_type =='mouseleave'){
                             self.hideSubNav(_target);
                             D.removeClass((D.get('.active',headerCon)),'active');
                         }
                    }
                 }else if(_target.nodeName == 'LI'){
                     if(D.hasClass(D.parent(_target,2),'show-sub')){
                         if(_type =='mouseleave'){
                             self.hideSubNav(D.parent(_target,2));
                             D.removeClass(D.parent(D.prev(D.parent(_target,2))),'active');
                         }
                     }
                 }else if(_target.nodeName == 'I'){
                    if(D.contains('.autoHide',_target)){
                        if(_type =='mouseleave'){
                           D.hide(D.parent(_target,4));
                        }else if(_type =='mouseenter'){
                           D.show(D.parent(_target,4));
                        }
                    }
                }else if(_target.nodeName == 'SPAN'){
                    if(D.contains('.autoHide',_target)){
                        if(_type =='mouseleave'){
                           D.hide(D.parent(_target,4));
                        }else if(_type =='mouseenter'){
                           D.show(D.parent(_target,4));
                        }
                    }
                }else if(D.hasClass(_target,'arrow')){
                    if(e.type =='mouseenter'){
                        D.show(D.next(_target));
                        D.html(_target,'i');
                        D.removeClass((D.get('.active',headerCon)),'active');
                    }else if(e.type =='mouseleave'){
                        D.hide(D.next(_target));
                        D.html(_target,'j');
                    }
                }
            });
            E.delegate(document,'mouseenter',subLogo,function(){
                D.removeClass((D.get('.active',headerCon)),'active');
            });
        },
        renderSubNav:function(target,num){
            var self = this,
                id = D.attr(target,'data');
             if(typeof(self.subNavMap[id])=='undefined'){
               S.io({
                     url: ajaxAPI,
                     type:'post',
                     data:{
                         pid:id
                     },
                     success:function(d){
                        d = S.JSON.parse(d);
                        if(d.success){
                          self.subNavMap[id] = d;
                          self.insertSubNav(d,target,num);
                        }
                     }
                 });
             }else{
                self.insertSubNav(self.subNavMap[id],target,num);
             }
        },
        insertSubNav:function(d,target,num){
            var self = this,
                _ul,_dst;
            _dst = D.offset(D.prev(target)).left + D.outerWidth(D.prev(target))/2;
            target.__TPL = target.__TPL || new Template(self.showTPL).render(d);
            D.html(target,target.__TPL);
            _ul = D.get('ul',target);
            D.css(target,{
                width:D.outerWidth(header),
                left: -D.viewportWidth()*(num==1 ? 0: 0.05)
            });
            D.css(_ul,{
                left:_dst - D.outerWidth(_ul)/2
            });
        },
        showSubNav:function(target){
            D.css(target,{
                visibility:'visible'
            });
        },
        hideSubNav:function(target){
            D.css(target,{
                visibility:'hidden'
            });
        }
    });
    return Nav;
}, {requires: [
        'xtemplate',
        'tbs-back/anti-ie6'
    ]}
);