const KesmeButton = ({isButtonDisabled, openKesmeTab}) => {
  return (
    <button
      className={`text-white w-45 h-full text-sm font-semibold truncate px-2 py-[4.5px] rounded mt-2 ${
        isButtonDisabled ? "bg-gray-400" : "bg-black hover:bg-button-new-hover"
      }`}
      disabled={isButtonDisabled}
      onClick={openKesmeTab}
    >
      Kesmeye Gönder
    </button>
  );
};

export default KesmeButton;
