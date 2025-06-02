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