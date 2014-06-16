<?php

class Courusel extends AbricosItem {

    public $name;
    public $width;
    public $height;

    public function __construct($d) {
        parent::__construct($d);

        $this->name = strval($d['name']);
        $this->width = intval($d['width']);
        $this->height = intval($d['height']);
    }

    public function ToAJAX() {
        $ret = parent::ToAJAX();
        $ret->name = $this->name;
        $ret->width = $this->width;
        $ret->height = $this->height;
        return $ret;
    }
}

class CouruselList extends AbricosList {
}

?>