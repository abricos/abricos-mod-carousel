<?php
/**
 * Схема таблиц данного модуля.
 *
 * @package Abricos
 * @subpackage Courusel
 * @license MIT license (https://github.com/abricos/abricos-mod-courusel/blob/master/LICENSE)
 * @author Alexander Kuzmin <roosit@abricos.org>
 */

$charset = "CHARACTER SET 'utf8' COLLATE 'utf8_general_ci'";
$updateManager = Ab_UpdateManager::$current;
$db = Abricos::$db;
$pfx = $db->prefix;

if ($updateManager->isInstall()) {

    Abricos::GetModule('courusel')->permission->Install();

    $db->query_write("
		CREATE TABLE IF NOT EXISTS ".$pfx."courusel (
            `couruselid` int(10) unsigned NOT NULL auto_increment,
		    `name` varchar(50) NOT NULL DEFAULT '' COMMENT 'Имя',

			`width` int(10) unsigned NOT NULL DEFAULT 0 COMMENT 'Ширина',
			`height` int(10) unsigned NOT NULL DEFAULT 0 COMMENT 'Высота',

			`dateline` int(10) unsigned NOT NULL DEFAULT 0 COMMENT 'Дата создания',
			`deldate` int(10) unsigned NOT NULL DEFAULT 0 COMMENT 'Дата удаления',

		    PRIMARY KEY  (`couruselid`),
		    UNIQUE `name` (`name`)
		)".$charset
    );

    $db->query_write("
		CREATE TABLE IF NOT EXISTS ".$pfx."courusel_slide (
            `slideid` int(10) unsigned NOT NULL auto_increment,
		    `title` varchar(250) NOT NULL DEFAULT '' COMMENT 'Заголовок',
		    `url` varchar(250) NOT NULL DEFAULT '' COMMENT 'URL',
		    `ord` int(4) NOT NULL DEFAULT 0 COMMENT 'Сортировка',
			`filehash` varchar(8) NOT NULL DEFAULT '' COMMENT 'Идентификатор картинки',
		    PRIMARY KEY  (`slideid`)
		)".$charset
    );

}

?>