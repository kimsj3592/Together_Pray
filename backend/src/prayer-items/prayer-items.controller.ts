import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { PrayerItemsService } from './prayer-items.service';
import { CreatePrayerItemDto } from './dto/create-prayer-item.dto';
import { UpdatePrayerStatusDto } from './dto/update-prayer-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PrayerStatus } from '@prisma/client';

@Controller('prayer-items')
@UseGuards(JwtAuthGuard)
export class PrayerItemsController {
  constructor(private readonly prayerItemsService: PrayerItemsService) {}

  @Post()
  async create(@Req() req, @Body() createDto: CreatePrayerItemDto) {
    return this.prayerItemsService.create(req.user.id, createDto);
  }

  @Get('group/:groupId')
  async findAllByGroup(
    @Param('groupId') groupId: string,
    @Req() req,
    @Query('status') status?: PrayerStatus,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.prayerItemsService.findAllByGroup(
      groupId,
      req.user.id,
      status,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req) {
    return this.prayerItemsService.findOne(id, req.user.id);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Req() req,
    @Body() updateDto: UpdatePrayerStatusDto,
  ) {
    return this.prayerItemsService.updateStatus(id, req.user.id, updateDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Req() req) {
    return this.prayerItemsService.delete(id, req.user.id);
  }
}
