export interface IWhiteList {
  handles: string[]
}

export interface ICriteria { // If typeof === 'string', assume criteria has failed
  [key: string]: any;
  tweetedInXMonths: boolean | string
}