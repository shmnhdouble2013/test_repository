
/*
 * 单纯的 登录js 去掉图片混合逻辑
 * update: 201411003 未注册不显示 站内信 图标
 */

$(document).ready(function(){

    // 判断用户是否登录
    (function loginStatus ($) {
        var ajaxURL = window.config['aURL']['sMemberDomain'] + "/api/user/getuser.html";

        $.ajax({
            url: ajaxURL,
            dataType: "jsonp",
            jsonp: 'callback',
            success: function (data) {
                if ("1" == data.iStatus) {
                    $("#isLogin").attr("value", true);
                    var nickname = data.aData.nickname;
                    if (strlen(nickname) > 11) {
                        nickname = nickname.substring(0,11) + ".."
                    }

                    var url = data.aData.url;
                    $("#topLogin").text(nickname);
                    $("#topLogin").attr("href", data.aData.url);
                    $("#topLogin").attr("target", "_blank");
                    $("#topLogout").show();
                    $("#topRegister").hide();
                }else{
                    $('#topLogout') && $('#topLogout').hide();
                }
            }
        });
    })($);


    // 判断站内信
    (function loginStatus ($) {

        var ajaxURL = window.config['aURL']['sMemberDomain'] + "/api/message/getMessNum.html",
            sitesMsgNum = $('#J_sites-msgnum'),
            aContentEl = sitesMsgNum.parent('a'),
            HOVER_COLOR = 'color-fc6800',
            isSngin = null;

        // 页面加载 请求登录站内信信息
        $.ajax({
            url: ajaxURL,
            dataType: "jsonp",
            jsonp: 'callback',
            success: function (data) {
                isSngin = data.iStatus;

                if (isSngin == 1) {
                    // 未读站内信数
                    var nickname = data.aData.iNoReadCount;

                    if (nickname <= 0 || !nickname) {
                        isAddSitesMsgFn();
                    }else{
                        isAddSitesMsgFn(true, nickname);
                    }
                }else{
                    isAddSitesMsgFn();
                }
            }
        });

        // 添加 隐藏 站内信 数据方法
        function isAddSitesMsgFn(isadd, nickname){
            var nickname = nickname && '('+ nickname + ')',
                nickname = nickname ? nickname : '';

            if(!sitesMsgNum || !aContentEl){
                console.log('站内信a链接和未读数据span没找到，缺少id');
                return;
            }

            // 默认隐藏，根据 ajax 用户登录情况 显示/隐藏 a 节点
            if(isSngin){
                aContentEl.show();
            }else{
                aContentEl.hide();
                return;
            }

            // 根据 ajax 站内信数量情况(有信息、信息为0、信息错误)  设置 站内信图标状态和数量
            if(isadd){
                sitesMsgNum.text(nickname);
                aContentEl.addClass(HOVER_COLOR);
                sitesMsgNum.show();
            }else{
                sitesMsgNum.text('');
                aContentEl.removeClass(HOVER_COLOR);
                sitesMsgNum.hide();
            }
        }

    })($);

    function strlen(str){
        var strlength = 0,
            i = 0;

        for(i;i<str.length;i++) {
            if(str.charCodeAt(i)>255) {
                strlength += 2;
            } else {
                strlength++;
            }
        }
        return strlength ;
    }

    // 跳转到登录页面
    $("#topLogin").bind("click", function() {
        if ($("#topLogin").prop("target") != "_blank") {
            var url = window.config['aURL']['sMemberDomain'] + "/user/login/" + "?return_url=" + window.location.href;
            window.location.href = url;
            return false;
        }
    });

    // 用户退出
    $("#topLogout").bind("click", function(event) {
        event.preventDefault();
        var ajaxURL = window.config['aURL']['sMemberDomain'] + "/api/user/logout.html";

        $.ajax({
            url: ajaxURL,
            dataType: "jsonp",
            jsonp: 'callback',
            success: function (data) {
                if ("1" == data.iStatus) {
                    window.location.reload();
                }
            }
        });
    });

    // 打开注册页面
    $("#topRegister").bind("click", function() {
        var url = window.config['aURL']['sMemberDomain'] + "/user/register/" + "?return_url=" + window.location.href;
        window.location.href = url;
        return false;
    });
});