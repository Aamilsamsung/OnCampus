# OnCampus Chrome extension (v0.2)
1. Open \`chrome://extensions\`, enable Developer mode, click **Load unpacked**, and select the \`extension\` folder from a local checkout.
2. Open WhatsApp Web and a group where you have permission to process announcements.
3. Click **Approve current group**. Group selection currently matches its displayed title, so similarly named groups may collide; do not use it for sensitive chats.
4. Click **Capture visible event posts**, review each result and select only event announcements you have permission to share.
5. Export selected posts as a local JSON file. No network upload happens. Import to admin is **not yet implemented**.
Chrome alarms create a daily reminder/checkpoint, not unattended message scanning. WhatsApp Web UI changes may break extraction. This is an opt-in manual capture MVP, not a background surveillance tool.
