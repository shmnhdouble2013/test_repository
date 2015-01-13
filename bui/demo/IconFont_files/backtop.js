
/*
 * 好房app 右侧固定回到顶端 js
 * author： huangjia
 * Date： 2014-11-14
 * update: 置顶 kissy版本
 */

KISSY.ready(function(S){
    var $ = S.all;

    // 置顶 和好房app公用代码
    var bactopEl = $('#J_backTop .j_back-top'),
        headerEl = $('#header'),
        detailEl = $('#lpDetailNav');

    // 回到顶部
    bactopEl.on('click', function(){

        if(S.UA.ie){
            goTop(document.documentElement);
        }else{
            goTop();
        }
    });

    function goTop(el){
        var goEl = el || document.body;

        var scrollObj = S.Anim(goEl, {
            scrollTop : 0
        }, 0.5, 'easeBothStrong');

        scrollObj.run();
    }

    // 会顶部出现时机
    $(window).on('scroll', function() {
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