import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

function Map() {
    const mapContainerRef = useRef();
    const mapRef = useRef();
    const markerRef = useRef(null); // Store the current marker
    const [showSidebar, setShowSidebar] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        firstName: 'simo',
        lastName: 'pascu',
        role: '1',  // Hidden field with default value 1
        title: '',
        body: 'buca',
        category: '',
        latitude: '',
        longitude: ''
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
        mapRef.current.on('click', (e) => {
            const lngLat = e.lngLat;

            setShowSidebar(true);  // Show the sidebar
            setFormData((prev) => ({
                ...prev,
                latitude: lngLat.lat,
                longitude: lngLat.lng
            }));

            // Remove any existing marker
            if (markerRef.current) {
                markerRef.current.remove();
            }

            // Add a new marker at the clicked location
            markerRef.current = new mapboxgl.Marker()
                .setLngLat([lngLat.lng, lngLat.lat])
                .addTo(mapRef.current);
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
                body: formData.body,
                category: formData.category,
                lat: formData.latitude,
                lon: formData.longitude
            });
    
            // Make the API request
            const response = await fetch(url, {
                method: 'POST', // Ensure this is correct based on backend
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
    
            // Check the response status and throw if not successful
            if (!response.ok) {
                const errorText = await response.text();  // Get detailed error message from backend
                throw new Error(`Failed to submit report: ${response.status} - ${errorText}`);
            }
    
            // Success - Show alert and reset form
            alert('Report submitted successfully!');
            setFormData({
                email: '',
                firstName: '',
                lastName: '',
                role: '1',  // Reset role to default value 1
                title: '',
                body: '',
                category: '',
                latitude: '',
                longitude: ''
            });
    
            setShowSidebar(false);  // Hide the sidebar
        } catch (error) {
            console.error('Error submitting report:', error);  // Log detailed error
            alert(`Failed to submit report: ${error.message}`);  // Show detailed alert
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
                    <h4>Report an Issue</h4>
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

                        {/* Role Field (Hidden) */}
                        <div style={{ display: 'none' }}>
                            <label htmlFor="role">Role:</label>
                            <input
                                type="number"
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        {/* Title Field (Select Menu) */}
                        <div style={{ marginBottom: '10px' }}>
                            <label htmlFor="title">Title:</label>
                            <select
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                required
                                style={{ width: '100%', padding: '5px' }}
                            >
                                <option value="" disabled>Select an issue</option>
                                <option value="Road Damage">Road Damage</option>
                                <option value="Pothole">Pothole</option>
                                <option value="Street Light Outage">Street Light Outage</option>
                                <option value="Flooding">Flooding</option>
                                <option value="Graffiti">Graffiti</option>
                            </select>
                        </div>

                        {/* Problem Description (Body) */}
                        <div style={{ marginBottom: '10px' }}>
                            <label htmlFor="body">Problem Description:</label>
                            <textarea
                                id="body"
                                name="body"
                                value={formData.body}
                                onChange={handleInputChange}
                                required
                                style={{ width: '100%', padding: '5px', height: '80px' }}
                            />
                        </div>

                        {/* Category Field (Select Menu) */}
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
                                <option value="Road">Road</option>
                                <option value="Sidewalk">Sidewalk</option>
                                <option value="Building">Building</option>
                                <option value="Park">Park</option>
                                <option value="Utility">Utility</option>
                            </select>
                        </div>

                        {/* Latitude and Longitude Fields (Read-only) */}
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

                        {/* Submit Button */}
                        <button
                            type="submit"
                            style={{
                                padding: '5px 10px',
                                backgroundColor: '#007FFF',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px'
                            }}
                        >
                            Report
                        </button>
                    </form>

                    {/* Close Sidebar Button */}
                    <button
                        onClick={closeSidebar}
                        style={{ position: 'absolute', top: '10px', right: '10px', cursor: 'pointer' }}
                    >
                        X
                    </button>
                </div>
            )}
        </div>
    );
}

export default Map;
