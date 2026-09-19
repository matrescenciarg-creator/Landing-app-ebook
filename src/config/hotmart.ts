// Configuración centralizada de Hotmart y enlaces de pago
export const HOTMART_CONFIG = {
  // Enlace directo de checkout de Hotmart
  checkoutUrl: 'https://pay.hotmart.com/V107391774I', 
  
  // Precio configurado
  priceUSD: 10,
  
  // Nombre del producto
  productName: 'Pack Completo Método Vínculo · App Suite + Ebook + 3 Bonos',

  // Si está en true, al hacer clic en los botones de compra se abrirá directamente tu checkout de Hotmart
  // Si está en false o vacío, abre la ventana modal de pago
  useDirectHotmartCheckout: true,
};
