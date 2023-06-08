const mongoose = require('mongoose')

const internSchema = new mongoose.Schema({
    name: {
        type : String,
        required : true,
        trim : true
    },
    email: {
        type : String,
        required : true,
        unique : true,
        trim : true,
        validate: {
            validator: function(value) {
              // Regular expression to validate email format
              return  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value); //check
          
            },
                message: 'Invalid email format'
          }
    },
    mobile: {
            type: String,
            required: true,
            minLength: 9,
            maxLength: 10
    },
    collegeId: {
        type : mongoose.Schema.Types.ObjectId,
        ref : "college"
    },
    isDeleted: {
        type : Boolean, 
        default: false
    }

})


module.exports = mongoose.model('intern', internSchema)




// { name: {mandatory}, email: {mandatory, valid email, unique}, mobile: {mandatory, valid mobile number, unique}, collegeId: {ObjectId, ref to college model, isDeleted: {boolean, default: false}}