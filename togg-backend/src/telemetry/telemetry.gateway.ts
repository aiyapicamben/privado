import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

const initialVehicles = [
  { id: 'TOGG-001', model: 'TOGG T10X', plate: '16 TG 1001', battery: 87, range: 340, lat: 40.4338, lng: 29.1572, color: 'Anadolu Mavisi', year: 2025, seats: 5, pricing: { driving: 10, waiting: 2 }, features: ['Otonom Pilot', 'Kablosuz Şarj', 'Premium Ses'], location: 'Cumhuriyet Mah. Gül Cad.', status: 'IDLE' },
  { id: 'TOGG-002', model: 'TOGG T10X', plate: '16 TG 2002', battery: 62, range: 245, lat: 40.4355, lng: 29.1618, color: 'Gökyüzü Beyazı', year: 2025, seats: 5, pricing: { driving: 10, waiting: 2 }, features: ['Hızlı Şarj', 'Panoramik Cam Tavan'], location: 'Hamidiye Mah. Atatürk Bulvarı', status: 'IDLE' },
  { id: 'TOGG-003', model: 'TOGG T10F', plate: '16 TG 3003', battery: 95, range: 410, lat: 40.4312, lng: 29.1555, color: 'Karbon Gri', year: 2026, seats: 5, pricing: { driving: 12, waiting: 2.5 }, features: ['Otonom Pilot+', 'AR Gösterge', 'Premium Ses'], location: 'Sahil Yolu, Gemlik Sahili', status: 'IDLE' },
  { id: 'TOGG-004', model: 'TOGG T10X', plate: '16 TG 4004', battery: 34, range: 130, lat: 40.4281, lng: 29.1697, color: 'Lav Kırmızı', year: 2025, seats: 5, pricing: { driving: 10, waiting: 2 }, features: ['Kablosuz Şarj'], location: 'Hamidiye Mah. No:136', status: 'IDLE' },
  { id: 'TOGG-005', model: 'TOGG T10F', plate: '16 TG 5005', battery: 78, range: 310, lat: 40.4316, lng: 29.1607, color: 'Gece Siyahı', year: 2026, seats: 5, pricing: { driving: 12, waiting: 2.5 }, features: ['Otonom Pilot+', 'Hızlı Şarj', 'Matrix LED'], location: 'Eşref Dinçer Mah. Kanalboyu', status: 'IDLE' },
  { id: 'TOGG-006', model: 'TOGG T10X', plate: '16 TG 6006', battery: 55, range: 215, lat: 40.4372, lng: 29.1540, color: 'Okyanus Yeşili', year: 2025, seats: 5, pricing: { driving: 10, waiting: 2 }, features: ['Panoramik Cam Tavan', 'Premium Ses'], location: 'Hisar Mah. Yalova Yolu Cad.', status: 'IDLE' },
];

@WebSocketGateway({ cors: { origin: '*' } })
export class TelemetryGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('TelemetryGateway');
  private interval: NodeJS.Timeout;
  private vehicles = [...initialVehicles];

  afterInit() {
    this.logger.log('Telemetry Gateway initialized');
    this.startSimulation();
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    client.emit('fleetState', this.vehicles);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('requestFleetState')
  handleFleetState(client: Socket) {
    client.emit('fleetState', this.vehicles);
  }

  @SubscribeMessage('triggerSafeMode')
  handleSafeMode(client: Socket, payload: { vehicleId: string }) {
    this.logger.warn(`SAFE MODE Triggered for ${payload.vehicleId}`);
    this.server.emit('safeModeAlert', {
      vehicleId: payload.vehicleId,
      message: 'Kritik uyarı! Araç Safe Mode\'a geçti.',
      timestamp: new Date().toISOString(),
    });
  }

  private startSimulation() {
    this.interval = setInterval(() => {
      this.vehicles = this.vehicles.map((v) => {
        // Only move vehicles that are IDLE slightly, or ACTIVE more
        // Let's simulate them moving around Gemlik
        const latChange = (Math.random() - 0.5) * 0.0001; // ~10 meters
        const lngChange = (Math.random() - 0.5) * 0.0001;
        
        let newLat = v.lat + latChange;
        let newLng = v.lng + lngChange;

        // Keep them within Gemlik bounds roughly (40.42 to 40.44 lat, 29.14 to 29.17 lng)
        if (newLat > 40.44 || newLat < 40.42) newLat = v.lat;
        if (newLng > 29.17 || newLng < 29.14) newLng = v.lng;

        // Occasionally drop battery by 1
        const batteryChange = Math.random() > 0.98 ? -1 : 0;
        const newBattery = Math.max(0, v.battery + batteryChange);

        return {
          ...v,
          lat: newLat,
          lng: newLng,
          battery: newBattery,
        };
      });

      this.server.emit('fleetUpdate', this.vehicles);

      // Generate some random telemetry for active driving simulation (for the admin panel)
      const telemetryEvent = {
        vehicleId: this.vehicles[0].id,
        speed: Math.floor(Math.random() * 80),
        battery: this.vehicles[0].battery,
        lat: this.vehicles[0].lat,
        lng: this.vehicles[0].lng,
        timestamp: new Date().toISOString(),
      };
      this.server.emit('telemetryUpdate', telemetryEvent);

    }, 2000); // 2 saniyede bir güncelle
  }
}
