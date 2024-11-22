let pages = [];
let currentPage = 0;
const MIN_CHARS = 150; // Minimum characters to merge
const MAX_CHARS = 1000; // Maximum characters to split

async function loadMarkdown() {
    const response = await fetch('/data/ebook.md');
    const text = await response.text();
    pages = processPages(text);
    // Load the last visited page from local storage
    const lastVisitedPage = localStorage.getItem('lastVisitedPage');
    currentPage = lastVisitedPage ? parseInt(lastVisitedPage) : 0;
    renderPage(currentPage);
}

function processPages(text) {
    // Split the document into chapters based on headers
    const chapters = text.split(/\n(?=#)/); // Split on lines that start with a header

    // Set the book title from the first header
    const firstHeader = text.match(/(?:#{1,6}\s)(.+)/);
    if (firstHeader) {
        const bookTitle = firstHeader[1]; // Get the title text
        document.getElementById('bookTitle').textContent = bookTitle; // Set the header title
    }
    
    let processedPages = [];

    chapters.forEach(chapter => {
        let currentPageContent = '';
        const rawPages = chapter.split(/\n\s*\n/); // Split by double newlines to create raw pages

        rawPages.forEach(page => {
            const charCount = page.length; // Count characters

            if (charCount < MIN_CHARS) {
                // Merge with the previous page if it exists
                if (currentPageContent.length) {
                    currentPageContent += '\n\n' + page; // Merge content
                } else {
                    currentPageContent = page; // Start new content
                }
            } else {
                // If current page content is not empty, push it to processed pages
                if (currentPageContent) {
                    processedPages.push(currentPageContent);
                    currentPageContent = '';
                }

                // Split the page based on character count
                for (let i = 0; i < page.length; i += MAX_CHARS) {
                    processedPages.push(page.slice(i, i + MAX_CHARS));
                }
            }
        });

        // Push any remaining content
        if (currentPageContent) {
            processedPages.push(currentPageContent);
        }
    });

    // Remove any pages that are still below the minimum character count
    processedPages = processedPages.filter(page => page.length >= MIN_CHARS);

    return processedPages;
}

function renderPage(pageIndex) {
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = ''; // Clear previous content
    const page = document.createElement('div');
    page.className = 'page active';
    page.innerHTML = marked(pages[pageIndex]);

    // Update the footer with the character position
    const charPosition = calculateCharacterPosition(pageIndex);
    const positionNumberDiv = document.getElementById('positionNumber');
    positionNumberDiv.textContent = `Position: ${charPosition}`;

    contentDiv.appendChild(page);
    updateNavigation();
}

function calculateCharacterPosition(pageIndex) {
    let totalChars = 0;
    for (let i = 0; i < pageIndex; i++) {
        totalChars += pages[i].length; // Sum the character counts of previous pages
    }
    totalChars += pages[pageIndex].length; // Add the current page's character count
    return Math.floor(totalChars / 128); // Return the position divided by 128
}

function nextPage() {
    if (currentPage < pages.length - 1) {
        currentPage++;
        renderPage(currentPage);
        // Store the current page in local storage
        localStorage.setItem('lastVisitedPage', currentPage);
    }
}

function prevPage() {
    if (currentPage > 0) {
        currentPage--;
        renderPage(currentPage);
        // Store the current page in local storage
        localStorage.setItem('lastVisitedPage', currentPage);
    }
}

function updateNavigation() {
    // Optional: You can add visual feedback for navigation if needed
}

// Load the Markdown content when the page is loaded
window.onload = loadMarkdown;

// Add keyboard navigation
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') {
        nextPage();
    } else if (event.key === 'ArrowLeft') {
        prevPage();
    }
}); 