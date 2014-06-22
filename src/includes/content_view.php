<?php
/**
 * @package Abricos
 * @subpackage Carousel
 * @author Alexander Kuzmin <roosit@abricos.org>
 */

Abricos::GetModule('carousel')->GetManager();
$modManager = CarouselModuleManager::$instance;

if (!$modManager->IsViewRole()) {
    $brick->content = "";
    return;
}

$brick = Brick::$builder->brick;

$v = & $brick->param->var;
$adr = Abricos::$adress;
$carouselId = $adr->dir[2];

$carouselBrick = Brick::$builder->LoadBrickS('carousel', 'carousel', $brick, array( "p" => array(
    "carouselid" => $carouselId,
    "ignoreoff" => true
)));

$brick->content = Brick::ReplaceVarByData($brick->content, array(
    "result" => $carouselBrick->content
));


?>