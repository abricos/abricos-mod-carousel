/*!
 * Copyright 2008-2014 Alexander Kuzmin <roosit@abricos.org>
 * Licensed under the MIT license
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
        initializer: function(){
            this.publish('editorCancel', {
                defaultFn: this._defEditorCancel
            });
            this.publish('editorSaved', {
                defaultFn: this._defEditorSaved
            });
        },
        onInitAppWidget: function(){
            this.renderCourusel();
        },
        renderCourusel: function(){
            var couruselList = this.get('appInstance').get('couruselList'),
                couruselId = this.get('couruselId'),
                courusel = couruselList.getById(couruselId);

            this.set('fields', courusel);
        },
        onSubmitFormAction: function(){
            this.set('waiting', true);

            var fields = this.get('fields'),
                instance = this;

            this.get('appInstance').couruselSave(fields, function(err, result){
                instance.set('waiting', false);
                if (!err){
                    instance.fire('editorSaved');
                }
            });
        },
        onClick: function(e){
            switch (e.dataClick) {
                case 'cancel':
                    this.fire('editorCancel');
                    return true;
            }
        },
        _defEditorSaved: function(){
            Brick.Page.reload(NS.URL.manager.view());
        },
        _defEditorCancel: function(){
            Brick.Page.reload(NS.URL.manager.view());
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
            },
            couruselId: {
                value: 0
            }
        }
    });

    NS.EditorWidget.parseURLParam = function(args){
        args = Y.merge({
            p1: 0
        }, args || {});

        return {
            couruselId: args.p1
        };
    };
};