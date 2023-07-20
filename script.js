document.addEventListener('DOMContentLoaded', function () {
    const scene = document.querySelector('a-scene');
    const overlayInfo = document.getElementById('overlay-info');

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                // Get user's latitude, longitude, and altitude
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                const altitude = position.coords.altitude;

                // Update user location in overlay
                document.getElementById('user-location').innerText = `User Location: Latitude ${latitude}, Longitude ${longitude}`;

                // Create and position the cube using three.js
                const cube = new THREE.Mesh(
                    new THREE.BoxGeometry(0.5, 0.5, 0.5),
                    new THREE.MeshBasicMaterial({ color: 0xFF6347 })
                );

                const userPosition = new THREE.Vector3(longitude, altitude, -latitude);
                const offsetDistance = 2;
                const offsetVector = new THREE.Vector3(offsetDistance, 0, 0);
                const cubePosition = userPosition.clone().add(offsetVector);
                cube.position.set(cubePosition.x, 0, cubePosition.z);

                scene.object3D.add(cube);

                // Update box location in overlay
                document.getElementById('box-location').innerText = `Box Location: Latitude ${latitude}, Longitude ${longitude} + ${offsetDistance} meters east`;

                // Calculate azimuth (bearing) angle between user's location and the cube
                const azimuth = calculateAzimuth(latitude, longitude, cubePosition.x, cubePosition.z);
                document.getElementById('azimuth-angle').innerText = `Azimuth Angle: ${azimuth?.toFixed(2)} degrees`;

                // Get device orientation (alpha value)
                window.addEventListener('deviceorientation', function (event) {
                    const alpha = event.alpha;
                    // Update device direction in overlay
                    document.getElementById('device-direction').innerText = `Device Direction: ${alpha?.toFixed(2)} degrees`;
                });
            },
            function (error) {
                console.error('Error getting user location:', error);
            }
        );
    } else {
        console.error('Geolocation is not supported in this browser.');
    }
});

// Function to calculate the azimuth angle between two coordinates
function calculateAzimuth(lat1, lon1, lat2, lon2) {
    const phi1 = (lat1 * Math.PI) / 180;
    const phi2 = (lat2 * Math.PI) / 180;
    const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

    const y = Math.sin(deltaLambda) * Math.cos(phi2);
    const x = Math.cos(phi1) * Math.sin(phi2) - Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLambda);
    let angle = Math.atan2(y, x);

    angle = (angle * 180) / Math.PI;
    angle = (angle + 360) % 360; // Normalize to positive angles
    return angle;
}