function getClima() {
    $.ajax({
        url: "https://www.ncdc.noaa.gov/cdo-web/api/v2/datasets",
        //url: "https://www.ncdc.noaa.gov/cdo-web/api/v2/data?datasetid=GHCND&startdate=2010-05-01&enddate=2010-05-01",
        headers: { token: "tukeGYOTbzRFCEScMXqzfYiUkPoUhWIU" },
        success: function (resultData) {
            //here is your json.
            // process it
            console.log(resultData);
            var htmlText = '';
            let data = resultData.results;
            for (let key in data) {
                //getData(data[key].id);
                htmlText += '<div class="div-conatiner">';
                htmlText += '<p class="p-loc"> id: ' + data[key].id + '</p>';
                htmlText += '<p class="p-name"> Name: ' + data[key].name + '</p>';
                htmlText += '<p class="p-desc"> Data coverage: ' + data[key].datacoverage + '</p>';
                htmlText += '<p class="p-created"> Min date: ' + data[key].mindate + '</p>';
                htmlText += '<p class="p-uname"> Max date: ' + data[key].maxdate + '</p>';
                htmlText += '</div>';
            }
            getData('1');
            $('.container').append(htmlText);
        },
        error: function (jqXHR, textStatus, errorThrown) {
        },

        timeout: 120000,
    });
}
//Initializing the map
function initMap() {
    window.markers = [];
    var myLatLng = {lat:41.8708 , lng: -87.6505}; //Set the first coordinate
    //Set the map 
    window.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: myLatLng,
    });
    //Content for university marker 
    var contentString = '<div id="content">'+
                'Deparment of Electrical & Computer Engineering' + 
                '</div>'; 
    var infowindow = new google.maps.InfoWindow({content: contentString});
    var markerImage = new google.maps.MarkerImage
        (
            "images/University.png",
            new google.maps.Size(64, 64, "px", "px"),
            new google.maps.Point(0, 0),
            new google.maps.Point(0, 0),
            new google.maps.Size(64, 64, "px", "px")
        );
    //Set new marker
    var marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        icon: markerImage,
        title: 'Deparment of Electrical & Computer Engineering' 
    });
    //Add listener for university marker
    google.maps.event.addListener(marker, 'click', 
            function (infowindow, marker) {
                return function () {
                    infowindow.open(map, marker);
                };
            }(infowindow, marker)
        );
    marker.setMap(map);
}
//Principal function
function explore() {
    deleteMarkers();//Clear all markers on the map
    //Get all necessary variables from the form
    let container = document.getElementById("container");
    let sucess = document.getElementById("msj-sucess");
    let loading = document.getElementById("msj-loading");
    let safety = document.getElementById('safety');
    let strsafety = safety.options[safety.selectedIndex].value;
    let transport = document.getElementById('transport');
    let strtransport = transport.options[transport.selectedIndex].value;
    let distance = document.getElementById('distance');
    let strdistance = distance.options[distance.selectedIndex].value;
    let propertyType = document.getElementById('propertytype');
    let strpropertyType = propertyType.options[propertyType.selectedIndex].value;
    let bycicle = document.querySelector('input[name="bycicle"]:checked').value;
    let userform = document.getElementById('options');
    let titulo = "";
    //Making some messages visible
    userform.style.display = "none";
    sucess.style.display = "block";
    loading.style.display = "block";
    document.getElementById("searchButton").style.display = "block";
    sucess.innerHTML="<h4> Update ready </h4><p> Your consulting dates are: </p>";
    loading.innerHTML="<div class='info-home'>University: <img src='images/University.png' /></div> <div class='info-home'>Police: <img class='icon-home' src='images/Police.png' /></div> <div class='info-home'> Home: <img class='icon-home' src='images/home.png' /> </div> <div class='info-home'> Byke racks: <img class='icon-home' src='images/Byke.png' /> </div><div style='clear:both'></div>";    
    sucess.innerHTML+="<br><strong> Safety percent >: </strong>"+ strsafety +"<br><strong> Transport quality >: </strong>"+ strtransport +"<br><strong> Distance: </strong>"+ strdistance +"<br><strong> Property Type: </strong>"+ strpropertyType +"<br> <strong>Want alternative transport: </strong>"+ bycicle;
    container.style.height = '750px';
    //Calling functions
    getPolice(strdistance);//Get Police Stations
    getHouses(strdistance, strpropertyType);//Get Possible Houses
    if (bycicle == "Yes"){ //If want bike is selected, show bikes raks
        getBykes(strdistance);
    }
}
function searchAgain() { //Restoring everything as at first
    document.getElementById('options').style.display = "block";
    document.getElementById("msj-sucess").style.display = "none";
    document.getElementById("searchButton").style.display = "none";
    document.getElementById("stadistics").style.display = "none";
    document.getElementById("msj-loading").style.display = "none";
}
//Function to add marker to the map
function addMarker(location, contentString, valuearray = "", markertype) {
    var valueString = '<div id="content" class="barra-titulo">'+
                '<strong> Estimated valuation:</strong> <br><br>' +
                '</div>'; 
    var infowindow = new google.maps.InfoWindow({content: contentString});
    //Obtaining the type of marker, used to set the icon on the map
    if (markertype == "house"){
        var markerImage = new google.maps.MarkerImage
        (
            "images/home.png",
            new google.maps.Size(36, 36, "px", "px"),
            new google.maps.Point(0, 0),
            new google.maps.Point(0, 0),
            new google.maps.Size(36, 36, "px", "px")
        );
        titulo = "Possible property"
    }
    if (markertype == "police"){
        var markerImage = new google.maps.MarkerImage
        (
            "images/Police.png",
            new google.maps.Size(52, 52, "px", "px"),
            new google.maps.Point(0, 0),
            new google.maps.Point(0, 0),
            new google.maps.Size(52, 52, "px", "px")
        );
        titulo = "Police"
    }
    if (markertype == "bikes"){
        var markerImage = new google.maps.MarkerImage
        (
            "images/Byke.png",
            new google.maps.Size(32, 32, "px", "px"),
            new google.maps.Point(0, 0),
            new google.maps.Point(0, 0),
            new google.maps.Size(32, 32, "px", "px")
        );
        titulo = "Bikes"
    }
    var marker = new google.maps.Marker({
        position: location,
        map: map,
        icon: markerImage,
        title: titulo 
    });
    markers.push(marker);//Add markers on the global array
    
    google.maps.event.addListener(marker, 'click', 
            function (infowindow, marker) {
                return function () {
                    infowindow.open(map, marker);
                    if (markertype == "house"){ //If marker is house, we can show some statistics
                        addStatics(valueString);
					    createDraw(valuearray);
                    }
                };
            }(infowindow, marker)
        );
    marker.setMap(map);
}
// Obtaining possible houses
function getHouses(userdist, usertypeprop){
    if (userdist == 0) {userdist = 4000;}//if userdist is not set, set max distance to 4km
    var houseAPI = "https://data.cityofchicago.org/api/views/s6ha-ppgi/rows.json";//Api to obtain data of the house
    var myLatLngOri = {lat:41.8708 , lng: -87.6505};//University coordinates
    $.getJSON(houseAPI, function (data) {
        for (datos in data.data){
            var info = data.data[datos];
            var lati = Number(info[19]);
            var long = Number(info[20]);
            var comarea = info[8];
            var protype = info[10];
            var proname = info[11];
            var adress = info[12];
            var zip = info[13];
            var phone = info[14];
            let myLatLng={lat:lati, lng:long};
            //Calculating distance from property to university
            var distance = google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(myLatLngOri), new google.maps.LatLng(myLatLng));
            var distanceu = Math.round(distance);
            if (distanceu < userdist){//Checking that it is within the selected range
                if (protype == usertypeprop || usertypeprop == 0){//Checking the type of property
                    let contentString = '<div id="content">'+
                        '<strong> Property information:</strong> <br><br>' + "<strong>Community area:</strong> " + comarea + "<br> <strong>Property type:</strong> " + protype + "<br> <strong>Property name:</strong> " + proname + "<br> <strong>Adress: </strong> " + adress + "<br> <strong>Zip code: </strong> " + zip + "<br> <strong>Phone number: </strong> " + phone + "<br> <strong>Distance to University: </strong> " + distanceu + " meters " + '</div>'; 
                    getSafety(lati, long, contentString);//Obtaining additional data
                } 
            }
        }
    });
}

function getPolice(userdist){//Obtaining additional data
    if (userdist == 0) {userdist = 4000;}//if userdist is not set, set max distance to 4km
    var policeAPI = "https://data.cityofchicago.org/api/views/z8bn-74gv/rows.json";//Api to obtain data of the police stations
    var myLatLngOri = {lat:41.8708 , lng: -87.6505};
    $.getJSON(policeAPI, function (datos) {//Get data from api
        let info1 = datos.data;
        $.each(info1, function(i, info){//Looking at each object
            var lati = Number(info[20]);
            var long = Number(info[21]);
            var comarea = info[9];
            var adress = info[10];
            var zip = info[13];
            var phone = info[15];
            let myLatLng={lat:lati, lng:long};
            //Calculating distance from property to university
            var distance = google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(myLatLngOri), new google.maps.LatLng(myLatLng));
            var distanceu = Math.round(distance);

            if (distanceu < userdist){//Checking that it is within the selected range
                    let valores = "";
                    let typemarker = "police";
                    let contentString = '<div id="content">'+'<strong> Police Station:</strong> <br><br>' + "<strong>Community area:</strong> " + comarea + "<br> <strong>Adress: </strong> " + adress + "<br> <strong>Zip code: </strong> " + zip + "<br> <strong>Phone number: </strong> " + phone + "<br> <strong>Distance to University: </strong> " + distanceu + " meters " + '</div>'; 
                    addMarker(myLatLng,contentString,valores,typemarker);
            }
        });
    });
}

function getBykes(userdist){
    if (userdist == 0) {userdist = 4000;}//if userdist is not set, set max distance to 4km
    var bikesAPI = "https://data.cityofchicago.org/api/views/cbyb-69xx/rows.json";//Api to obtain data of bike racks
    var myLatLngOri = {lat:41.8708 , lng: -87.6505};
    $.getJSON(bikesAPI, function (datos) {//Get data from api
        let info1 = datos.data;
        let zips = {};
        let bycindex = 1;
        $.each(info1, function(i, info){//Looking at each object
            var lati = Number(info[14]);
            var long = Number(info[15]);
            var comareaid = info[11];
            var comarea = info[12];
            var adress = info[9];
            let myLatLng={lat:lati, lng:long};
            //Calculating distance from property to university
            var distance = google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(myLatLngOri), new google.maps.LatLng(myLatLng));
            var distanceu = Math.round(distance);
            let valores = "";
            let typemarker = "bikes";
            if (distanceu < 1100){//Show bike racks within 1km
                if (bycindex % 3 == 0){//Only show 33% of the data not to overload the map
                    let contentString = '<div id="content">'+'<strong> Bikes Racks:</strong> <br><br>' + "<strong>Community area:</strong> " + comarea + "<br> <strong>Adress: </strong> " + adress + "<br> <strong>Distance to University: </strong> " + distanceu + " meters " + '</div>';
                    addMarker(myLatLng,contentString,valores,typemarker);//Add the marker to the map
                }
                bycindex += 1;
            }
            else{
                if (distanceu < userdist){
                        if (zips[comarea]){
                            zips[comarea] += 1;
                        }
                        else{
                            zips[comarea] = 1;
                        }
                        if (zips[comarea] <= 10){//Show max 10 bike rakes per area
                            let contentString = '<div id="content">'+'<strong> Bikes Racks:</strong> <br><br>' + "<strong>Community area:</strong> " + comarea + "<br> <strong>Adress: </strong> " + adress + "<br> <strong>Distance to University: </strong> " + distanceu + " meters " + '</div>';
                            addMarker(myLatLng,contentString,valores,typemarker);//add marker to the map
                        }
                }
            }
        });
    });
}

function getSafety(lati,long,datarray){//Obtain stadistics like safety, transportation or sports values
    //var urlAPI = "https://api.placeilive.com/v1/houses/search?q=Behrenstrasse%204";
    let myLatLng={lat:lati, lng:long};
    //Calling the php method for each of the possible filtered houses
    //*We need php method because CORS error on javascript can't get data on placeilive API
    let urlAPI = "http://codimaqsas.com/mbp/route-safety.php?ll="+lati+","+long; 
    let safety = document.getElementById('safety');
    let strsafety = safety.options[safety.selectedIndex].value;
    let transport = document.getElementById('transport');
    let strtransport = transport.options[transport.selectedIndex].value;
    let bycicle = document.querySelector('input[name="bycicle"]:checked').value;

    $.getJSON(urlAPI, function (data) {//Get data from api
        let valores = {};
        //Obtaining the individual values
        let transplv = data[0].lqi_category[0];
        let dailylv = data[0].lqi_category[1];
        let safetylv = data[0].lqi_category[2];
        let healtlv = data[0].lqi_category[3];
        let sportlv = data[0].lqi_category[4];
        let entertlv = data[0].lqi_category[5];
        let communlv = data[0].lqi_category[6];
        let generalv = data[0].lqi;
        if (safetylv.value >= strsafety){//The safety value is higher than the one selected by the user
            if(transplv.value >= strtransport){//The transportation value is higher than the one selected by the user
                valores = [transplv.label,transplv.value, dailylv.label, dailylv.value, safetylv.label, safetylv.value, healtlv.label, healtlv.value, sportlv.label, sportlv.value, entertlv.label, entertlv.value, communlv.label,communlv.value, generalv.label, generalv.value];
                let typemarker = "house";
                addMarker(myLatLng,datarray,valores,typemarker);//add house marker to the map
            }
        }
    });
}
function addStatics(content){//Show statistics on page
    $( "#stadistics" ).html(content);
}
function setMapOnAll(map) {
        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(map);
        }
      }
// Removes the markers from the map, but keeps them in the array.
      function clearMarkers() {
        setMapOnAll(null);
      }
// Deletes all markers in the array by removing references to them.
      function deleteMarkers() {
        clearMarkers();
        markers = [];
      }
function deleteMarkers() {
        clearMarkers();
        markers = [];
      }
function createDraw(arrayValues){//Create statistics graph
    document.getElementById("stadistics").style.display = "block";
    $('html, body').animate({
        scrollTop: $("#stadistics").offset().top
    }, 2000);
	var width = 300,
    height = 300,
    radius = Math.min(width, height) / 2,
    innerRadius = 0.3 * radius;
    //Fixing the data for the pie chart
	var pie = d3.layout.pie()
		.sort(null)
		.value(function(d) { return d.width; });
	
	var tip = d3.tip()
	  .attr('class', 'd3-tip')
	  .offset([0, 0])
	  .html(function(d) {
		return d.data.label + ": <span style='color:orangered'>" + d.data.score + "</span>";
	  });
	
	var arc = d3.svg.arc()
	  .innerRadius(innerRadius)
	  .outerRadius(function (d) { 
		return (radius - innerRadius) * (d.data.score / 100.0) + innerRadius; 
	  });
	
	var outlineArc = d3.svg.arc()
			.innerRadius(innerRadius)
			.outerRadius(radius);
	
	var svg = d3.select("#stadistics").append("svg")
		.attr("width", width)
		.attr("height", height)
		.append("g")
		.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
	
	svg.call(tip);
	//Setting graphic style and data to pie chart
	var arraydata = [ {id: arrayValues[0], order: 1, score: arrayValues[1], color: "#4776B4", label: "Transportation: "+arrayValues[0], weight: 1, width: 1},
	{id: arrayValues[2], order: 2, score: arrayValues[3], color: "#F47245", label: "Daily Live: "+arrayValues[2], weight: 1, width: 1},
	{id: arrayValues[4], order: 3, score: arrayValues[5], color: "#00C462", label: "Safety index: "+arrayValues[4], weight: 1, width: 1},
	{id: arrayValues[6], order: 4, score: arrayValues[7], color: "#C7E89E", label: "Healt: "+arrayValues[6], weight: 1, width: 1},
	{id: arrayValues[8], order: 5, score: arrayValues[9], color: "#AFE123", label: "Sports: "+arrayValues[8], weight: 1, width: 1},
	{id: arrayValues[10], order: 6, score: arrayValues[11], color: "#4D9DB4", label: "Entertainment: "+arrayValues[10], weight: 1, width: 1},
	{id: arrayValues[12], order: 7, score: arrayValues[13], color: "#11EDB4", label: "Community: "+arrayValues[12], weight: 1, width: 1},
	];
	var data = arraydata;
	  
  var path = svg.selectAll(".solidArc")
      .data(pie(data))
    .enter().append("path")
      .attr("fill", function(d) { return d.data.color; })
      .attr("class", "solidArc")
      .attr("stroke", "gray")
      .attr("d", arc)
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);

  var outerPath = svg.selectAll(".outlineArc")
      .data(pie(data))
    .enter().append("path")
      .attr("fill", "none")
      .attr("stroke", "gray")
      .attr("class", "outlineArc")
      .attr("d", outlineArc);  


  // calculate the weighted mean score
  var score = 
    data.reduce(function(a, b) {
      //console.log('a:' + a + ', b.score: ' + b.score + ', b.weight: ' + b.weight);
      return a + (b.score * b.weight); 
    }, 0) / 
    data.reduce(function(a, b) { 
      return a + b.weight; 
    }, 0);

  svg.append("svg:text")
    .attr("class", "aster-score")
    .attr("dy", ".35em")
    .attr("text-anchor", "middle") // text-align: right
    .text(Math.round(score));
	}
