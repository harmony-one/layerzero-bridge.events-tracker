import { Injectable, Logger } from '@nestjs/common';
import { Gauge } from 'prom-client';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { DBService, NETWORK_TYPE, OPERATION_TYPE, STATUS } from './database';

enum CHAIN {
  BSC = 'bsc',
  ETH = 'eth',
  HMY = 'hmy',
}

@Injectable()
export class OperationsMetricsService {
  private readonly logger = new Logger(OperationsMetricsService.name);
  private database: DBService;
  private syncInterval = 1000 * 30;

  constructor(
    @InjectMetric('operations_hmy_to_eth_success_gauge')
    public hmyToEthSuccessGauge: Gauge<string>,
    @InjectMetric('operations_hmy_to_bsc_success_gauge')
    public hmyToBscSuccessGauge: Gauge<string>,
    @InjectMetric('operations_hmy_to_arb_success_gauge')
    public hmyToArbSuccessGauge: Gauge<string>,
    @InjectMetric('operations_eth_to_hmy_success_gauge')
    public ethToHmySuccessGauge: Gauge<string>,
    @InjectMetric('operations_bsc_to_hmy_success_gauge')
    public bscToHmySuccessGauge: Gauge<string>,
    @InjectMetric('operations_arb_to_hmy_success_gauge')
    public arbToHmySuccessGauge: Gauge<string>,
  ) {
    this.database = new DBService();

    this.updateCounters();
  }

  updateCounterByConfig = async (params: {
    counter: Gauge<string>;
    type: OPERATION_TYPE;
    network: NETWORK_TYPE;
    status: STATUS;
  }) => {
    const { counter, type, network, status } = params;

    const newCount = await this.database.getOperationsCount({
      type,
      network,
      status,
    });

    counter.set(newCount);
  };

  updateCounters = async () => {
    try {
      await this.updateCounterByConfig({
        type: OPERATION_TYPE.ONE_ETH,
        network: NETWORK_TYPE.ETHEREUM,
        status: STATUS.SUCCESS,
        counter: this.hmyToEthSuccessGauge,
      });

      await this.updateCounterByConfig({
        type: OPERATION_TYPE.ONE_ETH,
        network: NETWORK_TYPE.BINANCE,
        status: STATUS.SUCCESS,
        counter: this.hmyToBscSuccessGauge,
      });

      await this.updateCounterByConfig({
        type: OPERATION_TYPE.ONE_ETH,
        network: NETWORK_TYPE.ARBITRUM,
        status: STATUS.SUCCESS,
        counter: this.hmyToArbSuccessGauge,
      });

      await this.updateCounterByConfig({
        type: OPERATION_TYPE.ETH_ONE,
        network: NETWORK_TYPE.ETHEREUM,
        status: STATUS.SUCCESS,
        counter: this.ethToHmySuccessGauge,
      });

      await this.updateCounterByConfig({
        type: OPERATION_TYPE.ETH_ONE,
        network: NETWORK_TYPE.BINANCE,
        status: STATUS.SUCCESS,
        counter: this.bscToHmySuccessGauge,
      });

      await this.updateCounterByConfig({
        type: OPERATION_TYPE.ETH_ONE,
        network: NETWORK_TYPE.ARBITRUM,
        status: STATUS.SUCCESS,
        counter: this.arbToHmySuccessGauge,
      });
    } catch (e) {
      this.logger.error('updateCounters error', e);
    }

    setTimeout(this.updateCounters, this.syncInterval);
  };

  getInfo() {
    return null;
  }
}
