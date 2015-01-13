/**
 *  combination of menu and button ,similar to native select
 * @author yiminghe@gmail.com
 */
KISSY.add("menubutton/base", function (S, Node, Button, MenuButtonRender, Menu, Component, undefined) {

    var win = S.Env.host;

    function getMenu(self, init) {
        var m = self.get("menu");
        if (m && !m.isController) {
            if (init) {
                m = Component.create(m, self);
                self.setInternal("menu", m);
            } else {
                return null;
            }
        }
        return m;
    }

    function reposition() {
        var self = this,
            alignCfg,
            alignNode,
            align,
            menu = getMenu(self);
        if (menu && menu.get("visible")) {
            alignCfg = menu.get("align");
            alignNode = alignCfg.node;
            delete alignCfg.node;
            align = S.clone(alignCfg);
            align.node = alignNode || self.get("el");
            S.mix(align, ALIGN, false);
            menu.set("align", align);
        }
    }

    function hideMenu(self) {
        var menu = getMenu(self);
        if (menu) {
            menu.hide();
        }
    }

    function showMenu(self) {
        var el = self.get("el"),
            menu = getMenu(self, 1);
        // 保证显示前已经 bind 好 menu 事件
        if (menu && !menu.get("visible")) {
            // 先 render，监听 width 变化事件
            menu.render();
            self.bindMenu();
            // 根据对齐的 el 自动调整大小
            if (self.get("matchElWidth")) {
                menu.set("width", $(menu.get("align").node || el).innerWidth());
            }
            menu.show();
            reposition.call(self);
            el.attr("aria-haspopup", menu.get("el").attr("id"));
        }
    }

    var $ = Node.all,
        KeyCodes = Node.KeyCodes,
        ALIGN = {
            points: ["bl", "tl"],
            overflow: {
                adjustX: 1,
                adjustY: 1
            }
        };
    /**
     * @class
     * A menu button component, consist of a button and a drop down popup menu.
     * xclass: 'menu-button'.
     * @name MenuButton
     * @extends Button
     */
    var MenuButton = Button.extend([Component.DecorateChild],
        /**
         * @lends MenuButton.prototype
         */
        {
            _onSetCollapsed: function (v) {
                if (v) {
                    hideMenu(this);
                } else {
                    showMenu(this);
                }
            },

            /**
             * Bind menu to current component.
             * Protected, should only be overridden by subclasses.
             * @protected
             */
            bindMenu: function () {
                var self = this,
                    menu = self.get("menu");

                menu.on("afterActiveItemChange", function (ev) {
                    self.set("activeItem", ev.newVal);
                });

                self.__repositionBuffer = S.buffer(reposition, 50);

                // 窗口改变大小，重新调整
                $(win).on("resize", self.__repositionBuffer, self);

                if (self.get("collapseOnClick")) {
                    menu.on("click", function () {
                        self.set("collapsed", true);
                    });
                }

                /*
                 只绑定事件一次
                 */
                self.bindMenu = S.noop;
            },

            /**
             * Handle keydown/up event.
             * If drop down menu is visible then handle event to menu.
             * Returns true if the event was handled, falsy otherwise.
             * Protected, should only be overridden by subclasses.
             * @param {Event.Object} e key event to handle.
             * @return {Boolean} True Whether the key event was handled.
             * @protected
             *
             */
            handleKeyEventInternal: function (e) {
                var self = this,
                    menu = getMenu(self);

                // space 只在 keyup 时处理
                if (e.keyCode == KeyCodes.SPACE) {
                    // Prevent page scrolling in Chrome.
                    e.preventDefault();
                    if (e.type != "keyup") {
                        return undefined;
                    }
                } else if (e.type != "keydown") {
                    return undefined;
                }
                //转发给 menu 处理
                if (menu && menu.get("visible")) {
                    var handledByMenu = menu.handleKeydown(e);
                    // esc
                    if (e.keyCode == KeyCodes.ESC) {
                        self.set("collapsed", true);
                        return true;
                    }
                    return handledByMenu;
                }

                // Menu is closed, and the user hit the down/up/space key; open menu.
                if (e.keyCode == KeyCodes.SPACE ||
                    e.keyCode == KeyCodes.DOWN ||
                    e.keyCode == KeyCodes.UP) {
                    self.set("collapsed", false);
                    return true;
                }
                return undefined;
            },

            /**
             * Perform default action for menubutton.
             * Toggle the drop down menu to show or hide.
             * Protected, should only be overridden by subclasses.
             * @protected
             *
             */
            performActionInternal: function () {
                var self = this;
                self.set("collapsed", !self.get("collapsed"));
            },

            /**
             * Handles blur event.
             * When it loses keyboard focus, close the drop dow menu.
             * @param {Event.Object} e Blur event.
             * Protected, should only be overridden by subclasses.
             * @protected
             *
             */
            handleBlur: function (e) {
                var self = this;
                MenuButton.superclass.handleBlur.call(self, e);
                // such as : click the document
                self.set("collapsed", true);
            },


            /**
             * Adds a new menu item at the end of the menu.
             * @param {Menu.Item} item Menu item to add to the menu.
             */
            addItem: function (item, index) {
                var menu = getMenu(this, 1);
                menu.addChild(item, index);
            },

            /**
             * Remove a existing menu item from drop down menu.
             * @param c {Menu.Item} Existing menu item.
             * @param [destroy] {Boolean} Whether destroy removed menu item.
             */
            removeItem: function (c, destroy) {
                /**
                 * @type {Controller}
                 */
                var menu = getMenu(this);
                if (menu) {
                    menu.removeChild(c, destroy);
                }
            },

            /**
             * Remove all menu items from drop down menu.
             * @param [destroy] {Boolean} Whether destroy removed menu items.
             */
            removeItems: function (destroy) {
                var menu = this.get("menu");
                if (menu) {
                    if (menu.removeChildren) {
                        menu.removeChildren(destroy);
                    } else if (menu.children) {
                        menu.children = [];
                    }
                }
            },

            /**
             * Returns the child menu item of drop down menu at the given index, or null if the index is out of bounds.
             * @param {Number} index 0-based index.
             */
            getItemAt: function (index) {
                var menu = getMenu(this);
                return menu && menu.getChildAt(index);
            },

            // 禁用时关闭已显示菜单
            _onSetDisabled: function (v) {
                var self = this;
                !v && self.set("collapsed", true);
            },

            /**
             * Decorate child element to from a child component.
             * @param {Function} UI Child component's constructor
             * @param {KISSY.NodeList} el Child component's root element.
             * @protected
             *
             */
            decorateChildrenInternal: function (UI, el) {
                // 不能用 display:none , menu 的隐藏是靠 visibility
                // eg: menu.show(); menu.hide();
                var self = this,
                // decorate menu 配置了参数
                    menuCfg = self.get("menu"),
                    menu,
                    docBody = S.one(el[0].ownerDocument.body);
                docBody.prepend(el);
                menu = new UI(S.mix({
                    srcNode: el,
                    prefixCls: self.get("prefixCls")
                }, menuCfg));
                self.setInternal("menu", menu);
            },

            destructor: function () {
                var self = this,
                    menu,
                    repositionBuffer = self.__repositionBuffer;
                if (repositionBuffer) {
                    $(win).detach("resize", repositionBuffer, self);
                    repositionBuffer.stop();
                }
                menu = self.get("menu");
                if (menu.destroy) {
                    menu.destroy();
                }
            }

        },

        {
            ATTRS: /**
             * @lends MenuButton.prototype
             */
            {
                /**
                 * Current active menu item.
                 * @type {Menu.Item}
                 */
                activeItem: {
                    view: 1
                },

                /**
                 * Whether drop down menu is same width with button.
                 * Defaults to: true.
                 * @type {Boolean}
                 */
                matchElWidth: {
                    value: true
                },

                /**
                 * Whether hide drop down menu when click drop down menu item.
                 * eg: u do not want to set true when menu has checked menuitem.
                 * Defaults to: false
                 * @type {Boolean}
                 */
                collapseOnClick: {
                    value: false
                },

                /**
                 * @private
                 */
                decorateChildCls: {
                    valueFn: function () {
                        return this.get("prefixCls") + "popupmenu"
                    }
                },
                /**
                 * Drop down menu associated with this menubutton.
                 * @type {Menu}
                 */
                menu: {
                    value: {},
                    setter: function (v) {
                        if (v instanceof Menu) {
                            v.setInternal("parent", this);
                        }
                    }
                },

                defaultChildXClass: {
                    value: 'popupmenu'
                },

                /**
                 * Whether drop menu is shown.
                 * @type {Boolean}
                 */
                collapsed: {
                    view: 1
                },
                xrender: {
                    value: MenuButtonRender
                }
            }
        }, {
            xclass: 'menu-button',
            priority: 20
        });

    return MenuButton;
}, {
    requires: [ "node", "button", "./baseRender", "menu", "component/base"]
});