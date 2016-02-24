<?php

/**
 * @package Abricos
 * @subpackage Carousel
 * @license MIT license (https://github.com/abricos/abricos-mod-carousel/blob/master/LICENSE)
 * @author Alexander Kuzmin <roosit@abricos.org>
 */
class CarouselModule extends Ab_Module {

    public function __construct(){

        // Название модуля
        $this->name = "carousel";

        $this->takelink = "carousel";

        // Версия модуля
        $this->version = "0.1.3";

        $this->permission = new CarouselPermission($this);
    }

    public function GetContentName(){

        $dir = Abricos::$adress->dir;
        if (isset($dir[1])){
            switch ($dir[1]){
                case 'uploadimg':
                case 'view':
                    return $dir[1];
            }
        }

        return '';
    }

    public function Bos_IsMenu(){
        return true;
    }

    public function Bos_IsSummary(){
        return true;
    }
}

class CarouselAction {
    const VIEW = 10;
    const WRITE = 30;
    const ADMIN = 50;
}

class CarouselPermission extends Ab_UserPermission {

    public function CarouselPermission(CarouselModule $module){
        $defRoles = array(
            new Ab_UserRole(CarouselAction::VIEW, Ab_UserGroup::GUEST),
            new Ab_UserRole(CarouselAction::VIEW, Ab_UserGroup::REGISTERED),
            new Ab_UserRole(CarouselAction::VIEW, Ab_UserGroup::ADMIN),

            new Ab_UserRole(CarouselAction::WRITE, Ab_UserGroup::ADMIN),

            new Ab_UserRole(CarouselAction::ADMIN, Ab_UserGroup::ADMIN),
        );
        parent::__construct($module, $defRoles);
    }

    public function GetRoles(){
        return array(
            CarouselAction::VIEW => $this->CheckAction(CarouselAction::VIEW),
            CarouselAction::WRITE => $this->CheckAction(CarouselAction::WRITE),
            CarouselAction::ADMIN => $this->CheckAction(CarouselAction::ADMIN)
        );
    }
}

Abricos::ModuleRegister(new CarouselModule());

?>