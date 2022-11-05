import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const user = await prisma.user.create({
        data: {
            name: "John Doe",
            email: 'johndoe@gmail.com',
            googleId: 'TEBlsamdlagfdte',
            avatarUrl: 'https://github.com/diego3g.png'
        }
    })

    const pool = await prisma.pool.create({
        data: {
            title: 'Example Pool',
            code: 'BOL123',
            ownerId: user.id,

            participants: {
                create: {
                    userId: user.id
                }
            }
        }
    })

    await prisma.game.create({
        data: {
            date: new Date('2022-11-02T12:00:00.2012'),
            firstTeamCountryCode: 'DE',
            secondTeamCountryCode: 'BR',
        }
    })
    
    await prisma.game.create({
        data: {
            date: new Date('2022-11-03T16:00:00.2012'),
            firstTeamCountryCode: 'BR',
            secondTeamCountryCode: 'AR',

            guesses: {
                create: {
                    firstTeamPoints: 2,
                    secondTeamPoints: 1,

                    participant: {
                        connect: {
                            userId_poolId: {
                                userId: user.id,
                                poolId: pool.id
                            }
                        }
                    }
                }
            }
        }
    })

}

main()