/** @fileOverview ��KISSY������չ��һЩ��������
* ��������ʽ��������Form������ 
* @version 1.0.0  
*/
KISSY.add('TL', function(S, Calendar){

	var Event = S.Event,
		DOM = S.DOM,
		Anim = S.Anim,
		Ajax = S.io,
		S_Date = S.Date,
		JSON = S.JSON,
		UA = S.UA,
		win = window,
		doc = document;
		  
	function TL(){
        var _self = this;
    }
	 
	S.extend(TL, S.Base);
    S.augment(TL, {
		/**
			@description ���ڸ�ʽ������
			@param {Number|Date} date ��ʽ�������ڣ�һ��Ϊ1970 �� 1 �� 1 ������ĺ����� 
			@return {String} ��ʽ��������ڸ�ʽΪ 2011-10-31
			@example
		* һ���÷���<br> 
		* S.TL.Format.dateRenderer(1320049890544);�����2011-10-31 <br>
		* �����������Ⱦ�У�<br>
		* {title:"��������",dataIndex:"date",renderer:S.TL.Format.dateRenderer}
		*/
		dateRenderer: function (d) {
			if(!d){
				 return '';
			}
			if(S.isString(d)){
				return d;
			}
			var date = null;
            try {
                date =new Date(d);
            } catch (e) {
                return '';
            }
            if (!date || !date.getFullYear){
                return '';
            }
            return S_Date.format(d,'yyyy-mm-dd');
        },
		/**
			@description ����ʱ���ʽ������
			@param {Number|Date} date ��ʽ�������ڣ�һ��Ϊ1970 �� 1 �� 1 ������ĺ����� 
			@return {String} ��ʽ��������ڸ�ʽʱ��Ϊ 2011-10-31 16 : 41 : 02
		*/
		datetimeRenderer: function (d) {
			if(!d){
				 return '';
			}
			if(S.isString(d)){
				return d;
			}
			var date = null;
            try {
                date =new Date(d);
            } catch (e) {
                return '';
            }
            if(!date || !date.getFullYear){
            	return '';
            }
            return S_Date.format(d,'yyyy-mm-dd HH:MM:ss');
		},		

		/*
		* @description ��������ʱ���ַ��� �������ڶ���
		* @param {String} 
		* @return {obj} date obj 
		*/
		getDateParse: function(dateStr){
			return S_Date.parse(dateStr.replace(/\-/g,'/'));
		},
		
		/*
		* @description �����ַ������� ��ȡ���ں�������֧�� ǰ��ʱ�� ����
		* @param {Number|String} 
		* @return {obj} date obj 
		*/
		getDateObj: function(dateStr, offset, PreviousLater){
			var dataParse = dateStr ? S.TL.getDateParse(dateStr) : (new Date()).getTime(),
				offsetParse = offset ? offset * 86400000 : 0,
				dataTime;

			switch(PreviousLater){
				case '+' : dataTime = dataParse + offsetParse;
					break;
				case '-' : dataTime = dataParse - offsetParse;
					break;
				default: dataTime = dataParse;
			}

			return new Date(dataTime);
		},

		/**
			@description �ı���ȡ���������ı�����һ������ʱ�����ȡ�ı������...
			@param {Number} length ��ȡ�����ַ�
			@return {function} ���ش����� ���ؽ�ȡ����ַ������������С��ָ�������֣�����ԭ�ַ�����������ڣ��򷵻ؽضϺ���ַ�����������...
		*/
		cutTextRenderer: function(length){
			return function(value){
				value = value || '';

				if(value.toString().length > length){
					return value.toString().substring(0,length)+'...';
				}
				return value;
			};
		},
		
		/*
		* @description ���������ݷ�ת����Ԫ
		* @param {Number|String} 
		* @return {Number} ���ؽ� ��ת���� Ԫ������
		*/
		moneyCentRenderer: function(v, fixed){
			if(S.isString(v)){
				v = parseFloat(v);
			}
			if(S.isNumber(v)){
				return (v * 0.01).toFixed( fixed || 2);
			}
			return v;
		},
		
		/**
		* �����������л���Ϊ�ַ���
		* @param {HTMLForm} form ��Ԫ��
		* @return {String} ���л����ַ���
		*/
		serialize:function(form){
			return S.param(S.TL.serializeToObject(form));
		},
		/**
		* �����������л��ɶ���
		* @param {HTMLForm} form ��Ԫ��
		* @return {Object} ��Ԫ�ص�
		*/
		serializeToObject:function(form){
			var originElements = S.makeArray(form.elements),
				elements = null,
				arr =[],
				checkboxElements = null,
				result={};

			elements = S.filter(originElements, function(item){
				// ��name������id
				// δ������ -- disabled="disabled"
				// ѡ��״̬
				// select|textarea |input  nodeName
				// text|hidden|password |radio|checbox  input.type

				return (item.id ||item.name) && !item.disabled && ( item.checked || /select|textarea/i.test(item.nodeName) || /text|hidden|password/i.test(item.type) );
			});

			//checkbox �����⴦���������checkbox��δѡ��ʱ,�����ֶ�Ϊ��
			checkboxElements = S.filter(originElements, function(item){
				return ( item.id ||item.name) && !item.disabled &&(/checkbox/i.test(item.type) );
			});

			// �����������ݶ���
			S.each(elements,function(elem){
				var val = S.one(elem).val(),
					name = elem.name||elem.id,
					obj = val == null ? {name:  name, value: ''} : S.isArray(val) ?
					S.map( val, function(val, i){
						return {name: name, value: val};
					}) :
					{name:  name, value: val};

				if(obj){
					arr.push(obj);
				}
			});

			//��϶���
			S.each(arr, function(elem){
				var prop = result[elem.name],
					a = []; //��ʱ����

				if(!prop){
					result[elem.name] = elem.value;
				}else if(S.isArray(prop)){
					prop.push(elem.value);
				}else{
					a.push(prop);
					a.push(elem.value);
					result[elem.name]=a;
				}
			});

			//���checkbox���ֶ��Ƿ��ڶ����У���������Ϊ��
			S.each(checkboxElements, function(elem){
				var name = elem.name || elem.id;

				if(!result.hasOwnProperty(name)){
					result[name] = '';
				}
			});
			
			return result;
		}
	});
	
	S.TL = S.namespace('TL');
	S.TL = new TL();
	return  new TL();
	
}, {requires: ['calendar', 'core']});