import mongoose from "mongoose";


// =====================================================
// CONTACT MESSAGE SCHEMA
// =====================================================

const contactMessageSchema = new mongoose.Schema(
  {
    // -------------------------------------------------
    // Sender Name
    // -------------------------------------------------

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },


    // -------------------------------------------------
    // Sender Email
    // -------------------------------------------------

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 150,
    },


    // -------------------------------------------------
    // Subject
    // -------------------------------------------------

    subject: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },


    // -------------------------------------------------
    // Message
    // -------------------------------------------------

    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },


    // -------------------------------------------------
    // Status
    // -------------------------------------------------

    status: {
      type: String,
      enum: [
        "new",
        "read",
        "replied",
        "archived",
      ],
      default: "new",
    },
  },

  {
    timestamps: true,
  }
);


// =====================================================
// INDEX
// =====================================================

contactMessageSchema.index({
  createdAt: -1,
});


// =====================================================
// MODEL
// =====================================================

const ContactMessage =
  mongoose.model(
    "ContactMessage",
    contactMessageSchema
  );


export default ContactMessage;