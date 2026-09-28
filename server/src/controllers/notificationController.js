import Notification from "../models/Notification.js";

export const getNotifications = async (
  req,
  res,
  next
) => {
  try {
    const organizationId =
      req.headers["x-organization-id"];

    const notifications =
      await Notification.find({
        organization: organizationId,
        user: req.user._id,
      })
        .sort({ createdAt: -1 })
        .limit(50);

    res.status(200).json({
      success: true,
      notifications,
    });
  } catch (error) {
    next(error);
  }
};

export const markNotificationRead =
  async (req, res, next) => {
    try {
      const organizationId =
        req.headers["x-organization-id"];

      const notification =
        await Notification.findOneAndUpdate(
          {
            _id: req.params.id,
            organization: organizationId,
            user: req.user._id,
          },
          {
            read: true,
          },
          {
            new: true,
          }
        );

      if (!notification) {
        return res.status(404).json({
          success: false,
          message:
            "Notification not found",
        });
      }

      res.status(200).json({
        success: true,
        notification,
      });
    } catch (error) {
      next(error);
    }
  };