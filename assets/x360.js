/**
 * Xbox 360 Dashboard Theme JavaScript
 * Handles blade navigation, animations, and interactions
 */

class Xbox360Dashboard {
  constructor() {
    this.currentChannelIndex = 0;
    this.channels = [];
    this.isAnimating = false;
    this.focusedTileIndex = 0;
    this.achievementQueue = [];
    
    this.init();
  }

  init() {
    this.setupChannels();
    this.setupKeyboardNavigation();
    this.setupAchievementSystem();
    this.setupBladeAnimations();
    this.setupTileInteractions();
    
    // Set initial active channel
    this.setActiveChannel(0);
    
    console.log('Xbox 360 Dashboard initialized');
  }

  setupChannels() {
    this.channels = Array.from(document.querySelectorAll('.x360-channel'));
    
    // Add channel navigation indicators
    this.channels.forEach((channel, index) => {
      channel.dataset.channelIndex = index;
      
      // Add bend animation class
      if (index > 0) {
        channel.classList.add('x360-channel--bent');
      }
    });
  }

  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      if (this.isAnimating) return;
      
      switch(e.key) {
        case 'ArrowUp':
        case 'q':
        case 'Q':
          e.preventDefault();
          this.navigateChannel(-1);
          break;
          
        case 'ArrowDown':
        case 'e':
        case 'E':
          e.preventDefault();
          this.navigateChannel(1);
          break;
          
        case 'ArrowLeft':
          e.preventDefault();
          this.navigateTile(-1);
          break;
          
        case 'ArrowRight':
          e.preventDefault();
          this.navigateTile(1);
          break;
          
        case 'Enter':
        case ' ':
          e.preventDefault();
          this.activateFocusedTile();
          break;
          
        case 'Escape':
          e.preventDefault();
          this.resetFocus();
          break;
      }
    });
  }

  navigateChannel(direction) {
    const newIndex = this.currentChannelIndex + direction;
    
    if (newIndex >= 0 && newIndex < this.channels.length) {
      this.setActiveChannel(newIndex);
    }
  }

  setActiveChannel(index) {
    if (this.isAnimating || index === this.currentChannelIndex) return;
    
    this.isAnimating = true;
    const previousChannel = this.channels[this.currentChannelIndex];
    const newChannel = this.channels[index];
    
    // Remove active state from previous channel
    if (previousChannel) {
      previousChannel.classList.remove('is-active');
      this.animateChannelOut(previousChannel);
    }
    
    // Add active state to new channel
    newChannel.classList.add('is-active');
    this.animateChannelIn(newChannel);
    
    this.currentChannelIndex = index;
    this.focusedTileIndex = 0;
    
    // Update other channels with bend effect
    this.updateChannelBends();
    
    setTimeout(() => {
      this.isAnimating = false;
    }, 300);
  }

  animateChannelIn(channel) {
    if (typeof gsap !== 'undefined') {
      gsap.fromTo(channel, 
        { 
          x: -100, 
          opacity: 0.7,
          scale: 0.95
        },
        { 
          x: 0, 
          opacity: 1,
          scale: 1,
          duration: 0.3,
          ease: "expo.out"
        }
      );
      
      // Animate tiles in sequence
      const tiles = channel.querySelectorAll('.x360-tile');
      gsap.fromTo(tiles,
        { y: 20, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.2, 
          stagger: 0.03,
          delay: 0.1,
          ease: "expo.out"
        }
      );
    }
  }

  animateChannelOut(channel) {
    if (typeof gsap !== 'undefined') {
      gsap.to(channel, {
        scale: 0.95,
        opacity: 0.7,
        duration: 0.2,
        ease: "expo.in"
      });
    }
  }

  updateChannelBends() {
    this.channels.forEach((channel, index) => {
      const distance = Math.abs(index - this.currentChannelIndex);
      
      if (index === this.currentChannelIndex) {
        channel.classList.remove('x360-channel--bent');
      } else {
        channel.classList.add('x360-channel--bent');
        
        if (typeof gsap !== 'undefined') {
          // Apply bend effect based on distance
          const bendAmount = Math.min(distance * 3, 9);
          gsap.to(channel, {
            rotationY: index < this.currentChannelIndex ? bendAmount : -bendAmount,
            z: -distance * 30,
            duration: 0.3,
            ease: "expo.out"
          });
        }
      }
    });
  }

  navigateTile(direction) {
    const activeChannel = this.channels[this.currentChannelIndex];
    const tiles = activeChannel.querySelectorAll('.x360-tile');
    
    if (tiles.length === 0) return;
    
    // Remove focus from current tile
    if (tiles[this.focusedTileIndex]) {
      tiles[this.focusedTileIndex].classList.remove('x360-tile--focused');
    }
    
    // Calculate new index
    this.focusedTileIndex += direction;
    
    if (this.focusedTileIndex < 0) {
      this.focusedTileIndex = tiles.length - 1;
    } else if (this.focusedTileIndex >= tiles.length) {
      this.focusedTileIndex = 0;
    }
    
    // Add focus to new tile
    const newFocusedTile = tiles[this.focusedTileIndex];
    newFocusedTile.classList.add('x360-tile--focused');
    newFocusedTile.focus();
    
    // Scroll tile into view
    this.scrollTileIntoView(newFocusedTile);
  }

  scrollTileIntoView(tile) {
    const container = tile.closest('.x360-channel__tiles');
    const containerRect = container.getBoundingClientRect();
    const tileRect = tile.getBoundingClientRect();
    
    if (tileRect.left < containerRect.left || tileRect.right > containerRect.right) {
      tile.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'nearest', 
        inline: 'center' 
      });
    }
  }

  activateFocusedTile() {
    const activeChannel = this.channels[this.currentChannelIndex];
    const tiles = activeChannel.querySelectorAll('.x360-tile');
    const focusedTile = tiles[this.focusedTileIndex];
    
    if (focusedTile) {
      const link = focusedTile.querySelector('a');
      if (link) {
        // Add click animation
        if (typeof gsap !== 'undefined') {
          gsap.to(focusedTile, {
            scale: 0.95,
            duration: 0.1,
            yoyo: true,
            repeat: 1,
            ease: "expo.inOut"
          });
        }
        
        // Trigger achievement if it's a product
        if (focusedTile.closest('[data-tile-type="product"]')) {
          this.triggerAchievement('Product Viewed', 'You viewed a product!');
        }
        
        setTimeout(() => {
          link.click();
        }, 200);
      }
    }
  }

  resetFocus() {
    // Remove focus from all tiles
    document.querySelectorAll('.x360-tile--focused').forEach(tile => {
      tile.classList.remove('x360-tile--focused');
    });
    
    this.focusedTileIndex = 0;
  }

  setupTileInteractions() {
    document.addEventListener('click', (e) => {
      const tile = e.target.closest('.x360-tile');
      if (tile) {
        // Add to cart achievement for product tiles
        const productLink = tile.querySelector('a[href*="/products/"]');
        if (productLink) {
          this.triggerAchievement('Explorer', 'You discovered a new product!');
        }
      }
    });
  }

  setupAchievementSystem() {
    // Create achievement toast container
    if (!document.getElementById('achievement-toast')) {
      const toast = document.createElement('div');
      toast.id = 'achievement-toast';
      toast.className = 'x360-achievement-toast';
      toast.innerHTML = `
        <div class="x360-achievement-toast__content">
          <div class="x360-achievement-toast__icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <div class="x360-achievement-toast__text">
            <div class="x360-achievement-toast__title"></div>
            <div class="x360-achievement-toast__description"></div>
          </div>
        </div>
      `;
      document.body.appendChild(toast);
    }
  }

  triggerAchievement(title, description) {
    const toast = document.getElementById('achievement-toast');
    const titleEl = toast.querySelector('.x360-achievement-toast__title');
    const descEl = toast.querySelector('.x360-achievement-toast__description');
    
    titleEl.textContent = title;
    descEl.textContent = description;
    
    // Show achievement
    toast.classList.add('show');
    
    // Play achievement sound (if available)
    this.playAchievementSound();
    
    // Hide after 3 seconds
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  playAchievementSound() {
    // Create a simple achievement sound using Web Audio API
    if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
      try {
        const audioContext = new (AudioContext || webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
      } catch (e) {
        console.log('Audio not available');
      }
    }
  }

  setupBladeAnimations() {
    // Add perspective to the main container
    const bladeShell = document.getElementById('blade-shell');
    if (bladeShell && typeof gsap !== 'undefined') {
      gsap.set(bladeShell, {
        perspective: 1000,
        transformStyle: "preserve-3d"
      });
    }
  }
}

// Channel scrolling function (called from blade-channel.liquid)
window.scrollChannel = function(channelId, direction) {
  const channel = document.getElementById(channelId);
  const tilesContainer = channel.querySelector('.x360-channel__tiles');
  const tiles = tilesContainer.querySelectorAll('.x360-tile');
  
  if (tiles.length === 0) return;
  
  const tileWidth = tiles[0].offsetWidth + 8; // tile width + gap
  const scrollAmount = tileWidth * 3; // scroll 3 tiles at a time
  
  tilesContainer.scrollBy({
    left: direction * scrollAmount,
    behavior: 'smooth'
  });
  
  // Trigger achievement for navigation
  if (window.xbox360Dashboard) {
    window.xbox360Dashboard.triggerAchievement('Navigator', 'You explored the channel!');
  }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.xbox360Dashboard = new Xbox360Dashboard();
});

// Initialize immediately if DOM is already loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.xbox360Dashboard = new Xbox360Dashboard();
  });
} else {
  window.xbox360Dashboard = new Xbox360Dashboard();
}

/**
 * Nintendo 64 UI/UX enhancement script
 * Adds authentic N64 UI behaviors and effects
 */

// Custom N64-style cursor
document.addEventListener('DOMContentLoaded', function() {
  if (window.matchMedia('(pointer: fine)').matches) {
    // Only apply custom cursor on devices with precise pointing (mouse)
    const n64Cursor = document.createElement('div');
    n64Cursor.className = 'n64-cursor';
    document.body.appendChild(n64Cursor);
    
    // Add styles for the cursor
    const style = document.createElement('style');
    style.textContent = `
      .n64-cursor {
        position: fixed;
        width: 24px;
        height: 24px;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23FFDF00' stroke='%236E00FF' stroke-width='2' d='M12,1 L12,23 M1,12 L23,12 M5,5 L19,19 M5,19 L19,5'%3E%3C/path%3E%3C/svg%3E");
        pointer-events: none;
        z-index: 9999;
        transform: translate(-50%, -50%);
        transition: transform 0.1s ease;
      }
      
      * {
        cursor: none !important;
      }
      
      a:hover ~ .n64-cursor,
      button:hover ~ .n64-cursor,
      .n64-tile:hover ~ .n64-cursor {
        transform: translate(-50%, -50%) scale(1.5);
      }
    `;
    document.head.appendChild(style);
    
    // Follow mouse position
    document.addEventListener('mousemove', (e) => {
      n64Cursor.style.left = e.clientX + 'px';
      n64Cursor.style.top = e.clientY + 'px';
    });
    
    // Scale cursor on click
    document.addEventListener('mousedown', () => {
      n64Cursor.style.transform = 'translate(-50%, -50%) scale(0.8)';
    });
    
    document.addEventListener('mouseup', () => {
      n64Cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    });
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