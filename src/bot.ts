import * as dotenv from 'dotenv'
import axios, { AxiosResponse } from 'axios'

import { IWhiteList } from './types'

dotenv.config({ path: './.env' })

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

(async function(){
  const whitelistedHandles = await getWhitelistedHandles()

  // Terminate the script if a connection to the GitHub gist cannot be established - otherwise we will have no list of whitelisted users and may accidentally unfollow a whitelisted user
  if (!whitelistedHandles) process.exit()
  console.log('whitelisted handles:', whitelistedHandles)
})()