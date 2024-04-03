import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import helmet from 'helmet';
import { ConfigModule } from '@nestjs/config';
import { MongoConfigModule } from './database/MongoConfig.module';
import { PetModule } from './App/modules/pet/pet.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongoConfigModule,
    PetModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(helmet()).forRoutes('*');
  }
}
