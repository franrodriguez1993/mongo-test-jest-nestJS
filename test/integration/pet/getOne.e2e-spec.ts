import { Connection } from 'mongoose';
import * as request from 'supertest';
import { petsDataList } from '../Data/pets.data';
import { ApiTestConfig } from '../Data/api.config';

describe('GET ONE TEST', () => {
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

  describe('Get one pet by id', () => {
    it('should return a pet by id', async () => {
      // GIVEN
      const newPet: any = petsDataList[0];
      // Insert a new pet in db:
      const petDb = await dbConnection.collection('pets').insertOne(newPet)
      if (!petDb.acknowledged) return;

      // WHEN
      const response = await request(httpServer).get(`/pet/${petDb.insertedId}`);

      //THEN
      expect(response.body.statusCode).toBe(200);
      expect(response.body.result.name).toEqual(newPet.name);
      expect(response.body.result.age).toEqual(newPet.age);
      expect(response.body.result.pic).toEqual(newPet.pic);
    });
  });
});
