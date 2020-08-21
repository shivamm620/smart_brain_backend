const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const app = express();
const database ={
    user : [
        {
            id:'123',
            name:'shiva',
            gmail:'mahakalshiva@gmail.com',
            password:'vishnu',
            entries:0,
            joined: new Date(),
        },
        {
            id:'124',
            name:'krishna',
            gmail:'krishna@gmail.com',
            password:'shiva',
            entries:0,
            joined: new Date(),
        },
        
    ],
    login:[
        {
            id:'987',
            hash:'',
            email:'mahakalshiva@gmail.com'
        }
    ]
}
app.use(bodyParser.json());
app.use(cors());

app.get('/' , (req,res)=>{
    res.send(database.user)
})
app.post('/singin', (req,res)=>{
    if (req.body.gmail === database.user[0].gmail && 
        req.body.password=== database.user[0].password) {
        res.json(database.user[0])
    }else{
        res.status(400).json('not found')
    }
})
app.post("/register",(req,res)=>{
    const {email, name , password} = req.body;
/*     bcrypt.hash("bacon", null, null, function(err, hash) {
        console.log(hash);
    }); */
    
    database.user.push({
            id:'125',
            name:name,
            email:email,
            entries:0,
            joined: new Date(),
    })
    res.json(database.user[database.user.length-1])
})
app.get("/profile/:id",(req,res)=>{
    const {id} = req.params
    let found =false;
    database.user.forEach(user=>{
        if(user.id === id){
            found = true
            return res.json(user)
        }
    })
    if (!found){
        res.status(400).json('not found')
    }
})
app.put('/image' ,(req,res) =>{
    const {id} = req.body;
    let found =false;
    database.user.forEach(user=>{
        if(user.id === id){
            found = true
            user.entries++
            return res.json(user.entries)
        }
    })
    if (!found){
        res.status(400).json('not found')
    }

})
app.listen(6000 ,()=>{
    console.log("app is running on port 6000");
})
