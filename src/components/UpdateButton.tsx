import { useState } from "react";
import { TroopService } from "./services/TroopService";

const UpdateButton = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdate = async () => {
    setLoading(true);
    setError(null);
    try {
      await TroopService.selectTroop();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleUpdate}
        disabled={loading}
        className="border-2 border-amber-400 p-4 bg-amber-300 hover:bg-amber-500"
      >
        {loading ? "Updating..." : "Update"}
      </button>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
    </div>
  );
};

export default UpdateButton;
