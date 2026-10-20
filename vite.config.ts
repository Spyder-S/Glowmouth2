import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
// @ts-expect-error Server-only JavaScript handler.
import waitlist from './api/waitlist.js'

export default defineConfig({
  plugins: [react(), {
    name: 'waitlist-api',
    configureServer(server) {
      const env = loadEnv(server.config.mode, process.cwd(), '')
      for (const key of ['SUPABASE_URL','SUPABASE_SERVICE_ROLE_KEY','EMAILJS_SERVICE_ID','EMAILJS_TEMPLATE_ID','EMAILJS_PUBLIC_KEY','EMAILJS_PRIVATE_KEY']) {
        if (env[key]) process.env[key] = env[key]
      }
      server.middlewares.use('/api/waitlist', async (req, res) => {
        // Adapt Node responses to the Vercel handler without changing its storage path.
        const response = Object.assign(res, {
          status(code: number) { res.statusCode = code; return response },
          json(body: unknown) { res.end(JSON.stringify(body)); return response },
        })
        try {
          if (req.method === 'POST') {
            let body = ''
            for await (const chunk of req) {
              body += chunk
              if (body.length > 8192) { response.status(413).json({error:'Request too large.'}); return }
            }
            Object.assign(req, {body})
          }
          await waitlist(req, response)
        } catch { response.status(500).json({error:'Unable to connect. Please try again later.'}) }
      })
    },
  }],
  server: {port:5180},
})
