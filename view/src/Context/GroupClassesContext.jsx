import React, { createContext, useContext, useState } from "react";
import {
  groupClassRequest,
  reserveGroupClassRequest,
  cancelGroupClassReservationRequest,
  deleteGroupClassRequest,
} from "../api/class";

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
      const startOfWeek = new Date(
        inputDate.setDate(inputDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1))
      );

      // Fechas de lunes a domingo de la semana actual
      const dates = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        return date.toISOString().split("T")[0];
      });

      // Pedir clases de la semana actual
      const classesByDay = await Promise.all(
        dates.map(async (date) => {
          const response = await groupClassRequest(date);
          return { date, classes: response.data.classes };
        })
      );

      setWeeklyClasses(classesByDay);
    } catch (error) {
      console.error("[GroupClassesContext] Error al obtener las clases de la semana:", error);
    } finally {
      setLoading(false);
    }
  };

  const reserveGroupClass = async (classId) => {
    try {
      setLoading(true);
      const response = await reserveGroupClassRequest(classId);
      return response.data;
    } catch (error) {
      console.error("[GroupClassesContext] Error al reservar clase:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Error en la reserva");
    } finally {
      setLoading(false);
    }
  };

  const cancelGroupClassReservation = async (classId) => {
    try {
      setLoading(true);
      const response = await cancelGroupClassReservationRequest(classId);
      return response.data;
    } catch (error) {
      console.error("[GroupClassesContext] Error al cancelar reserva:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Error al cancelar la reserva");
    } finally {
      setLoading(false);
    }
  };

  const deleteGroupClass = async (classId) => {
    try {
      setLoading(true);
      const response = await deleteGroupClassRequest(classId);
      return response.data;
    } catch (error) {
      console.error("[GroupClassesContext] Error al eliminar clase:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Error al eliminar la clase");
    } finally {
      setLoading(false);
    }
  };

  return (
    <GroupClassContext.Provider
      value={{
        weeklyClasses,
        fetchClassesByWeek,
        reserveGroupClass,
        cancelGroupClassReservation,
        deleteGroupClass,
        loading,
      }}
    >
      {children}
    </GroupClassContext.Provider>
  );
};