mapboxgl.accessToken=mapBoxToken;
const map=new mapboxgl.Map({
    container: 'clusterMap',
    style: 'mapbox://styles/mapbox/light-v10',
    center: [-1.9, 52.48333],
    zoom: 3
});

map.addControl(new mapboxgl.NavigationControl());

map.on('load', function () {
    // Add a new source from our GeoJSON data and
    // set the 'cluster' option to true. GL-JS will
    // add the point_count property to your source data.
    map.addSource('gyms', {
        type: 'geojson',
        // Point to GeoJSON data. 
        data: gyms,
        cluster: true,
        clusterMaxZoom: 14, // Max zoom to cluster points on
        clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
    });

    map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'gyms',
        filter: ['has', 'point_count'],
        paint: {
            // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
            // with three steps to implement three types of circles:
            //   * Blue, 20px circles when point count is less than 10
            //   * Yellow, 30px circles when point count is between 10 and 50
            //   * Pink, 40px circles when point count is greater than or equal to 750
            'circle-color': [
                'step',
                ['get', 'point_count'],
                '#8ecae6',
                5,
                '#219ebc',
                15,
                '#126782'
            ],
            'circle-radius': [
                'step',
                ['get', 'point_count'],
                20,
                10,
                25,
                20,
                30
            ]
        }
    });

    map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'gyms',
        filter: ['has', 'point_count'],
        layout: {
            'text-field': '{point_count_abbreviated}',
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 12
        }
    });

    map.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'gyms',
        filter: ['!', ['has', 'point_count']],
        paint: {
            'circle-color': '#11b4da',
            'circle-radius': 4,
            'circle-stroke-width': 1,
            'circle-stroke-color': '#fff'
        }
    });

    // inspect a cluster on click
    map.on('click', 'clusters', function (e) {
        const features=map.queryRenderedFeatures(e.point, {
            layers: ['clusters']
        });
        const clusterId=features[0].properties.cluster_id;
        map.getSource('gyms').getClusterExpansionZoom(
            clusterId,
            function (err, zoom) {
                if (err) return;

                map.easeTo({
                    center: features[0].geometry.coordinates,
                    zoom: zoom
                });
            }
        );
    });

    // When a click event occurs on a feature in
    // the unclustered-point layer, open a popup at
    // the location of the feature, with
    // description HTML from its properties.
    map.on('click', 'unclustered-point', function (e) {
        const coordinates=e.features[0].geometry.coordinates.slice();
        const { popUpMarkup }=e.features[0].properties;
        console.log(popUpMarkup);
        // Ensure that if the map is zoomed out such that
        // multiple copies of the feature are visible, the
        // popup appears over the copy being pointed to.
        while (Math.abs(e.lngLat.lng-coordinates[0])>180) {
            coordinates[0]+=e.lngLat.lng>coordinates[0]? 360:-360;
        }

        new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(popUpMarkup)
            .addTo(map);
    });

    map.on('mouseenter', 'clusters', function () {
        map.getCanvas().style.cursor='pointer';
    });
    map.on('mouseleave', 'clusters', function () {
        map.getCanvas().style.cursor='';
    });
});