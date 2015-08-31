/**
 * $Copyright: 2015, jackness.org $
 * $Creator: Jackness Lau $
 * $Author: Jackness Lau $
 * $Date: Mon Aug 31 2015 11:37:52 GMT+0800 (中国标准时间) $
 * $Version: 1.4.10 $
 */
!function(global,undefined){
 
if(global.mod){
	return;
}
//原生扩展
String.prototype.trim = function(){return this.replace(/^(\s|\u3000)*|(\s|\u3000)*$/g,"");};

String.prototype.getBytes = function(){var bytes=0;for(var i=0;i<this.length;i++){if(this.charCodeAt(i)>256){bytes+=2;}else{bytes+=1;}}return bytes;};


Array.prototype.indexOf = Array.prototype.indexOf || function(s){
	for(var i = 0, len = this.length; i < len; i++){
		if(this[i] === s){
			return i;
		}
	}
	return -1;
};

Array.prototype.remove = Array.prototype.remove || function(s){
	for(var i = 0, len = this.length; i < len;){
		if(this[i] === s){
			this.splice(i, 1);
		} else {
			i++
		}
	}
};




//全局函数 - UA
var UA = global.UA = {
	ie:(!!window.ActiveXObject && /msie (\d*)/i.test(navigator.userAgent) ? RegExp.$1 : false)
};

//全局函数 - request
var request = global.request = {
	search:function(key){
		var s = location.search.replace(/[? ]/g,"");
		if(s === ""){return null;}

		var g = s.split("&");
		for(var i = 0, len = g.length; i < len; i++){
			var f = g[i].split("=");
			if(f.length <= 1){continue;}
			var k = f[0],
				v = f[1];
			if(k === key){return v;}
		}
		return null;
	},
	hash:function(key,val){
		var s = location.hash.replace(/[# ]/g,"").replace(/^[#]*&/g,""),
			isVal = typeof val != "undefined",
			isMatch = false;
		if(s === "" && !isVal){return null;}

		var g = s.split("&");

		for(var i = 0, len = g.length; i < len; i++){
			var f = g[i].split("=");
			if(f.length <= 1){continue;}

			var k = f[0],
				v = f[1];
			if(k === key){
				if(isVal){
					g[i] = k + "=" + val;
					isMatch = true;
				} else {
					return v;
				}
			}
		}
		!isMatch && g.push(key + "=" + val);
		if(isVal){

			window.location.hash = g.join("&");
			return g.join("&");
		}

		return null;
	}
};

/**
 * 全局函数 - historyManage
 * 历史记录管理
 * <pre>
 * jns.historyManage.init(callback);
   btn.onclick = function(){
       jns.historyManage.addHistory(attr,val)
   }
 * </pre>
 * @base:   request,UA
 * @param:  {object} callback 向前，退后按钮触发的事件(ie8以上 还有 更改地址栏 hash值触发的事件)
 * @param:  {string} attr     hash上的 属性
 * @param:  {string} val      hash上的 值
 */
var historyManage = global.historyManage = UA.ie && UA.ie < 8?{
	init: function(callback,key){
		this.ifElement = document.getElementById("modHistoryManage");
		if(!this.ifElement){
			this.ifElement = document.createElement("iframe");
			this.ifElement.id = "modHistoryManage";
			this.ifElement.style.cssText = [
				"position:absolute",
				"top:-500px",
				"left:-500px",
				"broder:0",
				"overflow:hidden",
				"width:0",
				"height:0"
			].join(";");
			document.body.appendChild(this.ifElement);

			try{
				this.ifDocument = this.ifElement.contentWindow.document;
			} catch(er){}
		}
		if(typeof callback != "function"){
			return;
		}
		!this.callback && (this.callback = {});
		!key && (key = new Date().getTime());
		this.callback[key] = callback;
		this.hashChangeCallback = function(){
			for(var key in this.callback){
				if(this.callback.hasOwnProperty(key)){
					this.callback[key]();
				}
			}
			
		};

	},
	add: function(hash,val){
		
		try{
			this.ifDocument.open();
			this.ifDocument.write([
				'<!DOCTYPE HTML>',
				'<html>',
				'<head>',
				'<script type="text/javascript">',
					'function onloadEvent(){',
						'parent.request.hash("'+ hash +'","'+ val +'");',
						'parent.historyManage.hashChangeCallback();',
					'};',
				'</script>',
				'</head>',
				'<body onload="onloadEvent();">',
					'<input type="value" value="'+ window.location.hash.replace("#","") +'" id="'+ window.location.hash.replace("#","") +'" />',
				'</body>',
				'</html>'
			].join(""));
			this.ifDocument.close();
		} catch(er){}
		
	}

}:{
	init: function(callback,key){
		!this.callback && (this.callback = {});
		!key && (key = new Date().getTime());
		this.callback[key] = callback;
		this.hashChangeCallback = function(){
			for(var key in this.callback){
				if(this.callback.hasOwnProperty(key)){
					this.callback[key]();
				}
			}
			
		};
		window.onhashchange = this.hashChangeCallback;

	},
	add: function(hash,val){
		request.hash(hash,val);

	}
};

//全局函数 - console
var console = global.console || {log:function(txt){}};

var cookies = global.cookies = {
	/** 
	 * 获取 cookies中的某个变量
	 * <pre>
	 * jns.cookies.get("jackNEss")
	 * </pre>
	 * @param:  {string} name 需要获取的cookies 属性名称
	 * @return: {void}
	 * @date:    2012-5-25
	 * @version: 1.0
	 */
	get:function(name){
		var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
		if(arr !== null) {
			return window.unescape(arr[2]);
		}
		return null;
	},
	/**
	 * 在cookies中设置变量与值。
	 * <pre>
	 * jns.cookies.set("jackNEss","handle",20)
	 * </pre>
	 * @param:  {string} name       需要设置的cookies 属性名称
	 * @param:  {string} value      需要设置的cookies 属性值
	 * @param:  {number} delayHours 持续时间，单位:小时，默认值为24
	 * @param:  {string} path       cookies存放路径 以 "/" 结尾 如果 值为 "/" 则表示全站通用
	 * @param:  {string} domain     cookies作用域设置
	 * @param:  {string} secure     一个布尔类型的值，secure值为true时，在http中是无效的，在https中才有效。
	 * @return: {void}
	 * @date:    2013-1-28
	 * @version: 1.1
	 */
	set:function(name,value,delayHours,path,domain,secure){
		if(!delayHours){
			delayHours = 24;
		}
		var exp = new Date();    
		exp.setTime(exp.getTime() + delayHours*60*60*1000);
		document.cookie = name + "="+ window.escape(value) + ";expires=" + exp.toGMTString() + (domain?";domain=" + domain:"") + (path?";path=" + path:"") + (secure === true? ";secure":"");
	},
	/**
	 * 删除cookies中的某个变量
	 * <pre>
	 * jns.cookies.del("jackNEss")
	 * </pre>
	 * @param:  {string} name 需要删除的cookies 属性名称
	 * @return: {void}
	 * @date:    2012-5-25
	 * @version: 1.0
	 */
	del:function(name){
		var exp = new Date();
		exp.setTime(exp.getTime() - 1);
		var cval = this.get(name);
		if(cval !== null){
			document.cookie= name + "="+cval+";expires="+exp.toGMTString();
		}
	}
};

//全局函数 - flash
var flash = global.flash = {init:function(name,op){var option = {wmode:"opaque", width:300, height:300, flashvars:"", flashUrl:""}; if(typeof op == "object"){if (typeof op.wmode != "undefined"){switch(op.wmode.toLowerCase()){case "opaque": option.wmode = "opaque"; break; case "window": option.wmode = "window"; break; case "transparent": option.wmode = "transparent"; break; } option.wmode = op.wmode; } typeof op.width != "undefined"? option.width = op.width:""; typeof op.height != "undefined"? option.height = op.height:""; typeof op.flashvars != "undefined"? option.flashvars = op.flashvars:""; typeof op.flashUrl != "undefined"? option.flashUrl = op.flashUrl:""; } if(option.flashUrl === ""){ return; } var writeHTML =['<object id="object_' + name + '" name="' + name + '" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=10.0.32" width="' + option.width + '" height="' + option.height + '">', '<param name="movie" value="' + option.flashUrl + '" />', '<param name="flashvars" value="' + option.flashvars + '" />', '<param name="quality" value="high" />', '<param name="allowscriptaccess" value="always" />', '<param name="wmode" value="' + option.wmode + '"/>', '<embed id="embed_'+ name +'" src="' + option.flashUrl + '" width="' + option.width + '"  height="' + option.height + '" allowscriptaccess="always" quality="high" pluginspage="http://www.macromedia.com/go/getflashplayer" flashvars="' + option.flashvars + '" type="application/x-shockwave-flash" wmode="'+ option.wmode +'"></embed>', '</object>'].join(""); return writeHTML; }, write:function(name,op){var writeHTML = this.init(name,op); if(writeHTML){document.write(writeHTML); } }, add:function(target,name,op){var innerHTML = this.init(name,op); if(!target){ return; } if(innerHTML){target.innerHTML= innerHTML; } }, ctrl:function(name){var dc = document, embedElm = dc.getElementById("embed_" + name), objectElm = dc.getElementById("object_" + name); if(navigator.appName.indexOf("Microsoft") == -1){if(!embedElm){ return; } return embedElm; } else {if(!objectElm){ return; } return objectElm; } } };

// 全局函数 - JSON
var JSON = global.JSON = function() {function f(n) {return n < 10 ? '0' + n: n; } Date.prototype.toJSON = function() {return this.getUTCFullYear() + '-' + f(this.getUTCMonth() + 1) + '-' + f(this.getUTCDate()) + 'T' + f(this.getUTCHours()) + ':' + f(this.getUTCMinutes()) + ':' + f(this.getUTCSeconds()) + 'Z'; }; var m = {'\b': '\\b', '\t': '\\t', '\n': '\\n', '\f': '\\f', '\r': '\\r', '"': '\\"', '\\': '\\\\'}; function stringify(value, whitelist) {var a, i, k, l, r = /["\\\x00-\x1f\x7f-\x9f]/g, v; switch (typeof value) {case 'string': return r.test(value) ? '"' + value.replace(r, function(a) {var c = m[a]; if (c) {return c; } c = a.charCodeAt(); return '\\u00' + Math.floor(c / 16).toString(16) + (c % 16).toString(16); }) + '"': '"' + value + '"'; case 'number': return isFinite(value) ? String(value) : 'null'; case 'boolean': case 'null': return String(value); case 'object': if (!value) {return 'null'; } if (typeof value.toJSON === 'function') {return stringify(value.toJSON()); } a = []; if (typeof value.length === 'number' && !(value.propertyIsEnumerable('length'))) {l = value.length; for (i = 0; i < l; i += 1) {a.push(stringify(value[i], whitelist) || 'null'); } return '[' + a.join(',') + ']'; } if (whitelist) {l = whitelist.length; for (i = 0; i < l; i += 1) {k = whitelist[i]; if (typeof k === 'string') {v = stringify(value[k], whitelist); if (v) {a.push(stringify(k) + ':' + v); } } } } else {for (k in value) {if (typeof k === 'string') {v = stringify(value[k], whitelist); if (v) {a.push(stringify(k) + ':' + v); } } } } return '{' + a.join(',') + '}'; } } return {stringify: stringify, parse: function(text, filter) {var j; function walk(k, v) {var i, n; if (v && typeof v === 'object') {for (i in v) {if (Object.prototype.hasOwnProperty.apply(v, [i])) {n = walk(i, v[i]); if (n !== undefined) {v[i] = n; } else {delete v[i]; } } } } return filter(k, v); } if (/^[\],:{}\s]*$/.test(text.replace(/\\["\\\/bfnrtu]/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {j = eval('(' + text + ')'); return typeof filter === 'function' ? walk('', j) : j; } throw new SyntaxError('parseJSON'); } }; }();

//判断是否数组
function isArray(obj){
	return /Array/.test(Object.prototype.toString.call(obj));
}

//对象克隆
function clone(obj){
	if(typeof(obj) != 'object' || obj === null){
		return obj;
	}
	
	var r = Array.prototype.splice === obj.splice?[]:{};
	for(var i in obj){
		if(obj.hasOwnProperty(i)){
			r[i] = clone(obj[i]);

		}
	}
	
	return r;
}

function isEqual(o1,o2){
	if(typeof o1 != typeof o2){
		return false;
	}

	var same = true;

	!function doit(o1,o2){
		

		if(!same || typeof o1 != typeof o2){
			same = false;
			return false;
		}


		switch(typeof o1){
			case "object":
				var key;
				if(o1 === null || o2 === null){
					if(o1 !== o2){
						same = false;
						return false;
					}

				} else {
					for(key in o1){
						if(o1.hasOwnProperty(key)){
							if(!same || doit(o1[key],o2[key]) === false){
								return false;
							}
							
						}
					}
				}
				
				break;

			case "function":
				if(o1.toString() !== o2.toString()){
					same = false;
					return false;
				}
				break;

			case "string":
			case "number":
				if(o1 !== o2){
					same = false;
					return false;
				}
				break;

			default:
				if(o1 !== o2){
					same = false;
					return false;
				}
				break;
		}
	}(o1,o2);

	return same;
}

/* 获取 元素所在的dom 最上层的 z-index */
function getTopperZIndex(o){
	var check = function(str){
			return str == "auto"? 1: str;
		},
		r,
		p = o,
		myPosition;

	while(p){
		myPosition = $(p).css("position");

		if(/fixed/.test(myPosition)){
			r = check($(p).css("z-index"));
			break;

		} else if(/relative|absolute/.test(myPosition)){
			r = check($(p).css("z-index"));

		}

		p = p.offsetParent;
	}

	return Number(r);
}

function getCssProperty(cssProperty){
	var firstLetter = cssProperty.substr(0,1),
		otherStrs = cssProperty.substr(1),
		fUpperStrs = firstLetter.toUpperCase() + otherStrs,
		fLowerStrs = firstLetter.toLowerCase() + otherStrs,
		privateAttrs = [
			fLowerStrs,
			"Webkit" + fUpperStrs,
			"Moz" + fUpperStrs,
			"O" + fUpperStrs,
			"Ms" + fUpperStrs
		],
		style = document.documentElement.style;
	for(var i = 0, len = privateAttrs.length; i < len; i++){
		var fCssAttr = privateAttrs[i];
		if(fCssAttr in style){
			return fCssAttr;
		}
	}
	return null;
}

function stopBubble(e){
	e = e || window.event;
	e.stopPropagation && e.stopPropagation();
	e.cancelBubble = true;
}

//内部函数 - 弹出层
function bsPopup(type, op) {
	var me = bsPopup;

	if(!document.body){
		me.readyKey = setTimeout(function(){
			me(type,op);
		},200);
		return;
	}

	if(!me.myScroll){
		document.body.scrollTop += 1;
		document.documentElement.scrollTop += 1;

		if(document.body.scrollTop){
			me.myScroll = document.body;
		} else {
			me.myScroll = document.documentElement;
		}

		me.TransKey = getCssProperty("transition");
		me.queue = [];
	}


	var dc = document,
		option = {
			//标题
			title: "温馨提示",
			//内容
			content: "",
			//显示时间
			timeout: 2000,
			//必须先确认
			mustConfirm: false,
			//回调函数
			callback: function() {},
			//取消操作的时候回调的函数
			cancelCallback: function() {},

			//加载完成时候
			onload:function(){},

			type:"normal",

			width:"",
			height:"auto",
			zIndex:global.Config.popup.zIndex,

			//默认显示
			show:true,

			//是否置顶
			top:false,

			//允许调整宽高
			resize:global.Config.popup.resize,

			//允许最小化
			minimize:global.Config.popup.minimize,

			//弹窗默认显示状态：normal|max
			sizingType:"normal",

			//是否显示关闭按钮
			close:true,

			//loading 用参数
			overtime: 8000,
			delay: 1000,
			appendTarget: document.body,
			onovertime: function() {}

		},
		paramInit = function(o){
			o = o || {};
			var limitType;
			for(var key in o){
				if(o.hasOwnProperty(key)){
					limitType = "";
					switch(key){
						case "title":
						case "sizingType":
						case "type": limitType = "string"; break;

						case "content": limitType = "object|string"; break;

						case "timeout":
						case "overtime": limitType = "number"; break;

						case "callback":
						case "cancelCallback":
						case "onload":
						case "onovertime": limitType = "function"; break;

						case "width":
						case "height":
						case "zIndex": limitType = "string|number"; break;

						case "resize":
						case "minimize":
						case "top":
						case "close":
						case "show": limitType = "boolean"; break;

						case "appendTarget": limitType = "object"; break;


						default : break;
					}
					limitType && limitType.indexOf(typeof o[key]) != -1 && (option[key] = o[key]);
				}
			}
		},
		popConfig = function(t){
			var classConfig = {
					"popup":"bs_pop"
				},
				idConfig = {
					"popup":"",
					"content":"Cnt",
					"head":"Hd",
					"body":"Body",
					"title":"Tl",
					"status":"Status",
					"close":"Close",
					"maximi":"Maximi",
					"mini":"Mini",
					"okBtn":"OkBtn",
					"cancelBtn":"CancelBtn",
					"foot":"Foot",
					"resizeL":"resizeL",
					"resizeB":"resizeB",
					"resizeR":"resizeR",
					"resizeRb":"resizeRb",
					"resizeLb":"resizeLb",
					"resizeArea":"resizeArea"
				},
				htmlRebuild = function(type){
					
					switch(type){
						case "confirm":
							return [
								'<div class="bs_pop_hd" id="'+ idConfig.head +'">',
									'<h3 class="h_tl" id="'+ idConfig.title +'"></h3>',
									'<div class="h_ctrl">',
										'<a href="javascript:;" class="mini" id="'+ idConfig.mini +'">mini</a>',
										'<a href="javascript:;" class="maximi" id="'+ idConfig.maximi +'">maximi</a>',
										'<a href="javascript:;" class="close" id="'+ idConfig.close +'">CLOSE</a>',
									'</div>',
								'</div>',
								'<div class="bs_pop_resize">',
									'<i class="bs_pop_resize_l" id="'+ idConfig.resizeL +'"></i>',
									'<i class="bs_pop_resize_b" id="'+ idConfig.resizeB +'"></i>',
									'<i class="bs_pop_resize_r" id="'+ idConfig.resizeR +'"></i>',
									'<i class="bs_pop_resize_lb" id="'+ idConfig.resizeLb +'"></i>',
									'<i class="bs_pop_resize_rb" id="'+ idConfig.resizeRb +'"></i>',

									'<div class="bs_pop_bd" id="'+ idConfig.body +'">',
										'<div class="bs_pop_bd_cnt" id="'+ idConfig.content +'"></div>',
									'</div>',
									'<div class="bs_pop_ft" id="'+ idConfig.foot +'">',
										'<a href="javascript:;" class="bs_btn_s01 bs_btn_small" id="'+ idConfig.okBtn +'"><span>确定</span></a>',
										'<a href="javascript:;" class="bs_btn_s03 bs_btn_small" id="'+ idConfig.cancelBtn +'"><span>取消</span></a>',
									'</div>',
								'</div>',
								'<div class="bs_pop_resize_area" id="'+ idConfig.resizeArea +'" style="display:none;"></div>',
								'<iframe class="bs_pop_if" frameborder="0"></iframe>'
							].join("");

						case "loading":
							return [
								'<div class="bs_loading_icon"></div>',
								'<a href="javascript:;" class="close" id="'+ idConfig.close +'">CLOSE</a>',
								'<div class="bs_pop_bd" id="'+ idConfig.content +'"></div>',
								'<iframe class="bs_pop_if" frameborder="0"></iframe>'
							].join("");

						case "normal":
						case "alert":
							
							return [
								'<div class="bs_pop_hd" id="'+ idConfig.head +'">',
									'<h3 class="h_tl" id="'+ idConfig.title +'"></h3>',
									'<div class="h_ctrl">',
										'<a href="javascript:;" class="mini" id="'+ idConfig.mini +'">mini</a>',
										'<a href="javascript:;" class="maximi" id="'+ idConfig.maximi +'">maximi</a>',
										'<a href="javascript:;" class="close" id="'+ idConfig.close +'">CLOSE</a>',
									'</div>',
								'</div>',
								'<div class="bs_pop_resize">',
									'<i class="bs_pop_resize_l" id="'+ idConfig.resizeL +'"></i>',
									'<i class="bs_pop_resize_b" id="'+ idConfig.resizeB +'"></i>',
									'<i class="bs_pop_resize_r" id="'+ idConfig.resizeR +'"></i>',
									'<i class="bs_pop_resize_lb" id="'+ idConfig.resizeLb +'"></i>',
									'<i class="bs_pop_resize_rb" id="'+ idConfig.resizeRb +'"></i>',

									'<div class="bs_pop_bd" id="'+ idConfig.body +'">',
										'<div class="bs_pop_status" id="'+ idConfig.status +'"></div>',
										'<div class="bs_pop_bd_cnt" id="'+ idConfig.content +'"></div>',
									'</div>',
								'</div>',
								'<div class="bs_pop_resize_area" id="'+ idConfig.resizeArea +'" style="display:none;"></div>',
								'<iframe class="bs_pop_if" frameborder="0"></iframe>'
							].join("");

						case "error":
						case "success":
							
							return [
								'<div class="bs_pop_hd" id="'+ idConfig.head +'">',
									'<h3 class="h_tl" id="'+ idConfig.title +'"></h3>',
									'<div class="h_ctrl">',
										'<a href="javascript:;" class="mini" id="'+ idConfig.mini +'">mini</a>',
										'<a href="javascript:;" class="maximi" id="'+ idConfig.maximi +'">maximi</a>',
										'<a href="javascript:;" class="close" id="'+ idConfig.close +'">CLOSE</a>',
									'</div>',
								'</div>',
								'<div class="bs_pop_resize">',
									'<i class="bs_pop_resize_l" id="'+ idConfig.resizeL +'"></i>',
									'<i class="bs_pop_resize_b" id="'+ idConfig.resizeB +'"></i>',
									'<i class="bs_pop_resize_r" id="'+ idConfig.resizeR +'"></i>',
									'<i class="bs_pop_resize_lb" id="'+ idConfig.resizeLb +'"></i>',
									'<i class="bs_pop_resize_rb" id="'+ idConfig.resizeRb +'"></i>',

									'<div class="bs_pop_bd" id="'+ idConfig.body +'">',
										'<div class="bs_pop_status" id="'+ idConfig.status +'"></div>',
										'<div class="bs_pop_bd_cnt" id="'+ idConfig.content +'"></div>',
									'</div>',
									'<div class="bs_pop_ft" id="'+ idConfig.foot +'">',
										'<a href="javascript:;" class="bs_btn_s03 bs_btn_small" mod-init="true" id="'+ idConfig.okBtn +'"><span>确定</span></a>',
									'</div>',
								'</div>',
								'<div class="bs_pop_resize_area" id="'+ idConfig.resizeArea +'" style="display:none;"></div>',
								'<iframe class="bs_pop_if" frameborder="0"></iframe>'
							].join("");

						

						default: 
							return [
								'<div class="bs_pop_hd" id="'+ idConfig.head +'">',
									'<h3 class="h_tl" id="'+ idConfig.title +'"></h3>',
									'<div class="h_ctrl">',
										'<a href="javascript:;" class="mini" id="'+ idConfig.mini +'">mini</a>',
										'<a href="javascript:;" class="maximi" id="'+ idConfig.maximi +'">maximi</a>',
										'<a href="javascript:;" class="close" id="'+ idConfig.close +'">CLOSE</a>',
									'</div>',
								'</div>',
								'<div class="bs_pop_resize">',
									'<i class="bs_pop_resize_l" id="'+ idConfig.resizeL +'"></i>',
									'<i class="bs_pop_resize_b" id="'+ idConfig.resizeB +'"></i>',
									'<i class="bs_pop_resize_r" id="'+ idConfig.resizeR +'"></i>',
									'<i class="bs_pop_resize_lb" id="'+ idConfig.resizeLb +'"></i>',
									'<i class="bs_pop_resize_rb" id="'+ idConfig.resizeRb +'"></i>',

									'<div class="bs_pop_bd" id="'+ idConfig.body +'">',
										'<div class="bs_pop_status" id="'+ idConfig.status +'"></div>',
										'<div class="bs_pop_bd_cnt" id="'+ idConfig.content +'"></div>',
									'</div>',
								'</div>',
								'<div class="bs_pop_resize_area" id="'+ idConfig.resizeArea +'" style="display:none;"></div>',
								'<iframe class="bs_pop_if" frameborder="0"></iframe>'
							].join("");

					}
				},

				frontName = "bsPop",
				html = "",
				key;

			switch(t){
				case "confirm":
					frontName += "Confirm";
					break;

				case "loading":
					frontName += "Loading";
					classConfig.popup += " bs_pop_loading";
					break;

				case "error":
					frontName += "Status";
					classConfig.popup += " bs_pop_error";
					break;

				case "success":
					frontName += "Status";
					classConfig.popup += " bs_pop_success";
					break;

				case "normal":
				case "alert":
					frontName += "Normal";
					break;

				default:
					frontName = t;
					break;
				
			}

			for(key in idConfig){
				if(idConfig.hasOwnProperty(key)){
					idConfig[key] = frontName + idConfig[key];
				}
				
			}

			return {
				"className":classConfig,
				"id":idConfig,
				"html":htmlRebuild(t)
			};
		},

		queueIt = function(){
			if(me.queue.length === 0 || (me.queue[me.queue.length - 1] === popup && popup.style.zIndex === me.queue.maxZ)){
				return;
			}
			var fs,i,len;
			i = me.queue.indexOf(popup);

			i != -1 && me.queue.splice(i,1);

			me.queue.push(popup);


			for(i = 0, len = me.queue.length; i < len; i++){
				fs = me.queue[i];
				fs.style.zIndex = fs.isTop? option.zIndex + (i + me.queue.length) * 10 : option.zIndex + i * 10;
				i === len - 1 && (me.queue.maxZ = fs.style.zIndex);
			}
		},

		//调整大小用区域 初始化
		resizeAreaInit = function(e,type){
			e = e || window.event;

			var rArea = popup.srcResizeArea,
				colResize = false,
				rowResize = false,
				isLeft = false,
				rWidth = 0,
				rHeight = 0;

			if(!rArea){
				return;
			}

			if(typeof rArea.borderColWidth == "undefined"){
				rArea.borderColWidth = (parseInt($(popup).css("border-left-width"),10) || 0) + (parseInt($(popup).css("border-top-width"),10) || 0);

				rArea.borderRowWidth = (parseInt($(popup).css("border-top-width"),10) || 0) + (parseInt($(popup).css("border-bottom-width"),10) || 0);
			}

			rWidth = parseInt(popup.style.width,10);
			rHeight = popup.offsetHeight - rArea.borderRowWidth;

			rArea.style.display = "";

			rArea.style.width = rWidth + "px";
			rArea.style.height = rHeight + "px";

			rArea.style.left = rArea.style.right = rArea.style.top = rArea.style.bottom = "auto";
			
			rArea.posX = e.clientX;
			rArea.posY = e.clientY;

			switch(type){
				case "left":
					rArea.style.right = rArea.style.top = 0;
					rArea.style.cursor = "w-resize";
					colResize = true;
					isLeft = true;
					break;

				case "left-bottom":
					rArea.style.right = rArea.style.top = 0;
					rArea.style.cursor = "sw-resize";
					colResize = rowResize = true;
					isLeft = true;
					break;

				case "right-bottom":
					rArea.style.left = rArea.style.top = 0;
					rArea.style.cursor = "se-resize";
					colResize = rowResize = true;
					break;

				case "right":
					rArea.style.left = rArea.style.top = 0;
					rArea.style.cursor = "e-resize";
					colResize = true;
					break;

				case "bottom":
					rArea.style.left = rArea.style.top = 0;
					rArea.style.cursor = "s-resize";
					rowResize = true;
					break;

			}

			document.onmousemove = function(e){
				e = e || window.event;

				var myWidth = rWidth + (isLeft? rArea.posX - e.clientX : e.clientX - rArea.posX),
					myHeight = rHeight +  e.clientY - rArea.posY;

				myWidth < 180 && (myWidth = 180);
				myHeight < 100 && (myHeight = 100);

				myWidth > document.documentElement.clientWidth - rArea.borderColWidth && (myWidth = document.documentElement.clientWidth - rArea.borderColWidth);
				myHeight > document.documentElement.clientHeight - rArea.borderRowWidth && (myHeight = document.documentElement.clientHeight - rArea.borderRowWidth);

				colResize && (rArea.style.width = myWidth + "px");
				rowResize && (rArea.style.height = myHeight + "px");

				window.getSelection && window.getSelection().removeAllRanges();
				document.selection && document.selection.empty();
				e.preventDefault && e.preventDefault();
				e.returnValue = false;
			};

			window.onblur = window.onlosecapture = document.onmouseup = function(){
				colResize && (popup.style.width = rArea.style.width);

				rowResize && popup.srcBody && (popup.srcBody.style.height = rArea.offsetHeight - (popup.offsetHeight - popup.srcBody.offsetHeight) + "px");

				rArea.style.display = "none";
				popup.fixed();
				window.onblur = window.onlosecapture = document.onmouseup = document.onmousemove = null;
			};
		},
		
		checkTarget = arguments.length == 1? type:op,
		popup, bg,myConfig, myId,
		i,len, fs, isSame = false;

	clearTimeout(me.readyKey);
	

	if(typeof checkTarget === "string"){
		option.content = checkTarget;

	} else if(typeof checkTarget === "object") {
		paramInit(checkTarget);
	}

	if(arguments.length == 2 && typeof type == "string"){
		option.type = type;
	}

	
	myConfig = popConfig(option.type);
	popup = $("#" + myConfig.id.popup)[0];
	if(!popup){
		popup = dc.createElement("div");
		popup.className = myConfig.className.popup;
		popup.id = myConfig.id.popup;
		popup.innerHTML = myConfig.html;

		popup.posX = popup.posY = 0;
		popup.myLeft = popup.myTop = NaN;

		popup.hide = function(param) {
			var that = this;
			clearTimeout(that.timeoutKey);
			$(that).removeClass("bs_pop_cur");

			popup.myLeft = popup.myTop = NaN;

			document.onmousemove = document.onmouseup = document.onselectstart = null;
			
			that.srcBg && that.srcBg.hide();

			that.srcHideCallback && that.srcHideCallback(param);
		};

		popup.fixed = function(){
			if(popup.sizingType == "max"){
				popup.style.width = popup.style.width = document.documentElement.clientWidth - (popup.offsetWidth - popup.srcHead.offsetWidth) + "px";
				//popup.srcBody && (popup.srcBody.style.height = document.documentElement.clientHeight - popup.srcHead.offsetHeight - 2 - (popup.srcFoot? popup.srcFoot.offsetHeight : 0) - popup.srcResizeB.offsetHeight + "px");
				popup.srcBody && (popup.srcBody.style.height = document.documentElement.clientHeight - (popup.offsetHeight - popup.srcBody.offsetHeight) + "px");
			}

			var that = this,
				extTop = window.Config.page.reset? 0: (UA.ie && UA.ie <= 6? me.myScroll.scrollTop: 0),
				extLeft = window.Config.page.reset? 0: (UA.ie && UA.ie <= 6? me.myScroll.scrollLeft: 0),

				limitLeft = extLeft,
				limitRight = extLeft + document.documentElement.clientWidth - popup.offsetWidth,

				limitTop = extTop,
				limitBottom = extTop + document.documentElement.clientHeight - popup.offsetHeight,

				myLeft = !isNaN(popup.myLeft)? (
					extLeft + popup.myLeft
				) : (
					extLeft + (document.documentElement.clientWidth - popup.offsetWidth) / 2
				),
				myTop = !isNaN(popup.myTop)? (
					extTop + popup.myTop
				) : (
					extTop +  (document.documentElement.clientHeight - popup.offsetHeight) / 2
				);

			
			
			//位置判断
			myLeft > limitRight && (myLeft = limitRight);
			myLeft < limitLeft && (myLeft = limitLeft);
			myTop > limitBottom && (myTop = limitBottom);
			myTop < limitTop && (myTop = limitTop);
			
			popup.style.left = myLeft + "px";
			popup.style.top = myTop + "px";

		};

		popup.sizingChange = function(type){
			switch(type){
				case "max":
				$(popup.srcMaximi).removeClass("maximi").addClass("reduce");

				if(!document.documentElement.clientWidth){
					break;
				}

				popup.style.width = popup.style.width = document.documentElement.clientWidth - 2 + "px";
				popup.srcBody && (popup.srcBody.style.height = document.documentElement.clientHeight - popup.srcHead.offsetHeight - 2 - (popup.srcFoot? popup.srcFoot.offsetHeight : 0) + "px");

				popup.myLeft = popup.myTop = NaN;

				popup.sizingType = "max";
				break;

				case "mini":
				break;
				//..
				case "reduce":
				$(popup.srcMaximi).removeClass("reduce").addClass("maximi");
				popup.style.width = !isNaN(option.width) && option.width !== "" ? option.width + "px" : option.width;
				popup.srcBody && (popup.srcBody.style.height = !isNaN(option.height) && option.height !== ""  ? option.height + "px" : option.height);

				popup.myLeft = popup.myTop = NaN;

				popup.sizingType = "reduce";

				//..
				break;

			}
			me.TransKey && (popup.style[me.TransKey] = "none");
			popup.fixed();
			me.TransKey && (popup.style[me.TransKey] = "");
		};

		if(option.type == "loading"){
			popup.srcDelay = option.mustConfirm ? 0 : option.delay;
			popup.srcOvertime = option.overtime;
			popup.srcOnovertime = option.onovertime;

			popup.show = function(){
				var that = this;
				clearTimeout(that.timeoutKey);
				


				that.timeoutKey = setTimeout(function(){
					that.srcBg && that.srcBg.show();
					$(that).addClass("bs_pop_cur");
					that.fixed();
					that.offsetHeight && that.focus();

					if (that.srcOvertime) {
						clearTimeout(that.overtimeKey);
						that.overtimeKey = setTimeout(function() {
							that.srcOnovertime();
						}, that.srcOvertime);
					}

					setTimeout(function(){
						queueIt();
					},10);

					that.srcShowCallback && that.srcShowCallback();

				},popup.srcDelay);

			};

		} else {

			popup.show = function(){
				var that = this;
				that.srcBg && that.srcBg.show();

				option.appendTarget.appendChild(that);
				$(that).addClass("bs_pop_cur");
				that.offsetHeight && that.focus();
				that.fixed();
				clearTimeout(this.aniKey);
				queueIt();
				this.aniKey = setTimeout(function(){
					if(option.type == "confirm"){
						popup.srcOkBtn.focus();
					} else {
						popup.srcClose.offsetHeight && popup.srcClose.focus();
					}
					queueIt();
				},200);
				switch(option.sizingType){
					case "max":
						that.sizingChange("max");
						break;
					case "normal":
						that.sizingChange("reduce");
						break;
					default:
						that.sizingChange("reduce");
						break;
				}
				
				
				that.srcShowCallback && that.srcShowCallback();
			};
		}


		option.appendTarget.appendChild(popup);
		

		popup.srcClose = $("#" + myConfig.id.close)[0];
		popup.srcMaximi = $("#" + myConfig.id.maximi)[0];
		popup.srcMini = $("#" + myConfig.id.mini)[0];
		popup.srcTitle = $("#" + myConfig.id.title)[0];
		popup.srcContent = $("#" + myConfig.id.content)[0];
		popup.srcHead = $("#" + myConfig.id.head)[0];
		popup.srcBody = $("#" + myConfig.id.body)[0];
		popup.srcFoot = $("#" + myConfig.id.foot)[0];

		popup.srcResizeL = $("#" + myConfig.id.resizeL)[0];
		popup.srcResizeR = $("#" + myConfig.id.resizeR)[0];
		popup.srcResizeB = $("#" + myConfig.id.resizeB)[0];
		popup.srcResizeLb = $("#" + myConfig.id.resizeLb)[0];
		popup.srcResizeRb = $("#" + myConfig.id.resizeRb)[0];
		popup.srcResizeArea = $("#" + myConfig.id.resizeArea)[0];

		popup.srcDelay = option.delay;
		popup.type = option.type;

		$(popup.srcClose).bind("click",function(e){

			popup.hide();
			stopBubble(e);
		});

		$(popup.srcMaximi).bind("click",function(e){
			popup.srcMaximi.className.indexOf("maximi") != -1? popup.sizingChange("max"): popup.sizingChange("reduce");
			stopBubble(e);
		});

		$(popup.srcMini).bind("click",function(e){
			$(popup.srcClose).trigger("click");
		});

		$(popup.srcClose).bind("keydown",function(e){
			e = e || window.event;
			if(e.keyCode == 27 || e.keyCode == 32){
				popup.hide();
			}
		});

		$(popup.srcHead).bind("mousedown",function(e){
			e = e || window.event;
			
			me.TransKey && (popup.style[me.TransKey] = "none");


			popup.posX = e.clientX - (parseFloat(popup.style.left) || 0);
			popup.posY = e.clientY - (parseFloat(popup.style.top) || 0);



			document.onselectstart = function(){return false;};
			document.onmousemove = function(e){
				e = e || window.event;

				var myLeft = e.clientX - popup.posX,
					myTop = e.clientY - popup.posY,
					extTop = UA.ie && UA.ie <= 6? me.myScroll.scrollTop: 0,
					extLeft = UA.ie && UA.ie <= 6? me.myScroll.scrollLeft: 0;
					

				popup.myLeft = myLeft - extLeft;
				popup.myTop = myTop - extTop;

				

				popup.fixed();

				window.getSelection && window.getSelection().removeAllRanges();
				document.selection && document.selection.empty();
				e.preventDefault && e.preventDefault();
				e.returnValue = false;

				return false;
			};

			window.onblur = window.onlosecapture = document.onmouseup = function(){
				me.TransKey && (popup.style[me.TransKey] = "");
				document.onmousemove = document.onmouseup = document.onselectstart = null;

				return false;
			};

			queueIt();

			e.preventDefault && e.preventDefault();
			e.returnValue = false;
		});

		$(popup.srcBody).bind("scroll",function(){
			$(window).trigger("scroll");
		});
		
		//拖放 左
		$(popup.srcResizeL).bind("mousedown",function(e){
			resizeAreaInit(e,'left');
		});

		//拖放 右
		$(popup.srcResizeR).bind("mousedown",function(e){
			resizeAreaInit(e,'right');
		});

		//拖放 下
		$(popup.srcResizeB).bind("mousedown",function(e){
			resizeAreaInit(e,'bottom');
		});

		//拖放 左下
		$(popup.srcResizeLb).bind("mousedown",function(e){
			resizeAreaInit(e,'left-bottom');
		});

		//拖放 右下
		$(popup.srcResizeRb).bind("mousedown",function(e){
			resizeAreaInit(e,'right-bottom');
		});

		$(window).bind("resize",popup.fixed);
		UA.ie && UA.ie <= 6 && $(window).bind("scroll",popup.fixed);

		switch(option.type){
			case "confirm":
				popup.srcOkBtn = $("#" + myConfig.id.okBtn)[0];
				popup.srcCancelBtn = $("#" + myConfig.id.cancelBtn)[0];

				$(popup.srcCancelBtn).bind("keydown",function(e) {
					if (e.keyCode == 9) {
						e.preventDefault && e.preventDefault();
						e.returnValue = false;
						popup.srcOkBtn.focus();

					}
				});

				popup.srcOkBtn.onkeydown = function(e){
					e = e || window.event;
					if(e.keyCode == 27 || e.keyCode == 32){
						popup.hide();
					}
				};

				popup.srcOkBtn.onclick = function() {
					popup.hide(true);
				};

				popup.srcCancelBtn.onclick = function() {
					popup.hide();
				};

				break;

			case "loading":
				break;

			case "normal":
				break;

			case "success":
			case "error":
				popup.srcOkBtn = $("#" + myConfig.id.okBtn)[0];
				
				popup.srcOkBtn.onclick = function() {
					popup.hide();
				};

				break;
			
				

			default:
				break;
		}

		me.queue.push(popup);
	}

	if(/normal|alert|error|success/g.test(type) && option.timeout){
		option.minimize = false;
		option.resize = false;
	}
	!option.close && popup.srcClose && (popup.srcClose.style.display = "none");
	!option.resize && popup.srcMaximi && (popup.srcMaximi.style.display = "none");
	!option.minimize && popup.srcMini && (popup.srcMini.style.display = "none");

	switch(option.type){
		case "confirm":
			
			popup.srcShowCallback = function(){
				var that = this;
				that.srcOkBtn.focus();
				option.onload.call(that);
			};

			popup.srcHideCallback = function(success){
				var that = this;
				success? 
					option.callback.call(that)
				:
					option.cancelCallback.call(that)
				;
			};


			break;

		case "loading":

			popup.srcDelay = (option.mustConfirm ? 0 : 1000);
			popup.srcOvertime = option.overtime;
			popup.srcOnovertime = option.onovertime;

			popup.srcShowCallback = function(){
				var that = this;
				clearTimeout(that.timeoutKey);
				that.timeoutKey = setTimeout(function() {
					dc.body.appendChild(that);
					that.style.marginLeft = -that.offsetWidth / 2 + "px";
					that.style.marginTop = -that.offsetHeight / 2 + "px";
					$(that).addClass("bs_pop_cur");
					if (that.srcOvertime) {
						clearTimeout(that.overtimeKey);
						that.overtimeKey = setTimeout(function() {
							that.srcOnovertime();
						}, that.srcOvertime);
					}
					
					option.onload && option.onload.call(that);
				}, that.srcDelay);
			};
			break;


		case "normal":
		case "error":
		case "success":
			popup.srcShowCallback = function(){
				var that = this;
				option.onload.call(that);
				clearTimeout(that.timeoutKey);

				if(option.timeout > 0){
					that.timeoutKey = setTimeout(function(){
						that.hide();
					},option.timeout);
				}
			};

			popup.srcHideCallback = function(){
				var that = this;
				option.callback.call(that);
			};

			break;

		default:
			popup.srcShowCallback = function(){
				var that = this;
				option.onload.call(that);
			};

			popup.srcHideCallback = function(){
				var that = this;

				option.callback.call(that);
			};

			break;

	}

	

	if(option.mustConfirm){
		bg = $("#bsPopBg")[0];
		if(!bg){
			bg = dc.createElement("div");
			bg.className = "bs_pop_bg";
			bg.id = "popupBg";
			bg.show = function() {
				this.style.visibility = "visible";
			};
			bg.hide = function() {
				this.style.visibility = "hidden";
			};
			bg.onclick = function() {
				var _this = this;
				clearTimeout(this.timeoutKey);
				$(this.srcPopup).addClass("bs_pop_animate");
				this.timeoutKey = setTimeout(function() {
					$(_this.srcPopup).removeClass("bs_pop_animate");
				}, 1000);

			};

			dc.body.appendChild(bg);
		}
	}

	if(popup.srcTitle){
		popup.srcTitle.innerHTML = option.title;
		popup.srcTitle.style.display = (option.title === ""?"none":"");
	}
	popup.className = myConfig.className.popup;

	//是否置顶处理
	popup.isTop = option.top;

	popup.style.width = !isNaN(option.width) && option.width !== "" ? option.width + "px" : option.width;
	popup.srcBody && (popup.srcBody.style.height = !isNaN(option.height) && option.height !== ""  ? option.height + "px" : option.height);
	

	popup.style.zIndex = option.zIndex;
	if((typeof option.content == "object" && option.content.nodeType == 1) || (typeof option.content == "string" && /^[a-z\.#]/ig.test(option.content) && $(option.content).length > 0)){
		$(option.content).show();
		$(popup.srcContent).append($(option.content));
	} else {
		popup.srcContent.innerHTML = option.content;
	}

	//判断是否可调整宽度
	if(option.resize){
		$(popup.srcResizeL).parent().removeClass("bs_pop_resize_disable");
	} else {
		$(popup.srcResizeL).parent().addClass("bs_pop_resize_disable");
	}

	
	option.show && popup.show();
	

	return popup;
}


function makeFunction(str,type){
	if(/function|object/.test(typeof str) || (type != "function" && type != "object" && type != "reg" && typeof str == "string")){
		return function(){ return str;}();
	
	} else {
		var fn;
		try{
			fn = new Function("try{return "+ str +"} catch(er){return undefined}");
		} catch(er){
			fn = function(){};
		}
	return type == "function"? fn:fn();
	}
}

function isNaNFn(fn){
	if(typeof fn == "function"){
		return fn.toString().replace(" ","") === "function(){}";
	} else {
		return true;
	}
}

function getPosition(target,cw){
	cw = cw || window;

	var dc = document,
		fparent = target,
		acc = target.getBoundingClientRect(),
		_x = fparent.offsetLeft,
		_y = fparent.offsetTop;

	while(fparent.offsetParent){
		fparent = fparent.offsetParent;
		_x += fparent.offsetLeft;
		_y += fparent.offsetTop;
	}

	return{
		left:_x,
		top:_y,
		right:document.body.scrollLeft + acc.right,
		bottom:document.body.scrollTop + acc.bottom
	};
}

var tplParse = global.tplParse = function(obj,str){
	if(!str){return "";}

	//替换变量
	var var2Str = function(r){
		return r.replace(/\$\w+/g,function(t){
			var attr = t.replace("$",""),
				r = obj[attr] || "";
			
			
			return typeof r == "number"
                ? r
                : '"' + r.replace(/["]/g,'\\"').replace(/\r|\n/g,"") + '"';
		
		}).replace(/return\s".+?";/g,function(t){
			return [
				'return "',
				t.replace(/^return\s"/g,"").replace(/";$/g,"").replace(/[^\\]"/g,function(w){
					
					return w.substr(0,1) + '\\"';
				}),
				'";'
			].join("");
		
		});
	};

	//普通变量
	return str.replace(/[{]\$[^{}]*\}/g,function(t){
		var attr = t.replace("{$",'').replace("}",''),
			r = obj[attr] || "";

		return typeof r == 'number'
            ? r
            : r.replace(/\r|\n/,'');

	// js 方法执行 模板 {js:: xx}
	}).replace(/\{js::[^{}]*\}/g,function(t){
		var r = t.replace("{js::",'').replace("}",'');
		try{
			return new Function('try{return ' + var2Str(r) + ';}catch(er){return "";}')();
		} catch(er){
			return "";
		}
		

	// if else 模板 {if xx} xx {else if xx} xx {else} xx {/if}
	// 必须最后替换，否则会被其他替换规则影响
	}).replace(/\{if.+?\{\/if\}/g,function(str){

		// if
		var r = str.replace(/\{if\s[^{}]*\}/g,function(t){
			return 'if('+ t.replace("{if ",'').replace("}",'') +'){';
		// else if
		}).replace(/\{else\sif\s[^{}]*\}/g,function(t){
			return '}else if('+ t.replace("{else if",'').replace("}",'') +'){';

		// else
		}).replace(/\{else[^{}]*\}/g,function(t){
			return "}else{";

		//if结尾
		}).replace(/\{\/if\}/g,function(t){
			return "}";

		// 替换{}中的内容
		}).replace(/\)\{[^{}]*\}/g,function(t){
			var ft = t.substr(0,t.indexOf("{"));
			return ft + '{return "' + t.substr(t.indexOf("{")).replace("{",'').replace("}",'').replace(/"/g,'\\"') + '";}';

		}).replace(/\}else\{[^{}]*\}/g,function(t){
			var ft = t.substr(0,t.indexOf("{"));
			return ft + '{return "' + t.substr(t.indexOf("{")).replace("{",'').replace("}",'').replace(/"/g,'\\"') + '";}';

		});

		try{
			return new Function(var2Str(r))() || "";
		} catch(er){
			return "";

		}
		
		

	});
};

function attr2mod(str){
	var arr = [];
	return "mod-" + str.replace(/[A-Z]/g,function(ch){return "-" + ch.toLowerCase(); }); 
}

function isBelong(target,belongOne){
	for(var _belongOne = belongOne;_belongOne;_belongOne = _belongOne.parentNode){
		if(_belongOne === target){
			return true;
		}
	}
}

//页码重构
function leafRebuild(nowPage,showNum,total,source){

	var op = {
		leafCount: 5,
		//分页样式
		classes: {
			//第一页
			prev:"prev",
			//第一页 失效
			prevDisable:"prev_disable",
			//省略号
			ellipiss:"s",
			//页码
			number:"number",
			//页码 选中
			numberCurrent:"current",
			//最后一页
			next:"next",
			//最后一页 失效
			nextDisable:"next_disable",

			//跳转到第几页 样式
			jump:"jumpto"
		}
	};

	nowPage = Number(nowPage);
	showNum = Number(showNum);
	total = Number(total);

	if(showNum === 0){ return "";}

	var html = "",
		leafCount = op.leafCount,
		focus = Math.floor(leafCount/2),
		pageTotal = Math.ceil(total/showNum) - 1,
		pageStart = (nowPage - focus > 0?nowPage - focus:0),
		pageEnd = (nowPage + focus < pageTotal? nowPage + focus:pageTotal),
		hrefRebuild = typeof source == "string"? function(page){
			page < 0? page = 0:"";
			page > pageTotal? page = pageTotal:"";
			//传方法名执行
			return "javascript:" + source +'('+ page +');'; 

		}:function(page){
			page < 0? page = 0:"";
			page > pageTotal? page = pageTotal:"";
			
			//传参数 object页面跳转： href - 链接，devi - 初始索引值
			return source.href + (Number(page) + Number(source.devi || 0) );
		},

		jumpFuncStr = typeof source == "string"? (
			"this.parentNode.children[0].value &&" + source + "(Number(this.parentNode.children[0].value) - 1)"
		):(
			"this.parentNode.children[0].value && (window.location.href=\\'"+ source.href +"\\' + Number(this.parentNode.children[0].value) + " + Number(source.devi || 0) + ")"
		);


	if(isNaN(nowPage) || isNaN(showNum) || isNaN(total)){return "";}

	pageEnd > pageTotal? pageEnd = pageTotal:"";
	pageEnd - pageStart < leafCount?(
		pageStart + leafCount - 1 <= pageTotal?(
			pageEnd = pageStart + leafCount - 1
		):(
			pageEnd - leafCount + 1 >= 0 ? pageStart = pageEnd - leafCount + 1:""
		)
	):"";

	if(pageStart != pageEnd){
		html += '<a href="'+ (nowPage === 0?'javascript:;':hrefRebuild(nowPage - 1)) +'" class="'+ op.classes.prev + (nowPage === 0? ' '+ op.classes.prevDisable:'') + '">&laquo;上一页</a>';
	}

	if(pageStart !== 0){
		html += '<a href="'+ hrefRebuild(0) +'" class="'+ op.classes.number +'">1</a>';
	}

	if(nowPage > focus && pageStart !== 0 && pageStart != 1){
		html += '<span class="'+ op.classes.ellipiss +'">…</span>';
	}

	for(var i = pageStart; i <= pageEnd && pageStart != pageEnd; i++ ){
		html += '<a class="'+ op.classes.number +' '+ (i == nowPage?op.classes.numberCurrent:'') +'" href="'+ (i == nowPage?'javascript:;': hrefRebuild(i)) + '">'+ (i + 1) +'</a>';
	}

	if(nowPage < pageTotal - focus - 1 && pageEnd != pageTotal){
		html += '<span class="'+ op.classes.ellipiss +'">…</span>';
	}

	if(pageEnd != pageTotal){
		html += '<a href="'+ hrefRebuild(pageTotal) +'" class="'+ op.classes.number +'">'+ (pageTotal + 1) +'</a>';
	}
	if(pageStart != pageEnd){
		html += '<a href="'+ (nowPage == pageTotal?'javascript:;':hrefRebuild(nowPage + 1)) +'" class="'+ op.classes.next +' ' + (nowPage == pageTotal? ' '+ op.classes.nextDisable:'') + '">下一页&raquo;</a>';
	}
	if(pageTotal > 1){
		html += '<span class="'+ op.classes.jump +'">跳转到第 <input type="text" class="ipt" onblur="isNaN(this.value) || Number(this.value) <= 0 ?this.value=1:(Number(this.value) > '+ (pageTotal + 1) +'?this.value='+ (pageTotal + 1) +':\'\')" /> 页 <input type="button" class="btn" onclick="'+ jumpFuncStr +'" value="GO" /></span>';
	}
	
	
	return html;
}


function urlRender(url){
    var r = url.replace(/\{[^\}\{]*\}/g, function(str){
        var selector = str.replace(/^\{\s*/g,'').replace(/\s*\}$/,'');
        return $(selector).val() || $(selector).text();
    });

    return r;
}

/**
 * 赋值用函数
 * @param  {object} o1 输出数据
 * @param  {object} o2 比对数据|含有 mod-xxx 的节点标签
 * @return {void}
 */
function modAssignment(o1,o2){
	if(!o1){
		return {};
	}
	o2 = o2 || {};

	var r = clone(o1) || {},
		isElm = o2.nodeType == 1,
		fAttr,
		modAttr;

	for(var key in r){
		if(r.hasOwnProperty(key)){
			modAttr = isElm? $(o2).attr(attr2mod(key)):o2[key];

			if( typeof modAttr == "undefined" || modAttr === ""){
				continue;
			}
			switch(typeof r[key]){
				case "number":
					!isNaN(modAttr) && (r[key] = Number(modAttr) );
					break;

				case "string":
					r[key] = modAttr;
					break;

				case "function":
					r[key] = makeFunction(modAttr,"function") || r[key];
					break;

				case "object":
					if(r[key].splice === Array.prototype.splice || JSON.stringify(r[key]) == "{}"){
						r[key] = makeFunction(modAttr,"object");
					} else {
						r[key] = modAssignment(r[key],makeFunction(modAttr,"object"));
					}
					
					break;

				case "boolean":
					typeof modAttr == "boolean" && (r[key] = modAttr);
					typeof modAttr == "string" && (r[key] = modAttr == "true"?true:false); 
					break;

				case "undefined":
					r[key] = makeFunction(modAttr);
					break;

				default:
					break;
			}
		}
	}

	return clone(r);
}

/**
 * 属性获取 data.total => obj[data][total]
 */
function getObjByKey(obj,str){


	if(!obj || !str){return;}
	var key = str.split("."),
		r = obj;
	
	for(var i = 0, len = key.length; i < len; i++){
		if(r === null){
			break;

		}else if(typeof r != "object"){
			r = undefined;
			break;

		} else if(key[i] in r){
			r = r[key[i]];
		} else {
			break;
		}
	}
	return r === obj? undefined:r;
}


//模板初始化用函数
function moduleBuild() {
	//this.init();
}

moduleBuild.prototype = {
	/**
	 * 模板初始化
	 * @param  {object} target 需要执行模块化的对象
	 * @param  {object} op     参数设置
	 *
	 *                  - title      [string] 模块标题 
	 *                  - titleLeft  [string] 模块标题左侧 html内容 
	 *                  - titleRight [string] 模块标题右侧 html内容
	 * @return {void} 
	 */
	box: function(target,op) {
		var $tar = target ? $(target) : $(".bs_mod01"),
			option = {
				title:"",
				titleLeft:"",
				titleRight:"",
				hide:false
			},
			key;
		
		//赋值
		option = modAssignment(option,op);

		//重构
		$tar.each(function() {
			var she = this,
				attr = modAssignment(option,she);

			if(isEqual(she.opAttr,attr)){
				return;
			}

			$(she).addClass("bs_mod01");

			var myFrag = document.createDocumentFragment(),
				i, len, fs;

			while(she.childNodes.length > 0){
				myFrag.appendChild(she.childNodes[0]);
			}
			

			$(she).html([
				'<div class="bs_mod01_hd">',
				attr.title ? '<h3 class="h_tl"><i class="bs_toggle_icon '+ (attr.hide?'bs_toggle_icon_cur':'') +'"></i>' + attr.title + '</h3>' : '',
				attr.titleLeft ? '<div class="h_l">' + attr.titleLeft + '</div>' : "",
				attr.titleRight ? '<div class="h_r">' + attr.titleRight + '</div>' : "",
				'</div>',
				'<div class="bs_mod01_bd" '+ (attr.hide?'style="display:none;"':'') +'>',
				'</div>'
			].join(""));

			$(she).children().eq(1).append(myFrag);
			$(she).show();

			var myExt = {
					toggleIco:$(she).children(".bs_mod01_hd").find(".bs_toggle_icon")[0],
					toggleCnt:$(she).children(".bs_mod01_bd")[0]
				},
				toggleArea = myExt.toggleIco?myExt.toggleIco.parentNode:null;


			she.show = function(){
				$(myExt.toggleIco).removeClass("bs_toggle_icon_cur");
				$(myExt.toggleCnt).slideDown(200)
			};
			
			she.hide = function(){
				$(myExt.toggleIco).addClass("bs_toggle_icon_cur");
				$(myExt.toggleCnt).slideUp(200);
			};

			toggleArea && (toggleArea.onclick = function(){
				myExt.toggleIco.className.indexOf("bs_toggle_icon_cur") == -1 ? (
					she.hide()
				) : (
					she.show()
				);

			});

			she.opAttr = attr;
			toggleArea = null;
			
		});
		

	},

	/**
	 * 选项卡初始化
	 * @param  {object} target 需要执行模块化的对象
	 * @param  {object} op     参数设置
	 *
	 *                  - title      [string] 模块标题 
	 *                  - titleLeft  [string] 模块标题左侧 html内容 
	 *                  - titleRight [string] 模块标题右侧 html内容
	 * @return {void} 
	 */
	tab: function(target,op) {
		var $tar = target ? $(target) : $(".bs_tab"),
			option = {
				title:"",
				titleLeft:"",
				titleRight:"",
				index:0,
				onchange:function(){},
				//是否自动切换
				autoPlay:false,
				//自动切换停留时间
				timeout:2000,

				hide:false
			},
			key;

		
		//赋值
	
		option = modAssignment(option,op);

		
		//重构
		$tar.each(function() {
			var she = this,
				attr = modAssignment(option,she);


			if(isEqual(she.opAttr,attr)){
				return;
			}

			var myTabs = {},
				myUl = $(she).children("ul")[0],
				myFrag = document.createDocumentFragment();
				


			
			$(target).addClass("bs_tab");

			

			$(myUl).find("a").each(function(i) {
				var that = this,
					tarId = $(that).attr("href").split("#").pop();
				var myTarget = $("#" + tarId)[0];
				
				myTarget && myFrag.appendChild(myTarget);

			});
			

			myFrag.appendChild(myUl);

			she.innerHTML = [
				'<div class="bs_tab_hd">',
				attr.title ? ('<h3 class="h_tl"><i class="bs_toggle_icon '+ (attr.hide?'bs_toggle_icon_cur':'') +'"></i>' + attr.title + '</h3>') : "",
				'<div class="bs_tab_tablist"></div>',
				attr.titleLeft ? ('<div class="h_l">' + attr.titleLeft + '</div>') : "",
				attr.titleRight ? ('<div class="h_r">' + attr.titleRight + '</div>') : "",
				'</div>',
				'<div class="bs_tab_bd '+ (attr.hide?'style="display:none;"':'') +'"></div>'
			].join("");

			$(she).children(".bs_tab_hd").children(".bs_tab_tablist").append(myUl);
			$(she).children(".bs_tab_bd").append(myFrag).children().addClass("bs_tab_bd_item").hide();

			
			she.style.display = "block";
			
			
			//事件绑定
			$(she).children(".bs_tab_hd").children(".bs_tab_tablist").find("a").each(function() {
				var that = this,
					clickHandle = function(e){
						e = e || window.event;
						var that = this,
							myIndex = $(that).parent().parent().children().index($(that).parent()),
							tarId = $(that).attr("href").split("#").pop();

						e.preventDefault && e.preventDefault();
						e.returnValue = false;
						$(that).parent().addClass("cur").siblings().removeClass("cur");
						$("#" + tarId).show().siblings().hide();

						she.index = myIndex;

						attr.onchange && attr.onchange.call(that,myIndex);
					},
					i, len;

				!that.clickEvents && (that.clickEvents = []);
					
				for(i = 0, len = that.clickEvents.length; i < len; i++){
					$(that).unbind("click",that.clickEvents[i]);
				}

				that.clickEvents = [];

				$(that).bind("click",clickHandle);

				that = null;
			});

			var myExt = {
					toggleIco:$(she).children(".bs_tab_hd").find(".bs_toggle_icon")[0],
					toggleCnt:$(she).children(".bs_tab_bd")[0]
				},
				toggleArea = myExt.toggleIco ? myExt.toggleIco.parentNode: null;
			

			toggleArea && (toggleArea.onclick = function(){
				var toggleIco = myExt.toggleIco,
					toggleCnt = myExt.toggleCnt;

				toggleIco.className.indexOf("bs_toggle_icon_cur") == -1 ? (
					$(toggleIco).addClass("bs_toggle_icon_cur"),
					$(toggleCnt).slideUp(200)
				) : (
					$(toggleIco).removeClass("bs_toggle_icon_cur"),
					$(toggleCnt).slideDown(200)
				);

			});

			var curIndex = isNaN(attr.index)? 0: attr.index,
				tabAs = $(she).children(".bs_tab_hd").children(".bs_tab_tablist").find("a"),
				i, len;

			curIndex < 0 && (curIndex = 0);
			curIndex > tabAs.length && (curIndex = tabAs.length);

			she.index = curIndex;

			she.current = function(index){
				index = index % tabAs.length;

				$(tabAs).eq(index).trigger("click");
			};

			she.prev = function(){
				she.current(she.index - 1);
			};

			she.next = function(){
				she.current(she.index + 1);
			};

			she.current(she.index);

			if(attr.autoPlay && attr.timeout){
				!function aniMove(){
					clearTimeout(she.hoverKey);
					clearTimeout(she.timeoutKey);

					if(she.isHover){
						she.hoverKey = setTimeout(aniMove,20);

					} else {
						she.next();
						she.timeoutKey = setTimeout(aniMove,attr.timeout);
					}
				}();

				$(myExt.toggleCnt).bind("mouseenter",function(){
					she.isHover = true;
				});

				$(myExt.toggleCnt).bind("mouseleave",function(){
					she.isHover = false;
				});
			}
			
			she.opAttr = attr;
			toggleArea = null;


		});

		return $tar[0];
	},

	/**
	 * 表单初始化
	 * 执行表单初始化时会顺带 将对里面的所有 表单元素执行 mod.widget(), mod.button() 初始化
	 * 表单提交时会将 表内带有 name 属性的控件 提交过去,其他则会忽略
	 * @param  {object} target 需要执行模块化的对象
	 * @param  {object} op     参数设置
	 *
	 *                  - action         [string]        提交表单的地址 
	 *                  - search         [boolean]       初始化的时候是否自动提交表单一次
	 *                  - method         [string]        提交的方式 GET|POST 
	 *                  - actionType     [string]        提交的途径 ajax|jsonp|不填
	 *                  - target         [string|object] 提交的目标对象 _blank|_self|某标签
	 *                  - targetConfig   [object]        假如 target 为某标签时 将执行 表单渲染，
	 *                                                   属性同 mod.widget() 中option 一致
	 *                  - actionCallback [function]      提交表单成功后执行的方法
	 *                  - messageKey     [string]        错误信息对应的json 属性 默认与Config一致
	 *                  - statusKey      [string]        状态信息对应的json 属性 默认与Config一致
	 *                  - onsubmit       [function]      提交前触发的事件.返回表单提交的数据，返回 false 则不继续提交表单
	 *                  - submitCallback [function]      表单提交后返回的 json数据；设置了此方法后，actionCallback方法将失效
	 *                  - onresponse     [function]      数据返回后触发的事件，用于对返回的内容进行格式化
	 */
	form: function(target,op) {
		var me = this,
			$tar = target ? $(target) : $(".bs_form"),
			option = {
				action:"",
				method:"",
				actionType:"",
				target:"",
				search:false,
				actionParam:{},
				targetConfig:{},
				actionCallback:function(){},

				onsubmit:function(){},
				onerror:function(){},

				submitCallback:function(){},
				onresponse:function(){},

				onload:function(){},

				timeout:0,

				//错误信息对应的json 属性
				messageKey:global.Config.ajax.key.message,

				//状态信息对应的json 属性
				statusKey:global.Config.ajax.key.status,
                //成功返回的状态码
                successCode: global.Config.ajax.successCode,
				
                reset:false
			},
			key;

		
		//赋值
		option = modAssignment(option,op);

		//重构
		$tar.each(function() {
			var that = this,
				attr = modAssignment(option,that),
				postHandle = function(){
					var i,len,fs,j,jlen,myName,
                        padding = that.checkElms.length,
                        errArr = [];
                    
                    for(i = 0, len = padding; i < len; i++){
                        fs = that.checkElms[i];
                        if(fs.srcBox.isOk === true){
                            padding--;
                        } else if(fs.srcBox.isOk === false){
                            padding--;
                            errArr.push(fs);

                        } else {
                            return;
                        }

                        
                    }
                    if(errArr.length){
                        attr.onerror(errArr);
                        return;
                    }
                    // 数据处理
					for(i = 0, len = that.checkElms.length; i < len; i++){
						fs = that.checkElms[i];
						myName = fs.name;
						
						if(fs.tagName == "INPUT" && /radio|checkbox/.test(fs.type)){
							option.actionParam[myName] = [];
							for(j = 0, jlen = that[myName].length; j < jlen; j++){
								if(that[myName][j].checked){
									option.actionParam[myName].push(that[myName][j].value);
									//break;
								}
							}

						} else if(fs.tagName == "select" && fs.multiple){
							option.actionParam[myName] = [];
							for(j = 0, jlen = fs.options.length; j < jlen; j++){
								if(fs.options[j].selected){
									option.actionParam[myName].push(fs.options[j].value);
									//break;
								}
							}

						} else {
							option.actionParam[myName] = fs.value;
						}
						
					}

					sendHandle(option.actionParam);
				},
				sendHandle,
				submitBtn = $(that).find("*[mod-type=submit]")[0],
				clearBtn = $(that).find("*[mod-type=clear]")[0];

			if(isEqual(that.opAttr,attr)){
				return;
			}

			$(that).addClass("bs_form");
			
			$(that).find("table").addClass("bs_table_s0");

			$(that).find("input,select,textarea").each(function(){
				mod.widget(this);
				

			});

			if(!sendHandle){
				//表格关联
				if(attr.target && JSON.stringify(attr.targetConfig) != "{}" ){
					var myTarget;

					if(attr.target.splice === Array.prototype.splice){
						myTarget = [];
						$(attr.target).each(function(){
							myTarget.push(this);
						});
					} else {
						myTarget = [attr.target];
					}

					if(attr.targetConfig.splice !== Array.prototype.splice){
						attr.targetConfig = [attr.targetConfig];
					}
					sendHandle = function(param){
                        !isNaNFn(attr.onsubmit) && (param = attr.onsubmit(param));
						if(!param){
							return;	
						}
						$(myTarget).each(function(i){
							if($(this + "").length === 0){return;}

							var fConfig = attr.targetConfig[i],
								nowPage;

							attr.search?(
								option.reset?(
                                    nowPage = 0
                                ):(
                                    nowPage = request.hash(this.replace("#","") + "Cur") || 0
                                ),
								attr.search = false
							):(
								nowPage = 0
							);

							if("actionParam" in fConfig && typeof fConfig.actionParam == "object"){
								for( var key in param){
									if(param.hasOwnProperty(key)){
										fConfig.actionParam[key] = param[key];
									}
								}
							} else {
								fConfig.actionParam = param;
							}

							fConfig.page = nowPage;
							
							$(this + "").each(function(){
								me.grid(this,fConfig,true);
							});
							
						});
									
					};

				//一般表单提交
				} else {
					switch(attr.actionType){
						
						case "":
							that.target = attr.target;
							that.action = attr.action;
							sendHandle = function(){
								that.submit();
							};
							break;

						default:
							sendHandle = function(param){
								!isNaNFn(attr.onsubmit) && (param = attr.onsubmit(param));

								if(!param){
									return;	
								} 

								mod.loading.init(function(){
									submitBtn.enable();

								},attr.timeout);
								submitBtn.disable();
								param._ = new Date().getTime();
                                
								$.ajax({
									"url":attr.action,
									"data":param,
									"success":function(json){
										if(mod.loading.isTimeout){return;} 
										mod.loading.clear();
										submitBtn.enable();
                                        
                                        if(!isNaNFn(attr.onresponse)){
                                            json = attr.onresponse(json);
                                        }

										if(!isNaNFn(attr.submitCallback)){
											attr.submitCallback(json, param);
											return;
										}

										var myAttr = {
											status: getObjByKey(json,attr.statusKey),
											msg: getObjByKey(json,attr.messageKey)
										};
                                        
                                        

                                        if(myAttr.status == attr.successCode){
											attr.actionCallback && attr.actionCallback(json,param);
										} else {
											bsPopup("error",myAttr.msg);
										}
										
									},
									"dataType":attr.actionType == "jsonp"?"jsonp":"json",
									"type":attr.method
								});
							};
							
							break;
					}

				}

				
			}

			//事件绑定
			that.check = that.onsubmit = function(){
				var elms,i,len,fs,
					allOk = true;

				that.checkElms = [];
				//form标签特有属性
				elms = that.elements;
				for(i = 0, len = elms.length; i < len; i++){
					fs = elms[i];
					!/button|submit/.test(fs.type) && fs.name && fs.srcBox && that.checkElms.push(fs);
				}
				
				
				for(i = 0, len = that.checkElms.length; i < len; i++){
					fs = that.checkElms[i].srcBox;
					!fs.isOk && (
						!fs.check(postHandle),
						allOk = false
					);
				}

				allOk && postHandle();
			
				return false;
			};

			if(!that.opAttr){
				submitBtn && submitBtn.type != "submit" && $(submitBtn).bind("click",function(){
					that.check();
				});

				$(clearBtn).bind("click",function(){
					that.clean();
				});
			}

            that.clean = that.clear = function(){
                that.checkElms = [];
				//form标签特有属性
				elms = that.elements;
				for(i = 0, len = elms.length; i < len; i++){
					fs = elms[i];
					!/button|submit/.test(fs.type) && fs.name && fs.srcBox && that.checkElms.push(fs);
				}
				
                that.reset();
				
				for(i = 0, len = that.checkElms.length; i < len; i++){
					fs = that.checkElms[i];
                    fs.srcBox.reset();
                    /radio|checkbox/.test(fs.type) && $(fs).trigger('change');
				}

            };
			
			attr.search && that.check();

			!isNaNFn(attr.onload) && attr.onload();
			that.opAttr = attr;

		});
	    return $tar[0];
	},

	/**
	 * 表单内控件初始化
	 * @param  {object} target 需要执行模块化的对象
	 * @param  {object} op     参数设置
	 *
	 *                  - format         [string]        格式化类型
	 *                                                   = input[type = text]
	 *                                                   = textarea
	 *                                                   验证码校验 code
	 *                                                   邮箱校验 email
	 *                                                   手机校验 mobile
	 *                                                   身份证校验 idcard
	 *                                                   日期选择器 date
	 *                                                   日期时间选择器 date-time
	 *                                                   日期区间选择器 date-interval
	 *                                                   非空校验 不填
	 *                                                   自定义校验  自行填写正则如 /\s+/g
	 *
	 *                                                   
	 *                                                   = input[type = password]
	 *                                                   密码控件 password
	 *                                                   确认密码控件 password2
	 *
	 *                                                   = input[type = hidden]
	 *                                                   flash图片上传控件 img-upload
	 *                                                   flash单个歌曲上传控件 song-upload
	 *                                                   flash文件上传控件 file-upload
	 *                                                   flash多个歌曲上传控件 multi-song-upload
	 *                                                   非空校验 不填
	 *
	 *                                                   = input[type = checkbox|radio]
	 *
	 *                                                   = select
	 *                                                   城市选择 city
	 *                                                   多级选择 multi
	 *                                                   单个选择 不填
	 *                                                    
	 *                  - required       [boolean]       是否为必填项 默认 false
	 *                  - errorText      [string]        设置校验内容时错误的提示语
	 *                  - defaultText    [string]        设置控件默认的提示语
	 *                  - autocomplete   [string]        自动完成 用逗号隔开 内容 如 "张三,李四"
	 *
	 *                  - action         [string]        异步校验的地址(不填则不用异步校验)
	 *                  - method         [string]        异步校验的方式 GET|POST 
	 *                  - actionKey      [string]        异步校验时使用的 参数名 如 username:1
	 *                  - actionType     [string]        异步校验的途径 ajax|jsonp
	 *                  - actionCallback [function]      异步校验成功后执行的方法
	 *                  - submitCallback [function]      异步校验返回结果后执行的方法（覆盖 actionCallback）
	 *                  - onresponse     [function]      数据返回后触发的事件，用于对返回的内容进行格式化
	 *                  - onsubmit       [function]      异步校验提交前的处理函数
	 *
	 *
	 *                  - linked         [string]        关联( password2,date-interval,select框 用参数)
	 *                  - size           [number]        字符长度(code 用参数);单个标签字数长度(tags用参数)
	 *
	 *                  - title          [string]        模块名称(checkbox,radio 用参数)
	 *                  - img            [string]        图片地址(checkbox,radio 用参数)
	 *                  - imgWidth       [string]        图片宽度，默认 100(checkbox,radio 用参数)
	 *                  - imgHeight      [string]        图片高度，默认 100(checkbox,radio 用参数)
	 *
	 *                  - split          [string]        输出内容分隔用字符(tags 用参数)
	 *                  - length         [number]        标签允许最多个数(tags 用参数)
	 *
	 *                  - messageKey     [string]        错误信息对应的json 属性 默认与Config一致
	 *                  - statusKey      [string]        状态信息对应的json 属性 默认与Config一致
	 *                  - dataKey        [string]        数据信息对应的json 属性 默认与Config一致
	 * @return {void} 
	 */
	widget:function(target,op){
		var me = this,
			$tar = target? $(target):$(".bs_widget"),
			option = {
				format: "",
				
				//是否为必填项
				required: false,

				//容器宽度
				width:0,
				
				//关联( password2,date-interval,multi 用参数)
				linked: "",
				//字符长度(code 用参数); 单个标签字数长度(tags用参数)
				size: "",
				
				//checkbox|radio用参数
				title: "",
				img: "",
				imgWidth: "",
				imgHeight: "",
				
				//异步用参数
				method: "",
				action: "",
				actionKey: "",
				actionType: "",
				actionCallback: function(){},

				//autoComplete用函数，异步请求延迟秒数
				actionDelay: 50,

				onsubmit:function(){},
				submitCallback:function(){},
                onresponse: function(){},

				//日历控件用参数：开始日期，结束日期
				dateStart:undefined,
				dateEnd:undefined,

				//输出内容分隔用字符(tags 用参数)
				split:";",
				//标签允许最多个数(tags 用参数)
				length:0,

				//类型(tags用参数：edit|select 通过输入来制定标签 or 通过选择来制定标签)
				type:"",

				//点击选择按钮时回调的方法(tags 用参数)
				onselect:function(){},



				oncheck:function(){},
				
				//出错提示语
				errorText: "",
				//默认提示语
				defaultText: "",

				//默认值（select用）
				defaultValue: "",
				
				//自动完成
				autocomplete: "",

				//数据 对应的json 属性
				dataKey:global.Config.ajax.key.data,

				//错误信息对应的json 属性
				messageKey:global.Config.ajax.key.message,

				//状态信息对应的json 属性
				statusKey:global.Config.ajax.key.status,
                
                //成功返回的状态码
                successCode: global.Config.ajax.successCode
			},
			
			ajaxCheck = function(input,callback){
				var attr = modAssignment(option,input),
					param = {};

				param[attr.actionKey] = input.value;

				!isNaNFn(attr.onsubmit) && (param = attr.onsubmit(param));

				if(!param){
					input.isOk = false;
					return false;
				}

				if(!attr.action || /img-upload|song-upload|file-upload|multi-song-upload/.test(attr.format)){
					attr.actionCallback && attr.actionCallback(null,param);
					input.isOk = true;
					return true;
				}
                
                console.log(input.oValue)
                if((input.oValue == input.value)){
                    
                    return input.isOk;
                }

				input.isOk = undefined;
				input.srcBox.loading.init();
				param._ = new Date().getTime();
				$.ajax({
					"url":attr.action,
					"data":param,
					"success":function(json){
						if(input.srcBox.loading.isTimeout){
                            input.isOk = false;
                            callback && callback(input.isOk, input);
							return;
						}
						input.srcBox.loading.clear();
                        
                        if(!isNaNFn(attr.onresponse)){
                            json = attr.onresponse(json);
                        }

						if(!isNaNFn(attr.submitCallback)){
							input.oValue = input.value;
							attr.submitCallback(json, param, input);
                            callback && callback(input.isOk, input);
                            return;
						}

						var myAttr = {
							status: getObjByKey(json,attr.statusKey),
							msg: getObjByKey(json,attr.messageKey)
						};

                        if(myAttr.status == attr.successCode){
							input.isOk = true;
							input.oValue = input.value;

							attr.actionCallback(json,param);

                            callback && callback(input.isOk, input);

						} else {
							input.srcBox.error(myAttr.msg);
							input.isOk = false;
							input.oValue = input.value;

                            callback && callback(input.isOk, input);
						}
					},
					"dataType":attr.actionType == "jsonp"?"jsonp":"json",
					"type":attr.method || "GET"
				});
			},

			boxInit = function(elm,attr){
				
				var box,
					myParent = elm.parentNode,
                    mySiblings = myParent.children,
					myType = elm.type,
					stu,msgbox,msgboxTri;

				if((myType == "button" && /bs_btn_s0/.test(myParent.className)) || (/checkbox|radio/.test(myType) && /bs_checkarea/.test(myParent.className))){ 
					myParent = myParent.parentNode;
                    mySiblings = myParent.children;
				}

                // 查找相邻的元素是否存在 type 一样的 detectbox
                
                $(mySiblings).each(function(i, item){
                    if(~item.className.indexOf('bs_detectbox') && item.type == myType && item != elm){
                        myParent = item;
                    }
                });

				if(myParent && myParent.className.indexOf("bs_detectbox") != -1){
					box = myParent;
                    console.log('this way', box)

				} else {
					


					box = document.createElement("div");
					box.className = "bs_detectbox";
                    box.type = myType;
					while(myParent.children.length > 0){
						box.appendChild(myParent.children[0]);
					}
					myParent.innerHTML = "";
					myParent.appendChild(box);

					box.tips = document.createElement("div");
					box.tips.className = "bs_detectbox_msg";

					msgbox = document.createElement("div");
					msgbox.className = "bs_detectbox_msgbox";

					msgboxTri = document.createElement("i");
					msgboxTri.className = "bs_detectbox_msg_tri";

					stu = document.createElement("i");
					stu.className = "bs_detectbox_msg_stu";

					box.tips.cnt = document.createElement("div");
					box.tips.cnt.className = "bs_detectbox_msg_cnt";

					//提示显示
					box.tips.show = function(time){
						$(box.tips).addClass("bs_detectbox_msg_show");
						box.tips.fixed();

						$(window).bind("resize",box.tips.fixed);
						$(window).bind("scroll",box.tips.fixed);



						clearTimeout(box.tips.delayKey);
						time && (box.tips.delayKey = setTimeout(function(){
							box.tips.hide();
						},time));
					};

					//提示隐藏
					box.tips.hide = function(){
						$(box.tips).removeClass("bs_detectbox_msg_show");

						$(window).unbind("resize",box.tips.fixed);

						$(window).unbind("scroll",box.tips.fixed);
					};

					//提示位置调整
					box.tips.fixed = function(){
						//层级调整
						var myParent = box.parentNode;
						while(myParent){
							if(/bs_pop_bd|bs_inset_frame/.test(myParent.className)){
								break;
							}
							myParent = myParent.parentNode;
						}

						myParent = myParent || document.body;
						myParent.appendChild(box.tips);

						var pos = getPosition(box),
							parentPos = getPosition(myParent),
							myZIndex = getTopperZIndex(box) + 5,
							myLeft = pos.left - parentPos.left,
							myTop = pos.top - parentPos.top - box.tips.offsetHeight;

						myTop < 0 && (myTop = 0);
						myLeft < 0 && (myLeft = 0);

						box.tips.style.left = myLeft + "px";
						box.tips.style.top = myTop + "px";
						box.tips.style.zIndex = myZIndex;

					};

                    box.reset = function(){
                        box.clear();
                        box.tips.hide();
                        box.tips.cnt.innerHTML = "";
                        box.tips.status = "notice";
                    };


					box.srcItems = [];

					box.success = function(txt){
						txt = txt || "";
						box.clear();
						$(box).addClass("bs_detectbox_success");
						$(box.tips).addClass("bs_detectbox_success");
						box.tips.cnt.innerHTML = txt;
						box.tips.status = "success";
					};

					box.error = function(txt){
						txt = txt || "";
						box.clear();
						$(box).addClass("bs_detectbox_error");
						$(box.tips).addClass("bs_detectbox_error");
                        console.log('thisway', box.tips.cnt)
						box.tips.cnt.innerHTML = txt;
						box.tips.status = "error";
						box.tips.show(2000);
					};


					box.notice = function(txt){
						txt = txt || "";
						box.clear();
						if(txt){
							$(box).addClass("bs_detectbox_notice");
							$(box.tips).addClass("bs_detectbox_notice");
							box.tips.cnt.innerHTML = txt;


						} else {
							box.tips.cnt.innerHTML = "";
							box.tips.hide();
						}
						
						box.tips.status = "notice";
					};

					box.clear = function(){
						$(box).removeClass("bs_detectbox_error").removeClass("bs_detectbox_loading").removeClass("bs_detectbox_success").removeClass("bs_detectbox_notice");

						$(box.tips).removeClass("bs_detectbox_error").removeClass("bs_detectbox_loading").removeClass("bs_detectbox_success").removeClass("bs_detectbox_notice");
					};

					box.loading = {
						init:function(timeoutCallback,txt){
							clearTimeout(box.loading.timeoutKey);
							box.clear();
							$(box).addClass("bs_detectbox_loading");
							$(box.tips).addClass("bs_detectbox_loading");
							
                            box.tips.cnt.innerHTML = txt ||"正在校验";
							box.loading.isTimeout = false;
							box.loading.timeoutKey = setTimeout(function(){
								box.error(global.Config.ajax.timeoutText);
								box.loading.isTimeout = true;
								typeof timeoutCallback == "function" && timeoutCallback();

							},global.Config.ajax.timeout);
						},
						clear:function(){
							box.clear();
							box.tips.cnt.innerHTML = "";
							clearTimeout(box.loading.timeoutKey);
							box.tips.hide();
						}
					};

					var fTarget = $(".bs_inset_frame")[0];
					fTarget = fTarget && isBelong(fTarget,elm)?fTarget:document.body;

					fTarget.appendChild(box.tips);
					box.tips.appendChild(msgbox);
					msgbox.appendChild(msgboxTri);
					msgbox.appendChild(stu);
					msgbox.appendChild(box.tips.cnt);

					if(/radio|checkbox/.test(myType)){
						box.check = function(callback){
							var isCheck = false;

							for(var i = 0, len = this.srcItems.length; i < len; i++){
								if(this.srcItems[i].checked){
									isCheck = true;
									break;
								}
							}


							if(!attr.required){
								this.notice();
								this.isOk = true;
								typeof callback == "function" && callback(this.isOk, this.srcItems[0]);
								return true;

							} else if(isCheck){
								this.success();
								this.isOk = true;
								typeof callback == "function" && callback(this.isOk, this.srcItems[0]);
								return true;
							} else {
								this.srcItems[0] && this.error(this.srcItems[0].errorText);
								this.isOk = false;
								typeof callback == "function" && callback(this.isOk, this.srcItems[0]);
								return false;
							}
							
						};



					} else {
						box.check = function(callback){
							var i,len,fs,
								isRequired = false,
                                ajaxResult;
							
							for(i = 0, len = box.srcItems.length; i < len; i++){
								fs = box.srcItems[i];
								if(!isRequired && !fs.required && !fs.value.trim()){
									continue;
								} else {
									isRequired = true;
								}
								if(fs.localCheck()){
                                    ajaxResult = ajaxCheck(fs,function(pass, fs){
                                        box.check();
                                        // if(pass){
                                        //     box.check();
                                        // } else {
                                        //     box.isOk = false;
                                        //     callback && callback(box.isOk, fs);
                                        // }
                                    });
                                    
                                    switch(ajaxResult){
                                        case true:
                                            continue;
                                            break;

                                        case false:
                                            box.isOk = false;
                                            callback && callback(box.isOk, box.srcItems[0]);
                                            return;
                                        
                                        case undefined:
                                        default:
                                            return;
                                    }
									
								} else {
									box.isOk = false;
                                    callback && callback(box.isOk, box.srcItems[0]);
									return;
								}
							}
							!isRequired? box.notice() : box.success();
							box.isOk = true;
							typeof callback == "function" && callback(box.isOk, box.srcItems[0]);
							return true;
						};
					}

					
				}

				!box.frontName && (box.frontName = 'bs' + Math.round(Math.random() * 10000000000));

				return box;
			},

			pack = {
				//初始化
				init:function(elm,attr){
					var that = elm,
						myTagName = that.tagName.toLowerCase(),
						myType = that.type;


					if(that.nodeType != 1 || (isEqual(that.opAttr,attr) && that.srcBox) ){

						return;
					}

					if(!/button|submit/.test(that.type)){
						that.srcBox = boxInit(that,attr);
						pack.common(that,attr);
					}
					

					switch(myTagName){
						case "input":
							switch(that.type){
								case "text":
								case "password":
								case "hidden":
									switch(attr.format){
										case "img-upload":
										case "file-upload":
										case "song-upload": 
											pack.upload(that,attr); 
											break;


										case "tags": 
											pack.tags(that,attr); 
											break;

										case "code": 
											pack.code(that,attr); 
											break;

										case "email":
											pack.email(that,attr);
											pack.autocomplete(that,attr);
											break;

										case "mobile":
											pack.mobile(that,attr);
											pack.autocomplete(that,attr);
											break;

										case "idcard":
											pack.idcard(that,attr);
											break;

										case "date":
											pack.date(that,attr);
											break;

										case "date-time":
											pack.datetime(that,attr);
											break;

										case "date-interval":
										case "date-interal":
											pack.dateInterval(that,attr);
											break;

										case "password":
											pack.password(that,attr);
											break;

										case "password2":
											pack.password2(that,attr);
											break;


										default: 
											pack.custom(that,attr);
											pack.autocomplete(that,attr);
											break;

									}
									break;

								case "checkbox":
								case "radio":
									pack.checkbox(that,attr);
									break;

								case "button":
								case "submit":
									mod.button(that,attr);
									break;

								default:
									pack.custom(that,attr);
									break;
							}
							break;

						case "textarea":
							pack.textarea(that,attr);
							break;

						case "select":
							pack.selectbox(that,attr);
							break;


						default:
							return;
					}

					
					that.opAttr = attr;
				},

				common:function(elm,attr){
					var that = elm,
						myWidth = parseInt(attr.width,10),
						myType = elm.type;


					that.extCheck = !isNaNFn(attr.oncheck)? function(){
						var r = attr.oncheck(that.value);

						if(r === undefined || r === true){
							return true;

						} else {
							that.srcBox.error(r);
							return false;
						}

					}:function(){
						return true;
					};

					that.required = attr.required;
					that.defaultText = attr.defaultText;
					that.errorText = attr.errorText;

					
					!isNaN(myWidth) && myWidth && myType != "hidden" && (that.style.width = myWidth + "px");
					
					


					if(!/checkbox|radio/.test(myType)){
						$(that).bind("focus",function(){
							that.srcBox.tips.show();
							switch(that.srcBox.tips.status){
								case "error":
									break;

								case "success":
									that.srcBox.success(that.defaultText);
									break;

								case "notice":
									that.srcBox.notice(that.defaultText);
									break;
								default:
									that.srcBox.notice(that.defaultText);
									break;
							}
							
						});
					}

					$(that).bind("blur",function(){
						that.srcBox.tips.hide();
						that.srcBox.check();
					});
				},

				//上传组件
				upload:function(elm,attr){
                    var that = elm,
						now = new Date().getTime(),
						myIndex = $(that).parent().children().index(that),
						myPartName = attr.format.replace("-",""),
						myClassName = "bs_flash_" + myPartName,
						myId = that.name + myPartName + now,
						flashCallbackName = myId + "Callback",
						flashArea,
						uploadType;

					switch(attr.format){
						case "img-upload":
							uploadType = "Images|jpg|png";
							break;

						case "song-upload":
							uploadType = "Audios|mp3|wav|ape";
							break;

						case "file-upload":
							uploadType = "Documents|doc|xls|ppt|pdf";
							break;
					}

					if(myIndex - 1 >= 0 && that.parentNode.children[myIndex - 1].className == myClassName){
						flashArea = that.parentNode.children[myIndex - 1];

					} else {
						flashArea = document.createElement("div");
						flashArea.id = myId;
						flashArea.className = myClassName;
						that.parentNode.insertBefore(flashArea,that);
					}
					
					
					that.style.display = "none";


					flashArea.innerHTML = flash.init(flashArea.id,{
						flashUrl:global.Config.domain + global.Config.swf.imgUpload + "?callback=" + flashCallbackName + "&fileurl=" + encodeURIComponent(attr.action || global.Config.upload.imagePath) +"&filetype="+ uploadType +"&method=get&filesize=1073741824",
						width:500,
						height:100
					});

					
					global[flashCallbackName] = function(jsonstr){

						var json = JSON.parse(jsonstr);
                        
                        if(!isNaNFn(attr.onresponse)){
                            json = attr.onresponse(json);
                        }

						var myAttr = {
								status: getObjByKey(json,attr.statusKey),
								data: getObjByKey(json,attr.dataKey),
								msg: getObjByKey(json,attr.messageKey)
							};
                        

						if(!isNaNFn(attr.submitCallback)){
							attr.submitCallback(json);
							return;
						}

						if(myAttr.status == attr.successCode){
							attr.actionCallback && attr.actionCallback(myAttr.data);
						} else {
							that.value = "";
							that.srcBox.error(myAttr.msg);
						}
					};

					//修复flash 显示不正常bug
					setTimeout(function(){
						$(".bs_inset_frame")[0] && ($(".bs_inset_frame")[0].scrollTop += 1);
					},200);

					!that.defaultText && (that.defaultText = "选择要上传的文件");
					!that.errorText && (that.errorText = "不能为空");

					that.localCheck = function(){
						that.value = that.value.trim();
						if(that.value === ""){
							that.srcBox.error(that.defaultText);
							return false;

						}

						return that.extCheck();
					};
					that.srcBox.srcItems.push(that);
				},
				//标签控件
				tags:function(elm,attr){
					var that = elm,
						myIndex = $(that).parent().children().index(that),
						now = new Date().getTime(),
						myWidth = parseInt(attr.width,10),
						tagsArea,
						tagsInput;

					if(myIndex - 1 >= 0 && that.parentNode.children[myIndex - 1].className.indexOf("bs_tags_area") != -1){
						tagsArea = that.parentNode;

					} else {
						tagsArea = document.createElement("div");
						tagsArea.id = that.name + "tagArea" + now;
						that.parentNode.insertBefore(tagsArea,that);
					}

					
					tagsArea.innerHTML = "";
					
					
					if(attr.type == "select"){
						tagsArea.className = "bs_tags_area bs_tags_area_select";

						tagsInput = document.createElement("a");
						tagsInput.className = "bs_btn";
						tagsInput.innerHTML = "选择";

						!isNaN(myWidth - 50) && myWidth - 50 > 0 &&(tagsArea.style.width = myWidth - 50 + "px");

						//事件绑定
						mod.button(tagsInput);

						tagsArea.onclick = function(){
							$(tagsInput).trigger("click");
						};

						$(tagsInput).bind("click",function(e){
							stopBubble(e);
							attr.onselect.call(this);
						});

					} else {
						tagsArea.className = "bs_tags_area";

						tagsInput = document.createElement("input");
						tagsInput.className = "bs_tags_area_ipt";

						!isNaN(myWidth) && myWidth &&(tagsArea.style.width = myWidth + "px");

						//事件绑定
						$(tagsArea).bind("click",function(){
							tagsInput.focus();
						});
						
						$(tagsInput).bind("focus",function(){
							//$(that.srcBox).addClass("bs_detectbox_focus");
							that.srcBox.notice(that.defaultText);
							that.srcBox.tips.show();
						});
						
						$(tagsInput).bind("blur",function(){
							//$(that.srcBox).removeClass("bs_detectbox_focus");

							tagCheck();
						});

						

						$(tagsInput).bind("keyup",function(e){
							e = e || window.event;

							var myValue = tagsInput.value.trim(),
								tags = tagsArea.getElementsByTagName("a"),
								overLen = attr.length ? myValue.getBytes() > attr.length: false,
								overSize = attr.size ? tags.length >= attr.size : false,
								newTags = myValue.split(attr.split),
								i, len;
								

							//回车键
							if(e.keyCode == 13){
								if(myValue === ""){
									that.srcBox.notice(that.defaultText);
									
								} else if(overSize){
									tagsInput.value = "";
									that.srcBox.error("标签最多为" + attr.size + "个");

								} else if(overLen){
									that.srcBox.error("单个标签最多"+ attr.length +"个字符，一个汉字算作两个字符");

								} else{
									
									that.srcBox.notice(that.defaultText);

									for( i = 0, len = newTags.length; i < len; i++){
										buildTag(newTags[i]);
									}
									
									tagsInput.value = "";
									
								}

								stopBubble(e);
								return;

							//后退键
							} else if(e.keyCode == 8) {
								editTag();

							//刚好按到分隔符
							} else if(splitMap[attr.split] && splitMap[attr.split] == e.keyCode){
								that.srcBox.notice(that.defaultText);

								for( i = 0, len = newTags.length; i < len; i++){
									buildTag(newTags[i]);
								}
								
								tagsInput.value = "";
							}
						});

						$(tagsInput).bind("keydown",function(e){
							e = e || window.event;
							if(e.keyCode == 8){
								editTag();
							}
						});
					}
				    
					that.parentNode.insertBefore(tagsArea,that);
					tagsArea.appendChild(tagsInput);
					that.style.display = "none";

					

					var splitMap = {
							";":186,
							" ":32,
							",":188
						},
						buildTag = function(txt){

							if(!txt || txt.trim() === ""){
								return;
							}
							

							var	newTag = document.createElement("a"),
								closeBtn = document.createElement("i");

							newTag.className = "bs_tags_area_tag";
							newTag.myText = newTag.innerHTML = txt;
							newTag.appendChild(closeBtn);
							
							tagsArea.appendChild(newTag);
							tagsArea.appendChild(tagsInput);
							//tagsArea.insertBefore(newTag,tagsInput);

							//事件绑定
							closeBtn.onclick = function(e){
								stopBubble(e);
								try{
									this.parentNode.parentNode.removeChild(this.parentNode);
								} catch(er){}
								tagCheck();
							};

						},
						editTag = function(){
							var tags = tagsArea.getElementsByTagName("a"),
								lastTag = tags.length > 0? tags[tags.length - 1]: null;
							if(tagsInput.value === "" && lastTag){
								tagsInput.value = lastTag.textContent || lastTag.innerText;
								try{
									lastTag.parentNode.removeChild(lastTag);
								} catch(er){}
								tagsInput.focus();
							}
						},
						tagCheck = function(){
							var myValue = attr.type == "select"?"": tagsInput.value.trim(),
								tags = tagsArea.getElementsByTagName("a"),
								overLen = attr.length ? myValue.getBytes() > attr.length: false,
								overSize = attr.size ? tags.length >= attr.size : false,
								newTags = myValue.split(attr.split),
								r = [],
								rTags = [],
								i, j, len, fs;

							if(overLen){
								that.srcBox.error("单个标签最多"+ attr.length +"个字符，一个汉字算作两个字符");

								that.isOk = false;

							} else {
								
								if(overSize){
									tagsInput.value = "";

								} else {
									for( i = 0, len = newTags.length; i < len; i++){
										buildTag(newTags[i]);
									}
									tagsInput.value = "";
								}

								//去重
								for(i = 0; i < tags.length; i++){
									for(j = i + 1; j < tags.length; ){
										if(tags[i].myText == tags[j].myText){
											tags[j].parentNode.removeChild(tags[j]);
										} else {
											j++;
										}
									}
								}

								if(attr.length && tags.length > attr.length){
									while(tags.length > attr.length){
										tags[attr.length] && tags[attr.length].parentNode.removeChild(tags[attr.length]);
									}
								}

								for(i = 0, len = tags.length; i < len; i++){
									fs = tags[i];
									rTags.push(fs);
									r.push(fs.myText);
								}

								that.value = r.join(attr.split);
								that.isOk = true;
							}

							that.srcBox.check();
						},

						myTags = that.value.split(attr.split);

					//初始化	
					for(i = 0, len = myTags.length; i < len; i++){
						buildTag(myTags[i]);

					}

					//添加词条
					that.add = function(txt){
						buildTag(txt);
						tagCheck();
					};

					//删除词条
					that.remove = function(txt){
						var tags = tagsArea.getElementsByTagName("a"),
							fs;

						for(var i = 0, len = tags.length; i < len; i++){
							fs = tags[i];
							fs && fs.myText == txt && fs.parentNode.removeChild(fs);
						}

						tagCheck();
					};

					!that.defaultText && (that.defaultText = "输入单词后请按回车 或 "+ attr.split +" 生成词条");
					!that.errorText && (that.errorText = "不能为空");

					that.localCheck = function(){
						return that.isOk;
						
					};
					that.srcBox.srcItems.push(that);
				},

				//多 or 单选
				checkbox:function(elm,attr){
					var that = elm,
						myType = elm.type.toLowerCase(),
                        myParent = elm.parentNode,
                        mySiblings = myParent.children,
						checkbox, checkboxCnt, checkboxImg, checkboxIpt, onchangeHandle;


					!attr.imgWidth && (attr.imgWidth = 100);
					!attr.imgHeight && (attr.imgHeight = 100);
					

					$(that).addClass(myType == "checkbox"?"bs_chkbox":"bs_rdobox");
					
                    
                    if(that.parentNode.className.indexOf('bs_checkarea') != -1){
						checkbox = that.parentNode;
						checkboxCnt = $(checkbox).find('.cnt')[0];

					} else {
						checkbox = document.createElement("label");
						checkbox.className = "bs_checkarea";

						checkboxCnt = document.createElement("span");
						checkboxCnt.className = "cnt";

                        that.srcBox.appendChild(checkbox);
						checkbox.appendChild(that);
					}
					


					
					checkboxCnt.innerHTML = attr.title;


					

					if(!that.srcBox.index){
						that.srcBox.index = 0;
					}

					if(attr.img){
						checkboxImg = $(checkbox).find('.img')[0];
						if(!checkboxImg){
							checkboxImg = new Image();
							checkboxImg.className = "img";
							checkbox.appendChild(checkboxImg);
						}
						
						checkboxImg.width = attr.imgWidth;
						checkboxImg.height = attr.imgHeight;
						checkboxImg.src = attr.img;
						

						checkbox.style.width = attr.imgWidth + "px";
						$(checkbox).addClass("bs_checkarea_withimg");
					}

					checkbox.appendChild(checkboxCnt);

					if(attr.format == "other"){

						checkboxIpt = $(checkbox).find('.ipt')[0];
						if(!checkboxIpt){
							checkboxIpt = document.createElement("input");
							checkboxIpt.className = "ipt";
							checkbox.appendChild(checkboxIpt);

							//事件绑定
							checkboxIpt.onfocus = function(){
								this.srcCheck.checked = true;
								$(that).trigger("change");
							};

							checkboxIpt.onblur = function(){
								this.value = this.value.trim();
								
								this.srcCheck.value = this.value;
								this.srcCheck.checked = this.value? true:false;
								$(that).trigger("change");
							};
						}
						
						checkboxIpt.srcCheck = that;


					}

                    if(!that.id){
                        that.id = that.srcBox.frontName + that.name + "chk" + that.srcBox.index++
                    }
					checkbox.htmlFor = that.id;

					if(myType == "checkbox"){
						onchangeHandle = function(){
							this.checked? (
								$(this).parent().addClass("bs_checkarea_cur"),
								checkboxIpt && checkboxIpt.focus()

							):(
								$(this).parent().removeClass("bs_checkarea_cur")
							);
						};

					} else if(myType == "radio"){
						onchangeHandle = function(){
							$(this).parent().addClass("bs_checkarea_cur").siblings(".bs_checkarea").removeClass("bs_checkarea_cur");

							checkboxIpt && checkboxIpt.focus();
						};
					
					}

					$(that).change(onchangeHandle);
					that.checked && $(that).trigger("change");

					!that.defaultText && (that.defaultText = "请选择");
					!that.errorText && (that.errorText = "请选择");
					that.localCheck = function(){
						return this.checked;
					};
					that.srcBox.srcItems.push(that);
				},

				//自动补全
				autocomplete:function(elm,attr){
					var that = elm,
						drawbox;

					//自动完成
					if(attr.autocomplete){
						that.autocomplete = "off";

						drawbox = document.createElement("div");
						drawbox.className = "bs_drawbox";
						drawbox.style.display = "none";
						drawbox.innerHTML = [
							'<span>请选择或继续输入…</span>',
							'<div></div>'
						].join("");


						//异步
						if(/^http[s]*:\/\/[^,]+$/ig.test(attr.autocomplete) && attr.actionType && attr.method){

							drawbox.init = function(target){
								var ajaxHandle = function(){
										var myValue = target.value.trim(),
											htmlstr = "",
											i,len,fs,
											l1Index,
											txtLen,
											isAdd,
											r;
										target.myIndex = -1;
										

										var param = {};

										param[attr.actionKey || target.name] = target.value;

										param._ = new Date().getTime();

										!isNaNFn(attr.onsubmit) && (param = attr.onsubmit(param));

										if(!param){
											return;
										}

										target.srcBox.loading.init();
										$.ajax({
											"url":attr.autocomplete,
											"data":param,
											"success":function(json){
												if(target.srcBox.loading.isTimeout){
													return;
												}
												target.srcBox.loading.clear();

												var myAttr = {
													data: getObjByKey(json,attr.dataKey),
													status: getObjByKey(json,attr.statusKey),
													msg: getObjByKey(json,attr.messageKey)
												};

                                                console.log(myAttr);

                                                if(myAttr.status == attr.successCode){
													drawbox.myAutos = myAttr.data;

												} else {
													drawbox.myAutos = [];
												}

												if(drawbox.myAutos.length === 0){
													drawbox.hide();
													return;

												} else {
													for(i = 0, len = drawbox.myAutos.length; i < len; i++){
														fs = drawbox.myAutos[i];
														fs !== "" && (htmlstr += '<a href="javascript:;">'+ fs +'</a>');
													}
													drawbox.children[1].innerHTML = htmlstr;
													drawbox.show(target);
												}


											},
											"dataType":attr.actionType == "jsonp"?"jsonp":"json",
											"type":attr.method || "GET"
										});
									};
								if(attr.actionDelay){
									clearTimeout(drawbox.delayKey);
									drawbox.delayKey = setTimeout(ajaxHandle, attr.actionDelay);
								} else {
									ajaxHandle();
								}
								
								
							};
						} else {
							drawbox.myAutos = attr.autocomplete.split(",");

							drawbox.init = function(target){
								var myValue = target.value.trim(),
									htmlstr = "",
									i,len,fs,
									l1Index,
									txtLen,
									isAdd,
									r;
								target.myIndex = -1;
								
								if(myValue === ""){
									this.hide(); 
									return;
								}

								for(i = 0, len = this.myAutos.length; i < len; i++){
									fs = this.myAutos[i].trim();
									isAdd = fs.substr(0,1) == "*";
									if((isAdd && !fs.substr(1)) || !fs){
										continue;
									}
									
									r = "";

									if(isAdd){
										l1Index = myValue.indexOf(fs.substr(1,1));
										txtLen = l1Index != -1? myValue.substr(l1Index).length:0;
										if(l1Index == -1){
											r = myValue + fs.substr(1);

										} else if(myValue.substr(l1Index,txtLen) == fs.substr(1,txtLen)){
											r = myValue.substr(0,l1Index) + fs.substr(1);
										}

									} else if(myValue == fs.substr(0,myValue.length)){
										r = fs;

									}

									r && (htmlstr += '<a href="javascript:;">'+ r +'</a>');
								}


								htmlstr? (
									this.children[1].innerHTML = htmlstr,
									this.show(target)

								):(
									this.hide()
								);
								
							};
						}

						

						//下拉框距离target的垂直距离
						drawbox.distance = 1;

						drawbox.show = function(target){
							if(!target){return;}
							var o = getPosition(target);

							this.style.display = "";
							this.style.left = o.left + "px";
							this.style.top = target.offsetHeight + o.top + this.distance + "px";

							var fTarget = $(".bs_inset_frame")[0],
								appendTarget = fTarget && isBelong(fTarget,that)?fTarget:document.body;
								
							appendTarget.appendChild(this);
							var myZIndex = getTopperZIndex(that) || 1;
							!isNaN(myZIndex) && (this.style.zIndex = Number(myZIndex) + 5);
						};

						drawbox.hide = function(){
							this.style.display = "none";
						};

						

						$(that).bind("keyup",function(e){
							e = e || window.event;
							if(this.isChinese){
								drawbox.init(this);

							} else {
								//up down enter
								if(e.keyCode == 38 || e.keyCode == 40 || e.keyCode == 13){
									return;
								} else {
									drawbox.init(this);
								}
							}
						});

						$(that).bind("focus",function(){
							drawbox.init(this);
							clearTimeout(this.blurTimeoutKey);
						});

						$(that).bind("keydown",function(e){
							e = e || window.event;
							var as = drawbox.getElementsByTagName("a"),
								i,len;
							if(this.myIndex === undefined){
								this.myIndex = -1;
							}

							//是否在用中文输入法
							if(e.keyCode == 229){
								this.isChinese = true;
							} else {
								this.isChinese = false;
							}

							switch(e.keyCode){
								//up
								case 38:
									for(i = 0, len = as.length; i < len; i++){
										as[i].className = "";
									}
									this.myIndex -1 >= 0? this.myIndex -= 1:this.myIndex = as.length - 1;
									as[this.myIndex].className = "cur";
									break;
								//down
								case 40:
									for(i = 0, len = as.length; i < len; i++){
										as[i].className = "";
									}

									this.myIndex +1 <= as.length - 1?this.myIndex += 1:this.myIndex = 0;
									as[this.myIndex].className = "cur";
									break;

								//enter
								case 13:

									if(as[this.myIndex]){
										this.value = as[this.myIndex].innerHTML;
										drawbox.hide();
										e.preventDefault && e.preventDefault();
										e.returnValue = false;

									} else {
										drawbox.init(this);

									}
									break;

								//tab
								case 9:
									drawbox.hide();
									break;


								default:
									drawbox.init(this);
									break;
							}
						});

						$(that).bind("blur",function(){

							clearTimeout(this.blurTimeoutKey);
							this.blurTimeoutKey = setTimeout(function(){
								drawbox.hide();
							},1000);
						});

						$(drawbox).bind("mouseover",function(e){
							e = e || window.event;
							var srcElement = e.target || e.srcElement;
							if(srcElement.tagName == "A"){
								var as = this.getElementsByTagName("a");
								for(var i = 0, len = as.length; i < len; i++){
									if(as[i] == srcElement){
										that.myIndex = i;
										as[i].className = "cur";
									} else {
										as[i].className = "";
									}
								}
							}
						});
						$(drawbox).bind("click",function(e){
							that.srcBox.notice();
							e = e || window.event;
							var srcElement = e.target || e.srcElement;
							if(srcElement.tagName == "A"){
								that.focus();
								that.value = srcElement.innerHTML;
								that.blur();
								drawbox.hide();
								if("preventDefault" in e){
									e.preventDefault();
								} else {
									e.returnValue = false;
								}
							}
						});

						$(".bs_inset_frame").length > 0? $(".bs_inset_frame").append(drawbox): document.body.appendChild(drawbox);
					}
				},

				//按钮
				button:function(elm,attr){
					var that = elm;

					mod.button(that);
				},

				//textarea
				textarea:function(elm,attr){
					var that = elm;

					$(that).addClass("bs_textareabox");
					!that.defaultText && (that.defaultText = "请输入");
					!that.errorText && (that.errorText = "不能为空");
					

					that.myReg = makeFunction(attr.format);
					that.localCheck = function(){
						that.value = that.value.trim();
						if(that.value === ""){
							that.srcBox.error(that.defaultText);
							return false;

						}

						if(that.myReg instanceof RegExp){
							
							if(that.value.match(that.myReg)){
								return that.extCheck();
							} else {
								that.srcBox.error(that.errorText);
								return false;
							}

						}

						return that.extCheck();
					};
					that.srcBox.srcItems.push(that);
				},

				//select 框
				selectbox:function(elm,attr){
					var that = elm,
						isAjax = attr.action && attr.method,
						myValue = that.value,
						selectElm, 
						i, len, fs, fBelong, fValues = [],
						ops = [],
						key,
						insetHandle = function(){
							var i, len, fs, fBelong, fValues = [],
								j, jlen,
								ops = [];

							//获取linked值
							for(i = 0, len = that.linked.options.length; i < len; i++){
								fs = that.linked.options[i];
								fs.selected && fValues.push(fs.value);
							}

							for(i = 0, len = fValues.length; i < len; i++){
								fs = fValues[i];
								that.myOp[fs] && (ops = ops.concat(that.myOp[fs]));
							}
							that.innerHTML = "";

							for(i = 0, len = ops.length; i < len; i++){
								that.options[i] = new Option();
								that.options[i].text = ops[i].text;
								that.options[i].value = ops[i].value;

								for(j = 0, jlen = fValues.length; j < jlen; j++){
									fValues[j] == that.options[i].value && (that.options[i].selected = true);
								}
							}
						};


					$(that).addClass("bs_selectbox");

					that.linked = $(attr.linked)[0];



					if(that.linked){
						!that.linked.myChild && (that.linked.myChild = []);
						that.linked.myChild.push(that);
						that.myOp = {
							"":{"text":"请选择","value":""}
						};

						for(i = 0, len = that.options.length; i < len; i++){
							fs = that.options[i];
							fBelong = $(fs).attr("mod-belong");
							!that.myOp[fBelong] && (that.myOp[fBelong] = []);
							!that.myOp[fBelong].push({
								"text": fs.text,
								"value": fs.value
							});
						}

						insetHandle();

						$(that.linked).change(isAjax?function(){
							that.ajaxHandle();
							//..

						}:function(){
							var fValues = [],
								i, fs, len, j, jlen, fBelong,
								ops = that.myOp[this.value] || [];

							insetHandle();
							$(that.linked.myChild).change();
						});
					}

					/*if(that.linked){
						that.onclick = function(){
							$(that.linked).change();
						};
					}*/



					if(isAjax){
						!that.ajaxData && (that.ajaxData = {});
						//select重置
						that.reset = function(){
							that.innerHTML = "";
							that.options[0] = new Option();
							that.options[0].text = "请选择";
							that.options[0].value = "";
							
						};
						//select数据填充
						that.dataFill = function(data){
							that.reset();
							var fo;
							
							if(!data){return;}
							for(var i = 0, len = data.length; i < len; i++){
								fo = new Option();
								if(typeof data[i] == "object"){
									fo.value = data[i].value;
									fo.text = data[i].text;
								} else {
									fo.text = fo.value = data[i];
								}
								
								fo.value == myValue && (fo.selected = true);
									
								
								that.options.add(fo);
								
							}
						};
						that.ajaxHandle = function(){
							var myValue = that.value,
								myData = that.linked ? that.ajaxData[that.linked.value]: that.nowData,
								actionKey,
								myAjaxVal,
								myAjaxUrl,
								param = {};

							if((that.linked && that.nowData && that.ajaxData[that.linked.value] == that.nowData) || !that.linked && that.nowData){
								return;
							}

							if(myData){
								that.dataFill(myData);
								that.nowData = myData;
								that.linked && (that.ajaxData[that.linked.value] = myData);

							} else {
								actionKey = attr.actionKey;
								myAjaxVal = that.linked?that.linked.value:"";
								
								if(actionKey){
									param[actionKey] = myAjaxVal;
									myAjaxUrl = attr.action;
								} else {
									myAjaxUrl = attr.action;
								}

								param._ = new Date().getTime();
											
								that.srcBox.loading.init(function(){
									that.nowData = undefined;
									that.linked && (that.ajaxData[that.linked.value] = undefined);

								},'获取数据ing');
								
								$.ajax({
                                    "url":urlRender(myAjaxUrl),
									"data":param,
									"success":function(json){
										if(that.srcBox.loading.isTimeout){
											return;
										}
										that.srcBox.loading.clear();
										
										var myAttr = {
											status: getObjByKey(json,attr.statusKey),
											data: getObjByKey(json,attr.dataKey),
											msg: getObjByKey(json,attr.messageKey)
										};
										if(myAttr.status == attr.successCode){
											that.reset();
											var fo;
											for(var i = 0, len = myAttr.data.length; i < len; i++){
												fo = new Option();
												if(typeof myAttr.data[i] == "object"){
													fo.value = myAttr.data[i].value;
													fo.text = myAttr.data[i].text;
												} else {
													fo.value = fo.text = myAttr.data[i];
												}
												
												fo.value == myValue && (fo.selected = true);
													
												
												that.options.add(fo);
												
											}

											
											that.nowData = myAttr.data;
											that.linked && (that.ajaxData[that.linked.value] = myAttr.data);

										} else {
											that.srcBox.error(myAttr.msg);
											that.nowData = undefined;
											that.linked && (that.ajaxData[that.linked.value] = undefined);
										}

										attr.actionCallback && attr.actionCallback(json, param);
										attr.defaultValue && !function(){
											for(i = 0, len = that.options.length; i < len; i++){
												fs = that.options[i];
												if(fs.value == attr.defaultValue){
													fs.selected = true;

													//去除请选择
													that.options[0].value == "" && that.options.remove(that.options[0]);
													return;
												}
												
											}
										}();
									},
									"dataType":attr.actionType == "jsonp"?"jsonp":"json",
									"type":attr.method || "GET"
								});
							}
						};

						!that.linked && that.ajaxHandle();
					}
					
					

					switch(attr.format){

						case "city":
                            var citiesInit = function(){///{
                                    selectElm = document.createElement("select");
                                    selectElm.className = "bs_selectbox";
                                    that.parentNode.insertBefore(selectElm,that);

                                    for(key in global.Config.data.cities){
                                        if(global.Config.data.cities.hasOwnProperty(key)){
                                            selectElm.options.add(new Option(key||"请选择",key));
                                        }
                                    }

                                    onchangeHandle = function(){
                                        that.innerHTML = "";
                                        for(var i = 0, fs, len = global.Config.data.cities[this.value].length; i < len; i++){
                                            fs = global.Config.data.cities[this.value][i];
                                            that.options.add(new Option(fs,fs));
                                        }
                                    };

                                    $(selectElm).change(onchangeHandle);
                                    

                                    if(myValue){
                                        for(key in global.Config.data.cities){
                                            if(global.Config.data.cities.hasOwnProperty(key) && new RegExp("[,]*"+ myValue +"[,]*","g").test(global.Config.data.cities[key].join(","))){
                                                selectElm.value = key;
                                                onchangeHandle.call(selectElm);
                                                that.value = myValue;
                                                break;
                                            }
                                        }
                                    }
                                };///}
                            if(!global.Config.data.cities){
                                global.jcLoader({
                                    url: global.Config.domain + 'js/data/cities.js',
                                    type: 'js'
                                }, citiesInit);
                            } else {
                                citiesInit();
                            }
						
							break;

						default:
							break;

					}

					!that.defaultText && (that.defaultText = "请选择");
					!that.errorText && (that.errorText = "不能为空");
					attr.defaultValue && !isAjax && !function(){
						for(i = 0, len = that.options.length; i < len; i++){
							fs = that.options[i];
							if(fs.value == attr.defaultValue){
								fs.selected = true;
								return;
							}
							
						}
					}();

					that.localCheck = function(){
						
						if(that.value === ""){
							that.srcBox.error(that.defaultText);
							return false;

						}
						return that.extCheck();
					};
					that.srcBox.srcItems.push(that);
				},

				//验证码
				code:function(elm,attr){
					var that = elm;

					$(that).addClass("bs_textbox");

					!that.defaultText && (that.defaultText = "请输入验证码");
					!that.errorText && (that.errorText = "验证码错误");
					that.mySize = attr.size;
					that.localCheck = function(){
						that.value = that.value.trim();
						if(that.value === ""){
							that.srcBox.error(that.defaultText);
							return false;

						}
						if(!isNaN(that.mySize) && that.value.length != that.mySize){
							that.srcBox.error(that.errorText);
							return false;
						}

						return that.extCheck();
					};

					that.srcBox.srcItems.push(that);
				},

				email:function(elm,attr){
					var that = elm;

					$(that).addClass("bs_textbox");

					that.defaultText = "请输入电子邮箱";
					that.localCheck = function(){
						that.value = that.value.trim();
						if(!that.value.match(global.Config.reg.email)){
							that.srcBox.error("请输入可用的邮箱地址");
							return false;
						} else {
							return that.extCheck();
						}
					};
					that.srcBox.srcItems.push(that);

					attr.autocomplete = [
						"*@qq.com",
						"*@163.com",
						"*@126.com",
						"*@sina.com",
						"*@gmail.com",
						"*@sohu.com",
						"*@hotmail.com",
						"*@139.com",
						"*@189.cn",
						"*@wo.com.cn"
					].join(",");
				},

				mobile:function(elm,attr){
					var that = elm;

					$(that).addClass("bs_textbox");

					that.defaultText = "请输入手机号码";
					that.localCheck = function(){
						that.value = that.value.trim();
						if(that.value === ""){
							that.srcBox.error(that.defaultText);
							return false;

						}else if(!that.value.match(global.Config.reg.mobile)){
							that.srcBox.error("请输入可用的手机号码");
							return false;

						} else {
							return that.extCheck();
						}
					};
					that.srcBox.srcItems.push(that);
				},

				//身份证
				idcard:function(elm,attr){
					var that = elm;

					$(that).addClass("bs_textbox");

					!that.defaultText && (that.defaultText = "请正确填写身份证号码");
					!that.errorText && (that.errorText = "请正确填写身份证号码");
					
					that.localCheck = function(){
						var num = that.value = that.value.trim(),
							len = num.length, 
							re,arrSplit,dtmBirth,bGoodDay,arrInt,arrCh,nTemp,i,valnum,snum;


						if(!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(num))){
							that.srcBox.error(that.errorText);
							return false;
						}
						if(len == 15){
							re = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
							arrSplit = num.match(re);

							//检查生日日期是否正确
							dtmBirth = new Date('19' + arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4]);
							bGoodDay = (dtmBirth.getYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
							if(!bGoodDay){
								that.srcBox.error(that.errorText);
								return false;
							} else {
								return that.extCheck();
							}
						} else if(len == 18){
							re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
							arrSplit = num.match(re);
							//检查生日日期是否正确
							dtmBirth = new Date(arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]);
							bGoodDay = (dtmBirth.getFullYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
							if (!bGoodDay){
								that.srcBox.error(that.errorText);
								return false;

							} else {
								//检验18位身份证的校验码是否正确。
								//校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
								arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
								arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
								nTemp = 0, i;
								for(i = 0; i < 17; i ++){
									nTemp += num.substr(i, 1) * arrInt[i];
								}
								valnum = arrCh[nTemp % 11];
								if(valnum != num.substr(17, 1)){
									that.srcBox.error(that.errorText);
									return false;
								}
								return that.extCheck();
							}
						}

						that.srcBox.error(that.errorText);
						return false;
					};

					that.srcBox.srcItems.push(that);
				},

				//日期
				date:function(elm,attr){
					var that = elm,
						fTarget = $(".bs_inset_frame")[0];

					$(that).addClass("bs_textbox");

					!that.defaultText && (that.defaultText = [
						"请选择",
						(attr.dateStart?"大于 " + attr.dateStart:""),
						(attr.dateEnd?"小于 " + attr.dateEnd:""),
						(attr.dateStart || attr.dateEnd?"的":""), 
						"日期"
					].join(""));

					global.jnsCalendar(that,{
						type:"date",
						zIndex:200,
						format:"YYYY-MM-DD",
						dateRangeStart:attr.dateStart,
						dateRangeEnd:attr.dateEnd,
						callback:function(){
							that.srcBox.check();
						},
						onload:function(){
							var fTarget = $(".bs_inset_frame")[0],
								appendTarget = fTarget && isBelong(fTarget,that)?fTarget:document.body;
								
							appendTarget.appendChild(this);


							var myZIndex = getTopperZIndex(that) || 1;
							!isNaN(myZIndex) && (this.style.zIndex = Number(myZIndex) + 5);

						},
						appendTarget:fTarget && isBelong(fTarget,that)?fTarget:document.body
					}).init();
					
					that.localCheck = function(){
						that.value = that.value.trim();

						if(that.value === ""){
							that.srcBox.error(that.defaultText);
							return false;
							
						} else {
							return that.extCheck();
						}
					};
					

					that.srcBox.srcItems.push(that);
				},

				//日期时间
				datetime:function(elm,attr){
					var that = elm,
						fTarget = $(".bs_inset_frame")[0];

					$(that).addClass("bs_textbox");

					!that.defaultText && (that.defaultText = [
						"请选择",
						(attr.dateStart?"大于 " + attr.dateStart:""),
						(attr.dateEnd?"小于 " + attr.dateEnd:""),
						(attr.dateStart || attr.dateEnd?"的":""), 
						"日期"
					].join(""));

					
					global.jnsCalendar(that,{
						zIndex:200,
						type:"dateTime",
						format:"YYYY-MM-DD hh:mm:ss",
						dateRangeStart:attr.dateStart,
						dateRangeEnd:attr.dateEnd,
						callback:function(){
							that.srcBox.check();
						},
						onload:function(){
							var fTarget = $(".bs_inset_frame")[0],
								appendTarget = fTarget && isBelong(fTarget,that)?fTarget:document.body;
								
							appendTarget.appendChild(this);


							var myZIndex = getTopperZIndex(that);
							!isNaN(myZIndex) && (this.style.zIndex = Number(myZIndex) + 5);
						},
						appendTarget:fTarget && isBelong(fTarget,that)?fTarget:document.body
					}).init();

					that.localCheck = function(){
						that.value = that.value.trim();

						if(that.value === ""){
							that.srcBox.error(that.defaultText);
							return false;
							
						} else {
							return that.extCheck();
						}
					};

					$(that).change(function(){
						that.srcBox.check();
					});

					that.srcBox.srcItems.push(that);
				},

				//日期区间
				dateInterval:function(elm,attr){
					var that = elm,
						fTarget = $(".bs_inset_frame")[0];

					$(that).addClass("bs_textbox");

					!that.defaultText && (that.defaultText = [
						"请选择",
						(attr.dateStart?"大于 " + attr.dateStart:""),
						(attr.dateEnd?"小于 " + attr.dateEnd:""),
						(attr.dateStart || attr.dateEnd?"的":""), 
						"日期"
					].join(""));

					
					that.linked = $(attr.linked)[0];

					if(that.linked){
						$(that.linked).addClass("bs_textbox");
						global.jnsCalendar([that,that.linked],{
							zIndex:200,
							type:"intervalTime",
							startDateInput:that,
							endDateInput:that.linked,
							dateRangeStart:attr.dateStart,
							dateRangeEnd:attr.dateEnd,
							callback:function(){
								that.srcBox.check();
							},
							onload:function(){
								var fTarget = $(".bs_inset_frame")[0],
								appendTarget = fTarget && isBelong(fTarget,that)?fTarget:document.body;
								
								appendTarget.appendChild(this);

								var myZIndex = getTopperZIndex(that);
								!isNaN(myZIndex) && (this.style.zIndex = Number(myZIndex) + 5);
							},
							appendTarget:fTarget && isBelong(fTarget,that)?fTarget:document.body
						}).init();
					}
					
					
					that.localCheck = function(){
						that.value = that.value.trim();

						if(that.value === ""){
							that.srcBox.error(that.defaultText);
							return false;
							
						} else {
							return that.extCheck();
						}
					};

					$(that).change(function(){
						that.srcBox.check();
					});

					that.srcBox.srcItems.push(that);
				},

				//密码
				password:function(elm,attr){
					var that = elm;

					$(that).addClass("bs_textbox");

					that.defaultText = "密码需由 6-16个字母、数字和符号组成";

					that.localCheck = function(){
						var v = that.value = that.value.trim();
						if(!v.match(global.Config.reg.password)){
							that.srcBox.error("请输入6-16位的数字或字符");
							return false;
						} else{
							return that.extCheck();
						}
					};
					that.srcBox.srcItems.push(that);
				},

				//重复密码
				password2:function(elm,attr){
					var that = elm;

					$(that).addClass("bs_textbox");

					that.defaultText = "请再次输入密码";
					that.linked = $(attr.linked)[0];
					that.localCheck = function(){
						var v = that.value = that.value.trim();

						if(!that.linked){
							return true;
						}

						if(that.linked.value === "" && that.value === ""){
							that.srcBox.notice();
							return false;

						} else if(that.linked.value !== "" && that.value === ""){
							that.srcBox.error("请重复密码进行确认");
							return false;

						} else if(that.linked.value !== that.value){
							that.srcBox.error("两次密码不一致");
							return false;

						} else {
							return that.linked.localCheck() && that.extCheck();
						}
					};
					$(that.linked).bind("blur",function(){
						that.localCheck();
					});
					that.srcBox.srcItems.push(that);
				},

				//默认的控件（非空检测）
				custom:function(elm,attr){
					var that = elm;

					$(that).addClass("bs_textbox");

					!that.defaultText && (that.defaultText = "请输入");
					!that.errorText && (that.errorText = "不能为空");
					

					that.myReg = makeFunction(attr.format,"reg");
                    
					that.localCheck = function(){
						that.value = that.value.trim();
						if(that.value === ""){
							that.srcBox.error(that.defaultText);
							return false;

						}

						if(that.myReg instanceof RegExp){
							
							if(that.value.match(that.myReg)){
								return that.extCheck();
							} else {
								that.srcBox.error(that.errorText);
								return false;
							}

                        } else if(that.myReg instanceof Function){
                            var r = that.myReg(that.value)
                            switch(r){
                                case undefined:
                                case true:
                                    return that.extCheck();

                                default:
                                    that.srcBox.error(r);
                                    return false;
                            }
                        }

						return that.extCheck();
					};

					that.srcBox.srcItems.push(that);
					
				}
			},
			
			key,i,len,onchangeHandle,drawbox,myAutos;

		
		//赋值
		option = modAssignment(option,op);

		if($tar.length === 0){
			return;
		}

		$tar.each(function(){
			var that = this,
				attr = modAssignment(option,that);

			

			pack.init(that,attr);
		});

		

		
	    return $tar[0];
	},
	/**
	 * 按钮控件
	 * @param  {object} target 需要执行模块化的对象
	 * @param  {object} op     参数设置
	 *
	 *                  - size  [string] 按钮大小 small|big|不填 
	 *                  - type  [string] 按钮类型 submit|clear|1|2|3
	 *                                   蓝色 submit|1
	 *                                   绿色 2
	 *                                   白色 clear|3
	 * @return {void} 
	 */
	button: function(target,op) {
		var $tar = target ? $(target) : $(".bs_btn"),
			option = {
				size:"",
				type:""
			},
			key;

		
		//赋值
		option = modAssignment(option,op);

		//重构
		$tar.each(function() {

			var me = this,
				myClass = "",
				attr = modAssignment(option,me),
				mySize = attr.size,
				myType = attr.type,
				ta, fa, fp, ft, fm;

			if(isEqual(me.opAttr,attr) || (me.parentNode && /bs_btn_/.test(me.parentNode.className))){
				return;
			}

			switch (attr.size) {
				case "big":
					myClass += "bs_btn_big";
					break;
				case "small":
					myClass += "bs_btn_small";
					break;
				default:
					myClass += "bs_btn_small";
					break;
			}
			switch (attr.type) {
				case "1":
				case "submit":
					myClass += " bs_btn_s01";
					break;

				case "2":
					myClass += " bs_btn_s02";
					break;

				case "clear":
					myClass += " bs_btn_s03";
					break;

				default:
					myClass += " bs_btn_s03";
					break;
			}


			switch (me.tagName.toLowerCase()) {
				case "input":
					fa = document.createElement("span");
					fp = me.parentNode;
					
					fa.href = "javascript:;";
					fp.insertBefore(fa, me);
					fa.appendChild(me);
					$(fa).addClass(me.className).removeClass("bs_btn").addClass(myClass);
					me.className = "";
					ta = fa;
					break;

				case "a":
					me.innerHTML = '<span>' + me.innerHTML + '</span>';
					$(me).addClass(myClass).removeClass("bs_btn");
					ta = me;
					break;

				default:
					fa = document.createElement("a");
					fp = me.parentNode;
					ft = me.textContent || me.innerText;
					fm = document.createDocumentFragment();

					fa.href = "javascript:;";
					fp.insertBefore(fa, me);
					fa.innerHTML = '<span>' + ft + '</span>';
					fm.appendChild(me);
					$(fa).addClass(myClass).removeClass("bs_btn");
					ta = fa;
					break;
			}

			//事件绑定
			me.disable = function() {
				$(ta).addClass("bs_btn_disable");
				me.disabled = true;
			};
			me.enable = function() {
				$(ta).removeClass("bs_btn_disable");
				me.disabled = false;
			};
			
			me.opAttr = attr;
		});
		
		return $tar[0];
	},
	/**
	 * 列表控件初始化
	 * @param  {object} target 需要执行模块化的对象
	 * @param  {object} op     参数设置
	 *
	 *                  - action         [string]        异步请求的地址
	 *                  - method         [string]        异步请求的方式 GET|POST 
	 *                  - actionType     [string]        异步请求的途径 ajax|jsonp
	 *                  - actionParam    [object]        异步请求的参数
	 *                  - onload         [function]      异步请求成功后执行的方法
	 *
	 *                  - page           [number]        当前页
	 *                  - pageStart      [number]        从第几页开始为第一页默认跟Config一致
	 *                  - pagesize       [number]        单页可展示的数据量
	 *
	 *                  - checkbox       [boolean]       是否拥有checkbox
	 *                  - drag           [boolean]       是否拥有可调整位置按钮
	 *                  - index          [boolean]       是否拥有序号
	 *
	 *                  - layout         [Array]         输出的格式。若不填则直接输出数据键值和内容
	 *                                                   {
	 *                                                       name  : 列显示的 标题
	 *                                                       field : 列标题对应数据的 键值
	 *                                                       width : 列宽度
	 *                                                       html  : 列内容 支持简单模板变量形式如
	 *                                                       <a href="../do.php?id={$id}">{$name}</div>
	 *                                                       
	 *                                                       edit  : 编辑用属性设置
	 *                                                               
	 *                                                       
	 *                                                   }
	 *
	 *                  - pageKey        [string]        当前页 对应的json 属性。默认与Config一致
	 *                  - dataKey        [string]        数据 对应的json 属性。默认与Config一致
	 *                  - messageKey     [string]        错误信息对应的json 属性。默认与Config一致
	 *                  - statusKey      [string]        状态信息对应的json 属性。默认与Config一致
	 *
	 *                  - data           [number]        数据。当填写有数据并且 action 不填时，直接输出数据，并不作分页处理
	 *
	 * @return {object} 初始化完成的对象 grid
	 *                  - grid.get(type)                 获取数据 
	 *                                                   checked  当前页选中的数据
	 *                                                   tr elm   当前tr对应的数据
	 *                                                   index    当前页中对应的第几条数据
	 *                                                   不填      当前页的数据 
	 *
	 *                  - grid.add(data,callback,index)  添加数据（重复数据不会添加）
	 *                                                   data     数据源  
	 *                                                   callback 回调方法
	 *                                                   index    判断内容是否重复的键值，如果不填则整条数据都一样才算重复
	 *
	 *                  - grid.remove(source,callback)   移除数据（重复数据不会添加）
	 *                                                   source   数据源/tr elm  
	 *                                                   callback 回调方法
	 *                  - grid.total                     数据总数 
	 *                  - grid.page                      当前页 
	 *                  - grid.pagesize                  单页可展示的数据量
	 *                  - grid.pageTo()                  翻到第几页
	 *                  - grid.reload()                  刷新当前页面
	 */
	grid: function(target,op,needReset){
		
		var option = {
				title:"",

				action:"",
				actionType:"",
				actionMethod:"",
				actionParam:{},
				actionCallback:function(){},
				onload:function(){},
				onsubmit:function(){},
                onresponse:function(){},
				
                //当前页(r/w)
				page:0,
				//从第几页开始为第一页
				pageStart:global.Config.ajax.key.pageStart,
				//当前页 对应的json 属性
				pageKey:global.Config.ajax.key.page,

				//一页多少条数据(r/w)
				pagesize:10,
				//一页多少条数据 对应的json 属性
				sizeKey:global.Config.ajax.key.size,

				//总共多少条数据 对应的json 属性
				totalKey:global.Config.ajax.key.total,

				//数据(r/w)
				data:[],

				//是否拥有 checkbox
				checkbox:true,

				//是否拥有可调整位置按钮
				drag:false,

				//是否拥有序号
				index:true,

				//是否一行显示
				nowrap:false,

				//数据 对应的json 属性
				dataKey:global.Config.ajax.key.data,

				//错误信息对应的json 属性
				messageKey:global.Config.ajax.key.message,

				//状态信息对应的json 属性
				statusKey:global.Config.ajax.key.status,
                
                //成功返回的状态码
                successCode: global.Config.ajax.successCode,
			
                //异步请求最大超时时间 0 为 跟 Config 默认
				timeout:0,
                
                // 是否需要将当前 表格的 页码记录在 地址栏上面
                mark: false,

				//是否可编辑
				edit:false,

				//修改操作设置
				editConfig:{
					action:"",
					method:"",
					actionType:"",
					actionCallback:function(){},
					onsubmit:function(){},
					submitCallback:function(){},
					onresponse:function(){},
					//错误信息对应的json 属性
					messageKey:global.Config.ajax.key.message,

					//状态信息对应的json 属性
					statusKey:global.Config.ajax.key.status,
                    
                    //成功返回的状态码
                    successCode: global.Config.ajax.successCode
				},

				//是否可删除
				del:false,

				//删除操作设置
				delConfig:{
					action:"",
					method:"",
					actionType:"",
					actionCallback:function(){},
					onsubmit:function(){},
					submitCallback:function(){},
					onresponse:function(){},
					//错误信息对应的json 属性
					messageKey:global.Config.ajax.key.message,

					//状态信息对应的json 属性
					statusKey:global.Config.ajax.key.status,
                    
                    //成功返回的状态码
                    successCode: global.Config.ajax.successCode,

					batchConfig:{
						enable:false,
						action:"",
						method:"",
						actionType:"",
						actionCallback:function(){},
						onsubmit:function(){},
						submitCallback:function(){},
						onresponse:function(){},
						//错误信息对应的json 属性
						messageKey:global.Config.ajax.key.message,

						//状态信息对应的json 属性
						statusKey:global.Config.ajax.key.status,
                        
                        //成功返回的状态码
                        successCode: global.Config.ajax.successCode
					}
				},

				//是否可添加
				add:false,

				addConfig:{
					target:undefined,
					text:"添加到其他列表",
					width:100,
					index:"",
					batchConfig:{
						enable:false
					}
				},



				//列表
				layout:[
					/*
					{
						"name":"列表1",
						"field":"id",
						"width":"100px",
						"html":'<div class="fu">{$id}</div>',
						"edit":{
							type:"input",
							check:function(val){return true}
						}
					}
					*/
				],
				//表单头部脚部区域
				hfConfig:{
					html:"",
					onload:function(){}
				}
			},
			build = function(tagName,data){///{
				if(!data){
					return;
				}

				var r = document.createDocumentFragment(),
					editKeyupHandle = function(e){
						e = e || window.event;
						e.keyCode == 13 && $(f).parent().find(".ctrl_save").trigger("click");
					},
					editClickHandle = function(e){
						stopBubble(e);
					},
					f,flayout,i,len,key,fhtml, widthStr, myValue,j,jlen,fo,fs, fdata;


				if(option.layout.length === 0){
					for(key in data){
						if(data.hasOwnProperty(key)){
							option.layout.push({
								"name":key,
								"field":key
							});
						}
					}
				}

				if(!option.editInit && option.edit){
					option.layout.push({
						name:"操作",
						field:"",
						width:"126",
						html:[
							'<a class="ctrl_edit right10 " href="javascript:;">修改</a>',
							'<a class="ctrl_save right10 " href="javascript:;">保存</a>',
							'<a class="ctrl_cancel " href="javascript:;">取消</a>'
						].join("")

					});
					option.editInit = true;
				}

				if(!option.delInit && option.del){
					option.layout.push({
						name:"操作",
						field:"",
						width:"64",
						html:[
							'<a class="ctrl_del" href="javascript:;">删除</a>'
						].join("")
					});
					option.delInit = true;
				}

				if(!option.addInit && option.add){
					option.layout.push({
						name:"操作",
						field:"",
						width:option.addConfig.width,
						html:[
							'<a class="ctrl_add" href="javascript:;">'+ option.addConfig.text +'</a>',
						].join("")
					});
					option.addInit = true;
				}

				for(i = 0, len = option.layout.length; i < len; i++){
					f = document.createElement(tagName);
					flayout = option.layout[i];

					if(tagName == "th" && flayout.width){
						f.width = flayout.width;

					}

					if(tagName == "th"){

						f.innerHTML = [
							'<div class="cnt">'+ flayout.name +'</div>',
							i != len - 1? '<div class="col_resize"></div>':""
						].join("");


						flayout.field?(
							f.arrange = true,
							f.className = "arrange"
						):(
							f.arrange = false
						);
					} else {
						if(flayout.edit){
							widthStr = flayout.width ? flayout.width + (/px|\%/.test(flayout.width + "")?"":"px"):"";
							myValue = data[flayout.field] || "";

							f.view = document.createElement("span");
							f.view.className = "view_item";
							f.view.value = myValue;
							f.view.html = flayout.html;
							f.view.innerHTML = tplParse(data,f.view.html) || myValue;
							
							switch(flayout.edit.type){
								case "input":
									f.edit = document.createElement("input");
									f.edit.className = "edit_item";
									f.edit.style.width = widthStr;
									f.edit.value = myValue;
									break;

								case "select":
									if(flayout.edit.options && flayout.edit.options.length > 0){
										f.edit = document.createElement("select");
										f.edit.className = "edit_item";
										f.edit.style.width = widthStr;

										for(j = 0, jlen = flayout.edit.options.length; j < jlen; j++){
											fs = flayout.edit.options[j];
											fo = new Option();
											fo.value = fs.value;
											fo.text = fs.text;
											if(myValue == fs.value){
												fo.selected = true;
												if(f.view.html){
													fdata = clone(data);
													fdata[flayout.field] = fo.value;
													f.view.innerHTML = tplParse(fdata,f.view.html);

												} else {
													f.view.innerHTML = fo.text;
												}
											}
											f.edit.options.add(fo);
										}


									}
									break;

								case "textarea": 
									f.edit = document.createElement("textarea");
									f.edit.className = "edit_item";
									f.edit.style.width = widthStr;
									f.edit.value = tplParse(data,f.view.html) || myValue;
									
									break;

								default:
									break;
							}

							f.check = flayout.edit.check;
							f.appendChild(f.view);
							f.edit && f.appendChild(f.edit);
						} else {
							f.innerHTML = tplParse(data,flayout.html) || data[flayout.field] || "";
						}

						
						f.arrange = data[flayout.field] || "";
						f.key = flayout.field;
						
						f.edit && (
							f.edit.onkeyup = editKeyupHandle, 
							f.edit.onclick = editClickHandle
						);
					}
					r.appendChild(f);
				}

				return r;
			},///}
			theadInit = function(data){///{
				//头部构建
				var ftr = target.thead.children[0];
				if(ftr.children.length === 0){

					var th01 = document.createElement("th"),
						th02 = document.createElement("th"),
						th03 = document.createElement("th");

					th01.width = 31;
					!option.checkbox && (th01.style.display = "none");
					th01.innerHTML = [
						'<div class="cnt">',
							'<input type="checkbox" class="bs_checkall" '+ (!option.checkbox && 'disabled="disabled"') +' />',
						'</div>',
						'<div class="col_resize"></div>'
					].join("");

					th02.width = 36;
					!option.index && (th02.style.display = "none");
					th02.innerHTML = [
						'<div class="cnt"></div>',
						'<div class="col_resize"></div>'
					].join("");

					th03.width = 36;
					!option.drag && (th03.style.display = "none");
					th03.innerHTML = [
						'<div class="cnt"></div>',
						'<div class="col_resize"></div>'
					].join("");

					ftr.appendChild(th01);
					ftr.appendChild(th02);
					ftr.appendChild(th03);

					//属性初始化
					target.checkall = myExt.checkall = $(myExt.thead).find(".bs_checkall")[0];

					//数据填充
					ftr.appendChild(build("th",data));

					//给还没设定宽度的 td 设置宽度
					var setedWidth = 0,
						totalWidth = target.srcCnt.offsetWidth,
						noWidthCount = 0,
						otherWidth = 0;

					

					$(ftr.children).each(function(){
						var myWidth = parseInt(this.width,10);
						myWidth ? setedWidth += myWidth: noWidthCount += 1;
					});

					otherWidth = parseInt((totalWidth - setedWidth) / noWidthCount,10);

					//alert(otherWidth)
					$(ftr.children).each(function(){
						!this.width && otherWidth > 0 && (this.width = otherWidth);
					});
					
					//事件绑定
					//排序
					$(ftr).find(".arrange").bind("click",function(){
						
						var that = this;
						
						if(typeof that.myRow == "undefined"){
							that.myRow = $(that).parent().children().index(that);
							that.toggle = true;
						}



						var ftds = [],
							fment = document.createDocumentFragment(),
							i,len,fs;
						for(i = 0, len = target.tbody.rows.length; i < len; i++){
							ftds.push(target.tbody.rows[i].cells[that.myRow]);
						}
						ftds.sort(function(elm1,elm2){
							var isSame = elm1.arrange == elm2.arrange,
								r1 = isSame?elm1.parentNode.arrange:elm1.arrange,
								r2 = isSame?elm2.parentNode.arrange:elm2.arrange,
								r = !isNaN(r1) && !isNaN(r2)? Number(r1) - Number(r2):String(r1).localeCompare(String(r2));
							
							return that.toggle? r:-r;
						});

						for(i = 0, len = ftds.length; i < len; i++){
							fment.appendChild(ftds[i].parentNode);
						}
						
						target.tbody.appendChild(fment);

						that.toggle = !that.toggle;
						indexReset();

					});


					//调整单元格大小
					$(ftr).find(".col_resize").bind("click",function(e){
						stopBubble(e);
					});

					$(ftr).find(".col_resize").bind("mousedown",function(e){
						e = e || window.event;
						e.preventDefault && e.preventDefault();
						e.returnValue = false;

						var ftd = this.parentNode;

						myExt.colbar.style.display = "";
						myExt.colbar.style.left = ftd.offsetLeft + "px";
						myExt.colbar.style.width = ftd.offsetWidth + "px";
						myExt.colbar.srcElement = ftd;
						myExt.colbar.posX = e.clientX - ftd.offsetWidth;

						document.onmousemove = function(e){
							e = e || window.event;
							var myWidth = e.clientX - myExt.colbar.posX,
								limitWidth = 36;

							myWidth < limitWidth && (myWidth = limitWidth);

							myExt.colbar.style.width = myWidth + "px";

							window.getSelection?(
								window.getSelection().removeAllRanges()
							):(
								document.selection.empty()
							);
						};

						window.onblur = window.onlosecapture = document.onmouseup = function(e){
							var myWidth = parseInt(myExt.colbar.style.width,10);
							myWidth && (myExt.colbar.srcElement.width = myWidth);

							myExt.colbar.style.display = "none";

							resizeHandle();
							document.onmousemove = document.onmouseup = document.onselectstart = null;

							return false;
						};

					});
					
					//checkall
					myExt.checkall.getItems = myExt.getItems;

					myExt.checkall.check = checkallCheckHandle;


					$(myExt.checkall).bind("click",function(){
						var chks = myExt.getItems();
						for(var i = 0, len = chks.length; i < len; i++){
							chks[i].checked = this.checked;
							chks[i].checked?$(chks[i]).parent().parent().addClass("cur"):$(chks[i]).parent().parent().removeClass("cur");
						}
						myExt.checkall2.checked = this.checked;
					});

				}
			},///}
			tableRebuild = function(data){///{
				var fment = document.createDocumentFragment(),
					i, len, key, fs, fth, ftd, ftd2, ftr;

				while(target.tbody.children.length > 0){
					fment.appendChild(target.tbody.children[0]);
				}
				if(!data || !data.length){
					nodataHandle();
					return;
				} else {
					havedataHandle();
				}
				
				data.length > 0 && theadInit(data[0]);
				
				target.checkall2.checked = false;
				target.checkall.checked = false;
				
				
				//tr列表
				for(i = 0, len = data.length; i < len; i++){
					addRow(data[i],i);
				}

                setTimeout(function(){
                    target.resize();
                },0);
			},///}

			findTr = function(elm){
				if(!elm || elm.nodeType != 1){
					return null;
				}
				var ftr = elm,
					i = 0;
				while(ftr && ftr.nodeType == 1 && ftr.tagName != "TR" && i < 100){
					ftr = ftr.parentNode;
					i++;
				}
				return ftr.tagName == "TR"? ftr : null;
			},

			addRow = function(data,index){///{
				var ftd, ftd2, ftd3, ftr, ftds,i,len,fs;

				theadInit(data);

				ftr = document.createElement("tr");
				ftd = document.createElement("td");
				ftd2 = document.createElement("td");
				ftd3 = document.createElement("td");

				ftr.className = index % 2? "even":"";
				ftd.innerHTML = '<input type="checkbox" class="bs_chk" />';
				!option.checkbox && (ftd.style.display = "none");

				ftd2.innerHTML = '<a href="javascript:;" class="ctrl_move" title="位置移动">&uarr;&darr;</a>';
				!option.drag && (ftd2.style.display = "none");

				ftd3.innerHTML = target.page * option.pagesize + (index + 1);
				!option.index && (ftd3.style.display = "none");
				ftd3.arrange = ftd3.innerHTML;
				

				target.tbody.appendChild(ftr);
				ftr.appendChild(ftd);
				ftr.appendChild(ftd2);
				ftr.appendChild(ftd3);
				
				ftr.appendChild(build("td",data));

				ftr.chk = ftd.children[0];
				ftr.chk.data = data;

				ftr.num = ftd3;

				ftr.arrange = "";

				ftr.checkItems = [];
				ftds = ftr.getElementsByTagName("td");
				for(i = 0, len = ftds.length; i < len; i++){
					fs = ftds[i];
					fs.edit && fs.view && ftr.checkItems.push(fs);
					fs.arrange && i > 2 && (ftr.arrange += fs.arrange);
				}


				//事件绑定
				if(!option.checkbox){
					ftr.chk.disabled = true;
					
				} else {
					ftr.chk.onclick = function(e){
						stopBubble(e);
                        var that = this;
                        setTimeout(function(){
                            target.checkall.check();
                            target.checkall2.check();
                            that.checked?$(that).parent().parent().addClass("cur"):$(that).parent().parent().removeClass("cur");
                        }, 1)	
					};

					ftr.onclick = function(e){
						e = e || window.event;
						var srcElement = document.elementFromPoint(e.clientX,e.clientY);
						if(srcElement.tagName == "A" || srcElement.parentNode.tagName == "A"){
							return;
						}
						$(this.chk).trigger("click");
					};
				}
				//预设按钮事件绑定
				//修改按钮
				$(ftr).find(".ctrl_edit").each(function(){
					$(this).addClass("view_item").addClass("bs_btn");

				}).bind("click",function(e){
					stopBubble(e);
					var ftr = findTr(this),
						firstEdit;
					$(ftr).find(".view_item").css("display","none");
					firstEdit = $(ftr).find(".edit_item").css("display","")[0];
					firstEdit && (
						firstEdit.focus(), 
						firstEdit.select()
					);
				});
				//取消按钮
				$(ftr).find(".ctrl_cancel").each(function(){
					$(this).addClass("edit_item").addClass("bs_btn");

				}).bind("click",function(e){
					stopBubble(e);
					var ftr = findTr(this);

					$(ftr).find(".edit_item").css("display","none");
					$(ftr).find(".view_item").css("display","");

					for(i = 0, len = ftr.checkItems.length; i < len; i++){
						fs = ftr.checkItems[i];
						fs.edit.value = fs.view.value;
					}
				});

				//保存按钮
				$(ftr).find(".ctrl_save").each(function(){
					$(this).addClass("edit_item").addClass("bs_btn").attr("mod-type","2");
					this.myAttr = modAssignment(option.editConfig,this);
					this.myAttr.action = tplParse(ftr.chk.data,this.myAttr.action);

				}).bind("click",function(e){
					stopBubble(e);

					var ftr = findTr(this),
						she = this,
						postHandle = she.myAttr.action && she.myAttr.actionType?function(){
							var param = {};
							for(i = 0, len = ftr.checkItems.length; i < len; i++){
								fs = ftr.checkItems[i];
								param[fs.key] = fs.edit.value;
							}

							!isNaNFn(she.myAttr.onsubmit) && (param = she.myAttr.onsubmit(param,ftr.chk.data));

							if(!param){
								return;
							}

							mod.loading.init(undefined,she.myAttr.timeout);
							$.ajax({
								"url":she.myAttr.action,
								"data":param,
								"success":function(json){
									if(mod.loading.isTimeout){
										return;
									}
									
									mod.loading.clear();
                                    
                                    if(!isNaNFn(she.myAttr.onresponse)){
                                        json = she.myAttr.onresponse(json);
                                    }

									var attr = {
										status: getObjByKey(json,she.myAttr.statusKey),
										msg: getObjByKey(json,she.myAttr.messageKey)
									};

									if(attr.status == attr.successCode){
										$(ftr).find(".view_item").css("display","");
										$(ftr).find(".edit_item").css("display","none");

										for(i = 0, len = ftr.checkItems.length; i < len; i++){
											fs = ftr.checkItems[i];
											ftr.chk.data[fs.key] = fs.arrange = fs.view.value = fs.edit.value;

											
											if(fs.edit.tagName == "INPUT"){
												fs.view.innerHTML = tplParse(ftr.chk.data,fs.view.html) || fs.edit.value;

											} else if(fs.edit.tagName == "SELECT"){
												fs.view.innerHTML = tplParse(ftr.chk.data,fs.view.html) || fs.edit.options[fs.edit.selectedIndex].text;

											} else {
												fs.view.innerHTML = tplParse(ftr.chk.data,fs.view.html) || fs.edit.value;
											}
										}
									}

									if(!isNaNFn(she.myAttr.submitCallback)){
										she.myAttr.submitCallback(json, param);
										return;
									} 

									


									if(attr.status == she.myAttr.successCode){
										mod.dialog("success",{content:"操作成功",timeout:global.Config.popup.autoHide});
										she.myAttr.actionCallback && she.myAttr.actionCallback(json,param);

									} else {
										mod.dialog("error","操作失败:" + attr.msg);
										
									}

									
								},
								"dataType":she.myAttr.actionType == "jsonp"?"jsonp":"json",
								"type":she.myAttr.method || "GET"
							});
						}:function(json){
							if(!isNaNFn(she.myAttr.onresponse)){
                                json = she.myAttr.onresponse(json);
                            }

                            var param = {};
							for(i = 0, len = ftr.checkItems.length; i < len; i++){
								fs = ftr.checkItems[i];
								param[fs.key] = fs.edit.value;
							}

							!isNaNFn(she.myAttr.onsubmit) && (param = she.myAttr.onsubmit(param,ftr.chk.data));

							if(!param){
								return;
							}

							$(ftr).find(".view_item").css("display","");
							$(ftr).find(".edit_item").css("display","none");
							for(i = 0, len = ftr.checkItems.length; i < len; i++){
								fs = ftr.checkItems[i];
								ftr.chk.data[fs.key] = fs.arrange = fs.view.innerHTML = fs.edit.value;
							}

							if(!isNaNFn(she.myAttr.submitCallback)){
								she.myAttr.submitCallback(json, param);
								return;
							}

							mod.dialog("success",{content:"操作成功",timeout:global.Config.popup.autoHide});
							she.actionCallback && she.actionCallback(json, param);
						},

						checkErrorHandle = function(target,msg){
							mod.dialog("error",{
								content:msg,
								callback:function(){
									target.edit.focus();
									target.edit.select && target.edit.select();
								}
							});
						},
						
						isDifferent = false,
						i,len,fs,fmsg;


					
					for(i = 0, len = ftr.checkItems.length; i < len; i++){
						fs = ftr.checkItems[i];
						if(fs.edit.value != fs.view.innerHTML){
							isDifferent = true;
						}
						if(!fs.check){continue;}
						fmsg = fs.check.call(fs.edit,fs.edit.value);
						if(fmsg !== true){
							checkErrorHandle(fs,fmsg);
							return;
						}
						
					}
					if(isDifferent){
						postHandle();
					} else {
						$(ftr).find(".ctrl_cancel").trigger("click");
					}
					
				});

				//删除按钮
				$(ftr).find(".ctrl_del").each(function(){
					$(this).addClass("bs_btn");
					this.myAttr = modAssignment(option.delConfig,this);
					this.myAttr.action = tplParse(ftr.chk.data,this.myAttr.action);

				}).bind("click",function(e){
					stopBubble(e);
					var ftr = findTr(this),
						she = this,
						fment = document.createDocumentFragment(),
						delHandle = she.myAttr.action?function(){
							var param = ftr.chk.data;


							
							!isNaNFn(she.myAttr.onsubmit) && (param = she.myAttr.onsubmit(param,ftr.chk.data));

							if(!param){
								return;
							}

							mod.loading.init(undefined,she.myAttr.timeout);
							$.ajax({
								"url":she.myAttr.action,
								"data":param,
								"success":function(json){
									if(mod.loading.isTimeout){
										return;
									}
									
									mod.loading.clear();
                                    if(!isNaNFn(she.myAttr.onresponse)){
                                        json = she.myAttr.onresponse(json);
                                    }

									var attr = {
										status: getObjByKey(json,she.myAttr.statusKey),
										total: getObjByKey(json,she.myAttr.totalKey),
										msg: getObjByKey(json,she.myAttr.messageKey)
									};

									if(!isNaNFn(she.myAttr.submitCallback)){
										she.myAttr.submitCallback(json, param);
										return;
									}


									if(attr.status == attr.successCode){
										target.remove(ftr,function(data){
											mod.dialog("success",{content:data.length + " 条记录移除成功",timeout:global.Config.popup.autoHide});
											she.myAttr.actionCallback && she.myAttr.actionCallback(json,param);
										});

									} else {
										mod.dialog("error","操作失败:" + attr.msg );
										
									}

									
								},
								"dataType":she.myAttr.actionType == "jsonp"?"jsonp":"json",
								"type":she.myAttr.method || "GET"
							});
						}:function(){
							target.remove(ftr,function(data){
								mod.dialog("success",{content:data.length + " 条记录移除成功",timeout:global.Config.popup.autoHide});
							});
						};

					mod.dialog("confirm",{
						content:"确定要移除此数据？",
						callback:delHandle
					});
					

				});
				
				//移动
				$(ftr).find(".ctrl_move").each(function(){
					$(this).addClass("bs_btn").addClass("bs_btn_move");

				}).bind("mousedown",function(e){
					var that = this,
						fment = document.createDocumentFragment();
					e = e || window.event;
					e.preventDefault && e.preventDefault();
					e.returnValue = false;

					stopBubble(e);
					if(!that.myTr){
						that.myTr = findTr(that);
						
						document.documentElement.scrollTop += 1;
						document.body.scrollTop += 1;
						that.myScroll = document.documentElement.scrollTop? document.documentElement:document.body;

						that.myMoveTag = document.createElement("div");
						that.myMoveTag.className = "bs_movetag";
						that.myMoveTag.innerHTML = (that.myTr.textContent || that.myTr.innerText).substr(0,6) + "...";

					}
					document.body.appendChild(that.myMoveTag);
					that.myMoveTag.style.display = "";
					that.myMoveTag.style.left = e.clientX + that.myScroll.scrollLeft - that.myMoveTag.offsetWidth - 10 + "px";
					that.myMoveTag.style.top = e.clientY + that.myScroll.scrollTop - that.myMoveTag.offsetHeight/2 + "px";

					document.onselectstart = function(){return false;};

					document.onmousemove = function(e){
						e = e || window.event;
						var srcElement = document.elementFromPoint(e.clientX,e.clientY),
							srcTr = findTr(srcElement);

						that.myMoveTag.style.left = e.clientX + that.myScroll.scrollLeft - that.myMoveTag.offsetWidth - 10 + "px";
						that.myMoveTag.style.top = e.clientY + that.myScroll.scrollTop - that.myMoveTag.offsetHeight/2 + "px";

						$(that.myTr).removeClass("bs_move_style").removeClass("bs_move_style_bottom").siblings().removeClass("bs_move_style").removeClass("bs_move_style_bottom");

						

						if(srcTr && isBelong(that.myTr.parentNode,srcTr)){
							that.taTr = srcTr;
							$(that.taTr).addClass("bs_move_style");
						} else if(isBelong(target.tfoot,srcElement)){
							that.taTr = target.tbody.children[target.tbody.children.length - 1];
							$(that.taTr).addClass("bs_move_style_bottom");
							
						} else {
							that.taTr = null;
						}


						window.getSelection?(
							window.getSelection().removeAllRanges()
						):(
							document.selection.empty()
						);
					};

					document.onmouseup = function(e){
						fment.appendChild(that.myMoveTag);

						if(that.taTr){
							if(that.taTr.className.indexOf("bs_move_style_bottom") != -1){
								$(that.taTr).removeClass("bs_move_style_bottom");
								that.myTr.parentNode.appendChild(that.myTr);
							} else {
								$(that.taTr).removeClass("bs_move_style");
								that.myTr.parentNode.insertBefore(that.myTr,that.taTr);
							}
							
							indexReset();
						}

						document.onmousemove = null;
						document.onmouseup = null;
						document.onselectstart = null;
					};
				});

				//添加按钮
				$(ftr).find(".ctrl_add").each(function(){
					$(this).addClass("bs_btn").attr("mod-type","1");
					this.myAttr = modAssignment(option.addConfig,this);

				}).bind("click",function(e){
					stopBubble(e);
					var that = this,
						ftr = findTr(that),
						target = that.myAttr.target,
						index = that.myAttr.index;

					target && $(target).each(function(){
						this.add && this.add(ftr.chk.data,undefined,index);
					});

				});

				$(ftr).find(".edit_item").css("display","none");

				mod.button($(ftr).find(".bs_btn"));

				return ftr;
			},///}
			hashchangeHandle = function(){
				
				var hashPage = request.hash(target.id + "Cur");

				if(!isNaN(hashPage) && target.page != hashPage){
					target.pageTo(Number(hashPage));
					return true;

				}

				return false;
				
			},
			nodataHandle = function(){///{
				target.srcCnt.style.width = "auto";
				//$(target.srcTable).hide();
				$(target.srcMsg).show().removeClass("bs_tablebox_loading").addClass("bs_tablebox_nodata").children().html('<i></i>噢，没有数据喔！');
				target.checkall2.checked = false;
				target.checkall && (target.checkall.checked = false);
			},///}
			havedataHandle = function(){
				$(target.srcTable).show();
				target.srcBox.style.height = "auto";
				$(target.srcMsg).hide();
			},
			loadingHandle = function(){
				//$(target.srcTable).hide();
				$(target.srcMsg).show().addClass("bs_tablebox_loading").removeClass("bs_tablebox_nodata").children().html('数据加载中...');
			},
			timeoutHandle = function(){
				errorHandle("噢，加载超时喔！");
			},
			errorHandle = function(msg){
				//$(target.srcTable).hide();
				$(target.srcMsg).show().addClass("bs_tablebox_loading").removeClass("bs_tablebox_nodata").children().html(msg);
				target.resize();
			},
			resizeHandle = function(){///{
				
				//width
				if(option.nowrap){
					target.srcCnt.style.width = "";
					target.srcTable.style.width = "";

					target.srcTable.offsetWidth > target.srcBox.offsetWidth?(
						target.srcCnt.style.width = target.srcTable.offsetWidth + "px"
					):(
						target.srcCnt.style.width = "auto",
						target.srcTable.style.width = "100%"
					);


				} else {

					//minWidth初始化
					target.minWidth = 0;
					var ths = target.thead.getElementsByTagName("th"),
						i, len, fs;

					for(i = 0, len = ths.length; i < len; i++){
						fs = ths[i];
						target.minWidth += parseInt(fs.width || 40,10);
					}
					
					target.srcCnt.style.width = "100%";

					target.srcTable.style.width = "100%";

					target.minWidth < target.srcBox.offsetWidth && (target.minWidth = target.srcBox.offsetWidth);

					//隐藏情况下
					if(target.srcTable.offsetWidth === 0){
						target.srcCnt.style.width = "100%";
					} else {

						target.srcCnt.style.width = target.srcTable.offsetWidth < target.minWidth? (target.minWidth + "px"):(target.srcTable.offsetWidth + "px");
					}
				}

				//height
				/*
				target.srcCnt.style.height = "auto";
				target.srcCnt.style.minHeight = "0";

				target.srcCnt.offsetHeight && (
					UA.ie && UA.ie <= 6 && (target.srcCnt.style.height = target.srcCnt.offsetHeight + "px"),
					target.srcCnt.style.minHeight = target.srcCnt.offsetHeight + "px"
				);*/

				//scrollbar
				target.scrollbar.style.width = target.srcCnt.offsetWidth !== 0? (target.srcBox.offsetWidth / target.srcCnt.offsetWidth * 100 + "%"):"100%";
				var r = parseInt(target.scrollbar.style.left,10) || 0,
					rMax = target.scroll.offsetWidth - target.scrollbar.offsetWidth;

				r < 0 && (r = 0);
				r > rMax && (r = rMax);

				target.scrollbar.style.left = r + "px";
				
				//msgbox
				target.srcMsg.style.height = target.srcCnt.offsetHeight + "px";
			},///}

			indexReset = function(){
				var ftrs = target.tbody.getElementsByTagName("tr"),
					fs,i,len;
				for(i = 0, len = ftrs.length; i < len; i++){
					fs = ftrs[i];
					$(fs).removeClass("even");
					i % 2 && $(fs).addClass("even");
					fs.num.innerHTML = target.page * option.pagesize + (i + 1);			
				}
			},

			//checkall 检查是否全选事件
			checkallCheckHandle = function(){///{
				var checked = true,
					chks = myExt.getItems();

				for(var i = 0, len = chks.length; i < len; i++){
					if(!chks[i].checked){
						checked = false;
						break;
					}
				}

				this.checked = checked;
			};///}

		
		//赋值
		option = modAssignment(option,op);
		target = $(target)[0];

		if(!target){
			return;
		}

		if(isEqual(target.opAttr,option)){
			return target.reload();
		}

		if(!target.id){
			target.id = "modTab" + new Date().getTime() + Math.round(Math.random() * 100);
            option.mark = false;
		}



		$(target).html([
			'<div class="bs_tablebox">',
				'<div class="bs_tablebox_top"></div>',
				'<div class="bs_tablebox_hd">',
					'<div class="h_tl">共有 <strong  class="red bs_table_totalnum"></strong> 条数据</div>',
					'<div class="h_r bs_leaf"></div>',
				'</div>',
				
				'<div class="bs_tablebox_scroll"><span></span></div>',
				
				'<div class="bs_tablebox_main" style="height:100px;">',
					'<div class="bs_tablebox_msg"><div class="bs_tablebox_msg_cnt"></div></div>',
					'<div class="bs_tablebox_cnt" style="width:auto">',
						'<table class="bs_table_s1" style="display:none;"></table>',
						
					'</div>',
					'<div class="bs_tablebox_colbar" style="display:none;"></div>',
				'</div>',
				'<div class="bs_tablebox_ft">',
					'<div class="f_l" '+ (!option.checkbox && 'style="display:none"') +'><input type="checkbox" class="bs_checkall" '+ (!option.checkbox && 'disabled="disabled"') +' /> 全选/全不选</div>',
					'<div class="bs_leaf f_r"></div>',
				'</div>',
				'<div class="bs_tablebox_bottom"></div>',
			'</div>'
		].join(""));

		var myExt = {
			srcBox: $(target).find(".bs_tablebox_main")[0],
			srcCnt: $(target).find(".bs_tablebox_cnt")[0],

			totalNum: $(target).find(".bs_table_totalnum")[0],
			srcTable: $(target).find("table")[0],
			srcMsg: $(target).find(".bs_tablebox_msg")[0],
			colbar: $(target).find(".bs_tablebox_colbar")[0],
			scroll: $(target).find(".bs_tablebox_scroll")[0],
			scrollbar: $(target).find(".bs_tablebox_scroll")[0].children[0],

			srcTop: $(target).find(".bs_tablebox_top")[0],
			srcBottom: $(target).find(".bs_tablebox_bottom")[0],

			thead: document.createElement("thead"),
			tbody: document.createElement("tbody"),
			tfoot: $(target).find(".bs_tablebox_ft")[0],

			srcLeaf: $(target).find(".bs_leaf"),

			checkall: undefined,
			checkall2: undefined,

			total: 0,
			page: option.page,
			pagesize: option.pagesize,

			//表格最小宽度
			minWidth:0,

			//事件绑定
			resize: resizeHandle,
			pageTo: option.action?function(page){
				//..哈希change 记录
				mod.loading.init(timeoutHandle,option.timeout);

				loadingHandle();

				//页码
				option.actionParam[option.pageKey] = page;
				target.page = page;

				option.mark && historyManage.add(target.id + "Cur",page);

				var fParam = clone(option.actionParam);

				fParam[option.pageKey] += option.pageStart;
				fParam._ = new Date().getTime();
				
                if(!isNaNFn(option.onsubmit)){
                    fParam = option.onsubmit(fParam);
                }
                if(!fParam){
                    return;
                }

                $.ajax({
					"url":option.action,
					"data":fParam,
					"success":function(json){
						if(mod.loading.isTimeout){
							return;
						}
						
						mod.loading.clear();
                        if(!isNaNFn(option.onresponse)){
                            json = option.onresponse(json);
                        }
						var attr = {
							status: getObjByKey(json,option.statusKey),
							total: getObjByKey(json,option.totalKey) || 0,
							data: getObjByKey(json,option.dataKey) || [],
							msg: getObjByKey(json,option.messageKey)
						};
                        

                        if(attr.status == option.successCode){
							typeof attr.total == "undefined" && (attr.total = attr.data.length);
							//搜索结果输出
							target.totalNum.innerHTML = attr.total;

							//table 重构
							tableRebuild(attr.data);

							target.total = attr.total;

							//数据自动纠错(option.pagesize 与实际输出数据数目有出入时)
							if(page === 0 && attr.data.length != option.pagesize){
								target.pagesize = option.pagesize = attr.data.length;
							}

							option.onload.call(target,json);
							option.actionCallback.call(target,json, fParam);

						} else {
							bsPopup("error","数据加载失败:" + attr.msg );
							errorHandle(attr.msg);
						}

						//nowPage,showNum,total,source
						$(target.srcLeaf).html(leafRebuild(page, option.pagesize, attr.total,'document.getElementById(\''+ target.id +'\').pageTo'));
						
					},
					"dataType":option.actionType == "jsonp"?"jsonp":"json",
					"type":option.method || "GET"
				});
					
			}:function(page, source){
				if(source){
					option.data = clone(source);
				}
				//搜索结果输出
				target.totalNum.innerHTML = option.data.length;

				target.page = page;

				option.mark && historyManage.add(target.id + "Cur",page);

				target.total = option.data.length;

				if(option.data.length){
					havedataHandle();

					var curData = [],
						len = option.data.length,
						start,end;

					if(option.pagesize >= len){
						curData = option.data;
					} else {
						start = page * option.pagesize;
						end = start + option.pagesize;
						for(var i = start; i < end && i < len; i ++){
							curData.push(option.data[i]);
						}
					}

					//table 重构
					tableRebuild(curData);

					//页码重构
					$(target.srcLeaf).html(leafRebuild(page, option.pagesize, option.data.length,'document.getElementById(\''+ target.id +'\').pageTo'));
					option.onload.call(target,option.data);
					option.actionCallback.call(target,option.data);


				} else {
					nodataHandle();
				}
				
			},
			
			reload:function(data){
				target.pageTo(target.page, data);
			},

			get:function(source){
				var chks = this.getItems(),
					i,len,
					r = [];
				switch(typeof source){
					case "number":
						return chks[source] ? chks[source].data : null;

					case "object":
						if(source.nodeType == 1 && source.tagName == "TR" && source.chk){
							return source.chk.data;
						}
						break;

					case "string":
						if(source == "checked"){
							for(i = 0, len = chks.length; i < len; i++){
								chks[i].checked && r.push(chks[i].data);
							}
							return r;

						} else if(source == "unchecked"){
							for(i = 0, len = chks.length; i < len; i++){
								!chks[i].checked && r.push(chks[i].data);
							}
							return r;
						} else if(source == "tr:checked"){
							for(i = 0, len = chks.length; i < len; i++){
								chks[i].checked && r.push(chks[i].parentNode.parentNode);
							}
							return r;
						} else if(source == "tr:unchecked"){
							for(i = 0, len = chks.length; i < len; i++){
								!chks[i].checked && r.push(chks[i].parentNode.parentNode);
							}
							return r;
						}
						break;

					default:
						for(i = 0, len = chks.length; i < len; i++){
							r.push(chks[i].data);
						}
						return r;
				}
			},

			add:function(datas,callback,index){
				var curData = target.get(),
					ftr,fs,fd,isMatch,i,len,j,jlen,
					fdatas = [],
					matchCheck = index?function(o1,o2){
						return o1[index] === o2[index];
					}:function(o1,o2){
						return JSON.stringify(o1) === JSON.stringify(o2);
					};



				if(datas.splice != Array.prototype.splice){
					datas = [datas];
				}

				
				for(i = 0, len = datas.length; i < len; i++){
					fs = datas[i];
					isMatch = false;

					for(j = 0, jlen = curData.length; j < jlen; j++){
						fd = curData[j];
						if(matchCheck(fs,fd)){
							isMatch = true;
							break;
						}
						
					}

					if(!isMatch){
						havedataHandle();
						fdatas.push(fs);
					}
					
				}

				for(i = 0, len = fdatas.length; i < len; i++){
					fs = fdatas[i];
					ftr = addRow(fs,curData.length + i);
				}

				target.checkall && target.checkall.check();
				target.checkall2.check();

				
				//数据处理
				target.total += fdatas.length;
				target.totalNum.innerHTML = target.total;
                target.resize();
				
                mod.dialog("success",{content:"共 " + fdatas.length + " 条记录添加到 <strong class='blue'>" + (option.title|| target.id) + "</strong> 列表",timeout:global.Config.popup.autoHide});

				typeof callback == "function" && callback(fdatas);
			},

			remove:function(source,callback){
				var chks = this.getItems(),
					fment = document.createDocumentFragment(),
					myTrs = target.tbody.getElementsByTagName("tr"),
					i, len, fs,j, jlen, fstr,
					ftrs = [];
				if(source.splice != Array.prototype.splice){
					source = [source];
				}

				for(i = 0, len = source.length; i < len; i++){
					fs = source[i];
					switch(typeof fs){
						case "number":
							fs >= 0 && fs < myTrs.length && ftrs.push(myTrs[fs]);
							break;

						case "object":
							if(fs.nodeType == 1){
								if(fs.tagName == "TR"){
									ftrs.push(fs);
								}
								break;

							} else {
								fstr = JSON.stringify(fs);
								for(j = 0, jlen = myTrs.length; j < jlen; j++){
									if(JSON.stringify(myTrs[j].chk.data) == fstr){
										ftrs.push(myTrs[j]);
										break;
									}
								}
							}
							break;
							
						default:
							break;
					}
				}

				for(i = 0, len = ftrs.length; i < len; i++){
					fment.appendChild(ftrs[i]);
				}
				//数据处理
				target.total -= ftrs.length;
				target.totalNum.innerHTML = target.total;
				if(target.tbody.getElementsByTagName("tr").length <= 0){
					nodataHandle();
				}

				fment = null;
				typeof callback == "function" && callback(ftrs);
			},

			getItems:function(){
				var ftrs = myExt.tbody.getElementsByTagName("tr"),
					r = [];

				for(var i = 0, len = ftrs.length; i < len; i++){
					r.push(ftrs[i].chk);
				}
				return r;
			}
		};

		

		myExt.srcTable.appendChild(myExt.thead);
		myExt.srcTable.appendChild(myExt.tbody);

		$(myExt.thead).append('<tr></tr>');

		myExt.checkall2 = $(target).find(".f_l .bs_checkall")[0];

		var ftxt = "";

		if(option.addConfig.batchConfig.enable && option.addConfig.target){
			ftxt = '<a href="javascript:;" class="bs_btn ctrl_batch_add right10 " mod-type="1">批量'+ option.addConfig.text +'</a>';
			$(myExt.srcTop).append(ftxt);
			$(myExt.srcBottom).append(ftxt);
		}

		if(option.delConfig.batchConfig.enable){
			ftxt = '<a href="javascript:;" class="bs_btn ctrl_batch_del right10 ">批量删除</a>';
			$(myExt.srcTop).append(ftxt);
			$(myExt.srcBottom).append(ftxt);
		}

		//表单头部脚部初始化
		if(option.hfConfig.html){
			$(myExt.srcTop).append(option.hfConfig.html);
			$(myExt.srcBottom).append(option.hfConfig.html);
		}

		mod.button($(myExt.srcTop).find(".bs_btn"));
		mod.button($(myExt.srcBottom).find(".bs_btn"));

		// srcHead srcFoot 事件绑定
		$(target).find(".ctrl_batch_add").bind("click",function(e){
			stopBubble(e);
			var that = this,
				myAttr = modAssignment(option.addConfig,that);

			myAttr.target && $(myAttr.target).each(function(){
				this.add && this.add(target.get("checked"),undefined,myAttr.index);
			});
		});

		$(target).find(".ctrl_batch_del").bind("click",function(e){
			stopBubble(e);
			var that = this,
				myAttr = modAssignment(option.delConfig.batchConfig,that),
				
				fment = document.createDocumentFragment(),
				delHandle = myAttr.action?function(){
					var param = target.get("checked"),
						ftrs = target.get("tr:checked");


					
					!isNaNFn(myAttr.onsubmit) && (param = myAttr.onsubmit(param,param));

					if(!param){
						return;
					}

					mod.loading.init(undefined,myAttr.timeout);
					$.ajax({
						"url":myAttr.action,
						"data":param,
						"success":function(json){
							if(mod.loading.isTimeout){
								return;
							}
							
							mod.loading.clear();
                            
                            if(!isNaNFn(myAttr.onresponse)){
                                json = myAttr.onresponse(json);
                            }

							var attr = {
								status: getObjByKey(json,myAttr.statusKey),
								total: getObjByKey(json,myAttr.totalKey),
								msg: getObjByKey(json,myAttr.messageKey)
							};

							if(!isNaNFn(myAttr.submitCallback)){
								myAttr.submitCallback(json, param);
								return;
							}


							if(attr.status == myAttr.successCode){
								target.remove(ftrs,function(data){
									mod.dialog("success",{content:data.length + " 条记录移除成功",timeout:global.Config.popup.autoHide});
									myAttr.actionCallback && myAttr.actionCallback(json,param);
								});

							} else {
								mod.dialog("error","操作失败:" + attr.msg );
								
							}

							
						},
						"dataType":myAttr.actionType == "jsonp"?"jsonp":"json",
						"type":myAttr.method || "GET"
					});
				}:function(){
					var ftrs = target.get("tr:checked");
					target.remove(ftrs,function(data){
						mod.dialog("success",{content:data.length + " 条记录移除成功",timeout:global.Config.popup.autoHide});
					});
				};

			mod.dialog("confirm",{
				content:"确定要移除此数据？",
				callback:delHandle
			});
		});


		!isNaNFn(option.hfConfig.onload) && option.hfConfig.onload();


		myExt.checkall2.check = checkallCheckHandle;


		//事件绑定
		$(myExt.checkall2).bind("click",function(){
			var chks = myExt.getItems();
			for(var i = 0, len = chks.length; i < len; i++){
				chks[i].checked = this.checked;
				chks[i].checked?$(chks[i]).parent().parent().addClass("cur"):$(chks[i]).parent().parent().removeClass("cur");
			}
			myExt.checkall.checked = this.checked;
		});

		

		$(myExt.scrollbar).bind("mousedown",function(e){
			e = e || window.event;
			e.preventDefault && e.preventDefault();
			e.returnValue = false;
			
			this.posX = e.clientX - (parseInt(this.style.left,10) || 0);
			document.onmousemove = function(e){
				e = e || window.event;
				var r = e.clientX - myExt.scrollbar.posX,
					rMax = myExt.scroll.offsetWidth - myExt.scrollbar.offsetWidth,
					sWidth = myExt.srcBox.scrollWidth - myExt.srcBox.offsetWidth;

				r < 0 && (r = 0);
				
				r > rMax && (r = rMax);
				
				myExt.scrollbar.style.left = r + "px";
				myExt.srcBox.scrollLeft = r / rMax * sWidth;
			};

			document.onmouseup = function(){

				document.onmousemove = null;
				document.onmouseup = null;
			};
		});

		
		$(window).bind("resize",function(){
			clearTimeout(myExt.resizeKey);
			myExt.resizeKey = setTimeout(resizeHandle,200);
		});

		$(myExt.srcBox).bind("scroll",function(){
			var myLeft = myExt.srcBox.scrollLeft / (myExt.srcBox.scrollWidth - myExt.srcBox.offsetWidth) * (myExt.scroll.offsetWidth - myExt.scrollbar.offsetWidth);
			!isNaN(myLeft) && (myExt.scrollbar.style.left = myLeft + "px");
		});

		for(var key in myExt){
			if(myExt.hasOwnProperty(key)){
				target[key] = myExt[key];
			}
		}

		
		needReset && option.mark && request.hash(target.id + "Cur",target.page);

		option.mark && historyManage.init(hashchangeHandle,target.id);
		!hashchangeHandle() && target.pageTo(target.page);
		
		target.opAttr = option;

		return target;
	},

	/**
	 * 弹窗控件
	 * @param  {string} type 弹窗类型 normal|success|error|loading|自定义一个名字
	 * @param  {object} op     参数设置
	 *
	 *                  - title          [string]        弹窗标题
	 *                  - content        [string]        弹窗内容|需要在弹窗中显示的对象(必须使用自定义名字)
	 *                  - timeout        [number]        弹窗显示时长
	 *                  - mustConfirm    [boolean]       必须按确认才能继续操作
	 *                  - callback       [function]      回调函数
	 *                  - cancelCallback [function]      取消操作的时候回调的函数(仅限于 type=confirm)
	 *                  - onload         [function]      加载完成时候回调的函数
	 *                  - type           [string]        弹窗类型，优先级比 type 高
	 *                  - width          [string|number] 弹窗宽度。默认跟样式
	 *                  - height         [string|number] 弹窗高度。默认auto
	 *                  - zIndex         [string|number] z-index 默认 100
	 *                  - overtime       [number]        超过多少秒显示超时，默认跟 Config一致
	 *                  - delay          [number]        延迟 多少秒显示菊花
	 *                  - onovertime     [function]      请求超时后执行的方法
	 * @return {object} 弹窗对象 pop
	 *                  - pop.show()     弹窗显示
	 *                  - pop.hide()     弹窗隐藏
	 */
	dialog:function(type,op){
		return bsPopup(type,op);
	},

	/**
	 * menu
	 */
	menu:function(target,op){
		var $tar = target ? $(target) : $(".bs_menu"),
			option = {
				//显示checkbox
				checkbox:false,
				//显示图标
				icon:true,

				//链接打开方式
				hrefTarget:"",

				//是否默认展示全部
				show:false,

				//默认值
				defaultValue: [],

				//强制重置
				reset: false

			};

		
		//赋值
		option = modAssignment(option,op);



		//重构
		$tar.each(function() {

			var she = this,
				myClass = "",
				attr = modAssignment(option,she);



			if(isEqual(she.opAttr,attr) && !option.reset){
				return;
			}

			$(she).addClass("bs_menu");

			//设置是否有 icon checkbox
			attr.checkbox? $(she).removeClass("bs_menu_nochk"): $(she).addClass("bs_menu_nochk");
			attr.icon? $(she).removeClass("bs_menu_nodoc"): $(she).addClass("bs_menu_nodoc");

			$(she).find("a").each(function(){
				var me = this,
					myLi = me.parentNode,
					box, swh, chk, doc;

				//模块重构
				if(myLi.tagName == "LI"){
					box = document.createElement("div");
					box.className = "bs_box";

					swh = document.createElement("i");
					swh.className = "bs_swh";

					chk = document.createElement("i");
					chk.className = "bs_chk";

					doc = document.createElement("i");
					doc.className = "bs_doc";

					box.appendChild(swh);
					box.appendChild(chk);
					box.appendChild(doc);

					me.parentNode.insertBefore(box,me);
					box.appendChild(me);

					

				} else if(myLi.className.indexOf("bs_box") != -1){
					box = myLi;
					myLi = myLi.parentNode;
					swh = $(box).find(".bs_swh")[0];
					chk = $(box).find(".bs_chk")[0];

				} else {
					return;

				}

				//a标签调整
				attr.hrefTarget && (me.target = attr.hrefTarget);
				me.title = (me.textContent || me.innerText).replace(/\t|\r|\n/g,' ').replace(/\s+/g,' ');

				//样式调整
				$(myLi).find("ul").length !== 0 ? $(box).addClass("bs_withsub"): $(box).removeClass("bs_withsub");

				if(attr.checkbox){
					$(me).attr("mod-checked")? $(chk).parent().addClass("bs_chk_checked"): $(chk).parent().removeClass("bs_chk_checked");

					me.href = "javascript:;";
					me.target = "";

					chk.value = $(me).attr("mod-value");

					me.onclick = function(){
						$(chk).trigger("click");
					};


				} else {
					me.onclick = chk.onclick = null;
					if(/^javascript:/ig.test(me.href)){
						me.target = "";
						me.onclick = function(){
							$(swh).trigger("click");
						};
					}
				}

				//事件绑定
				swh.onclick = function(){
					var myBox = this.parentNode;

					if(myBox.className.indexOf("bs_withsub") == -1){
						return;
					}
					myBox.className.indexOf("bs_show") != -1?(
						$(myBox).removeClass("bs_show").siblings("ul").slideUp(200)
					):(
						$(myBox).addClass("bs_show").siblings("ul").slideDown(200)
					);
				};

				attr.show && swh.parentNode.className.indexOf("bs_show") == -1 && $(swh).trigger("click");
			});

			if(attr.checkbox){
				$(she).find(".bs_chk").each(function(){
					var chk = this,
						box = chk.parentNode,
						myLi = box.parentNode;


					//全选类
					if(box.className.indexOf("bs_withsub") != -1){
						chk.myCells = $(box).siblings("ul").find(".bs_chk");

						chk.check = function(){

							clearTimeout(chk.delayKey);

							var have = false,
								checkall = true;

							chk.delayKey = setTimeout(function(){
								var i, len, fs;
								for(i = 0, len = chk.myCells.length; i < len; i++){
									fs = chk.myCells[i].parentNode;
									fs.className.indexOf("bs_chk_checked") == -1? checkall = false: have = true;

								}
								$(chk).parent().removeClass("bs_chk_checked").removeClass("bs_chk_include");

								if(checkall){
									$(chk).parent().addClass("bs_chk_checked");

								} else if(have){
									$(chk).parent().addClass("bs_chk_include");

								}

							},40);
							
						};

						chk.onclick = function(){

							var me = this;
							if(me.parentNode.className.indexOf("bs_chk_checked") != -1){
								$(me).parent().removeClass("bs_chk_checked");

								$(me.myCells).each(function(){
									$(this).parent().removeClass("bs_chk_include").removeClass("bs_chk_checked");
								});

							} else {
								$(me).parent().addClass("bs_chk_checked");
								
								$(me.myCells).each(function(){
									$(this).parent().removeClass("bs_chk_include").addClass("bs_chk_checked");
								});
							}

							$(me).parent().removeClass("bs_chk_include");
							
						};

						chk.check();

					//子选类
					} else {
						var myUl = myLi,
							times = 0,
							fchk;

						chk.myParents = [];
						myUl = myUl.parentNode;
						while(myUl){
							if(myUl.className.indexOf("bs_menu") != -1){
								break;
							}

							if(myUl.tagName == "UL"){
								fchk = $(myUl).siblings(".bs_box").find(".bs_chk")[0];
								fchk && chk.myParents.push(fchk);
							}


							times++;
							if(times > 1000){
								break;
							}

							myUl = myUl.parentNode;
						}

						chk.onclick = function(){
							var me = this;
							$(me).parent().toggleClass("bs_chk_checked");
							$(me.myParents).each(function(){
								this.check();
							});
						};
					}

					
				});
			}
		
			//获取结果
			she.get = function(type){
				var r = [];
				switch(type){
					//所有
					case "all":
						$(she).find(".bs_chk").each(function(){
							this.value && r.push(this.value);
						});
						break;

					//选中
					case "checked":
						$(she).find(".bs_chk_checked").children('.bs_chk').each(function(){
							this.value && r.push(this.value);
						});
						break;

					//未选中
					case "unchecked":
						$(she).find(".bs_chk").each(function(){
							this.parentNode.className.indexOf("bs_chk_checked") == -1 && this.value && r.push(this.value);
						});
						break;

					default:
						$(she).find(".bs_chk").each(function(){
							this.value && r.push(this.value);
						});
						break;
				}

				return r;

			};

			//设定选中的菜单
			she.current = function(href){
				var isSameComes = function(url1,url2){
					if(!url1 || !url2){
						return false;
					}

					var u1 = url1.split("#")[0],
						u2 = url2.split("#")[0];
					return u1 == u2;
				};

				$(she).find("a").each(function(){
					isSameComes(this.href,href)? $(this).parent().addClass("bs_cur"): $(this).parent().removeClass("bs_cur");
				});

				$(she).find(".bs_cur").each(function(){
					//向上递归设置
					var myUl = this.parentNode,
						times = 0;

					myUl = myUl.parentNode;
					while(myUl){
						if(myUl.className.indexOf("bs_menu") != -1){
							break;
						}

						if(myUl.tagName == "UL"){
							$(myUl).slideDown(200).siblings(".bs_box").addClass("bs_show");
						}

						
						myUl = myUl.parentNode;
					}

					//向下
					$(this).siblings("ul").slideDown(200).siblings(".bs_box").addClass("bs_show");
				});
			};

			//设置默认值
			if(typeof attr.defaultValue == 'string'){
				attr.defaultValue = attr.defaultValue.split(',');
			}
			if(attr.checkbox && isArray(attr.defaultValue)){
				// 等于默认值的 勾上
				$(she).find(".bs_chk").each(function(){
					if(attr.defaultValue.indexOf(this.value) != -1){
						$(this).trigger('click');
						

						
					}
				});

				setTimeout(function(){
					// 子分类勾上但没全勾上的 展开
					$(she).find('.bs_withsub.bs_chk_include').addClass('bs_show').siblings('ul').show();
					// 子分类都勾上的 收起
					$(she).find('.bs_withsub.bs_chk_checked').removeClass('bs_show').siblings('ul').hide();

				},100);
			}
			
			
			she.opAttr = attr;
		});

		return $tar[0];
	},

	/**
	 * 
	 */
	nav:{
		get:function(type){
			var that = this,
				navData = (function(){
					try{
						return JSON.parse(cookies.get(global.Config.locationMark));
					} catch(er){
						return [];
					}
				})();
			if(navData.length === 0){
				return {};
			}

			switch(type){
				case "end":
					return navData[navData.length - 1];

				case "start":
					return navData[0];
				default:
					return navData[navData.length - 1];
					
			}
			return {};
		},
		set:function(url,title){
			var that = this,
				navData = (function(){
					try{
						return JSON.parse(cookies.get(global.Config.locationMark));
					} catch(er){
						return [];
					}
				})(),
				isSameComes = function(url1,url2){
					if(!url1 || !url2){
						return false;
					}

					var u1 = url1.split("#")[0],
						u2 = url2.split("#")[0];
					return u1 == u2;
				},
				isdeal = false,
				i, len, fs, html = "";



			if(!that.menus){
				that.menus = [];
				parent.$(".bs_menu a").each(function(){
					that.menus.push({
						url:this.href,
						name:this.innerText || this.textContent
					});
				});
			}


			//判断是否为menu 的地址
			for(i = 0, len = that.menus.length; i < len; i++){
				fs = that.menus[i];
				if(isSameComes(fs.url,url)){
					navData = [{"name":title,"url":url}];
					isdeal = true;
				}
			}


			//判断是否为 面包屑上的地址
			if(!isdeal){
				for(i = 0, len = navData.length; i < len; i++){
					fs = navData[i];
					if(isSameComes(fs.url,url)){
						navData.splice(0,i + 1);
						isdeal = true;
					}
				}
			}
			//在结尾追加
			if(!isdeal){
				navData.push({"name":title,"url":url});
			}

			
			cookies.set(global.Config.locationMark,JSON.stringify(navData),1,"/");

			//导航渲染
			for(i = 0, len = navData.length; i < len; i++){
				fs = navData[i];
				if( i != len -1){
					html += '<a href="'+ fs.url +'">'+ fs.name +'</a> &gt; ';
				} else {
					html += fs.name;
				}
			}

			parent.$("#nav").html(html);

			//侧栏渲染
			parent.$(".bs_menu")[0].current(navData[0].url);

			//地址栏hash设置
			parent.request.hash("url",encodeURIComponent(navData[0].url));
			/*parent.$(".bs_menu a").each(function(){
				$(this).removeClass("cur");
				isSameComes(this.href,navData[0].url) && $(this).addClass("cur");
			});*/
			return;
		}
	},
	/**
	 * 清除 元素占用的缓存
	 */
	remove:function(obj){
		$.cleanData(obj);
		$.cleanData(obj.getElementsByTagName("*"));
		$(obj).remove();
	},

	empty:function(obj){
		$.cleanData(obj.getElementsByTagName("*"));
		obj.innerHTML = "";
	},

	/**
	 * 超时处理
	 */
	loading:{
		/*
		 * 是否已经超时
		 */
		isTimeout:false,

		/*
		 * 菊花初始化
		 */
		init:function(timeoutCallback,delayTime,loadingText){
			var she = this;

			if(!she.pop || loadingText){
				she.pop = bsPopup("loading",{
					content:loadingText || global.Config.ajax.loadingText,
					show:false
				});
			}
			clearTimeout(she.timeoutKey);

			she.isTimeout = false;
			she.timeoutKey = setTimeout(function(){
				she.pop.hide();

				mod.dialog("error",{content:global.Config.ajax.timeoutText});

				she.isTimeout = true;
				typeof timeoutCallback == "function" && timeoutCallback();

			},delayTime || global.Config.ajax.timeout);
			she.pop.show();
		},
		/*
		 * 菊花清除
		 */
		clear:function(){
			var she = this;
			clearTimeout(she.timeoutKey);
			she.pop && she.pop.hide();
		}
		
	},

	/**
	 * 初始化，模板全局渲染
	 */
	init: function() {
		var me = this;
			me.box();
			me.tab();
			me.button();
			me.form();
			me.menu();
	}
};


function pageInit(){
	//结构调整
	var myHtml = document.getElementsByTagName("html")[0],
		firstHref = global.Config.mainPage,
		fment,
		fs,len,i,
		myNodes;

	//外框初始化
	if(myHtml.className.indexOf("bs_outhtml") != -1){
		$("#switch").bind("click",function(){
			$("#bodyArea").toggleClass("bs_fullscreen");
		});

		/*
		$(".bs_menu a").bind("click",function(){
		$(".bs_menu a").removeClass("cur");
		$(this).addClass("cur");
		});
		*/

		if(request.hash("url")){
			firstHref = decodeURIComponent(request.hash("url"));
		}

		//左侧菜单初始化
		$(".bs_menu a").each(function(){
			
			this.target = this.target || "mainframe";
			!firstHref && this.target == "mainframe" && !/^javascript:/g.test(this.href) && (firstHref = this.href);
		});

		//右侧iframe
		var curHref = mod.nav.get("end").url || firstHref;
		
		$("#main").html('<iframe class="bs_main_if" name="mainframe" id="mainframe" src="'+ curHref +'" width="100%" height="100%" frameborder="0" scrolling="no"></iframe>');
		
		return;
	}

	//内页初始化
	if(myHtml.className.indexOf("bs_inset_html") == -1){

		document.onreadystatechange = function(){
			if(document.readyState == "complete"){
				$(myHtml).addClass("bs_inset_html");
				var d1 = document.createElement("div"),
					d2 = document.createElement("div");
					
				d1.className = "bs_inset_frame";
				d2.className = "bs_inset_bodyarea";

				myNodes = [];
				for(i = 0, len = document.body.childNodes.length; i < len; i++){
					fs = document.body.childNodes[i];
					(!(fs.nodeType == 1 && fs.tagName == "SCRIPT") || /bs_pop/g.test(fs.className)) && myNodes.push(fs);
				}

				document.body.appendChild(d1);
				d1.appendChild(d2);

				for(i = 0, len = myNodes.length; i < len; i++){
					d2.appendChild(myNodes[i]);
				}
				document.onreadystatechange = null;

                // 修复表格在此过后 宽度不正常问题
                $('.bs_tablebox ').each(function(){
                    this.parentNode.resize && this.parentNode.resize();
                });
			}
		};
		
		
		
	}


	//地址记录
	try{
		parent != window.self && mod.nav.set(window.location.href,document.title);
	}catch(er){}
}

//全局函数 - mod
var mod = global.mod = new moduleBuild();

//打打补丁(那些年拼错的单词)
mod.gird = mod.grid;

//全局变量 菊花（向下兼容用处理）
var bsTimeout = global.bsTimeout = mod.loading;

//页面初始化
global.Config.page.reset && pageInit();
mod.init();

}(this);

