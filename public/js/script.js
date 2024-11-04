const socket = io();

if(navigator.geolocation){
    navigator.geolocation.watchPosition(
        (position) => {
            const {latitude, longitude} = position.coords; //These are the coodinates of the position
            socket.emit("send-location", { latitude, longitude }); // Coordinates are sended to backend
        }, (error) => {
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    console.log("User denied the request for Geolocation.");
                    break;
                case error.POSITION_UNAVAILABLE:
                    console.log("Location information is unavailable.");
                    break;
                case error.TIMEOUT:
                    console.log("The request to get user location timed out.");
                    break;
                case error.UNKNOWN_ERROR:
                    console.log("An unknown error occurred.");
                    break;
            }
        },
        { // These are the settings
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0, //Caching is 0 which means its a real time data
        }
    );
}

const map =  L.map("map").setView([0, 0]/*this will be the center[0,0]*/, 16/*this is the zoom*/);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap'
}).addTo(map)

const markers = {};

socket.on("receive-location", (data) => {
    const {id, latitude, longitude} = data;
    map.setView([latitude, longitude]);
    if(markers[id]) {
        markers[id].setLatLng([latitude, longitude]);
    }
    else{
        markers[id] = L.marker([latitude, longitude]).addTo(map)
    }
});

socket.on("user-disconnected", (id) => {
    if(markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});