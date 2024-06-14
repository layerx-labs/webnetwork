'use strict';

const { QueryTypes, Op } = require('sequelize');
const { getDAO } = require('../../helpers/db/dao');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const issues = await queryInterface.sequelize.query(`
      select	issue."id" "taskId"
              , chain."privateChainRpc"
              , payment."transactionHash"
              , proposal."id" "proposalId"
              , proposalUser."id" "proposalCreator"
              , deliverable."id" "deliverableId"
              , deliverable."userId" "deliverableCreator"
              , string_agg(events."actionName", ',') "events"
      from	issues issue
        inner join merge_proposals proposal on proposal."issueId" = issue."id" and proposal."contractId" = cast(issue."merged" as integer)
        inner join users proposalUser on lower(proposalUser."address") = lower(proposal."creator")
        inner join deliverables deliverable on deliverable."id" = proposal."deliverableId"
        inner join chains chain on chain."chainId" = issue."chain_id"
        inner join users_payments payment on payment."issueId" = issue."id"
        left join points_events events on cast(events.info->>'taskId' as integer) = issue."id" 
          and events."actionName" in ('created_proposal', 'created_deliverable', 'accepted_proposal')
      where	1 = 1
        and issue."state" = 'closed'
        and issue."updatedAt" >= '2024-05-08 00:00:00'
      group by issue."id", chain."privateChainRpc", payment."transactionHash", proposal."id", proposalUser."id", deliverable."id", deliverable."userId"
      order by chain."privateChainRpc"
    `, {
      type: QueryTypes.SELECT,
    });

    const rules = await queryInterface.sequelize.query(`
      select  "actionName", "scalingFactor" * "pointsPerAction" "points"
      from    points_base 
      where   "actionName" in ('created_proposal', 'created_deliverable', 'accepted_proposal')
    `, {
      type: QueryTypes.SELECT,
    });

    const users = await queryInterface.sequelize.query(`
      select  "id", "address"
      from    users
    `, {
      type: QueryTypes.SELECT,
    });

    const getPointsFromRules = rule => rules.find(({ actionName }) => actionName === rule).points;
    const createdProposalPoints = getPointsFromRules("created_proposal");
    const createdDeliverablePoints = getPointsFromRules("created_deliverable");
    const acceptedProposalPoints = getPointsFromRules("accepted_proposal");

    const getPointsEvent = (actionName, userId, pointsWon, info) => ({
      actionName,
      userId,
      pointsWon,
      createdAt: new Date(),
      updatedAt: new Date(),
      info: JSON.stringify({
        ...info,
        migration: "20240613124622-add-points-events-if-missing"
      }),
    });

    const eventsToInsert = [];
    let web3Connection = null;

    for (const issue of issues) {
      const events = (issue.events || "").split(",");

      if (events.length === 3)
        continue;

      if (!events.includes("created_proposal")) {
        eventsToInsert.push(getPointsEvent("created_proposal", 
                            issue.proposalCreator, 
                            createdProposalPoints, 
                            { taskId: issue.taskId, proposalId: issue.proposalId }));
      }

      if (!events.includes("created_deliverable")) {
        eventsToInsert.push(getPointsEvent("created_deliverable", 
                            issue.deliverableCreator, 
                            createdDeliverablePoints, 
                            { taskId: issue.taskId, deliverableId: issue.deliverableId }));
      }
      
      if (!events.includes("accepted_proposal")) {
        if (!web3Connection || web3Connection?.web3Host !== issue.privateChainRpc)
          web3Connection = (await getDAO({
            web3Host: issue.privateChainRpc
          })).web3Connection;
        
        const merger = (await web3Connection.eth.getTransaction(issue.transactionHash)).from;
        const mergerUserId = users.find(({ address }) => address.toLowerCase() === merger.toLowerCase()).id;

        eventsToInsert.push(getPointsEvent("accepted_proposal", 
          mergerUserId, 
          acceptedProposalPoints, 
          { taskId: issue.taskId, proposalId: issue.proposalId, merger }));
      }
    }

    if (eventsToInsert.length)
      await queryInterface.bulkInsert("points_events", eventsToInsert);
  },

  async down (queryInterface, Sequelize) {
  }
};
