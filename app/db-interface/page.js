"use client";

import { useState } from "react";

export default function DbInterface() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/db-query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, params: [] }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        setError(data.error || "An error occurred");
      }
    } catch (err) {
      setError("Failed to execute query");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Database Query Interface</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-2 border rounded"
          rows="4"
          placeholder="Enter your SQL query here"
        />
        <button
          type="submit"
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Execute Query
        </button>
      </form>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {result && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Query Result:</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
