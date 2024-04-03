import { Test } from '@nestjs/testing';
import { Connection } from 'mongoose';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { DatabaseService } from '../../src/database/Database.service';
import { petsDataList } from './Data/pets.data';
import { UpdatePetDto } from '../../src/App/modules/pet/pet.dto';

describe('pets controller', () => {
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

    httpServer = app.getHttpServer();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await dbConnection.collection('pets').deleteMany({});
  });

  /**  TEST  **/

  //GET ALL
  describe('get pets', () => {
    it('should return an array of pets', async () => {
      // GIVEN
      await dbConnection.collection('pets').insertOne(petsDataList[0]);

      // WHEN
      const response = await request(httpServer).get('/pet');

      //THEN
      expect(response.status).toBe(200);
    });
  });

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

  //GET ONE
  describe('Get one pet by id', () => {
    it('should return a pet by id', async () => {
      // GIVEN
      const newPet: any = petsDataList[0];
      // Insert a new pet in db and get it objectId:
      const newPetId = (await dbConnection.collection('pets').insertOne(newPet))
        .insertedId;
      //Assign _id converted in string to match with the response.
      newPet._id = newPetId.toHexString();

      // WHEN
      const response = await request(httpServer).get(`/pet/${newPetId}`);

      //THEN
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject(newPet);
    });
  });

  // UPDATE ONE
  describe('update pet by id', () => {
    it('Should update a pet successfully', async () => {
      // GIVEN
      const createPetDTO = petsDataList[0];
      const updatePetDTO: UpdatePetDto = petsDataList[1];
      // Insert a new pet in db and get it objectId:
      const newPetId = (
        await dbConnection.collection('pets').insertOne(createPetDTO)
      ).insertedId;

      // WHEN
      const response = await request(httpServer)
        .patch(`/pet/${newPetId}`)
        .send(updatePetDTO);

      // THEN
      expect(response.status).toBe(200);
      expect(response.body.name).toEqual(updatePetDTO.name);
      expect(response.body.age).toEqual(updatePetDTO.age);
      expect(response.body.pic).toEqual(updatePetDTO.pic);
    });
  });

  // DELETE
  describe('Delete one pet by id', () => {
    it('should delete a pet', async () => {
      // GIVEN
      const newPet: any = petsDataList[0];
      // Insert a new pet in db and get it objectId:
      const newPetId = (await dbConnection.collection('pets').insertOne(newPet))
        .insertedId;

      // WHEN
      const response = await request(httpServer).delete(`/pet/${newPetId}`);

      console.log(response.body);
      //THEN
      expect(response.status).toBe(200);
      expect(response.body.msg).toEqual('Pet deleted');
    });
  });
});
