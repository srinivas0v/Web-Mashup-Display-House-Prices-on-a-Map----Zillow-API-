// Put your zillow.com API key here
var zwsid = "############";

var request = new XMLHttpRequest();
var map ,marker, setGeoCode , infowindow, address,latlng;

//Function to initialise google maps, marker and infowindow. Contains 2 event listener for google maps. 
function initialize () {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 32.75, lng: -97.13},
        zoom: 17
      });
      
    infowindow = new google.maps.InfoWindow();
    setGeoCode = new google.maps.Geocoder();
        marker = new google.maps.Marker({
        map:map,
        draggable:true
    });
    
    google.maps.event.addListener(map,'click', function(evt) {
    cordinatesToAddr(map,evt.latLng.lat(), evt.latLng.lng());
    });
  
    google.maps.event.addListener(marker,'dragend', function(evt){
      map.panTo(marker.position);
      cordinatesToAddr(map,evt.latLng.lat(), evt.latLng.lng());
    });
  
  //document.getElementById("Log").innerHTML = "<br/><strong>Search Results: <strong><br/>";
}

//Function to convert cordinates to human readable format.
function cordinatesToAddr(map,lati,lngi)
{
    latlng = new google.maps.LatLng(lati,lngi);
    map.setZoom(18);

    setGeoCode.geocode({'location': latlng}, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
          if (results[0]) {
                var res= results[0].formatted_address;
                mapRequest(res);
            }
        }
    });
}


function mapRequest(formatted_address)
{
    request.onreadystatechange = displayMapResult;
    address = formatted_address;
    //alert(address);
    var temp = address.split(',');
    address = temp[0]+","+temp[1]+","+temp[2];
    var temp = address.split(',');
    var zipcode = temp[temp.length -2];
    request.open("GET","proxy.php?zws-id="+zwsid+"&address="+temp[0]+"&citystatezip="+zipcode+"&rentzestimate=true");
    request.withCredentials = "true";
    request.send(null);
}

//function to display results. called when user clicks on the map.
function displayMapResult()
{
     if (request.readyState == 4) {
        var xml = request.responseXML.documentElement;
            try {
                 value = xml.getElementsByTagName("zestimate")[0].getElementsByTagName("amount")[0].innerHTML;
                 if(value!="")
                 {

        var addr = xml.getElementsByTagName("response")[0].getElementsByTagName("address")[0].getElementsByTagName("street")[0].innerHTML;
        var city = xml.getElementsByTagName("response")[0].getElementsByTagName("address")[0].getElementsByTagName("city")[0].innerHTML;
        var state = xml.getElementsByTagName("response")[0].getElementsByTagName("address")[0].getElementsByTagName("state")[0].innerHTML;
        var zipcode = xml.getElementsByTagName("response")[0].getElementsByTagName("address")[0].getElementsByTagName("zipcode")[0].innerHTML;

        var address = addr+" </br>"+city+"  "+state+"-"+zipcode
                    marker.setPosition(latlng);
                    map.setCenter(latlng);
        document.getElementById("output").innerHTML += " </br>Postal address:   </br>"+address+"</br>Estimated Home Value:   $"+value;
         //document.getElementById("p").innerHTML = "Estimated Home Value:   $"+value;
                    infowindow.setContent(address+"</br>Estimated Home Value:   $"+value);
                    infowindow.open(map,marker);
                }
            }
            catch(err){
                //value = 'Price not available';
                 //content = "<p>" + address + "-  " + value + "</p>";
            }
            
    }
}

function displayResult () {
    if (request.readyState == 4) {
        var xml = request.responseXML.documentElement;
        var value = xml.getElementsByTagName("zestimate")[0].getElementsByTagName("amount")[0].innerHTML;
        var addr = xml.getElementsByTagName("response")[0].getElementsByTagName("address")[0].getElementsByTagName("street")[0].innerHTML;
        var city = xml.getElementsByTagName("response")[0].getElementsByTagName("address")[0].getElementsByTagName("city")[0].innerHTML;
        var state = xml.getElementsByTagName("response")[0].getElementsByTagName("address")[0].getElementsByTagName("state")[0].innerHTML;
        var zipcode = xml.getElementsByTagName("response")[0].getElementsByTagName("address")[0].getElementsByTagName("zipcode")[0].innerHTML;
        var lat = xml.getElementsByTagName("response")[0].getElementsByTagName("address")[0].getElementsByTagName("latitude")[0].innerHTML;
        var long = xml.getElementsByTagName("response")[0].getElementsByTagName("address")[0].getElementsByTagName("longitude")[0].innerHTML;
        //var value1 = (new XMLSerializer()).serializeToString(xml);
        var address = addr+", "+city+"  "+state+"-"+zipcode
         infowindow.setContent(address+"</br>Estimated Home Value:   $"+value);
          marker.setPosition(latlng);
                    map.setCenter(latlng);
                    infowindow.open(map,marker);
        document.getElementById("output").innerHTML += "</br>Postal address:   </br>"+address+"</br>Estimated Home Value:   $"+value;
        //document.getElementById("p").innerHTML = "Estimated Home Value:   $"+value;
        initMap(lat,long,address,value);
    }
}

function sendRequest () {
    request.onreadystatechange = displayResult;
    var address = document.getElementById("address").value;
    var city = document.getElementById("city").value;
    var state = document.getElementById("state").value;
    var zipcode = document.getElementById("zipcode").value;
    request.open("GET","proxy.php?zws-id="+zwsid+"&address="+address+"&citystatezip="+city+"+"+state+"+"+zipcode);
    request.withCredentials = "true";
    request.send(null);
}

function initMap(lt,lg,add,v) {
    var a = parseInt(lt);
    var b = parseInt(lg);
    var myLatLng = {lat: a, lng: b};

    var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 17,
    center: myLatLng
    });
            var infowindow = new google.maps.InfoWindow({
          content: add +"</br> $"+v
        });

        marker = new google.maps.Marker({
            center: myLatLng,
        map:map,
        draggable:true
    });
        infowindow.open(map, marker);
        //marker.addListener('click', function() {
        //  infowindow.open(map, marker);
       // });
         google.maps.event.addListener(map,'click', function(evt) {
    cordinatesToAddr(map,evt.latLng.lat(), evt.latLng.lng());
    });


    google.maps.event.addListener(marker,'dragend', function(evt){
      map.panTo(marker.position);
      cordinatesToAddr(map,evt.latLng.lat(), evt.latLng.lng());
    });

       // google.maps.event.addListener(map, "click", function (e) {

    //lat and lng is available in e object
  //  var latLng = e.latLng;

       // alert(e.latLng);

}
