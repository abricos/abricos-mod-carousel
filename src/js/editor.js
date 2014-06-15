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
        SYS.Form
    ], {
        /*
        onInitAppWidget: function(){
            var s = this.get('fields');

            console.log(arguments);
            console.log(s);

        },
        /**/
        onClick: function(e){
/*
            var s = this.get('fields');
            console.log(s.toJSON());
/**/
            switch (e.dataClick){
                case 'save':

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