import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { authenticate } from '../plugin/authenticate'

export async function gameRoutes(fastfy: FastifyInstance){

    fastfy.get('/pools/:id/games', {
      onRequest: [authenticate],
    }, async (request) => {
        
      const getPoolParams = z.object({
        id: z.string(),
      })
      
      const { id } = getPoolParams.parse(request.params)

      const games = await prisma.game.findMany({
        // where: {
        //   id,
        // },
        orderBy: {
          date: 'desc'
        },
        include: {
          guesses: {
            where: {
              participant: {
                userId: request.user.sub,
                poolId: id,
              }
            }
          }
        }
      })

      return { 
        games: games.map(game => {
          return {
            ...game,
            guess: game.guesses.length > 0 ? game.guesses[0] : null,
            guesses: undefined
          }
        }) }
    })

}
