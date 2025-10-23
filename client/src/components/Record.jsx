import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API, { apiFetch } from "../api"; // ✅ correct path (1 level up from components)

export default function Record() {
  const [form, setForm] = useState({
    name: "",
    position: "",
    level: "",
  });
  const [isNew, setIsNew] = useState(true);
  const params = useParams();
  const navigate = useNavigate();

  // Load record if editing
  useEffect(() => {
    async function fetchData() {
      const id = params.id?.toString();
      if (!id) return;
      setIsNew(false);
      try {
        const record = await apiFetch(`/record/${id}`);
        if (!record) return navigate("/");
        setForm({
          name: record.name || "",
          position: record.position || "",
          level: record.level || "",
        });
      } catch (err) {
        console.error("Error loading record:", err);
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
        await apiFetch(`/record`, {
          method: "POST",
          body: JSON.stringify(payload),
        });
      } else {
        await apiFetch(`/record/${params.id}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
      }

      // Clear form and go home (RecordList will re-fetch)
      setForm({ name: "", position: "", level: "" });
      navigate("/");
    } catch (err) {
      console.error("Save failed:", err);
    }
  }

  return (
    <>
      <h3 className="text-lg font-semibold p-4">
        {isNew ? "Create" : "Update"} Employee Record
      </h3>
      <form
        onSubmit={onSubmit}
        className="border rounded-lg overflow-hidden p-4"
      >
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-slate-900/10 pb-12 md:grid-cols-2">
          <div>
            <h2 className="text-base font-semibold leading-7 text-slate-900">
              Employee Info
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              This information will be displayed publicly so be careful what you
              share.
            </p>
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8">
            {/* Name */}
            <div className="sm:col-span-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-slate-900"
              >
                Name
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-slate-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="First Last"
                    value={form.name}
                    onChange={(e) => updateForm({ name: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Position */}
            <div className="sm:col-span-4">
              <label
                htmlFor="position"
                className="block text-sm font-medium leading-6 text-slate-900"
              >
                Position
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-slate-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    type="text"
                    name="position"
                    id="position"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="Developer Advocate"
                    value={form.position}
                    onChange={(e) => updateForm({ position: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Level */}
            <div>
              <fieldset className="mt-4">
                <legend className="sr-only">Level</legend>
                <div className="space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
                  {["Intern", "Junior", "Senior"].map((lvl) => (
                    <label key={lvl} className="flex items-center">
                      <input
                        type="radio"
                        name="level"
                        value={lvl}
                        checked={form.level === lvl}
                        onChange={(e) => updateForm({ level: e.target.value })}
                        className="h-4 w-4 border-slate-300 text-slate-600 focus:ring-slate-600 cursor-pointer"
                      />
                      <span className="ml-2 text-sm font-medium leading-6 text-slate-900 mr-4">
                        {lvl}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>
          </div>
        </div>

        <input
          type="submit"
          value={isNew ? "Save Employee Record" : "Update Employee Record"}
          className="inline-flex items-center justify-center whitespace-nowrap text-md font-medium border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3 cursor-pointer mt-4"
        />
      </form>
    </>
  );
}
