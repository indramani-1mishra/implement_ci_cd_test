module.exports = {
    apps: [
        {
            name: "backend-app",

            script: "server.js",

            instances: 1,

            exec_mode: "fork",

            env: {
                NODE_ENV: "production",
                PORT: 8000
            }
        }
    ]
};