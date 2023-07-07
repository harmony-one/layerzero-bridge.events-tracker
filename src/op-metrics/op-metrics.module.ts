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
      name: 'operations_hmy_to_eth_success_gauge',
      help: 'Harmony to Ethereum success operations count',
    }),
    makeGaugeProvider({
      name: 'operations_hmy_to_bsc_success_gauge',
      help: 'Harmony to Bsc success operations count',
    }),
    makeGaugeProvider({
      name: 'operations_hmy_to_arb_success_gauge',
      help: 'Harmony to Arbitrum success operations count',
    }),
    makeGaugeProvider({
      name: 'operations_eth_to_hmy_success_gauge',
      help: 'Ethereum to Harmony success operations count',
    }),
    makeGaugeProvider({
      name: 'operations_bsc_to_hmy_success_gauge',
      help: 'Bsc to Harmony success operations count',
    }),
    makeGaugeProvider({
      name: 'operations_arb_to_hmy_success_gauge',
      help: 'Arbitrum to Harmony success operations count',
    }),
  ],
  exports: [OperationsMetricsService],
  controllers: [OperationsMetricsController],
})
export class OperationsMetricsModule {}
