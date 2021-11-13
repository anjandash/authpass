const button = document.getElementById("getDetails");
const details = document.getElementById("details");
const authenticating = document.getElementById("authenticating");

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

// sleep time expects milliseconds
function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

button.addEventListener("click", async () => {
  try {

    // Declaring the service we want
    authpass_service_uuid = "EABC4F75-8967-4234-A483-9660A8F32AB1".toLowerCase()
    gpass_service_uuid = "00001802-0000-1000-8000-00805F9B34FB".toLowerCase()

    // "00001803-0000-1000-8000-00805F9B34FB".toLowerCase() //

    // Request the Bluetooth device through browser
    const device = await navigator.bluetooth.requestDevice({
      optionalServices: [gpass_service_uuid],
      acceptAllDevices: true,
    });

    // Connect to the GATT server
    // We also get the name of the Bluetooth device here
    let deviceId = device.gatt.device.id;
    let deviceName = device.gatt.device.name;
    
    const server = await device.gatt.connect();
    let connStatus = device.gatt.device.gatt.connected;

    serviceUuid = gpass_service_uuid
    const service = await server.getPrimaryService(serviceUuid);
    const characteristics = await service.getCharacteristics();
    const characteristicsUuid = characteristics.map(c => c.uuid).join('\n' + ' '.repeat(19));
    
    console.log('> Device Id: ' + deviceId)
    console.log('> Device Name: ' + deviceName)
    console.log('> Connection Status: ' + connStatus)
    console.log('> Characteristics: ' + characteristicsUuid);

    authenticating.innerHTML = characteristicsUuid
    //getDetails.parentNode.removeChild(elem);

    //validating user token 


    sleep(1000).then(() => {
        details.innerHTML = "SUCCESSFULLY AUTHENTICATED"
        window.location.href="profile.html";
    });

  } catch (err) {
    console.log(err);
    alert("An error occured while fetching device details");
  }
});