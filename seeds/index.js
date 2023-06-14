/*
    Arquivo para popular (seed) o banco de dados
*/

// Load the modules
const mongoose = require('mongoose');
const Campground = require('../models/campground');

// Cria a conexão com o banco 
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');

//  Dummy data
const cities = require('./cities')
const descriptionsData = require('./seedHelpers');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erro de conexão:'))
db.once('open', () => {
    console.log('Banco conectado :)')
})

const indexAleatorio = (arr) => arr[randomIndex = Math.floor(Math.random() * arr.length)]

const popularBanco = async() => {
    await Campground.deleteMany({}); // deleta tudo do banco para repopular
    for(let x = 0; x < 50; x++) {
        const randomDescriptor = indexAleatorio(descriptionsData.descriptors)
        const randomPlace = indexAleatorio(descriptionsData.places)
        const randomCity = indexAleatorio(cities)
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            location: `${randomCity.city} ${randomCity.state}`,
            title: `${randomDescriptor} ${randomPlace}`,
            image: 'https://source.unsplash.com/collection/483251',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic in sunt saepe.',
            price
        })
        await camp.save();
    }
}

popularBanco()
.then(() => mongoose.connection.close()) // fecha o banco de dados