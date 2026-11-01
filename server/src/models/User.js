import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { isStrongPassword } from "../utils/passwordPolicy.js";

const candidateProfileSchema = new mongoose.Schema(
  {
    phone: { type: String, trim: true, default: "", maxlength: 30 },
    location: { type: String, trim: true, default: "", maxlength: 200 },
    address: { type: String, trim: true, default: "", maxlength: 500 },
    headline: { type: String, trim: true, default: "", maxlength: 200 },
    summary: { type: String, trim: true, default: "", maxlength: 5000 },
    skills: { type: [String], default: [] },
    experience: { type: Number, default: 0, min: 0, max: 70 },
    education: { type: String, trim: true, default: "", maxlength: 3000 },
    linkedinUrl: { type: String, trim: true, default: "", maxlength: 1000 },
    githubUrl: { type: String, trim: true, default: "", maxlength: 1000 },
    portfolioUrl: { type: String, trim: true, default: "", maxlength: 1000 },
    resume: {
      originalName: { type: String, default: "" },
      fileName: { type: String, default: "" },
      filePath: { type: String, default: "" },
      mimeType: { type: String, default: "" },
      uploadedAt: { type: Date, default: null },
    },
  },
  { _id: false },
);

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
        minlength: 8,
        validate: {
          validator: isStrongPassword,
          message:
            "Password must be at least 8 characters and include uppercase and lowercase letters, a number, and a special character",
        },
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

      candidateProfile: {
        type: candidateProfileSchema,
        default: () => ({}),
        select: false,
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
    if (user.candidateProfile?.resume) {
      delete user.candidateProfile.resume.filePath;
    }


    return user;
  };


const User =
  mongoose.model(
    "User",
    userSchema
  );


export default User;