/**
 * Created by Kwull on 01.12.2014.
 */

var config = {
    plotly:{
        userName: process.env.PL_USERNAME || "Kwull",
        APIKey: process.env.PL_APIKEY || "APIKey",
        maxPoints: 10000,
        streams: {
            CO2: process.env.PL_STREAM_CO2 || "Stream_CO2_key",
            Temperature: process.env.PL_STREAM_TEMPERATURE || "Stream_Temp_key",
            Humidity: process.env.PL_STREAM_HUMIDITY || "Stream_Hum_key"
        }
    }
};

module.exports = config;
