[![Schedule bot monthly](https://github.com/jackdomleo7/Spring_Clean_Twitter_Bot/actions/workflows/cron-build.yml/badge.svg?branch=main)](https://github.com/jackdomleo7/Spring_Clean_Twitter_Bot/actions/workflows/cron-build.yml)

# Spring Clean Twitter Bot
A Twitter bot to automatically clean up my Twitter account.

## Inspiration

It has become evident that manually maintaining my Twitter account is very time-consuming and boring. For example, I don't like following inactive accounts (because what's the point), so I have decided to create a Twitter bot that will clean up certain things for me. I have made it future-proof so I can add more features and criteria as and when the ideas arise.

## How it works

This is a script that runs on a GitHub Action workflow, scheduled to build and run on the first day of each month (it can also be run manually from your local machine). It will go through all the features and criteria listed to clean up your Twitter account.

I have made this so that it can be a template or forked by anyone wanting to try it out.

### Technology

- TypeScript
- GitHub Actions & cron scheduling
- Twitter API
- GitHub Gists
- Encrypted secrets (dotenv)

### Features & Criteria

This project comes with a `settings.json` file that is useful for debugging and configuring the project.

'Features' are a piece of functionality, and 'criteria' are a checklist for something to meet a feature.

#### Feature 1: Unfollow inactive accounts

The script will automatically unfollow inactive users based on the criteria set below. I have made it so you can create a list of whitelisted users that will never be unfollowed (typically your friends & family or seasonal accounts like Hacktoberfest). Having a public list of whitelisted may be problematic, so I have a private GitHub Gist with a JSON file of an array of whitelisted users, which the script will then retrieve.

<small>As a disclaimer, this is not a growth hacking technique, but that will help me clean up my Twitter profile. I don't feel I have to follow everyone who follows me and I only want to follow accounts that are active.</small>

Criteria:
  - Someone who hasn't tweeted in 3 months

---

## Development

Run the script in development mode
```bash
npm run dev
```

Build the project for production
```
npm run build
```

---

## Create your own Spring Clean Twitter Bot

You can easily start using this on your own Twitter account by clicking "Use this template" or forking this repository and following the steps below.

### Prerequisites

- Node >= v12
- npm >= v7 (v6 will still work but v7 is desired since the `package-lock.json` is generated using lockfile v2 which is a new feature of npm v7)

### Steps

These steps are with the assumption that you use this template and do not add or remove any features. However, feel free to do what you like with your own bot. However, be cautious because this will run directly on your Twitter account, so if you get anything wrong, it could get ugly. I recommend creating a new Twitter account purely for development, then enter your own credentials when you are comfortable.

1. Use this repository as a template, clone it locally and run `npm i`
2. Edit my details to your details in `package.json`, `README` & `src/settings.json`
3. Create a `.env` file in the root folder. This file is ignored from git for security reasons since we'll be storing API keys and access tokens. Since this is ignored from git, your GitHub action won't have any keys and tokens to read. So, as well as adding them to a git ignored `.env` file, you'll also want to add these keys and tokens to your [repository's secrets](https://docs.github.com/en/actions/reference/encrypted-secrets#creating-encrypted-secrets-for-a-repository). Add the following keys to the file:
   - `WHITELIST_GIST_ID`
   - `TWITTER_API_KEY`
   - `TWITTER_API_KEY_SECRET`
   - `TWITTER_ACCESS_TOKEN`
   - `TWITTER_ACCESS_TOKEN_SECRET`
4. Navigate to [https://developer.twitter.com](https://developer.twitter.com) and sign up for a developer account. Create an app, call it something like "<code>${Your handle}</code> Spring Clean Twitter Bot", then go to settings and enable "Read and Write access". Then you will be presented with an API Key, an API Key Secret, a Bearer Token, an Access Token and an Access Token Secret. Copy and paste these to your `.env` file and add to your repository secrets (you don't need the bearer token).
5. Navigate to [https://gist.github.com](https://gist.github.com) and create a new gist with a file called `account-whitelist.json` and fill it with the following (you can add an array of strings of whitelisted user Twitter handles to the `handles` property - do not prefix with "@"), then click "Create secret gist". After creating the secret gist, get the gist ID from the url and add this to the `WHITELIST_GIST_ID` variable in your `.env` file and your repository's secret.
```json
{
  "handles": [
    "jackdomleo7"
  ]
}
```
6. Run the script

When you push your code to GitHub, it will automatically create a GitHub Action because of the `.github/workflows/cron-build.yml` file. If you're uncomfortable with this and would rather run the script manually, either remove the file or disable the workflow.

---

Created by [Jack Domleo](https://github.com/jackdomleo7/Spring_Clean_Twitter_Bot)
