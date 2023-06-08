const internModel = require('../model/internModel')
const collegeModel = require('../model/collegeModel')
const validator = require('../util/validator')

// { name: {mandatory}, email: {mandatory, valid email, unique}, mobile: {mandatory, valid mobile number, unique}, collegeId: {ObjectId, ref to college model, isDeleted: {boolean, default: false}}}

const createIntern = async function (req, res) {
    try {
        const intern = req.body; 
        const { name, mobile, email, collegeName} = intern

        //validations
        if(!validator.isValidRequestBody(intern)){
            return res.status(400).send({ status: false, message: "No data is present in body" });
        }

        // { name: {mandatory}
        if(!name) {
            return res.status(400).send({ status: false, message: "Intern name is required" })
        }

        // email: {mandatory, valid email, unique},
        if (!email) {
            return res.status(400).send({ status: false, message: "Email is required" });
        }
    
        if (!validator.isValid(email) || !validator.isValidEmail(email)) {
            return res.status(400).send({ status: false, message: "Enter a valid email" });
        }
        const isEmail = await internModel.findOne({ email: email });
        if (isEmail) {
            return res.status(400).send({ status: false, message: "Email address is already registered" });
        }

        // mobile: {mandatory, valid mobile number, unique},
        if (!mobile) {
            return res.status(400).send({ status: false, message: "mobileNumber is required" })
        }
        if (!validator.isValid(mobile) || !validator.isValidMobileNum(mobile)) {
            return res.status(400).send({ status: false, message: "enter valid mobileNumber" })
        }

        // collegeId: {ObjectId, ref to college model}

        const clgId = await collegeModel.findOne({name : collegeName})
        if(!clgId){
            return res.status(400).send({status : false, message : "enter correct college name"})
        }
        const collegeId = clgId._id

        if (!validator.isValidObjectId(collegeId)) {
            return res.status(400).send({status: false, message: `${collegeId} is not a valid collegeId`});
        }

        const createdata = {name, mobile, email, collegeId}
        const createIntern = await internModel.create(createdata)

        const {_id, __v, ...createInternData} =createIntern._doc

        res.status(201).send({status : true, data : createInternData})
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}


module.exports = { createIntern }

// ### POST /functionup/interns
// - Create a document for an intern.
// - Also save the collegeId along with the document. Your request body contains the following fields - { name, mobile, email, collegeName}
// - Return HTTP status 201 on a succesful document creation. Also return the document. The response should be a JSON object like [this](#Intern)

// - Return HTTP status 400 for an invalid request with a response body like [this](#error-response-structure)