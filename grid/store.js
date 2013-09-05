/**
* ���ݻ����࣬�����������������
* @class ���ݻ�����
* @param {Object} config �����store�����field�ֶο��Դ�����������
* @property {String} url ���ֶ� proxy.url�ļ�д��ʽ������ֱ��д��������Ϣ��
* @example 
* var store = new Store({
*	url : 'data.php'
	root: 'rows',  // ��Ŀ¼
	totalProperty: 'results',  // ��������
	autoLoad: true,				// �Ƿ��Զ�����
	proxy: {url : 'data.php', method: 'get' } //����'name' �ֶν�������
	params: {id:'124', type:1}//�Զ������
	
	matchFunction  // ����ƥ�亯��	
	
*	hasLoad : false,
*	resultRows : [],
*	newRecords : [],
*	modifiedRecords : [],
*	deletedRecords : [],
*	rowCount : 0,
*	totalCount : 0
*});
*/

KISSY.add('mui/gridstore', function(S){
	var DOM = S.DOM, 
		Event = S.Event,
        win = window, 
        UA = S.UA;

	function Store(config){
		var _self = this;

		config = config || {};

		config = S.merge(
		/** @lends Store.prototype */	
		{
			/**
			* ��������ʱ���������ݵĸ�Ŀ¼
			* @field
			* @type String
			* @default  "rows"
			* @example 
			* '{"rows":[{"name":"abc"},{"name":"bcd"}],"results":100}'
			*/
			root: 'rows', 

			/**
			* ��������ʱ�������������������������ڷ�ҳ
			* @field
			* @type String
			* @default  "results"
			* @example
			*
			* '{"rows":[{"name":"abc"},{"name":"bcd"}],"results":100}'
			*/
			totalProperty: 'results', 

			/**
			* ��������ʱ�����صĸ�ʽ,Ŀǰֻ֧��"json��jsonp"��ʽ
			* @field
			* @type String
			* @default "json"
			*/
			dataType: 'json', 

			/**
			* ��������ʱ�Ƿ��Զ�����
			* @field
			* @type Boolean
			* @default true
			*/
			autoLoad: true,

			/**
			* ������Ϣ
			* @field 
			* @type Object
			* @default { field: '', direction: 'ASC' }
			* @example 
			* var store = new Store({
			*		url : 'data.php',
			*		autoLoad : true,
			*		sortInfo: { field: 'name', direction: 'DESC' }//����'name' �ֶν�������
			*	});
			*/
			sortInfo: { field: '', direction: 'ASC' },

			/**
			* ������Ϣ������2���ֶ�:<br>
			* url : �������ݵĵ�ַ<br>
			* method : �������ݵķ�ʽ"get","post"��Ĭ��ֵΪ"post"
			* @field 
			* @type Object
			* @default { method: 'post' }
			* @example 
			* var store = new Store({
			*		autoLoad : true,
			*		proxy: {url : 'data.php', method: 'get' }//����'name' �ֶν�������
			*	});
			*/			
			proxy: { method: 'post' },

			/**
			* �Զ�����������ڼ�������ʱ���͵���̨
			* @field
			* @type Object
			* @example
			* var store = new Store({
			*		url :'data',
			*		autoLoad : true,
			*		params: {id:'124',type:1}//�Զ������
			*	});
			*/
			params:{},

			/**
			* �Ƿ����������Ϊ�������ÿ�������������󣬷���ֱ��ǰ������
			* @field
			* @type Boolean
			* @default true
			*/
			remoteSort: true,


			/**
			* josn ���� - ���� ָ���ֶ� ��֤2�������Ƿ���ͬ
			* @ field string
			* @ default 'id'
			*/
			dataField: 'id', 

			/**
			* �����ƥ�亯������֤���������Ƿ��൱
			* @field
			* @type Function
			* @default function(obj1,obj2){return obj1==obj2};
			* 
			*/
			matchFunction : function(obj1, obj2){
				var _self = this,
					dataField = _self.dataField,
					obj1Field = obj1[dataField],
					obj2Field = obj2[dataField];

				if( obj1Field !== undefined && obj2Field !== undefined){
					return obj1Field === obj2Field;
				}else{
					return obj1 === obj2;
				}				
			},

			/**
			* ���򷽷� -- ֧�� string || float || int || date
			* field �����ֶ�
			*/
			compareFunction: function(obj1, obj2, dataType){
				var _self = this,
					obj1 = _self.dataMachining(obj1, dataType) || '',
					obj2 = _self.dataMachining(obj2, dataType) || '';
					
				if(S.isString(obj1)){
					return obj1.localeCompare(obj2);
				}else if(S.isNumber(obj1)){
					return obj1-obj2;
				}
			},

			/**
			* ����ָ������  ���� ��������
			* @param {string}
			* @return �����������
			*/
			dataMachining: function(value, valueType){
				if(!value){
					return;
				}

				switch(valueType){
					case 'float': return parseFloat(value); 
						break;

					case 'int': return parseInt(value, 10);
						break;

					case 'date': return new Date( Date.parse(value.replace(/\-/g,'/') ) );
						break;		

					default : return value.toString();	
				}	
			},

			/**
			* ��ҳ��Ϣ pageInfo {currentPage:'��ǰҳ', limit:'��ҳ��С', totalPage:'��ҳ��'' }
			* @param {string} 
			* @return {}
			*/
			pageInfo: {currentPage: 1, limit: 10, totalPage: 3}

		}, config);

		S.mix(_self, config);
		S.mix(_self, {
			hasLoad : false,
			resultRows : [],
			newRecords : [],
			modifiedRecords : [],
			deletedRecords : [],
			disableRecords : [],
			rowCount : 0,
			totalCount : 0
		});

		//����֧�ֵ��¼�
		_self.events = [
			/**  
			* ���ݽ��ܸı䣬�������ӡ�ɾ�����޸ĵ����ݼ�¼���
			* @name Store#acceptchanges
			* @event  
			*/
			'acceptchanges',


			/**  
			* �����ݼ�����ɺ�
			* @name Store#load  
			* @event  
			* @param {event} e  �¼����󣬰�����������ʱ�Ĳ���
			*/
			'load',

			/**  
			* �����ݼ���ǰ
			* @name Store#beforeload
			* @event  
			*/
			'beforeload',

			/**  
			* �����ڣ�beforeload��load�м䣬�����Ѿ���ȡ��ɣ����ǻ�δ����load�¼������ڻ�ȡ���ص�ԭʼ����
			* @name Store#beforeProcessLoad
			* @event  
			* @param {event} e  �¼�����
			* @param {Object} e.data �ӷ������˷��ص�����
			*/
			'beforeProcessLoad',
			
			/**  
			* ���������ʱ�������¼�
			* @name Store#addrecords  
			* @event  
			* @param {event} e  �¼�����
			* @param {Array} e.data ��ӵ����ݼ���
			*/
			'addrecords',

			/**
			* �׳��쳣ʱ��
			*/
			'exception',


			/**  
			* ��ɾ�������Ǵ������¼�
			* @name Store#removerecords  
			* @event  
			* @param {event} e  �¼�����
			* @param {Array} e.data ɾ�������ݼ���
			*/
			'removerecords',
			
			/**  
			* ����������ָ���ֶ�ʱ�������¼�
			* @name Store#updaterecord  
			* @event  
			* @param {event} e  �¼�����
			* @param {Object} e.record ���µ�����
			* @param {Object} e.field ���µ��ֶ�
			* @param {Object} e.value ���µ�ֵ
			*/
			'updaterecord',

			/**  
			* ǰ�˷�������ʱ����
			* @name Store#localsort
			* @event  
			* @param {event} e  �¼�����
			* @param {Object} e.field ������ֶ�
			* @param {Object} e.direction ����ķ��� 'ASC'��'DESC'
			*/
			'localsort',

			/**  
			* ������ĳ������ʱ�������¼�
			* @name Store#disableRecords  
			* @event  
			* @param {event} e  �¼�����
			* @param {Object} e.record ���õ����ݶ���
			*/
			'disableRecords',

			/**  
			* �����ĳ������ʱ�������¼�
			* @name Store#cancelDisableRecords  
			* @event  
			* @param {event} e  �¼�����
			* @param {Object} e.record ��������ݶ���
			*/
			'cancelDisableRecords'
		];

		_self._init();
	}


	S.augment(Store, S.EventTarget);
	S.augment(Store, 
	/** @lends Store.prototype */	
	{
		/**
		* �������ݸı䣬��������޸ġ�������ɾ�������õļ������
		*/
		acceptChanges : function(){
			var _self = this;

			_self._clearChanges();
			_self.fire('acceptchanges');
		},


		
		/**
		* ��Ӽ�¼
		* @param {Array|Object} data ��ӵ����ݣ����������飬�����ǵ�����¼
		* @param {Boolean} [noRepeat = false] �Ƿ�ȥ��,����Ϊ�գ�Ĭ�ϣ� false 
		* @param {Function} [match] ƥ�亯��������Ϊ�գ�Ĭ���ǣ�<br>
		*  function(obj1,obj2){
		*	 return obj1 == obj2;
		*  }
		*  use
		*/
		add: function(data, noRepeat, match){
			var _self=this,
				newData=[];

			match = S.isFunction(match) ? match : _self._getDefaultMatch();

			if(!S.isArray(data)){
				data = [data];
			}

			S.each(data, function(element){
				if(!noRepeat || !_self.contains(element, match)){
					_self._addRecord(element);
					newData.push(element);
					// ȫ�� - ���� ���� ��¼
					_self.newRecords.push(element);
					// ȫ�� - ��������� Ĩȥ ��ɾ����¼ - ���ļ�¼ ��������ʷ 
					_self._removeFrom(element, _self.deletedRecords);
					_self._removeFrom(element, _self.modifiedRecords);
					_self._removeFrom(element, _self.disableRecords);
				}
			});
			_self.fire('addrecords', {data:newData});
		},		

		/**
		* �������,����������� use
		*/
		clear : function(){ 
			var _self = this;
			_self.setResult([]);
		},

		/**
		* store�ıȽϺ���
		* @param {Object} obj1 ���бȽϵļ�¼1
		* @param {Object} obj2 ���бȽϵļ�¼2
		* @param {String} [field] ����������ֶ�,Ĭ��Ϊ sortInfo.field
		* @param {String} [direction] ��������ķ���,Ĭ��Ϊ sortInfo.direction ������ASC������DESC'
		* @return {Number} 
		* �� obj1 > obj2 ʱ���� 1
		* �� obj1 = obj2 ʱ���� 0 
		* �� obj1 < obj2 ʱ���� -1
		*/
		compare : function(obj1, obj2, field, direction, dataType){
			var _self = this,
				dir = 1;

			field = field || _self.sortInfo.field;
			direction = direction || _self.sortInfo.direction;

			//���δָ�������ֶΣ���������Ĭ��˳��
			if( !field || !direction){
				return 1;
			}

			dir = direction === 'ASC' ? 1 : -1;

			return this.compareFunction(obj1[field], obj2[field], dataType) * dir;
		},

		/**
		* ��֤�Ƿ����ָ����¼ -- ����ת��booleanֵ �м䷽��
		* @param {Object} record ָ���ļ�¼
		* @param {Function} [match = function(obj1,obj2){return obj1 == obj2}] Ĭ��Ϊ�Ƚ�2�������Ƿ���ͬ
		* @return {Boolean}
		*/
		contains: function(record, match){
			return this.findIndexBy(record, match) !== -1;
		},

		/**
		* �����������ڵ�����λ��,�������ڷ���-1 ���÷��� -- �Ѿ���������(��ӹ���) �򷵻���Ӧ�������ݵ�indexֵ
		* @param {Object} target ָ���ļ�¼
		* @param {Function} [func = function(obj1,obj2){return obj1 == obj2}] Ĭ��Ϊ�Ƚ�2�������Ƿ���ͬ
		* @return {Number}
		*/
		findIndexBy: function(target, func){
			var _self = this,
				position = -1,
				records = this.resultRows;
				
			func = S.isFunction(func) ? func : _self._getDefaultMatch();
			
			if(S.isUndefined(target) || S.isNull(target)){
				return -1;
			}
			S.each(records, function(record, index){
				if(func.call(_self, target, record)){
					position = index;
					return false;
				}
			});
			return position;
		},

		/**
		* ���Ҽ�¼�������ص�һ��  use
		* @param {String} field �ֶ���
		* @param {String|Function} value �ֶ�ֵ ����˷���
		* @return {Object|null}
		*/
		find : function(field, value, func){ 
			var result = null,
				records = this.resultRows;
				
			S.each(records, function(record, index){				
				if((func && func.call(this, record[field], value)) || record[field] === value){
					result = record;
					return false;
				}
			});
			return result;
		},

		/**
		* �����������Ҽ�¼
		* @param {Number} index ���� use
		* @return {Object} ���ҵļ�¼
		*/
		findByIndex : function(index){
			return this.resultRows[index];
		},

		/**
		* ���Ҽ�¼���������з��ϲ�ѯ�����ļ�¼
		* @param {String} field �ֶ���
		* @param {String|Function} value �ֶ�ֵ ����˷���
		* @return {Array}
		*/
		findAll : function(field, value, func){
			var result = [],
				records = this.resultRows;

			S.each(records, function(record, index){
				if((func && func.call(this, record[field], value)) || record[field] === value){
					result.push(record);
				}
			});
			return result;
		},

		/**
		* ��ȡ��һ����¼
		* @param {Object} record ��ǰ��¼
		* @return {Object} ��һ����¼
		*/
		findNextRecord : function(record){
			var _self = this,
				index = _self.findIndexBy(record);

			if(index >= 0){
				return _self.findByIndex(index + 1);
			}
			return undefined;
		},

		/**
		* ��������,�����ṩ����ʱ�������ϴ�����Ĳ�����������
		* @param {Object} [params] �Զ�������Զ�����ʽ�ṩ
		* @example 
		* store.load({id : 1234, type : 1});
		*/
		load :function (params){
			//_self.hasLoad = true;
			this._loadData(params);
		},

		/**
		* ��ȡ����������� use
		* @return {Array}
		*/
		getResult : function(){
			return this.resultRows;
		},

		/**
		* ��ȡ����������ݵ����� use
		* @return {Number}
		*/
		getCount : function () {
            return this.resultRows.length;
        },

		/**
		* ��ȡ��ӵ����� use
		* @return {Array} ��������ӵ����ݼ���
		*/
		getNewRecords : function(){
			return this.newRecords;
		},
		
		/**
		* ��ȡ���ĵ�����
		* @return {Array} ���ظ��ĵ����ݼ���
		*/
		getModifiedRecords : function(){
			return this.modifiedRecords;
		},

		/**
		* ��ȡɾ��������
		* @return {Array} ����ɾ�������ݼ���
		*/
		getDeletedRecords : function(){
			return this.deletedRecords;
		},

		/**
		* ��ȡ���õ����� use
		* @return {Array}
		*/ 
		getDisableRecords : function(){
			return this.disableRecords;
		},

		/**
		* ��ȡ���Դ���ݵ�����
		* @return {Number}
		*/
        getTotalCount : function () {
            return this.totalCount;
        },

		/**
		* ɾ����¼���� removerecords �¼�. use
		* @param {Array|Object} data ��ӵ����ݣ����������飬�����ǵ�����¼
		* @param {Function} [match = function(obj1, obj2){return obj1 == obj2}] ƥ�亯��������Ϊ��
		*/
		remove :function(data, match){ 
			var _self =this,
				delData=[];
				
			match = S.isFunction(match) ? match : _self._getDefaultMatch();
			
			if(!S.isArray(data)){
				data = [data];
			}
			S.each(data,function(element){
				var index = _self.findIndexBy(element, match),
				    record = _self._removeAt(index);

				// ��ӵ���ɾ��������, ���������ӵ����ݣ�������ɾ�������ݼ�����
				if(!S.inArray(record, _self.newRecords) && !S.inArray(record, _self.deletedRecords)){
					_self.deletedRecords.push(record);
				}
				_self._removeFrom(record,_self.newRecords);
				_self._removeFrom(record,_self.modifiedRecords);
				
				delData.push(record);
			});
			
			_self.fire('removerecords',{data:delData});
		},

		/**
		* �������ݣ��ڲ��Զ���������ʱ�������ֶ�������ݣ��ᴥ�� load�¼�
		* @param {Array} data ���õ����ݼ��ϣ���һ������
		*/
		setResult:function(data){
			var _self = this,			
				data = data || [];
			
			_self.resultRows = data;
			_self.rowCount = data.length;
			_self.totalCount = data.length;
			// _self._sortData();
			_self.fire('load',  {loadparams:_self.oldParams, data:data} );
		},

		/**
		* ���ü�¼��ֵ ������ updaterecord �¼�
		* @param {Object} obj �޸ĵļ�¼
		* @param {String} field �޸ĵ��ֶ���
		* @param {Any Type} value �޸ĵ�ֵ
		* @param {Boolean} [isMatch = false] �Ƿ���Ҫ����ƥ�䣬���ָ���ļ�¼�Ƿ��ڼ�����
		*/
		setValue : function(obj, field, value, isMatch){
			var record = obj,
				_self = this,
				match = null,
				index = null;

			if(isMatch){
				match =  _self._getDefaultMatch();
				index = _self.findIndexBy(obj,match);
				if(index >=0){
					record = this.resultRows[index];
				}
			}
			record[field]=value;
			if(!S.inArray(record,_self.newRecords) && !S.inArray(record,_self.modifiedRecords)){
					_self.modifiedRecords.push(record);
			}
			_self.fire('updaterecord',{record:record,field:field,value:value});
		},

		/**
		* ���򣬸���Store�����ý��У�ǰ����������������¼�������
		* Զ�����򣬴���load�¼���ǰ�����򴥷�localsort�¼�
		* @param {String} field �����ֶ�
		* @param {String} direction ������
		*/
		sort : function(field, direction){
			var _self = this;

			_self.sortInfo.field = field || _self.sortInfo.field;
			_self.sortInfo.direction = direction || _self.sortInfo.direction;

			if(_self.remoteSort){	//���Զ���������¼�������
				this.load();
			}else{
				_self._sortData(field,direction);
				_self.fire('localsort',{field : field , direction : direction});
			}
		},

		/**
		* ���¼�¼ ������ updaterecord �¼�
		* @param {Object} obj �޸ĵļ�¼
		* @param {Boolean} [isMatch = false] �Ƿ���Ҫ����ƥ�䣬���ָ���ļ�¼�Ƿ��ڼ�����
		*/
		update : function(obj, isMatch){
			var record = obj,
				_self =this,
				match = null,
				index = null;
			if(isMatch){
				match = _self._getDefaultMatch();
				index = _self.findIndexBy(obj,match);

				if(index >=0){
					record = this.resultRows[index];
				}
			}
			record = S.mix(record,obj);
			if(!S.inArray(record,_self.newRecords) && !S.inArray(record,_self.modifiedRecords)){
				_self.modifiedRecords.push(record);
			}
			_self.fire('updaterecord',{record:record});
		},

		/**
		* ����
		*/
        destroy: function () {
			var _self = this;
			_self.detach();
			_self = null;
        },

		// ��Ӽ�¼  -- ����ָ�����-���/�滻�� ����index�����
		_addRecord :function(record, index){
			var _self = this,
				records = _self.resultRows;
				
			if(S.isUndefined(index)){
				index = records.length;
			}
			records[index] = record;
			_self.fire('recordadded',{record:record, index:index});
		},

		// ����ı�����ݼ�¼
		_clearChanges : function(){
			var _self = this;
			_self.newRecords.splice(0);
			_self.modifiedRecords.splice(0);
			_self.deletedRecords.splice(0);
			_self.disableRecords.splice(0);
		},

		/**
		* �趨 �������� �˷����ᴥ�� disableRecords �¼�
		* @method setDisableRecords
		* @param {obj || array} Ҫ���õ�����
		* @return {Object} ���õ�����
		*/
		setDisableRecords: function(data){
			var _self = this;

			data = S.isArray(data) ? data : [data];

			S.each(data, function(obj, index){
				if( !S.inArray(obj, _self.disableRecords) ){
					_self.disableRecords.push(obj);
				};
			});

			_self.fire('disableRecords', {'data': data});
		},

		/**
		* ������� �˷����ᴥ�� cancelDisableRecords �¼� 
		* @method cancelDisableRecords
		* @param {obj || array} Ҫ���������
		* @return {Object} ���������
		*/
		cancelDisableRecords: function(data){
			var _self = this;

			data = S.isArray(data) ? data : [data];

			S.each(data, function(obj){
				var lindex = S.indexOf(obj, _self.disableRecords);

				if(lindex > -1){
					_self.disableRecords.splice(lindex, 1);
				};
			});

			_self.fire('cancelDisableRecords', {'data': data});
		},

		//�������� use
		_loadData : function(params){
			var _self = this,
				loadparams = params || {},
				data = null;
			
			/**
			* @private ���ý��
			*/
			function setResult(resultRows, rowCount, totalCount){
				_self.resultRows=resultRows;
				_self.rowCount=rowCount;
				_self.totalCount=totalCount;

			}
			_self.fire('beforeload');

			// ���� params���� -�ϴ�������� - ������� - ��ҳ��Ϣ - ��parms
			var loadparamses = S.merge(_self.oldParams, _self.sortInfo, _self.pageInfo, loadparams);
			_self.oldParams = loadparamses;

			// ���� ���� -- ��ҳ ��Ϣ 
			_self.sortInfo = S.mix(_self.sortInfo, loadparams, true, ['field', 'direction']);
			_self.pageInfo = S.mix(_self.pageInfo, loadparams, true, ['currentPage', 'limit', 'totalPage']);
			// post vs get ��ʽ������ʽ��
			data = _self.proxy.method === 'post' ? loadparamses : (loadparamses ? S.param(loadparamses) : '');

			S.ajax({
				cache: false,
                url: _self.proxy.url,
                dataType: _self.dataType,
                type: _self.proxy.method,
                data: data,
                success : function (data, textStatus, XMLHttpRequest) {
					_self.fire('beforeProcessLoad', {data:data} );

					var resultRows=[],
						rowCount = 0,
						totalCount = 0;

					// ���� 
					if(data.hasError){
						setResult(resultRows,rowCount,totalCount);
						_self.fire('exception',{error:data.error});
						return;
					}

					// jsonp֧��
					if(S.isString(data)){
						data = S.json.parse(data);
					}

                    if (S.isArray(data) || S.isObject(data)) {
						if(S.isArray(data)){
							resultRows = data;
							rowCount = resultRows.length;
							totalCount = rowCount;
						}else if (data) {
                            resultRows = data[_self.root];
                            if (!resultRows) {
                                resultRows = [];
                            }
                            rowCount = resultRows.length;
                            totalCount = parseInt(data[_self.totalProperty], 10);
                        } 
                    } 

					setResult(resultRows, rowCount, totalCount);

                    if (!_self.remoteSort) {
                        _self._sortData();
                    } 
					
					_self.fire('load', {loadparams:loadparamses, data:data});
					_self._clearChanges();
                },

                error : function (XMLHttpRequest, textStatus, errorThrown) {
                   setResult([], 0, 0);
				   _self.fire('exception',{error:textStatus,responseText:errorThrown.responseText});
                }
			});			
			
		},

		//�Ƴ����� use
		_removeAt:function(index, array){
			if(index < 0){
				return;
			}
			var records = array || this.resultRows,
				record = records[index];

			records.splice(index,1);
			return record;
		},
		_removeFrom :function(record, array){
			var _self = this,
				index = S.indexOf(record, array);

			if(index >= 0){
				_self._removeAt(index, array);
			}
		},

		//����  �����ֶ� -- ������ ASC || DSC -- �ֶ�ֵ����
		/**
		* ���򷽷� ����ָ���ֶ�����
		* @param {string} 
		* @ default {field:'', direction:'ASC', dataType:'string'}
		*/
		_sortData : function(field, direction, dataType){
			var _self = this;

			field = field || _self.sortInfo.field;
			direction = direction || _self.sortInfo.direction;

			//���δ���������ֶΣ�������
			if(!field || !direction){
				return;
			}
			_self.resultRows.sort(function(obj1,obj2){
				return _self.compare(obj1, obj2, field, direction, dataType);
			});
		},

		//��ȡĬ�ϵ�ƥ�亯��
		_getDefaultMatch :function(){
			return this.matchFunction;
		},

		// ��ȡ��ǰҳ��
		getCurrentPage: function(){
			var _self = this;
			return _self.pageInfo.currentPage;
		},

		// ��ȡ��ҳ��С
		getPageSize: function(){
			var _self = this;
			return _self.pageInfo.limit;
		},

		// ��ȡ��ҳ��
		getTotalPage: function(){
			var _self = this;
			return _self.pageInfo.totalPage;
		},

		/**
		* ������ҳ�� �˷����ᴥ�� totalPageChange�¼�
		* @param {number} �趨��ҳ��
		* @return {Object} ��ҳ���ݶ���
		*/
		setTotalPage:function(totalPage){
			var _self = this;

			if(totalPage >= 0){
				_self.pageInfo.totalPage = totalPage;
				_self.fire('totalPageChange');
			}	

			return _self.pageInfo;
		},

		//��ʼ�� -- oldParams���� -- url���� -- resultRows
		_init : function(){
			var _self =this;

			_self.oldParams = _self.params || {};
			
			if(!_self.proxy.url) {
                _self.proxy.url = _self.url;
            }

            // ��ҳ��Ϣ
            if(!_self.pageInfo.totalPage) {
                _self.pageInfo.totalPage = _self.totalPage;
            }
            if(!_self.pageInfo.limit) {
                _self.pageInfo.limit = _self.limit;
            }
            if(!_self.pageInfo.currentPage) {
                _self.pageInfo.currentPage = _self.currentPage;
            }

			_self.resultRows = [];
			/*if(_self.autoLoad){
				_self._loadData();
			}*/
		}
	});

	return Store;

}, {requires:[]});

