import Notification from "../models/Notification.js";

export const createNotification = async ({
  organization,
  user,
  type,
  title,
  message,
  metadata = {},
}) => {
  return Notification.create({
    organization,
    user,
    type,
    title,
    message,
    metadata,
  });
};