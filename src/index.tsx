// CUSTOM JS Google Maps ----------------------------------------------------*/
declare var manywho: any;
declare var google: any;

import * as React from 'react';
import './index.css';

/* TODO 
    - code clean up
    - seperate properties, states
    - seperate component
    - adding dynamic longitude latidue 
*/


let marker, map, location, place, infowindow;

class googleMaps extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = {
            zoom: 14,
            maptype: 'roadmap', // terrain // roadmap
            heading: 90,
            tilt: 75,
            place_formatted: '',
            place_id: '',
            place_location: '',
            rotateControl: true,
            lat: 1.34,
            long: 103.54,
            markers: []
        }
    }    
    componentDidMount () { 
        // loading external json 
        fetch('https://files-manywho-com.s3.amazonaws.com/f0328913-385d-4f9a-94c2-d06f32e27e10/parking.json')
            .then(response => response.json())
            .then(results => { 
            // looping external json displaying markers for longitude latiude. 
            this.setState({markers: results.data});
                console.log("data set", results); 
                results.map((result, i) => {
                    marker = new google.maps.Marker({
                        position: new google.maps.LatLng(result.latitude, result.longitude),
                        map: map,
                        title: result.name
                    });
                    console.log("data set", result.data); 
                });
            });
    
        let map = new google.maps.Map(document.getElementById('map-canvas'), {
            center: { lat: this.state.lat, lng: this.state.long },
            zoom: this.state.zoom,
            mapTypeId: this.state.maptype,
            heading: this.state.heading,
            tilt: this.state.tilt,
        });

        marker = new google.maps.Marker({
            position: new google.maps.LatLng(1.34, 103.54),
            map: map,
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
    render() {
        return (
            <div className="custom-component flex-container">
                <div id="map-canvas"></div>    
                <div className="content-wrapper">
                    <div id='autocomplete-input'>
                        <input id="ac-input" type='text' placeholder='Enter a location' />
                    </div>
                </div>
            </div>
        );
    }
}

manywho.component.register('custom-component', googleMaps);
export default googleMaps;
