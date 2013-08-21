KISSY.add(function(S,Core,Uicommon,Grid,Dialog,Remote){

	var DOM = S.DOM,$=S.all, Event = S.Event ;

	function product(config){
		var _self = this;
		var skuList=skuList||config.skuList,
			skuId =config.skuId || 'skus',
			FIELD_ID=config.id||"skuId",
			FIELD_DEL = config.delId||"g",
			loadUrl = config.loadUrl||'',
			searchUrl = config.searchUrl,
			autoSearch = config.autoSearch === false ? false:true,
			gridError = config.gridError||'gridError',
			gridErrorEl = S.one('#'+gridError),
			errorMsg= config.errorMsg || '计划入库量不能为空！',
			validator = config.validator || function(record){return true;},
			dialogTitle = config.dialogTitle || '添加商品',
			matchFnc = config.matchFunc || function(obj1,obj2){
				if(!obj1||!obj2)
					return false;
				return obj1[FIELD_ID] == obj2[FIELD_ID];
			},
			selectedRows= [],
			productColumns = config.pColumns,
			pstore =new S.LP.Store({
					url : loadUrl,
					autoLoad:!!loadUrl,
					remoteSort:false
			}),
			isSummary = isSummary(productColumns);
		
		var	pconfig={
				renderTo:'pgrid',
				checkable:false,
				columns: productColumns,
				store:pstore,
				loadMask:true
			};
		if(isSummary){
			pconfig.listeners = {'aftershow':function(){
				var sumaryObj = {},
					records = pstore.getResult();
				if(records.length == 0) {
					return;
				}
				S.each(productColumns, function (column){
					if(column.summary) {
						sumaryObj[column.dataIndex] = 0;
					}
				});

				S.each(records, function (record){
					for(var field in sumaryObj){
						if(sumaryObj.hasOwnProperty(field)){
							sumaryObj[field] += (record[field] || 0);
						}
					}
				});
				pgrid.addSummary(sumaryObj);
			}};
		}
		
		if(!gridErrorEl){
			gridErrorEl = new S.Node('<div class="form-line ks-clear"><span id="'+gridError+'" class="form-field-container"></span></div>')
				.appendTo(S.one('#pgrid').parent());
		}
		var pgrid = new S.LP.EditGrid(pconfig);
		
		
		var store =new S.LP.Store({
				url : searchUrl,
				autoLoad:autoSearch
			});
		var searchColumns= config.searchColumns||[      //弹出框内列表的列配置
            { title: '货品名称', width: 100, sortable: true, dataIndex: 'productName'},                    
            { title: 'SKU-ID', width: 100, sortable: true, dataIndex: 'skuId'},
            { title: 'SKU属性', width: 100, sortable: true, dataIndex: 'skuProperties'},
            { title: '重量', width: 80, sortable: true, dataIndex: 'weight'},
            { title: '体积', width: 120, sortable: true, dataIndex: 'length',renderer:function(status,record){
				 if(record.length&&record.width&&record.height){
					return record.length + "*" + record.width + "*" + record.height;
				 }else{
					return '';
				 }
               }
            }               
         ];
		var searchconfig = {
				renderTo:'popgrid',
				width:588,
				checkable:true,
				forceFit:true,
				height:325,
				columns: searchColumns,
				store:store,
				bbar:{pageSize:10},
				loadMask:true
			}
			
		var grid = new S.LP.Grid(searchconfig);

		var dialogConfig = {			
					width: 600,						//初始化宽度
					height: 400,					//初始化高度
					title: '添加商品',			//标题
					contentID:'ks-userTemplate',	//设置模板id
					buttons:[{
						text:'确认',
						eventType:'click',
						handler:function(){
							
							var fRows = pstore.getResult()
								delRow =[];
							S.each(fRows,function(row){
								if(findIndexBy(row,selectedRows)==-1){
									delRow.push(row);
								}
							});

							pstore.add(selectedRows,true,matchFnc);
							pstore.remove(delRow,matchFnc);
							this.close();
						}
					},{
						text:'关闭',
						eventType:'click',
						handler:function(){
							this.close();
						}
					}]
				};
		initEvent();
		if(!loadUrl && skuList){
			pstore.setResult(skuList);
		}
		function isSummary(columns){
			var result = false;
			S.each(columns, function (column){
				if(column.summary) {
					result = true;
					return false;
				}
			});
			return result;
		}

		function initEvent(){
			var btn = S.one('#btn');
			if(btn){
				var sellerCode = null;
				btn.on('click',function(){
					var sellerCodeEl = S.one('#sellerCode');
					if(sellerCodeEl){
						var code = sellerCodeEl.val();
						if(sellerCode!==code){
							sellerCode = code;
							store.load({sellerCode:code,start:0,pageIndex:0});
						}
					}
					selectedRows = S.clone(pstore.getResult())||[];
					setGridSelection();
					var dialog1 = new S.LP.Dialog(dialogConfig);
					dialog1.show();
				});	
			}
			
			Event.on('#form','submit',function(event){
				var results =pstore.getResult();

				if(results.length ==0 || results.length >50){
					event.preventDefault();
					showGridError('选择SKU数量不在范围之内 0 - 50 内');
					return;
				}
				if(validateRecords(results)){
					clearGridError();
					var str = S.JSON.stringify(results);
					//S.one('#'+skuId).val(str);
					DOM.val('#'+skuId, str);
				}else{
					event.preventDefault();
					showGridError(errorMsg);
				}
				
			});

			initGridEvent();
		}
		function isRecordsValidate(){
			var results =pstore.getResult();
			if(results.length ==0 || results.length >50)
				return false;
			return validateRecords(results);
		}
		function initGridEvent (){
			pgrid.on('cellclick',function(event){
				
				var target = event.domTarget;
				if(event.field == FIELD_DEL && DOM.hasClass(target,'grid-command')){
					event.preventDefault();
					pstore.remove(event.data);
				}
			});

			
			grid.on('aftershow',function(){
				
				setGridSelection();
				bindSelectEvent();
			});
		}
		function selectedFunc(event){
			var record = event.data;
			if(findIndexBy(record,selectedRows)==-1){
				selectedRows.push(record);
			}
		}

		function unselectedFunc(event){
			var record = event.data,
				index = findIndexBy(record,selectedRows);
			if(index!==-1){
				selectedRows.splice(index,1);
			}
		}

		function bindSelectEvent(){
			grid.on('rowselected',selectedFunc);

			grid.on('rowunselected',unselectedFunc);
		}

		function unbindSelectEvent(){
			grid.detach('rowselected',selectedFunc);

			grid.detach('rowunselected',unselectedFunc);
		}
	
		function showGridError(msg){
			if(gridErrorEl){
				var temp = '<label class="valid-text" style=""><span class="estate error"><em class="label">'+msg+'</em></span></label>';
				gridErrorEl.html(temp);
			}
		}

		function clearGridError(){
			if(gridErrorEl){
				gridErrorEl.text('');
			};
		}

		function validateRecords(records){
			var valid=true;
			S.each(records,function(record){
				if(!validator(record)){
					valid=false;
					return false;
				}
			});

			return valid;
		}
		function setGridSelection(){
			unbindSelectEvent();
				
			var ids = getRecordIds(FIELD_ID,selectedRows);
			grid.clearSelection();
			grid.setSelection(FIELD_ID,ids);
			bindSelectEvent();
		}

		function findIndexBy(target,rows){
			var position = -1,
				records = rows;
			S.each(records,function(record,index){
				if(matchFnc(record,target)){
					position = index;
					return true;
				}
			});
			return position;
		}

		function getRecordIds(field,records){
				var result =[];
				S.each(records,function(record){
					result.push(record[field]);
				});
				return result;
		}
		function processData(data,value){
				if(data.state){
					for(var key in data){
						DOM.html("." + key,data[key]);
					}
					DOM.removeAttr('#btn','disabled');
					var code = S.one('#sellerCode').val();
					
				}else{
					DOM.html(".sellerInfo",'');
					DOM.attr('#btn','disabled','disabled');
				}
				return [data.message,data.state];
		}
		if(S.one('form')){
				/*验证*/
			var form = new S.Validation('form',{
					style:'text'
				});
			this.isFormValidate = function(){
				return form.isValid() && isRecordsValidate();
			}
			var field = form.get('sellerCode');
			//判断是否存在 商家编码，如果存在则 获取查询列表
			if(!autoSearch){
				var sellerCodeEl = S.one('#sellerCode');
				if(sellerCodeEl && sellerCodeEl.val()){
					processData({state:true});
				}
				if(sellerCodeEl){
					sellerCodeEl.on('change',function(){
						pstore.setResult([]);
						DOM.val('#'+skuId, "");
					});
				}
			}

			var callback = function(est,msg){
				field.showMessage(est,msg);
			};

			var cfg = {
				url:'checkSellerCode.json',
				success:processData
			}

			if(field){
				var ajax = new Remote(field.el,cfg,callback);

				field.addRule("ajax",function(value){
					var result = ajax.check(value,'sellerCode') ;
					return processData(result,value);
				});

				Event.on(field.el,'blur',function(){
					if(!DOM.val(this)){
						DOM.html(".sellerInfo",'');
						DOM.attr('#btn','disabled','disabled');
					}
				});
			}
			
			Event.on('form',"submit",function(){
				return form.isValid();
			});
		}
	}

	KISSY.use('lpassert/calendar',function(S,calendar){
		var c = calendar([
			{selector:"#J_InOrdersDate"}
		]);
	});

	return product;
	},{ requires: ["core","1.0/uicommon", "1.0/grid","1.0/dialog","lpassert/remote"]});	