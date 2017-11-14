'use strict';

var app = app || {};

(function(module){
  const bookView = {};

  // Initial View Setup
  $('.container').hide();
  $('.fetching-data').show();
  $('.icon-menu').on('click', () => {
    $('.menu-link').toggle()
    if(!localStorage.isAdmin) $('#new-book-link').hide();
  });

  bookView.initIndexPage = function() {
    $('.container').hide();
    $('#book-list').empty();
    $('.book-view').show();
    module.Book.all.forEach(book => $('#book-list').append(book.toHtml('list')));
    $('#num-books').text(`${module.Book.all.length}`);
    $('#admin-login-link a').attr('href', 'admin');

  };

  bookView.initDetailPage = function(ctx) {
    $('.container').hide();
    let book = new module.Book(ctx.book);
    $('#book-detail').empty().append(book.toHtml('detail'));
    localStorage.isAdmin ? $('.admin-only').show() : $('.admin-only').hide();
    $('.book-detail').show();
    $('#delete-book').on('click', () => {
      module.Book.deleteBook(ctx.params.book_id);
    });
    $('#admin-login-link a').attr('href', `admin/${ctx.params.book_id}`);
  };

  bookView.initFormPage = function() {
    if(!localStorage.isAdmin) page('/');
    $('.container').hide();
    $('#new-book').trigger('reset');
    $('.create-view h2').text('Add a New Book');
    $('#new-book button').text('Add Book');
    $('.create-view').show();
    $('#new-book').off();
    $('#new-book').on('submit', function(e) {
      e.preventDefault();
      module.Book.addNewBook(module.Book.getFormData(e));
    });
  }

  bookView.initUpdateFormPage = function(ctx) {
    if(!localStorage.isAdmin) page('/');
    $('.container').hide();
    $('.create-view h2').text(`Update ${ctx.book.title}`);
    $('#new-book button').text('Update Book');
    $('.create-view').show();
    $('#title-form').val(ctx.book.title);
    $('#author-form').val(ctx.book.author);
    $('#isbn-form').val(ctx.book.isbn);
    $('#image_url-form').val(ctx.book.image_url);
    $('#description-form').val(ctx.book.description);
    $('#new-book').off();
    $('#new-book').on('submit', (e) => {
      e.preventDefault();
      module.Book.updateBook(ctx, module.Book.getFormData(e));
    });
  };

  bookView.initAboutPage = function() {
    $('.container').hide();
    $('.about-view').show();
  }

  module.bookView = bookView;
})(app);
