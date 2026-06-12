'use strict';

const { argon2 } = require('argon2');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      const defaultPassw = "passw123";
      await queryInterface.bulkInsert("Users", [
        { id: 8, username: "npc1", email: "npc1@gmail.com", password: defaultPassw, createdAt: new Date(), updatedAt: new Date() },
        { id: 9, username: "npc2", email: "npc2@gmail.com", password: defaultPassw, createdAt: new Date(), updatedAt: new Date() },
        { id: 10, username: "npc2", email: "npc3@gmail.com", password: defaultPassw, createdAt: new Date(), updatedAt: new Date() },
      ])
    } catch {  };
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });
  }
};
