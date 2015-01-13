/*
combined files : 

kg/placeholder/2.0.0/index

*/
/**
 * @fileoverview 模拟placeholder,支持监听UI和程序修改input的value重置placeholder状态
 * @author shuke<shuke.cl@taobao.com>
 * @module placeholder
 **/
KISSY.add('kg/placeholder/2.0.0/index',function (S) {
    /**
        * @class 模拟placeholder
        * @cfg 配置参数:
        * node : //输入框节点 (required)
        * labelTmpl : '<label class="placeholder-text" style="display: none;line-height:1;position:absolute;left:0;top:0;">&nbsp;</label>' //label模板 (option)
        * region : { // 手动配置label的定位和宽高 (option)
        *        top:0,
        *        left:0,
        *        width:0,
        *        height:0
        * }
        * @method  
        *     check : //重新触发placeholder检查自身状态
        */
    var isSupport = "placeholder" in document.createElement("input");
    var NodeList = S.NodeList;
    var DOM = S.DOM;
    var Event = S.Event ;
    //重写val()方法，增加valchange事件
    if (!isSupport && !NodeList.prototype.__val) {
        var __proto = NodeList.prototype;
        __proto.__val = __proto.val;
        S.mix(__proto, {
            val: function (val) {
                if (val === undefined) {
                    return this.__val()
                }
                var pre_val = this.val();
                this.__val(val);
                this.fire && this.fire('valchange', {
                    newVal: val,
                    preVal: pre_val
                });
                return this;
            }
        });
    }
    function Placeholder(){
        Placeholder.superclass.constructor.apply(this,arguments);
        this._init();
    }
    Placeholder.ATTRS = {
        node : {
            value : null
        },
        labelTmpl : {
            value : '<label class="placeholder-text" style="display: none;color:#9a9a9a;position:absolute;left:0;top:0;">&nbsp;</label>'
        },
        wapperTmpl : {
            value : '<span class="placeholder-wrap" style="position:relative;display:inline-block;zoom:1;"></span>'
        },
        /**
         * 设置placeholder所在的父亲节点，如果设置了该值，则不再用wapperTmpl去创建父级节点
         * @attribute wapperNode
         * @type NodeList
         * @default null
         **/
        wapperNode : {
            value : null,
            setter : function (val){
                if (val instanceof S.NodeList) {
                    return val;
                }else{
                    return S.one(val);
                }
            }
        },
        region : {
            top:0,
            left:0,
            width:120,
            height:20
        }
    };
    S.extend(Placeholder , S.Base , {
        _init : function (){
            this.node = this.get('node');
            if (!(this.node instanceof NodeList)) {
                this.node = S.one(this.node);
            }
            if (isSupport || !this.node.hasAttr('placeholder')) {
                return ;
            }
            this.renderUI();
            this.bindUI();
            this.check();
        },
        renderUI : function (){
            var isSetWapperNode = !!this.get('wapperNode');
            var wapper_node = isSetWapperNode ? this.get('wapperNode') : S.one(DOM.create(this.get('wapperTmpl')));
            var input_node = this.node;
            var label_node = S.one(DOM.create(this.get('labelTmpl')));
            var input_id = input_node.attr('id');
            //没有id的输入框创建随机id
            if (!input_id) {
                input_id = S.guid('J_K'+ new Date().getTime());
                input_node.attr('id', input_id);
            }
            label_node.attr('for',input_id);
            wapper_node.append(label_node);
            if (!isSetWapperNode) {
                DOM.insertBefore(wapper_node , input_node);
                wapper_node.append(input_node);
            }
            this.labelNode = label_node;
            this.wapperNode = wapper_node;
        },
        bindUI  : function () {
            this.node.on('valchange valuechange blur', function () {
                S.later(function (){
                    this.check()
                },0,false,this);
            }, this);
            this.node.on('focus', function () {
                this._hide();
            }, this);
        },
        /**
         * @description 计算placeholder的label的现实位置和宽度
         * @param {NodeList} node 输入框
         * @param {NodeList} label_node labelNode
         * @param {NodeList} wapper_node
         * @returns {Object} Region
         */
        getPos  : function (node, label_node,wapper_node) {
            var _w = node.width();
            var _left = parseInt(node.css('paddingLeft'),10)+2 +'px';
            var _top = (wapper_node.innerHeight() - label_node.innerHeight()) / 2 + 'px';
            var region = {
                left : _left,
                top  : _top,
                width: _w
            };
            return S.mix(region, this.get('region'));

        },
        /**
         * 检查自身状态
         * @return {undefined} 
         */
        check   : function () {
            if (this.node.val() === '') {
                this._show();
                return;
            }
            this._hide();
        },
        _show   : function () {
            var label_node = this.labelNode;
            var region = this.getPos(this.node, label_node , this.wapperNode);
            label_node.show();
            label_node.css({
                "left" : region.left,
                "top"  : region.top,
                "width": region.width
            });
            label_node.html(this.node.attr('placeholder'));
        },
        _hide   : function () {
            this.labelNode.hide();
        }
    });
    return Placeholder;
}, {requires:['node','event' , 'base']});




