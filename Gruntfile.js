module.exports = function(grunt) {

    // 项目配置
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        "uglify": {
            "mod": {
                "options": {
                    "banner": "/*! builded <%= grunt.template.today() %> */\r\n",
                    "sourceMapRoot": "../../",
                    // 是否生成 sourceMap
                    sourceMap: true,
                    // 生成 map文件的地址
                    sourceMapName: function(path){
                        var f = path.split("/"),
                            filename = f.pop(),
                            nav = f.join("/") + "/";

                        return nav + "map/" +  filename.replace('.js','.map');
                    },
                    // 用于定义 map文件地址 并放在压缩文件底部， url相对于 压缩文件
                    sourceMappingURL: function(path){
                        var f = path.split("/"),
                            filename = f.pop(),
                            nav = f.join("/") + "/";
                        return "map/" +  filename.replace('.js','.map');
                    }
                },
                "files": {
                    "mod/js/lib/dist/bs_global.min.js": [
                        "mod/js/lib/src/bs_global.js"
                    ],
                    "mod/js/lib/dist/jns_calendar.min.js": [
                        "mod/js/lib/src/jns_calendar.js"
                    ]
                }
            }
        },
        
        "watch": {
            "mod": {
                "tasks": [
                    "build"
                ],
                "files": [
                    [
                        "mod/js/lib/src/bs_global.js"
                    ],
                    [
                        "mod/js/lib/src/jns_calendar.js"
                    ]
                ]
            }
        }
    });
    

    // 加载提供"uglify"任务的插件
    grunt.loadNpmTasks('grunt-contrib-requirejs');

    // 加载提供"copy"任务的插件
    grunt.loadNpmTasks('grunt-contrib-copy');

    
    var helpFile = function(){
        console.log([
            '',
            ' Usage: grunt <command>',
            ' ',
            ' Commands:',
            '   build      run the Optimize task',
            '   watch      run the watch task',
            '',
            ' Options:',
            '   -h         output usage information',
            '',
            ''
        ].join('\n'));
    };
    // 注册任务
    grunt.registerTask('build', function(name) {
        if (name) {
            grunt.task.run(['uglify:' + name, 'copy']);

        } else {
            grunt.task.run(['uglify', 'copy']);

        }
    });
    grunt.registerTask('default', helpFile);
    grunt.registerTask('-h', helpFile);

    
}
