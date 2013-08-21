/** 
* @fileOverview SelectCity 省市联动选择框
* @author  fuzheng
* @version 1.0
*/
KISSY.add(function(S){
    /**
        @exports S.LP as KISSY.LP
	*/
	var DOM = S.DOM,
		Event = S.Event;

	/**
	* SelectCity 省市联动选择框
	* @memberOf S.LP
	* @description 省市联动选择框 基于SelectTree
	* @class SelectCity 省市联动选择框
	* @param {Object} config 配置项 请参照TreeBase 及 SelectTree的配置项
	*/
	function SelectCity(config){
		var _self = this;
		config = S.merge(SelectCity.config, config);
		SelectCity.superclass.constructor.call(_self, config);
	}
	SelectCity.config = 
	/** @lends  S.LP.SelectCity.prototype */		
	{
		/**
		* 结果类型 默认为 'valuePath id'
		* @field
		* @type String
		* @default 'valuePath id'
		*/
		resultType: 'path'
	};
	S.extend(SelectCity, S.LP.SelectTree);
	S.augment(SelectCity, 
	/** @lends  S.LP.SelectCity.prototype */		
	{
	});

	S.namespace('LP');

	S.LP.SelectCity = SelectCity;

},{requires: ['lpmodule/selecttree']});

/**
TODO


*/