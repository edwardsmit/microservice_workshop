var config = require('./config'),
    amqp = require('amqp'),
    connection = amqp.createConnection(config, { recover: false }),
    NeedPackage = require('./NeedPackage');

var publishInterval = 5000;

console.log('Opening connection to RabbitMQ host...');

connection.on('ready', function __connectionReady() {
  console.log('Connected to amqp://' + config.login + ':' + config.password + '@' + config.host + '/' + config.vhost);

  // Connect to exchange
  var exchange = connection.exchange(config.exchangeName, config.exchange, function __exchangeReady(exchange) {
    console.log('Exchange \'' + exchange.name + '\' is open');

    // Publish a NeedPackage on a regular interval
    setInterval(function __publisher() {
      exchange.publish('', NeedPackage.create());
      console.log(' [x] Published a rental offer need on the \'' + config.vhost + '\' bus');
    }, publishInterval);
  });
});
