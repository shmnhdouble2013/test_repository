/**
 * 导航二级菜单
 * @author: 水木年华double
 * @data: 13-6-27 晚上 20:16
 * todo: up
 */

KISSY.add('brandsite/1.0/widget/brandnav', function(S, D, E){

   function BrandNav(config){   
        var _self = this;

        BrandNav.superclass.constructor.call(_self, config);       
        
        _self._init();  
    }

    S.extend(BrandNav, S.Base);
    S.augment(BrandNav, {
        _init: function() {
            var _self = this;
           
           _self._iniEvent();
        },

        _iniEvent: function(){
            var _self = this;

            // 移动到一级菜单ul边框颜色 和 二级菜单结合
            E.on('.j_mainList-li', 'mouseover mouseout', function(el){
               var eventType = el.type;
                // li 效果    
                _self._entypefn( el, eventType); 
            });
        },

        // 查看专辑 -- 动画效果和 由大背景切入时 背景蒙版 隐藏显示控制 --修复mouseleave 不冒泡的bug
        _entypefn: function(el, eventType){ 
            var _self = this,
                thisobj = el.currentTarget,
                currTarget = el.target,                
                currTa = D.first(thisobj, '.j_main-a'),
                currTul = D.next(currTa, '.j_send-ul');
            
            var isMain = D.hasClass(currTarget, 'j_main-a'), // 是否是 主导航栏 a标签;  j_main-a`                             
                currtLi_Width = D.width(thisobj);            

            if(eventType == 'mouseout'){          
                // 移除一级导航a标签样式 ---隐藏二级菜单
                D.removeClass( currTa, 'lia-hover-clor lia-out-clor' );
                D.hide(currTul);

                if(isMain) {
                    // D.addClass( currTa, 'lia-out-clor' );
                }
            }else if(eventType == 'mouseover'){
                // 赋值宽度
				if(currtLi_Width && currTul){
                    D.width(currTul, currtLi_Width);
                    D.show( currTul );        
                }

                // 添加一级导航a标签 hover效果
                D.addClass( currTa, 'lia-hover-clor' );              
            }           
        }
        
    });

    return BrandNav;

}, {
    requires: [
        'dom',
        'event'
    ]
});