/* global dataSource, Handlebars, utils */

'use strict';

const templates = {
  book: Handlebars.compile(
    document.querySelector('#template-book').innerHTML
  ),
};

class BooksList {
constructor() {
  this.data = dataSource.books;
  this.filters = [];
  this.favoriteBooks = [];

  this.getElements();
  this.render();
  this.initActions();
}

  getElements() {
    const thisApp = this;

    thisApp.dom = {};
    thisApp.dom.booksList = document.querySelector('.books-list');
    thisApp.dom.filters = document.querySelectorAll('.filters input');
  }

  render() {
    const thisApp = this;

    for (let book of thisApp.data) {
      const generatedHTML = templates.book(book);
      const element = utils.createDOMFromHTML(generatedHTML);
      thisApp.dom.booksList.appendChild(element);
    }
  }

  initActions() {
    const thisApp = this;

    for (let checkbox of thisApp.dom.filters) {
      checkbox.addEventListener('change', function(event) {
        const clickedCheckbox = event.target;

        if (clickedCheckbox.checked) {
          thisApp.filters.push(clickedCheckbox.value);
        } else {
          const index = thisApp.filters.indexOf(clickedCheckbox.value);
          thisApp.filters.splice(index, 1);
        }
        thisApp.filterBooks();
      });
    }
    thisApp.dom.booksList.addEventListener('dblclick', function(event) {
      event.preventDefault();

      const bookImage = event.target.offsetParent;

      if (!bookImage.classList.contains('book__image')) {
        return;
      }

      const bookId = bookImage.getAttribute('data-id');

      if (thisApp.favoriteBooks.includes(bookId)) {
        const index = thisApp.favoriteBooks.indexOf(bookId);
        thisApp.favoriteBooks.splice(index, 1);
        bookImage.classList.remove('favorite');
      } else {
        thisApp.favoriteBooks.push(bookId);
        bookImage.classList.add('favorite');
      }
    });

    
  }


  filterBooks() {
  const thisApp = this;

  for (let book of thisApp.data) {
    let shouldBeHidden = false;

    for (let filter of thisApp.filters) {
      if (!book.details[filter]) {
        shouldBeHidden = true;
        break;
      }
    }

    const bookElement = document.querySelector(
      `.book__image[data-id="${book.id}"]`
    );

    if (shouldBeHidden) {
      bookElement.classList.add('hidden');
    } else {
      bookElement.classList.remove('hidden');
    }
  }
}



}

new BooksList();
