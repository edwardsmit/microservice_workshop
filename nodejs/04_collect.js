'use strict';
var _ = require('lodash');
var config = require('./config');
var amqp = require('amqp');
var connection = amqp.createConnection(config, {recover: false});
var NeedPackage = require('./NeedPackage');

console.log('Opening connection to RabbitMQ host...'); // eslint-disable-line no-console

connection.on('ready', function __connectionReady() {
  console.log('Connected to amqp://' + // eslint-disable-line no-console
              config.login + ':' + config.password + '@' + config.host + '/' + config.vhost);

  // Connect to exchange
  var myExchange = connection.exchange(config.exchangeName, config.exchange, function __exchangeReady(exchange) {
    console.log('Exchange \'' + exchange.name + '\' is open'); // eslint-disable-line no-console
  });

  // Setup queue
  connection.queue('', config.queue, function __queueReady(queue) {
    console.log('Queue \'' + queue.name + '\' is open'); // eslint-disable-line no-console

    // Bind queue to exchange
    queue.bind(myExchange, '', function __bind() {
      console.log(' [*] Waiting for solutions on the \'' + // eslint-disable-line no-console
                  config.vhost + '\' bus... To exit press CTRL+C');
    });

    // Subscribe to messages on queue
    queue.subscribe(function __listener(message) {
      // NOTE: if the message was published by another node-amqp client,
      // message will be a plain JS object, if the message is published by other
      // clients it may be received as a Buffer, which you'll need to convert
      // with something like this:
      // message = JSON.parse(message.data.toString('utf8'));
      // console.log(' Received message'); // eslint-disable-line no-console
      if (!_.isPlainObject(message)) {
        message = JSON.parse(message.data.toString('utf8'));
      }
      if (message.json_class === 'RentalOfferNeed' && message.need === 'car_rental_offer' &&
          message.solutions.length === 0) {
        myExchange.publish('', NeedPackage.addSolution(message, 'Hewey\'s solution'));
        console.log('Published a solution'); // eslint-disable-line no-console
        return;
      }
      // console.log('[X] Not a message for us'); // eslint-disable-line no-console

    });
  });

});
