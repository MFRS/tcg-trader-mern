import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import API, { apiFetch } from "../api"; // adjust path if needed

const Record = (props) => (
  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
    <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
      {props.record.name}
    </td>
    <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
      {props.record.position}
    </td>
    <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
      {props.record.level}
    </td>
    <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
      <div className="flex gap-2">
        <Link
          className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3"
          to={`/edit/${props.record._id}`}
        >
          Edit
        </Link>
        <button
          className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium border border-input bg-background hover:bg-slate-100 hover:text-accent-foreground h-9 rounded-md px-3"
          type="button"
          onClick={() => props.deleteRecord(props.record._id)}
        >
          Delete
        </button>
      </div>
    </td>
  </tr>
);

export default function RecordList() {
  const [records, setRecords] = useState([]);

  const refresh = useCallback(async () => {
    try {
      const data = await apiFetch("/record/");
      setRecords(data || []);
      console.log(data)
    } catch (err) {
      console.error("Failed to load records:", err);
    }
  }, []);

  useEffect(() => {
    refresh(); // fetch once on mount
  }, [refresh]);

  async function deleteRecord(id) {
    try {
      await apiFetch(`/record/${id}`, { method: "DELETE" });
      await refresh(); // reload after delete
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  }

  function recordList() {
    return records.map((record) => (
      <Record
        record={record}
        deleteRecord={deleteRecord}
        key={record._id}
      />
    ));
  }

  return (
    <>
      <h3 className="text-lg font-semibold p-4">Employee Records</h3>
      <div className="border rounded-lg overflow-hidden">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b">
                <th className="h-12 px-4 text-left font-medium text-muted-foreground">Name</th>
                <th className="h-12 px-4 text-left font-medium text-muted-foreground">Position</th>
                <th className="h-12 px-4 text-left font-medium text-muted-foreground">Level</th>
                <th className="h-12 px-4 text-left font-medium text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {recordList()}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
