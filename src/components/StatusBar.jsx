export default function StatusBar() {
  const time = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  
  return (
    <div className="status-bar">
      <div className="status-bar-time">{time}</div>
      <div className="status-bar-icons">
        <svg width="18" height="12" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 12H3V9H0V12ZM4.5 12H7.5V6H4.5V12ZM9 12H12V3H9V12ZM13.5 0V12H16.5V0H13.5Z" fill="white"/>
        </svg>
        <svg width="18" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 0C3.33333 0 0 3 0 3L8 12L16 3C16 3 12.6667 0 8 0Z" fill="white"/>
        </svg>
        <svg width="24" height="12" viewBox="0 0 24 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="0.5" y="1.5" width="20" height="9" rx="2.5" stroke="white" strokeWidth="1"/>
          <path d="M22 4.5V7.5C22.8284 7.5 23.5 6.82843 23.5 6C23.5 5.17157 22.8284 4.5 22 4.5Z" fill="white"/>
          <rect x="2" y="3" width="13" height="6" rx="1" fill="#2ed573"/>
        </svg>
      </div>
    </div>
  );
}
