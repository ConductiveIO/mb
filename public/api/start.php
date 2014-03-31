<?php
try {
  if ($_SERVER['DOCUMENT_ROOT']=='') {
  require_once('/Users/captainrobby37/CODE_PIG/metterboard/php/stream_consumer.php');
  require_once('/Users/captainrobby37/CODE_PIG/metterboard/php/constants.php');
  } else {
  require_once($_SERVER['DOCUMENT_ROOT'] . 'node/mb/php/stream_consumer.php');
  require_once($_SERVER['DOCUMENT_ROOT'] . 'node/mb/php/constants.php');
  }
  if (!isset($_SERVER["HTTP_HOST"])) {
    parse_str($argv[1], $_POST);
  }
  if(!$client) {
    $client = new MongoClient("mongodb://127.0.0.1:27017");
  }
  $db = $client->mb_data_store;
  $db->configs->update(array('name' => $_POST['name']), array('$set' => array('running' => true)));
  $client->close();
  $stream = new StreamConsumer($_POST['name'], $_POST['track'], Constants::OAUTH_TOKEN, Constants::OAUTH_SECRET, Phirehose::METHOD_FILTER);
  
  echo "1: " . $_POST['name'] . " 2: " .  $_POST['track'] . " 3: " . Constants::OAUTH_TOKEN . " 4: " . Constants::OAUTH_SECRET . " 5: " . Phirehose::METHOD_FILTER;
  HttpResponse::status(200);
} catch (Exception $e) {  
  HttpResponse::status(500);
  HttpResponse::setData($e->getMessage());
  HttpResponse::send();
  if ($client) {
    $client->close();
  }
}
?>

