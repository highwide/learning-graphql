module.exports = {
  projects: {
    app: {
      documents: ["./src/**/!(*.d).{js,jsx}"],
      schema: "http://localhost:4000/graphql",
    },
  },
};
