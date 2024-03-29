const messageModel = require('./../models/messageModel');

const createMessage = async (req, res) => {
  const { chatId, senderId, text } = req.body;

  const message = new messageModel({
    chatId,
    senderId,
    text,
  });

  try {
    const response = await message.save();
    res.status(200).send(response);
  } catch (err) {
    console.error(err);
    res.send(500).json(err);
  }
};

const getMessages = async (req, res) => {
  const { chatId } = req.params;

  try {
    const messages = await messageModel.find({ chatId });
    res.status(200).json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};

module.exports = { createMessage, getMessages };
