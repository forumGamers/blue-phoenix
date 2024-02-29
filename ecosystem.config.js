module.exports = {
  apps: [
    {
      name: "chat-services",
      script: "./dist/main.js",
      instances: 1,
      autoRestart: true,
    },
  ],
};
