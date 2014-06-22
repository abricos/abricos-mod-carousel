<?php
/**
 * @package Abricos
 * @subpackage Courusel
 * @author Alexander Kuzmin <roosit@abricos.org>
 */


Abricos::GetModule('courusel')->GetManager();

$modManager = CouruselModuleManager::$instance;

if (!$modManager->IsViewRole()) {
    return;
}

$adress = $this->registry->adress;

$brick = Brick::$builder->brick;
$v = & $brick->param->var;


?>