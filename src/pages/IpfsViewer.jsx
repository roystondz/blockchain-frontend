import React from "react";

const IPFS_GATEWAY = "https://gateway.pinata.cloud/ipfs/";

export default function IpfsViewer({ hash }) {
  if (!hash) return <p>No file available</p>;

  const url = IPFS_GATEWAY + hash;

  const isPDF = hash.endsWith(".pdf") || url.includes(".pdf");

  return (
    <div className="w-full mt-4">
      <a
        href={url}
        target="_blank"
        className="text-blue-500 underline"
      >
        Open File
      </a>

      {isPDF ? (
        <iframe
          src={url}
          className="w-full h-[600px] border mt-3 rounded-lg"
        ></iframe>
      ) : (
        <img
          src={url}
          alt="Report"
          className="mt-3 max-h-[500px] rounded-lg shadow"
        />
      )}
    </div>
  );
}
