const bcrypt = require('bcrypt');

const users = [
  {
    name: 'Admin Usuario',
    email: 'admin@ejemplo.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: true,
  },
  {
    name: 'Juan Pérez',
    email: 'juan@ejemplo.com',
    password: bcrypt.hashSync('123456', 10),
  },
  {
    name: 'Ana Gómez',
    email: 'ana@ejemplo.com',
    password: bcrypt.hashSync('123456', 10),
  },
];

module.exports = users;