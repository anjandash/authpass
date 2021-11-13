const new_conn_button = document.getElementById("newConn");
const existing_conn_button = document.getElementById("existingConn");

const details = document.getElementById("details");
const authenticating = document.getElementById("authenticating");


// sleep timer
function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

// check if bluetooth is enabled
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

existing_conn_button.addEventListener("click", async () => {
        let devices = await navigator.bluetooth.getDevices();
        for (let device of devices) {
            let deviceId = device.gatt.device.id;
            let deviceName = device.gatt.device.name;     
            
            if (deviceName == "Spass") {
                if (deviceId == window.localStorage.getItem('deviceId')){
                    console.log("success")
                    console.log(deviceId)
                    authenticating.innerHTML = window.localStorage.getItem('characteristicsUuid');
                
                    // Display token for demo / validation
                    // WARNING: To be removed in production
                    sleep(1000).then(() => {
                        details.innerHTML = "SUCCESSFULLY AUTHENTICATED"
                        window.location.href="profile.html";
                    });                
                }
            }       
        }
})


new_conn_button.addEventListener("click", async () => {
  try {

    // Declaring the service we want
    authpass_service_uuid = "EABC4F75-8967-4234-A483-9660A8F32AB1".toLowerCase()

    // Request the Bluetooth device through browser
    const device = await navigator.bluetooth.requestDevice({
      optionalServices: [authpass_service_uuid],
      acceptAllDevices: true,
    });

    // Connect to the GATT server
    let deviceId = device.gatt.device.id;
    let deviceName = device.gatt.device.name;
    const server = await device.gatt.connect();
    let connStatus = device.gatt.device.gatt.connected;

    serviceUuid = authpass_service_uuid
    const service = await server.getPrimaryService(serviceUuid);
    const characteristics = await service.getCharacteristics();
    const characteristicsUuid = characteristics.map(c => c.uuid).join('\n' + ' '.repeat(19));
    
    // console.log('> Device Id: ' + deviceId)
    // console.log('> Device Name: ' + deviceName)
    // console.log('> Connection Status: ' + connStatus)
    // console.log('> Characteristics: ' + characteristicsUuid);

    authenticating.innerHTML = characteristicsUuid
    window.localStorage.setItem('deviceId', deviceId);
    window.localStorage.setItem('characteristicsUuid', characteristicsUuid);
    console.log(deviceId)

    // TODO
    // validate characteristicsUuid against a list of trusted Uuids

    // Display token for demo / validation
    // WARNING: To be removed in production
    sleep(1000).then(() => {
        details.innerHTML = "SUCCESSFULLY AUTHENTICATED"
        window.location.href="profile.html";
    });

  } catch (err) {
    console.log(err);
    alert("An error occured while fetching device details");
  }
});