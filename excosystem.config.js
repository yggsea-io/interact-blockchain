module.exports = {
    apps: [
      {
        name: "test",
        script: "src/task-solana/microworld/metadata/exportMDs.js",
        instances: 1,
        autorestart: true,
        max_memory_restart: "2000M",
        cron_restart: "*/5 * * * *",
        watch: false,
        time: true
      }
    ]
  };