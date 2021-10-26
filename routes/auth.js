const router = require('express').Router();
const User = require('../model/User');
const { registerValidation, loginValidation } = require('../validation')
const bcrypt = require('bcryptjs');
const jwt = require('jwt');
//validation


router.post('/register', async (req, res) => {

    const { error } = registerValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    //check if user is in DB

    const emailExist = await User.findOne({ email: req.body.email })
    if (emailExist) {
        return res.status(400).send('Email already exists')
    }

    //hash password

    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(req.body.password,salt);

    //create new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword
    });


    try {
        const savedUser = await user.save();
        res.send({user:user._id})
    }
    catch (error) {
        res.status(400).send(error)
    }
})


//login


router.post('/login',async(req,res)=>{

    const {error}=loginValidation(req.body)

    if(error){
        return res.status(400).send(error.details[0].message)
    }

    const user = await User.findOne({email:req.body.email})
    if(!user){
        return res.status(400).send("Email doesn't exist")
    }

    const validPass=await bcrypt.compare(req.body.password,user.password)

    if(!validPass){
        return res.status(400).send('Invalid password')
    }

    const token = jwt.sign({_id:user_id})
    res.send('logged in!')



})




module.exports = router;