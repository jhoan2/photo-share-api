const { authorizeWithGithub } = require("../lib");
const fetch = require("node-fetch");

module.exports = {
  postPhoto(parent, args) {
    var newPhoto = {
      id: _id++,
      ...args.input,
      created: new Date(),
    };
    photos.push(newPhoto);
    return newPhoto;
  },

  async githubAuth(parent, { code }, { db }) {
    //1. Obtain data from github
    let { message, access_token, avatar_url, login, name } =
      await authorizeWithGithub({
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        code,
      });
    // 2. If there is a message, something went wrong
    if (message) {
      throw new Error(message);
    }
    // 3. Package the results into a single object
    let latestUserInfo = {
      name,
      githubLogin: login,
      githubToken: access_token,
      avatar: avatar_url,
    };
    //4. Add or update the record with the new information
    const {
      ops: [user],
    } = await db
      .collection("users")
      .replaceOne({ githubLogin: login }, latestUserInfo, { upsert: true });
    //5. Return user data and their token
    return { user, token: access_token };
  },
};
