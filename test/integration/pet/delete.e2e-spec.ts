import { Test } from '@nestjs/testing';
import { Connection } from 'mongoose';
import * as request from 'supertest';
import { AppModule } from '../../../src/app.module';
import { DatabaseService } from '../../../src/database/Database.service';
import { petsDataList } from '../Data/pets.data';

describe('DELETE TESTS', () => {
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

  describe('Delete one pet by id', () => {
    it('should delete a pet', async () => {
      // GIVEN
      const newPet: any = petsDataList[0];
      // Insert a new pet in db and get it objectId:
      const newPetId = (await dbConnection.collection('pets').insertOne(newPet))
        .insertedId;

      // WHEN
      const response = await request(httpServer).delete(`/pet/${newPetId}`);

      //THEN
      expect(response.status).toBe(200);
      expect(response.body.msg).toEqual('Pet deleted');
    });
  });
});
