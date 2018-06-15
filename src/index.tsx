// CUSTOM JS Google Maps ----------------------------------------------------*/
declare var manywho: any;
declare var google: any;

import * as React from 'react';
import './index.css';

class googleMaps extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = {
            zoom: 12,
            maptype: 'roadmap', // terrain // roadmap  //hybrid
            heading: 90,
            tilt: 75,
            place_formatted: '',
            place_id: '',
            place_location: '',
            rotateControl: true,
            lat: 1.2966,
            long: 103.7764,
            markers: []
        }
    }
    componentDidMount () {
        // Get the component's model, which includes any values bound to it
        const model = manywho.model.getComponent(this.props.id, this.props.flowKey);
        const columns = manywho.component.getDisplayColumns(model.columns);

        // Create the map in an element on the page
        let map = new google.maps.Map(document.getElementById('map-canvas'), {
            center: { lat: this.state.lat, lng: this.state.long },
            zoom: this.state.zoom,
            mapTypeId: this.state.maptype,
            heading: this.state.heading,
            styles:[{
                featureType:"poi",
                elementType:"labels",
            }],
            tilt: this.state.tilt,
        });

        // Loop through all the data in the value this component is bound to
        model.objectData.forEach(result => {
            // Assume the latitude is the 1st "display column" set in the page component
            const latitude = result.properties.find(property => property.typeElementPropertyId === columns[0].typeElementPropertyId);

            // Assume the longitude is the 2nd "display column" set in the page component
            const longitude = result.properties.find(property => property.typeElementPropertyId === columns[1].typeElementPropertyId);

            // Assume the name is the 3rd "display column" set in the page component
            const name = result.properties.find(property => property.typeElementPropertyId === columns[2].typeElementPropertyId);

            // Assume the available spots is the 4th "display column" set in the page component
            const avail = result.properties.find(property => property.typeElementPropertyId === columns[3].typeElementPropertyId);

            // Assume the total spots is the 5th "display column" set in the page component
            const capacity = result.properties.find(property => property.typeElementPropertyId === columns[4].typeElementPropertyId);

            //CC Info Window
            var contentString = '<div id="content">'+
              '<div id="siteNotice">'+
              '</div>'+
              '<h5>Carpark:  ' + name.contentValue +'</h5>'+
              '<hr />'+
              '<p>Available Spots/Total:</p>'+
              avail.contentValue + '/' + capacity.contentValue+
              '<hr />'+
              '<a target="blank" href="https://www.google.com/maps/dir/?api=1&origin=1.2966,103.776&destination=' + latitude.contentValue + ',' + longitude.contentValue + '">'+
              'Click for Directions</a> '+
              '<hr />' +
              '<p>Lat/Long:</p>' + latitude.contentValue + '/' + longitude.contentValue+
              '</div>'+
              '</div>';

            var infowindow = new google.maps.InfoWindow({
                content: contentString,
              });

            //CC Boomi atom logos, goes with icon in marker var defintion
            var image = 'https://files-manywho-com.s3.amazonaws.com/97d13c5b-c52a-4f69-a8d7-eee246bbacee/atom.png';

            // Add the list object as a marker on the map
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(latitude.contentValue, longitude.contentValue),
                map: map,
                animation: google.maps.Animation.DROP,
                title: name.contentValue
                //icon: image  //Uncomment to make your markers boomi logo
            });

            // Zoom to 9 when clicking on marker
            google.maps.event.addListener(marker,'click',function() {
              map.setZoom(14);
              infowindow.open(map, marker);
              });

        });

    }
    render() {
        return (
            <div className="custom-component flex-container">
                <div id="map-canvas"></div>
                <div className="content-wrapper">
                    <div id='autocomplete-input'>
                        {/* <input id="ac-input" type='text' placeholder='Enter a location' /> */}
                    </div>
                </div>
            </div>
        );
    }
}

manywho.component.register('google-map', googleMaps);
export default googleMaps;
