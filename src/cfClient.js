import { createClient } from 'contentful'

// Create Contentful client
const cfClient = createClient({
  space: 'sfi2sq68mkop',
  accessToken:
    '00059aa044303d3b2973671432031b201266b5cd97ec710798938f4d69f270c9'
})

export default cfClient
