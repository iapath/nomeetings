import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    const authorization = req.headers.get('Authorization');
    if (!authorization) return Response.json({ error: 'Sign in is required.' }, { status: 401, headers: corsHeaders });
    const apiKey = Deno.env.get('ELEVENLABS_API_KEY');
    if (!apiKey) throw new Error('Voice services are not connected yet.');
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const userClient = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY')!, { global: { headers: { Authorization: authorization } } });
    const adminClient = createClient(supabaseUrl, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError || !user) return Response.json({ error: 'Your sign-in session expired.' }, { status: 401, headers: corsHeaders });

    const { entry_id: entryId } = await req.json();
    const { data: entry, error: entryError } = await userClient.from('conversation_entries')
      .select('id,kind,storage_bucket,storage_path,text_body,tts_alignment').eq('id', entryId).single();
    if (entryError || !entry) return Response.json({ error: 'Recording was not found.' }, { status: 404, headers: corsHeaders });
    if (!['audio', 'video', 'screen'].includes(entry.kind) || !entry.storage_bucket || !entry.storage_path) {
      return Response.json({ error: 'This entry is not a recording.' }, { status: 400, headers: corsHeaders });
    }
    if (entry.text_body && entry.tts_alignment?.length) return Response.json({ text: entry.text_body, alignment: entry.tts_alignment }, { headers: corsHeaders });

    const { data: signed, error: signedError } = await adminClient.storage.from(entry.storage_bucket).createSignedUrl(entry.storage_path, 900);
    if (signedError || !signed?.signedUrl) throw signedError || new Error('The recording could not be opened.');
    const form = new FormData();
    form.append('cloud_storage_url', signed.signedUrl);
    form.append('model_id', 'scribe_v2');
    form.append('timestamps_granularity', 'word');
    form.append('diarize', 'false');
    const transcriptResponse = await fetch('https://api.elevenlabs.io/v1/speech-to-text', { method: 'POST', headers: { 'xi-api-key': apiKey }, body: form });
    if (!transcriptResponse.ok) throw new Error(`Transcription failed (${transcriptResponse.status}): ${(await transcriptResponse.text()).slice(0, 240)}`);
    const transcript = await transcriptResponse.json();
    const alignment = (transcript.words || [])
      .filter((word: { type?: string; text?: string; start?: number; end?: number }) => word.type === 'word' && word.text && Number.isFinite(word.start) && Number.isFinite(word.end))
      .map((word: { text: string; start: number; end: number }) => ({ text: word.text.trim(), start: word.start, end: word.end }));
    const text = String(transcript.text || alignment.map((word: { text: string }) => word.text).join(' ')).trim();
    if (!text) throw new Error('No speech was found in this recording.');
    const { error: updateError } = await adminClient.from('conversation_entries').update({ text_body: text, tts_alignment: alignment }).eq('id', entry.id);
    if (updateError) throw updateError;
    return Response.json({ text, alignment }, { headers: corsHeaders });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : 'Could not transcribe recording.' }, { status: 500, headers: corsHeaders });
  }
});
