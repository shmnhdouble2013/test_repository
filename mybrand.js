/** 
* @fileOverview ��èƷ��վ ��׼��ҳ�� - ��ർ��--��ע +���� ģ�� js
* @extends  KISSY.Base
* @creator �Ƽף�������ˮľ�껪double��<huangjia2015@gmail.com>
* @depends  ks-core��tml/share
* @version 1.0
* @update 2013-05-20
* @example
*     new Mybrand({
*		 attentionContanier:'TMLSharaae1', // ��ע����id
		 attentionNoClass:'TMLSharfae1'	   // ��ע �� class
*	  });
*/

KISSY.add('brandsite/1.0/widget/mybrand', function(S, Share, Brand){ 
	var Event = S.Event,
		DOM = S.DOM,
		Anim = S.Anim,
		Ajax = S.io,
		UA = S.UA,
		win = window,
		doc = document;
		
	function Mybrand(config){	
		var _self = this;
			
		Mybrand.superclass.constructor.call(_self, config);	  	
		
		_self._init();	
	}

	S.extend(Mybrand, S.Base);
	S.augment(Mybrand, {		
		// ��ʼ������
		_init: function(){
			var _self = this;
			
			_self._eventInit();
			_self._renderLeftBrand();
		},		
		
		// �¼���ʼ��
		_eventInit: function(){
			var _self = this;
			
			// ����ƶ��� logoЧ��
			Event.on( S.query('.j_logoContainer'), 'mouseenter mouseleave', function(el){
				var eventType = el.type,					
					eventTarget = el.target;
				_self._goBrandHover(eventType);
			});	
			
			// �ɰ��ش�����
			Event.on('div.j_logo_mask', 'click', function(el){
				var eventTarget = el.target,
					urlStr = DOM.attr( DOM.first(eventTarget, 'a'), 'href' ) || '';
					
				_self._openUrl(urlStr);
			});	
		},
		
		// ��ʼ�� ����� --��ע 
		_renderLeftBrand: function(){
			var _self = this;
			var shareAttemtionConfig = {
				container: '#'+_self.get('attentionContanier'),  // ����������
				numEl: '.'+_self.get('attentionNoContainer'),    // ��ע������
				cancelCls: '.tm-bLb-cancel'						 // ȡ����ע��ʽ д��
			};
			
			new Brand(shareAttemtionConfig);
		},
		
		// ȥƷ��վ��ҳ hoverЧ��
		_goBrandHover: function(eventType){
			var _self = this;
				
			if(eventType === 'mouseenter'){
				DOM.show('div.j_logo_mask');
			}else if(eventType === 'mouseleave'){	
				DOM.hide('div.j_logo_mask');
			}
		},
		
		// �����ӷ���
		_openUrl:function(url){
			var _self = this,
				isUrl = /^http:\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]':+!]*([^<>""])*$/.test(url);
			
			if(isUrl){			
				window.open(url);
			}	
		}
	});	
	
	return Mybrand;	
},{requires:['tml/share', 'brandsite/1.0/widget/brand']});