const { DATABASE_URL, DATABASE_PORT, DATABASE_USER, DATABASE_PASS, DATABASE_NAME } = process.env;

module.exports = {
    type: "postgres",
    host: DATABASE_URL,
    port: DATABASE_PORT,
    username: DATABASE_USER,
    password: DATABASE_PASS,
    database: DATABASE_NAME,
    synchronize: true,
    logging: false,
    entities: ['./dist/**/*.entity.js']
}