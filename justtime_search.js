/**
 * ҳͷ�������ؿ�ģ��
 * @author: guiyuan.hj@tmall.com  ˮľ�껪double
 * @data: 13-3-4 ����4:15
 * todo: up
 */

KISSY.add('brandsite/1.0/widget/search', function (S) {

    var D = S.DOM, E = S.Event;

    // malllist ������׼
    var LIST_URL = 'http://list.tmall.com/search_product.htm';

    var TPL = '<ul class="tm-searchBar-suggest">'
        + '<li class="tm-searchBar-suggest-last" id="J_attrContainer"></li>'
        + '</ul>';

        // '<p data-log="search,2"><em></em>��</p>'

    /**
     * ������
     * @param config ������
     * @constructor
     *
     *  {
     *      el: '',         // �����Ԫ��
     *      static: [{title:"",url:""}],     // ��̬����
     *      suggest: '',    // ��̬suggest��ַ
     *      showNum: 3,     // ��ʾ����
     *      offset: [0,0]   // ƫ����
     *  }
     */
    function Search(config) {
        this.cfg = S.merge({
            showNum: 3,
            offset: [-10, 5]

        }, config || {});

        this._init();
    }

    S.augment(Search, S.EventTarget, {

        /**
         * ��ʼ��
         * @private
         */
        _init: function () {
            var self = this;
            if (!(self.el = S.get(self.cfg.el))) return;

            self.form = S.get('form', self.el);
            self.input = S.get('input', self.el);
            self.sug = self._createSuggest();
            self._bindEvent();
        },

        /**
         * ���¼�
         * @private
         */
        _bindEvent: function () {
            var self = this;
            var input = self.input;
            var sug = self.sug;

            // չ�ֹر� -- ������
            E.on(input, 'focus', function () {
                D.show(sug);
            });
            E.on(input, 'blur', function () {
                S.later(function (){
                    D.hide(sug);
                }, 200);
            });

            // ��ʱ���������ֶ�
            E.on(input, 'keyup', function () {
                var searchStr = S.trim(this.value);

                // ��������ֶ�
                if( self.searchText.length){
                    S.each(self.searchText, function(el){
                        D.text(el, searchStr);
                    });
                }

                // ���������ֶ�
                if(self.atrlinks.length){
                    S.each(self.atrlinks, function(el){
                        var hrefs = D.attr(el, 'href'),
                            renderLink = /\?/i.test(hrefs) ? hrefs+'&q='+ encodeURI(searchStr) : hrefs+'?q='+ encodeURI(searchStr);

                        D.attr(el, 'href', renderLink);
                    });
                }
            });

            /* ���������è
            E.on(self.searchTmall, 'click', function () {
                self.el.action = LIST_URL;
                self.el.submit();
            });
            */ 

            // �ı��С
            E.on(window, 'resize', function () {
                var offset = D.offset(self.input);
                var height = D.height(self.input);

                D.css(self.sug, {
                    'top': offset.top + self.cfg.offset[1] + height,
                    'left': offset.left + self.cfg.offset[0]
                });
            });
        },

        /**
         * ����������ʾ����
         * @returns {element}
         * @private
         */
        _createSuggest: function () {
            var self = this;
            var offset = D.offset(self.input);
            var height = D.height(self.input);
            var sug = D.create(TPL);
            var staticData = self.cfg['static'];

            var attrsData = self.cfg['attrs'],
                attrLi = S.get('#J_attrContainer', sug);

            // ��������-��������
            if (staticData && S.isArray(staticData)) {
                var len = staticData.length;
                while (len--) {
                    var item = staticData[len];
                    var html = '<li><a data-log="search,3,'+ len +'" target="_blank" href="' + item[1] + '">' + item[0] + '</a></li>';
                    D.prepend(D.create(html), sug);
                }
            }

            // ��������-��������
            if (attrsData && S.isArray(attrsData)) {
                var attrLen = attrsData.length;
                while (attrLen--) {
                    var item = attrsData[attrLen],
                        atrHtml = '<p><a class="j_atrlink" data-log="search,3,'+ attrLen +'" target="_blank" href="' + item[1] + '"><em></em>&nbsp;��<span>'+item[0]+'</span>����</a></p>';
                    D.append(D.create(atrHtml), attrLi );
                }
            }

            self.searchText = S.query('em', sug);
            self.atrlinks = S.query('.j_atrlink', sug);

            D.css(sug, {
                'display': 'none',
                'position': 'absolute',
                'top': offset.top + self.cfg.offset[1] + height,
                'left': offset.left + self.cfg.offset[0]
            });

            D.append(sug, document.body);

            return sug;
        }

    });

    return Search;
}, {
    requires: ['dom', 'event']
});