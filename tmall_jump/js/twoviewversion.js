/** 
* @fileOverview ����� ���ڿ�� ��� ����ͨ�÷���
* @extends  KISSY.Base
* @creator �Ƽף�������ˮľ�껪double��<huangjia2015@gmail.com>
* @depends  ks-core
* @version 1.0
* @update 2013-05-29
* @example
*   new MoreViewVersion({
*		aryRange: [480, 640, '750px', 768, '850px', 950, '990px', 1190, 1280],	// ��ؿ��ֵ ���鷶Χ	
*		isRealTimeEvent: false	// ��ؿ��ֵ ���鷶Χ	-- Ĭ�� true ʵʱ���	
*	});
*/

KISSY.add('twoviewversion', function(S){
	var Event = S.Event,
		DOM = S.DOM,
		Anim = S.Anim,
		Ajax = S.io,
		UA = S.UA,
		win = window,
		doc = document,
		body = doc.body;
		
	var RESNO = UA.mobile ? 0 : 10,						  // �ݲ�(������||��Ʋ��) ��� ��Χֵ 		
		LaterTime = UA.mobile ? 0 : 300, 				  // �ӳ�ִ��ʱ��0 -- 1�����ӳ� for mobile
		RANGENO = [480, 640, '750px', 768, '850px', 950, '990px', 1190, 1280]; // ��طֱ��ʷ�Χ 
		
	function MoreViewVersion(config){	
		var _self = this;
		
		if( !(_self instanceof MoreViewVersion) ){
			return new MoreViewVersion(config);
		}
		
		MoreViewVersion.superclass.constructor.call(_self, config);	  	
		
		_self._init();	
	}
	
	S.extend(MoreViewVersion, S.Base);
	S.augment(MoreViewVersion, {		
		
		// ��ʼ������
		_init: function(){
			var _self = this;
			
			// �ж���������
			_self._arguIf();
			
			// ��ʼ�� ��ȱ�ʾ
			_self._numbCompar();
			
			// ����resize�¼����
			_self._eventnit();
		},

		// ������� �����ж� + �����������
		_arguIf: function(){
			var _self = this;
			
			if(S.isArray( _self.get('aryRange') )){ 
				RANGENO = _self.get('aryRange');
			}else{
				console.log('δָ����ط�Χ���߲�������,ϵͳ�����Ĭ�Ϸ�Χֵ��');
			}
			_self._setWindowsView();			
		},			
		
		// �������
		_setWindowsView: function(){
			var _self = this;
			
			S.each(['_validAry', '_addRangeValue', 'sortAry'], function(str){
				RANGENO = _self[str](RANGENO);
			});	
		},		
		
		// �����ݲΧֵ
		_addRangeValue: function(ary){
			var _self = this,
				addNo = [];
			
			S.each(ary, function(val){
				addNo.push( val+RESNO );
			});
			
			return addNo;
		},
		
		// �������� --- ��С
		sortAry: function(ary){
			var _self = this;
			
			ary.sort(sortfn);
			
			function sortfn(a, b){
				return b-a;
			}
			return ary;
		},
		
		// ȥ�� + ����  ��֤(֧�ִ�px ��Χֵ�ַ���)----- ��ֵ����+����
		_validAry: function(ary){
			var _self = this,
				afterAry = [],
				ary = S.unique(ary);
				
			S.each(ary, function(val){
				var parseNum = parseInt(val, 10);

				if(S.isNumber(val)){
					afterAry.push(val);
				}else{
					if(S.isNumber(parseNum)){
						afterAry.push(parseNum);
					}
				}
			});			
			return afterAry;
		},
				
		// ��ֵ ��Χ�ȶ� -- д���־class
		_numbCompar: function(){
			var _self = this,
				compreValue = _self.oldViewWidth + RESNO,
				view = DOM.viewportWidth(), 
				aryEndIdx = RANGENO.length-1,
				thatWidth;
				
			// console.log('��ȱ�ʾֵ�ж��߼���ʼ���ã�');

			// �߽�ֵǰ���жϣ������ǰֵ >= || <= ���� ���/��Сֵ  �� �ϴ�classΪ ���/��С ֵ��ʾ�����˳� 
			if(view >= compreValue && compreValue === RANGENO[0] ){
				return;
			}else if(view <= compreValue && compreValue === RANGENO[aryEndIdx] ){
				return;
			}
						
			// ��ֵ��ȡ�ж��߼� 
			S.each(RANGENO, function(val, index){					
				if( view < val && index === aryEndIdx ){ // С�� �����κ�ֵ (��Сֵ����)
					thatWidth = val;
					return false;
				}else if( view >= val ){  // ���ڵ��� ���� �Ӵ�С ĳһֵ(���¼��ݲ���)
					thatWidth = val;
					return false;
				}
			});
			_self._writeBodyWth(thatWidth, _self.oldViewWidth);
		},
				
		// �¼���ʼ��
		_eventnit: function(){
			var _self = this,
				oCompare = S.buffer(_self._numbCompar, LaterTime, _self);
			
			// ��ȡ�� ʵʱ ��أ���ֱ���˳�
			if(_self.get('isRealTimeEvent') == false ){
				return;
			}
			//���� ���ڴ�С ����¼�
			Event.on(win, 'resize', oCompare);
		},	
		
		// bodyд�� ��ȱ�ʶ  ֻҪһ����ֵ���� --- ���Ƴ� ��д�� ��˳��
		_writeBodyWth: function(newView, oldView){
			var _self = this,
				newView = newView - RESNO; // ��ǰ���-�ݲ�ֵ = class�趨��ʾ��� ---- �����ֵ��ԭ�� �ݲ�֮ǰ��ֵ
			
			// ���д��ֵ �� �Ƴ�ֵһ�� �򲻴���
			if(newView === oldView){
				return;
			}
			
			// ����ֵ��д�� ��־class
			if(oldView){
				DOM.removeClass(body, 'w' + oldView);
			}
			
			if(newView){
				DOM.addClass(body, 'w' + newView);				
				// ��ʾ���ֵ -- ����̨��ʾ
				_self.oldViewWidth = newView;
				console.log('��ǰbody���class��ʾ��'+'w' + newView);
			}else{
				console.log('��Ч�Ŀ��ֵ��');
			}			
		}
	});
		
	return MoreViewVersion;
}, {requires:['core']});