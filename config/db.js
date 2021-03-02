const Sequelize = require('sequelize');
/* const Sequelize = require('sequelize');
  const connection = new Sequelize("exch", "root", "", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
  storage: "./session.mysql"
}); */

const connection = new Sequelize("goexch", "postgres", "admin@123", {
    host:"localhost",
    port:5432,
    dialect: 'postgres',
    logging: true,
});

connection
  .authenticate()
  .then(() => {
    console.log('Connection established.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = { Sequelize, connection };