<?php

/**
 * @package Abricos
 * @license Licensed under the MIT license
 * @author Alexander Kuzmin <roosit@abricos.org>
 */


require_once 'classes/structure.php';
require_once 'dbquery.php';

/**
 * Class CarouselModuleManager
 */
class CarouselModuleManager extends Ab_ModuleManager {

    /**
     * @var CarouselModuleManager
     */
    public static $instance = null;

    private $_carouselManager = null;

    public function __construct(CarouselModule $module) {
        parent::__construct($module);

        CarouselModuleManager::$instance = $this;
    }

    public function IsAdminRole() {
        return $this->IsRoleEnable(CarouselAction::ADMIN);
    }

    public function IsWriteRole() {
        if ($this->IsAdminRole()) {
            return true;
        }
        return $this->IsRoleEnable(CarouselAction::WRITE);
    }

    public function IsViewRole() {
        if ($this->IsWriteRole()) {
            return true;
        }
        return $this->IsRoleEnable(CarouselAction::VIEW);
    }

    /**
     * @return CarouselManager
     */
    public function GetCarouselManager() {
        if (empty($this->_carouselManager)) {
            require_once 'classes/carousel.php';
            $this->_carouselManager = new CarouselManager($this);
        }
        return $this->_carouselManager;
    }

    public function TreatResult($res) {
        $ret = new stdClass();
        $ret->err = 0;

        if (is_integer($res)) {
            $ret->err = $res;
        } else if (is_object($res)) {
            $ret = $res;
        }
        $ret->err = intval($ret->err);

        return $ret;
    }

    public function AJAX($d) {
        $ret = $this->GetCarouselManager()->AJAX($d);

        if (empty($ret)) {
            $ret = new stdClass();
            $ret->err = 500;
        }

        return $ret;
    }

    public function Bos_MenuData() {
        if (!$this->IsAdminRole()) {
            return null;
        }
        $lng = $this->module->GetI18n();
        return array(
            array(
                "name" => "carousel",
                "title" => $lng['bosmenu']['carousel'],
                "icon" => "/modules/carousel/img/logo-48x48.png",
                "url" => "carousel/wspace/ws",
                "parent" => "controlPanel"
            )
        );
    }

}

?>