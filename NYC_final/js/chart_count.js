function count(borough_name,filter_data){
	Highcharts.chart('container', {
		chart: {
			zoomType: 'xy',
			backgroundColor:"transparent",
			width:910,
			height:550,
		},
		title: {
				text: borough_name //+ ': Pick-ups'
		},
		subtitle: {
				text: 'Data source: New York City Taxi & Limousine Commission (TLC) 2018.03-2018.05'
		},
		yAxis: {
				title: {
						text: 'Hourly Order Counts'
				}
		},
		legend: {
			align:'center'
		},
		xAxis: {
			title: {
					text: 'Timeline (24/7)'
			},
			categories: ['Mon 00:00','Mon 01:00','Mon 02:00','Mon 03:00','Mon 04:00','Mon 05:00',
			'Mon 06:00','Mon 07:00','Mon 08:00','Mon 09:00','Mon 10:00','Mon 11:00','Mon 12:00',
			'Mon 13:00','Mon 14:00','Mon 15:00','Mon 16:00','Mon 17:00','Mon 18:00','Mon 19:00',
			'Mon 20:00','Mon 21:00','Mon 22:00','Mon 23:00','Tue 00:00','Tue 01:00','Tue 02:00',
			'Tue 03:00','Tue 04:00','Tue 05:00','Tue 06:00','Tue 07:00','Tue 08:00','Tue 09:00',
			'Tue 10:00','Tue 11:00','Tue 12:00','Tue 13:00','Tue 14:00','Tue 15:00','Tue 16:00',
			'Tue 17:00','Tue 18:00','Tue 19:00','Tue 20:00','Tue 21:00','Tue 22:00','Tue 23:00',
			'Wed 00:00','Wed 01:00','Wed 02:00','Wed 03:00','Wed 04:00','Wed 05:00','Wed 06:00',
			'Wed 07:00','Wed 08:00','Wed 09:00','Wed 10:00','Wed 11:00','Wed 12:00','Wed 13:00',
			'Wed 14:00','Wed 15:00','Wed 16:00','Wed 17:00','Wed 18:00','Wed 19:00','Wed 20:00',
			'Wed 21:00','Wed 22:00','Wed 23:00','Thu 00:00','Thu 01:00','Thu 02:00','Thu 03:00',
			'Thu 04:00','Thu 05:00','Thu 06:00','Thu 07:00','Thu 08:00','Thu 09:00','Thu 10:00',
			'Thu 11:00','Thu 12:00','Thu 13:00','Thu 14:00','Thu 15:00','Thu 16:00','Thu 17:00',
			'Thu 18:00','Thu 19:00','Thu 20:00','Thu 21:00','Thu 22:00','Thu 23:00','Fri 00:00',
			'Fri 01:00','Fri 02:00','Fri 03:00','Fri 04:00','Fri 05:00','Fri 06:00','Fri 07:00',
			'Fri 08:00','Fri 09:00','Fri 10:00','Fri 11:00','Fri 12:00','Fri 13:00','Fri 14:00',
			'Fri 15:00','Fri 16:00','Fri 17:00','Fri 18:00','Fri 19:00','Fri 20:00','Fri 21:00',
			'Fri 22:00','Fri 23:00','Sat 00:00','Sat 01:00','Sat 02:00','Sat 03:00','Sat 04:00',
			'Sat 05:00','Sat 06:00','Sat 07:00','Sat 08:00','Sat 09:00','Sat 10:00','Sat 11:00',
			'Sat 12:00','Sat 13:00','Sat 14:00','Sat 15:00','Sat 16:00','Sat 17:00','Sat 18:00',
			'Sat 19:00','Sat 20:00','Sat 21:00','Sat 22:00','Sat 23:00','Sun 00:00','Sun 01:00',
			'Sun 02:00','Sun 03:00','Sun 04:00','Sun 05:00','Sun 06:00','Sun 07:00','Sun 08:00',
			'Sun 09:00','Sun 10:00','Sun 11:00','Sun 12:00','Sun 13:00','Sun 14:00','Sun 15:00',
			'Sun 16:00','Sun 17:00','Sun 18:00','Sun 19:00','Sun 20:00','Sun 21:00','Sun 22:00',
			'Sun 23:00'],
			tickInterval:12

		},
		legend: {
				layout: 'horizontal',
				align: 'center',
				verticalAlign: 'bottom'
		},
		plotOptions: {
				series: {
						label: {
								connectorAllowed: false
						},
				}
		},
		series: [{
			name: 'Yellow_Weekdays',
			color: '#fed976',
      data: get_weekday_data(filter_data,'yellow'),
      lineColor: '#fed976'
  }, {
      name: 'Yellow_Weekends',
			color : '#fd8d3c',
      data: get_weekend_data(filter_data,'yellow'),
      lineColor : '#fd8d3c'

  }, {
      name: 'Green_Weekdays',
			color: '#74c476',
      data: get_weekday_data(filter_data,'green'),
      lineColor: '#74c476'
  }, {
      name: 'Green_Weekends',
			color : '#238b45',
      data: get_weekend_data(filter_data,'green'),
      lineColor : '#238b45'
  },{
      name: 'Uber_Weekdays',
			color: '#9e9ac8',
      data: get_weekday_data(filter_data,'uber'),
      lineColor: '#9e9ac8'
  }, {
      name: 'Uber_Weekends',
			color : '#54278f',
      data: get_weekend_data(filter_data,'uber'),
      lineColor : '#54278f'
  }, {
      name: 'Lyft_Weekdays',
			color: '#fc9272',
      data: get_weekday_data(filter_data,'lyft'),
      lineColor: '#fc9272'
  }, {
      name: 'Lyft_Weekdends',
			color : '#cb181d',
      data: get_weekend_data(filter_data,'lyft'),
      lineColor : '#cb181d'
  }],
		responsive: {
				rules: [{
						condition: {
								maxWidth: 500
						},
						chartOptions: {
								legend: {
										layout: 'horizontal',
										align: 'center',
										verticalAlign: 'bottom'

								}
						}
				}]
		}
});
};

function get_weekday_data(filter_data,type){
	var type_data = find_in_object(filter_data, {'type': type});
	var list1 = [];
	var list2 = [];
	for (var i=0; i < 121; i++) {
      list2 = [];
      list2.push(i);
      list2.push(type_data[i].hourly_count);
      list1.push(list2);
    }
    return list1;
}

function get_weekend_data(filter_data,type){
  var type_data = find_in_object(filter_data, {'type': type});
  var list1 = [];
  var list2 = [];
  for (var i=120; i < 168; i++) {
      list2 = [];
      list2.push(i);
      list2.push(type_data[i].hourly_count);
      list1.push(list2);
    }
    return list1;
}
