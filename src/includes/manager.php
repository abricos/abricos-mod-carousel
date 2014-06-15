<?php

class CouruselManager extends Ab_ModuleManager {

    /**
     * @var CouruselManager
     */
    public static $instance = null;

    public function __construct(CouruselModule $module) {
        parent::__construct($module);

        CouruselManager::$instance = $this;
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

    public function AJAX($d){
        return null;
    }

}

?>