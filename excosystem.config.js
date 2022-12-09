module.exports = {
    apps: [
      {
        name: "test",
        script: "src/task-avax/index.js",
        instances: 1,
        autorestart: true,
        max_memory_restart: "2000M",
        watch: false,
        time: true
      }
    ]
  };