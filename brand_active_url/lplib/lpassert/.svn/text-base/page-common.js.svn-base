/**
 * author : yezengyue
 * modify : huximing
 */
KISSY.add("checkbox",function(S){
		var CHECKED = "checked" ;

		function checkBox(checkList){
			var self = this ;
			if(S.isString(checkList)){
				this.checkList = S.all(checkList) ;
			}
			else{
				this.checkList = checkList ;
			}
		}
		
		S.augment(checkBox,{
			getCheckedValue:function(){
				var checkList = this.checkList,
					val, value = [], text = [] ;
				checkList.each(function(item){
					if(item.attr(CHECKED)){
						value.push(item.val());
						text.push(item.next("label").html());
					}
				});
				val = {
					value:value,
					text:text
				};
				return val ;
			},
			setCheckedValue:function(value,sep,add){
				var checkList = this.checkList ;
				if(S.isString(value)){
					value = value.split(sep) ;
				}
				checkList.each(function(item){
					if(S.inArray(item.val(), value)){
						item.attr(CHECKED,CHECKED) ;
					}
					else if(!add){
						item.removeAttr(CHECKED) ;
					}
				});
			},
			removeChecked:function(value,sep){
				var checkList = this.checkList ;
				if(S.isString(value)){
					value = value.split(sep) ;
				}
				checkList.each(function(item){
					if(S.inArray(item.val(), value)){
						item.removeAttr(CHECKED,CHECKED) ;
					}
				});
			},
			clearChecked:function(){
				this.checkList.removeAttr(CHECKED);
			}
		});

		S.CheckBox = checkBox ;
		return checkBox ;

},{requires: ["core"]});

KISSY.add("popup-city",function(S){

	var S = KISSY , DOM = S.DOM, Event = S.Event, doc = document,
		data = {
				group:[
					{value:'上海,江苏,浙江',text:"江浙沪"},
					{value:'上海,江苏,浙江,安徽,福建,江西,山东',text:"华东"},
					{value:'北京,天津,河北,山西,内蒙古',text:"华北"},
					{value:'湖北,湖南,河南,江西',text:"华中"},
					{value:'广东,广西,海南,台湾,香港,澳门',text:"华南"},
					{value:'辽宁,吉林,黑龙江',text:"东北"},
					{value:'陕西,甘肃,青海,宁夏,新疆',text:"西北"},
					{value:'重庆,四川,贵州,云南,西藏',text:"西南"},
					{value:'台湾,香港,澳门',text:"港澳台"},
					{value:'海外',text:"海外"},
				],
				item:[
					{value:'北京',text:"北京"},
					{value:'天津',text:"天津"},
					{value:'河北',text:"河北"},
					{value:'山西',text:"山西"},
					{value:'内蒙古',text:"内蒙古"},
					{value:'辽宁',text:"辽宁"},
					{value:'吉林',text:"吉林"},
					{value:'黑龙江',text:"黑龙江"},
					{value:'上海',text:"上海"},
					{value:'江苏',text:"江苏"},
					{value:'浙江',text:"浙江"},
					{value:'安徽',text:"安徽"},
					{value:'福建',text:"福建"},
					{value:'江西',text:"江西"},
					{value:'山东',text:"山东"},
					{value:'河南',text:"河南"},
					{value:'湖北',text:"湖北"},
					{value:'湖南',text:"湖南"},
					{value:'广东',text:"广东"},
					{value:'广西',text:"广西"},
					{value:'海南',text:"海南"},
					{value:'重庆',text:"重庆"},
					{value:'四川',text:"四川"},
					{value:'贵州',text:"贵州"},
					{value:'云南',text:"云南"},
					{value:'西藏',text:"西藏"},
					{value:'陕西',text:"陕西"},
					{value:'甘肃',text:"甘肃"},
					{value:'青海',text:"青海"},
					{value:'宁夏',text:"宁夏"},
					{value:'新疆',text:"新疆"},
					{value:'台湾',text:"台湾"},
					{value:'香港',text:"香港"},
					{value:'澳门',text:"澳门"},
					{value:'海外',text:"海外"},
				]
		},
		SEPARATE = "," , A = "a", CLICK = "click", ALIGN = "align",
		DIV = "div", INPUT = "input" , SPAN = "span" , SRC_NODE = "srcNode",
		TRIGGER_NODE = "triggerNode",
		more,popup,checkBox,checkBoxGroup;
		
		

	function popupCity(config){
		var _self = this;
		_self.config = config || {};
		this._init();
	}

	S.augment(popupCity,{
		_init:function(){
			this._initDOM();
			this.setPopupBox();
			this.more = more;
			this.popup = popup ;
		},
		_initDOM:function(){
			var div = doc.createElement(DIV) ;
			div.style.cssText = "display:none;" ;
			div.id = "J_Popup" ;
			div.appendChild(this.createGroup(data.group, "J_CheckboxGroup"));
			div.appendChild(this.createGroup(data.item,"J_Checkbox"));
			div.appendChild(this.createButton());
			document.body.appendChild(div);
		},
		createItem:function(val){
			var span, input,label;
			input = doc.createElement(INPUT) ;
			input.type = "checkbox";
			input.value = val.value ;
			input.className = "form-field-checkbox"
			label = doc.createElement("label") ;
			label.className = "form-label" ;
			label.innerHTML = val.text ;
			span = doc.createElement(SPAN);
			span.className = "select-item" ;
			span.appendChild(input);
			span.appendChild(label);
			return span ;
		},
		createGroup:function(group,id){
			var div = doc.createElement(DIV),
				span;
			div.className = "select-list ks-clear" ;
			div.id = id ;
			for(var i in group){
				span = this.createItem(group[i]);
				div.appendChild(span) ;
			}
			return div ;
		},
		createButton:function(){
			var div = doc.createElement(DIV);
			div.className = "select-list" ;
			div.innerHTML = "<a class='form-button' href='javascript:void(0);' id='J_Ok'> "
							+ "<button class='form-button-blue2' type='button'>确定</button>"
							+ "</a>"
							+ "<a class='form-button' href='javascript:void(0);' id='J_Cancel'>"
							+ "<button class='form-button-blue2' type='reset'>取消</button>"
							+ "</a>" ;
			return div ;
		},
		setPopupBox:function(){
			var _self = this;
			var max = _self.config.mx || 10,
				min = _self.config.min || 0;
			more = new S.More("#J_Rule", {
				itemList:'.table-item',
				del:'.form-field-container',
				delTips:true,
				max:max,
				min:min,
				minFn:function(){
					S.LP.Message.Alert('不能小于'+min+'项') ;
				},
				maxFn:function(){
					S.LP.Message.Alert("info","不能大于"+max+"项",'') ;
				}
			}) ;//更多
			popup = new S.Overlay({
									srcNode:"#J_Popup",
									width: 450,
									mask:true,
									elStyle:{
										position:'absolute',
										display:'block'
									}
			});//初始化浮出层

			checkBoxGroup = new S.CheckBox("#J_CheckboxGroup input");
			checkBox = new S.CheckBox('#J_Checkbox input');

			checkBoxGroup.checkList.on("click",function(){
				var val = DOM.val(this),
					checked = DOM.attr(this,"CHECKED");
				if(checked){
					checkBox.setCheckedValue(val,SEPARATE,true) ;
				}else{
					checkBox.removeChecked(val,SEPARATE);
				}
			});

			more.itemList.each(function(item){
				item.one(A).on(CLICK,function(){
					popup.set(TRIGGER_NODE,this);
					popup.show();
				});
			});//为每项里面添加事件

			popup.on("show",function(ev){
				var node = popup.get(TRIGGER_NODE),
					valField = DOM.prev(node,INPUT);
				checkBoxGroup.clearChecked();
				checkBox.setCheckedValue(DOM.val(valField),SEPARATE) ;
				popup.align(node,['tr', 'tl'],[0, 0]) ;
			});//在每次浮出前设置里面的选中值

			Event.on("#J_Ok",CLICK,function(){
				var flag = false, node = popup.get(TRIGGER_NODE),
				valField = DOM.prev(node,INPUT),
				textField = DOM.prev(node,SPAN),
				val = checkBox.getCheckedValue();

				var checkedList = [],current =  DOM.val(DOM.prev(node,INPUT)),v;
				more.itemList.each(function(item){
					v = item.one(INPUT).val() ;
					if(v !== current){
						checkedList.push(v);
					}
				});
				checkedList = checkedList.join(SEPARATE).split(SEPARATE) ;

				S.each(val.value,function(vv){
					if(S.inArray(vv,checkedList)){
						flag = true;
						return ;
					}
				});

				popup.hide();
				if(flag) {
					S.LP.Message.Alert('您选择了重复项,不能重复选择！') ;
					return ;
				}
				DOM.val(valField,val.value.join(SEPARATE));
				DOM.html(textField,val.text.join(SEPARATE)) ;
			});//确定按钮返回值并设置项


			Event.on("#J_Cancel",CLICK,function(){
				popup.hide();
			});//取消只用隐藏就可以了

			Event.on("#J_AddRule",CLICK,function(event){
				event.halt();
				more.template.one(".text-val").html("");
				more.template.all(INPUT).val("");
				var item = more.add();
				if(item){
					item.one(A).on(CLICK,function(){
						popup.set(TRIGGER_NODE,this);
						popup.show();
					});
				}
			});
			
		}
	});

	S.PopupCity = popupCity ;
	return popupCity ;

},{requires: ["core","overlay","checkbox","1.0/message"]});


KISSY.add("more",function(S){
	var Node = S.Node, current = 0 ;

	function More(container,config){
		var _self = this ;
		if (!(_self instanceof More)) {
            return new More(container, config);
        }
		var defaultConfig = {
			max:10,
			min:0
		}
		_self.config = S.merge(defaultConfig, config || {}) ;
		_self.container = S.one(container) ;
		if (!_self.container) return ;
		this._init();
	}

	S.extend(More, S.Base);

	S.augment(More,{
		_init:function(){
			var template = this.config.template,
				self = this ;
			this._freshList();
			if(!template && this.itemList){
				self.container = this.itemList.parent();
				template = this.itemList[0].cloneNode(true) ;
				this.template = S.one(template) ;
			}
			else{
				this.template = new Node(template) ;
			}
			if(!this.config.postback){
				this.itemList.each(function(v){
					self._renderDel(v) ;
				});
			}
			else{
				this.itemList.each(function(v){
					v.all("input").attr("disabled","disabled")
				});
			}
			if(this.config.form){
				S.one(this.config.form).on("submit",function(){
					self.setName();
				});
			}
		},
		_freshList:function(){
			var itemList = this.config.itemList ;
			if(itemList){
				this.itemList = this.container.all(itemList) ;
			}
		},
		setName:function(){
			if(!this.itemLenth){
				var length = new Node("<input type='hidden' name='length' />").val(this.itemList.length);
				this.container.append(length) ;
				this.itemLenth = length ;
			}
			else{
				this.itemLenth.val(this.itemList.length) ;
			}
			this.itemList.each(function(item,index){
				var element = item.all("*") ;
				element.each(function(el){
					var attr = el.attr("rname") || el.attr("name") ;
					if(attr){
						el.attr("rname",attr);
						el.attr("name",attr + index)
					}
						
				});
			});
		},
		add:function(){
			var newItem = S.one(this.template[0].cloneNode(true)),
			length = this.itemList.length;

			if(length >= this.config.max){
				var maxFn;
				if(maxFn = this.config.maxFn) maxFn(); 
				return null;
			}

			if(this.config.del)
				this._renderDel(newItem);
			this.container.append(newItem) ;

			//NodeList add
			this._freshList();
			return newItem ;
		},
		remove:function(item){
			if(!item) return ;
			var length = this.itemList.length ;

			if(length <= this.config.min){
				var minFn;
				if(minFn = this.config.minFn) minFn(); 
				return;
			}

			this.fire('remove',{item:item});
			item.remove();
			this._freshList();
		},
		_renderDel:function(item){
			var del,_self = this ;
			del = new Node("<a href='javascript:void(0);'>删除</a>") ;
			del.appendTo(item.one(this.config.del)) ;
			del.on('click',function(ev){
				ev.halt();
				if(_self.config.delTips){
					S.LP.Message.Confirm("确定要删除吗？","删除提示",function(){
						_self.remove(item);
					})
				}
				else{
					_self.remove(item);
				}
			});
		}
	});

	S.More = More ;
	return More;
},{requires: ["core"]});
KISSY.add(function(S,More,PopupCity,CheckBox){
	return {
		More : More,
		PopupCity : PopupCity,
		CheckBox : CheckBox
	}
},{requires: ["more","popup-city","checkbox"]});