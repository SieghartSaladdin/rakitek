"use client";

import { useMemo, useState } from "react";
import styles from "./calendar.module.css";

interface DateRangeCalendarProps {
  startDate: Date | null;
  endDate: Date | null;
  onSelectRange: (start: Date | null, end: Date | null) => void;
  heading?: string;
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function startOfDay(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

function buildMonthCells(year: number, month: number): Array<Date | null> {
  const firstDay = new Date(year, month, 1);
  const startWeekday = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: Array<Date | null> = [];
  for (let i = 0; i < startWeekday; i += 1) cells.push(null);
  for (let d = 1; d <= daysInMonth; d += 1) {
    cells.push(new Date(year, month, d));
  }
  return cells;
}

export function DateRangeCalendar({
  startDate,
  endDate,
  onSelectRange,
  heading = "Select departure window",
}: DateRangeCalendarProps) {
  const today = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }, []);

  const [baseMonth, setBaseMonth] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );

  const months = useMemo(
    () => [
      new Date(baseMonth.getFullYear(), baseMonth.getMonth(), 1),
      new Date(baseMonth.getFullYear(), baseMonth.getMonth() + 1, 1),
    ],
    [baseMonth],
  );

  const handleDayClick = (day: Date) => {
    const clickedTs = startOfDay(day);
    if (!startDate || (startDate && endDate)) {
      onSelectRange(day, null);
      return;
    }
    const startTs = startOfDay(startDate);
    if (clickedTs < startTs) onSelectRange(day, startDate);
    else onSelectRange(startDate, day);
  };

  const todayTs = startOfDay(today);
  const startTs = startDate ? startOfDay(startDate) : null;
  const endTs = endDate ? startOfDay(endDate) : null;

  return (
    <div>
      <div className={styles.calendarNav}>
        <button
          type="button"
          className={styles.calendarNavBtn}
          aria-label="Previous month"
          onClick={() => setBaseMonth((p) => new Date(p.getFullYear(), p.getMonth() - 1, 1))}
        >
          &lt;
        </button>
        <span className={styles.calendarEyebrow}>{heading}</span>
        <button
          type="button"
          className={styles.calendarNavBtn}
          aria-label="Next month"
          onClick={() => setBaseMonth((p) => new Date(p.getFullYear(), p.getMonth() + 1, 1))}
        >
          &gt;
        </button>
      </div>

      <div className={styles.calendarShell}>
        {months.map((monthDate) => {
          const cells = buildMonthCells(monthDate.getFullYear(), monthDate.getMonth());
          const monthTitle = monthDate.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          });
          return (
            <div key={monthTitle}>
              <div className={styles.calendarMonthTitle}>{monthTitle}</div>
              <div className={styles.calendarGrid}>
                {WEEKDAYS.map((wd) => (
                  <div key={wd} className={styles.calendarWeekday}>
                    {wd}
                  </div>
                ))}
                {cells.map((cell, idx) => {
                  if (!cell) return <div key={`empty-${idx}`} />;
                  const ts = startOfDay(cell);
                  const isDisabled = ts < todayTs;
                  const isEndpoint = ts === startTs || ts === endTs;
                  const isInRange = startTs !== null && endTs !== null && ts > startTs && ts < endTs;
                  return (
                    <button
                      key={ts}
                      type="button"
                      disabled={isDisabled}
                      className={`${styles.calendarDay} ${isEndpoint ? styles.dayEndpoint : ""} ${isInRange ? styles.dayInRange : ""}`.trim()}
                      onClick={() => handleDayClick(cell)}
                    >
                      {cell.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
