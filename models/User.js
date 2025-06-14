import mongoose from 'mongoose';

const User = {
    name: String,
    email: { type: String, unique: true },
    password: String,
    profileImage: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
};

const UserSchema = new mongoose.Schema(User, {
    timestamps: true,
    toJSON: {
        transform: function (doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.password; // Don't return password in JSON
            delete ret.__v; // Don't return version key
        }
    }
});

export default mongoose.model('User', UserSchema);
