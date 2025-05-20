import React, { createContext, useContext, useState } from "react";
import { groupClassRequest } from "../api/class"; 

const GroupClassContext = createContext();

export const useGroupClass = () => useContext(GroupClassContext);

export const GroupClassProvider = ({ children }) => {
  const [weeklyClasses, setWeeklyClasses] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchClassesByWeek = async (startDate) => {
    try {
      setLoading(true);

      // Calcular el inicio de la semana (lunes)
      const inputDate = new Date(startDate);
      const dayOfWeek = inputDate.getDay();
      const startOfWeek = new Date(inputDate.setDate(inputDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)));

      // Fechas de lunes a domingo de la semana actual
      const dates = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        return date.toISOString().split("T")[0];
      });

      // Fechas de la semana anterior
      const prevWeekStart = new Date(startOfWeek);
      prevWeekStart.setDate(startOfWeek.getDate() - 7);
      const prevWeekDates = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(prevWeekStart);
        date.setDate(prevWeekStart.getDate() + i);
        return date.toISOString().split("T")[0];
      });

      // Pedir clases de la semana actual
      const classesByDay = await Promise.all(
        dates.map(async (date) => {
          const response = await groupClassRequest(date);
          return { date, classes: response.data.classes };
        })
      );

      // Si hay días vacíos, pedir la semana anterior y copiar las clases si existen
      const hasEmptyDays = classesByDay.some(day => !day.classes || day.classes.length === 0);
      let prevWeekClasses = [];
      if (hasEmptyDays) {
        prevWeekClasses = await Promise.all(
          prevWeekDates.map(async (date) => {
            const response = await groupClassRequest(date);
            return { date, classes: response.data.classes };
          })
        );
      }

      // Rellenar días vacíos con los de la semana anterior
      const filledClasses = classesByDay.map((day, idx) => {
        if (!day.classes || day.classes.length === 0) {
          const prev = prevWeekClasses[idx];
          return prev && prev.classes.length > 0
            ? { ...day, classes: prev.classes }
            : day;
        }
        return day;
      });

      setWeeklyClasses(filledClasses);
    } catch (error) {
      console.error("Error al obtener las clases de la semana:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GroupClassContext.Provider value={{ weeklyClasses, fetchClassesByWeek, loading }}>
      {children}
    </GroupClassContext.Provider>
  );
};