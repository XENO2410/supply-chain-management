import React, { useEffect } from 'react';

function Map({ address, lat, lng }) {
  useEffect(() => {
    const map = new window.google.maps.Map(document.getElementById('map'), {
      center: { lat, lng },
      zoom: 15
    });

    new window.google.maps.Marker({
      position: { lat, lng },
      map: map,
      title: address
    });
  }, [lat, lng, address]);

  return <div id="map" style={{ height: '400px', width: '100%' }}></div>;
}

export default Map;
