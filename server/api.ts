import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { createTokenWithParams } from './packages/pumpfun/example/basic/createToken';
import path from 'path';
import fs from 'fs';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();
const upload = multer({ dest: 'temp/' });

// Configure CORS and JSON parsing
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));
app.use(express.json());

// First, let's add the necessary type definitions at the top of the file
interface TokenCreationResult {
  success: boolean;
  mintAddress?: string;
  mint?: {
    toString: () => string;
  };
  transaction?: any;
  url?: string;
}

// Token creation endpoints (TypeScript)
app.post('/api/create-token', upload.single('file'), async (req, res) => {
  try {
    console.log('=== Starting Token Creation Process ===');
    console.log('Received file:', req.file);
    console.log('Received body:', req.body);

    const imagePath = req.file ? req.file.path : path.join(__dirname, 'packages/pumpfun/example/basic/random.png');

    const result = await createTokenWithParams({
      name: req.body.name,
      symbol: req.body.symbol,
      description: req.body.description,
      unitLimit: parseFloat(req.body.unitLimit) || 1000000,
      unitPrice: parseFloat(req.body.unitPrice) || 0,
      initialBuyAmount: parseFloat(req.body.initialBuyAmount) || 0,
      imagePath,
      twitter: req.body.twitter || '',
      telegram: req.body.telegram || '',
      website: req.body.website || ''
    }) as TokenCreationResult;

    // Clean up temporary file
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }

    // Ensure result has the expected properties
    console.log('Token creation result:', result);

    // Get the mint address from either mintAddress or mint
    const mintAddress = result?.mintAddress || result?.mint?.toString() || 'unknown';

    // Structure the success response
    const response = {
      success: true,
      data: {
        mintAddress,
        transaction: result?.transaction || {},
        url: result?.url || `https://pump.fun/${mintAddress}`
      },
      message: 'Token created successfully'
    };

    console.log('Sending response:', response);
    return res.json(response);

  } catch (error) {
    console.error('Token creation error:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred',
      message: 'Token creation failed'
    });
  }
});

// Proxy other requests to Python API
app.use('/api/agents', createProxyMiddleware({
  target: 'http://localhost:8080',
  changeOrigin: true
}));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`TypeScript API running on port ${PORT}`);
}); 