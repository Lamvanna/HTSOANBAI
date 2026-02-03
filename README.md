# 📝 Website Soạn Thảo Văn Bản Việt - Khmer

## 🌟 Giới Thiệu

Website soạn thảo văn bản trực tuyến đa ngôn ngữ (Việt - Khmer) với đầy đủ tính năng tương tự Microsoft Word, chạy hoàn toàn trên trình duyệt không cần backend.

### ✨ Tính Năng Chính

#### 📄 Soạn Thảo Văn Bản
- ✅ Rich Text Editor với Quill.js
- ✅ Hỗ trợ 17+ font chữ Khmer
- ✅ Định dạng: Bold, Italic, Underline, Strikethrough
- ✅ Màu chữ và màu nền tùy chỉnh
- ✅ Căn chỉnh: Trái, Giữa, Phải, Đều
- ✅ Danh sách: Gạch đầu dòng, Đánh số
- ✅ Undo/Redo không giới hạn

#### 🎨 Chèn Đối Tượng
- ✅ Chèn hình ảnh (drag & drop, paste)
- ✅ Chèn bảng (table) tùy chỉnh
- ✅ Chèn liên kết (hyperlink)

#### 💾 Quản Lý Tài Liệu
- ✅ Tạo tài liệu mới
- ✅ Lưu tự động (Auto-save)
- ✅ Quản lý danh sách tài liệu
- ✅ Tìm kiếm tài liệu
- ✅ Lưu trữ LocalStorage
- ✅ Xóa tài liệu

#### 📤 Xuất File
- ✅ Xuất Word (.docx) - Giữ nguyên font Khmer
- ✅ Xuất PDF - Hỗ trợ font Khmer
- ✅ In trực tiếp (Ctrl+P)

#### 🔍 Công Cụ
- ✅ Tìm & Thay thế (Find & Replace)
- ✅ Thống kê: Số từ, ký tự, trang
- ✅ Thời gian đọc ước tính

#### 🌐 Đa Ngôn Ngữ
- ✅ Tiếng Việt 🇻🇳
- ✅ Tiếng Khmer 🇰🇭
- ✅ Chuyển đổi ngôn ngữ giao diện

#### 🎯 Font Khmer Hỗ Trợ
1. Battambang
2. Bayon
3. Content
4. Dangrek
5. Hanuman
6. Kantumruy Pro
7. Khmer
8. Koulen
9. Metal
10. Moul
11. Moulpali
12. Nokora
13. Odor Mean Chey
14. Preahvihear
15. Siemreap
16. Suwannaphum
17. Taprom

---

## 🚀 Cách Sử Dụng

### 1. Mở File
- Mở file `index.html` trực tiếp trong trình duyệt
- Hoặc chạy với Live Server (VSCode)

### 2. Soạn Thảo Văn Bản
1. Click **"Tài liệu mới"** hoặc nhấn `Ctrl+N`
2. Nhập tên tài liệu ở thanh header
3. Bắt đầu soạn thảo
4. Hệ thống tự động lưu mỗi 30 giây

### 3. Định Dạng Văn Bản
- **In đậm**: Ctrl+B hoặc click nút Bold
- **In nghiêng**: Ctrl+I
- **Gạch chân**: Ctrl+U
- **Chọn font**: Dropdown "Font Family"
- **Chọn cỡ chữ**: Dropdown "Font Size"
- **Màu chữ**: Click icon màu chữ
- **Căn chỉnh**: Các nút căn trái/giữa/phải/đều

### 4. Chèn Đối Tượng
- **Hình ảnh**: Click nút Image hoặc paste (Ctrl+V)
- **Bảng**: Click nút Table → Nhập số hàng/cột
- **Liên kết**: Click nút Link hoặc Ctrl+K

### 5. Xuất File
- **Word**: Click nút "Word" → File .docx tự động tải về
- **PDF**: Click nút "PDF" → File .pdf tự động tải về
- **In**: Click nút Print hoặc Ctrl+P

### 6. Tìm Kiếm
- Nhấn `Ctrl+F` hoặc click nút Search
- Nhập từ khóa → Click "Tìm tiếp"
- Thay thế: Nhập text mới → Click "Thay thế"

### 7. Thống Kê
- Click nút Stats
- Xem: Số từ, ký tự, đoạn văn, trang, thời gian đọc

### 8. Chuyển Ngôn Ngữ
- Click biểu tượng 🌐
- Chọn: 🇻🇳 Tiếng Việt hoặc 🇰🇭 ភាសាខ្មែរ

---

## ⌨️ Phím Tắt

| Phím Tắt | Chức Năng |
|----------|-----------|
| `Ctrl+S` | Lưu tài liệu |
| `Ctrl+N` | Tài liệu mới |
| `Ctrl+P` | In |
| `Ctrl+F` | Tìm kiếm |
| `Ctrl+B` | In đậm |
| `Ctrl+I` | In nghiêng |
| `Ctrl+U` | Gạch chân |
| `Ctrl+K` | Chèn liên kết |
| `Ctrl+Shift+S` | Thống kê |
| `ESC` | Đóng modal |

---

## 🏗️ Cấu Trúc File

```
HTSOANTAILIEU/
│
├── index.html          # Giao diện chính
├── styles.css          # CSS responsive & UI/UX
├── app.js              # Logic chính, keyboard shortcuts
├── editor.js           # Rich text editor (Quill.js)
├── storage.js          # LocalStorage, quản lý tài liệu
├── export.js           # Xuất Word & PDF
└── i18n.js             # Đa ngôn ngữ (Việt-Khmer)
```

---

## 🔧 Công Nghệ Sử Dụng

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Variables, Grid, Flexbox, Animations
- **JavaScript ES6+**: Classes, Async/Await, Modules

### Thư Viện
- **Quill.js** (1.3.6): Rich text editor
- **html2canvas** (1.4.1): Canvas rendering cho PDF
- **jsPDF** (2.5.1): Tạo file PDF
- **html-docx-js** (0.3.1): Xuất Word
- **Font Awesome** (6.4.0): Icons
- **Google Fonts**: Khmer fonts

---

## 🎨 Thiết Kế UI/UX

### Color Palette
- **Primary**: #1a73e8 (Google Blue)
- **Secondary**: #34a853 (Green)
- **Danger**: #ea4335 (Red)
- **Warning**: #fbbc04 (Yellow)
- **Background**: #f8f9fa (Light Gray)
- **Text**: #202124 (Dark Gray)

### Typography
- **Font chính**: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto
- **Font Khmer**: Battambang, Hanuman, Kantumruy Pro
- **Size**: 12px - 72px

### Spacing
- **XS**: 4px
- **SM**: 8px
- **MD**: 16px
- **LG**: 24px
- **XL**: 32px

### Responsive Breakpoints
- **Desktop**: >1024px
- **Tablet**: 768px - 1024px
- **Mobile**: <768px

---

## 📱 Responsive Design

### Desktop (>1024px)
- Sidebar hiển thị cố định
- Toolbar đầy đủ với labels
- Editor width chuẩn A4 (816px)

### Tablet (768px - 1024px)
- Sidebar overlay
- Toolbar icons only
- Editor responsive

### Mobile (<768px)
- Sidebar fullscreen
- Compact toolbar
- Touch-friendly buttons
- Editor full-width

---

## 💡 Tính Năng Nổi Bật

### 1. Auto-Save Thông Minh
- Tự động lưu mỗi 30 giây
- Lưu ngay khi thay đổi (debounce 2s)
- Hiển thị trạng thái: "Đã lưu" / "Đang lưu"

### 2. Font Khmer Hoàn Hảo
- 17+ font Khmer từ Google Fonts
- Hiển thị đúng dấu thanh, ký tự đặc biệt
- Line-height tối ưu (1.8) cho Khmer
- Xuất Word/PDF không bị lỗi font

### 3. Quản Lý Tài Liệu
- Lưu trữ không giới hạn (LocalStorage)
- Tìm kiếm nhanh
- Hiển thị thời gian: "vừa xong", "5 phút trước"
- Xóa với xác nhận

### 4. Xuất File Chất Lượng Cao
- **Word**: Giữ nguyên 100% định dạng
- **PDF**: Vector graphics, không blur
- Font Khmer embed trong file

### 5. Giao Diện Chuyên Nghiệp
- Material Design inspired
- Smooth animations
- Hover effects
- Loading states
- Toast notifications

---

## 🐛 Debug & Dev Tools

### Bật Debug Mode
```javascript
// Trong console trình duyệt
app.enableDebugMode();

// Sau đó có thể access:
editor.getContent();
storageManager.getAllDocuments();
documentManager.loadDocument('doc_id');
```

### Check Storage Usage
```javascript
storageManager.getStorageInfo();
// Returns: { bytes, kb, mb, documentCount }
```

---

## ⚠️ Lưu Ý Quan Trọng

### 1. LocalStorage Limits
- Giới hạn: ~5-10MB (tùy trình duyệt)
- Nếu đầy → thông báo "Dung lượng lưu trữ đã đầy"
- Giải pháp: Xóa tài liệu cũ hoặc xuất ra file

### 2. Font Khmer
- Cần internet lần đầu để tải font từ Google Fonts
- Sau đó cache tự động
- Nếu offline → fallback sang font hệ thống

### 3. Xuất File
- Word: Tốt nhất với ảnh dưới 2MB
- PDF: Tài liệu dài sẽ mất vài giây
- Khuyến nghị: Chia tài liệu lớn thành nhiều file nhỏ

### 4. Trình Duyệt
- **Khuyến nghị**: Chrome, Edge, Firefox (phiên bản mới)
- **Tránh**: IE11, Safari cũ

---

## 🔮 Tương Lai

### Tính Năng Có Thể Thêm
- [ ] Cloud sync (Firebase/Supabase)
- [ ] Real-time collaboration
- [ ] Version history
- [ ] Comments & suggestions
- [ ] Templates library
- [ ] Export to Markdown
- [ ] Offline PWA support
- [ ] Mobile app (React Native)

---

## 📞 Hỗ Trợ

### Vấn Đề Thường Gặp

**Q: Tại sao font Khmer không hiển thị?**
A: Kiểm tra kết nối internet. Font tải từ Google Fonts.

**Q: Làm sao xuất file có dung lượng nhỏ?**
A: Giảm số lượng ảnh, compress ảnh trước khi chèn.

**Q: Tài liệu bị mất?**
A: Kiểm tra LocalStorage không bị xóa. Tránh dùng chế độ ẩn danh.

**Q: Keyboard shortcuts không hoạt động?**
A: Đảm bảo focus vào editor, không focus vào input khác.

---

## 📜 License

MIT License - Free to use for personal and commercial projects.

---

## 🙏 Credits

- **Quill.js** - Rich text editor
- **Google Fonts** - Khmer fonts
- **Font Awesome** - Icons
- **jsPDF & html2canvas** - PDF export

---

## 🎯 Kết Luận

Đây là một hệ thống soạn thảo văn bản **hoàn chỉnh, chuyên nghiệp, tối ưu** với:
✅ UI/UX chuẩn Material Design
✅ Code sạch, có cấu trúc
✅ Performance tốt
✅ Responsive hoàn hảo
✅ Hỗ trợ Khmer xuất sắc
✅ Không cần backend

**Hãy mở index.html và bắt đầu soạn thảo!** 🚀
