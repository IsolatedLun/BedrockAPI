'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      const defaultPassw = "passw123";
      await queryInterface.bulkInsert("Notes", [
        { id: 13, userId: 5, title: "slop", text: "## slop2", createdAt: new Date(), updatedAt: new Date() },
        { id: 14, userId: 6, title: "slop", text: "## slop3", createdAt: new Date(), updatedAt: new Date() },
        { id: 15, userId: 7, title: "slop", text: "## slop4", createdAt: new Date(), updatedAt: new Date() },
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
