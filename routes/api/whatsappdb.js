const express = require('express');

const messages = require('../../models/whatsappdb')

const router = express.Router();

router.post('/' , async(req , res) => {
    const {message , name , timestamp , received} = req.body;
    
    const message1 = new messages({
        name,
        message,
        timestamp,
        received
    });
    
    console.log(name , message , timestamp , received);
    await message1.save()
    res.status(200).send({msg : "done"})
    
})

router.get('/' , async(req , res) => {
    messages.find((err , data) => {
        if(err){
            res.status(500).send(err)
        }else{
            res.status(200).send(data);
        }
    })
})
module.exports = router;