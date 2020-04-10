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
  searchStores();
}

function searchStores() {
  let foundStores = [];
  const zipCode = document.getElementById('zip-code-input').value;

  if (zipCode) {
    stores.forEach(store => {
      const postal = store.address.postalCode.substring(0, 5);
      if (postal == zipCode) foundStores.push(store);
    });
  } else {
    foundStores = stores;
  }

  clearLocations();
  displayStores(foundStores);
  showStoresMarkers(foundStores);
  setOnClickListener();
}

function clearLocations() {
  infoWindow.close();

  markers.forEach(marker => {
    marker.setMap(null);
  });

  markers.length = 0;
}

function displayStores(stores) {
  let storesHtml = '';

  stores.forEach((store, index) => {
    storesHtml =
      storesHtml +
      `
        <div class="store-container">
          <div class="store-container-background">
            <div class="store-info-container">
              <div class="store-address">
                <span>${store.addressLines.join(' ')}</span>
              </div>
              <div class="store-phone-number">${store.phoneNumber}</div>
            </div>
            <div class="store-number-container">
              <div class="store-number">${index + 1}</div>
            </div>
          </div>
        </div>
      `;
  });

  document.querySelector('.stores-list').innerHTML = storesHtml;
}

function showStoresMarkers(stores) {
  const bounds = new google.maps.LatLngBounds();

  stores.forEach((store, index) => {
    const latlng = new google.maps.LatLng(
      store.coordinates.latitude,
      store.coordinates.longitude
    );

    const name = store.name;
    const address = store.addressLines.join(' ');
    const openStatusText = store.openStatusText;
    const phoneNumber = store.phoneNumber;

    bounds.extend(latlng);
    createMarker(latlng, name, address, openStatusText, phoneNumber, index + 1);
  });

  map.fitBounds(bounds);
}

function createMarker(
  latlng,
  name,
  address,
  openStatusText,
  phoneNumber,
  index
) {
  const html = `
        <div class="store-info-window">
          <div class="store-info-name">
            ${name}
          </div>
          <div class="store-info-status">
            ${openStatusText}
          </div>
          <div class="store-info-address">
            <div class="circle">
              <i class="fas fa-location-arrow"></i>
            </div>
            ${address}
          </div>
          <div class="store-info-phone">
            <div class="circle">
              <i class="fas fa-phone-alt"></i>
            </div>
            ${phoneNumber}
          </div>
        </div>
      `;

  const marker = new google.maps.Marker({
    map: map,
    position: latlng,
    label: index.toString()
  });

  google.maps.event.addListener(marker, 'click', () => {
    infoWindow.setContent(html);
    infoWindow.open(map, marker);
  });

  markers.push(marker);
}

function setOnClickListener() {
  const storeElements = document.querySelectorAll('.store-container');

  storeElements.forEach((element, index) => {
    element.addEventListener('click', () => {
      new google.maps.event.trigger(markers[index], 'click');
    });
  });
}
