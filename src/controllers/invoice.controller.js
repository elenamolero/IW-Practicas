import Invoice from "../models/invoice.model.js";
import User from "../models/user.model.js";
import Pay from "../models/pay.model.js";

// Función para generar un número de factura único
const generateInvoiceNumber = async () => {
  const date = new Date();
  const year = date.getFullYear().toString().substring(2); // Últimos 2 dígitos del año
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  
  // Buscar la última factura del mes actual
  const lastInvoice = await Invoice.findOne({
    invoiceNumber: new RegExp(`^F${year}${month}`)
  }).sort({ invoiceNumber: -1 });
  
  let sequence = 1;
  if (lastInvoice) {
    // Extraer el número de secuencia de la última factura
    const lastSequence = parseInt(lastInvoice.invoiceNumber.substring(6));
    sequence = lastSequence + 1;
  }
  
  // Formato: FYYMMNNNN (F = Factura, YY = Año, MM = Mes, NNNN = Número secuencial)
  return `F${year}${month}${sequence.toString().padStart(4, '0')}`;
};

// Generar factura mensual
export const generateMonthlyInvoice = async (req, res) => {
  try {
    const { month, year, recipientTaxId, recipientAddress, paymentMethod } = req.body;
    const userId = req.user.id;
    
    // Verificar si el usuario existe
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "Usuario no encontrado"
      });
    }
    
    // Verificar si ya existe una factura para este mes y año
    const existingInvoice = await Invoice.findOne({
      'recipient.user': userId,
      'period.month': month,
      'period.year': year
    });
    
    if (existingInvoice) {
      return res.status(400).json({
        message: "Ya existe una factura para este mes y año",
        invoice: existingInvoice
      });
    }
    
    // Generar número de factura único
    const invoiceNumber = await generateInvoiceNumber();
    
    // Calcular el precio de la suscripción mensual (esto podría venir de una configuración o del perfil del usuario)
    const monthlySubscriptionPrice = 49.99; // Ejemplo de precio fijo
    
    // Calcular los impuestos
    const taxRate = 21; // 21% IVA
    const subtotal = monthlySubscriptionPrice;
    const taxAmount = (subtotal * taxRate) / 100;
    const total = subtotal + taxAmount;
    
    // Crear la factura
    const newInvoice = new Invoice({
      invoiceNumber,
      period: {
        month,
        year
      },
      recipient: {
        user: userId,
        name: `${user.firstName} ${user.lastName}`,
        taxId: recipientTaxId || "",
        address: recipientAddress || "",
        bankAccount: user.bankAccount || ""
      },
      items: [
        {
          description: `Suscripción mensual - ${getMonthName(month)} ${year}`,
          quantity: 1,
          unitPrice: monthlySubscriptionPrice,
          taxRate
        }
      ],
      subtotal,
      taxAmount,
      total,
      paymentMethod,
      status: 'issued'
    });
    
    // Guardar la factura
    const savedInvoice = await newInvoice.save();
    
    // Crear un registro de pago asociado
    const newPayment = new Pay({
      user: userId,
      amount: total,
      paymentMethod,
      description: `Pago de factura ${invoiceNumber}`,
      dueDate: new Date(year, month, 10), // Fecha de vencimiento: día 10 del mes siguiente
      relatedService: 'membership',
      relatedServiceId: savedInvoice._id
    });
    
    const savedPayment = await newPayment.save();
    
    // Actualizar la factura con la referencia al pago
    savedInvoice.payment = savedPayment._id;
    await savedInvoice.save();
    
    res.status(201).json({
      message: "Factura generada exitosamente",
      invoice: savedInvoice,
      payment: savedPayment
    });
    
  } catch (error) {
    console.error("Error al generar la factura: ", error);
    res.status(500).json({ message: error.message });
  }
};

// Obtener todas las facturas del usuario
export const getUserInvoices = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const invoices = await Invoice.find({
      'recipient.user': userId
    }).sort({ 'period.year': -1, 'period.month': -1 });
    
    res.json(invoices);
    
  } catch (error) {
    console.error("Error al obtener las facturas: ", error);
    res.status(500).json({ message: error.message });
  }
};

// Obtener una factura específica
export const getInvoiceById = async (req, res) => {
  try {
    const { invoiceId } = req.params;
    const userId = req.user.id;
    
    const invoice = await Invoice.findOne({
      _id: invoiceId,
      'recipient.user': userId
    });
    
    if (!invoice) {
      return res.status(404).json({
        message: "Factura no encontrada"
      });
    }
    
    res.json(invoice);
    
  } catch (error) {
    console.error("Error al obtener la factura: ", error);
    res.status(500).json({ message: error.message });
  }
};

// Función auxiliar para obtener el nombre del mes
const getMonthName = (month) => {
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  return months[month - 1];
}; 