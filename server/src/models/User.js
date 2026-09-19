import mongoose from "mongoose";
import bcrypt from "bcryptjs";


const userSchema =
  new mongoose.Schema(
    {
      firstName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50,
      },

      lastName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50,
      },

      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
      },

      password: {
        type: String,
        required: true,
        minlength: 6,
        select: false,
      },

      role: {
        type: String,

        enum: [
          "candidate",
          "recruiter",
          "hr_admin",
          "owner",
        ],

        default: "candidate",
      },

      isActive: {
        type: Boolean,
        default: true,
      },

      lastLogin: {
        type: Date,
        default: null,
      },
    },

    {
      timestamps: true,
    }
  );


// =====================================================
// HASH PASSWORD
// =====================================================

userSchema.pre(
  "save",
  async function (next) {

    if (
      !this.isModified(
        "password"
      )
    ) {
      return next();
    }


    const salt =
      await bcrypt.genSalt(12);


    this.password =
      await bcrypt.hash(
        this.password,
        salt
      );


    next();
  }
);


// =====================================================
// COMPARE PASSWORD
// =====================================================

userSchema.methods.comparePassword =
  async function (
    enteredPassword
  ) {

    return bcrypt.compare(
      enteredPassword,
      this.password
    );
  };


// =====================================================
// REMOVE PASSWORD FROM JSON
// =====================================================

userSchema.methods.toJSON =
  function () {

    const user =
      this.toObject();


    delete user.password;


    return user;
  };


const User =
  mongoose.model(
    "User",
    userSchema
  );


export default User;