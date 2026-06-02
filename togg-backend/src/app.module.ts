import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TelemetryModule } from './telemetry/telemetry.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [TelemetryModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

