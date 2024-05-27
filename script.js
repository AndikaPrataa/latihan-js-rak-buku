const RENDER_EVENT = 'render-books';
const STORAGE_KEY = 'BOOKSHELF_APPS';
const books = [];

function isStorageAvailable() {
  if (typeof Storage === undefined) {
    alert('Your browser does not support web storage');
    return false;
  }
  return true;
}

document.addEventListener(RENDER_EVENT, () => {
  const unreadBooks = document.getElementById('unreadBooks');
  unreadBooks.innerHTML = '';

  const readBooks = document.getElementById('readBooks');
  readBooks.innerHTML = '';

  for (const book of books) {
    const bookElement = createBookElement(book);
    if (!book.isRead) {
      unreadBooks.append(bookElement);
    } else {
      readBooks.append(bookElement);
    }
  }
});

function saveData() {
  if (isStorageAvailable()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(RENDER_EVENT));
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  if (serializedData !== null) {
    const parsedData = JSON.parse(serializedData);
    for (const book of parsedData) {
      books.push(book);
    }
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isRead) {
  return { id, title, author, year, isRead };
}

function addBook() {
  const title = document.getElementById('title').value;
  const author = document.getElementById('author').value;
  const year = document.getElementById('year').value;
  const isRead = document.getElementById('isRead').checked;

  const generatedId = generateId();
  const bookObject = generateBookObject(generatedId, title, author, year, isRead);
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function createBookElement(book) {
  const titleElement = document.createElement('h3');
  titleElement.classList.add('book-title');
  titleElement.innerText = book.title;

  const authorElement = document.createElement('p');
  authorElement.classList.add('book-author');
  authorElement.innerText = book.author;

  const yearElement = document.createElement('p');
  yearElement.innerText = `Year: ${book.year}`;

  const textContainer = document.createElement('div');
  textContainer.classList.add('book-text');
  textContainer.append(titleElement, authorElement, yearElement);

  const container = document.createElement('div');
  container.classList.add('book-item');
  container.append(textContainer);

  if (book.isRead) {
    const unreadButton = document.createElement('button');
    unreadButton.classList.add('action-btn', 'return-btn');
    unreadButton.innerHTML = '<i class="bx bx-undo"></i>';
    unreadButton.addEventListener('click', () => {
      markAsUnread(book.id);
    });

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('action-btn', 'delete-btn');
    deleteButton.innerHTML = '<i class="bx bx-trash"></i>';
    deleteButton.addEventListener('click', () => {
      removeBook(book.id);
    });

    const actionContainer = document.createElement('div');
    actionContainer.classList.add('book-actions');
    actionContainer.append(unreadButton, deleteButton);
    container.append(actionContainer);
  } else {
    const readButton = document.createElement('button');
    readButton.classList.add('action-btn', 'finish-btn');
    readButton.innerHTML = '<i class="bx bx-check"></i>';
    readButton.addEventListener('click', () => {
      markAsRead(book.id);
    });

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('action-btn', 'delete-btn');
    deleteButton.innerHTML = '<i class="bx bx-trash"></i>';
    deleteButton.addEventListener('click', () => {
      removeBook(book.id);
    });

    const actionContainer = document.createElement('div');
    actionContainer.classList.add('book-actions');
    actionContainer.append(readButton, deleteButton);
    container.append(actionContainer);
  }

  return container;
}

function markAsRead(bookId) {
  const targetBook = books.find(book => book.id === bookId);
  if (targetBook) {
    targetBook.isRead = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }
}

function markAsUnread(bookId) {
  const targetBook = books.find(book => book.id === bookId);
  if (targetBook) {
    targetBook.isRead = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }
}

function removeBook(bookId) {
  const bookIndex = books.findIndex(book => book.id === bookId);
  if (bookIndex !== -1) {
    books.splice(bookIndex, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const bookForm = document.getElementById('bookForm');
  bookForm.addEventListener('submit', (event) => {
    event.preventDefault();
    addBook();
  });

  const searchForm = document.getElementById('searchForm');
  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    searchBooks();
  });

  searchForm.addEventListener('reset', (event) => {
    event.preventDefault();
    resetSearch();
  });

  if (isStorageAvailable()) {
    loadDataFromStorage();
  }
});

function searchBooks() {
  const searchQuery = document.getElementById('search').value.toLowerCase();
  const filteredBooks = books.filter(book => book.title.toLowerCase().includes(searchQuery));
  
  const unreadBooks = document.getElementById('unreadBooks');
  unreadBooks.innerHTML = '';

  const readBooks = document.getElementById('readBooks');
  readBooks.innerHTML = '';

  for (const book of filteredBooks) {
    const bookElement = createBookElement(book);
    if (!book.isRead) {
      unreadBooks.append(bookElement);
    } else {
      readBooks.append(bookElement);
    }
  }
}

function resetSearch() {
  document.getElementById('search').value = '';
  document.dispatchEvent(new Event(RENDER_EVENT));
}
