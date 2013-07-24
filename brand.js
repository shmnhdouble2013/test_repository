// 品牌关注组件
// --------------------------------------

// guiyuan.hj@tmall.com
// 2013-4-13

KISSY.add('brandsite/1.0/widget/brand', function(S) {

    var D = S.DOM, E = S.Event;
    var win = window, doc = document;

    // 品牌信息接口
    var GET_BRAND_EXTRA_URL = 'http://brand.'+ (~location.host.indexOf('.net') ? 'daily.tmall.net': 'tmall.com') +'/ajax/getBrandStatus.htm';
    var CANCEL_COLLECT_URL = 'http://brand.'+ (~location.host.indexOf('.net') ? 'daily.tmall.net': 'tmall.com') +'/ajax/brandDelFromFav.htm';

    var COLLECT_HOOK_CLS = 'j_CollectBrand';
    var CANCEL_HOOK_CLS = 'j_CancelCollect';
    var BRAND_ID_ATTR = 'data-brandid';

    var TOKEN_INPUT = 'J_TbToken';

    /**
     * 关注品牌
     * @param config 配置项
     * @constructor
     *
     *   {
     *       container: '',     // 组件外层容器
     *       cancelCls: '',     // 取消关注样式
     *       numEl: '',         // 品牌关注数
     *       brandId: '',       // 品牌ID
     *       token: '',
     *   }
     */
    function FavBrand(config) {
        this.cfg = S.merge({
            service: 'getBrandInfo',
            token: win._tb_token_ || D.val('#' + TOKEN_INPUT) || ''
        }, config || {});

        this._init();
    }

    S.augment(FavBrand, S.EventTarget, {

        /**
         * 初始化方法
         * @private
         */
        _init: function () {
            var self = this;
            self.container =  self.cfg.container;
            self.trigger = S.get('.' + COLLECT_HOOK_CLS, self.container);

            if(!(self.container && self.trigger)) return;

            if(!self.cfg.brandId) self.cfg.brandId = D.attr(self.trigger, BRAND_ID_ATTR);

            self._getBrandStatus();
            self._initBrandBar();
            self._bindEvent();
        },

        /**
         * 获取品牌关注状态
         * @private
         */
        _getBrandStatus: function() {
            var self = this;
            S.jsonp(GET_BRAND_EXTRA_URL, {
                brandId: self.cfg.brandId
            }, function(data) {
                if(data && data.isSuccess && data.result && data.result[0]) {
                    self.cfg.numEl && D.text(self.cfg.numEl, data.result[0].popularity);
                    data.result[0].isMyBrand && self._toggleBtnStatus();
                }

            });
        },

        /**
         * 绑定事件
         * @private
         */
        _bindEvent: function  () {
            var self = this;

            E.on(self.trigger, 'click mouseenter mouseleave', function (e) {
                var type = e.type;
                var el = e.target;

                if (D.hasClass(el, CANCEL_HOOK_CLS)) {
                    if (type === 'click') {
                        self._cancelCollect.call(self);
                    } else if (type === 'mouseenter') {
                        D.removeClass(el, self.cfg.cancelCls);
                        D.html(el, '<i></i>取消');
                    } else {
                        D.addClass(el, self.cfg.cancelCls);
                        D.html(el, '<i></i>已关注');
                    }
                }
            });
        },
        /**
         * 关注/取消关注品牌后操作
         * @param isCancel {boolean} 是否取消关注
         * @private
         */
        _afterAction: function (isCancel) {
            var self = this;
            var numEl = self.cfg.numEl;
            if(!numEl) return;

            var width = D.width(numEl);
            var offset = D.offset(numEl);
            var animEl = D.create('<b>' + (isCancel ? '-' : '+') + '1</b>');

            D.css(animEl, {
                'position': 'absolute',
                'left': offset.left + width,
                'top': offset.top,
                'fontSize': '14px',
                'zIndex': '1000003'
            });

            D.append(animEl, doc.body);

            new S.Anim(animEl, {
                top: offset.top - 10,
                opacity: 0
            }, .3, 'easynone', function () {
                D.remove(animEl);
                var num = parseInt(D.text(numEl));
                D.text(numEl, isCancel ? num - 1 : num + 1);
                self._toggleBtnStatus();
            }).run();

        },

        /**
         * 取消关注品牌
         * @private
         */
        _cancelCollect: function () {
            var self = this;
            S.jsonp(CANCEL_COLLECT_URL, {
                brandId: self.cfg.brandId,
                _tb_token_: self.cfg.token
            }, function (data) {
                if (data && data.is_success && data.is_success == 'T') {
                    self._afterAction(true)
                }
            });
        },

        /**
         * 调整关注按钮状态
         * @private
         */
        _toggleBtnStatus: function () {
            var self = this;
            var trigger = self.trigger;

            if (D.hasClass(trigger, COLLECT_HOOK_CLS)) {
                D.html(trigger, '<i></i>已关注');
                D.addClass(trigger, self.cfg.cancelCls + ' ' + CANCEL_HOOK_CLS);
                D.removeClass(trigger, COLLECT_HOOK_CLS);
            } else {
                D.html(trigger, '<i></i>关注');
                D.addClass(trigger, COLLECT_HOOK_CLS);
                D.removeClass(trigger, self.cfg.cancelCls + ' ' + CANCEL_HOOK_CLS);
            }

        },

        /**
         * 调用底部工具条的我关注品牌进行关注
         * @private
         */
        _initBrandBar: function () {
            var self = this;
            var count = 32;
            (function addBrandEvent() {
                //因为global里面初始化Tgallery可能延时，因此，在这里做延时处理
                if (!S.onTgalleryReady) {
                    if (count > 0) setTimeout(arguments.callee, 512);
                    count--;
                    return;
                }
                S.use('tgallery/department/common/brandbar', function (S, Brandbar) {
                    Brandbar.on('success', function () {
                        self._afterAction();
                    });
                    Brandbar.on('error', function (e) {
                        // 已关注直接更改按钮状态
                        e.code == -1 && self._toggleBtnStatus();
                    })
                });
            })();
        }
    });

    return FavBrand;
});