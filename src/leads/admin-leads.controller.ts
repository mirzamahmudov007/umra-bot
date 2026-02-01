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

  @Get('stats')
  async getStats() {
    return this.leads.getLeadsStats();
  }

  @Get('top-referrers')
  async getTopReferrers(@Query('limit') limit?: string) {
    const lim = limit ? Math.min(parseInt(limit), 100) : 20;
    return this.leads.getTopReferrersWithBalls(lim);
  }

  @Post(':id/qualify')
  async qualify(@Param('id') id: string) {
    return this.leads.qualifyLead(id);
  }
}
