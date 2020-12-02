module.exports = {
  projects: {
    app: {
      documents: ["./src/**/!(*.d).{ts,tsx}"],
      schema: "http://localhost:4000/graphql",
    },
  },
};
