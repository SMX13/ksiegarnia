/* global Handlebars, dataSource */

'use strict';

import { utils } from './functions.js';

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
    this.dom = {};
    this.dom.booksList = document.querySelector('.books-list');
    this.dom.filters = document.querySelectorAll('.filters input');
  }

  render() {
    for (const book of this.data) {
      const generatedHTML = templates.book(book);
      const element = utils.createDOMFromHTML(generatedHTML);
      this.dom.booksList.appendChild(element);
    }
  }

  initActions() {
    for (const checkbox of this.dom.filters) {
      checkbox.addEventListener('change', event => {
        const value = event.target.value;

        if (event.target.checked) {
          this.filters.push(value);
        } else {
          const index = this.filters.indexOf(value);
          this.filters.splice(index, 1);
        }

        this.filterBooks();
      });
    }

    this.dom.booksList.addEventListener('dblclick', event => {
      event.preventDefault();

      const bookImage = event.target.closest('.book__image');
      if (!bookImage) return;

      const bookId = bookImage.dataset.id;

      if (this.favoriteBooks.includes(bookId)) {
        this.favoriteBooks = this.favoriteBooks.filter(id => id !== bookId);
        bookImage.classList.remove('favorite');
      } else {
        this.favoriteBooks.push(bookId);
        bookImage.classList.add('favorite');
      }
    });
  }

  filterBooks() {
    for (const book of this.data) {
      let shouldBeHidden = false;

      for (const filter of this.filters) {
        if (!book.details[filter]) {
          shouldBeHidden = true;
          break;
        }
      }

      const bookImage = document.querySelector(
        `.book__image[data-id="${book.id}"]`
      );

      bookImage.classList.toggle('hidden', shouldBeHidden);
    }
  }
}

new BooksList();
