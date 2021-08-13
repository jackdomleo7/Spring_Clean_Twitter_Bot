import { sub, differenceInMonths } from 'date-fns'

import { ICriteria } from './types'
import settings from '../../settings.json'

/***********/
/* HELPERS */
/***********/

export function meetsAllCriteria(criteria: ICriteria): boolean {
  for (let key in criteria) {
    if (typeof criteria[key] === 'string') return false // If a string is present, assume this criteria has not been met
  }
  return true
}

export function showUnmetCriteria(criteria: ICriteria): string {
  let unMetCriteria = []

  for (let key in criteria) {
    if (typeof criteria[key] === 'string') unMetCriteria.push(criteria[key])
  }

  return unMetCriteria.join(', ')
}


/***********/
/* CRITERIA */
/***********/

export function hasTweetedInXMonths(friend: Record<string, any>): boolean | string {
  const lastTweet = Date.parse(friend.status.created_at)
  const threeMonthsAgo = sub(new Date(), { months: settings.features.unfollowInactiveAccounts.criteria.tweetedInXMonths.no_of_months })
  if (differenceInMonths(lastTweet, threeMonthsAgo) >= 0) {
    return true
  }
  else {
    return `they haven't tweeted in ${settings.features.unfollowInactiveAccounts.criteria.tweetedInXMonths.no_of_months} ${settings.features.unfollowInactiveAccounts.criteria.tweetedInXMonths.no_of_months === 1 ? 'month' : 'months'}`
  }
}