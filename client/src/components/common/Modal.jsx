import { X } from "lucide-react";

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="\n        fixed\n        inset-0\n        z-50\n        flex\n        items-center\n        justify-center\n        bg-overlay/50\n        p-4\n      "
      onClick={onClose}
    >
      <div
        className="\n          w-full\n          max-w-lg\n          rounded-md\n          border border-border\n          bg-surface\n          text-text\n          shadow-2xl\n        "
        onClick={(event) => event.stopPropagation()}
      >
        <div
          className="
            flex
            items-center
            justify-between
            border-b
            px-6
            py-4
          "
        >
          <h2 className="text-lg font-semibold">{title}</h2>

          <button
            onClick={onClose}
            className="\n              rounded-lg\n              p-2\n              text-muted\n              hover:bg-background\n            "
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
