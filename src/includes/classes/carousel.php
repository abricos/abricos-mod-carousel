<?php

class CarouselManager {

    /**
     * @var CarouselModuleManager
     */
    public $manager;

    /**
     * @var Ab_Database
     */
    public $db;

    public function __construct(CarouselModuleManager $manager) {
        $this->manager = $manager;
        $this->db = $manager->db;
    }

    public function AJAX($d) {
        switch ($d->do) {
            case "carousellist":
                return $this->CarouselListToAJAX();
            case "carouselsave":
                return $this->CarouselSaveToAJAX($d->savedata);
            case "slidelist":
                return $this->SlideListToAJAX($d->carouselid);
            case "slidesave":
                return $this->SlideSaveToAJAX($d->carouselid, $d->savedata);
        }
        return null;
    }

    public function CarouselSaveToAJAX($sd) {
        $res = $this->CarouselSave($sd);
        $ret = $this->manager->TreatResult($res);

        if ($ret->err === 0) {
            $ret = $this->CarouselListToAJAX($ret);
        }

        return $ret;
    }

    /**
     * Carousel Image Block Save
     *
     * Error Code:
     *  403 - Forbidden
     *  1   - Name is empty
     *  2   - Name is exists
     *
     * @param Array|Object $d
     *
     * @return Object
     */
    public function CarouselSave($d) {
        if (!$this->manager->IsAdminRole()) {
            return 403;
        }

        $utmf = Abricos::TextParser(true);

        $d->id = intval($d->id);
        $d->name = $utmf->Parser($d->name);
        $d->width = intval($d->width);
        $d->height = intval($d->height);

        if (empty($d->name)) {
            return 1;
        }

        //TODO: Check duplicates

        if ($d->id === 0) {
            $d->id = CarouselQuery::CarouselAppend($this->db, $d);
        } else {
            CarouselQuery::CarouselUpdate($this->db, $d);
        }

        $ret = new stdClass();
        $ret->carouselid = $d->id;

        return $ret;
    }

    public function CarouselListToAJAX($overResult = null) {
        $ret = !empty($overResult) ? $overResult : (new stdClass());
        $ret->err = 0;

        $result = $this->CarouselList();
        $ret->carousels = $result->ToAJAX();

        return $ret;
    }

    /**
     * @return CarouselList|null
     */
    public function CarouselList() {
        if (!$this->manager->IsViewRole()) {
            return null;
        }

        $list = new CarouselList();
        $rows = CarouselQuery::CarouselList($this->db);

        while (($d = $this->db->fetch_array($rows))) {
            $list->Add(new Carousel($d));
        }
        return $list;
    }

    public function Carousel($carouselId) {
        if (!$this->manager->IsViewRole()) {
            return null;
        }

        $row = CarouselQuery::Carousel($this->db, $carouselId);
        if (empty($row)) {
            return null;
        }

        return new Carousel($row);
    }

    public function SlideListToAJAX($carouselId, $overResult = null) {
        $ret = !empty($overResult) ? $overResult : (new stdClass());
        $ret->err = 0;

        $result = $this->SlideList($carouselId);
        if (is_integer($result)) {
            $ret->err = $result;
        } else {
            $ret->slides = $result->ToAJAX();
            $ret->slides->carouselid = $carouselId;
        }

        return $ret;
    }

    public function SlideList($carouselId) {
        if (!$this->manager->IsViewRole()) {
            return 403;
        }

        $list = new CarouselSlideList();
        $rows = CarouselQuery::SlideList($this->db, $carouselId);
        while (($d = $this->db->fetch_array($rows))) {
            $list->Add(new CarouselSlide($d));
        }
        return $list;
    }

    public function SlideSaveToAJAX($carouselId, $sd) {
        $res = $this->SlideSave($carouselId, $sd);
        $ret = $this->manager->TreatResult($res);

        if ($ret->err === 0) {
            $ret = $this->SlideListToAJAX($carouselId, $ret);
        }
        return $ret;
    }

    /**
     * Slide Save
     *
     * Error Code:
     *  403 - Forbidden
     *  1 - carousel not found
     *
     * @param $carouselId
     * @param $d Array|Object
     *
     * @return Object
     */
    public function SlideSave($carouselId, $d) {
        if (!$this->manager->IsWriteRole()) {
            return 403;
        }

        $carousel = $this->Carousel($carouselId);

        if (empty($carousel)) {
            return 1;
        }

        $utmf = Abricos::TextParser(true);

        $d->id = intval($d->id);
        $d->title = $utmf->Parser($d->title);
        $d->url = strval($d->url);
        $d->filehash = strval($d->filehash);
        $d->ord = intval($d->ord);

        if ($d->id === 0) {
            $d->id = CarouselQuery::SlideAppend($this->db, $carouselId, $d);
        } else {
            CarouselQuery::SlideUpdate($this->db, $carouselId, $d);
        }

        $ret = new stdClass();
        $ret->carouselid = $carouselId;
        $ret->slideid = $d->id;

        CarouselQuery::FotoRemoveFromBuffer($this->db, $d->filehash);

        return $ret;
    }

    public function FotoAddToBuffer($fhash) {
        if (!$this->manager->IsWriteRole()) {
            return false;
        }

        CarouselQuery::FotoAddToBuffer($this->db, $fhash);

        $this->FotoBufferClear();
    }

    public function FotoBufferClear() {
        $mod = Abricos::GetModule('filemanager');
        if (empty($mod)) {
            return;
        }
        $mod->GetManager();
        $fm = FileManager::$instance;
        $fm->RolesDisable();

        $rows = CarouselQuery::FotoFreeFromBufferList($this->db);
        while (($row = $this->db->fetch_array($rows))) {
            $fm->FileRemove($row['fh']);
        }
        $fm->RolesEnable();

        CarouselQuery::FotoFreeListClear($this->db);
    }
}

?>