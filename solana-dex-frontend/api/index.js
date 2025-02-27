export default function handler(req, res) {
    res.statusCode = 301;
    res.setHeader('Location', 'https://cryptosion.io/ai-tracker');
    res.end();
  }
  