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

    NS.ManagerWidget = Y.Base.create('managerWidget', NS.AppWidget, [
    ], {
        buildTData: function(){
            return {
                'urlcreate': NS.URL.editor.create()
            };
        },
        onClick: function(e){
            switch (e.dataClick){
                /*
                case 'create':

                    return true;
                /**/
            }
        }
    }, {
        ATTRS: {
            component: {
                value: COMPONENT
            },
            templateBlockName: {
                value: 'widget'
            }
        }
    });

};