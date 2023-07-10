import { Injectable, Logger } from '@nestjs/common';
import { Gauge } from 'prom-client';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { DBService, NETWORK_TYPE, OPERATION_TYPE, STATUS } from './database';

@Injectable()
export class OperationsMetricsService {
  private readonly logger = new Logger(OperationsMetricsService.name);
  private database: DBService;
  private syncInterval = 1000 * 30;

  constructor(
    @InjectMetric('lzevent_operations')
    public successGauge: Gauge<string>,
  ) {
    this.database = new DBService();

    this.updateCounters(STATUS.WAITING);
    this.updateCounters(STATUS.ERROR);
    this.updateCounters(STATUS.SUCCESS);
  }

  updateCounterByConfig = async (params: {
    type: OPERATION_TYPE;
    network: NETWORK_TYPE;
    status: STATUS;
  }) => {
    const { type, network, status } = params;

    const newCount = await this.database.getOperationsCount({
      type,
      network,
      status,
    });

    const from =
      type == OPERATION_TYPE.ONE_ETH ? NETWORK_TYPE.HARMONY : network;
    const to = type == OPERATION_TYPE.ETH_ONE ? NETWORK_TYPE.HARMONY : network;

    this.successGauge.set({ from, to, status }, newCount);
  };

  updateCounters = async (status: STATUS) => {
    try {
      await this.updateCounterByConfig({
        type: OPERATION_TYPE.ONE_ETH,
        network: NETWORK_TYPE.ETHEREUM,
        status,
      });

      await this.updateCounterByConfig({
        type: OPERATION_TYPE.ONE_ETH,
        network: NETWORK_TYPE.BINANCE,
        status,
      });

      await this.updateCounterByConfig({
        type: OPERATION_TYPE.ONE_ETH,
        network: NETWORK_TYPE.ARBITRUM,
        status,
      });

      await this.updateCounterByConfig({
        type: OPERATION_TYPE.ETH_ONE,
        network: NETWORK_TYPE.ETHEREUM,
        status,
      });

      await this.updateCounterByConfig({
        type: OPERATION_TYPE.ETH_ONE,
        network: NETWORK_TYPE.BINANCE,
        status,
      });

      await this.updateCounterByConfig({
        type: OPERATION_TYPE.ETH_ONE,
        network: NETWORK_TYPE.ARBITRUM,
        status,
      });
    } catch (e) {
      this.logger.error('updateCounters error', e);
    }

    setTimeout(this.updateCounters.bind(this, status), this.syncInterval);
  };

  getInfo() {
    return null;
  }
}
