// components/ComboBox.tsx
"use client";
import { useState, useRef, useEffect } from "react";
import { Troop } from "@/types/Troop.type";
interface ComboBoxProps {
  availableTroops: Troop[];
  onSelect: (troop: Troop) => void;
  disabled?: boolean;
}

const ComboBox = ({ availableTroops, onSelect, disabled = false }: ComboBoxProps) => {
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
    if (disabled) return;
    setQuery(event.target.value);
    setIsOpen(true);
  };

  const handleSelectOption = (troop: Troop) => {
    if (disabled) return;
    setSelected(troop);
    setQuery("");
    setIsOpen(false);
    onSelect(troop);
  };

  const handleSelectOptionSubmit = (troopName: string) => {
    if (disabled) return;
    const troop = availableTroops.find(
      (t) => t.name.toLowerCase() === troopName.toLowerCase()
    );
    if (troop) {
      handleSelectOption(troop);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto px-2">
      <div className="relative" ref={comboboxRef}>
        <div className="relative flex flex-row text-center justify-center items-center">
          <input
            type="text"
            placeholder={disabled ? "Correct answer found! 🎉" : "Type to find the troop..."}
            className={`w-full h-10 md:h-12 text-[#d7b587] font-semibold tracking-wide bg-[radial-gradient(ellipse_at_center,_#3b372f_0%,_#2f2c25_100%)] border border-[#8A691F] shadow-md rounded-lg rounded-r-none px-2 md:px-3 focus:outline-none text-sm ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            value={query}
            onChange={handleInputChange}
            disabled={disabled}
            onFocus={() => {
              if (query !== "" && !disabled) {
                setIsOpen(true);
              }
            }}
          />
          <img
            className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center border-none p-0 z-10 transform transition duration-200 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-110 filter hover:brightness-125'}`}
            src="/submit4.png"
            alt="submit_button"
            onClick={disabled ? undefined : () => handleSelectOptionSubmit(query)}
          />
        </div>
        {isOpen && (
          <div className="absolute z-10 mt-2 w-full max-h-48 overflow-auto rounded-md bg-[radial-gradient(ellipse_at_center,_#3b372f_0%,_#2f2c25_100%)]  py-1 text-sm shadow-lg">
            {filteredPeople.length === 0 && query !== "" ? (
              <div className="cursor-default select-none py-1.5 px-3 text-[#D7B587] flex justify-center text-sm">
                No troop found.
              </div>
            ) : (
              filteredPeople.map((troop) => {
                const isSelected = selected && selected.name === troop.name;
                return (
                  <div
                    key={troop.name}
                    className={`cursor-pointer select-none relative py-1.5 pl-2 pr-3 text-[#D7B587] text-sm ${
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
