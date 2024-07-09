const env = {
  DATABASE_URL: process.env.DATABASE_URL as string,
  DATABASE_AUTH_TOKEN: process.env.DATABASE_AUTH_TOKEN,
  NEXT_PUBLIC_UMAMI_WEBSITE_ID: process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID,
};

export default env;
