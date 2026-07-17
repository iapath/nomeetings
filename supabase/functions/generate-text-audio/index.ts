import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const apiKey = Deno.env.get('ELEVENLABS_API_KEY');
    if (!apiKey) throw new Error('ElevenLabs is not connected yet.');
    const authorization = req.headers.get('Authorization');
    if (!authorization) return Response.json({ error: 'Sign in is required.' }, { status: 401, headers: corsHeaders });

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const userClient = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY')!, {
      global: { headers: { Authorization: authorization } },
    });
    const adminClient = createClient(supabaseUrl, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError || !user) return Response.json({ error: 'Your sign-in session expired.' }, { status: 401, headers: corsHeaders });

    const { entry_id: entryId } = await req.json();
    if (!entryId) return Response.json({ error: 'entry_id is required.' }, { status: 400, headers: corsHeaders });
    const { data: entry, error: entryError } = await userClient.from('conversation_entries')
      .select('id,conversation_id,author_id,kind,text_body,storage_bucket,storage_path,tts_alignment').eq('id', entryId).single();
    if (entryError || !entry) return Response.json({ error: 'Text response was not found.' }, { status: 404, headers: corsHeaders });
    if (entry.kind !== 'text' || !entry.text_body) {
      return Response.json({ error: 'This entry is not a typed response.' }, { status: 400, headers: corsHeaders });
    }
    if (entry.storage_path?.endsWith('-timed.mp3') && entry.tts_alignment) {
      return Response.json({ storage_bucket: entry.storage_bucket, storage_path: entry.storage_path, tts_alignment: entry.tts_alignment }, { headers: corsHeaders });
    }

    const { data: profile } = await userClient.from('profiles').select('tts_voice').eq('id', entry.author_id).single();
    const voiceId = profile?.tts_voice || Deno.env.get('ELEVENLABS_DEFAULT_VOICE_ID') || 'JBFqnCBsd6RMkjVDRZzb';
    const speechResponse = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}/with-timestamps?output_format=mp3_44100_128`, {
      method: 'POST',
      headers: { 'xi-api-key': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: `<break time="0.45s" />${entry.text_body}<break time="0.65s" />`,
        model_id: 'eleven_multilingual_v2',
        voice_settings: { stability: 0.55, similarity_boost: 0.8, style: 0.15, use_speaker_boost: true, speed: 1.0 },
      }),
    });
    if (!speechResponse.ok) throw new Error(`ElevenLabs generation failed (${speechResponse.status}): ${(await speechResponse.text()).slice(0, 240)}`);

    const speech = await speechResponse.json();
    const audio = Uint8Array.from(atob(speech.audio_base64), (character) => character.charCodeAt(0));
    const sourceAlignment = speech.alignment || speech.normalized_alignment;
    const words: Array<{ text: string; start: number; end: number }> = [];
    let current = '';
    let start = 0;
    let end = 0;
    let insideTag = false;
    (sourceAlignment?.characters || []).forEach((character: string, index: number) => {
      if (character === '<') { insideTag = true; return; }
      if (insideTag) { if (character === '>') insideTag = false; return; }
      const characterStart = sourceAlignment.character_start_times_seconds[index] || 0;
      const characterEnd = sourceAlignment.character_end_times_seconds[index] || characterStart;
      if (/\s/.test(character)) {
        if (current) { words.push({ text: current, start, end }); current = ''; }
        return;
      }
      if (!current) start = characterStart;
      current += character;
      end = characterEnd;
    });
    if (current) words.push({ text: current, start, end });
    const storagePath = `${entry.conversation_id}/${entry.author_id}/tts/${entry.id}-timed.mp3`;
    const { error: uploadError } = await adminClient.storage.from('conversation-clips').upload(storagePath, audio, {
      contentType: 'audio/mpeg', cacheControl: '31536000', upsert: true,
    });
    if (uploadError) throw uploadError;
    const { error: updateError } = await adminClient.from('conversation_entries').update({
      storage_bucket: 'conversation-clips', storage_path: storagePath, size_bytes: audio.byteLength, tts_alignment: words,
    }).eq('id', entry.id);
    if (updateError) throw updateError;

    return Response.json({ storage_bucket: 'conversation-clips', storage_path: storagePath, tts_alignment: words }, { headers: corsHeaders });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : 'Could not generate speech.' }, { status: 500, headers: corsHeaders });
  }
});
