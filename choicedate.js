/**
 * @Description  : 最近日期
 * @Author       : jixiangac
 * @E-mail       : wb-huangjixiangac@taobao.com
 * @Date         : 2013/07/26
 */
KISSY.add('choicedate', function (S) {
    var D = S.DOM
      , E = S.Event
      , $ = S.all;

    function ChoiceDate (config) {
        var self = this; 
        ChoiceDate.superclass.constructor.call(self, config);
        self.today = self.get('today') ? new Date(self.get('today')) : new Date();
    }
    S.extend(ChoiceDate, S.Base);
    S.augment(ChoiceDate, {
        getTheRangeDate : function (type, num) {
            var self = this
              , type = type || 'day'
              , num = parseInt(num, 10) || 0;
            var resDate;
            switch (type) {
              case 'day' :
                resDate = self._prevDay(num);
                break;
              case 'month' :
                resDate = self._prevMonth(num);
                break;
              case 'year' :
                resDate = self._prevYear(num);
                break;
            }
            return resDate;
        },
        formatDate : function (date, format) {
          var now = new Date(date);
          var o = {
            "M+" : now.getMonth()+1, //month
            "d+" : now.getDate(),    //day
            "h+" : now.getHours(),   //hour
            "m+" : now.getMinutes(), //minute
            "s+" : now.getSeconds(), //second
            "q+" : Math.floor((now.getMonth()+3)/3),  //quarter
            "S" : now.getMilliseconds() //millisecond
          }
            if (/(y+)/.test(format)) {
                format = format.replace(RegExp.$1, (now.getFullYear() + "")
                                    .substr(4 - RegExp.$1.length));             
            }

            for (var k in o) {
                if (new RegExp("(" + k + ")").test(format)) {
                    format = format.replace(RegExp.$1,
                        RegExp.$1.length == 1 ? o[k] :
                        ("00" + o[k]).substr(("" + o[k]).length));                    
                }                
            }

            return format;
        },
        _getCountDays : function (month) {
            var now = this.get('today') ? new Date(this.get('today')) : new Date();
            //修正月份最大天数超限的问题
            //当本月为31号，使用setDate(0)方式降级月数，但是上月的date最大为
            //30号情况时，就会出现降月失败了
            //还有2月份的情况也包含在内了，每个月总会有1号吧，呵呵
            now.setDate(1);
            now.setMonth(month);
            now.setDate(0);
            return now.getDate();
        },
        _prevDay : function (days) {
            var now = this.get('today') ? new Date(this.get('today')) : new Date();
            now.setDate(now.getDate() - days);
            return this.formatDate(now, 'yyyy-MM-dd');
        },
        _prevMonth : function (month) {
            var self = this
              , now = this.get('today') ? new Date(this.get('today')) : new Date()
              , nowDate = now.getDate()
              , nowMonth = now.getMonth()
              , _distance = 0;
              
            //最近一个月
            if (month === 1 &&  nowDate === self._getCountDays(nowMonth + 1)) {
                _distance -= 1;
            }
            //自然月间隔天数
            for (var i = 0; i < month; i ++) {
                var _now = self._getFormatDate(now, nowMonth + 1 -i);
                var _prev = self._getFormatDate(now, nowMonth - i);
                _distance += self._getDateDiff(_now, _prev);
            }

            return self._prevDay(_distance);
        },
        _getFormatDate : function (now, n) {
           var self = this
             , nowMonth = now.getMonth()
             , nowDate = now.getDate();

           var _formtDate = new Date()
             , _formtDateMonth = n
             , _formtDateMaxDate = self._getCountDays(_formtDateMonth);

            if (nowDate === self._getCountDays(nowMonth + 1)) {
                //修正月份最大天数超限的问题
                //当本月为31号，使用setDate(0)方式降级月数，但是上月的date最大为
                //30号情况时，就会出现降月失败了
                //还有2月份的情况也包含在内了，每个月总会有1号吧，呵呵
                _formtDate.setDate(1);
                _formtDate.setMonth(_formtDateMonth - 1)
                _formtDate.setDate(_formtDateMaxDate);
            } else {
                _formtDate.setDate(nowDate);
                _formtDate.setMonth(_formtDateMonth - 1);
            }

            return _formtDate;      
        },
        _getDateDiff : function (now, prev) {
           var d =  Math.ceil((now.getTime() - prev.getTime())/(3600*24*1000));
           return Math.abs(d);
        },
        _prevYear : function (year) {
            var now = this.get('today') ? new Date(this.get('today')) : new Date();
            now.setFullYear(now.getFullYear() - year);
            return this.formatDate(now, 'yyyy-MM-dd');
        }
    });

    return ChoiceDate;
},
{
    requires : []
});