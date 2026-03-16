import React, {
  useState,
  useEffect,
  useCallback,
  forwardRef
} from "react";
import style from "./Edition.module.css";
import { useAuth } from "../../context/AuthContext";

export interface EditionProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  allowedRoles: string[];
  userEditId?: string | number;
  text: string;
  isDualCondition?: boolean;
}

const Edition = forwardRef<HTMLButtonElement, EditionProps>(
  (
    {
      allowedRoles,
      userEditId,
      text,
      className,
      disabled,
      title,
      isDualCondition = false,
      ...props
    },
    ref
  ) => {
    const customClass = className || style.button;
    const { user } = useAuth();
    const [isAllowed, setIsAllowed] = useState(false);

    const checkPermission = useCallback(() => {
      if (!user) return false;

      const isRoleAllowed = allowedRoles.includes(user.role);
      const isEditingOwnProfile = userEditId
        ? user.id === userEditId
        : false;

      if (isDualCondition) {
        return isRoleAllowed && isEditingOwnProfile;
      }

      return isRoleAllowed || isEditingOwnProfile;
    }, [user, allowedRoles, userEditId, isDualCondition]);

    useEffect(() => {
      const timer = setTimeout(() => {
        setIsAllowed(checkPermission());
      }, 50);

      return () => clearTimeout(timer);
    }, [checkPermission]);

    if (!isAllowed) return null;

    const renderTitle = title ?? text;

    return (
      <button
        ref={ref}
        className={customClass}
        disabled={disabled}
        title={renderTitle}
        {...props}
      >
        {text}
      </button>
    );
  }
);

Edition.displayName = "Edition";

export default Edition;
