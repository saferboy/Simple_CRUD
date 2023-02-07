import express from "express";
import Joi from "joi"
import cors from "cors"
import { Book } from "./src/model/book.model";


const app = express();

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


const books: Book[] = [
    { id: 1, name: 'Book1' },
    { id: 2, name: 'Book2' },
    { id: 3, name: 'Book3' },
    { id: 4, name: 'Book4' },
    { id: 5, name: 'Book5' },
    { id: 6, name: 'Book6' }
]

app.get('/', (req, res) => {
    res.send('hello ')
})

app.post('/api/books', (req, res) => {
    const { error } = bookValidate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message)
    }

    const book = {
        id: books.length + 1,
        name: req.body.name
    }
    books.push(book)
    res.status(201).send(book)
})

app.get('/api/books/:id', (req, res) => {
    const book = books.find(b => b.id === parseInt(req.params.id))
    if (!book) {
        return res.status(404).send('book not found')
    }
    res.send(book)
})

app.get('/api/books', (req, res) => {
    res.send(books)
})


app.put('/api/books/:id', (req, res) => {
    const book = books.find(b => b.id === parseInt(req.params.id))
    if (!book) {
        return res.status(404).send('id boyicha kitob topilmadi')
    }

    // agar kitob topilsa, sorovni validatsiya qilish 
    // agar validatsiyadan o'tmasa 400 qaytarish

    const { error } = bookValidate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message)
    }
    // kitobni yangilash
    book.name = req.body.name
    // yangilangan kitobni qaytarish
    res.send(book)
});

app.delete('/api/books/:id', (req, res) => {
    // kitobni id si bo'yicha topamiz
    // agar topilmasa 404 qaytaramiz
    const book = books.find(b => b.id === parseInt(req.params.id))
    if (!book) {
        return res.status(404).send('id boyicha kitob topilmadi')
    }

    // topilsa id si bo'yicha o'chiramiz
    const bookIndex = books.indexOf(book);
    books.splice(bookIndex, 1);
    // topilgan kitobni qaytarmiz
    res.send(book); 
})

function bookValidate(book: any) {
    const bookSchema = Joi.object({
        name: Joi.string()
            .required()
            .min(3)
    })
    return bookSchema.validate(book)

}



const port = process.env.PORT || 8080

app.listen(port, () => {
    console.log(`server is runnning in ${port}`)
})