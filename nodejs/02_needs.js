'use strict';
var _ = require('lodash');
var moment = require('moment');
var config = require('./config');
var amqp = require('amqp');
var connection = amqp.createConnection(config, {recover: false});
var NeedPackage = require('./NeedPackage');

var publishInterval = 5000;
var possibleSolutions = [];

function selectBestSolution(solutions) {
  var best = Number.MAX_VALUE;
  var beststring = 'Nobody';
  _.forEach(solutions, function (value) {
    if (value.value * value.likelihood < best) {
      best = value.value * value.likelihood;
      beststring = value.title;
    }
  });
  if (best === Number.MAX_VALUE) {
    console.log('No best solution'); // eslint-disable-line no-console
    return;
  }
  console.log('Best solution from: ' + beststring + 'value: ' + best); // eslint-disable-line no-console
}
console.log('Opening connection to RabbitMQ host...'); // eslint-disable-line no-console

connection.on('ready', function __connectionReady() {
  console.log('Connected to amqp://' + // eslint-disable-line no-console
              config.login + ':' + config.password + '@' + config.host + '/' + config.vhost);

  // Connect to exchange
  var myExchange = connection.exchange(config.exchangeName, config.exchange, function __exchangeReady(exchange) {
    console.log('Exchange \'' + exchange.name + '\' is open'); // eslint-disable-line no-console

    // Publish a NeedPackage on a regular interval
    setInterval(function __publisher() {
      if (possibleSolutions.length !== 0) {
        selectBestSolution(possibleSolutions);
      }
      possibleSolutions = [];
      exchange.publish('', NeedPackage.create());
      console.log(' [x] Published a rental offer need on the \'' + // eslint-disable-line no-console
                  config.vhost + '\' bus at ' + moment().format('hh:mm:ss'));
    }, publishInterval);
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
      if (message.data) {
        message = JSON.parse(message.data.toString('utf8'));
      }
      if (message.id === 170771 && message.need === 'car_rental_offer' &&
          message.solutions.length !== 0) {
        console.log('Received a solution'); // eslint-disable-line no-console
        possibleSolutions = possibleSolutions.concat(message.solutions);
        return;
      }
      // console.log('[X] Not a message for us'); // eslint-disable-line no-console

    });
  });

});
