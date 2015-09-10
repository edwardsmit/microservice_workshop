module.exports = {
  // RabbitMQ connection
  host: '192.168.1.2',
  vhost: 'bart',
  login: 'bart',
  password: 'bart',

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
