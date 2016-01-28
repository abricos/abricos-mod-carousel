/*
 @package Abricos
 @license http://www.gnu.org/copyleft/gpl.html GNU/GPL, see LICENSE.php
 */

var Component = new Brick.Component();
Component.requires = {
    mod: [
        {name: '{C#MODNAME}', files: ['slideeditor.js']}
    ]
};
Component.entryPoint = function(NS){

    var Y = Brick.YUI,
        COMPONENT = this,
        SYS = Brick.mod.sys;

    NS.SlidesWidget = Y.Base.create('slidesWidget', SYS.AppWidget, [], {
        initializer: function(){
            this._currentSlideEditor = null;
            this.publish('carouselListClick', {
                defaultFn: this._defCarouselListClick
            });
        },
        buildTData: function(){
            return {
                carouselid: this.get('carouselid') | 0
            };
        },
        onInitAppWidget: function(err, appInstance){
            var carouselList = appInstance.get('carouselList'),
                carouselid = this.get('carouselid') | 0,
                carousel = carouselList.getById(carouselid);

            if (!carousel){
                return; // TODO: necessary to implement error
            }

            this.template.setHTML('name', carousel.get('name'));

            this.reloadSlideList();
        },
        reloadSlideList: function(){
            var carouselid = this.get('carouselid') | 0;
            this.set('waiting', true);

            this.get('appInstance').slideList(carouselid, function(err, result){
                this.set('waiting', false);
                if (!err){
                    this.renderSlideList();
                }
            }, this);
        },
        renderSlideList: function(){
            var slideList = this.get('slideList');

            if (!slideList){
                return;
            }
            var tp = this.template, lst = "";

            slideList.each(function(slide){
                var attrs = slide.toJSON();
                lst += tp.replace('row', [
                    {
                        tpurl: attrs.url ? tp.replace('url', attrs) : '',
                        tpimage: attrs.filehash ? tp.replace('image', attrs) : ''
                    },
                    attrs
                ]);
            }, this);

            tp.gel('list').innerHTML = tp.replace('list', {
                'rows': lst
            });
        },
        slideDeleteShow: function(slideid, hide){
            var tp = this.template,
                elDShow = Y.one(document.getElementById(tp.gelid('row.delete') + '-' + slideid)),
                elDelete = Y.one(document.getElementById(tp.gelid('row.deletegroup') + '-' + slideid));
            if (hide){
                elDShow.show();
                elDelete.hide();
            } else {
                elDShow.hide();
                elDelete.show();
            }
        },
        slideDelete: function(slideid){
            var carouselid = this.get('carouselid') | 0;

            this.set('waiting', true);
            this.get('appInstance').slideDelete(carouselid, slideid, function(err, result){
                this.set('waiting', false);
                this.reloadSlideList();
            }, this);
        },
        onClick: function(e){
            switch (e.dataClick) {
                case 'slide-create':
                    this.showSlideEditor(0);
                    return true;
                case 'carousel-list':
                    this.fire('carouselListClick');
                    return true;
            }

            var slideid = e.target.getData('id') | 0;
            if (slideid === 0){
                return;
            }

            switch (e.dataClick) {
                case 'slide-edit':
                    this.showSlideEditor(slideid);
                    return true;
                case 'slide-delete-show':
                    this.slideDeleteShow(slideid);
                    return true;
                case 'slide-delete-cancel':
                    this.slideDeleteShow(slideid, true);
                    return true;
                case 'slide-delete':
                    this.slideDelete(slideid);
                    return true;
            }
        },
        showSlideEditor: function(slideid){
            this.closeSlideEditor();

            var tp = this.template;
            tp.toggleView(false, 'list', 'editor');

            var boundingBox = Y.Node.create('<div />');
            Y.one(tp.gel('editor')).appendChild(boundingBox);

            var widget = new NS.SlideEditorWidget({
                boundingBox: boundingBox,
                carouselid: this.get('carouselid'),
                slideid: slideid
            });
            var instance = this;
            widget.on('editorCancel', function(){
                instance.closeSlideEditor();
            });
            widget.on('editorSaved', function(){
                instance.closeSlideEditor(true);
            });
            this._currentSlideEditor = widget;
        },
        closeSlideEditor: function(reload){
            if (!this._currentSlideEditor){
                return;
            }

            var tp = this.template;
            tp.toggleView(true, 'list', 'editor');

            this._currentSlideEditor.destroy();
            this._currentSlideEditor = null;
            if (reload){
                this.reloadSlideList();
            }
        },
        _defCarouselListClick: function(){
            this.go('manager.view');
        }
    }, {
        ATTRS: {
            component: {value: COMPONENT},
            templateBlockName: {value: 'widget,list,row,image,url'},
            carouselid: {value: 0},
            slideList: {
                readOnly: true,
                getter: function(){
                    return this.get('appInstance').get('slideList');
                }
            }
        },
        parseURLParam: function(args){
            return {
                carouselid: args[0] | 0
            };
        }
    });
};