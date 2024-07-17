/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Probot} app
 */
export default (app) => {
  // Your code here
  app.log.info("Yay, the app was loaded!");

  app.on("issues.opened", async (context) => {
    const issueComment = context.issue({
      body: "Thanks for opening this issue!",
    });
    return context.octokit.issues.createComment(issueComment);
  });

  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
};

module.exports = (app) => {
  app.on(['pull_request.opened', 'pull_request.synchronize', 'pull_request.closed'], async (context) => {
    const { action, pull_request } = context.payload;
    const repo = context.repo();

    let comment;
    if (action === 'opened' || action === 'synchronize') {
      comment = `Deployment for PR #${pull_request.number} has started.\n\nURL: http://localhost`;
    } else if (action === 'closed') {
      comment = `Deployment for PR #${pull_request.number} has been cleaned up.`;
    }

    return context.octokit.issues.createComment(context.issue({ body: comment }));
  });
};
