/** 
* @fileOverview ��èƷ��վ ��׼��ҳ����ҳ----�Ҳ�ͼƬ ����ģ����� js 
* @extends  KISSY.Base
* @creator �Ƽף�������ˮľ�껪double��<huangjia2015@gmail.com>
* @depends  ks-core��tml/share
* @version 1.0
* @update 2013-05-20
* @example
*     new LoveShare({
*		container:'shareaip',   // ��������� id str
		id:'6',
		type:'8',
		url:'http://www.baidu.cn',
*		piclist:['http://img.daily.taobaocdn.net/L1/97/39909/siteCover/subjectc1072.jpg']             // ����ͼƬsrc
*	  }); 
*/

KISSY.add('brandsite/1.0/widget/btmishare', function(S, Share){
	var Event = S.Event,
		DOM = S.DOM,
		Anim = S.Anim,
		Ajax = S.io,
		UA = S.UA,
		win = window,
		doc = document;
		
	function LoveShare(config){	
		var _self = this;
		
		LoveShare.superclass.constructor.call(_self, config);	  	
		
		_self._init();	
	}

	S.extend(LoveShare, S.Base);
	S.augment(LoveShare, {		
		// ��ʼ������
		_init: function(){
			var _self = this;
			
			_self._renderImgShres();
		},
		
		// �¼���ʼ��
		_eventnit: function(){
			var _self = this;
		},		
		
		// ��ʼ�� ������ ���󻬶� ���
		_renderImgShres: function(){
			var _self = this,
				shareConfig = {
					key: _self.get('type') === 'item' ? 'itemId' : '',
					id:_self.get('id') || '',
					type:_self.get('type') || 'act',
					picList: _self.get('piclist'),
					container:'#'+_self.get('container'),
					title:_self.get('title') || '����',
					url:_self.get('url') || '��������',
					comment:_self.get('sharText') || '������Ӫ����Ʒ����־ר�⣬�ֿ������̹���������èƷ�ƽ֣��Ƽ�����Ŷ~~',
					style:_self.get('style') || 'mini',
					dir: _self.get('dir') || 'left',				// ���hoverչ������
					copySucText:'����֮ǰû���ǵ�~'
				};
			var afterConfig = {
				mask:_self.get('mask'),				
				showRecTip:_self.get('showRecTip'),
				style:_self.get('style'),
				dir:_self.get('dir'),
				copySucText:_self.get('copySucText')
			};
			/*
				// full �������� --- ���� vs īڤ
				mask:true,
				key: _self.get('type')==='item' ? 'itemId' : '',
				showRecTip:false
				
				style:_self.get('style') || '',
				dir: '',				// ���hoverչ������
				copySucText:''
					
			*/
			shareConfig = S.merge(shareConfig, afterConfig);
			
			new Share(shareConfig);
		}
	});	
	
	return LoveShare;	
},{requires:['tml/share']});