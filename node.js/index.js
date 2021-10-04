const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser')
const { User } = require("./models/User")
const cookieParser = require('cookie-parser')

const config = require('./config/key')

// application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }))


//application/json
app.use(express.json())
app.use(cookieParser())

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI)
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


app.post('/login', (req, res) => {
    // 요청된 이메일을 데이터 베이스에서 찾기
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user) {
            return res.json({ loginSuccess: false, message: "입력된 이메일에 해당하는 유저가 없습니다." })
        }
        // 요청된 이메일이 데이터 베이스에 있다면 비밀번호가 올바른지 확인하기
        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch) {
                return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다" })
            }
            // 비밀번호가 올바르다면 토큰 생성하기
            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err)

                //토큰 저장하기 (쿠키, 로컬 스토리지)
                res.cookie("x_auth, user.token")
                    .status(200)
                    .json({ loginSuccess: true, userId: user._id })
            })
        })
    })
})

    
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
