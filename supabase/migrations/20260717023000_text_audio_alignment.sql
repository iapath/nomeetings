-- Character timing from ElevenLabs, grouped into words for synchronized highlighting.
alter table public.conversation_entries add column if not exists tts_alignment jsonb;
