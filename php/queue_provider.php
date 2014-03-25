<?php
require_once '/vendor/autoload.php';
use PhpAmqpLib\Connection\AMQPConnection;

class QueueProvider
{
  private $rabbit_connection;  
  private $rabbit_channel;
  private $client;
  private $db;
  private $col;
  private $index;

  public function __construct()
  {
    $rabbit_connection = new AMQPConnection('localhost', 5672, 'guest', 'guest');
    $rabbit_channel = $rabbit_connection->channel();

    $rabbit_channel->queue_declare('status_queue', false, false, false, false);
    echo ' [*] Waiting for messages. To exit press CTRL+C', "\n";
    $this->client = new MongoClient();
    $this->db = $this->client->status_store;
    $this->col = $this->db->queue;
  }

  $callback =  function($msg)
  {
    echo " [x] Received ", $msg->body, "\n";
  };

  $channel->basic_consume('status_queue', '', false, true, false, false, $callback);

  while(count($channel->callbacks))
  {
    $channel->wait();
  }
  $channel->close();
  $connection->close();





    //$query = [];
    //$last_record;
    //$cursor = $this->col->find($query)->tailable();
    
    
    
    
    /*
    while (true)
    {
      if ($last_record < $index)
      {   
        if (!$cursor->hasNext())
        {        
          if ($cursor->dead())
          {
            break;
          }
        }
        else
        {
          foreach (cursor as $record)
          {
            $last_record = $record['_id'];
            echo $last_record;
          }
        }
      }
    }
    */
 
}
?>

