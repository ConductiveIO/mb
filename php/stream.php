<?php
try {
  $_POST['name'] = 'taco';
  $_POST['track'] = '#tacko';
  require_once('stream_consumer.php');
  require_once('constants.php');
  $stream = new StreamConsumer($_POST['name'], $_POST['track'], Constants::OAUTH_TOKEN, Constants::OAUTH_SECRET, Phirehose::METHOD_FILTER);
  http_response_code(200);
} catch (Exception $e) {
  http_response_code(500);
}
