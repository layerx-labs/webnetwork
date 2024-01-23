'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("chains", "lockAmountForNetworkCreation", {
      type: Sequelize.STRING
    }).catch(error => console.log(error?.message));

    await queryInterface.addColumn("chains", "networkCreationFeePercentage", {
      type: Sequelize.FLOAT
    }).catch(error => console.log(error?.message));

    await queryInterface.addColumn("chains", "closeFeePercentage", {
      type: Sequelize.FLOAT
    }).catch(error => console.log(error?.message));

    await queryInterface.addColumn("chains", "cancelFeePercentage", {
      type: Sequelize.FLOAT
    }).catch(error => console.log(error?.message));
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("chains", "lockAmountForNetworkCreation");
    await queryInterface.removeColumn("chains", "networkCreationFeePercentage");
    await queryInterface.removeColumn("chains", "closeFeePercentage");
    await queryInterface.removeColumn("chains", "cancelFeePercentage");
  }
};
