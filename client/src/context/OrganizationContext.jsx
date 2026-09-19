import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getMyOrganizations,
  getCurrentOrganization,
} from "../services/organizationService";

import {
  useAuth,
} from "./useAuth";


const OrganizationContext =
  createContext(null);


export const OrganizationProvider = ({
  children,
}) => {

  const {
    user,
    loading: authLoading,
  } = useAuth();


  const [
    organization,
    setOrganization,
  ] = useState(null);


  const [
    membership,
    setMembership,
  ] = useState(null);


  const [
    organizations,
    setOrganizations,
  ] = useState([]);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    error,
    setError,
  ] = useState("");


  // ===================================================
  // LOAD ORGANIZATIONS
  // ===================================================

  const loadOrganizations =
    async () => {

      try {

        setLoading(true);

        setError("");


        const data =
          await getMyOrganizations();


        const list =
          data?.organizations ||
          [];


        setOrganizations(
          list
        );


        // ---------------------------------------------
        // No organizations
        // ---------------------------------------------

        if (
          list.length === 0
        ) {

          localStorage.removeItem(
            "currentOrganizationId"
          );

          setOrganization(null);

          setMembership(null);

          return;
        }


        // ---------------------------------------------
        // Existing selected organization
        // ---------------------------------------------

        const storedId =
          localStorage.getItem(
            "currentOrganizationId"
          );


        const selected =
          list.find(
            (item) =>
              item.organization?._id ===
              storedId
          );


        // ---------------------------------------------
        // Use stored organization or first organization
        // ---------------------------------------------

        const activeOrganization =
          selected ||
          list[0];


        const organizationId =
          activeOrganization
            .organization
            ._id;


        // ---------------------------------------------
        // Save organization ID
        // ---------------------------------------------

        localStorage.setItem(
          "currentOrganizationId",
          organizationId
        );


        setOrganization(
          activeOrganization.organization
        );


        setMembership({
          ...activeOrganization,
          organization:
            undefined,
        });


      } catch (error) {

        console.error(
          "Organization loading error:",
          error
        );


        const message =
          error?.response
            ?.data
            ?.message ||
          "Unable to load organizations";


        setError(
          message
        );

        setOrganization(
          null
        );

        setMembership(
          null
        );

      } finally {

        setLoading(false);
      }
    };


  // ===================================================
  // LOAD CURRENT ORGANIZATION
  // ===================================================

  const refreshOrganization =
    async () => {

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


        if (
          data.organization?._id
        ) {

          localStorage.setItem(
            "currentOrganizationId",
            data.organization._id
          );
        }

      } catch (error) {

        console.error(
          "Current organization error:",
          error
        );


        setError(
          error?.response
            ?.data
            ?.message ||
          "Unable to load organization"
        );

      } finally {

        setLoading(false);
      }
    };


  // ===================================================
  // INITIAL LOAD
  // ===================================================

  useEffect(() => {

    if (authLoading) {
      return;
    }


    if (!user) {

      setOrganization(null);

      setMembership(null);

      setOrganizations([]);

      setError("");

      setLoading(false);

      return;
    }


    loadOrganizations();

  }, [
    user,
    authLoading,
  ]);


  // ===================================================
  // SELECT ORGANIZATION
  // ===================================================

  const selectOrganization =
    async (
      organizationId
    ) => {

      if (!organizationId) {
        return;
      }


      localStorage.setItem(
        "currentOrganizationId",
        organizationId
      );


      const selected =
        organizations.find(
          (item) =>
            item.organization?._id ===
            organizationId
        );


      if (selected) {

        setOrganization(
          selected.organization
        );


        setMembership({
          ...selected,
          organization:
            undefined,
        });
      }


      await refreshOrganization();
    };


  // ===================================================
  // CLEAR ORGANIZATION
  // ===================================================

  const clearOrganization =
    () => {

      localStorage.removeItem(
        "currentOrganizationId"
      );


      setOrganization(
        null
      );

      setMembership(
        null
      );
    };


  // ===================================================
  // ROLE CHECK
  // ===================================================

  const hasRole =
    (...roles) => {

      if (!membership) {
        return false;
      }


      return roles.includes(
        membership.role
      );
    };


  // ===================================================
  // PERMISSION CHECK
  // ===================================================

  const hasPermission =
    (permission) => {

      if (!membership) {
        return false;
      }


      if (
        membership.role ===
          "owner" ||
        membership.role ===
          "hr_admin"
      ) {

        return true;
      }


      return Boolean(
        membership.permissions?.[
          permission
        ]
      );
    };


  // ===================================================
  // CONTEXT VALUE
  // ===================================================

  const value = {

    organization,

    organizations,

    membership,

    loading,

    error,

    loadOrganizations,

    refreshOrganization,

    selectOrganization,

    clearOrganization,

    hasRole,

    hasPermission,
  };


  return (

    <OrganizationContext.Provider
      value={value}
    >

      {children}

    </OrganizationContext.Provider>
  );
};


// =====================================================
// HOOK
// =====================================================

export const useOrganization =
  () => {

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