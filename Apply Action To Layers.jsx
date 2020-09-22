//	I pretty much copy-pasted everything from NinjaScript's script,
//	added couple funtions from "ES-Collection/Photoshop-Scripts/Remove Unused Layers.jsx" on GitHub,
//	and edited it all to work in Photoshop 2020 :)
//	Also added option to choose what type of layers you applying to.

#target photoshop

var scriptName = "Apply Action To Layers";
var scriptCreator = "Originally made by NinjaScript"
function cID (inVal) { return charIDToTypeID(inVal);}
function sID (inVal) { return stringIDToTypeID(inVal);}
var currentActionSets = getActionSets();
main();

function main()
{
    app.bringToFront();
    optionsDialog();
}

function optionsDialog()
{
    var ButtonWidth = 110;

	OpenOptionsDialog = new Window("dialog", scriptName + "...  " + scriptCreator);
	OpenOptionsDialog.orientation = 'column';
	OpenOptionsDialog.alignChildren = 'left';
    mainGroup = OpenOptionsDialog.add("group");
    mainGroup.orientation = 'column';
    mainGroup.alignChildren = 'left';
    mainGroup.alignment = 'left';
	
//Group	
    var actionSetGroup = mainGroup.add("group");
    actionSetGroup.orientation = 'row';
    actionSetGroup.add("statictext",undefined, "Action Set:")
    var DDActionSet = actionSetGroup.add("dropdownlist",undefined, "")
    DDActionSet.preferredSize.width = 210;
       
    for (var i = 0; i < currentActionSets.length; i++)
    {
		DDActionSet.add("item", currentActionSets[i]);
    }
	DDActionSet.selection = 0;
	for (var i = 0; i < currentActionSets.length; i++){	//
		if(currentActionSets[i] == "Mine"){				//	Selects by default Action Set with name "Mine", instead of 1st by alphabetical
			DDActionSet.selection = i;					//
		}												//
	}													//
//   
    
//Action
    var actionGroup = mainGroup.add("group");
    actionGroup.orientation = 'row';
    actionGroup.add("statictext",undefined, "Action:      ")
    DDActions = actionGroup.add("dropdownlist",undefined, "")
    DDActions.preferredSize.width = 210;
    
    function populateDDActions (inSet)
    {
        DDActions.removeAll();        
        for (var i = 0; i < currentActionSets[inSet].actions.length; i++)
        {
            DDActions.add("item", currentActionSets[inSet].actions[i]);
        }
        DDActions.selection = 0;
    }
    DDActionSet.onChange = function()
    {
        populateDDActions(DDActionSet.selection.index);
    }
    DDActionSet.onChange();
//

//ApplyTo
    var ApplyTo = mainGroup.add("group");
    ApplyTo.orientation = 'row';
    ApplyTo.add("statictext",undefined, "Apply To:  ")
    DDApplyTo = ApplyTo.add("dropdownlist",undefined, "")
    DDApplyTo.preferredSize.width = 110;
    DDApplyTo.removeAll();
	DDApplyTo.add("item", "Selected Layers");
	DDApplyTo.add("item", "Visible Layers");
	DDApplyTo.add("item", "ALL Layers");
	DDApplyTo.selection = 0;
//

//Run
    mainGroup.add("statictext", undefined, "");
     
    ButtonGroup = mainGroup.add("group");
    ButtonGroup.orientation = 'row';
    ButtonGroup.alignChildren = 'center';
    ButtonGroup.alignment = 'top';     
            
    buttonRun= ButtonGroup.add("button",undefined, "Run")
    buttonRun.preferredSize.width = ButtonWidth;
    buttonRun.onClick = function()
   {
		if(DDApplyTo.selection == 0)	//ToSelected
		{
			AllSelected = getSelectedLayersIdx();
			var doc = app.activeDocument;
			for(var i in AllSelected)
			{
				if(isLayerSet(Number(AllSelected[i])) == 0 && isLocked(Number(AllSelected[i])) == 0 && isLayerSetEnd(Number(AllSelected[i])) == 0 && isAdjustmentLayer(Number(AllSelected[i])) == 0 && isClippingLayer(Number(AllSelected[i])) != 'topClippingLayer' && isClippingLayer(Number(AllSelected[i])) != 'middleClippingLayer')
				{
					deselectLayers();
					selectLayerByIndex(Number(AllSelected[i]),true);
					var v = getLayerVisibilityByIndex(Number(AllSelected[i]));
					doc.activeLayer.visible = true;
					app.doAction(DDActions.selection.text, DDActionSet.selection.text);
					if(v == 0)
					{
						doc.activeLayer.visible = false;
					}
				}
			}
			deselectLayers();
			OpenOptionsDialog.close();
		}
		if(DDApplyTo.selection == 1)	//ToVisible
		{
			var doc = app.activeDocument;
			selectAllLayers();
			var layersSelected=getSelectedLayersIdx();
			var u = 0;
			var w = layersSelected.length;
			deselectLayers();
			for(var i = 1; i < w; i++)
			{
				if(isLayerSet(i))
				{
					w++;
					u++;					
				}
			}
			selectAllLayers();
			for(i = layersSelected.length + u; i > 0; i--)
			{
				if(isLayerSet(i) == 0 && isLocked(i) == 0 && isLayerSetEnd(i) == 0 && getLayerVisibilityByIndex(i) == 1 && isAdjustmentLayer(i) == 0 && isClippingLayer(i) != 'topClippingLayer' && isClippingLayer(i) != 'middleClippingLayer')
				{
					deselectLayers();
					selectLayerByIndex(i,true);
					var v = getLayerVisibilityByIndex(i);
					doc.activeLayer.visible = true;
					app.doAction(DDActions.selection.text, DDActionSet.selection.text);
					if(v == 0)
					{
						doc.activeLayer.visible = false;
					}
				}
			}
			deselectLayers();
			OpenOptionsDialog.close();			
		}		
		if(DDApplyTo.selection == 2)	//ToAll
		{
			var doc = app.activeDocument;
			selectAllLayers();
			var layersSelected=getSelectedLayersIdx();
			var u = 0;
			var w = layersSelected.length;
			deselectLayers();
			for(var i = 1; i < w; i++)
			{
				if(isLayerSet(i))
				{
					w++;
					u++;					
				}
			}
			selectAllLayers();
			for(i = layersSelected.length + u; i > 0; i--)
			{
				if(isLayerSet(i) == 0 && isLocked(i) == 0 && isLayerSetEnd(i) == 0 && isAdjustmentLayer(i) == 0 && isClippingLayer(i) != 'topClippingLayer' && isClippingLayer(i) != 'middleClippingLayer')
				{
					deselectLayers();
					selectLayerByIndex(i,true);
					var v = getLayerVisibilityByIndex(i);
					doc.activeLayer.visible = true;
					app.doAction(DDActions.selection.text, DDActionSet.selection.text);
					if(v == 0)
					{
						doc.activeLayer.visible = false;
					}
				}
			}
			deselectLayers();
			OpenOptionsDialog.close();			
		}
    }
//

//Exit    
    buttonClose= ButtonGroup.add("button",undefined, "Exit")
    buttonClose.preferredSize.width = ButtonWidth;
    buttonClose.onClick = function() {OpenOptionsDialog.close()}       
    //Show window
  OpenOptionsDialog.center();
  var result = OpenOptionsDialog.show();
}

function getActionSets() 
{  
  var i = 1;  
  var sets = [];  
  while (true) {  
    var ref = new ActionReference();  
    ref.putIndex(cID("ASet"), i);  
    var desc;  
    var lvl = $.level;  
    $.level = 0;  
    try {  
      desc = executeActionGet(ref);  
    } catch (e) {  
      break;    // all done  
    } finally {  
      $.level = lvl;  
    }  
    if (desc.hasKey(cID("Nm  "))) {  
      var set = {};  
      set.index = i;  
      set.name = desc.getString(cID("Nm  "));  
      set.toString = function() { return this.name; };  
      set.count = desc.getInteger(cID("NmbC"));  
      set.actions = [];  
      for (var j = 1; j <= set.count; j++) {  
        var ref = new ActionReference();  
        ref.putIndex(cID('Actn'), j);  
        ref.putIndex(cID('ASet'), set.index);  
        var adesc = executeActionGet(ref);  
        var actName = adesc.getString(cID('Nm  '));  
        set.actions.push(actName);  
      }  
      sets.push(set);  
    }  
    i++;  
  }  
  return sets;  
}  

function deselectLayers() {
    var desc01 = new ActionDescriptor();
        var ref01 = new ActionReference();
        ref01.putEnumerated( charIDToTypeID('Lyr '), charIDToTypeID('Ordn'), charIDToTypeID('Trgt') );
    desc01.putReference( charIDToTypeID('null'), ref01 );
    executeAction( stringIDToTypeID('selectNoLayers'), desc01, DialogModes.NO );
}

function selectLayerByIndex(index,add){
    add = (add == undefined)  ? add = false : add;
    var ref = new ActionReference();
        ref.putIndex(charIDToTypeID("Lyr "), index);
        var desc = new ActionDescriptor();
        desc.putReference(charIDToTypeID("null"), ref );
             if(add) desc.putEnumerated( stringIDToTypeID( "selectionModifier" ), stringIDToTypeID( "selectionModifierType" ), stringIDToTypeID( "addToSelection" ) );
          desc.putBoolean( charIDToTypeID( "MkVs" ), false );
         try{
        executeAction(charIDToTypeID("slct"), desc, DialogModes.NO );
    }catch(e){}
}

function getLayerVisibilityByIndex( idx ) {
    var ref = new ActionReference();
    ref.putProperty( charIDToTypeID("Prpr") , charIDToTypeID( "Vsbl" ));
    ref.putIndex( charIDToTypeID( "Lyr " ), idx );
    return executeActionGet(ref).getBoolean(charIDToTypeID( "Vsbl" ));
}

function getSelectedLayersIdx(){
   var selectedLayers = new Array;
   var ref = new ActionReference();
   ref.putEnumerated( charIDToTypeID("Dcmn"), charIDToTypeID("Ordn"), charIDToTypeID("Trgt") );
   var desc = executeActionGet(ref);
   if( desc.hasKey( stringIDToTypeID( 'targetLayers' ) ) ){
      desc = desc.getList( stringIDToTypeID( 'targetLayers' ));
       var c = desc.count
       var selectedLayers = new Array();
       for(var i=0;i<c;i++){
         try{
            activeDocument.backgroundLayer;
            selectedLayers.push(  desc.getReference( i ).getIndex() );
         }catch(e){
            selectedLayers.push(  desc.getReference( i ).getIndex()+1 );
         }
       }
    }else{
      var ref = new ActionReference();
      ref.putProperty( charIDToTypeID("Prpr") , charIDToTypeID( "ItmI" ));
      ref.putEnumerated( charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt") );
      try{
         activeDocument.backgroundLayer;
         selectedLayers.push( executeActionGet(ref).getInteger(charIDToTypeID( "ItmI" ))-1);
      }catch(e){
         selectedLayers.push( executeActionGet(ref).getInteger(charIDToTypeID( "ItmI" )));
      }
   }
   return selectedLayers;
}

function isLayerSet(idx){
   var propName = stringIDToTypeID( 'layerSection' );// can't replace
   var ref = new ActionReference();
   ref.putProperty( 1349677170 , propName);
   ref.putIndex( 1283027488, idx );
   var desc =  executeActionGet( ref );
   var type = desc.getEnumerationValue( propName );
   var res = typeIDToStringID( type );
   return res == 'layerSectionStart' ? true:false;
}

function isLayerSetEnd(idx){
   var propName = stringIDToTypeID( 'layerSection' );// can't replace
   var ref = new ActionReference();
   ref.putProperty( 1349677170 , propName);
   ref.putIndex( 1283027488, idx );
   var desc =  executeActionGet( ref );
   var type = desc.getEnumerationValue( propName );
   var res = typeIDToStringID( type );
   return res == 'layerSectionEnd' ? true:false;
}

function selectAllLayers() {
    var desc29 = new ActionDescriptor();
        var ref23 = new ActionReference();
        ref23.putEnumerated( charIDToTypeID('Lyr '), charIDToTypeID('Ordn'), charIDToTypeID('Trgt') );
    desc29.putReference( charIDToTypeID('null'), ref23 );
    executeAction( stringIDToTypeID('selectAllLayers'), desc29, DialogModes.NO );
}

function getSelectedLayersIdx(){
   var selectedLayers = new Array;
   var ref = new ActionReference();
   ref.putEnumerated( charIDToTypeID("Dcmn"), charIDToTypeID("Ordn"), charIDToTypeID("Trgt") );
   var desc = executeActionGet(ref);
   if( desc.hasKey( stringIDToTypeID( 'targetLayers' ) ) ){
      desc = desc.getList( stringIDToTypeID( 'targetLayers' ));
       var c = desc.count
       var selectedLayers = new Array();
       for(var i=0;i<c;i++){
         try{
            activeDocument.backgroundLayer;
            selectedLayers.push(  desc.getReference( i ).getIndex() );
         }catch(e){
            selectedLayers.push(  desc.getReference( i ).getIndex()+1 );
         }
       }
    }else{
      var ref = new ActionReference();
      ref.putProperty( charIDToTypeID("Prpr") , charIDToTypeID( "ItmI" ));
      ref.putEnumerated( charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt") );
      try{
         activeDocument.backgroundLayer;
         selectedLayers.push( executeActionGet(ref).getInteger(charIDToTypeID( "ItmI" ))-1);
      }catch(e){
         selectedLayers.push( executeActionGet(ref).getInteger(charIDToTypeID( "ItmI" )));
      }
   }
   return selectedLayers;
}

function isLocked(myLayer){
    selectLayerByIndex(myLayer);

    if(activeDocument.activeLayer.allLocked || activeDocument.activeLayer.pixelsLocked || activeDocument.activeLayer.positionLocked || activeDocument.activeLayer.transparentPixelsLocked){
        return true;
    }
    return false;
}

function isAdjustmentLayer(){
	var ref = new ActionReference();
	ref.putEnumerated( charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt") );
	return executeActionGet(ref).hasKey(stringIDToTypeID('adjustment'));
}

function isClippingLayer(layerID){
	var clipInfo=false;

	var ref = new ActionReference();
	    ref.putIndex(charIDToTypeID("Lyr "), layerID);

	try{
		var desc = executeActionGet(ref);
	} catch(e) {
		// Not a valid layer
		return clipInfo;
	}

	var group = desc.getBoolean(stringIDToTypeID('group'));
	if(group) clipInfo = 'topClippingLayer';

	try{
   		var ref = new ActionReference();
   		ref.putIndex(charIDToTypeID( 'Lyr ' ), layerID+1 );
   		desc =  executeActionGet(ref);
	}catch(e){
		//alert("Top layer!");
		return clipInfo;
	}

    group = desc.getBoolean(stringIDToTypeID('group'));
    if(group && clipInfo == 'topClippingLayer' ) clipInfo = 'middleClippingLayer';
    if(group && clipInfo == false ) clipInfo = 'bottomClippingLayer';
    return clipInfo;
};