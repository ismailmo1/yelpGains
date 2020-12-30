const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const Review=require('./reviews')
const opts={ toJSON: { virtuals: true } };

const ImageSchema=new Schema({
    url: String,
    filename: String
})

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200')
});

const gymSchema=new Schema({
    title: String,
    images: [ImageSchema],
    price: Number,
    description: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews:
        [
            {
                type: Schema.Types.ObjectId,
                ref: 'Review'
            }
        ],
    squatRacks: Number,
    benchRacks: Number,
    dlPlatforms: Number,
    dbBenches: Number,
    cables: Number
}, opts);

gymSchema.virtual('properties.popUpMarkup').get(function () {
    return `<a href = "/gyms/${this._id}">${this.title}</a>
    <p#>`;
});

gymSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        }
        )

    }
})

module.exports=mongoose.model('gym', gymSchema);
