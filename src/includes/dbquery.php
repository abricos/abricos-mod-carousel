<?php

/**
 * @package Abricos
 * @license Licensed under the MIT license
 * @author Alexander Kuzmin <roosit@abricos.org>
 */
class CarouselQuery {

    const FILECLEARTIME = 86400;

    public static function Carousel(Ab_Database $db, $carouselid){
        $sql = "
            SELECT carouselid as id, c.*
            FROM ".$db->prefix."carousel c
            WHERE c.carouselid=".bkint($carouselid)."
            LIMIT 1
        ";
        return $db->query_first($sql);
    }

    public static function CarouselByName(Ab_Database $db, $name){
        $sql = "
            SELECT carouselid as id, c.*
            FROM ".$db->prefix."carousel c
            WHERE c.name='".bkstr($name)."'
            LIMIT 1
        ";
        return $db->query_first($sql);
    }

    public static function CarouselList(Ab_Database $db){
        $sql = "
            SELECT c.*
            FROM ".$db->prefix."carousel c
            WHERE c.deldate=0
        ";
        return $db->query_read($sql);
    }

    public static function CarouselAppend(Ab_Database $db, Carousel $carousel){
        $sql = "
            INSERT INTO ".$db->prefix."carousel
            (name, width, height, isCustomTemplate, customTemplate, dateline) VALUES (
                '".bkstr($carousel->name)."',
                ".bkint($carousel->width).",
                ".bkint($carousel->height).",
                ".bkint($carousel->isCustomTemplate).",
                '".bkstr($carousel->customTemplate)."',
                ".TIMENOW."
            )
        ";
        $db->query_write($sql);
        return $db->insert_id();
    }

    public static function CarouselUpdate(Ab_Database $db, Carousel $carousel){
        $sql = "
            UPDATE ".$db->prefix."carousel
            SET name='".bkstr($carousel->name)."',
                width=".bkint($carousel->width).",
                height=".bkint($carousel->height).",
                isCustomTemplate=".bkint($carousel->isCustomTemplate).",
                customTemplate='".bkstr($carousel->customTemplate)."'
            WHERE carouselid=".bkint($carousel->id)."
            LIMIT 1
        ";
        $db->query_write($sql);
    }

    public static function CarouselDisable(Ab_Database $db, $carouselid){
        $sql = "
            UPDATE ".$db->prefix."carousel
            SET off=".bkint(1)."
            WHERE carouselid=".bkint($carouselid)."
            LIMIT 1
        ";
        $db->query_write($sql);
    }

    public static function CarouselEnable(Ab_Database $db, $carouselid){
        $sql = "
            UPDATE ".$db->prefix."carousel
            SET off=".bkint(0)."
            WHERE carouselid=".bkint($carouselid)."
            LIMIT 1
        ";
        $db->query_write($sql);
    }

    public static function CarouselDelete(Ab_Database $db, $carouselid){
        $sql = "
            UPDATE ".$db->prefix."carousel
            SET deldate=".TIMENOW."
            WHERE carouselid=".bkint($carouselid)."
            LIMIT 1
        ";
        $db->query_write($sql);
    }

    public static function SlideList(Ab_Database $db, $carouselid){
        $sql = "
            SELECT
                slideid as id,
                title, url, ord, code, filehash
            FROM ".$db->prefix."carousel_slide
            WHERE carouselid=".bkint($carouselid)."
            ORDER BY ord DESC
        ";
        return $db->query_read($sql);
    }

    public static function SlideAppend(Ab_Database $db, $carouselid, $d){
        $sql = "
            INSERT INTO ".$db->prefix."carousel_slide
            (carouselid, title, url, filehash, code, ord) VALUES (
                ".bkint($carouselid).",
                '".bkstr($d->title)."',
                '".bkstr($d->url)."',
                '".bkstr($d->filehash)."',
                '".bkstr($d->code)."',
                ".bkint($d->ord)."
            )
        ";
        $db->query_write($sql);
        return $db->insert_id();
    }

    public static function SlideUpdate(Ab_Database $db, $carouselid, $d){
        $sql = "
            UPDATE ".$db->prefix."carousel_slide
            SET title='".bkstr($d->title)."',
                url='".bkstr($d->url)."',
                filehash='".bkstr($d->filehash)."',
                code='".bkstr($d->code)."',
                ord=".bkint($d->ord)."
            WHERE carouselid=".bkint($carouselid)." AND slideid=".bkint($d->id)."
        ";
        $db->query_write($sql);
    }

    public static function SlideDelete(Ab_Database $db, $carouselid, $slideid){
        $sql = "
            DELETE FROM ".$db->prefix."carousel_slide
            WHERE carouselid=".bkint($carouselid)." AND  slideid=".bkint($slideid)."
            LIMIT 1
        ";

        $db->query_write($sql);
    }


    public static function FotoAddToBuffer(Ab_Database $db, $fhash){
        $sql = "
			INSERT INTO ".$db->prefix."carousel_foto (fileid, dateline) VALUES (
				'".bkstr($fhash)."',
				".TIMENOW."
			)
		";
        $db->query_write($sql);
    }

    public static function FotoFreeFromBufferList(Ab_Database $db){
        $sql = "
			SELECT
				fotoid as id,
				fileid as fh
			FROM ".$db->prefix."carousel_foto
			WHERE slideid=0 AND dateline<".(TIMENOW - CarouselQuery::FILECLEARTIME)."
		";
        return $db->query_read($sql);
    }

    public static function FotoFreeListClear(Ab_Database $db){
        $sql = "
			DELETE FROM ".$db->prefix."carousel_foto
			WHERE slideid=0 AND dateline<".(TIMENOW - CarouselQuery::FILECLEARTIME)."
		";
        return $db->query_read($sql);
    }

    public static function FotoRemoveFromBuffer(Ab_Database $db, $foto){
        $sql = "
			DELETE FROM ".$db->prefix."carousel_foto WHERE fileid='".$foto."'
		";
        $db->query_write($sql);
    }
}
