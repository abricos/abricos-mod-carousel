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

    NS.SlideEditorWidget = Y.Base.create('slideEditorWidget', SYS.AppWidget, [
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
            var slideId = this.get('slideId') | 0
            return {
                'status': slideId > 0 ? 'edit-isedit' : 'edit-isnew'
            };
        },
        onInitAppWidget: function(err, appInstance){
            var carouselList = appInstance.get('carouselList'),
                carouselId = this.get('carouselId') | 0,
                slideId = this.get('slideId') | 0,
                carousel = carouselList.getById(carouselId);

            if (!carousel){
                return; // TODO: necessary to implement error
            }

            var tp = this.template;

            tp.gel('carouselname').innerHTML = carousel.get('name');

            this.set('waiting', true);

            appInstance.slideListLoad(carouselId, this.onSlideListLoad, this);
        },
        onSlideListLoad: function(err, slideList){
            if (err){
                return; // TODO: necessary to implement error
            }
            this.set('waiting', false);

            var appInstance = this.get('appInstance'),
                slideId = this.get('slideId') | 0,
                slide;

            if (slideId === 0){
                slide = new (slideList.model)();
            } else {
                slide = slideList.getById(slideId);
            }
            this.set('model', slide);
        },
        onUpdateUIFromModel: function(slide){

            var attrs = slide.toJSON(),
                tp = this.template,
                el = Y.one(tp.gel('image'));

            if (attrs.filehash){
                el.setHTML(tp.replace('image', attrs));
            } else {
                el.setHTML(tp.replace('imagebutton', attrs));
            }
        },
        onSubmitFormAction: function(){
            this.set('waiting', true);

            var model = this.get('model'),
                instance = this;

            this.get('appInstance').slideSave(this.get('carouselId'), model, function(err, result){
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
                case 'image-upload':
                    this.imageUploadShow();
                    return true;
                case 'image-remove':
                    this.imageRemove();
                    return true;
            }
        },
        imageUploadShow: function(){
            NS.uploadActiveImage = this;

            if (Y.Lang.isValue(this._uploadWindow) && !this._uploadWindow.closed){
                this._uploadWindow.focus();
                return;
            }

            var url = '/carousel/uploadimg/';
            this._uploadWindow = window.open(
                url, 'carouselimage',
                'statusbar=no,menubar=no,toolbar=no,scrollbars=yes,resizable=yes,width=550,height=500'
            );
            NS.uploadActiveImage = this;
        },
        imageSet: function(image){
            this.updateModelFromUI();
            var slide = this.get('model');
            slide.set('filehash', image);
        },
        imageRemove: function(){
            this.imageSet(null);
        },
        _defEditorSaved: function(){
        },
        _defEditorCancel: function(){
        }
    }, {
        ATTRS: {
            component: {
                value: COMPONENT
            },
            templateBlockName: {
                value: 'widget,imagebutton,image'
            },
            carouselId: {
                value: 0
            },
            slideId: {
                value: 0
            }
        }
    });

};