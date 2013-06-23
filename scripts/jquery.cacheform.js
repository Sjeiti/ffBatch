/*
* jQuery Form Caching
*
* Version: 0.0.1
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
* todos:
*	- clearer instructions for returning all render maps for all presets
*	- choose which rendermaps to render and optionally name therm
*
*/
$(function(){
	var oSave = {}
	$.cacheform = {
		 id: "CacheForm"
		,version: "0.0.1"
		,defaults: {
			 order: "asc"	// order: asc, desc or rand
			,attr: ""		// order by attribute value
			,place: "start"	// place ordered elements at position: start, end, org (original position), first
			,returns: false	// return all elements or only the sorted ones (true/false)
		}
	};
	$.fn.extend({
		tinysort: function(_settings) {
			var oSettings = $.extend({}, $.cacheform.defaults, _settings);
			//
//			this.each(function(i) { // traverse form
//			});
//				form textarea
//				form select
//				form input[type=text]
//				form input[type=checkbox]
//				form input[type=radio]
//				form input[type=submit]
//				form input[type=button]
			$("form textarea,form select,form input[type=text],form input[type=checkbox],form input[type=radio],form input[type=submit],form input[type=button]).each(function(i,e) {
				trace($(this).attr('id')+" "+$(this).attr('name'));
			});
			//
			var oSave = invokeCookie("save",JSON.stringify(oSave));
//			$.each(oSave.vars,function(s,v){
//				//trace("s "+s+" "+v);
//				var mElm = $("[name="+s+"]");
//				var bChk = v===true||v===false;
//				if (bChk&&v) mElm.attr("checked","checked");
//				else if (bChk&&!v) mElm.removeAttr("checked");
//				else mElm.val(v);
//				mElm.change(function(e){
//					oSave.vars[s] = bChk?mElm.is(":checked"):$(this).val();
//					createCookie("ffbatch_save",JSON.stringify(oSave),3650);
//				});
//			});
			//
			oSave[sOther] = !oSave[sOther];
			//
			createCookie("ffbatch_save",JSON.stringify(oSave),3650);
			//
			//
			//
			return this;
		}
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