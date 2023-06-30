const {BadRequestError}=require('../errors');

const testUser =(req,res)=>{
    if(req.user.testUser){
    throw new BadRequestError('Test User. Read Only');
    }
    next();
}

module.exports=testUser;