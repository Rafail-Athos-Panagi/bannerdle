function SumbitButton() {
  return (
    <button className="w-10 h-10 flex items-center justify-center border-none p-0 cursor-pointer z-10">
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="#5A4638"
          d="M 0,20 
             L 10,0 
             L 30,0 
             L 40,20 
             L 30,40 
             L 10,40 
             Z"
        />
        <path
          fill="#3B2F24"
          d="M 5,20 
             L 12,8 
             L 28,8 
             L 35,20 
             L 28,32 
             L 12,32 
             Z"
        />
      </svg>
    </button>
  );
}

export default SumbitButton;
