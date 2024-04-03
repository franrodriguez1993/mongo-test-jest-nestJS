import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
export type PetDocument = Pet & Document;

@Schema({
  versionKey: false,
  timestamps: {
    createdAt: true,
    updatedAt: true,
  },
})
export class Pet {
  @Prop({ required: true })
  name: string;
  @Prop({ default: 0 })
  age: number;
  @Prop({ default: '' })
  pic: string;
}

export const PetSchema = SchemaFactory.createForClass(Pet);
