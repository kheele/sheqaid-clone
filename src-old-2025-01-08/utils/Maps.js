import {execWhen} from './Utils';

function getLocation() {
    return new Promise((resolve, reject) => {
        execWhen(() => !!window.google).then(() => {
            navigator.geolocation.getCurrentPosition(({coords: {latitude, longitude, accuracy}}) => {
                resolve({latitude, longitude, accuracy});
            }, err => {
                console.error(`ERROR(${err.code}): ${err.message}`);
                reject(err);
            }, {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            });
        });
    });
}

function getGeocode() {
    return new Promise((resolve, reject) => {
        execWhen(() => !!window.google && !!google.maps).then(() => {
            navigator.geolocation.getCurrentPosition(({coords: {latitude, longitude, accuracy}}) => {
                const location = new google.maps.LatLng(latitude, longitude);
                const geocoder = new google.maps.Geocoder();
                geocoder.geocode({'latLng': location}, function (results, status) {
                    if (status === google.maps.GeocoderStatus.OK) {
//                        console.log(results);
                        if (results[1]) {
                            let indice = 0;
                            for (var j = 0; j < results.length; j++) {
                                if (results[j].types[0] === 'locality') {
                                    indice = j;
                                    break;
                                }
                            }

                            let city, district, region, country;
                            let {address_components} = results[indice];
                            for (var i = 0; i < address_components.length; i++) {
                                const address_component = address_components[i];
                                if (address_component.types[0] === "locality") {
                                    //this is the object you are looking for City
                                    city = address_component;
                                }
                                if (address_component.types[0] === "administrative_area_level_1") {
                                    //this is the object you are looking for State
                                    region = address_component;
                                }
                                if (address_component.types[0] === "country") {
                                    //this is the object you are looking for
                                    country = address_component;
                                }
                            }

                            if (results[6]) {
                                address_components = results[6].address_components;
                                for (var i = 0; i < address_components.length; i++) {
                                    const address_component = address_components[i];
                                    if (address_component.types[0] === "administrative_area_level_3") {
                                        //this is the object you are looking for State
                                        district = address_component;
                                    }
                                    if (!district) {
                                        if (address_component.types[0] === "administrative_area_level_2") {
                                            //this is the object you are looking for State
                                            district = address_component;
                                        }
                                    }
                                }
                            }

                            const res = {};
                            if(city) {
                                res.city = city.long_name;
                            }
                            if(region) {
                                res.region = region.long_name;
                            }
                            if(country) {
                                res.country = country.short_name;
                            }
                            if (district && district.long_name) {
                                res.district = district.long_name.replace(" Metropolitan Municipality", "");
                            }
                            console.log('getGeocode', res)
                            resolve(res);
                        } else {
                            reject(new Error("No results found"));
                        }
                    } else {
                        reject(new Error(status));
                    }
                });
            }, err => {
                console.error(`ERROR(${err.code}): ${err.message}`);
                reject(err);
            }, {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            });
        });
    });
}

function getNearbySearch(elem) {
    return new Promise((resolve, reject) => {
        execWhen(() => !!window.google).then(() => {
            navigator.geolocation.getCurrentPosition(({coords: {latitude, longitude, accuracy}}) => {
                const location = new google.maps.LatLng(latitude, longitude);
                const map = new google.maps.Map(elem, {
                    center: location,
                    zoom: 14
                });

                const request = {
                    location,
                    radius: 10000,//meters
                    types: ['hospital', 'health', 'doctor', 'dentist', 'fire_station', 'bank', 'atm'] // this is where you set the map to get the hospitals and health related places
                };
                const service = new google.maps.places.PlacesService(map);
                service.nearbySearch(request, function (results, status) {
                    resolve({map, results, status});
                });
            }, err => {
                console.error(`ERROR(${err.code}): ${err.message}`);
            }, {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            });
        });
    });
}

export {getLocation, getGeocode, getNearbySearch};
