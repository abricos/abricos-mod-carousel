<?php
/**
 * @package Abricos
 * @subpackage Carousel
 * @author Alexander Kuzmin <roosit@abricos.org>
 */

/** @var CarouselManager $modManager */
$modManager = Abricos::GetModule('carousel')->GetManager();

$adr = Abricos::$adress;
$carouselid = isset($adr->dir[2]) ? intval($adr->dir[2]) : 0;

if (!$modManager->IsViewRole() || $carouselid === 0){
    $brick->content = "";
    return;
}

$brick = Brick::$builder->brick;

$v = &$brick->param->var;

$carouselBrick = Brick::$builder->LoadBrickS('carousel', 'carousel', $brick, array(
    "p" => array(
        "carouselid" => $carouselid,
        "ignoreoff" => true
    )
));

$brick->content = Brick::ReplaceVarByData($brick->content, array(
    "result" => $carouselBrick->content
));


?>