// Ʒ�ƹ�ע���
// --------------------------------------

// guiyuan.hj@tmall.com
// 2013-4-13

KISSY.add('brandsite/1.0/widget/brand', function(S) {

    var D = S.DOM, E = S.Event;
    var win = window, doc = document;

    // Ʒ����Ϣ�ӿ�
    var GET_BRAND_EXTRA_URL = 'http://brand.'+ (~location.host.indexOf('.net') ? 'daily.tmall.net': 'tmall.com') +'/ajax/getBrandStatus.htm';
    var CANCEL_COLLECT_URL = 'http://brand.'+ (~location.host.indexOf('.net') ? 'daily.tmall.net': 'tmall.com') +'/ajax/brandDelFromFav.htm';

    var COLLECT_HOOK_CLS = 'j_CollectBrand';
    var CANCEL_HOOK_CLS = 'j_CancelCollect';
    var BRAND_ID_ATTR = 'data-brandid';

    var TOKEN_INPUT = 'J_TbToken';

    /**
     * ��עƷ��
     * @param config ������
     * @constructor
     *
     *   {
     *       container: '',     // ����������
     *       cancelCls: '',     // ȡ����ע��ʽ
     *       numEl: '',         // Ʒ�ƹ�ע��
     *       brandId: '',       // Ʒ��ID
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
         * ��ʼ������
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
         * ��ȡƷ�ƹ�ע״̬
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
         * ���¼�
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
                        D.html(el, '<i></i>ȡ��');
                    } else {
                        D.addClass(el, self.cfg.cancelCls);
                        D.html(el, '<i></i>�ѹ�ע');
                    }
                }
            });
        },
        /**
         * ��ע/ȡ����עƷ�ƺ����
         * @param isCancel {boolean} �Ƿ�ȡ����ע
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
         * ȡ����עƷ��
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
         * ������ע��ť״̬
         * @private
         */
        _toggleBtnStatus: function () {
            var self = this;
            var trigger = self.trigger;

            if (D.hasClass(trigger, COLLECT_HOOK_CLS)) {
                D.html(trigger, '<i></i>�ѹ�ע');
                D.addClass(trigger, self.cfg.cancelCls + ' ' + CANCEL_HOOK_CLS);
                D.removeClass(trigger, COLLECT_HOOK_CLS);
            } else {
                D.html(trigger, '<i></i>��ע');
                D.addClass(trigger, COLLECT_HOOK_CLS);
                D.removeClass(trigger, self.cfg.cancelCls + ' ' + CANCEL_HOOK_CLS);
            }

        },

        /**
         * ���õײ����������ҹ�עƷ�ƽ��й�ע
         * @private
         */
        _initBrandBar: function () {
            var self = this;
            var count = 32;
            (function addBrandEvent() {
                //��Ϊglobal�����ʼ��Tgallery������ʱ����ˣ�����������ʱ����
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
                        // �ѹ�עֱ�Ӹ��İ�ť״̬
                        e.code == -1 && self._toggleBtnStatus();
                    })
                });
            })();
        }
    });

    return FavBrand;
});