#include <DHT22.h>
#include <stdio.h>

int DELAY=30; // in seconds

#define DHT22_PIN 2
#define LED_PIN 13
int CO2_ANALOG_PIN = A0; // voltage input from sensor

// for co2
#define READ_SAMPLE_INTERVAL         (50) //define the time interval(in milisecond) between each samples in 
#define READ_SAMPLE_TIMES            (5)  //define how many samples you are going to take in normal operation   

// Setup a DHT22 instance
DHT22 myDHT22(DHT22_PIN);
float temperature = 9999;
float humidity = 9999;
float humidityIndex = 9999;
int co2 = 9999; // co2 is the co2 concentration. Preset value for code checking

// Setting Sensor Calibration Constants
float v400ppm = 3.558;   //MUST BE SET ACCORDING TO CALIBRATION
float v40000ppm = 2.116; //MUST BE SET ACCORDING TO CALIBRATION
float deltavs = v400ppm - v40000ppm;
float A = deltavs/(log10(400) - log10(40000));
float B = log10(400);

void setup(void)
{
  delay(2000); // 2 seconds to init DHT22  
  
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN,LOW);
  
  Serial.begin(9600);
  pinMode(CO2_ANALOG_PIN, INPUT);
}

void loop(void)
{ 
  // read co2
  int data = MGRead(CO2_ANALOG_PIN);
  float voltage = data/204.6;  
  float power = ((voltage - v400ppm)/A) + B;
  float co2ppm = pow(10,power);
  co2 = co2ppm;
  
  // read temp and humidity
  DHT22_ERROR_t errorCode;
  
  errorCode = myDHT22.readData();
  switch(errorCode)
  {
    case DHT_ERROR_NONE:
      temperature = myDHT22.getTemperatureC();
      humidity = myDHT22.getHumidity();
      humidityIndex =  calculate_humidex(temperature, humidity);
      break;
    default:
    break;
  }
  
  String jsonString = "{\"CO2\":\"";
  jsonString += co2;
  jsonString +="\",\"Temperature\":\"";
  jsonString += temperature;
  jsonString +="\",\"Humidity\":\"";
  jsonString += humidity;
  jsonString +="\",\"HumidityIndex\":\"";
  jsonString += humidityIndex;
  jsonString +="\"}";

  // print it:
  Serial.println(jsonString);
  
  delay(DELAY*1000);
}

float calculate_humidex(float temperature, float humidity) {
  float e;

  e = (6.112 * pow(10,(7.5 * temperature/(237.7 + temperature))) * humidity/100); //vapor pressure

  float humidex = temperature + 0.55555555 * (e - 10.0); //humidex
  return humidex;
}

float MGRead(int mg_pin)
{
    int i;
    float v=0;
 
    for (i=0;i<READ_SAMPLE_TIMES;i++) {
        v += analogRead(mg_pin);
        delay(READ_SAMPLE_INTERVAL);
    }
    v = v/READ_SAMPLE_TIMES;
    return v;  
}
