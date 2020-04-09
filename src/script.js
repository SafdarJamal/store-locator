window.onload = displayStores;

let map;
const markers = [];
let infoWindow;

function initMap() {
  const losAngeles = {
    lat: 34.06338,
    lng: -118.35808
  };

  map = new google.maps.Map(document.getElementById('map'), {
    center: losAngeles,
    zoom: 11,
    mapTypeId: 'roadmap'
  });

  infoWindow = new google.maps.InfoWindow();
  showStoresMarkers();
}

function displayStores() {
  let storesHtml = '';

  for (let [index, store] of stores.entries()) {
    const address = store.addressLines;
    const phone = store.phoneNumber;

    storesHtml =
      storesHtml +
      `
        <div class="store-container">
          <div class="store-info-container">
            <div class="store-address">
              <span>${address[0]}</span>
              <span>${address[1]}</span>
              <span>${address[2] ? address[2] : ''}</span>
            </div>
            <div class="store-phone-number">${phone}</div>
          </div>
          <div class="store-number-container">
            <div class="store-number">${index + 1}</div>
          </div>
        </div>
      `;
  }

  document.querySelector('.stores-list').innerHTML = storesHtml;
}

function showStoresMarkers() {
  const bounds = new google.maps.LatLngBounds();

  for (let [index, store] of stores.entries()) {
    const latlng = new google.maps.LatLng(
      store.coordinates.latitude,
      store.coordinates.longitude
    );

    const name = store.name;
    const address = store.addressLines[0];

    bounds.extend(latlng);
    createMarker(latlng, name, address, index + 1);
  }

  map.fitBounds(bounds);
}

function createMarker(latlng, name, address, index) {
  const html = `<b>${name}</b><br />${address}`;

  const marker = new google.maps.Marker({
    map: map,
    position: latlng,
    label: index.toString()
  });

  google.maps.event.addListener(marker, 'click', function () {
    infoWindow.setContent(html);
    infoWindow.open(map, marker);
  });

  markers.push(marker);
}
