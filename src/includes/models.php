<?php

/**
 * Class Carousel
 *
 * @property string $name
 * @property int $width
 * @property int $height
 * @property boolean $off
 * @property boolean $isCustomTemplate
 * @property string $customTemplate
 *
 */
class Carousel extends AbricosModel {
    protected $_structModule = 'carousel';
    protected $_structName = 'Carousel';
}

/**
 * Class CarouselList
 *
 * @method Carousel Get($id)
 * @method Carousel GetByIndex($index)
 */
class CarouselList extends AbricosModelList {
}

/**
 * Class CarouselSlide
 *
 * @property string $title
 * @property string $url
 * @property int $ord
 * @property string $code
 * @property string $filehash
 */
class CarouselSlide extends AbricosModel {
    protected $_structModule = 'carousel';
    protected $_structName = 'Slide';
}

/**
 * Class CarouselSlideList
 *
 * @method CarouselSlide Get($id)
 * @method CarouselSlide GetByIndex($index)
 */
class CarouselSlideList extends AbricosModelList {
}
