!function(){
	var myDomain = document.scripts[document.scripts.length - 1].src.split("init.js")[0],
		links = [
			myDomain + 'instructions.css',
			myDomain + "syntaxhighlighter/styles/shThemeDefault.css",
			myDomain + "syntaxhighlighter/styles/shCore.css"
		],
		scripts = [
			myDomain + "syntaxhighlighter/scripts/shCore.js",
			myDomain + "syntaxhighlighter/scripts/shBrushXml.js",
			myDomain + "syntaxhighlighter/scripts/shBrushCss.js",
			myDomain + "syntaxhighlighter/scripts/shBrushJScript.js",
			myDomain + "syntaxhighlighter/scripts/shBrushPhp.js",
			myDomain + "syntaxhighlighter/do.js"
		],
		readyKey,i,len;

	document.write('<link rel="stylesheet" href="' +links.join('" /><link rel="stylesheet" href="') + '" />');
	// document.write('<script src="'+ scripts.join('"></script><script src="') +'"></script>');

	for(var i = 0, len = scripts.length; i < len; i++){
		document.write('<script src="'+ scripts[i] + '"></script>');
	}

	
}();