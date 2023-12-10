//make a database for testing!
//Everytime we run tets, clean up data
//we must call request like we do with postman
/**
  How to open prisma studio on "TEST" database ? 
  npx dotenv -e .env.test -- prisma studio
  How to open prisma studio on "DEV" database ? 
  npx dotenv -e .env -- prisma studio
*/
import {Test} from '@nestjs/testing'
import { AppModule} from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import {PrismaService} from '../src/prisma/prisma.service'

const PORT = 3002
describe('App EndToEnd tests', () => {
  let app: INestApplication
  let prismaService: PrismaService
  beforeAll(async () => {
    const appModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()
    app = appModule.createNestApplication()
    app.useGlobalPipes (new ValidationPipe())
    await app.init()
    await app.listen(PORT)
    prismaService = app.get(PrismaService)
    await prismaService.cleanDatabase()
    })

  afterAll(async () => {
      app.close()
    })
  it.todo('ok')  
}) 
describe('Test Authentication', () => {
  describe('Register', () => {
    it.todo('should Register')
  })
  describe('Login', () => {
    it.todo('should Login')
  })
}) 
