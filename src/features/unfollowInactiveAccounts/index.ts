import * as dotenv from 'dotenv'
import logSymbols from 'log-symbols'
import { AccountSettings, FriendsList } from 'twitter-api-client'
import { User } from 'twitter-api-client/dist/interfaces/types/FriendsListTypes'

import { meetsAllCriteria, showUnmetCriteria, hasTweetedInXMonths } from './criteria'
import { IWhiteList, ICriteria } from './types'

import { Twitter, GitHub } from '../../config'
import settings from '../../settings.json'
dotenv.config({ path: './.env' })

async function getWhitelistedHandles(): Promise<string[]> {
  try {
    const gist = await GitHub.rest.gists.get({ gist_id: process.env.WHITELIST_GIST_ID! })
    const handles = (JSON.parse(gist.data.files!['account-whitelist.json']!.content!) as IWhiteList).handles
    settings.features.unfollowInactiveAccounts.show_logging.whitelisted_handles.found && console.log(logSymbols.info, `${handles.length} whitelisted handles found`)
    return handles
  }
  catch(err: unknown) {
    console.error(err)
    return []
  }
}

async function getTwitterFriends(): Promise<User[]> {
  // Get my account settings
  let myAccount: AccountSettings;
  try {
    myAccount = await Twitter.accountsAndUsers.accountSettings()
  }
  catch(err: unknown) {
    console.error(err)
    return []
  }

  // Get all accounts I follow
  let friends: FriendsList;
  try {
    friends = await Twitter.accountsAndUsers.friendsList({ screen_name: myAccount.screen_name, count: 200 }) // Max page size = 200
  }
  catch(err: unknown) {
    console.error(err)
    return []
  }
  let allFriends: User[] = friends.users
  while (friends.next_cursor !== 0) {
    try {
      friends = await Twitter.accountsAndUsers.friendsList({ screen_name: myAccount.screen_name, count: 200, cursor: friends.next_cursor })
      allFriends = [...allFriends, ...friends.users]
    }
    catch(err: unknown) {
      console.log(logSymbols.error, `There was an error trying to retrieve the next page of friends, but was able to retrieve ${allFriends.length} of your friends, so will resume with these for now`)
      console.error(err)
      break
    }
  }

  // Summary and return all friends that were found
  settings.features.unfollowInactiveAccounts.show_logging.friends.found && console.log(logSymbols.info, `${allFriends.length} Twitter friends found`)
  return allFriends
}

async function unfollow(friends: User[], whitelistedHandles: string[]): Promise<void> {
  let friendsUnfollowed = 0

  await Promise.all(
    friends.map(async (friend: User) => {
      if (!whitelistedHandles.includes(friend.screen_name)) {
        const criteria: ICriteria = {
          tweetedInXMonths: hasTweetedInXMonths(friend)
        }
  
        if (meetsAllCriteria(criteria)) {
          settings.features.unfollowInactiveAccounts.show_logging.friends.kept && console.log(`Keep following @${friend.screen_name} (${friend.name}) because they meet the criteria`)
        }
        else {
          try {
            if (settings.features.unfollowInactiveAccounts.actually_unfollow_accounts) {
              await Twitter.accountsAndUsers.friendshipsDestroy({ screen_name: friend.screen_name })
            }
            else {
              await setTimeout(() => {}, 5000) // Mocking the asynchronous API call during debugging - wait 5 seconds
            }
  
            friendsUnfollowed++
            settings.features.unfollowInactiveAccounts.show_logging.friends.unfollowed && console.log(`Unfollowing @${friend.screen_name} (${friend.name}) because they are not a whitelisted user, ${showUnmetCriteria(criteria)}`)
          }
          catch(err: unknown) {
            console.error(err)
          }
        }
      } else {
        settings.features.unfollowInactiveAccounts.show_logging.friends.whitelisted && console.log(`Skipping @${friend.screen_name} (${friend.name}) because they are a whitelisted user`)
      }
    })
  )

  settings.features.unfollowInactiveAccounts.show_logging.friends.summary && console.log(logSymbols.success, `${friendsUnfollowed} of ${friends.length} friends unfollowed (you are now following ${friends.length - friendsUnfollowed} accounts)`)
}

export default async function unfollowInactiveAccounts(): Promise<void> {
  const whitelistedHandles = await getWhitelistedHandles()
  if (whitelistedHandles.length === 0) {
    // Skip this feature if a connection to the GitHub gist cannot be established - otherwise we will have no list of whitelisted users and may accidentally unfollow a whitelisted user
    console.log(logSymbols.error, 'Skipping unfollowInactiveAccounts feature because something went wrong whilst retrieving the whitelisted users')
  }
  else {
    const twitterFriends = await getTwitterFriends()
    if (twitterFriends.length === 0) {
      // Skip this feature if we cannot get a list of friends from Twitter - no point in proceeding with the feature
      console.log(logSymbols.error, 'Skipping unfollowInactiveAccounts feature because something went wrong whilst retrieving your Twitter friends')
    }
    else {
      await unfollow(twitterFriends, whitelistedHandles)
    }
  }
}