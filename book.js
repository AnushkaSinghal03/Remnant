async function loadBook() {
    const params = new URLSearchParams(window.location.search);
    const bookId = params.get('id');
    if (!bookId) return;

    const response = await fetch('./books.json');
    const data = await response.json();
    const book = data.books.find(b => b.id === bookId);
    if (!book) return;

    document.getElementById('book-cover').src = book.cover;
    document.getElementById('book-cover').alt = book.title;
    document.title = 'Remnant - ' + book.title;
    document.getElementById('book-title').textContent = book.title;
    document.getElementById('book-author').textContent = book.author;
    document.getElementById('book-year').textContent = book.yearPublished;
    document.getElementById('book-category').textContent = book.category;
    document.getElementById('book-description').textContent = book.description;
    document.getElementById('read-now').href = book.epub || '#';
    document.getElementById('download-book').href = book.epub || '#';
}

loadBook();
