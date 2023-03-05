"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comment = void 0;
const mongoose = require('mongoose');
const { Schema } = mongoose;
const CommentSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    parentId: {
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    },
    childComments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
}, {
    timestamps: true
});
exports.Comment = mongoose.model('Comment', CommentSchema);
// module.exports = Comment;
