declare var manywho: any;

import * as React from 'react';
import './index.css';
import './script.js';

class CustomComponent extends React.Component<null, null> {
    render() {
        return <div className="custom-component">
            <div id='map-canvas'></div>
            <div className='main'>
                <h2>Directions</h2>
                <p>If you allowed the site access to your location, you should see it indicated above with a red arrow.</p>
                <p>You can drag the arrow around if you need to adjust the location.</p>
                <div id="latbox"></div>
                <div id="longbox"></div>
            </div>
        </div>
    }
}

manywho.component.register('custom-component', CustomComponent);

export default CustomComponent;
