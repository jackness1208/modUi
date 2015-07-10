module.exports = function(grunt) {
    var fs = require("fs"),
        chalk = require('chalk'),
        initHandle = require('./tasks/init.js'),
        global = {
            source:{
                'mod':{
                    'path':{
                        locate:'',
                        admin:'../../admin/js/',
                        macGithub:'/gitHub/modUi/mod/'
                    },
                    'js':[
                        {
                            src:['../js/lib/src/bs_global.js'],
                            dest:'../js/lib/dist/bs_global.min.js'
                        },
                        {
                            src:['../js/lib/src/jns_calendar.js'],
                            dest:'../js/lib/dist/jns_calendar.min.js'
                        }
                    ],
                    'css':[
                        '../css/base.css'
                    ],
                    'img':[
                        '../images/*.*'
                    ]
                }

                
            }
        };
    

    // 项目配置
    grunt.initConfig(initHandle({
        pkg: grunt.file.readJSON('package.json')
    },global.source,grunt));
    

    // 加载提供"uglify"任务的插件
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // 加载提供"concat"任务的插件
    grunt.loadNpmTasks('grunt-contrib-concat');

    // 加载提供"watch"任务的插件
    grunt.loadNpmTasks('grunt-contrib-watch');

    // 加载提供"copy"任务的插件
    grunt.loadNpmTasks('grunt-contrib-copy');


    // 注册任务
    grunt.registerTask('build', function(name) {
        if (name) {
            grunt.task.run(['uglify:' + name]);

        } else {
            grunt.task.run(['uglify']);

        }
    });

    grunt.registerTask('default', function() {

        var myConfig = grunt.config.get(),
            helpArr = [],
            fAttr, fargu;
        helpArr.push('# ==============');

        for(var key in myConfig){
            if(myConfig.hasOwnProperty(key) && !/^pkg$/.test(key)){
                fAttr = myConfig[key];
                helpArr.push('# 函 数 名 - grunt ' + key);
                helpArr.push('# 参数列表');
                for(fargu in fAttr){
                    if(fAttr.hasOwnProperty(fargu)){
                        helpArr.push('# :' + fargu);
                    }
                }

                helpArr.push('# ==============');
            }
        }

        helpArr.push('# 函 数 名 - grunt build');
        helpArr.push('# 参数列表 - 同uglify一致');

        console.log(helpArr.join("\n"))


    });

    
}
