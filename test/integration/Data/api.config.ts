import { Test } from "@nestjs/testing";
import { AppModule } from "../../../src/app.module";
import { ValidationPipe } from "@nestjs/common";
import { Connection } from "mongoose";
import { DatabaseService } from "@database/Database.service";

export class ApiTestConfig {
  dbConnectionTest: Connection;
  httpServerTest: any;
  appTest: any;

  async init() {
     const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    this.appTest = moduleRef.createNestApplication();
    this.appTest.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );
    await this.appTest.init();

    this.dbConnectionTest = moduleRef
      .get<DatabaseService>(DatabaseService)
      .getDBHandle();

    this.httpServerTest = await this.appTest.getHttpServer();

    return  {dbConnectionTest:this.dbConnectionTest,httpServerTest:this.httpServerTest,appTest:this.appTest}
  }

}