## 综述

kissy gallery 倒计时助手

* 版本：1.0
* 作者：行骏
* 标签：
* demo：[http://gallery.kissyui.com/countdownHelper/1.0/demo/index.html](http://gallery.kissyui.com/countdownHelper/1.0/demo/index.html)

## 初始化组件

    S.use('gallery/countdownHelper/1.0/index', function (S, Countdown) {
         var countdownHelper = new CountdownHelper(10, function(seconds) {
              console.log(seconds); 
            }, function() {
               console.log("Countdown complete!");
            });
    })

## API说明
* start()

例子：

	countdownHelper.start();//开始

* stop()

例子：

	countdownHelper.stop();//停止

* getTime()

例子：

	countdownHelper.getTime();//获得剩余时间


