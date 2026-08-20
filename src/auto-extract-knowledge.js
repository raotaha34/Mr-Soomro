import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.join(__dirname, '..');
const KNOWLEDGE_DIR = path.join(__dirname, 'knowledge');

// Directories to scan for content. scanDirectory() recurses, so listing a
// subdirectory of one of these (pages/blog) would extract those pages twice.
const SCAN_DIRECTORIES = [
    path.join(PROJECT_ROOT, 'Services'),
    path.join(PROJECT_ROOT, 'pages')
];

// File patterns to include/exclude
const INCLUDE_PATTERNS = ['.html'];
const EXCLUDE_PATTERNS = ['node_modules', '.git', 'src', 'assets', 'images', 'css'];

// HTML tags to remove
const REMOVE_TAGS = ['script', 'style', 'link', 'meta', 'title', 'head', 'nav', 'footer', 'button', 'input', 'textarea', 'select', 'form', 'iframe', 'noscript'];

function extractTextFromHTML(html) {
    let text = html;
    
    // Remove script and style tags with their content
    text = text.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, '');
    text = text.replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gim, '');
    
    // Remove other specified tags
    REMOVE_TAGS.forEach(tag => {
        text = text.replace(new RegExp(`<${tag}[^>]*>.*?</${tag}>`, 'gims'), '');
        text = text.replace(new RegExp(`<${tag}[^>]*>`, 'gim'), '');
        text = text.replace(new RegExp(`</${tag}>`, 'gim'), '');
    });
    
    // Remove all HTML tags
    text = text.replace(/<[^>]+>/g, '');
    
    // Decode HTML entities
    text = text.replace(/&nbsp;/g, ' ');
    text = text.replace(/&amp;/g, '&');
    text = text.replace(/&lt;/g, '<');
    text = text.replace(/&gt;/g, '>');
    text = text.replace(/&quot;/g, '"');
    text = text.replace(/&#39;/g, "'");
    text = text.replace(/&mdash;/g, '—');
    text = text.replace(/&ndash;/g, '–');
    
    // Clean up whitespace
    text = text.replace(/\s+/g, ' ').trim();
    
    // Remove common navigation/footer boilerplate
    const removePatterns = [
        /Mr\. Soomro/gi,
        /Digital Marketing Expert/gi,
        /Free SEO Audit/gi,
        /Contact Us/gi,
        /Get Started/gi,
        /Learn More/gi,
        /Navigation/gi,
        /Menu/gi,
        /Home/gi,
        /About/gi,
        /Services/gi,
        /Reviews/gi,
        /Blog/gi,
        /Privacy Policy/gi,
        /Terms of Service/gi,
        /Cookie Policy/gi,
        /All rights reserved/gi,
        /Copyright/gi,
        /Scroll to top/gi,
        /View Packages/gi,
        /Starting From/gi,
        /View Pricing/gi,
        /Request a Quote/gi,
        /Get in touch/gi,
        /Follow us/gi,
        /Subscribe/gi,
        /Newsletter/gi,
    ];
    
    removePatterns.forEach(pattern => {
        text = text.replace(pattern, '');
    });
    
    return text;
}

function extractPageInfo(html, filePath) {
    const text = extractTextFromHTML(html);
    
    // Extract page title from filename
    const fileName = path.basename(filePath, '.html');
    const pageName = fileName.replace(/-/g, ' ').replace(/\./g, ' ');
    
    // Extract meaningful sentences (longer than 30 chars)
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 30);
    
    // Take first 15 meaningful sentences as page description
    const description = sentences.slice(0, 15).join('. ').trim();
    
    // Try to extract headings from original HTML
    const headings = [];
    const headingMatches = html.match(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi);
    if (headingMatches) {
        headingMatches.forEach(match => {
            const headingText = match.replace(/<[^>]+>/g, '').trim();
            if (headingText.length > 5 && headingText.length < 100) {
                headings.push(headingText);
            }
        });
    }
    
    return {
        pageName: pageName.charAt(0).toUpperCase() + pageName.slice(1),
        description,
        headings: headings.slice(0, 5),
        fullText: text,
        filePath: path.relative(PROJECT_ROOT, filePath)
    };
}

function scanDirectory(dir) {
    const results = [];
    
    if (!fs.existsSync(dir)) {
        console.log(`Directory not found: ${dir}`);
        return results;
    }
    
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        // Skip excluded directories
        if (EXCLUDE_PATTERNS.some(pattern => item.includes(pattern))) {
            continue;
        }
        
        if (stat.isDirectory()) {
            // Recursively scan subdirectories
            results.push(...scanDirectory(fullPath));
        } else if (stat.isFile() && INCLUDE_PATTERNS.some(pattern => item.endsWith(pattern))) {
            results.push(fullPath);
        }
    }
    
    return results;
}

async function extractAllWebsiteContent() {
    console.log('🔍 Scanning website for content...\n');
    
    let allPages = [];
    
    // Scan all configured directories
    for (const dir of SCAN_DIRECTORIES) {
        console.log(`Scanning: ${dir}`);
        const files = scanDirectory(dir);
        console.log(`  Found ${files.length} HTML files\n`);
        
        for (const file of files) {
            try {
                const html = fs.readFileSync(file, 'utf-8');
                const pageInfo = extractPageInfo(html, file);
                allPages.push(pageInfo);
                console.log(`  ✓ Extracted: ${pageInfo.pageName}`);
            } catch (error) {
                console.log(`  ✗ Error reading ${file}: ${error.message}`);
            }
        }
    }
    
    console.log(`\n✅ Extracted content from ${allPages.length} pages\n`);
    
    // Generate comprehensive services.txt
    let servicesContent = 'Mr. Soomro provides the following professional SEO and digital marketing services:\n\n';
    
    // Group by service pages (from Services directory)
    const servicePages = allPages.filter(p => p.filePath.includes('Services'));
    const otherPages = allPages.filter(p => !p.filePath.includes('Services'));
    
    servicePages.forEach((page, index) => {
        servicesContent += `${index + 1}. ${page.pageName} - ${page.description}\n\n`;
        if (page.headings.length > 0) {
            servicesContent += `   Key topics: ${page.headings.join(', ')}\n\n`;
        }
    });
    
    servicesContent += '[AUTO-GENERATED from website HTML pages]\n';
    servicesContent += `Last updated: ${new Date().toISOString()}\n`;
    
    fs.writeFileSync(path.join(KNOWLEDGE_DIR, 'services.txt'), servicesContent);
    console.log('📝 Generated: services.txt');
    
    // Generate comprehensive knowledge base
    let comprehensiveContent = 'MR. SOOMRO - COMPLETE WEBSITE KNOWLEDGE BASE\n\n';
    comprehensiveContent += `Auto-generated on: ${new Date().toISOString()}\n`;
    comprehensiveContent += `Total pages scanned: ${allPages.length}\n\n`;
    comprehensiveContent += '='.repeat(60) + '\n\n';
    
    allPages.forEach(page => {
        comprehensiveContent += `=== ${page.pageName.toUpperCase()} ===\n`;
        comprehensiveContent += `File: ${page.filePath}\n\n`;
        
        if (page.headings.length > 0) {
            comprehensiveContent += 'Headings:\n';
            page.headings.forEach(h => {
                comprehensiveContent += `  - ${h}\n`;
            });
            comprehensiveContent += '\n';
        }
        
        comprehensiveContent += 'Description:\n';
        comprehensiveContent += page.description + '\n\n';
        
        comprehensiveContent += 'Full Content:\n';
        comprehensiveContent += page.fullText.substring(0, 3000) + '\n\n';
        comprehensiveContent += '='.repeat(60) + '\n\n';
    });
    
    fs.writeFileSync(path.join(KNOWLEDGE_DIR, 'comprehensive-knowledge.txt'), comprehensiveContent);
    console.log('📝 Generated: comprehensive-knowledge.txt');
    
    // Generate FAQ from content
    const faqContent = generateFAQFromContent(allPages);
    fs.writeFileSync(path.join(KNOWLEDGE_DIR, 'faq-auto.txt'), faqContent);
    console.log('📝 Generated: faq-auto.txt');
    
    // Generate about page content
    const aboutContent = generateAboutContent(allPages);
    fs.writeFileSync(path.join(KNOWLEDGE_DIR, 'about-auto.txt'), aboutContent);
    console.log('📝 Generated: about-auto.txt');
    
    console.log('\n🎉 Knowledge base extraction complete!');
    console.log(`\n📊 Statistics:`);
    console.log(`   - Service pages: ${servicePages.length}`);
    console.log(`   - Other pages: ${otherPages.length}`);
    console.log(`   - Total pages: ${allPages.length}`);
    
    return allPages;
}

function generateFAQFromContent(pages) {
    let faqContent = 'FREQUENTLY ASKED QUESTIONS (Auto-generated from website content)\n\n';
    
    // Extract common questions from content
    const questions = [];
    
    pages.forEach(page => {
        // Look for question patterns in the content
        const questionPatterns = [
            /how (does|do|can|to|should|will|would)/gi,
            /what (is|are|does|do|can)/gi,
            /why (use|choose|should|is)/gi,
            /when (to|should|can)/gi,
            /where (to|can|should)/gi,
            /which (is|are|to|should)/gi
        ];
        
        const sentences = page.fullText.split(/[.!?]+/);
        sentences.forEach(sentence => {
            sentence = sentence.trim();
            if (sentence.length > 20 && sentence.length < 200) {
                questionPatterns.forEach(pattern => {
                    if (pattern.test(sentence) && !questions.includes(sentence)) {
                        questions.push(sentence);
                    }
                });
            }
        });
    });
    
    // Add top questions
    const topQuestions = questions.slice(0, 15);
    topQuestions.forEach((q, i) => {
        faqContent += `Q: ${q}\n`;
        faqContent += `A: This information is available on our website. Please contact Mr. Soomro for detailed answers.\n\n`;
    });
    
    faqContent += '[AUTO-GENERATED FAQ - Please review and add real answers]\n';
    return faqContent;
}

function generateAboutContent(pages) {
    let aboutContent = 'ABOUT MR. SOOMRO (Auto-generated from website content)\n\n';
    
    // Extract about-related content
    const aboutPages = pages.filter(p => 
        p.pageName.toLowerCase().includes('about') || 
        p.filePath.toLowerCase().includes('about')
    );
    
    if (aboutPages.length > 0) {
        aboutContent += aboutPages[0].description + '\n\n';
        aboutContent += 'Additional Information:\n';
        aboutContent += aboutPages[0].fullText.substring(0, 1500) + '\n\n';
    } else {
        aboutContent += 'Mr. Soomro is a professional SEO and digital marketing agency providing comprehensive search engine optimization services.\n\n';
        aboutContent += 'Services include on-page SEO, technical SEO, local SEO, link building, content marketing, and reputation management.\n\n';
    }
    
    aboutContent += '[AUTO-GENERATED - Please review and update with real company information]\n';
    return aboutContent;
}

// Watch mode for automatic updates
function startWatchMode() {
    console.log('👀 Starting watch mode for automatic knowledge base updates...\n');
    
    let pending = null;

    const onChange = (filePath) => {
        if (!filePath || !filePath.endsWith('.html') || path.basename(filePath).startsWith('.')) return;
        console.log(`\n📄 File changed: ${filePath}`);
        // Editors fire several events per save, so re-extract once things settle.
        clearTimeout(pending);
        pending = setTimeout(async () => {
            console.log('🔄 Re-extracting knowledge base...');
            try {
                await extractAllWebsiteContent();
                console.log('✅ Knowledge base updated automatically!\n');
            } catch (error) {
                console.error(`❌ Extraction failed: ${error.message}\n`);
            }
        }, 300);
    };

    for (const dir of SCAN_DIRECTORIES) {
        if (!fs.existsSync(dir)) {
            console.log(`Directory not found, not watching: ${dir}`);
            continue;
        }
        fs.watch(dir, { recursive: true, persistent: true }, (eventType, filename) => {
            onChange(filename && path.join(dir, filename));
        });
    }
    
    console.log('Watching for HTML file changes...');
    console.log('Press Ctrl+C to stop watch mode\n');
}

// Main execution
const args = process.argv.slice(2);
const watchMode = args.includes('--watch') || args.includes('-w');

if (watchMode) {
    startWatchMode();
} else {
    extractAllWebsiteContent().catch(console.error);
}
