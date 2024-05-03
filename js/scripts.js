mapboxgl.accessToken = 'pk.eyJ1IjoibWVsY2hlbm4iLCJhIjoiY2x1b3dzMm44MWc4NDJqcG9zOGYzYXBhMSJ9.zwxNMqGtGtQeQ_vj0_iv5A';

// Create a new map, bounded by Taiwan.
const map = new mapboxgl.Map({
    container: 'map-container',
    style: 'mapbox://styles/mapbox/streets-v12',
    bounds: [[120.30517, 25.36416], [120.73489, 21.68234]]
});

// zoom and compass features
map.addControl(new mapboxgl.NavigationControl());

map.on('load', () => {
    // Add a source for the city polygons.
    map.addSource('taiwan-cities', {
        'type': 'geojson',
        'data': 'data/taiwan-shape.geojson'
    });

    // Add a layer showing the city polygons.
    map.addLayer({
        'id': 'city-layer',
        'type': 'fill',
        'source': 'taiwan-cities',
        'paint': {
            'fill-color': '#cea1ff',
            'fill-opacity': [
                'case',
                ['boolean', ['feature-state', 'click'], false],
                1,
                0.2
            ]
        }
    });

     // add a line layer showing city boundaries
     map.addLayer({
        'id': 'city-outline',
        'type': 'line',
        'source': 'taiwan-cities', //this must match the name of the source
        'layout': {},
        'paint': {
            'line-color': 'grey',
            'line-width': 0.5,
        }
    });

    // Popup appears when a click event occurs on a feature in the city-layer, 
    // open a popup at the location of the click, with description
    // HTML from the click event's properties.
    map.on('click', 'city-layer', (e) => {
        if (e.features.length > 0) {
            const feature = e.features[0];
            const cityName = feature.properties.COUNTYENG; // City name
            const population = feature.properties.POPULATION; // Population
            const fmRatio = feature.properties.Fmratio || 'Not available'; // Female-to-male ratio
            const age0_18 = feature.properties.age0_18 || 'Data not available'; //Age Distribution
            const age19_65 = feature.properties.age19_65 || 'Data not available';
            const ageOver65 = feature.properties.over65 || 'Data not available';
    
            // Creating an HTML content string for the popup
            const popupContent = `
                <h3>${cityName}</h3>
                <p><strong>Population:</strong> ${population}</p>
                <p><strong>Female to Male Ratio:</strong> ${fmRatio}</p>
                <p><strong>Age Distribution:</strong></p>
                <ul>
                    <li>Ages 0-18: ${age0_18}</li>
                    <li>Ages 19-65: ${age19_65}</li>
                    <li>Over 65: ${ageOver65}</li>
                </ul>
            `;
    
            new mapboxgl.Popup()
                .setLngLat(e.lngLat)
                .setHTML(popupContent)
                .addTo(map);
        }
    });


    var PolygonId = null
    // feature city for the feature under the mouse
    map.on('mousemove', 'city-layer', (e) => {
        console.log('MOUSE MOVED', e.features)

        if (e.features.length > 0) {
            if (PolygonId !== null) {
                map.setFeatureState(
                    { source: 'taiwan-cities', id: PolygonId },
                    { click: false}
                );
            }
            PolygonId=e.features[0].id;
            map.setFeatureState(
                { source: 'taiwan-cities', id:PolygonId },
                {click: true}
            )
        }
    })

});