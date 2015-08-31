/**
 * Copyright 2015, jackness.org
 * Creator: jackNEss Lau
 * $Author: Jackness Lau $
 * $Date: Mon Aug 31 2015 11:56:43 GMT+0800 (中国标准时间) $
 * $Version: 1.4.10 $
 */

!function(global,undefined){

//防止重复渲染
if(global.Config){
	return;
}
var mySrc = (function(){
    if(/bs_config\.js$/g.test(document.scripts[document.scripts.length - 1].src)){
        return document.scripts[document.scripts.length - 1].src;
    } else {
        for(var i = 0, fsrc, len = document.scripts.length; i < len; i++){
            fsrc = document.scripts[i].src;
            if(/bs_config\.js/g.test(fsrc)){
                return fsrc;
            }
        }
    }
})();

var Config = global.Config = {
	
	//主域名
	domain:mySrc.split("bs_config.js")[0] + "../",
	//时间错
	cssjsdate:mySrc.indexOf("?") != -1? mySrc.split("?").pop():"",

	//用来记录location的 cookies 键值
	locationMark:"moduiBackstage",

	//后台首页地址
	mainPage:"",

	//需要加载的js
	scripts:[
		'js/lib/dist/jquery-1.11.0.min.js',
		'js/lib/dist/jns_calendar.min.js',
		// 'js/lib/dist/bs_global.min.js',
		'js/lib/src/bs_global.js',
		'js/bs_init.js'
	],

	//上传接口用地址参数
	upload:{
		//图片上传处理地址
		imagePath:"",
		//文件上传处理地址
		filePath:"",
		//歌曲上传处理地址
		songPath:""
	},

	swf:{
		imgUpload:'swf/uploadfile.swf',
		songUpload:'swf/uploadfile.swf',
		fileUpload:'swf/uploadfile.swf',
		multiSongUpload:"swf/MultiMp3Upload.swf",
		multiSongUploadSkin:"swf/uploadUI.swf"
	},

	//正则校验
	reg:{
		//邮箱
		email:/^[\w-]+[\.]*[\w-]+[@][\w\-]{1,}([.]([\w\-]{1,})){1,3}$/g,
		//手机号
		mobile:/^\d{11}$/g,
		//密码
		password:/^\w{6,16}$/g
	},

	ajax:{
		//异步请求超时时间
		timeout:5000,
		//异步请求超时后文案
		timeoutText:"你的网络暂时不稳定，请稍后再试",
		//数据加载时的文案
		loadingText:"好音乐马上送到",
        //成功返回的状态码
        successCode: 1,
		//常用异步返回数据键值预设
		key : {
			//数据主体 json.data
			data : "data",

			//当前页码 json.page
			page : "page",
			//由第几页开始为第一页
			pageStart:1,

			//单页面数据量 json.pagesize
			size : "pagesize",

			//总数据大小 json.total
			total : "total",

			//错误信息 json.error
			message : "error",

			//状态值 json.status
			status : "status",
            

			//jsonp用 xx.php?callback=
			callback:"callback"
		}
	},

	//弹窗参数设置
	popup:{
		zIndex:100,
		//弹窗自动隐藏默认时间设置
		autoHide:2000,

		//启动调整大小功能
		resize:true,

		//启动最小化功能
		minimize:true


	},

	page:{
		//是否对页面执行初始化
		reset:true
	},
    // 数据存放用字段
    data: {}
};

//执行函数
global.jcLoader = function(option,callback){

		var dc = document,
			_type = "",
			_url = "",
			_callback = callback||function(){},
			createScript = function(url,callback){
				var urls = url.replace(/[,]\s*$/ig,"").split(","),
					scripts = [],
					completeNum = 0,
					onreadystatechangeHandle = function(){
						if( this.readyState == "loaded" || this.readyState == "complete" ){
							this.onreadystatechange = null;
							completeNum++;
							completeNum >= urls.length?callback():"";
						}
					},
					onloadHandle = function(){
						completeNum++;
						completeNum >= urls.length?callback():"";
					};
				for( var i = 0; i < urls.length; i++ ){
					
					scripts[i] = dc.createElement("script");
					scripts[i].type = "text/javascript";
					scripts[i].src = urls[i];
					dc.getElementsByTagName("head")[0].appendChild(scripts[i]);
					
					if(!callback instanceof Function){return;}
					
					if(scripts[i].readyState){
						scripts[i].onreadystatechange = onreadystatechangeHandle;
					}
					else{
						scripts[i].onload = onloadHandle;
					}
					
				}
				
			},
		
			createLink = function(url,callback){
				var urls = url.replace(/[,]\s*$/ig,"").split(",");
				var links = [];
				for( var i = 0; i < urls.length; i++ ){
					links[i] = dc.createElement("link");
					links[i].rel = "stylesheet";
					links[i].href = urls[i];
					dc.getElementsByTagName("head")[0].appendChild(links[i]);
				}
				callback instanceof Function?callback():"";
			};

		option.type? _type = option.type:"";
		option.url? _url = option.url:"";
		typeof option.filtration == "boolean"? option.filtration = option.filtration:"";
		
		switch(_type){
			case "js":
			case "javascript": createScript(_url,_callback); break;
			case "css": createLink(_url,_callback); break;
		}

	};


var urls = [];
for(var i = 0,src = "", len = Config.scripts.length; i < len; i++){
	src = Config.scripts[i].indexOf("http://") == -1? Config.domain + Config.scripts[i]:Config.scripts[i];
    urls.push(src + "?" + Config.cssjsdate);
}

// 异步加载
if(/type=ajax/.test(mySrc)){
    var callbackName = mySrc.replace(/^.+callback=/,'').replace(/&.*$/, '');
    jcLoader({
        "url": urls.join(','), 
        "type": 'js'
    }, function(){
        callbackName && window[callbackName] && window[callbackName]();
    });

// document.write 方式加载
} else {
    var html = "";
    for(var i = 0,src = "", len = urls.length; i < len; i++){
    	src = urls[i];
    	html += '<script type="text/javascript" src="'+ src + '?' + Config.cssjsdate +'"></script>';
    }

    document.write(html);      
}

}(this);
