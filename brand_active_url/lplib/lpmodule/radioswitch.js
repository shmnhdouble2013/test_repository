/**
   * @fileOverview checkbox或者radio的切换
   * @author zengyue.yezy
   */
  KISSY.add(function(S, Validation){
    var DOM = S.DOM,
        Event = S.Event;

    var CLS_HIDDEN = 'ks-hidden';

    /**
     * @name RadioSwitch
     * @class CheckBox 或者 radio的切换显示隐藏
     * @param {Object} config 配置项
     */
    function RadioSwitch(config){
      RadioSwitch.superclass.constructor.call(this, config);
      this._init();
    }
    RadioSwitch.ATTRS = 
    /**
     * @lends RadioSwitch
     */
    {
      container: {

      },
      /**
       * 触点, 默认为容器下面的input[type=radio]和input[type=checkbox]
       * @type {String || Array}
       * @default 'input'
       */
      trigger: {
        value: 'input'
      },
      triggers: {
        value: []
      },
      panels: {
        value: {}
      },
      /**
       * 触点伪属性的名称
       * @type {String}
       * @default 'data-show'
       */
      attrname:{
          value: 'data-show'
      },
      type: {
        value: 'radio'
      }
    }

    S.extend(RadioSwitch, S.Base);

    S.augment(RadioSwitch, {
      _init: function(){
        this._initDOM();
        this._initEvent();
      },
      _initDOM: function(){
        this._initTrigger();
        this._initPanels();
      },
      _initEvent: function(){
        //this._initTriggerEvent();
      },
      _initTrigger: function(){
        var _self = this,
            container = DOM.get(_self.get('container')) || undefined,
            trigger = _self.get('trigger'),
            triggers;
        if(trigger){
          triggers = DOM.query(trigger, container);
          _self.set('container', container);
          _self.set('triggers', triggers);
          _self._TriggerEvent(triggers);
        }
      },
      _checkTrigger: function(trigger, panel){
        var checked = DOM.attr(trigger, 'checked');
        if(checked){
          DOM.removeClass(panel, CLS_HIDDEN);
        }
        else{
          DOM.addClass(panel, CLS_HIDDEN);
        }
      },
      _initPanels: function(){
        var _self = this,
            container = _self.get('container'),
            triggers = _self.get('triggers'),
            attrname = _self.get('attrname'),
            panels = {};
        S.each(triggers, function(trigger, index){
            var name = DOM.attr(trigger, attrname),
                panel;
            if(name){
              panel = DOM.get('#' + name, container);
              panels[name] = panel;
              //_self._checkTrigger(trigger, panel);
            }
            else{
              triggers.splice(index, 1);
            }
        });
        _self.set('triggers', triggers);
        _self.set('panels', panels);
      },
      _TriggerEvent: function(trigger){
        var _self = this,
            type = _self.get('type'),
            attrname = _self.get('attrname');
        Event.on(trigger, 'click', function(ev){
          var target = this,
              panels = _self.get('panels'),
              current = _self.get('current'),
              panelName = DOM.attr(target, attrname),
              panel,
              next = {};
          if (panelName && (!current || type === 'checkbox' || panelName !== current.name)) {
            panel = panels[panelName];
            next['name'] = panelName;
            next['trigger'] = target;
            next['panel'] = panel;
            if(false === _self.fire('beforeChange', {current: current, next: next})){
              ev.preventDefault();
              return;
            }
            if(type === 'radio') {
              _self._hideOther(panelName);
            }
            _self._checkTrigger(target, panel);
            
            _self.set('current', next);
            _self.fire('change', {current: next});
          }
        });
      },
      /**
       * 当input[type=radio]时，选中当前的，需要隐藏其他radio的容器
       * @param   {String} current
       * @private
       */
      _hideOther: function(current){
        var _self = this,
            panels = _self.get('panels');
        S.each(panels, function(panel, name){
          if(name !== current) {
            DOM.addClass(panel, CLS_HIDDEN);
          }
        });
      },
      setActived: function(index){
        var _self = this,
            triggers = _self.get('triggers'),
            trigger = triggers[index];
        Event.fire(trigger, 'click');
      },
      hideAll: function(){
        var _self = this,
            triggers = _self.get('triggers'),
            panels = _self.get('panels');
        S.each(triggers, function(trigger){
          DOM.attr(trigger, 'checked', false);
        });
        S.each(panels, function(panel){
          DOM.addClass(panel, CLS_HIDDEN);
        });
        _self.set('current', null);
      },
      /**
       * 添加依赖验,只会对trggier对应的容器添加依赖校验
       * @param {Validation} validator
       * 这里的复杂度为所有的触点及容器的DOM数x当前valdator被验证的元素数
       */
      addDependValid: function(validator) {
        if (!validator) {
            return;
        }
        var _self = this,
            triggers = _self.get('triggers'),
            panels = _self.get('panels'),
            attrname = _self.get('attrname');
        S.each(triggers, function(trigger){
          var name = DOM.attr(trigger, attrname),
              panel = panels[name];
          _self._addDependRule(validator, panel, trigger);
        });
      },
      /**
       * 为某一元素添加依赖校验
       * @param   {Validation} validator
       * @param   {HTMLElement} element 需要添加的元素
       * @param   {[type]} depend 被依赖的元素
       * @private
       */
      _addDependRule: function(validator, panel, depend){
        if(!panel){
          return;
        }
        var elements = DOM.query('*', panel),
            // 验证元素的伪属性名
            attrname = validator.config.attrname,
            id,
            field;
        S.each(elements, function(element){
          var isValid = DOM.attr(element, attrname);
          if (isValid) {
              id = DOM.attr(element, 'id');
              field = validator.get(id);
              if (field) {
                field.addRule('depend', function(){
                  if(DOM.attr(depend, 'checked')) {
                    return true;
                  }
                });
              };
          };
        });
      }
    });

    return RadioSwitch;

  }, {
    requires: [
      'validation'
    ]}
  );