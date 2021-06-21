const resolvers = {
  Query: {
    totalPhotos: () => photos.length,
    allPhotos: (parent, args) => {
      args.after; //Javascript Date Object
    },
  },

  // Mutation and postPhoto resolver
  Mutation: {
    postPhoto(parent, args) {
      var newPhoto = {
        id: _id++,
        ...args.input,
        created: new Date(),
      };
      photos.push(newPhoto);
      return newPhoto;
    },
  },
  Photo: {
    url: (parent) => `http://yoursite.com/img/ ${parent.id} .jpg`,
    postedBy: (parent) => {
      return users.find((u) => u.githubLogin === parent.githubUser);
    },

    taggedUsers: (parent) =>
      tags
        // Returns an array of tags that only contain the current photo
        .filter((tag) => tag.photoID === parent.id)
        // Converts the array of tags into an array of userIDs
        .map((tag) => tag.userID)
        // Converts array of userIDs into an array of user objects
        .map((userID) => users.find((u) => u.githubLogin === userID)),
  },
  User: {
    postedPhotos: (parent) => {
      return photos.filter((p) => p.githubUser === parent.githubLogin);
    },
    inPhotos: (parent) =>
      tags
        // Returns an array of tags that only contain the current user
        .filter((tag) => tag.userID === parent.id)
        // Converts the array of tags into an array of photoIDs
        .map((tag) => tag.photoID)
        // Converts array of photoIDs into an array of photo objects
        .map((photoID) => photos.find((p) => p.id === photoID)),
  },
  DateTime: new GraphQLScalarType({
    name: "DateTime",
    description: "A valid date time value.",
    parseValue: (value) => new Date(value),
    serialize: (value) => new Date(value).toISOString(),
    parseLiteral: (ast) => ast.value,
  }),
};
