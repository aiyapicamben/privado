import { useApp, APP_STATES, AppProvider } from './context/AppContext';
import Welcome from './pages/Welcome';
import Register from './pages/Register';
import KYC from './pages/KYC';
import MapScreen from './pages/MapScreen';
import PreDrive from './pages/PreDrive';
import ActiveDrive from './pages/ActiveDrive';
import EndDrive from './pages/EndDrive';

function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div className={`toast toast-${toast.type}`}>
      {toast.type === 'success' && '✓ '}
      {toast.type === 'error' && '✕ '}
      {toast.type === 'info' && 'ℹ '}
      {toast.message}
    </div>
  );
}

function AppContent() {
  const { appState, toast } = useApp();

  const renderScreen = () => {
    switch (appState) {
      case APP_STATES.WELCOME:
        return <Welcome />;
      case APP_STATES.REGISTER:
      case APP_STATES.OTP:
        return <Register />;
      case APP_STATES.KYC:
      case APP_STATES.KYC_PENDING:
        return <KYC />;
      case APP_STATES.MAP:
      case APP_STATES.VEHICLE_SELECTED:
      case APP_STATES.RESERVED:
        return <MapScreen />;
      case APP_STATES.PRE_DRIVE:
      case APP_STATES.DAMAGE_CHECK:
      case APP_STATES.QR_SCAN:
      case APP_STATES.UNLOCKED:
        return <PreDrive />;
      case APP_STATES.ACTIVE_DRIVE:
      case APP_STATES.WAITING_MODE:
        return <ActiveDrive />;
      case APP_STATES.END_DRIVE:
      case APP_STATES.PHOTO_PROOF:
      case APP_STATES.TRIP_SUMMARY:
        return <EndDrive />;
      default:
        return <Welcome />;
    }
  };

  return (
    <div className="app-container">
      <Toast toast={toast} />
      {renderScreen()}
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
