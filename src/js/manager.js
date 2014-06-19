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
        initializer: function(){
            this.publish('couruselCreate', {
                defaultFn: this._defCouruselCreate
            });
            this.publish('couruselEdit', {
                defaultFn: this._defCouruselEdit
            });
            this.publish('couruselSlides', {
                defaultFn: this._defCouruselSlides
            });
        },
        onInitAppWidget: function(err, appInstance, options){
            this.renderCouruselList();
        },
        renderCouruselList: function(){
            var couruselList = this.get('appInstance').get('couruselList');

            var tp = this.template, lst = "";

            couruselList.each(function(courusel){
                var attrs = courusel.toJSON();

                lst += tp.replace('row', [
                    {
                        onoffbutton: attrs.off ?
                            tp.replace('btnon') : tp.replace('btnoff')
                    },
                    attrs
                ]);
            }, this);

            tp.gel('list').innerHTML = tp.replace('list', {
                'rows': lst
            });
        },
        onClick: function(e){
            switch (e.dataClick) {
                case 'courusel-create':
                    this.fire('couruselCreate');
                    return true;
                case 'courusel-edit':
                    var couruselId = e.target.getData('id');
                    this.fire('couruselEdit', couruselId);
                    return true;
                case 'courusel-slides':
                    var couruselId = e.target.getData('id');
                    this.fire('couruselSlides', couruselId);
                    return true;
            }
        },
        _defCouruselCreate: function(){
            Brick.Page.reload(NS.URL.editor.create());
        },
        _defCouruselEdit: function(e, couruselId){
            Brick.Page.reload(NS.URL.editor.edit(couruselId));
        },
        _defCouruselSlides: function(e, couruselId){
            Brick.Page.reload(NS.URL.editor.slides(couruselId));
        }
    }, {
        ATTRS: {
            component: {
                value: COMPONENT
            },
            templateBlockName: {
                value: 'widget,list,row,btnon,btnoff'
            }
        }
    });

};