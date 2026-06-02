import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  calculatePrice(
    elapsedSeconds: number,
    drivingRate: number,
    waitingRate: number,
    selectedPlan: string,
  ) {
    const totalMinutes = Math.ceil(elapsedSeconds / 60) || 1;
    const drivingMinutes = Math.ceil(totalMinutes * 0.75);
    const waitingMinutes = Math.ceil(totalMinutes * 0.25);

    const baseDrivingCost = drivingMinutes * drivingRate;
    const baseWaitingCost = waitingMinutes * waitingRate;
    const insurancePremium = selectedPlan === 'premium' ? totalMinutes * 10 : 0;
    const totalCost = baseDrivingCost + baseWaitingCost + insurancePremium;

    return {
      totalMinutes,
      drivingMinutes,
      waitingMinutes,
      baseDrivingCost,
      baseWaitingCost,
      insurancePremium,
      totalCost,
      currency: 'TRY',
      timestamp: new Date().toISOString(),
    };
  }
}

