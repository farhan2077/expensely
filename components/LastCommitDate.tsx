import env from "@/env";

async function fetchLastCommitDate() {
  const owner = env.GITHUB_REPO_OWNER;
  const repo = env.GITHUB_REPO_NAME;
  const branch = "main";
  const perPage = 1;
  const token = env.GITHUB_REPO_PAT;

  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/commits?sha=${branch}&per_page=${perPage}`,
      {
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API responded with status: ${response.status}`);
    }

    const data = await response.json();
    const commitDate = data[0].commit.committer.date;

    return commitDate;
  } catch (error) {
    console.error("Error fetching last commit date:", error);
  }
}

export default async function LastCommitDate() {
  const lastCommitDate = await fetchLastCommitDate();

  if (lastCommitDate) {
    const bdTime = new Date(lastCommitDate).toLocaleString("en-US", {
      timeZone: "Asia/Dhaka",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    // ARTIFICIAL DELAY FOR TESTING
    // await new Promise((resolve) => setTimeout(resolve, 5000));

    return <p>Last updated: {bdTime}</p>;
  } else {
    return <p>No commit data available</p>;
  }
}
