  var mymap = L.map('map').setView([40.7128, -73.89], 11);

	L.esri.basemapLayer('DarkGray').addTo(mymap);

	////////////////////////////////// add flow map /////////////////////////////////////////////
	
	var TaxiType = 6;
	var oneToManyFlowmapLayer;
  var Features = [];

	function get_map(){
		$.getJSON("http://dev.spatialdatacapture.org:8896/data/flow/" + TaxiType ,function(data){
		$.each(data, function(k,v){
			var feature = {
				"type": "Feature",
				"geometry":{
					"type": "Point",
					"coordinates":[v.lon, v.lat]
				},
				"properties":{
					"origin_id": v.POlocationID,
				    "origin_lon": v.lon,
				    "origin_lat": v.lat,
				    "PUZone": v.PUZone,
				    "destination_id": v.DOlocationID,
				    "destination_lon": v.lon_1,
				    "destination_lat": v.lat_1,
				    "DOZone": v.DOZone,
				    "count":v.counts
				}
			};	
			Features.push(feature);
		});

		var geoJsonFeatureCollection = {
				type: 'FeatureCollection',
    			features : Features
			}
		console.log(geoJsonFeatureCollection);

		var canvasRenderer = L.canvas();

		// var oneToManyFlowmapLayer;

		oneToManyFlowmapLayer = L.canvasFlowmapLayer(geoJsonFeatureCollection, {
	  	originAndDestinationFieldIds: {
	  		originUniqueIdField: 'origin_id',
            originGeometry: {
              x: 'origin_lon',
              y: 'origin_lat'
          	},
        	destinationUniqueIdField: 'destination_id',
            destinationGeometry: {
              x: 'destination_lon',
              y: 'destination_lat'
          	}
        },
        canvasBezierStyle:{
        	type: 'classBreaks',
            field: 'count', 
            classBreakInfos:[{
            	classMinValue: 0,
              	classMaxValue: 1000,
              	symbol: {
                strokeStyle: '#fee5d9',
                lineWidth: 0.5,
                lineCap: 'round',
                shadowColor: '#fee5d9',
                shadowBlur: 1.5
              }
            },{
              classMinValue: 1001,
              classMaxValue: 3000,
              symbol: {
                strokeStyle: '#fcbba1',
                lineWidth: 0.5,
                lineCap: 'round',
                shadowColor: '#fcbba1',
                shadowBlur: 1.5
              }
            },{
              classMinValue: 3001,
              classMaxValue: 7000,
              symbol: {
                strokeStyle: '#fc9272',
                lineWidth: 0.5,
                lineCap: 'round',
                shadowColor: '#fc9272',
                shadowBlur: 1.5
              }
            },{
              classMinValue: 7001,
              classMaxValue: 10000,
              symbol: {
                strokeStyle: '#fb6a4a',
                lineWidth: 0.5,
                lineCap: 'round',
                shadowColor: '#fb6a4a',
                shadowBlur: 1.5
              }
            },{
              classMinValue: 10000,
              classMaxValue: 50000,
              symbol: {
                strokeStyle: '#de2d26',
                lineWidth: 0.5,
                lineCap: 'round',
                shadowColor: '#de2d26',
                shadowBlur: 1.5
              }
            },{
              classMinValue: 50000,
              classMaxValue: 170000,
              symbol: {
                strokeStyle: '#a50f15',
                lineWidth: 0.5,
                lineCap: 'round',
                shadowColor: '#a50f15',
                shadowBlur: 1.5
              }
            }]
        },
        style: function(geoJsonFeature){
        	if (geoJsonFeature.properties.isOrigin) {
    			return {
			    	renderer: canvasRenderer, // recommended to use your own L.canvas()
			    	radius: 6,
			    	weight: 1,
			    	color: '#d9de6e',
			    	fillColor: '#d9de6e',
			    	fillOpacity: 0.5
			    };
			}
			else{
			    return {
			      renderer: canvasRenderer,
			      radius: 2,
			      weight: 0.25,
			      color: 'white',
			      fillColor: 'white',
			      fillOpacity: 1
			    };
			 } 
        },

        pathDisplayMode: 'selection',
        animationStarted: true,
        animationEasingFamily: 'Cubic',
        animationEasingType: 'In',
        animationDuration: 2000,
        onEachFeature: onEachFeature
        }).addTo(mymap);


        console.log(oneToManyFlowmapLayer);

        oneToManyFlowmapLayer.on('mouseover', function(e) {
          if (e.sharedOriginFeatures.length) {
            oneToManyFlowmapLayer.selectFeaturesForPathDisplay(e.sharedOriginFeatures, 'SELECTION_NEW');
          }
          if (e.sharedDestinationFeatures.length) {
            oneToManyFlowmapLayer.selectFeaturesForPathDisplay(e.sharedDestinationFeatures, 'SELECTION_NEW');
          }
      	});

        oneToManyFlowmapLayer.selectFeaturesForPathDisplayById('origin_id', 132, true, 'SELECTION_NEW');
       
	});
	}

	get_map();

	function change_type(){
		TaxiType = document.getElementById("taxi_type").value;
		Features = [];
		oneToManyFlowmapLayer.remove();
		get_map();
	}

	function onEachFeature(feature, layer) {
		if (feature.properties.isOrigin){
			layer.bindPopup("Origin Taxi Zone: " + feature.properties.PUZone)
		}
		else{
			layer.bindPopup("Destination Taxi Zone: " + feature.properties.DOZone)
		}
}
