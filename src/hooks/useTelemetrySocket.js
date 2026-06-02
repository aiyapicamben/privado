import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useAdminStore } from '../store/useAdminStore';
import { mockVehicles as initialVehicles } from '../data/mockData';

// We'll also need a way to store fleet state for MapScreen. Let's add it to AdminStore for now, 
// or maybe create a generic fleet update action. For MapScreen we just need the vehicles array.
export let globalVehicles = [...initialVehicles];

export function useTelemetrySocket() {
  const setSocket = useAdminStore((state) => state.setSocket);
  const updateFleetData = useAdminStore((state) => state.updateFleetData);
  const updateTelemetry = useAdminStore((state) => state.updateTelemetry);
  const addSafeModeAlert = useAdminStore((state) => state.addSafeModeAlert);

  useEffect(() => {
    const socket = io('http://localhost:3000', {
      reconnectionDelayMax: 10000,
    });

    socket.on('connect', () => {
      console.log('Connected to telemetry server');
      setSocket(socket);
    });

    socket.on('fleetState', (data) => {
      globalVehicles = data;
      updateFleetData(data);
    });

    socket.on('fleetUpdate', (data) => {
      globalVehicles = data;
      updateFleetData(data);
      // We can trigger a re-render in MapScreen by updating a state or using Zustand store.
      // To not overload React state 30 times a second (though it's 2s here), Zustand is fine.
    });

    socket.on('telemetryUpdate', (data) => {
      updateTelemetry(data.vehicleId, data);
    });

    socket.on('safeModeAlert', (alert) => {
      addSafeModeAlert(alert);
    });

    return () => {
      socket.disconnect();
    };
  }, [setSocket, updateFleetData, updateTelemetry, addSafeModeAlert]);
}
