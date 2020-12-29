const mongoose=require('mongoose');
const Campground=require('../models/campground');
const cities=require('./cities')
const copypasta=require('./copypasta')
const images=require('./images')
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

// const getImgUrl=async () => {
//     try {
//         const res=await axios.get(campCollection)
//         const path=res.request.path
//         return `https://images.unsplash.com${path}`;
//     } catch (e) {
//         console.log(e)
//     }
// }

const seedDB=async () => {
    await Campground.deleteMany({});
    for (let i=0; i<20; i++) {
        const random443=Math.floor(Math.random()*443);
        const random15=Math.floor(Math.random()*15);
        const random11=Math.floor(Math.random()*11);
        const price=Math.floor(Math.random()*20)+10;
        const camp=new Campground({
            author: '5fea6159b1a4bf58f502b06a',
            location: `${cities[random443].city}, ${cities[random443].admin_name}`,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random443].lng,
                    cities[random443].lat
                ]

            },
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                {
                    url: images[random11]
                }

            ],
            description: copypasta[random15],
            price
        });
        await camp.save();
    }

}

seedDB().then(() => {
    mongoose.connection.close()
});

