function getData(id) {
    $.ajax({
        //url: "https://www.ncdc.noaa.gov/cdo-web/api/v2/datasets",
        //url: "https://www.ncdc.noaa.gov/cdo-web/api/v2/data?datasetid="+id+"&startdate=2016-01-01&enddate=2016-01-01",
        //url: "https://www.ncdc.noaa.gov/cdo-web/api/v2/data?datasetid=GSOM&stationid=GHCND:USC00010008&units=standard&startdate=2010-05-01&enddate=2010-05-31",
        url: "https://www.ncdc.noaa.gov/cdo-web/api/v2/locations?locationcategoryid=CITY&sortfield=name&sortorder=desc",
        headers: { token: "tukeGYOTbzRFCEScMXqzfYiUkPoUhWIU" },
        success: function (resultData) {
            //here is your json.
            // process it
            console.log("ID: "+id);
            console.log(resultData);
            var htmlText = '';
            let data = resultData.results;

            $('.container').append(htmlText);
        },
        error: function (jqXHR, textStatus, errorThrown) {
        },

        timeout: 120000,
    });
}

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
function initMap() {
    window.markers = [];
    window.contador = 1;
    var myLatLng = {lat:41.8708 , lng: -87.6505};

    window.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: myLatLng,
    });
    var contentString = '<div id="content">'+
                'Deparment of Electrical & Computer Engineering' + 
                '</div>'; 
    var infowindow = new google.maps.InfoWindow({content: contentString});
    var markerImage = new google.maps.MarkerImage
        (
            "https://cdn4.iconfinder.com/data/icons/businesses/130/SVG_university-256.png",
            new google.maps.Size(64, 64, "px", "px"),
            new google.maps.Point(0, 0),
            new google.maps.Point(0, 0),
            new google.maps.Size(64, 64, "px", "px")
        );

    var marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        icon: markerImage,
        title: 'Deparment of Electrical & Computer Engineering' 
    });

    google.maps.event.addListener(marker, 'click', 
            function (infowindow, marker) {
                return function () {
                    infowindow.open(map, marker);
                };
            }(infowindow, marker)
        );
    marker.setMap(map);
}
function explore() {
    deleteMarkers();
    let container = document.getElementById("container");
    let sucess = document.getElementById("msj-sucess");
    let loading = document.getElementById("msj-loading");
    let price = document.getElementById('price_range');
    let strprice = price.options[price.selectedIndex].value;
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

    userform.style.display = "none";
    sucess.style.display = "block";
    loading.style.display = "block";
    document.getElementById("searchButton").style.display = "block";
    sucess.innerHTML="<h4> Update ready </h4><p> Your consulting dates are: </p>";
    loading.innerHTML="<h4> Loading results. Be patiente, we are procesing data ...</h4>";
    sucess.innerHTML+="<strong>Price Range: </strong>"+strprice+"<br><strong> Crime percent <: </strong>"+ strsafety +"<br><strong> Transport quality >: </strong>"+ strtransport +"<br><strong> Distance: </strong>"+ strdistance +"<br><strong> Property Type: </strong>"+ strpropertyType +"<br> <strong>Want alternative transport: </strong>"+ bycicle;
    container.style.height = '750px';
    //alert("Searching... \n We currently can't find more info, sorry =(. \n But don't worry We're working on it... Coming soon ;)");
    getHouses(strdistance, strpropertyType);
}
function searchAgain() {
    document.getElementById('options').style.display = "block";
    document.getElementById("msj-sucess").style.display = "none";
    document.getElementById("searchButton").style.display = "none";
    document.getElementById("stadistics").style.display = "none";
    document.getElementById("msj-loading").style.display = "none";
}
function addMarker(location, datarray, valuearray = "") {
    
    // if (distanceu < 10000){
    //     window.contador += 1;
    //     console.log(contador);}
    
    var contentString = '<div id="content">'+
                '<strong> Property information:</strong> <br><br>' + "<strong>Community area:</strong> " + datarray.comarea + "<br> <strong>Property type:</strong> " + datarray.protype + "<br> <strong>Property name:</strong> " + datarray.proname + "<br> <strong>Adress: </strong> " + datarray.adress + "<br> <strong>Zip code: </strong> " + datarray.zip + "<br> <strong>Phone number: </strong> " + datarray.phone + "<br> <strong>Distance to University: </strong> " + datarray.distanceu + " meters " +
                '</div>'; 
    var valueString = '<div id="content" class="barra-titulo">'+
                '<strong> Estimated valuation:</strong> <br><br>' +
                '</div>'; 

    var infowindow = new google.maps.InfoWindow({content: contentString});
    var markerImage = new google.maps.MarkerImage
        (
            "https://cdn3.iconfinder.com/data/icons/pure_web_icon_pack/PNG/512/home.png",
            new google.maps.Size(44, 44, "px", "px"),
            new google.maps.Point(0, 0),
            new google.maps.Point(0, 0),
            new google.maps.Size(44, 44, "px", "px")
        );
    var marker = new google.maps.Marker({
        position: location,
        map: map,
        icon: markerImage,
        title: 'Possible property' 
    });
    markers.push(marker);
    
    google.maps.event.addListener(marker, 'click', 
            function (infowindow, marker) {
                return function () {
                    infowindow.open(map, marker);
                    addStatics(valueString);
					createDraw(valuearray);
                };
            }(infowindow, marker)
        );
    marker.setMap(map);
}
function getHouses(userdist, usertypeprop){
    if (userdist == 0) {userdist = 4000;}
    var houseAPI = "https://data.cityofchicago.org/api/views/s6ha-ppgi/rows.json";
    var myLatLngOri = {lat:41.8708 , lng: -87.6505};
    $.getJSON(houseAPI, function (data) {
        //console.log(data);
        
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

            var distance = google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(myLatLngOri), new google.maps.LatLng(myLatLng));
            var distanceu = Math.round(distance);

            if (distanceu < userdist){
                if (protype == usertypeprop || usertypeprop == 0){
                    let datarray = {comarea,protype,proname,adress,zip,phone,distanceu};
                    getSafety(lati, long, datarray);
                } 
            }
            //getSafety(lati,long);
        }
    });
    // console.log(contador);
    // var DOSAPI = "http://www.zillow.com/webservice/GetSearchResults.htm?zws-id=X1-ZWz199r3glyl8r_a9fju&address=2114+Bigelow+Ave&citystatezip=Seattle%2C+WA";
    
    // $.ajax({
    //                 type: 'GET',
    //                 url: "route.php",
    //                 contentType: 'text/plain',
    //                 xhrFields: { ithCredentials: false },
    //                 headers: {'Accept':'application/json'},
    //                 dataType: 'xml',
    //                 success: function (data) {
    //                     console.log(data);
    //                 }
    //             });

    
}

function getPolice(){

}
function getBykes(){

}
function getPlaces(){

}
function getSafety(lati,long,datarray){
    //var urlAPI = "https://api.placeilive.com/v1/houses/search?q=Behrenstrasse%204";
    let myLatLng={lat:lati, lng:long};
    let urlAPI = "route-safety.php?ll="+lati+","+long;
    //console.log(urlAPI);
    
    let safety = document.getElementById('safety');
    let strsafety = safety.options[safety.selectedIndex].value;
    let transport = document.getElementById('transport');
    let strtransport = transport.options[transport.selectedIndex].value;
    let bycicle = document.querySelector('input[name="bycicle"]:checked').value;

    $.getJSON(urlAPI, function (data) {
        let valores = {};
        let transplv = data[0].lqi_category[0];
        let dailylv = data[0].lqi_category[1];
        let safetylv = data[0].lqi_category[2];
        let healtlv = data[0].lqi_category[3];
        let sportlv = data[0].lqi_category[4];
        let entertlv = data[0].lqi_category[5];
        let communlv = data[0].lqi_category[6];
        let generalv = data[0].lqi;
        //console.log(data);
        if (safetylv.type >= strsafety){
            if(transplv.value >= strtransport){
                valores = [transplv.label,transplv.value, dailylv.label, dailylv.value, safetylv.label, safetylv.value, healtlv.label, healtlv.value, sportlv.label, sportlv.value, entertlv.label, entertlv.value, communlv.label,communlv.value, generalv.label, generalv.value];
                addMarker(myLatLng,datarray,valores);
                //console.log(arraysafety);
            }
        }
    });
}
function addStatics(content){
    $( "#stadistics" ).html(content);
	//$( "#stadistics" ).html( createDraw());
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
function createDraw(arrayValues){
    document.getElementById("stadistics").style.display = "block";
    window.location.hash = '#stadistics';
	var width = 300,
    height = 300,
    radius = Math.min(width, height) / 2,
    innerRadius = 0.3 * radius;

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
	//console.log(arrayValues);
	//console.log(arrayValues[0]);
	var arraydata = [ {id: arrayValues[0], order: 1, score: arrayValues[1], color: "#4776B4", label: "Transportation: "+arrayValues[0], weight: 1, width: 1},
	{id: arrayValues[2], order: 2, score: arrayValues[3], color: "#F47245", label: "Daily Live: "+arrayValues[2], weight: 1, width: 1},
	{id: arrayValues[4], order: 3, score: arrayValues[5], color: "FAE38C", label: "Safety index: "+arrayValues[4], weight: 1, width: 1},
	{id: arrayValues[6], order: 4, score: arrayValues[7], color: "#C7E89E", label: "Healt: "+arrayValues[6], weight: 1, width: 1},
	{id: arrayValues[8], order: 5, score: arrayValues[9], color: "#9CD6A4", label: "Sports: "+arrayValues[8], weight: 1, width: 1},
	{id: arrayValues[10], order: 6, score: arrayValues[11], color: "#4D9DB4", label: "Entertainment: "+arrayValues[10], weight: 1, width: 1},
	{id: arrayValues[12], order: 7, score: arrayValues[13], color: "#11EDB4", label: "Community: "+arrayValues[12], weight: 1, width: 1},
	];
	
	//d3.csv('aster_data.csv', function(error, data) {
	
	var data = arraydata;
	  
	  // for (var i = 0; i < data.score; i++) { console.log(data[i].id) }
	  
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
