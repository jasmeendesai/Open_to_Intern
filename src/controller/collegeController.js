const collegeModel = require('../model/collegeModel')
const internModel = require('../model/internModel')
const validpackage = require('valid-url')
const validator = require('../util/validator')


const createCollege = async function (req, res) {
    try {
        const clgData = req.body;
        const {name,fullName,logoLink} = clgData
        
        //validations
        if(!validator.isValidRequestBody(clgData)){
            return res.status(400).send({ status: false, message: "No data is present in body" });
        }

        // { name: { mandatory, unique, example iith},
        if(!name) {
            return res.status(400).send({ status: false, message: "College name is required" })
        }
        const colgName = await collegeModel.findOne({name : name})
        if(colgName){
            return res.status(400).send({ status: false, message: "College name is already registered" });
        }

        //fullName: {mandatory, example `Indian Institute of Technology, Hyderabad`},
        if(!fullName) {
            return res.status(400).send({ status: false, message: "fullName of College is required" })
        }

        // logoLink: {mandatory}
        if(!logoLink) {
            return res.status(400).send({ status: false, message: "logoLink of College is required" })
        }
        if(!validpackage.isWebUri(logoLink)){
            return res.status(400).send({ status: false, message: "Enter valid logoLink" })
        }

        const createClg = await collegeModel.create(clgData)
        const {_id, __v, ...createClgData} =createClg._doc

        return res.status(201).send({status : true, data : createClgData})
    }catch(error){
        return res.status(500).send({ status: false, message: error.message })
    }
}

const getCollege = async function (req, res) {
    try{
        const filter = req.query
        filter.isDeleted = false;

        const getClg = await collegeModel.findOne(filter)
        // console.log(getClg)

        if(!getClg){
            return res.status(404).send({ status: false, message: "No college found" })
        }

        const interndata = await internModel.find({collegeId : getClg._id},{__v : 0, collegeId : 0, isDeleted : 0}) //
        const {_id, __v, isDeleted ,...data} = getClg._doc
        data.interns = interndata

        if(interndata.length == 0){
            data.interns = "No intern found"
            return res.status(200).send({ status: true, data : data})
        }

        return res.status(200).send({status : true, data : data})
    }catch(error){
        return res.status(500).send({ status: false, message: error.message })
    }
}


// ### GET /functionup/collegeDetails
// - Returns the college details for the requested college (Expect a query parameter by the name `collegeName`. This is anabbreviated college name. For example `iith`)
// - Returns the list of all interns who have applied for internship at this college.
// - The response structure should look like [this](#college-details)


module.exports = { createCollege, getCollege }