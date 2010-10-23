
var radarList = false;
var myLocation = false;
var myRadar = false;
var myZoom = false;

function showStaticRadar(radar,zoom){
	myRadar = radar;
	myZoom = zoom;
	var radarUri = 'http://www.bom.gov.au/radar/IDR'+radar[7]+zoom+'.gif';
	Titanium.API.log('Loading '+radarUri);
	radarImage.show();
	radarImage.image = radarUri;
}

function showDynamicRadar(){
	var success = function(responseText){
		if(typeof responseText == 'string'){
			var data = responseText;
		} else {
			var data = this.responseText;
		}
		Titanium.API.log('Received response of '+typeof data+', attempting to update image.');
		var frames = Array();
		String(data).replace(/^theImageNames...\s=.*$/gm,function(frame){frames.push('http://www.bom.gov.au'+frame.substr(20,32));});
		
		for(var i=0;i<frames.length;i++)
			Titanium.API.log(frames[i]);
		
		radarImage.hide();
		var radarAnimation = Titanium.UI.createImageView({top:0,left:0,duration:1000, defaultImage : 'locations.png', images:frames});
		radarAnimation.addEventListener('change',function(){Titanium.API.log('Frame Changed');});
		win1.add(radarAnimation);
		radarAnimation.start();
		
		//~ radarImage.images = frames;
		//~ radarImage.start();
		Titanium.API.log('updated image with '+ frames.length + ' frames. Started.');
	};
	var radarUri = 'http://www.bom.gov.au/products/IDR'+myRadar[7]+myZoom+'.loop.shtml';
	
	Titanium.API.log('Attempting to load ',radarUri);
	
	Titanium.API.log('Loading uri ',radarUri);
	var xhr = Ti.Network.createHTTPClient();
	xhr.onload = success;
	xhr.onerror = function(){alert("Couldn't load BOM feed");};
	xhr.open('GET', radarUri);
	xhr.send();
	
}

Titanium.API.log('Location services enabled? ',Titanium.Geolocation.locationServicesEnabled);
function negotiateRadar(){
	//Failure state.
	var processFailure = function(request,status){
		alert("Couldn't get radar list.");
	}
	
	// Process the radar list.
	var processRadarList = function(responseText){
		if(typeof responseText == 'string'){
			var data = responseText;
		} else {
			var data = this.responseText;
			Titanium.API.log('Storing Coords');
			Ti.App.Properties.setString('coords', data);
		}
		
		Titanium.API.log('Parsing coords');
		radarList = JSON.parse(data);
		
		Titanium.API.log('Got radar list: ',radarList.length);
		
		if(myLocation)
			processComplete();
	}
	
	// Process the location.
	var processLocation = function(location){
		myLocation = location ? -1 : [location.coords.latitude, location.coords.longitude];
		Titanium.API.log('Got Location',myLocation);
		if(radarList)
			processComplete();
	}
	
	var processLocationManually = function(){
		//~ Titanium.API.log('Location not found. Pick manually.');
		//~ tabGroup.setActiveTab(1);
	}
	
	// Find the closest radar.
	var processComplete = function(){
		
		var closestRadar = false;
		var closestDist = false;
		
		if(typeof myLocation == 'number')
			myLocation = false;
		
		var locationPicker = [];
		
		for(i=0; i < radarList.length; i++) {
			var radar = radarList[i];
			
			locationPicker.push({title:radar[1],radarNumber : i+1});
			
			if(myLocation) {
				Titanium.API.log('Checking if location is closer than previous...');
				var myLat = Math.abs(myLocation[0]);
				var myLon = Math.abs(myLocation[1]);
				var rLat = Math.abs(radar[3]);
				var rLon = Math.abs(radar[4]);
				
				var dist = Math.abs(myLat - rLat) + Math.abs(myLon - rLon);
				
				if(dist < closestDist || closestDist == false) {
					closestDist = dist;
					closestRadar = radar;
				}
			}
			
		};
		
		Titanium.API.log('Finished loop. Attempting to populate picker.');
		
		locationPicker.sort(function(a, b){
			var bTitle = b.title;
			var sorted = [a.title,bTitle].sort();
			
			if (sorted[0] == bTitle)  
				return 1; 
			if (sorted[1] == bTitle)  
				return -1;
			
			return 0;  
		});
		
		locations.data = locationPicker;
		if(!myLocation) {
			// We haven't been able to determine a location. Unusual,
			// but let's handle it.
			processLocationManually();
			return;
		}
		
		Titanium.API.log('Showing Radar '+closestRadar[1]);
		showStaticRadar(myRadar,myZoom);
	}
	
	/* Load our database of coordinates */
	var coords = Ti.App.Properties.getString('coords');
	if(!coords){
		Titanium.API.log('Coordinates not stored locally. Loading');
		var xhr = Ti.Network.createHTTPClient();
		xhr.onload = processRadarList;
		xhr.onerror = processFailure;
		xhr.open('GET', 'http://ash-server.ash.ms/radar/coords.js');
		xhr.send();
	} else {
		Titanium.API.log('Coordinates stored locally');
		processRadarList(coords);
	}
	
	Titanium.API.log('Firing Geologation Doodad');
	Titanium.Geolocation.getCurrentPosition(processLocation);
	
}

Titanium.API.log('Starting Negotiation');

negotiateRadar();
