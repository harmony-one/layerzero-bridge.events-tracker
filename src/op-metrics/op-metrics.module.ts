import { Module } from '@nestjs/common';
import { OperationsMetricsService } from './op-metrics.service';
import { ConfigModule } from '@nestjs/config';
import { OperationsMetricsController } from './op-metrics.controller';
import { makeGaugeProvider } from '@willsoto/nestjs-prometheus';

@Module({
  imports: [ConfigModule],
  providers: [
    OperationsMetricsService,
    makeGaugeProvider({
      name: 'lzevent_operations',
      help: 'successful operations',
      labelNames: ['from', 'to', 'status'],
    }),
  ],
  exports: [OperationsMetricsService],
  controllers: [OperationsMetricsController],
})
export class OperationsMetricsModule {}
