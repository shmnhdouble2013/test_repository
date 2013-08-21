/**
 * @fileOverview 表单提示信息
 * @author dxq613@gmail.com
 */
KISSY.add(function (S,Overlay) {

  var CLS_TIP = 'ks-form-tip',
    FIELD_TIP = 'data-tip',
    CLS_TIP_CONTAINER = 'ks-form-tip-container'
  /**
   * name KISSY.LP.Tips.Item
   * @class 表单提示项
   */
  var tipItem = function(config){
    tipItem.superclass.constructor.call(this,config);
  };

  tipItem.ATTRS =
  /**
   * @lends KISSY.LP.Tips.Item#
   */
  {
      /**
       * 提示的表单元素
       * @type {Selector}
       */
      trigger:{

      },
      /**
       * 提示文本
       * @type {String}
       */
      text : {
      },
      /**
       * 提示信息前的图标
       * @type {Object}
       */
      iconCls:{

      },
      elCls:{
      },
      /**
       * 模版
       * @type {String}
       */
      tpl:{
        view:true,
        value:'<span class="{iconCls}"></span><span class="tip-text">{text}</span>'
      },
      visibleMode:{
        view:true,
        value:'display'
      },
	  zIndex :{
	 	value : 10
	  }
    };

  S.extend(tipItem, Overlay, {
	initializer : function(){
		var _self = this,
			render = _self.get('render');
		if(!render){
			var parent = S.one(_self.get('trigger')).parent();
			_self.set('render',parent);
			if(parent){
				parent.addClass(CLS_TIP_CONTAINER);
			}
		}
	},

    createDom : function(){
      var _self = this,
        tpl = _self.get('tpl'),
        el = _self.get('el'),
        attrs = _self.getAttrVals(),
        temp = S.substitute(tpl,attrs);
      el.addClass('ks-form-tip');
      new S.Node(temp).appendTo(_self.get('el'));
    },
    renderUI : function(){
      var _self = this;
	   _self.resetVisible();
    },
	/**
	* 重置是否显示
	*/
	resetVisible : function(){
		var _self = this,
			triggerEl = S.one(_self.get('trigger'));

		if(triggerEl.val()){//如果默认有文本则不显示，否则显示
			_self.set('visible', false);
		}else{
			_self.set('align', {
				node: triggerEl,
				points: ['tl','tl'],
				offset: [0, 3]
			});
			_self.set('visible',true);
		}
	},
    bindUI : function(){
      var _self = this,
        triggerEl = S.one(_self.get('trigger'));

      _self.get('el').on('click',function(){
        _self.hide();
        triggerEl[0].focus();
      });
      triggerEl.on('click focus',function(){
        _self.hide();
      });

      triggerEl.on('blur',function(){
		_self.resetVisible();
      });
    }
  });


  /**
   * @name KISSY.LP.Tips
   * @class 表单提示
   */
  var Tips = function(config){
    if (this.constructor !== Tips){
      return new Tips(config);
    }

    Tips.superclass.constructor.call(this,config);
    this._init();
  };

  Tips.ATTRS = {

    /**
     * 表单的选择器
     * @type {String|DOM|jQuery}
     */
    form : {

    },
    items : {
      value:[]
    }
  };

  S.extend(Tips,S.Base);

  S.augment(Tips,{
    _init : function(){
      var _self = this,
        form = S.one(_self.get('form'));
      if(form){
        S.each(S.makeArray(form[0].elements),function(elem){
          var tipConfig = S.one(elem).attr(FIELD_TIP);
          if(tipConfig){
            _self._initFormElement(elem,S.JSON.parse(tipConfig));
          }
        });
        //form.addClass(CLS_TIP_CONTAINER);
      }
    },
    _initFormElement : function(element,config){
      if(config){
        config.trigger = element;
      }
      var _self = this,
        items = _self.get('items'),
        item = new tipItem(config);
      items.push(item);
    },
    /**
     * 重置所有提示的可视状态
     */
    resetVisible : function(){
      var _self = this,
        items = _self.get('items');

      S.each(items,function(item){
        item.resetVisible();
      });
    },
    /**
     * 生成 表单提示
     */
    render:function(){
       var _self = this,
        items = _self.get('items');
       S.each(items,function(item){
        item.render();
       });
    },
    /**
     * 删除所有提示
     */
    destroy:function(){
      var _self = this,
        items = _self.get(items);

      $.each(items,function(index,item){
        item.destroy();
      });
    }
  });

  if(S.LP){
    S.LP.Tips = Tips;
  }

  Tips.Item = tipItem;
  return Tips;
},{
  requires: ['overlay', '2.0/css/formtips.css']
});