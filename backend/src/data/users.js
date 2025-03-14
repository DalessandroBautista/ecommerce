const bcrypt = require('bcrypt');

const users = [
  {
    name: 'Admin User',
    username: 'adminuser',
    email: 'admin@thunderrugs.com',
    password: bcrypt.hashSync('thunder123', 10),
    phone: '123456789',
    isAdmin: true,
    address: {
      street: 'Calle Principal 123',
      city: 'Buenos Aires',
      postalCode: '1001',
      country: 'Argentina',
    },
  },
  {
    name: 'Cliente Regular',
    username: 'cliente1',
    email: 'cliente@ejemplo.com',
    password: bcrypt.hashSync('123456', 10),
    phone: '987654321',
    isAdmin: false,
    address: {
      street: 'Avenida Libertador 456',
      city: 'Córdoba',
      postalCode: '5000',
      country: 'Argentina',
    },
  },
];

module.exports = users;