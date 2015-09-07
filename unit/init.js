!function(window, undefined){

var document = window.document;
    
var testEl = $('#testEl')[0];

var unitList = {
        'mod.box': {
            cases: [
                {
                    name: '标签属性测试',
                    html: [
                        '<div style="color:red">红色文字</div>'
                    ].join(''),
                    attributes: {
                        'mod-title': '标题文字',
                        'mod-title-left': '左侧标题',
                        'mod-title-right': '<a href=\'javascript:;\' class=\'mod-btn\'>右侧按钮</a>',
                        'mod-hide': "false",
                        'mod-onload': ''
                    },
                    options: undefined
                },{
                    name: 'javascript 测试',
                    html: '文字文字',
                    attributes: undefined,
                    options:{
                        title: '标题文字',
                        titleLeft: '左侧文字',
                        titleRight: '<a href=\'javascript:;\' class=\'mod-btn\'>右侧按钮</a>',
                        onload: function(){
                            
                        }
                    }
                }
            ],

            run: function(options, next){

            },

            test: function(next){

            }
        }
    };

!function(){
    var iCase;
    for(var key in unitList){
        if(unitList.hasOwnProperty(key)){
            iCase = unitList[key];
            Qunit.test(key, function(){
                //TODO
            });
        }

    }
}();    

// QUnit.test('mod.box', function(res){
//     var testCase = [
//             {
//                 name: '标签属性测试',
//                 attrs: [
//                     'mod-title="标题文字"',
//                     'mod-title-left="左侧标题"',
//                     'mod-title-right="<a href=\'javascript:;\' class=\'mod-btn\'>右侧按钮</a>"',
//                     'mod-hide="false"',
//                     'mod-onload=""'
//                 ].join(' '),
//                 options: {}
//             },{
//                 name: 'JS属性测试',
//                 attrs: '',
//                 options: {
//                     title: '标题文字',
//                     titleLeft: '左侧文字',
//                     titleRight: '<a href=\'javascript:;\' class=\'mod-btn\'>右侧按钮</a>',
//                     onload: function(){
//                         this.show();
//                         this.hide();
//                     }
//                 }
//             }
//         ];

//     for(var i = 0, iModule, len = testCase.length; i < len; i++){
//         iModule = testCase[i];
//         testEl.innerHTML = [
//             '<div id="modBoxTest" '+ iModule.attrs +' >',
//             '</div>'
//         ].join('');
//         mod.box('#modBoxTest',iModule.options)
//         // res.ok(mod.box('#modBoxTest',iModule.options), iModule.name + 'Case Passed');
//         stop();
//     }
// });



}(window);

