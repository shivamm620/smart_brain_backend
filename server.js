const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const e = require('express');
const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password: 'shivam',
      database : 'smart_brain',

    }
  });
  /* console.log(db.select(' * ' ).from('users')); */
db.select(' * ' ).from('users').then(data =>{
    console.log(data);
})
const app = express();
/* const database ={
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
} */
app.use(bodyParser.json());
app.use(cors());

app.get('/' , (req,res)=>{
    res.send(database.user)
})
app.post('/singin', (req,res)=>{
    db.select('email', 'hash').from('login')
    .where('email','=',req.body.email)
    .then(data=>{
        const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
        if(isValid){
            return db.select('*').from('users')
            .where('email', '=', req.body.email)
            .then(user=>{
                res.json(user[0])
            })
            .catch(err => res.status(400).json('unable to get user'))
        }
        else{
            res.status(400).json('wrong credentials')
        }
    })
    .catch(err => res.status(400).json('wrong credentials'))
})
app.post("/register",(req,res)=>{
    const {email, name , password} = req.body;
    const hash =  bcrypt.hashSync(password);
    db.transaction(trx =>{
        trx.insert({
            hash: hash,
            email : email
        })
        .into('login')
        .returning('email')
        .then(loginEmail =>{
            return trx ('users')
            .returning('*')
    .insert({
        email:loginEmail[0],
        name:name,
        joined: new Date()
    }).then(user =>{
        res.json(user[0])
    })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(err => res.status(400).json('unable to register')) 
})
app.get("/profile/:id",(req,res)=>{
    const {id} = req.params
    db.select('*').from('users').where({
        id:id
    }).then(user =>{
        if(user.length){
            res.json(user[0])
        }else{
            res.status(400).json('not found')
        }
    }).catch(err => res.status(400).json('getting err user'))
})
app.put('/image' ,(req,res) =>{
    const {id} = req.body;
    db('users').where('id' ,'=', id)
    .increment( "entries" , 1)
    .returning('entries')
    .then(entries =>{
        res.json(entries[0])
    }).catch(err => res.status(400).json('unable to count'))

})
app.listen(6000 ,()=>{
    console.log("app is running on port 6000");
})
