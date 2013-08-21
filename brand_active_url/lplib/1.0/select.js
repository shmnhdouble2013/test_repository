
KISSY.add('linkselect',function(S){
	
	var DOM = S.DOM, 
		Event = S.Event,
		cfg = {
			defval: {
				text: '��ѡ��', val: ''
			},
			rootid: 0
		};
	
	function LinkSelect(selects,data,config){
		var self = this;
		
		//Ĭ������
		self.config = S.merge(cfg,config||{});
	
		//select���������
		self.selManager = new selManager();
		
		//��ʼ���ݼ�
		self.data = data;

		//��ʼ������select����
		S.each(selects,function(item,index){
			item = DOM.get(item);
			if(item){
				var objsel = self.selManager.add(item,index);
				Event.on(item,'change',function(ev){
					self._change(objsel,DOM.val(ev.target));
				});
			}
		});

		//self.focus(0,0);
		//debugger
		self._render(self.selManager.get(0),self.config.rootid);
	}
	
	
	S.augment(LinkSelect,S.EventTarget,{
	
		_change: function(psel,pid) {
			var self = this, 
				objsel = self.selManager.get(psel.index+1);
			if(objsel) {
				self._render(objsel,pid);
				//arguments.callee(objsel, -1);
				self._change(objsel, -1);
			}
		},

		_getData: function(objsel,pid){
			var self = this, 
				remote = self.config.remote, 
				options = [];
			
			if(pid===-1  || pid==='' || !objsel.data){
				return;
			}
				
			
			//�����Ѿ���ʼ��
			if(objsel.data[pid]){
				return objsel.data[pid];
			}
			
			//����û�г�ʼ��
			var tdata = objsel.data[pid] = [];
			
			
			//Զ������
			if(remote) {
				if(pid===0 && self.data.length>0){
					return;
				}
				S.io({
					type: 'POST',
					url: remote.url,
					dataType: 'json',
					data: {
						parent: pid
					},
					success: function(data , textStatus , xhrObj){
						S.each(data.data,function(item){
							tdata.push([item[1],item[0]]);
						});
						self._render(objsel,pid);
					},
					error: function(data, textStatus, xhrObj){
						S.log(d, textStatus, xhrObj);
					}
				});
			}
			
			//��������
			S.each(self.data, function(item,key){
				// if(item.parent == pid){
					// tdata.push([key,item.text]);
					//delete self.data[key];
					// options.push([key,item.text]);
				// }
				if(item[1]==pid){
					tdata.push([key,item[0]]);
					//delete self.data[key];
					options.push([key,item[0]]);
				}
			});
			
			return options;
		},
		
			
		_render: function(objsel,pid,val) {
			var self = this, 
				cfg = self.config, 
				sel = objsel['0'],
				options = self._getData(objsel,pid) || [];
			
			if(!sel){
				return;
			}
			
			//clear
			sel.options.length=0;
			
			//default tip
			if(options && options.length>0 && cfg.defval){
				//sel.add(new Option(cfg.defval.text,cfg.defval.val),null); 
				sel.options[sel.options.length] = new Option(cfg.defval.text,cfg.defval.val);
			}
				
				
			//add all option
			S.each(options,function(item){
					//sel.add(new Option(item[1],item[0]),null); 
					sel.options[sel.options.length] = new Option(item[1],item[0]); 
			});
			
			if(val){
				DOM.val(sel,val);
			}
		},
		
		focus: function(sel,val) {
			var self = this, 
				objsel = self.selManager.get(sel),
				pid = null;	
			
			if(!objsel){
				return;
			}
			self._change(objsel,'');
			
			(function(objsel,val){
				if(!objsel){
					return;
				}
				if(objsel.index==0){
					self._render(objsel,self.config.rootid,val);
				}else{
					pid = self.data[val];
					if(pid){
						self._render(objsel,pid[1],val);
						arguments.callee(self.selManager.get(objsel.index-1),pid[1]);
					}	
				}
			})(objsel,val);
			
			//��ǰ������һ��������Ҫ��ʼ��
			if(self.selManager.get(objsel.index+1)){
				self._render(self.selManager.get(objsel.index+1),val);
			}

		}
	
	});

	
	function selManager(){
		var store = [];
		this.add = function(item,index){
			var l = store.length;
			store[l] = {
				'index': index,
				'0': item,
				'data': {}
			};
			return store[l];
		};
		this.get = function(sel){
			var obj = null;
			if(S.isNumber(sel) && sel<=store.length){
				return store[sel];
			}
			S.each(store,function(item){
				if(item['0']==sel){
					obj = item;
					return false;
				}
				return obj;
			});
		};
	}
	
	
	S.LinkSelect = LinkSelect;
	return LinkSelect;

});
