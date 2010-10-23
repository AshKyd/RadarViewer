var win1 = Titanium.UI.createWindow({ title:'Radar' });

var radarImage = Titanium.UI.createImageView({top:0,left:0,});
win1.add(radarImage);


var toggleAnimation = Titanium.UI.createButton({ title:'Animate', right:0, bottom:0 });
toggleAnimation.addEventListener('click',function(e) {
	Titanium.API.info("You clicked the button");

	showDynamicRadar();
});
win1.add(toggleAnimation);

var tab1 = Titanium.UI.createTab({ icon:'radar-32.png', title:'Radar', window:win1 });

tabGroup.addTab(tab1);
