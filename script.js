// Default office location (latitude, longitude)
const officeLocation = { lat: 17.4484, lng: 78.3830 }; // Example: Adelaide, Australia

// Function to calculate distance between two locations using the Haversine formula
function calculateDistance(loc1, loc2) {
    const R = 6371000; // Radius of the Earth in meters
    const lat1 = loc1.lat * (Math.PI / 180);
    const lat2 = loc2.lat * (Math.PI / 180);
    const deltaLat = (loc2.lat - loc1.lat) * (Math.PI / 180);
    const deltaLng = (loc2.lng - loc1.lng) * (Math.PI / 180);

    const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
              Math.cos(lat1) * Math.cos(lat2) *
              Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
}

// Function to get the user's current location
function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            };

            const distance = calculateDistance(officeLocation, userLocation);
            checkDistance(distance, userLocation);
        }, (error) => {
            console.error("Geolocation error: " + error.message);
            document.getElementById("message").innerText = "Unable to retrieve location.";
        });
    } else {
        document.getElementById("message").innerText = "Geolocation is not supported by this browser.";
    }
}

// Function to check the distance and take action
function checkDistance(distance, userLocation) {
    if (distance > 500) {
        // Fetch address using reverse geocoding
        fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${userLocation.lat}&lon=${userLocation.lng}`)
            .then(response => response.json())
            .then(data => {
                const address = data.display_name || "Address not found";
                alert(`You are far away from the office location.\n\nYour current location:\nLatitude: ${userLocation.lat}\nLongitude: ${userLocation.lng}\nAddress: ${address}`);
            })
            .catch(error => {
                console.error("Error fetching address: ", error);
                alert(`You are far away from the office location.\n\nYour current location:\nLatitude: ${userLocation.lat}\nLongitude: ${userLocation.lng}\nAddress could not be retrieved.`);
            });
    } else {
        // Redirect to the PowerApps link
        window.location.href = "https://apps.powerapps.com/play/e/default-c09afb75-1cf8-46ca-9c5e-0a01bfbd86f2/a/da6abc26-4882-4681-89e0-709dba447700?tenantId=c09afb75-1cf8-46c2-96f9-3fbf3f1d5fc6&sourcetime=1729052168205&source=portal";
    }
}

// Execute the location check on page load
window.onload = getUserLocation;
