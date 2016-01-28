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
            var slideid = this.get('slideid') | 0
            return {
                'status': slideid > 0 ? 'edit-isedit' : 'edit-isnew'
            };
        },
        onInitAppWidget: function(err, appInstance){
            var carouselList = appInstance.get('carouselList'),
                carouselid = this.get('carouselid') | 0,
                slideid = this.get('slideid') | 0,
                carousel = carouselList.getById(carouselid);

            if (!carousel){
                return; // TODO: necessary to implement error
            }

            var tp = this.template;

            tp.gel('carouselname').innerHTML = carousel.get('name');

            this.set('waiting', true);

            appInstance.slideList(carouselid, this.onSlideListLoad, this);
        },
        onSlideListLoad: function(err, result){
            if (err){
                return; // TODO: necessary to implement error
            }
            this.set('waiting', false);

            var appInstance = this.get('appInstance'),
                slideList = appInstance.get('slideList'),
                slideid = this.get('slideid') | 0,
                slide;

            if (slideid === 0){
                slide = new (appInstance.get('Slide'))({
                    appInstance: appInstance
                });
            } else {
                slide = slideList.getById(slideid);
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

            this.get('appInstance').slideSave(this.get('carouselid'), model, function(err, result){
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
            carouselid: {
                value: 0
            },
            slideid: {
                value: 0
            }
        }
    });

};