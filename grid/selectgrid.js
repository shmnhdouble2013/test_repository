/* @fileOverview Ʒ����Ӫ��̨--Ʒ�ƻý��ѡ��
* @extends  KISSY.Base
* @creator  �Ƽ�(ˮľ�껪double)<huangjia2015@gmail.com>
* @depends  ks-core
* @version 1.0  
* @update 2013-08-19
* @example
*   new SelectGrid({
	});
*/	

KISSY.add('mui/selectGrid', function(S, Grid, Validation, TL, placeholder, O) {
	var DOM = S.DOM,
		Ajax = S.IO,
		JSON = S.JSON,
		Event = S.Event,
		S_Date = S.Date;

	// �趨ȫ�� ���� ���� 
	var	TROPRATIONCLS = '.j_add_remove'			// ���/�Ƴ� btn cls����
	
	function SelectGrid(config){ 
		var _self = this,
			config = S.merge({
				isMoveData: false							// �Ƿ� �ƶ� ѡ�������? Ĭ��copy���� false				
			}, config);

		if( !(_self instanceof SelectGrid) ){
			return new SelectGrid(config);
		}

		SelectGrid.superclass.constructor.call(_self, config);		

		_self._init();
	}
	
	SelectGrid.VERSION = 1.0;

	// �̳���KISSY.Base  
	S.extend(SelectGrid, S.Base);

	S.augment(SelectGrid, {

		// �ؼ� ��ʼ��
		_init: function(){
			var _self = this;
			
			_self._domRender();
			_self._validaRender();
	        _self._eventRender();
		},

		// DOM��ʼ��
		_domRender: function(){
			var _self = this;
						
			// Ĭ�ϱ�
			_self.formEl = S.get(_self.get('formId')) || S.get('#J_pageForm');

			// tr���ݱ�ʾ Ĭ��Ϊ id
			_self.trIndex = _self.get('trIndex') || 'id'; 

			var toGridParm = {
				'formEl': _self.formEl,
				'trIndex' : _self.trIndex 
			};	

			
			// ��ѡ grid����
			_self.candGrid = new Grid( S.merge(_self.get('candGridConfig'), toGridParm) );
			_self.candStore = _self.candGrid.store;

			// ѡ���grid���� -- ����� ��ѡgrid������ɺ� --- ��ΪҪ���� ��ѡgird���ݻ���ѡ��״̬
			_self.poolGrid = new Grid( S.merge(_self.get('poolGridConfig'), toGridParm) );
			_self.poolStore = _self.poolGrid.store;

			// input�ı���ʾ
			placeholder.textHolder( S.query('.j_sourcesinput') );
		},

		// У��ʵ����
		_validaRender: function(){
			var _self = this;

			if(_self.formEl){
				_self.ValiForm = new Validation(_self.formEl, {
			        style: 'tbsUiValid_under' 				 // ��ֻ��ʾ У���ı� style������  tbsUiValid_text  tbsUiValid_under  mui������kissy
			    });
			}
		},

		// �¼���ʼ��
		_eventRender: function(){
			var _self = this,
				addMoreBtn = _self.get('addMoreBtnId') || '#J_addMore', 
				removeMorBtn = _self.get('removeMorBtnId') || '#J_removeMore',
				searchBtn = _self.get('searchBtnId') || S.get('#J_search_btn');

			/******* ѡ���table �¼���� *******/	
			
			/* ѡ���-�����ѯ */
			Event.on(searchBtn, 'click', function(){
				_self.searchPageEvent();
			});	
			
			// ����ҳ��仯
			_self.poolGrid.pagination.on('afterPageChange', function(e) {
				var curPage = e.idx,
					parms = { 		
						currentPage: curPage
					};
				
				_self.searchPageEvent(parms);
			});
			
			
			// ȫѡ �������
			Event.on(addMoreBtn, 'click', function(){
				var data = _self.poolGrid.getSelection();
				
				if(data.length<1){
					_self._alertFn('��ǰѡ��Ϊ�գ�');					
				}else{									
					_self.candStore.add(data, true); 		// ������� �� ȥ��
					_self.poolGrid._setDataSelect(data, true);	// ȡ����� ����checkbox ѡ��״̬
				}				
			});
			
			// ѡ��� table �������� btn����¼�
			_self.poolGrid.on('cellClick', function(event){				
				_self._poolGridClick(event);						
			});
						
			
			/******* ��ѡtable �¼���� *******/
			
			// �����Ƴ�
			Event.on(removeMorBtn, 'click', function(){
				var data = _self.candGrid.getSelection();
				
				if(data.length<1){
					_self._alertFn('��ǰѡ��Ϊ�գ�');					
				}else{									
					_self.candStore.remove(data); 		// ɾ������ 
					_self.candGrid._setHeaderChecked(false); 

					// ȡ��ѡ�� ѡ���ѡ��״̬
					_self.poolGrid._setDataSelect(data, false);
				}				
			});	

			// ��ѡtable �������� btnɾ���¼� -- // �Զ� ȡ�� ѡ��ر����Ӧ����ѡ��״̬
			_self.candGrid.on('cellClick', function(event){				
				_self._candGridClick(event);						
			});

			// ���ݺ�ѡ�� ������� ���� ѡ���ѡ��״̬-����ʾ����	-- ֧�� �첽��ѯ �� ��ҳ
			_self.poolGrid.on('aftershow', function(){
				var candData = _self.candStore.getResult();

				_self.poolGrid._setDataSelect(candData, true);	
			}); 


			// ��ѡ�� vs ȫѡ ƥ�� 
			_self.poolGrid.on('rowselected rowunselected', function(ev){
				_self.autoSelect.call(this, ev);
			});
			_self.candGrid.on('rowselected rowunselected', function(ev){
				_self.autoSelect.call(this, ev);
			});			  	

			/******* ҳ����� *******/
			
			// ����ѡ��
			// Event.on('#J_resetBack', 'click', function(){
			// 	var selectLength = _self.candStore.getCount();
				
			// 	if(selectLength>1){
			// 		_self._alertFn('��ǰѡ������Ϊ�գ�');
			// 	}else{
			// 		_self.saveData('Y');
			// 	}
			// });

			// ��������
			Event.on('#J_saveSelectData', 'click', function(){
				var selectLength = _self.candStore.getCount();

				if(selectLength<1){
					_self._alertFn('��ǰѡ������Ϊ�գ�');
				}else{
					_self.saveData('');
				}
			});

			// ��ֹ���س�ˢ��
			Event.on(_self.formEl, 'submit', function(){
				return false;
			});
		},

		// ����ƥ�� ���ݹ�ѡ �� ȫѡ״̬
		autoSelect: function(ev){
			var type = 	ev.type;

			if(type === 'rowselected'){
				this._isAllRowsSelected() && this._setHeaderChecked(true);
			}else{
				this._setHeaderChecked(false); 
			}
		},

		// �������ݹ��÷���
		saveData: function(isResetActive){
			var _self = this,
				selectData = _self.candStore.getResult(),
				stringiFy = JSON.stringify(selectData);

			DOM.val('#J_resetActive', isResetActive);
			DOM.val('#J_selectTableData', stringiFy);
			_self.formEl.submit(); // ͬ���ύ��
		},
	
		// ѡ��� grid ����
		_poolGridClick: function(event){
			var _self = this,
				data = event.data,
				row = event.row,
				target = event.domTarget;	

			// ��Ӱ�ť	
			if( DOM.hasClass(target, TROPRATIONCLS) ){
				_self.candStore.add(data, true); 	 			 // ������� �� ȥ�� 				
				_self.poolGrid.setSelectLock(row, true); 		// ����trѡ��״̬	
			}	
		},
		
		// ��ѡ�� grid ����
		_candGridClick: function(event){
			var _self = this,
				data = event.data,
				row = event.row,
				target = event.domTarget;
			
			// �Ƴ���ť	
			if( DOM.hasClass(target, TROPRATIONCLS) ){
				_self.candStore.remove(data); 					// �Ƴ�����	

				// ȡ��ѡ�� ѡ���ѡ��״̬
				_self.poolGrid._setDataSelect(data, false);							
			}			
		},
	
		// �����ѯ ���� ��ҳ ����-- �첽���ݷ���
		searchPageEvent: function(pageObj){
			var _self = this;

			if(!_self.ValiForm.isValid()){
				return;
			}

			var	data = TL.encodeURIParam( TL.serializeToObject(_self.formEl) ), // encodeURI				
				endData = S.isObject(pageObj) ? S.merge(data, pageObj) : data;

			if(!endData['acname']){
				endData['acname'] = '';
			}	

			_self.poolStore.load(endData);
		},

    	// ��ʾ����
		_alertFn: function(msg, callback){
			var _self = this;

			(new O.Alert(msg, callback)).show();            
		}
	});

return SelectGrid;

}, {'requires':['mui/grid', 'Validation', 'TL', 'mui/placeholder', 'mui/overlay','mui/overlay/overlay.css', 'sizzle']});


