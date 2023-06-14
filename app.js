const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');// Necessário instalar npm i method-override para utilizar update
const Campground = require('./models/campground');

const ExpressError = require('./utils/ExpressError')
const catchAsync = require('./utils/catchAsync')

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erro de conexão:'))
db.once('open', () => {
    console.log('Banco conectado :)')
})

const app = express();


app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(express.urlencoded({ extended: true })); // para os dados serem passados no req.body, parse*
app.use(methodOverride('_method')); // utilizando o method override // o _method é como definimos como vamos referenciar o methodOverride nos links


// HOME
app.get('/', (req, res) => {
    res.render('home')
})

// SHOW ALL CAMPS
app.get('/campgrounds', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index.ejs', { campgrounds })
}))

// NEW CAMP FORM PAGE
app.get('/campgrounds/new', (req, res) => { // se for após do '/campgrounds/:id/' vai dar erro, vai tentar usar o new como id
    res.render('campgrounds/new.ejs')
})

// POST  CAMP REQUEST
app.post('/campgrounds', catchAsync(async (req, res, next) => {
        const campData = req.body.campground;
        const newCamp = new Campground(campData);
        await newCamp.save();
        res.redirect(`campgrounds/${newCamp._id}`);
}))

// SHOW CAMP
app.get('/campgrounds/:id', catchAsync(async (req, res) => {
    const id = req.params.id;
    const campground = await Campground.findById(id);
    res.render('campgrounds/show.ejs', { campground })
}))

// EDIT CAMP
app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    const id = req.params.id;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit.ejs', { campground });
}))

// UPDATE THE EDITED CAMP
app.put('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campData = req.body.campground;
    await Campground.findByIdAndUpdate(id, { ...campData });
    res.redirect(`/campgrounds/${id}`)
}))

// DELETE CAMP
app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect(`/campgrounds/`);
}))


app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})

// ERROR HANDLING GENÉRICO
app.use((err, req, res, next) => {
    const {statusCode = 500, message = 'Algo deu errado!'} = err;
    res.status(statusCode).send(message);
})



app.listen(3000, () => {
    console.log('Logado na porta 3000!!!');
})
