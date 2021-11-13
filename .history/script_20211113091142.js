const button = document.getElementById("getDetails");
const details = document.getElementById("details");

function isWebBluetoothEnabled() {
    document.getElementById('bluetoothState').innerText = 'Testing ...'
    if (!navigator.bluetooth) {
        console.log('Web Bluetooth API is not available in this browser!')
        document.getElementById('bluetoothState').innerText = 'Not available'
        return false
    }
    document.getElementById('bluetoothState').innerText = 'Available'
    return true
}

button.addEventListener("click", async () => {
  try {
    // Request the Bluetooth device through browser
    const device = await navigator.bluetooth.requestDevice({
      optionalServices: ["XYZ", "device_information"],
      optionalService: ["EABC4F75-8967-4234-A483-9660A8F32AB1".toLowerCase()]
      acceptAllDevices: true,
    });

    // // Connect to the GATT server
    // // We also get the name of the Bluetooth device here
    let deviceId = device.gatt.device.id;
    let deviceName = device.gatt.device.name;
    let connStatus = device.gatt.device.gatt.connected;
    const server = await device.gatt.connect();

    console.log('Getting Service...');
    serviceUuid = "EABC4F75-8967-4234-A483-9660A8F32AB1".toLowerCase()
    const service = await server.getPrimaryService(serviceUuid);
    
    // console.log('Getting Characteristics...');
    // // let characteristics;
    // // if (characteristicUuid) {
    // //   characteristics = await service.getCharacteristics(characteristicUuid);
    // // } else {
    //      characteristics = await service.getCharacteristics();
    // //}

    
    console.log(deviceId)
    console.log(deviceName)
    console.log(connStatus)

    console.log('> Characteristics: ' + characteristics.map(c => c.uuid).join('\n' + ' '.repeat(19)));


    // // Getting the services we mentioned before through GATT server
    // const batteryService = await server.getPrimaryService("battery_service");
    // const infoService = await server.getPrimaryService("device_information");

    // // Getting the current battery level
    // const batteryLevelCharacteristic = await batteryService.getCharacteristic(
    //   "battery_level"
    // );
    // // Convert recieved buffer to number
    // const batteryLevel = await batteryLevelCharacteristic.readValue();
    // const batteryPercent = await batteryLevel.getUint8(0);

    // // Getting device information
    // // We will get all characteristics from device_information
    // const infoCharacteristics = await infoService.getCharacteristics();

    // console.log(infoCharacteristics);

    // let infoValues = [];

    // const promise = new Promise((resolve, reject) => {
    //   infoCharacteristics.forEach(async (characteristic, index, array) => {
    //     // Returns a buffer
    //     const value = await characteristic.readValue();
    //     console.log(new TextDecoder().decode(value));
    //     // Convert the buffer to string
    //     infoValues.push(new TextDecoder().decode(value));
    //     if (index === array.length - 1) resolve();
    //   });
    // });

    // promise.then(() => {
    //   console.log(infoValues);
    //   // Display all the information on the screen
    //   // use innerHTML
    //   details.innerHTML = `
    //   Device Name - ${deviceName}<br />
    //   Battery Level - ${batteryPercent}%<br />
    //   Device Information:
    //   <ul>
    //     ${infoValues.map((value) => `<li>${value}</li>`).join("")}
    //   </ul> 
    // `;
    // });
  } catch (err) {
    console.log(err);
    alert("An error occured while fetching device details");
  }
});