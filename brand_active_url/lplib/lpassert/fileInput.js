KISSY.add(function(S){
	/**
	 * config配置项：
	 * fileInputId:文件选择框ID
	 */
	 var DOM = S.DOM,Node = S.Node;
	function FileInput(config){
		var _self = this;
		config = config || {};
		config = S.merge(FileInput.config, config);
		FileInput.superclass.constructor.call(_self, config);
		_self._init();
	}
	FileInput.config = {
	};
	S.extend(FileInput, S.Base);
	S.augment(FileInput,{
		//初始化
		_init:function(){
			var _self = this;
			_self._initDOM();
			_self._initEvent();
		},
		//初始化DOM
		_initDOM:function(){
			var _self = this,
				fileInput = S.one(_self.get('fileInputId'));
			fileInput.attr({size:28});
			fileInput.addClass('fileInput');
			createLayer();

			//生成遮罩在文件选择框上的层
			function createLayer(){
				var temp = '<input type="text" id="filename" class="textInput"/> '+'<input type="button" id="browserBtn" value="浏览" class="fileInputBtn" />',
					container = S.one(_self.get('fileInputId')).parent();
				return new Node(temp).appendTo(container);
			}

		},
		_initEvent:function(){
			var _self = this,
				fileInput = S.one(_self.get('fileInputId'));
			//当鼠标移上自定义按钮时，显示文件框
			S.one('#browserBtn').on('mouseover',function(){
				fileInput.css({display:'inline',width:'238px',height:'22px'});
			});
			//当用户选择文件后，把文件框的value值显示到指定的文本框中
			fileInput.on('change',function(){
				S.one('#filename').val(S.trim(fileInput.val()));
			});
		}
	});
	return FileInput;
},{requires: ["core"]});