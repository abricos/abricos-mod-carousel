<?php
/**
 * @package Abricos
 * @subpackage Carousel
 * @author Alexander Kuzmin <roosit@abricos.org>
 */

$brick = Brick::$builder->brick;
$v = & $brick->param->var;
$p = & $brick->param->param;

Abricos::GetModule('carousel')->GetManager();
$modManager = CarouselModuleManager::$instance;
$man = $modManager->GetCarouselManager();

$carouselId = $p['carouselid'];
$name = $p['name'];

$carousel = null;
if ($carouselId > 0) {
    $carousel = $man->Carousel($carouselId);
}else if (!empty($name)){
    $carousel = $man->CarouselByName($name);
}

if (empty($carousel) || ($carousel->off && empty($p['ignoreoff']))) {
    $brick->content = "";
    return;
}

$slideList = $man->SlideList($carousel->id);
$lstIndicator = "";
$lstItem = "";
for ($i = 0; $i < $slideList->Count(); $i++) {
    $slide = $slideList->GetByIndex($i);

    $lstIndicator .= Brick::ReplaceVarByData($v['indicator'], array(
        "index" => $i,
        "active" => $i===0 ? "active" : ""
    ));
    $lstItem .= Brick::ReplaceVarByData($v['slide'], array(
        "code" => $slide->code,
        "active" => $i===0 ? "active" : "",
        "filehash" => $slide->filehash,
        "title" => $slide->title,
        "url" => empty($slide->url) ? "#" : $slide->url,
        "imgwidth" => empty($carousel->width) ? "auto" : $carousel->width."px",
        "imgheight" => empty($carousel->height) ? "auto" : $carousel->height."px"
    ));
}


$brick->content = Brick::ReplaceVarByData($brick->content, array(
    "indicators" => $lstIndicator,
    "items" => $lstItem,
    "brickid" => $brick->id
));


if (empty($p['nowrap'])){
    $brick->content = Brick::ReplaceVarByData($v["wrap"], array(
        "content" => $brick->content
    ));
}

?>