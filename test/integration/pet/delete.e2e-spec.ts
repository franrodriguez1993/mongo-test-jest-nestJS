import { Connection } from 'mongoose';
import * as request from 'supertest';
import { petsDataList } from '../Data/pets.data';
import { ApiTestConfig } from '../Data/api.config';

describe('DELETE TESTS', () => {
  let dbConnection: Connection;
  let httpServer: any;
  let app: any;

  beforeAll(async () => {
    const { appTest, dbConnectionTest, httpServerTest } = await new ApiTestConfig().init()
    app = appTest;
    dbConnection = dbConnectionTest;
    httpServer = httpServerTest;
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
