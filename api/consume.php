<?php
$client;
$db;
$col;
// connect to the status_store database and read in from the queue of new tweets 
try {
  $client = new MongoClient("mongodb://127.0.0.1:27017");
  $db = $client->mb_data_store;
  $col = $db->queue;

  $cursor = $col->find()->tailable();

  $results = array();
  while (true)
  {
    if (!$cursor->hasNext())
    {
      // we've read all the results, exit
      if ($cursor->dead())
      {
        break;
      }
      // we've read all the results so far, wait for more
      sleep(1);
    }
    else
    {
      $results[] = $cursor->getNext();
      echo '<p> got one! </p>';  
    }
  }
}
catch (Exception $e)
{
  HttpResponse::status(500);
  HttpResponse::setData($e->getMessage());
  HttpResponse::send();
}
?>

