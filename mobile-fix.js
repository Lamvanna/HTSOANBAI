// ============================================
// MOBILE EVENT FIX - Better Touch Support
// ============================================

class MobileEventFix {
    constructor() {
        this.isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        this.debugMode = false; // Disable debug by default (enable with: window.mobileFix.debugMode = true)
        this.init();
    }

    log(message, data = null) {
        if (!this.debugMode) return;
        
        const timestamp = new Date().toLocaleTimeString();
        console.log(`[Mobile Fix ${timestamp}] ${message}`, data || '');
        
        // Also show on screen for mobile debugging
        if (this.isMobile) {
            this.showDebugToast(message);
        }
    }

    showDebugToast(message) {
        // Create toast element if not exists
        let toast = document.getElementById('mobile-debug-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'mobile-debug-toast';
            toast.style.cssText = `
                position: fixed;
                top: 10px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 8px 16px;
                border-radius: 20px;
                font-size: 12px;
                z-index: 100000;
                pointer-events: none;
                max-width: 90%;
                text-align: center;
                transition: opacity 0.3s;
            `;
            document.body.appendChild(toast);
        }
        
        toast.textContent = message;
        toast.style.opacity = '1';
        
        // Auto hide after 2 seconds
        setTimeout(() => {
            toast.style.opacity = '0';
        }, 2000);
    }

    init() {
        if (!this.isMobile) return;
        
        this.log('🔧 Applying mobile event fixes...');
        
        // Wait for DOM to be fully loaded
        const applyFixes = () => {
            // Fix button events
            this.fixButtonEvents();
            
            // Fix dropdown events
            this.fixDropdownEvents();
            
            // Fix color picker
            this.fixColorPicker();
            
            // Fix toolbar scrolling
            this.fixToolbarScroll();
            
            // Prevent iOS zoom on input focus
            this.preventZoom();
            
            // Fix double-tap zoom
            this.fixDoubleTap();
            
            this.log('✅ Mobile fixes applied');
        };

        // Apply fixes after a short delay to ensure all elements are loaded
        setTimeout(applyFixes, 500);
        
        // Re-apply fixes when new elements are added (like modals)
        const observer = new MutationObserver(() => {
            this.log('🔄 Re-applying fixes (DOM changed)');
            this.fixButtonEvents();
            this.fixColorPicker();
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Fix button click events on mobile
    fixButtonEvents() {
        // Get all toolbar buttons that don't already have touch handlers
        const buttons = document.querySelectorAll('.toolbar button, .btn-icon, .fab-button, .btn-toolbar');
        
        let fixedCount = 0;
        buttons.forEach(button => {
            // Skip if already has touch handler
            if (button.dataset.touchFixed === 'true') return;
            button.dataset.touchFixed = 'true';
            fixedCount++;
            
            // Remove any conflicting event listeners
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
            
            // Add precise touch handling
            let touchStartX = 0;
            let touchStartY = 0;
            let isTouching = false;
            
            newButton.addEventListener('touchstart', (e) => {
                isTouching = true;
                const touch = e.touches[0];
                touchStartX = touch.clientX;
                touchStartY = touch.clientY;
                
                newButton.classList.add('touching');
                newButton.style.opacity = '0.7';
                newButton.style.transform = 'scale(0.95)';
                this.log(`Touch start: ${newButton.id || newButton.className}`);
            }, { passive: true });
            
            newButton.addEventListener('touchmove', (e) => {
                if (!isTouching) return;
                
                const touch = e.touches[0];
                const deltaX = Math.abs(touch.clientX - touchStartX);
                const deltaY = Math.abs(touch.clientY - touchStartY);
                
                // If moved more than 10px, cancel touch
                if (deltaX > 10 || deltaY > 10) {
                    isTouching = false;
                    newButton.classList.remove('touching');
                    newButton.style.opacity = '1';
                    newButton.style.transform = 'scale(1)';
                }
            }, { passive: true });
            
            newButton.addEventListener('touchend', (e) => {
                if (isTouching) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Trigger actual click
                    const clickEvent = new MouseEvent('click', {
                        bubbles: true,
                        cancelable: true,
                        view: window
                    });
                    newButton.dispatchEvent(clickEvent);
                    
                    this.log(`Touch end & click: ${newButton.id || newButton.className}`);
                }
                
                newButton.classList.remove('touching');
                newButton.style.opacity = '1';
                newButton.style.transform = 'scale(1)';
                isTouching = false;
            }, { passive: false });
            
            newButton.addEventListener('touchcancel', () => {
                isTouching = false;
                newButton.classList.remove('touching');
                newButton.style.opacity = '1';
                newButton.style.transform = 'scale(1)';
            });
        });
        
        if (fixedCount > 0) {
            this.log(`Fixed ${fixedCount} buttons with precise touch`);
        }
    }

    // Fix dropdown menus on mobile
    fixDropdownEvents() {
        const dropdowns = document.querySelectorAll('.dropdown, .color-dropdown');
        
        dropdowns.forEach(dropdown => {
            let isOpen = false;
            
            dropdown.addEventListener('touchstart', (e) => {
                e.stopPropagation();
            }, { passive: true });
            
            // Close dropdown when touching outside
            document.addEventListener('touchstart', (e) => {
                if (!dropdown.contains(e.target)) {
                    dropdown.classList.remove('active');
                    isOpen = false;
                }
            }, { passive: true });
        });
    }

    // Fix color picker buttons on mobile
    fixColorPicker() {
        // Fix color preset buttons
        const colorPresets = document.querySelectorAll('.color-preset');
        
        let fixedCount = 0;
        colorPresets.forEach(btn => {
            if (btn.dataset.touchFixed) return;
            btn.dataset.touchFixed = 'true';
            fixedCount++;
            
            // Add touch-specific handler
            btn.addEventListener('touchend', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const color = btn.getAttribute('data-color');
                this.log(`Color selected: ${color}`);
                
                // Visual feedback
                btn.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    btn.style.transform = 'scale(1)';
                }, 100);
                
                // Trigger click event
                btn.click();
            }, { passive: false });
        });

        // Fix color dropdowns toggle buttons
        const colorBtns = ['btnTextColor', 'btnBgColor'];
        colorBtns.forEach(btnId => {
            const btn = document.getElementById(btnId);
            if (!btn || btn.dataset.touchFixed) return;
            btn.dataset.touchFixed = 'true';
            fixedCount++;
            
            btn.addEventListener('touchend', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                this.log(`Toggle color picker: ${btnId}`);
                
                // Toggle the dropdown
                const dropdownId = btnId === 'btnTextColor' ? 'textColorDropdown' : 'bgColorDropdown';
                const dropdown = document.getElementById(dropdownId);
                const otherDropdownId = btnId === 'btnTextColor' ? 'bgColorDropdown' : 'textColorDropdown';
                const otherDropdown = document.getElementById(otherDropdownId);
                
                if (dropdown) {
                    dropdown.classList.toggle('active');
                }
                if (otherDropdown) {
                    otherDropdown.classList.remove('active');
                }
            }, { passive: false });
        });
        
        if (fixedCount > 0) {
            this.log(`Fixed ${fixedCount} color picker elements`);
        }
    }

    // Fix toolbar horizontal scrolling
    fixToolbarScroll() {
        const toolbar = document.querySelector('.toolbar');
        if (!toolbar) return;
        
        let isScrolling = false;
        let startX = 0;
        let scrollLeft = 0;
        
        toolbar.addEventListener('touchstart', (e) => {
            isScrolling = true;
            startX = e.touches[0].pageX - toolbar.offsetLeft;
            scrollLeft = toolbar.scrollLeft;
        }, { passive: true });
        
        toolbar.addEventListener('touchmove', (e) => {
            if (!isScrolling) return;
            
            const x = e.touches[0].pageX - toolbar.offsetLeft;
            const walk = (startX - x) * 2; // Scroll speed
            toolbar.scrollLeft = scrollLeft + walk;
        }, { passive: true });
        
        toolbar.addEventListener('touchend', () => {
            isScrolling = false;
        }, { passive: true });
    }

    // Prevent zoom on input focus (iOS)
    preventZoom() {
        // This is already handled by font-size: 16px in CSS
        // But we can add extra prevention
        const inputs = document.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                // Temporarily disable zoom
                const viewport = document.querySelector('meta[name=viewport]');
                if (viewport) {
                    const content = viewport.getAttribute('content');
                    viewport.setAttribute('content', content + ', user-scalable=no');
                    
                    // Re-enable after blur
                    input.addEventListener('blur', () => {
                        viewport.setAttribute('content', content);
                    }, { once: true });
                }
            });
        });
    }

    // Fix double-tap zoom on buttons
    fixDoubleTap() {
        let lastTap = 0;
        
        document.addEventListener('touchend', (e) => {
            const currentTime = new Date().getTime();
            const tapLength = currentTime - lastTap;
            
            if (tapLength < 300 && tapLength > 0) {
                // Double tap detected
                e.preventDefault();
            }
            
            lastTap = currentTime;
        }, { passive: false });
    }

    // Add visual feedback for touch
    addTouchFeedback(element) {
        element.addEventListener('touchstart', () => {
            element.style.opacity = '0.7';
        }, { passive: true });
        
        element.addEventListener('touchend', () => {
            element.style.opacity = '1';
        }, { passive: true });
        
        element.addEventListener('touchcancel', () => {
            element.style.opacity = '1';
        }, { passive: true });
    }
    
    // Toggle debug mode
    toggleDebug() {
        this.debugMode = !this.debugMode;
        this.log(this.debugMode ? '✅ Debug mode ON' : '⛔ Debug mode OFF');
        
        // Update button text
        const debugBtn = document.getElementById('btnToggleDebug');
        const debugText = document.getElementById('debugModeText');
        if (debugText) {
            debugText.textContent = this.debugMode ? 'Debug: ON' : 'Debug: OFF';
        }
        
        return this.debugMode;
    }
}

// Global instance
let mobileEventFix = null;

// Initialize mobile fixes when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        mobileEventFix = new MobileEventFix();
        
        // Show debug toggle button only on mobile
        if (mobileEventFix.isMobile) {
            const debugBtn = document.getElementById('btnToggleDebug');
            if (debugBtn) {
                debugBtn.style.display = 'block';
                debugBtn.addEventListener('click', () => {
                    mobileEventFix.toggleDebug();
                });
            }
        }
    });
} else {
    // DOM already loaded
    mobileEventFix = new MobileEventFix();
    
    // Show debug toggle button only on mobile
    if (mobileEventFix.isMobile) {
        const debugBtn = document.getElementById('btnToggleDebug');
        if (debugBtn) {
            debugBtn.style.display = 'block';
            debugBtn.addEventListener('click', () => {
                mobileEventFix.toggleDebug();
            });
        }
    }
}
