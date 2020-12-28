const axios=require("axios");

const campCollection="https://source.unsplash.com/collection/289662";

const getRandomImage=async (unsplashUrl) => {
    try {
        const res=await axios.get(unsplashUrl);
        const path=res.request.path
        return path;
    } catch (e) {
        console.log(e)
    }
}

module.exports=getRandomImage;

