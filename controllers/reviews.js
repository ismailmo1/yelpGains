const gym = require('../models/gym');
const Review = require('../models/reviews');

module.exports.postReview = async (req, res) => {
    const gym = await gym.findById(req.params.id)
    const review = new Review(req.body.review);
    review.author = req.user._id
    gym.reviews.push(review);
    await review.save();
    await gym.save();
    req.flash('success', 'Successfully added review!');

    // need to actually execpopulate and wait returned promise to see it
    // newCamp = await gym.findById(req.params.id);
    // await newCamp.populate({ path: 'reviews', model: 'Review' }).execPopulate();
    // console.log(newCamp);
    res.redirect(`/gyms/${gym._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await gym.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review!');

    res.redirect(`/gyms/${id}`)
}