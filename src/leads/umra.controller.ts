import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { UsersService } from '../users/users.service';

export class UmraPurchaseDto {
  telegramId: string;
  purchaseId: string;
  amount: number;
}

@Controller('api/umra')
export class UmraController {
  constructor(
    private leadsService: LeadsService,
    private usersService: UsersService,
  ) {}

  @Post('purchase')
  @HttpCode(HttpStatus.OK)
  async handlePurchase(@Body() purchaseData: UmraPurchaseDto) {
    try {
      const { telegramId, purchaseId, amount } = purchaseData;

      // Foydalanuvchini topish
      const user = await this.usersService.findByTelegramId(BigInt(telegramId));
      if (!user) {
        return {
          success: false,
          message: 'Foydalanuvchi topilmadi',
        };
      }

      // Lead status update qilamiz
      const result = await this.leadsService.qualifyLead(user.id);

      return {
        success: true,
        message: 'Umra chiptasi sotib olish muvaffaqiyatli qayd etildi',
        data: {
          userId: user.id,
          purchaseId,
          amount,
        },
      };
    } catch (error) {
      console.error('[v0] Umra purchase xatosi:', error);
      return {
        success: false,
        message: 'Server xatosi',
      };
    }
  }

  @Post('check-purchases')
  @HttpCode(HttpStatus.OK)
  async checkPurchases() {
    try {
      const stats = await this.leadsService.getLeadsStats();
      
      return {
        success: true,
        message: 'Umra chiptasi sotib olganlar statistikasi',
        data: stats,
      };
    } catch (error) {
      console.error('[v0] Check purchases xatosi:', error);
      return {
        success: false,
        message: 'Server xatosi',
      };
    }
  }
}
