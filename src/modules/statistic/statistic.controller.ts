import { Controller, Get, Param } from '@nestjs/common';
import { StatisticService } from './statistic.service';

@Controller('statistic')
export class StatisticController {
  constructor(private readonly statisticService: StatisticService) {}
  @Get('/apartment/:id')
  async getStatisticApartment(@Param('id') apartmentId: number) {
    return await this.statisticService.getStatisticApartment(apartmentId);
  }
}
