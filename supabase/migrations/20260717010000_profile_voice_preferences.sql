-- Each author can choose the local text-to-speech voice used for their text entries.
alter table public.profiles add column if not exists tts_voice text;
