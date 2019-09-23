# Node.js module for Open Thermal Camera
Node.js module that communicates with the Open Thermal Camera (OTC) via [serialport](https://www.npmjs.com/package/serialport). OTC communications [protocol](https://github.com/openthermalcamera/Protocol/blob/master/protocol.md) uses [COBS](https://en.wikipedia.org/wiki/Consistent_Overhead_Byte_Stuffing), for which we have used [cobs](https://www.npmjs.com/package/cobs) Node.js module.

### Installation
Module is available on [npm](https://www.npmjs.com/package/otc)
```sh
$ npm install otc
```
### Examples
There are a few examples of how to use the module in **/test-otc** and **/test-mlx**
MLX90640.js is used for parameter extraction and getting temperature from bytes. It is just a JS version of original [MLX90640 library](https://github.com/melexis/mlx90640-library) published by **Melexis**
### Interface
List of module exports. You can find the description of all interface calls on the [protocol](https://github.com/openthermalcamera/Protocol/blob/master/protocol.md) page.
- **connect**: Opens serial port. If no data is passed (VID, PID), it will use defaults VID and PID of OTC
- **sendPing**: interface call. Parameter: Ping value
- **getEE**: interface call
- **getFrameData**: interface call
- **setResolution**: interface call. Should use one of **resolution** enums
- **getResolution**: interface call
- **setRefreshRate**: interface call. Should use one of **refreshRate** enums
- **getRefreshRate**: interface call
- **setMode**: interface call. Should use one of **scanMode** enums
- **getMode**: interface call
- **setAutoFrameSending**: interface call. Should use one of **autoFrameSending** enums
- **getFirmwareVersion**: interface call
- **jumpToBootloader**: interface call
- **setCallbackForNewData**: In parameter you pass the function you want to be called when new temperature data is recieved. Example in **/test-otc**
- **getPortsList**: Returns a list of all serialports available
- **refreshRate**: "enum" for **setRefreshRate**
- **resolution**: "enum" for **setResolution**
- **scanMode**: "enum" for **setMode**
- **autoFrameSending**: "enum" for **setAutoFrameSending**
