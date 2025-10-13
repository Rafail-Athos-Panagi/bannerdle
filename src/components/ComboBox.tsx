// components/ComboBox.tsx
"use client";
import { useState, useRef, useEffect } from "react";
import { Troop } from "@/types/Troop.type";
interface ComboBoxProps {
  availableTroops: Troop[];
  onSelect: (troop: Troop) => void;
}

const ComboBox = ({ availableTroops, onSelect }: ComboBoxProps) => {
  const [query, setQuery] = useState<string>("");
  const [selected, setSelected] = useState<Troop | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const comboboxRef = useRef<HTMLDivElement | null>(null);

  const filteredPeople =
    query === ""
      ? availableTroops
      : availableTroops.filter((troop) =>
          troop.name.toLowerCase().includes(query.toLowerCase())
        );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        comboboxRef.current &&
        !comboboxRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setIsOpen(true);
  };

  const handleSelectOption = (troop: Troop) => {
    setSelected(troop);
    setQuery("");
    setIsOpen(false);
    onSelect(troop);
  };

  const handleSelectOptionSubmit = (troopName: string) => {
    const troop = availableTroops.find(
      (t) => t.name.toLowerCase() === troopName.toLowerCase()
    );
    if (troop) {
      handleSelectOption(troop);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <div className="relative" ref={comboboxRef}>
        <div className="relative flex flex-row text-center justify-center items-center">
          <input
            type="text"
            placeholder="Type to find the troop..."
            className="w-full h-12 md:h-14 text-[#d7b587] font-semibold tracking-wide bg-[radial-gradient(ellipse_at_center,_#3b372f_0%,_#2f2c25_100%)] border-2 border-[#8A691F] shadow-md rounded-lg rounded-r-none px-3 md:px-4 focus:outline-none text-sm md:text-base"
            value={query}
            onChange={handleInputChange}
            onFocus={() => {
              if (query !== "") {
                setIsOpen(true);
              }
            }}
          />
          <img
            className="w-12 h-12 md:w-16 md:h-14 flex items-center justify-center border-none p-0 cursor-pointer z-10 transform transition duration-200 hover:scale-110 filter hover:brightness-125"
            src="/submit4.png"
            alt="submit_button"
            onClick={() => handleSelectOptionSubmit(query)}
          />
        </div>
        {isOpen && (
          <div className="absolute z-10 mt-2 w-full max-h-60 overflow-auto rounded-md bg-[radial-gradient(ellipse_at_center,_#3b372f_0%,_#2f2c25_100%)]  py-1 text-base shadow-lg">
            {filteredPeople.length === 0 && query !== "" ? (
              <div className="cursor-default select-none py-2 px-4 text-[#D7B587] flex justify-center">
                No troop found.
              </div>
            ) : (
              filteredPeople.map((troop) => {
                const isSelected = selected && selected.name === troop.name;
                return (
                  <div
                    key={troop.name}
                    className={`cursor-pointer select-none relative py-2 pl-3 pr-4 text-[#D7B587] ${
                      isSelected ? "bg-[rgba(255,255,255,0.1)]" : ""
                    }`}
                    onClick={() => handleSelectOption(troop)}
                    onMouseEnter={(e) =>
                      e.currentTarget.classList.add(
                        "bg-[rgba(255,255,255,0.1)]"
                      )
                    }
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.classList.remove(
                          "bg-[rgba(255,255,255,0.1)]"
                        );
                      }
                    }}
                  >
                    <div className="flex items-center">
                      <img
                        alt={troop.name}
                        src={troop.image}
                        className="w-15 h-12 rounded"
                      />
                      <span className="ml-3 block truncate text-sm">
                        {troop.name}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ComboBox;
