!function(window, undefined){

var document = window.document,
    testCase = {
        'mod.box': [
            {
                tpl:[
                    '<div id="modBoxTest" mod-title="标题文字" mod-title-left="左侧标题" mod-title-right="<a href=\'javascript:;\' class=\'mod-btn\'>右侧按钮</a>">',
                        '表单内容',
                    '</div>'
                ].join(''),
                argv: [
                    '#testEl'
                ]
            }
        ] 
    };

var testEl = $('#testEl')[0];
QUnit.test('mod.box() 模块测试', function(res){
    var iCase = testCase['mod.box'];
    for(var i = 0, iModule, len = iCase.length; i < len; i++){
        iModule = iCase[i];
        testEl.innerHTML = iModule.tpl;
        res.ok(mod.box.apply(mod, iModule.argv), 'Passed');
    }
    res.ok(mod.box('#testEl'), 'passed');
    res.ok(bb('#testEl'), 'passed');
});




}(window);

