import { useContext } from "react";
import { OrganizationContext } from "./organizationState";
export const useOrganization = () => {
  const context = useContext(OrganizationContext);
  if (!context)
    throw new Error("useOrganization must be used inside OrganizationProvider");
  return context;
};
