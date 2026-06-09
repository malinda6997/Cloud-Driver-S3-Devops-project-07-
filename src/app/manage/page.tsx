"use client";
import { useState, useEffect, useCallback } from "react";
import { UploadCloud, Trash2, RefreshCcw } from "lucide-react";

interface S3File {
  key: string;
  size: number;
  lastModified: string;
  url: string;
}

export default function ManageItems() {
  const [files, setFiles] = useState<S3File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchFiles = useCallback(async () => {
    setRefreshing(true);
    try {
      const res = await fetch("/api/storage");
      const result = await res.json();
      if (result.success) {
        setFiles(result.data);
      }
    } catch {
      alert("Error handling S3 objects synchronization.");
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setUploading(true);

    const formData = new FormData();
    formData.append("file", e.target.files[0]);

    try {
      const res = await fetch("/api/storage", { method: "POST", body: formData });
      const result = await res.json();
      if (result.success) {
        fetchFiles();
      } else {
        alert(result.error);
      }
    } catch {
      alert("Internal pipeline mapping error during upload.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (key: string) => {
    if (!confirm("Are you sure you want to absolute delete this node from S3?")) return;
    try {
      const res = await fetch(`/api/storage?key=${encodeURIComponent(key)}`, { method: "DELETE" });
      const result = await res.json();
      if (result.success) {
        setFiles((prevFiles) => prevFiles.filter((f) => f.key !== key));
      } else {
        alert(result.error);
      }
    } catch {
      alert("Error deleting S3 cluster array target.");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Control Panel
          </h1>
          <p className="text-slate-400 text-sm mt-1">Direct upload stream pipeline and atomic array cluster deletions.</p>
        </div>
        <button onClick={fetchFiles} className="self-start sm:self-center flex items-center gap-2 text-xs bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-xl hover:bg-slate-800 text-slate-300 transition-colors">
          <RefreshCcw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} /> Sync Cluster
        </button>
      </div>

      {/* Modern Upload Zone */}
      <div className="bg-slate-900/20 border border-dashed border-slate-800 hover:border-cyan-500/50 transition-all duration-300 p-8 rounded-2xl text-center relative group">
        <input type="file" onChange={handleUpload} disabled={uploading} className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed" />
        <div className="flex flex-col items-center justify-center space-y-3 pointer-events-none">
          <div className="p-4 rounded-full bg-slate-900 text-cyan-400 group-hover:scale-110 transition-transform duration-300 border border-slate-800">
            <UploadCloud className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-200">{uploading ? "Streaming to AWS S3..." : "Click or Drag file to sync node"}</p>
            <p className="text-xs text-slate-500 mt-1">Supports any binary content stream format up to S3 limits</p>
          </div>
        </div>
      </div>

      {/* Control Asset Table */}
      <div className="bg-slate-900/30 border border-slate-800/80 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800/80 bg-slate-900/60 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                <th className="py-4 px-6">File Node Signature</th>
                <th className="py-4 px-6">Size Grid</th>
                <th className="py-4 px-6 hidden md:table-cell">Timestamp Created</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 text-sm text-slate-300">
              {files.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-10 text-center text-slate-500 text-xs font-mono">No active runtime files mapping to show.</td>
                </tr>
              ) : (
                files.map((file) => (
                  <tr key={file.key} className="hover:bg-slate-900/30 transition-colors group">
                    <td className="py-4 px-6 font-mono text-xs max-w-[200px] truncate text-slate-200" title={file.key}>
                      {file.key.split("-").slice(1).join("-") || file.key}
                    </td>
                    <td className="py-4 px-6 text-slate-400 text-xs font-mono">
                      {file.size ? (file.size / 1024 / 1024).toFixed(2) + " MB" : "0 MB"}
                    </td>
                    <td className="py-4 px-6 text-slate-500 text-xs hidden md:table-cell">
                      {new Date(file.lastModified).toLocaleString()}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button onClick={() => handleDelete(file.key)} className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors" title="Purge Asset">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}