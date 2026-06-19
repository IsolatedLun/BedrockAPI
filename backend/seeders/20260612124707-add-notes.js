'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      const defaultPassw = "passw123";
      await queryInterface.bulkInsert("Notes", [
        { id: 1000, userId: 1000, title: "slop title 1", text: "## slop2", createdAt: new Date(), updatedAt: new Date() },
        { id: 1001, userId: 1001, title: "slop title 2", text: "## slop3", createdAt: new Date(), updatedAt: new Date() },
        { id: 1002, userId: 1002, title: "slop title 3", text: "## slop4", createdAt: new Date(), updatedAt: new Date() },
      ])
    } catch {  };
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Notes', null, {
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });
  }
};
