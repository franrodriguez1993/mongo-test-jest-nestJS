import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  Param,
  Patch,
  HttpStatus,
} from '@nestjs/common';
import { PetService } from './pet.service';
import { PetDto, UpdatePetDto } from './pet.dto';

@Controller('pet')
export class PetController {
  constructor(private readonly petService: PetService) {}

  @Post()
  async create(@Body() createPetDto: PetDto) {
    const data = await this.petService.create(createPetDto);
    return {statusCode:HttpStatus.CREATED,result:data}
  }

  @Get()
 async findAll() {
    const data = await this.petService.findAll();
    return {statusCode:HttpStatus.OK,result:data}
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.petService.findOne(id);
    return {statusCode:HttpStatus.OK,result:data}
  }

  @Patch(':id')
  async updateOne(@Param('id') id: string, @Body() dto: UpdatePetDto) {
    const data = await this.petService.updateOne(id, dto);
    return {statusCode:HttpStatus.OK,result:data}
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const data = await this.petService.remove(id);
    return {
      statusCode: HttpStatus.OK,
      result:data
    }
  }
}
