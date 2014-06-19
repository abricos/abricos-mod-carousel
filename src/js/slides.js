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

        COMPONENT = this;

    NS.SlidesWidget = Y.Base.create('slidesWidget', NS.AppWidget, [
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
            var couruselId = this.get('couruselId') | 0
            return {

            };
        },
        onInitAppWidget: function(err, appInstance, options){
            var couruselList = appInstance.get('couruselList'),
                couruselId = this.get('couruselId') | 0,
                courusel = couruselList.getById(couruselId);

            if (!courusel){
                return; // TODO: necessary to implement error
            }

            this.set('waiting', true);

            appInstance.slideListLoad(couruselId, function(err, slideList){
                this.set('waiting', false);
            }, this);


/*
            var tp = this.template, lst = "";

            couruselList.each(function(courusel){
                var attrs = courusel.toJSON();

                lst += tp.replace('row', [
                    attrs
                ]);
            }, this);

            tp.gel('list').innerHTML = tp.replace('list', {
                'rows': lst
            });
            /**/
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