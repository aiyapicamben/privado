import { Controller, Get, Post, Body, UseGuards, UnauthorizedException } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly jwtService: JwtService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('api/ride/calculate')
  calculatePrice(
    @Body() body: { elapsedSeconds: number; drivingRate: number; waitingRate: number; selectedPlan: string },
  ) {
    return this.appService.calculatePrice(
      body.elapsedSeconds,
      body.drivingRate,
      body.waitingRate,
      body.selectedPlan,
    );
  }

  @Post('api/admin/login')
  loginAdmin(@Body() body: { username: string; password?: string }) {
    // Basic credential verification for Sunum demonstration
    if (body.username === 'admin') {
      const payload = { sub: 1, username: body.username, role: 'CEO_ADMIN' };
      return {
        access_token: this.jwtService.sign(payload),
        username: body.username,
        role: 'CEO_ADMIN',
      };
    }
    throw new UnauthorizedException('Geçersiz kullanıcı adı veya şifre.');
  }

  @UseGuards(JwtAuthGuard)
  @Get('api/admin/protected-fleet')
  getProtectedFleet() {
    return {
      status: 'authenticated',
      message: 'Güvenli CEO dashboard verileri yüklenmiştir.',
      timestamp: new Date().toISOString(),
    };
  }
}

