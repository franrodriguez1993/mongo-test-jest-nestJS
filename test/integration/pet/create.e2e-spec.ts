import * as request from 'supertest';
import { petsDataList } from '../Data/pets.data';
import { ApiTestConfig } from '../Data/api.config';

describe('CREATE TESTS',  () => {
  let app;
  let dbConnection;
  let httpServer;

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
