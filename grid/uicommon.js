/** @fileOverview ��KISSY������չ��һЩ��������
* ��������ʽ��������Form������ 
* @version 1.0.0  
*/
KISSY.add('gallery/tmSimpleGrid/1.0/TL', function(S, Calendar){

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

        if( !(_self instanceof TL) ){
        	return new TL();
        }
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
		* @description �����ַ���������ֵ-- �ж��������� -- string || date�� float || int
		* @param {Number|String|} 
		* @return {string} ���� ��������
		*/
		strToDataType: function(value){
			var dataType = 'string',
				date = '',
				val = parseInt(value, 10),
				isNumber = S.isNumber(value),
				isString = S.isString(value);
			
			if(!value){
				return;
			}
			
			if(isNumber){				
				if(/\./g.test(value)){					
					dataType = 'float';
				}else{
					dataType = 'int';
				}				
			}else if(isString){
				date = this.getDateParse(value);
				if(date.getFullYear){
					dataType = 'date';
				}
			}
			return dataType;
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
		* @description ����·�� ����������,��ȡ ����ֵ; 
		* @param {object|String} String���key ֱ����'.'�Ÿ���; ����: object --> 'aa.bb.cc.dd.ee' 
		* @return {value}
		*/
    	getFiledValue: function(obj, index){
			if( !obj && !index){
				return;
			}

			var resultData = obj,
				aindex = index.split('.');

			S.each(aindex, function(dataIndex){
				if(resultData){
					resultData = resultData[dataIndex];
				}
			});

			return resultData;
		},
		
		/*
		* @description ���÷���--- ���� ѡ��/ȡ�� �ȶ��ĵ�������, ָ��cls���ӵ� checkbox, ����checked״̬
		* @param {string|boolean|document} class ����-- �Ƿ�ѡ�� --- �ĵ�������
		* @return {array} ѡ�е�checkbox valueֵ ����
		*/
    	selectedAllBox: function(cls, isChecked, thatDoc){
    		var selectedAry = [],	
    			thatDoc = thatDoc || document, 
                groupRadios = S.query(cls, thatDoc);
                
            S.each(groupRadios, function(el){
            	var trID = DOM.val(el);

				if(isChecked){
					el.checked = 'checked';
					selectedAry.push(trID);
				}else{
					el.checked = '';
					DOM.removeAttr(el, 'checked');
				}               
            });

			return selectedAry;
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
		},

		/**
		* encodeURI �첽����
		* @param  {String || array || json, Boolean} ��ҪencodeURI ���ݣ��Ƿ�2��ת��Booleanֵ
		* @return {String || array || json} encodeURI ��� ֵ
		*/
    	encodeURIParam: function(vals, isDoubEncode){
    		var _self = this;

    		if(!vals){
    			return;
    		}

    		// �ַ���
    		if(S.isString(vals)){
    			return isDoubEncode ? encodeURI(encodeURI(vals)) : encodeURI(vals);
    		}

    		// ���� �ַ��� 
    		if(S.isArray(vals)){
    			S.each(vals, function(val, i){
    				vals[i] = isDoubEncode ? encodeURI(encodeURI(val)) : encodeURI(val);
    			});
    			return vals;
    		}

    		// json���ݶ���
    		if(S.isObject(vals)){
    			S.each(vals, function(value, index){
    				vals[index] = _self.encodeURIParam(value, isDoubEncode);
    			});
    			return vals;
    		}

    		// ����ֱ����� -- number || boolean ..
    		return vals;
    	}
	});
	
	S.TL = S.namespace('TL');
	S.TL = new TL();

	return new TL();
	
}, {requires: ['calendar', 'core']});