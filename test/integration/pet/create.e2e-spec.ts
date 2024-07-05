import { Test } from '@nestjs/testing';
import { Connection } from 'mongoose';
import * as request from 'supertest';
import { AppModule } from '../../../src/app.module';
import { DatabaseService } from '../../../src/database/Database.service';
import { petsDataList } from '../Data/pets.data';
import { ValidationPipe } from '@nestjs/common';

describe('CREATE TESTS', () => {
  let dbConnection: Connection;
  let httpServer: any;
  let app: any;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );
    await app.init();

    dbConnection = moduleRef
      .get<DatabaseService>(DatabaseService)
      .getDBHandle();

    httpServer = await app.getHttpServer();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await dbConnection.collection('pets').deleteMany({});
  });
  /**  TEST  **/

  // POST
  describe('create pet successfully', () => {
    it('should create a new pet in db', async () => {
      // GIVEN
      const petDTO = petsDataList[0];

      // WHEN
      const response = await request(httpServer).post('/pet').send(petDTO);

      // THEN
      expect(response.body.statusCode).toBe(201);
      expect(response.body.result.name).toEqual(petsDataList[0].name)
    });
  });

    describe('create pet: error 400 no name', () => {
    it('should create a new pet in db', async () => {
      // GIVEN
      const petDTO = petsDataList[0];

      // WHEN
      const response = await request(httpServer).post('/pet').send({age:petDTO.age,pic:petDTO.pic});

      // THEN
      expect(response.body.statusCode).toBe(400);
    });
  });
});
