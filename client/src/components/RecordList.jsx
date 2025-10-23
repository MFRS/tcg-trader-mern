import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import API, { apiFetch } from "./api";

const Record = (props) => (
  // ...leave your row JSX as-is...
);

export default function RecordList() {
  const [records, setRecords] = useState([]);

  const refresh = useCallback(async () => {
    try {
      const data = await apiFetch("/record/");
      setRecords(data || []);
    } catch (e) {
      console.error("Failed to load records:", e);
    }
  }, []);

  useEffect(() => {
    refresh();          // fetch once on mount + after navigations
  }, [refresh]);

  async function deleteRecord(id) {
    try {
      await apiFetch(`/record/${id}`, { method: "DELETE" });
      // Optimistic update (optional) or just refetch:
      // setRecords((prev) => prev.filter((r) => r._id !== id));
      await refresh();
    } catch (e) {
      console.error("Failed to delete:", e);
    }
  }

  function recordList() {
    return records.map((record) => (
      <Record
        record={record}
        deleteRecord={() => deleteRecord(record._id)}
        key={record._id}
      />
    ));
  }

  // ...rest of your JSX unchanged...
}
