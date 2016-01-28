var Component = new Brick.Component();
Component.requires = {
    // yui: ['base'],
    mod: [
        {name: 'sys', files: ['application.js']},
        {name: '{C#MODNAME}', files: ['model.js']}
    ]
};
Component.entryPoint = function(NS){

    NS.roles = new Brick.AppRoles('{C#MODNAME}', {
        isAdmin: 50,
        isWrite: 30,
        isView: 10
    });

    var Y = Brick.YUI,
        COMPONENT = this,
        SYS = Brick.mod.sys;


    SYS.Application.build(COMPONENT, {}, {
        initializer: function(){
            NS.roles.load(function(){
                this.carouselList(function(){
                    this.initCallbackFire();
                }, this);
            }, this);
        }
    }, [], {
        ATTRS: {
            isLoadAppStructure: {value: true},
            Carousel: {value: NS.Carousel},
            CarouselList: {value: NS.CarouselList},
            Slide: {value: NS.Slide},
            SlideList: {value: NS.SlideList},
        },
        REQS: {
            carouselList: {
                attribute: true,
                type: 'modelList:CarouselList'
            },
            carouselSave: {args: ['carousel']},
            carouselDisable: {args: ['carouselid']},
            carouselEnable: {args: ['carouselid']},
            carouselDelete: {args: ['carouselid']},
            slideList: {
                args: ['carouselid'],
                attribute: true,
                type: 'modelList:SlideList'
            },
            slideSave: {args: ['carouselid', 'slide']},
            slideDelete: {args: ['carouselid', 'slideid']},
        },
        URLS: {
            ws: "#app={C#MODNAMEURI}/wspace/ws/",
            manager: {
                view: function(){
                    return this.getURL('ws') + 'manager/ManagerWidget/'
                }
            },
            editor: {
                create: function(){
                    return this.getURL('ws') + 'editor/EditorWidget/'
                },
                edit: function(carouselid){
                    return this.getURL('ws') + 'editor/EditorWidget/' + carouselid + '/'
                },
                slides: function(carouselid){
                    return this.getURL('ws') + 'slides/SlidesWidget/' + carouselid + '/'
                }
            }
        }
    });

};