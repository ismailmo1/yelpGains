mapboxgl.accessToken=mapBoxToken
var map=new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10', // stylesheet location
    center: gym.geometry.coordinates, // starting position [lng, lat]
    zoom: 10 // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());


new mapboxgl.Marker()
    .setLngLat(gym.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup()
            .setHTML(`<h4>${gym.title}</h4><p>${gym.location}</p>`))
    .addTo(map)