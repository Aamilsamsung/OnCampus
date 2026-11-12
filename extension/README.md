# OnCampus extension v0.3
Auto-scans only the currently open, explicitly approved WhatsApp Web chat. It does NOT automatically open 100 chats or scan hidden message history. New messages matching event keywords are queued locally, deduplicated by normalized SHA-256 message text, and can be submitted to the website's private admin queue.

## Setup
1. Load unpacked \`extension\` at chrome://extensions.
2. Open WhatsApp Web and approve the current group in the extension popup.
3. Enable automatic scanning.
4. Configure Supabase and run supabase/schema.sql. Create your Supabase Auth admin user and add their user ID to public.admins.
5. Add each approved group label to public.approved_groups (group_ref and label both matching displayed WhatsApp chat name).
6. Enter your **short-lived Supabase admin access token** and select campus in the popup; enable auto submit. Do not use a service-role key or collector secret in the extension. This MVP stores the token in Chrome local extension storage; it is not recommended for shared computers or long-term use. Tokens expire and require renewal.
7. New event candidates are submitted to /api/extension/intake and stored as pending. Review and publish in the admin page.

## Limits
Chrome and WhatsApp Web must be open; only the active approved group is observed. Exact normalized-message duplicates are skipped locally and in the database; paraphrased announcements may still duplicate. Event title and category extraction are heuristic, not Gemini. Auto-submit requires live Supabase and valid admin auth. Avoid processing chats without appropriate consent.
