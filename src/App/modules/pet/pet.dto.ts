import { PartialType } from '@nestjs/mapped-types';

export class PetDto {
  name: string;
  age: number;
  pic: string;
}

export class UpdatePetDto extends PartialType(PetDto) {}
