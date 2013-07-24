/** 
* @fileOverview ��èƷ��վ ��׼��ҳ����ҳ----�Ҳ�ͼƬ ģ��js 
* @extends  KISSY.Base
* @creator �Ƽף�������ˮľ�껪double��<huangjia2015@gmail.com>
* @depends  ks-core
* @version 1.0
* @update 2013-05-08
* @example
*     new SubjectList(); 
*/
KISSY.add('brandsite/1.0/widget/subjectlist', function(S){ 
	var Event = S.Event,
		DOM = S.DOM,
		Anim = S.Anim,
		Ajax = S.io,
		UA = S.UA,
		win = window,
		doc = document;
		
	function SubjectList(config){	
		var _self = this;
			
		SubjectList.superclass.constructor.call(_self, config);	  	
		
		_self._init();	
	}

	S.extend(SubjectList, S.Base);
	S.augment(SubjectList, {		
		// ��ʼ������
		_init: function(){
			var _self = this;
			
			_self._eventnit();
		},
		
		// �¼���ʼ��
		_eventnit: function(){
			var _self = this;
			
			// �鿴ר�� ����Ч�� �޲� mouseout ����ð�� �� ʹ�� mouseleave ��ð�ݵ�ԭ�� ---- �޲�����  this === currentTarget��Զָ������¼���Ŀ����� vs target ��ǰ����
			Event.on(S.query('.j_designer'), 'mouseenter mouseleave', function(el){
				var eventType = el.type,					
					eventTarget = el.target; // �Ƿ��ǲ鿴ר�� a��ǩ;				
				_self._finedDetailPageOnly(eventType, this);
			});	
			
			//�󺣱� hover --- click --Ч��
			Event.on( S.query('.j_imgContainer'), 'mouseenter mouseleave click', function(el){
				var eventType = el.type,
					thisobj = el.currentTarget,
					eventTarget = el.target,
					isAtagAubum = DOM.hasClass(eventTarget, 'j_toaudum'); // �Ƿ��ǲ鿴ר�� a��ǩ;				
				_self._PosterHover(isAtagAubum, eventType, thisobj);
			});	
		},		
		
		// �鿴ר�� -- ����Ч���� �ɴ󱳾�����ʱ �����ɰ� ������ʾ���� --�޸�mouseleave ��ð�ݵ�bug
 		_finedDetailPageOnly: function(eventType, eventTarget){ 
			var _self = this,
				contantmaskingDom = S.one(eventTarget).parent().parent().last('.j_contantMasking'), 
				OutimeAnimObj = 'animObjOutime',  	// �뿪ʱ�� ��ʱ���� ��������
				OverimeAnimObj = 'animObjOverime';  // hoverʱ�� ��ʱ���� ��������
			
			if( eventType === 'mouseenter'){
				DOM.hide(contantmaskingDom);
				_self._cancelTimeout(OutimeAnimObj);	
				_self._dlayTimeDo(OverimeAnimObj, function(){
					_self._newAminobj({
						node:eventTarget,
						cssobj:{'left':'0px'},
						runTime:0.2
					});
				});			
			}else if(eventType === 'mouseleave'){	
				DOM.show(contantmaskingDom);
				_self._cancelTimeout(OverimeAnimObj);	
				_self._dlayTimeDo(OutimeAnimObj, function(){				
					_self._newAminobj({
						node:eventTarget,
						cssobj:{'left':'-80px'},
						runTime:0.2
					});
				});
			}
		},
		
		// �󺣱� hoveЧ��
		_PosterHover: function(isAtagAubum, eventType, thisObj){
			var _self = this,
				imghref = DOM.attr(thisObj, 'data-href'),
				nodeDom = DOM.last(thisObj);
				
			if(isAtagAubum){
				DOM.hide(nodeDom);  //ȷ���� a��ǩ �뿪ʱ ������ʱ�ɰ���ʧ
				return;				//ȷ���� a��ǩ hover out �������� ��Ӱ�� ����䶯 �������� �󱳾������ת
			}
			if( eventType === 'mouseenter'){
				DOM.show(nodeDom);
			}else if(eventType === 'mouseleave'){	
				DOM.hide(nodeDom);
			}if(eventType === 'click'){			
				window.open(imghref);
			}	
		},
		
		// ���÷��� ------ �ӳٴ�����
		_dlayTimeDo: function(cancelName, callback, isIntervalfn, time){
			var _self = this,
				time = 200 || time;
			
			if(time<1){
				return;
			}
			
			if(isIntervalfn){				
				_self.set(cancelName, setInterval( callback, time) );
			}else{
				_self.set(cancelName, setTimeout( callback, time) );
			}		
		},
		
		// ȡ���ӳ�ִ�� 
		_cancelTimeout: function(cancelTimeText, isIntervalfn){
			var _self = this,
				cancelTimeobj = _self.get(cancelTimeText);
				
			if(!cancelTimeobj){
				return;
			}
			
			if(isIntervalfn){
				clearInterval(cancelTimeobj);
			}else{
				clearTimeout(cancelTimeobj);
			}			
		},
		
		// ʵ��������
		/*
		*config
		*{
			node:_self.get('parentNode'),
			cssobj:{'left':'-80px'},
			runTime:0.3,
			EasingFn:''
			callBack:''		
		}
		*
		**/
		_newAminobj: function(config){
			var _self = this;
						
			if(!config.node || !config.cssobj){
				return;
			}
				
			var oldAminiObj = new Anim(config.node, config.cssobj, config.runTime || '', config.EasingFn || '', config.callBack || '' );
			oldAminiObj.run();
		}
	});	
	
	return SubjectList;	
},{requires:[]});