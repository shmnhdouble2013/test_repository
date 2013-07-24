/**
 * ���������˵�
 * @author: ˮľ�껪double
 * @data: 13-6-27 ���� 20:16
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

            // �ƶ���һ���˵�ul�߿���ɫ �� �����˵����
            E.on('.j_mainList-li', 'mouseover mouseout', function(el){
               var eventType = el.type;
                // li Ч��    
                _self._entypefn( el, eventType); 
            });
        },

        // �鿴ר�� -- ����Ч���� �ɴ󱳾�����ʱ �����ɰ� ������ʾ���� --�޸�mouseleave ��ð�ݵ�bug
        _entypefn: function(el, eventType){ 
            var _self = this,
                thisobj = el.currentTarget,
                currTarget = el.target,                
                currTa = D.first(thisobj, '.j_main-a'),
                currTul = D.next(currTa, '.j_send-ul');
            
            var isMain = D.hasClass(currTarget, 'j_main-a'), // �Ƿ��� �������� a��ǩ;  j_main-a`                             
                currtLi_Width = D.width(thisobj);            

            if(eventType == 'mouseout'){          
                // �Ƴ�һ������a��ǩ��ʽ ---���ض����˵�
                D.removeClass( currTa, 'lia-hover-clor lia-out-clor' );
                D.hide(currTul);

                if(isMain) {
                    // D.addClass( currTa, 'lia-out-clor' );
                }
            }else if(eventType == 'mouseover'){
                // ��ֵ���
				if(currtLi_Width && currTul){
                    D.width(currTul, currtLi_Width);
                    D.show( currTul );        
                }

                // ���һ������a��ǩ hoverЧ��
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