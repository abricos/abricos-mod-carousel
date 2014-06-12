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

}

?>