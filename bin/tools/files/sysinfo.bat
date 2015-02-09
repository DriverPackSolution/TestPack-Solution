@Echo off
Echo GET INFO...

Call echo ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ >> ERROR.BUG
For /F "Tokens=1,3* Delims=,:" %%A In ('WMIC CPU GET Name^,MaxClockSpeed /FORMAT:CSV^|FindStr .^|More +1^|FindStr /n .') Do Call echo CPU:		%%C, %%B MHz >> ERROR.BUG
For /F "Tokens=1,3 Delims==:" %%A In ('WMIC COMPUTERSYSTEM GET TotalPhysicalMemory /VALUE^|FindStr .^|FindStr /n .') Do Call echo RAM:		%%B bytes >> ERROR.BUG
Call echo _______________________________________________________________________________ >> ERROR.BUG
For /F "Tokens=1,3* Delims=,:" %%A In ('WMIC OS GET Caption^,CSDVersion /FORMAT:CSV^|FindStr .^|More +1^|FindStr /n .') Do Call echo OS:		%%B, %%C >> ERROR.BUG
For /F "Tokens=1,3* Delims=,:" %%A In ('WMIC BASEBOARD GET Manufacturer^,Product /FORMAT:CSV^|FindStr .^|More +1^|FindStr /n .') Do Call echo MOTHERBOARD:	%%B, %%C >> ERROR.BUG

For /F "Tokens=1,3* Delims=,:" %%A In ('WMIC BIOS GET Manufacturer^,Name /FORMAT:CSV^|FindStr .^|More +1^|FindStr /n .') Do Call echo BIOS:		%%B, %%C >> ERROR.BUG
For /F "Tokens=1,3 Delims==:" %%A In ('WMIC DISKDRIVE Where InterfaceType^=^'IDE^' GET Model /VALUE^|FindStr .^|FindStr /n .') Do Call echo HDD:		%%B >> ERROR.BUG
For /F "Tokens=1,3* Delims=,:" %%A In ('WMIC path Win32_VideoController GET Name^,AdapterRAM /FORMAT:CSV^|FindStr .^|More +1^|FindStr /n .') Do Call echo VIDEOCARD:	%%C, %%B bytes RAM >> ERROR.BUG
For /F "Tokens=1,3 Delims==:" %%A In ('WMIC path Win32_NetworkAdapter Where ^"AdapterTypeId^=0 And NetConnectionStatus^=2^" GET Name /VALUE^|FindStr .^|FindStr /n .') Do Call echo NETWORK CARD:	%%B >> ERROR.BUG
For /F "Tokens=1,3 Delims==:" %%A In ('WMIC path Win32_SoundDevice GET Name /VALUE^|FindStr .^|FindStr /n .') Do Call echo SOUND CARD:	%%B >> ERROR.BUG