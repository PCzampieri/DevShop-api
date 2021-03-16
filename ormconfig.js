/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config()

const extra = {
  ssl: {
    rejectUnauthorized: false
  }
}

module.exports = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'development' ? false : true,
  extra: process.env.NODE_ENV === 'development' ? {} : extra,
  logging: true,
  entities: [
    process.env.NODE_ENV === 'development'
      ? 'src/**/*.entity.ts'
      : 'dist/**/*.entity.js'
  ],
  migrations: [
    process.env.NODE_ENV === 'development'
      ? 'src/migrations/**/*.ts'
      : 'dist/migrations/**/*.js'
  ],
  cli: {
    entitiesDir: process.env.NODE_ENV === 'development' ? 'src/**' : 'dist/**',
    migrationsDir:
      process.env.NODE_ENV === 'development'
        ? 'src/migrations/'
        : 'dist/migrations/'
  }
}
