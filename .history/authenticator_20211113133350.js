const button = document.getElementById("getDetails");
const new_button = document.getElementById("newConn");

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

function connectToBluetoothDevice(device) {
    //const abortController = new AbortController();
  
    let deviceConnectPromise = new Promise((resolve, reject) => {
      device.addEventListener('advertisementreceived', evt => {
        //abortController.abort();
        device.gatt.connect()
            .then(gattServer => resolve(gattServer))
            .catch(error => reject(error));

        let deviceId = device.gatt.device.id;
        let deviceName = device.gatt.device.name;
        let connStatus = device.gatt.device.gatt.connected;
        console.log('> CDevice Id: ' + deviceId)
        console.log('> CDevice Name: ' + deviceName)

        
      }, {once: true});
    });
  
    device.watchAdvertisements({signal: abortController.signal});
    return deviceConnectPromise;
}

new_button.addEventListener("click", async () => {

        // Get permitted devices.
        let devices = await navigator.bluetooth.getDevices();

        // These devices may not be powered on or in range, so scan for
        // advertisement packets from them before connecting.
        for (let device of devices) {

            let deviceId = device.gatt.device.id;
            let deviceName = device.gatt.device.name;     
            
            console.log(window.localStorage.getItem('test'))
            if (deviceName == "Spass") {
                if (deviceId == window.localStorage.getItem('deviceId')){
                    
                    console.log("success")

                    authenticating.innerHTML = characteristicsUuid
                    window.localStorage.setItem('test', deviceId);
                    console.log(deviceId)
                
                    // validating user token 
                    sleep(1000).then(() => {
                        details.innerHTML = "SUCCESSFULLY AUTHENTICATED"
                        window.location.href="profile.html";
                    });
                
                }

            }
                     
        }

})


button.addEventListener("click", async () => {
  try {

    // Declaring the service we want
    authpass_service_uuid = "EABC4F75-8967-4234-A483-9660A8F32AB1".toLowerCase()
    // gpass_service_uuid = "00001802-0000-1000-8000-00805F9B34FB".toLowerCase()

    // "00001803-0000-1000-8000-00805F9B34FB".toLowerCase() //

    // Request the Bluetooth device through browser
    const device = await navigator.bluetooth.requestDevice({
      optionalServices: [authpass_service_uuid],
      acceptAllDevices: true,
    });

    // Connect to the GATT server
    // We also get the name of the Bluetooth device here
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

    // validating user token 
    sleep(1000).then(() => {
        details.innerHTML = "SUCCESSFULLY AUTHENTICATED"
        window.location.href="profile.html";
    });

  } catch (err) {
    console.log(err);
    alert("An error occured while fetching device details");
  }
});