

const publicVapidKey = 'BGToL6-jMwzpnTHHG-rrEgyof2eDSPhryokIxmzbHdybWXQsfSYkn_K0-3LxJ_u2adMP2E9W3JjSdMT88dzBwEQ';

//check for the service worker

//navigator is basically api for the browser for itself
if('serviceWorker' in navigator){
    send().catch(err => console.error(err));
}

//register service worker, register push , send push
async function send(){
    console.log('Registering service worker ...');
    const register = await navigator.serviceWorker.register('./worker.js' ,{
        scope:'/'
    });
    console.log('Service worker Registere...');

    //Register Push
    console.log('Register push...');
    const subscription = await register.pushManager.subscribe({
        userVisibleOnly:true,
        applicationServerKey:urlBase64ToUint8Array(publicVapidKey)
    });
    console.log('Push Register...');

    //Send Push notification

    console.log('Sending Push ...');
    await fetch('/subscribe',{
        method: 'POST',
        body: JSON.stringify(subscription),
        headers : {
            'content-type':'application/json'
        }
    });
    console.log('Push Send...'); 

}

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');
  
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
  
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }