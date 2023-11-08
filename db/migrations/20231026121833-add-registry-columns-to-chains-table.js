'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("chains", "lockAmountForNetworkCreation", {
      type: Sequelize.STRING
    });

    await queryInterface.addColumn("chains", "networkCreationFeePercentage", {
      type: Sequelize.FLOAT
    });

    await queryInterface.addColumn("chains", "closeFeePercentage", {
      type: Sequelize.FLOAT
    });

    await queryInterface.addColumn("chains", "cancelFeePercentage", {
      type: Sequelize.FLOAT
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("chains", "lockAmountForNetworkCreation");
    await queryInterface.removeColumn("chains", "networkCreationFeePercentage");
    await queryInterface.removeColumn("chains", "closeFeePercentage");
    await queryInterface.removeColumn("chains", "cancelFeePercentage");
  }
};
