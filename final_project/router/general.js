const express = require('express');
const books = require("./booksdb.js");
const { isValid } = require('./auth_users.js');
let users = require("./auth_users.js").users;

const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    const present = isValid(username);

    if (!present) {
      // Assuming 'users' is accessible here, adjust if needed
      users.push({ "username": username, "password": password });
      return res.status(201).json({ message: "User Created successfully" });
    } else {
      return res.status(400).json({ message: "User already exists" });
    }
  } else {
    return res.status(400).json({ message: "Bad request. Check username and password" });
  }
});

// Your existing routes for getting books, details, etc.
public_users.get('/', (req, res) => {
  const getBooks = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(books);
      }, 1000);
    });
  }
  getBooks().then((books) => {
    res.json(books);
  }).catch((err) => {
    res.status(500).json({ error: "An error occured" });
  });

  //await res.send(JSON.stringify(books,null,4));

});


// // Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {

  const ISBN = req.params.isbn;
  await res.send(books[ISBN]);

});

// Get book details based on ISBN using Promises
// public_users.get('/isbn/:isbn',async (req, res) => {

  // const ISBN = req.params.isbn;
  // const booksBasedOnIsbn = (ISBN) => {
  //   return new Promise((resolve, reject) => {
  //     setTimeout(() => {
  //       const book = books.find((b) => b.isbn === ISBN);
  //       if (book) {
  //         resolve(book);
  //       } else {
  //         reject(new Error("Book not found"));
  //       }
  //     }, 1000);
  //   });


//   }
//   booksBasedOnIsbn(ISB).then((book) => {
//     res.json(book);
//   }).catch((err) => {
//     res.status(400).json({ error: "Book not found" })
//   });

//   await res.send(books[ISBN]);    

// });

// Get book details based on author
// public_users.get('/author/:author', async (req, res) => {

//   const author = req.params.author;
//   const booksBasedOnAuthor = (auth) => {
//     return new Promise((resolve, reject) => {
//       setTimeout(() => {
//         const filteredbooks = books.filter((b) => b.author === auth);
//         if (filteredbooks.length > 0) { // Check the length of the array
//           resolve(filteredbooks);
//         } else {
//           reject(new Error("Book not found"));
//         }
//       }, 1000);
//     });
//   }

//   booksBasedOnAuthor(author)
//     .then((book) => {
//       res.json(book);
//     })
//     .catch((err) => {
//       res.status(400).json({ error: "Book not found" });
//     });


//     //let new_books = {}
//     //const new_author = req.params.author;
//     //let i=1;
//     //for(let bookid in books){
//       //   if(books[bookid].author === new_author ){
//         //    new_books[i++] = books[bookid];
//         //  }
//         //}
//         //await res.send(JSON.stringify(new_books))        
// });

public_users.get('/author/:author', async (req, res) => {
  const AUTH = req.params.author;
  // await res.send(books[AUTH]);

  const filteredbooks = books.filter((b) => b.author === AUTH);
  if (filteredbooks.length > 0) { // Check the length of the array
    await res.send(filteredbooks);
  } else {
    reject(new Error("Book not found"));
  }
});

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {

  //let new_books = {}
  //const re_title = req.params.title;
  //let i = 1;
  //for(bookid in books){
  //  if(books[bookid].title === re_title ){
  //  new_books[i++] = books[bookid]
  //}
  //}
  //await res.send(JSON.stringify(new_books))

  const title = req.params.title;
  const booksBasedOnTitle = (booktitle) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const filteredbooks = books.filter((b) => b.title === booktitle);
        if (filteredbooks > 0) {
          resolve(filteredbooks);
        } else {
          reject(new Error("Book not found"));
        }
      }, 1000);
    });


  }
  booksBasedOnTitle(title).then((new_books) => {
    res.json(new_books);
  }).catch((err) => {
    res.status(400).json({ error: "Book not found" })
  });



});

//  Get book review
public_users.get('/review/:isbn', async (req, res) => {

  const isbn = req.params.isbn;
  await res.send(JSON.stringify(books[isbn].review), null, 4);

});

module.exports = {
  public_users
};
