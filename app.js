import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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

const dashboardState = {
  user: null,
  workspace: null,
  conversations: [],
  filter: 'all',
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
    .select('id,title,description,due_at,status,max_duration_seconds,created_at,updated_at')
    .eq('workspace_id', dashboardState.workspace.workspace_id)
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

function showConversationDetail(conversationId) {
  const conversation = dashboardState.conversations.find((item) => item.id === conversationId);
  if (!conversation) return;
  document.querySelector('#detailStatus').textContent = conversation.status;
  document.querySelector('#detailTitle').textContent = conversation.title;
  document.querySelector('#detailDescription').textContent = conversation.description || 'No description yet.';
  document.querySelector('#detailDue').textContent = `Due ${formatDate(conversation.due_at)}`;
  document.querySelector('#detailCreated').textContent = `Created ${formatDate(conversation.created_at, 'today')}`;
  conversationDetailDialog.showModal();
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
