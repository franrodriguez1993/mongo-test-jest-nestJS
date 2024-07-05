import { Connection } from 'mongoose';
import * as request from 'supertest';
import { petsDataList } from '../Data/pets.data';
import { UpdatePetDto } from '../../../src/App/modules/pet/pet.dto';
import { ApiTestConfig } from '../Data/api.config';

describe('UPDATE ONE TEST', () => {
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

  // // UPDATE ONE
  describe('update pet by id', () => {
    it('Should update a pet successfully', async () => {
      // GIVEN
      const createPetDTO = petsDataList[0];
      const updatePetDTO: UpdatePetDto = petsDataList[1];
      // Insert a new pet in db and get it objectId:
      const petDb = await dbConnection.collection('pets').insertOne(createPetDTO)
      if (!petDb.acknowledged) return;

      // WHEN
      const response = await request(httpServer)
        .patch(`/pet/${petDb.insertedId}`)
        .send(updatePetDTO);

      // THEN
      expect(response.body.statusCode).toBe(200);
      expect(response.body.result.name).toEqual(updatePetDTO.name);
      expect(response.body.result.age).toEqual(updatePetDTO.age);
      expect(response.body.result.pic).toEqual(updatePetDTO.pic);
    });
  });
});
