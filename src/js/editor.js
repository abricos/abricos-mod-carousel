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
        buildTData: function(){
            var couruselId = this.get('couruselId')|0
            return {
                'status': couruselId >0 ? 'edit-isedit' : 'edit-isnew'
            };
        },
        onInitAppWidget: function(){
            var couruselList = this.get('appInstance').get('couruselList'),
                couruselId = this.get('couruselId')|0,
                courusel;

            if (couruselId === 0){
                courusel = new (couruselList.model)();
            } else {
                courusel = couruselList.getById(couruselId);
            }

            this.set('model', courusel);
        },
        onSubmitFormAction: function(){
            this.set('waiting', true);

            var model = this.get('model'),
                instance = this;

            this.get('appInstance').couruselSave(model, function(err, result){
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