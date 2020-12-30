const Gym=require('../models/gym');
const { cloudinary }=require('../cloudinary')
const mbxGeocoding=require('@mapbox/mapbox-sdk/services/geocoding');
const mbxToken=process.env.MAPBOX_TOKEN;
const geocoder=mbxGeocoding({ accessToken: mbxToken });

module.exports.index=async (req, res) => {
    const gyms=await Gym.find({});
    res.render('gyms/index', { gyms });
}

module.exports.renderNewForm=(req, res) => {
    res.render('gyms/new')
}

module.exports.createGym=async (req, res, next) => {
    if (!req.body.gym) throw new ExpressError('Invalid gym Data', 400);
    const geoData=await geocoder.forwardGeocode({
        query: req.body.gym.location,
        limit: 1
    }).send();
    const gym=new Gym(req.body.gym);
    gym.geometry=geoData.body.features[0].geometry;
    gym.squatRacks=req.body.gym.squatRacks;
    gym.benchRacks=req.body.gym.benchRacks;
    gym.dlPlatforms=req.body.gym.dlPlatforms;
    gym.dbBenches=req.body.gym.dbBenches;
    gym.cables=req.body.gym.cables;
    gym.images=req.files.map(f => ({ url: f.path, filename: f.filename }))
    gym.author=req.user._id;
    await gym.save();
    console.log(gym);
    req.flash('success', 'Successfully made gym!');
    res.redirect(`/gyms/${gym._id}`);
}

module.exports.showGym=async (req, res) => {
    const gym=await Gym.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!gym) {
        req.flash('error', "Can't find that gym!")
        return res.redirect('/gyms');
    }
    res.render('gyms/show', { gym });
}

module.exports.editGym=async (req, res) => {
    const gym=await Gym.findById(req.params.id)
    if (!gym) {
        req.flash('error', "Can't find that gym!")
        return res.redirect('/gyms');
    }
    res.render('gyms/edit', { gym })
}

module.exports.updateGym=async (req, res) => {
    const { id }=req.params;
    // console.log(req.params, req.body)
    const gym=await Gym.findByIdAndUpdate(id, { ...req.body.gym })
    const imgs=req.files.map(f => ({ url: f.path, filename: f.filename }))
    await gym.images.push(...imgs);
    await gym.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
    }
    await gym.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    req.flash('success', 'Successfully updated gym!');
    res.redirect(`/gyms/${gym._id}`);

}

module.exports.deleteGym=async (req, res) => {
    const { id }=req.params;
    // console.log(req.params);
    await Gym.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted gym!');

    res.redirect('/gyms');
}