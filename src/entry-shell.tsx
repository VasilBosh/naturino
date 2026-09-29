// Използва се САМО при build (npm run build), не и в браузъра.
// Рисува първия екран като готов HTML, който се слага директно в index.html.
// Така телефонът показва Hero и снимката на продукта веднага, без да чака JavaScript-а,
// а после React само го "съживява".
import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { AppContent } from './App';

export function render() {
  return renderToString(
    <StrictMode>
      <StaticRouter location="/">
        <AppContent />
      </StaticRouter>
    </StrictMode>
  );
}
