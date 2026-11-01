const Loader = ({ text = "Loading..." }) => {
  return (
    <div className="flex min-h-50 items-center justify-center">
      <div className="text-center">
        <div className="\n            mx-auto\n            mb-3\n            h-8\n            w-8\n            animate-spin\n            rounded-full\n            border-4\n            border-border\n            border-t-primary\n          " />

        <p className="text-sm text-muted">{text}</p>
      </div>
    </div>
  );
};

export default Loader;
