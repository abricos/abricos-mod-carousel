<?php

/**
 * @package Abricos
 * @license Licensed under the MIT license
 * @author Alexander Kuzmin <roosit@abricos.org>
 */
class CarouselQuery {

    const FILECLEARTIME = 86400;

    public static function Carousel(Ab_Database $db, $carouselId) {
        $sql = "
            SELECT
                carouselid as id,
                name,
                width,
                height
            FROM ".$db->prefix."carousel
            WHERE carouselid=".bkint($carouselId)."
            LIMIT 1
        ";
        return $db->query_first($sql);
    }

    public static function CarouselList(Ab_Database $db) {
        $sql = "
            SELECT
                carouselid as id,
                name,
                width,
                height
            FROM ".$db->prefix."carousel
        ";
        return $db->query_read($sql);
    }

    public static function CarouselAppend(Ab_Database $db, $d) {
        $sql = "
            INSERT INTO ".$db->prefix."carousel
            (name, width, height, dateline) VALUES (
                '".bkstr($d->name)."',
                ".bkint($d->width).",
                ".bkint($d->height).",
                ".TIMENOW."
            )
        ";
        $db->query_write($sql);
        return $db->insert_id();
    }

    public static function CarouselUpdate(Ab_Database $db, $d) {
        $sql = "
            UPDATE ".$db->prefix."carousel
            SET name='".bkstr($d->name)."',
                width=".bkint($d->width).",
                height=".bkint($d->height)."
            WHERE carouselid=".bkint($d->id)."
            LIMIT 1
        ";
        $db->query_write($sql);
    }

    public static function SlideList(Ab_Database $db, $carouselId) {
        $sql = "
            SELECT
                slideid as id,
                title, url, ord, filehash
            FROM ".$db->prefix."carousel_slide
            WHERE carouselid=".bkint($carouselId)."
            ORDER BY ord DESC
        ";
        return $db->query_read($sql);
    }

    public static function SlideAppend(Ab_Database $db, $carouselId, $d) {
        $sql = "
            INSERT INTO ".$db->prefix."carousel_slide
            (carouselid, title, url, filehash, ord) VALUES (
                ".bkint($carouselId).",
                '".bkstr($d->title)."',
                '".bkstr($d->url)."',
                '".bkstr($d->filehash)."',
                ".bkint($d->ord)."
            )
        ";
        $db->query_write($sql);
        return $db->insert_id();
    }

    public static function SlideUpdate(Ab_Database $db, $carouselId, $d) {
        $sql = "
            UPDATE ".$db->prefix."carousel_slide
            SET title='".bkstr($d->title)."',
                url='".bkstr($d->url)."',
                filehash='".bkstr($d->filehash)."',
                ord=".bkint($d->ord)."
            WHERE carouselid=".bkint($carouselId)." AND slideid=".bkint($d->id)."
        ";
        $db->query_write($sql);
    }

    public static function FotoAddToBuffer(Ab_Database $db, $fhash) {
        $sql = "
			INSERT INTO ".$db->prefix."carousel_foto (fileid, dateline) VALUES (
				'".bkstr($fhash)."',
				".TIMENOW."
			)
		";
        $db->query_write($sql);
    }

    public static function FotoFreeFromBufferList(Ab_Database $db) {
        $sql = "
			SELECT
				fotoid as id,
				fileid as fh
			FROM ".$db->prefix."carousel_foto
			WHERE slideid=0 AND dateline<".(TIMENOW - CarouselQuery::FILECLEARTIME)."
		";
        return $db->query_read($sql);
    }

    public static function FotoFreeListClear(Ab_Database $db) {
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

?>