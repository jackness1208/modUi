module.exports = function(grunt) {

    // 项目配置
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        "uglify": {
            "mod": {
                "options": {
                    "banner": "/*! builded "+ new Date() +" */\r\n",
                    "sourceMapRoot": "../"
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
        }
        
        "watch": {
            "mod": {
                "tasks": [
                    "default"
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
