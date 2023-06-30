const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");

const register = async (req, res) => {
  const user = await User.create({ ...req.body });
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({
    user: {
      email: user.email,
      lastName: user.lastName, //ye dono cheeze nhi hai abhi register ke time bheji gyi
      location: user.location, //so we putted default values in it
      name: user.name,
      token,
    },
  });
};
//register se bas hamne document banaya (hashed password)
//and then we made its token jisme user ki id hai availaible,with his name
//then we send this user's details and token so he can use this to get other user items in jobs route

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("Invalid Credentials");
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Credentials");
  }
  // compare password
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({
    user: {
      email: user.email,
      lastName: user.lastName, //ye dono cheeze nhi hai abhi register ke time bheji gyi
      location: user.location, //so we putted default values in it
      name: user.name,
      token,
    },
  });
};
//isme bhi hamne toh pehle db mai email se banda find kiya
//phir uska password check kiya
//agr sahi then we make a token using user model instance method
//and send it to him so that he can accesss job routes functionality

//ye updateuser is an user authenticated request
//so need to add middleware to it

const updateUser = async (req, res) => {
  const { email, name, lastName, location } = req.body;
  if (!email || !name || !lastName || !location) {
    throw new BadRequestError("Please provide all values");
  }
  console.log(req.user);
  const user = await User.findOne({ _id: req.user.userId });
 
  //we can use findoneandupdate method and that will work amazingly fine

  //but here to learn the difference that user.save() method targets the prev.('save') hook
  //that we have defined in the user model
  //we use this approach
  //ab agr ye noramlly krnege the can't login again
  //as in our pre-Save hook hamne password ko hash kr diya tha save se pehle
  //yha agr save krege toh wo is document ka password wapas hash kr dega
  //then it won't be compare to candiatepassword tha we will pass from frontned
  //so add a check to that pre-save hook
  //ki agr password change nhi kiya toh hash mat krna and return

  user.email = email;
  user.name = name;
  user.location = location;
  user.lastName = lastName;

  await user.save();

  const token = user.createJWT();
  //since name bhi change ho skta hai and
  //name was part of payload that we used to
  //create token
  //so new token expect krega frontend 


  res.status(StatusCodes.OK).json({
    user: {
      email: user.email,
      lastName: user.lastName, //ye dono cheeze nhi hai abhi register ke time bheji gyi
      location: user.location, //so we putted default values in it
      name: user.name,
      token,
    },
  });
};
module.exports = {
  register,
  login,
  updateUser,
};
