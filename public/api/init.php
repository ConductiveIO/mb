<?php
try {
  $client = new MongoClient("mongodb://127.0.0.1:27017");
  $db = $client->mb_data_store;
  $collection = $db->configs;
  $insert = array(
    'name' => $_POST['name'],
    'track' => $_POST['track'],
    'running' => false
  );
  $collection->insert($insert);
  $client->close();
  HttpResponse::status(200);
} catch (Exception $e) {
  HttpResponse::status(500);
  HttpResponse::setData($e->getMessage());
  HttpResponse::send();
  $client->close();
}
?>
