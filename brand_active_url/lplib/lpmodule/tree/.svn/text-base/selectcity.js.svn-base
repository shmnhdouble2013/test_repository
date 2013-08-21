/** 
* @fileOverview SelectCity 省市联动选择框
* @author  fuzheng
* @version 2.0
*/
KISSY.add('lpmodule/tree/selectcity', function(S, Select){
    /**
        @exports S.LP.Tree as KISSY.LP.Tree
	*/
	var DOM = S.DOM,
		Event = S.Event;

	var P_C_DATA = 'http://lp.taobao.com/go/rgn/provincecitydata.php',		// 省市联动
		C_D_DATA = 'http://lp.taobao.com/go/rgn/citydistrictdata.php',		// 省市区联动
		P_C_SIMPLE_DATA = 'http://lp.taobao.com/go/rgn/provincecitydata-simple.php';	// 省市联动-简单版

	/**
	* SelectCity 省市联动选择框
	* @memberOf S.LP.Tree
	* @description 省市联动选择框 基于Tree.Select
	* @class SelectCity 省市联动选择框
	* @param {Object} config 配置项 请参照Tree.View 及 Tree.Select的配置项
	*/
	function SelectCity(config){
		var _self = this;
		config = S.merge(SelectCity.config, config);
		SelectCity.superclass.constructor.call(_self, config);
	}
	SelectCity.config = 
	/** @lends  S.LP.Tree.SelectCity.prototype */		
	{
		/**
		* 结果类型 默认为 'path'
		* @field
		* @type String
		* @default 'path'
		*/
		resultType: 'path',
		/**
		* 城市数据类型 0 代表 省市数据;  1 代表 省市区 数据;  2 代表 省市区-简单版 数据;
		* @field
		* @type String
		* @default 0 省市数据
		*/
		cityType: 0
	};
	S.extend(SelectCity, Select);
	S.augment(SelectCity, 
	/** @lends  S.LP.Tree.SelectCity.prototype */		
	{
		// 重写 定制化url
		_getStoreUrl: function(){
			var _self = this,
				cityType = _self.get('cityType'),
				url = _self.get('url');
			if(!url){
				switch(cityType){
					case 0:
						url = P_C_DATA;
						break;
					case 1:
						url = C_D_DATA;
						break;
					case 2:
						url = P_C_SIMPLE_DATA;
						break;
				}
				_self.set('url', url);
				_self.set('isJsonp', true);
			}
			return url;
		}
	});

	return SelectCity;

},{requires: ['./select']});



