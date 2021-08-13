import * as dotenv from 'dotenv'
import { TwitterClient } from 'twitter-api-client'

dotenv.config({ path: './.env' })

export const Twitter = new TwitterClient({
  apiKey: process.env.TWITTER_API_KEY!,
  apiSecret: process.env.TWITTER_API_KEY_SECRET!,
  accessToken: process.env.TWITTER_ACCESS_TOKEN!,
  accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET!,
})