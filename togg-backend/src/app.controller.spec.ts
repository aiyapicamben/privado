import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtModule } from '@nestjs/jwt';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'test-secret-2026',
          signOptions: { expiresIn: '1h' },
        }),
      ],
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });

  describe('secure pricing calculation', () => {
    it('should correctly calculate total price and premium upsell', () => {
      const breakdown = appController.calculatePrice({
        elapsedSeconds: 600, // 10 minutes
        drivingRate: 10,
        waitingRate: 2,
        selectedPlan: 'premium',
      });
      expect(breakdown.totalMinutes).toBe(10);
      expect(breakdown.insurancePremium).toBe(100); // 10 minutes * 10 TRY/min
      expect(breakdown.totalCost).toBe(186); // (8 * 10) + (3 * 2) + 100 = 80 + 6 + 100 = 186
      expect(breakdown.currency).toBe('TRY');
    });
  });

  describe('admin login simulation', () => {
    it('should return access token and role for valid credentials', () => {
      const response = appController.loginAdmin({ username: 'admin' });
      expect(response).toHaveProperty('access_token');
      expect(response.role).toBe('CEO_ADMIN');
    });

    it('should fail for invalid username', () => {
      expect(() => appController.loginAdmin({ username: 'invalid_user' })).toThrow();
    });
  });
});

