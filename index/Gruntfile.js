/*
* 本地 构建工具
*/
module.exports = function(grunt) {
    var bannerStr = '\n/* <%= pkg.name %> Date:<%= grunt.template.today("yyyy-mm-dd h:MM:ss TT") %> author:<%= pkg.author %> */\n',
        packageConfig = grunt.file.readJSON('package.json');
    
    // 设置编码格式
    grunt.file.defaultEncoding = packageConfig.defaultEncoding || 'utf8';

    // 构建任务配置
    grunt.initConfig({
        //读取package.json的内容，形成个json数据
        pkg: packageConfig,

        uglify: {

            //文件头部输出信息
            options: {
                banner: bannerStr
            },

            //具体任务配置
            build: {
                expand: true,
                cwd:'src/js',
                src:'**/*.js',
                dest:'build/js',
                ext: '-min.js'
            }
        },

        cssmin: {

            //文件头部输出信息
            options: {
                banner: bannerStr
            },

            //具体任务配置
            build: {
                expand: true,
                cwd:'src/css',
                src:'**/*.css',
                dest:'build/css',
                ext: '-min.css'
            }
        },

        cssmin_font: {

            //文件头部输出信息
            options: {
                banner: bannerStr
            },

            //具体任务配置
            build: {
                expand: true,
                cwd:'iconfont',
                src:'**/*.css',
                dest:'build/iconfont'
//                ext: '-min.css'
            }
        },

        imagemin: {

            //具体任务配置
            build: {
                expand: true,
                cwd:'img',
                src:'**/*.*',
                dest:'build/img/'
            }
        },

        jshint: {
            options: {
                //大括号包裹
                curly:true,
                //对于简单类型，使用===和!==，而不是==和!=
                eqeqeq:true,
                //对于首字母大写的函数（声明的类），强制使用new
                newcap:true,
                //禁用arguments.caller和arguments.callee
                noarg:true,
                //对于属性使用aaa.bbb而不是aaa['bbb']
                sub:true,
                //查找所有未定义变量
                undef:true,
                //查找类似与if(a = 0)这样的代码
                boss:true,
                //指定运行环境为node.js
                node:true
            }
        },

        // 清理文件夹
        clean: {
            js: ["build/js/*.js"],
            css: ["build/css/*.css"]
        }

    });

    // 清理文件夹
    grunt.loadNpmTasks('grunt-contrib-clean');

    // js lint
//    grunt.loadNpmTasks('grunt-contrib-jshint');
    
    // 压缩图片
//    grunt.loadNpmTasks('grunt-contrib-imagemin');

    // 加载指定插件任务
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // css压缩
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    // grunt.loadNpmTasks('grunt-contrib-qunit');

    // grunt.loadNpmTasks('grunt-contrib-watch');
    // grunt.loadNpmTasks('grunt-contrib-concat');


    //通过定义一个default任务来配置Grunt，让它默认运行一个或者多个任务 默认任务; 直接 grunt 而无需添加参数，grunt uglify === grunt  
    grunt.registerTask('default', ['clean','uglify', 'cssmin']);

    // iconfont
//    grunt.registerTask('iconfont', ['cssmin_font']);

    grunt.registerTask('checkjs', ['jshint']);

    grunt.registerTask('imgmin', ['imagemin']);

};