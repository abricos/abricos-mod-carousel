<?php

class Carousel extends AbricosItem {

    public $name;
    public $width;
    public $height;
    public $off;

    public function __construct($d){
        parent::__construct($d);

        $this->name = strval($d['name']);
        $this->width = intval($d['width']);
        $this->height = intval($d['height']);
        $this->off = intval($d['off']) === 1;
    }

    public function ToAJAX(){
        $ret = parent::ToAJAX();
        $ret->name = $this->name;
        $ret->width = $this->width;
        $ret->height = $this->height;
        $ret->off = $this->off;
        return $ret;
    }
}

class CarouselList extends AbricosList {
}

class CarouselSlide extends AbricosItem {
    public $title;
    public $url;
    public $ord;

    /**
     * HTML Code
     *
     * @var string
     */
    public $code;
    public $filehash;

    public function __construct($d){
        parent::__construct($d);

        $this->title = strval($d['title']);
        $this->url = strval($d['url']);
        $this->code = strval($d['code']);
        $this->filehash = strval($d['filehash']);
        $this->ord = intval($d['ord']);
    }

    public function ToAJAX(){
        $ret = parent::ToAJAX();
        $ret->title = $this->title;
        $ret->url = $this->url;
        $ret->ord = $this->ord;
        $ret->code = $this->code;
        $ret->filehash = $this->filehash;
        return $ret;
    }
}

class CarouselSlideList extends AbricosList {
    /**
     * @param int $index
     * @return CarouselSlide
     */
    public function GetByIndex($index){
        return parent::GetByIndex($index);
    }
}

?>