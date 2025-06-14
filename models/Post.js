import mongoose from 'mongoose';

const post = {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: String,
    description: String,
    image: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}

const PostSchema = new mongoose.Schema(post, {
    timestamps: true,
    toJSON: {
        transform: function (doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v; // Don't return version key
        }
    }
});

export default mongoose.model('Post', PostSchema);
