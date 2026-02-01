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

      // Leadni topish (kim taklif qilgan)
      const lead = await this.leadsService.findByLeadUserId(user.id);
      if (!lead || lead.referrerUserId === user.id) {
        return {
          success: false,
          message: 'Referral topilmadi',
        };
      }

      // Referrerni topish
      const referrer = await this.usersService.findByTelegramId(BigInt(lead.referrerUserId));
      if (!referrer) {
        return {
          success: false,
          message: 'Referrer topilmadi',
        };
      }

      // Lead statusini QUALIFIED ga o'zgartirish (toza lead)
      await this.leadsService.qualifyLead(lead.id);

      // Referrerga +5 ball qo'shish
      await this.usersService.updateQualifiedCount(referrer.id, 5);

      // Referrerga xabar yuborish
      try {
        // Bu yerda bot token orqali xabar yuborish kerak
        console.log(`Referrerga xabar yuborildi: ${referrer.telegramId} - Toza lead: ${user.firstName}`);
      } catch (error) {
        console.log('Referrerga xabar yuborishda xato:', error);
      }

      return {
        success: true,
        message: 'Umra chiptasi sotib olish muvaffaqiyatli qayd etildi',
        data: {
          userId: user.id,
          referrerId: referrer.id,
          purchaseId,
          amount,
        },
      };
    } catch (error) {
      console.error('Umra purchase xatosi:', error);
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
      // Barcha QUALIFIED leadlarni olish (umra chiptasi sotib olganlar)
      const qualifiedLeads = await this.leadsService.getQualifiedLeads();
      
      const purchases = qualifiedLeads.map(lead => ({
        userId: lead.leadUserId,
        referrerId: lead.referrerUserId,
        qualifiedAt: lead.qualifiedAt,
        leadName: lead.leadName,
        referrerName: lead.referrerName,
      }));

      return {
        success: true,
        message: 'Umra chiptasi sotib olganlar ro\'yxati',
        data: purchases,
      };
    } catch (error) {
      console.error('Check purchases xatosi:', error);
      return {
        success: false,
        message: 'Server xatosi',
      };
    }
  }
}
