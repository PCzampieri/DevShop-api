/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config()

module.exports = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  logging: true,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/migrations/**/*.js'],
  cli: {
    entitiesDir: 'src/**',
    migrationsDir: 'src/migrations/'
  }
}
