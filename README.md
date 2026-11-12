# OnCampus
A student-built event discovery website for PES University campuses. **Not an official PES University service.**
## Included
- Next.js responsive public feed and campus/category/search filters
- Supabase PostgreSQL RLS schema, admin login, approval queue, event pages
- Secure ingestion endpoint restricted to official PES domains or explicitly approved WhatsApp group identifiers
- PES official-domain candidate-link finder (manual use only)
- Chrome extension **scaffold only**; it cannot yet scan WhatsApp group messages
- No fabricated events, no Google Search
## Run locally
Install Node.js 22. Run \`npm install\`, copy \`.env.example\` to \`.env.local\`, then \`npm run dev\`.
For real data, run \`supabase/schema.sql\` in Supabase SQL editor. Configure \`NEXT_PUBLIC_SUPABASE_URL\`, \`NEXT_PUBLIC_SUPABASE_ANON_KEY\`, \`SUPABASE_SERVICE_ROLE_KEY\`, and a strong random \`COLLECTOR_SECRET\`. Create an administrator in Supabase Auth, then insert their auth user UUID into \`public.admins\` securely. Verify and add official PES source URLs into \`public.approved_sources\`.
Only approved events become public. Unconfigured deployments show an empty event feed instead of sample data.
## Render (Node web service)
Repository: https://github.com/Aamilsamsung/OnCampus ; branch: main ; runtime: Node ; build: \`npm install && npm run build\` ; start: \`npm start\` ; plan: free where available. Set Supabase environment variables in Render before enabling the admin and event feeds.
## Remaining integrations
Gemini structured extraction, WhatsApp group-specific user-authorized capture, scheduled PES cloud monitoring, reminders, admin editing and production observability. Do not claim these work before implementation and consent-based testing.
