"use client";

import { useState } from "react";
import { Meetings } from "web-appointment-calendar-component";
import Layout from "@/components/Layout";

const MeetingsPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const saveSelectedDate = () => {
    console.warn("Sending to server:", selectedDate);
  };

  const clearSelectedDate = () => {
    setSelectedDate(null);
  };

  return (
    <Layout>
      <>
        <Meetings
          selectedDateFromParent={selectedDate}
          onDateChange={setSelectedDate}
        />
        <button disabled={!selectedDate} onClick={saveSelectedDate}>
          Save this date
        </button>
        <button disabled={!selectedDate} onClick={clearSelectedDate}>
          Cancel my appointment
        </button>
      </>
    </Layout>
  );
};

export default MeetingsPage;
