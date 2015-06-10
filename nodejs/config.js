module.exports = {
  // RabbitMQ connection
  host: 'localhost',
  vhost: '/',
  login: 'guest',
  password: 'guest',

  // Exchange details
  exchangeName: 'rapids',
  exchange: {
    type: 'fanout',
    durable: true,
    autoDelete: false
  },

  // Queue details
  queue: {
    exclusive: true
  }
};
