/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config()

const development = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: true,
  extra: {
    ssl: {
      rejectUnauthorized: false
    }
  },
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
  ssl: true,
  extra: {
    ssl: {
      rejeitarUnauthorized: false
    }
  },
  logging: true,
  entities: ['dist/**/*.entity.ts'],
  migrations: ['dist/migrations/**/*.ts'],
  cli: {
    entitiesDir: 'dist/**',
    migrationsDir: 'dist/migrations/'
  }
}

console.log('========>>>>>>', process.env.NODE_ENV)
console.log('========>>>>>>|||||', production)

module.exports =
  process.env.NODE_ENV === 'production' ? production : development
