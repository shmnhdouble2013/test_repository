/**
 * 节点流程图 组件
 * Created by shuimnh_double on 14-12-22.
 * version 1.0
 * update 20150113 支持tip自定义配置 改为ajax获取数据
 */

KISSY.add('gallery/process/1.0/index', function(S, Tip){
    var DOM = S.DOM,
        Event = S.Event,
        AUTO = 'auto',
        LI = 'li';

    function ProcessStep(config){
        var _self = this;

        if( !(_self instanceof ProcessStep) ){
            return new ProcessStep(config);
        }

        ProcessStep.superclass.constructor.call(_self, config);

        _self.container = S.get(config.container);
        _self.lis = S.all(LI, _self.container);
        _self.itemLen = _self.lis.length;

        // 如果 li都不存在 或者只有1个节点，则退出
        if( _self.itemLen <= 1){
            throw('步骤流程节点数为空或者只有1个节点！');
            return;
        }

        _self._init();
    }

    S.extend(ProcessStep, S.Base);

    ProcessStep.VERSION = 1.0;

    // 组件用到的内部样式名
    ProcessStep.cls = {
        STEPS : "ks-steps",
        ITEM : "ks-steps-item",
        CURRENT : "step-cur",
        TITLE: "step-name",
        SEPNO: "step-no",
        DONE : "step-done",
        FIRST:'step-first',
        LAST:'step-last'
    };

    // li 模板
    ProcessStep.PROCESS_LI_TPL = '<ol><li title="" ><div class="step-name"></div><div class="step-marks"></div></li></ol>';

    ProcessStep.ATTRS = {

        // li 最低宽度
        liMinWidth: {
            value: 50,
            setter: function(v){
                var _self = this;

                if( S.isNumber(v) && v >= _self.liMinWidth ){
                    return v;
                }else{
                    return 50;
                }
            }
        },

        // 是否强制平均宽度
        forceFit: {
            value: false,
            setter : function(v){
                var _self = this;

                if(S.isBoolean(v)){
                    return v;
                }else{
                    return false;
                }
            }
        },

        // 是否首尾 li宽度 减半？
        firstLastHalf: {
            value: false,
            setter : function(v){
                var _self = this;

                if(S.isBoolean(v)){
                    return v;
                }else{
                    return false;
                }
            }
        },


        // 设置宽度
        width : {
            value : 960,
            setter : function(v){
                var _self = this,
                    widpPx = parseInt(v, 10);

                if( S.isNumber(widpPx) && widpPx ){
//                    _self.setWidth(widpPx);
                    return widpPx;
                }else if(S.isString(v)){
                    return 'auto';
                }else{
                    return 960;
                }
            }
        }
    };

    S.augment(ProcessStep, {
        _init : function(){
            var _self = this;

            // 渲染节点
            _self.renderLi();

            //设置宽度
            _self.setWidth();
        },

        /**
         * 设置宽度
         * @param {Number} w 宽度
         * @return {Number}
         */
        setWidth : function(w){
            var _self = this,
                widpPx = (S.isNumber(w) && w >= _self.get('liMinWidth')*_self.itemLen) ? w : _self.get('width'),
                lastLi = _self.lis[ _self.itemLen-1],
                firstLi = _self.lis[0],
                containerWidth;

            // 如果为auto
            if( widpPx == AUTO ){
                DOM.css(_self.lis, {
                    "width" : AUTO
                });

            // 否则按照设定的宽度 或者 内置960宽度来设置
            // _self.itemLen-1 是因为 首尾减半 导致多出1个li宽度 所以在开始减去
            }else{
                if( _self.get('firstLastHalf') ){
                    widpPx = Number(widpPx/_self.itemLen-1);
                    DOM.width(_self.lis, widpPx);
                    firstEndHarf();
                }else{
                    widpPx = Number(widpPx/_self.itemLen);
                    DOM.width(_self.lis, widpPx);
                }
            }

            // 强制均分
            if(_self.get('forceFit')){
                containerWidth = DOM.width(_self.container);
                widpPx = Number(containerWidth/_self.itemLen-1);
                DOM.width(_self.lis, widpPx);
            }

            // 首尾li宽度 都减半
            function firstEndHarf(){
                DOM.width(firstLi, DOM.width(firstLi)/2 );
                DOM.width(lastLi, DOM.width(lastLi)/2 );
            }

            return widpPx;
        },

        /**
         * 初始化 li 样式和步骤渲染
         */
        renderLi: function(){
            var _self = this;

            S.each(_self.lis, function(el, index){

                // 设置步骤序号
                var stopON = _self.renderLiNo(el, index),
                    hoverDefaultConig = {
                        headerText: '相关信息',
                        contentText: S.one(el).attr('title'),
                        delayIn: 100,
                        points:['cc','cc']
                    };

                if( _self.get('tipConfig') ){
                    hoverDefaultConig = _self.get('tipConfig');
                }

                // 调用Tip
                new Tip(S.one(stopON), hoverDefaultConig);
            });

            // 首尾添加 特殊 class样式
            _self.addFirtEndNodeCls();
        },

        // 设置步骤序号
        renderLiNo: function(el, index){
            var _self = this;

            var numNo = ++index,
                sepnoNode = DOM.create('<div class="'+ProcessStep.cls.SEPNO+'">'+ numNo +'</div>'),
                nodeTitleDiv = S.get('.'+ ProcessStep.cls.TITLE, el);

            // 插入节点dom编号
            DOM.insertAfter(sepnoNode, nodeTitleDiv);

            return sepnoNode;
        },

        // 首尾添加 特殊 class样式
        addFirtEndNodeCls: function(){
          var _self = this;

            // 添加首个 li first标示
            S.one(_self.lis[0]).addClass( ProcessStep.cls.FIRST );

            // 添加最后一个 li last标示
            S.one(_self.lis[_self.itemLen-1]).addClass( ProcessStep.cls.LAST );
        }
    });

    return ProcessStep;

}, {
    requires:['gallery/tip/1.0/index', 'gallery/process/1.0/process.css']
});