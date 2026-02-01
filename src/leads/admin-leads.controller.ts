import { Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { LeadsQueryDto } from './dto';
import { JwtGuard } from '../auth/jwt.guard';

@UseGuards(JwtGuard)
@Controller('admin/leads')
export class AdminLeadsController {
  constructor(private leads: LeadsService) {}

  @Get()
  async list(@Query() q: LeadsQueryDto) {
    return this.leads.listLeads({
      search: q.search,
      status: q.status,
      page: q.page ?? 1,
      limit: q.limit ?? 20,
    });
  }

  @Post(':id/qualify')
  async qualify(@Param('id') id: string) {
    return this.leads.qualifyLead(id);
  }
}
