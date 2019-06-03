function duration(borough_name,filter_data){
Highcharts.chart('duration', {
    chart: {
        type: 'scatter',
        zoomType: 'xy',
		    backgroundColor:"transparent",
        width:880,
        height:550
    },
    title: {
        text: borough_name //+ ': '
    },
    subtitle: {
        text: 'Data source: New York City Taxi & Limousine Commission (TLC) 2018.03-2018.05'
    },
    xAxis: {
        title: {
            enabled: true,
            text: 'Average Duration Per Order (min)',
            textStyle:{
                fontSize:'10px',
            }
        },
		labels: {
            style: {
               fontSize:'10px'
                }
            },
        startOnTick: true,
        endOnTick: true,
        showLastLabel: true
    },
    yAxis: {
        title: {
            text: 'Overall Orders'
        },
		labels: {
            style: {
               fontSize:'10px'
                }
            },
		 gridLineWidth : 1,
         tickAmount: 8
    },
    legend: {
        layout: 'horizontal',
        align: 'center',
        verticalAlign: 'bottom',

        floating: false,
        backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || "transparent",
        borderWidth: 0
    },
    plotOptions: {
        scatter: {
            marker: {
                radius: 5,
                states: {
                    hover: {
                        enabled: true,
                        lineColor: 'rgb(100,100,100)'
                    }
                }
            },
            states: {
                hover: {
                    marker: {
                        enabled: false
                    }
                }
            },
            tooltip: {
                headerFormat: '<b>{series.name}</b><br>',
                pointFormat: '<b>TaxiZone</b>: {point.name}<br><b>Average Trip Duration</b>: {point.x} (min), <b>Order Counts</b>: {point.y}',
				valueDecimals: 2,
                enabled: true
            }
        }
    },
    series: [{
        name: 'Yellow',
        color: '#fed976',
        data: get_duration_data(filter_data, 'yellow')

    }, {
        name: 'Green',
        color: '#74c476',
        data: get_duration_data(filter_data, 'green')

    },{
        name: 'Uber',
        color: '#9e9ac8',
        data: get_duration_data(filter_data, 'uber')

    },{
        name: 'Lyft',
        color:  '#fc9272',
        data: get_duration_data(filter_data, 'lyft')
    }]
});
};

function get_duration_data(filter_data, type){
    var type_data = find_in_object(filter_data, {'type': type});
    var list1 = [];
    var array1 = {};
    for (var i=0; i < type_data.length ; i++) {
        array1 = JSON.stringify({
            name: type_data[i].name,
            x: type_data[i].x,
            y: type_data[i].y,
        })
        list1.push(JSON.parse(array1));
    }
    return list1;
}
