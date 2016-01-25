<?php

/** CarouselManager $manager */
class CarouselApp extends AbricosApplication {

    protected function GetClasses(){
        return array(
            'Carousel' => 'Carousel',
            'CarouselList' => 'CarouselList',
            'Slide' => 'CarouselSlide',
            'SlideList' => 'CarouselSlideList'
        );
    }

    protected function GetStructures(){
        return 'Carousel,Slide';
    }

    public function ResponseToJSON($d){
        switch ($d->do){
            case "carouselList":
                return $this->CarouselListToJSON();
            case "carouselSave":
                return $this->CarouselSaveToJSON($d->savedata);
            case "carouselDisable":
                return $this->CarouselDisableToJSON($d->carouselid);
            case "carouselEnable":
                return $this->CarouselEnableToJSON($d->carouselid);
            case "carouselDelete":
                return $this->CarouselDeleteToJSON($d->carouselid);
            case "slideList":
                return $this->SlideListToJSON($d->carouselid);
            case "slideSave":
                return $this->SlideSaveToJSON($d->carouselid, $d->savedata);
            case "slideDelete":
                return $this->SlideDeleteToJSON($d->carouselid, $d->slideid);
        }
        return null;
    }

    public function CarouselListToJSON(){
        $ret = $this->CarouselList();
        return $this->ResultToJSON('carouselList', $ret);
    }

    public function CarouselList(){
        if (!$this->manager->IsViewRole()){
            return AbricosResponse::ERR_FORBIDDEN;
        }

        $list = $this->InstanceClass('CarouselList');
        $rows = CarouselQuery::CarouselList($this->db);

        while (($d = $this->db->fetch_array($rows))){
            $list->Add($this->InstanceClass('Carousel', $d));
        }
        return $list;
    }

    public function CarouselSaveToJSON($sd){
        $res = $this->CarouselSave($sd);
        $ret = $this->ResultToJSON('carouselSave', $res);
        if (AbricosResponse::IsError($res)){
            return $ret;
        }
        return $this->ImplodeJSON(array(
            $this->CarouselListToJSON()
        ), $ret);
    }

    public function CarouselSave($d){
        if (!$this->manager->IsAdminRole()){
            return AbricosResponse::ERR_FORBIDDEN;
        }

        $utmf = Abricos::TextParser(true);

        /** @var Carousel $carousel */
        $carousel = $this->InstanceClass('Carousel', $d);
        $carousel->name = $utmf->Parser($carousel->name);

        if (empty($carousel->name)){
            return AbricosResponse::ERR_BAD_REQUEST;
        }

        //TODO: Check duplicates

        if ($carousel->id === 0){
            $carousel->id = CarouselQuery::CarouselAppend($this->db, $carousel);
        } else {
            CarouselQuery::CarouselUpdate($this->db, $carousel);
        }

        $ret = new stdClass();
        $ret->carouselid = $carousel->id;

        return $ret;
    }

    public function CarouselDisableToJSON($carouselid){
        $res = $this->CarouselDisable($carouselid);
        return $this->ImplodeJSON(
            $this->ResultToJSON('carouselDisable', $res),
            $this->CarouselListToJSON()
        );
    }

    public function CarouselDisable($carouselid){
        if (!$this->manager->IsAdminRole()){
            return AbricosResponse::ERR_FORBIDDEN;
        }
        CarouselQuery::CarouselDisable($this->db, $carouselid);

        $ret = new stdClass();
        $ret->carouselid = $carouselid;

        return $ret;
    }

    public function CarouselEnableToJSON($carouselid){
        $res = $this->CarouselEnable($carouselid);
        return $this->ImplodeJSON(
            $this->ResultToJSON('carouselEnable', $res),
            $this->CarouselListToJSON()
        );
    }

    public function CarouselEnable($carouselid){
        if (!$this->manager->IsAdminRole()){
            return AbricosResponse::ERR_FORBIDDEN;
        }
        CarouselQuery::CarouselEnable($this->db, $carouselid);

        $ret = new stdClass();
        $ret->carouselid = $carouselid;
        return $ret;
    }

    public function CarouselDeleteToJSON($carouselid){
        $res = $this->CarouselDelete($carouselid);
        return $this->ImplodeJSON(
            $this->ResultToJSON('carouselDelete', $res),
            $this->CarouselListToJSON()
        );
    }

    public function CarouselDelete($carouselid){
        if (!$this->manager->IsAdminRole()){
            return AbricosResponse::ERR_FORBIDDEN;
        }
        CarouselQuery::CarouselDelete($this->db, $carouselid);

        $ret = new stdClass();
        $ret->carouselid = $carouselid;

        return $ret;
    }

    /**
     * @param $carouselid
     * @return Carousel
     */
    public function Carousel($carouselid){
        if (!$this->manager->IsViewRole()){
            return null;
        }

        $row = CarouselQuery::Carousel($this->db, $carouselid);
        if (empty($row)){
            return null;
        }

        return $this->InstanceClass('Carousel', $row);
    }

    /**
     * @param $name
     * @return Carousel
     */
    public function CarouselByName($name){
        if (!$this->manager->IsViewRole()){
            return null;
        }

        $row = CarouselQuery::CarouselByName($this->db, $name);
        if (empty($row)){
            return null;
        }

        return $this->InstanceClass('Carousel', $row);
    }

    public function SlideListToJSON($carouselid){
        $ret = $this->SlideList($carouselid);
        return $this->ResultToJSON('slideList', $ret);
    }

    public function SlideList($carouselid){
        if (!$this->manager->IsViewRole()){
            return AbricosResponse::ERR_FORBIDDEN;
        }

        $list = $this->InstanceClass('SlideList');
        $rows = CarouselQuery::SlideList($this->db, $carouselid);
        while (($d = $this->db->fetch_array($rows))){
            $list->Add($this->InstanceClass('Slide', $d));
        }
        return $list;
    }

    public function SlideSaveToJSON($carouselid, $sd){
        $res = $this->SlideSave($carouselid, $sd);
        $ret = $this->ResultToJSON('slideSave', $res);
        if (AbricosResponse::IsError($res)){
            return $ret;
        }
        return $this->ImplodeJSON(
            $this->SlideListToJSON($carouselid), $ret
        );
    }

    public function SlideSave($carouselid, $d){
        if (!$this->manager->IsWriteRole()){
            return AbricosResponse::ERR_FORBIDDEN;
        }

        $carousel = $this->Carousel($carouselid);

        if (empty($carousel)){
            return AbricosResponse::ERR_BAD_REQUEST;
        }

        $utmf = Abricos::TextParser(true);

        $d->id = intval($d->id);
        $d->title = $utmf->Parser($d->title);
        $d->url = strval($d->url);
        $d->filehash = strval($d->filehash);
        $d->ord = intval($d->ord);

        if ($d->id === 0){
            $d->id = CarouselQuery::SlideAppend($this->db, $carouselid, $d);
        } else {
            CarouselQuery::SlideUpdate($this->db, $carouselid, $d);
        }

        $ret = new stdClass();
        $ret->carouselid = $carouselid;
        $ret->slideid = $d->id;

        CarouselQuery::FotoRemoveFromBuffer($this->db, $d->filehash);

        return $ret;
    }

    public function SlideDeleteToJSON($carouselid, $slideId){
        $res = $this->SlideDelete($carouselid, $slideId);
        $ret = $this->manager->TreatResult($res);

        if ($ret->err === 0){
            $ret = $this->SlideListToJSON($carouselid, $ret);
        }
        return $ret;
    }

    public function SlideDelete($carouselid, $slideId){
        if (!$this->manager->IsWriteRole()){
            return AbricosResponse::ERR_FORBIDDEN;
        }

        CarouselQuery::SlideDelete($this->db, $carouselid, $slideId);

        $ret = new stdClass();
        $ret->carouselid = $carouselid;
        $ret->slideid = $slideId;

        return $ret;
    }

    public function FotoAddToBuffer($fhash){
        if (!$this->manager->IsWriteRole()){
            return false;
        }

        CarouselQuery::FotoAddToBuffer($this->db, $fhash);

        $this->FotoBufferClear();
    }

    public function FotoBufferClear(){
        $mod = Abricos::GetModule('filemanager');
        if (empty($mod)){
            return;
        }
        $mod->GetManager();
        $fm = FileManager::$instance;
        $fm->RolesDisable();

        $rows = CarouselQuery::FotoFreeFromBufferList($this->db);
        while (($row = $this->db->fetch_array($rows))){
            $fm->FileRemove($row['fh']);
        }
        $fm->RolesEnable();

        CarouselQuery::FotoFreeListClear($this->db);
    }
}

?>