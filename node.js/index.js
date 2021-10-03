const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser');
const { User } = require("./models/User");

// application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));


//application/json
app.use(express.json());

const mongoose = require('mongoose')
mongoose.connect('mongodb://minseon:2086@nodejsbasic-shard-00-00.ycong.mongodb.net:27017,nodejsbasic-shard-00-01.ycong.mongodb.net:27017,nodejsbasic-shard-00-02.ycong.mongodb.net:27017/nodejsbasic?ssl=true&replicaSet=atlas-iv1wzl-shard-0&authSource=admin&retryWrites=true&w=majority')
.then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err))

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.post('/register', (req, res) => {
    // 회원가입할 때 필요한 정보들을 client에서 가져오면
    // 그것들을 데이터 베이스에 넣어준다.

    const user = new User(req.body)

    user.save((err, userInfo) => {
        if (err) return res.json({ success: false, err })
        return res.status(200).json({ success: true })
    })
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
