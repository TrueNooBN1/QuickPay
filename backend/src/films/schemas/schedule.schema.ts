import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Schedule {
  @Prop({
    type: String,
    unique: true,
    required: [true, 'Поле "id" должно быть заполнено'],
  })
  id: string;

  @Prop({
    type: Date,
    required: [true, 'Поле "daytime" должно быть заполнено'],
  })
  daytime: Date;

  @Prop({
    type: Number,
    required: [true, 'Поле "hall" должно быть заполнено'],
  })
  hall: number;

  @Prop({
    type: Number,
    required: [true, 'Поле "rows" должно быть заполнено'],
  })
  rows: number;

  @Prop({
    type: Number,
    required: [true, 'Поле "seats" должно быть заполнено'],
  })
  seats: number;

  @Prop({
    type: Number,
    required: [true, 'Поле "price" должно быть заполнено'],
  })
  price: number;

  @Prop([String])
  taken: string[];
}

export const scheduleSchema = SchemaFactory.createForClass(Schedule);

/*clear mongoose
import mongoose, {Schema} from "mongoose";
import { GetScheduleDTO } from "../dto/schedule.dto";

export const scheduleSchema = new Schema<GetScheduleDTO>({
  id:{
    type: String,
    unique: true,
    required: [true, 'Поле "id" должно быть заполнено'],
  },
  daytime:{
    type: Date,
    required: [true, 'Поле "daytime" должно быть заполнено'],
  },
  hall:{
    type: Number,
    required: [true, 'Поле "hall" должно быть заполнено'],
  },
  rows:{
    type: Number,
    required: [true, 'Поле "rows" должно быть заполнено'],
  },
  seats:{
    type: Number,
    required: [true, 'Поле "seats" должно быть заполнено'],
  },
  price:{
    type: Number,
    required: [true, 'Поле "price" должно быть заполнено'],
  },
  taken:{
    type: [String]
  }
});
*/
