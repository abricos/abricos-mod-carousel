<?php
/**
 * Схема таблиц данного модуля.
 *
 * @package Abricos
 * @subpackage Carousel
 * @license MIT license (https://github.com/abricos/abricos-mod-carousel/blob/master/LICENSE)
 * @author Alexander Kuzmin <roosit@abricos.org>
 */

$charset = "CHARACTER SET 'utf8' COLLATE 'utf8_general_ci'";
$updateManager = Ab_UpdateManager::$current;
$db = Abricos::$db;
$pfx = $db->prefix;

if ($updateManager->isInstall()){

    Abricos::GetModule('carousel')->permission->Install();

    $db->query_write("
		CREATE TABLE IF NOT EXISTS ".$pfx."carousel (
            carouselid int(10) unsigned NOT NULL auto_increment,
		    name varchar(50) NOT NULL DEFAULT '' COMMENT 'Имя',

			width int(10) unsigned NOT NULL DEFAULT 0 COMMENT 'Width',
			height int(10) unsigned NOT NULL DEFAULT 0 COMMENT 'Height',

		    isCustomTemplate tinyint(1) unsigned NOT NULL DEFAULT 0 COMMENT '1 - Is Custom Template, 0 - Default Template',
		    customTemplate TEXT NOT NULL  COMMENT 'Custom Template',

			off tinyint(1) unsigned NOT NULL DEFAULT 0 COMMENT 'Отключено',

			dateline int(10) unsigned NOT NULL DEFAULT 0 COMMENT 'Дата создания',
			deldate int(10) unsigned NOT NULL DEFAULT 0 COMMENT 'Дата удаления',

		    PRIMARY KEY  (carouselid),
		    UNIQUE name (name)
		)".$charset
    );

    $db->query_write("
		CREATE TABLE IF NOT EXISTS ".$pfx."carousel_slide (
            slideid int(10) unsigned NOT NULL auto_increment,
            carouselid int(10) unsigned NOT NULL DEFAULT 0 COMMENT '',
		    title varchar(250) NOT NULL DEFAULT '' COMMENT 'Заголовок',
		    url varchar(250) NOT NULL DEFAULT '' COMMENT 'URL',
		    code TEXT NOT NULL  COMMENT 'HTML code',
		    ord int(4) NOT NULL DEFAULT 0 COMMENT 'Сортировка',
			filehash varchar(8) NOT NULL DEFAULT '' COMMENT 'Идентификатор картинки',
		    PRIMARY KEY  (slideid)
		)".$charset
    );

    // картинки
    $db->query_write("
		CREATE TABLE IF NOT EXISTS ".$pfx."carousel_foto (
			fotoid int(10) UNSIGNED NOT NULL auto_increment,
			slideid int(10) UNSIGNED NOT NULL COMMENT 'Идентификатор слайда',
			fileid varchar(8) NOT NULL,
			ord int(4) UNSIGNED NOT NULL default '0' COMMENT 'Сортировка',
			dateline int(10) UNSIGNED NOT NULL default '0' COMMENT 'дата добавления',
			PRIMARY KEY (fotoid),
			KEY slideid (slideid)
		)".$charset
    );

}

if ($updateManager->isUpdate('0.1.1') && !$updateManager->isInstall()){
    $db->query_write("
		ALTER TABLE ".$pfx."carousel_slide
		ADD code TEXT NOT NULL  COMMENT 'HTML code'
	");
}

if ($updateManager->isUpdate('0.1.2') && !$updateManager->isInstall()){
    $db->query_write("
		ALTER TABLE ".$pfx."carousel
        ADD isCustomTemplate tinyint(1) unsigned NOT NULL DEFAULT 0 COMMENT '1 - Is Custom Template, 0 - Default Template',
        ADD customTemplate TEXT NOT NULL  COMMENT 'Custom Template'
	");
}
