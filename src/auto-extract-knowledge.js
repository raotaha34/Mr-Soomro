import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.join(__dirname, '..');
const KNOWLEDGE_DIR = path.join(__dirname, 'knowledge');

const EXCLUDE_DIRS = new Set(['node_modules', '.git', 'src', 'assets', 'images', 'css']);
const REMOVE_TAG_CONTENTS = ['script', 'style', 'noscript', 'iframe', 'svg'];

function extractTextFromHTML(html) {
    let text = html;

    // Remove script, style, svg, iframe with their inner content
    REMOVE_TAG_CONTENTS.forEach(tag => {
        text = text.replace(new RegExp(`<${tag}\\b[^>]*>[\\s\\S]*?<\\/${tag}>`, 'gim'), ' ');
    });

    // Replace block closing tags with spaces to avoid concatenating words together
    text = text.replace(/<\/(p|div|li|h[1-6]|section|article|header|footer|nav|tr|td|th)>/gi, ' ');

    // Remove all remaining HTML tags
    text = text.replace(/<[^>]+>/g, ' ');

    // Decode HTML entities
    text = text
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&mdash;/g, '—')
        .replace(/&ndash;/g, '–');

    // Normalize whitespace
    return text.replace(/\s+/g, ' ').trim();
}

function extractPageInfo(html, filePath) {
    const text = extractTextFromHTML(html);
    const fileName = path.basename(filePath, '.html');
    const pageName = fileName.replace(/[-_.]+/g, ' ').trim();

    // Extract headings for topic context
    const headings = [];
    const headingMatches = html.match(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi) || [];
    headingMatches.forEach(match => {
        const headingText = match.replace(/<[^>]+>/g, '').trim();
        if (headingText.length > 3 && headingText.length < 120) {
            headings.push(headingText);
        }
    });

    // Extract FAQs if present in markup (accordion / faq items)
    const faqs = [];
    const faqPattern = /<(?:div|article)[^>]*(?:faq|accordion)[^>]*>([\s\S]*?)<\/(?:div|article)>/gi;
    let faqBlockMatch;
    while ((faqBlockMatch = faqPattern.exec(html)) !== null) {
        const blockText = extractTextFromHTML(faqBlockMatch[1]);
        if (blockText.length > 20) {
            faqs.push(blockText);
        }
    }

    return {
        pageName: pageName.charAt(0).toUpperCase() + pageName.slice(1),
        headings: [...new Set(headings)].slice(0, 10),
        faqs: faqs.slice(0, 8),
        fullText: text,
        filePath: path.relative(PROJECT_ROOT, filePath).replace(/\\/g, '/')
    };
}

function scanFiles() {
    const htmlFiles = new Set();

    function walk(dir, isRoot = false) {
        if (!fs.existsSync(dir)) return;
        const entries = fs.readdirSync(dir, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);

            if (entry.isDirectory()) {
                if (!EXCLUDE_DIRS.has(entry.name) && !isRoot) {
                    walk(fullPath, false);
                }
            } else if (entry.isFile() && entry.name.endsWith('.html')) {
                htmlFiles.add(fullPath);
            }
        }
    }

    // Scan project root (for index.html)
    walk(PROJECT_ROOT, true);

    // Scan specific subdirectories recursively
    walk(path.join(PROJECT_ROOT, 'Services'), false);
    walk(path.join(PROJECT_ROOT, 'pages'), false);

    return Array.from(htmlFiles);
}

async function extractAllWebsiteContent() {
    console.log('🔍 Scanning website for content...\n');

    if (!fs.existsSync(KNOWLEDGE_DIR)) {
        fs.mkdirSync(KNOWLEDGE_DIR, { recursive: true });
    }

    const files = scanFiles();
    const allPages = [];

    for (const file of files) {
        try {
            const html = fs.readFileSync(file, 'utf-8');
            const pageInfo = extractPageInfo(html, file);
            if (pageInfo.fullText.length > 50) {
                allPages.push(pageInfo);
                console.log(`  ✓ Extracted: ${pageInfo.pageName} (${pageInfo.filePath})`);
            }
        } catch (error) {
            console.error(`  ✗ Error reading ${file}: ${error.message}`);
        }
    }

    console.log(`\n✅ Successfully extracted content from ${allPages.length} unique pages.\n`);

    // 1. Comprehensive Master Knowledge Base (Full content without artificial cuts)
    let masterContent = `MR. SOOMRO SEO AGENCY - COMPLETE WEBSITE KNOWLEDGE BASE\n`;
    masterContent += `Generated: ${new Date().toISOString()}\n`;
    masterContent += `Total Pages Indexed: ${allPages.length}\n`;
    masterContent += `${'='.repeat(60)}\n\n`;

    allPages.forEach(page => {
        masterContent += `=== PAGE: ${page.pageName.toUpperCase()} ===\n`;
        masterContent += `File: ${page.filePath}\n`;
        if (page.headings.length > 0) {
            masterContent += `Key Topics: ${page.headings.join(' | ')}\n`;
        }
        masterContent += `Content:\n${page.fullText}\n\n`;
        masterContent += `${'='.repeat(60)}\n\n`;
    });

    fs.writeFileSync(path.join(KNOWLEDGE_DIR, 'website-content.txt'), masterContent, 'utf-8');
    console.log('📝 Generated: src/knowledge/website-content.txt');

    // 2. Focused Services Overview & Packages
    const servicePages = allPages.filter(p => p.filePath.startsWith('Services/') || p.filePath.includes('services'));
    let servicesSummary = `MR. SOOMRO - SERVICES DIRECTORY & PACKAGES\n\n`;

    servicePages.forEach((page, i) => {
        servicesSummary += `${i + 1}. ${page.pageName}\n`;
        if (page.headings.length) {
            servicesSummary += `   Topics: ${page.headings.join(', ')}\n`;
        }
        servicesSummary += `   Details: ${page.fullText.substring(0, 2000)}...\n\n`;
    });

    fs.writeFileSync(path.join(KNOWLEDGE_DIR, 'services.txt'), servicesSummary, 'utf-8');
    console.log('📝 Generated: src/knowledge/services.txt');

    console.log('\n🎉 Knowledge base extraction complete!');
    return allPages;
}

// Watch mode for automatic updates
async function startWatchMode() {
    console.log('👀 Starting watch mode for automatic knowledge base updates...\n');
    let chokidar;
    try {
        chokidar = await import('chokidar');
    } catch {
        console.error('⚠️ Watch mode requires chokidar. Please run: npm install chokidar');
        return;
    }

    const watchPaths = [
        path.join(PROJECT_ROOT, 'index.html'),
        path.join(PROJECT_ROOT, 'Services'),
        path.join(PROJECT_ROOT, 'pages')
    ];

    const watcher = chokidar.watch(watchPaths, {
        ignored: /(^|[\/\\])\../,
        persistent: true
    });

    watcher.on('change', async (filePath) => {
        if (filePath.endsWith('.html')) {
            console.log(`\n📄 File changed: ${filePath}`);
            console.log('🔄 Re-extracting knowledge base...');
            await extractAllWebsiteContent();
            console.log('✅ Knowledge base updated!\n');
        }
    });

    console.log('Watching for HTML file changes... Press Ctrl+C to stop.');
}

const args = process.argv.slice(2);
const isWatch = args.includes('--watch') || args.includes('-w');

if (isWatch) {
    extractAllWebsiteContent().then(() => startWatchMode()).catch(console.error);
} else {
    extractAllWebsiteContent().catch(console.error);
}
