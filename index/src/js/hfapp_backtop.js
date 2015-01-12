
/*
 * 好房app 右侧固定二维码 和 回到顶端 js
 * author： huangjia
 * Date： 20140813
 * update: 新版和detail 详情页面 超过nav导航 出现置顶 header || offsettop+height
 */

(function($, window, document){

    $(document).ready(function(){
        // 置顶 和好房app公用代码
        var rcodeEl = $('#J_backTop .j_small-rcode'),
            bactopEl = $('#J_backTop .j_back-top'),
            hfappEl = $('#J_backTop .j_hf-app-content'),
            headerEl = $('#header'),
            detailEl = $('#lpDetailNav');

        // 显示二维码
        rcodeEl.mouseover(function(){
            hfappEl.show();
        }).mouseout(function(){
            hfappEl.hide();
        });

        // 回到顶部
        bactopEl.click(function(){
//            if(navigator.userAgent.indexOf("webkit")!==-1){
//                bodyEl.animate({
//                    scrollTop : 0
//                }, 400);
//            }else{

            if(document.body.scrollTop){
                document.body.scrollTop = 0;
            }else{
                document.documentElement.scrollTop = 0;
            }
//            }
        });

        // 会顶部出现时机
        $(window).scroll(function() {
            var curScroll = document.body.scrollTop || document.documentElement.scrollTop,
                viewHeight = getHideHeiht();

            if(curScroll > viewHeight){
                bactopEl.removeClass('hide');
            }else{
                bactopEl.addClass('hide');
            }
        });

        // 获取 隐藏高度
        function getHideHeiht(){
            var headerElHeight = headerEl.length !== 0 ? headerEl.height() : null,
                detailElHeight = detailEl.length !== 0 ? detailEl.offset().top + detailEl.height(): null,
                endHeight = headerElHeight || detailElHeight;

            return (endHeight && endHeight >50) ? endHeight : 250;
        }
    });

})($ || jQuery, window, document);