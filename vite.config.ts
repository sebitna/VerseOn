import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { recommendVerses } from './lib/recommendVerses';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'dev-api-recommend',
        configureServer(server) {
          server.middlewares.use('/api/recommend', (req, res, next) => {
            if (req.method !== 'POST') {
              res.statusCode = 405;
              res.end(JSON.stringify({ error: 'Method not allowed' }));
              return;
            }

            let body = '';
            req.on('data', (chunk) => {
              body += chunk;
            });
            req.on('end', () => {
              void (async () => {
                try {
                  const apiKey = env.GEMINI_API_KEY;
                  if (!apiKey) {
                    res.statusCode = 500;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ error: 'GEMINI_API_KEY is not configured' }));
                    return;
                  }

                  const parsed = JSON.parse(body) as {
                    category?: string;
                    query?: string;
                    language?: string;
                  };

                  if (!parsed.language || (!parsed.category && !parsed.query?.trim())) {
                    res.statusCode = 400;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(
                      JSON.stringify({ error: 'language and category or query are required' }),
                    );
                    return;
                  }

                  const references = await recommendVerses(
                    {
                      category: parsed.category,
                      query: parsed.query,
                      language: parsed.language,
                    },
                    apiKey,
                  );

                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ references }));
                } catch (error) {
                  const message = error instanceof Error ? error.message : 'Unknown error';
                  res.statusCode = 500;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: message }));
                }
              })();
            });
            req.on('error', next);
          });
        },
      },
    ],
  };
});
