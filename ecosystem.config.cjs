module.exports = {
  apps: [
    {
      name: 'explorer-app',
      script: 'npm',
      args: 'run start',
      cwd: __dirname,
      env: {
        NODE_ENV: 'production',
      },
      watch: false
    }
  ]
};
