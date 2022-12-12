module.exports = {
    apps: [
      {
        name: "acs-received",
        script: "src/task-avax/castle-crush/index.js",
        instances: 1,
        autorestart: true,
        max_memory_restart: "2000M",
        watch: false,
        time: true
      }
    ]
  };