var win2 = Titanium.UI.createWindow({ title:'Locations' });
var tab2 = Titanium.UI.createTab({ icon:'locations.png', title:'Locations', window:win2 });

var locations = Titanium.UI.createTableView();
locations.addEventListener('click', function(e){
	Titanium.API.log('Location click handler clucked.');
	if (e.rowData.radarNumber) {
		var radar = radarList[e.rowData.radarNumber-1];
		Titanium.API.log('Clicked radar ',radar[1]);
		showStaticRadar(radar,3);
		tabGroup.setActiveTab(0);
	}else {
		Titanium.API.log('Rowdata missing.',e.rowData.radarNumber);
	}
});

win2.add(locations);

tabGroup.addTab(tab2);
