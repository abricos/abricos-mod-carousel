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
        buildTData: function(){
            var couruselId = this.get('couruselId') | 0
            return {

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

            this.set('waiting', true);

            appInstance.slideListLoad(couruselId, function(err, slideList){
                this.set('waiting', false);
            }, this);
        },
        onClick: function(e){
            switch (e.dataClick) {
                case 'slide-create':
                    this._createSlide();
                    return true;
            }
        },
        _createSlide: function(){
            new NS.SlideEditorWidget({
                boundingBox: this.template.gel('editor'),
                couruselId: this.get('couruselId')
            });
        }
    }, {
        ATTRS: {
            component: {
                value: COMPONENT
            },
            templateBlockName: {
                value: 'widget,list,row'
            },
            couruselId: {
                value: 0
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