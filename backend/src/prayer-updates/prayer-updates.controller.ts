import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { PrayerUpdatesService } from './prayer-updates.service';
import { CreatePrayerUpdateDto } from './dto/create-prayer-update.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller()
@UseGuards(JwtAuthGuard)
export class PrayerUpdatesController {
  constructor(private readonly prayerUpdatesService: PrayerUpdatesService) {}

  @Post('prayer-items/:id/updates')
  async create(
    @Param('id') prayerItemId: string,
    @Req() req,
    @Body() createDto: CreatePrayerUpdateDto,
  ) {
    return this.prayerUpdatesService.create(
      prayerItemId,
      req.user.id,
      createDto,
    );
  }

  @Get('prayer-items/:id/updates')
  async findAllByPrayerItem(@Param('id') prayerItemId: string, @Req() req) {
    return this.prayerUpdatesService.findAllByPrayerItem(
      prayerItemId,
      req.user.id,
    );
  }

  @Delete('prayer-updates/:id')
  async delete(@Param('id') updateId: string, @Req() req) {
    return this.prayerUpdatesService.delete(updateId, req.user.id);
  }
}
