<?php
/**
 * @package Abricos
 * @subpackage Carousel
 * @author Alexander Kuzmin <roosit@abricos.org>
 */


Abricos::GetModule('carousel')->GetManager();

$modManager = CarouselModuleManager::$instance;

if (!$modManager->IsViewRole()) {
    return;
}

$adress = $this->registry->adress;

$brick = Brick::$builder->brick;
$v = & $brick->param->var;

?>