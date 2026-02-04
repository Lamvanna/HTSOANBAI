// ============================================
// INTERNATIONALIZATION (i18n) - Multi-language Support
// ============================================

class I18n {
    constructor() {
        this.currentLanguage = 'vi';
        this.translations = {
            vi: {
                // App Info
                appName: 'Soạn Thảo Việt-Khmer',
                untitledDocument: 'Tài liệu chưa có tên',
                startTyping: 'Bắt đầu soạn thảo văn bản...',
                
                // Header & Menu
                guest: 'Khách',
                myDocuments: 'Tài liệu của tôi',
                settings: 'Cài đặt',
                
                // Toolbar Actions
                newDocument: 'Tài liệu mới',
                save: 'Lưu',
                exportWord: 'Xuất Word',
                exportPDF: 'Xuất PDF',
                print: 'In',
                undo: 'Hoàn tác',
                redo: 'Làm lại',
                
                // Text Formatting
                bold: 'In đậm',
                italic: 'In nghiêng',
                underline: 'Gạch chân',
                strikethrough: 'Gạch ngang',
                textColor: 'Màu chữ',
                backgroundColor: 'Màu nền',
                removeBackground: 'Xóa màu nền',
                
                // Alignment
                alignLeft: 'Căn trái',
                alignCenter: 'Căn giữa',
                alignRight: 'Căn phải',
                alignJustify: 'Căn đều',
                
                // Lists
                bulletList: 'Danh sách gạch đầu dòng',
                numberList: 'Danh sách đánh số',
                
                // Insert
                insertImage: 'Chèn hình ảnh',
                insertTable: 'Chèn bảng',
                insertLink: 'Chèn liên kết',
                insert: 'Chèn',
                
                // Find & Replace
                find: 'Tìm kiếm',
                findReplace: 'Tìm & Thay thế',
                findWhat: 'Tìm kiếm:',
                replaceWith: 'Thay bằng:',
                findNext: 'Tìm tiếp',
                replace: 'Thay thế',
                replaceAll: 'Thay thế tất cả',
                
                // Statistics
                statistics: 'Thống kê',
                words: 'từ',
                characters: 'ký tự',
                charactersNoSpaces: 'Ký tự (không dấu cách)',
                paragraphs: 'Đoạn văn',
                page: 'trang',
                pages: 'Trang',
                readingTime: 'Thời gian đọc',
                minutes: 'phút',
                
                // Table
                rows: 'Số hàng',
                columns: 'Số cột',
                
                // Link
                linkText: 'Văn bản hiển thị',
                linkUrl: 'URL',
                
                // Common
                cancel: 'Hủy',
                delete: 'Xóa',
                copy: 'Bản sao',
                search: 'Tìm kiếm...',
                
                // Status
                saved: 'Đã lưu',
                saving: 'Đang lưu...',
                loading: 'Đang xử lý...',
                
                // Messages
                documentSaved: 'Đã lưu tài liệu',
                newDocumentCreated: 'Đã tạo tài liệu mới',
                documentNotFound: 'Không tìm thấy tài liệu',
                documentDeleted: 'Đã xóa tài liệu',
                noDocuments: 'Chưa có tài liệu nào',
                noResults: 'Không tìm thấy kết quả',
                
                // Validation & Errors
                invalidImageFormat: 'Định dạng hình ảnh không hợp lệ',
                invalidTableSize: 'Kích thước bảng không hợp lệ',
                enterUrl: 'Vui lòng nhập URL',
                enterSearchText: 'Vui lòng nhập từ khóa tìm kiếm',
                found: 'Đã tìm thấy',
                foundFromStart: 'Tìm thấy từ đầu tài liệu',
                notFound: 'Không tìm thấy',
                replaced: 'Đã thay thế',
                replacedCount: 'Đã thay thế',
                occurrences: 'lần',
                
                // Export Messages
                tableInserted: 'Đã chèn bảng',
                linkInserted: 'Đã chèn liên kết',
                exportingWord: 'Đang xuất file Word...',
                exportedWord: 'Đã xuất file Word thành công',
                errorExportingWord: 'Lỗi khi xuất file Word',
                exportingPDF: 'Đang xuất file PDF...',
                exportedPDF: 'Đã xuất file PDF thành công',
                errorExportingPDF: 'Lỗi khi xuất file PDF',
                exportedJSON: 'Đã xuất file JSON',
                importedJSON: 'Đã nhập tài liệu',
                errorImporting: 'Lỗi khi nhập tài liệu',
                
                // Storage
                storageQuotaExceeded: 'Dung lượng lưu trữ đã đầy',
                errorSaving: 'Lỗi khi lưu tài liệu',
                errorDeleting: 'Lỗi khi xóa tài liệu',
                errorClearing: 'Lỗi khi xóa tài liệu',
                confirmDelete: 'Bạn có chắc muốn xóa tài liệu này?',
                confirmClearAll: 'Bạn có chắc muốn xóa tất cả tài liệu? Hành động này không thể hoàn tác.',
                allDocumentsDeleted: 'Đã xóa tất cả tài liệu',
                
                // Time
                justNow: 'Vừa xong',
                minutesAgo: 'phút trước',
                hoursAgo: 'giờ trước',
                daysAgo: 'ngày trước',
                
                // New features
                keyboardShortcuts: 'Phím tắt',
                templates: 'Mẫu tài liệu',
                fullscreen: 'Toàn màn hình',
                importDocument: 'Nhập tài liệu',
                closeModal: 'Đóng cửa sổ',
                
                // Settings
                generalSettings: 'Cài đặt chung',
                autoSave: 'Tự động lưu',
                autoSaveInterval: 'Tần suất tự động lưu (giây)',
                defaultFont: 'Font chữ mặc định',
                defaultFontSize: 'Cỡ chữ mặc định',
                appearance: 'Giao diện',
                darkMode: 'Chế độ tối',
                compactToolbar: 'Toolbar thu gọn',
                storage: 'Dung lượng',
                totalDocuments: 'Tổng số tài liệu',
                usedStorage: 'Dung lượng đã dùng',
                clearAllData: 'Xóa tất cả dữ liệu',
                saveSettings: 'Lưu cài đặt',
                settingsSaved: 'Đã lưu cài đặt',
                
                // Templates
                confirmApplyTemplate: 'Áp dụng mẫu này? Nội dung hiện tại sẽ bị thay thế.',
                templateApplied: 'Đã áp dụng mẫu'
            },
            
            km: {
                // App Info
                appName: 'កម្មវិធីសរសេរ វៀត-ខ្មែរ',
                untitledDocument: 'ឯកសារគ្មានចំណងជើង',
                startTyping: 'ចាប់ផ្តើមសរសេរឯកសារ...',
                
                // Header & Menu
                guest: 'ភ្ញៀវ',
                myDocuments: 'ឯកសាររបស់ខ្ញុំ',
                settings: 'ការកំណត់',
                
                // Toolbar Actions
                newDocument: 'ឯកសារថ្មី',
                save: 'រក្សាទុក',
                exportWord: 'នាំចេញ Word',
                exportPDF: 'នាំចេញ PDF',
                print: 'បោះពុម្ព',
                undo: 'មិនធ្វើវិញ',
                redo: 'ធ្វើម្តងទៀត',
                
                // Text Formatting
                bold: 'ដិត',
                italic: 'ទ្រេត',
                underline: 'គូសបន្ទាត់ក្រោម',
                strikethrough: 'គូសបន្ទាត់កណ្តាល',
                textColor: 'ពណ៌អក្សរ',
                backgroundColor: 'ពណ៌ផ្ទៃខាងក្រោយ',                removeBackground: 'លុបពណ៌ភ្ទៃខាងក្រោម',                
                // Alignment
                alignLeft: 'តម្រឹមឆ្វេង',
                alignCenter: 'តម្រឹមកណ្តាល',
                alignRight: 'តម្រឹមស្តាំ',
                alignJustify: 'តម្រឹមពេញ',
                
                // Lists
                bulletList: 'បញ្ជីចំណុច',
                numberList: 'បញ្ជីលេខ',
                
                // Insert
                insertImage: 'បញ្ចូលរូបភាព',
                insertTable: 'បញ្ចូលតារាង',
                insertLink: 'បញ្ចូលតំណ',
                insert: 'បញ្ចូល',
                
                // Find & Replace
                find: 'ស្វែងរក',
                findReplace: 'ស្វែងរក & ជំនួស',
                findWhat: 'ស្វែងរក:',
                replaceWith: 'ជំនួសដោយ:',
                findNext: 'ស្វែងរកបន្ទាប់',
                replace: 'ជំនួស',
                replaceAll: 'ជំនួសទាំងអស់',
                
                // Statistics
                statistics: 'ស្ថិតិ',
                words: 'ពាក្យ',
                characters: 'តួអក្សរ',
                charactersNoSpaces: 'តួអក្សរ (គ្មានដកឃ្លា)',
                paragraphs: 'កថាខណ្ឌ',
                page: 'ទំព័រ',
                pages: 'ទំព័រ',
                readingTime: 'ពេលវេលាអាន',
                minutes: 'នាទី',
                
                // Table
                rows: 'ចំនួនជួរដេក',
                columns: 'ចំនួនជួរឈរ',
                
                // Link
                linkText: 'អត្ថបទបង្ហាញ',
                linkUrl: 'តំណភ្ជាប់',
                
                // Common
                cancel: 'បោះបង់',
                delete: 'លុប',
                copy: 'ចម្លង',
                search: 'ស្វែងរក...',
                
                // Status
                saved: 'បានរក្សាទុក',
                saving: 'កំពុងរក្សាទុក...',
                loading: 'កំពុងដំណើរការ...',
                
                // Messages
                documentSaved: 'បានរក្សាទុកឯកសារ',
                newDocumentCreated: 'បានបង្កើតឯកសារថ្មី',
                documentNotFound: 'រកមិនឃើញឯកសារ',
                documentDeleted: 'បានលុបឯកសារ',
                noDocuments: 'មិនមានឯកសារ',
                noResults: 'រកមិនឃើញលទ្ធផល',
                
                // Validation & Errors
                invalidImageFormat: 'ទ្រង់ទ្រាយរូបភាពមិនត្រឹមត្រូវ',
                invalidTableSize: 'ទំហំតារាងមិនត្រឹមត្រូវ',
                enterUrl: 'សូមបញ្ចូលតំណភ្ជាប់',
                enterSearchText: 'សូមបញ្ចូលពាក្យស្វែងរក',
                found: 'រកឃើញ',
                foundFromStart: 'រកឃើញពីដើមឯកសារ',
                notFound: 'រកមិនឃើញ',
                replaced: 'បានជំនួស',
                replacedCount: 'បានជំនួស',
                occurrences: 'ដង',
                
                // Export Messages
                tableInserted: 'បានបញ្ចូលតារាង',
                linkInserted: 'បានបញ្ចូលតំណ',
                exportingWord: 'កំពុងនាំចេញ Word...',
                exportedWord: 'បាននាំចេញ Word ដោយជោគជ័យ',
                errorExportingWord: 'កំហុសក្នុងការនាំចេញ Word',
                exportingPDF: 'កំពុងនាំចេញ PDF...',
                exportedPDF: 'បាននាំចេញ PDF ដោយជោគជ័យ',
                errorExportingPDF: 'កំហុសក្នុងការនាំចេញ PDF',
                exportedJSON: 'បាននាំចេញ JSON',
                importedJSON: 'បាននាំចូលឯកសារ',
                errorImporting: 'កំហុសក្នុងការនាំចូលឯកសារ',
                
                // Storage
                storageQuotaExceeded: 'ទំហំផ្ទុកពេញ',
                errorSaving: 'កំហុសក្នុងការរក្សាទុក',
                errorDeleting: 'កំហុសក្នុងការលុប',
                errorClearing: 'កំហុសក្នុងការលុបឯកសារ',
                confirmDelete: 'តើអ្នកប្រាកដថាចង់លុបឯកសារនេះ?',
                confirmClearAll: 'តើអ្នកប្រាកដថាចង់លុបឯកសារទាំងអស់? សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។',
                allDocumentsDeleted: 'បានលុបឯកសារទាំងអស់',
                
                // Time
                justNow: 'ទើបតែ',
                minutesAgo: 'នាទីមុន',
                hoursAgo: 'ម៉ោងមុន',
                daysAgo: 'ថ្ងៃមុន',
                
                // New features
                keyboardShortcuts: 'ផ្លូវកាត់',
                templates: 'គំរូឯកសារ',
                fullscreen: 'ពេញអេក្រង់',
                importDocument: 'នាំចូលឯកសារ',
                closeModal: 'បិទបង្អួច',
                
                // Settings
                generalSettings: 'ការកំណត់ទូទៅ',
                autoSave: 'រក្សាទុកស្វ័យប្រវត្តិ',
                autoSaveInterval: 'ប្រេកង់រក្សាទុកស្វ័យប្រវត្តិ (វិនាទី)',
                defaultFont: 'ពុម្ពអក្សរលំនាំដើម',
                defaultFontSize: 'ទំហំអក្សរលំនាំដើម',
                appearance: 'រូបរាង',
                darkMode: 'របៀបងងឹត',
                compactToolbar: 'របារឧបករណ៍តូច',
                storage: 'ទំហំផ្ទុក',
                totalDocuments: 'ឯកសារសរុប',
                usedStorage: 'ទំហំផ្ទុកបានប្រើ',
                clearAllData: 'លុបទិន្នន័យទាំងអស់',
                saveSettings: 'រក្សាទុកការកំណត់',
                settingsSaved: 'បានរក្សាទុកការកំណត់',
                
                // Templates
                confirmApplyTemplate: 'ប្រើគំរូនេះ? ខ្លឹមសារបច្ចុប្បន្ននឹងត្រូវជំនួស។',
                templateApplied: 'បានប្រើគំរូ'
            }
        };
        
        this.init();
    }

    init() {
        // Load saved language preference
        const savedLanguage = localStorage.getItem('app_language');
        if (savedLanguage && this.translations[savedLanguage]) {
            this.currentLanguage = savedLanguage;
        }
        
        this.setupEventHandlers();
        this.applyLanguage();
    }

    setupEventHandlers() {
        // Language switcher button
        const btnLanguage = document.getElementById('btnLanguage');
        const languageMenu = document.getElementById('languageMenu');
        
        if (btnLanguage && languageMenu) {
            btnLanguage.addEventListener('click', (e) => {
                e.stopPropagation();
                languageMenu.classList.toggle('active');
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!languageMenu.contains(e.target) && e.target !== btnLanguage) {
                    languageMenu.classList.remove('active');
                }
            });

            // Language selection
            languageMenu.querySelectorAll('button[data-lang]').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const lang = btn.getAttribute('data-lang');
                    this.setLanguage(lang);
                    languageMenu.classList.remove('active');
                });
            });
        }
    }

    // Set and apply language
    setLanguage(lang) {
        if (this.translations[lang]) {
            this.currentLanguage = lang;
            localStorage.setItem('app_language', lang);
            this.applyLanguage();
            
            // Update document body lang attribute
            document.documentElement.lang = lang;
            
            // Show notification
            const message = lang === 'vi' ? 'Đã chuyển sang Tiếng Việt' : 'បានប្តូរទៅភាសាខ្មែរ';
            showToast(message, 'success');
        }
    }

    // Apply current language to all elements
    applyLanguage() {
        const lang = this.currentLanguage;
        
        // Translate elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.translate(key);
            if (translation) {
                element.textContent = translation;
            }
        });

        // Translate placeholders with data-i18n-placeholder attribute
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            const translation = this.translate(key);
            if (translation) {
                element.placeholder = translation;
            }
        });

        // Translate titles with data-i18n-title attribute
        document.querySelectorAll('[data-i18n-title]').forEach(element => {
            const key = element.getAttribute('data-i18n-title');
            const translation = this.translate(key);
            if (translation) {
                element.title = translation;
            }
        });

        // Update Quill editor placeholder if it exists
        if (window.editor && window.editor.quill) {
            const placeholder = this.translate('startTyping');
            if (placeholder) {
                window.editor.quill.root.dataset.placeholder = placeholder;
            }
        }

        // Add Khmer font class if Khmer language is selected
        if (lang === 'km') {
            document.body.classList.add('khmer-text');
        } else {
            document.body.classList.remove('khmer-text');
        }
    }

    // Get translation for a key
    translate(key) {
        const lang = this.currentLanguage;
        if (this.translations[lang] && this.translations[lang][key]) {
            return this.translations[lang][key];
        }
        // Fallback to Vietnamese if translation not found
        if (this.translations['vi'][key]) {
            return this.translations['vi'][key];
        }
        return null;
    }

    // Get current language
    getCurrentLanguage() {
        return this.currentLanguage;
    }

    // Add new translation
    addTranslation(lang, key, value) {
        if (!this.translations[lang]) {
            this.translations[lang] = {};
        }
        this.translations[lang][key] = value;
    }

    // Add multiple translations
    addTranslations(lang, translations) {
        if (!this.translations[lang]) {
            this.translations[lang] = {};
        }
        Object.assign(this.translations[lang], translations);
    }
}

// Initialize i18n with error handling
let i18n;
try {
    i18n = new I18n();
    // Make it globally accessible
    if (typeof window !== 'undefined') {
        window.i18n = i18n;
    }
    console.log('✅ i18n initialized successfully');
} catch (error) {
    console.error('❌ Failed to initialize i18n:', error);
    // Create minimal fallback
    i18n = {
        currentLanguage: 'vi',
        translate: function(key) { return key || ''; },
        setLanguage: function() {},
        getCurrentLanguage: function() { return 'vi'; },
        addTranslation: function() {},
        addTranslations: function() {}
    };
    if (typeof window !== 'undefined') {
        window.i18n = i18n;
    }
}
