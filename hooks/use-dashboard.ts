import { useState, useEffect } from "react";
import { obtenerResumenMes } from "@/actions/transacciones";

export function useDashboardData() {
  const [data, setData] = useState({ ingresos: 0, gastos: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const resumen = await obtenerResumenMes();
      setData(resumen);
      setLoading(false);
    }
    fetchData();
  }, []);

  return { data, loading };
}