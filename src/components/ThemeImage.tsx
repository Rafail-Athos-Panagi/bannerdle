export const ThemeImage = () => {
  return (
    <div
      className="absolute inset-0 bg-dark-gray"
      style={{
        backgroundImage: "url('/bg-1.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        filter: "brightness(0.8) contrast(1.2) saturate(0.8) hue-rotate(10deg)",
      }}
    ></div>
  );
};
