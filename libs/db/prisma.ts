// import { PrismaClient } from '@prisma/client'
// import { IS_PRODUCTION } from '../configs'

// let prismaClient: PrismaClient | null = null

// declare global {
//   // allow global `var` declarations

//   // eslint-disable-next-line no-var

//   var prisma: PrismaClient | undefined
// }

// export const prisma =
//   global.prisma || IS_PRODUCTION
//     ? new PrismaClient()
//     : new PrismaClient({
//         log: ['query'],
//       })

// if (process.env.NODE_ENV !== 'production') global.prisma = prisma

// src/server/db/client.ts
import { PrismaClient } from '@prisma/client'

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  })

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma
}
