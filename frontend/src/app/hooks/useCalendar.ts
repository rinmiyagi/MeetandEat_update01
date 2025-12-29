import { useState } from "react";
import { ViewType } from "../lib/types";

export const useCalendar = (initialView: ViewType = "week") => {
    const [currentView, setCurrentView] = useState<ViewType>(initialView);
    const [currentDate, setCurrentDate] = useState(() => {
        const today = new Date();
        const day = today.getDay();
        const diff = today.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(today.setDate(diff));
    });
    const [selectedSlots, setSelectedSlots] = useState<Set<string>>(new Set());

    const handlePreviousView = () => {
        const newDate = new Date(currentDate);
        switch (currentView) {
            case "day":
                newDate.setDate(newDate.getDate() - 1);
                break;
            case "week":
                newDate.setDate(newDate.getDate() - 7);
                break;
            case "month":
                newDate.setMonth(newDate.getMonth() - 1);
                break;
            case "year":
                newDate.setFullYear(newDate.getFullYear() - 1);
                break;
        }
        setCurrentDate(newDate);
    };

    const handleNextView = () => {
        const newDate = new Date(currentDate);
        switch (currentView) {
            case "day":
                newDate.setDate(newDate.getDate() + 1);
                break;
            case "week":
                newDate.setDate(newDate.getDate() + 7);
                break;
            case "month":
                newDate.setMonth(newDate.getMonth() + 1);
                break;
            case "year":
                newDate.setFullYear(newDate.getFullYear() + 1);
                break;
        }
        setCurrentDate(newDate);
    };

    const handleViewChange = (view: ViewType) => setCurrentView(view);

    const handleDateClick = (date: Date) => {
        setCurrentDate(date);
        setCurrentView("day");
    };

    const handleMonthClick = (monthIndex: number) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(monthIndex);
        newDate.setDate(1);
        setCurrentDate(newDate);
        setCurrentView("month");
    };

    const toggleSlot = (slotKey: string) => {
        setSelectedSlots((prev) => {
            const next = new Set(prev);
            if (next.has(slotKey)) next.delete(slotKey);
            else next.add(slotKey);
            return next;
        });
    };

    return {
        currentView,
        currentDate,
        selectedSlots,
        setCurrentDate,
        setCurrentView,
        setSelectedSlots,
        handlePreviousView,
        handleNextView,
        handleViewChange,
        handleDateClick,
        handleMonthClick,
        toggleSlot
    };
};
