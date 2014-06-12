<?php

/**
 * @package Abricos
 * @subpackage Courusel
 * @license MIT license (https://github.com/abricos/abricos-mod-courusel/blob/master/LICENSE)
 * @author Alexander Kuzmin <roosit@abricos.org>
 */
class CouruselModule extends Ab_Module {

    private $_manager = null;

    public function __construct() {

        // Название модуля
        $this->name = "courusel";

        // Версия модуля
        $this->version = "0.1.0";
    }

    /**
     * @return CouruselManager
     */
    public function GetManager(){
        if (empty($this->_manager)){
            require_once 'includes/manager.php';
            $this->_manager = new CouruselManager($this);
        }

        return $this->_manager;
    }
}

class CouruselAction {
    const VIEW = 10;
    const WRITE = 30;
    const ADMIN = 50;
}

class CouruselPermission extends Ab_UserPermission {

    public function CouruselPermission(CouruselModule $module) {
        $defRoles = array(
            new Ab_UserRole(CouruselAction::VIEW, Ab_UserGroup::GUEST),
            new Ab_UserRole(CouruselAction::VIEW, Ab_UserGroup::REGISTERED),
            new Ab_UserRole(CouruselAction::VIEW, Ab_UserGroup::ADMIN),

            new Ab_UserRole(CouruselAction::WRITE, Ab_UserGroup::ADMIN),

            new Ab_UserRole(CouruselAction::ADMIN, Ab_UserGroup::ADMIN),
        );
        parent::__construct($module, $defRoles);
    }

    public function GetRoles() {
        return array(
            CouruselAction::VIEW => $this->CheckAction(CouruselAction::VIEW),
            CouruselAction::WRITE => $this->CheckAction(CouruselAction::WRITE),
            CouruselAction::ADMIN => $this->CheckAction(CouruselAction::ADMIN)
        );
    }
}

Abricos::ModuleRegister(new CouruselModule());

?>