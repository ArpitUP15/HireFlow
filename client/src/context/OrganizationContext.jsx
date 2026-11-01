import { useCallback, useEffect, useRef, useState } from "react";
import { getMyOrganizations } from "../services/organizationService";
import { useAuth } from "./useAuth";
import { OrganizationContext } from "./organizationState";
export const OrganizationProvider = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const userId = user?._id;
  const isStaff = Boolean(user && user.role !== "candidate");
  const [state, setState] = useState({
    userId: null,
    list: [],
    selected: null,
    error: "",
  });
  const requestId = useRef(0);
  const loadOrganizations = useCallback(async () => {
    const revision = ++requestId.current;
    if (!userId || !isStaff) return;
    try {
      const data = await getMyOrganizations();
      if (revision !== requestId.current) return;
      const list = (data.organizations || []).filter((m) => m.organization);
      const stored = localStorage.getItem("currentOrganizationId");
      const selected =
        list.find((m) => m.organization._id === stored) || list[0] || null;
      if (selected)
        localStorage.setItem(
          "currentOrganizationId",
          selected.organization._id,
        );
      else localStorage.removeItem("currentOrganizationId");
      setState({ userId, list, selected, error: "" });
    } catch (e) {
      if (revision === requestId.current)
        setState({
          userId,
          list: [],
          selected: null,
          error: e.response?.data?.message || "Could not load organization",
        });
    }
  }, [userId, isStaff]);
  useEffect(() => {
    let cancelled = false;
    if (!userId || !isStaff) return;
    getMyOrganizations()
      .then((data) => {
        if (cancelled) return;
        const list = (data.organizations || []).filter((m) => m.organization);
        const stored = localStorage.getItem("currentOrganizationId");
        const selected =
          list.find((m) => m.organization._id === stored) || list[0] || null;
        if (selected)
          localStorage.setItem(
            "currentOrganizationId",
            selected.organization._id,
          );
        else localStorage.removeItem("currentOrganizationId");
        setState({ userId, list, selected, error: "" });
      })
      .catch((e) => {
        if (!cancelled)
          setState({
            userId,
            list: [],
            selected: null,
            error: e.response?.data?.message || "Could not load organization",
          });
      });
    return () => {
      cancelled = true;
    };
  }, [userId, isStaff]);
  const valid = isStaff && state.userId === userId;
  const membership = valid ? state.selected : null;
  const selectOrganization = (id) => {
    const selected = state.list.find((m) => m.organization._id === id);
    if (!selected) return;
    localStorage.setItem("currentOrganizationId", id);
    setState((s) => ({ ...s, selected }));
  };
  const clearOrganization = () => {
    localStorage.removeItem("currentOrganizationId");
    setState((s) => ({ ...s, selected: null }));
  };
  return (
    <OrganizationContext.Provider
      value={{
        organization: membership?.organization || null,
        membership,
        organizations: valid ? state.list : [],
        loading: authLoading || (isStaff && !valid),
        error: valid ? state.error : "",
        loadOrganizations,
        refreshOrganization: loadOrganizations,
        selectOrganization,
        clearOrganization,
        hasRole: (...roles) => roles.includes(membership?.role),
        hasPermission: (key) =>
          Boolean(
            membership &&
            (["owner", "hr_admin"].includes(membership.role) ||
              membership.permissions?.[key]),
          ),
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
};
