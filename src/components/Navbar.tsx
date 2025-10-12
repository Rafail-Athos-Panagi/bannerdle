const Navbar = () => {
  return (
    <div
      className="
        relative 
        inline-block 
        px-6 
        py-3 
        bg-cover 
        bg-center 
        border-4 
        border-yellow-700 
        rounded-lg 
        shadow-lg 
        text-yellow-900 
        font-serif 
        text-lg
      "
      style={{
        backgroundImage: "url('scroll.jpg')",
      }}
    >
      <p className="text-center">
        Your relation is decreased by 10 to -10 with Mir Arbas.
      </p>
    </div>
  );
};

export default Navbar;
