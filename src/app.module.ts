import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './config';
import entities from './typeorm';
import { TransferTrackerModule } from './transfer-tracker/transfer-tracker.module';
import { Web3Module } from 'nest-web3';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { OperationsMetricsModule } from './op-metrics/op-metrics.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    Web3Module.forRootAsync({
      useFactory: (configService: ConfigService) => [
        configService.get('hmy'),
        configService.get('eth'),
        configService.get('bsc'),
      ],
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: entities,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    Web3Module,
    TransferTrackerModule,
    OperationsMetricsModule,
    PrometheusModule.register(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
