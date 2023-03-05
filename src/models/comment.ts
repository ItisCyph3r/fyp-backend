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

export const Comment = mongoose.model('Comment', CommentSchema);

// module.exports = Comment;