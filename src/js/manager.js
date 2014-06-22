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
            this.publish('carouselCreate', {
                defaultFn: this._defCarouselCreate
            });
            this.publish('carouselEdit', {
                defaultFn: this._defCarouselEdit
            });
            this.publish('carouselSlides', {
                defaultFn: this._defCarouselSlides
            });
        },
        onInitAppWidget: function(err, appInstance, options){
            this.renderCarouselList();
        },
        renderCarouselList: function(){
            var carouselList = this.get('appInstance').get('carouselList');

            var tp = this.template, lst = "";

            carouselList.each(function(carousel){
                var attrs = carousel.toJSON();

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
        carouselEnable: function(carouselId){
            this.set('waiting', true);
            this.get('appInstance').carouselEnable(carouselId, function(err, result){
                this.set('waiting', false);
                this.renderCarouselList();
            }, this);
        },
        carouselDisable: function(carouselId){
            this.set('waiting', true);
            this.get('appInstance').carouselDisable(carouselId, function(err, result){
                this.set('waiting', false);
                this.renderCarouselList();
            }, this);
        },
        onClick: function(e){
            switch (e.dataClick) {
                case 'carousel-create':
                    this.fire('carouselCreate');
                    return true;
                case 'carousel-edit':
                    var carouselId = e.target.getData('id');
                    this.fire('carouselEdit', carouselId);
                    return true;
                case 'carousel-slides':
                    var carouselId = e.target.getData('id');
                    this.fire('carouselSlides', carouselId);
                    return true;
                case 'carousel-enable':
                    var carouselId = e.target.getData('id');
                    this.carouselEnable(carouselId);
                    return true;
                case 'carousel-disable':
                    var carouselId = e.target.getData('id');
                    this.carouselDisable(carouselId);
                    return true;
            }
        },
        _defCarouselCreate: function(){
            Brick.Page.reload(NS.URL.editor.create());
        },
        _defCarouselEdit: function(e, carouselId){
            Brick.Page.reload(NS.URL.editor.edit(carouselId));
        },
        _defCarouselSlides: function(e, carouselId){
            Brick.Page.reload(NS.URL.editor.slides(carouselId));
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