"use client"

import React, { useState } from "react";
import GenerateShortLink from "../generateLink/page";
import GenerateQR from "../generateQR/page";
import ShowStatistics from "../showStats/page";

const sidebarOptions = [
  { key: "shorten", label: "Shorten URL" },
  { key: "qr", label: "Make QR Code" },
  { key: "stats", label: "See Statistics" },
];

const Sidebar = ({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (key: string) => void;
}) => (
  <div className="w-60 h-screen bg-gray-100 flex flex-col gap-6 shadow-md items-center">
    <h2 className="mb-8 text-gray-800 font-bold text-xl mt-8">Dashboard</h2>
    <div className="flex-1 flex flex-col justify-center w-full gap-4">
      {sidebarOptions.map((opt) => (
        <button
          key={opt.key}
          onClick={() => onSelect(opt.key)}
          className={`w-4/5 mx-auto text-left px-6 py-3 rounded-lg font-medium text-base transition-colors
            ${
              selected === opt.key
                ? "bg-blue-500 text-white"
                : "bg-transparent text-gray-800 hover:bg-blue-100"
            }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  </div>
);






const renderContent = (selected: string) => {
  switch (selected) {
    case "shorten":
      return <GenerateShortLink />;
    case "qr":
      return <GenerateQR />;
    case "stats":
      return <ShowStatistics />;
    default:
      return <GenerateShortLink />;
  }
};

const Dashboard = () => {
  const [selected, setSelected] = useState("shorten");

  return (
    <div className="h-screen w-screen flex">
      {/* Sidebar */}
      <Sidebar selected={selected} onSelect={setSelected} />

      {/* Main Content */}
      <div className="flex-1 bg-white p-10 overflow-auto">
        {renderContent(selected)}
      </div>
    </div>
  );
};


export default Dashboard;
