async function init() {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get('cat');
    //fetch books identical to book.js
    const response = await fetch('./books.json');
    const data = await response.json();
    const books = data.books;

    if (cat) {
        //if the url has the category, show it's books
        const filtered = books.filter(b => b.category === cat || (b.otherCategories && b.otherCategories.includes(cat)));
        renderBooks(filtered, cat);
    } else {
        //else show the category grid.
        renderCategories(books);
    }
}

function renderCategories(books) {
    const categories = [...new Set(books.map(b => b.category))].sort(); //removes duplicates and pulls out the category field
    const container = document.getElementById('page-content');

    // Maps each category name to its image file
    const categoryImages = {
        'Adventure & Travel': './categories/adventure.png',
        "Children's Literature": './categories/children.png',
        'Classics': './categories/classics.png',
        'Drama & Plays': './categories/drama.png',
        'Fantasy': './categories/fantasy.png',
        'Horror & Gothic': './categories/horror.png',
        'Mystery & Crime': './categories/mystery.png',
        'Mythology & Folklore': './categories/mythology.png',
        'Philosophy': './categories/philosophy.png',
        'Poetry': './categories/poetry.png',
        'Romance': './categories/romance.png',
        'Short Stories': './categories/shortstories.png'
    };

    let html = '<h1>Categories</h1><div class="category-grid">';
    for (const cat of categories) {
        //to count the number of books in this category
        const count = books.filter(b => b.category === cat || (b.otherCategories && b.otherCategories.includes(cat))).length;
        html += `
        <a class="category-card" href="categories.html?cat=${encodeURIComponent(cat)}">
            <img src="${categoryImages[cat]}" alt="${cat}">
            <h2>${cat}</h2>
        </a>`;
    }
    html += '</div>';
    container.innerHTML = html;
}

function renderBooks(books, catName) {
    const container = document.getElementById('page-content');
    let html = `
    <a class="back-link" href="categories.html">← All Categories</a>
        <h1>${catName}</h1>
        <div class="book-grid">
    `;
    for (const book of books) {
        html += `
        <div class="book-card">
            <a href="book.html?id=${book.id}">
                <img src="${book.cover}" alt="${book.title}">
                <h3>${book.title}</h3>
            </a>
            <a class="author-link" href="authors.html?author=${encodeURIComponent(book.author)}">
                ${book.author}
            </a>
        </div>
        `;
    }
    html += '</div>';
    container.innerHTML = html;
}

init();