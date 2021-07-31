import * as dotenv from 'dotenv'
import axios, { AxiosResponse } from 'axios'
import { TwitterClient } from 'twitter-api-client'

import { IWhiteList, ICriteria } from './types'
import { meetsAllCriteria, showUnmetCriteria, hasTweetedInThreeMonths } from './criteria'

dotenv.config({ path: './.env' })

const Twitter = new TwitterClient({
  apiKey: process.env.TWITTER_API_KEY!,
  apiSecret: process.env.TWITTER_API_KEY_SECRET!,
  accessToken: process.env.TWITTER_ACCESS_TOKEN!,
  accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET!,
})

async function getWhitelistedHandles(): Promise<string[] | undefined> {
  try {
    const response: AxiosResponse<Record<string, any>> = await axios.get(`https://api.github.com/gists/${process.env.WHITELIST_GIST_ID}`)
    return (JSON.parse(response.data.files[Object.keys(response.data.files)[0]].content) as IWhiteList).handles
  }
  catch(e: any) {
    console.error(e)
    return undefined
  }
}

async function getTwitterFriends(): Promise<Record<string, any>[] | undefined> {
  try {
    const response = await Twitter.accountsAndUsers.accountSettings()
    const screen_name = response.screen_name
    let friends = await Twitter.accountsAndUsers.friendsList({ screen_name, count: 200 })
    let users = friends.users
    while (friends.next_cursor !== 0) {
      friends = await Twitter.accountsAndUsers.friendsList({ screen_name, count: 200, cursor: friends.next_cursor })
      users = [...users, ...friends.users]
    }
    console.log(`${users.length} Twitter friends found`)
    return users
  }
  catch(e: any) {
    console.error(e)
    return undefined
  }
}

function unfollowInactiveUsers(friends: Record<string, any>[], whitelistedHandles: string[]): void {
  let friendsUnfollowed = 0

  friends.forEach(async (friend: Record<string, any>) => {
    if (!whitelistedHandles.includes(friend.screen_name)) {
      const criteria: ICriteria = {
        tweetedInThreeMonths: hasTweetedInThreeMonths(friend)
      }

      if (meetsAllCriteria(criteria)) {
        console.log(`Keep following @${friend.screen_name} (${friend.name}) because they meet the criteria`)
      }
      else {
        await Twitter.accountsAndUsers.friendshipsDestroy({ screen_name: friend.screen_name })
        friendsUnfollowed++
        console.log(`Unfollowing @${friend.screen_name} (${friend.name}) because they are not a whitelisted user, ${showUnmetCriteria(criteria)}`)
      }
    } else {
      console.log(`Skipping @${friend.screen_name} (${friend.name}) because they are a whitelisted user`)
    }
  })

  console.log(`${friendsUnfollowed} of ${friends.length} friends unfollowed (you are now following ${friends.length - friendsUnfollowed} accounts)`)
}

// Start of script
(async function(){
  const whitelistedHandles = await getWhitelistedHandles()
  if (!whitelistedHandles) process.exit() // Terminate the script if a connection to the GitHub gist cannot be established - otherwise we will have no list of whitelisted users and may accidentally unfollow a whitelisted user

  const twitterFriends = await getTwitterFriends()
  if (!twitterFriends) process.exit() // Terminate the script if we cannot get a list of friends from Twitter - no point in running the script anymore

  unfollowInactiveUsers(twitterFriends, whitelistedHandles)
})()