import { Test } from '@nestjs/testing';
import { Connection } from 'mongoose';
import * as request from 'supertest';
import { AppModule } from '../../../src/app.module';
import { DatabaseService } from '../../../src/database/Database.service';
import { petsDataList } from '../Data/pets.data';
import { ValidationPipe } from '@nestjs/common';

describe('DELETE TESTS', () => {
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

  describe('Delete one pet by id', () => {
    it('should delete a pet', async () => {
      // GIVEN
      const newPet: any = petsDataList[0];
      // Insert a new pet in db and get it objectId:
      const petDb = await dbConnection.collection('pets').insertOne(newPet)
      if (!petDb.acknowledged) return;
      // WHEN
      const response = await request(httpServer).delete(`/pet/${petDb.insertedId}`);

      //THEN
      expect(response.status).toBe(200);
      expect(response.body.result).toEqual('Pet deleted');
    });
  });
});
