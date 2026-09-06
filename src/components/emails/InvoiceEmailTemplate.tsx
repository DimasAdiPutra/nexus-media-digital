import React from 'react';

interface InvoiceEmailTemplateProps {
  clientName: string;
  companyName: string;
  invoiceNumber: string;
  totalAmount: number;
  dueDate: Date;
  invoiceUrl: string;
}

export const InvoiceEmailTemplate: React.FC<InvoiceEmailTemplateProps> = ({
  clientName,
  companyName,
  invoiceNumber,
  totalAmount,
  dueDate,
  invoiceUrl,
}) => {
  const formattedAmount = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(totalAmount);

  const formattedDueDate = new Date(dueDate).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', color: '#0f172a', lineHeight: '1.5' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
        <h2 style={{ color: '#4f46e5', marginTop: 0 }}>Nexus Media Digital</h2>
        <p>Halo {clientName} ({companyName}),</p>
        <p>
          Berikut adalah rincian tagihan faktur resmi untuk transaksi Anda dengan nomor tagihan <strong>{invoiceNumber}</strong>:
        </p>
        
        <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '6px', margin: '20px 0' }}>
          <p style={{ margin: '4px 0' }}><strong>Nomor Invoice:</strong> {invoiceNumber}</p>
          <p style={{ margin: '4px 0' }}><strong>Total Tagihan:</strong> {formattedAmount}</p>
          <p style={{ margin: '4px 0' }}><strong>Jatuh Tempo:</strong> {formattedDueDate}</p>
        </div>

        <p>Silakan klik tombol di bawah ini untuk melihat rincian lengkap dan instruksi pembayaran:</p>
        
        <div style={{ textAlign: 'center', margin: '30px 0' }}>
          <a
            href={invoiceUrl}
            style={{
              backgroundColor: '#4f46e5',
              color: '#ffffff',
              padding: '12px 24px',
              borderRadius: '6px',
              textDecoration: 'none',
              fontWeight: 'bold',
              display: 'inline-block',
            }}
          >
            Lihat & Bayar Invoice
          </a>
        </div>

        <p style={{ fontSize: '12px', color: '#64748b', marginTop: '30px' }}>
          Jika Anda memiliki pertanyaan mengenai faktur ini, silakan hubungi tim keuangan Nexus Media Digital.
        </p>
      </div>
    </div>
  );
};