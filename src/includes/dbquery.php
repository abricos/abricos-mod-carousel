<?php

/**
 * @package Abricos
 * @license Licensed under the MIT license
 * @author Alexander Kuzmin <roosit@abricos.org>
 */
class CouruselQuery {

    public static function Courusel(Ab_Database $db, $couruselId) {
        $sql = "
            SELECT
                couruselid as id,
                name,
                width,
                height
            FROM ".$db->prefix."courusel
            WHERE couruselid=".bkint($couruselId)."
            LIMIT 1
        ";
        return $db->query_first($sql);
    }

    public static function CouruselList(Ab_Database $db) {
        $sql = "
            SELECT
                couruselid as id,
                name,
                width,
                height
            FROM ".$db->prefix."courusel
        ";
        return $db->query_read($sql);
    }

    public static function CouruselAppend(Ab_Database $db, $d) {
        $sql = "
            INSERT INTO ".$db->prefix."courusel
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

    public static function CouruselUpdate(Ab_Database $db, $d) {
        $sql = "
            UPDATE ".$db->prefix."courusel
            SET name='".bkstr($d->name)."',
                width=".bkint($d->width).",
                height=".bkint($d->height)."
            WHERE couruselid=".bkint($d->id)."
            LIMIT 1
        ";
        $db->query_write($sql);
    }

    public static function SlideList(Ab_Database $db, $couruselId) {
        $sql = "
            SELECT
                slideid as id,
                title, url, ord, filehash
            FROM ".$db->prefix."courusel_slide
            WHERE couruselid=".bkint($couruselId)."
        ";
        return $db->query_read($sql);
    }

    public static function SlideAppend(Ab_Database $db, $couruselId, $d) {
        $sql = "
            INSERT INTO ".$db->prefix."courusel_slide
            (couruselid, title, url, filehash, ord) VALUES (
                ".bkint($couruselId).",
                '".bkstr($d->title)."',
                '".bkstr($d->url)."',
                '".bkstr($d->filehash)."',
                ".bkint($d->ord)."
            )
        ";
        $db->query_write($sql);
        return $db->insert_id();
    }

    public static function SlideUpdate(Ab_Database $db, $couruselId, $d) {
        $sql = "
            UPDATE ".$db->prefix."courusel_slide
            SET title='".bkstr($d->title)."',
                url='".bkstr($d->url)."',
                filehash='".bkstr($d->filehash)."',
                ord=".bkint($d->ord)."
            WHERE couruselid=".bkint($couruselId)." AND slideid=".bkint($d->id)."
        ";
        $db->query_write($sql);
    }

}

?>