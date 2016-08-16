<?php

/**
 * @package Abricos
 * @license Licensed under the MIT license
 * @author Alexander Kuzmin <roosit@abricos.org>
 */


/**
 * Class CarouselManager
 */
class CarouselManager extends Ab_ModuleManager {

    public function IsAdminRole(){
        return $this->IsRoleEnable(CarouselAction::ADMIN);
    }

    public function IsWriteRole(){
        if ($this->IsAdminRole()){
            return true;
        }
        return $this->IsRoleEnable(CarouselAction::WRITE);
    }

    public function IsViewRole(){
        if ($this->IsWriteRole()){
            return true;
        }
        return $this->IsRoleEnable(CarouselAction::VIEW);
    }

    private $_app = null;

    /**
     * @return CarouselApp
     */
    public function GetApp(){
        if (!is_null($this->_app)){
            return $this->_app;
        }
        $this->module->ScriptRequireOnce(array(
            'includes/models.php',
            'includes/dbquery.php',
            'includes/app.php'
        ));
        return $this->_app = new CarouselApp($this);
    }

    public function AJAX($d){
        return $this->GetApp()->AJAX($d);
    }

    public function Bos_MenuData(){
        if (!$this->IsAdminRole()){
            return null;
        }
        $i18n = $this->module->I18n();
        return array(
            array(
                "name" => "carousel",
                "title" => $i18n->Translate('bosmenu.carousel'),
                "icon" => "/modules/carousel/img/logo-48x48.png",
                "url" => "carousel/wspace/ws",
                "parent" => "controlPanel"
            )
        );
    }

    public function Bos_SummaryData(){
        if (!$this->IsAdminRole()){
            return;
        }

        $i18n = $this->module->I18n();
        return array(
            array(
                "module" => "carousel",
                "component" => "summary",
                "widget" => "SummaryWidget",
                "title" => $i18n->Translate('bosmenu.carousel'),
            )
        );
    }

}
