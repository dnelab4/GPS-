ar map = new ol.Map({
    target: 'map',
    layers: [
        new ol.layer.Tile({
            source: new ol.source.OSM() // OpenStreetMap layer
        })
    ],
    view: new ol.View({
        center: ol.proj.fromLonLat([77.56385, 13.04788]), // BEL Bangalore complex starting point
        zoom: 15  // Initial zoom level
    })
});

// Create a marker for the tracked location
var marker = new ol.Overlay({
    position: ol.proj.fromLonLat([77.56385, 13.04788]), // Initial marker position (BEL complex)
    positioning: 'center-center',
    element: document.createElement('div'),
    stopEvent: false,
    className: 'marker'
});
marker.getElement().style.width = '10px';
marker.getElement().style.height = '10px';
marker.getElement().style.backgroundColor = 'red';
marker.getElement().style.borderRadius = '50%';
map.addOverlay(marker);

// Initialize Socket.IO
var socket = io();

// Request real-time location using the Geolocation API
if (navigator.geolocation) {
    // Watch for changes in position (real-time tracking)
    navigator.geolocation.watchPosition(function(position) {
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;

        console.log(`Current position: ${lat}, ${lng}`);

        // Send the updated coordinates to the server
        socket.emit('location_update', { lat: lat, lng: lng });

        // Move the marker to the new location
        var new_coords = ol.proj.fromLonLat([lng, lat]);
        marker.setPosition(new_coords);

        // Optionally, re-center the map on the new location
        map.getView().setCenter(new_coords);

    }, function(error) {
        switch(error.code) {
            case error.PERMISSION_DENIED:
                alert("User denied the request for Geolocation.");
                break;
            case error.POSITION_UNAVAILABLE:
                alert("Location information is unavailable.");
                break;
            case error.TIMEOUT:
                alert("The request to get user location timed out.");
                break;
            case error.UNKNOWN_ERROR:
                alert("An unknown error occurred.");
                break;
        }
        console.error('Error in getting location: ' + error.message);
    }, {
        enableHighAccuracy: true,  // Try to get high accuracy (GPS)
        maximumAge: 10000,             // Don't use cached location
        timeout: 30000             // Wait up to 20 seconds for a location
    });
} else {
    alert("Geolocation is not supported by this browser.");
}

// Listen for real-time location updates from other clients
socket.on('location_update', function(data) {
    console.log("Location update from another client:", data);
    // If you want to display other clients' locations, you can update their markers here
});
