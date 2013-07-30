/**
* @fileOverview èƷ��վ ��׼��ҳ��--��ർ����--������ �ֲ��б�ģ��js 
* @extends  KISSY.Base
* @creator �Ƽף�������ˮľ�껪double��<huangjia2015@gmail.com>
* @depends  ks-core��gallery/slide/1.0/--Slide
* @version 1.0
* @update 2013-04-18
* @example
*    new AuthShops('distribList', {
*		triggerSelector:'li a',
*		autoSlide:false,
*		hoverStop:true, 
*		effect:'none' // ��Ч��
*	});
*/
KISSY.add('brandsite/1.0/widget/authshops', function(S, Slide){ 
	var Event = S.Event,
		DOM = S.DOM,
		Anim = S.Anim,
		Ajax = S.io,
		UA = S.UA,
		win = window,
		doc = document;
		
	function AuthShops(container, config){	
		var _self = this;
		
		_self.container = container;  	
		_self.config = S.get(config);  	
		
		AuthShops.superclass.constructor.call(_self, config);	  	
		
		_self._init();	
	}

	S.extend(AuthShops, S.Base);
	S.augment(AuthShops, {		
		// ��ʼ������
		_init: function(){
			var _self = this;
			
			_self._renderSwitchable();
		},
				
		// ��ʼ�� ��Ȩ����li�ֲ� ���
		_renderSwitchable: function(){
			var _self = this;
			var slideConfig = {
				eventType:'mouseenter',
				navClass:'ui-slide-nav-mini', 		 //���������� ul class 
				contentClass:'j_scrolLableContent',  // �ֲ����� class�� �ֲ�����div �������� 
				pannelClass:'j_scrolLableContent',   // �ֲ�����div class 
				selectedClass:'j_active',			// ��ǰ�ֲ� ������ class 
				triggerSelector:'li',				// �ֲ� ������ dom�ṹ
				autoSlide:true,
				hoverStop:true, 
				effect:'none' // ��ֱ�л�
			};
			
			slideConfig = S.merge(slideConfig, _self.config);
			new Slide( _self.container, slideConfig);
		}
	});	
	
	return AuthShops;	
},{requires:['gallery/slide/1.0/']});