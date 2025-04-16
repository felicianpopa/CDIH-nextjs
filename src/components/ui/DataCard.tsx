"use client";

import { Suspense } from "react";
import { DataCardSimple } from "FE-utils";

export interface DataCardItemProps {
  cardData: {
    title: string;
    icon: string;
    iconBg: string;
    iconColor: string;
    value: string;
  };
}

// Individual card component
function DataCardItem({ cardData }: DataCardItemProps) {
  return <DataCardSimple cardData={cardData} />;
}

// Loading component to show while DataCard is loading
const DataCardLoading = () => (
  <div className="card" style={{ height: "100%", minHeight: "120px" }}>
    <div className="card-body d-flex align-items-center justify-content-center">
      <span className="loading loading-spinner loading-md"></span>
    </div>
  </div>
);

// Main component that renders multiple cards with suspense
export interface DataCardProps {
  cardsData: Array<{
    title: string;
    icon: string;
    iconBg: string;
    iconColor: string;
    value: string;
  }>;
}

export default function DataCard({ cardsData }: DataCardProps) {
  return (
    <div className="row gy-4">
      {cardsData.map((card, index) => (
        <div key={index} className="col-12 col-md-4">
          <Suspense fallback={<DataCardLoading />}>
            <DataCardItem cardData={card} />
          </Suspense>
        </div>
      ))}
    </div>
  );
}
