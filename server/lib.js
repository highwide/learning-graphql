const fetch = require('node-fetch')
const fs = require('fs')

const requstGithubToken = credentials =>
  fetch(
    `https://github.com/login/oauth/access_token`,
    {
      method: `POST`,
      headers: {
        'Content-Type': 'application/json',
        Accept: `application/json`
      },
      body: JSON.stringify(credentials)
    }
  )
  .then(res => res.json())
  .catch(err => {
    throw new Error(JSON.stringify(err))
  })

const requestGithubUserAccount = token =>
  fetch(`https://api.github.com/user?access_token=${token}`)
    .then(res => res.json())
    .catch(err => {
      throw new Error(JSON.stringify(err))
    })

const authorizeWithGithub = async credentials => {
  const { access_token } = await requstGithubToken(credentials)
  const githubUser = await requestGithubUserAccount(access_token)
  return { ...githubUser, access_token }
}

module.exports = { authorizeWithGithub }
