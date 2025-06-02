/**
 * Nintendo 64 UI/UX enhancement script
 * Adds authentic N64 UI behaviors and effects
 */

// Custom N64-style cursor
document.addEventListener('DOMContentLoaded', function() {
  console.log('N64 Script Loaded - Setting up cursor');
  
  // Force immediate cursor creation regardless of device
  createN64Cursor();
  
  function createN64Cursor() {
    // Create cursor element
    const n64Cursor = document.createElement('div');
    n64Cursor.className = 'n64-cursor';
    n64Cursor.id = 'n64-cursor';
    document.body.appendChild(n64Cursor);
    
    console.log('N64 Cursor element created');
    
    // Add styles with !important to override any conflicts
    const style = document.createElement('style');
    style.textContent = `
      .n64-cursor {
        position: fixed !important;
        width: 32px !important;
        height: 32px !important;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23FFDF00' stroke='%236E00FF' stroke-width='2' d='M12,1 L12,23 M1,12 L23,12 M5,5 L19,19 M5,19 L19,5'%3E%3C/path%3E%3C/svg%3E") !important;
        background-size: contain !important;
        background-repeat: no-repeat !important;
        pointer-events: none !important;
        z-index: 999999 !important;
        transform: translate(-50%, -50%) !important;
        transition: transform 0.1s ease !important;
        top: 0 !important;
        left: 0 !important;
      }
      
      body, a, button, input, select {
        cursor: none !important;
      }
      
      a:hover ~ .n64-cursor,
      button:hover ~ .n64-cursor,
      .n64-tile:hover ~ .n64-cursor {
        transform: translate(-50%, -50%) scale(1.5) !important;
      }
    `;
    document.head.appendChild(style);
    
    // Follow mouse position with direct style manipulation
    document.addEventListener('mousemove', (e) => {
      requestAnimationFrame(() => {
        if (n64Cursor) {
          n64Cursor.style.left = e.clientX + 'px';
          n64Cursor.style.top = e.clientY + 'px';
        }
      });
    });
    
    // Scale cursor on click
    document.addEventListener('mousedown', () => {
      n64Cursor.style.transform = 'translate(-50%, -50%) scale(0.8)';
    });
    
    document.addEventListener('mouseup', () => {
      n64Cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    });
    
    // Ensure cursor is visible by moving it to initial position
    setTimeout(() => {
      const event = new MouseEvent('mousemove', {
        clientX: window.innerWidth / 2,
        clientY: window.innerHeight / 2
      });
      document.dispatchEvent(event);
      console.log('N64 Cursor positioned at center');
    }, 500);
  }
});

// N64 startup sequence
function playN64StartupSequence() {
  // Create and show N64 logo
  const n64Logo = document.createElement('div');
  n64Logo.className = 'n64-startup-logo';
  n64Logo.innerHTML = 'NINTENDO<span>64</span>';
  document.body.appendChild(n64Logo);
  
  // Add styles for the startup sequence
  const style = document.createElement('style');
  style.textContent = `
    .n64-startup-logo {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: #000;
      color: #FFDF00;
      font-family: 'Press Start 2P', monospace;
      font-size: 3rem;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      animation: n64StartupFade 4s forwards;
    }
    
    .n64-startup-logo span {
      color: #6E00FF;
      margin-left: 1rem;
      animation: n64LogoColorCycle 3s infinite;
    }
    
    @keyframes n64StartupFade {
      0% { opacity: 1; }
      80% { opacity: 1; }
      100% { opacity: 0; visibility: hidden; }
    }
    
    @keyframes n64LogoColorCycle {
      0% { color: #6E00FF; }
      33% { color: #FF0000; }
      66% { color: #00B800; }
      100% { color: #6E00FF; }
    }
  `;
  document.head.appendChild(style);
  
  // Play N64 startup sound
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  
  // Create oscillators for the N64 startup sound
  setTimeout(() => {
    const startupSoundPart1 = audioContext.createOscillator();
    const startupSoundPart2 = audioContext.createOscillator();
    const startupSoundPart3 = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    startupSoundPart1.type = 'triangle';
    startupSoundPart2.type = 'sine';
    startupSoundPart3.type = 'square';
    
    startupSoundPart1.connect(gainNode);
    startupSoundPart2.connect(gainNode);
    startupSoundPart3.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    
    // N64 startup tone sequence
    startupSoundPart1.frequency.setValueAtTime(494, audioContext.currentTime);
    startupSoundPart1.start();
    startupSoundPart1.stop(audioContext.currentTime + 0.5);
    
    setTimeout(() => {
      startupSoundPart2.frequency.setValueAtTime(740, audioContext.currentTime);
      startupSoundPart2.start();
      startupSoundPart2.stop(audioContext.currentTime + 0.5);
    }, 500);
    
    setTimeout(() => {
      startupSoundPart3.frequency.setValueAtTime(370, audioContext.currentTime);
      startupSoundPart3.start();
      startupSoundPart3.stop(audioContext.currentTime + 1);
    }, 1000);
  }, 500);
}

// Run the startup sequence when the page loads
if (sessionStorage.getItem('n64StartupPlayed') !== 'true') {
  window.addEventListener('load', playN64StartupSequence);
  sessionStorage.setItem('n64StartupPlayed', 'true');
}

// Add N64 button sounds to all clickable elements
document.addEventListener('DOMContentLoaded', function() {
  const clickableElements = document.querySelectorAll('a, button, .n64-tile');
  
  clickableElements.forEach(element => {
    element.addEventListener('click', () => {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(660, audioContext.currentTime);
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.2);
    });
  });
}); 