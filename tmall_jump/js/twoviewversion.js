/** 
* @fileOverview ����� ���ڿ�� ��� ����ͨ�÷���
* @extends  KISSY.Base
* @creator �Ƽף�������ˮľ�껪double��<huangjia2015@gmail.com>
* @depends  ks-core
* @version 1.0
* @update 2013-05-29
* @example
*     new MoreViewVersion([720, 750, 990, 1080, 1190]);
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
		
	var RESNO = 0,						  				  // ���� ��� ��Χֵ 
		RANGENO = [550, 750, 850, 950, 990, 1190, 1280]; // ��طֱ��ʷ�Χ  
		
	function MoreViewVersion(config){	
		var _self = this;
		
		_self.config = config;
		
		if( !(_self instanceof MoreViewVersion) ){
			return new MoreViewVersion(config);
		}
		
		MoreViewVersion.superclass.constructor.call(_self);	  	
		
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
			
			if(S.isArray(_self.config)){
				RANGENO = _self.config;
			}else{
				S.log('δָ����ط�Χ���߲������飡');
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
		
		// ȥ�� + ����  ��֤
		_validAry: function(ary){
			var _self = this,
				afterAry = [],
				ary = S.unique(ary);
				
			S.each(ary, function(val){
				if(S.isNumber(val)){
					afterAry.push(val);
				}/* else{
					if( S.isNumber( parseInt(val, 10) ) ){
						afterAry.push(val);
					}
				} */
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
				
			// �߽�ֵ�ж� �����ǰֵ >= / <= ���� ���/��Сֵ  �� �ϴ�classΪ ���/��С ֵ��ʾ�����˳� 
			if(view >= compreValue && compreValue === RANGENO[0] ){
				return;
			}else if(view <= compreValue && compreValue === RANGENO[aryEndIdx] ){
				return;
			}
						
			// ���ڵ��� ���� �Ӵ�С ĳһֵ ���� С�� �����κ�ֵ 
			S.each(RANGENO, function(val, index){					
				if( view < val && index === aryEndIdx ){ 
					thatWidth = val;
					return false;
				}else if( view >= val ){ 
					thatWidth = val;
					return false;
				}
			});
			_self._writeBodyWth(thatWidth, _self.oldViewWidth);
		},
				
		// �¼���ʼ��
		_eventnit: function(){
			var _self = this,
				oCompare = S.buffer(_self._numbCompar, 300, _self);
			
			// ����������С
			Event.on(win, 'resize', oCompare);
		},	
		
		// bodyд�� ��ȱ�ʶ  ֻҪһ����ֵ���� --- ���Ƴ� ��д�� ��˳��
		_writeBodyWth: function(newView, oldView){
			var _self = this,
				newView = newView - RESNO;// ��ǰ���-�ݲ�ֵ = class�趨��ʾ��� ---- �����ֵ��ԭ�� �ݲ�֮ǰ��ֵ
			
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
				alert('��ǰbody���class��ʾ��'+'w' + newView);
			}else{
				S.log('��Ч�Ŀ��ֵ��');
			}			
		}
	});
		
	return MoreViewVersion;
}, {requires:['core']});