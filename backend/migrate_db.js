const mongoose = require('mongoose');
const Conversation = require('./models/Conversation');
const Invite = require('./models/Invite');

mongoose.connect('mongodb://127.0.0.1:27017/marketplace_db').then(async () => {
  const invites = await Invite.find({ status: 'accepted' });
  for (let inv of invites) {
    const exist = await Conversation.findOne({
      participants: { $all: [inv.senderId, inv.receiverId] }
    });
    if (!exist) {
      await new Conversation({
        participants: [inv.senderId, inv.receiverId]
      }).save();
      console.log('Created conversation for', inv.senderId, inv.receiverId);
    }
  }
  console.log('Migration complete');
  process.exit(0);
});
