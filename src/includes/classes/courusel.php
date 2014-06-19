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
        if (is_integer($result)) {
            $ret->err = $result;
        } else {
            $ret->courusels = $result->ToAJAX();
        }

        return $ret;
    }

    /**
     * @return CouruselList|null
     */
    public function CouruselList() {
        if (!$this->manager->IsViewRole()) {
            return 403;
        }

        $list = new CouruselList();
        $rows = CouruselQuery::CouruselList($this->db);

        while (($d = $this->db->fetch_array($rows))) {
            $list->Add(new Courusel($d));
        }
        return $list;
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
}

?>