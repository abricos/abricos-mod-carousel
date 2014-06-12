/*!
 * Copyright 2014 Alexander Kuzmin <roosit@abricos.org>
 * Licensed under the MIT license
 */

var Component = new Brick.Component();
Component.entryPoint = function(){
	if (Brick.Permission.check('courusel', '50') != 1){ return; }
	
	var os = Brick.mod.bos;
	
	var app = new os.Application(this.moduleName);
	app.icon = '/modules/courusel/img/logo-48x48.png';
	app.entryComponent = 'wspace';
	app.entryPoint = 'ws';
	
	os.ApplicationManager.register(app);
};
