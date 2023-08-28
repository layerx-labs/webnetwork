const { Octokit } = require("octokit");
const { getAllFromTable } = require("../../helpers/db/rawQueries");

const { SKIP_MIGRATION_SEED_COMMENTS_DATE_GITHUB, NEXT_GH_TOKEN, NEXT_GH_OWNER } = process.env;

async function handleAddComments(queryInterface, users, comment, id, type, prId) {
  const getCommentCreateData = (userId, userAddress, body) => ({
    userId,
    userAddress,
    comment: body,
    issueId: id,
    hidden: false,
    type,
    createdAt: comment.created_at,
    updatedAt: comment.updated_at,
    ...(prId ? { deliverableId: prId } : null),
  });

  const getUser = (name) => users.find(user => user.githubLogin === name);

  if (comment.body.startsWith("@") && comment.user.login === NEXT_GH_OWNER) {
    const userTaggedByBot = getUser(
      comment.body.split(" ")[0].replace("@", "")
    );
    let text;

    if (userTaggedByBot) {
      switch (type) {
        case "issue": {
          //Example text: "@name  is working on this."
          if (/working/.test(comment.body)) {
            text = `i'm working on this.`;
            break;
          }
          //Example text: "has a solution - [check your bounty](https://)"
          if (/solution/.test(comment.body)) {
            text = `finished a solution -${comment.body.split("-")[1]}`;
            break;
          }
        }

        case "deliverable": {
          //Example text: "reviewed this Pull Request with the following message:    Message"
          if (/Pull Request/.test(comment.body)) {
            text = comment.body.split("message:")[1];
            break;
          }
        }
      }

      await queryInterface.bulkInsert("comments", [getCommentCreateData(userTaggedByBot.id, userTaggedByBot.address, text)]);
    }
  } else {
    const commentCreatorUser = getUser(comment.user.login);

    if (commentCreatorUser)
      queryInterface.bulkInsert("comments", [getCommentCreateData(commentCreatorUser.id, commentCreatorUser.address, comment.body)]);
  }
}

async function up(queryInterface, Sequelize) {
  if (SKIP_MIGRATION_SEED_COMMENTS_DATE_GITHUB === "true") return;

  const issues = await getAllFromTable(queryInterface, "issues");
  const openIssues = issues?.filter(issue => issue.state !== "pending" && !!issue.issueId);

  if (!openIssues?.length) return;

  const repositories = await getAllFromTable(queryInterface, "repositories");
  const pullRequests = await getAllFromTable(queryInterface, "pull_requests");
  const users = await getAllFromTable(queryInterface, "users");

  const octokit = new Octokit({
    auth: NEXT_GH_TOKEN,
  });

  try {
    let repository;

    for (const issue of openIssues) {
      if (issue.repository_id !== repository?.id)
        repository = repositories.find(({ id }) => id === issue.repository_id);

      const [owner, repo] = repository?.githubPath?.split("/");

      const { data: commentsGithub } = await octokit.rest.issues.listComments({
        owner,
        repo,
        issue_number: issue.githubId,
      });

      for (const comment of commentsGithub) {
        await handleAddComments(queryInterface, users, comment, issue?.id, "issue");
      }

      const pullRequestsOfIssue = pullRequests?.filter(pr => pr.issueId === issue.id);

      for (const pr of pullRequestsOfIssue) {
        const { data: commentsPr } = await octokit.rest.issues.listComments({
          owner,
          repo,
          issue_number: pr.githubId,
        });

        for (const commentPr of commentsPr) {
          await handleAddComments(queryInterface, users, commentPr, issue?.id, "deliverable", pr?.id);
        }
      }
    }
  } catch (error) {
    console.log("Failed to add comments from github", error.toString());
  }
}

module.exports = { up, down: async () => true };
