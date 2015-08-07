var fs = require('fs');

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
        rl.question('[?] ' + color.yellow(questionStr) + color.gray( " ("+ defaultValue +")" ), function(answer){
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

        
    }
};

//执行
//
fn.question('输入你要生成的版本号','1.0.0', function(val){
    var myVal = val,
        now = new Date();

    new fn.promise().then(function(next){
        var checkPath = __dirname + '/js/';
        fn.getPaths(checkPath, function(err, files){
            files.forEach(function(item){
                item = checkPath + item;
            });
            next(files);
        });
    }).then(function(filesPrev, next){
        var checkPath = __dirname + '/css/';
        fn.getPaths(__dirname + '/css/', function(err, files){
            files.forEach(function(item){
                item = checkPath + item;
                });
            next(filesPrev.concat(files));
        });

    }).then(function(files, next){
        var render = function(content){
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
            };
        files.forEach(function(item){
            fs.writeFileSync(item, render(fs.readFileSync(item)));
        });

        next();

    }).then(function(next){
        console.log([
            '-----------------',
            'all is done'
        ].join('\n'));
        next();

    }).start();
});
