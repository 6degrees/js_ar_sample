// Wait for the document to load before initializing the AR.js scene
document.addEventListener('DOMContentLoaded', function () {
    // Get the AR.js scene
    const scene = document.querySelector('a-scene');

    // Check for geolocation support
    if (navigator.geolocation) {
        // Request the user's location
        navigator.geolocation.getCurrentPosition(
            function (position) {
                // Get the user's latitude, longitude, and altitude
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                const altitude = position.coords.altitude;

                // Create the cube using three.js
                const cube = new THREE.Mesh(
                    new THREE.BoxGeometry(0.5, 0.5, 0.5),
                    new THREE.MeshBasicMaterial({ color: 0xFF6347 })
                );

                // Calculate the position of the cube two meters to the east and on the ground
                const userPosition = new THREE.Vector3(longitude, altitude, -latitude);
                const offsetDistance = 2; // Two meters to the east
                const offsetVector = new THREE.Vector3(offsetDistance, 0, 0);
                const cubePosition = userPosition.clone().add(offsetVector);
                cube.position.set(cubePosition.x, 0, cubePosition.z);

                // Add the cube to the scene
                scene.object3D.add(cube);
            },
            function (error) {
                console.error('Error getting user location:', error);
            }
        );
    } else {
        console.error('Geolocation is not supported in this browser.');
    }
});
