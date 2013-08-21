KISSY.add(function(S) {
    var DOM = S.DOM,
        Event = S.Event,
        cityData, 
		userConfig;
    var callback = 'getCityData';

    function createSelectCity(config) {
        var _self = this;
        var defaults = {
            provinceName:DOM.get('#' + config + ' .J_provinceName'),
            provinceValue:DOM.get('#' + config + ' .J_provinceValue'),
            cityName:DOM.get('#' + config + ' .J_cityName'),
            cityValue:DOM.get('#' + config + ' .J_cityValue'),
            countyName:DOM.get('#' + config + ' .J_countyName'),
            countyValue:DOM.get('#' + config + ' .J_countyValue'),
            province:DOM.get('#' + config + ' .J_province'),
            county:DOM.get('#' + config + ' .J_county'),
            city:DOM.get('#' + config + ' .J_city'),
            provinceTr:DOM.get('#' + config + ' .J_provinceTr'),
            countyTr:DOM.get('#' + config + ' .J_countyTr'),
            cityTr:DOM.get('#' + config + ' .J_cityTr')
        };
        _self.Config = S.merge(defaults, config);
        _self._init();
    }

    S.augment(createSelectCity, S.EventTarget);
    S.augment(createSelectCity, {
        _init:function() {
            var _self = this;
            Event.add(_self.Config.province, 'change', _self._changeRegionOfProvince, _self);
            Event.add(_self.Config.city, 'change', _self._changeRegionOfCity, _self);
            Event.add(_self.Config.county, 'change', _self._changeRegionOfCounty, _self);
            _self._listOptionsOfProvince();
            _self._listOptionsOfCity();
            _self._listOptionsOfCounty();
        },
        _showChina:function() {
            var _self = this;
            DOM.show(_self.Config.provinceTr);
            DOM.show(_self.Config.cityTr);
            DOM.show(_self.Config.countyTr);
        },
        _changeRegionOfProvince:function() {
            var _self = this, 
				province = _self.Config.province, 
				provinceName = _self.Config.provinceName, 
				provinceValue = _self.Config.provinceValue, 
				cityName = _self.Config.cityName, 
				cityValue = _self.Config.cityValue, 
				countyName = _self.Config.countyName, 
				countyValue = _self.Config.countyValue, 
				provinceOption = province.options[province.selectedIndex];
            
			_self.Config.county.length = 1;
            provinceName.value = provinceOption.value ? provinceOption.text : '';
            provinceValue.value = provinceOption.value;
            cityName.value = '';
            cityValue.value = '';
            countyName.value = '';
            countyValue.value = '';
            _self._listOptionsOfCity();
        },
        _changeRegionOfCity:function() {
            var _self = this, 
				city = _self.Config.city, 
				cityName = _self.Config.cityName, 
				cityValue = _self.Config.cityValue, 
				countyName = _self.Config.countyName, 
				countyValue = _self.Config.countyValue, 
				cityOption = city.options[city.selectedIndex];
			
            cityName.value = cityOption.value? cityOption.text :'';
            cityValue.value = cityOption.value;
            countyName.value = '';
            countyValue.value = '';
            _self._listOptionsOfCounty();
        },
        _changeRegionOfCounty:function() {
            var _self = this, 
				county = _self.Config.county, 
				countyOption = county.options[county.selectedIndex];
				
            _self.Config.countyName.value =  countyOption.value ? countyOption.text:'';
            _self.Config.countyValue.value = countyOption.value;
            if (_self.Config.countyValue.value === '') {
                _self.Config.countyName.value = countyOption.value;
                _self.Config.countyValue.value = countyOption.value;
            }
        },
        _listOptionsOfProvince:function() {
            var _self = this, 
				provinceName, 
				length;
				
            _self._showChina();
            provinceName = _self.Config.provinceName.value;
            length = cityData.China.length;
            for (var i = 0; i < length; i++) {
                if (cityData.China[i * 2 + 1] === provinceName) {
                    _self.Config.provinceValue.value = cityData.China[i * 2];
                    _self._listOptions(_self.Config.province, cityData.China, provinceName);
                }
            }
            _self._listOptions(_self.Config.province, cityData.China, '');
        },
        _listOptionsOfCity:function() {
            var _self = this, 
				length, 
				cityName, 
				provinceName = _self.Config.provinceName.value, 
				city = _self.Config.city;
				
            city.selectedIndex = 0;
            if (_self.Config.provinceValue.value === '') {
                _self.Config.provinceName.value = '';
                _self.Config.cityName.value = '';
                city.length = 1;
                return;
            } else {
                length = cityData.China.length;
                cityName = _self.Config.cityName.value;
                for (var i = 0; i < length; i++) {
                    if (cityData.China[i * 2 + 1] === provinceName) {
                        var cityArr = eval('cityData.province' + cityData.China[i * 2]);
                        for (var r = 0; r < cityArr.length; r++) {
                            if (cityArr[r * 2 + 1] === cityName) {
                                _self.Config.cityValue.value = cityArr[r * 2];
                            }
                        }
                        _self._listOptions(city, eval('cityData.province' + cityData.China[i * 2]), _self.Config.cityName.value);
                    }
                }
            }
        },
        _listOptionsOfCounty:function() {
            var _self = this, 
				length, 
				provinceArray, 
				cityName = _self.Config.cityName.value, 
				county = _self.Config.county;
				
            county.selectedIndex = 0;
            if (_self.Config.cityValue.value === '') {
                _self.Config.cityName.value = '';
                _self.Config.countyName.value = '';
                county.length = 1;
                return;
            }
            if (_self.Config.provinceValue.value === '') {
                return;
            } else {
                provinceArray = eval('cityData.province' + _self.Config.provinceValue.value);
            }
            if (provinceArray == null) {
                return;
            } else {
                length = provinceArray.length;
                for (var i = 0; i < length; i++) {
                    if (provinceArray[i * 2 + 1] === cityName) {
                        _self._listOptions(county, eval('cityData.city' + provinceArray[i * 2]), _self.Config.countyName.value);
                    }
                }
            }
        },
        _listOptions:function(selectName, array, selectedOption) {
            var num = array.length / 2;
            selectName.length = num + 1;
            for (var i = 0; i < num; i++) {
                selectName[i + 1].value = array[i * 2];
                selectName[i + 1].text = array[i * 2 + 1];
                if (array[i * 2 + 1] == selectedOption) {
                    selectName.selectedIndex = i + 1;
                }
            }
        }});

    window[callback] = function(data) {
        cityData = data;
        if (userConfig.selectCityId instanceof Array) {
            for (var i = 0; i < userConfig.selectCityId.length; i++) {
                new createSelectCity(userConfig.selectCityId[i]);
            }
        } else {
            new createSelectCity(userConfig.selectCityId);
        }
        window[callback] = null;
    };
    
    function SelectCity(config) {
        userConfig = config;
        if (!config) {
            throw 'please set selectCityId';
        }
		if(cityData){		
			if (userConfig.selectCityId instanceof Array) {
				for (var i = 0; i < userConfig.selectCityId.length; i++) {
					new createSelectCity(userConfig.selectCityId[i]);
				}
			} else {
				new createSelectCity(userConfig.selectCityId);
			}
		}else{
			S.getScript('http://lp.taobao.com/go/rgn/lp/citydata.php?callback=' + callback);
		}
    }

    S.namespace('SelectCity');
    S.SelectCity = SelectCity;
}, {requires:['core', 'sizzle']});