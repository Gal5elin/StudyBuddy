import { useEffect, useState } from "react";
import { serveFile } from "../../api/notesApi";
import { Worker, Viewer, SpecialZoomLevel } from "@react-pdf-viewer/core";
import { toolbarPlugin } from "@react-pdf-viewer/toolbar";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/toolbar/lib/styles/index.css";

const PDFViewer = ({ noteId, fileId }: { noteId: number; fileId: number }) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const toolbarPluginInstance = toolbarPlugin();

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        setLoading(true);
        setError(null);
        const url = await serveFile(noteId, fileId);
        setPdfUrl(url);
      } catch (err: any) {
        setError(err.message || "Failed to load the PDF file.");
      } finally {
        setLoading(false);
      }
    };

    fetchPdf();

    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [noteId]);

  if (loading) {
    return (
      <div className="pdf-viewer-loading">
        <div className="spinner"></div>
        <p>Loading PDF...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pdf-viewer-error">
        <p>Error: {error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="pdf-viewer-container">
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
        <div className="pdf-viewer-toolbar">
          <toolbarPluginInstance.Toolbar />
        </div>
        <div
          style={{
            height: "1000px",
            width: "100%",
            border: "1px solid #ccc",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          {pdfUrl && (
            <Viewer
              fileUrl={pdfUrl}
              plugins={[toolbarPluginInstance]}
              defaultScale={SpecialZoomLevel.PageWidth}
            />
          )}
        </div>
      </Worker>
    </div>
  );
};

export default PDFViewer;
