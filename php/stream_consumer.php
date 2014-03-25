<?php
require_once('Phirehose.php');
require_once('OauthPhirehose.php');
require_once('constants.php');
require_once('vendor/autoload.php');

use PhpAmqpLib\Connection\AMQPConnection;
use PhpAmqpLib\Message\AMQPMessage;

class StreamConsumer extends OauthPhireHose
{
  private $instance;
  private $client;
  private $db;
  private $col;
  private $name;
  private $track;
 
  public function __construct($name, $track, $username, $password, $method = Phirehose::METHOD_SAMPLE)
  {
    define('TWITTER_CONSUMER_KEY', Constants::TWITTER_CONSUMER_KEY);
    define('TWITTER_CONSUMER_SECRET', Constants::TWITTER_CONSUMER_SECRET);  
    parent::__construct($username, $password, $method);
    // Setup DB
    $this->client = new MongoClient("mongodb://127.0.0.1:27017");
    $this->db = $this->client->mb_data_store;
    $this->db->createCollection("queue", true, 1024 * 1024); 
    $this->col = $this->db->queue;
    self::setTrack(array($track));
  }

  // Send tweet to db
  public function enqueueStatus($status)
  {
    $data = json_decode($status, true);
    $this->col->insert($data);
    //echo "<p>" . $data['user']['screen_name'] . ' says ' . urldecode($data['text']) . "</p>";
  
  }

  public function checkFilterPredicates()
  {
    $keep_alive = $this->db->configs->find(array("name" => $this->name), array("running" => 1, "_id" => 0));
    if (!$keep_alive)
    {
      self::disconnect();
    }
  }
}


