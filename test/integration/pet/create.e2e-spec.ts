import { Test } from '@nestjs/testing';
import { Connection } from 'mongoose';
import * as request from 'supertest';
import { AppModule } from '../../../src/app.module';
import { DatabaseService } from '../../../src/database/Database.service';
import { petsDataList } from '../Data/pets.data';

describe('CREATE TESTS', () => {
  let dbConnection: Connection;
  let httpServer: any;
  let app: any;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
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
  describe('create pet', () => {
    it('should create a new pet in db', async () => {
      // GIVEN
      const petDTO = petsDataList[0];

      // WHEN
      const response = await request(httpServer).post('/pet').send(petDTO);

      // THEN
      expect(response.status).toBe(201);
    });
  });
});
