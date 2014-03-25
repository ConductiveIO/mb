<?php

class common
{
  public start_consumer
  {
    // Open the phirehose!
    $stream = new StreamConsumer(constants::OAUTH_TOKEN, constants::OAUTH_SECRET, Phirehose::METHOD_FILTER);
    $stream->setTrack(array('420', 'corgis', 'marthastewart'));
    $stream->consume();
  }
}
