/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config()

const development = {
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

const production = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  extra: {
    ssl: true
  },
  logging: true,
  entities: ['dist/**/*.entity.ts'],
  migrations: ['dist/migrations/**/*.ts'],
  cli: {
    entitiesDir: 'dist/**',
    migrationsDir: 'dist/migrations/'
  }
}

module.exports =
  process.env.NODE_ENV === 'production' ? production : development
