"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("./user");
const video_1 = require("./video");
// module.exports.User.hasMany(Video, { foreignKey: 'userId' });
// module.exports.Video.belongsTo(User, { foreignKey: 'userId' });
//After that, you can just import the associations in the file where you want to use them, for example, in your server file.
// export { User, Video };
// module.exports.User = User;
// User.hasMany(Video, { foreignKey: '_id' });
// module.exports.Video = Video;
// Video.belongsTo(User, { foreignKey: '_id' });
// define the foreign key relationship between the video and user tables
module.exports.Video = video_1.Video;
video_1.Video.belongsTo(user_1.User, {
    foreignKey: 'userId',
    targetKey: '_id'
});
