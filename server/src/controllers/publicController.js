import Organization from "../models/Organization.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";
import ContactMessage from "../models/ContactMessage.js";


// =====================================================
// GET PUBLIC PLATFORM STATISTICS
// =====================================================

export const getPublicStats = async (
  req,
  res,
  next
) => {
  try {

    // -------------------------------------------------
    // Total organizations
    // -------------------------------------------------

    const totalOrganizations =
      await Organization.countDocuments();


    // -------------------------------------------------
    // Total jobs
    // -------------------------------------------------

    const totalJobs =
      await Job.countDocuments();


    // -------------------------------------------------
    // Unique hired candidates
    //
    // Application status:
    // "selected" = hired
    // -------------------------------------------------

    const hiredCandidateIds =
      await Application.distinct(
        "candidate",
        {
          status: "selected",
        }
      );


    const totalHired =
      hiredCandidateIds.length;


    return res.status(200).json({
      success: true,

      stats: {
        totalHired,
        totalOrganizations,
        totalJobs,
      },
    });

  } catch (error) {

    next(error);
  }
};


// =====================================================
// SUBMIT CONTACT FORM
// =====================================================

export const submitContactMessage =
  async (
    req,
    res,
    next
  ) => {

    try {

      const {
        name,
        email,
        subject,
        message,
      } = req.body;


      // -------------------------------------------------
      // Validation
      // -------------------------------------------------

      if (
        !name ||
        !email ||
        !subject ||
        !message
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Name, email, subject and message are required.",
        });
      }


      // -------------------------------------------------
      // Create contact message
      // -------------------------------------------------

      const contactMessage =
        await ContactMessage.create({
          name,
          email,
          subject,
          message,
        });


      return res.status(201).json({
        success: true,
        message:
          "Your message has been sent successfully.",
        contactMessage: {
          id: contactMessage._id,
        },
      });

    } catch (error) {

      next(error);
    }
  };