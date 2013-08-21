KISSY.add(function(S, DOM, Event, Validation) {

    function Remote(el, config, callback) {
        var timer = null,
            remoteflag = null,

            cache = new Validation.Util.storage(),

            //ajax设置
            elname = DOM.attr(el, 'name'),
            cfg = {
                type: 'POST',
                dataType: 'json',
                data: {}
            };
        cfg.data[elname] = null;

        S.mix(cfg, config);
        cfg.data[elname] = null;


        function success(flag) {
            var thisflag = flag;
            return function(data, textStatus, xhr) {
                if (thisflag != remoteflag){
                	return;
                }

                //返回了错误的格式
                if (!data && !data.state) {
                    Util.log('返回数据格式错误，正确的格式如：\n\n {"state": false,"message": "提示信息"}');
                    self.showMessage(0, '校验失败');
                    return;
                }

                //执行校验
                if (data.state) {
                    callback(1, data.message);
                } else {
                    callback(0, data.message);
                }

                //用户自定义回调方法
                if (S.isFunction(config.success)) {
                    config.success.call(self, data, textStatus, xhr);
                }
            };
        }

        function ajax(time, val, name) {
            var elname = DOM.attr(el, 'name'),
                cfg = {
                    type: 'POST',
                    dataType: 'json',
                    data: {}
                };

            //合并配置
            S.mix(cfg, config);


            //请求错误处理
            cfg.error = function(data, textStatus, xhr) {
                if (S.isFunction(config.error)) {
                    config.success.call(this, data, textStatus, xhr);
                }
            };
            if (config.data && S.isFunction(config.data)) {
                S.mix(cfg.data, config.data);
            }

            cfg.data[elname] = val;
			cfg.data[name] = val ;
            cfg.success = function(data, textStatus, xhr) {
                cache.add(val, data);
                success(time).call(this, data, textStatus, xhr);
            };
            S.io(cfg);
        }


        this.check = function(val,name) {
            //缓存
            var r = cache.get(val);
            if (r) {
                return r;
            }

            //延迟校验
            if (timer){
            	timer.cancel();
            }
            timer = S.later(function() {
                remoteflag = S.guid();
                ajax(remoteflag, val, name);
            }, 500);
            return {message:'loading',state:false};
        }

    }

    return Remote;


}, { requires: ['dom','event','lpassert/validation'] });