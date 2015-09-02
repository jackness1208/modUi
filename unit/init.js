!function(window, undefined){

var document = window.document;
    
var testEl = $('#qunit-fixture')[0];

var iCase, i, iModule, len;

QUnit.test('mod.box', function(res){
    var testCase = [
            {
                name: '标签属性测试',
                attrs: [
                    'mod-title="标题文字"',
                    'mod-title-left="左侧标题"',
                    'mod-title-right="<a href=\'javascript:;\' class=\'mod-btn\'>右侧按钮</a>"',
                    'mod-hide="false"',
                    'mod-onload=""'
                ].join(' '),
                options: {}
            },{
                name: 'JS属性测试',
                attrs: '',
                options: {
                    title: '标题文字',
                    titleLeft: '左侧文字',
                    titleRight: '<a href=\'javascript:;\' class=\'mod-btn\'>右侧按钮</a>',
                    onload: function(){
                        this.show();
                        this.hide();
                    }
                }
            }
        ];

    for(var i = 0, iModule, len = testCase.length; i < len; i++){
        iModule = testCase[i];
        testEl.innerHTML = [
            '<div id="modBoxTest" '+ iModule.attrs +' >',
                '内容呵呵',
            '</div>'
        ].join('');
        res.ok(mod.box('#modBoxTest',iModule.options), iModule.name + 'Case Passed');
    }
});



}(window);

