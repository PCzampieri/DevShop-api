/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config()

module.exports = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  logging: true,
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/**/*.ts'],
  cli: {
    entitiesDir: 'src/**',
    migrationsDir: 'src/migrations/'
  }
}
