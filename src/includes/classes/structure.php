<?php

class Carousel extends AbricosItem {

    public $name;
    public $width;
    public $height;
    public $off;

    /**
     * Is Use Custom Template for slide items
     * @var bool
     */
    public $isCustomTemplate = false;

    /**
     * Custom Template for slide items
     * @var string
     */
    public $customTemplate = '';

    /**
     * Constructor
     * @param $d
     */
    public function __construct($d){
        parent::__construct($d);

        $this->name = strval($d['name']);
        $this->width = intval($d['width']);
        $this->height = intval($d['height']);
        $this->off = intval($d['off']) === 1;
        $this->isCustomTemplate = intval($d['isCustomTemplate']) === 1;
        $this->customTemplate = strval($d['customTemplate']);
    }

    public function ToAJAX(){
        $ret = parent::ToAJAX();
        $ret->name = $this->name;
        $ret->width = $this->width;
        $ret->height = $this->height;
        $ret->off = $this->off;
        $ret->isCustomTemplate = $this->isCustomTemplate;
        $ret->customTemplate = $this->customTemplate;
        return $ret;
    }
}

class CarouselList extends AbricosList {
}

/**
 * Class CarouselSlide
 */
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

    /**
     * ImageID in FileManager Module
     *
     * @var string
     */
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