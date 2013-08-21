/**
 * @fileOverview 弹出框选择查询记录
 * @author dxq
 */
KISSY.add(function (S) {

   function singleCheckGrid(grid){
      grid.on('rowselected',function(e){
       
          checkRow(e.row,true);
      });

      grid.on('rowunselected',function(e){
       
          checkRow(e.row,false);
      });

      function checkRow(row,checked){
         var rowEl = S.one(row),
          radioEl = rowEl.one('.grid-radio');
        if(radioEl){
          radioEl.attr('checked',checked)
        }
      }
    }
      
  /**
   * @name SearchDialog
   * @class 选择查询记录的弹出框
   * @param {Object} config 配置项
   */
  var SearchDialog = function(config){
    SearchDialog.superclass.constructor.call(this,config);
    this._init();
  };

  SearchDialog.Util = {
    singleCheckGrid : singleCheckGrid
  };
  SearchDialog.ATTRS = 
  /**
   * @lends SearchDialog
   */
  {

    /**
     * 弹出框模版对应的容器编号
     * @type {String}
     */
    contentId : {

    },
    /**
     * 弹出框对象,只读
     * @type {KISSY.LP.Dialog}
     */
    dialog : {

    },
    /**
     * 弹出框的配置项
     * @type {Object}
     */
    dialogConfig : {
        value : {

        }
    },
    /**
     * Grid 的配置项
     * @type {Object}
     */
    gridConfig : {

    },
    /**
     * 模版上Grid 的选择器
     * @type {String}
     * @default '.search-grid'
     */
    gridSelector : {
      value:'.search-grid'
    },
    /**
     * 搜索列表,只读
     * @type {KISSY.LP.Grid}
     */
    grid : {

    },
    /**
     * 表单对象
     * @type {Node}
     */
    form : {

    },
    /**
     * 搜索按钮
     * @type {Node}
     */
    button : {

    },
    /**
     * 弹出框显示后
     * @type {Object}
     */
    onShow : {
        value: function(dialog){
            this.getData();
        }
    },
    /**
     * 搜索按钮的默认选择器
     * @type {String}
     * @default 'button'
     */
    searchButtonSelector : {
      value : 'button'
    },
    /**
     * 查询数据的地址
     * @type {String}
     */
    searchUrl : {

    },
    /**
     * 查询纪录的数据缓冲类
     * @type {KISSY.LP.Store}
     */
    store : {

    },
    /**
     * 表单的选择器
     * @type {String}
     * @default 'form'
     */
    formSelector : {
      value : 'form'
    },
    /**
     * 是否单选模式
     * @type {Boolean}
     * @default true
     */
    singleSelect : {
      value : true
    },
    /**
     * 触发显示Dialog的选择器
     * @type {String|HTMLElement|Node}
     */
    trigger : {

    },
    /**
     * 触发当前弹出窗口的节点
     * @type {Node}
     */
    triggerTarget : {

    },
    radioColumn : {
        value : {title:'',dataIndex:'',width:30,renderer:function(){
                return '<input class="grid-radio" type="radio" />';
              }}
    }
  };

  S.extend(SearchDialog,S.Base);

  S.augment(SearchDialog,{
    //初始化
    _init : function(){
        var _self = this;
        _self._initDom();
        //_self._initGrid();
        _self._initDialog();

        _self._initEvent();
        //_self._initGridEvent();
        _self._initDialogEvnet();
    },
    //初始化DOM
    _initDom : function(){
        var _self = this,
            contentId = _self.get('contentId') || _self.get('dialogConfig').contentId,
            contentEl = S.one('#'+contentId),
            form = null,
            button = null;
        if(contentEl){
            form = contentEl.one(_self.get('formSelector'));
            button = contentEl.one(_self.get('searchButtonSelector'));

            _self.set('form',form);
            _self.set('button',button);
        }
    },
    //初始化事件
    _initEvent : function(){

        var _self = this,
            trigger = _self.get('trigger'),
            dialog = _self.get('dialog');
        if(trigger){
            //可以有多个trigger
            S.all(_self.get('trigger')).on('click',function(ev){
                var sender = S.one(ev.target);
                _self.set('triggerTarget',sender);
                dialog.show();
            });
        }
        _self.get('button').on('click',function(event){
            event.preventDefault();
            //if(validator()){
            _self.getData();
            //}
        });

    },
    //初始化Grid
    _initGrid : function(){
        var _self = this,
            dialogConfig = _self.get('dialogConfig'),
            gridConfig = _self.get('gridConfig'),
            singleSelect = _self.get('singleSelect'),
            form = _self.get('form'),
            store = gridConfig.store || _self.get('store'),
            grid = null;

        if(singleSelect){
            var checkColumn = _self.get('radioColumn');
            gridConfig.columns.unshift(checkColumn);
        }else{
            gridConfig.checkable = true;
        }
        if(!store){
            store = new S.LP.Store({
                url : _self.get('searchUrl')
            });
            
            _self.set('store',store);
        }

        S.mix(gridConfig,{
            store : store,
            width : dialogConfig.width - 55,
            height : dialogConfig.height - 110 - form.height(),
            forceFit:true
        });
        grid =new S.LP.Grid(gridConfig);
        _self.set('grid',grid);
    },
    //初始化Dialog
    _initDialog : function(){
        var _self = this,
            dialogConfig = _self.get('dialogConfig'),
            dialog = _self.get('dialog');
        if(!dialog){
            dialog = new S.LP.Dialog(dialogConfig);
            _self.set('dialog',dialog);
        }
    },
    //初始化Grid事件
    _initGridEvent : function(){
        var _self = this;
        if(_self.get('singleSelect')){
            singleCheckGrid(_self.get('grid'));
        }
    },
    //初始化
    _initDialogEvnet : function(){
        var _self = this,
            dialog = _self.get('dialog');

        dialog.on('show',function(){
            //表格未初始化则初始化表格
            if(!_self.get('grid')){
                _self._initGrid();
                _self._initGridEvent();
            }
            _self.get('onShow').call(_self,this);
        });
    },
    /**
     * 触发查询
     * @return {[type]} [description]
     */
    getData:function(){

        var _self =this,
            store = _self.get('store'),
            param = S.LP.FormHelpr.serializeToObject(_self.get('form')[0]);

        param.start=0;
        param.pageIndex = 0;
        store.load(param);
    },
    /**
     * 获取选中的集合
     * @return {[Array} [description]
     */
    getSelection : function(){
      return this.get('grid').getSelection();
    },
    /**
     * 获取选中的纪录
     * @return {Object} 选中
     */
    getSelected : function(){
      return this.get('grid').getSelected();
    }
  });

    return SearchDialog;
});
