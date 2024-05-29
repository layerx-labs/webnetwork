'use strict';

const { getAllFromTable } = require("../../helpers/db/rawQueries");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const pointsEvents = await getAllFromTable(queryInterface, "points_events");
    const events = pointsEvents.filter(e => e.actionName === "delegated" || e.actionName === "locked");
    const grouped = {};
    
    for (const event of events) {
      const dateString = `${event.createdAt.getFullYear()}${event.createdAt.getMonth()}${event.createdAt.getDate()}`;

      if (!grouped[event.userId])
        grouped[event.userId] = {};

      if (!grouped[event.userId][event.actionName])
        grouped[event.userId][event.actionName] = {};

      if (!grouped[event.userId][event.actionName][dateString])
        grouped[event.userId][event.actionName][dateString] = 1;
      else
        grouped[event.userId][event.actionName][dateString] += 1;

      if (grouped[event.userId][event.actionName][dateString] > 1) {
        if (!grouped[event.userId]["toDelete"])
          grouped[event.userId]["toDelete"] = [];

        grouped[event.userId]["toDelete"].push(event);
      }
    }

    await queryInterface.bulkUpdate("users", {
      totalPoints: 0,
    }, {});

    const usersIds = Object.keys(grouped);

    for (const userId of usersIds) {
      await queryInterface.bulkDelete("points_events", {
        id: grouped[userId].toDelete.map(e => e.id),
      });
    }

    await queryInterface.bulkUpdate("points_events", {
      pointsCounted: false,
    }, {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
