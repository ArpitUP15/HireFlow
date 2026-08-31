const Candidate = require("../models/Candidate");


// CREATE CANDIDATE
const createCandidate = async (
  req,
  res
) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      location,
      headline,
      summary,
      skills,
      experience,
      education,
      resumeUrl,
      linkedinUrl,
      portfolioUrl,
      source,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !email
    ) {
      return res.status(400).json({
        message:
          "First name, last name and email are required",
      });
    }

    const existingCandidate =
      await Candidate.findOne({
        organization:
          req.organization._id,

        email:
          email.toLowerCase(),
      });

    if (existingCandidate) {
      return res.status(409).json({
        message:
          "Candidate already exists in this organization",
      });
    }

    const candidate =
      await Candidate.create({
        organization:
          req.organization._id,

        createdBy:
          req.user._id,

        firstName,
        lastName,
        email,
        phone,
        location,
        headline,
        summary,
        skills,
        experience,
        education,
        resumeUrl,
        linkedinUrl,
        portfolioUrl,
        source,
      });

    res.status(201).json({
      message:
        "Candidate created successfully",

      candidate,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message:
        "Failed to create candidate",
    });
  }
};


// GET CANDIDATES
const getCandidates = async (
  req,
  res
) => {
  try {
    const {
      search,
      location,
      source,
    } = req.query;

    const filter = {
      organization:
        req.organization._id,
    };

    if (location) {
      filter.location = {
        $regex: location,
        $options: "i",
      };
    }

    if (source) {
      filter.source = source;
    }

    if (search) {
      filter.$or = [
        {
          firstName: {
            $regex: search,
            $options: "i",
          },
        },
        {
          lastName: {
            $regex: search,
            $options: "i",
          },
        },
        {
          email: {
            $regex: search,
            $options: "i",
          },
        },
        {
          skills: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const candidates =
      await Candidate.find(filter)
        .populate(
          "createdBy",
          "firstName lastName"
        )
        .sort({
          createdAt: -1,
        });

    res.status(200).json({
      candidates,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message:
        "Failed to fetch candidates",
    });
  }
};


// GET SINGLE CANDIDATE
const getCandidateById =
  async (req, res) => {
    try {
      const candidate =
        await Candidate.findOne({
          _id: req.params.id,

          organization:
            req.organization._id,
        }).populate(
          "createdBy",
          "firstName lastName email"
        );

      if (!candidate) {
        return res.status(404).json({
          message:
            "Candidate not found",
        });
      }

      res.status(200).json({
        candidate,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message:
          "Failed to fetch candidate",
      });
    }
  };


// UPDATE CANDIDATE
const updateCandidate =
  async (req, res) => {
    try {
      const candidate =
        await Candidate.findOneAndUpdate(
          {
            _id: req.params.id,

            organization:
              req.organization._id,
          },

          req.body,

          {
            new: true,
            runValidators: true,
          }
        );

      if (!candidate) {
        return res.status(404).json({
          message:
            "Candidate not found",
        });
      }

      res.status(200).json({
        message:
          "Candidate updated successfully",

        candidate,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message:
          "Failed to update candidate",
      });
    }
  };


// DELETE CANDIDATE
const deleteCandidate =
  async (req, res) => {
    try {
      const candidate =
        await Candidate.findOneAndDelete(
          {
            _id: req.params.id,

            organization:
              req.organization._id,
          }
        );

      if (!candidate) {
        return res.status(404).json({
          message:
            "Candidate not found",
        });
      }

      res.status(200).json({
        message:
          "Candidate deleted successfully",
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message:
          "Failed to delete candidate",
      });
    }
  };


module.exports = {
  createCandidate,
  getCandidates,
  getCandidateById,
  updateCandidate,
  deleteCandidate,
};