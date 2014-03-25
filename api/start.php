<?php
try {
  if ($_SERVER['DOCUMENT_ROOT']=='') {
  require_once('/var/www/php/stream_consumer.php');
  } else {
  require_once($_SERVER['DOCUMENT_ROOT'] . '/php/stream_consumer.php');
  }
  if (!isset($_SERVER["HTTP_HOST"])) {
    parse_str($argv[1], $_POST);
  }
  $client = new MongoClient("mongodb://127.0.0.1:27017");
  $db = $client->mb_data_store;
  $db->configs->update(array('name' => $_POST['name']), array('$set' => array('running' => true)));
  $stream = new StreamConsumer($_POST['name'], $_POST['track'], Constants::OAUTH_TOKEN, Constants::OAUTH_SECRET, Phirehose::METHOD_FILTER);
  HttpResponse::status(200);
  $client->close();
} catch (Exception $e) {  
  HttpResponse::status(500);
  HttpResponse::setData($e->getMessage());
  HttpResponse::send();
  $client->close();
}
?>

