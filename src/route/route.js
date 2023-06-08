const express = require('express')
const router = express.Router()

const clgController = require('../controller/collegeController')

const intnController = require('../controller/internController')



router.post('/functionup/colleges',clgController.createCollege);
router.get('/functionup/collegeDetails',clgController.getCollege);

router.post('/functionup/interns',intnController.createIntern);


router.use('*',(req, res) =>{
    res.status(400).send({status : false, message : "Invalid url"} )
})


module.exports = router