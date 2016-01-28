<?php
/**
 * @package Abricos
 * @subpackage Carousel
 * @author Alexander Kuzmin <roosit@abricos.org>
 */


/** @var CarouselManager $modManager */
$modManager = Abricos::GetModule('carousel')->GetManager();

if (!$modManager->IsWriteRole()){
    return;
}

$modFM = Abricos::GetModule('filemanager');
if (empty($modFM)){
    return;
}

$brick = Brick::$builder->brick;
$var = &$brick->param->var;

$dir = Abricos::$adress->dir;

if (!isset($dir[2]) || $dir[2] !== "go"){
    return;
}

$resa = array();

for ($i = 0; $i < 10; $i++){

    $uploadFile = FileManagerModule::$instance->GetManager()->CreateUploadByVar('image'.$i);

    $uploadFile->maxImageWidth = 1600;
    $uploadFile->maxImageHeight = 1600;
    $uploadFile->ignoreFileSize = true;
    $uploadFile->isOnlyImage = true;
    $uploadFile->outUserProfile = true;
    $error = $uploadFile->Upload();

    if ($i > 0 && $error == UploadError::FILE_NOT_FOUND){
        continue;
    }

    $res = new stdClass();
    $res->error = $error;
    $res->fname = $uploadFile->fileName;
    $res->fhash = $uploadFile->uploadFileHash;

    $resa[] = $res;

    if ($error > 0){
        continue;
    }
    $modManager->GetApp()->FotoAddToBuffer($res->fhash);
}

$brick->param->var['result'] = json_encode($resa);

?>