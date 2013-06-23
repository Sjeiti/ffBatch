/*
* jQuery Filter Forge batch
*
* Version: 1.0.0
*
* Copyright (c) 2008 Ron Valstar
*
* Dual licensed under the MIT and GPL licenses:
*   http://www.opensource.org/licenses/mit-license.php
*   http://www.gnu.org/licenses/gpl.html
*
* description
*   - 
*
* Usage:
*
* in this update:
*   - add output naming: filename and numbering prefix
*   - add numeral input next to sliders (see http://www.filerenamer.net/file-renamer-Screenshots.html)
*	- add cicular animation in sliders
*
* in last update:
*
* Todos
*	- clearer instructions for returning all render maps for all presets
*	- choose which rendermaps to render and optionally name therm
*
*/
$(function(){
	trace("Sliders");
	var iWsl = 200;
	var oSettings = {
		 cookieprefix:"ffbatch"
		,save:{
			 fieldset:{
				 tb_settings:true
				,tb_controls:true
				,local:true
				,rendering:true
				,image:true
				,animation:true
				,rendermaps:false
			}
			,vars:{
				 renderer:"C:\\\"Program Files\"\\\"Filter Forge\"\\Bin\\FFXCmdRenderer-x86-SSE2.exe"
				,destination:"U:\\test\\ff\\"
				,UseMultithreading:true
				,Dither:true
				,Progressive:true
				,OptimizeBlurs:true
				,AntiAliasBitmapComponentSources:false
				,Jitter:0
				,TemporaryFilesLocation:""
				,RAMUsageLimit:60
				,NormalMapFlipY:false
				,frames:100
				,form:"JPG"
				,width:256
				,height:256
//				,mapName_result:	"resultaat"
//				,mapName_diffuse:	"diffusie"
//("result","diffuse","bump","normal","alpha","metallic","specular") map_ mapName_
			}
		}
	}
	//
	// select file form
	$("#fileSelect input,#fileSelect>input").change(function(e){trace("asdf");$("#fileSelect").submit()});
	//$("#loadNewFilter").click(function(e){window.location = window.location;});
	//
	//eraseCookie("ffbatch_save");
	// saved vars
	var oSave = invokeCookie("save",JSON.stringify(oSettings.save));
	$.each(oSave.vars,function(s,v){
		//trace("s "+s+" "+v);
		var mElm = $("[name="+s+"]");
		var bChk = v===true||v===false;
		if (bChk&&v) mElm.attr("checked","checked");
		else if (bChk&&!v) mElm.removeAttr("checked");
		else mElm.val(v);
		mElm.change(function(e){
			oSave.vars[s] = bChk?mElm.is(":checked"):$(this).val();
			createCookie("ffbatch_save",JSON.stringify(oSave),3650);
		});
	});
	//
	//
	// Sliders
	$(".SliderControl,.IntSliderControl,.AngleControl").each(function(i,el){
	//$(".start.SliderControl,.end.SliderControl").each(function(i,el){
		var mTd = $(this);
		var aCls = mTd.attr("class").split(" ")
		var sTpe = aCls[0];
		var mTr = mTd.parent();
		var sId = mTr.find("input.id").val();
		var sNme = sId+"_"+aCls[1];
		//
		// circular motion
		if (mTd.hasClass("start")) {
			switch (sTpe) {
				case "AngleControl":
				case "SliderControl"://case "ColorControl":
					var sSelect = "<select name=\""+sId+"_ease_"+aCls[1]+"\" class=\"animType\">";
					sSelect += "<option value=\"0\">linear</option>";
					sSelect += "<option value=\"1\">smooth</option>";
					sSelect += "<option value=\"2\">circular</option>";
					sSelect += "<select>";
					var mSel = $(sSelect).appendTo(mTd);
				break;
			}
		}
		//
		var mInp = $("<input name=\""+sNme+"\" type=\"text\" />").appendTo(mTd);
		var mDiv = $("<div id=\""+sNme+"\"></div>").appendTo(mTd);
		var oSlider = { min:0 };
		//
		// input text field
		var oFn = function(e){ if (oSlider.value!=mInp.val()) mDiv.slider("value", mInp.val());/*iWsl**/ };
		mInp.change(oFn).keyup(oFn);
		//
		switch (sTpe) {
			case "AngleControl":
				oSlider.max = 360;
				oSlider.value = parseFloat(mTr.find("input.value").val());
				oSlider.change = function(e,ui){
					mInp.val(ui.value);
				}
				mInp.val(oSlider.value);
			break;
			case "SliderControl":
				oSlider.max = iWsl;
				oSlider.value = iWsl*parseFloat(mTr.find("input.value").val());
				oSlider.slide = function(e,ui){
					mInp.val(ui.value/iWsl);
				}
				mInp.val(oSlider.value/iWsl);
			break;
			case "IntSliderControl":
				oSlider.min = 1;
				oSlider.max = parseInt(mTr.find("input.rangemax").val());
				oSlider.value = parseInt(mTr.find("input.value").val());
				oSlider.step = 1;
				oSlider.slide = function(e,ui){
					mInp.val(ui.value);
				}
				mInp.val(oSlider.value);
			break;
		}
		mDiv.slider(oSlider);
	});
//	// checkbox
//	$(".CheckboxControl").each(function(i,el){
//		var mTd = $(this);
//		var aCls = mTd.attr("class").split(" ")
//		var sTpe = aCls[0];
//		var mTr = mTd.parent();
//		var sId = mTr.find("input.id").val();
//		var sNme = sId+"_"+aCls[1];
//		//
//		var mInp = $("<input name=\""+sNme+"\" type=\"checkbox\""+(mTr.find("input.value").val()=="true"?" checked=\"checked\"":"")+" />").appendTo(mTd);
//	});
	// color
    var oFarb = $.farbtastic("#picker");
	var mFarb = $("#picker");
	$(".ColorControl").each(function(i,el){
		var mTd = $(this);
		var aCls = mTd.attr("class").split(" ")
		var sTpe = aCls[0];
		var mTr = mTd.parent();
		var sId = mTr.find("input.id").val();
		var sNme = sId+"_"+aCls[1];
		//
		if (mTd.hasClass("start")) {
			var sSelect = "<select name=\""+sId+"_ease_"+aCls[1]+"\" class=\"animType\">";
			sSelect += "<option value=\"0\">linear</option>";
			sSelect += "<option value=\"1\">smooth</option>";
			sSelect += "<option value=\"2\">circular</option>";
			sSelect += "<select>";
			var mSel = $(sSelect).appendTo(mTd);
		}
//		var mInp = $("<input name=\""+sNme+"\" type=\"hidden\" />").appendTo(mTd);
		var mDiv = $("<div id=\""+sNme+"\"></div>").appendTo(mTd);
		//
		var mInp = $("<input name=\""+sNme+"\" value=\""+mTr.find("input.value").val()+"\" type=\"text\" class=\"color\" />").appendTo(mTd).focus(function(e){
			var mInp = $(this);
			var oOff = mInp.offset();//.parent().parent()
			oFarb.linkTo(mInp);
			trace("oOff.left "+" "+oOff.left);
			mFarb.show().css({top:oOff.top-mFarb.height()/2+9+"px",left:oOff.left+mInp.width()-50+"px"});
		}).blur(function(e){
			trace("blur ");
			mFarb.hide();
		});
		oFarb.linkTo(mInp);
//      .each(function () { f.linkTo(this); $(this).css('opacity', 0.75); })
//      .focus(function() {
//        if (selected) {
//          $(selected).css('opacity', 0.75).removeClass('colorwell-selected');
//        }
//        f.linkTo(this);
//        p.css('opacity', 1);
//        $(selected = this).css('opacity', 1).addClass('colorwell-selected');
//      });
	});
	//
	//
	// table size
	$("table>thead>tr>th").each(function(i,el){$(this).css({width:[18,12,35,35][i%4]+"%"})});
	//
	// fieldset and legend (has to be after slider setup)
	$("legend").each(function(i,el){
		var mLg = $(this);
		var mFl = mLg.parent();
		var sFl = mFl.attr("id");
		var mHd = $("<h3>"+mLg.text()+"</h3>").prependTo(mFl).click(function(e){
			var mHd = $(this);
			mHd.siblings().toggle();
			oSave.fieldset[sFl] = !oSave.fieldset[sFl];
			if (sFl=="rendermaps"||sFl=="animation") {
				var sOther = sFl=="rendermaps"?"animation":"rendermaps";
				var mHother = $("#"+sOther+">h3");
				if ((oSave.fieldset[sFl]&&oSave.fieldset[sOther])||(!oSave.fieldset[sFl]&&!oSave.fieldset[sOther])) {
					mHother.siblings().toggle();
					oSave.fieldset[sOther] = !oSave.fieldset[sOther];
				}
			}
			createCookie("ffbatch_save",JSON.stringify(oSave),3650);
		});
		mLg.remove();
		if (!oSave.fieldset[sFl]) mHd.siblings().hide();
	});
	//
	// submission
	$("input[name=anim],input[name=maps]").click(function(e){
		$("input[name=stype]").val($(e.currentTarget).attr("name"));
		trace("submission "+$(e.currentTarget).attr("name")+" "+$("form").attr("id"));
		$("form#getzip").get(0).submit();
//		$("form").get(0).submit();
//		trace("$(form).sumbit "+$("form").get(0).submit()+" "+$("form").sumbit);
//		$("form").sumbit();
//		$("form").sumbit(function(e){return true;});
//		trace("$(form.) "+" "+$("form").attr("action"));
	});
	//
	// invokeCookie
	function invokeCookie(name,defval,fn) {
		var oReturn;
		var sCkName = oSettings.cookieprefix+"_"+name;
		var sCookie = readCookie(sCkName);
		var bSet = sCookie!=null;
		try {
			if (bSet) oReturn = JSON.parse(sCookie);
			trace("cookie parsed: '"+sCkName+"'");
		} catch (e) {
			trace("cookie parse error: '"+sCkName+"' "+e+"\n\tdata:"+sCookie);
			bSet = false;
		}
		if (!bSet&&defval) {
			trace("cookie '"+sCkName+"' reverting to default data");
			oReturn = JSON.parse(defval);
			if (fn) fn(oReturn);
			else createCookie(sCkName,defval,3650);
		}
		return oReturn;
	}
	//
	///////////////////
	//
	// createCookie
	function createCookie(name,value,days) {
		if (days) {
			var date = new Date();
			date.setTime(date.getTime()+(days*24*60*60*1000));
			var expires = "; expires="+date.toGMTString();
		}
		else var expires = "";
		document.cookie = 	name+"="+value+expires+"; path=/";
	}
	// readCookie
	function readCookie(name) {
		var nameEQ = name + "=";
		var ca = document.cookie.split(';');
		for(var i=0;i < ca.length;i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1,c.length);
			if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
		}
		return null;
	}
	// eraseCookie
	function eraseCookie(name) {
		createCookie(name,"",-1);
	}
	// trace
	function trace(o) {
		if (window.console&&window.console.log) {
			if (typeof(o)=="string")	window.console.log(o);
			else						for (var prop in o) window.console.log(prop+":\t"+String(o[prop]).split("\n")[0]);
		}
	}
});