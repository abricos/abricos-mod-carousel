<?php

/**
 * @package Abricos
 * @license Licensed under the MIT license
 * @author Alexander Kuzmin <roosit@abricos.org>
 */


require_once 'classes/structure.php';
require_once 'dbquery.php';

/**
 * Class CouruselModuleManager
 */
class CouruselModuleManager extends Ab_ModuleManager {

    /**
     * @var CouruselModuleManager
     */
    public static $instance = null;

    private $_couruselManager = null;

    public function __construct(CouruselModule $module) {
        parent::__construct($module);

        CouruselModuleManager::$instance = $this;
    }

    public function IsAdminRole(){
        return $this->IsRoleEnable(CouruselAction::ADMIN);
    }

    public function IsWriteRole(){
        if ($this->IsAdminRole()){ return true; }
        return $this->IsRoleEnable(CouruselAction::WRITE);
    }

    public function IsViewRole(){
        if ($this->IsWriteRole()){ return true; }
        return $this->IsRoleEnable(CouruselAction::VIEW);
    }

    /**
     * @return CouruselManager
     */
    public function GetCouruselManager(){
        if (empty($this->_couruselManager)){
            require_once 'classes/courusel.php';
            $this->_couruselManager = new CouruselManager($this);
        }
        return $this->_couruselManager;
    }

    public function TreatResult($res){
        $ret = new stdClass();
        $ret->err = 0;

        if (is_integer($res)){
            $ret->err = $res;
        }else if (is_object($res)){
            $ret = $res;
        }
        $ret->err = intval($ret->err);

        return $ret;
    }

    public function AJAX($d){
        switch($d->do){

        }
        $ret = $this->GetCouruselManager()->AJAX($d);

        if (empty($ret)){
            $ret = new stdClass();
            $ret->err = 500;
        }

        return $ret;
    }

}

?>