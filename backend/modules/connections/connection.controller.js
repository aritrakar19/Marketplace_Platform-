const Connection = require('../../models/Connection');
const User = require('../../models/User');

exports.getConnections = async (req, res) => {
  try {
    const userId = req.user.firebaseUid;
    
    // Find all connections where the current user is either user1 or user2
    const connections = await Connection.find({
      $or: [{ user1: userId }, { user2: userId }]
    }).sort({ createdAt: -1 });

    // Extract the UIDs of the connected users
    const connectedUserIds = connections.map(conn => 
      conn.user1 === userId ? conn.user2 : conn.user1
    );

    if (connectedUserIds.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }

    // Fetch user profiles for the connected users
    const connectedUsers = await User.find({
      firebaseUid: { $in: connectedUserIds }
    });

    res.status(200).json({ success: true, data: connectedUsers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
