 /** 
* @fileOverview 天猫首页抽奖页面 -- 天猫跳跳
* @extends  KISSY.Base
* @creator  黄甲(水木年华double)<huangjia2015@gmail.com>
* @depends  ks-core
* @version 1.0  
* @update 2013-08-07
* @example
*   new StrantEnd({});
*/  

 KISSY.add('strantEnd', function(S, MoreViewVersion, O) {
    var DOM = S.DOM,
        uao = S.UA,
        Anim = S.Anim,
        win = window,
        doc = document,
        Event = S.Event;

    var LaterTime = uao.mobile ? 200 :10000;                  // 延迟执行时间0 -- 1毫秒延迟 for mobile

    function StrantEnd(config){
        var _self = this;

        if( !(_self instanceof StrantEnd) ){
            return new StrantEnd(config);
        }

        StrantEnd.superclass.constructor.call(_self, config);

        _self._init();
    }

    S.extend(StrantEnd, S.Base);  
    S.augment(StrantEnd, {

        // 控件 初始化
        _init: function(){
            var _self = this;
            
            _self._domRender();
            _self._eventRender();
           _self._startCatJump();
        },
        
        _domRender:function(){
            var _self = this;

            // 分辨率监控    
            new MoreViewVersion({
                aryRange: _self.get('aryRange'), // 监控宽度值 数组范围   
                isRealTimeEvent: _self.get('isRealTimeEvent'),    // 监控宽度值 数组范围   -- 默认 true 实时监控 
                isResizeBack:null
            });
        },

        // 事件初始化
        _eventRender: function(){
            var _self = this;

            win.addEventListener('deviceorientation', function(event) {          
                _self._redPageFn(event);
            }, false);

            // 分享
            Event.on('#J_btnShare', 'click', function() {
                alert('不好意思，暂没实现~');

                // S.one("#J_WeekShare").on("click", function () {
                //     //  main operation
                //     share5.share({
                //         token:share5.initData.token,
                //         fwd:share5.getSelectedFwd().join(','),
                //         title:urlConfig.title || "弱分享标题",
                //         url:urlConfig.url || "弱分享链接",
                //         comment:urlConfig.comment || "弱分享内容",
                //         imgUrl:"http://img04.taobaocdn.com/tps/i1/T12t6TXa8mXXclNAI0-130-225.jpg"
                //     }, function (shareResult) {
                //         alert("分享结果：" + shareResult);
                //     });
                // });
            });

            // 点击开始
            _self.selectCtrolfn();

            Event.on('#J_btnPlay', 'click', function() {
                 _self.dialog.show();
            });

            // resize事件
            Event.on(win, 'resize', function(){
                _self._startCatJump();
            });

            // pc端控制
            Event.on('#J_pc', 'click', function(){
                // 隐藏控制方式选择
                _self.dialog.hide();

                // 关闭开始界面 切换 进行中界面
                DOM.hide('#J_gameCover');
                DOM.show('#J_gameBody');
            });

            // 点击手机控制方式
            Event.add('#J_phone', 'click', function(){
                // 隐藏控制方式选择
                _self.dialog.hide();

                // 展现二维码
                DOM.show('.qrcode');

                // 显示隐藏
                DOM.hide('#J_gameCover');
                DOM.show('#J_gameBody');
            });

            // 进行中跳转结束
            Event.on('#J_btnPlay2', 'click', function(){
                 // 显示隐藏
                DOM.hide('#J_gameBody');
                DOM.show('#J_gameOver');
            })
           
        },

        // 手机端 红包重力感应
        _redPageFn: function(event){
            var _self = this;

            if(uao.mobile){                    
                var a = (event.alpha) && (event.alpha).toFixed(3),     // Y轴  
                    b = (event.beta) && (event.beta).toFixed(3),      // Z轴
                    g = (event.gamma) && (event.gamma).toFixed(3),     // X轴 
                    cssVlaue = "rotate("+ g +"deg)",  // 旋转
                    zcrn = "rotateY(" + a/2 + "deg)";   // 水平旋转
                    zcrnCat = "rotateY(" + 360 + "deg)";   // 水平旋转

                DOM.css('.red-page', {
                    "-webkit-transform": zcrn,
                    "transform": zcrn
                });
            }  
        },

        // 天猫跳跳
        _startCatJump: function(){
            var _self = this;

            if(_self.catLog){
                _self.catLog.style.cssText = ""; 
                DOM.removeAttr(_self.catLog, 'style');
            }
            
            if(_self.catup){
                clearInterval(_self.catup);                   
                _self.catup = null;
            }

            var catLog = S.get('.start-cat'),
                rangeNo = 2,
                topBefore = parseInt(DOM.css(catLog, 'top'), 10),
                topSet = topBefore + 'px',
                topPro = (topBefore + rangeNo) + 'px',
                _catUp = new Anim(catLog, {
                    top: topPro
                }, 0.2, 'easeNone', function () {
                    DOM.css(catLog, {
                        top: topSet
                    });
                });

            // 开始 猫猫 向上动
            function catUp(){
                _catUp.run();
            }
            _self.catup = setInterval(catUp, 300);
            _self.catLog = catLog;
        },

        // 点击开始
        selectCtrolfn: function(){
            var _self = this;
 
           _self.dialog = new O.Dialog({
                width: 424,
                elCls: 'my',
                elStyle: {
                    position: uao.ie == 6 ? "absolute" : "fixed"
                },
                bodyContent: S.one('#selectContrlTpl').children(),
                mask: true,
                effect:'fade',
                align: {
                    points: ['cc', 'cc']
                },
                closeAction: "hide"
            });
        }

    });

return StrantEnd;

}, {'requires':['twoviewversion', 'overlay']});

       