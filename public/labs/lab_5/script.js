/* eslint-disable max-len */
var mymap = L.map('mapid').setView([51.505, -0.09], 13);

const cities = [];

fetch('/api', {
  method: 'get'
})
  .then(blob => blob.json())
  .then(data => cities.push(...data));

function findMatches(wordToMatch, cities) {
    return cities.filter(place => {
      // here we need to figure out if the city or state matches what was searched
      const regex = new RegExp(wordToMatch, 'gi');
      // Can find results filtered from zip
      return  place.zip.match(regex)
    });
}

function mapInit() {
  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw'
  }).addTo(mymap);

  return mymap;
}


async function dataHandler(mapObjectFromFunction) {
  // use your assignment 1 data handling code here
  // and target mapObjectFromFunction to attach markers
  const form = document.querySelector('#myform');
  form.addEventListener('submit',async (event) => {
    event.preventDefault();

   let matchArray = findMatches(this.value, cities);
   matchArray = matchArray.slice(0,5);

   const html = matchArray.map(place => {
     const regex = new RegExp(this.value, 'gi');
     const cityName = place.city.replace(regex, `<span class="hl">${this.value}</span>`);
     const stateName = place.state.replace(regex, `<span class="hl">${this.value}</span>`);
     const restaurantName = place.name.replace(regex, `<span class="hl">${this.value}</span>`);
     const restaurantType = place.category.replace(regex, `<span class="hl">${this.value}</span>`);
     const address = place.address_line_1.replace(regex, `<span class="hl">${this.value}</span>`);
     const zipcode = place.zip.replace(regex, `<span class="hl">${this.value}</span>`);
     const coordinates = place.geocoded_column_1.coordinates;
     const marker = L.marker([coordinates[1], coordinates[0]]).addTo(mymap);
     mymap.panTo([coordinates[1],coordinates[0]], 0);


     //Formats selected info
     return `
     <li>
        <span class ="restaurant"><b>${restaurantName}</b></span><br>
        <span class = "address">${address}</span><br>
      </li>

     `;
   }).join('');
   suggestions.innerHTML = html;
  });
}

async function windowActions() {
  const map = mapInit();
  await dataHandler(map);
}

window.onload = windowActions;


const searchInput = document.querySelector('.input');
const suggestions = document.querySelector('.suggestions');

searchInput.addEventListener('change', dataHandler);
searchInput.addEventListener('keyup', dataHandler);