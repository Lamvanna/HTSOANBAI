// ============================================
// RICH TEXT EDITOR - Quill.js Implementation
// ============================================

class TextEditor {
    constructor() {
        this.quill = null;
        this.currentDocumentId = null;
        this.autoSaveInterval = null;
        // Don't init immediately - wait for DOM
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;
        
        // Check if DOM is ready and editor element exists
        const editorElement = document.getElementById('editor');
        if (!editorElement) {
            console.warn('⚠️ Editor element not found, retrying...');
            setTimeout(() => this.init(), 100);
            return;
        }

        try {
            this.initializeQuill();
            this.setupToolbarHandlers();
            this.setupEditorEvents();
            this.startAutoSave();
            this.initialized = true;
        } catch (error) {
            console.error('❌ Editor init failed:', error);
            setTimeout(() => this.init(), 500);
        }
    }

    // Initialize Quill Editor with custom configuration
    initializeQuill() {
        try {
            // Check if Quill is loaded
            if (typeof Quill === 'undefined') {
                throw new Error('Quill library not loaded');
            }

            // Custom Font class with proper CSS class names
            const Font = Quill.import('formats/font');
            Font.whitelist = [
                'arial', 'times', 'verdana', 'georgia', 'tahoma',
                'battambang', 'bayon', 'content', 'dangrek', 'hanuman',
                'kantumruy', 'khmer', 'koulen', 'metal', 'moul',
                'moulpali', 'nokora', 'odor', 'preahvihear',
                'siemreap', 'suwannaphum', 'taprom'
            ];
            Quill.register(Font, true);

            // Register custom Size class
            const Size = Quill.import('attributors/style/size');
            Size.whitelist = ['8px', '9px', '10px', '11px', '12px', '14px', '16px', 
                              '18px', '20px', '22px', '24px', '28px', '32px', '36px', 
                              '48px', '72px'];
            Quill.register(Size, true);

            this.quill = new Quill('#editor', {
            theme: 'snow',
            modules: {
                toolbar: false, // We'll use custom toolbar
                history: {
                    delay: 1000,
                    maxStack: 100,
                    userOnly: true
                },
                clipboard: {
                    matchVisual: false
                }
            },
            placeholder: i18n.translate('startTyping') || 'Bắt đầu soạn thảo...',
            formats: ['font', 'size', 'bold', 'italic', 'underline', 'strike',
                     'color', 'background', 'align', 'list', 'link', 'image', 
                     'blockquote', 'code-block', 'header']
        });

        // Set default font
        this.quill.format('font', 'arial');
        this.quill.format('size', '14px');
        
        console.log('✅ Editor initialized with fonts:', Font.whitelist);
        } catch (error) {
            console.error('❌ Failed to initialize Quill:', error);
            // Show user-friendly error
            const editorContainer = document.getElementById('editor');
            if (editorContainer) {
                editorContainer.innerHTML = '<div style="padding: 20px; text-align: center; color: #ff6b6b;"><i class="fas fa-exclamation-triangle"></i><br>Không thể khởi tạo trình soạn thảo.<br><small>Vui lòng tải lại trang.</small></div>';
            }
            throw error;
        }
    }

    // Setup all toolbar button handlers
    setupToolbarHandlers() {
        // Undo/Redo
        document.getElementById('btnUndo').addEventListener('click', () => {
            this.quill.history.undo();
        });

        document.getElementById('btnRedo').addEventListener('click', () => {
            this.quill.history.redo();
        });

        // Font Family
        document.getElementById('fontFamily').addEventListener('change', (e) => {
            this.quill.format('font', e.target.value);
            this.quill.focus();
        });

        // Font Size
        document.getElementById('fontSize').addEventListener('change', (e) => {
            this.quill.format('size', e.target.value);
            this.quill.focus();
        });

        // Text Formatting
        document.getElementById('btnBold').addEventListener('click', () => {
            this.toggleFormat('bold');
        });

        document.getElementById('btnItalic').addEventListener('click', () => {
            this.toggleFormat('italic');
        });

        document.getElementById('btnUnderline').addEventListener('click', () => {
            this.toggleFormat('underline');
        });

        document.getElementById('btnStrike').addEventListener('click', () => {
            this.toggleFormat('strike');
        });

        // Colors
        const textColorBtn = document.getElementById('btnTextColor');
        const bgColorBtn = document.getElementById('btnBgColor');
        const textColorDropdown = document.getElementById('textColorDropdown');
        const bgColorDropdown = document.getElementById('bgColorDropdown');
        
        // Toggle text color dropdown
        textColorBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            textColorDropdown.classList.toggle('active');
            bgColorDropdown.classList.remove('active');
        });
        
        // Toggle background color dropdown
        bgColorBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            bgColorDropdown.classList.toggle('active');
            textColorDropdown.classList.remove('active');
        });
        
        // Close dropdowns when clicking outside
        document.addEventListener('click', () => {
            textColorDropdown.classList.remove('active');
            bgColorDropdown.classList.remove('active');
        });
        
        // Prevent dropdown from closing when clicking inside
        textColorDropdown.addEventListener('click', (e) => e.stopPropagation());
        bgColorDropdown.addEventListener('click', (e) => e.stopPropagation());
        
        // Text color preset buttons
        textColorDropdown.querySelectorAll('.color-preset').forEach(btn => {
            btn.addEventListener('click', () => {
                const color = btn.getAttribute('data-color');
                this.quill.format('color', color);
                document.getElementById('textColorIndicator').style.background = color;
                document.getElementById('textColor').value = color;
                textColorDropdown.classList.remove('active');
                this.quill.focus();
            });
        });
        
        // Background color preset buttons
        bgColorDropdown.querySelectorAll('.color-preset').forEach(btn => {
            btn.addEventListener('click', () => {
                const color = btn.getAttribute('data-color');
                this.quill.format('background', color);
                document.getElementById('bgColorIndicator').style.background = color;
                document.getElementById('bgColor').value = color;
                bgColorDropdown.classList.remove('active');
                this.quill.focus();
            });
        });
        
        // Custom text color
        document.getElementById('textColor').addEventListener('input', (e) => {
            this.quill.format('color', e.target.value);
            document.getElementById('textColorIndicator').style.background = e.target.value;
        });

        // Custom background color
        document.getElementById('bgColor').addEventListener('input', (e) => {
            this.quill.format('background', e.target.value);
            document.getElementById('bgColorIndicator').style.background = e.target.value;
        });

        // Remove background color button
        document.getElementById('btnRemoveBgColor').addEventListener('click', () => {
            this.quill.format('background', false);
            this.quill.focus();
        });

        // Alignment
        document.querySelectorAll('.btn-align').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const align = btn.getAttribute('data-align');
                this.quill.format('align', align === 'left' ? false : align);
                this.updateAlignmentButtons(align);
                this.quill.focus();
            });
        });

        // Lists
        document.getElementById('btnBulletList').addEventListener('click', () => {
            this.toggleList('bullet');
        });

        document.getElementById('btnNumberList').addEventListener('click', () => {
            this.toggleList('ordered');
        });

        // Insert Image
        document.getElementById('btnInsertImage').addEventListener('click', () => {
            document.getElementById('imageInput').click();
        });

        document.getElementById('imageInput').addEventListener('change', (e) => {
            this.insertImage(e.target.files[0]);
        });

        // Insert Table
        document.getElementById('btnInsertTable').addEventListener('click', () => {
            this.showModal('tableModal');
        });

        document.getElementById('btnInsertTableConfirm').addEventListener('click', () => {
            this.insertTable();
        });

        // Insert Link
        document.getElementById('btnInsertLink').addEventListener('click', () => {
            this.showLinkModal();
        });

        document.getElementById('btnInsertLinkConfirm').addEventListener('click', () => {
            this.insertLink();
        });

        // Find & Replace
        document.getElementById('btnFind').addEventListener('click', () => {
            this.showModal('findModal');
        });

        document.getElementById('btnFindNext').addEventListener('click', () => {
            this.findNext();
        });

        document.getElementById('btnReplace').addEventListener('click', () => {
            this.replace();
        });

        document.getElementById('btnReplaceAll').addEventListener('click', () => {
            this.replaceAll();
        });

        // Statistics
        document.getElementById('btnStats').addEventListener('click', () => {
            this.showStatistics();
        });

        // Print
        document.getElementById('btnPrint').addEventListener('click', () => {
            window.print();
        });

        // Update toolbar state on selection change
        this.quill.on('selection-change', (range) => {
            if (range) {
                this.updateToolbarState();
            }
        });
    }

    // Setup editor content change events
    setupEditorEvents() {
        this.quill.on('text-change', () => {
            this.updateStats();
            this.markAsUnsaved();
            
            // Schedule auto-save
            if (this.autoSaveTimeout) {
                clearTimeout(this.autoSaveTimeout);
            }
            this.autoSaveTimeout = setTimeout(() => {
                this.saveDocument();
            }, 2000);
        });
    }

    // Toggle format (bold, italic, etc.)
    toggleFormat(format) {
        const selection = this.quill.getSelection();
        if (!selection) {
            this.quill.focus();
            return;
        }
        
        const currentFormat = this.quill.getFormat();
        const newValue = !currentFormat[format];
        
        if (selection.length === 0) {
            // No text selected - apply format to cursor position for next typing
            this.quill.format(format, newValue);
        } else {
            // Text selected - apply format to selection
            this.quill.formatText(selection.index, selection.length, format, newValue);
        }
        
        this.quill.focus();
    }

    // Toggle list format
    toggleList(type) {
        const currentFormat = this.quill.getFormat();
        this.quill.format('list', currentFormat.list === type ? false : type);
        this.quill.focus();
    }

    // Update toolbar button states based on current selection
    updateToolbarState() {
        const format = this.quill.getFormat();
        
        // Update format buttons
        document.getElementById('btnBold').classList.toggle('active', format.bold === true);
        document.getElementById('btnItalic').classList.toggle('active', format.italic === true);
        document.getElementById('btnUnderline').classList.toggle('active', format.underline === true);
        document.getElementById('btnStrike').classList.toggle('active', format.strike === true);

        // Update font family
        if (format.font) {
            document.getElementById('fontFamily').value = format.font;
        }

        // Update font size
        if (format.size) {
            document.getElementById('fontSize').value = format.size;
        }

        // Update alignment
        const align = format.align || 'left';
        this.updateAlignmentButtons(align);

        // Update colors
        if (format.color) {
            document.getElementById('textColor').value = format.color;
            document.getElementById('textColorIndicator').style.background = format.color;
        }
        if (format.background) {
            document.getElementById('bgColor').value = format.background;
            document.getElementById('bgColorIndicator').style.background = format.background;
        }
    }

    // Update alignment button states
    updateAlignmentButtons(activeAlign) {
        document.querySelectorAll('.btn-align').forEach(btn => {
            const align = btn.getAttribute('data-align');
            btn.classList.toggle('active', align === activeAlign);
        });
    }

    // Insert image from file
    insertImage(file) {
        if (!file || !file.type.match(/^image\//)) {
            showToast(i18n.translate('invalidImageFormat') || 'Định dạng hình ảnh không hợp lệ', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const range = this.quill.getSelection(true);
            this.quill.insertEmbed(range.index, 'image', e.target.result);
            this.quill.setSelection(range.index + 1);
        };
        reader.readAsDataURL(file);
    }

    // Insert table
    insertTable() {
        const rows = parseInt(document.getElementById('tableRows').value);
        const cols = parseInt(document.getElementById('tableCols').value);

        if (rows < 1 || cols < 1 || rows > 20 || cols > 10) {
            showToast(i18n.translate('invalidTableSize') || 'Kích thước bảng không hợp lệ', 'error');
            return;
        }

        let tableHTML = '<table style="border-collapse: collapse; width: 100%;">';
        for (let i = 0; i < rows; i++) {
            tableHTML += '<tr>';
            for (let j = 0; j < cols; j++) {
                tableHTML += `<td style="border: 1px solid #dadce0; padding: 8px 12px;">${i === 0 ? 'Header' : 'Cell'}</td>`;
            }
            tableHTML += '</tr>';
        }
        tableHTML += '</table>';

        const range = this.quill.getSelection(true);
        this.quill.clipboard.dangerouslyPasteHTML(range.index, tableHTML);
        
        this.hideModal('tableModal');
        showToast(i18n.translate('tableInserted') || 'Đã chèn bảng', 'success');
    }

    // Show link modal
    showLinkModal() {
        const selection = this.quill.getSelection();
        if (selection && selection.length > 0) {
            const text = this.quill.getText(selection.index, selection.length);
            document.getElementById('linkText').value = text;
        } else {
            document.getElementById('linkText').value = '';
        }
        document.getElementById('linkUrl').value = '';
        this.showModal('linkModal');
    }

    // Insert link
    insertLink() {
        const text = document.getElementById('linkText').value.trim();
        const url = document.getElementById('linkUrl').value.trim();

        if (!url) {
            showToast(i18n.translate('enterUrl') || 'Vui lòng nhập URL', 'error');
            return;
        }

        const selection = this.quill.getSelection(true);
        
        if (text) {
            this.quill.deleteText(selection.index, selection.length);
            this.quill.insertText(selection.index, text, 'link', url);
            this.quill.setSelection(selection.index + text.length);
        } else {
            this.quill.format('link', url);
        }

        this.hideModal('linkModal');
        showToast(i18n.translate('linkInserted') || 'Đã chèn liên kết', 'success');
    }

    // Find next occurrence
    findNext() {
        const searchText = document.getElementById('findText').value;
        if (!searchText) {
            showToast(i18n.translate('enterSearchText') || 'Vui lòng nhập từ khóa tìm kiếm', 'error');
            return;
        }

        const content = this.quill.getText();
        const currentIndex = this.quill.getSelection()?.index || 0;
        const foundIndex = content.indexOf(searchText, currentIndex);

        if (foundIndex !== -1) {
            this.quill.setSelection(foundIndex, searchText.length);
            showToast(i18n.translate('found') || 'Đã tìm thấy', 'success');
        } else {
            // Search from beginning
            const foundFromStart = content.indexOf(searchText, 0);
            if (foundFromStart !== -1) {
                this.quill.setSelection(foundFromStart, searchText.length);
                showToast(i18n.translate('foundFromStart') || 'Tìm thấy từ đầu tài liệu', 'success');
            } else {
                showToast(i18n.translate('notFound') || 'Không tìm thấy', 'error');
            }
        }
    }

    // Replace current selection
    replace() {
        const searchText = document.getElementById('findText').value;
        const replaceText = document.getElementById('replaceText').value;
        
        const selection = this.quill.getSelection();
        if (selection && selection.length > 0) {
            const selectedText = this.quill.getText(selection.index, selection.length);
            if (selectedText === searchText) {
                this.quill.deleteText(selection.index, selection.length);
                this.quill.insertText(selection.index, replaceText);
                this.quill.setSelection(selection.index + replaceText.length);
                showToast(i18n.translate('replaced') || 'Đã thay thế', 'success');
                this.findNext();
            } else {
                this.findNext();
            }
        } else {
            this.findNext();
        }
    }

    // Replace all occurrences
    replaceAll() {
        const searchText = document.getElementById('findText').value;
        const replaceText = document.getElementById('replaceText').value;
        
        if (!searchText) {
            showToast(i18n.translate('enterSearchText') || 'Vui lòng nhập từ khóa tìm kiếm', 'error');
            return;
        }

        let content = this.quill.getText();
        const count = (content.match(new RegExp(searchText, 'g')) || []).length;
        
        if (count > 0) {
            content = content.replace(new RegExp(searchText, 'g'), replaceText);
            this.quill.setText(content);
            showToast(`${i18n.translate('replacedCount') || 'Đã thay thế'} ${count} ${i18n.translate('occurrences') || 'lần'}`, 'success');
        } else {
            showToast(i18n.translate('notFound') || 'Không tìm thấy', 'error');
        }
    }

    // Update statistics
    updateStats() {
        const text = this.quill.getText();
        const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
        const chars = text.length;
        const pages = Math.ceil(chars / 3000); // Approximate 3000 chars per page

        document.getElementById('wordCount').innerHTML = `${words} <span data-i18n="words">${i18n.translate('words')}</span>`;
        document.getElementById('charCount').innerHTML = `${chars} <span data-i18n="characters">${i18n.translate('characters')}</span>`;
        document.getElementById('pageCount').innerHTML = `${pages} <span data-i18n="page">${i18n.translate('page')}</span>`;
    }

    // Show detailed statistics
    showStatistics() {
        const text = this.quill.getText();
        const content = this.quill.root.innerHTML;
        
        const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
        const chars = text.length;
        const charsNoSpace = text.replace(/\s/g, '').length;
        const paragraphs = (content.match(/<p>/g) || []).length || 1;
        const pages = Math.ceil(chars / 3000);
        const readTime = Math.ceil(words / 200); // Average reading speed: 200 words/minute

        document.getElementById('statsWords').textContent = words;
        document.getElementById('statsChars').textContent = chars;
        document.getElementById('statsCharsNoSpace').textContent = charsNoSpace;
        document.getElementById('statsParagraphs').textContent = paragraphs;
        document.getElementById('statsPages').textContent = pages;
        document.getElementById('statsReadTime').textContent = `${readTime} ${i18n.translate('minutes') || 'phút'}`;

        this.showModal('statsModal');
    }

    // Get editor content
    getContent() {
        return {
            html: this.quill.root.innerHTML,
            text: this.quill.getText(),
            delta: this.quill.getContents()
        };
    }

    // Set editor content
    setContent(delta) {
        if (delta) {
            this.quill.setContents(delta);
            this.updateStats();
        }
    }

    // Clear editor
    clear() {
        this.quill.setText('');
        this.updateStats();
    }

    // Save document
    saveDocument() {
        if (this.currentDocumentId) {
            const content = this.getContent();
            const title = document.getElementById('documentTitle').value || 'Untitled Document';
            
            storageManager.saveDocument(this.currentDocumentId, {
                title,
                content: content.delta,
                html: content.html,
                lastModified: new Date().toISOString()
            });

            this.markAsSaved();
        }
    }

    // Mark document as unsaved
    markAsUnsaved() {
        const saveStatus = document.getElementById('saveStatus');
        saveStatus.classList.add('saving');
        saveStatus.innerHTML = `<i class="fas fa-circle-notch fa-spin"></i><span data-i18n="saving">${i18n.translate('saving')}</span>`;
    }

    // Mark document as saved
    markAsSaved() {
        const saveStatus = document.getElementById('saveStatus');
        saveStatus.classList.remove('saving', 'error');
        saveStatus.innerHTML = `<i class="fas fa-check-circle"></i><span data-i18n="saved">${i18n.translate('saved')}</span>`;
    }

    // Start auto-save interval
    startAutoSave() {
        this.autoSaveInterval = setInterval(() => {
            if (this.currentDocumentId) {
                this.saveDocument();
            }
        }, 30000); // Auto-save every 30 seconds
    }

    // Modal helpers
    showModal(modalId) {
        document.getElementById(modalId).classList.add('active');
    }

    hideModal(modalId) {
        document.getElementById(modalId).classList.remove('active');
    }
}

// Initialize editor (create instance immediately but init when DOM ready)
const editor = new TextEditor();

// Start initialization when DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        editor.init();
        console.log('✅ Editor initialized');
    });
} else {
    // DOM already loaded
    editor.init();
    console.log('✅ Editor initialized');
}

// Helper function to show toast notifications
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
    
    toast.innerHTML = `<i class="fas ${icon}"></i><span>${message}</span>`;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}
