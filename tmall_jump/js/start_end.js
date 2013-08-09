 /** 
* @fileOverview ��è��ҳ�齱ҳ�� -- ��è����
* @extends  KISSY.Base
* @creator  �Ƽ�(ˮľ�껪double)<huangjia2015@gmail.com>
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

    var LaterTime = uao.mobile ? 200 :10000;                  // �ӳ�ִ��ʱ��0 -- 1�����ӳ� for mobile

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

        // �ؼ� ��ʼ��
        _init: function(){
            var _self = this;
            
            _self._domRender();
            _self._eventRender();
           _self._startCatJump();
        },
        
        _domRender:function(){
            var _self = this;

            // �ֱ��ʼ��    
            new MoreViewVersion({
                aryRange: _self.get('aryRange'), // ��ؿ��ֵ ���鷶Χ   
                isRealTimeEvent: _self.get('isRealTimeEvent'),    // ��ؿ��ֵ ���鷶Χ   -- Ĭ�� true ʵʱ��� 
                isResizeBack:null
            });
        },

        // �¼���ʼ��
        _eventRender: function(){
            var _self = this;

            win.addEventListener('deviceorientation', function(event) {          
                _self._redPageFn(event);
            }, false);

            // ����
            Event.on('#J_btnShare', 'click', function() {
                alert('������˼����ûʵ��~');

                // S.one("#J_WeekShare").on("click", function () {
                //     //  main operation
                //     share5.share({
                //         token:share5.initData.token,
                //         fwd:share5.getSelectedFwd().join(','),
                //         title:urlConfig.title || "���������",
                //         url:urlConfig.url || "����������",
                //         comment:urlConfig.comment || "����������",
                //         imgUrl:"http://img04.taobaocdn.com/tps/i1/T12t6TXa8mXXclNAI0-130-225.jpg"
                //     }, function (shareResult) {
                //         alert("��������" + shareResult);
                //     });
                // });
            });

            // �����ʼ
            _self.selectCtrolfn();

            Event.on('#J_btnPlay', 'click', function() {
                 _self.dialog.show();
            });

            // resize�¼�
            Event.on(win, 'resize', function(){
                _self._startCatJump();
            });

            // pc�˿���
            Event.on('#J_pc', 'click', function(){
                // ���ؿ��Ʒ�ʽѡ��
                _self.dialog.hide();

                // �رտ�ʼ���� �л� �����н���
                DOM.hide('#J_gameCover');
                DOM.show('#J_gameBody');
            });

            // ����ֻ����Ʒ�ʽ
            Event.add('#J_phone', 'click', function(){
                // ���ؿ��Ʒ�ʽѡ��
                _self.dialog.hide();

                // չ�ֶ�ά��
                DOM.show('.qrcode');

                // ��ʾ����
                DOM.hide('#J_gameCover');
                DOM.show('#J_gameBody');
            });

            // ��������ת����
            Event.on('#J_btnPlay2', 'click', function(){
                 // ��ʾ����
                DOM.hide('#J_gameBody');
                DOM.show('#J_gameOver');
            })
           
        },

        // �ֻ��� ���������Ӧ
        _redPageFn: function(event){
            var _self = this;

            if(uao.mobile){                    
                var a = (event.alpha) && (event.alpha).toFixed(3),     // Y��  
                    b = (event.beta) && (event.beta).toFixed(3),      // Z��
                    g = (event.gamma) && (event.gamma).toFixed(3),     // X�� 
                    cssVlaue = "rotate("+ g +"deg)",  // ��ת
                    zcrn = "rotateY(" + a/2 + "deg)";   // ˮƽ��ת
                    zcrnCat = "rotateY(" + 360 + "deg)";   // ˮƽ��ת

                DOM.css('.red-page', {
                    "-webkit-transform": zcrn,
                    "transform": zcrn
                });
            }  
        },

        // ��è����
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

            // ��ʼ èè ���϶�
            function catUp(){
                _catUp.run();
            }
            _self.catup = setInterval(catUp, 300);
            _self.catLog = catLog;
        },

        // �����ʼ
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

       