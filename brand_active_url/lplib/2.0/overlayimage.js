/*
 * 图片浏览控件 overlayimage 
 */
KISSY.add(function (S, Overlay) {

	var Event = S.Event,
		DOM = S.DOM;

	var CLS_ITEM = 'J_Thumbnail',
		imgMaxW=500,
		imgMaxH=500;

	/**
     * @class DPL.OverlayImage
     * @constructor
     */
	function OverlayImage (config) {	
		config = S.merge({
			maxW: imgMaxW,
			maxH: imgMaxH
		}, config);

		OverlayImage.superclass.constructor.call(this, config);
		this._init();
	}

	S.extend(OverlayImage, S.Base);

	S.augment(OverlayImage, {
		// 获取所有的图片元素
		_getLinkItems: function () {
			var self = this,
				el = self.get('el'),
				linkItems;
			if (el) {
				linkItems = el.all('.' + CLS_ITEM);
			} else {
				linkItems = self.get('nodeData');
			}
			return linkItems;
		},
		//获取当前显示的项
		_getCurrentItem : function(){
			var self = this;
			return self.get('currentItem');
		},
		// 获取索引值
		_getItemIndex: function (currentItem, items) {
			var ret = -1,
				len,
				i;
			// 如果是node, kissy node有each方法
			if (items.each) {
				items.each(function (item, index) {
					if (item[0] === S.one(currentItem)[0]) {
						ret = index;
						return false;
					}
				});
			} else {
				len = items.length;
				for (i = 0; i < len; i++) {
					if (items[i] === currentItem) {
						ret = i;
					}
				}
			}

			return ret;
		},
		/*
		 * 图片函数待优化，提取公用函数
		 */
		// 获取下个图片
		_getNextItem: function (currentItem, items) {
			var self = this,
				currentIndex = -1,
				ret;
			currentItem = currentItem || self._getCurrentItem();
			items = items || self._getLinkItems();
			currentIndex = self._getItemIndex(currentItem, items);
			ret = currentItem.imgSrc ? items[currentIndex + 1] : items[currentIndex + 1];

			return ret;
		},
		// 获取前一个图片
		_getPrevItem: function (currentItem, items) {
			var self = this,
				currentIndex = -1,
				ret;
			currentItem = currentItem || self._getCurrentItem();
			items = items || self._getLinkItems();
			currentIndex = self._getItemIndex(currentItem, items);
			ret = currentItem.imgSrc ? items[currentIndex - 1] : items[currentIndex - 1];
			return ret;
		},
		// 初始化
		_init: function () {
			var self = this;
			self._initDom();
			self._initOverlay();
			self._initEvent();
		},
		// 初始化DOM
		_initDom: function () {
			var self = this,
				el = S.one(self.get('srcNode')),
				nodeData = self.get('nodeData');
			if (el) {
				self.set('el', el);
			} else if (nodeData) {
				self.set('nodeData', nodeData);
			}
		},
		// 初始化overlay
		_initOverlay: function () {
			var self = this,
				overlay = new Overlay({
					content : '<div class="oi-outer"><div class="oi-data"><div class="oi-title"></div><div class="oi-numer"></div><a href="#" class="close">×</a></div><div class="oi-container" unselected="on" title="用方向键左右键切换，Esc键退出"><img class="oi-loading" src="http://lokeshdhakar.com/projects/lightbox2/images/loading.gif" /><img class="oi-img" src="http://lokeshdhakar.com/projects/lightbox2/images/loading.gif"/><div class="oi-nav" style="display: block; "><a class="oi-prev" style="display: block; "></a><a class="oi-next" style="display: block; "></a></div></div>' +
							'</div>',
					effect:{
						effect:'fade', //"fade",
						duration:0.5
					},
					align: {
					   points: ['cc', 'cc']
					},
					width : self.get('maxW'),
					height : self.get('maxH'),
					closable : false,
					//visible: false,
					mask: true
				});
			//overlay.render();
			self.set('overlay',overlay);
		},
		// 初始化事件
		_initEvent: function () {
			var self = this;
			self._bindImage();
			self._bindKeyboard();
		},
		// 绑定图片事件
		_bindImage: function () {
			var self = this,
				el = self.get('el'),
				overlay = self.get('overlay');
			if (el) {
				self._delegateImgClickEvent(el);
			}
			overlay.on('afterRenderUI', function () {
				bindImage();
				self._bindOverlay();
			});

			function bindImage () {
				var container = overlay.get('el'),
				error404;
				Event.on(container.one('.oi-img'), 'load', function () {
					self._limitImgWidth();
					container.one('.oi-img').show();
					S.one('.oi-loading', container).hide();
					self.set('hasLoad', true);
				});
				Event.on(container.one('.oi-img'), 'error', function () {
					error404 = 'http://img04.taobaocdn.com/tps/i4/T1sz38XlFaXXcMejYy-500-270.jpg';
					container.one('.oi-img').attr('src', error404);
					self.set('hasLoad', true);
				});
			}
		},
		// DOM渲染的组件，代理图片的点击事件
		_delegateImgClickEvent: function (el) {
			var self = this;

			Event.on(el, 'imageload', function (event) {
				var overlay = self.get('overlay'),
					container = overlay.get('el');
				// 图片没有加载进来
				if (!self.get('hasLoad')) {
					return;
				}
				self._limitImgWidth();
				container.one('.oi-img').show();
				S.one('.oi-loading', container).hide();
			});

			el.delegate('click', '.' + CLS_ITEM, function (event) {
				var target = event.currentTarget;
				event.halt();
				self._showItem(target);
			});
		},
		// 显示对应图片
		_showItem: function (item) {
			if(!item){
				return;
			}
			var self = this,
				src = item.imgSrc || S.one(item).attr('imgSrc'),
				el = self.get('el'),
				overlay = self.get('overlay');

			//重新显示Overlay时，获取所有的图片集合，期间图片集合发生改变
			if (!overlay.get('visible')) {
				overlay.center();
				overlay.show();
			}
			self._setImageInfo(item);
		},
		// 设置图片信息，加载图片
		_setImageInfo: function (item) {
			var self = this,
				overlay = self.get('overlay'),
				container = overlay.get('el'),
				imgbox = container.one('.oi-img'),
				src,
				currentItem;


			// 显示loading的图片
			self._showLoading(container);

			src = item.imgSrc||S.one(item).attr('imgSrc');
			imgbox.css('width','auto');
			imgbox.css('height','auto');
			// 暂时隐藏起来，在调整好图片大小之后再显示
			imgbox.hide();
			imgbox.attr('src', src);
			// 设置页码信息
			self._setPagination(item, container);
			// 初始化翻页按钮
			self._setPageTurnBtn(item, container);
			

			// 如果图片信息完全相同，则判为已经加载
			currentItem = self._getCurrentItem();
			self._resetLoadFlag(currentItem, src);
			self.set('currentItem', item);

			if (self.get('nodeData')) {
				// 数据填充方式
				Event.fire(overlay, 'showNode');
			} else {
				Event.fire(item, 'imageload');
			}
		},
		// 显示loading的图片
		_showLoading: function (container) {
			S.one('.oi-loading', container).show();
			S.one('.oi-loading', container).css({
				position: 'absolute',
				zIndex: '50',
				left: '50%',
				top: '50%',
				marginLeft: '-16px'
			});
		},
		// 设置页面信息
		_setPagination: function (item, container) {
			var self = this,
				currentIndex = self.getCurrentIndex(item),
				totalCount = self.getTotalCount(),
				pageStr = (currentIndex + 1) + '/' + totalCount;
			container.one('.oi-numer').text(pageStr);
		},
		// 初始化
		_setPageTurnBtn: function (item, container) {
			var self = this,
				prevEl = container.one('.oi-prev'),
				nextEl = container.one('.oi-next'),
				currentIndex = self.getCurrentIndex(item),
				totalCount = self.getTotalCount();
			if (currentIndex === 0) {
				prevEl.hide();
			}
			if (currentIndex === (totalCount - 1)) {
				nextEl.hide();
			}
			if (currentIndex > 0) {
				prevEl.show();
			}
			if (currentIndex < (totalCount - 1)) {
				nextEl.show();
			}
		},
		// 重置已经加载的标记
		_resetLoadFlag: function (currentItem, src) {
			var self = this;
			if (currentItem) {
				currentItem = currentItem.imgSrc ? currentItem : S.one(currentItem);
				if (currentItem.imgSrc === src || (currentItem.attr && currentItem.attr('imgSrc') === src)) {
					self.set('hasLoad', true);
				} else {
					self.set('hasLoad', false);
				}
			} else {
				self.set('hasLoad', false);
			}
		},
		// 限制图片宽度
		_limitImgWidth: function () {
			var self = this,
				overlay = self.get('overlay'),
				container = overlay.get('el'),
				imgbox = container.one('.oi-img'),
				imgWidth = imgbox.width();
				imgHeight = imgbox.height();

			imgMaxW = self.get('maxW');
			imgMaxH = self.get('maxH');

			if ((imgWidth > imgMaxW) && (imgHeight > imgMaxH)) {
				if (imgWidth > imgHeight) {
					imgbox.css('width',imgMaxW+'px');
				} else {
					imgbox.css('height',imgMaxH+'px');
				}
			} else {
				imgbox.css('width', (imgWidth >= imgMaxW ? imgMaxW : imgWidth) + 'px');
				imgbox.css('height', (imgHeight >= imgMaxH ? imgMaxH : imgHeight) + 'px');
			}
			container.one('.oi-outer').css('width', imgbox.width() + 'px');
		},
		_bindOverlay: function () {
			var self = this,
				overlay = self.get('overlay');

			self._bindShowNode(overlay);
			self._bindClose(overlay);
			self._overlayHover(overlay);
			self._overlayUnselectable(overlay);
			self._bindImgPageTurning(overlay);
			self._bindHide(overlay);
		},
		_bindShowNode: function (overlay) {
			var self = this,
				container = overlay.get('el');
			Event.on(overlay, 'showNode', function () {
				// 图片如果没有加载，则不操作
				if (!self.get('hasLoad')) {
					return;
				}
				self._limitImgWidth();
				container.one('.oi-img').show();
				S.one('.oi-loading', container).hide();
			});
		},
		// 绑定关闭按钮
		_bindClose: function (overlay) {
			var container = overlay.get('el');
			container.delegate('click', '.close', function (event) {
				event.halt();
				overlay.hide();
			});
		},
		// 绑定鼠标移到overlay上显示前进后退按钮
		_overlayHover: function (overlay) {
			var self = this,
				container = overlay.get('el'),
				prevEl = container.one('.oi-prev'),
				nextEl = container.one('.oi-next');

			/*
			 * 该事件需要修改，触发次数太多
			 */
			Event.on(container.one('.oi-container'), 'mouseenter mouseleave', function (event) {
				prevEl.toggleClass('oi-prev-hover');
				nextEl.toggleClass('oi-next-hover');
			});
		},
		// 不允许选中
		_overlayUnselectable: function (overlay) {
			var container = overlay.get('el');
			Event.on(container.one('.oi-container'), 'selectstart', function () {
				return false;
			});
		},
		// 绑定图片翻页
		_bindImgPageTurning: function (overlay) {
			var self = this,
				container = overlay.get('el'),
				prevEl = container.one('.oi-prev'),
				nextEl = container.one('.oi-next');
			//前一张图片
			prevEl.on('click', function (event) {
				event.halt();
				var prevItem = self._getPrevItem();
				self._showItem(prevItem);
				self._setPageTurnBtn(prevItem, container);
			});
			//后一张
			nextEl.on('click',function(event){
				event.halt();
				var nextItem = self._getNextItem();
				self._showItem(nextItem);
				self._setPageTurnBtn(nextItem, container);
			});
		},
		// 绑定隐藏
		_bindHide: function (overlay) {
			var container = overlay.get('el'),
				prevEl = container.one('.oi-prev'),
				nextEl = container.one('.oi-next');
			overlay.on('hide', function () {
				prevEl.show();
				nextEl.show();
			});
		},
		// 绑定键盘事件
		_bindKeyboard: function () {
			var self = this,
				overlay = self.get('overlay');
			Event.on(window.document, 'keydown', function (event) {
				var visible = overlay.get('visible'),
					keycode;
				if (!visible) {
					return;
				}
				event.halt();
				keycode = event.keyCode;
				switch (keycode) {
					case 27:
						overlay.hide();
						break;
					case 37:
						toggleImage(37);
						break;
					case 39:
						toggleImage(39);
						break;
				}
			});

			// 切换图片
			function toggleImage (keycode) {
				var isNext = (keycode === 39),
					item;
				if (isNext) {
					// 下一张
					item = self._getNextItem();
					self._showItem(item);
				} else {
					// 上一张
					item = self._getPrevItem();
					self._showItem(item);
				}
			}
		},
		// 获取当前图片页码
		getCurrentIndex: function (currentItem) {
			var self = this,
				items = self._getLinkItems();	
			return self._getItemIndex(currentItem, items);
		},
		// 获取总图片数
		getTotalCount: function () {
			var self = this,
				items = self._getLinkItems();
			return items.length;
		},
		// 显示
		show: function () {
			var self = this,
				items = self._getLinkItems();

			if (self.get('nodeData')) {
				self._showItem(items[0]);
			}
		},
		// 改变数据源
		changeData: function (data) {
			var self = this,
				data = data || {};

			// 数据填充方式
			if (data.nodeData) {
				self.set('nodeData', data.nodeData);
			}
		}
	});

	return OverlayImage;

}, {
	requires: ['overlay']
});