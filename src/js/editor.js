/*
 @package Abricos
 @license http://www.gnu.org/copyleft/gpl.html GNU/GPL, see LICENSE.php
 */

var Component = new Brick.Component();
Component.requires = {
    mod: [
        {name: '{C#MODNAME}', files: ['lib.js']}
    ]
};
Component.entryPoint = function(NS){

    var Y = Brick.YUI,

        COMPONENT = this,

        SYS = Brick.mod.sys;

    NS.EditorWidget = Y.Base.create('editorWidget', NS.AppWidget, [
        SYS.Form,
        SYS.FormAction
    ], {
        onSubmitFormAction: function(){
            this.set('waiting', true);

            var fields = this.get('fields'),
                instance = this;
/*
            NS.appInstance.couruselSave(fields, function(err, result){

            });
/**/
        },

        onClick: function(e){
            switch (e.dataClick) {
                case 'cancel':
                    console.log('click Cancel button');
                    return true;
            }
        }
    }, {
        ATTRS: {
            component: {
                value: COMPONENT
            },
            templateBlockName: {
                value: 'widget'
            },
            fieldsClass: {
                value: NS.Courusel
            }
        }
    });

};