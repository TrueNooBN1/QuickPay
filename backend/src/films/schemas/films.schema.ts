import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schedule, scheduleSchema } from './schedule.schema';

@Schema()
export class Film {
  @Prop({
    type: String,
    unique: true,
    required: [true, 'Поле "id" должно быть заполнено'],
  })
  id: string;

  @Prop({
    type: Number,
    required: [true, 'Поле "rating" должно быть заполнено'],
  })
  rating: number;

  @Prop({
    type: String,
    required: [true, 'Поле "director" должно быть заполнено'],
  })
  director: string;

  @Prop({
    type: [String],
    required: [true, 'Поле "tags" должно быть заполнено'],
  })
  tags: string;

  @Prop({
    type: String,
    required: [true, 'Поле "image" должно быть заполнено'],
  })
  image: string;

  @Prop({
    type: String,
    required: [true, 'Поле "cover" должно быть заполнено'],
  })
  cover: string;

  @Prop({
    type: String,
    required: [true, 'Поле "title" должно быть заполнено'],
  })
  title: string;

  @Prop({
    type: String,
    required: [true, 'Поле "about" должно быть заполнено'],
  })
  about: string;

  @Prop({
    type: String,
    required: [true, 'Поле "description" должно быть заполнено'],
  })
  description: string;

  @Prop([scheduleSchema])
  schedule: Schedule[];
}

export const filmSchema = SchemaFactory.createForClass(Film);
filmSchema.index({ id: 1 }, { unique: true });

/*//clear mongoose
import mongoose, {Schema} from "mongoose";
import { GetFilmDTO } from "src/films/dto/films.dto";
import { scheduleSchema } from "./schedule.schema";

export const filmSchema = new Schema<GetFilmDTO>({
  id:{
    type: String,
    unique: true,
    required: [true, 'Поле "id" должно быть заполнено'],
  },
  rating:{
    type: Number,
    required: [true, 'Поле "rating" должно быть заполнено'],
  },
  director:{
    type: String,
    required: [true, 'Поле "director" должно быть заполнено'],
  },
  tags:{
    type: [String],
    required: [true, 'Поле "tags" должно быть заполнено'],
  },
  image:{
    type: String,
    required: [true, 'Поле "image" должно быть заполнено'],
  },
  cover:{
    type: String,
    required: [true, 'Поле "cover" должно быть заполнено'],
  },
  title:{
    type: String,
    required: [true, 'Поле "title" должно быть заполнено'],
  },
  about:{
    type: String,
    required: [true, 'Поле "about" должно быть заполнено'],
  },
  description:{
    type: String,
    required: [true, 'Поле "description" должно быть заполнено'],
  },
  schedule:{
    type: scheduleSchema
  }
})
filmSchema.index({ id: 1 }, { unique: true });
 
export default mongoose.model<GetFilmDTO>('films', filmSchema);
*/
