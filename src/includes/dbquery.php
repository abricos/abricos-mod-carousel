<?php

/**
 * @package Abricos
 * @license Licensed under the MIT license
 * @author Alexander Kuzmin <roosit@abricos.org>
 */
class CouruselQuery {

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

    public static function CouruselAppend(Ab_Database $db, $d){
        $sql = "
            INSERT INTO ".$db->prefix."courusel
            (name, width, height, dateline) VALUES (
                '".bkstr($d->name)."',
                ".bkstr($d->width).",
                ".bkstr($d->height).",
                ".TIMENOW."
            )
        ";
        $db->query_write($sql);
        return $db->insert_id();
    }

    public static function CouruselUpdate(Ab_Database $db, $d){
        $sql = "
            UPDATE ".$db->prefix."courusel
            SET name='".bkstr($d->name)."',
                width=".bkstr($d->width).",
                height=".bkstr($d->height)."
            WHERE couruselid=".bkint($d->id)."
            LIMIT 1
        ";
        $db->query_write($sql);
    }

}

?>