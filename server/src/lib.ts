import fetch from "node-fetch";
import fs from "fs";

type Credentials = {
  client_id: string;
  client_secret: string;
  code: string;
}

const requstGithubToken = (credentials: Credentials) =>
  fetch(`https://github.com/login/oauth/access_token`, {
    method: `POST`,
    headers: {
      "Content-Type": "application/json",
      Accept: `application/json`,
    },
    body: JSON.stringify(credentials),
  })
    .then((res) => res.json())
    .catch((err) => {
      throw new Error(JSON.stringify(err));
    });

const requestGithubUserAccount = (token: string) =>
  fetch(`https://api.github.com/user`, {
    headers: {
      Authorization: `token ${token}`,
    },
  })
    .then((res) => res.json())
    .catch((err) => {
      throw new Error(JSON.stringify(err));
    });

export const authorizeWithGithub = async (credentials: Credentials) => {
  const { access_token } = await requstGithubToken(credentials);
  const githubUser = await requestGithubUserAccount(access_token);
  return { ...githubUser, access_token };
};

export const uploadStream = (stream, path) =>
  new Promise((resolve, reject) => {
    stream.on('error', error => {
      if (stream.truncated) {
          fs.unlinkSync(path)
      }
      reject(error)
    }).on('end', resolve)
    .pipe(fs.createWriteStream(path))
  })

