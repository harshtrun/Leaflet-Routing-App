// Harsh Singh app.js version 3.0
window.onload = () => {
  console.log("Prodapt - Home");
  var map,
    distances = {};
  const osmMapUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

  // Grayscale OSM
  var osm_Grayscale = L.tileLayer.grayscale(osmMapUrl);
  // Normal OSM
  var osmNormal = L.tileLayer(osmMapUrl);
  var osm = osmNormal;
  map = L.map("map", {
    layers: osm,
    center: [38.9776, -76.167207],
    zoom: 4,
  });

  // var isHeatMap = false;

  // Source Locations Dropdown
  let dropdown = $("#locations_dropdown");
  resetSourceLocations = () => {
    dropdown.empty();
    dropdown.append(
      '<option selected="true" disabled>Source Location</option>'
    );
    dropdown.prop("selectedIndex", 0);
    $.each(source_locations, function (key, entry) {
      dropdown.append($("<option></option>").text(entry.location));
    });
  };
  resetSourceLocations();
  
  var partnum, vendor;
  var source_lat;
  var source_long;
  var source_location;
  // Array declared for heat map
  var res = [];

  // Partnumber Dropdown

  let dropdown1 = $("#partnumberList");

  resetPartNumbers = () => {
    dropdown1.empty();
    dropdown1.append('<option selected="true" disabled>Part Number</option>');
    dropdown1.prop("selectedIndex", 0);
    var array_pno = [];
    // Unique Partnumbers
    sample_data.forEach((element) => {
      if (!array_pno.includes(element.attributes.PARTNUMBER)) {
        array_pno.push(element.attributes.PARTNUMBER);

        dropdown1.append(
          $("<option></option>").text(element.attributes.PARTNUMBER)
        );
      }
    });
  };
  resetPartNumbers();

  // Vendors List Dropdown
  let dropdown2 = $("#vendors_dropdown");
  resetVendors = () => {
    dropdown2.empty();
    dropdown2.append('<option selected="true" disabled>Vendor</option>');
    dropdown2.prop("selectedIndex", 0);
  };
  resetVendors();
  // Fill Vendors Dropdown

  fillVendors = () => {
    var choice = document.getElementById("partnumberList").value;
    console.log("You selected: " + choice);
    dropdown2.empty();
    var array_vendors = [];
    sample_data.forEach((element) => {
      if (
        element.attributes.PARTNUMBER == choice &&
        !array_vendors.includes(element.attributes.VENDOR)
      ) {
        array_vendors.push(element.attributes.VENDOR);
        // console.log(element.attributes.VENDOR)
        dropdown2.append(
          $("<option></option>").text(element.attributes.VENDOR)
        );
      }
    });
  };

  // Get selected Partnumber + Vendor

  getParams = () => {
    try {
      partnum = document.getElementById("partnumberList").value;
      vendor = document.getElementById("vendors_dropdown").value;
      if (partnum === "Part Number" || vendor === "Vendor") {
        throw "Please select Source Location and Part Number !";
      }
      // console.log(partnum, vendor);
      plotPoints(partnum, vendor);
      isHeatMap = false;
    } catch (error) {
      alert(error);
    }
  };

  // Reset Map

  resetMap = () => {
    map.remove();
    map = L.map("map", {
      layers: osm,
      center: [38.9776, -76.167207],
      zoom: 4,
    });
  };

  resetAll = () => {
    resetSourceLocations();
    resetPartNumbers();
    resetVendors();
    resetMap();
  };

  // Get Source Location
  getSourceLoc = () => {
    var choice = document.getElementById("locations_dropdown").value;

    source_locations.forEach((element) => {
      if (element.location == choice) {
        {
          source_lat = element.geocoded_lat;
          source_long = element.geocoded_long;
          source_location = element.location;
        }
      }
    });
  };

  // Get Color based on count
  getColor = (count) => {
    if (count >= 10) return "green";
    else if (count >= 9) return "lightgreen";
    else if (count >= 6) return "yellow";
    else if (count >= 3) return "orange";
    else return "red";
  };
  // Get Size based on count
  getSize = (count) => {
    if (count >= 10) return 30;
    else if (count >= 9) return 25;
    else if (count >= 6) return 20;
    else if (count >= 3) return 15;
    else return 10;
  };

  // Plot on map

  plotMapData = (latitude, longitude, popupVal, count) => {
    
    let dirUrl =
      "https://www.google.com/maps/dir/?api=1&destination=" +
      latitude +
      "," +
      longitude +
      "&origin=" +
      source_lat +
      "," +
      source_long +
      "&navigate=yes";

    
    let latLng = L.latLng(latitude, longitude);

    var marker = L.circleMarker(latLng, {
      radius: 10,
      color: "black",
      weight: 1,
      fillColor: getColor(count),
      fill: true,
      fillOpacity: 1,
    })
      .bindPopup(
        "<b>Address:</b> " +
          popupVal +
          "<br><a href=" +
          dirUrl +
          ' target="_blank">Directions </a>'
      )
      .addTo(map);

    marker.on("mouseover", function (e) {
      this.openPopup();
    });
  };

  // HeatMap Plot
  plotHeatmapData = (latitude, longitude, popupVal, count) => {
    var color = getColor(count);
    var spareSize = getSize(count);

    var latlngw = L.latLng(latitude, longitude);
    var marker = L.circleMarker(latlngw, {
      radius: spareSize,
      color: "black",
      weight: 0.8,
      fillColor: color,
      fill: true,
      fillOpacity: 0.8,
    });
    let dirUrl =
    "https://www.google.com/maps/dir/?api=1&destination=" +
    latitude +
    "," +
    longitude +
    "&origin=" +
    source_lat +
    "," +
    source_long +
    "&navigate=yes";
    marker.bindPopup(
      "<b>Address:</b> " +
        popupVal +
        "<br><a href=" +
        dirUrl +
        ' target="_blank">Directions </a>'
    )
    .addTo(map);

    marker.on("mouseover", function (e) {
      this.openPopup();
    });
    marker.on("mouseout", function (e) {
      this.closePopup();
    });
  };

  // Plot Source Location

  plotSourceLocation = () => {
    getSourceLoc();

    // Custom red icon src_location
    custom_icon = L.icon({
      iconUrl: "assets/img/blue.png",
      shadowUrl: "assets/img/shadow.png",
      iconSize: [20, 32],
      iconAnchor: [10, 30],
      popupAnchor: [1, -34],
      shadowSize: [31, 31],
    });

    marker = new L.marker([source_lat, source_long], {
      icon: custom_icon,
    })
      .bindPopup(source_location)
      .addTo(map);
    marker.on("mouseover", function (e) {
      this.openPopup();
    });
    marker.on("mouseout", function (e) {
      this.closePopup();
    });
  };

  // Plot on Search button click

  plotPoints = (partnum, vendor) => {
    resetMap();
    plotSourceLocation();

    var ind = 0;
    distances = {};
    res = [];
    sample_data.forEach((element) => {
      if (
        element.attributes.PARTNUMBER == partnum &&
        element.attributes.VENDOR == vendor
      ) {
        var lat = element.attributes.SPARE_GEOCODED_LAT;
        var long = element.attributes.SPARE_GEOCODED_LONG;
        distances[ind] = distance(source_lat, source_long, lat, long);
        var address = element.attributes.SPARE_GEOCODED_ADDRESS;

        var count = 0;
        sample_data.forEach((f) => {
          if (f.attributes.SPARE_GEOCODED_ADDRESS == address) {
            count += 1;
          }
        });

        dict = { lat: lat, lng: long, count: count };
        res.push(dict);

        // if (!isHeatMap) {
        //   plotMapData(
        //     lat,
        //     long,
        //     element.attributes.SPARE_GEOCODED_ADDRESS,
        //     count
        //   );
        // }

        // if (isHeatMap) {
          plotHeatmapData(
            lat,
            long,
            element.attributes.SPARE_GEOCODED_ADDRESS,
            count
          );
        // }
      }
      ind += 1;
    });
    plotHeatmapLegend();
    // console.log(distances);
  };

  configurePopup = (latLngVal, note, dist, dirUrl) => {
    var popup = L.popup()
      .setLatLng(latLngVal)
      .setContent(
        "<b>Address:</b>" +
          note +
          "<br>" +
          "Distance : " +
          dist +
          " km" +
          "<br><a href=" +
          dirUrl +
          ' target="_blank">Directions </a>'
      );
    return popup;
  };

  getColorByDistance = (distance) => {
    if (distance > 240) return "red";
    else if (distance > 180) return "orange";
    else if (distance > 120) return "yellow";
    else if (distance > 60) return "lightgreen";
    else return "green";
  };

  plotRoutesLegend = () => {
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function (map) {
      var div = L.DomUtil.create("div", "info legend");
      div.innerHTML += "<b>Code&nbsp;&nbsp;Distance <b><br>";
      div.innerHTML +=
        '<i style="background:' +
        getColor(10) +
        '"></i> ' +
        " Less than 60 km " +
        "<br>";
      div.innerHTML +=
        '<i style="background:' +
        getColor(9) +
        '"></i> ' +
        " 61 to 120 km  " +
        "<br>";
      div.innerHTML +=
        '<i style="background:' +
        getColor(8) +
        '"></i> ' +
        "121 to 180 km " +
        "<br>";
      div.innerHTML +=
        '<i style="background:' +
        getColor(4) +
        '"></i> ' +
        "181 to 240 km" +
        "<br>";
      div.innerHTML +=
        '<i style="background:' +
        getColor(2) +
        '"></i> ' +
        " More than 240 km " +
        "<br>";
      div.innerHTML +=
        '<img src = "assets\\img\\blue.png" width="18px">' +
        "&nbsp;&nbsp;Source Location" +
        "<br>";
      return div;
    };

    legend.addTo(map);
  };

  // Route Neares 5 locations
  plotNearestLocations = () => {
    // alert("Route functionality is still on it's way!")
    try {
      var nearest_loc = Object.keys(distances).map(function (key) {
        return [key, distances[key]];
      });
      nearest_loc.sort(function (first, second) {
        return first[1] - second[1];
      });
      

      nearest_loc = nearest_loc.slice(0, 5);
      nearest_loc.reverse();
      console.log(nearest_loc)

      resetMap();

      var isClosest = 1;

      nearest_loc.forEach((element) => {
        var ind = element[0];
        let lat = sample_data[ind].attributes.SPARE_GEOCODED_LAT;
        let long = sample_data[ind].attributes.SPARE_GEOCODED_LONG;
        let note = sample_data[ind].attributes.SPARE_GEOCODED_ADDRESS;
        var TheRightColor = "gray";
        //L R M
        if (isClosest === 5) {
          TheRightColor = "blue";
        }
        var routeControl = L.Routing.control({
          waypoints: [L.latLng(source_lat, source_long), L.latLng(lat, long)],
          lineOptions: {
            styles: [{ color: TheRightColor, opacity: 1, weight: 3 }],
          },
          fitSelectedRoutes: false,
          createMarker: function () {
            return null;
          },
        }).addTo(map);

        isClosest += 1;

        routeControl.on("routesfound", function (e) {
          var routes = e.routes;
          // alert distance and time in km and minutes
          // alert("Total distance is " + summ.totalDistance / 1000 + " km ");
          // var latlngw = L.latLng(lat, long);

          let dirUrl =
            "https://www.google.com/maps/dir/?api=1&destination=" +
            lat +
            "," +
            long +
            "&origin=" +
            source_lat +
            "," +
            source_long +
            "&navigate=yes";
          let dist = (routes[0].summary.totalDistance / 1000).toFixed(2);
          let latLng = L.latLng(lat, long);
          let popupData = configurePopup(latLng, note, dist, dirUrl);
          // marker = new L.marker([lat, long]).bindPopup(popupData).addTo(map);

          var marker = L.circleMarker(latLng, {
            radius: 10,
            color: "black",
            weight: 1,
            fillColor: getColorByDistance(dist),
            fill: true,
            fillOpacity: 1,
          });
          marker.bindPopup(popupData).addTo(map);
          plotSourceLocation();
        });
      });
      if (
        partnum != "Part Number" &&
        vendor != "Vendor" &&
        partnum != null &&
        vendor != null
      ) {
        plotRoutesLegend();
      } else throw "Please select Source Location and Part Number !";
    } catch (error) {
      alert(error);
    }
  };

  // To find distance between locations

  distance = (lat1, lon1, lat2, lon2) => {
    var p = 0.017453292519943295; // Math.PI / 180
    var c = Math.cos;
    var a =
      0.5 -
      c((lat2 - lat1) * p) / 2 +
      (c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p))) / 2;

    return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
  };

  // HeatMap Legend

  plotHeatmapLegend = () => {
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function (map) {
      var div = L.DomUtil.create("div", "info legend");
      div.innerHTML += "<b>Code&nbsp;&nbsp;Spare Count <b><br>";
      div.innerHTML +=
        '<i style="background:' +
        getColor(10) +
        '"></i> ' +
        " 10+ Spares " +
        "<br>";
      div.innerHTML +=
        '<i style="background:' +
        getColor(9) +
        '"></i> ' +
        " 9 to 10 Spares " +
        "<br>";
      div.innerHTML +=
        '<i style="background:' +
        getColor(8) +
        '"></i> ' +
        " 6 to 8 Spares " +
        "<br>";
      div.innerHTML +=
        '<i style="background:' +
        getColor(4) +
        '"></i> ' +
        " 3 to 5 Spares " +
        "<br>";
      div.innerHTML +=
        '<i style="background:' +
        getColor(2) +
        '"></i> ' +
        " Less than 3 Spares" +
        "<br>";
      div.innerHTML +=
        '<img src = "assets\\img\\blue.png" width="18px">' +
        "&nbsp;&nbsp;Source Location" +
        "<br>";
      return div;
    };

    legend.addTo(map);
  };
  // Heat Map

  heatMap = () => {
    isHeatMap = true;
    getParams();
    // Legend

    // if (Object.keys(distances).length === 0) {
    //   alert("Please select locations to get Heatmap !!");
    //   return;
    // }
    // Commented Heatmap Colorizartion - Remove Scope to work ok.
    {
      // var testData = {
      //   max: 8,
      //   data: res,
      // };
      // var cfg = {
      //   // radius should be small ONLY if scaleRadius is true (or small radius is intended)
      //   radius: 2,
      //   maxOpacity: 0.8,
      //   // scales the radius based on map zoom
      //   scaleRadius: true,
      //   // if set to false the heatmap uses the global maximum for colorization
      //   // if activated: uses the data maximum within the current map boundaries
      //   //   (there will always be a red spot with useLocalExtremas true)
      //   useLocalExtrema: true,
      //   // which field name in your data represents the latitude - default "lat"
      //   latField: "lat",
      //   // which field name in your data represents the longitude - default "lng"
      //   lngField: "lng",
      //   // which field name in your data represents the data value - default "value"
      //   valueField: "count",
      // };
      // var heatmapLayer = new HeatmapOverlay(cfg);
      // var layerGroup = L.layerGroup([osm, heatmapLayer]);
      // layerGroup.addTo(map);
      // heatmapLayer.setData(testData);
      // layer = heatmapLayer;
      // Legend
    }
  };

  // Logout
  logout = () => {
    window.location.href = "http://127.0.0.1:5500/web%20app/login.html";
  };
};
