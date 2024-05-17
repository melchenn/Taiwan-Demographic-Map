mapboxgl.accessToken = 'pk.eyJ1IjoibWVsY2hlbm4iLCJhIjoiY2x1b3dzMm44MWc4NDJqcG9zOGYzYXBhMSJ9.zwxNMqGtGtQeQ_vj0_iv5A';

// Create a new map, bounded by Taiwan.
const map = new mapboxgl.Map({
    container: 'map-container',
    style: 'mapbox://styles/melchenn/clw9gakwk00jl01nx1zs90s1n',
    bounds: [[116.31100, 21.77632], [123.39746, 25.39158]]
});

// zoom and compass features
map.addControl(new mapboxgl.NavigationControl());

map.on('load', () => {
    // Add source for city polygons
    map.addSource('taiwan-cities', {
        'type': 'geojson',
        'data': 'data/taiwan-shape.geojson'
    });

    // Add a layer showing the city polygons
    map.addLayer({
        'id': 'city-layer',
        'type': 'fill',
        'source': 'taiwan-cities',
        'paint': {
            'fill-color': '#cea1ff', //pink
            'fill-opacity': [
                'case',
                ['boolean', ['feature-state', 'click'], false],
                0.6,
                0.2
            ]
        }
    }, 'building-entrance');

     // add a line layer showing city boundaries
    map.addLayer({
        'id': 'city-outline',
        'type': 'line',
        'source': 'taiwan-cities',
        'layout': {},
        'paint': {
            'line-color': [
                'case',
                ['boolean', ['feature-state', 'click'], false],
                "purple",
                "grey"
            ],
            'line-width': [
                'case',
                ['boolean', ['feature-state', 'click'], false],
                5,
                0.6
            ],
            'line-opacity': [
                'case',
                ['boolean', ['feature-state', 'click'], false],
                1,
                1
            ]
        }
    }, 'building-entrance');


    // Stats appears on sidebar when clicking on a feature in the city-layer
    map.on('click', 'city-layer', (e) => {
        if (e.features.length > 0) {
            const feature = e.features[0];
            const cityName = feature.properties.COUNTYENG; // City name
            const population = feature.properties.POPULATION; // Population
            const fmRatio = feature.properties.Fmratio;  // Female-to-male ratio
            const age0_18 = feature.properties.age0_18; // Age 0-18
            const age19_65 = feature.properties.age19_65;  // Age 19-65
            const ageOver65 = feature.properties.over65;  // Over 65

            // Creating an HTML content string on the second sidebar
            const sidebar2 = document.getElementById('sidebar2');
            sidebar2.innerHTML = `
            <h1>${cityName}</h1>
            <table style="width:100%">
            <tr style="height:10px">
                <td><p>Population</p></td>
                <td><p2><strong>${numeral(population).format('0.0a')}</strong></p2></td>
            </tr>
            <tr>
                <td><p>Female to Male Ratio</p></td>
                <td><p2><strong>${fmRatio}</strong> </p2></td>
            </tr>
            <tr>
                <td><p>Age Distribution</p></td>
                <td style:;ome-spaco>
                <p>0-18 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <p2><strong>${numeral(age0_18).format('0.0a')}</strong></p2><p>
                <p>19-65 &nbsp; &nbsp;&nbsp;&nbsp; <p2><strong>${numeral(age19_65).format('0.0a')}</strong></p2><p>
                <p>Over 65  &nbsp; <p2><strong>${numeral(ageOver65).format('0.0a')}</strong></p2><p>
            </ul></td>
            </tr>
        </table>
            `;
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
            );
        }
    })

});