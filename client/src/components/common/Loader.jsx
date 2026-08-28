const Loader = ({
  text = "Loading...",
}) => {
  return (
    <div className="flex min-h-50 items-center justify-center">
      <div className="text-center">
        <div
          className="
            mx-auto
            mb-3
            h-8
            w-8
            animate-spin
            rounded-full
            border-4
            border-gray-200
            border-t-blue-600
          "
        />

        <p className="text-sm text-gray-500">
          {text}
        </p>
      </div>
    </div>
  );
};

export default Loader;