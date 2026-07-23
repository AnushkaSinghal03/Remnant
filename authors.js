async function init() {
    const params = new URLSearchParams(window.location.search);
    const author = params.get('author');

    const response = await fetch('./books.json');
    const data = await response.json();
    const books = data.books;

    if (author) {
        const filtered = books.filter(b => b.author === author);
        renderAuthorProfile(filtered, author);
    } else {
        renderAuthorsList(books);
    }
}

// Helper function to turn author name into a safe file name (e.g. "Mary Shelley" -> "mary_shelley.jpg")
function getAuthorPhotoPath(authorName) {
    const slug = authorName.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
    return `./assets/authors/${slug}.jpg`;
}

function renderAuthorsList(books) {
    const authors = [...new Set(books.map(b => b.author))].sort();
    const container = document.getElementById('page-content');

    let html = '<h1>Authors</h1><div class="authors-grid">';
    for (const author of authors) {
        const count = books.filter(b => b.author === author).length;
        const photoPath = getAuthorPhotoPath(author);

        html += `
            <a class="author-card" href="authors.html?author=${encodeURIComponent(author)}">
                <img src="${photoPath}" alt="${author}" class="author-card-img" onerror="this.onerror=null; this.style.display='none';">
                <div class="author-card-info">
                    <h2>${author}</h2>
                    <p>${count} book${count !== 1 ? 's' : ''}</p>
                </div>
            </a>
        `;
    }
    html += '</div>';
    container.innerHTML = html;
}

function renderAuthorProfile(books, authorName) {
    const container = document.getElementById('page-content');
    const photoPath = getAuthorPhotoPath(authorName);

    // Find author bio or death year if present in any of their books
    const firstBook = books[0] || {};
    const bioText = firstBook.authorBio || `${authorName} is a classic author whose works remain in the public domain.`;
    const dates = firstBook.authorDeathYear ? `(d. ${firstBook.authorDeathYear})` : '';

    let html = `
        <a class="back-link" href="authors.html">← All Authors</a>
        
        <div class="author-profile">
            <img src="${photoPath}" alt="${authorName}" class="author-profile-img" onerror="this.onerror=null; this.style.display='none';">
            <div class="author-profile-info">
                <h1>${authorName} <span class="author-dates">${dates}</span></h1>
                <p class="author-bio-text">${bioText}</p>
            </div>
        </div>

        <h2>Books by ${authorName}</h2>
        <div class="book-grid">
    `;

    for (const book of books) {
        html += `
            <div class="book-card">
                <a href="book.html?id=${book.id}">
                    <img src="${book.cover}" alt="${book.title}" onerror="this.onerror=null; this.style.display='none';">
                    <h3>${book.title}</h3>
                </a>
            </div>
        `;
    }

    html += '</div>';
    container.innerHTML = html;
}

init();
