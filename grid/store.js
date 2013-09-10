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
	proxy: {url : 'data.php', method: 'get' } //����'name' �ֶν�������
	params: {id:'124', type:1}//�Զ������
	
	matchFunction  // ����ƥ�亯��	
	
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
			* ��������ʱ�������������������������� ǰ�� ��ҳ
			* @field
			* @type String
			* @default  "results"
			* @example
			*
			* '{"rows":[{"name":"abc"},{"name":"bcd"}],"results":100}'
			*/
			totalProperty: 'results', 

			/**
			* ������Ϣ 
			* @field 2���ֶ� -- �����ֶΡ�������
			* @type Object
			* @default { field: '', direction: 'ASC' }
			* @example 
			* var store = new Store({
			*		url : 'data.php',
			*		sortInfo: { field: 'name', direction: 'DESC' }//����'name' �ֶν�������
			*	});
			*/
			sortInfo: { field: '', direction: 'ASC', dataType:'string'},

			/**
			* ajax config ����3���ֶ�:
			* url : ���ݵ�url
			* method : ���ݵķ�ʽ"get","post"��Ĭ��ֵΪ"post"
			* dataType: ���ݷ��صĸ�ʽ,Ŀǰֻ֧��"json��jsonp"��ʽ(��������� ǿ�� methodΪ get��ʽ  )
			* @field 
			* @type Object
			* @default { method: 'post', dataType: 'json', url:null }
			* @example 
			* var store = new Store({
			*		url : 'data.php',
			*		method: 'get',
			*		dataType: 'json'
			*	});
			*/			
			proxy: { url:null, method: 'post', dataType: 'json' },

			/**
			* �Զ�����������ڼ�������ʱ���͵���̨
			* @field
			* @type Object
			* @example
			* var store = new Store({
			*		url :'data',
			*		params: {id:'124',type:1}//�Զ������
			*	});
			*/
			params:{},

			/**
			* �Ƿ����������Ϊ�������ÿ�������������󣬷���ֱ��ǰ������ -- Ĭ�� ǰ������
			* @field 
			* @type Boolean
			* @default true
			*/
			localSort: true,

			/**
			* josn ���� - ���� ָ���ֶ� ��֤2�������Ƿ���ͬ
			* @ field string
			* @ default 'id'
			*/
			dataField: 'id', 

			/**
			* ��ҳ��Ϣ pageInfo {currentPage:'��ǰҳ', limit:'��ҳ��С', totalPage:'��ҳ��'' }
			* @param {string} 
			* @return {}
			*/
			pageInfo: {currentPage: 1, limit: 10, totalPage: 3},
			
			/**
			* �Ƿ��˷�ҳ���ݣ��������ÿ�� ��ҳ ���������󣬷���ֱ��ǰ�˷�ҳ -- Ĭ�Ϻ�˷�ҳ
			* @field 
			* @type Boolean
			* @default true
			*/
			localPagination: false,


			/**
			* �Ƿ��з�ҳ-- Ĭ����
			* @field 
			* @type Boolean
			* @default true
			*/
			isPagination: true 

		}, config);

		S.mix(_self, config);
		S.mix(_self, {
			resultRows : [],
			newRecords : [],
			modifiedRecords : [],
			deletedRecords : [],
			disableRecords : [],
			rowCount : 0,
			totalCount : 0,
			totalData : [] // result�����ݴ�
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
			'cancelDisableRecords',

			/**  
			* ��ҳ���ı� totalPageChange �¼�
			* @name Store#totalPageChange  
			* @event  
			* @param {event} e  �¼�����
			* @return {obj} ���� ��ҳ��Ϣ ����
			*/
			'totalPageChange',

			/**  
			* currentPageChanged
			* @name Store#currentPageChanged  
			* @event  
			* @param {event} e  �¼�����
			* @return {number} ���ص�ǰҳ��
			*/
			'currentPageChanged'			  
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
		compare: function(obj1, obj2, field, direction, dataType){
			var _self = this,
				dir = 1;

			field = field || _self.sortInfo.field;
			direction = direction || _self.sortInfo.direction;
			dataType = dataType || _self.sortInfo.dataType;

			//���δָ�������ֶΣ���������Ĭ��˳��
			if(!field || !direction){
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
		load: function (params){
			this._loadData(params);
		},

		/**
		* ��ȡ�����������
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

			// ǰ�˷�ҳ
			if(_self.isPagination){
				data = _self._localPagination();
			}
			
			_self.fire('load', {loadparams:_self.oldParams, data:data});
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
		sort : function(field, direction, dataType){
			var _self = this;

			_self.sortInfo.field = field || _self.sortInfo.field;
			_self.sortInfo.direction = direction || _self.sortInfo.direction;
			_self.sortInfo.dataType = dataType || _self.sortInfo.dataType;
	
			//���Զ���������¼�������
			if(!_self.localSort){	
				this.load();
			}else{
				_self._sortData(field, direction, dataType);
				_self.fire('localsort', _self.sortInfo);
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

		// ��������
		_loadData : function(params){
			var _self = this,
				loadparams = params || {},
				data = null;
			
			/**
			* @private ���ý��
			*/
			function setResultLocal(resultRows, rowCount, totalCount){
				_self.resultRows = resultRows;
				_self.rowCount = rowCount;
				_self.totalCount = totalCount;

			}
			_self.fire('beforeload');

			// ���� params���� -�ϴ�������� - ������� - ��ҳ��Ϣ - ��parms
			var loadparamses = S.merge(_self.oldParams, _self.sortInfo, _self.pageInfo, loadparams);
			_self.oldParams = loadparamses;

			// ���·�ҳ������ajax config ��Ϣ
			_self.attrUpdater(loadparams);

			// ������Ϊ jsonp ʱ�� methodΪget
			if(_self.proxy.dataType === 'jsonp'){
				_self.proxy.method = 'get';
			}
			
			// post vs get ��ʽ������ʽ��
			data = _self.proxy.method === 'post' ? loadparamses : (loadparamses ? S.param(loadparamses) : '');

			S.ajax({
				cache: false,
                url: _self.proxy.url,
                dataType: _self.proxy.dataType,
                type: _self.proxy.method,
                data: data,
                success : function (data, textStatus, XMLHttpRequest) {
					_self.fire('beforeProcessLoad', {data:data} );

					var resultRows=[],
						rowCount = 0,
						totalCount = 0;

					// ���ݳ��� 
					if(data.hasError){
						setResultLocal(resultRows,rowCount,totalCount);
						_self.fire('exception',{error:data.error});
						return;
					}

					// jsonp֧��
					if(S.isString(data)){
						data = S.json.parse(data);
					}

					// ��������
					if(S.isArray(data)){
						resultRows = data;
						rowCount = resultRows.length;
						totalCount = rowCount;
						
					}else if (S.isObject(data)) {
						resultRows = data[_self.root];
						
						if (!resultRows) {
							resultRows = [];
						}
						rowCount = resultRows.length;
						totalCount = rowCount || parseInt(data[_self.totalProperty], 10); // ��ѡ ������� length 	��ѡ��"results":21,
					} 

					setResultLocal(resultRows, rowCount, totalCount);

					// ǰ�� ����
                    if (_self.localSort) {
                        _self._sortData();
                    } 
					
					// ���� �ܷ�ҳ ��Ϣ					
					_self.setTotalPage( _self.calculatePageTotal() );
					
					_self.fire('load', {loadparams:loadparamses, data:data});
					
					_self._clearChanges();
                },

                error: function (XMLHttpRequest, textStatus, errorThrown) {
                   setResultLocal([], 0, 0);
				   _self.fire('exception',{error:textStatus,responseText:errorThrown.responseText});
                }
			});			
			
		},

		// ��������������Ϣ
		attrUpdater: function(loadparams){
			var _self = this;

			// ajax Config�� ���򡢷�ҳ��Ϣ 
			_self.proxy = S.mix(_self.proxy, loadparams, true, ['dataType', 'method']);
			_self.sortInfo = S.mix(_self.sortInfo, loadparams, true, ['field', 'direction']);
			_self.pageInfo = S.mix(_self.pageInfo, loadparams, true, ['currentPage', 'limit', 'totalPage']);
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

		// ����  �����ֶ� -- ������ ASC || DSC -- �ֶ�ֵ����
		/**
		* ���򷽷� ����ָ���ֶ�����
		* @param {string} 
		* @ default {field:'', direction:'ASC', dataType:'string'}
		*/
		_sortData : function(field, direction, dataType){
			var _self = this;

			field = field || _self.sortInfo.field;
			direction = direction || _self.sortInfo.direction;
			dataType = dataType || _self.sortInfo.dataType;

			//���δ���������ֶΣ�������
			if(!field || !direction){
				return;
			}
			_self.resultRows.sort(function(obj1, obj2){
				return _self.compare(obj1, obj2, field, direction, dataType);
			});
		},

		//��ȡĬ�ϵ�ƥ�亯��
		_getDefaultMatch :function(){
			return this.matchFunction;
		},
	
		// ��ȡ��ҳ��
		calculatePageTotal: function(totalRows, length){
			var _self = this,
				recordNos = _self.getTotalCount(),
				limit = _self.getPageSize();
								
			if(!totalRows && !length){
				return Math.ceil(recordNos/limit);
			}
			
			return Math.ceil(totalRows/length); 
		},
		
		// ���ط�ҳ
		_localPagination: function(){
			var _self = this,				
				limit = _self.getPageSize(),
				nubs = _self.calculatePageTotal(); 

			// �趨 ҳ������	
			var start = 0,
				end = 0,
				curPageData = [],
				totalLength = _self.getTotalPage(),
				page = _self.getCurrentPage();	

			// ��һ�� �ݴ�������
			if(!_self.totalData.length){
				_self.totalData = _self.getResult();
			} 	
			
			// �趨��ҳ��
			_self.setTotalPage(nubs);
			
			// ��ҳ����	
			if(page < 1){
				page = 1;
			} 
			
			if(page > totalLength){
				page = totalLength;
			}	
			
			// ��ʼ��Χ -- ��һҳ vs ���һҳ
			start = page === 1 ? 0 : page*limit - limit;
			end = page === 1 ? limit : (page === totalLength ? undefined : page*limit);

			curPageData = _self.totalData.slice(start, end);

			// ���� ��ǰҳ
			_self.setCurrentPage(page);

			// �޸� result ���ݶ���
			_self.resultRows = curPageData;

			return curPageData;
		},
		
		// ��ȡ��ǰҳ��
		getCurrentPage: function(){
			var _self = this;
			return _self.pageInfo.currentPage;
		},

		// �趨��ǰҳ��
		setCurrentPage: function(curPage){
			var _self = this;

			if(S.isNumber(curPage) && curPage >= 0 ){				
				_self.pageInfo.currentPage = curPage;
				//_self.fire('currentPageChanged', {curPage: curPage});
				return curPage;
			}else{
				console.log('Invalid pagination value!');
			}
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
		setTotalPage: function(totalPage){
			var _self = this,
				beforTotalPage = _self.getTotalPage();
			
			if(totalPage !== beforTotalPage && totalPage >= 0){				
				_self.pageInfo.totalPage = totalPage;
				_self.fire('totalPageChange');
			}
			return _self.pageInfo;
		},

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
		* ���򷽷� -- ֧�� string || number(float) || date
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

		//��ʼ�� -- oldParams���� -- url���� -- resultRows
		_init : function(){
			var _self =this;

			_self.oldParams = _self.params || {};
			
			// ajax ���� -- �������
			if(_self.url) {
                _self.proxy.url = _self.url;
            }
            if(_self.method) {
                _self.proxy.method = _self.method;
            }
            if(_self.dataType) {
                _self.proxy.dataType = _self.dataType;
            }

            // ��ҳ��Ϣ -- �������             
            if(S.isNumber(_self.totalPage) ) {
                _self.pageInfo.totalPage = _self.totalPage;
            }
            if(S.isNumber(_self.limit) ) {
                _self.pageInfo.limit = _self.limit;
            }
            if(S.isNumber(_self.currentPage) ) {
                _self.pageInfo.currentPage = _self.currentPage;
            }

			_self.resultRows = [];
		}
	});

	return Store;

}, {requires:[]});

