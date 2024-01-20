import * as mongoose from 'mongoose';
import { Movie } from '../interfaces/movies.interface';

export const MovieSchema = new mongoose.Schema<Movie>(
  {
    genre: {
      type: String,
    },
    name: {
      type: String,
    },
    rating: {
      type: Number,
    },
    streamingLink: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);
