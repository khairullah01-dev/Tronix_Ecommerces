import React from "react";

const StatCard = ({ label, value, trend }) => {
  return (
    <article className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">{label}</p>
      <div className="mt-3 flex items-end justify-between gap-3">
        <h3 className="text-2xl font-black text-gray-900">{value}</h3>
        <span className="rounded-sm bg-red-50 px-2 py-1 text-xs font-bold text-red-500">{trend}</span>
      </div>
    </article>
  );
};

export default StatCard;
