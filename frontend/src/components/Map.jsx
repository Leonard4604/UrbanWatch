import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

function Map() {
    const mapContainerRef = useRef();
    const mapRef = useRef();
    const markerRef = useRef(null); // Store the current marker
    const [showSidebar, setShowSidebar] = useState(false);
    const [formData, setFormData] = useState({
        role: '1',  // Hidden field with default value 1
        title: '',
        body: '', // This will be used for the address
        category: '',
        latitude: '',
        longitude: '',
        dateTime: '', // New field for the date and time
    });
    const [reports, setReports] = useState([]);
    const url = `http://${process.env.IP_ADDRESS}:5176/reports/submit`;
    const reportsUrl = `http://${process.env.IP_ADDRESS}:5176/reports`; // Adjust the URL as needed

    useEffect(() => {
        // Fetch reports from the backend on component mount
        const fetchReports = async () => {
            try {
                const response = await fetch(reportsUrl);
                const data = await response.json();
                setReports(data.reports);
            } catch (error) {
                console.error('Error fetching reports:', error);
            }
        };
        fetchReports();
    }, []);

    useEffect(() => {
        // Fetch user data based on JWT token
        const fetchUserData = async () => {
            const email = localStorage.getItem("email");
            if (email) {
                console.log(email);
                try {
                    const response = await fetch(`http://${process.env.IP_ADDRESS}:5175/users/get_by_email/${email}`);
                    const data = await response.json();
                    if (data.user) {
                        setFormData(prev => ({
                            ...prev,
                            email: data.user.email,
                            firstName: data.user.firstName,
                            lastName: data.user.lastName,
                        }));
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            } else {
                console.log("No email found!");
            }
        };
        fetchUserData();
    }, []);

    // Initialize the map and add existing report markers
    useEffect(() => {
        mapboxgl.accessToken = 'pk.eyJ1IjoibGVvY2Fycm96em8iLCJhIjoiY2x5dTI3cmNmMGEwdTJsc2x0dGZlMXBuciJ9.1Y5mX7oNoJxX80Ag9IuWHg'; // Replace with your access token
        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [12.4964, 41.9028], // Default center
            zoom: 11.15,
        });

        mapRef.current.addControl(new mapboxgl.NavigationControl());

        // Add markers for existing reports
        reports.forEach(report => {
            const marker = new mapboxgl.Marker()
                .setLngLat([report.longitude, report.latitude])
                .setPopup(new mapboxgl.Popup({ offset: 25 }).setText(report.title))
                .addTo(mapRef.current);

            marker.getElement().addEventListener('mouseenter', () => {
                marker.getPopup().addTo(mapRef.current);
            });

            marker.getElement().addEventListener('mouseleave', () => {
                marker.getPopup().remove();
            });
        });

        // Map click event to place marker and open sidebar
        mapRef.current.on('click', async (e) => {
            const lngLat = e.lngLat;

            const isExistingReport = reports.some(report =>
                report.latitude === lngLat.lat && report.longitude === lngLat.lng
            );

            if (!isExistingReport) {
                if (markerRef.current) {
                    markerRef.current.remove();
                }

                setShowSidebar(true);  // Show the sidebar
                setFormData(prev => ({
                    ...prev,
                    latitude: lngLat.lat,
                    longitude: lngLat.lng,
                    dateTime: new Date().toLocaleString(), // Auto-fill date and time
                }));

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
                    setFormData(prev => ({
                        ...prev,
                        body: place // Set address in body
                    }));
                } catch (error) {
                    console.error('Error fetching address:', error);
                    setFormData(prev => ({
                        ...prev,
                        body: 'Failed to retrieve address' // Set fallback text in body
                    }));
                }
            }
        });

        return () => {
            if (markerRef.current) {
                markerRef.current.remove();
            }
            mapRef.current.remove();
        };
    }, [reports]);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission
        try {
            const response = await fetch(url, {
                method: 'POST', // Ensure this is correct based on backend
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to submit report: ${response.status} - ${errorText}`);
            }

            alert('Report submitted successfully!');
            setFormData({
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
                        {/* Title Field */}
                        <div style={{ marginBottom: '10px' }}>
                            <label htmlFor="title">Title:</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                required
                                value={formData.title}
                                onChange={handleInputChange}
                                style={{ width: '100%', padding: '5px' }}
                            />
                        </div>

                        {/* Category Field */}
                        <div style={{ marginBottom: '10px' }}>
                            <label htmlFor="category">Category:</label>
                            <select
                                id="category"
                                name="category"
                                required
                                value={formData.category}
                                onChange={handleInputChange}
                                style={{ width: '100%', padding: '5px' }}
                            >
                                <option value="">Select a category</option>
                                <option value="Pothole">Pothole</option>
                                <option value="Road Damage">Road Damage</option>
                                <option value="Environment">Environment</option>
                                <option value="Street lights outage">Street lights outage</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        {/* Address Field (Body) */}
                        <div style={{ marginBottom: '10px' }}>
                            <label htmlFor="body">Address:</label>
                            <input
                                id="body"
                                name="body"
                                type='text'
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

                        {/* DateTime Field */}
                        <div style={{ marginBottom: '10px' }}>
                            <label htmlFor="dateTime">Date & Time:</label>
                            <input
                                type="text"
                                id="dateTime"
                                name="dateTime"
                                value={formData.dateTime}
                                readOnly
                                style={{ width: '100%', padding: '5px' }}
                            />
                        </div>

                        {/* Buttons */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}> {/* Adjust gap for spacing */}
                            <button
                                type="submit"
                                style={{
                                    backgroundColor: '#007bff',
                                    color: 'white',
                                    padding: '10px 16px', // Increase size
                                    border: 'none',
                                    cursor: 'pointer',
                                    borderRadius: '8px', // Rounded corners
                                    fontSize: '16px', // Make text a bit bigger
                                }}
                            >
                                Submit
                            </button>
                            <button
                                type="button"
                                onClick={closeSidebar}
                                style={{
                                    backgroundColor: '#dc3545', // Red for "Close"
                                    color: 'white',
                                    padding: '10px 16px', // Increase size
                                    border: 'none',
                                    cursor: 'pointer',
                                    borderRadius: '8px', // Rounded corners
                                    fontSize: '16px', // Make text a bit bigger
                                }}
                            >
                                Close
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

export default Map;
