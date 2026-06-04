// require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
// const mongoose = require('mongoose');
// const User = require('../models/User');

// const email = process.argv[2];

// if (!email) {
//   console.error('Usage: node scripts/create-admin.js <email>');
//   process.exit(1);
// }

// (async () => {
//   try {
//     await mongoose.connect(process.env.MONGODB_URI);
//     const user = await User.findOne({ email: email.toLowerCase() });

//     if (!user) {
//       console.error(`User with email "${email}" not found.`);
//       await mongoose.disconnect();
//       process.exit(1);
//     }

//     user.role = 'admin';
//     await user.save();

//     console.log(`User "${user.name}" (${user.email}) is now an admin.`);
//     await mongoose.disconnect();
//   } catch (error) {
//     console.error('Error:', error.message);
//     process.exit(1);
//   }
// })();
