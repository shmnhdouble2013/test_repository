KISSY.add(function(b){var c=b.DOM,d=b.Event,e=10;var a=function(h){var g={mode:"single",uploadType:"asyn",extendName:[],params:{},url:"",selectBtnText:"\u6d4f\u89c8",uploadBtnText:"\u5f00\u59cb\u4e0a\u4f20",renderTo:"body"};var f=this;var i=b.merge(g,h);a.superclass.constructor.call(f,i);b.mix(f,i);f._init()};b.extend(a,b.Base);b.augment(a,{msg:"Loading...",NOT_FOUND_NODE:"\u5bf9\u4e0d\u8d77,\u7ed1\u5b9a\u65f6\uff0c\u627e\u4e0d\u5230\u7ed1\u5b9a\u8282\u70b9.",NOT_VALID_EXTENDNAME:"\u5bf9\u4e0d\u8d77\uff0c\u6587\u4ef6\u540e\u7f00\u540d\u4e0d\u7b26\u5408\u89c4\u5219\uff01",_html:function(){var g=this;var j=b.one(g.renderTo);g.set("container",j);if(j===null){g.exception(g.NOT_FOUND_NODE);return}var l=b.guid(),h="?",k="{",i="";g.set("_id_guid",l);for(var f in g.params){h+="&"+f+"="+g.params[f];k+="'"+f+"':'"+g.params[f]+"',"}k=k.substring(0,k.length-1);k+="}";if(g.uploadType==="normal"){i+='<span class="file-field-container"><input id="lp_file_'+l+'" class="fileInput" type="file" style="width:240px;height: 20px; display: block;" hidefocus="true" name="file" size="28"/>';i+='<input id="lp_filename_'+l+'" class="textInput" type="text" /> 	<a class="btn-small-container hmargin" href="javascript:void(0);"  id="browserBtn_'+l+'"><button  type="button" class="form-field-button btn-small">\u6d4f\u89c8</button></a></span>'}else{if(g.mode==="single"){i='<form data-break="false" action="'+g.url+h+'" target="iframe_upload_'+l+'" method="post" enctype="multipart/form-data" id="hid_form_'+l+'">';i+='<span class="file-field-container"><input id="lp_file_'+l+'" class="fileInput" type="file" style="width:240px;height: 20px; display: block;" hidefocus="true" name="file" size="28"/>';i+='<input id="lp_filename_'+l+'" class="textInput" type="text" /> 	<a class="btn-small-container hmargin" href="javascript:void(0);"  id="browserBtn_'+l+'"><button  type="button" class="form-field-button btn-small">\u6d4f\u89c8</button></a>';i+='<a class="btn-small-container hmargin" href="javascript:void(0);"  id="submit_upload_'+l+'" style="display:none;"><button  type="submit" class="form-field-button btn-small">\u4e0a\u4f20</button></a><input type="hidden" name="J_hid_upload" value="'+k+'" id="J_hid_upload"/></span></form><iframe name="iframe_upload_'+l+'" id="J_iframe_upload_'+l+'" style="display:none;" ></iframe>'}else{i+='<iframe name="iframe_upload_'+l+'" id="J_iframe_upload_'+l+'" style="display:none;" ></iframe>';i+='<form  data-break="false" action="'+g.url+h+'" target="iframe_upload_'+l+'" method="post" enctype="multipart/form-data" id="hid_form_'+l+'">';i+='<div class="uploadArea" id="uploadArea-'+l+'"><span class="file-field-container"><input id="lp_file_'+l+'" class="fileInput" type="file" style="width: 100px; height: 22px; display: block;" hidefocus="true" name="file" size="3" />';i+='<a class="btn-small-container " href="javascript:void(0);"  id="browserBtn_'+l+'"><button  type="button" class="form-field-button btn-small">\u6dfb\u52a0\u4e0a\u4f20\u6587\u4ef6</button></a><a class="btn-small-container " href="javascript:void(0);"  id="submit_upload_'+l+'" style="display:none;"><button  type="submit" class="form-field-button btn-small">\u4e0a\u4f20</button></a>';i+='<input type="hidden" name="J_hid_upload" value="'+k+'" id="J_hid_upload"//></span></div><div class="uploadteam" id="uploadteam-'+l+'"><p id="file-team-'+l+'"><label id="file-label-'+l+'" class="file-label"></label></p></div></form>'}}g.set("pubid",l);b.one(c.create(i)).appendTo(j)},breakUpload:function(){var f=this,g=f.get("pubid");c.attr("#hid_form_"+g,"data-break","true")},clearFiles:function(){var g=this,h=g.get("pubid");if(g.mode==="single"){b.get("#hid_form_"+h).reset();c.attr("#lp_filename_"+h,"value","")}else{var i=c.query(".fileInput","#uploadArea-"+h),f=c.query("p","#uploadteam-"+h);b.each(i,function(k,j){if(j>0){c.remove(k)}});b.each(f,function(k,j){if(j>0){c.remove(k)}})}c.css("#submit_upload_"+h,{display:"none"})},getUploadFileCount:function(){var f=this,g=f.get("pubid"),h=c.query(".fileInput","#uploadArea-"+g);if(f.mode==="single"){if(h[0].value!==""){return 1}else{return 0}}else{return h.length-1}},_beforeUpload:function(){var f=this;f.fire("beforeUpload")},_upload:function(){var f=this;if(f.mode==="single"){f._singleUpload();d.on("#submit_upload_"+f.get("_id_guid"),"click",function(){c.attr("#hid_form_"+h,"data-break","false");f._beforeUpload();var h=f.get("pubid");if(c.attr("#hid_form_"+h,"data-break")==="true"){return false}if(c.attr("#lp_file_"+f.get("_id_guid"),"value")===""){return false}else{f._finishUpload()}})}else{f._multipleUpload();var g=f.get("pubid");d.on("#submit_upload_"+g,"click",function(){c.attr("#hid_form_"+g,"data-break","false");f._beforeUpload();if(c.attr("#hid_form_"+g,"data-break")==="true"){return false}var i=c.query(".fileInput","#uploadArea-"+g);var h=c.query("p","#uploadteam-"+g);c.remove(i[0]);c.remove(h[0]);f._finishUpload()})}},_normalUpload:function(){var f=this;d.on("#lp_file_"+f.get("_id_guid"),"change",function(){var g=f._checkfile(this);if(g){var i=this.value.split("\\"),h=f.get("_id_guid");c.attr("#lp_filename_"+h,"value",i[i.length-1])}else{b.LP.Message.Alert("error","\u5bf9\u4e0d\u8d77\uff0c\u4f60\u53ea\u80fd\u4e0a\u4f20"+f.extendName+" \u4e3a\u540e\u7f00\u7684\u6587\u4ef6");c.attr("#lp_filename_"+f.get("_id_guid"),"value","");f.exception(f.NOT_VALID_EXTENDNAME)}})},_singleUpload:function(){var f=this;d.on("#lp_file_"+f.get("_id_guid"),"change",function(){var g=f._checkfile(this);if(g){var i=this.value.split("\\"),h=f.get("_id_guid");c.attr("#lp_filename_"+h,"value",i[i.length-1]);c.css("#submit_upload_"+h,{display:"inline-block"})}else{b.LP.Message.Alert("error","\u5bf9\u4e0d\u8d77\uff0c\u4f60\u53ea\u80fd\u4e0a\u4f20"+f.extendName+" \u4e3a\u540e\u7f00\u7684\u6587\u4ef6");c.attr("#lp_filename_"+f.get("_id_guid"),"value","");f.exception(f.NOT_VALID_EXTENDNAME);c.css("#submit_upload_"+h,{display:"none"})}})},_multipleUpload:function(){var f=this;d.on("#lp_file_"+f.get("_id_guid"),"change",function(){f._multipleFileChange(this)})},_addUploadFile:function(){var f=this,m=b.guid(),i=f.get("pubid"),h=c.children("#uploadArea-"+i)[0],k=b.get("#uploadteam-"+i);if(f.mode==="multiple"){var j=c.create('<input id="lp_file_'+m+'" class="fileInput" type="file" style="width: 100px; height: 22px; display: block;" hidefocus="true" name="file" size="3" />');c.prepend(j,h);var g=f.get("_id_guid"),l=c.create('<p id="file-team-'+m+'"><label id="file-label-'+m+'" class="file-label"></label></p>');c.prepend(l,k);f.set("_id_guid",m);d.on("#lp_file_"+m,"change",function(){f._multipleFileChange(this)})}},_multipleFileChange:function(k){var h=this;var g=h._checkfile(k);if(g){var m=k.value.split("\\"),l=h.get("_id_guid");var i=h.get("pubid");c.html("#file-label-"+l,m[m.length-1]+'<a class="file-cancel-upload" id="file-cancel-upload-'+l+'" href="javascript:void(0)"></a>');c.css(k,{display:"none"});d.on("#file-cancel-upload-"+l,"click",function(){c.remove("#lp_file_"+l);c.remove("#file-team-"+l);var n=c.query(".file-label","#uploadteam-"+i);if(n.length<2){c.css("#submit_upload_"+i,{display:"none"})}});if(h.get("max")){var f=h.get("max");if(/^[1-9]\d*$/.test(f)){var j=c.query(".file-label","#uploadteam-"+i);if(j.length>f){h._removefile(k);b.LP.Message.Alert("error","\u5bf9\u4e0d\u8d77\uff0c\u60a8\u4e00\u6b21\u53ea\u80fd\u4e0a\u4f20"+f+"\u4e2a\u6587\u4ef6")}else{h._addUploadFile()}}}c.css("#submit_upload_"+i,{display:"inline-block"})}else{b.LP.Message.Alert("error","\u5bf9\u4e0d\u8d77\uff0c\u4f60\u53ea\u80fd\u4e0a\u4f20"+h.extendName+" \u4e3a\u540e\u7f00\u7684\u6587\u4ef6")}},_checkfile:function(g){var f=this;if(!RegExp(".("+f.extendName.join("|")+")$","i").test(g.value)){if(f.uploadType!=="normal"){f._removefile(g)}return false}else{return true}},_checkIsHasFile:function(f){},_removefile:function(h){var f=this;if(f.mode==="multiple"){var i=h.id,g=i.split("_")[2];f._addUploadFile();c.remove("#lp_file_"+g);c.remove("#file-team-"+g)}else{c.css("#submit_upload_"+f.get("pubid"),{display:"none"})}},_finishUpload:function(){var f=this,g=f.get("pubid");d.on("#J_iframe_upload_"+g,"load",function(){c.css("#submit_upload_"+g,{display:"none"});b.get("#hid_form_"+g).reset();if(f.mode==="single"){c.attr("#lp_filename_"+g,"value","")}else{var l=c.query(".fileInput","#uploadArea-"+g);b.each(l,function(n,m){c.remove(n)});var k=c.query("p","#uploadteam-"+g);b.each(k,function(n,m){c.remove(n)});f._addUploadFile()}var j=this.contentWindow.document,h=j.body||j.documentElement;var i=h.innerHTML;if(i.length!==0){f.fire("uploadCompeleted",{msg:c.text(h)})}d.detach("#J_iframe_upload_"+g,"load")})},_init:function(){var f=this;f._html();if(f.uploadType==="normal"){f._normalUpload()}else{f._upload()}},setParams:function(i){var g=this,h="?",j="{";for(var f in i){h+="&"+f+"="+i[f];j+="'"+f+"':'"+i[f]+"',"}j=j.substring(0,j.length-1);j+="}";c.attr("#hid_form_"+g.get("_id_guid"),"action",g.url+h);c.attr("#J_hid_upload","value",j)},exception:function(f){b.log(f)}});b.namespace("LP");b.LP.Upload=a},{requires:["core","1.0/message","lpmodule/css/upload.css"]});
