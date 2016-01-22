var Component = new Brick.Component();
Component.requires = {
    mod: [
        {name: 'sys', files: ['appModel.js']}
    ]
};
Component.entryPoint = function(NS){

    var Y = Brick.YUI,
        SYS = Brick.mod.sys;

    NS.Carousel = Y.Base.create('carousel', SYS.AppModel, [], {
        structureName: 'Carousel'
    });

    NS.CarouselList = Y.Base.create('carouselList', SYS.AppModelList, [], {
        appItem: NS.Carousel
    });

    NS.Slide = Y.Base.create('slide', SYS.AppModel, [], {
        structureName: 'Slide'
    });

    NS.SlideList = Y.Base.create('slideList', SYS.AppModelList, [], {
        appItem: NS.Slide
    });
};
