import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import "./Styles/ReceiptsListPage.css";

function ReceiptsListPage() {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReceipts = async () => {
      try {
          const res = await fetch("http://localhost:4000/api/my-invoices", {
          credentials: "include", 
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        setReceipts(data); 
      } catch (err) {
        console.error("Error al cargar los recibos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReceipts();
  }, []);

  if (loading) return <div className="receipts-page pt-20">Cargando...</div>;

  return (
    <div className="receipts-page">
      <Navbar />
      <div className="receipts-container">
        <h1 className="receipts-title">LISTA DE RECIBOS</h1>
        <table className="receipts-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Importe</th>
              <th>Cuenta bancaria</th>
            </tr>
          </thead>
          <tbody>
            {receipts.map((receipt, index) => (
              <tr key={index}>
                <td>
                  {new Date(receipt.createdAt).toLocaleDateString("es-ES")}
                </td>
                <td>{receipt.amount.toFixed(2).replace(".", ",")}</td>
                <td>{maskBankAccount(receipt.bankAccount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Utilidad para ocultar parte del IBAN o número de cuenta
function maskBankAccount(account) {
  if (!account) return "****";
  const visible = account.slice(0, 8);
  return `${visible}****`;
}

export default ReceiptsListPage;
