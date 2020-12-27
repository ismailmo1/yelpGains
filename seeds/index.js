const mongoose=require('mongoose');
const Campground=require('../models/campground');
const cities=require('./cities')
const { places, descriptors }=require('./seedHelpers')

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})

const db=mongoose.connection;

db.on('error', console.error.bind(console));

db.once("open", () => {
    console.log('connected to mongo, im about to delete everything and reseed the db!')
});

const sample=(arr) => arr[Math.floor(Math.random()*arr.length)];

const seedDB=async () => {
    await Campground.deleteMany({});
    for (let i=0; i<200; i++) {
        const random1000=Math.floor(Math.random()*1000);
        const price=Math.floor(Math.random()*20)+10;
        const camp=new Campground({
            author: '5fce8a20eac6fa0517681604',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]

            },
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                {
                    url: 'https://res.cloudinary.com/dz3fed3gf/image/upload/v1607975543/YelpCamp/tzdbk72jzoxwrtpdrffn.png',
                    filename: 'YelpCamp/tzdbk72jzoxwrtpdrffn'
                },
                {
                    url: 'https://res.cloudinary.com/dz3fed3gf/image/upload/v1607975544/YelpCamp/dc7lv2izxkd2gbzlnwhr.jpg',
                    filename: 'YelpCamp/dc7lv2izxkd2gbzlnwhr'
                }
            ],
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi numquam, magni nostrum nobis pariatur vel. Aut assumenda cum hic, repellat velit quo nostrum, architecto voluptas molestiae excepturi omnis. Dolorum, dignissimos!',
            price
        });
        await camp.save();
    }

}

seedDB().then(() => {
    mongoose.connection.close()
});

