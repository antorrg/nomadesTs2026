'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.addColumn(
        'landings',
        'showMarketing',
        {
          type: Sequelize.BOOLEAN,
          allowNull: true,
          defaultValue: true,
        },
        { transaction },
      );

      await queryInterface.addColumn(
        'landings',
        'showHighLights',
        {
          type: Sequelize.BOOLEAN,
          allowNull: true,
          defaultValue: true,
        },
        { transaction },
      );
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeColumn(
        'landings',
        'showHighLights',
        { transaction },
      );

      await queryInterface.removeColumn(
        'landings',
        'showMarketing',
        { transaction },
      );
    });
  }
};
