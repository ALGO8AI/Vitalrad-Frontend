// @flow weak

let headerData: {
  'Content-Type': string,
  Authorization?: string,
} = {'Content-Type': 'application/json'}

let headerImage: {
  cache: string,
  contentType: string,
  processData: string,
  Authorization?: string,
} = {
  cache: 'false',
  contentType: 'false',
  processData: 'false',
}
export const headerConfig = {
  headerData: headerData,
  headerImage: headerImage,
}
