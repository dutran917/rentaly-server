import { Controller, Get, Param, Query } from '@nestjs/common';
import { StatisticService } from './statistic.service';
import { StatsDto } from './dto/get-statistic.dto';

@Controller('statistic')
export class StatisticController {
  constructor(private readonly statisticService: StatisticService) {}
  @Get('/apartment')
  async getStatisticApartment(@Query() input: StatsDto) {
    return await this.statisticService.getStatisticApartment(input);
  }
}
