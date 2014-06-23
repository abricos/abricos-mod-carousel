<?php
/**
 * @package Abricos
 * @subpackage Carousel
 * @author Alexander Kuzmin <roosit@abricos.org>
 */


Abricos::GetModule('carousel')->GetManager();

$modManager = CarouselModuleManager::$instance;

if (!$modManager->IsWriteRole()) {
    return;
}
// print_r('ok'); exit;


$modFM = Abricos::GetModule('filemanager');
if (empty($modFM)) {
    return;
}

$brick = Brick::$builder->brick;
$var = & $brick->param->var;

if (Abricos::$adress->dir[2] !== "go") {
    return;
}

$resa = array();

for ($i = 0; $i < 10; $i++) {

    $uploadFile = FileManagerModule::$instance->GetManager()->CreateUploadByVar('image'.$i);

    $uploadFile->maxImageWidth = 1600;
    $uploadFile->maxImageHeight = 1600;
    $uploadFile->ignoreFileSize = true;
    $uploadFile->isOnlyImage = true;
    $uploadFile->outUserProfile = true;
    $error = $uploadFile->Upload();

    if ($i > 0 && $error == UploadError::FILE_NOT_FOUND) {
        continue;
    }

    $res = new stdClass();
    $res->error = $error;
    $res->fname = $uploadFile->fileName;
    $res->fhash = $uploadFile->uploadFileHash;

    array_push($resa, $res);

    if ($error > 0) {
        continue;
    }

    $modManager->GetCarouselManager()->FotoAddToBuffer($res->fhash);
}

$brick->param->var['result'] = json_encode($resa);

?>