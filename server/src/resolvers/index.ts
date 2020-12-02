
import { GraphQLScalarType, Kind, ValueNode } from "graphql";
import { authorizeWithGithub, uploadStream } from "../lib";
import path from "path";
import fetch from "node-fetch";

const serialize = (value) => new Date(value).toISOString();
const parseValue = (value) => new Date(value);
let users = [
  { githubLogin: "mHattrup", name: "Mike Hattrup" },
  { githubLogin: "gPlake", name: "Glen Plake" },
  { githubLogin: "sSchmidt", name: "Scot Schmidt" },
];

let _id = 0;

let photos = [
  {
    id: "1",
    name: "Dropping the Heart Chute",
    description: "The heart chute is one of my favorite chutes",
    category: "ACTION",
    githubUser: "gPlake",
    created: "1-2-1985",
  },
  {
    id: "2",
    name: "Enjoying the sunshine",
    category: "SELFIE",
    githubUser: "sSchmidt",
    created: "2018-04-15T19:09:57.308Z",
  },
  {
    id: "3",
    name: "Gunbarrel 25",
    description: "25 laps on gunbarrel today",
    category: "LANDSCAPE",
    githubUser: "sSchmidt",
    created: "3-28-1977",
  },
];

var tags = [
  { photoID: "1", userID: "gPlake" },
  { photoID: "2", userID: "sSchmidt" },
  { photoID: "2", userID: "mHattrup" },
  { photoID: "2", userID: "gPlake" },
];
const resolvers = {
  Query: {
    me: (parent, args, { currentUser }) => currentUser,
    totalPhotos: (parent, args, { db }) =>
      db.collection("photos").estimatedDocumentCount(),
    allPhotos: (parent, args, { db }) =>
      db.collection(`photos`).find().toArray(),
    totalUsers: (parent, args, { db }) =>
      db.collection(`users`).estimatedDocumentCount(),
    allUsers: (parent, args, { db }) => db.collection(`users`).find().toArray(),
    orderedMembers: () => [
      "mtsmfm",
      "pankona",
      "mpls104",
      "kachick",
      "geckour",
      "highwide",
      "nkmrh",
      "motorollerscalatron",
      "farmanlab",
      "elliekwon",
      "ujihisa",
      "motoshima1150",
    ],
  },

  Mutation: {
    async postPhoto(root, args, { db, currentUser, pubsub }) {
      if (!currentUser) {
        throw new Error("only an authorized user can post a photo");
      }

      const newPhoto = {
        ...args.input,
        userID: currentUser.githubLogin,
        created: new Date(),
      };

      const { insertedIds } = await db.collection("photos").insert(newPhoto);
      newPhoto.id = insertedIds[0];

      let toPath = path.join(
        __dirname, '..', 'assets', 'photos', `${newPhoto.id}.jpg`
      );

      const { stream } = args.input.file;
      await uploadStream(stream, toPath);

      pubsub.publish("photo-added", { newPhoto });

      return newPhoto;
    },

    async githubAuth(parent, { code }, { db }) {
      let {
        message,
        access_token,
        avatar_url,
        login,
        name,
      } = await authorizeWithGithub({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      });

      if (message) {
        throw new Error(message);
      }

      let latestUserInfo = {
        name,
        githubLogin: login,
        githubToken: access_token,
        avatar: avatar_url,
      };

      const {
        ops: [user],
      } = await db
        .collection(`users`)
        .replaceOne({ githubLogin: login }, latestUserInfo, {
          upsert: true,
        });

      return { user, token: access_token };
    },

    addFakeUsers: async (root, { count }, { db, pubsub }) => {
      const randomUserApi = `https://randomuser.me/api/?results=${count}`;

      const { results } = await fetch(randomUserApi).then((res) => res.json());

      const users = results.map((r) => ({
        githubLogin: r.login.username,
        name: `${r.name.first} ${r.name.last}`,
        avatar: r.picture.thumbnail,
        githubToken: r.login.sha1,
      }));

      await db.collection("users").insert(users);

      users.forEach((newUser) => {
        pubsub.publish("user-added",  {newUser} );
      });

      return users;
    },

    async fakeUserAuth(parent, { githubLogin }, { db }) {
      const user = await db.collection("users").findOne({ githubLogin });

      if (!user) {
        throw new Error("そんなユーザーはいない");
      }

      return {
        token: user.githubToken,
        user,
      };
    },
  },

  Subscription: {
    newPhoto: {
      subscribe: (parent, args, { pubsub }) =>
        pubsub.asyncIterator("photo-added"),
    },
    newUser: {
      subscribe: (parent, args, { pubsub }) =>
        pubsub.asyncIterator("user-added"),
    },
  },

  Photo: {
    id: (parent) => parent.id || parent._id,
    url: (parent) => `http://yoursite.com/img/${parent.id}.jpg`,
    postedBy: (parent, args, { db }) =>
      db.collection("users").findOne({ githubLogin: parent.userID }),
    taggedUsers: (parent) =>
      tags
        .filter((tag) => tag.photoID === parent.id)
        .map((tag) => tag.userID)
        .map((userId) => users.find((u) => u.githubLogin === userId)),
  },

  User: {
    postedPhotos: (parent) => {
      return photos.filter((p) => p.githubUser === parent.githubLogin);
    },
    inPhotos: (parent) =>
      tags
        .filter((tag) => tag.userID === parent.githubLogin)
        .map((tag) => tag.photoID)
        .map((photoID) => photos.find((p) => p.id === photoID)),
  },

  DateTime: new GraphQLScalarType({
    name: "DateTime",
    description: "A valid date time value",
    parseValue,
    serialize,
    parseLiteral: (ast: ValueNode) => {
      switch (ast.kind) {
      case Kind.STRING:
        return ast.value;
      default:
        return null;
      }
    }
  }),
};

export default resolvers
