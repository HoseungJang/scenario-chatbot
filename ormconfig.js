module.exports = {
    name: "default",
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: process.env.ORMCONFIG_PASSWORD,
    database: process.env.ORMCONFIG_DATABASE_NAME,
    synchronize: true,
    entities: [
        "src/entities/*.ts"
    ]
}