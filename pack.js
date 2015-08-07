var fs = require('fs'),
    readline = require('readline');

var fn = {
    /**
     * question
     * @param  {String}   questionStr   问题文本
     * @param  {String}   defaultValue  缺省答案
     * @param  {function} callback      回调方法
     * @return {Void}
     */
    question: function(questionStr, defaultValue, callback){
        var rl = readline.createInterface({
              input: process.stdin,
              output: process.stdout,
              terminal: false
            });
        rl.question('[?] ' + questionStr +  " ("+ defaultValue +")", function(answer){
            if(answer == ""){
                answer = defaultValue;
            }

            rl.close();
            callback && callback(answer);
        })
    },
    /**
     * 获取文件目录结构 (.xx 会自动过滤)
     * @param  {String}   location 需要获取的物理路径
     * @param  {Funciton} callback 获取成功回调函数
     *                             - arguments[0] error [string] 错误码
     *                             - arguments[1] files [array]  文件列表
     * @return {Void}
     */
    getPaths: function(location, callback){
        var r = [],
            filter = new RegExp('^' + location, 'g'),
            readFiles = function(dir, done){
                if(/\/$/.test(dir)){
                    dir = dir.replace(/\/$/,'');
                }
                fs.readdir(dir, function(err, list){
                    if(err){
                        return done(err);
                    }

                    var total = list.length;

                    if(total <= 0){
                        return done(null, r);
                    }

                    list.forEach(function(file){
                        var myFile = dir + '/' + file;
                        fs.stat(myFile, function(err, stat){
                            // 过滤隐藏文件
                            if(/^\./.test(file)){
                                !--total && done(null, r);
                                
                            } else {
                                if(stat && stat.isDirectory()){
                                    readFiles(myFile, function(res){
                                        !--total && done(null, r);
                                    });
                                    
                                } else {
                                    r.push(myFile.replace(filter, ''));
                                    !--total && done(null, r);
                                    
                                }
                            }
                            
                        });
                    });
                    

                });

                return r;
            };
        
        readFiles(location, function(error, files){
            files.sort(function(elm1,elm2){
                return String(elm1).localeCompare(String(elm2));
            });
            callback(error, files);
        });


        
    },
    /**
     * promise 模块
     */
    promise: function(fn){
        var she = this;
        
        she.queue = [];
        she.then = function(fn){
            typeof fn == 'function' && she.queue.push(fn);
            return she;
        };
        she.start = function(fn){
            she.resolve();
        };

        she.resolve = function(){
            var myArgv = [];
            for(var i = 0, len = arguments.length; i < len; i++){
                myArgv.push(arguments[i]);
            }
            myArgv.push(she.resolve);
            if(she.queue.length){
                she.queue.shift().apply(she, myArgv);
            }
        };

        
    },
    /**
     * 路径格式化
     * @param  {String} path 需要格式化的路径文本
     * @return {String} 格式化后的路径文本
     */
    formatPath: function(path){
        return path? path.replace(/\\/g,"/"): '';
    }
};

//执行
var defaultValue = '1.4.7';

fn.question('输入你要生成的版本号',defaultValue, function(val){
    var myVer = val,
        now = new Date();

    new fn.promise().then(function(next){
        var checkPath = fn.formatPath(__dirname + '/mod/js/');
        fn.getPaths(checkPath, function(err, files){
            for(var i = 0, len = files.length; i < len; i++){
                files[i] = checkPath + files[i];
            }
            
            next(files);
        });
    }).then(function(filesPrev, next){
        var checkPath = fn.formatPath(__dirname + '/mod/css/');
        fn.getPaths(checkPath, function(err, files){
            for(var i = 0, len = files.length; i < len; i++){
                files[i] = checkPath + files[i];
            }

            next(filesPrev.concat(files));
        });

    }).then(function(files, next){
        var render = function(data){
                data = String(data);
                data = data.replace(
                    /\$Date:[^$]*\$/ig,
                    '$Date: ' + now + ' $'
                ).replace(
                    /\$Version:[^$]*\$/ig
                    ,'$Version: ' + myVer + ' $'
                ).replace(
                    /\$Copyright:[^$]*\$/ig,
                    '$Copyright: ' + now.getFullYear() + ', jackness.org $'
                ).replace(
                    /\$Creator:[^$]*\$/ig,
                    '$Creator: jackness Lau $'
                ).replace(
                    /\$Author:[^$]*\$/ig,
                    '$Author: jackness Lau $'
                );
                return data;
            };
        files.forEach(function(item){
            fs.writeFileSync(item, render(fs.readFileSync(item)));
        });

        next();

    }).then(function(next){
        var render = function(data){
            return String(data).replace(defaultValue, myVer);
        };
        var myPath = fn.formatPath(__dirname + '/pack.js');
        fs.writeFileSync(myPath, fs.readFileSync(myPath));
        next();
    }).then(function(next){
        console.log([
            '-----------------',
            'all is done'
        ].join('\n'));
        next();

    }).start();
});
