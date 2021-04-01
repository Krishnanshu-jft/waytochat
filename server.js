//importing
const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const path = require('path');
const Pusher = require("pusher");
const cors = require('cors');
const { db } = require('./models/whatsappdb');
const webPush = require('web-push');
var subscription;
const pusher = new Pusher({
  appId: "1180302",
  key: "92f742fa8244cdba59f3",
  secret: "f2cd57dfd8aa48b1f68c",
  cluster: "ap2",
  useTLS: true
});
const localStorage = require('node-localstorage');
const { response } = require('express');

//app config
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(express.json({extended : false}));
app.use(cors());

//DB config
connectDB();
db.once('open' , () => {
    const msgcollection = db.collection('messages');
    const changeStream = msgcollection.watch();

    changeStream.on("change" , (change) =>{
        if(change.operationType === 'insert'){
            const messageDetails = change.fullDocument;
            pusher.trigger('messages','inserted',{
                name : messageDetails.name,
                message: messageDetails.message,
                received: messageDetails.received            }
            ).then(send => {
                const payload = change.fullDocument.message;
                webPush.sendNotification(subscription , payload)
               .catch(err => console.error(err));
            })
        }else{
            console.log('error triggering pusher');
        }
    })
})

//notification

// Set static path
app.use(express.static(path.join(__dirname,"clients")));

//api routes


app.use('/api/find' , require('./routes/api/whatsappdb'));
app.use('/api/messages' , require('./routes/api/whatsappdb'));




const publicVapidKey ='BGToL6-jMwzpnTHHG-rrEgyof2eDSPhryokIxmzbHdybWXQsfSYkn_K0-3LxJ_u2adMP2E9W3JjSdMT88dzBwEQ';
const privateVapidKey ='MwOywj1kXiYkrgzF-IKjtBbMDhb9vrsnZWeDHcXc-7Q';


//to identify who is sending the notification
webPush.setVapidDetails('mailto:krishnanshum41@gmail.com' , publicVapidKey , privateVapidKey);

//Subscribe Route
//responsibel for sending the message directly to the sevice worker

//so its going to be a post request
app.post('/subscribe' , (req , res) => {
    //Get pushSubscription object
    subscription = req.body;
    console.log(subscription)
    //send 201  - resource created
    res.status(201).json({});

    
});

//server static assests in production
if(process.env.NODE_ENV === 'production'){
    //set staticc folder
    app.use(express.static('client/build'));

    app.get('*' , (req , res) => {
        res.sendFile(path.resolve(__dirname,'client','build','index.html'));
    })
}

//listen
app.listen(port , () => console.log(`port is running at ${port}`));
