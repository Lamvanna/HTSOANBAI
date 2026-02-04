// ============================================
// MAIN APPLICATION - Integration & Coordination
// ============================================

class Application {
    constructor() {
        this.initialized = false;
        this.loadAttempts = 0;
        this.maxLoadAttempts = 100; // 10 seconds max (better for slow mobile)
        this.requiredDependencies = ['Quill', 'i18n'];
        this.init();
    }

    checkDependencies() {
        return this.requiredDependencies.every(dep => typeof window[dep] !== 'undefined');
    }

    getMissingDependencies() {
        return this.requiredDependencies.filter(dep => typeof window[dep] === 'undefined');
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            loadingScreen.style.transition = 'opacity 0.5s';
            setTimeout(() => loadingScreen.remove(), 500);
        }
    }

    showError(message) {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.innerHTML = `
                <div style="text-align: center; padding: 20px;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 64px; color: #ff6b6b; margin-bottom: 20px;"></i>
                    <h2 style="margin: 10px 0; font-size: 20px; color: white;">Lỗi tải trang</h2>
                    <p style="margin: 10px 0; opacity: 0.9; color: white;">${message}</p>
                    <button onclick="location.reload()" style="margin-top: 20px; padding: 12px 24px; background: white; color: #667eea; border: none; border-radius: 8px; font-size: 16px; cursor: pointer; font-weight: bold;">Tải lại trang</button>
                </div>
            `;
        }
    }

    init() {
        if (this.initialized) return;
        
        this.loadAttempts++;
        
        // Log progress for debugging
        if (this.loadAttempts === 1 || this.loadAttempts % 10 === 0) {
            console.log(`🔄 Init attempt ${this.loadAttempts}/${this.maxLoadAttempts}`);
        }
        
        // Check if max attempts reached
        if (this.loadAttempts > this.maxLoadAttempts) {
            const missingDeps = this.getMissingDependencies();
            console.error('❌ Failed to load dependencies:', missingDeps);
            this.showError(`Không thể tải thư viện: ${missingDeps.join(', ')}. <br>Vui lòng kiểm tra kết nối internet và tải lại trang.`);
            return;
        }
        
        // Wait for all dependencies to load
        if (!this.checkDependencies()) {
            // Log missing dependencies
            const missing = this.getMissingDependencies();
            if (this.loadAttempts === 1 || this.loadAttempts % 20 === 0) {
                console.log(`⏳ Waiting for: ${missing.join(', ')}`);
            }
            setTimeout(() => this.init(), 100);
            return;
        }

        try {
            this.setupModalHandlers();
            this.setupKeyboardShortcuts();
            this.setupResponsiveHandlers();
            this.setupUserInteractions();
            
            this.initialized = true;
            console.log('✅ Application initialized successfully');
            
            // Hide loading screen after successful init
            setTimeout(() => this.hideLoadingScreen(), 500);
        } catch (error) {
            console.error('❌ Initialization error:', error);
            this.showError('Lỗi khởi tạo ứng dụng: ' + error.message);
        }
    }

    // Setup modal open/close handlers
    setupModalHandlers() {
        // Close modal buttons
        document.querySelectorAll('.btn-close-modal').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modalId = btn.getAttribute('data-modal');
                if (modalId) {
                    this.closeModal(modalId);
                }
            });
        });

        // Close modals on background click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });
        });

        // Prevent modal content clicks from closing modal
        document.querySelectorAll('.modal-content').forEach(content => {
            content.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        });

        // ESC key closes modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal.active').forEach(modal => {
                    modal.classList.remove('active');
                });
            }
        });
    }

    // Close modal
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
        }
    }

    // Setup keyboard shortcuts
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Check if Ctrl (or Cmd on Mac) is pressed
            const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
            const modifier = isMac ? e.metaKey : e.ctrlKey;

            if (!modifier) return;

            // Ctrl+S - Save
            if (e.key === 's' || e.key === 'S') {
                e.preventDefault();
                if (editor && typeof editor.saveDocument === 'function') {
                    editor.saveDocument();
                    showToast(i18n.translate('documentSaved') || 'Đã lưu tài liệu', 'success');
                }
            }

            // Ctrl+N - New Document
            if (e.key === 'n' || e.key === 'N') {
                e.preventDefault();
                if (documentManager) {
                    documentManager.createNewDocument();
                }
            }

            // Ctrl+P - Print
            if (e.key === 'p' || e.key === 'P') {
                e.preventDefault();
                window.print();
            }

            // Ctrl+F - Find
            if (e.key === 'f' || e.key === 'F') {
                e.preventDefault();
                if (editor && typeof editor.showModal === 'function') {
                    editor.showModal('findModal');
                    document.getElementById('findText').focus();
                }
            }

            // Ctrl+B - Bold
            if (e.key === 'b' || e.key === 'B') {
                e.preventDefault();
                if (editor && editor.quill) {
                    editor.toggleFormat('bold');
                }
            }

            // Ctrl+I - Italic
            if (e.key === 'i' || e.key === 'I') {
                e.preventDefault();
                if (editor && editor.quill) {
                    editor.toggleFormat('italic');
                }
            }

            // Ctrl+U - Underline
            if (e.key === 'u' || e.key === 'U') {
                e.preventDefault();
                if (editor && editor.quill) {
                    editor.toggleFormat('underline');
                }
            }

            // Ctrl+Shift+S - Statistics
            if (e.shiftKey && (e.key === 's' || e.key === 'S')) {
                e.preventDefault();
                if (editor) {
                    editor.showStatistics();
                }
            }

            // Ctrl+K - Insert Link
            if (e.key === 'k' || e.key === 'K') {
                e.preventDefault();
                if (editor) {
                    editor.showLinkModal();
                }
            }
        });
    }

    // Setup responsive behavior
    setupResponsiveHandlers() {
        // Handle window resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 250);
        });

        // Initial resize check
        this.handleResize();
        
        // Setup touch gestures for mobile
        this.setupTouchGestures();
    }
    
    // Setup touch gestures
    setupTouchGestures() {
        let touchStartX = 0;
        let touchEndX = 0;
        
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.querySelector('.main-content');
        
        if (mainContent) {
            mainContent.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });
            
            mainContent.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                this.handleSwipe(touchStartX, touchEndX);
            }, { passive: true });
        }
    }
    
    // Handle swipe gesture
    handleSwipe(startX, endX) {
        const swipeThreshold = 100;
        const diff = startX - endX;
        
        // Swipe left to open sidebar
        if (diff > swipeThreshold && startX < 50) {
            document.getElementById('sidebar')?.classList.remove('collapsed');
        }
        
        // Swipe right to close sidebar
        if (diff < -swipeThreshold) {
            document.getElementById('sidebar')?.classList.add('collapsed');
        }
    }

    // Handle resize events
    handleResize() {
        const width = window.innerWidth;
        const sidebar = document.getElementById('sidebar');

        // Auto-hide sidebar on mobile
        if (width <= 1024) {
            sidebar.classList.add('collapsed');
        }

        // Update editor stats on resize
        if (editor && typeof editor.updateStats === 'function') {
            editor.updateStats();
        }
    }

    // Setup user interactions
    setupUserInteractions() {
        // User menu dropdown
        const btnUser = document.getElementById('btnUser');
        const userDropdown = document.getElementById('userDropdown');

        if (btnUser && userDropdown) {
            btnUser.addEventListener('click', (e) => {
                e.stopPropagation();
                userDropdown.classList.toggle('active');
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!userDropdown.contains(e.target) && e.target !== btnUser) {
                    userDropdown.classList.remove('active');
                }
            });
        }

        // Settings button
        const btnOpenSettings = document.getElementById('btnOpenSettings');
        if (btnOpenSettings) {
            btnOpenSettings.addEventListener('click', () => {
                this.openSettings();
                userDropdown.classList.remove('active');
            });
        }

        // Shortcuts button
        const btnShortcuts = document.getElementById('btnShortcuts');
        if (btnShortcuts) {
            btnShortcuts.addEventListener('click', () => {
                this.openShortcuts();
                userDropdown.classList.remove('active');
            });
        }

        // Templates button
        const btnTemplates = document.getElementById('btnTemplates');
        if (btnTemplates) {
            btnTemplates.addEventListener('click', () => {
                this.openTemplates();
                userDropdown.classList.remove('active');
            });
        }

        // Fullscreen button
        const btnFullscreen = document.getElementById('btnFullscreen');
        if (btnFullscreen) {
            btnFullscreen.addEventListener('click', () => {
                this.toggleFullscreen();
                userDropdown.classList.remove('active');
            });
        }

        // Import JSON button
        const btnImportJson = document.getElementById('btnImportJson');
        const importJsonInput = document.getElementById('importJsonInput');
        if (btnImportJson && importJsonInput) {
            btnImportJson.addEventListener('click', () => {
                importJsonInput.click();
                userDropdown.classList.remove('active');
            });

            importJsonInput.addEventListener('change', (e) => {
                if (e.target.files && e.target.files[0]) {
                    storageManager.importDocumentJSON(e.target.files[0]);
                    e.target.value = '';
                }
            });
        }

        // My Documents button
        const btnMyDocuments = document.getElementById('btnMyDocuments');
        if (btnMyDocuments) {
            btnMyDocuments.addEventListener('click', () => {
                document.getElementById('sidebar').classList.remove('collapsed');
                userDropdown.classList.remove('active');
            });
        }

        // Floating Action Button (Mobile)
        this.setupFAB();

        // Handle online/offline status
        window.addEventListener('online', () => {
            showToast(i18n.translate('backOnline') || 'Đã kết nối lại internet', 'success');
        });

        window.addEventListener('offline', () => {
            showToast(i18n.translate('offline') || 'Mất kết nối internet', 'error');
        });

        // Prevent accidental page close if there are unsaved changes
        window.addEventListener('beforeunload', (e) => {
            // Check if there are unsaved changes
            const saveStatus = document.getElementById('saveStatus');
            if (saveStatus && saveStatus.classList.contains('saving')) {
                e.preventDefault();
                e.returnValue = '';
                return '';
            }
        });

        // Handle paste events for images
        document.addEventListener('paste', (e) => {
            const items = e.clipboardData?.items;
            if (!items) return;

            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf('image') !== -1) {
                    e.preventDefault();
                    const blob = items[i].getAsFile();
                    if (editor && blob) {
                        editor.insertImage(blob);
                        showToast(i18n.translate('imagePasted') || 'Đã dán hình ảnh', 'success');
                    }
                }
            }
        });

        // Smooth scroll to top button (if needed)
        this.setupScrollToTop();

        // Setup tooltips (if using custom tooltips)
        this.setupTooltips();

        // F11 for fullscreen
        document.addEventListener('keydown', (e) => {
            if (e.key === 'F11') {
                e.preventDefault();
                this.toggleFullscreen();
            }
        });
    }

    // Setup Floating Action Button
    setupFAB() {
        const fabMain = document.getElementById('fabMain');
        const fabMenu = document.getElementById('fabMenu');
        const fabNewDoc = document.getElementById('fabNewDoc');
        const fabSave = document.getElementById('fabSave');
        const fabExport = document.getElementById('fabExport');

        if (fabMain) {
            fabMain.addEventListener('click', (e) => {
                e.stopPropagation();
                fabMenu.classList.toggle('active');
                fabMain.querySelector('i').classList.toggle('fa-plus');
                fabMain.querySelector('i').classList.toggle('fa-times');
            });
        }

        // Close FAB menu when clicking outside
        document.addEventListener('click', (e) => {
            const fab = document.getElementById('fab');
            if (fab && !fab.contains(e.target)) {
                fabMenu.classList.remove('active');
                fabMain.querySelector('i').classList.remove('fa-times');
                fabMain.querySelector('i').classList.add('fa-plus');
            }
        });

        // FAB actions
        if (fabNewDoc) {
            fabNewDoc.addEventListener('click', () => {
                documentManager.createNewDocument();
                fabMenu.classList.remove('active');
            });
        }

        if (fabSave) {
            fabSave.addEventListener('click', () => {
                if (editor && typeof editor.saveDocument === 'function') {
                    editor.saveDocument();
                    showToast(i18n.translate('documentSaved') || 'Đã lưu tài liệu', 'success');
                }
                fabMenu.classList.remove('active');
            });
        }

        if (fabExport) {
            fabExport.addEventListener('click', () => {
                this.showExportOptions();
                fabMenu.classList.remove('active');
            });
        }
    }

    // Show export options
    showExportOptions() {
        const options = [
            { text: 'Xuất Word', action: () => exportManager.exportToWord() },
            { text: 'Xuất PDF', action: () => exportManager.exportToPDF() }
        ];

        // Simple implementation - can be enhanced with a custom modal
        const choice = confirm('Xuất Word? (OK = Word, Cancel = PDF)');
        if (choice) {
            exportManager.exportToWord();
        } else {
            exportManager.exportToPDF();
        }
    }

    // Open settings modal
    openSettings() {
        const modal = document.getElementById('settingsModal');
        if (modal) {
            // Load current settings
            this.loadSettingsUI();
            modal.classList.add('active');
        }

        // Save settings button
        const btnSaveSettings = document.getElementById('btnSaveSettings');
        if (btnSaveSettings) {
            btnSaveSettings.onclick = () => this.saveSettings();
        }

        // Clear all data button
        const btnClearAllData = document.getElementById('btnClearAllData');
        if (btnClearAllData) {
            btnClearAllData.onclick = () => {
                if (storageManager.clearAllDocuments()) {
                    documentManager.loadDocuments();
                    documentManager.createNewDocument();
                    modal.classList.remove('active');
                }
            };
        }

        // Dark mode toggle
        const settingDarkMode = document.getElementById('settingDarkMode');
        if (settingDarkMode) {
            settingDarkMode.addEventListener('change', (e) => {
                this.toggleDarkMode(e.target.checked);
            });
        }

        // Compact toolbar toggle
        const settingCompactToolbar = document.getElementById('settingCompactToolbar');
        if (settingCompactToolbar) {
            settingCompactToolbar.addEventListener('change', (e) => {
                this.toggleCompactToolbar(e.target.checked);
            });
        }
    }

    // Load settings UI
    loadSettingsUI() {
        const settings = storageManager.getSettings();
        
        document.getElementById('settingAutoSave').checked = settings.autoSave;
        document.getElementById('settingAutoSaveInterval').value = settings.autoSaveInterval / 1000;
        document.getElementById('settingDefaultFont').value = settings.defaultFont;
        document.getElementById('settingDefaultFontSize').value = settings.defaultFontSize;
        
        // Load dark mode state
        const isDarkMode = document.body.classList.contains('dark-mode');
        document.getElementById('settingDarkMode').checked = isDarkMode;
        
        // Load compact toolbar state
        const isCompact = document.querySelector('.toolbar')?.classList.contains('compact');
        document.getElementById('settingCompactToolbar').checked = isCompact || false;

        // Load storage info
        const storageInfo = storageManager.getStorageInfo();
        document.getElementById('storageDocCount').textContent = storageInfo.documentCount;
        document.getElementById('storageUsed').textContent = `${storageInfo.kb} KB`;
    }

    // Save settings
    saveSettings() {
        const settings = {
            autoSave: document.getElementById('settingAutoSave').checked,
            autoSaveInterval: parseInt(document.getElementById('settingAutoSaveInterval').value) * 1000,
            defaultFont: document.getElementById('settingDefaultFont').value,
            defaultFontSize: document.getElementById('settingDefaultFontSize').value
        };

        storageManager.saveSettings(settings);
        
        // Apply settings
        if (editor && editor.quill) {
            editor.quill.format('font', settings.defaultFont);
            editor.quill.format('size', settings.defaultFontSize);
        }

        document.getElementById('settingsModal').classList.remove('active');
        showToast(i18n.translate('settingsSaved') || 'Đã lưu cài đặt', 'success');
    }

    // Toggle dark mode
    toggleDarkMode(enabled) {
        if (enabled) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('darkMode', 'true');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('darkMode', 'false');
        }
    }

    // Toggle compact toolbar
    toggleCompactToolbar(enabled) {
        const toolbar = document.querySelector('.toolbar');
        if (enabled) {
            toolbar?.classList.add('compact');
            localStorage.setItem('compactToolbar', 'true');
        } else {
            toolbar?.classList.remove('compact');
            localStorage.setItem('compactToolbar', 'false');
        }
    }

    // Open keyboard shortcuts modal
    openShortcuts() {
        const modal = document.getElementById('shortcutsModal');
        if (modal) {
            modal.classList.add('active');
        }
    }

    // Open templates modal
    openTemplates() {
        const modal = document.getElementById('templatesModal');
        if (modal) {
            this.loadTemplates();
            modal.classList.add('active');
        }
    }

    // Load templates
    loadTemplates() {
        const templatesGrid = document.getElementById('templatesGrid');
        if (!templatesGrid) return;

        const templates = [
            {
                icon: 'fa-file-alt',
                title: 'Văn bản trống',
                description: 'Tài liệu trống cơ bản',
                content: ''
            },
            {
                icon: 'fa-file-contract',
                title: 'Đơn xin việc',
                description: 'Mẫu đơn xin việc',
                content: '<h2>ĐỔN XIN VIỆC</h2><p><br></p><p>Kính gửi: Ban Giám đốc Công ty...</p>'
            },
            {
                icon: 'fa-file-invoice',
                title: 'Báo cáo',
                description: 'Mẫu báo cáo công việc',
                content: '<h2>BÁO CÁO CÔNG VIỆC</h2><p><br></p><p>Người báo cáo: </p><p>Thời gian: </p>'
            },
            {
                icon: 'fa-envelope',
                title: 'Thư ngỏ',
                description: 'Mẫu thư gửi đi',
                content: '<p>Kính gửi,</p><p><br></p><p>Nội dung thư...</p><p><br></p><p>Trân trọng,</p>'
            },
            {
                icon: 'fa-file-word',
                title: 'Tài liệu Khmer',
                description: 'Văn bản tiếng Khmer',
                content: '<p style="font-family: Battambang;">អត្ថបទភាសាខ្មែរ</p>'
            },
            {
                icon: 'fa-graduation-cap',
                title: 'Giáo án',
                description: 'Mẫu giáo án giảng dạy',
                content: '<h2>GIÁO ÁN</h2><p>Môn học: </p><p>Lớp: </p><p>Tiết: </p>'
            }
        ];

        templatesGrid.innerHTML = templates.map((template, index) => `
            <div class="template-item" data-template-index="${index}">
                <i class="fas ${template.icon}"></i>
                <h4>${template.title}</h4>
                <p>${template.description}</p>
            </div>
        `).join('');

        // Add click handlers
        templatesGrid.querySelectorAll('.template-item').forEach(item => {
            item.addEventListener('click', () => {
                const index = item.getAttribute('data-template-index');
                this.applyTemplate(templates[index]);
            });
        });
    }

    // Apply template
    applyTemplate(template) {
        if (confirm(i18n.translate('confirmApplyTemplate') || 'Áp dụng mẫu này? Nội dung hiện tại sẽ bị thay thế.')) {
            if (editor && editor.quill) {
                editor.quill.root.innerHTML = template.content;
                editor.updateStats();
                document.getElementById('templatesModal').classList.remove('active');
                showToast(i18n.translate('templateApplied') || 'Đã áp dụng mẫu', 'success');
            }
        }
    }

    // Toggle fullscreen
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error('Error attempting to enable fullscreen:', err);
            });
            document.body.classList.add('fullscreen');
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                document.body.classList.remove('fullscreen');
            }
        }
    }

    // Setup scroll to top functionality
    setupScrollToTop() {
        const editorWrapper = document.querySelector('.editor-wrapper');
        if (!editorWrapper) return;

        let scrollTimeout;
        editorWrapper.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                // You can add scroll-based features here
            }, 100);
        });
    }

    // Setup custom tooltips (optional enhancement)
    setupTooltips() {
        // Add tooltip functionality for buttons
        const buttons = document.querySelectorAll('[title]');
        
        buttons.forEach(button => {
            button.addEventListener('mouseenter', (e) => {
                // Custom tooltip can be implemented here if needed
                // For now, using native browser tooltips
            });
        });
    }

    // Show notification
    showNotification(message, type = 'info') {
        showToast(message, type);
    }

    // Get application info
    getInfo() {
        return {
            name: 'Soạn Thảo Việt-Khmer',
            version: '1.0.0',
            language: i18n?.getCurrentLanguage() || 'vi',
            storageUsed: storageManager?.getStorageInfo() || {}
        };
    }

    // Debug mode
    enableDebugMode() {
        console.log('=== DEBUG MODE ENABLED ===');
        window.app = this;
        window.editor = editor;
        window.storageManager = storageManager;
        window.documentManager = documentManager;
        window.exportManager = exportManager;
        window.i18n = i18n;
        console.log('Available in console: app, editor, storageManager, documentManager, exportManager, i18n');
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Show toast notification (globally available)
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;

    const iconMap = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };

    const icon = iconMap[type] || iconMap.info;
    
    toast.innerHTML = `<i class="fas ${icon}"></i><span>${message}</span>`;
    
    // Add color based on type
    toast.style.background = type === 'error' ? '#ea4335' : 
                            type === 'warning' ? '#fbbc04' : 
                            type === 'info' ? '#1a73e8' : '#34a853';
    
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Format bytes to human readable size
function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Copy text to clipboard
async function copyToClipboard(text) {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
            showToast(i18n.translate('copiedToClipboard') || 'Đã sao chép', 'success');
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                showToast(i18n.translate('copiedToClipboard') || 'Đã sao chép', 'success');
            } catch (err) {
                showToast(i18n.translate('copyFailed') || 'Không thể sao chép', 'error');
            }
            document.body.removeChild(textArea);
        }
    } catch (err) {
        console.error('Failed to copy:', err);
        showToast(i18n.translate('copyFailed') || 'Không thể sao chép', 'error');
    }
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Generate random color
function getRandomColor() {
    return '#' + Math.floor(Math.random()*16777215).toString(16);
}

// Check if mobile device
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// ============================================
// PERFORMANCE MONITORING (Optional)
// ============================================

class PerformanceMonitor {
    constructor() {
        this.metrics = {};
    }

    start(label) {
        this.metrics[label] = performance.now();
    }

    end(label) {
        if (this.metrics[label]) {
            const duration = performance.now() - this.metrics[label];
            console.log(`⏱️ ${label}: ${duration.toFixed(2)}ms`);
            delete this.metrics[label];
            return duration;
        }
    }

    measure(label, fn) {
        this.start(label);
        const result = fn();
        this.end(label);
        return result;
    }
}

// ============================================
// INITIALIZE APPLICATION
// ============================================

let app;
const perfMonitor = new PerformanceMonitor();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    perfMonitor.start('App Initialization');
    
    // Apply saved preferences
    const darkMode = localStorage.getItem('darkMode');
    if (darkMode === 'true') {
        document.body.classList.add('dark-mode');
    }
    
    const compactToolbar = localStorage.getItem('compactToolbar');
    if (compactToolbar === 'true') {
        setTimeout(() => {
            document.querySelector('.toolbar')?.classList.add('compact');
        }, 100);
    }
    
    // Initialize application
    app = new Application();
    
    perfMonitor.end('App Initialization');
    
    // Enable debug mode in development (can be toggled in console)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        app.enableDebugMode();
    }

    // Show welcome message
    setTimeout(() => {
        const welcomeMsg = i18n?.translate('appName') || 'Soạn Thảo Việt-Khmer';
        console.log(`%c✨ ${welcomeMsg}`, 'color: #1a73e8; font-size: 16px; font-weight: bold;');
        console.log('%cVersion 1.0.0', 'color: #5f6368; font-size: 12px;');
        console.log('%cType app.enableDebugMode() to enable debug features', 'color: #5f6368; font-size: 10px;');
        console.log('✅ Application initialized successfully');
    }, 500);
});

// Service Worker Registration (for PWA support - optional future enhancement)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Can register service worker here for offline support
        // navigator.serviceWorker.register('/sw.js');
    });
}

// Export for use in other modules if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Application,
        showToast,
        formatBytes,
        copyToClipboard,
        debounce,
        throttle,
        isMobileDevice,
        PerformanceMonitor
    };
}
