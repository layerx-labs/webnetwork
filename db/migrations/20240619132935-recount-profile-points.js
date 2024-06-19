'use strict';
const { QueryTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const rows = await queryInterface.sequelize.query(`
      select	users."id" "userId"
          , users."totalPoints"
          , users."about"
          , aboutEvent."id" "aboutEventId"
          , aboutEvent."pointsWon" "aboutPointsWon"
          , aboutEvent.info "aboutInfo"
          , (select "pointsPerAction" * "scalingFactor" from points_base where "actionName" = 'add_about') "aboutRealPoints"
          , users."githubLink"
          , githubEvent."id" "githubEventId"
          , githubEvent."pointsWon" "githubPointsWon"
          , githubEvent.info "githubInfo"
          , (select "pointsPerAction" * "scalingFactor" from points_base where "actionName" = 'add_github') "githubRealPoints"
          , users."linkedInLink"
          , linkedinEvent."id" "linkedInEventId"
          , linkedinEvent."pointsWon" "linkedInPointsWon"
          , linkedinEvent.info "linkedInInfo"
          , (select "pointsPerAction" * "scalingFactor" from points_base where "actionName" = 'add_linkedin') "linkedInRealPoints"
          , users."twitterLink"
          , twitterEvent."id" "twitterEventId"
          , twitterEvent."pointsWon" "twitterPointsWon"
          , twitterEvent.info "twitterInfo"
          , (select "pointsPerAction" * "scalingFactor" from points_base where "actionName" = 'add_twitter') "twitterRealPoints"
          , users."email"
          , emailEvent."id" "emailEventId"
          , emailEvent."pointsWon" "emailPointsWon"
          , emailEvent.info "emailInfo"
          , (select "pointsPerAction" * "scalingFactor" from points_base where "actionName" = 'connect_email') "emailRealPoints"
          , users."avatar"
          , avatarEvent."id" "avatarEventId"
          , avatarEvent."pointsWon" "avatarPointsWon"
          , avatarEvent.info "avatarInfo"
          , (select "pointsPerAction" * "scalingFactor" from points_base where "actionName" = 'add_avatar') "avatarRealPoints"
      into 	recount_profile_points_bkp
      from	users
        left join points_events aboutEvent on aboutEvent."userId" = users."id" and aboutEvent."actionName" = 'add_about'
        left join points_events githubEvent on githubEvent."userId" = users."id" and githubEvent."actionName" = 'add_github'
        left join points_events linkedinEvent on linkedinEvent."userId" = users."id" and linkedinEvent."actionName" = 'add_linkedin'
        left join points_events twitterEvent on twitterEvent."userId" = users."id" and twitterEvent."actionName" = 'add_twitter'
        left join points_events emailEvent on emailEvent."userId" = users."id" and emailEvent."actionName" = 'connect_email'
        left join points_events avatarEvent on avatarEvent."userId" = users."id" and avatarEvent."actionName" = 'add_avatar'
      where	(users."about" is not null and users."about" <> '')
          or (users."githubLink" is not null and users."githubLink" <> '')
          or (users."linkedInLink" is not null and users."linkedInLink" <> '')
          or (users."twitterLink" is not null and users."twitterLink" <> '')
          or (users."email" is not null and users."email" <> '')
          or (users."avatar" is not null and users."avatar" <> '');
      
      select * from recount_profile_points_bkp;
    `, {
      type: QueryTypes.SELECT,
    });

    const migration = "20240619132935-recount-profile-points.js";

    const eventsToUpdate = [];
    const eventsToInsert = [];
    const usersToUpdate = [];

    const addUserToUpdate = (id, totalPoints) => 
      usersToUpdate.push({
        id,
        totalPoints
      });

    const addEventToInsert = (actionName, userId, pointsWon, info) => 
      eventsToInsert.push({
        actionName,
        userId,
        pointsWon,
        createdAt: new Date(),
        updatedAt: new Date(),
        pointsCounted: true,
        info: JSON.stringify({
          ...info,
          migration
        }),
      });

    const addEventToUpdate = (id, pointsWon, info, oldPointsWon) => 
      eventsToUpdate.push({ 
      id,
      pointsWon,
      info: JSON.stringify({
        ...info,
        updatedBy: migration,
        oldPointsWon
      })
    });

    for (const row of rows) {
      let updatedTotalPoints = row.totalPoints;

      if (!!row.about) {
        if (!!row.aboutEventId) {
          addEventToUpdate(row.aboutEventId, row.aboutRealPoints, row.aboutInfo, row.aboutPointsWon);
          updatedTotalPoints += (row.aboutRealPoints - row.aboutPointsWon);
        } else {
          addEventToInsert("add_about", row.userId, row.aboutRealPoints, { value: row.about });
          updatedTotalPoints += row.aboutRealPoints;
        }
      }

      if (!!row.githubLink) {
        if (!!row.githubEventId) {
          addEventToUpdate(row.githubEventId, row.githubRealPoints, row.githubInfo, row.githubPointsWon);
          updatedTotalPoints += (row.githubRealPoints - row.githubPointsWon);
        } else {
          addEventToInsert("add_github", row.userId, row.githubRealPoints, { value: row.githubLink });
          updatedTotalPoints += row.githubRealPoints;
        }
      }

      if (!!row.linkedInLink) {
        if (!!row.linkedInEventId) {
          addEventToUpdate(row.linkedInEventId, row.linkedInRealPoints, row.linkedInInfo, row.linkedInPointsWon);
          updatedTotalPoints += (row.linkedInRealPoints - row.linkedInPointsWon);
        } else {
          addEventToInsert("add_linkedin", row.userId, row.linkedInRealPoints, { value: row.linkedInLink });
          updatedTotalPoints += row.linkedInRealPoints;
        }
      }

      if (!!row.twitterLink) {
        if (!!row.twitterEventId) {
          addEventToUpdate(row.twitterEventId, row.twitterRealPoints, row.twitterInfo, row.twitterPointsWon);
          updatedTotalPoints += (row.twitterRealPoints - row.twitterPointsWon);
        } else {
          addEventToInsert("add_twitter", row.userId, row.twitterRealPoints, { value: row.twitterLink });
          updatedTotalPoints += row.twitterRealPoints;
        }
      }

      if (!!row.email) {
        if (!!row.emailEventId) {
          addEventToUpdate(row.emailEventId, row.emailRealPoints, row.emailInfo, row.emailPointsWon);
          updatedTotalPoints += (row.emailRealPoints - row.emailPointsWon);
        } else {
          addEventToInsert("connect_email", row.userId, row.emailRealPoints, { value: row.email });
          updatedTotalPoints += row.emailRealPoints;
        }
      }

      if (!!row.avatar) {
        if (!!row.avatarEventId) {
          addEventToUpdate(row.avatarEventId, row.avatarRealPoints, row.avatarInfo, row.avatarPointsWon);
          updatedTotalPoints += (row.avatarRealPoints - row.avatarPointsWon);
        } else {
          addEventToInsert("add_avatar", row.userId, row.avatarRealPoints, { value: row.avatar });
          updatedTotalPoints += row.avatarRealPoints;
        }
      }

      addUserToUpdate(row.userId, updatedTotalPoints);
    }

    const updateUser = ({ id, totalPoints }) => queryInterface.bulkUpdate("users", {
      totalPoints
    }, {
      id
    });

    const updateEvent = ({ id, pointsWon, info }) => queryInterface.bulkUpdate("points_events", {
      pointsWon,
      info
    }, {
      id
    });

    await Promise.all([
      ...eventsToUpdate.map(updateEvent),
      ...usersToUpdate.map(updateUser)
    ]);

    if (eventsToInsert.length)
      await queryInterface.bulkInsert("points_events", eventsToInsert);
  },

  async down (queryInterface, Sequelize) {
    
  }
};
