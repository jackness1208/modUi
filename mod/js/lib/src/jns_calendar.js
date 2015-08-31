/**
 * Copyright 2015, jackness.org
 * Creator: jackNEss Lau
 * $Author: Jackness Lau $
 * $Date: Mon Aug 31 2015 11:46:02 GMT+0800 (中国标准时间) $
 * version:1.28
 */
var jnsCalendar = function(){

	/* option
	------------------------------------*/
	var option = {

		/* 日历类型
		 * date:日期选择
		 * dateTime:日期时间选择
		 * intervalTime:日期区域选择 几号 - 几号之间
		 */
		type:"date",
		/* 显示格式
		 * 参数：
		 * YYYY 年
		 * MM   月
		 * DD   日
		 * hh   时
		 * mm   分
		 * ss   秒
		 */
		format:"YYYY-MM-DD",

		/* 选择完成后调用的方法
		 * 如果是 date|dateTime类型的，返回 对应的时间
		 * 如果是 intervalTime类型的，返回 2个参数 分别是开始时间和结束时间
		 */
		callback:function(data){},

		/* 执行清除操作后调用的方法
		 * 如果是 date|dateTime类型的，返回 对应的时间
		 * 如果是 intervalTime类型的，返回 2个参数 分别是开始时间和结束时间
		 */
		onclean:function(date){},
		
		//日历控件距离目标对象的垂直距离
		vDistance:20,

		//适用于intervalTime类型控件，开始日期的input对象，读取时将直接读该对象的 value 值
		startDateInput:null,
		//适用于intervalTime类型控件，结束日期的input对象，读取时将直接读该对象的 value 值
		endDateInput:null,
		//适用于intervalTime类型控件，允许选择同一天
		selectSameDate:true,

		//日期选择的范围-下限
		dateRangeStart:null,
		//日期选择的范围-上限
		dateRangeEnd:null,

		zIndex:"100",

		onload:function(){},

		//日历插入的地方
		appendTarget:document.body
	}


	/* jns start
	-------------------------------------------------------------------------------------------------*/
	var jns = {};
	/**
	 * console 测试输出
	 * <pre>
	 * jns.console("elm is undefined")
	 * </pre>
	 * @param:   {string} msg 要 console出来的信息
	 * @return:  {void}
	 * @date:    2012-5-25
	 * @version: 1.0
	 */
	jns.console = function(msg){if(typeof console != "undefined"){console.log(msg); } };
	
	/**
	 * element selector 选择器
	 * <pre>
	 * jns.selector("#a .b span")
	 * jns.selector("#a");
	 * jns.selector("#a,.b span");
	 * jns.selector(elm);

	 * </pre>
	 * @param:   {string|object} source 目标对象或字符串
	 * @return:  {object|null}   当获取对象为单一一个时，返回单一对象，否则返回一个对象的数组集合
	 * @date:    2012-11-30
	 * @version: 2.0
	 */
	jns.selector = function(source){var dc = document; if( typeof source == "object"){return source; } else if( typeof source == "string"){var strGroup = source.split(/\s*,\s*/g), result = []; for(var i = 0, len = strGroup.length; i < len; i++){var fs = strGroup[i], fGroup = fs.split(/\s+/), fGroupLen = fGroup.length, mySource, mySourceLen, myResult = dc; if(fGroupLen === 1 && fGroup[0].substr(0,1) == "#"){myResult = dc.getElementById( fGroup[0].substr(1) ); } else {if(dc.querySelectorAll){myResult = dc.querySelectorAll(source); } else {for( var j = 0; j < fGroupLen; j++){mySource = fGroup[j]; mySourceLen = mySource.length; if(mySourceLen === 0){continue;} switch(mySource.substr(0,1)){case "#": myResult = idSelector(myResult,mySource.substr(1)); break; case ".": myResult = classSelector(myResult,mySource.substr(1)); break; default: myResult = tagSelector(myResult,mySource); break; } } } } if(myResult){if("length" in myResult){if(i == 0){for(var j = 0, jlen = myResult.length; j < jlen; j++){result.push(myResult[j]); } } else {for(var j = 0, jlen = myResult.length; j < jlen; j++){isRepeat(result,myResult[j])?"":result.push(myResult[j]); } } } else {if(i == 0){result.push(myResult); } else {isRepeat(result,myResult)?"":result.push(myResult); } } } } if(result.length === 0){return false; } else if(result.length === 1){return result[0]; } else {return result; } } function idSelector(target,idStr){return dc.getElementById(idStr); } function classSelector(target,className){var targetGroup = [].concat(target); var targetGroup_len = targetGroup.length; var result = []; var fTarget; var fGroup; var fTarget_cells; var fTarget_cells_len; var fClassNames; var fClassNames_len; for( var i = 0; i < targetGroup_len; i++){fTarget = targetGroup[i]; if(!fTarget){continue;} fTarget_cells = fTarget.getElementsByTagName("*"); fTarget_cells_len = fTarget_cells.length; for( var k = 0; k < fTarget_cells_len; k++){fClassNames = fTarget_cells[k].className.split(" "); fClassNames_len = fClassNames.length; for( var j = 0; j < fClassNames_len; j++){if(fClassNames[j] == className){result = result.concat(fTarget_cells[k]); break; } } } } return result; } function tagSelector(target,tagStr){var targetGroup = [].concat(target); var targetGroup_len = targetGroup.length; var result = []; var fragTarget; var fragGroup; var fragGroup_len; for( var i = 0; i < targetGroup_len; i++){fragTarget = targetGroup[i]; if(!fragTarget){continue;} fragGroup = fragTarget.getElementsByTagName(tagStr); fragGroup_len = fragGroup.length; for( var j = 0; j < fragGroup_len;j++){result = result.concat(fragGroup[j]); } } return result; } function isRepeat(target,srcElement){for(var i = 0, len = target.length; i < len; i++){if(srcElement == target[i]){return true; break; } } return false; } };
	/**
	 * each
	 * <pre>
	 * jns.each(targets,function(){alert(this);})
	 * </pre>
	 * @param:   {object}   elms 对象(一个或多个)
	 * @param:   {function} func 需要绑定的事件
	 * @return:  {void}
	 * @date:    2012-11-28
	 * @version: 2.1
	 */
	jns.each = function(elms,func){if(!elms){return;} if(typeof elms.length == "undefined" || elms.tagName == "SELECT"){elms = [elms]; } for( var i = 0, len = elms.length; i < len; i++){func.call(elms[i],i,elms[i]); } };
	
	/**
	 * add event 绑定事件
	 * <pre>
	 * jns.bind(elm,"click",clickHandle)
	 * jns.bind(elm,"click mouseover",clickHandle)
	 * </pre>
	 * @base:jns.each
	 * @param:   {object}   target 需要绑定事件的对象
	 * @param:   {string}   type   需要绑定的事件名称
	 * @param:   {function} func   需要绑定的事件方法
	 * @return:  {void}
	 * @date:    2013-1-18
	 * @version: 2.0
	 */
	jns.bind = function(target,types,func){if(typeof func != "function" || !target || typeof types != "string"){return;} var _addEvent = function(e){ func.call(target,e); }, bindHandle = function(){}, type; if(target.addEventListener){bindHandle = function(type){ target.addEventListener(type,_addEvent,false); } } else if(target.attachEvent){bindHandle = function(type){ target.attachEvent("on" + type,_addEvent); } } if(!func.jnsBindKey){ func.jnsBindKey = [];} jns.each(types.split(/[ ]+/g),function(){var type = this + ""; bindHandle(type); func.jnsBindKey.push({target:target,type:type,bindKey:_addEvent}); }) };
	/**
	 * remove event
	 * <pre>
	 * jns.unbind(elm,"click",clickHandle)
	 * jns.unbind(elm,"click mouseover",clickHandle)
	 * </pre>
	 * @base: jns.each
	 * @param:   {object}   target 需要解除绑定事件的对象
	 * @param:   {string}   type   需要解除绑定的事件名称
	 * @param:   {function} func   需要解除绑定的事件方法
	 * @return:  {void}
	 * @date:    2013-1-18
	 * @version: 2.0
	 */
	jns.unbind = function(target,types,func){if(typeof func != "function" || !target || typeof types != "string"){return;} var unbindKey,type, unbindHandle = function(type){}; if(target.removeEventListener){unbindHandle = function(type,unbindKey){target.removeEventListener(type,unbindKey,false);} } else if(target.detachEvent){unbindHandle = function(type,unbindKey){target.detachEvent("on" + type,unbindKey);} } jns.each(types.split(/[ ]+/g),function(){type = this + ""; if(func.jnsBindKey){for( var i = 0, len = func.jnsBindKey.length; i < len; i++ ){var fragSource = func.jnsBindKey[i]; if(fragSource.target == target && fragSource.type == type){unbindKey = fragSource.bindKey; func.jnsBindKey.splice(i,1); break; } }; } else {unbindKey = func; } unbindHandle(type,unbindKey); }) }; 

	/** * add class 添加类
	 * <pre>
	 * jns.addClass(elm,"cur")
	 * </pre>
	 * @param:   {object} target    目标对象
	 * @param:   {string} className 需要添加的样式名称
	 * @return:   {void}
	 * @date:    2012-7-7
	 * @version: 1.1
	 */
	jns.addClass = function(target,className){var oClassName = target.className; if(!oClassName){target.className = className; } else{var classNames = oClassName.split(/\s+/); for(var i = 0,len = classNames.length; i < len; i++){if(classNames[i] === className){ return;} } target.className = oClassName + " " + className; } };
	
	/**
	 * remove class 移除类
	 * <pre>
	 * jns.removeClass(elm,"cur")
	 * </pre>
	 * @param:   {object} target    目标对象
	 * @param:   {string} className 需要移除的样式名称
	 * @return:   {void}
	 * @date:    2012-7-7
	 * @version: 1.1
	 */
	jns.removeClass = function(target,className){var oClassName = target.className; if(!oClassName){return; } var classNames = oClassName.split(/\s+/); for(var i = 0, len = classNames.length; i < len; i++){if(classNames[i] === className){ classNames[i] = "";} } target.className = classNames.join(" "); };
	
	/**
	 * stop bubble 阻止事件冒泡
	 * <pre>
	 * jns.stopBubble();
	 * </pre>
	 * @return:  {void}
	 * @date:    2012-5-25
	 * @version: 1.0
	 */
	jns.stopBubble = function(e){e = e || window.event; if(e.stopPropagation){e.stopPropagation();} else{e.cancelBubble = true;} };
	
	/**
	 * 主动激活事件
	 * <pre>
	 * jns.trigger(elm,"click")
	 * </pre>
	 * @param:   {object} target 目标对象
	 * @param:   {string} type   触发的事件
	 * @return:  {void}
	 * @date:    2012-7-8
	 * @version: 1.1
	 */
	jns.trigger = function(target,type){var dc = document; if(dc.createEvent){var evt = dc.createEvent("HTMLEvents"); evt.initEvent(type,false,true); target.dispatchEvent(evt); } else if(dc.createEventObject){target.fireEvent("on" + type); } };
	
	/** 
	 * 动态添加样式 1.0
	 * <pre>
	 * jns.addStyle("body{color:red}","popupsStyleSheet")
	 * </pre>
	 * @param:   {string} cssText 需要动态添加的css样式内容
	 * @param:   {string} styleId 动态添加的 <style> 标签Id
	 * @date:    2012-11-28
	 * @version: 1.1
	 */
	jns.addStyle = function(cssText,styleId){var dc = document; if(typeof cssText != "string" || cssText == ""){return;} if(typeof styleId == "undefined"){styleId = "jnsStyleSheet" + Math.round(Math.radom(0,1)*1000); } else{if(dc.getElementById(styleId)){return;} } var head = dc.getElementsByTagName("head")[0]; var style = dc.createElement("style"); style.type = "text/css"; style.id = styleId; if(style.styleSheet){style.styleSheet.cssText = cssText; } else{style.textContent = cssText; } head.appendChild(style); };
	
	/**
	 * css样式设置/获取
	 * <pre>
	 * jns.css(elm,"background")
	 * jns.css(elm,"backgroun","red")
	 * </pre>
	 * @param:   {object}      target     目标对象
	 * @param:   {string}      styleAttr  css属性名称
	 * @param:   {string|null} value      需要设置的css属性名称
	 * @return:  {void}
	 * @date:    2012-5-25
	 * @version: 1.0
	 */
	jns.css = function(target,styleAttr,value){if(!target || typeof target.style == "undefined" || typeof styleAttr != "string"){return;} if(typeof value != "undefined"){target.style[styleAttr] = value; } else{var fStyleValue = target.style[styleAttr]; if(fStyleValue){return fStyleValue; } else{try{return	target.currentStyle?target.currentStyle[styleAttr]:document.defaultView.getComputedStyle(target,false)[styleAttr]; } catch(e){return null; } } } }; 
	
	/**
	 * 判断是否属于从属关系
	 * <pre>
	 * jns.isBelong(target,srcElement)
	 * </pre>
	 * @param:   {object} target    目标对象(父级)
	 * @param:   {object} belongOne 目标对象(被判断对象)
	 * @return:  {void}
	 * @date:    2012-7-8
	 * @version: 1.0
	 */
	jns.isBelong = function(target,belongOne){for(var _belongOne = belongOne;_belongOne;_belongOne = _belongOne.parentNode){if(_belongOne === target){return true; break; } } };
	
	/*
	 * 获取元素距离浏览器左上角距离
	 * <pre>
	 * jns.getPosition(target).left
	 * jns.getPosition(target).top
	 * var acc = jns.getPosition(target),
	       targetLeft = acc.left,
	       targetTop = acc.top;
	 * </pre>
	 * @base:    jns.css
	 * @param:   {object} 目标对象
	 * @return:  {object} 接口参数
	 *                    left:[number] 目标对象距离左上角的 left值
	 *                    top: [number] 目标对象距离左上角的 top 值
	 * @date:    2014-5-5
	 * @version: 2.3
	 */
	jns.getPosition = function(target,cw){
		cw = cw || window;

		var dc = document,
	        fparent = target,
	        fparent2 = target,
	        acc = target.getBoundingClientRect(),
	        _x = fparent.offsetLeft,
	        _y = fparent.offsetTop;
	    
	    while(fparent = fparent.offsetParent){
	    	_x += fparent.offsetLeft;
	        _y += fparent.offsetTop;
	    }

	    while(fparent2 = fparent2.parentNode){
	    	fparent2.scrollTop && (_y -= fparent2.scrollTop);
	    	fparent2.scrollLeft && (_x -= fparent2.scrollLeft);
	    }


	    return{
	        left:_x,
	        top:_y,
	        right:document.body.scrollLeft + acc.right,
	        bottom:document.body.scrollTop + acc.bottom
	    }
	}; 
	/*
	 * 格式转换操作
	 */

	jns.format = {
		/*
		 * 将数据转换成 Date格式
		 * <pre>
		 * jns.format.toDate("2012-5-8")
		 * </pre>
		 * @param:   {object|string} source 日期数据
		 * @return:  {Date|null}
		 * @date:    2012-6-8
		 * @version: 1.0
		 */
		toDate:function(source){var result; switch (typeof source){case "string": result = new Date(source.split("-").join("/"));break; case "object": result = new Date(source);break; } if(result == "Invalid Date"){result = null; } return result; } 
	};

	/**
	 * preventDefault 阻止浏览器默认事件
	 * <pre>
	 * jns.preventDefault();
	 * </pre>
	 * @return:  {void}
	 * @date:    2012-11-22
	 * @version: 1.0
	 */
	jns.preventDefault = function(e){e = e || window.event; if("preventDefault" in e){e.preventDefault(); } else if("returnValue" in e){e.returnValue = false; } };
	
	/* jns end
	-------------------------------------------------------------------------------------------------*/

	var _op,
		target,
		calendar,
		isShow = false;
		
	arguments[0]? target = jns.selector(arguments[0]):"";
	arguments[1]? _op = arguments[1]:"";

	var cld = {
			//控件小三角
			tri:null,
			//控件向前按钮
			prevBtn:null,
			//控件向后按钮
			nextBtn:null,

			//日历主体部分
			mArea01:null,
			//日历主体-顶部提示
			mArea01Title:null,
			//日历主体-主要部分
			mArea01Content:null,
			//日历主体-日历区域
			mArea01dateBox:null,
			//日历主体-日期列表部分
			mArea01dateList:null,
			//日历主体-月历区域
			mArea01MoonBox:null,
			//日历主体-月份列表部分
			mArea01MoonList:null,
			//日历主体-年历区域
			mArea01YearBox:null,
			//日历主体-年份列表部分
			mArea01YearList:null,

			//日历主体部分
			mArea02:null,
			//日历主体-顶部提示
			mArea02Title:null,
			//日历主体-主要部分
			mArea02Content:null,
			//日历主体-日历区域
			mArea02dateBox:null,
			//日历主体-日期列表部分
			mArea02dateList:null,
			//日历主体-月历区域
			mArea02MoonBox:null,
			//日历主体-月份列表部分
			mArea02MoonList:null,
			//日历主体-年历区域
			mArea02YearBox:null,
			//日历主体-年份列表部分
			mArea02YearList:null,

			//小时输入部分
			hourInput:null,
			//小时弹出层
			hourPopup:null,
			//小时列表
			hourList:null,

			//分钟输入部分
			minuteInput:null,
			//分钟弹出层
			minutePopup:null,
			//分钟列表
			minuteList:null,

			//秒钟输入部分
			secondInput:null,
			//秒钟弹出层
			secondPopup:null,
			//秒钟列表
			secondList:null,
			//秒钟冒号
			secondFrag:null,

			//开始日期
			startDateInput:null,
			//结束日期
			endDateInput:null,
			//提示区域
			msgArea:null,

			//今天按钮
			cleanBtn:null,
			//确定按钮
			okBtn:null,

			//选中的日期01(start date)
			curDate01:null,
			//选中的日期02(end date)
			curDate02:null,
			//当前焦点的月份
			focusMonth:null

			
		},
		//动态添加样式
		styleInit = function(){
			var styleId = "jnsCalendarStyleheet",
				cssText = [
				/*控件外框*/
				'.jns-cld{ background:#666; color:#474747; }',
				/*控件箭头*/
				'.jns-cld_tri{ color:#666;}',
				/*控件日历底色*/
				'.jns-cld_main{ border-color:#004588; background-color:#fff;}',
				/*控件左右箭头*/
				'.jns-cld_prevbtn,',
				'.jns-cld_nextbtn{ color:#fff;}',
				/*控件顶部区域*/
				'.jns-cld_head_bg{ border-top-color:#4dcdf3; background:#0098d2; background:-webkit-gradient(linear,0 0,0 100%,from(#00b3eb),to(#00367a)); background:-moz-linear-gradient(top,#00b3eb,#00367a); background:-o-linear-gradient(top,#00b3eb,#00367a);  background:-ms-linear-gradient(top,#00b3eb,#00367a);  filter:progid:DXImageTransform.Microsoft.gradient(enabled=true,GradientType:0,startColorstr="#00b3eb",endColorstr="#00367a"); }',
				'.jns-cld_content{}',
				'.jns-cld_mainbox_head,',
				'.jns-cld_mainbox_head_tl{ color:#fff;}',
				/*控件日历区域星期部分*/
				'.jns-cld_main_cldlist dt{ background:#f6f6f6; background:-webkit-gradient(linear,0 0,0 100%,from(#fcfcfc),to(#e8e7e8)); background:-moz-linear-gradient(top,#fcfcfc,#e8e7e8); background:-o-linear-gradient(top,#fcfcfc,#e8e7e8); background:-ms-linear-gradient(top,#fcfcfc,#e8e7e8); filter:progid:DXImageTransform.Microsoft.gradient(enabled=true,GradientType:0,startColorstr="#fcfcfc",endColorstr="#e8e7e8"); font-weight:normal;}',
				/*控件日期部分鼠标经过后通用样式*/
				'.jns-cld_mainbox .jns-cld_main_cldlist dd a:hover,',
				'.jns-cld_mainbox .jns-cld_main_cldlist dd a.jns-cld_hover,',
				'.jns-cld_popup_list dd a:hover{ border-color:#448aca; background-color:#eef7fe;}',
				/*控件日期部分选中之后通用样式*/
				'.jns-cld_mainbox .jns-cld_main_cldlist dd a.jns-cld_cur,',
				'.jns-cld_popup_list a.jns-cld_cur{ border-color:#448aca !important; background-color:#c5e0f5; color:#002e73; background:-webkit-gradient(linear,0 0,0 100%,from(#cce3f4),to(#a9d2f2)); background:-moz-linear-gradient(top,#cce3f4,#a9d2f2); background:-o-linear-gradient(top,#cce3f4,#a9d2f2); background:-ms-linear-gradient(top,#cce3f4,#a9d2f2); filter:progid:DXImageTransform.Microsoft.gradient(enabled=true,GradientType:0,startColorstr="#cce3f4",endColorstr="#a9d2f2");}',
				/*日期样式*/
				'.jns-cld_sun,',
				'dd.jns-cld_sun  a{ color:#f60;}',
				'.jns-cld_mon{}',
				'.jns-cld_tus{}',
				'.jns-cld_wed{}',
				'.jns-cld_fur{}',
				'.jns-cld_fri{}',
				'.jns-cld_sat,',
				'dd.jns-cld_sat  a{ color:#f60;}',
				/* 今日样式 */
				'.jns-cld_datebox .jns-cld_main_cldlist dd.jns-cld_today a{ font-weight:bold; border-color:#448aca; background-color:#eef7fe; position:relative; z-index:2;}',
				/*高光*/
				'dd.jns-cld_highLight,',
				'dd.jns-cld_highLight a{ color:#f60;}',
				/*变灰*/
				'dd.jns-cld_grid,',
				'dd.jns-cld_grid a{ background-color:#ddd; color:#828282 !important;}',
				'dd.jns-cld_grid a:hover{ background-color:#ddd !important; color:#828282; border-color:#bbb}',
				'dd.jns-cld_disable,',
				'dd.jns-cld_disable a{ color:#ccc; cursor:default; }',
				'dd.jns-cld_disable a:hover{ border-color:#bbb !important; background:none !important;}',
				'dd.jns-cld_disable a.jns-cld_cur,',
				'dd.jns-cld_disable a.jns-cld_cur:hover{ border-color:#448aca !important; background:none !important; filter:none !important;}',
				'.jns-cld_moonbox dd.jns-cld_disable a:hover,',
				'.jns-cld_moonbox dd.jns-cld_disable a.jns-cld_cur,',
				'.jns-cld_moonbox dd.jns-cld_disable a.jns-cld_cur:hover{ border-color:#fff !important; background:none !important;}',
				'.jns-cld_yearbox dd.jns-cld_disable a:hover,',
				'.jns-cld_yearbox dd.jns-cld_disable a.jns-cld_cur,',
				'.jns-cld_yearbox dd.jns-cld_disable a.jns-cld_cur:hover{ border-color:#fff !important; background:none !important;}',
				'.jns-cld_monthbox dd.jns-cld_grid,',
				'.jns-cld_monthbox dd.jns-cld_grid a,',
				'.jns-cld_monthbox dd.jns-cld_grid a:hover,',
				'.jns-cld_yearbox dd.jns-cld_grid,',
				'.jns-cld_yearbox dd.jns-cld_grid a,',
				'.jns-cld_yearbox dd.jns-cld_grid a:hover{ background:none !important; border-color:#828282; color:#828282}',
				/*红色*/
				'.jns-cld_red{ color:#f00;}',
				/*橙色*/
				'.jns-cld_orange{ color:#f60;}',
				/*时间区域用弹出层*/
				'.jns-cld_popupbox{ background-color:#386b96;}',
				'.jns-cld_popup_tri{}',
				/*通用按钮*/
				'.jns-cld_btn_style01{ border:1px solid #999; background:#f9f9f9; color:#474747;}',
				'.jns-cld_btn_style01:hover{border-color:#666; background:#fff; color:#333;}',
				'.jns-cld_btn_style01_disable,',
				'.jns-cld_btn_style01_disable:hover{border:1px solid #bbb; background:#f2f2f3; color:#7b7b7b;}',
				/*出错*/
				'.jns-cld_error{ border:1px solid red !important; color:red !important;}',
				/* 主体
				---------------------------------------------*/
				'.jns-cld{ display:none; margin:0; padding:5px; position:absolute; text-align:left; font:12px/1.5 arial,\'\\5b8b\\4f53\',sans-serif; -webkit-box-shadow:0 0 3px #000; -moz-box-shadow:0 0 3px #000; box-shadow:0 0 3px #000; border-radius:5px;}',
				'.jns-cld a{ text-decoration:none;}',
				'.jns-cld_cur{ display:block;}',
				'.jns-cld_disable{ cursor:default !important;}',
				/* 单个日历模式 */
				'.jns-cld_c1{ width:223px;}',
				/* 2个日历模式 */
				'.jns-cld_c2{ width:439px;}',
				'.jns-cld_c2 .jns-cld_mainbox{ float:left; display:inline; margin-left:5px;}',
				'.jns-cld_c2 .jns-cld_content{ padding-left:0;}',
				'.jns-cld_c2 .jns-cld_foot_lt{ margin-left:0;}',
				/*小三角*/
				'.jns-cld_tri{ position:absolute; font-size:12px; font-style:normal;  margin:0; padding:0; width:1em; height:1em; line-height:1.2;}',
				'.jns-cld_tri_top{ top:-0.5em;}',
				'.jns-cld_tri_bottom{ bottom:-0.5em; _bottom:-0.7em;}',
				'.jns-cld_tri_left{ left:-0.5em;}',
				'.jns-cld_tri_right{ right:-0.5em;}',
				'.jns-cld_main{ position:relative; border-width:1px; border-style:solid; overflow:hidden; zoom:1;}',
				'.jns-cld_prevbtn,',
				'.jns-cld_nextbtn{ position:absolute; z-index:2; top:2px; width:0.5em; font-size:12px; -webkit-text-size-ajust:none; height:1.2em; margin:0; padding:0; overflow:hidden; cursor:pointer;}',
				'.jns-cld_prevbtn{ left:5px;}',
				'.jns-cld_nextbtn{ right:5px; text-indent:-5px;}',
				'.jns-cld_head_bg{ height:20px; border-top-width:1px; border-top-style:solid;}',
				'.jns-cld_content{ padding:5px; z-index:1; zoom:1; position:relative;}',
				'.jns-cld_content:after{ content:"."; display:block; height:0; overflow:hidden; clear:both;}',
				'.jns-cld_mainbox{ position:relative; height:170px; width:211px; z-index:2;}',
				'.jns-cld_mainbox_head{ position:absolute; top:-25px; left:0; width:100%; height:20px; text-align:center; line-height:20px; font-size:12px; font-weight:bold;}',
				'.jns-cld_mainbox_head_tl{ display:block; margin:0 20px;}',
				'.jns-cld_mainbox_content{ zoom:1;}',
				'.jns-cld_mainbox_content:after{ content:"."; display:block; height:0; overflow:hidden; clear:both;}',
				/* 日历区域  */
				'.jns-cld_main_cldlist{ position:relative; zoom:1; margin:0; padding:0; font-size:12px; list-style:none; border-left:1px solid #bbb; border-top:1px solid #bbb; width:210px;}',
				'.jns-cld_main_cldlist:after{ content:"."; display:block; height:0; overflow:hidden; clear:both;}',
				'.jns-cld_main_cldlist a{ color:#474747;}',
				'.jns-cld_main_cldlist dt,',
				'.jns-cld_main_cldlist dd{ float:left; list-style:none;text-align:center; margin:-1px 0 0 -1px; font-size:12px;}',
				'.jns-cld_main_cldlist dd a.jns-cld_cur{ position:relative; z-index:3; }',
				'.jns-cld_main_cldlist dd a{ display:block; margin:-1px; text-align:center;}',
				'.jns-cld_main_cldlist dd a:hover{ position:relative; z-index:2;}',
				'.jns-cld_main_cldlist .jns-cld_sat{}',
				'.jns-cld_maincell{ position:absolute; top:0; left:0; width:100%; visibility:hidden;}',
				'.jns-cld_maincell_cur{ visibility:visible;}',
				/* 日历 */
				'.jns-cld_datebox{}',
				'.jns-cld_datebox .jns-cld_main_cldlist dt,',
				'.jns-cld_datebox .jns-cld_main_cldlist dd,',
				'.jns-cld_datebox .jns-cld_main_cldlist dd a{ width:29px; height:23px; line-height:23px; border:1px solid #bbb;}',
				/* 月历 */
				'.jns-cld_moonbox{}',
				'.jns-cld_moonbox .jns-cld_main_cldlist{ border-color:#fff;}',
				'.jns-cld_moonbox .jns-cld_main_cldlist dt,',
				'.jns-cld_moonbox .jns-cld_main_cldlist dd,',
				'.jns-cld_moonbox .jns-cld_main_cldlist dd a{ width:51px; height:55px; line-height:53px; border:1px solid #fff;}',
				/* 年历 */
				'.jns-cld_yearbox{}',
				'.jns-cld_yearbox .jns-cld_main_cldlist{ border-color:#fff;}',
				'.jns-cld_yearbox .jns-cld_main_cldlist dt,',
				'.jns-cld_yearbox .jns-cld_main_cldlist dd,',
				'.jns-cld_yearbox .jns-cld_main_cldlist dd a{ width:51px; height:55px; line-height:53px; border:1px solid #fff;}',
				/* 底部功能区域 */
				'.jns-cld_foot{ position:relative; z-index:3; zoom:1; padding:0 5px 5px;}',
				'.jns-cld_foot:after{ content:"."; display:block; height:0; overflow:hidden; clear:both;}',
				'.jns-cld_foot_lt{ float:left; margin-left:5px; display:inline;}',
				'.jns-cld_foot_rt{ float:right;}',
				/* 输入框 */
				'.jns-cld_input_style01{ display:inline-block; height:16px; line-height:16px; width:15px; margin-right:3px; padding:1px; border:1px solid #fff; color:#474747; background:#fff; overflow:visible; cursor:pointer; outline:none;}',
				'.jns-cld_input_style01_hover{ color:#004588;}',
				'.jns-cld_input_style01_cur{ background-color:#fcfcfc; border-color:#004588;}',
				'.jns-cld_input_style01_txt{ display:inline-block; height:16px; line-height:16px; margin-right:3px;}',
				'.jns-cld_input_style02{ display:inline-block; height:16px; line-height:16px; width:65px; margin-right:3px; padding:1px 15px; border:1px solid #bbb; color:#7b7b7b; background:#f2f2f3; cursor:pointer; outline:none;}',
				'.jns-cld_input_style02_cur{ background-color:#f9f9f9; border-color:#666; color:#333;}',
				'.jns-cld_input_style02_error{ background-color:#feeeee; border-color:#f00; color:#a50000}',
				'.jns-cld_input_style02_txt{ display:inline-block; height:16px; line-height:16px; margin-right:3px;}',
				/* 弹出层部分 */
				'.jns-cld_popupbox{ position:absolute; bottom:32px; left:5px; width:207px; padding:2px; visibility:hidden;}',
				'.jns-cld_popupbox_cur{ visibility:visible;}',
				'.jns-cld_popup_tri{ position:absolute; bottom:-8px; width:0; height:0; border:4px dashed transparent; border-top:4px solid #386b96; overflow:hidden;}',
				'.jns-cld_popup_content{ margin:0; padding:2px; background:#fff; border:1px solid #004588;}',
				'.jns-cld_popup_list{ zoom:1; margin:0; padding:0; font-size:12px; list-style:none; border-left:1px solid #fff; border-top:1px solid #fff; width:200px;}',
				'.jns-cld_popup_list:after{ content:"."; display:block; height:0; overflow:hidden; clear:both;}',
				'.jns-cld_popup_list dd{ float:left; list-style:none; border:1px solid #fff; text-align:center; margin:-1px 0 0 -1px; font-size:12px;}',
				'.jns-cld_popup_list a{  display:block; border:1px solid #fff; margin:-1px; text-align:center; color:#474747;}',
				'.jns-cld_popup_list a.jns-cld_cur{ position:relative; z-index:2;}',
				'.jns-cld_popup_list dd a:hover{ position:relative; z-index:2;}',
				'.jns-cld_pop_hour{}',
				'.jns-cld_pop_hour .jns-cld_popup_tri{ left:12px; }',
				'.jns-cld_pop_hour .jns-cld_popup_list dd,',
				'.jns-cld_pop_hour .jns-cld_popup_list a{width:32px; height:19px; line-height:19px; }',
				'.jns-cld_pop_min{}',
				'.jns-cld_pop_min .jns-cld_popup_tri{ left:40px;}',
				'.jns-cld_pop_min .jns-cld_popup_list dd,',
				'.jns-cld_pop_min .jns-cld_popup_list a{width:19px; height:19px; line-height:19px; }',
				'.jns-cld_pop_sec{}',
				'.jns-cld_pop_sec .jns-cld_popup_tri{ left:67px;}',
				'.jns-cld_pop_sec .jns-cld_popup_list dd,',
				'.jns-cld_pop_sec .jns-cld_popup_list a{width:19px; height:19px; line-height:19px; }',
				/* 按钮部分 */
				'.jns-cld_btn_style01{ display:inline-block; vertical-align:middle; height:19px; margin-left:5px; line-height:19px; padding:0 10px;}',
				'.jns-cld_btn_style01:hover{}',
				'.jns-cld_btn_style01_txt{ display:inline-block; vertical-align:middle; height:19px; line-height:19px; margin-left:5px; overflow:hidden;}',
				'.jns-cld_btn_style01_disable{ cursor:default; }',
				/* 提示部分 */
				'.jns-cld_tips{ position:absolute; top:0; left:0; z-index:3; width:100px; text-align:center; font:12px/1.5 Arial,"\5b8b\4f53",sans-serif;}',
				'.jns-cld_tips_content{ display:inline-block; *display:inline; *zoom:1; padding:0px 5px; border:1px solid #666; background:#fff; border-radius:5px; text-align:left;}',
				'.jns-cld_tips_tri,',
				'.jns-cld_tips_tri2{ position:absolute; bottom:-0.5em; left:50%; -webkit-text-size-adjust:none; font-size:10px; display:block; width:1em; height:0.5em; margin-left:-0.5em; overflow:hidden; line-height:1;}',
				'.jns-cld_tips_tri{ z-index:1; bottom:-0.5em; color:#666;}',
				'.jns-cld_tips_tri2{ z-index:2; bottom:-0.4em; color:#fff;}',
				'.jns-cld_tips_tri i,',
				'.jns-cld_tips_tri2 i{ display:block;font-style:normal; margin-top:-0.5em;}'
				].join("\n");
			jns.addStyle(cssText,styleId);
		},

		//输入框事件初始化
		inputMatchInit = function(elm){
			var _this = this;

			/*elm.readOnly = true;
			elm.style.current = "pointer";*/

			jns.bind(elm,"focus",function(){
				calendar.srcTarget = this;
				isShow = true;
				_this.show(this);
				/*

				if(!calendar.srcTarget){
					calendar.srcTarget = this;
				}
				calendar.srcTarget == this?(
					option.type == "intervalTime" && isShow && (this == option.startDateInput && cld.focusType == "end") || (this == option.endDateInput && cld.focusType == "start")?(
						_this.hide(),
						_this.show(this)
					):(
						isShow = !isShow,
						isShow?_this.show(this):_this.hide()
					)
					
					
				):(

					calendar.srcTarget = this,
					isShow?(
						_this.hide(),
						_this.show(this)
					):(
						isShow = true,
						_this.show(this)
					)
				)*/
				
			});

			/*
			jns.bind(elm,"blur",function(){
				isShow = false;
				_this.hide();
			});
			*/

			// 双日历模式 特有的功能
			if(option.type != "intervalTime"){return;}
			
			if(elm == option.endDateInput && elm != option.startDateInput){
				jns.bind(elm,"focus",function(){
					intervalTimeFocusInit("end");
				});
			} else {
				jns.bind(elm,"focus",function(){
					intervalTimeFocusInit("start");
				});
			};

			//..
		},

		//初始化
		areaReset = function(){
			var dc = document,
				_this = this,
				now = new Date();


			//赋值到变量
			cld.allowDateStart = option.dateRangeStart;
			cld.allowDateEnd = option.dateRangeEnd;

			// 判断 now 是否在允许范围之内
			if(option.type != "intervalTime" || (option.type == "intervalTime" && option.selectSameDate)){
				if(!isInRange(now,"date")){
					if(option.dateRangeEnd && now > option.dateRangeEnd){
						now = option.dateRangeEnd;
					};

					if(option.dateRangeStart && now < option.dateRangeStart){
						now = option.dateRangeStart;
					};
				};
			} else {
				var fDate = new Date(now.getFullYear(),now.getMonth(),now.getDate() + 1);
				if(!isInRange(now,"date") || !isInRange(fDate,"date")){
					if(option.dateRangeEnd && fDate > option.dateRangeEnd){
						now = new Date(option.dateRangeEnd.getFullYear(),option.dateRangeEnd.getMonth(),option.dateRangeEnd.getDate() - 1);
					};

					if(option.dateRangeStart && now < option.dateRangeStart){
						now = option.dateRangeStart;
					};
				};
			}

			var nowYear = now.getFullYear(),
				nowMonth = now.getMonth(),
				nowDate = now.getDate();

			cld.curDate01 =  new Date(nowYear,nowMonth,nowDate);
			if(!option.selectSameDate){
				cld.curDate02 = new Date(nowYear,nowMonth,nowDate + 1);
			} else {
				cld.curDate02 = cld.curDate01;
			}

			cld.focusMonth = new Date(nowYear,nowMonth);

			styleInit();

			calendar = dc.createElement("div");
			option.zIndex && (calendar.style.zIndex = option.zIndex);
			switch(option.type){
				case "dateTime":
					dateCalendarInit();
					timeAreaInit();
					break;
				case "date":
					dateCalendarInit();
					break;
				case "intervalTime":
					intervalTimeCalendarInit();
					break;
			}
			
			//dc.getElementsByTagName("body")[0].appendChild(calendar);
		
			
			

			//绑定input的事件
			jns.each(target,function(){
				if(this.tagName.toLowerCase() == "input"){
					inputMatchInit.call(_this,this);
				} else {
					jns.bind(this,"click",function(){
						if(!calendar.srcTarget){
							calendar.srcTarget = this;
						}
						calendar.srcTarget == this?(
							option.type == "intervalTime" && isShow && (this == option.startDateInput && cld.focusType == "end") || (this == option.endDateInput && cld.focusType == "start")?(
								_this.hide(),
								_this.show(this)
							):(
								isShow = !isShow,
								isShow?_this.show(this):_this.hide()
							)
							
							
						):(

							calendar.srcTarget = this,
							isShow?(
								_this.hide(),
								_this.show(this)
							):(
								isShow = true,
								_this.show(this)
							)
						)
						
					});

					// 双日历模式 特有的功能
					if(option.type != "intervalTime"){return;}
					
					if(this == option.endDateInput && this != option.startDateInput){
						jns.bind(this,"click",function(){
							intervalTimeFocusInit("end");
						});
					} else {
						jns.bind(this,"click",function(){
							intervalTimeFocusInit("start");
						});
					};
				}

				
				
			});

			
			if(option.type != "intervalTime"){
				//绑定确认按钮事件
				cld.okBtn.onclick = function(){
					dateConver(cld.curDate01,calendar.srcTarget);
					cldHideHandle();
					option.callback(cld.curDate01);
				}
				cld.cleanBtn.onclick = function(){
					if(target.tagName == "INPUT" && target.type != "button" && target.type != "submit"){
						target.value = "";
					}
					option.onclean(cld.curDate01,cld.curDate02);
				}
			} else {
				//绑定确认按钮事件
				cld.okBtn.onclick = function(){
					if(!cld.startDateInput.isOk || !cld.endDateInput.isOk){return;}
					dateConver(cld.curDate01,option.startDateInput);
					dateConver(cld.curDate02,option.endDateInput);
					cldHideHandle();
					option.callback(cld.curDate01,cld.curDate02);

				};

				cld.cleanBtn.onclick = function(){
					if(option.startDateInput && option.startDateInput.tagName == "INPUT" && option.startDateInput.type != "button" && option.startDateInput.type != "submit"){
						option.startDateInput.value = "";
					}
					if(option.endDateInput && option.endDateInput.tagName == "INPUT" && option.endDateInput.type != "button" && option.endDateInput.type != "submit"){
						option.endDateInput.value = "";
					}
					
					cld.curDate02 = cld.curDate01 = new Date(nowYear,nowMonth,nowDate);
					cld.endDateInput.value = cld.startDateInput.value = nowYear + "-" + nowMonth + "-" + nowDate;
					intervalTimeFocusInit("start");

					option.onclean(cld.curDate01,cld.curDate02);
				};

				//区间选择的 onfocus 事件
				jns.bind(cld.startDateInput,"focus",function(){
					intervalTimeFocusInit("start");
				});

				jns.bind(cld.endDateInput,"focus",function(){
					intervalTimeFocusInit("end");
				});

				//区间选择的 onkeyup 事件
				cld.startDateInput.onkeyup = function(){
					var myValue = new Date(this.value.split("-").join("/"));

					if(isNaN(Number(myValue)) || !isInRange(myValue,"date") || myValue > cld.curDate02){
						jns.addClass(this,"jns-cld_error");
						cld.startDateInput.isOk = false;
						
					} else {
						jns.removeClass(this,"jns-cld_error");
						cld.startDateInput.isOk = true;
						
						cld.curDate01 = new Date(myValue.getFullYear(),myValue.getMonth(),myValue.getDate());
						mainAreaInit();
					}

					intervalTimeIsOkCheck();
				};

				cld.endDateInput.onkeyup = function(){
					var myValue = new Date(this.value.split("-").join("/"));
					if(isNaN(Number(myValue)) || !isInRange(myValue,"date") || myValue < cld.curDate01){
						jns.addClass(this,"jns-cld_error");
						cld.endDateInput.isOk = false;
					} else {
						jns.removeClass(this,"jns-cld_error");
						cld.endDateInput.isOk = true;

						cld.curDate02 = new Date(myValue.getFullYear(),myValue.getMonth(),myValue.getDate());
						mainAreaInit();

						
					}

					intervalTimeIsOkCheck();
				};

				//区间选择的 值初始化
				cld.startDateInput.value = cld.curDate01.getFullYear() + "-" + (cld.curDate01.getMonth() + 1) + "-" + cld.curDate01.getDate();
				cld.endDateInput.value = cld.curDate02.getFullYear() + "-" + (cld.curDate02.getMonth() + 1) + "-" + cld.curDate02.getDate();

				//判断是否允许按确定
				cld.startDateInput.isOk = cld.endDateInput.isOk = true;
			}

			
		},
		/**
		 * 单一日历模式初始化
		 * @return: {void}
		 */
		dateCalendarInit = function(){
			calendar.className = "jns-cld jns-cld_c1";
			calendar.innerHTML = [
				'<i class="jns-cld_tri">&#9670;</i>',//小三角
				'<div class="jns-cld_main">',
					'<a href="javascript:;" class="jns-cld_prevbtn">&#9670;</a>',//向左按钮
					'<a href="javascript:;" class="jns-cld_nextbtn">&#9670;</a>',//向右按钮
					'<div class="jns-cld_head_bg"></div>',
					'<div class="jns-cld_content">',
						'<div class="jns-cld_mainbox">',
							'<div class="jns-cld_mainbox_head">',
								'<a href="javascript:;" class="jns-cld_mainbox_head_tl"></a>',//日历区间表示 
							'</div>',
							'<div class="jns-cld_mainbox_content">',
								'<div class="jns-cld_maincell jns-cld_datebox jns-cld_maincell_cur">',//日历区域
									'<div class="jns-cld_mainbox_content">',//日历list
									'</div>',
								'</div>',

								'<div class="jns-cld_maincell jns-cld_moonbox">',//月历区域
									'<div class="jns-cld_mainbox_content">',//月历list
									'</div>',
								'</div>',

								'<div class="jns-cld_maincell jns-cld_yearbox">',//年历区域
									'<div class="jns-cld_mainbox_content">',//年历list
									'</div>',
								'</div>',
							'</div>',
						'</div>',
					'</div>',
					'<div class="jns-cld_foot">',
						'<div class="jns-cld_foot_lt">',//底部左侧区域
							(option.type == "dateTime"?[
								'<input class="jns-cld_input_style01" type="text" value="" />',//时

								'<div class="jns-cld_popupbox jns-cld_pop_hour">',//时间弹出层
									'<i class="jns-cld_popup_tri"></i>',
									'<div class="jns-cld_popup_content">',
										'<dl class="jns-cld_popup_list"></dl>',//时间弹出层list
									'</div>',
								'</div>',

								'<span class="jns-cld_input_style01_txt">:</span>',

								'<input class="jns-cld_input_style01" type="text" value="" />',//分

								'<div class="jns-cld_popupbox  jns-cld_pop_min">',//分钟弹出层
									'<i class="jns-cld_popup_tri"></i>',
									'<div class="jns-cld_popup_content">',
										'<dl class="jns-cld_popup_list"></dl>',//分钟list
									'</div>',
								'</div>',

								'<span class="jns-cld_input_style01_txt">:</span>',//秒针冒号

								'<input class="jns-cld_input_style01" type="text" value="" />',//秒

								'<div class="jns-cld_popupbox jns-cld_pop_sec">',//秒钟弹出层
									'<i class="jns-cld_popup_tri"></i>',
									'<div class="jns-cld_popup_content">',
										'<dl class="jns-cld_popup_list"></dl>',//秒钟list
									'</div>',
								'</div>',
							].join(""):""),
						'</div>',
						'<div class="jns-cld_foot_rt">',//底部右侧区域
							'<a href="javascript:;" class="jns-cld_btn_style01">清除</a>',//清除 按钮
							'<a href="javascript:;" class="jns-cld_btn_style01">确定</a>',//确定 按钮
						'</div>',
					'</div>',
				'</div>',
				'<iframe style="position: absolute; top: 0px; left: 0px; z-index:-1; width: 233px; height: 239px; opacity:0.1; filter:alpha(opacity=1);" frameborder="0" src="about:blank"></iframe>'
			].join("");
			
			//赋值
			cld.tri = calendar.children[0];
			cld.prevBtn = calendar.children[1].children[0];
			cld.nextBtn = calendar.children[1].children[1];
			cld.mArea01 = calendar.children[1].children[3].children[0];
			cld.mArea01Title = cld.mArea01.children[0].children[0];
			cld.mArea01Content = cld.mArea01.children[1];

			cld.mArea01dateBox = cld.mArea01Content.children[0];
			cld.mArea01dateList = cld.mArea01dateBox.children[0].children[0];

			cld.mArea01MoonBox = cld.mArea01Content.children[1];
			cld.mArea01MoonList = cld.mArea01MoonBox.children[0].children[0];

			cld.mArea01YearBox = cld.mArea01Content.children[2];
			cld.mArea01YearList = cld.mArea01YearBox.children[0].children[0];

			if(option.type == "dateTime"){
				var fFootLt = calendar.children[1].children[4].children[0];

				cld.hourInput = fFootLt.children[0];
				cld.hourPopup = fFootLt.children[1];
				cld.hourList = cld.hourPopup.children[1].children[0];

				cld.minuteInput = fFootLt.children[3];
				cld.minutePopup = fFootLt.children[4];
				cld.minuteList = cld.minutePopup.children[1].children[0];

				cld.secondFrag = fFootLt.children[5];

				cld.secondInput = fFootLt.children[6];
				cld.secondPopup = fFootLt.children[7];
				cld.secondList = cld.secondPopup.children[1].children[0];
				
			};

			var fFootRt = calendar.children[1].children[4].children[1];

			cld.cleanBtn = fFootRt.children[0];
			cld.okBtn = fFootRt.children[1];
		},

		/**
		 * 区间选择双日历模式初始化
		 * @return: {void}
		 */
		intervalTimeCalendarInit = function(){
			calendar.className = "jns-cld jns-cld_c2";
			calendar.innerHTML = [
				'<i class="jns-cld_tri">&#9670;</i>',//小三角
				'<div class="jns-cld_main">',
					'<a href="javascript:;" class="jns-cld_prevbtn">&#9670;</a>',//向左按钮
					'<a href="javascript:;" class="jns-cld_nextbtn">&#9670;</a>',//向右按钮
					'<div class="jns-cld_head_bg"></div>',
					'<div class="jns-cld_content">',
						'<div class="jns-cld_mainbox">',
							'<div class="jns-cld_mainbox_head">',
								'<a href="javascript:;" class="jns-cld_mainbox_head_tl"></a>',//日历区间表示 
							'</div>',
							'<div class="jns-cld_mainbox_content">',
								'<div class="jns-cld_maincell jns-cld_datebox jns-cld_maincell_cur">',//日历区域
									'<div class="jns-cld_mainbox_content">',
										'<dl class="jns-cld_main_cldlist">',//日历list
										'</dl>',
									'</div>',
								'</div>',

								'<div class="jns-cld_maincell jns-cld_moonbox">',//月历区域
									'<div class="jns-cld_mainbox_content">',
										'<dl class="jns-cld_main_cldlist">',//月历list
										'</dl>',
									'</div>',
								'</div>',

								'<div class="jns-cld_maincell jns-cld_yearbox">',//年历区域
									'<div class="jns-cld_mainbox_content">',
										'<dl class="jns-cld_main_cldlist">',//年历list
										'</dl>',
									'</div>',
								'</div>',
							'</div>',
						'</div>',
						'<div class="jns-cld_mainbox">',
							'<div class="jns-cld_mainbox_head">',
								'<a href="javascript:;" class="jns-cld_mainbox_head_tl"></a>',//日历区间表示 
							'</div>',

							'<div class="jns-cld_mainbox_content">',
								'<div class="jns-cld_maincell jns-cld_datebox jns-cld_maincell_cur">',//日历区域
									'<div class="jns-cld_mainbox_content">',
										'<dl class="jns-cld_main_cldlist">',//日历list
										'</dl>',
									'</div>',
								'</div>',

								'<div class="jns-cld_maincell jns-cld_moonbox">',//月历区域
									'<div class="jns-cld_mainbox_content">',
										'<dl class="jns-cld_main_cldlist">',//月历list
										'</dl>',
									'</div>',
								'</div>',

								'<div class="jns-cld_maincell jns-cld_yearbox">',//年历区域
									'<div class="jns-cld_mainbox_content">',
										'<dl class="jns-cld_main_cldlist">',//年历list
										'</dl>',
									'</div>',
								'</div>',
							'</div>',
						'</div>',

					'</div>',
					'<div class="jns-cld_foot">',
						'<div class="jns-cld_foot_lt">',//底部左侧区域
							'<input class="jns-cld_input_style02" type="text" value="" />',//开始时间
							'<span class="jns-cld_input_style02_txt">-</span>',
							'<input class="jns-cld_input_style02" type="text" value="" />',//结束时间
						'</div>',
						'<div class="jns-cld_foot_rt">',//底部右侧区域
							'<span class="jns-cld_btn_style01_txt"></span>',//提示区域
							'<a href="javascript:;" class="jns-cld_btn_style01">清除</a>',//清除 按钮
							'<a href="javascript:;" class="jns-cld_btn_style01">确定</a>',//确定 按钮
						'</div>',
					'</div>',
				'</div>',
				'<iframe style="position: absolute; z-index:-1; top: 0px; left: 0px; width: 450px; height: 239px; opacity:0.1; filter:alpha(opacity=1);" frameborder="0" src="about:blank"></iframe>'
			].join("");

			//赋值
			cld.tri = calendar.children[0];
			cld.prevBtn = calendar.children[1].children[0];
			cld.nextBtn = calendar.children[1].children[1];
			
			cld.mArea01 = calendar.children[1].children[3].children[0];
			cld.mArea01Title = cld.mArea01.children[0].children[0];
			cld.mArea01Content = cld.mArea01.children[1];

			cld.mArea01dateBox = cld.mArea01Content.children[0];
			cld.mArea01dateList = cld.mArea01dateBox.children[0].children[0];

			cld.mArea01MoonBox = cld.mArea01Content.children[1];
			cld.mArea01MoonList = cld.mArea01MoonBox.children[0].children[0];

			cld.mArea01YearBox = cld.mArea01Content.children[2];
			cld.mArea01YearList = cld.mArea01YearBox.children[0].children[0];



			cld.mArea02 = calendar.children[1].children[3].children[1];
			cld.mArea02Title = cld.mArea02.children[0].children[0];
			cld.mArea02Content = cld.mArea02.children[1];

			cld.mArea02dateBox = cld.mArea02Content.children[0];
			cld.mArea02dateList = cld.mArea02dateBox.children[0].children[0];

			cld.mArea02MoonBox = cld.mArea02Content.children[1];
			cld.mArea02MoonList = cld.mArea02MoonBox.children[0].children[0];

			cld.mArea02YearBox = cld.mArea02Content.children[2];
			cld.mArea02YearList = cld.mArea02YearBox.children[0].children[0];

			var fFootLt = calendar.children[1].children[4].children[0];
			
			cld.startDateInput = fFootLt.children[0];
			cld.endDateInput = fFootLt.children[2];

			var fFootRt = calendar.children[1].children[4].children[1];

			cld.msgArea = fFootRt.children[0];
			cld.cleanBtn = fFootRt.children[1];
			cld.okBtn = fFootRt.children[2];
		},

		/**
		 * 双日历用 焦点初始化
		 * @param: {string} status: start|end;
		 * @return:{void}
		 */
		intervalTimeFocusInit = function(status){

			switch(status){
				case "end":
					cld.focusType = "end";
					jns.removeClass(cld.startDateInput,"jns-cld_input_style02_cur");
					jns.addClass(cld.endDateInput,"jns-cld_input_style02_cur");
					if(option.selectSameDate){
						cld.allowDateStart = cld.curDate01;
					} else {
						cld.allowDateStart = new Date(cld.curDate01.getFullYear(),cld.curDate01.getMonth(),cld.curDate01.getDate() + 1);
					};
					
					break;
				case "start":
				default:
					cld.focusType = "start";
					jns.addClass(cld.startDateInput,"jns-cld_input_style02_cur");
					jns.removeClass(cld.endDateInput,"jns-cld_input_style02_cur");
					cld.allowDateStart = option.dateRangeStart;
					break;
			};

			mainAreaInit();
		},

		/**
		 * 双日历用 确定按钮是否激活判断
		 * @return:{void}
		 */
		intervalTimeIsOkCheck = function(){
			cld.startDateInput.isOk && cld.endDateInput.isOk? jns.removeClass(cld.okBtn,"jns-cld_btn_style01_disable"):jns.addClass(cld.okBtn,"jns-cld_btn_style01_disable");
		},
		/**
		 * 日历模块初始化
		 * @param:  {object} target 日历区域对象
		 * @param:  {object} year   当前年份
		 * @param:  {object} month  当前月份
		 * @return: {void}
		 */
		dateboxInit = function(target,year,month){

			var dc = document,
				myDate = new Date(year,month),
				year = myDate.getFullYear(),
				month = myDate.getMonth(),
				attrName = "datebox" + year + month,
				boxTitle = target.parentNode.parentNode.children[0].children[0],
				fment = dc.createDocumentFragment(),
				now = new Date();

			//title区域事件绑定
			boxTitle.innerHTML = year + " 年 " + (month + 1) + " 月";
			boxTitle.myMonth = month;
			boxTitle.myYear = year;
			if(option.type != "intervalTime"){
				boxTitle.onclick = function(){
					var outset = this.parentNode.parentNode.children[1],
						monthbox = outset.children[1];

					showModule(outset,"month");
					monthboxInit(monthbox,this.myYear,this.myMonth);
				}
				jns.removeClass(boxTitle,"jns-cld_disable");
			} else {
				jns.addClass(boxTitle,"jns-cld_disable");
			}
			//移除区域上的日历
			if(target.children.length > 0){
				fment.appendChild(target.children[0]);
			}
			
			if(!calendar[attrName]){
			
				calendar[attrName] = dc.createElement("dl");
				calendar[attrName].innerHTML = [
					'<dt class="jns-cld_sun">日</dt>',
					'<dt class="jns-cld_mon">一</dt>',
					'<dt class="jns-cld_tus">二</dt>',
					'<dt class="jns-cld_wed">三</dt>',
					'<dt class="jns-cld_fur">四</dt>',
					'<dt class="jns-cld_fri">五</dt>',
					'<dt class="jns-cld_sat">六</dt>'
				].join("");
				calendar[attrName].className = "jns-cld_main_cldlist";
				calendar[attrName].prevElms = [];
				calendar[attrName].nextElms = [];

				for(var row = 1, i = 0, rowLen = 6; row <= rowLen; row++){
					for(var col = 0, colLen = 7; col < colLen; col++){
						var ddElm = dc.createElement("dd"),
							myClassName = (
								col == 0? "jns-cld_sun":( 
									col == 1? "jns-cld_mon":(
										col == 2? "jns-cld_tus":(
											col == 3? "jns-cld_tus":(
												col == 4? "jns-cld_fur":(
													col == 5? "jns-cld_fri":(
														col == 6? "jns-cld_sat":""
													)
												)
											)
										)
									)
								)
							),
							clickHandle = null,
							dateObj,
							startIndex = new Date(year,month,1).getDay(),
							lastDate = new Date(year,month + 1,0).getDate();

						index = i++;

						//小于当月的日期
						if(index < startIndex){
							dateObj = new Date(year,month,0);
							
							ddElm.myDate = dateObj.getDate() - startIndex + index + 1;
							ddElm.myMonth = dateObj.getMonth();
							ddElm.myYear = dateObj.getFullYear();
							if(option.type != "intervalTime"){
								myClassName += " jns-cld_grid";
								clickHandle = function(){
									jns.trigger(cld.prevBtn,"click");
								};
								calendar[attrName].prevElms.push(ddElm);

							} else {
								myClassName += " jns-cld_grid jns-cld_disable";
								clickHandle = function(){
									
								};
							}
							

						//大于当月的日期
						} else if(index >= startIndex + lastDate){
							dateObj = new Date(year,month + 1);

							ddElm.myDate = index - startIndex - lastDate + 1;
							ddElm.myMonth = dateObj.getMonth();
							ddElm.myYear = dateObj.getFullYear();

							if(option.type != "intervalTime"){
								myClassName += " jns-cld_grid";
								clickHandle = function(){
									jns.trigger(cld.nextBtn,"click");
								};
								calendar[attrName].nextElms.push(ddElm);
							} else {
								myClassName += " jns-cld_grid jns-cld_disable";
								clickHandle = function(){
									
								};
							}
							
						//等于当月的日期
						} else {
							dateObj = new Date(year,month,index - startIndex + 1);

							ddElm.myDate = dateObj.getDate();
							ddElm.myMonth = month;
							ddElm.myYear = year;
							if(option.type == "intervalTime"){
								clickHandle = function(){
									dateAssignForDouble.call(this);
								};
							} else if(option.type == "dateTime"){
								clickHandle = function(){
									dateAssign.call(this);
									timeAreaInit.inputInit();
								};
							} else {
								clickHandle = function(){
									dateAssign.call(this);
									jns.trigger(cld.okBtn,"click");
									
								};
							}
							
							
						};

						ddElm.className = myClassName;
						ddElm.innerHTML = '<a href="javascript:;">' + ddElm.myDate + '</a>';
						ddElm.onclick = clickHandle;
						calendar[attrName].appendChild(ddElm);
					};
				};
			};

			target.appendChild(calendar[attrName]);

			now = new Date(now.getFullYear(),now.getMonth(),now.getDate());

			//假如当前月份不是 选中的那个月份 则会自动选择允许日期范围内的第一天
			if(option.type != "intervalTime" && !(cld.curDate01.getMonth() == month && cld.curDate01.getFullYear() == year) ){
				var fDate = new Date(year,month,1);
				while(!isInRange(fDate,"date") && fDate.getMonth() == month){
					fDate.setDate(fDate.getDate() + 1);
				}
				if(fDate.getMonth() == month){
					cld.curDate01 = cld.curDate02 = fDate;
					timeAreaInit.inputInit?timeAreaInit.inputInit():"";
				}
			}
			
			var myCurDate01 = new Date(cld.curDate01.getFullYear(),cld.curDate01.getMonth(),cld.curDate01.getDate()),
				myCurDate02 = new Date(cld.curDate02.getFullYear(),cld.curDate02.getMonth(),cld.curDate02.getDate());

			//cur grid 信息渲染
			jns.each(calendar[attrName].getElementsByTagName("dd"),function(){
				var thisDate = new Date(this.myYear,this.myMonth,this.myDate),
					cell = this.children[0];

				if(this.myMonth != month){ return;}

				isInRange(thisDate,"date")?(
					jns.removeClass(this,"jns-cld_disable"),
					cell.onclick = null
				):(
					jns.addClass(this,"jns-cld_disable"),
					cell.onclick = function(){ jns.stopBubble();}
					
				)
				//是否为今天
				now - thisDate == 0?jns.addClass(this,"jns-cld_today"):jns.removeClass(this,"jns-cld_today");

				thisDate >= myCurDate01 && thisDate <= myCurDate02? cell.className = "jns-cld_cur": cell.className = "";
			});

			//左右按钮事件绑定
			//左按钮
			isInRange(new Date(cld.focusMonth.getFullYear(),cld.focusMonth.getMonth(),0),"date")?(
				cld.prevBtn.onclick = function(){
					cld.focusMonth.setMonth(cld.focusMonth.getMonth() - 1);
					mainAreaInit();
					
				},
				jns.removeClass(cld.prevBtn,"jns-cld_disable"),
				jns.each(calendar[attrName].prevElms,function(){
					jns.removeClass(this,"jns-cld_disable");
				})
			):(
				cld.prevBtn.onclick = null,
				jns.addClass(cld.prevBtn,"jns-cld_disable"),
				jns.each(calendar[attrName].prevElms,function(){
					jns.addClass(this,"jns-cld_disable");
				})
			);

			//右按钮
			(isInRange(new Date(cld.focusMonth.getFullYear(),cld.focusMonth.getMonth() + 1,1),"date") && option.type != "intervalTime") || ( isInRange(new Date(cld.focusMonth.getFullYear(),cld.focusMonth.getMonth() + 2,1),"date") && option.type == "intervalTime" )?(
				cld.nextBtn.onclick = function(){
					cld.focusMonth.setMonth(cld.focusMonth.getMonth() + 1);
					mainAreaInit();
				},
				jns.removeClass(cld.nextBtn,"jns-cld_disable"),
				jns.each(calendar[attrName].nextElms,function(){
					jns.removeClass(this,"jns-cld_disable");
				})
			):(
				cld.nextBtn.onclick = null,
				jns.addClass(cld.nextBtn,"jns-cld_disable"),
				jns.each(calendar[attrName].nextElms,function(){
					jns.addClass(this,"jns-cld_disable");
				})
			);
			
		},

		/**
		 * 月历模块初始化
		 * @param:  {object} target 月历区域对象
		 * @param:  {object} year   当前年份
		 * @param:  {object} month  当前月份
		 * @return: {void}
		 */
		monthboxInit = function(target,year,month){
			var dc = document,
				attrName = "monthbox" + year,
				boxTitle = target.parentNode.parentNode.children[0].children[0],
				fment = dc.createDocumentFragment();

			//title区域事件绑定
			boxTitle.innerHTML = year + " 年";
			boxTitle.myYear = year;
			boxTitle.onclick = function(){
				var outset = this.parentNode.parentNode.children[1],
					yearbox = outset.children[2];

				showModule(outset,"year");
				yearboxInit(yearbox,this.myYear);
			}
			jns.removeClass(boxTitle,"jns-cld_disable");

			//移除区域上的模块
			if(target.children.length > 0){
				fment.appendChild(target.children[0]);
			}
			if(!calendar[attrName]){
				var monthTxt = ["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"];
				calendar[attrName] = dc.createElement("dl");
				calendar[attrName].className = "jns-cld_main_cldlist";
				for(var i = 0; i < 12; i++){
					var ddElm = dc.createElement("dd");

					ddElm.myYear = year;
					ddElm.myMonth = i;
					ddElm.innerHTML = '<a href="javascript:;">' + monthTxt[i] + '</a>';
					ddElm.onclick = function(){
						var outset = this.parentNode.parentNode.parentNode,
							datebox = outset.children[0];

						
						cld.focusMonth.setMonth(this.myMonth);

						showModule(outset,"date");
						dateboxInit(datebox,this.myYear,this.myMonth);
					}

					calendar[attrName].appendChild(ddElm);
				};
				
			};

			target.appendChild(calendar[attrName]);


			//cur 信息渲染
			var monthInRange = isInRange(new Date(year,month,1),"month"),
				curMonthStart = new Date(cld.curDate01.getFullYear(),cld.curDate01.getMonth()),
				curMonthEnd = new Date(cld.curDate02.getFullYear(),cld.curDate02.getMonth());
			//假如当前月份不是 范围内的那个月份 则会自动选择允许日期范围内的第一个月
			if(option.type != "intervalTime" && cld.curDate01.getFullYear() != year ){
				var fDate = new Date(cld.curDate01.getFullYear(),0,1);
				while(!isInRange(fDate,"month") && fDate.getFullYear() == year){
					fDate.setMonth(fDate.getMonth() + 1);
				}
				if(fDate.getFullYear() == year){
					cld.curDate01 = cld.curDate02 = fDate;
				} else {

				}
			}
			jns.each(calendar[attrName].getElementsByTagName("dd"),function(){
				var thisDate = new Date(this.myYear,this.myMonth),
					cell = this.children[0];
				isInRange(thisDate,"month")?(
					jns.removeClass(this,"jns-cld_disable"),
					cell.onclick = null
				):(
					jns.addClass(this,"jns-cld_disable"),
					cell.onclick = function(){ jns.stopBubble();}
				)

				!monthInRange?(
					thisDate >= curMonthStart && thisDate <= curMonthEnd? cell.className = "jns-cld_cur": cell.className = ""
				):(
					this.myMonth == month? cell.className = "jns-cld_cur": cell.className = ""
				);
			});

			//左右按钮绑定
			isInRange(new Date(year,0,0),"month")?(
				cld.prevBtn.onclick = function(){
					cld.focusMonth.setFullYear(cld.focusMonth.getFullYear() - 1);
					monthboxInit(cld.mArea01MoonBox,cld.focusMonth.getFullYear(),cld.focusMonth.getMonth());
				},
				jns.removeClass(cld.prevBtn,"jns-cld_disable")
			):(
				cld.prevBtn.onclick  = null,
				jns.addClass(cld.prevBtn,"jns-cld_disable")
			);

			isInRange(new Date(year + 1,0,1),"month")?(
				cld.nextBtn.onclick = function(){
					cld.focusMonth.setFullYear(cld.focusMonth.getFullYear() + 1);
					monthboxInit(cld.mArea01MoonBox,cld.focusMonth.getFullYear(),cld.focusMonth.getMonth());
				},
				jns.removeClass(cld.nextBtn,"jns-cld_disable")
			):(
				cld.nextBtn.onclick  = null,
				jns.addClass(cld.nextBtn,"jns-cld_disable")
			)
			
		},
		/**
		 * 年历模块初始化
		 * @param:  {object} target 年历区域对象
		 * @param:  {object} year   当前年份
		 * @return: {void}
		 */
		yearboxInit = function(target,year){
			var dc = document,
				beginYear = Math.floor(year/10) * 10,
				endYear = beginYear + 9,
				attrName = "yearbox" + beginYear + endYear,
				boxTitle = target.parentNode.parentNode.children[0].children[0],
				fment = dc.createDocumentFragment();

			//title区域事件绑定
			boxTitle.innerHTML = beginYear + " 年 - " + endYear + " 年";
			boxTitle.onclick = null;
			jns.addClass(boxTitle,"jns-cld_disable");

			//移除区域上的模块
			if(target.children.length > 0){
				fment.appendChild(target.children[0]);
			}

			if(!calendar[attrName]){
				calendar[attrName] = dc.createElement("dl");
				calendar[attrName].className = "jns-cld_main_cldlist";

				calendar[attrName].prevElms = [];
				calendar[attrName].nextElms = [];

				for(var iStart = beginYear - 1, iEnd = endYear + 1, i = iStart; i <= iEnd; i++){
					var ddElm = dc.createElement("dd"),
						clickHandle;

					ddElm.myYear = i;
					ddElm.innerHTML = '<a href="javascript:;">' + i + '</a>';
					
					if(i == iStart || i == iEnd){
						if(i == iStart){
							calendar[attrName].prevElms.push(ddElm);
							clickHandle = function(){
								jns.trigger(cld.prevBtn,"click");
							}

						} else {
							calendar[attrName].nextElms.push(ddElm);
							clickHandle = function(){
								jns.trigger(cld.nextBtn,"click");
							}

						};

						ddElm.className = "jns-cld_grid";

					} else {
						clickHandle = function(){
							var outset = this.parentNode.parentNode.parentNode,
								monthbox = outset.children[1];

							cld.focusMonth.setFullYear(this.myYear);

							showModule(outset,"month");
							monthboxInit(monthbox,this.myYear,boxTitle.myMonth);

						}

					}

					ddElm.onclick = clickHandle;
					calendar[attrName].appendChild(ddElm);
				};
			};

			target.appendChild(calendar[attrName]);

			//cur grid 信息渲染
			var yearInRange = isInRange(new Date(year,1),"year"),
				curYearStart = new Date(cld.curDate01.getFullYear()),
				curYearEnd = new Date(cld.curDate02.getFullYear());

			//假如当前年份不是 范围内的那个年份 则会自动选择允许年份范围内的第一个年
			if(option.type != "intervalTime"){
				var fDate = new Date(cld.curDate01.getFullYear(),0,1);
				while(!isInRange(fDate,"month") && fDate.getFullYear() == year){
					fDate.setFullYear(fDate.getFullYear() + 1);
				}
				if(fDate.getFullYear() >= beginYear && fDate.getFullYear <= endYear){
					cld.curDate01 = cld.curDate02 = fDate;
				} else {

				}
			}
			jns.each(calendar[attrName].getElementsByTagName("dd"),function(){
				var thisDate = new Date(this.myYear,0,1),
					cell = this.children[0];
				if(this.myYear >= beginYear && this.myYear <= endYear){
					isInRange(thisDate,"year")?(
						jns.removeClass(this,"jns-cld_disable"),
						cell.onclick = null
					):(
						jns.addClass(this,"jns-cld_disable"),
						cell.onclick = function(){ jns.stopBubble();}
					)
					!yearInRange?(
						this.myYear >= cld.curDate01.getFullYear() && this.myYear <= cld.curDate02.getFullYear()? cell.className = "jns-cld_cur": cell.className = ""
					):(
						this.myYear == year? cell.className = "jns-cld_cur": cell.className = ""
					);
					
				} else {
					isInRange(thisDate,"year")?jns.removeClass(this,"jns-cld_disable"):jns.addClass(this,"jns-cld_disable");
				}
			});

			isInRange(new Date(beginYear - 1,0,1),"year")?(
				cld.prevBtn.onclick = function(){
					cld.focusMonth.setFullYear(cld.focusMonth.getFullYear() - 10);
					yearboxInit(cld.mArea01YearBox,cld.focusMonth.getFullYear());
				},
				jns.removeClass(cld.prevBtn,"jns-cld_disable"),
				jns.each(calendar[attrName].prevElms,function(){
					jns.removeClass(this,"jns-cld_disable")
				})
			):(
				cld.prevBtn.onclick = null,
				jns.addClass(cld.prevBtn,"jns-cld_disable"),
				jns.each(calendar[attrName].prevElms,function(){
					jns.addClass(this,"jns-cld_disable")
				})
			);
			//左右按钮事件绑定
			isInRange(new Date(endYear + 1,0,1),"year")?(
				cld.nextBtn.onclick = function(){
					cld.focusMonth.setFullYear(cld.focusMonth.getFullYear() + 10);
					yearboxInit(cld.mArea01YearBox,cld.focusMonth.getFullYear());
				},
				jns.removeClass(cld.nextBtn,"jns-cld_disable"),
				jns.each(calendar[attrName].nextElms,function(){
					jns.removeClass(this,"jns-cld_disable")
				})
			):(
				cld.nextBtn.onclick = null,
				jns.addClass(cld.nextBtn,"jns-cld_disable"),
				jns.each(calendar[attrName].nextElms,function(){
					jns.addClass(this,"jns-cld_disable")
				})
			);
			
		},

		/**
		 * 日期赋值到input框-单一日历模式(点击日期后的下一操作)
		 * this 指向 dd 标签
		 * @return: {void}
		 */
		dateAssign = function(){
			var _that = this,
				dds = this.parentNode.getElementsByTagName("dd"),
				myDate = this.myDate,
				myYear = this.myYear,
				myMonth = this.myMonth;

			//赋值
			cld.curDate01.setFullYear(myYear);
			cld.curDate01.setMonth(myMonth);
			cld.curDate01.setDate(myDate);

			cld.curDate02 = cld.curDate01;
			jns.each(dds,function(){
				_that == this? jns.addClass(this.children[0],"jns-cld_cur"):jns.removeClass(this.children[0],"jns-cld_cur");
			});
		},

		/**
		 * 日期赋值到input框-双日历模式(点击日期后的下一操作)
		 * this 指向 dd 标签
		 * @return: {void}
		 */
		dateAssignForDouble = function(){
			var fDate = new Date(this.myYear,this.myMonth,this.myDate),
				fDateValue = fDate.getFullYear() + "-" + (fDate.getMonth() + 1) + "-" + fDate.getDate();
			switch(cld.focusType){
				case "end":
					cld.curDate02 = fDate;
					cld.endDateInput.value = fDateValue;
					cld.endDateInput.isOk = true;
					jns.removeClass(cld.endDateInput,"jns-cld_error");
					intervalTimeFocusInit("start");
					
					break;
				case "start":
				default:
					
					cld.curDate01 = fDate;
					cld.curDate02 = new Date(this.myYear,this.myMonth,this.myDate);

					cld.startDateInput.value = cld.endDateInput.value = fDateValue;
					if(!option.selectSameDate){
						cld.curDate02.setDate(cld.curDate02.getDate() + 1);
						cld.endDateInput.value = cld.curDate02.getFullYear() + "-" + (cld.curDate02.getMonth() + 1) + "-" + cld.curDate02.getDate();
					};

					
					cld.startDateInput.isOk = true;
					jns.removeClass(cld.startDateInput,"jns-cld_error");
					intervalTimeFocusInit("end");
					
					break;
			};

			intervalTimeIsOkCheck();
		},
		

		/**
		 * 将选择好的日期时间赋值到input框(可优化)
		 * @param:  {Date}   date  时间
		 * @param:  {object} input 输入框对象
		 * @return: {void}
		 */
		dateConver = function(date,input){
			if(!date || !input || input.tagName != "INPUT" || input.type == "button" || input.type == "submit"){return;}
			var myYear = date.getFullYear(),
				myMonth = date.getMonth() + 1,
				myDate = date.getDate();

			myMonth < 10 && (myMonth = "0" + myMonth);
			myDate < 10 && (myDate = "0" + myDate);

			var	myValue = option.format.replace(/YYYY/g,myYear).replace(/MM/g,myMonth).replace(/DD/g,myDate);
			if(option.type == "dateTime"){
				myValue = myValue.replace(/hh/g,(date.getHours() < 10?"0":"") + date.getHours()).replace(/mm/g,(date.getMinutes() < 10?"0":"") + date.getMinutes()).replace(/ss/g,(date.getSeconds() < 10?"0":"") + date.getSeconds());
			}
			input.value = myValue;
		},
		
		/**
		 * 是否在允许范围之内
		 * @param:  {Date}   date 日期
		 * @param:  {string} type "date"|"month"|"year"
		 * @return: {void}
		 */
		isInRange = function(date,type){
			var d1 = cld.allowDateStart,
				d2 = cld.allowDateEnd,
				r1,r2;
			if (type == "time"){
				r1 = (d1? date >= (new Date(d1.getFullYear(),d1.getMonth(),d1.getDate(),d1.getHours(),d1.getMinutes(),d1.getSeconds())):true);
				r2 = (d2? date <= (new Date(d2.getFullYear(),d2.getMonth(),d2.getDate(),d2.getHours(),d2.getMinutes(),d2.getSeconds())):true);

			} else if(type == "date"){
				r1 = (d1? date >= (new Date(d1.getFullYear(),d1.getMonth(),d1.getDate())):true);
				r2 = (d2? date <= (new Date(d2.getFullYear(),d2.getMonth(),d2.getDate())):true);

			} else if (type == "month"){
				r1 = (d1? date >= (new Date(d1.getFullYear(),d1.getMonth(),1)):true);
				r2 = (d2? date <= (new Date(d2.getFullYear(),d2.getMonth(),1)):true);


			} else if (type == "year"){
				r1 = (d1? date >= (new Date(d1.getFullYear(),0,1)):true);
				r2 = (d2? date <= (new Date(d2.getFullYear(),0,1)):true);

			}
			
			return r1 && r2;
		},

		/**
		 * 模块显示(日历，月历，年历之间切换)
		 * @param: {object} outset 日历|月历|年历区域对象的父级
		 * @param: {string} type   类型 "date"|"month"|"year"
		 * @return: {void}
		 */
		showModule = function(outset,type){
		 	var f;
			switch(type){
				case "date": f = 0; break;
				case "month": f = 1; break;
				case "year": f = 2; break; 
			};
			jns.each(outset.children,function(){
				arguments[0] == f? jns.addClass(this,"jns-cld_maincell_cur"): jns.removeClass(this,"jns-cld_maincell_cur");
			})
		},

		/**
		 * 日历模块位置调整
		 * @return: {void}
		 */
		positionFix = function(){
			var _this = arguments.callee;

			clearTimeout(_this.fixKey);
			setTimeout(function(){
				var	w = window,
					dc = document,
					vDistance = option.vDistance,
					tWidth = calendar.srcTarget.offsetWidth,
					tHeight = calendar.srcTarget.offsetHeight,
					tAcc = jns.getPosition(calendar.srcTarget),
					tLeft = tAcc.left,
					tTop = tAcc.top,

					triWidth = cld.tri.offsetWidth,

					myLeft,myTop,myTriLeft,

					pAcc = jns.getPosition(option.appendTarget),

					pLeft = pAcc.left,
					pTop = pAcc.top,

					pWidth,
					pHeight,
					pScrollTop,
					pScrollLeft,

					myParent = calendar?calendar.parentNode:option.appendTarget;

				if(myParent != document.body){
					pWidth = myParent.offsetWidth;
					pHeight = myParent.offsetHeight;
					pScrollTop = myParent.scrollTop;
					pScrollLeft = myParent.scrollLeft;

				} else {
					pWidth = dc.documentElement.clientWidth;
					pHeight = dc.documentElement.clientHeight;
					pScrollTop = dc.body.scrollTop || dc.documentElement.scrollTop;
					pScrollLeft = dc.body.scrollLeft || dc.documentElement.scrollLeft;

				}

				//if(myParent != document.body){
					tLeft += pScrollLeft + pLeft;
					tTop += pScrollTop + pTop;
				//}

				if(!_this.cldWidth){
					_this.cldWidth = calendar.offsetWidth;
					_this.cldHeight = calendar.offsetHeight;
				};



				if( tLeft + tWidth/2 + _this.cldWidth/2 > pScrollLeft + pWidth){
					myLeft = pScrollLeft + pWidth - _this.cldWidth;
					myTriLeft = tLeft - myLeft + tWidth/2 - triWidth/2;

				} else if((tLeft + tWidth/2 - _this.cldWidth/2 > pScrollLeft) && (tLeft + tWidth/2 + _this.cldWidth/2 < pScrollLeft + pWidth) ){
					myLeft = tLeft + tWidth/2 - _this.cldWidth/2;
					myTriLeft = (_this.cldWidth - triWidth)/2;

				} else {
					myLeft = pScrollLeft;
					myTriLeft = tLeft - myLeft + tWidth/2 - triWidth/2;
				};

				if( (tTop + vDistance + tHeight + _this.cldHeight > pScrollTop + pHeight) && (tTop - vDistance - _this.cldHeight > pScrollTop) ){
					myTop = tTop - vDistance - _this.cldHeight;
					cld.tri.className = "jns-cld_tri jns-cld_tri_bottom";
				} else {
					myTop = tTop + tHeight + vDistance;
					cld.tri.className = "jns-cld_tri jns-cld_tri_top";
				}

				calendar.style.top = myTop + "px";
				calendar.style.left = myLeft + "px";
				cld.tri.style.left = myTriLeft + "px";
			},20);
			
		},

		/**
		 * 主体区域初始化，让内容全部变到 focusMonth，全部统一变成 datebox(monthbox有机会用到)
		 * @return {void}
		 */
		mainAreaInit = function(){
			var year = cld.focusMonth.getFullYear(),
				month = cld.focusMonth.getMonth();

			showModule(cld.mArea01Content,"date");
			dateboxInit(cld.mArea01dateBox,year,month);

			if(option.type != "intervalTime"){return;}

			showModule(cld.mArea02Content,"date");
			dateboxInit(cld.mArea02dateBox,year,month + 1);

		},
		/**
		 * 时间区域初始化
		 * @return {void}
		 */
		timeAreaInit = function(){
			var dc = document,
				now = new Date(),

				//input onmouseover 事件绑定
				iptMouseoverHandle = function(){
					jns.addClass(this,"jns-cld_input_style01_hover");
				},

				//input onmouseout 事件绑定
				iptMouseoutHandle = function(){
					jns.removeClass(this,"jns-cld_input_style01_hover");
				},

				//时间选择的 cur 状态初始化
				timeCurReset = function(){
					var fdds = this.srcPopup.getElementsByTagName("dd");
					
					for(var i = 0, len = fdds.length; i < len; i++){
						var fd = fdds[i],
							myText = fd.children[0].innerHTML;
						
						parseInt(myText) == parseInt(this.value)?(
							jns.addClass(fd.children[0],"jns-cld_cur")
						):(
							jns.removeClass(fd.children[0],"jns-cld_cur")
						);

					};
					
				},

				//input onfocus 事件绑定
				iptShowHandle = function(){
					jns.addClass(this,"jns-cld_input_style01_cur");
					jns.addClass(this.srcPopup,"jns-cld_popupbox_cur");

					timeCurReset.call(this);
					this.isShow = true;
				},

				//input onblur 事件绑定
				iptHideHandle = function(){
					jns.removeClass(this,"jns-cld_input_style01_cur");
					jns.removeClass(this.srcPopup,"jns-cld_popupbox_cur");
					this.isShow = false;
				},

				//检查是否在范围之内
				checkTimeIsInRange = function(value,type){
					var myYear = cld.curDate01.getFullYear(),
						myMonth = cld.curDate01.getMonth(),
						myDate = cld.curDate01.getDate(),
						myHour = parseInt(cld.hourInput.value)||0,
						myMinute = parseInt(cld.minuteInput.value)||0;

					switch(type){
						case "hour": return isInRange(new Date(myYear,myMonth,myDate,value),"time"); break;
						case "minute": return isInRange(new Date(myYear,myMonth,myDate,myHour,value),"time"); break;
						case "second": return isInRange(new Date(myYear,myMonth,myDate,myHour,myMinute,value),"time"); break;
					}
				},
				//hour 输入框 值 初始化
				hourIptInit = function(){
					if(checkTimeIsInRange(now.getHours(),"hour")){
						cld.curDate01.setHours(now.getHours() < 10? cld.hourInput.value = "0" + now.getHours(): cld.hourInput.value = now.getHours());
						cld.hourInput.disabled = false;
						cld.hourInput.isOk = true;
						minuteIptInit();

					} else {
						for(var i = 0, len = 23; i <= len; i++){
							if(checkTimeIsInRange(i,"hour")){
								cld.curDate01.setHours(cld.hourInput.value = i);
								cld.hourInput.disabled = false;
								cld.hourInput.isOk = true;
								now.setMinutes(0);
								now.setSeconds(0);
								minuteIptInit();
								break;
							} else {
								if(i == len){
									cld.curDate01.setHours(cld.hourInput.value = cld.minuteInput.value = cld.secondInput.value = "00");
									cld.hourInput.disabled = cld.minuteInput.disabled = cld.secondInput.disabled = true;
									cld.hourInput.isOk = cld.minuteInput.isOk = cld.secondInput.isOk = false;
								}
							}
						}
					}

					//数值选择区域初始化
					var fMin,fMax;
					jns.each(cld.hourInput.srcDds,function(){
						var myValue = parseInt(this.children[0].innerHTML);
						checkTimeIsInRange(myValue,"hour")?(
							jns.removeClass(this,"jns-cld_disable"),
							typeof fMin == "undefined"?(
								fMin = fMax = myValue
							):(
								myValue > fMax ? fMax = myValue:"",
								myValue < fMin ? fMin = myValue:""
							)

						):(
							jns.addClass(this,"jns-cld_disable")
						);
					});

					cld.hourInput.minValue = parseInt(fMin);
					cld.hourInput.maxValue = parseInt(fMax);
				},
				//minute 输入框 值 初始化
				minuteIptInit = function(){
					if(checkTimeIsInRange(now.getMinutes(),"minute")){
						cld.curDate01.setMinutes(now.getMinutes() < 10 ?cld.minuteInput.value = "0" + now.getMinutes():cld.minuteInput.value = now.getMinutes());
						cld.minuteInput.disabled = false;
						cld.minuteInput.isOk = true;
						secondIptInit();
					} else {
						for(var i = 0, len = 59; i <= len; i++){
							if(checkTimeIsInRange(i,"minute")){
								cld.curDate01.setMinutes(cld.minuteInput.value = i);
								cld.minuteInput.disabled = false;
								cld.minuteInput.isOk = true;
								now.setSeconds(0);
								secondIptInit();
								break;
							} else {
								if(i == len){
									cld.curDate01.setMinutes(cld.minuteInput.value = cld.secondInput.value = "00");
									cld.minuteInput.disabled = cld.secondInput.disabled = true;
									cld.minuteInput.isOk = cld.secondInput.isOk = false;
								}
							}
						}
					};

					//数值选择区域初始化
					var fMin,fMax;
					jns.each(cld.minuteInput.srcDds,function(){
						var myValue = parseInt(this.children[0].innerHTML);
						checkTimeIsInRange(myValue,"minute")?(
							jns.removeClass(this,"jns-cld_disable"),
							typeof fMin == "undefined"?(
								fMin = fMax = myValue
							):(
								myValue > fMax ? fMax = myValue:"",
								myValue < fMin ? fMin = myValue:""
							)
						):(
							jns.addClass(this,"jns-cld_disable")
						);
					});

					cld.minuteInput.minValue = parseInt(fMin);
					cld.minuteInput.maxValue = parseInt(fMax);
					
				},

				//second 输入框 值 初始化
				secondIptInit = function(){
					if(checkTimeIsInRange(now.getSeconds(),"second")){
						cld.curDate01.setSeconds(cld.secondInput.value = "00");
						cld.secondInput.disabled = false;
						cld.secondInput.isOk = true;
					} else {
						for(var i = 0, len = 59; i <= len; i++){
							if(checkTimeIsInRange(i,"second")){
								cld.curDate01.setSeconds(cld.secondInput.value = i);
								cld.secondInput.disabled= false;
								cld.secondInput.isOk = true;
								break;
							} else {
								if(i == len){
									cld.curDate01.setSeconds(cld.secondInput.value = "00");
									cld.secondInput.disabled = true;
									cld.secondInput.isOk = false;
								}
							}
						}
					};

					//数值选择区域初始化
					var fMin,fMax;
					jns.each(cld.secondInput.srcDds,function(){
						var myValue = parseInt(this.children[0].innerHTML);
						checkTimeIsInRange(myValue,"second")? (
							jns.removeClass(this,"jns-cld_disable"),
							typeof fMin == "undefined"?(
								fMin = fMax = myValue
							):(
								myValue > fMax ? fMax = myValue:"",
								myValue < fMin ? fMin = myValue:""
							)
						):(
							jns.addClass(this,"jns-cld_disable")
						);
					});

					cld.secondInput.minValue = parseInt(fMin);
					cld.secondInput.maxValue = parseInt(fMax);
				},

				//选择区域的点击事件绑定
				ddsBindHandle = function(){
					var that = this;
					jns.each(this.srcDds,function(){
					
						jns.bind(this,"click",function(){
							var _this = this,
								mySiblings = this.parentNode.getElementsByTagName("dd");

							if(this.className.indexOf("jns-cld_disable") != -1){
								return;
							};
							jns.each(mySiblings,function(){
								var fChild = this.children[0];
								this === _this?(
									that.value = fChild.innerHTML,
									fChild.className = "jns-cld_cur"
								):(
									fChild.className = ""
								);
							});

							cld.curDate01["set" + that.valueAttr](that.value)

							that.isOk = true;
							jns.removeClass(that,"jns-cld_error");
							iptHideHandle.call(that);
						});
						
					});
				}

			arguments.callee.inputInit = hourIptInit;

			for(var i = 0; i < 24; i++){
				var ddElm = dc.createElement("dd");
				ddElm.myHour = i;
				!(i%3)?(ddElm.className = 'jns-cld_highLight'):"";
				ddElm.innerHTML = '<a href="javascript:;">'+ (i < 10?"0":"") + i +'</a>';
				cld.hourList.appendChild(ddElm);
			};
			for(var i = 0; i < 60; i++){
				var mddElm = dc.createElement("dd"),
					sddElm = dc.createElement("dd");

				mddElm.myMinute = sddElm.mySecond = i;
				!(i%5)?(mddElm.className = sddElm.className = 'jns-cld_highLight'):"";
				mddElm.innerHTML = sddElm.innerHTML = '<a href="javascript:;">'+ (i < 10?"0":"") + i +'</a>';

				cld.minuteList.appendChild(mddElm);
				cld.secondList.appendChild(sddElm);
			};

			cld.hourInput.srcPopup = cld.hourPopup;
			cld.minuteInput.srcPopup = cld.minutePopup;
			cld.secondInput.srcPopup = cld.secondPopup;

			cld.hourInput.srcDds = cld.hourPopup.getElementsByTagName("dd");
			cld.minuteInput.srcDds = cld.minutePopup.getElementsByTagName("dd");
			cld.secondInput.srcDds = cld.secondPopup.getElementsByTagName("dd");

			cld.hourInput.valueAttr = "Hours";
			cld.minuteInput.valueAttr = "Minutes";
			cld.secondInput.valueAttr = "Seconds";

			cld.hourInput.onmouseover = cld.minuteInput.onmouseover = cld.secondInput.onmouseover = iptMouseoverHandle;
			cld.hourInput.onmouseout = cld.minuteInput.onmouseout = cld.secondInput.onmouseout = iptMouseoutHandle;

			cld.hourInput.onfocus = cld.minuteInput.onfocus = cld.secondInput.onfocus = function(){
				var _this = this,
					autoHide = function(e){
						e = e || window.event;
						var srcElement = dc.elementFromPoint(e.clientX,e.clientY);
						if(_this === srcElement){return;}
						if(_this.isShow && !jns.isBelong(_this.srcPopup,srcElement)){
							iptHideHandle.call(_this);
							clearTimeout(_this.timeoutKey);
							jns.unbind(dc,"click",autoHide)
						}
					};

				iptShowHandle.call(this);
				clearTimeout(this.timeoutKey);
				jns.unbind(dc,"click",autoHide);
				this.timeoutKey = setTimeout(function(){jns.bind(dc,"click",autoHide)},1);
				
			};


			//初始化
			hourIptInit();

			//事件绑定-时间选择
			ddsBindHandle.call(cld.hourInput);
			ddsBindHandle.call(cld.minuteInput);
			ddsBindHandle.call(cld.secondInput);

			//事件绑定-时间输入
			cld.hourInput.onblur = cld.minuteInput.onblur = cld.secondInput.onblur = function(){
				var attr;
				switch(this){
					case cld.hourInput: attr = "Hours"; break;
					case cld.minuteInput: attr = "Minutes"; break;
					case cld.secondInput: attr = "Seconds"; break;
				}
				this.value == ""?this.value = 0:"";

				var myValue = parseInt(this.value);
				if(isNaN(myValue) || typeof this.minValue == "undefined"){
					this.isOk = false;
					jns.addClass(this,"jns-cld_error");

				} else {
					myValue <= this.minValue? myValue = this.minValue:"";
					myValue >= this.maxValue? myValue = this.maxValue:"";

					myValue < 10? myValue = "0" + myValue:"";

					jns.removeClass(this,"jns-cld_error");
					cld.curDate01["set" + this.valueAttr](this.value = myValue);
					this.isOk = true;
				};

			};

			cld.hourInput.onkeyup = cld.minuteInput.onkeyup = cld.secondInput.onkeyup = function(){
				var myValue = parseInt(this.value);
				if(isNaN(myValue) || typeof this.minValue == "undefined"){ return;}
				timeCurReset.call(this);
			};
			cld.hourInput.onkeydown = cld.minuteInput.onkeydown = cld.secondInput.onkeydown = function(e){
				e = e || window.event;
				var myValue = parseInt(this.value);
				if( (e.keyCode != 38 && e.keyCode != 40) || isNaN(myValue) || isNaN(this.maxValue) ){
					return;

				} else if(e.keyCode == 38){
					jns.preventDefault(e);
					++myValue;
					myValue <= this.maxValue? this.value = (myValue < 10?"0":"") + myValue :"";

				} else if(e.keyCode == 40){
					jns.preventDefault(e);
					--myValue;
					myValue >= this.minValue? this.value = (myValue < 10?"0":"") + myValue :"";
				};
				
			};
		},

		/**
		 * 日历显示
		 * @return: {void}
		 */
		cldShowHandle = function(target){
			option.appendTarget.appendChild(calendar);
			isShow = true;
			jns.addClass(calendar,"jns-cld_cur");
			calendar.srcTarget = target;
			positionFix();
			jns.bind(window,"resize",positionFix);
			jns.bind(option.appendTarget,"scroll",positionFix);
			setTimeout(function(){
				jns.bind(document,"mousedown",autoHideHandle);
			},1);

			//时间初始化
			var fDate = jns.format.toDate(target.value);
			if(target.value){
				if(fDate){
					if(option.dateRangeEnd && fDate > option.dateRangeEnd){
						fDate = option.dateRangeEnd;
						dateConver(fDate,target);
					};

					if(option.dateRangeStart && fDate < option.dateRangeStart){
						fDate = option.dateRangeStart;
						dateConver(fDate,target);
					};

					if(option.type == "intervaltime" && target == option.endDateInput){
						cld.curDate02 = fDate;
						cld.focusMonth = new Date(cld.curDate02.getFullYear(),cld.curDate02.getMonth() - 1);

					} else {
						cld.curDate01 = cld.curDate02 = fDate;
						cld.focusMonth = new Date(cld.curDate01.getFullYear(),cld.curDate01.getMonth());
					}

					if(option.type == "dateTime"){
						cld.hourInput.value = fDate.getHours() < 10? "0" + fDate.getHours():fDate.getHours();
						cld.minuteInput.value = fDate.getMinutes() < 10? "0" + fDate.getMinutes():fDate.getMinutes();
						cld.secondInput.value = fDate.getSeconds() < 10? "0" + fDate.getSeconds():fDate.getSeconds();
					}

				} else {
					if(target.noType == 1 && target.type == "text"){
						target.value = "";
					}
				}
			}
			

			
			mainAreaInit();

		},

		/**
		 * 日历隐藏
		 * @return: {void}
		 */
		cldHideHandle = function(){
			isShow = false;
			jns.removeClass(calendar,"jns-cld_cur");
			jns.unbind(document,"mousedown",autoHideHandle);
			jns.unbind(window,"resize",positionFix);
			jns.unbind(option.appendTarget,"scroll",positionFix);
		},

		/**
		 * 日历显示后点击其他区域自动隐藏
		 * @return: {void}
		 */
		autoHideHandle = function(e){
			e = e || window.event;
			var srcElement = document.elementFromPoint(e.clientX,e.clientY);
			if(jns.isBelong(calendar,srcElement) || srcElement == calendar.srcTarget){

			} else {
				cldHideHandle();
			}
		},

		appendTargetInit = function(){
			var r;
			switch(typeof option.appendTarget){
				case 'undefined':
					r = document.body;
					break;

				case 'object':
					if(option.appendTarget.nodeType == 1){
						r = option.appendTarget;
					} else {
						r = document.body;
					}
					break;


				case 'string':
					r = jns.selector(option.appendTarget);
					r.length ? r = r[0]: '';
					break;
				default:
					r = document.body;

			}

			option.appendTarget = r;
		};


	return{
		//属性设置
		setOption:function(op){
			if(typeof op != "object"){return this;}

			if(typeof op.type =="string"){
				switch(op.type.toLowerCase()){
					case "date":
						option.type = "date";
						break;
					case "datetime":
						option.type = "dateTime";
						break;
					case "intervaltime":
						option.type = "intervalTime";
						break;
					default:
						break;
				}
			};

			typeof op.callback == "function"? option.callback = op.callback:"";
			typeof op.onclean == "function"? option.onclean = op.onclean:"";
			typeof op.onload == "function"? option.onload = op.onload:"";

			typeof op.selectSameDate == "boolean"? option.selectSameDate = op.selectSameDate:"";

			typeof op.startDateInput != "undefined"? option.startDateInput = jns.selector(op.startDateInput):"";
			typeof op.endDateInput != "undefined"? option.endDateInput = jns.selector(op.endDateInput):"";
			typeof op.dateRangeStart != "undefined"? option.dateRangeStart = jns.format.toDate(op.dateRangeStart):"";
			typeof op.dateRangeEnd != "undefined"? option.dateRangeEnd = jns.format.toDate(op.dateRangeEnd):"";
			typeof op.abc != "undefined"? option.abc = op.abc:"";
			typeof op.zIndex != "undefined"? option.zIndex = op.zIndex:"";

			typeof op.appendTarget != "undefined"? option.appendTarget = op.appendTarget: option.appendTarget = document.body;
			
			typeof op.vDistance == "number"? option.vDistance = op.vDistance:"";
			typeof op.format != "undefined"? option.format = op.format:"";
			

			return this;
		},
		//显示
		show:function(target){
			if(target){
				appendTargetInit();
				cldShowHandle(target);
				option.onload && option.onload.call(calendar);
			}
			return this;
		},
		//隐藏
		hide:function(){
			appendTargetInit();

			cldHideHandle();
			return this;
		},
		//获取选中的日期
		getDate:function(){
			if(option.type == "intervaltime"){
				return [cld.curDate01,cld.curDate02]
			} else {
				return cld.curDate01
			}
		},
		//初始化
		init:function(){
			if(_op){this.setOption(_op);}
			if(option.dateRangeStart && option.dateRangeEnd && option.dateRangeStart >= option.dateRangeEnd){
				jns.console("jnsCalendar:允许时间区间设置错误，组件初始化失败");
				return this;
			}
			areaReset.call(this);

			return this;
		}

	};
}
