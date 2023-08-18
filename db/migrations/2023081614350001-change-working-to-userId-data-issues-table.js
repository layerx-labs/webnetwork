const { Op } = require("sequelize");
const ChainModel = require("../models/chain.model");
const NetworkModel = require("../models/network.model");
const IssueModel = require("../models/issue.model");
const TokenModel = require("../models/tokens.model");
const RepositoryModel = require("../models/repositories.model");
const PullRequestModel = require("../models/pullRequest.model");
const MergeProposalModel = require("../models/mergeproposal");
const CuratorsModel = require("../models/curator-model");
const BenefactorModel = require("../models/benefactor.model");
const DisputeModel = require("../models/dispute-model");
const UserPaymentsModel = require("../models/user-payments");
const DeveloperModel = require("../models/developer.model");
const CommentsModel = require("../models/comments.model");
const UserModel = require("../models/user");

async function up(queryInterface, Sequelize) {
  [
    ChainModel,
    NetworkModel,
    IssueModel,
    CuratorsModel,
    RepositoryModel,
    PullRequestModel,
    MergeProposalModel,
    TokenModel,
    BenefactorModel,
    DisputeModel,
    UserPaymentsModel,
    DeveloperModel,
    CommentsModel,
    UserModel,
  ].forEach((model) => model.init(queryInterface.sequelize));

  [ChainModel, NetworkModel, IssueModel].forEach((model) =>
    model.associate(queryInterface.sequelize.models)
  );

  const issues = await IssueModel.findAll({
    where: {
      state: { [Op.not]: "pending" },
    },
    required: true,
  });

  if (!issues.length) return;

  try {
    for (const issue of issues) {
      const newWorking = [];
      if (issue.working.length) {
        for (const githubLogin of issue.working) {
          const user = await UserModel.findOne({
            where: {
              githubLogin: Sequelize.where(
                Sequelize.fn("lower", Sequelize.col("user.githubLogin")),
                githubLogin.toLowerCase()
              ),
            },
          });

          if (user) newWorking.push(user.id);
        }
      }
      issue.working = newWorking;
      await issue.save();
    }
  } catch (error) {
    console.log(
      "Failed to changing working issue with userId",
      error.toString()
    );
  }
}

module.exports = { up, down: async () => true };
