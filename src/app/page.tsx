"use client";
import { useEffect, useState, useCallback } from "react";
import { HardDrive, FileText, CheckCircle, Eye } from "lucide-react";

// S3 File එකක් සඳහා නිවැරදි TypeScript Type Interface එක
interface S3File {
  key: string;
  size: number;
  lastModified: string;
  url: string;
}

export default function Dashboard() {
  const [files, setFiles] = useState<S3File[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFiles = useCallback(async () => {
    try {
      const res = await fetch("/api/storage");
      const result = await res.json();
      if (result.success) {
        setFiles(result.data);
      }
    } catch (err) {
      console.error("Failed to fetch data", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // දැන් fetchFiles එක කලින්ම හදලා තියෙන නිසා මෙතන කිසිම අවුලක් වෙන්නේ නැහැ
  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const totalSize = files.reduce((acc, file) => acc + (file.size || 0), 0);
  
  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          Overview Metrics
        </h1>
        <p className="text-slate-400 text-sm mt-1">Real-time S3 storage insights and asset monitoring.</p>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-2xl flex items-center justify-between shadow-xl backdrop-blur-md">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Space Used</p>
            <h3 className="text-2xl font-bold mt-1 text-slate-100">{formatSize(totalSize)}</h3>
          </div>
          <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400"><HardDrive className="h-6 w-6" /></div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-2xl flex items-center justify-between shadow-xl backdrop-blur-md">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Assets</p>
            <h3 className="text-2xl font-bold mt-1 text-slate-100">{files.length} Files</h3>
          </div>
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400"><FileText className="h-6 w-6" /></div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-2xl flex items-center justify-between shadow-xl backdrop-blur-md">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">S3 Status</p>
            <h3 className="text-2xl font-bold mt-1 text-emerald-400 flex items-center gap-2">
              Active <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            </h3>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400"><CheckCircle className="h-6 w-6" /></div>
        </div>
      </div>

      {/* Grid Quick Asset Viewer */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-200">Recent S3 Objects</h2>
        {loading ? (
          <div className="h-40 flex items-center justify-center text-slate-500 text-sm">Loading S3 infrastructure metadata...</div>
        ) : files.length === 0 ? (
          <div className="p-12 border border-dashed border-slate-800 rounded-2xl text-center text-slate-500">No objects detected in S3 cluster.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {files.map((file) => {
              const isImage = /\.(jpg|jpeg|png|webp|gif)$/i.test(file.key);
              return (
                <div key={file.key} className="group relative bg-slate-900/20 border border-slate-800/60 rounded-2xl overflow-hidden hover:border-slate-700/80 transition-all duration-300 shadow-lg">
                  <div className="aspect-video w-full bg-slate-950 flex items-center justify-center border-b border-slate-800/60 overflow-hidden">
                    {isImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={file.url} alt={file.key} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <FileText className="h-10 w-10 text-slate-600" />
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-slate-400 truncate font-mono" title={file.key}>{file.key.split("-").slice(1).join("-") || file.key}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{formatSize(file.size)}</p>
                  </div>
                  <a href={file.url} target="_blank" rel="noreferrer" className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-950/80 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity hover:text-white backdrop-blur-md">
                    <Eye className="h-4 w-4" />
                  </a>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}