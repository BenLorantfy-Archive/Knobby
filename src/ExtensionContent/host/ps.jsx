function opacity(o) {
	app.activeDocument.activeLayer.opacity = o;
}

function zoom( z ) {
   cTID = function(s) { return app.charIDToTypeID(s); };
   var docRes = activeDocument.resolution;
   activeDocument.resizeImage( undefined, undefined, 72/(z/100), ResampleMethod.NONE );
   var desc = new ActionDescriptor();
   var ref = new ActionReference();
   ref.putEnumerated( cTID( "Mn  " ), cTID( "MnIt" ), cTID( 'PrnS' ) );
   desc.putReference( cTID( "null" ), ref );
   executeAction( cTID( "slct" ), desc, DialogModes.NO );
   activeDocument.resizeImage( undefined, undefined, docRes, ResampleMethod.NONE );
}