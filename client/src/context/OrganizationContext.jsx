import {createContext,useContext,useEffect,useState,} from "react";
import {getCurrentOrganization} from "../services/organizationService";

const OrganizationContext =
  createContext(null);

export const OrganizationProvider = ({
  children,
}) => {
  const [
    organization,
    setOrganization,
  ] = useState(null);

  const [
    membership,
    setMembership,
  ] = useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const loadOrganization = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await getCurrentOrganization();

      setOrganization(
        data.organization
      );

      setMembership(
        data.membership
      );
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Unable to load organization"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const organizationId =
      localStorage.getItem(
        "currentOrganizationId"
      );

    if (organizationId) {
      loadOrganization();
    } else {
      setLoading(false);
    }
  }, []);

  const selectOrganization = (
    organizationId
  ) => {
    localStorage.setItem(
      "currentOrganizationId",
      organizationId
    );

    window.location.reload();
  };

  const clearOrganization = () => {
    localStorage.removeItem(
      "currentOrganizationId"
    );

    setOrganization(null);
    setMembership(null);
  };

  const hasRole = (...roles) => {
    if (!membership) {
      return false;
    }

    return roles.includes(
      membership.role
    );
  };

  const hasPermission = (
    permission
  ) => {
    if (!membership) {
      return false;
    }

    if (
      membership.role === "owner" ||
      membership.role === "hr_admin"
    ) {
      return true;
    }

    return Boolean(
      membership.permissions?.[
        permission
      ]
    );
  };

  return (
    <OrganizationContext.Provider
      value={{
        organization,
        membership,
        loading,
        error,
        loadOrganization,
        selectOrganization,
        clearOrganization,
        hasRole,
        hasPermission,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
};

export const useOrganization = () => {
  const context =
    useContext(
      OrganizationContext
    );

  if (!context) {
    throw new Error(
      "useOrganization must be used inside OrganizationProvider"
    );
  }

  return context;
};