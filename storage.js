// ============================================
// STORAGE MANAGER - LocalStorage Management
// ============================================

// Check storage availability and suppress tracking prevention warnings
(function checkStorageAvailability() {
    try {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('__storage_test__', '1');
            localStorage.removeItem('__storage_test__');
        }
    } catch (e) {
        console.warn('⚠️ Storage access limited, but app will continue');
    }
})();

class StorageManager {
    constructor() {
        this.STORAGE_KEY = 'viet_khmer_documents';
        this.SETTINGS_KEY = 'viet_khmer_settings';
        this.currentLanguage = 'vi';
        this.storageAvailable = this.checkStorage();
    }

    // Check if localStorage is available
    checkStorage() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    }

    // Generate unique ID
    generateId() {
        return 'doc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Get all documents
    getAllDocuments() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            return data ? JSON.parse(data) : {};
        } catch (error) {
            console.error('Error loading documents:', error);
            return {};
        }
    }

    // Get document by ID
    getDocument(id) {
        const documents = this.getAllDocuments();
        return documents[id] || null;
    }

    // Check storage quota
    checkStorageQuota() {
        if (!this.storageAvailable) return { available: false, quota: 0, usage: 0 };
        
        try {
            // Estimate storage usage
            const data = localStorage.getItem(this.STORAGE_KEY) || '';
            const usage = new Blob([data]).size;
            const quota = 5 * 1024 * 1024; // Assume 5MB limit
            const available = usage < quota * 0.9; // Warning at 90%
            
            return { available, quota, usage, percentage: (usage / quota * 100).toFixed(1) };
        } catch (e) {
            return { available: true, quota: 0, usage: 0 };
        }
    }

    // Save/Update document
    saveDocument(id, documentData) {
        // Check storage first
        if (!this.storageAvailable) {
            showToast('Storage không khả dụng', 'error');
            return false;
        }

        const storageInfo = this.checkStorageQuota();
        if (!storageInfo.available) {
            showToast(`Dung lượng sắp đầy (${storageInfo.percentage}%). Hãy xóa bớt tài liệu cũ.`, 'warning');
        }

        try {
            const documents = this.getAllDocuments();
            
            if (!documents[id]) {
                // New document
                documents[id] = {
                    id: id,
                    title: documentData.title || 'Untitled Document',
                    content: documentData.content || {},
                    html: documentData.html || '',
                    createdAt: new Date().toISOString(),
                    lastModified: new Date().toISOString()
                };
            } else {
                // Update existing document
                documents[id] = {
                    ...documents[id],
                    title: documentData.title,
                    content: documentData.content,
                    html: documentData.html,
                    lastModified: new Date().toISOString()
                };
            }

            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(documents));
            return true;
        } catch (error) {
            console.error('Error saving document:', error);
            
            // Check if storage quota exceeded
            if (error.name === 'QuotaExceededError') {
                showToast(i18n.translate('storageQuotaExceeded') || 'Dung lượng lưu trữ đã đầy', 'error');
            } else {
                showToast(i18n.translate('errorSaving') || 'Lỗi khi lưu tài liệu', 'error');
            }
            return false;
        }
    }

    // Create new document
    createDocument(title = null) {
        const id = this.generateId();
        const documentData = {
            title: title || `${i18n.translate('untitledDocument') || 'Tài liệu chưa có tên'} ${new Date().toLocaleDateString()}`,
            content: {},
            html: ''
        };
        
        if (this.saveDocument(id, documentData)) {
            return id;
        }
        return null;
    }

    // Delete document
    deleteDocument(id) {
        try {
            const documents = this.getAllDocuments();
            delete documents[id];
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(documents));
            showToast(i18n.translate('documentDeleted') || 'Đã xóa tài liệu', 'success');
            return true;
        } catch (error) {
            console.error('Error deleting document:', error);
            showToast(i18n.translate('errorDeleting') || 'Lỗi khi xóa tài liệu', 'error');
            return false;
        }
    }

    // Duplicate document
    duplicateDocument(id) {
        const original = this.getDocument(id);
        if (!original) return null;

        const newId = this.generateId();
        const duplicateData = {
            title: `${original.title} (${i18n.translate('copy') || 'Bản sao'})`,
            content: original.content,
            html: original.html
        };

        if (this.saveDocument(newId, duplicateData)) {
            return newId;
        }
        return null;
    }

    // Search documents by title
    searchDocuments(query) {
        const documents = this.getAllDocuments();
        const results = [];
        const lowerQuery = query.toLowerCase();

        for (const id in documents) {
            const doc = documents[id];
            if (doc.title.toLowerCase().includes(lowerQuery)) {
                results.push(doc);
            }
        }

        // Sort by last modified date (newest first)
        results.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));
        return results;
    }

    // Get documents sorted by date
    getDocumentsSorted() {
        const documents = this.getAllDocuments();
        const docsArray = Object.values(documents);
        
        // Sort by last modified date (newest first)
        docsArray.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));
        return docsArray;
    }

    // Export document data as JSON
    exportDocumentJSON(id) {
        const doc = this.getDocument(id);
        if (!doc) return null;

        const jsonString = JSON.stringify(doc, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `${doc.title}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
        showToast(i18n.translate('exportedJSON') || 'Đã xuất file JSON', 'success');
    }

    // Import document from JSON
    importDocumentJSON(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                const newId = this.generateId();
                
                this.saveDocument(newId, {
                    title: data.title || 'Imported Document',
                    content: data.content,
                    html: data.html
                });

                showToast(i18n.translate('importedJSON') || 'Đã nhập tài liệu', 'success');
                documentManager.loadDocuments();
                documentManager.loadDocument(newId);
            } catch (error) {
                console.error('Error importing JSON:', error);
                showToast(i18n.translate('errorImporting') || 'Lỗi khi nhập tài liệu', 'error');
            }
        };
        reader.readAsText(file);
    }

    // Clear all documents (with confirmation)
    clearAllDocuments() {
        if (confirm(i18n.translate('confirmClearAll') || 'Bạn có chắc muốn xóa tất cả tài liệu? Hành động này không thể hoàn tác.')) {
            try {
                localStorage.removeItem(this.STORAGE_KEY);
                showToast(i18n.translate('allDocumentsDeleted') || 'Đã xóa tất cả tài liệu', 'success');
                return true;
            } catch (error) {
                console.error('Error clearing documents:', error);
                showToast(i18n.translate('errorClearing') || 'Lỗi khi xóa tài liệu', 'error');
                return false;
            }
        }
        return false;
    }

    // Get storage usage info
    getStorageInfo() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            const sizeInBytes = new Blob([data || '']).size;
            const sizeInKB = (sizeInBytes / 1024).toFixed(2);
            const sizeInMB = (sizeInBytes / 1024 / 1024).toFixed(2);
            const documentCount = Object.keys(this.getAllDocuments()).length;

            return {
                bytes: sizeInBytes,
                kb: sizeInKB,
                mb: sizeInMB,
                documentCount: documentCount
            };
        } catch (error) {
            console.error('Error getting storage info:', error);
            return { bytes: 0, kb: 0, mb: 0, documentCount: 0 };
        }
    }

    // Settings management
    saveSettings(settings) {
        try {
            localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
            return true;
        } catch (error) {
            console.error('Error saving settings:', error);
            return false;
        }
    }

    getSettings() {
        try {
            const data = localStorage.getItem(this.SETTINGS_KEY);
            return data ? JSON.parse(data) : this.getDefaultSettings();
        } catch (error) {
            console.error('Error loading settings:', error);
            return this.getDefaultSettings();
        }
    }

    getDefaultSettings() {
        return {
            language: 'vi',
            defaultFont: 'Arial',
            defaultFontSize: '14px',
            autoSave: true,
            autoSaveInterval: 30000,
            darkMode: false,
            compactToolbar: false
        };
    }
    
    // Backup all documents to JSON
    backupAllDocuments() {
        try {
            const documents = this.getAllDocuments();
            const backup = {
                version: '1.0',
                timestamp: new Date().toISOString(),
                documents: documents
            };
            
            const jsonString = JSON.stringify(backup, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `backup_${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            
            URL.revokeObjectURL(url);
            showToast(i18n.translate('backupCreated') || 'Đã tạo bản sao lưu', 'success');
            return true;
        } catch (error) {
            console.error('Error creating backup:', error);
            showToast(i18n.translate('backupFailed') || 'Lỗi khi tạo bản sao lưu', 'error');
            return false;
        }
    }
    
    // Restore from backup
    restoreFromBackup(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const backup = JSON.parse(e.target.result);
                
                if (backup.version && backup.documents) {
                    // Confirm restore
                    if (confirm(i18n.translate('confirmRestore') || 'Khôi phục bản sao lưu? Dữ liệu hiện tại sẽ bị thay thế.')) {
                        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(backup.documents));
                        showToast(i18n.translate('restoreSuccess') || 'Đã khôi phục thành công', 'success');
                        
                        // Reload documents
                        if (typeof documentManager !== 'undefined') {
                            documentManager.loadDocuments();
                        }
                    }
                } else {
                    throw new Error('Invalid backup format');
                }
            } catch (error) {
                console.error('Error restoring backup:', error);
                showToast(i18n.translate('restoreFailed') || 'Lỗi khi khôi phục', 'error');
            }
        };
        reader.readAsText(file);
    }
}

// ============================================
// DOCUMENT MANAGER - UI Management
// ============================================

class DocumentManager {
    constructor() {
        this.storageManager = new StorageManager();
        this.currentDocumentId = null;
        this.init();
    }

    init() {
        this.setupEventHandlers();
        this.loadDocuments();
        
        // Create first document if none exists
        const documents = this.storageManager.getDocumentsSorted();
        if (documents.length === 0) {
            this.createNewDocument();
        } else {
            this.loadDocument(documents[0].id);
        }
    }

    setupEventHandlers() {
        // New document button
        document.getElementById('btnNew').addEventListener('click', () => {
            this.createNewDocument();
        });

        document.getElementById('btnNewDocument').addEventListener('click', () => {
            this.createNewDocument();
        });

        // Save button
        document.getElementById('btnSave').addEventListener('click', () => {
            if (editor) {
                editor.saveDocument();
                showToast(i18n.translate('documentSaved') || 'Đã lưu tài liệu', 'success');
            }
        });

        // Menu button (toggle sidebar)
        document.getElementById('btnMenu').addEventListener('click', () => {
            document.getElementById('sidebar').classList.toggle('collapsed');
        });

        // Close sidebar button
        document.getElementById('btnCloseSidebar').addEventListener('click', () => {
            document.getElementById('sidebar').classList.add('collapsed');
        });

        // Document title change
        document.getElementById('documentTitle').addEventListener('change', () => {
            if (this.currentDocumentId && editor) {
                editor.saveDocument();
            }
        });

        // Search documents
        document.getElementById('searchDocuments').addEventListener('input', (e) => {
            this.searchDocuments(e.target.value);
        });
    }

    // Create new document
    createNewDocument() {
        const id = this.storageManager.createDocument();
        if (id) {
            this.loadDocument(id);
            this.loadDocuments();
            showToast(i18n.translate('newDocumentCreated') || 'Đã tạo tài liệu mới', 'success');
        }
    }

    // Load document into editor
    loadDocument(id) {
        const doc = this.storageManager.getDocument(id);
        if (!doc) {
            showToast(i18n.translate('documentNotFound') || 'Không tìm thấy tài liệu', 'error');
            return;
        }

        this.currentDocumentId = id;
        if (typeof editor !== 'undefined' && editor) {
            editor.currentDocumentId = id;
        }

        // Set document title
        document.getElementById('documentTitle').value = doc.title;

        // Load content into editor
        if (typeof editor !== 'undefined' && editor) {
            editor.setContent(doc.content);
        }

        // Update active document in sidebar
        this.updateActiveDocument(id);

        // Hide sidebar on mobile
        if (window.innerWidth <= 1024) {
            document.getElementById('sidebar').classList.add('collapsed');
        }
    }

    // Load all documents into sidebar
    loadDocuments() {
        const documents = this.storageManager.getDocumentsSorted();
        const documentsList = document.getElementById('documentsList');
        
        if (documents.length === 0) {
            documentsList.innerHTML = `
                <div style="text-align: center; padding: 20px; color: var(--text-secondary);">
                    <i class="fas fa-folder-open" style="font-size: 48px; opacity: 0.3; margin-bottom: 10px;"></i>
                    <p data-i18n="noDocuments">${i18n.translate('noDocuments') || 'Chưa có tài liệu nào'}</p>
                </div>
            `;
            return;
        }

        documentsList.innerHTML = documents.map(doc => {
            const date = new Date(doc.lastModified);
            const formattedDate = this.formatDate(date);
            
            return `
                <div class="document-item" data-id="${doc.id}">
                    <i class="fas fa-file-alt"></i>
                    <div class="document-info">
                        <div class="document-name">${this.escapeHtml(doc.title)}</div>
                        <div class="document-date">${formattedDate}</div>
                    </div>
                    <div class="document-actions" style="display: none;">
                        <button class="btn-icon btn-delete" title="${i18n.translate('delete') || 'Xóa'}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        // Add event listeners
        documentsList.querySelectorAll('.document-item').forEach(item => {
            const id = item.getAttribute('data-id');
            
            item.addEventListener('click', (e) => {
                if (!e.target.closest('.btn-delete')) {
                    this.loadDocument(id);
                }
            });

            // Show actions on hover
            item.addEventListener('mouseenter', () => {
                item.querySelector('.document-actions').style.display = 'flex';
            });

            item.addEventListener('mouseleave', () => {
                item.querySelector('.document-actions').style.display = 'none';
            });

            // Delete button
            const deleteBtn = item.querySelector('.btn-delete');
            if (deleteBtn) {
                deleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.deleteDocument(id);
                });
            }
        });
    }

    // Update active document highlight
    updateActiveDocument(id) {
        document.querySelectorAll('.document-item').forEach(item => {
            item.classList.toggle('active', item.getAttribute('data-id') === id);
        });
    }

    // Delete document
    deleteDocument(id) {
        if (confirm(i18n.translate('confirmDelete') || 'Bạn có chắc muốn xóa tài liệu này?')) {
            const wasActive = this.currentDocumentId === id;
            
            if (this.storageManager.deleteDocument(id)) {
                this.loadDocuments();
                
                if (wasActive) {
                    const documents = this.storageManager.getDocumentsSorted();
                    if (documents.length > 0) {
                        this.loadDocument(documents[0].id);
                    } else {
                        this.createNewDocument();
                    }
                }
            }
        }
    }

    // Search documents
    searchDocuments(query) {
        if (!query.trim()) {
            this.loadDocuments();
            return;
        }

        const results = this.storageManager.searchDocuments(query);
        const documentsList = document.getElementById('documentsList');

        if (results.length === 0) {
            documentsList.innerHTML = `
                <div style="text-align: center; padding: 20px; color: var(--text-secondary);">
                    <i class="fas fa-search" style="font-size: 48px; opacity: 0.3; margin-bottom: 10px;"></i>
                    <p data-i18n="noResults">${i18n.translate('noResults') || 'Không tìm thấy kết quả'}</p>
                </div>
            `;
            return;
        }

        documentsList.innerHTML = results.map(doc => {
            const date = new Date(doc.lastModified);
            const formattedDate = this.formatDate(date);
            
            return `
                <div class="document-item ${doc.id === this.currentDocumentId ? 'active' : ''}" data-id="${doc.id}">
                    <i class="fas fa-file-alt"></i>
                    <div class="document-info">
                        <div class="document-name">${this.escapeHtml(doc.title)}</div>
                        <div class="document-date">${formattedDate}</div>
                    </div>
                </div>
            `;
        }).join('');

        // Add event listeners
        documentsList.querySelectorAll('.document-item').forEach(item => {
            item.addEventListener('click', () => {
                this.loadDocument(item.getAttribute('data-id'));
            });
        });
    }

    // Format date
    formatDate(date) {
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return i18n.translate('justNow') || 'Vừa xong';
        if (diffMins < 60) return `${diffMins} ${i18n.translate('minutesAgo') || 'phút trước'}`;
        if (diffHours < 24) return `${diffHours} ${i18n.translate('hoursAgo') || 'giờ trước'}`;
        if (diffDays < 7) return `${diffDays} ${i18n.translate('daysAgo') || 'ngày trước'}`;
        
        return date.toLocaleDateString();
    }

    // Escape HTML to prevent XSS
    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }
}

// Initialize storage and document manager
let storageManager;
let documentManager;

// Wait for editor to be ready before initializing document manager
function initializeDocumentManager() {
    if (typeof editor !== 'undefined' && editor && editor.quill) {
        console.log('✅ DocumentManager initializing...');
        documentManager = new DocumentManager();
        console.log('✅ DocumentManager initialized');
    } else {
        setTimeout(initializeDocumentManager, 100);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ StorageManager initializing...');
    storageManager = new StorageManager();
    console.log('✅ StorageManager initialized');
    initializeDocumentManager();
});
