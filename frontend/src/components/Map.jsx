import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

function Map() {
    const mapContainerRef = useRef();
    const mapRef = useRef();
    const markerRef = useRef(null); // Store the current marker
    const [showSidebar, setShowSidebar] = useState(false);
    const [formData, setFormData] = useState({
        email: 'simo@pascu.test',
        firstName: 'simo',
        lastName: 'pascu',
        role: '1',  // Hidden field with default value 1
        title: '',
        body: '', // This will be used for the address
        category: '',
        latitude: '',
        longitude: '',
        dateTime: '', // New field for the date and time
    });
    const url = 'http://localhost:5176/reports/submit';

    // Initialize the map
    useEffect(() => {
        mapboxgl.accessToken = 'pk.eyJ1IjoibGVvY2Fycm96em8iLCJhIjoiY2x5dTI3cmNmMGEwdTJsc2x0dGZlMXBuciJ9.1Y5mX7oNoJxX80Ag9IuWHg'; // Replace with your access token
        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [12.4964, 41.9028], // Set to a default center
            zoom: 11.15,
        });

        mapRef.current.addControl(new mapboxgl.NavigationControl());

        // Map click event to place marker and open sidebar
        mapRef.current.on('click', async (e) => {
            const lngLat = e.lngLat;

            setShowSidebar(true);  // Show the sidebar
            setFormData((prev) => ({
                ...prev,
                latitude: lngLat.lat,
                longitude: lngLat.lng,
                dateTime: new Date().toLocaleString(), // Auto-fill date and time
            }));

            // Remove any existing marker
            if (markerRef.current) {
                markerRef.current.remove();
            }

            // Add a new marker at the clicked location
            markerRef.current = new mapboxgl.Marker()
                .setLngLat([lngLat.lng, lngLat.lat])
                .addTo(mapRef.current);

            // Reverse geocode to get the address
            try {
                const response = await fetch(
                    `https://api.mapbox.com/geocoding/v5/mapbox.places/${lngLat.lng},${lngLat.lat}.json?access_token=${mapboxgl.accessToken}`
                );
                const data = await response.json();
                const place = data.features[0]?.place_name || 'Unknown location';
                setFormData((prev) => ({
                    ...prev,
                    body: place // Set address in body
                }));
            } catch (error) {
                console.error('Error fetching address:', error);
                setFormData((prev) => ({
                    ...prev,
                    body: 'Failed to retrieve address' // Set fallback text in body
                }));
            }
        });

        return () => {
            // Cleanup on component unmount
            if (markerRef.current) {
                markerRef.current.remove();
            }
            mapRef.current.remove();
        };
    }, []);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission
        try {
            // Log the form data to ensure it's populated
            console.log({
                email: formData.email,
                firstName: formData.firstName,
                lastName: formData.lastName,
                role: formData.role,
                title: formData.title,
                body: formData.body, // Include the address in body
                category: formData.category,
                latitude: formData.latitude,
                longitude: formData.longitude,
                dateTime: formData.dateTime, // Include the date and time
            });

            // Make the API request
            const response = await fetch(url, {
                method: 'POST', // Ensure this is correct based on backend
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    role: formData.role,
                    title: formData.title,
                    body: formData.body, // Send address as body
                    category: formData.category,
                    latitude: formData.latitude,
                    longitude: formData.longitude
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();  // Get detailed error message from backend
                throw new Error(`Failed to submit report: ${response.status} - ${errorText}`);
            }

            alert('Report submitted successfully!');
            setFormData({
                email: '',
                firstName: '',
                lastName: '',
                role: '1',  // Reset role to default value 1
                title: '',
                body: '', // Reset body field
                category: '',
                latitude: '',
                longitude: '',
                dateTime: ''
            });

            setShowSidebar(false);  // Hide the sidebar
        } catch (error) {
            console.error('Error submitting report:', error);
            alert(`Failed to submit report: ${error.message}`);
        }
    };

    // Handle sidebar close action
    const closeSidebar = () => {
        if (markerRef.current) {
            markerRef.current.remove();
            markerRef.current = null;
        }
        setShowSidebar(false);
    };

    return (
        <div style={{ display: 'flex' }}>
            {/* Map container */}
            <div
                className="map-container"
                ref={mapContainerRef}
                style={{ height: '92vh', width: showSidebar ? '75%' : '100%' }}
            />

            {/* Sidebar form */}
            {showSidebar && (
                <div
                    style={{
                        width: '25%',
                        height: '100%',
                        backgroundColor: '#f0f0f0',
                        padding: '20px',
                        borderLeft: '1px solid #ddd',
                        position: 'relative',
                        zIndex: 1
                    }}
                >
                    <form onSubmit={handleSubmit}>
                        {/* Email Field */}
                        <div style={{ marginBottom: '10px' }}>
                            <label htmlFor="email">Email:</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                style={{ width: '100%', padding: '5px' }}
                            />
                        </div>

                        {/* First Name Field */}
                        <div style={{ marginBottom: '10px' }}>
                            <label htmlFor="firstName">First Name:</label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                required
                                style={{ width: '100%', padding: '5px' }}
                            />
                        </div>

                        {/* Last Name Field */}
                        <div style={{ marginBottom: '10px' }}>
                            <label htmlFor="lastName">Last Name:</label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                required
                                style={{ width: '100%', padding: '5px' }}
                            />
                        </div>

                        {/* Title Field */}
                        <div style={{ marginBottom: '10px' }}>
                            <label htmlFor="title">Title:</label>
                            <input
                                id="title"
                                name="title"
                                type='text'
                                value={formData.title}
                                onChange={handleInputChange}
                                required
                                style={{ width: '100%', padding: '5px' }}
                            />
                        </div>

                        {/* Category Field */}
                        <div style={{ marginBottom: '10px' }}>
                            <label htmlFor="category">Category:</label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                required
                                style={{ width: '100%', padding: '5px' }}
                            >
                                <option value="" disabled>Select a category</option>
                                <option value="Road Damage">Road Damage</option>
                                <option value="Pothole">Pothole</option>
                                <option value="Street Light Outage">Street Light Outage</option>
                                <option value="Flooding">Flooding</option>
                                <option value="Graffiti">Graffiti</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        {/* Address Field */}
                        <div style={{ marginBottom: '10px' }}>
                            <label htmlFor="body">Address:</label>
                            <input
                                type="text"
                                id="body"
                                name="body"
                                value={formData.body}
                                readOnly
                                style={{ width: '100%', padding: '5px' }}
                            />
                        </div>

                        {/* Latitude Field */}
                        <div style={{ marginBottom: '10px' }}>
                            <label htmlFor="latitude">Latitude:</label>
                            <input
                                type="text"
                                id="latitude"
                                name="latitude"
                                value={formData.latitude}
                                readOnly
                                style={{ width: '100%', padding: '5px' }}
                            />
                        </div>

                        {/* Longitude Field */}
                        <div style={{ marginBottom: '10px' }}>
                            <label htmlFor="longitude">Longitude:</label>
                            <input
                                type="text"
                                id="longitude"
                                name="longitude"
                                value={formData.longitude}
                                readOnly
                                style={{ width: '100%', padding: '5px' }}
                            />
                        </div>

                        {/* Date and Time Field */}
                        <div style={{ marginBottom: '10px' }}>
                            <label htmlFor="dateTime">Date and Time:</label>
                            <input
                                type="text"
                                id="dateTime"
                                name="dateTime"
                                value={formData.dateTime}
                                readOnly
                                style={{ width: '100%', padding: '5px' }}
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            style={{
                                padding: '10px 20px', // Add padding for better appearance
                                marginRight: '10px',
                                backgroundColor: '#007bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px', // Rounded corners
                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Subtle shadow
                                cursor: 'pointer',
                                fontSize: '16px', // Slightly larger font size
                                transition: 'background-color 0.3s, box-shadow 0.3s' // Smooth transition for hover effects
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0056b3'} // Darker blue on hover
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#007bff'} // Original blue color
                        >
                            Submit Report
                        </button>

                        {/* Close Button */}
                        <button
                            type="button"
                            onClick={closeSidebar}
                            style={{
                                padding: '10px 20px', // Add padding for better appearance
                                backgroundColor: '#f44336',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px', // Rounded corners
                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Subtle shadow
                                cursor: 'pointer',
                                fontSize: '16px', // Slightly larger font size
                                transition: 'background-color 0.3s, box-shadow 0.3s' // Smooth transition for hover effects
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#d32f2f'} // Darker red on hover
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f44336'} // Original red color
                        >
                            Close
                        </button>

                    </form>
                </div>
            )}
        </div>
    );
}

export default Map;
