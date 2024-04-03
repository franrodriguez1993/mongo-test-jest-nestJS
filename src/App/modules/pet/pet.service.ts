import { Injectable } from '@nestjs/common';
import { PetDto, UpdatePetDto } from './pet.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Pet, PetDocument } from './pet.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class PetService {
  constructor(@InjectModel(Pet.name) private petModel: Model<PetDocument>) {}

  async create(petDto: PetDto) {
    return await this.petModel.create(petDto);
  }

  findAll() {
    return this.petModel.find({});
  }

  async findOne(id: string) {
    const pet = await this.petModel.findOne({ _id: id });
    return pet;
  }

  async updateOne(id: string, updatePetDto: UpdatePetDto) {
    const pet = await this.petModel.findByIdAndUpdate(id, updatePetDto, {
      new: true,
    });
    return pet;
  }

  async remove(id: string) {
    const del = await this.petModel.deleteOne({ _id: id });
    if (del.deletedCount !== 1) {
      return { msg: 'Pet not deleted' };
    }
    return 'Pet deleted';
  }
}
