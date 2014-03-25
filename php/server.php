<?php
require_once('OauthPhirehose.php');
require_once('constants.php');
class Server
{
  public static function initialize_db($name, $track)
  {
    $this->_client = new MongoClient("mongodb://127.0.0.1:27017");
    $collection = $db->configs;
    $insert = array(
      'event' => $name,
      'track' => $track,
      'running' => false
      );
    $collection->insert($insert);
  }

  public static function start($name, $track)
  {
    //TODO check if exists
    $stream = new StreamConsumer($name, $track, Constants::OAUTH_TOKEN, Constants::OAUTH_SECRET, Phirehose::METHOD_FILTER);
  }

  private static function kill()
  {
    if(!isset($this->_client))
    {
      $this->_client = new MongoClient();
    }
    $this->_stream->disconnect();
    $this->client->mb_data_store.update(array('name' => $this->_name), array('running' => false)); 
  }
}
?>


