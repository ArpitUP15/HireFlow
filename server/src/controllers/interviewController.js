import Interview from "../models/Interview.js";
import Application from "../models/Application.js";


// =====================================================
// CREATE INTERVIEW
// =====================================================

export const createInterview = async (
  req,
  res,
  next
) => {
  try {

    const organizationId =
      req.organization._id;


    const {
      application,
      title,
      round,
      roundName,
      type,
      scheduledAt,
      duration,
      meetingLink,
      location,
      interviewers,
      notes,
    } = req.body;


    if (!application) {
      return res.status(400).json({
        success: false,
        message: "Application is required",
      });
    }


    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Interview title is required",
      });
    }


    if (!scheduledAt) {
      return res.status(400).json({
        success: false,
        message: "Interview date is required",
      });
    }


    // -------------------------------------------------
    // Find application
    // -------------------------------------------------

    const applicationData =
      await Application.findOne({
        _id: application,
        organization: organizationId,
      });


    if (!applicationData) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }


    // -------------------------------------------------
    // Create interview
    // -------------------------------------------------

    const interview =
      await Interview.create({
        organization: organizationId,

        application:
          applicationData._id,

        job:
          applicationData.job,

        candidate:
          applicationData.candidate,

        title,

        round:
          round || "technical",

        roundName:
          roundName || "",

        type:
          type || "video",

        scheduledAt,

        duration:
          duration || 60,

        meetingLink:
          meetingLink || "",

        location:
          location || "",

        interviewers:
          interviewers || [],

        notes:
          notes || "",
      });


    const populatedInterview =
      await Interview.findById(
        interview._id
      )
        .populate(
          "application"
        )
        .populate(
          "job"
        )
        .populate(
          "candidate"
        )
        .populate(
          "interviewers",
          "firstName lastName email"
        );


    return res.status(201).json({
      success: true,
      message: "Interview scheduled successfully",
      interview: populatedInterview,
    });

  } catch (error) {

    next(error);
  }
};


// =====================================================
// GET ALL INTERVIEWS
// =====================================================

export const getInterviews = async (
  req,
  res,
  next
) => {
  try {

    const organizationId =
      req.organization._id;


    const {
      status,
      round,
      from,
      to,
    } = req.query;


    const filter = {
      organization: organizationId,
    };


    if (status) {
      filter.status = status;
    }


    if (round) {
      filter.round = round;
    }


    if (from || to) {

      filter.scheduledAt = {};

      if (from) {
        filter.scheduledAt.$gte =
          new Date(from);
      }

      if (to) {
        filter.scheduledAt.$lte =
          new Date(to);
      }
    }


    const interviews =
      await Interview.find(filter)
        .populate(
          "application"
        )
        .populate(
          "job"
        )
        .populate(
          "candidate"
        )
        .populate(
          "interviewers",
          "firstName lastName email"
        )
        .sort({
          scheduledAt: 1,
        });


    return res.status(200).json({
      success: true,
      count: interviews.length,
      interviews,
    });

  } catch (error) {

    next(error);
  }
};


// =====================================================
// GET INTERVIEW BY ID
// =====================================================

export const getInterviewById = async (
  req,
  res,
  next
) => {
  try {

    const interview =
      await Interview.findOne({
        _id: req.params.id,
        organization:
          req.organization._id,
      })
        .populate(
          "application"
        )
        .populate(
          "job"
        )
        .populate(
          "candidate"
        )
        .populate(
          "interviewers",
          "firstName lastName email"
        );


    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }


    return res.status(200).json({
      success: true,
      interview,
    });

  } catch (error) {

    next(error);
  }
};


// =====================================================
// UPDATE INTERVIEW
// =====================================================

export const updateInterview = async (
  req,
  res,
  next
) => {
  try {

    const allowedFields = [
      "title",
      "round",
      "roundName",
      "type",
      "scheduledAt",
      "duration",
      "meetingLink",
      "location",
      "interviewers",
      "status",
      "feedback",
      "score",
      "recommendation",
      "hiringDecision",
      "notes",
    ];


    const updates = {};


    for (const field of allowedFields) {

      if (
        req.body[field] !== undefined
      ) {
        updates[field] =
          req.body[field];
      }
    }


    const interview =
      await Interview.findOneAndUpdate(
        {
          _id: req.params.id,
          organization:
            req.organization._id,
        },

        updates,

        {
          new: true,
          runValidators: true,
        }
      )
        .populate(
          "application"
        )
        .populate(
          "job"
        )
        .populate(
          "candidate"
        )
        .populate(
          "interviewers",
          "firstName lastName email"
        );


    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }


    return res.status(200).json({
      success: true,
      message: "Interview updated successfully",
      interview,
    });

  } catch (error) {

    next(error);
  }
};


// =====================================================
// UPDATE INTERVIEW STATUS
// =====================================================

export const updateInterviewStatus =
  async (
    req,
    res,
    next
  ) => {
    try {

      const {
        status,
      } = req.body;


      const validStatuses = [
        "scheduled",
        "in_progress",
        "completed",
        "cancelled",
        "rescheduled",
      ];


      if (
        !validStatuses.includes(
          status
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid interview status",
        });
      }


      const interview =
        await Interview.findOneAndUpdate(
          {
            _id: req.params.id,
            organization:
              req.organization._id,
          },

          {
            status,
          },

          {
            new: true,
            runValidators: true,
          }
        );


      if (!interview) {
        return res.status(404).json({
          success: false,
          message: "Interview not found",
        });
      }


      return res.status(200).json({
        success: true,
        message:
          "Interview status updated successfully",
        interview,
      });

    } catch (error) {

      next(error);
    }
  };


// =====================================================
// ADD INTERVIEW FEEDBACK
// =====================================================

export const addInterviewFeedback =
  async (
    req,
    res,
    next
  ) => {
    try {

      const {
        feedback,
        score,
        recommendation,
      } = req.body;


      if (
        score !== undefined &&
        (
          score < 0 ||
          score > 10
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Score must be between 0 and 10",
        });
      }


      const interview =
        await Interview.findOneAndUpdate(
          {
            _id: req.params.id,
            organization:
              req.organization._id,
          },

          {
            feedback:
              feedback || "",

            score:
              score ?? null,

            recommendation:
              recommendation || "",
          },

          {
            new: true,
            runValidators: true,
          }
        );


      if (!interview) {
        return res.status(404).json({
          success: false,
          message: "Interview not found",
        });
      }


      return res.status(200).json({
        success: true,
        message:
          "Interview feedback saved successfully",
        interview,
      });

    } catch (error) {

      next(error);
    }
  };


// =====================================================
// UPDATE HIRING DECISION
// =====================================================

export const updateHiringDecision =
  async (
    req,
    res,
    next
  ) => {
    try {

      const {
        hiringDecision,
      } = req.body;


      const validDecisions = [
        "pending",
        "hire",
        "reject",
        "hold",
      ];


      if (
        !validDecisions.includes(
          hiringDecision
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid hiring decision",
        });
      }


      const interview =
        await Interview.findOneAndUpdate(
          {
            _id: req.params.id,
            organization:
              req.organization._id,
          },

          {
            hiringDecision,
          },

          {
            new: true,
            runValidators: true,
          }
        );


      if (!interview) {
        return res.status(404).json({
          success: false,
          message: "Interview not found",
        });
      }


      return res.status(200).json({
        success: true,
        message:
          "Hiring decision updated successfully",
        interview,
      });

    } catch (error) {

      next(error);
    }
  };


// =====================================================
// DELETE INTERVIEW
// =====================================================

export const deleteInterview = async (
  req,
  res,
  next
) => {
  try {

    const interview =
      await Interview.findOneAndDelete({
        _id: req.params.id,
        organization:
          req.organization._id,
      });


    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }


    return res.status(200).json({
      success: true,
      message:
        "Interview deleted successfully",
    });

  } catch (error) {

    next(error);
  }
};