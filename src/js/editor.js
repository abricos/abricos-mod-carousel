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

    NS.EditorWidget = Y.Base.create('editorWidget', SYS.AppWidget, [
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
            var carouselid = this.get('carouselid') | 0
            return {
                'status': carouselid > 0 ? 'edit-isedit' : 'edit-isnew'
            };
        },
        onInitAppWidget: function(){
            var appInstance = this.get('appInstance'),
                carouselList = appInstance.get('carouselList'),
                carouselid = this.get('carouselid') | 0,
                carousel;

            if (carouselid === 0){
                carousel = new (appInstance.get('Carousel'))({
                    appInstance: appInstance
                });
            } else {
                carousel = carouselList.getById(carouselid);
            }

            this.set('model', carousel);
        },
        onSubmitFormAction: function(){
            this.set('waiting', true);

            var model = this.get('model'),
                instance = this;

            this.get('appInstance').carouselSave(model, function(err, result){
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
            this.go('manager.view');
        },
        _defEditorCancel: function(){
            this.go('manager.view');
        }
    }, {
        ATTRS: {
            component: {value: COMPONENT},
            templateBlockName: {value: 'widget'},
            carouselid: {value: 0}
        },
        parseURLParam: function(args){
            return {
                carouselid: args[0] | 0
            };

        }
    });

};