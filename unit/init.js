!function(window, undefined){

var document = window.document,
    testCase = {
        'mod.box':[
            {
                tpl:[
                    '<div id="modBoxTest">',
                        '表单内容'
                    '</div>'
                ].join(''),
                argv: [
                    '#testEl'
                ],
                ready: function(){

                }
            }
        ] 
    };

var testEl = $('#testEl')[0];
QUnit.test('mod.box() 模块测试', function(res){
    res.ok(mod.box('#testEl'), 'passed');
    res.ok(bb('#testEl'), 'passed');
});




}(window);

