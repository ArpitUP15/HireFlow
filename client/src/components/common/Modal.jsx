import { X } from "lucide-react";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/50
        p-4
      "
      onClick={onClose}
    >
      <div
        className="
          w-full
          max-w-lg
          rounded-2xl
          bg-white
          shadow-2xl
        "
        onClick={(event) =>
          event.stopPropagation()
        }
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
          <h2 className="text-lg font-semibold">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="
              rounded-lg
              p-2
              text-gray-500
              hover:bg-gray-100
            "
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;