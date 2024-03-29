const SiparisButton = ({isButtonDisabled, openKesmeTab, buttonText}) => {
  return (
    <button
      className={`text-white h-full font-bold truncate px-2 py-[4.5px] rounded ${
        isButtonDisabled ? "bg-gray-400" : "bg-black hover:bg-button-new-hover"
      }`}
      disabled={isButtonDisabled}
      onClick={openKesmeTab}
    >
      {buttonText}
    </button>
  );
};

export default SiparisButton;
