import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import * as tus from 'https://esm.sh/tus-js-client@4.3.1/lib.esm/browser/index.js?bundle';

const SUPABASE_URL = 'https://kepkisctnlomykhyqywh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtlcGtpc2N0bmxvbXlraHlxeXdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQyMDQ1NjUsImV4cCI6MjA5OTc4MDU2NX0.4RbX_nDxQDQHZ-vkNvvAtdv0TkWr_km51YnTFPGIV20';
const hasSupabaseConfig = !SUPABASE_ANON_KEY.startsWith('REPLACE_');
const supabase = hasSupabaseConfig ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

const demoState = {
  workspace: 'NoMeetings Internal',
  user: { name: 'Maya', email: 'maya@nomeetings.demo' },
  conversation: {
    title: 'Monthly numbers Conversation',
    due: 'Friday 5:00 PM',
    status: 'active',
    maxDuration: 600,
  },
  agenda: [
    { id: 'q4', title: 'Q4 Predictions', time: '00:48', required: true, assignee: 'Judy', note: 'Revenue model, product bets, and market risks.' },
    { id: 'numbers', title: 'Monthly Numbers', time: '03:12', required: true, assignee: 'John', note: 'MRR, churn, pipeline, and blockers.' },
    { id: 'launch', title: 'Launch Tasks', time: '06:44', required: false, assignee: 'Kate', note: 'Watch if you own launch, content, or QA work.' },
    { id: 'questions', title: 'Open Questions', time: '08:25', required: false, assignee: 'Everyone', note: 'Async follow-ups and text responses.' },
  ],
  entries: [
    { author: 'Maya', type: 'Host video', duration: '09:58', fresh: false, summary: 'Tagged agenda moments while recording one continuous update.' },
    { author: 'Kate', type: 'Screen share', duration: '04:20', fresh: true, summary: 'Added launch board context and requested Judy review Q4 assumptions.' },
    { author: 'John', type: 'Text response', duration: '01:10 read', fresh: true, summary: 'Confirmed monthly numbers and marked two blockers as overdue.' },
  ],
};

const app = document.querySelector('#app');
const themeToggle = document.querySelector('#themeToggle');
const agendaList = document.querySelector('#agendaList');
const entriesList = document.querySelector('#entriesList');
const statusLine = document.querySelector('#statusLine');
const authPanel = document.querySelector('#authPanel');
const emailForm = document.querySelector('#emailForm');
const emailInput = document.querySelector('#emailInput');
const emailSubmit = document.querySelector('#emailSubmit');
const markerLabel = document.querySelector('#markerLabel');
const markerTime = document.querySelector('#markerTime');
const markerLog = document.querySelector('#markerLog');
const responseButtons = document.querySelectorAll('[data-response-type]');
const uploadInput = document.querySelector('#uploadInput');
const landingView = document.querySelector('#landingView');
const dashboardView = document.querySelector('#dashboardView');
const dashboardUser = document.querySelector('#dashboardUser');
const dashboardEmail = document.querySelector('#dashboardEmail');
const dashboardThemeToggle = document.querySelector('#dashboardThemeToggle');
const signOutButton = document.querySelector('#signOutButton');
const workspaceName = document.querySelector('#workspaceName');
const dashboardStatus = document.querySelector('#dashboardStatus');
const conversationList = document.querySelector('#conversationList');
const emptyState = document.querySelector('#emptyState');
const conversationDialog = document.querySelector('#conversationDialog');
const conversationForm = document.querySelector('#conversationForm');
const conversationFormMessage = document.querySelector('#conversationFormMessage');
const createConversationButton = document.querySelector('#createConversationButton');
const conversationDetailDialog = document.querySelector('#conversationDetailDialog');
const workspaceMessage = document.querySelector('#workspaceMessage');
const workspaceAgenda = document.querySelector('#workspaceAgenda');
const workspaceParticipants = document.querySelector('#workspaceParticipants');
const workspaceEntries = document.querySelector('#workspaceEntries');
const agendaForm = document.querySelector('#agendaForm');
const inviteForm = document.querySelector('#inviteForm');
const textResponseForm = document.querySelector('#textResponseForm');
const workspaceUpload = document.querySelector('#workspaceUpload');
const recordAudioButton = document.querySelector('#recordAudioButton');
const recordVideoButton = document.querySelector('#recordVideoButton');
const stopRecordingButton = document.querySelector('#stopRecordingButton');
const uploadProgress = document.querySelector('#uploadProgress');
const uploadProgressBar = document.querySelector('#uploadProgressBar');
const responsePromptDialog = document.querySelector('#responsePromptDialog');

const dashboardState = {
  user: null,
  workspace: null,
  conversations: [],
  filter: 'all',
  currentConversation: null,
  agenda: [],
  participants: [],
  invites: [],
  entries: [],
  recorder: null,
  recordingStream: null,
  recordingChunks: [],
};

function escapeHTML(value = '') {
  return String(value).replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
  })[character]);
}

function formatDate(value, fallback = 'No deadline') {
  if (!value) return fallback;
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}

function setUploadProgress(message, percent = null, indeterminate = false) {
  workspaceMessage.textContent = message;
  uploadProgress.hidden = false;
  uploadProgress.classList.toggle('indeterminate', indeterminate);
  const value = percent ?? 0;
  uploadProgress.setAttribute('aria-valuenow', String(value));
  uploadProgressBar.style.width = indeterminate ? '' : `${value}%`;
}

function clearUploadProgress() {
  uploadProgress.hidden = true;
  uploadProgress.classList.remove('indeterminate');
  uploadProgressBar.style.width = '0%';
  uploadProgress.setAttribute('aria-valuenow', '0');
}

function setView(isSignedIn) {
  landingView.hidden = isSignedIn;
  dashboardView.hidden = !isSignedIn;
}

function renderAgenda() {
  agendaList.innerHTML = demoState.agenda.map((item) => `
    <article class="agenda-item" data-agenda-id="${item.id}">
      <button class="timestamp" data-time="${item.time}">${item.time}</button>
      <div>
        <h3>${item.title}</h3>
        <p>${item.note}</p>
        <small>${item.required ? `${item.assignee} must respond` : `${item.assignee} can skip`}</small>
      </div>
      <span class="pill ${item.required ? 'required' : ''}">${item.required ? 'Required' : 'Optional'}</span>
    </article>
  `).join('');
}

function renderEntries() {
  entriesList.innerHTML = demoState.entries.map((entry) => `
    <div class="clip">
      <b>${entry.author}</b><span>${entry.type}</span><em>${entry.duration}</em>${entry.fresh ? '<strong>new</strong>' : ''}
      <p>${entry.summary}</p>
    </div>
  `).join('');
}

function setTheme(isDark) {
  app.classList.toggle('dark', isDark);
  app.classList.toggle('light', !isDark);
  themeToggle.textContent = isDark ? 'Light mode' : 'Dark mode';
  if (dashboardThemeToggle) dashboardThemeToggle.textContent = isDark ? 'Light mode' : 'Dark mode';
  localStorage.setItem('nomeetings-theme', isDark ? 'dark' : 'light');
}

function addMarker(label, time) {
  const row = document.createElement('li');
  row.innerHTML = `<b>${time}</b> ${label}`;
  markerLog.prepend(row);
  markerLabel.value = '';
}

function updateDashboardCounts() {
  const counts = dashboardState.conversations.reduce((result, conversation) => {
    result[conversation.status] = (result[conversation.status] || 0) + 1;
    return result;
  }, {});
  document.querySelector('#activeCount').textContent = counts.active || 0;
  document.querySelector('#draftCount').textContent = counts.draft || 0;
  document.querySelector('#endedCount').textContent = (counts.ended || 0) + (counts.archived || 0);
}

function renderConversations() {
  const visible = dashboardState.conversations.filter((conversation) => {
    if (dashboardState.filter === 'all') return true;
    if (dashboardState.filter === 'ended') return ['ended', 'archived'].includes(conversation.status);
    return conversation.status === dashboardState.filter;
  });

  updateDashboardCounts();
  emptyState.hidden = dashboardState.conversations.length !== 0;
  conversationList.hidden = dashboardState.conversations.length === 0;

  if (dashboardState.conversations.length === 0) {
    dashboardStatus.textContent = '';
    conversationList.innerHTML = '';
    return;
  }

  dashboardStatus.textContent = visible.length
    ? `${visible.length} Conversation${visible.length === 1 ? '' : 's'}`
    : 'No Conversations match this filter.';
  conversationList.innerHTML = visible.map((conversation) => `
    <article class="conversation-card">
      <div>
        <span class="status-badge ${escapeHTML(conversation.status)}">${escapeHTML(conversation.status)}</span>
        <h3>${escapeHTML(conversation.title)}</h3>
        <p>${escapeHTML(conversation.description || 'No description yet.')}</p>
        <div class="conversation-card-meta">
          <span>${escapeHTML(conversation.workspaces?.name || 'Shared workspace')}</span>
          <span>Due ${escapeHTML(formatDate(conversation.due_at))}</span>
          <span>Up to ${Math.round(conversation.max_duration_seconds / 60)} minute clips</span>
        </div>
      </div>
      <div class="conversation-card-actions">
        <button class="ghost" type="button" data-view-conversation="${conversation.id}">View</button>
      </div>
    </article>
  `).join('');
}

async function loadConversations() {
  dashboardStatus.textContent = 'Loading your Conversations…';
  const { data, error } = await supabase
    .from('conversations')
    .select('id,workspace_id,title,description,due_at,status,max_duration_seconds,created_at,updated_at,workspaces(name)')
    .order('updated_at', { ascending: false });

  if (error) throw error;
  dashboardState.conversations = data || [];
  renderConversations();
}

async function loadDashboard(user) {
  dashboardState.user = user;
  dashboardUser.textContent = user.user_metadata?.display_name || user.email?.split('@')[0] || 'Member';
  dashboardEmail.textContent = user.email || '';
  dashboardStatus.textContent = 'Preparing your workspace…';

  const { data, error } = await supabase.rpc('ensure_user_workspace');
  if (error) {
    dashboardStatus.textContent = `Dashboard setup is not complete: ${error.message}`;
    workspaceName.textContent = 'Setup required';
    throw error;
  }

  dashboardState.workspace = data?.[0];
  if (!dashboardState.workspace) throw new Error('No workspace was returned for this account.');
  workspaceName.textContent = dashboardState.workspace.workspace_name;
  const { error: claimInviteError } = await supabase.rpc('claim_conversation_invites');
  if (claimInviteError) console.warn('Could not claim pending Conversation invites', claimInviteError);
  await loadConversations();
}

function openConversationDialog() {
  conversationForm.reset();
  document.querySelector('#conversationActive').checked = true;
  conversationFormMessage.textContent = '';
  conversationDialog.showModal();
  document.querySelector('#conversationTitle').focus();
}

function closeConversationDialog() {
  conversationDialog.close();
}

function renderConversationWorkspace() {
  document.querySelector('#agendaCount').textContent = `${dashboardState.agenda.length} item${dashboardState.agenda.length === 1 ? '' : 's'}`;
  document.querySelector('#participantCount').textContent = `${dashboardState.participants.length + dashboardState.invites.filter((invite) => !invite.accepted_at).length} people`;
  document.querySelector('#entryCount').textContent = `${dashboardState.entries.length} response${dashboardState.entries.length === 1 ? '' : 's'}`;

  workspaceAgenda.innerHTML = dashboardState.agenda.length ? dashboardState.agenda.map((item, index) => `
    <article class="workspace-row">
      <div><h4>${index + 1}. ${escapeHTML(item.title)}</h4><p>${escapeHTML(item.description || 'No additional context.')}</p></div>
      <div class="workspace-row-meta"><span class="pill ${item.default_required ? 'required' : ''}">${item.default_required ? 'Response required' : 'Optional'}</span></div>
    </article>`).join('') : '<div class="empty-inline">Add the questions or topics people should address.</div>';

  const participantRows = dashboardState.participants.map((participant) => `
    <article class="workspace-row">
      <div><h4>${escapeHTML(participant.profiles?.display_name || participant.profiles?.email || 'Participant')}</h4><p>${escapeHTML(participant.profiles?.email || '')}</p></div>
      <div class="workspace-row-meta"><span class="pill">${escapeHTML(participant.role)}</span><span class="pill ${participant.response_required ? 'required' : ''}">${participant.response_required ? escapeHTML(participant.response_status) : 'No response required'}</span></div>
    </article>`);
  const inviteRows = dashboardState.invites.filter((invite) => !invite.accepted_at).map((invite) => `
    <article class="workspace-row">
      <div><h4>${escapeHTML(invite.email)}</h4><p>Invitation waiting for this person to create or use their account.</p></div>
      <div class="workspace-row-meta"><span class="pill">${escapeHTML(invite.role)}</span><span class="pill">Pending invite</span></div>
    </article>`);
  workspaceParticipants.innerHTML = [...participantRows, ...inviteRows].join('') || '<div class="empty-inline">Invite the people who need this update.</div>';

  workspaceEntries.innerHTML = dashboardState.entries.length ? dashboardState.entries.map((entry) => `
    <article class="workspace-row">
      <span class="entry-kind">${escapeHTML(entry.kind)}</span>
      <div><h4>${escapeHTML(entry.profiles?.display_name || entry.profiles?.email || 'Participant')}</h4>${entry.text_body ? `<p>${escapeHTML(entry.text_body)}</p>` : `<p>${entry.status === 'ready' ? 'Clip uploaded and ready.' : escapeHTML(entry.status)}</p>`}${entry.media_url ? `<${entry.kind === 'audio' ? 'audio' : 'video'} class="entry-media" controls data-entry-media="${entry.id}" src="${escapeHTML(entry.media_url)}"></${entry.kind === 'audio' ? 'audio' : 'video'}>` : ''}</div>
      <div class="workspace-row-meta"><span>${escapeHTML(formatDate(entry.created_at))}</span></div>
    </article>`).join('') : '<div class="empty-inline">No responses yet. Upload a clip, record one, or write an update.</div>';

  workspaceEntries.querySelectorAll('video[data-entry-media]').forEach((video) => {
    video.addEventListener('ended', () => {
      const participant = dashboardState.participants.find((item) => item.user_id === dashboardState.user.id);
      const entry = dashboardState.entries.find((item) => item.id === video.dataset.entryMedia);
      if (participant?.role !== 'host' && entry?.author_id !== dashboardState.user.id) responsePromptDialog.showModal();
    });
  });
}

async function loadConversationWorkspace() {
  const conversationId = dashboardState.currentConversation.id;
  workspaceMessage.textContent = 'Loading agenda, participants, and responses…';
  const [agendaResult, participantResult, inviteResult, entryResult] = await Promise.all([
    supabase.from('agenda_items').select('*').eq('conversation_id', conversationId).order('position'),
    supabase.from('conversation_participants').select('user_id,role,response_required,response_status,created_at,profiles!conversation_participants_user_id_fkey(email,display_name)').eq('conversation_id', conversationId).order('created_at'),
    supabase.from('conversation_invites').select('id,email,role,response_required,accepted_at,created_at').eq('conversation_id', conversationId).order('created_at'),
    supabase.from('conversation_entries').select('id,author_id,kind,status,storage_bucket,storage_path,text_body,duration_seconds,size_bytes,created_at,profiles!conversation_entries_author_id_fkey(email,display_name)').eq('conversation_id', conversationId).order('created_at', { ascending: true }),
  ]);
  const error = agendaResult.error || participantResult.error || inviteResult.error || entryResult.error;
  if (error) throw error;
  dashboardState.agenda = agendaResult.data || [];
  dashboardState.participants = participantResult.data || [];
  dashboardState.invites = inviteResult.data || [];
  dashboardState.entries = entryResult.data || [];

  await Promise.all(dashboardState.entries.map(async (entry) => {
    if (!entry.storage_path || !entry.storage_bucket) return;
    const { data } = await supabase.storage.from(entry.storage_bucket).createSignedUrl(entry.storage_path, 3600);
    entry.media_url = data?.signedUrl || null;
  }));
  workspaceMessage.textContent = '';
  renderConversationWorkspace();
}

async function showConversationDetail(conversationId) {
  const conversation = dashboardState.conversations.find((item) => item.id === conversationId);
  if (!conversation) return;
  dashboardState.currentConversation = conversation;
  document.querySelector('#detailStatus').textContent = conversation.status;
  document.querySelector('#detailTitle').textContent = conversation.title;
  document.querySelector('#detailDescription').textContent = conversation.description || 'No description yet.';
  document.querySelector('#detailDue').textContent = `Due ${formatDate(conversation.due_at)}`;
  document.querySelector('#detailCreated').textContent = `Created ${formatDate(conversation.created_at, 'today')}`;
  conversationDetailDialog.showModal();
  try {
    await loadConversationWorkspace();
  } catch (error) {
    workspaceMessage.textContent = `Could not load this Conversation: ${error.message}`;
  }
}

async function uploadConversationClip(file, forcedKind) {
  if (!file || !dashboardState.currentConversation) return;
  const conversation = dashboardState.currentConversation;
  const kind = forcedKind || (file.type.startsWith('audio/') ? 'audio' : 'video');
  const extension = file.name?.split('.').pop() || (kind === 'audio' ? 'webm' : 'webm');
  const path = `${conversation.id}/${dashboardState.user.id}/${crypto.randomUUID()}.${extension}`;
  setUploadProgress(`Preparing ${file.name || `${kind} recording`}…`, 1);
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError || !session?.access_token) throw sessionError || new Error('Your sign-in session expired. Please sign in again.');

  await new Promise((resolve, reject) => {
    const upload = new tus.Upload(file, {
      endpoint: 'https://kepkisctnlomykhyqywh.storage.supabase.co/storage/v1/upload/resumable',
      retryDelays: [0, 3000, 5000, 10000, 20000],
      headers: { authorization: `Bearer ${session.access_token}`, 'x-upsert': 'false' },
      uploadDataDuringCreation: true,
      removeFingerprintOnSuccess: true,
      chunkSize: 6 * 1024 * 1024,
      metadata: {
        bucketName: 'conversation-clips',
        objectName: path,
        contentType: file.type || 'application/octet-stream',
        cacheControl: '3600',
      },
      onError: reject,
      onProgress: (bytesUploaded, bytesTotal) => {
        const percent = bytesTotal ? Math.round((bytesUploaded / bytesTotal) * 100) : 0;
        const uploadedMB = (bytesUploaded / 1024 / 1024).toFixed(1);
        const totalMB = (bytesTotal / 1024 / 1024).toFixed(1);
        setUploadProgress(`Uploading ${uploadedMB} of ${totalMB} MB — ${percent}%`, percent);
      },
      onSuccess: resolve,
    });
    upload.findPreviousUploads().then((previousUploads) => {
      if (previousUploads.length) upload.resumeFromPreviousUpload(previousUploads[0]);
      upload.start();
    }).catch(reject);
  });

  setUploadProgress('Upload finished. Saving the response…', 100);
  const { error: entryError } = await supabase.from('conversation_entries').insert({
    conversation_id: conversation.id,
    author_id: dashboardState.user.id,
    kind,
    status: 'ready',
    storage_bucket: 'conversation-clips',
    storage_path: path,
    size_bytes: file.size,
  });
  if (entryError) {
    await supabase.storage.from('conversation-clips').remove([path]);
    throw entryError;
  }
  await loadConversationWorkspace();
  setUploadProgress('Clip uploaded and ready.', 100);
}

async function startRecording(kind) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia(kind === 'video' ? { video: true, audio: true } : { audio: true });
    dashboardState.recordingStream = stream;
    dashboardState.recordingChunks = [];
    const recorder = new MediaRecorder(stream);
    dashboardState.recorder = recorder;
    recorder.addEventListener('dataavailable', (event) => { if (event.data.size) dashboardState.recordingChunks.push(event.data); });
    recorder.addEventListener('stop', async () => {
      const blob = new Blob(dashboardState.recordingChunks, { type: recorder.mimeType || `${kind}/webm` });
      dashboardState.recordingStream?.getTracks().forEach((track) => track.stop());
      recordAudioButton.disabled = false;
      recordVideoButton.disabled = false;
      stopRecordingButton.disabled = true;
      try { await uploadConversationClip(new File([blob], `${kind}-${Date.now()}.webm`, { type: blob.type }), kind); }
      catch (error) { workspaceMessage.textContent = `Could not save recording: ${error.message}`; }
    });
    recorder.start();
    recordAudioButton.disabled = true;
    recordVideoButton.disabled = true;
    stopRecordingButton.disabled = false;
    workspaceMessage.textContent = `Recording ${kind}…`;
  } catch (error) {
    workspaceMessage.textContent = `Could not start recording: ${error.message}`;
  }
}

async function refreshSession() {
  if (!supabase) {
    statusLine.textContent = 'Demo mode — add the anon key in app.js or inject it during build to connect Supabase.';
    authPanel.dataset.state = 'demo';
    return;
  }

  const { data } = await supabase.auth.getSession();
  const user = data.session?.user;
  statusLine.textContent = user ? `Signed in as ${user.email}` : 'Supabase connected — sign in with a magic link.';
  authPanel.dataset.state = user ? 'signed-in' : 'signed-out';
  setView(Boolean(user));
  if (user) {
    try {
      await loadDashboard(user);
    } catch (error) {
      console.error('Could not load dashboard', error);
    }
  }
}

themeToggle.addEventListener('click', () => setTheme(!app.classList.contains('dark')));
agendaList.addEventListener('click', (event) => {
  const button = event.target.closest('.timestamp');
  if (!button) return;
  addMarker(`Agenda tagged: ${button.closest('.agenda-item').querySelector('h3').textContent}`, button.dataset.time);
});

document.querySelector('#markerForm').addEventListener('submit', (event) => {
  event.preventDefault();
  if (!markerLabel.value.trim()) return;
  addMarker(markerLabel.value.trim(), markerTime.value || 'now');
});

responseButtons.forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelector('.capture-row .active')?.classList.remove('active');
    button.classList.add('active');
    statusLine.textContent = `${button.dataset.responseType} response selected. Recorder wiring is next.`;
  });
});

uploadInput.addEventListener('change', () => {
  const file = uploadInput.files?.[0];
  if (!file) return;
  statusLine.textContent = `Ready to upload ${file.name} (${Math.round(file.size / 1024 / 1024)} MB) to conversation-clips.`;
});

emailForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!supabase) {
    statusLine.textContent = 'Demo mode: Supabase auth is not connected in this checkout.';
    return;
  }
  const email = emailInput.value.trim();
  if (!email || !emailInput.checkValidity()) {
    emailInput.reportValidity();
    statusLine.textContent = 'Enter a valid email address to receive your magic link.';
    return;
  }

  emailSubmit.disabled = true;
  emailSubmit.textContent = 'Sending…';
  statusLine.textContent = `Sending a magic link to ${email}…`;

  try {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/` },
    });
    statusLine.textContent = error
      ? `Could not send the magic link: ${error.message}`
      : `Magic link sent to ${email}. Check your inbox and spam folder.`;
  } catch (error) {
    statusLine.textContent = `Could not contact Supabase: ${error.message}`;
  } finally {
    emailSubmit.disabled = false;
    emailSubmit.textContent = 'Send magic link';
  }
});

dashboardThemeToggle.addEventListener('click', () => setTheme(!app.classList.contains('dark')));
signOutButton.addEventListener('click', async () => {
  dashboardStatus.textContent = 'Signing out…';
  await supabase.auth.signOut();
  dashboardState.user = null;
  dashboardState.workspace = null;
  dashboardState.conversations = [];
  setView(false);
  statusLine.textContent = 'Signed out. Enter your email to return to NoMeetings.';
});

document.querySelector('#openConversationForm').addEventListener('click', openConversationDialog);
document.querySelector('#emptyCreateButton').addEventListener('click', openConversationDialog);
document.querySelector('#closeConversationForm').addEventListener('click', closeConversationDialog);
document.querySelector('#cancelConversationForm').addEventListener('click', closeConversationDialog);
document.querySelector('#closeDetail').addEventListener('click', () => conversationDetailDialog.close());

agendaForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!agendaForm.reportValidity() || !dashboardState.currentConversation) return;
  workspaceMessage.textContent = 'Adding agenda item…';
  const { error } = await supabase.from('agenda_items').insert({
    conversation_id: dashboardState.currentConversation.id,
    title: document.querySelector('#agendaTitle').value.trim(),
    description: document.querySelector('#agendaDescription').value.trim() || null,
    position: dashboardState.agenda.length,
    default_required: document.querySelector('#agendaRequired').checked,
  });
  if (error) workspaceMessage.textContent = `Could not add agenda item: ${error.message}`;
  else { agendaForm.reset(); await loadConversationWorkspace(); }
});

inviteForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!inviteForm.reportValidity() || !dashboardState.currentConversation) return;
  const email = document.querySelector('#inviteEmail').value.trim();
  workspaceMessage.textContent = `Inviting ${email}…`;
  const { error } = await supabase.rpc('invite_to_conversation', {
    target_conversation_id: dashboardState.currentConversation.id,
    target_email: email,
    target_role: document.querySelector('#inviteRole').value,
    target_response_required: document.querySelector('#inviteResponseRequired').checked,
  });
  if (error) {
    workspaceMessage.textContent = `Could not invite participant: ${error.message}`;
    return;
  }

  const { error: emailError } = await supabase.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: true, emailRedirectTo: `${window.location.origin}/` },
  });
  inviteForm.reset();
  document.querySelector('#inviteResponseRequired').checked = true;
  await loadConversationWorkspace();
  workspaceMessage.textContent = emailError
    ? `Access was added, but the invitation email could not be sent: ${emailError.message}`
    : `Invitation email sent to ${email}.`;
});

textResponseForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!textResponseForm.reportValidity() || !dashboardState.currentConversation) return;
  workspaceMessage.textContent = 'Posting response…';
  const { error } = await supabase.from('conversation_entries').insert({
    conversation_id: dashboardState.currentConversation.id,
    author_id: dashboardState.user.id,
    kind: 'text',
    status: 'ready',
    text_body: document.querySelector('#textResponseBody').value.trim(),
  });
  if (error) workspaceMessage.textContent = `Could not post response: ${error.message}`;
  else { textResponseForm.reset(); await loadConversationWorkspace(); }
});

workspaceUpload.addEventListener('change', async () => {
  const file = workspaceUpload.files?.[0];
  if (!file) return;
  try { await uploadConversationClip(file); }
  catch (error) { setUploadProgress(`Could not upload clip: ${error.message}`, 0); }
  finally { workspaceUpload.value = ''; }
});

recordAudioButton.addEventListener('click', () => startRecording('audio'));
recordVideoButton.addEventListener('click', () => startRecording('video'));
stopRecordingButton.addEventListener('click', () => dashboardState.recorder?.stop());
document.querySelector('#closeResponsePrompt').addEventListener('click', () => responsePromptDialog.close());
document.querySelector('#promptRecordAudio').addEventListener('click', () => {
  responsePromptDialog.close();
  startRecording('audio');
});
document.querySelector('#promptRecordVideo').addEventListener('click', () => {
  responsePromptDialog.close();
  startRecording('video');
});
document.querySelector('#promptUpload').addEventListener('click', () => {
  responsePromptDialog.close();
  workspaceUpload.click();
});
document.querySelector('#promptText').addEventListener('click', () => {
  responsePromptDialog.close();
  document.querySelector('#textResponseBody').scrollIntoView({ behavior: 'smooth', block: 'center' });
  document.querySelector('#textResponseBody').focus();
});

document.querySelector('.filter-pills').addEventListener('click', (event) => {
  const button = event.target.closest('[data-filter]');
  if (!button) return;
  dashboardState.filter = button.dataset.filter;
  document.querySelector('.filter-pills .active')?.classList.remove('active');
  button.classList.add('active');
  renderConversations();
});

conversationList.addEventListener('click', (event) => {
  const button = event.target.closest('[data-view-conversation]');
  if (button) showConversationDetail(button.dataset.viewConversation);
});

conversationForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!conversationForm.reportValidity() || !dashboardState.workspace) return;

  createConversationButton.disabled = true;
  createConversationButton.textContent = 'Creating…';
  conversationFormMessage.textContent = 'Creating your Conversation…';

  const payload = {
    workspace_id: dashboardState.workspace.workspace_id,
    host_id: dashboardState.user.id,
    title: document.querySelector('#conversationTitle').value.trim(),
    description: document.querySelector('#conversationDescription').value.trim() || null,
    due_at: document.querySelector('#conversationDue').value
      ? new Date(document.querySelector('#conversationDue').value).toISOString()
      : null,
    status: document.querySelector('#conversationActive').checked ? 'active' : 'draft',
    max_duration_seconds: Number(document.querySelector('#conversationDuration').value),
  };

  try {
    const { data: conversation, error: conversationError } = await supabase
      .from('conversations')
      .insert(payload)
      .select('id')
      .single();
    if (conversationError) throw conversationError;

    const { error: participantError } = await supabase.from('conversation_participants').insert({
      conversation_id: conversation.id,
      user_id: dashboardState.user.id,
      role: 'host',
      response_required: false,
      response_status: 'not_required',
    });
    if (participantError) throw participantError;

    await loadConversations();
    closeConversationDialog();
    dashboardStatus.textContent = `“${payload.title}” is ready.`;
  } catch (error) {
    conversationFormMessage.textContent = `Could not create Conversation: ${error.message}`;
  } finally {
    createConversationButton.disabled = false;
    createConversationButton.textContent = 'Create Conversation';
  }
});

if (supabase) {
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' && session?.user && session.user.id !== dashboardState.user?.id) {
      setView(true);
      loadDashboard(session.user).catch((error) => console.error('Could not load dashboard', error));
    }
    if (event === 'SIGNED_OUT') setView(false);
  });
}

renderAgenda();
renderEntries();
setTheme(localStorage.getItem('nomeetings-theme') !== 'light');
refreshSession();
