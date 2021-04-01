console.log('Service worker Loaded');
self.addEventListener('push', event => {

    const promiseChain = self.registration.showNotification(event.data.text() , {
        body : 'Notification from Krishnanshu'
    });
  
    event.waitUntil(promiseChain);
  });