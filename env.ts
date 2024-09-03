const env = {
  DATABASE_URL: process.env.DATABASE_URL as string,
  DATABASE_AUTH_TOKEN: process.env.DATABASE_AUTH_TOKEN,
  NEXT_PUBLIC_UMAMI_WEBSITE_ID: process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID,
  EMAIL_FROM: process.env.EMAIL_FROM as string,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  GITHUB_REPO_NAME: process.env.GITHUB_REPO_NAME,
  GITHUB_REPO_OWNER: process.env.GITHUB_REPO_OWNER,
  GITHUB_REPO_PAT: process.env.GITHUB_REPO_PAT,
};

export default env;
