'use client';

import React from 'react';
import type { Order } from '@/types';

interface InvoiceTemplateProps {
  order: Order;
  showBranding?: boolean; // Control whether to show Enakart branding
}

export default function InvoiceTemplate({ order, showBranding = true }: InvoiceTemplateProps) {
  const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.18; // 18% GST
  const total = order.total_amount;

  return (
    <div className="bg-white text-black p-8 max-w-4xl mx-auto">
      {/* Header with conditional branding */}
      <div className="border-b-2 border-gray-300 pb-6 mb-6">
        {showBranding ? (
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-black">ENAKART</h1>
              <p className="text-sm text-gray-600 mt-1">Premium Optical Solutions</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">www.enakart.com</p>
              <p className="text-sm text-gray-600">support@enakart.com</p>
              <p className="text-sm text-gray-600">+91 XXX-XXX-XXXX</p>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <h1 className="text-3xl font-bold text-black">INVOICE</h1>
          </div>
        )}
      </div>

      {/* Invoice Details */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="text-lg font-semibold mb-3 text-black">Invoice Details</h2>
          <div className="space-y-2">
            <p className="text-sm">
              <span className="font-medium text-black">Invoice Number:</span>{' '}
              <span className="text-gray-700">{order.order_number}</span>
            </p>
            <p className="text-sm">
              <span className="font-medium text-black">Order ID:</span>{' '}
              <span className="text-gray-700">{order.id}</span>
            </p>
            <p className="text-sm">
              <span className="font-medium text-black">Date:</span>{' '}
              <span className="text-gray-700">{new Date(order.created_at).toLocaleDateString()}</span>
            </p>
            <p className="text-sm">
              <span className="font-medium text-black">Payment Status:</span>{' '}
              <span className="text-gray-700 capitalize">{order.payment_status}</span>
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3 text-black">Shipping Address</h2>
          <div className="text-sm text-gray-700">
            <p className="font-medium text-black">{order.shipping_address.full_name}</p>
            <p>{order.shipping_address.address_line1}</p>
            {order.shipping_address.address_line2 && (
              <p>{order.shipping_address.address_line2}</p>
            )}
            <p>
              {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.pincode}
            </p>
            <p className="mt-2">Phone: {order.shipping_address.phone}</p>
          </div>
        </div>
      </div>

      {/* Order Items Table */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4 text-black">Order Items</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-black">
                Item
              </th>
              <th className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold text-black">
                Quantity
              </th>
              <th className="border border-gray-300 px-4 py-3 text-right text-sm font-semibold text-black">
                Price
              </th>
              <th className="border border-gray-300 px-4 py-3 text-right text-sm font-semibold text-black">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, index) => (
              <tr key={item.id || index} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-3 text-sm">
                  <div className="flex items-center gap-3">
                    {item.product_image && (
                      <img
                        src={item.product_image}
                        alt={item.product_name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    )}
                    <div>
                      <p className="font-medium text-black">{item.product_name}</p>
                      {item.prescription_file && (
                        <p className="text-xs text-gray-600">With Prescription</p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="border border-gray-300 px-4 py-3 text-center text-sm text-gray-700">
                  {item.quantity}
                </td>
                <td className="border border-gray-300 px-4 py-3 text-right text-sm text-gray-700">
                  ₹{item.price.toFixed(2)}
                </td>
                <td className="border border-gray-300 px-4 py-3 text-right text-sm font-medium text-black">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Payment Summary */}
      <div className="flex justify-end mb-8">
        <div className="w-80">
          <div className="space-y-2 bg-gray-50 p-4 rounded">
            <div className="flex justify-between text-sm">
              <span className="text-gray-700">Subtotal:</span>
              <span className="text-black font-medium">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-700">Tax (18% GST):</span>
              <span className="text-black font-medium">₹{tax.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-300 pt-2 mt-2">
              <div className="flex justify-between text-lg font-bold">
                <span className="text-black">Total:</span>
                <span className="text-black">₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer with conditional branding */}
      {showBranding && (
        <div className="border-t-2 border-gray-300 pt-6 mt-8">
          <div className="text-center text-sm text-gray-600">
            <p className="font-medium text-black mb-2">Thank you for shopping with Enakart!</p>
            <p>For any queries, please contact us at support@enakart.com</p>
            <p className="mt-2">This is a computer-generated invoice and does not require a signature.</p>
          </div>
        </div>
      )}

      {!showBranding && (
        <div className="border-t-2 border-gray-300 pt-6 mt-8">
          <div className="text-center text-sm text-gray-600">
            <p>This is a computer-generated invoice and does not require a signature.</p>
          </div>
        </div>
      )}
    </div>
  );
}
