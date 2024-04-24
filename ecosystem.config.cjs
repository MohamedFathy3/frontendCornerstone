module.exports = {
    apps: [
        {
        name: 'CSM',
        port: '4567',
        exec_mode: 'cluster',
        instances: 'max',
        script: './.output/server/index.mjs',
        }
    ]
}