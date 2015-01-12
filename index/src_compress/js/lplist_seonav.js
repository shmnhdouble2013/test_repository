/**
 * 楼盘导航 list seo js
 * @author huangjia
 * @date 20140806
 */

(function($){

    var vertiaclCls = 'vert-agn',
        hideCls = 'hide';

    // 页面默认展现 show || 箭头展开 || 状态down

    // 加载js情况下 hide && 箭头收起 || 状态 up
    $('.J_navlist-container .j_hide-lpname').addClass(hideCls);
    $('.J_navlist-container .j_lplist-nav').removeClass(vertiaclCls).attr('data-icon', 'up');

    // 绑定容器 代理事件
    $('.J_navlist-container').delegate('a.j_lplist-nav','click', function(){

        var abtn = $(this),
            ulEl = abtn.siblings('ul.j_hide-lpname'),
            isUp = abtn.attr('data-icon') === 'up' ? true : false;

        // 显示隐藏 行
        if(isUp){
            ulEl.removeClass(hideCls);
            abtn.attr('data-icon', 'down');
            abtn.addClass(vertiaclCls);
        }else{
            ulEl.addClass(hideCls);
            abtn.attr('data-icon', 'up');
            abtn.removeClass(vertiaclCls);
        }
    });
})($ || jQuery);
