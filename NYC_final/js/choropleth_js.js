/////////////////////////// add map layer ///////////////////////////////////////
  var mymap = L.map('map-canvas').setView([40.74, -73.95], 11);
  mymap.createPane('labels');
  mymap.getPane('labels').style.zIndex = 650;
  mymap.getPane('labels').style.pointerEvents = 'none';

  L.esri.basemapLayer('DarkGray').addTo(mymap);


  //////////////////////////////// default setting //////////////////////////////////////
  // direction: PU,1;DO,0;
  var direction = 1;
  // TaxiType: fhv,1; uber,2;lyft,3;taxi,4;green,5;yellow,6
  var TaxiType = 4;
  var hour = 12;
  var weekday = 1;

  var filtered_data = [];
  var geoJsonLayer;


  $.getJSON( "http://dev.spatialdatacapture.org:8896/data/" + direction +"/"+TaxiType+"/" + weekday + "/" + hour, function( data ){
    $.each(data, function(k,v){
      filtered_data.push(v);
    });
    geoJsonLayer = L.geoJSON(geojsonFeature,
      {style:style,
        onEachFeature: onEachFeature
      }).addTo(mymap);
  });


  ////////////////////////// Pannel Interaction //////////////////////////////////////

  // bourough map
  var coll = document.getElementsByClassName("collapsible");
  var i;

  for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function() {
      this.classList.toggle("active");
      var content = this.nextElementSibling;
      if (content.style.display === "block") {
        content.style.display = "none";
      } else {
        content.style.display = "block";
      }
    });
  }

  // change direction
  function change_direction(){
    direction = document.getElementById("direnction_type").value;
    filtered_data = [];
    $.getJSON( "http://dev.spatialdatacapture.org:8896/data/" + direction +"/"+TaxiType+"/" + weekday + "/" + hour, function( data ){
      $.each(data, function(k,v){
        filtered_data.push(v);
      });
      geoJsonLayer.setStyle(style);
    });
  }


  //change type
  function change_type(){
    TaxiType = document.getElementById("taxi_type").value;
    filtered_data = [];
    $.getJSON( "http://dev.spatialdatacapture.org:8896/data/" + direction +"/"+TaxiType+"/" + weekday + "/" + hour, function( data ){
      $.each(data, function(k,v){
        filtered_data.push(v);
      });
      geoJsonLayer.setStyle(style);
    });
  }


  // hour
  document.getElementById('hour-slider').addEventListener('input',function(e){
    hour = parseInt(e.target.value);
    // converting 0-23 hour to AMPM format
    var ampm = hour >= 12 ? 'PM' : 'AM';
    var hour12 = hour % 12 ? hour % 12 : 12;
    // update text in the UI
    document.getElementById('active-hour').innerText = hour12 + ampm;

    filtered_data = [];
    $.getJSON( "http://dev.spatialdatacapture.org:8896/data/" + direction +"/"+TaxiType+"/" + weekday + "/" + hour, function( data ){
      $.each(data, function(k,v){
        filtered_data.push(v);
      });
      geoJsonLayer.setStyle(style);
    });

  })

  // weekday
  document.getElementById('weekday-slider').addEventListener('input',function(e){
    weekday = parseInt(e.target.value);
    // converting 0-6 weekday
    if(weekday == 0){var weekday_text = 'SUN'};
    if(weekday == 1){var weekday_text = 'MON'};
    if(weekday == 2){var weekday_text = 'TUE'};
    if(weekday == 3){var weekday_text = 'WED'};
    if(weekday == 4){var weekday_text = 'THR'};
    if(weekday == 5){var weekday_text = 'FRI'};
    if(weekday == 6){var weekday_text = 'SAT'};    
    // update text in the UI
    document.getElementById('active-weekday').innerText = weekday_text;

    filtered_data = [];
    $.getJSON( "http://dev.spatialdatacapture.org:8896/data/" + direction +"/"+TaxiType+"/" + weekday + "/" + hour, function( data ){
      $.each(data, function(k,v){
        filtered_data.push(v);
      });
      geoJsonLayer.setStyle(style);
    });

  })


  //////////////////////////////////////// functions ///////////////////////////////////
  function getColor(d) {
    return d > 900? '#414045':
           d > 700? '#504b6b':
           d > 500? '#604e82':
           d > 300? '#714d97':
           d > 200? '#80519f':
           d > 150? '#9f5ca1':
           d > 110? '#b062a0':
           d > 80 ? '#be659d':
           d > 50 ? '#e07591':
           d > 20 ? '#ed7e87':
           d > 10 ? '#f88d87':
           d > 6 ? '#faa086':
           d > 4 ? '#ffb38f':
           d > 2 ? '#ffc89f':
           d > 1  ? '#ffdbab':
           d > 0.5  ? '#fceaba':
                     '#fdfccc';
  }

  function getIDColor(ID) {
    var color;
    for (var i = 0; i < filtered_data.length; i++) {
      if (filtered_data[i].TaxiZoneID === ID) {
        color = getColor(filtered_data[i].hourly_count);
        break
      }
      else {color = '#fdfccc'}
    }
    return color;
  }

  function getIDCount(ID){
    var count;
    for (var i=0; i < filtered_data.length;i++) {
      if (filtered_data[i].TaxiZoneID === ID) {
        count = filtered_data[i].hourly_count;
        break
      }
      else {count = 0}
    }
    return count;
  }
 
  // polygon style
  function style(feature) {
    return {
        fillColor: getIDColor(feature.properties.locationid),
        weight: 1,
        opacity: 0.65,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.9
    };
  }

  // high light
  function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 2,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }

    info.update(layer.feature.properties);
  }

  // remove high light
  function resetHighlight(e) {
    geoJsonLayer.resetStyle(e.target);
    info.update();
  }

 
  // get chart data
  function chart_data(e){
    var layer = e.target;
    var TaxiZoneID = layer.feature.properties.locationid;
    var yellow_count = 0;
    var green_count = 0;
    var uber_count = 0;
    var lyft_count = 0;
    $.getJSON("http://dev.spatialdatacapture.org:8896/data2/" + direction +"/"+ TaxiZoneID + "/" + weekday + "/" + hour,function(data){
      $.each(data,function(k,v){
        // console.log(v);
        if(v.TaxiType === 6){yellow_count=v.hourly_count} 
        if(v.TaxiType === 5){green_count=v.hourly_count} 
        if(v.TaxiType === 2){uber_count=v.hourly_count} 
        if(v.TaxiType === 3){lyft_count=v.hourly_count}
      })
      var div = $('<div id="chart1" style="width: 240px; height: 150px;"></div>')[0];
      layer.bindPopup(div).openPopup();
      var chart = new Charts.BarChart('chart1',{
        bar_spacing: 40,
        bar_color: '#be659d',
      });
      chart.add({
        label: " Yellow",
        value: yellow_count
      });
      chart.add({
        label: "Green",
        value: green_count
      });
      chart.add({
        label: "Uber",
        value: uber_count
      });  
      chart.add({
        label: "Lyft",
        value: lyft_count
      });
      chart.draw();

    })
  }



  // add listeners on our layer
  function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: chart_data
    });    
  }




  

  ////////////////////////////// Custom Info Control ///////////////////////////////
  var info = L.control();

  info.onAdd = function (mymap) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
  };

  // method that we will use to update the control based on feature properties passed
  info.update = function (props) {
    this._div.innerHTML = '<strong>Hourly Pick-Ups / Drop-Offs <br>Spring 2018</strong><br>' +  (props ?
        '<b>' + props.zone  + '</b><br />' + getIDCount(props.locationid)
        : 'Try To Hover Over And Click On The Taxi Zone!');
  };

  info.addTo(mymap);