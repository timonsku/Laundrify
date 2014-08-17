#include <VirtualWire.h>

void setup()
{
    OSCCAL = 0xA0;
    Serial.begin(9600);	// Debugging only
    Serial.println("setup");

    // Initialise the IO and ISR
    vw_set_ptt_inverted(true); // Required for DR3100
    vw_setup(2000);	 // Bits per sec
    vw_set_rx_pin(1);
    vw_rx_start();       // Start the receiver PLL running
}

void loop()
{
    uint8_t buf[VW_MAX_MESSAGE_LEN];
    uint8_t buflen = VW_MAX_MESSAGE_LEN;

    if (vw_get_message(buf, &buflen)) // Non-blocking
    {
	int i;
        String test;
	Serial.print(",");
	for (i = 0; i < buflen; i++)
	{
	    Serial.print(buf[i], HEX);
	}
	Serial.println(",");
    }
}
