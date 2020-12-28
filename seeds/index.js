const mongoose=require('mongoose');
const Campground=require('../models/campground');
const cities=require('./cities')
const { places, descriptors }=require('./seedHelpers')
const dbUrl="mongodb+srv://ismail:BYMVvGBkaHDNhcPi@cluster0.qd9q3.mongodb.net/<dbname>?retryWrites=true&w=majority"
const campCollection="https://source.unsplash.com/collection/289662";
const axios=require('axios');


mongoose.connect(dbUrl, {
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

const getImgUrl=async () => {
    try {
        const res=await axios.get(campCollection)
        const path=res.request.path
        return `https://images.unsplash.com${path}`;
    } catch (e) {
        console.log(e)
    }
}

const seedDB=async () => {
    await Campground.deleteMany({});
    for (let i=0; i<20; i++) {
        const random1000=Math.floor(Math.random()*1000);
        const price=Math.floor(Math.random()*20)+10;
        const camp=new Campground({
            author: '5fea6159b1a4bf58f502b06a',
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
                    url: await getImgUrl()
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

