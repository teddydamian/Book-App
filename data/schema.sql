DROP TABLE IF EXISTS books;

CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  book_description TEXT,
  author VARCHAR(255),
  img_link VARCHAR(255),
  isbn_10 NUMERIC(10),
  isbn_13 NUMERIC(13),
  categories TEXT
);
