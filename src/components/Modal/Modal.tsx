import React, { useEffect, useMemo } from "react";

type Props = {
  onClose: () => void;
  open: boolean;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  align?: "top" | "center" | "left" | "right";
  isOutsideClose?: boolean; // New prop with default true
};

const Modal = ({
  onClose,
  open,
  children,
  className,
  style,
  align = "center",
  isOutsideClose = true, // Default to true
}: Props) => {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  const handleModalClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  const handleBackdropClick = () => {
    if (isOutsideClose) {
      onClose();
    }
  };

  const getPositionStyles = useMemo(() => {
    switch (align) {
      case "top":
        return "justify-center items-start";
      case "center":
        return "justify-center items-center";
      case "left":
        return "justify-start items-center";
      case "right":
        return "justify-end items-center";
      default:
        return "justify-center items-center";
    }
  }, [align]);

  return (
    <>
      {open && (
        <div
          className={`fixed inset-0 flex ${getPositionStyles} bg-black/20 transition-opacity duration-300`}
          style={{ zIndex: 999 }}
          onClick={handleBackdropClick} // Handle outside click conditionally
          aria-modal="true"
          role="dialog"
        >
          <div
            className={`bg-white rounded-lg h-auto ${
              className || "min-w-[31%]"
            } transition-transform duration-300`}
            onClick={handleModalClick}
            style={style}
          >
            {children}
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
