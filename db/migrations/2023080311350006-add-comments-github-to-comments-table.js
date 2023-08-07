const { Op } = require("sequelize");
const Octokit = require("octokit").Octokit;
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

const { SKIP_MIGRATION_SEED_COMMENTS_DATE_GITHUB, NEXT_GH_TOKEN } = process.env;
const BOT_NAME = 'bepro-bot'

async function handleAddComments(comment, id, type, prId){
  const regexGithubLogin = /@(\w+)/;
  const bodyGithubLogin = regexGithubLogin.exec(comment.body);

  const getCommentCreateData = (userId, userAddress, body) => ({
    userId,
    userAddress,
    comment: body,
    issueId: id,
    hidden: false,
    type,
    created_at: comment.created_at,
    updated_at: comment.updated_at,
    ... prId ? { deliverableId: prId } : null
  }) 

  const getUser = (name) => UserModel.findOne({
    where: {
      githubLogin: name
    }
  })

  if(bodyGithubLogin && comment.user.login === BOT_NAME){
    const user = await getUser(bodyGithubLogin[1])
    let text;

    if(user){
      //Example text: "@name  is working on this."
      if(/working/.test(comment.body) && type === 'issue') text = `i'm working on this.`
      //Example text: "has a solution - [check your bounty](https://)"
      if(/solution/.test(comment.body) && type === 'issue') {
        const regexSolution = /(?<=- ).*/
        text = `finished a solution - ${comment.body.match(regexSolution)[0]}`
      }
      //Example text: "reviewed this Pull Request with the following message:    Message"
      if(/Pull Request/.test(comment.body) && type === 'deliverable') {
        const regexPr = /(?<=:\s*).*/;
        text = comment.body.match(regexPr)[0]
      }

      await CommentsModel.create(getCommentCreateData(user.id, user.address, text))
    }
  } else {
    const user = await getUser(comment.user.login)

    if(user)
      await CommentsModel.create(getCommentCreateData(user.id, user.address, comment.body))
  }
}

async function up(queryInterface, Sequelize) {
  if (SKIP_MIGRATION_SEED_COMMENTS_DATE_GITHUB === "true") return;

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
    UserModel
  ].forEach((model) => model.init(queryInterface.sequelize));

  [ChainModel, NetworkModel, IssueModel].forEach((model) =>
    model.associate(queryInterface.sequelize.models)
  );

  const chains = await ChainModel.findAll({
    where: {
      registryAddress: {
        [Op.ne]: null,
      },
    },
    include: [
      {
        association: "networks",
        required: true,
        include: [
          {
            association: "issues",
            where: {
              state: { [Op.not]: "pending" },
            },
            include: [{ association: "repository" }, {association: "pullRequests"}],
            required: true,
          },
        ],
      },
    ],
  });

  if (!chains.length) return;

  try {
    for (const { networks } of chains) {

      for (const { issues } of networks) {

        for (const issue of issues) {
          const [owner, repo] = issue?.repository?.githubPath.split("/");

          const octokit = new Octokit({
            auth: NEXT_GH_TOKEN,
          });

          const { data: commentsGithub } = await octokit.rest.issues.listComments({
            owner,
            repo,
            issue_number: issue.githubId,
          });

          for (const comment of commentsGithub) {
            await handleAddComments(comment, issue?.id, 'issue')
          }

          for (const pr of issue.pullRequests){
            const { data: commentsPr } = await octokit.rest.issues.listComments({
              owner,
              repo,
              issue_number: pr.githubId,
            });

            for(const commentPr of commentsPr){
             await handleAddComments(commentPr, issue?.id, 'deliverable', pr?.id)
            }
          }
        }
      }
    }
  } catch (error) {
    console.log(
      "Failed to add comments from github",
      error.toString()
    );
  }
}

module.exports = { up };
