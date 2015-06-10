var config = require('./config'),
    amqp = require('amqp'),
    connection = amqp.createConnection(config, { recover: false });

console.log('Opening connection to RabbitMQ host...');

connection.on('ready', function __connectionReady() {
  console.log('Connected to amqp://' + config.login + ':' + config.password + '@' + config.host + '/' + config.vhost);

  // Connect to exchange
  var exchange = connection.exchange(config.exchangeName, config.exchange, function __exchangeReady(exchange) {
    console.log('Exchange \'' + exchange.name + '\' is open');
  });

  // Setup queue
  var queue = connection.queue('', config.queue, function __queueReady(queue) {
    console.log('Queue \'' + queue.name + '\' is open');

    // Bind queue to exchange
    queue.bind(exchange, '', function __bind() {
      console.log(' [*] Waiting for solutions on the \'' + config.vhost + '\' bus... To exit press CTRL+C');
    });

    // Subscribe to messages on queue
    queue.subscribe(function __listener(message) {
      // NOTE: if the message was published by another node-amqp client,
      // message will be a plain JS object, if the message is published by other
      // clients it may be received as a Buffer, which you'll need to convert
      // with something like this:
      // message = JSON.parse(message.data.toString('utf8'));
      console.log(' [x] Received: ' + JSON.stringify(message));
    });
  });
});
