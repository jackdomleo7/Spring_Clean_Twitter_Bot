# Spring Clean Twitter Bot
A Twitter bot to automatically unfollow inactive accounts.

## Inspiration

It has become evident that I am following a lot of Twitter accounts, a lot of which are inactive. It gets tiring having to manually unfollow accounts. Having a bot to do this for me every so often will be useful and keep my Twitter nice & clean.

## How it works

This is a script that runs on a serverless function every month. It retrieves all your followers, goes through them one-by-one and will unfollow them if they match certain criteria (see below). It uses the GitHub API to retrieve a private Gist of whitelisted users to never unfollow.

### Technology

- TypeScript
- Netlify Serverless Functions
- Twitter API
- GitHub API? (For retrieving private gist of JSON whitelisted users)

### What accounts will be unfollowed?

As a disclaimer, this is not a growth hacking technique, but a project to help improve my skills, add a project to my portfolio and to help clean up my Twitter profile. I don't feel I have to follow everyone who follows me and I only want to follow accounts that are active.

- **Inactive accounts**
  - Someone who hasn't tweeted in 3 months

## Setup

**IMPORTANT** - Not currently ready to be forked... coming soon.

### Prerequisites

- Node >= v14
- npm >= v7 (v6 will still work but v7 is desired since the `package-lock.json` is generated using lockfile v2 which is a new feature of npm v7)

1. Create a `.env` file in the root folder. This file is ignored from git for security reasons since we'll be storing API keys and access tokens. Add the following keys to the file:
   - `WHITELIST_GIST_ID`
   - `GITHUB_API_KEY`
   - `TWITTER_CONSUMER_KEY`
   - `TWITTER_CONSUMER_SECRET`
   - `TWITTER_ACCESS_TOKEN`
   - `TWITTER_ACCESS_TOKEN_SECRET`