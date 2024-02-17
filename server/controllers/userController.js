const userModel = require('./../models/userModel');
const bcrypt = require('bcrypt');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const saltRounds = 10;

const createToken = (_id) => {
  const jwtKey = process.env.JWT_SECRET_KEY;
  return jwt.sign({ _id }, jwtKey, { expiresIn: '1d' });
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json('All fields are required.');
    if (!validator.isEmail(email))
      return res.status(400).json('Email is not valid.');
    if (!validator.isStrongPassword(password))
      return res.status(400).json('Password must be a strong password.');

    let user = await userModel.findOne({ email });
    if (user) return res.status(400).json('Email already exists.');

    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new userModel({ name, email, password: hashedPassword });
    await user.save();

    const token = createToken(user._id);
    res.status(200).json({ _id: user._id, name, email, token });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await userModel.findOne({ email });
    if (!user) return res.status(400).json('Invalid email or password.');

    const isValidpassword = await bcrypt.compare(password, user.password);
    if (!isValidpassword)
      return res.status(400).json('Invalid email or password.');

    const token = createToken(user._id);
    res.status(200).json({ _id: user._id, name: user.name, email, token });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

const findUser = async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await userModel.findById(userId);
    if (!user) res.status(500).send('User not found.');
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find();
    return res.status(200).send(users);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};
module.exports = { registerUser, loginUser, findUser, getAllUsers };
