module.exports = {
  apps: [
    {
      name: 'abhina-api',
      script: 'dist/server.js',
      cwd: __dirname,
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      autorestart: true,
      max_memory_restart: '400M',
      env: {
        NODE_ENV: 'production'
      },
      time: true,
      out_file: './logs/api-out.log',
      error_file: './logs/api-error.log',
      merge_logs: true
    }
  ]
};
