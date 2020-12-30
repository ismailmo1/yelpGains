const ExpressError=require('./utils/ExpressError')
const { gymSchema, reviewSchema }=require('./schemas')
const Gym=require('./models/gym');
const Review=require('./models/reviews');


module.exports.isLoggedIn=(req, res, next) => {
    console.log('login check')
    if (!req.isAuthenticated()) {
        req.session.returnTo=req.originalUrl;
        req.flash('error', 'You must be logged in!');
        return res.redirect('/login');
    }
    next();
}

module.exports.isAuthor=async (req, res, next) => {
    console.log('author check');
    const { id }=req.params;
    const gym=await Gym.findById(id);
    if (!gym.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permissions to do that!');
        return res.redirect(`/gyms/${id}`)
    }
    next();
}

module.exports.isReviewAuthor=async (req, res, next) => {
    const { id, reviewId }=req.params;
    const review=await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permissions to do that!');
        return res.redirect(`/gyms/${id}`)
    }
    next();
}

module.exports.validateGym=(req, res, next) => {
    console.log('validating camp');

    const { error }=gymSchema.validate(req.body);
    if (error) {
        const msg=error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
};

module.exports.validateReview=(req, res, next) => {
    const { error }=reviewSchema.validate(req.body);
    if (error) {
        const msg=error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}