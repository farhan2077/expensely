export const APP_NAME: string = "Expensely";
export const BASE_URL: string = "https://expensely-alpha.vercel.app"; // dont't include `/` at the end

export const SEO_TITLE: string = APP_NAME;
export const SEO_DESCRIPTION: string = "Manage shared expenses with Expensely";
export const SEO_KEYWORDS: string = "expense management";

export const BRAND_COLOR: string = "#2463EB"; // update it when css variables in `globals.css` file are updated
export const MAX_GROUP_LIMIT: number = 5;

export const EMPTY_MAIL_SUFFIX = "@empty.com";
export const EMPTY_MAIL = "empty_" + Date.now() + EMPTY_MAIL_SUFFIX;
