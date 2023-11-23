const { QueryTypes } = require("sequelize");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('curators', 'userId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    await queryInterface.sequelize.query(
      `UPDATE "curators" AS c SET "userId" = u."id" FROM "users" AS u WHERE c."address" = u."address";`,
      {type: QueryTypes.UPDATE}
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('curators', 'userId');
  },
};