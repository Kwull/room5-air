/**
 * Created by Kwull on 01.12.2014.
 */
var config = require('./config');
var moment = require('moment');
var plotly = require('plotly')(config.plotly.userName, config.plotly.APIKey);

var data = [
    {name: "CO2", x:[], y:[], stream:{token: config.plotly.streams.CO2, maxpoints: config.plotly.maxPoints},
        line:{ shape:"spline", width:4 },
        mode:"lines"},
    {name: "Temperature", x:[], y:[], stream:{token: config.plotly.streams.Temperature, maxpoints: config.plotly.maxPoints},
        line:{
            dash:"solid",
            color:"rgb(255, 127, 14)",
            shape:"spline"
        },
        yaxis:"y2"},
    {name: "Humidity", x:[], y:[], stream:{token: config.plotly.streams.Humidity, maxpoints: config.plotly.maxPoints},
        line:{shape:"spline"},
        yaxis:"y3"
    }
];

var layout = {
    fileopt : "extend", filename : "AIRQ",
    world_readable: true,
    layout: {
        font:{
            size:12,
            color:"#444"
        },
        title: "Room5 AIR Quality",
        autosize:true,
        xaxis: {domain: [0, 0.87]},
        yaxis:{
            type:"linear",
            title:"CO2",
            titlefont:{
                size:20,
                color:"rgb(31, 119, 180)"
            },
            autorange:true,
            autotick:true,
            ticks:"inside",
            ticklen:5,
            tickwidth:4,
            tickcolor:"rgb(31, 119, 180)",
            showticklabels:true,
            tickfont:{
                size:20,
                color:"rgb(31, 119, 180)"
            },
            showline:true,
            linecolor:"rgb(31, 119, 180)",
            linewidth:4,
            anchor:"x",
            side:"left"
        },
        yaxis2:{
            type:"linear",
            title:"Temperature",
            titlefont:{
                size:14,
                color:"rgb(255, 127, 14)"
            },
            autorange:true,
            autotick:true,
            ticks:"inside",
            ticklen:5,
            tickwidth:2,
            tickcolor:"rgb(255, 127, 14)",
            showticklabels:true,
            tickfont:{
                size:12,
                color:"rgb(255, 127, 14)"
            },
            showline:true,
            linecolor:"rgb(255, 127, 14)",
            linewidth:2,
            anchor:"x",
            side:"right",
            overlaying:"y"
        },
        yaxis3:{
            type:"linear",
            title:"Humidity",
            titlefont:{
                size:14,
                color:"rgb(44, 160, 44)"
            },
            autorange:true,
            autotick:true,
            ticks:"inside",
            ticklen:5,
            tickwidth:2,
            tickcolor:"rgb(44, 160, 44)",
            showticklabels:true,
            tickfont:{
                size:12,
                color:"rgb(44, 160, 44)"
            },
            showline:true,
            linecolor:"rgb(44, 160, 44)",
            linewidth:2,
            anchor:"free",
            side:"right",
            position: 0.97,
            overlaying:"y"
        },
        showlegend:true
    }
};

var dataPlotter = {
    plotlyStreams: {},
    init: function(callback){
        var self = this;

        plotly.plot(data, layout, function (err, res) {
            if (err) console.log(err);
            console.log("View your streaming graph here: ", res.url);

            self.plotlyStreams = {
                "CO2": plotly.stream(config.plotly.streams.CO2, function (err, res) {
                    if (err) console.log(err);
                    console.log(res);
                }),
                "Temperature": plotly.stream(config.plotly.streams.Temperature, function (err, res) {
                    if (err) console.log(err);
                    console.log(res);
                }),
                "Humidity": plotly.stream(config.plotly.streams.Humidity, function (err, res) {
                    if (err) console.log(err);
                    console.log(res);
                })
            };

            callback();
        });
    },
    sendData: function(data){
        var date = moment().format("YYYY-MM-DD HH:mm:ss.SSS");

        var streamData = {x: date, y: data.CO2};
        this.plotlyStreams.CO2.write(JSON.stringify(streamData)+"\n");

        streamData = {x: date, y: data.Temperature};
        this.plotlyStreams.Temperature.write(JSON.stringify(streamData)+"\n");

        streamData = {x: date, y: data.Humidity};
        this.plotlyStreams.Humidity.write(JSON.stringify(streamData)+"\n");
    }
};

module.exports = dataPlotter;
