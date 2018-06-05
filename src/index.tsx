// CUSTOM JS Google Maps ----------------------------------------------------*/
declare var manywho: any;
declare var google: any;

import * as React from 'react';
import './index.css';


let marker, map, location, place, infowindow;

class CustomComponent extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            zoom: 14,
            maptype: 'satellite',
            heading: 90,
            tilt: 75,
            place_formatted: '',
            place_id: '',
            place_location: '',
            rotateControl: true,
            // JSON example
            locations: [
                { info: "King of Prussia", latitude: 40.10128559999999, longitude: -75.38355250000001 },
                { info: "Malvern", latitude: 40.0362184, longitude:-75.51381179999998 },
                { info: "Phoenixville", latitude: 40.1303822, longitude:-75.51491279999999},
                { info: "Dell Boomi", latitude: 40.0706941, longitude: -75.466591},
                { info: "Starbucks in King of Prussia", latitude: 40.08250719999999, longitude: -75.40356209999999}, 
                { info: "Foresta's Country Meat Market, West Bridge Street, Phoenixville, PA, USA", latitude: 40.12293199999999, longitude: -75.53590000000003}
            ], 
        }

        this.getCurrentLocation = this.getCurrentLocation.bind(this);
    }
    componentDidMount () { 
        // generating the inital map on load
        map = new google.maps.Map(document.getElementById('map-canvas'), {
            center: { lat: 40.0706941, lng: -75.4665912 },
            zoom: this.state.zoom,
            mapTypeId: this.state.maptype,
            heading: this.state.heading,
            tilt: this.state.tilt,
        });
        // default

        this.state.locations.map((jsonLoc, i) => {
            marker = new google.maps.Marker({
                position: new google.maps.LatLng(jsonLoc.latitude, jsonLoc.longitude),
                map: map,
                content: jsonLoc.info
            });
        });
        // adding auto complete input field
        let inputNode = document.getElementById('ac-input');
        map.controls[google.maps.ControlPosition.TOP_CENTER].push(inputNode)
        let autoComplete = new google.maps.places.Autocomplete(inputNode);

        autoComplete.addListener('place_changed', () => {
            place = autoComplete.getPlace();
            location = place.geometry.location;

            this.setState({
                place_formatted: place.formatted_address,
                place_id: place.place_id,
                place_location: location.toString(),
            });

            // display selected place on map
            map.fitBounds(place.geometry.viewport);
            map.setCenter(location);

            marker.setPlace({
                placeId: place.place_id,
                location: location,
            });
        });
    }
        //Current location click event

    getCurrentLocation() {

        //If brower supports HTML5 geoLocation
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
               let lat = position.coords.latitude;
               let lng = position.coords.longitude;

                let currentLoc = new google.maps.LatLng(lat, lng);

                //Remove previously added marker
                if (marker) {
                    marker.setMap(null);
                }

               let popupContent = '<div id="content"><p class="heading">Your location is found..</p></div>'

                infowindow = new google.maps.InfoWindow({
                    content: popupContent
                });

                map.setCenter(currentLoc);//Set the map to center of location

                marker = new google.maps.Marker({
                    map: map,
                    zoom: 14,
                    position: currentLoc
                });

                infowindow.open(map, marker);
            });

        }
        else {
            alert('This Browser doesn\'t support HTML5 geolocation');
        }
    }
    
    render() {
        return ( 
            
            <div className="custom-component flex-container">
                
                <div id="map-canvas"></div>    
                <div className="content-wrapper">
                    
                    <h2>Google Maps Test</h2>
                    <div>
                        <button className="btn btn-primary"><span className="current-location-txt" onClick={this.getCurrentLocation}>Current Location</span></button>
                    </div>
                    <h4>Data:</h4>
                    <div>Map type: <span className="data-related">{this.state.maptype}</span></div>
                    <div>Place: <span className="data-related">{this.state.place_formatted}</span></div>
                    <div>Place ID: <span className="data-related">{this.state.place_id}</span></div>
                    <div>Location: <span className="data-related">{this.state.place_location}</span></div>
                    <sub>Generated by a placeholder JSON Array.</sub>
                    {this.state.locations.map((listlocation, i) =>
                        <ul className="locations">
                            <li>Location:
                                <ul>
                                    <li>Name / Info: {listlocation.info}</li>
                                    <li>latitude:  {listlocation.latitude}</li>
                                    <li>longitude: {listlocation.longitude}</li>
                                </ul>
                            </li>
                        </ul>
                    )}
        
                    <div id='autocomplete-input'>
                        <input id="ac-input" type='text' placeholder='Enter a location' />
                    </div>
                </div>
            </div>
            
        );
    }
}
manywho.component.register('custom-component', CustomComponent);
export default CustomComponent;
