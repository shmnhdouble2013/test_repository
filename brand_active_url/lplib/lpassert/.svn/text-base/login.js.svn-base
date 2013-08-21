/** 
* login
*/
KISSY.add(function(S){

	var DOM = S.DOM,
		Event = S.Event;

	var CLS_ACTIVE = 'ks-active',
		DATA_ROLE = 'data-value';

	function Login(config){
		var _self = this;
		_self.config = config;
		_self._init();
	}
	S.augment(Login, {

		_init: function(){
			var _self = this; 
			
			_self.formValidation = new S.Validation('#J_LoginForm', {
				style: 'text'
			});

			//_self.roleListEl = S.one('.login-role-list');

			// 根据J_Role的值和cookies 回显工作角色
			//_self.initRole();
			
			_self.initLoginName();
			_self._initEvent();
		},

		_initEvent: function(){
			var _self = this;
			// 选择工作角色
			/*_self.roleListEl.delegate('click','.login-role-item',function(event){
				var sender = S.one(event.currentTarget);
				_self.selectRole(sender);
			});*/
			// 鼠标覆盖提交按钮
			/*Event.on('.login-submit','mouseenter',function(event){
				var sender = S.one(event.currentTarget);
				sender.addClass(CLS_ACTIVE);
			});
			// 鼠标离开提交按钮
			Event.on('.login-submit','mouseleave',function(event){
				var sender = S.one(event.currentTarget);
				sender.removeClass(CLS_ACTIVE);
			});*/
			// 提交
			S.one('#J_Submit').on('click', function(){
				_self.submitLogin();
			});
			Event.on('.form-field-text', 'keyup', function(e){
				if(e.which === 13){
					_self.submitLogin();
				}
			});
			Event.on('.form-field-small-text', 'keyup', function(e){
				if(e.which === 13){
					_self.submitLogin();
				}
			});
		},
		initLoginName: function(){
			var _self = this,
				loginInput = S.one('#login-name'),
				loginName = S.Cookie.get('lpLoginName');
			if(!loginInput.val() && loginName){
				loginInput.val(loginName);
			}
		},

		/*initRole: function(){
			var _self = this,
				roleInput = S.one('#J_Role'),
				roleValue = roleInput.val(),
				role = null;
			if(roleValue === ''){
				roleValue = S.Cookie.get("lprole");
			}
			S.each(_self.roleListEl.children(), function(r){
				if(DOM.attr(r, DATA_ROLE) === roleValue){
					role = S.one(r);
					return false;
				}
			});
			if(role !== null){
				_self.selectRole(role);
			}
		},*/

		submitLogin: function(){
			var _self = this;
			if(_self.formValidation.isValid()){
				_self.saveLoginName();
				S.get('#J_LoginForm').submit();
			}
		},
		
		saveLoginName: function(){
			var _self = this,
				expireDate=new Date(),
				loginName = S.one('#login-name').val();
			expireDate.setTime(expireDate.getTime()+18400000000);

			S.Cookie.set('lpLoginName', loginName, expireDate);
		}

		/*selectRole: function(role){
			var _self = this,
				roleInput = S.one('#J_Role'),
				roleValue = role.attr(DATA_ROLE);
			_self.roleListEl.children().removeClass(CLS_ACTIVE);
			role.addClass(CLS_ACTIVE);
			roleInput.val(roleValue);
			_self.setCookies(roleValue);
			S.one('#J_RoleTip').hide();
			S.one('#J_FormCon').show();
			_self.resetRegist(roleValue);
		},
		setCookies: function(roleValue){
			var _self = this,
				expireDate=new Date();
			expireDate.setTime(expireDate.getTime()+18400000000);

			S.Cookie.set("lprole", roleValue, expireDate);
		},
		resetRegist: function(roleValue){
			var _self = this,
				registLink = S.one('.login-regist');
			if(roleValue === _self.config.supplierRoleValue){
				registLink.hide();
			}else{
				registLink.show();
			}
		}*/

	});

	S.namespace('LP');
	S.LP.Login = Login;

},{requires: ['lpassert/validation']});

