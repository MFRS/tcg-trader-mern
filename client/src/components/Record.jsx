import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API, { apiFetch } from "../api";

export default function Record() {
  const [form, setForm] = useState({ name: "", position: "", level: "" });
  const [isNew, setIsNew] = useState(true);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const id = params.id?.toString();
      if (!id) return;
      setIsNew(false);
      try {
        const record = await apiFetch(`/record/${id}`);
        if (!record) return navigate("/");
        setForm({
          name: record.name ?? "",
          position: record.position ?? "",
          level: record.level ?? "",
        });
      } catch (e) {
        console.error(e);
      }
    }
    fetchData();
  }, [params.id, navigate]);

  function updateForm(value) {
    setForm((prev) => ({ ...prev, ...value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    const payload = { ...form };
    try {
      if (isNew) {
        await apiFetch(`/record`, { method: "POST", body: JSON.stringify(payload) });
      } else {
        await apiFetch(`/record/${params.id}`, { method: "PATCH", body: JSON.stringify(payload) });
      }
      // After successful save, go back home — RecordList will refetch on mount
      navigate("/");
    } catch (error) {
      console.error("Save failed:", error);
    } finally {
      setForm({ name: "", position: "", level: "" });
    }
  }

  // ...keep your JSX form as-is...
}
