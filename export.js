// ============================================
// EXPORT MANAGER - Word & PDF Export
// ============================================

class ExportManager {
    constructor() {
        this.setupEventHandlers();
    }

    setupEventHandlers() {
        // Export Word button
        document.getElementById('btnExportWord').addEventListener('click', () => {
            this.exportToWord();
        });

        // Export PDF button
        document.getElementById('btnExportPDF').addEventListener('click', () => {
            this.exportToPDF();
        });
    }

    // Show loading overlay
    showLoading(message) {
        const overlay = document.getElementById('loadingOverlay');
        overlay.querySelector('p').textContent = message;
        overlay.classList.add('active');
    }

    // Hide loading overlay
    hideLoading() {
        document.getElementById('loadingOverlay').classList.remove('active');
    }

    // Export to Word (.docx)
    async exportToWord() {
        try {
            const defaultTitle = document.getElementById('documentTitle').value || 'document';
            const fileName = prompt(
                i18n.translate('enterFileName') || 'Nhập tên file (không cần .docx):', 
                defaultTitle
            );
            
            if (!fileName) {
                showToast(i18n.translate('exportCancelled') || 'Đã hủy xuất file', 'info');
                return;
            }
            
            this.showLoading(i18n.translate('exportingWord') || 'Đang xuất file Word...');

            const title = fileName;
            const content = editor.getContent();
            
            // Create HTML content with proper styling for Word
            const htmlContent = this.prepareHTMLForWord(content.html, title);
            
            // Check if library is available
            if (typeof htmlDocx === 'undefined') {
                throw new Error('html-docx library not loaded. Please check your internet connection.');
            }
            
            // Convert HTML to Word document
            const converted = htmlDocx.asBlob(htmlContent, {
                orientation: 'portrait',
                margins: {
                    top: 1440, // 1 inch = 1440 twips
                    right: 1440,
                    bottom: 1440,
                    left: 1440
                }
            });

            // Download the file
            const url = URL.createObjectURL(converted);
            const downloadFileName = `${this.sanitizeFilename(title)}.docx`;
            
            // Check if mobile
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            
            if (isMobile) {
                // For mobile: try to open or download
                const link = document.createElement('a');
                link.href = url;
                link.download = downloadFileName;
                link.style.display = 'none';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                setTimeout(() => URL.revokeObjectURL(url), 1000);
                showToast('Word đã tải xuống. Kiểm tra thư mục Downloads', 'success');
            } else {
                // For desktop
                const a = document.createElement('a');
                a.href = url;
                a.download = downloadFileName;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                
                setTimeout(() => URL.revokeObjectURL(url), 100);
                showToast(i18n.translate('exportedWord') || 'Đã xuất file Word thành công', 'success');
            }

            this.hideLoading();
        } catch (error) {
            console.error('Error exporting to Word:', error);
            this.hideLoading();
            showToast(i18n.translate('errorExportingWord') || 'Lỗi khi xuất file Word', 'error');
        }
    }

    // Prepare HTML content with proper styling for Word export
    prepareHTMLForWord(html, title) {
        // Get all Khmer fonts used in the document
        const khmerFonts = [
            'Battambang', 'Bayon', 'Content', 'Dangrek', 'Hanuman',
            'Kantumruy Pro', 'Khmer', 'Koulen', 'Metal', 'Moul',
            'Moulpali', 'Nokora', 'Odor Mean Chey', 'Preahvihear',
            'Siemreap', 'Suwannaphum', 'Taprom'
        ];

        const fontFaceRules = khmerFonts.map(font => `
            @font-face {
                font-family: '${font}';
                src: local('${font}');
            }
        `).join('');

        return `
            <!DOCTYPE html>
            <html xmlns:o="urn:schemas-microsoft-com:office:office"
                  xmlns:w="urn:schemas-microsoft-com:office:word"
                  xmlns="http://www.w3.org/TR/REC-html40">
            <head>
                <meta charset="utf-8">
                <title>${this.escapeHtml(title)}</title>
                <style>
                    ${fontFaceRules}
                    
                    @page {
                        size: A4;
                        margin: 1in;
                    }
                    
                    body {
                        font-family: Arial, sans-serif;
                        font-size: 14px;
                        line-height: 1.6;
                        color: #000000;
                    }
                    
                    /* Khmer font support */
                    [style*="font-family: Battambang"],
                    [style*="font-family: Bayon"],
                    [style*="font-family: Content"],
                    [style*="font-family: Dangrek"],
                    [style*="font-family: Hanuman"],
                    [style*="font-family: Kantumruy Pro"],
                    [style*="font-family: Khmer"],
                    [style*="font-family: Koulen"],
                    [style*="font-family: Metal"],
                    [style*="font-family: Moul"],
                    [style*="font-family: Moulpali"],
                    [style*="font-family: Nokora"],
                    [style*="font-family: Odor Mean Chey"],
                    [style*="font-family: Preahvihear"],
                    [style*="font-family: Siemreap"],
                    [style*="font-family: Suwannaphum"],
                    [style*="font-family: Taprom"] {
                        line-height: 1.8;
                    }
                    
                    p {
                        margin: 0 0 1em 0;
                    }
                    
                    table {
                        border-collapse: collapse;
                        width: 100%;
                        margin: 1em 0;
                    }
                    
                    table td,
                    table th {
                        border: 1px solid #000000;
                        padding: 8px 12px;
                    }
                    
                    table th {
                        background-color: #f0f0f0;
                        font-weight: bold;
                    }
                    
                    img {
                        max-width: 100%;
                        height: auto;
                    }
                    
                    ul, ol {
                        margin: 1em 0;
                        padding-left: 2em;
                    }
                    
                    li {
                        margin: 0.5em 0;
                    }
                </style>
            </head>
            <body>
                ${html}
            </body>
            </html>
        `;
    }

    // Export to PDF
    async exportToPDF() {
        try {
            const defaultTitle = document.getElementById('documentTitle').value || 'document';
            const fileName = prompt(
                i18n.translate('enterFileName') || 'Nhập tên file (không cần .pdf):', 
                defaultTitle
            );
            
            if (!fileName) {
                showToast(i18n.translate('exportCancelled') || 'Đã hủy xuất file', 'info');
                return;
            }
            
            this.showLoading(i18n.translate('exportingPDF') || 'Đang xuất file PDF...');

            const title = fileName;
            const editorElement = document.querySelector('.ql-editor');

            // Detect if mobile for different sizing
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            const pdfWidth = 794; // A4 width in pixels at 96 DPI
            const pdfPadding = 76; // 20mm margins

            // Create a temporary container for rendering with better styling
            const tempContainer = document.createElement('div');
            tempContainer.style.cssText = `
                position: absolute;
                left: -9999px;
                top: 0;
                width: ${pdfWidth}px;
                min-height: 1123px;
                background-color: white;
                padding: 95px ${pdfPadding}px;
                box-sizing: border-box;
                font-family: Arial, sans-serif;
                font-size: 14px;
                line-height: 2.2;
                color: #000000;
                word-wrap: break-word;
                overflow-wrap: break-word;
            `;
            
            // Clone editor content with better formatting
            const clonedContent = editorElement.cloneNode(true);
            
            // Apply inline styles for better PDF rendering
            this.applyInlineStyles(clonedContent);
            
            tempContainer.appendChild(clonedContent);
            document.body.appendChild(tempContainer);

            // Wait for fonts to load
            await document.fonts.ready;
            await new Promise(resolve => setTimeout(resolve, 500));

            // Use html2canvas with optimized settings
            const canvas = await html2canvas(tempContainer, {
                scale: 2, // Reduce scale for proper sizing
                useCORS: true,
                allowTaint: false,
                backgroundColor: '#ffffff',
                logging: false,
                width: tempContainer.scrollWidth,
                height: tempContainer.scrollHeight,
                windowWidth: tempContainer.scrollWidth,
                windowHeight: tempContainer.scrollHeight,
                imageTimeout: 0,
                removeContainer: false,
                onclone: (clonedDoc) => {
                    const clonedContainer = clonedDoc.querySelector('[style*="left: -9999px"]');
                    if (clonedContainer) {
                        // Ensure all fonts are properly loaded
                        clonedContainer.style.fontSmooth = 'always';
                        clonedContainer.style.webkitFontSmoothing = 'antialiased';
                        clonedContainer.style.mozOsxFontSmoothing = 'grayscale';
                    }
                }
            });

            // Remove temporary container
            document.body.removeChild(tempContainer);

            // Create PDF using jsPDF with better settings
            const { jsPDF } = window.jspdf;
            const pageWidth = 210; // A4 width in mm
            const pageHeight = 297; // A4 height in mm
            
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
                compress: true
            });

            const imgWidth = pageWidth;
            const imgHeight = (canvas.height * pageWidth) / canvas.width;
            
            let heightLeft = imgHeight;
            let position = 0;
            const imgData = canvas.toDataURL('image/jpeg', 0.95);

            // Add first page - full width
            pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
            heightLeft -= pageHeight;

            // Add additional pages if content is longer than one page
            while (heightLeft > 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
                heightLeft -= pageHeight;
            }

            // Save and open PDF
            const pdfBlob = pdf.output('blob');
            const pdfUrl = URL.createObjectURL(pdfBlob);
            const downloadFileName = `${this.sanitizeFilename(title)}.pdf`;
            
            // Use isMobile from earlier in function
            if (isMobile) {
                // Try to open in new tab
                const newWindow = window.open(pdfUrl, '_blank');
                
                if (!newWindow) {
                    // If popup blocked, create download link
                    const link = document.createElement('a');
                    link.href = pdfUrl;
                    link.download = downloadFileName;
                    link.style.display = 'none';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    showToast('PDF đã tải xuống. Kiểm tra thư mục Downloads', 'success');
                } else {
                    showToast('PDF đã mở trong tab mới', 'success');
                }
            } else {
                // Desktop: Download file
                const link = document.createElement('a');
                link.href = pdfUrl;
                link.download = downloadFileName;
                link.click();
                showToast(i18n.translate('exportedPDF') || 'Đã xuất file PDF thành công', 'success');
            }
            
            // Clean up after a delay
            setTimeout(() => URL.revokeObjectURL(pdfUrl), 1000);

            this.hideLoading();
        } catch (error) {
            console.error('Error exporting to PDF:', error);
            this.hideLoading();
            showToast(i18n.translate('errorExportingPDF') || 'Lỗi khi xuất file PDF', 'error');
        }
    }

    // Alternative PDF export using better font handling
    async exportToPDFAlternative() {
        try {
            this.showLoading(i18n.translate('exportingPDF') || 'Đang xuất file PDF...');

            const title = document.getElementById('documentTitle').value || 'document';
            const content = editor.getContent();

            // Create PDF with better font support
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('p', 'mm', 'a4');
            
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const margin = 25.4; // 1 inch in mm
            const contentWidth = pageWidth - (2 * margin);
            
            // Parse HTML and add content to PDF
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = content.html;
            
            let yPosition = margin;
            const lineHeight = 7;
            
            // Process each paragraph
            const paragraphs = tempDiv.querySelectorAll('p, h1, h2, h3, li');
            
            paragraphs.forEach((p) => {
                const text = p.textContent.trim();
                if (!text) return;
                
                // Check if new page is needed
                if (yPosition > pageHeight - margin) {
                    pdf.addPage();
                    yPosition = margin;
                }
                
                // Set font based on element type
                if (p.tagName === 'H1') {
                    pdf.setFontSize(24);
                    pdf.setFont(undefined, 'bold');
                } else if (p.tagName === 'H2') {
                    pdf.setFontSize(20);
                    pdf.setFont(undefined, 'bold');
                } else if (p.tagName === 'H3') {
                    pdf.setFontSize(16);
                    pdf.setFont(undefined, 'bold');
                } else {
                    pdf.setFontSize(12);
                    pdf.setFont(undefined, 'normal');
                }
                
                // Split text to fit width
                const lines = pdf.splitTextToSize(text, contentWidth);
                
                lines.forEach((line) => {
                    if (yPosition > pageHeight - margin) {
                        pdf.addPage();
                        yPosition = margin;
                    }
                    pdf.text(line, margin, yPosition);
                    yPosition += lineHeight;
                });
                
                yPosition += lineHeight / 2; // Add space after paragraph
            });

            // Save PDF
            pdf.save(`${this.sanitizeFilename(title)}.pdf`);

            this.hideLoading();
            showToast(i18n.translate('exportedPDF') || 'Đã xuất file PDF thành công', 'success');
        } catch (error) {
            console.error('Error exporting to PDF:', error);
            this.hideLoading();
            showToast(i18n.translate('errorExportingPDF') || 'Lỗi khi xuất file PDF', 'error');
        }
    }

    // Apply inline styles for better PDF rendering
    applyInlineStyles(element) {
        // Apply styles to all elements for better PDF rendering
        const allElements = element.querySelectorAll('*');
        
        allElements.forEach(el => {
            const computedStyle = window.getComputedStyle(el);
            
            // Preserve font family
            if (computedStyle.fontFamily) {
                el.style.fontFamily = computedStyle.fontFamily;
            }
            
            // Preserve font size
            if (computedStyle.fontSize) {
                el.style.fontSize = computedStyle.fontSize;
            }
            
            // Preserve font weight
            if (computedStyle.fontWeight && computedStyle.fontWeight !== '400') {
                el.style.fontWeight = computedStyle.fontWeight;
            }
            
            // Preserve font style
            if (computedStyle.fontStyle !== 'normal') {
                el.style.fontStyle = computedStyle.fontStyle;
            }
            
            // Preserve text decoration
            if (computedStyle.textDecoration !== 'none') {
                el.style.textDecoration = computedStyle.textDecoration;
            }
            
            // IMPORTANT: Preserve ALL text alignment including justify
            const textAlign = computedStyle.textAlign;
            if (textAlign && textAlign !== 'start') {
                el.style.textAlign = textAlign;
                // Force justify to work properly
                if (textAlign === 'justify') {
                    el.style.textJustify = 'inter-word';
                    el.style.hyphens = 'auto';
                }
            }
            
            // Preserve colors
            if (computedStyle.color) {
                el.style.color = computedStyle.color;
            }
            
            if (computedStyle.backgroundColor && computedStyle.backgroundColor !== 'rgba(0, 0, 0, 0)') {
                el.style.backgroundColor = computedStyle.backgroundColor;
            }
            
            // Preserve line height for better text rendering
            if (computedStyle.lineHeight) {
                el.style.lineHeight = computedStyle.lineHeight;
            }
            
            // Better word wrapping
            el.style.wordWrap = 'break-word';
            el.style.overflowWrap = 'break-word';
            el.style.wordBreak = 'normal';
            
            // Add anti-aliasing for better text quality
            el.style.webkitFontSmoothing = 'antialiased';
            el.style.mozOsxFontSmoothing = 'grayscale';
            el.style.textRendering = 'optimizeLegibility';
        });
        
        return element;
    }

    // Sanitize filename
    sanitizeFilename(filename) {
        return filename.replace(/[^a-z0-9_\-\u0080-\uFFFF]/gi, '_').substring(0, 100);
    }

    // Escape HTML
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

    // Print document
    printDocument() {
        window.print();
    }
}

// Initialize export manager immediately
const exportManager = new ExportManager();

// Make exportManager globally accessible
if (typeof window !== 'undefined') {
    window.exportManager = exportManager;
}
console.log('✅ ExportManager created');
