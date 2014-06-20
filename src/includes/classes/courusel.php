<?php

class CouruselManager {

    /**
     * @var CouruselModuleManager
     */
    public $manager;

    /**
     * @var Ab_Database
     */
    public $db;

    public function __construct(CouruselModuleManager $manager) {
        $this->manager = $manager;
        $this->db = $manager->db;
    }

    public function AJAX($d) {
        switch ($d->do) {
            case "courusellist":
                return $this->CouruselListToAJAX();
            case "couruselsave":
                return $this->CouruselSaveToAJAX($d->savedata);
            case "slidelist":
                return $this->SlideListToAJAX($d->couruselid);
            case "slidesave":
                return $this->SlideSaveToAJAX($d->couruselid, $d->savedata);
        }
        return null;
    }

    public function CouruselSaveToAJAX($sd) {
        $res = $this->CouruselSave($sd);
        $ret = $this->manager->TreatResult($res);

        if ($ret->err === 0) {
            $ret = $this->CouruselListToAJAX($ret);
        }

        return $ret;
    }

    /**
     * Courusel Image Block Save
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
    public function CouruselSave($d) {
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
            $d->id = CouruselQuery::CouruselAppend($this->db, $d);
        } else {
            CouruselQuery::CouruselUpdate($this->db, $d);
        }

        $ret = new stdClass();
        $ret->couruselid = $d->id;

        return $ret;
    }

    public function CouruselListToAJAX($overResult = null) {
        $ret = !empty($overResult) ? $overResult : (new stdClass());
        $ret->err = 0;

        $result = $this->CouruselList();
        $ret->courusels = $result->ToAJAX();

        return $ret;
    }

    /**
     * @return CouruselList|null
     */
    public function CouruselList() {
        if (!$this->manager->IsViewRole()) {
            return null;
        }

        $list = new CouruselList();
        $rows = CouruselQuery::CouruselList($this->db);

        while (($d = $this->db->fetch_array($rows))) {
            $list->Add(new Courusel($d));
        }
        return $list;
    }

    public function Courusel($couruselId) {
        if (!$this->manager->IsViewRole()) {
            return null;
        }

        $row = CouruselQuery::Courusel($this->db, $couruselId);
        if (empty($row)) {
            return null;
        }

        return new Courusel($row);
    }

    public function SlideListToAJAX($couruselId, $overResult = null) {
        $ret = !empty($overResult) ? $overResult : (new stdClass());
        $ret->err = 0;

        $result = $this->SlideList($couruselId);
        if (is_integer($result)) {
            $ret->err = $result;
        } else {
            $ret->slides = $result->ToAJAX();
            $ret->slides->couruselid = $couruselId;
        }

        return $ret;
    }

    public function SlideList($couruselId) {
        if (!$this->manager->IsViewRole()) {
            return 403;
        }

        $list = new CouruselSlideList();
        $rows = CouruselQuery::SlideList($this->db, $couruselId);
        while (($d = $this->db->fetch_array($rows))) {
            $list->Add(new CouruselSlide($d));
        }
        return $list;
    }

    public function SlideSaveToAJAX($couruselId, $sd) {
        $res = $this->SlideSave($couruselId, $sd);
        $ret = $this->manager->TreatResult($res);

        if ($ret->err === 0) {
            $ret = $this->SlideListToAJAX($couruselId, $ret);
        }
        return $ret;
    }

    /**
     * Slide Save
     *
     * Error Code:
     *  403 - Forbidden
     *  1 - courusel not found
     *
     * @param $couruselId
     * @param $d Array|Object
     *
     * @return Object
     */
    public function SlideSave($couruselId, $d) {
        if (!$this->manager->IsWriteRole()) {
            return 403;
        }

        $courusel = $this->Courusel($couruselId);

        if (empty($courusel)) {
            return 1;
        }

        $utmf = Abricos::TextParser(true);

        $d->id = intval($d->id);
        $d->title = $utmf->Parser($d->title);
        $d->url = strval($d->url);
        $d->filehash = strval($d->filehash);
        $d->ord = intval($d->ord);

        if ($d->id === 0) {
            $d->id = CouruselQuery::SlideAppend($this->db, $couruselId, $d);
        } else {
            CouruselQuery::SlideUpdate($this->db, $couruselId, $d);
        }

        $ret = new stdClass();
        $ret->couruselid = $couruselId;
        $ret->slideid = $d->id;

        CouruselQuery::FotoRemoveFromBuffer($this->db, $d->filehash);

        return $ret;
    }

    public function FotoAddToBuffer($fhash) {
        if (!$this->manager->IsWriteRole()) {
            return false;
        }

        CouruselQuery::FotoAddToBuffer($this->db, $fhash);

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

        $rows = CouruselQuery::FotoFreeFromBufferList($this->db);
        while (($row = $this->db->fetch_array($rows))) {
            $fm->FileRemove($row['fh']);
        }
        $fm->RolesEnable();

        CouruselQuery::FotoFreeListClear($this->db);
    }
}

?>