/*
combined files : 

gallery/countdownHelper/1.0/index

*/
/**
 * @fileoverview 
 * @author 行骏<xingjun.yexj@alibaba-inc.com>
 * @module countdownHelper
 **/
KISSY.add('gallery/countdownHelper/1.0/index',function (S, Node, Base) {
    var EMPTY = '';
    var $ = Node.all;
    /**
     * 
     * @class CountdownHelper
     * @constructor
     * @extends Base
     */
    function CountdownHelper(duration, onTick, onComplete) {
        var self = this;
        var secondsLeft = 0;
        var interval;
        //调用父类构造函数
        CountdownHelper.superclass.constructor.call(self, {});

        // fock from https://github.com/gumroad/countdown.js
        var countdown = function(duration, onTick, onComplete) {

            secondsLeft = Math.round(duration);

            var tick = function() {
                if (secondsLeft > 0) {
                    onTick(secondsLeft);
                    secondsLeft -= 1;
                } else {
                    clearInterval(interval);
                    onComplete();
                }
            }

            interval = setInterval(
                (function(self) {
                    return function() {
                        tick.call(self);
                    };
                })(this), 1000
            );

            tick.call(this);

            
        }

        countdown(duration, onTick, onComplete);

        return {
            start:function(){
                clearInterval(interval);
                countdown(secondsLeft, onTick, onComplete);
                return true;
            },
            stop: function() {
                clearInterval(interval);
                return true;
            },
            getTime: function() {
                return secondsLeft;
            }
        };
    }


    S.extend(CountdownHelper, Base, /** @lends CountdownHelper.prototype*/{

    }, {ATTRS : /** @lends CountdownHelper*/{

    }});
    return CountdownHelper;
}, {requires:['node', 'base']});




