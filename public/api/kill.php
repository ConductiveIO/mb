<?php
try {
   if (!isset($_SERVER["HTTP_HOST"])) {
    parse_str($argv[1], $_POST);
  } 
  $client = new MongoClient("mongodb://127.0.0.1:27017");
  $db = $client->mb_data_store;
  $db->configs->update(array('name' => $_POST['name'], 'track' => $_POST['track']), 
    array('$set' => array('running' => false)));
  HttpResponse::status(200);
} catch(Exception $e) {
  HttpResponse::status(500);
  HttpResponse::setData($e->getMessage());
  HttpResponse::send();
}
?>
