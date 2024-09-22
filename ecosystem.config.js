module.exports = {
    apps: [
        {
        name: 'CSM',
        port: '3015',
        exec_mode: 'cluster',
        instances: 'max',
        script: './.output/server/index.mjs',
        }
    ]
}