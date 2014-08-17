#include <VirtualWire.h>
#include "EmonLib.h"                   // Include Emon Library
EnergyMonitor emon1;                   // Create an instance
EnergyMonitor emon2; 
#define SensorPin1      3
#define SensorPin2      2
//#define filterSamples   33              // filterSamples should  be an odd number, no smaller than 3
//int sensSmoothArray1 [filterSamples];   // array for holding raw sensor values for sensor1 
//int sensSmoothArray2 [filterSamples];   // array for holding raw sensor values for sensor2 

//int rawData1, smoothData1;  // variables for sensor1 data
//int rawData2, smoothData2;  // variables for sensor2 data

void setup(){
  //this is only valid for a certain attiny, rerun TinyTuner if ATTiny changes
  OSCCAL = 0x88;

  //Serial.begin(9600);
  vw_set_ptt_inverted(true); // Required for DR3100
  vw_setup(2000);	 // Bits per sec
  vw_set_tx_pin(0);
  //alive

  emon1.current(SensorPin1, 111.1);
  digitalWrite(0, true);
  delay(500);
  digitalWrite(0, false);
}
void loop(){       // test the digitalSmooth function
    double Irms = emon1.calcIrms(1480);
    
    //digitalWrite(1, HIGH);
    //if (rawData1 !=0 ){
    //Serial.println(Irms);
    char msg [8];
    itoa(Irms, msg,16);
    uint8_t buf[VW_MAX_MESSAGE_LEN];
    uint8_t buflen = VW_MAX_MESSAGE_LEN;
    
    vw_send((uint8_t *)msg, strlen(msg));
    vw_wait_tx(); // Wait until the whole message is gone
    //delay(10);
    //digitalWrite(1, LOW);
}
