'use strict';
const { QueryTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const rows = await queryInterface.sequelize.query(`
      select	users."id" "userId"
          , users."totalPoints"
          , case when users."about" is not null and users."about" <> '' then true else false end "hasAbout"
          , aboutEvent."id" "aboutEventId"
          , aboutEvent."pointsWon" "aboutPointsWon"
          , aboutBase."pointsPerAction" * aboutBase."scalingFactor" "aboutRealPoints"
          , case when users."githubLink" is not null and users."githubLink" <> '' then true else false end "hasGithubLink"
          , githubEvent."id" "githubEventId"
          , githubEvent."pointsWon" "githubPointsWon"
          , githubBase."pointsPerAction" * githubBase."scalingFactor" "githubRealPoints"
          , case when users."linkedInLink" is not null and users."linkedInLink" <> '' then true else false end "hasLinkedInLink"
          , linkedinEvent."id" "linkedInEventId"
          , linkedinEvent."pointsWon" "linkedInPointsWon"
          , linkedinBase."pointsPerAction" * linkedinBase."scalingFactor" "linkedInRealPoints"
          , case when users."twitterLink" is not null and users."twitterLink" <> '' then true else false end "hasTwitterLink"
          , twitterEvent."id" "twitterEventId"
          , twitterEvent."pointsWon" "twitterPointsWon"
          , twitterBase."pointsPerAction" * twitterBase."scalingFactor" "twitterRealPoints"
          , case when users."email" is not null and users."email" <> '' then true else false end "hasEmail"
          , emailEvent."id" "emailEventId"
          , emailEvent."pointsWon" "emailPointsWon"
          , emailBase."pointsPerAction" * emailBase."scalingFactor" "emailRealPoints"
          , case when users."avatar" is not null and users."avatar" <> '' then true else false end "hasAvatar"
          , avatarEvent."id" "avatarEventId"
          , avatarEvent."pointsWon" "avatarPointsWon"
          , avatarBase."pointsPerAction" * avatarBase."scalingFactor" "avatarRealPoints"
      from	users
        left join points_events aboutEvent on aboutEvent."userId" = users."id" and aboutEvent."actionName" = 'add_about'
        left join points_base aboutBase on aboutBase."actionName" = aboutEvent."actionName"
        left join points_events githubEvent on githubEvent."userId" = users."id" and githubEvent."actionName" = 'add_github'
        left join points_base githubBase on githubBase."actionName" = githubEvent."actionName"
        left join points_events linkedinEvent on linkedinEvent."userId" = users."id" and linkedinEvent."actionName" = 'add_linkedin'
        left join points_base linkedinBase on linkedinBase."actionName" = linkedinEvent."actionName"
        left join points_events twitterEvent on twitterEvent."userId" = users."id" and twitterEvent."actionName" = 'add_twitter'
        left join points_base twitterBase on twitterBase."actionName" = twitterEvent."actionName"
        left join points_events emailEvent on emailEvent."userId" = users."id" and emailEvent."actionName" = 'connect_email'
        left join points_base emailBase on emailBase."actionName" = emailEvent."actionName"
        left join points_events avatarEvent on avatarEvent."userId" = users."id" and avatarEvent."actionName" = 'add_avatar'
        left join points_base avatarBase on avatarBase."actionName" = avatarEvent."actionName"
      where	1 = 1
        and (
          (users."about" is not null and users."about" <> '')
          or (users."githubLink" is not null and users."githubLink" <> '')
          or (users."linkedInLink" is not null and users."linkedInLink" <> '')
          or (users."twitterLink" is not null and users."twitterLink" <> '')
          or (users."email" is not null and users."email" <> '')
          or (users."avatar" is not null and users."avatar" <> '')
        )
    `, {
      type: QueryTypes.SELECT,
    });

    const updateUser = ({ id, totalPoints }) => queryInterface.bulkUpdate("users", {
      totalPoints
    }, {
      id
    });

    const updateEvent = ({ id, pointsWon }) => queryInterface.bulkUpdate("points_events", {
      pointsWon
    }, {
      id
    });

    for (const row of rows) {
      let updatedTotalPoints = row.totalPoints;
      const eventsToUpdate = [];

      if (row.hasAbout) {
        eventsToUpdate.push({ id: row.aboutEventId, pointsWon: row.aboutRealPoints });
        updatedTotalPoints += (row.aboutRealPoints - row.aboutPointsWon)
      }

      if (row.hasGithubLink) {
        eventsToUpdate.push({ id: row.githubEventId, pointsWon: row.githubRealPoints });
        updatedTotalPoints += (row.githubRealPoints - row.githubPointsWon)
      }

      if (row.hasLinkedInLink) {
        eventsToUpdate.push({ id: row.linkedInEventId, pointsWon: row.linkedInRealPoints });
        updatedTotalPoints += (row.linkedInRealPoints - row.linkedInPointsWon)
      }

      if (row.hasTwitterLink) {
        eventsToUpdate.push({ id: row.twitterEventId, pointsWon: row.twitterRealPoints });
        updatedTotalPoints += (row.twitterRealPoints - row.twitterPointsWon)
      }

      if (row.hasEmail) {
        eventsToUpdate.push({ id: row.emailEventId, pointsWon: row.emailRealPoints });
        updatedTotalPoints += (row.emailRealPoints - row.emailPointsWon)
      }

      if (row.hasAvatar) {
        eventsToUpdate.push({ id: row.avatarEventId, pointsWon: row.avatarRealPoints });
        updatedTotalPoints += (row.avatarRealPoints - row.avatarPointsWon)
      }

      await Promise.all([
        ...eventsToUpdate.map(updateEvent),
        updateUser({
          id: row.userId,
          totalPoints: updatedTotalPoints
        })
      ]);
    }
  },

  async down (queryInterface, Sequelize) {
    
  }
};
