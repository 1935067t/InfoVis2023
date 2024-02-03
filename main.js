let input_data;
let total_data;
let gender_data;
let scatter_plot;
let main_chart;
let sub_chart;
let bar_chart;
let filter = [];

d3.csv("https://1935067t.github.io/InfoVis2023/skipping.csv")
    .then( data => {
        input_data = data;
        input_data.forEach( d => {
            // d.time = +d.time;
            d.year = +d.year;
            // d.gender = +d.gender;
            d.rate = +d.rate;
        });

        total = input_data.filter(function (d) {
            return  d.gender == 'total';
          });

        not_total = input_data.filter(function (d) {
            return  d.gender != 'total';
          });
        // const color_scale = d3.scaleOrdinal( d3.schemeCategory10 );
        const color_scale = d3.scaleOrdinal()
                              .domain(['morning','lunch','dinner'])
                              .range(["#ff9900", "#0072c6", "#db4437"]);

        const main_scale = d3.scaleOrdinal()
                             .domain(['man','woman'])
                             .range(['blue','red']);

        main_chart = new LineChart( {
            parent: '#drawing_region_main',
            width: 400,
            height: 256,
            margin: {top:10, right:15, bottom:50, left:50},
            xlabel: 'year',
            ylabel: 'rate [%]',
            cscale: color_scale
        }, total );
        main_chart.update();

        sub_chart = new SubChart( {
            parent: '#drawing_region_sub',
            width: 400,
            height: 256,
            margin: {top:10, right:15, bottom:50, left:50},
            xlabel: 'year',
            ylabel: 'rate [%]',
            cscale: color_scale
        }, input_data );
        sub_chart.update();
    })
    .catch( error => {
        console.log( error );
    });

    

function Filter(time) {
    sub_chart.filter(time)
    sub_chart.update();
}
