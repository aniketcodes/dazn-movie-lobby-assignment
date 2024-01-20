import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from 'dotenv';
import { join } from 'path';
config({ path: join(__dirname, '../.env') });

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MoviesModule } from './movies/movies.module';

@Module({
  imports: [MongooseModule.forRoot(process.env.DB_URL), MoviesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
