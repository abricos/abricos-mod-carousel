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

        COMPONENT = this;

    NS.SlidesWidget = Y.Base.create('slidesWidget', NS.AppWidget, [
    ], {
        initializer: function(){
            this._currentSlideEditor = null;
        },
        buildTData: function(){
            var couruselId = this.get('couruselId') | 0
            return {
                couruselid : couruselId
            };
        },
        onInitAppWidget: function(err, appInstance){
            var couruselList = appInstance.get('couruselList'),
                couruselId = this.get('couruselId') | 0,
                courusel = couruselList.getById(couruselId);

            if (!courusel){
                return; // TODO: necessary to implement error
            }

            var tp = this.template;

            tp.gel('name').innerHTML = courusel.get('name');
            this.reloadSlideList();
        },
        reloadSlideList: function(){
            var couruselId = this.get('couruselId') | 0;
            this.set('waiting', true);

            this.get('appInstance').slideListLoad(couruselId, function(err, slideList){
                this.set('waiting', false);
                if (!err){
                    this.set('slideList', slideList);
                }
                this.renderSlideList();
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
        onClick: function(e){
            switch (e.dataClick) {
                case 'slide-create':
                    this.showSlideEditor(0);
                    return true;
                case 'slide-edit':
                    var slideId = e.target.getData('id');
                    this.showSlideEditor(slideId);
                    return true;
            }
        },
        showSlideEditor: function(slideId){
            this.closeSlideEditor();

            var tp = this.template;
            Y.one(tp.gel('list')).hide();
            Y.one(tp.gel('editor')).show();

            var boundingBox = Y.Node.create('<div />');
            Y.one(tp.gel('editor')).appendChild(boundingBox);

            var widget = new NS.SlideEditorWidget({
                boundingBox: boundingBox,
                couruselId: this.get('couruselId'),
                slideId: slideId
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
            Y.one(tp.gel('list')).show();
            Y.one(tp.gel('editor')).hide();

            this._currentSlideEditor.destroy();
            this._currentSlideEditor = null;
            if (reload){
                this.reloadSlideList();
            }
        }
    }, {
        ATTRS: {
            component: {
                value: COMPONENT
            },
            templateBlockName: {
                value: 'widget,list,row,image,url'
            },
            couruselId: {
                value: 0
            },
            slideList: {
                value: null
            }
        }
    });

    NS.SlidesWidget.parseURLParam = function(args){
        args = Y.merge({
            p1: 0
        }, args || {});

        return {
            couruselId: args.p1
        };
    };

};