'use client';

import React, { useRef } from 'react';
import type { Order } from '@/types';
import InvoiceTemplate from './InvoiceTemplate';
import { Button } from '@/components/ui/Button';
import { Download } from 'lucide-react';

interface PrintableInvoiceProps {
  order: Order;
}

export default function PrintableInvoice({ order }: PrintableInvoiceProps) {
  const invoiceRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  // Determine if branding should be shown based on order source
  const showBranding = order.order_source === 'customer';

  return (
    <div>
      {/* Print Button - Hidden during print */}
      <div className="no-print mb-6">
        <Button
          onClick={handlePrint}
          className="bg-orange-500 hover:bg-orange-600 text-white"
        >
          <Download className="h-5 w-5 mr-2" />
          Download Invoice
        </Button>
      </div>

      {/* Invoice Template */}
      <div ref={invoiceRef} className="print-content">
        <InvoiceTemplate order={order} showBranding={showBranding} />
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-content,
          .print-content * {
            visibility: visible;
          }
          .print-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
