import {
  Controller,
  Post,
  Get,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { PrayerReactionsService } from './prayer-reactions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('prayer-items')
@UseGuards(JwtAuthGuard)
export class PrayerReactionsController {
  constructor(
    private readonly prayerReactionsService: PrayerReactionsService,
  ) {}

  @Post(':id/pray')
  async pray(@Param('id') prayerItemId: string, @Req() req) {
    return this.prayerReactionsService.pray(prayerItemId, req.user.id);
  }

  @Get(':id/prayers')
  async getPrayersList(@Param('id') prayerItemId: string, @Req() req) {
    return this.prayerReactionsService.getPrayersList(
      prayerItemId,
      req.user.id,
    );
  }
}
