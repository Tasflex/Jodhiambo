// PM2 process definition for the production server.
//   Start / reload:  pm2 startOrReload ecosystem.config.cjs && pm2 save
// Runs on Node 22 from /opt/node22 (the server's system Node is older and shared with other apps).
module.exports = {
  apps: [
    {
      name: "jodhiambo",
      cwd: __dirname,
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3200 -H 127.0.0.1",
      interpreter: "/opt/node22/bin/node",
      env: { NODE_ENV: "production" },
      max_memory_restart: "512M",
      time: true,
    },
  ],
};
