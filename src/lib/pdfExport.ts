import { Resource } from '../types';

export function exportCategoryToPdf(categoryTitle: string, resources: Resource[]) {
  // Create an iframe or printable window
  const printWindow = window.open('', '_blank', 'width=800,height=900');
  if (!printWindow) {
    // If popup blocked, trigger standard window.print
    window.print();
    return;
  }

  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const rows = resources
    .map(
      (r, idx) => `
      <tr style="border-bottom: 1px solid #e5e2da;">
        <td style="padding: 10px 8px; font-weight: 600; color: #1a1a1a; width: 4%;">#${idx + 1}</td>
        <td style="padding: 10px 8px; font-weight: 600; color: #1a1a1a; width: 30%;">
          <a href="${r.url}" style="color: #1a1a1a; text-decoration: underline;" target="_blank">${r.name}</a>
          ${r.is_new ? '<span style="background: #6E7A99; color: white; font-size: 10px; padding: 2px 6px; border-radius: 9999px; margin-left: 6px;">NEW</span>' : ''}
        </td>
        <td style="padding: 10px 8px; color: #444; width: 44%; font-size: 13px;">${r.description}</td>
        <td style="padding: 10px 8px; color: #666; width: 12%; font-size: 13px;">${r.cost}</td>
        <td style="padding: 10px 8px; color: #8B3A2F; font-weight: bold; width: 10%; text-align: right;">${'★'.repeat(r.rank)}</td>
      </tr>
    `
    )
    .join('');

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Vault IB - ${categoryTitle} Export</title>
        <style>
          @page {
            margin: 1.5cm;
            size: A4 portrait;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: #ffffff;
            color: #1a1a1a;
            margin: 0;
            padding: 24px;
            font-size: 14px;
            line-height: 1.5;
          }
          .header {
            border-bottom: 2px solid #8B3A2F;
            padding-bottom: 16px;
            margin-bottom: 24px;
          }
          .title {
            font-size: 24px;
            font-weight: 800;
            color: #8B3A2F;
            margin: 0;
            letter-spacing: -0.5px;
          }
          .subtitle {
            font-size: 15px;
            color: #555555;
            margin: 6px 0 0 0;
            font-weight: 500;
          }
          .meta {
            font-size: 12px;
            color: #777777;
            margin-top: 6px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            text-align: left;
          }
          th {
            background-color: #F4F2ED;
            color: #1a1a1a;
            padding: 8px;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border-bottom: 2px solid #e5e2da;
          }
          .footer {
            margin-top: 32px;
            padding-top: 12px;
            border-top: 1px solid #e5e2da;
            font-size: 11px;
            color: #777777;
            display: flex;
            justify-content: space-between;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 class="title">VAULT IB</h1>
          <h2 class="subtitle">Category: ${categoryTitle}</h2>
          <div class="meta">Exported on ${dateStr} • ${resources.length} curated free resources listed</div>
        </div>

        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Resource Name</th>
              <th>Description</th>
              <th>Access</th>
              <th style="text-align: right;">Rating</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>

        <div class="footer">
          <div>Vault IB - Curated Free IB Diploma Programme Study Resources Hub</div>
          <div>Printed from vault-ib.vercel.app</div>
          <div>Mirror: ib-vault-pro.vercel.app</div>
        </div>
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
  }, 350);
}
