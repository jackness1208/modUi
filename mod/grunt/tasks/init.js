module.exports = function(orgin, data, grunt) {
	var she = this,
		
		clone = function(obj){

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

		},

        isEqual = function(o1,o2){
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
        },
		//以 o1为准，
		objConcat = function(o1, o2){
            if(typeof o1 != 'object'){
                if(o1 === undefined || o1 === null){
                    return clone(o2);

                } else {
                    return clone(o1);
                }

            } else {
                var r = clone(o1);
                if(/Array/.test(Object.prototype.toString.call(r))){
                    var r2, isRepeat, j, jlen;

                    if(/Array/.test(Object.prototype.toString.call(o2))){
                        r2 = o2;
                    } else {
                        r2 = [o2];
                    }
                    for(var i = 0, len = r2.length; i < len; i++){
                        isRepeat = false;
                        for(j = 0, jlen = r.length; j < jlen; j++){
                            if(isEqual(r[j],r2[i])){
                                isRepeat = true;
                                break;
                            }
                        }
                        
                        if(!isRepeat){
                            r.push(r2[i]);
                        }
                    }

                } else {
                    for(var key in o2){
                        if(o2.hasOwnProperty(key)){
                            r[key] = objConcat(r[key], o2[key]);
                        }
                    }
                }
                

                return r;
            }

		},
		release = {
			uglify: function(source){
				var r = {},
                    i, len, fdata;

                for(var key in source){
                    if(source.hasOwnProperty(key) && source[key].js){

                        for(i = 0, len = source[key].js.length; i < len; i++){
                            fdata = source[key].js[i];
                            if(typeof fdata == "object"){
                                if(!r[key]){
                                    r[key] = {
                                        options: {
                                            banner: '/*! builded <%= grunt.template.today() %> */\n',
                                            sourceMapRoot: function(path){
                                                var destDotLen = path.split("../").length - 1,
                                                	destLen = path.replace(/[\.]{1,2}\//g).split("/").length,
                                                	r = "";

                                                for(var i = 0, len = destLen - destDotLen; i < len; i++){
                                                	r += "../";
                                                }
                                                    
                                                return r;
                                            }(fdata.dest),
                                            sourceMap: function(path){
                                                var f = path.split("/"),
                                                    filename = f.pop(),
                                                    nav = f.join("/") + "/";
                                                return nav + "map/" +  filename.replace('.js','.map');
                                            },
                                            sourceMappingURL: function(path){
                                                var f = path.split("/"),
                                                    filename = f.pop(),
                                                    nav = f.join("/") + "/";
                                                return "map/" +  filename.replace('.js','.map');
                                            }
                                        },
                                        files: {}
                                    };
                                }

                                r[key].files[fdata.dest] = fdata.src;
                            }
                        }

                    }
                }

                return r;
			},
			copy: function(source){
				var r = {},
                    attr,

                    pathKey,
                    pathAttr,
                    pathValue,

                    i, len, fdata,
                    src2Items = function(srcs,path){
                        var r = [],
                            i, len, key, src,
                            mySrcs;

                        if(!srcs){
                            mySrcs = [];
                        }

                        if(!/Array/.test(Object.prototype.toString.call(srcs))){
                            mySrcs = [srcs];
                        } else {
                            mySrcs = srcs;
                        }

                        for(i = 0, len = mySrcs.length; i < len; i++){
                            src = mySrcs[i];
                            r.push({
                                "src": src,
                                "dest": path
                            });
                            
                        }

                        return r;
                    },
                    mapTrans = function(path){
                        var f = path.split("/"),
                            filename = f.pop(),
                            nav = f.join("/") + "/";
                        return nav + "map/" +  filename.replace('.js','.map');
                    };

                for(var key in source){
                    if(source.hasOwnProperty(key)){

                        for(pathKey in source[key].path){
                            if(source[key].path.hasOwnProperty(pathKey)){

                                for(attr in source[key]){
                                    if(source[key].hasOwnProperty(attr) && attr != "path" ){

                                        if(!r[key]){
                                            r[key] = {
                                                files:[]
                                            };
                                        }

                                        pathAttr = key + "-" + pathKey;
                                        pathValue = source[key].path[pathKey];

                                        if(!r[pathAttr]){
                                            r[pathAttr] = {
                                                files:[]
                                            };
                                        }

                                        for(i = 0, len = source[key][attr].length; i < len; i++){
                                            fdata = source[key][attr][i];
                                            
                                            if(typeof fdata == "object"){
                                                r[key].files = r[key].files.concat(
                                                    src2Items(
                                                        fdata.src,
                                                        pathValue
                                                    )
                                                );
                                                r[key].files = r[key].files.concat(
                                                    src2Items(
                                                        fdata.dest,
                                                        pathValue
                                                    )
                                                );

                                                r[key].files = r[key].files.concat(
                                                    src2Items(
                                                        mapTrans(fdata.dest),
                                                        pathValue
                                                    )
                                                );

                                                r[pathAttr].files = r[pathAttr].files.concat(
                                                    src2Items(
                                                        fdata.src,
                                                        pathValue
                                                    )
                                                );
                                                r[pathAttr].files = r[pathAttr].files.concat(
                                                    src2Items(
                                                        fdata.dest,
                                                        pathValue
                                                    )
                                                );

                                                r[pathAttr].files = r[pathAttr].files.concat(
                                                    src2Items(
                                                        mapTrans(fdata.dest),
                                                        pathValue
                                                    )
                                                );
                                            
                                            } else {
                                                r[key].files = r[key].files.concat(
                                                    src2Items(
                                                        fdata,
                                                        pathValue
                                                    )
                                                );

                                                r[pathAttr].files = r[pathAttr].files.concat(
                                                    src2Items(
                                                        fdata,
                                                        pathValue
                                                    )
                                                );
                                            }
                                            
                                        }
                                        
                                    }
                                }
                            }
                        }

                        

                    }
                }

                return r;
			},

			watch: function(source){
				var r = {},
                    i, len, fdata;
                for(var key in source){
                    if(source.hasOwnProperty(key)){
                        for(i = 0, len = source[key].js.length; i < len; i++){
                            fdata = source[key].js[i];

                            if(typeof fdata == "object"){
                                if(!r[key]){
                                    r[key] = {
                                        tasks:["default"],
                                        files:[]
                                    };
                                }

                                r[key].files.push(fdata.src);
                            }
                        }
                    }
                }

                return r;
			}
		},
		r = clone(orgin);

    //初始化
    for(var key in release){
        if(release.hasOwnProperty(key)){
            r[key] = objConcat(r[key], release[key](data));
        }
    }

    
	return r;
}