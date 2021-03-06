const Student = require('./students-model');

const checkUsernameExists = async (req, res, next) => {
      try{
        const student = await Student.findBy(req.body.username)
        if (!student) {
          next({ status: 401, message: 'Invalid credentials'})
        } else {
          req.student = student
          next()
        }
     } catch (err) {
       next(err)
     }
  }

  const checkClassIdExists = async (req, res, next) => {
    try{
        const classId = await Student.findByClassId(req.params.class_id)
        if (!classId) {
          next({ status: 401, message: `Class with id ${req.params.class_id} does not exist`})
        } else {
          next()
        }
     } catch (err) {
       next(err)
     }
}

  const validateAddResv = async (req, res, next) => {
      try{
        const existingReservations = await Student.getAllResv(req.decodedToken.student_id)
        const resvAlreadyExists = existingReservations.filter(resv => {
             return resv.class_id === Number(req.params.class_id)
        })
    
        if(resvAlreadyExists.length !== 0) {
            next({ status: 409, message: `You are already registered for this class`})
        } else{
            next()
        }
      } catch (err) {
          next(err)
      }
  }

  const checkClassFull = async (req, res, next) => {
    const requestedClass = await Student.findByClassId(req.params.class_id) 
    if(requestedClass.total_students >= requestedClass.max_students){
        next({
           message: `${requestedClass.class_name} is full, Please choose a different class`
       })
    } else {
       next()
    }
 }

  const checkUsernameAvailable = async (req, res ,next) => {
      try{
        const student = await Student.findBy(req.body.username)
        if(student) {
            next({ status: 422, message: `${student.username} is not available, choose a different username.`})
        } else {
            next()
        }
      } catch (err) {
          next(err)
      }
  }

  function validateUser(req, res, next) {
    if(req.body.username
    && req.body.username.trim()
    && req.body.password)
    {
      req.body.username = req.body.username.trim();
      next();
    } else {
      next({
        status: 400,
        message: "username and password required"
      })
    }
  }

  module.exports = {
      checkUsernameExists,
      checkClassIdExists,
      checkUsernameAvailable,
      validateUser,
      validateAddResv,
      checkClassFull
  }