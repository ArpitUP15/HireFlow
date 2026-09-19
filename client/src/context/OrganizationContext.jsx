import {
  createContext,
  useEffect,
  useState,
} from "react";

import {
  getCurrentOrganization,
} from "../services/organizationService";

import {
  useAuth,
} from "./useAuth";


export const OrganizationContext =
  createContext(null);


export const OrganizationProvider = ({
  children,
}) => {

  const {
    user,
  } = useAuth();


  const [
    organization,
    setOrganization,
  ] = useState(null);


  const [
    loading,
    setLoading,
  ] = useState(false);


  const loadOrganization =
    async () => {

      if (!user) {
        setOrganization(null);
        return;
      }


      try {

        setLoading(true);


        const response =
          await getCurrentOrganization();


        if (
          response?.success
        ) {

          setOrganization(
            response.organization
          );
        }

      } catch (error) {

        console.error(
          "Organization loading error:",
          error
        );

      } finally {

        setLoading(false);
      }
    };


  useEffect(() => {

    loadOrganization();

  }, [user]);


  const value = {
    organization,
    loading,
    refreshOrganization:
      loadOrganization,
  };


  return (
    <OrganizationContext.Provider
      value={value}
    >
      {children}
    </OrganizationContext.Provider>
  );
};