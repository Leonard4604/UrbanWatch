import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

function Map({ isOpen }) {
    const mapContainerRef = useRef();
    const mapRef = useRef();

    useEffect(() => {
        mapboxgl.accessToken = 'pk.eyJ1IjoibGVvY2Fycm96em8iLCJhIjoiY2x5dTI3cmNmMGEwdTJsc2x0dGZlMXBuciJ9.1Y5mX7oNoJxX80Ag9IuWHg';
        mapRef.current = new mapboxgl.Map({
          container: mapContainerRef.current,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [12.4964, 41.9028],
          zoom: 11.15,
          language: 'en'
        });

        mapRef.current.addControl(new mapboxgl.NavigationControl());
    
        mapRef.current.on('load', async () => {
            mapRef.current.resize();
            await fetch(`http://${process.env.IP_ADDRESS}:5176/reports/`).then(response => response.json()).then(data => {
              let features = [];
                data.reports.forEach(report => {
                features.push({
                  type: 'Feature',
                  properties: {
                    description:
                      `<strong>${report.title}</strong><p>${report.body}</p>`,
                    icon: report.category
                  },
                  geometry: {
                    type: 'Point',
                    coordinates: [report.longitude, report.latitude]
                  }
                });
              })
              return features;
            }).then((features) => {
              console.log(features)
              mapRef.current.addSource('places', {
                // This GeoJSON contains features that include an "icon"
                // property. The value of the "icon" property corresponds
                // to an image in the Mapbox Streets style's sprite.
                type: 'geojson',
                data: {
                  type: 'FeatureCollection',
                  features: features
                }
              });
        
              mapRef.current.addLayer({
                id: 'places',
                type: 'symbol',
                source: 'places',
                layout: {
                  'icon-image': ['get', 'icon'],
                  'icon-allow-overlap': true
                }
              });
        
              mapRef.current.on('click', 'places', (e) => {
                const coordinates = e.features[0].geometry.coordinates.slice();
                const description = e.features[0].properties.description;
        
                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                  coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                }
        
                new mapboxgl.Popup()
                  .setLngLat(coordinates)
                  .setHTML(description)
                  .addTo(mapRef.current);
              });
        
              mapRef.current.on('mouseenter', 'places', () => {
                mapRef.current.getCanvas().style.cursor = 'pointer';
              });
        
              mapRef.current.on('mouseleave', 'places', () => {
                mapRef.current.getCanvas().style.cursor = '';
              });
            })
        });
    
        return () => mapRef.current.remove();
      }, []);

      useEffect(() => {
        const mapContainer = mapContainerRef.current; // Ottieni il riferimento al contenitore della mappa
        let resizeObserver;

        if (mapContainer) {
            // Crea un nuovo ResizeObserver
            resizeObserver = new ResizeObserver(() => {
              if (mapRef.current) {
                mapRef.current.resize(); // Chiama il metodo resize sulla mappa Mapbox
              }
            });

            // Inizia ad osservare il contenitore della mappa
            resizeObserver.observe(mapContainer);
          }
          return () => {
            if (resizeObserver) {
              resizeObserver.disconnect(); // Smetti di osservare al momento della pulizia
            }
          };
    }, [isOpen]);
    
    return <div className="map-container" ref={mapContainerRef} style={{ height: '92vh', width: '100%'}} />;    
}

export default Map;