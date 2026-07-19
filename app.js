import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import * as tus from 'https://esm.sh/tus-js-client@4.3.1/lib.esm/browser/index.js?bundle';
import JSZip from 'https://esm.sh/jszip@3.10.1';

const SUPABASE_URL = 'https://kepkisctnlomykhyqywh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtlcGtpc2N0bmxvbXlraHlxeXdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQyMDQ1NjUsImV4cCI6MjA5OTc4MDU2NX0.4RbX_nDxQDQHZ-vkNvvAtdv0TkWr_km51YnTFPGIV20';
const hasSupabaseConfig = !SUPABASE_ANON_KEY.startsWith('REPLACE_');
const supabase = hasSupabaseConfig ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

const demoState = {
  workspace: 'NoMeetings Internal',
  user: { name: 'Maya', email: 'maya@nomeetings.demo' },
  conversation: {
    title: 'Monthly numbers Drop',
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
const recordScreenButton = document.querySelector('#recordScreenButton');
const stopRecordingButton = document.querySelector('#stopRecordingButton');
const uploadProgress = document.querySelector('#uploadProgress');
const uploadProgressBar = document.querySelector('#uploadProgressBar');
const responsePromptDialog = document.querySelector('#responsePromptDialog');
const dashboardAvatar = document.querySelector('#dashboardAvatar');
const dashboardAvatarFallback = document.querySelector('#dashboardAvatarFallback');
const profileDialog = document.querySelector('#profileDialog');
const profileForm = document.querySelector('#profileForm');
const profileAvatarInput = document.querySelector('#profileAvatarInput');
const profileAvatarPreview = document.querySelector('#profileAvatarPreview');
const profileAvatarFallback = document.querySelector('#profileAvatarFallback');
const profileMessage = document.querySelector('#profileMessage');
const saveProfileButton = document.querySelector('#saveProfileButton');
const profileVoiceSelect = document.querySelector('#profileVoiceSelect');
const playNewButton = document.querySelector('#playNewButton');
const playAllButton = document.querySelector('#playAllButton');
const stopPlaybackButton = document.querySelector('#stopPlaybackButton');
const playbackStatus = document.querySelector('#playbackStatus');
const focusPlayerDialog = document.querySelector('#focusPlayerDialog');
const focusStage = document.querySelector('#focusStage');
const focusCard = document.querySelector('#focusCard');
const focusSpeaker = document.querySelector('#focusSpeaker');
const focusContent = document.querySelector('#focusContent');
const focusPauseButton = document.querySelector('#focusPauseButton');
const focusCloseButton = document.querySelector('#focusCloseButton');
const focusProgress = document.querySelector('#focusProgress');
const recordingSectionDock = document.querySelector('#recordingSectionDock');
const recordingSectionLabel = document.querySelector('#recordingSectionLabel');
const recordingSectionTime = document.querySelector('#recordingSectionTime');
const recordingAgendaButtons = document.querySelector('#recordingAgendaButtons');
const recordingBookmarkButton = document.querySelector('#recordingBookmarkButton');
const sectionReviewDialog = document.querySelector('#sectionReviewDialog');
const sectionReviewList = document.querySelector('#sectionReviewList');
const sectionReviewMessage = document.querySelector('#sectionReviewMessage');
const publishSectionsButton = document.querySelector('#publishSectionsButton');
const teamSettings = document.querySelector('#teamSettings');
const teamMemberList = document.querySelector('#teamMemberList');
const teamInviteEmail = document.querySelector('#teamInviteEmail');
const teamInviteButton = document.querySelector('#teamInviteButton');
const teamMessage = document.querySelector('#teamMessage');
const teamSeatCount = document.querySelector('#teamSeatCount');
const dropFileInput = document.querySelector('#dropFileInput');
const dropFileList = document.querySelector('#dropFileList');
const dropFileCount = document.querySelector('#dropFileCount');
const dropFileMessage = document.querySelector('#dropFileMessage');
const downloadAllFilesButton = document.querySelector('#downloadAllFilesButton');
const pendingFileList = document.querySelector('#pendingFileList');
if (!navigator.mediaDevices?.getDisplayMedia) {
  recordScreenButton.hidden = true;
  document.querySelector('#promptRecordScreen').hidden = true;
}

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
  sections: [],
  recorder: null,
  recordingStream: null,
  recordingSourceStreams: [],
  recordingAudioContext: null,
  recordingChunks: [],
  profile: null,
  watchProgress: new Map(),
  autoplayActive: false,
  playbackCancelled: false,
  currentMedia: null,
  playbackResolve: null,
  recordingStartedAt: 0,
  recordingSections: [],
  recordingSectionTimer: null,
  pendingSectionReview: null,
  teamMembers: [],
  teamInvites: [],
  dropFiles: [],
  pendingFiles: [],
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

function profileInitial(profile) {
  return (profile?.display_name || profile?.email || 'M').trim().charAt(0).toUpperCase();
}

function avatarMarkup(profile) {
  return profile?.avatar_url
    ? `<img class="row-avatar" src="${escapeHTML(profile.avatar_url)}" alt="" />`
    : `<span class="row-avatar-fallback">${escapeHTML(profileInitial(profile))}</span>`;
}

function personHue(entry) {
  const value = entry.author_id || entry.profiles?.email || 'participant';
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) hash = ((hash << 5) - hash + value.charCodeAt(index)) | 0;
  return Math.abs(hash) % 360;
}

function renderAccountProfile() {
  const profile = dashboardState.profile;
  dashboardUser.textContent = profile?.display_name || dashboardState.user?.email?.split('@')[0] || 'Member';
  dashboardEmail.textContent = profile?.email || dashboardState.user?.email || '';
  const initial = profileInitial(profile);
  dashboardAvatarFallback.textContent = initial;
  profileAvatarFallback.textContent = initial;
  if (profile?.avatar_url) {
    dashboardAvatar.src = profile.avatar_url;
    dashboardAvatar.hidden = false;
    dashboardAvatarFallback.hidden = true;
    profileAvatarPreview.src = profile.avatar_url;
    profileAvatarPreview.hidden = false;
    profileAvatarFallback.hidden = true;
  } else {
    dashboardAvatar.hidden = true;
    dashboardAvatarFallback.hidden = false;
    profileAvatarPreview.hidden = true;
    profileAvatarFallback.hidden = false;
  }
}

function renderTeamMembers() {
  const members = dashboardState.teamMembers;
  teamSeatCount.textContent = `${members.length} seat${members.length === 1 ? '' : 's'}`;
  const accepted = members.map((member) => `<article class="team-member-row">${avatarMarkup(member.profiles)}<div><strong>${escapeHTML(member.profiles?.display_name || member.profiles?.email || 'Member')}</strong><span>${escapeHTML(member.profiles?.email || '')}</span></div><em>${escapeHTML(member.role)}</em></article>`);
  const pending = dashboardState.teamInvites.filter((invite) => !invite.accepted_at).map((invite) => `<article class="team-member-row pending"><span class="row-avatar-fallback">${escapeHTML(invite.email.charAt(0).toUpperCase())}</span><div><strong>${escapeHTML(invite.email)}</strong><span>Invitation pending</span></div><em>pending</em></article>`);
  teamMemberList.innerHTML = [...accepted, ...pending].join('') || '<p>No Team Members yet.</p>';
}

async function loadTeamMembers() {
  const isHost = ['owner', 'admin'].includes(dashboardState.workspace?.member_role);
  teamSettings.hidden = !isHost;
  if (!isHost) return;
  const [memberResult, inviteResult] = await Promise.all([
    supabase.from('workspace_members').select('user_id,role,created_at,profiles!workspace_members_user_id_fkey(email,display_name,avatar_url)').eq('workspace_id', dashboardState.workspace.workspace_id).order('created_at'),
    supabase.from('workspace_invites').select('id,email,role,accepted_at,created_at').eq('workspace_id', dashboardState.workspace.workspace_id).order('created_at'),
  ]);
  if (memberResult.error || inviteResult.error) throw memberResult.error || inviteResult.error;
  dashboardState.teamMembers = memberResult.data || [];
  dashboardState.teamInvites = inviteResult.data || [];
  renderTeamMembers();
}

function loadVoiceOptions() {
  const selected = dashboardState.profile?.tts_voice || '';
  const voices = [
    { id: 'JBFqnCBsd6RMkjVDRZzb', label: 'George · warm male voice' },
    { id: '21m00Tcm4TlvDq8ikWAM', label: 'Rachel · clear female voice' },
    { id: 'pNInz6obpgDQGcFmaJgB', label: 'Adam · deep male voice' },
  ];
  profileVoiceSelect.disabled = false;
  profileVoiceSelect.innerHTML = '<option value="">George · default</option>' + voices.map((voice) =>
    `<option value="${voice.id}">${escapeHTML(voice.label)}</option>`).join('');
  profileVoiceSelect.value = voices.some((voice) => voice.id === selected) ? selected : '';
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
    ? `${visible.length} Drop${visible.length === 1 ? '' : 's'}`
    : 'No Drops match this filter.';
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
  dashboardStatus.textContent = 'Loading your Drops…';
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
  dashboardStatus.textContent = 'Preparing your workspace…';

  const { data: profile, error: profileError } = await supabase
    .from('profiles').select('id,email,display_name,avatar_url,tts_voice').eq('id', user.id).single();
  if (profileError) throw profileError;
  dashboardState.profile = profile;
  renderAccountProfile();
  loadVoiceOptions();

  const { error: workspaceInviteError } = await supabase.rpc('claim_workspace_invites');
  if (workspaceInviteError) console.warn('Could not claim pending team invitation', workspaceInviteError);
  const { data, error } = await supabase.rpc('ensure_user_workspace');
  if (error) {
    dashboardStatus.textContent = `Dashboard setup is not complete: ${error.message}`;
    workspaceName.textContent = 'Setup required';
    throw error;
  }

  dashboardState.workspace = data?.[0];
  if (!dashboardState.workspace) throw new Error('No workspace was returned for this account.');
  workspaceName.textContent = dashboardState.workspace.workspace_name;
  await loadTeamMembers();
  const { error: claimInviteError } = await supabase.rpc('claim_conversation_invites');
  if (claimInviteError) console.warn('Could not claim pending Drop invitations', claimInviteError);
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
  dashboardState.entries.forEach((entry) => {
    if (entry.kind === 'text' && entry.text_body && !entry.tts_alignment?.length) {
      entry.tts_alignment = estimateWordTiming(entry.text_body, entry.duration_seconds);
    }
  });
  document.querySelector('#agendaCount').textContent = `${dashboardState.agenda.length} item${dashboardState.agenda.length === 1 ? '' : 's'}`;
  document.querySelector('#participantCount').textContent = `${dashboardState.participants.length + dashboardState.invites.filter((invite) => !invite.accepted_at).length} people`;
  document.querySelector('#entryCount').textContent = `${dashboardState.entries.length} response${dashboardState.entries.length === 1 ? '' : 's'}`;
  const newCount = dashboardState.entries.filter((entry) => !dashboardState.watchProgress.get(entry.id)?.completed).length;
  playNewButton.textContent = `▶ Play new${newCount ? ` (${newCount})` : ''}`;

  workspaceAgenda.innerHTML = dashboardState.agenda.length ? dashboardState.agenda.map((item, index) => `
    <article class="workspace-row">
      <div><h4>${index + 1}. ${escapeHTML(item.title)}</h4><p>${escapeHTML(item.description || 'No additional context.')}</p></div>
      <div class="workspace-row-meta"><span class="pill ${item.default_required ? 'required' : ''}">${item.default_required ? 'Response required' : 'Optional'}</span></div>
    </article>`).join('') : '<div class="empty-inline">Add the questions or topics people should address.</div>';

  const participantRows = dashboardState.participants.map((participant) => `
    <article class="workspace-row">
      <div><div class="identity-line">${avatarMarkup(participant.profiles)}<div><h4>${escapeHTML(participant.profiles?.display_name || participant.profiles?.email || 'Participant')}</h4><p>${escapeHTML(participant.profiles?.email || '')}</p></div></div></div>
      <div class="workspace-row-meta"><span class="pill">${escapeHTML(participant.role)}</span><span class="pill ${participant.response_required ? 'required' : ''}">${participant.response_required ? escapeHTML(participant.response_status) : 'No response required'}</span></div>
    </article>`);
  const inviteRows = dashboardState.invites.filter((invite) => !invite.accepted_at).map((invite) => `
    <article class="workspace-row">
      <div><h4>${escapeHTML(invite.email)}</h4><p>Invitation waiting for this person to create or use their account.</p></div>
      <div class="workspace-row-meta"><span class="pill">${escapeHTML(invite.role)}</span><span class="pill">Pending invite</span></div>
    </article>`);
  workspaceParticipants.innerHTML = [...participantRows, ...inviteRows].join('') || '<div class="empty-inline">Invite the people who need this update.</div>';

  workspaceEntries.innerHTML = dashboardState.entries.length ? dashboardState.entries.map((entry, index) => `
    <article class="workspace-row ${dashboardState.watchProgress.get(entry.id)?.completed ? 'watched' : ''}" data-entry-row="${entry.id}" style="--person-hue:${personHue(entry)}">
      <span class="entry-kind">${escapeHTML(entry.kind)}</span>
      <div><div class="identity-line">${avatarMarkup(entry.profiles)}<h4>${escapeHTML(entry.profiles?.display_name || entry.profiles?.email || 'Participant')}</h4></div>${entry.kind === 'text' && entry.text_body ? renderTimedText(entry) : `<p>${entry.status === 'ready' ? 'Clip uploaded and ready.' : escapeHTML(entry.status)}</p>`}${entry.media_url ? `<${['video', 'screen'].includes(entry.kind) ? 'video' : 'audio'} class="entry-media" controls preload="auto" data-entry-media="${entry.id}" src="${escapeHTML(entry.media_url)}"></${['video', 'screen'].includes(entry.kind) ? 'video' : 'audio'}>` : entry.kind === 'text' ? `<div class="voice-missing"><button class="ghost" type="button" data-generate-voice="${entry.id}">Generate voice</button><span data-voice-error="${entry.id}">No saved audio yet.</span></div>` : ''}${entry.kind !== 'text' ? (entry.text_body ? renderTimedText(entry, true) : `<div class="voice-missing"><button class="ghost" type="button" data-transcribe-media="${entry.id}">Generate transcript</button><span data-transcript-error="${entry.id}">No transcript yet.</span></div>`) : ''}${renderEntryAttachments(entry)}${renderSectionBadges(entry)}</div>
      <div class="workspace-row-meta"><span class="watch-state">${dashboardState.watchProgress.get(entry.id)?.completed ? '✓ Played' : 'New'}</span><span>${escapeHTML(formatDate(entry.created_at))}</span><button class="ghost play-from-entry" type="button" data-play-index="${index}">Play from here</button></div>
    </article>`).join('') : '<div class="empty-inline">No responses yet. Upload a clip, record one, or write an update.</div>';

  workspaceEntries.querySelectorAll('[data-entry-media]').forEach((media) => {
    const timedEntry = dashboardState.entries.find((item) => item.id === media.dataset.entryMedia);
    if (timedEntry?.tts_alignment?.length) {
      media.addEventListener('timeupdate', () => updateSpokenWord(timedEntry, media.currentTime));
      media.addEventListener('ended', () => updateSpokenWord(timedEntry, -1));
    }
    media.addEventListener('ended', async () => {
      const participant = dashboardState.participants.find((item) => item.user_id === dashboardState.user.id);
      const entry = dashboardState.entries.find((item) => item.id === media.dataset.entryMedia);
      if (entry && !dashboardState.autoplayActive) await markEntryComplete(entry);
      if (!dashboardState.autoplayActive && participant?.role !== 'host' && entry?.author_id !== dashboardState.user.id) responsePromptDialog.showModal();
    });
  });
}

function renderEntryAttachments(entry) {
  const files = dashboardState.dropFiles.filter((file) => file.entry_id === entry.id);
  if (!files.length) return '';
  return `<div class="entry-attachments">${files.map((file) => `<div class="entry-attachment"><span>📎 ${escapeHTML(file.file_name)} · ${formatFileSize(file.size_bytes)}</span><a class="ghost" href="${escapeHTML(file.signed_url || '#')}" target="_blank" rel="noopener" download="${escapeHTML(file.file_name)}">Download</a></div>`).join('')}</div>`;
}

function renderSectionBadges(entry) {
  const sections = dashboardState.sections.filter((section) => section.entry_id === entry.id);
  if (!sections.length) return '';
  return `<div class="entry-sections"><span>Sections</span>${sections.map((section) => `<button type="button" data-section-start="${section.timestamp_seconds}" data-entry-id="${entry.id}">${escapeHTML(section.label)} · ${formatElapsed(section.timestamp_seconds)}</button>`).join('')}</div>`;
}

function expandPlaybackEntries(entries) {
  const currentParticipant = dashboardState.participants.find((participant) => participant.user_id === dashboardState.user.id);
  return entries.flatMap((entry) => {
    const sections = dashboardState.sections.filter((section) => section.entry_id === entry.id);
    if (!sections.length) return [entry];
    return sections.filter((section) => currentParticipant?.role === 'host' || section.marker_assignments?.some((assignment) => assignment.user_id === dashboardState.user.id)).map((section) => ({
      ...entry,
      playback_start: section.timestamp_seconds,
      playback_end: section.end_seconds,
      section_title: section.label,
      section_summary: section.summary,
      section_requirement: section.marker_assignments?.find((assignment) => assignment.user_id === dashboardState.user.id)?.requirement || 'watch',
    }));
  });
}

function captionLineIndexes(alignment) {
  let line = 0;
  let count = 0;
  return alignment.map((word) => {
    const current = line;
    count += 1;
    if (/[.!?][\"']?$/.test(word.text) || count >= 10) { line += 1; count = 0; }
    return current;
  });
}

function renderTimedText(entry, isTranscript = false) {
  if (!entry.tts_alignment?.length) return `<p class="spoken-text${isTranscript ? ' media-transcript' : ''}" data-spoken-text="${entry.id}">${escapeHTML(entry.text_body)}</p>`;
  const lines = captionLineIndexes(entry.tts_alignment);
  let previousLine = -1;
  const words = entry.tts_alignment.map((word, index) => {
    const line = lines[index];
    const open = line !== previousLine ? `${previousLine >= 0 ? '</span> ' : ''}<span class="caption-line" data-caption-line="${line}">` : ' ';
    previousLine = line;
    return `${open}<span data-spoken-word="${index}">${escapeHTML(word.text)}</span>`;
  }).join('') + (previousLine >= 0 ? '</span>' : '');
  return `<p class="spoken-text${isTranscript ? ' media-transcript' : ''}" data-spoken-text="${entry.id}">${words}</p>`;
}

function estimateWordTiming(text, durationSeconds) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const characterTotal = words.reduce((total, word) => total + word.length, 0) || 1;
  const availableDuration = Math.max(1.2, Number(durationSeconds) || characterTotal / 14);
  let cursor = .25;
  return words.map((word) => {
    const duration = Math.max(.12, availableDuration * (word.length / characterTotal));
    const timing = { text: word, start: cursor, end: cursor + duration };
    cursor += duration;
    return timing;
  });
}

function updateSpokenWord(entry, currentTime) {
  const activeIndex = currentTime < 0 ? -1 : entry.tts_alignment.findIndex((word, index) => {
    const nextStart = entry.tts_alignment[index + 1]?.start ?? word.end + .2;
    return currentTime >= word.start && currentTime < nextStart;
  });
  document.querySelectorAll(`[data-spoken-text="${entry.id}"]`).forEach((text) => {
    text.querySelectorAll('[data-spoken-word]').forEach((word, index) => word.classList.toggle('speaking', index === activeIndex));
    if (['video', 'screen'].includes(entry.kind) || text.classList.contains('focus-transcript')) {
      const activeLine = activeIndex < 0 ? null : captionLineIndexes(entry.tts_alignment)[activeIndex];
      text.classList.toggle('caption-active', activeLine !== null);
      text.querySelectorAll('[data-caption-line]').forEach((line) => line.classList.toggle('active', Number(line.dataset.captionLine) === activeLine));
    }
  });
}

async function transitionFocusEntry(entry, index, total) {
  if (focusContent.childElementCount) {
    focusCard.classList.add('leaving');
    await new Promise((resolve) => setTimeout(resolve, 230));
  }
  const profile = entry.profiles || {};
  focusStage.style.setProperty('--person-hue', personHue(entry));
  focusSpeaker.innerHTML = `${avatarMarkup(profile)}<div><strong>${escapeHTML(profile.display_name || profile.email || 'Participant')}</strong>${entry.section_title ? `<small>${escapeHTML(entry.section_title)}</small>` : ''}</div>`;
  focusProgress.textContent = `${index + 1} of ${total}`;
  const transcript = entry.text_body
    ? renderTimedText(entry, true).replace('media-transcript', 'media-transcript focus-transcript')
    : '<p class="focus-waiting">Transcript unavailable</p>';
  if (['video', 'screen'].includes(entry.kind)) {
    focusContent.innerHTML = `<video class="focus-media" data-focus-media="${entry.id}" preload="auto" src="${escapeHTML(entry.media_url || '')}"></video>${transcript}`;
  } else {
    focusContent.innerHTML = `<div class="focus-audio-visual">${avatarMarkup(profile)}<span>${entry.kind === 'text' ? 'Written response' : 'Audio response'}</span></div>${transcript}<audio data-focus-media="${entry.id}" preload="auto" src="${escapeHTML(entry.media_url || '')}"></audio>`;
  }
  focusPauseButton.textContent = 'Pause';
  focusCard.classList.remove('leaving');
  focusCard.classList.add('entering');
  requestAnimationFrame(() => requestAnimationFrame(() => focusCard.classList.remove('entering')));
}

async function transcribeMediaEntry(entry, shouldRender = true) {
  const { data, error } = await supabase.functions.invoke('transcribe-media', { body: { entry_id: entry.id } });
  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  entry.text_body = data.text;
  entry.tts_alignment = data.alignment || [];
  if (shouldRender) renderConversationWorkspace();
}

async function markEntryComplete(entry) {
  const progress = {
    user_id: dashboardState.user.id,
    entry_id: entry.id,
    last_watched_seconds: entry.duration_seconds || 0,
    completed: true,
    skipped: false,
    updated_at: new Date().toISOString(),
  };
  const { error } = await supabase.from('watch_progress').upsert(progress, { onConflict: 'user_id,entry_id' });
  if (error) console.warn('Could not save playback progress', error);
  dashboardState.watchProgress.set(entry.id, progress);
  const row = workspaceEntries.querySelector(`[data-entry-row="${entry.id}"]`);
  row?.classList.add('watched');
  const state = row?.querySelector('.watch-state');
  if (state) state.textContent = '✓ Played';
}

function stopContinuousPlayback(message = 'Playback stopped.') {
  dashboardState.playbackCancelled = true;
  dashboardState.currentMedia?.pause();
  dashboardState.currentMedia = null;
  if ('speechSynthesis' in window) speechSynthesis.cancel();
  dashboardState.playbackResolve?.();
  dashboardState.playbackResolve = null;
  dashboardState.autoplayActive = false;
  playNewButton.disabled = false;
  playAllButton.disabled = false;
  stopPlaybackButton.disabled = true;
  playbackStatus.textContent = message;
  if (focusPlayerDialog.open) focusPlayerDialog.close();
}

async function generateTextAudio(entry, shouldRender = true) {
  playbackStatus.textContent = `Preparing ${entry.profiles?.display_name || 'this participant'}'s voice…`;
  const invocation = supabase.functions.invoke('generate-text-audio', { body: { entry_id: entry.id } });
  const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('Voice generation did not finish within one minute.')), 60000));
  const { data, error } = await Promise.race([invocation, timeout]);
  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  entry.storage_bucket = data.storage_bucket;
  entry.storage_path = data.storage_path;
  if (data.tts_alignment?.length) entry.tts_alignment = data.tts_alignment;
  const { data: signed, error: signedError } = await supabase.storage.from(data.storage_bucket).createSignedUrl(data.storage_path, 3600);
  if (signedError || !signed?.signedUrl) throw signedError || new Error('The generated voice could not be opened.');
  entry.media_url = signed.signedUrl;
  if (shouldRender) renderConversationWorkspace();
}

async function playTextEntry(entry) {
  if (!entry.media_url) {
    try { await generateTextAudio(entry, false); }
    catch (error) {
      console.warn('Generated voice is not ready', error);
      throw new Error('This voice is still processing. Try again in a moment.');
    }
    renderConversationWorkspace();
  }
  await playMediaEntry(entry);
}

function playMediaEntry(entry) {
  return new Promise(async (resolve, reject) => {
    const media = dashboardState.autoplayActive
      ? focusContent.querySelector(`[data-focus-media="${entry.id}"]`)
      : workspaceEntries.querySelector(`[data-entry-media="${entry.id}"]`);
    if (!media) {
      reject(new Error('This recording is not available for playback.'));
      return;
    }
    dashboardState.currentMedia = media;
    dashboardState.playbackResolve = resolve;
    let highlightFrame = null;
    const followWords = () => {
      if (entry.tts_alignment?.length) updateSpokenWord(entry, media.currentTime);
      if (!media.paused && !media.ended) highlightFrame = window.requestAnimationFrame(followWords);
    };
    const finish = () => {
      media.removeEventListener('ended', finish);
      media.removeEventListener('error', fail);
      if (highlightFrame) window.cancelAnimationFrame(highlightFrame);
      if (entry.tts_alignment?.length) updateSpokenWord(entry, -1);
      resolve();
    };
    const fail = () => { media.removeEventListener('ended', finish); media.removeEventListener('error', fail); reject(new Error('This recording could not be played.')); };
    media.addEventListener('ended', finish);
    media.addEventListener('error', fail);
    media.currentTime = Number(entry.playback_start) || 0;
    try {
      if (media.readyState < HTMLMediaElement.HAVE_FUTURE_DATA) {
        await new Promise((readyResolve) => media.addEventListener('canplay', readyResolve, { once: true }));
      }
      await media.play();
      if (Number.isFinite(entry.playback_end)) {
        const stopAtSectionEnd = () => {
          if (media.currentTime >= entry.playback_end) {
            media.removeEventListener('timeupdate', stopAtSectionEnd);
            media.pause();
            finish();
          }
        };
        media.addEventListener('timeupdate', stopAtSectionEnd);
      }
      followWords();
    } catch (error) { fail(); }
  });
}

async function playConversationEntries(entries) {
  if (!entries.length) {
    playbackStatus.textContent = 'You are caught up—there is nothing new to play.';
    return;
  }
  if (responsePromptDialog.open) responsePromptDialog.close();
  if (dashboardState.voiceRefreshTimer) {
    window.clearTimeout(dashboardState.voiceRefreshTimer);
    dashboardState.voiceRefreshTimer = null;
  }
  dashboardState.playbackCancelled = false;
  dashboardState.autoplayActive = true;
  playNewButton.disabled = true;
  playAllButton.disabled = true;
  stopPlaybackButton.disabled = false;
  if (!focusPlayerDialog.open) focusPlayerDialog.showModal();

  try {
    for (let entryIndex = 0; entryIndex < entries.length; entryIndex += 1) {
      const entry = entries[entryIndex];
      if (dashboardState.playbackCancelled) break;
      const author = entry.profiles?.display_name || entry.profiles?.email || 'Participant';
      playbackStatus.textContent = entry.kind === 'text' ? `Reading ${author}'s response…` : `Playing ${author}'s ${entry.kind}…`;
      if (entry.kind === 'text' && !entry.media_url) await generateTextAudio(entry);
      await transitionFocusEntry(entry, entryIndex, entries.length);
      await playMediaEntry(entry);
      dashboardState.playbackResolve = null;
      dashboardState.currentMedia = null;
      if (!dashboardState.playbackCancelled) await markEntryComplete(entry);
    }
    if (!dashboardState.playbackCancelled) {
      stopContinuousPlayback('Drop complete. You are all caught up.');
      const participant = dashboardState.participants.find((item) => item.user_id === dashboardState.user.id);
      const responseRequested = entries.some((entry) => !entry.section_title || ['comment', 'respond'].includes(entry.section_requirement));
      if (participant?.role !== 'host' && responseRequested) responsePromptDialog.showModal();
    }
  } catch (error) {
    stopContinuousPlayback(`Playback stopped: ${error.message}`);
  }
}

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function renderDropFiles() {
  dropFileCount.textContent = `${dashboardState.dropFiles.length} file${dashboardState.dropFiles.length === 1 ? '' : 's'}`;
  downloadAllFilesButton.disabled = false;
  dropFileList.innerHTML = dashboardState.dropFiles.length ? dashboardState.dropFiles.map((file) => `
    <article class="drop-file-row">
      <span class="drop-file-icon">${escapeHTML((file.file_name.split('.').pop() || 'file').slice(0, 4).toUpperCase())}</span>
      <div><strong>${escapeHTML(file.file_name)}</strong><span>${formatFileSize(file.size_bytes)} · ${escapeHTML(file.profiles?.display_name || file.profiles?.email || 'Team Member')}</span></div>
      <a class="ghost" href="${escapeHTML(file.signed_url || '#')}" target="_blank" rel="noopener" download="${escapeHTML(file.file_name)}">Download</a>
    </article>`).join('') : '<div class="empty-inline">Add documents, spreadsheets, images, or other reference files for this Drop.</div>';
}

function renderPendingFiles() {
  pendingFileList.innerHTML = dashboardState.pendingFiles.map((file, index) => `<span class="pending-file-chip">📎 ${escapeHTML(file.name)} <button type="button" data-remove-pending-file="${index}" aria-label="Remove ${escapeHTML(file.name)}">×</button></span>`).join('');
}

async function loadDropFiles() {
  const conversationId = dashboardState.currentConversation.id;
  const { data, error } = await supabase.from('drop_files')
    .select('id,entry_id,uploaded_by,storage_bucket,storage_path,file_name,content_type,size_bytes,created_at,profiles!drop_files_uploaded_by_fkey(email,display_name)')
    .eq('conversation_id', conversationId).order('created_at');
  if (error) throw error;
  dashboardState.dropFiles = data || [];
  await Promise.all(dashboardState.dropFiles.map(async (file) => {
    const { data: signed } = await supabase.storage.from(file.storage_bucket).createSignedUrl(file.storage_path, 3600);
    file.signed_url = signed?.signedUrl || null;
  }));
  renderDropFiles();
}

async function uploadDropFile(file, index, total, entryId = null) {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]+/g, '_');
  const path = `${dashboardState.currentConversation.id}/${dashboardState.user.id}/${crypto.randomUUID()}-${safeName}`;
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) throw new Error('Your sign-in session expired.');
  await new Promise((resolve, reject) => {
    const upload = new tus.Upload(file, {
      endpoint: 'https://kepkisctnlomykhyqywh.storage.supabase.co/storage/v1/upload/resumable',
      retryDelays: [0, 3000, 5000, 10000], headers: { authorization: `Bearer ${session.access_token}`, 'x-upsert': 'false' },
      uploadDataDuringCreation: true, removeFingerprintOnSuccess: true, chunkSize: 6 * 1024 * 1024,
      metadata: { bucketName: 'drop-files', objectName: path, contentType: file.type || 'application/octet-stream', cacheControl: '3600' },
      onError: reject,
      onProgress: (uploaded, bytes) => { dropFileMessage.textContent = `Uploading ${index + 1} of ${total}: ${file.name} · ${Math.round((uploaded / bytes) * 100)}%`; },
      onSuccess: resolve,
    });
    upload.start();
  });
  const { error } = await supabase.from('drop_files').insert({
    conversation_id: dashboardState.currentConversation.id, uploaded_by: dashboardState.user.id,
    storage_bucket: 'drop-files', storage_path: path, file_name: file.name,
    entry_id: entryId, content_type: file.type || null, size_bytes: file.size,
  });
  if (error) { await supabase.storage.from('drop-files').remove([path]); throw error; }
}

async function uploadPendingFiles(entryId) {
  const files = [...dashboardState.pendingFiles];
  for (let index = 0; index < files.length; index += 1) await uploadDropFile(files[index], index, files.length, entryId);
  dashboardState.pendingFiles = [];
  dropFileInput.value = '';
  renderPendingFiles();
}

function buildDropSummary() {
  const drop = dashboardState.currentConversation;
  const agenda = dashboardState.agenda.map((item, index) => `${index + 1}. ${item.title}${item.description ? ` — ${item.description}` : ''}`).join('\n');
  const sections = dashboardState.sections.map((section, index) => `${index + 1}. ${section.label} (${formatElapsed(section.timestamp_seconds)}–${formatElapsed(section.end_seconds)})\n${section.summary || 'No summary available.'}`).join('\n\n');
  return `# ${drop.title}\n\n${drop.description || 'No description.'}\n\nDue: ${formatDate(drop.due_at)}\nCreated: ${formatDate(drop.created_at)}\n\n## Agenda\n\n${agenda || 'No agenda items.'}\n\n## Drop Sections and Summary\n\n${sections || 'No recording sections have been published.'}\n`;
}

function buildDropTranscript() {
  return dashboardState.entries.filter((entry) => entry.text_body).map((entry) => {
    const author = entry.profiles?.display_name || entry.profiles?.email || 'Team Member';
    return `${author} · ${entry.kind.toUpperCase()} · ${formatDate(entry.created_at)}\n${entry.text_body}`;
  }).join('\n\n---\n\n') || 'No transcript is available yet.';
}

async function downloadAllDropFiles() {
  downloadAllFilesButton.disabled = true;
  dropFileMessage.textContent = 'Preparing Drop download…';
  try {
    const zip = new JSZip();
    zip.file('Drop Summary.md', buildDropSummary());
    zip.file('Drop Transcript.txt', buildDropTranscript());
    for (let index = 0; index < dashboardState.dropFiles.length; index += 1) {
      const file = dashboardState.dropFiles[index];
      dropFileMessage.textContent = `Adding ${index + 1} of ${dashboardState.dropFiles.length}: ${file.file_name}`;
      const response = await fetch(file.signed_url);
      if (!response.ok) throw new Error(`Could not download ${file.file_name}.`);
      zip.file(`Files/${index + 1}-${file.file_name}`, await response.blob());
    }
    const blob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url; link.download = `${dashboardState.currentConversation.title.replace(/[^a-zA-Z0-9_-]+/g, '_')}-Drop.zip`; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    dropFileMessage.textContent = 'Download ready.';
  } catch (error) {
    dropFileMessage.textContent = `Could not prepare download: ${error.message}`;
  } finally {
    downloadAllFilesButton.disabled = false;
  }
}

async function loadConversationWorkspace() {
  const conversationId = dashboardState.currentConversation.id;
  workspaceMessage.textContent = 'Loading agenda, participants, and responses…';
  const [agendaResult, participantResult, inviteResult, entryResult, progressResult] = await Promise.all([
    supabase.from('agenda_items').select('*').eq('conversation_id', conversationId).order('position'),
    supabase.from('conversation_participants').select('user_id,role,response_required,response_status,created_at,profiles!conversation_participants_user_id_fkey(email,display_name,avatar_url,tts_voice)').eq('conversation_id', conversationId).order('created_at'),
    supabase.from('conversation_invites').select('id,email,role,response_required,accepted_at,created_at').eq('conversation_id', conversationId).order('created_at'),
    supabase.from('conversation_entries').select('id,author_id,kind,status,storage_bucket,storage_path,text_body,tts_alignment,duration_seconds,size_bytes,created_at,profiles!conversation_entries_author_id_fkey(email,display_name,avatar_url,tts_voice)').eq('conversation_id', conversationId).order('created_at', { ascending: true }),
    supabase.from('watch_progress').select('entry_id,last_watched_seconds,completed,skipped,updated_at').eq('user_id', dashboardState.user.id),
  ]);
  const error = agendaResult.error || participantResult.error || inviteResult.error || entryResult.error || progressResult.error;
  if (error) throw error;
  dashboardState.agenda = agendaResult.data || [];
  dashboardState.participants = participantResult.data || [];
  dashboardState.invites = inviteResult.data || [];
  dashboardState.entries = entryResult.data || [];
  dashboardState.watchProgress = new Map((progressResult.data || []).map((progress) => [progress.entry_id, progress]));

  await Promise.all(dashboardState.entries.map(async (entry) => {
    if (!entry.storage_path || !entry.storage_bucket) return;
    const { data } = await supabase.storage.from(entry.storage_bucket).createSignedUrl(entry.storage_path, 3600);
    entry.media_url = data?.signedUrl || null;
  }));
  if (dashboardState.entries.length) {
    const { data: sections, error: sectionError } = await supabase.from('conversation_markers')
      .select('id,entry_id,agenda_item_id,marker_kind,label,timestamp_seconds,end_seconds,summary,position,marker_assignments(user_id,requirement)')
      .in('entry_id', dashboardState.entries.map((entry) => entry.id)).not('end_seconds', 'is', null).order('position');
    if (sectionError) console.warn('Could not load recording sections', sectionError);
    dashboardState.sections = sections || [];
  } else dashboardState.sections = [];
  await loadDropFiles();
  workspaceMessage.textContent = '';
  renderConversationWorkspace();
}

async function showConversationDetail(conversationId) {
  const conversation = dashboardState.conversations.find((item) => item.id === conversationId);
  if (!conversation) return;
  dashboardState.currentConversation = conversation;
  const conversationUrl = new URL(window.location.href);
  conversationUrl.searchParams.set('conversation', conversationId);
  window.history.replaceState({ conversationId }, '', conversationUrl);
  document.querySelector('#detailStatus').textContent = conversation.status;
  document.querySelector('#detailTitle').textContent = conversation.title;
  document.querySelector('#detailDescription').textContent = conversation.description || 'No description yet.';
  document.querySelector('#detailDue').textContent = `Due ${formatDate(conversation.due_at)}`;
  document.querySelector('#detailCreated').textContent = `Created ${formatDate(conversation.created_at, 'today')}`;
  if (!conversationDetailDialog.open) conversationDetailDialog.showModal();
  try {
    await loadConversationWorkspace();
  } catch (error) {
    workspaceMessage.textContent = `Could not load this Drop: ${error.message}`;
  }
}

function recordingElapsedSeconds() {
  return Math.max(0, (performance.now() - dashboardState.recordingStartedAt) / 1000);
}

function formatElapsed(seconds) {
  const total = Math.max(0, Math.floor(seconds));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
}

function beginRecordingSection({ agendaItemId = null, label = 'Bookmark', markerKind = 'manual' }) {
  const now = recordingElapsedSeconds();
  const previous = dashboardState.recordingSections.at(-1);
  if (previous) previous.end_seconds = now;
  dashboardState.recordingSections.push({ agenda_item_id: agendaItemId, marker_kind: markerKind, label, start_seconds: now, end_seconds: null });
  recordingSectionLabel.textContent = label;
  recordingAgendaButtons.querySelectorAll('button').forEach((button) => button.classList.toggle('active', button.dataset.agendaId === agendaItemId));
}

function openRecordingSectionDock() {
  dashboardState.recordingStartedAt = performance.now();
  dashboardState.recordingSections = [{ agenda_item_id: null, marker_kind: 'manual', label: 'Opening', start_seconds: 0, end_seconds: null }];
  recordingSectionLabel.textContent = 'Opening';
  recordingAgendaButtons.innerHTML = dashboardState.agenda.map((item) => `<button type="button" data-agenda-id="${item.id}">${escapeHTML(item.title)}</button>`).join('');
  recordingSectionDock.hidden = false;
  dashboardState.recordingSectionTimer = window.setInterval(() => { recordingSectionTime.textContent = formatElapsed(recordingElapsedSeconds()); }, 500);
}

function closeRecordingSectionDock() {
  const final = dashboardState.recordingSections.at(-1);
  if (final && final.end_seconds === null) final.end_seconds = recordingElapsedSeconds();
  window.clearInterval(dashboardState.recordingSectionTimer);
  dashboardState.recordingSectionTimer = null;
  recordingSectionDock.hidden = true;
}

function sectionTranscript(entry, section) {
  const words = (entry.tts_alignment || []).filter((word) => word.start >= section.start_seconds && word.start < section.end_seconds);
  return words.map((word) => word.text).join(' ').trim();
}

function suggestedSectionDetails(entry, section) {
  const transcript = sectionTranscript(entry, section);
  const cleanWords = transcript.split(/\s+/).filter(Boolean);
  const suggestedTitle = cleanWords.slice(0, 7).join(' ').replace(/[.,!?;:]$/, '');
  return {
    ...section,
    label: section.agenda_item_id ? section.label : (suggestedTitle || section.label),
    summary: cleanWords.slice(0, 30).join(' ') + (cleanWords.length > 30 ? '…' : ''),
  };
}

function assignmentLabel(mode) {
  return ({ watch: 'Watch', comment: 'Can respond', respond: 'Must respond', none: 'Not assigned' })[mode];
}

function renderSectionReview() {
  const review = dashboardState.pendingSectionReview;
  if (!review) return;
  const people = dashboardState.teamMembers.filter((participant) => participant.user_id !== dashboardState.user.id);
  sectionReviewList.innerHTML = review.sections.map((section, sectionIndex) => `
    <article class="section-review-card" data-review-section="${sectionIndex}">
      <div class="section-review-heading"><div><span>${formatElapsed(section.start_seconds)}–${formatElapsed(section.end_seconds)}</span><input data-section-title value="${escapeHTML(section.label)}" /></div><div><button class="ghost" data-assign-all type="button">Select all</button><button class="ghost" data-assign-none type="button">Clear all</button></div></div>
      <textarea data-section-summary rows="2">${escapeHTML(section.summary || '')}</textarea>
      <h4>Who needs this section?</h4>
      <div class="section-people">${people.map((participant) => {
        const mode = section.assignments[participant.user_id] || 'watch';
        return `<button class="section-person mode-${mode}" type="button" data-section-person="${participant.user_id}" data-mode="${mode}">${avatarMarkup(participant.profiles)}<strong>${escapeHTML(participant.profiles?.display_name || participant.profiles?.email || 'Participant')}</strong><span>${assignmentLabel(mode)}</span></button>`;
      }).join('')}</div>
    </article>`).join('');
}

function openSectionReview(entry, recordedSections) {
  const people = dashboardState.teamMembers.filter((participant) => participant.user_id !== dashboardState.user.id);
  dashboardState.pendingSectionReview = {
    entry,
    sections: recordedSections.filter((section) => section.end_seconds - section.start_seconds >= .5).map((section) => ({
      ...suggestedSectionDetails(entry, section),
      assignments: Object.fromEntries(people.map((person) => [person.user_id, 'watch'])),
    })),
  };
  sectionReviewMessage.textContent = '';
  renderSectionReview();
  sectionReviewDialog.showModal();
}

async function publishReviewedSections() {
  const review = dashboardState.pendingSectionReview;
  if (!review) return;
  publishSectionsButton.disabled = true;
  sectionReviewMessage.textContent = 'Publishing sections and assignments…';
  try {
    const assignedUserIds = [...new Set(review.sections.flatMap((section) => Object.entries(section.assignments).filter(([, mode]) => mode !== 'none').map(([userId]) => userId)))];
    if (assignedUserIds.length) {
      const participantRows = assignedUserIds.map((userId) => ({
        conversation_id: dashboardState.currentConversation.id, user_id: userId, role: 'optional',
        response_required: review.sections.some((section) => section.assignments[userId] === 'respond'), response_status: 'pending',
      }));
      const { error: participantError } = await supabase.from('conversation_participants').upsert(participantRows, { onConflict: 'conversation_id,user_id' });
      if (participantError) throw participantError;
    }
    for (let position = 0; position < review.sections.length; position += 1) {
      const section = review.sections[position];
      const card = sectionReviewList.querySelector(`[data-review-section="${position}"]`);
      section.label = card.querySelector('[data-section-title]').value.trim() || section.label;
      section.summary = card.querySelector('[data-section-summary]').value.trim();
      const { data: marker, error } = await supabase.from('conversation_markers').insert({
        entry_id: review.entry.id, agenda_item_id: section.agenda_item_id, marker_kind: section.marker_kind,
        label: section.label, timestamp_seconds: Math.floor(section.start_seconds), end_seconds: Math.ceil(section.end_seconds),
        summary: section.summary || null, position, created_by: dashboardState.user.id,
      }).select('id').single();
      if (error) throw error;
      const assignments = Object.entries(section.assignments).filter(([, mode]) => mode !== 'none').map(([userId, requirement]) => ({ marker_id: marker.id, user_id: userId, requirement }));
      if (assignments.length) {
        const { error: assignmentError } = await supabase.from('marker_assignments').insert(assignments);
        if (assignmentError) throw assignmentError;
      }
    }
    sectionReviewDialog.close();
    dashboardState.pendingSectionReview = null;
    await loadConversationWorkspace();
    workspaceMessage.textContent = 'Recording sections published and assigned.';
  } catch (error) {
    sectionReviewMessage.textContent = `Could not publish sections: ${error.message}`;
  } finally {
    publishSectionsButton.disabled = false;
  }
}

async function uploadConversationClip(file, forcedKind) {
  if (!file || !dashboardState.currentConversation) return;
  const conversation = dashboardState.currentConversation;
  const kind = forcedKind || (file.type.startsWith('audio/') ? 'audio' : 'video');
  const contentType = (file.type || `${kind}/webm`).split(';')[0].trim();
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
        contentType,
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
  const { data: savedEntry, error: entryError } = await supabase.from('conversation_entries').insert({
    conversation_id: conversation.id,
    author_id: dashboardState.user.id,
    kind,
    status: 'ready',
    storage_bucket: 'conversation-clips',
    storage_path: path,
    size_bytes: file.size,
  }).select('id,duration_seconds').single();
  if (entryError) {
    await supabase.storage.from('conversation-clips').remove([path]);
    throw entryError;
  }
  await markEntryComplete(savedEntry);
  if (dashboardState.pendingFiles.length) await uploadPendingFiles(savedEntry.id);
  await loadConversationWorkspace();
  setUploadProgress('Clip uploaded. Generating transcript…', 100);
  const entry = dashboardState.entries.find((item) => item.id === savedEntry.id);
  try {
    await transcribeMediaEntry(entry);
    setUploadProgress('Clip and transcript are ready.', 100);
  } catch (error) {
    setUploadProgress(`Clip is ready. Transcript failed: ${error.message}`, 100);
  }
  return entry;
}

async function createRecordingStream(kind) {
  if (kind !== 'screen') {
    const stream = await navigator.mediaDevices.getUserMedia(kind === 'video' ? { video: true, audio: true } : { audio: true });
    dashboardState.recordingSourceStreams = [stream];
    return stream;
  }
  if (!navigator.mediaDevices.getDisplayMedia) throw new Error('Screen recording is not supported in this browser.');
  const displayStream = await navigator.mediaDevices.getDisplayMedia({ video: { frameRate: { ideal: 30, max: 30 } }, audio: true });
  let microphoneStream = null;
  try { microphoneStream = await navigator.mediaDevices.getUserMedia({ audio: true }); }
  catch (error) { console.warn('Microphone was not included in screen recording', error); }
  dashboardState.recordingSourceStreams = [displayStream, microphoneStream].filter(Boolean);
  const finalStream = new MediaStream(displayStream.getVideoTracks());
  const audioStreams = [displayStream, microphoneStream].filter((stream) => stream?.getAudioTracks().length);
  if (audioStreams.length) {
    const audioContext = new AudioContext();
    const destination = audioContext.createMediaStreamDestination();
    audioStreams.forEach((stream) => audioContext.createMediaStreamSource(stream).connect(destination));
    destination.stream.getAudioTracks().forEach((track) => finalStream.addTrack(track));
    dashboardState.recordingAudioContext = audioContext;
  }
  return finalStream;
}

async function startRecording(kind) {
  try {
    const stream = await createRecordingStream(kind);
    dashboardState.recordingStream = stream;
    dashboardState.recordingChunks = [];
    const preferredType = kind === 'audio' ? 'audio/webm;codecs=opus' : 'video/webm;codecs=vp9,opus';
    const recorder = new MediaRecorder(stream, MediaRecorder.isTypeSupported(preferredType) ? { mimeType: preferredType } : undefined);
    dashboardState.recorder = recorder;
    if (kind === 'screen') stream.getVideoTracks()[0]?.addEventListener('ended', () => { if (recorder.state !== 'inactive') recorder.stop(); });
    recorder.addEventListener('dataavailable', (event) => { if (event.data.size) dashboardState.recordingChunks.push(event.data); });
    recorder.addEventListener('stop', async () => {
      closeRecordingSectionDock();
      const recordedSections = dashboardState.recordingSections.map((section) => ({ ...section }));
      const blob = new Blob(dashboardState.recordingChunks, { type: recorder.mimeType || `${kind}/webm` });
      dashboardState.recordingSourceStreams.forEach((source) => source.getTracks().forEach((track) => track.stop()));
      dashboardState.recordingStream?.getTracks().forEach((track) => track.stop());
      await dashboardState.recordingAudioContext?.close().catch(() => {});
      dashboardState.recordingAudioContext = null;
      dashboardState.recordingSourceStreams = [];
      recordAudioButton.disabled = false;
      recordVideoButton.disabled = false;
      recordScreenButton.disabled = false;
      stopRecordingButton.disabled = true;
      try {
        const entry = await uploadConversationClip(new File([blob], `${kind}-${Date.now()}.webm`, { type: blob.type }), kind);
        const currentParticipant = dashboardState.participants.find((participant) => participant.user_id === dashboardState.user.id);
        if (currentParticipant?.role === 'host' && entry) openSectionReview(entry, recordedSections);
      }
      catch (error) { workspaceMessage.textContent = `Could not save recording: ${error.message}`; }
    });
    recorder.start();
    const currentParticipant = dashboardState.participants.find((participant) => participant.user_id === dashboardState.user.id);
    if (currentParticipant?.role === 'host') openRecordingSectionDock();
    recordAudioButton.disabled = true;
    recordVideoButton.disabled = true;
    recordScreenButton.disabled = true;
    stopRecordingButton.disabled = false;
    workspaceMessage.textContent = kind === 'screen'
      ? 'Recording screen and microphone… Use the browser Share audio option to include tab or system sound.'
      : `Recording ${kind}…`;
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
      const requestedConversation = new URL(window.location.href).searchParams.get('conversation');
      if (requestedConversation) await showConversationDetail(requestedConversation);
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
document.querySelector('#openProfileDialog').addEventListener('click', () => {
  document.querySelector('#profileDisplayName').value = dashboardState.profile?.display_name || '';
  profileAvatarInput.value = '';
  profileMessage.textContent = '';
  renderAccountProfile();
  loadVoiceOptions();
  loadTeamMembers().catch((error) => { teamMessage.textContent = `Could not load Team Members: ${error.message}`; });
  profileDialog.showModal();
});
document.querySelector('#closeProfileDialog').addEventListener('click', () => profileDialog.close());
document.querySelector('#cancelProfileDialog').addEventListener('click', () => profileDialog.close());
profileAvatarInput.addEventListener('change', () => {
  const file = profileAvatarInput.files?.[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) {
    profileMessage.textContent = 'Choose an image smaller than 5 MB.';
    profileAvatarInput.value = '';
    return;
  }
  profileAvatarPreview.src = URL.createObjectURL(file);
  profileAvatarPreview.hidden = false;
  profileAvatarFallback.hidden = true;
});
profileForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!profileForm.reportValidity() || !dashboardState.user) return;
  saveProfileButton.disabled = true;
  saveProfileButton.textContent = 'Saving…';
  profileMessage.textContent = 'Saving your profile…';
  try {
    const displayName = document.querySelector('#profileDisplayName').value.trim();
    const ttsVoice = profileVoiceSelect.value || null;
    const file = profileAvatarInput.files?.[0];
    let avatarUrl = dashboardState.profile?.avatar_url || null;
    if (file) {
      const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const path = `${dashboardState.user.id}/${crypto.randomUUID()}.${extension}`;
      const { error: uploadError } = await supabase.storage.from('avatars').upload(path, file, {
        contentType: file.type,
        cacheControl: '3600',
      });
      if (uploadError) throw uploadError;
      avatarUrl = supabase.storage.from('avatars').getPublicUrl(path).data.publicUrl;
    }

    const { data: profile, error: updateError } = await supabase.from('profiles')
      .update({ display_name: displayName, avatar_url: avatarUrl, tts_voice: ttsVoice, updated_at: new Date().toISOString() })
      .eq('id', dashboardState.user.id)
      .select('id,email,display_name,avatar_url,tts_voice').single();
    if (updateError) throw updateError;
    await supabase.auth.updateUser({ data: { display_name: displayName, avatar_url: avatarUrl } });
    dashboardState.profile = profile;
    renderAccountProfile();
    if (dashboardState.currentConversation) await loadConversationWorkspace();
    profileDialog.close();
  } catch (error) {
    profileMessage.textContent = `Could not save profile: ${error.message}`;
  } finally {
    saveProfileButton.disabled = false;
    saveProfileButton.textContent = 'Save profile';
  }
});
teamInviteButton.addEventListener('click', async () => {
  const email = teamInviteEmail.value.trim();
  if (!email || !teamInviteEmail.checkValidity()) { teamInviteEmail.reportValidity(); return; }
  teamInviteButton.disabled = true;
  teamMessage.textContent = `Inviting ${email}…`;
  try {
    const { error: emailError } = await supabase.auth.signInWithOtp({
      email, options: { shouldCreateUser: true, emailRedirectTo: `${window.location.origin}/` },
    });
    const { error } = await supabase.rpc('invite_team_member', { target_workspace_id: dashboardState.workspace.workspace_id, target_email: email });
    if (error) throw error;
    teamInviteEmail.value = '';
    await loadTeamMembers();
    teamMessage.textContent = emailError ? `Seat added, but the invitation email failed: ${emailError.message}` : `Team invitation sent to ${email}.`;
  } catch (error) {
    teamMessage.textContent = `Could not invite Team Member: ${error.message}`;
  } finally {
    teamInviteButton.disabled = false;
  }
});
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
document.querySelector('#closeDetail').addEventListener('click', () => {
  if (dashboardState.autoplayActive) stopContinuousPlayback();
  conversationDetailDialog.close();
  dashboardState.currentConversation = null;
  const dashboardUrl = new URL(window.location.href);
  dashboardUrl.searchParams.delete('conversation');
  window.history.replaceState({}, '', dashboardUrl);
});

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
  const { data: savedEntry, error } = await supabase.from('conversation_entries').insert({
    conversation_id: dashboardState.currentConversation.id,
    author_id: dashboardState.user.id,
    kind: 'text',
    status: 'ready',
    text_body: document.querySelector('#textResponseBody').value.trim(),
  }).select('id,duration_seconds').single();
  if (error) workspaceMessage.textContent = `Could not post response: ${error.message}`;
  else {
    await markEntryComplete(savedEntry);
    if (dashboardState.pendingFiles.length) await uploadPendingFiles(savedEntry.id);
    textResponseForm.reset();
    workspaceMessage.textContent = 'Response posted. Generating voice…';
    const { data: voiceData, error: voiceError } = await supabase.functions.invoke('generate-text-audio', { body: { entry_id: savedEntry.id } });
    await loadConversationWorkspace();
    workspaceMessage.textContent = voiceError || voiceData?.error
      ? `Response posted, but voice generation failed: ${voiceError?.message || voiceData?.error}`
      : 'Response posted and voice audio is ready.';
  }
});

workspaceUpload.addEventListener('change', async () => {
  const file = workspaceUpload.files?.[0];
  if (!file) return;
  try { await uploadConversationClip(file); }
  catch (error) { setUploadProgress(`Could not upload clip: ${error.message}`, 0); }
  finally { workspaceUpload.value = ''; }
});
dropFileInput.addEventListener('change', async () => {
  const files = [...(dropFileInput.files || [])];
  if (!files.length) return;
  dashboardState.pendingFiles.push(...files);
  renderPendingFiles();
  workspaceMessage.textContent = `${files.length} file${files.length === 1 ? '' : 's'} ready to attach to your next response.`;
});
pendingFileList.addEventListener('click', (event) => {
  const button = event.target.closest('[data-remove-pending-file]');
  if (!button) return;
  dashboardState.pendingFiles.splice(Number(button.dataset.removePendingFile), 1);
  renderPendingFiles();
});
downloadAllFilesButton.addEventListener('click', downloadAllDropFiles);

recordAudioButton.addEventListener('click', () => startRecording('audio'));
recordVideoButton.addEventListener('click', () => startRecording('video'));
recordScreenButton.addEventListener('click', () => startRecording('screen'));
stopRecordingButton.addEventListener('click', () => dashboardState.recorder?.stop());
recordingAgendaButtons.addEventListener('click', (event) => {
  const button = event.target.closest('[data-agenda-id]');
  if (!button) return;
  const item = dashboardState.agenda.find((agendaItem) => agendaItem.id === button.dataset.agendaId);
  if (item) beginRecordingSection({ agendaItemId: item.id, label: item.title, markerKind: 'agenda' });
});
recordingBookmarkButton.addEventListener('click', () => beginRecordingSection({ label: `Bookmark ${dashboardState.recordingSections.length}`, markerKind: 'manual' }));
sectionReviewList.addEventListener('click', (event) => {
  const card = event.target.closest('[data-review-section]');
  if (!card || !dashboardState.pendingSectionReview) return;
  const section = dashboardState.pendingSectionReview.sections[Number(card.dataset.reviewSection)];
  const person = event.target.closest('[data-section-person]');
  if (person) {
    const modes = ['watch', 'comment', 'respond', 'none'];
    const next = modes[(modes.indexOf(person.dataset.mode) + 1) % modes.length];
    section.assignments[person.dataset.sectionPerson] = next;
    person.className = `section-person mode-${next}`;
    person.dataset.mode = next;
    person.querySelector('span').textContent = assignmentLabel(next);
    return;
  }
  const mode = event.target.closest('[data-assign-all]') ? 'watch' : event.target.closest('[data-assign-none]') ? 'none' : null;
  if (mode) {
    Object.keys(section.assignments).forEach((userId) => { section.assignments[userId] = mode; });
    renderSectionReview();
  }
});
publishSectionsButton.addEventListener('click', publishReviewedSections);
document.querySelector('#cancelSectionReview').addEventListener('click', () => sectionReviewDialog.close());
playNewButton.addEventListener('click', () => {
  const newEntries = dashboardState.entries.filter((entry) => !dashboardState.watchProgress.get(entry.id)?.completed);
  playConversationEntries(expandPlaybackEntries(newEntries));
});
playAllButton.addEventListener('click', () => playConversationEntries(expandPlaybackEntries(dashboardState.entries)));
stopPlaybackButton.addEventListener('click', () => stopContinuousPlayback());
focusPauseButton.addEventListener('click', async () => {
  const media = dashboardState.currentMedia;
  if (!media) return;
  if (media.paused) {
    await media.play();
    focusPauseButton.textContent = 'Pause';
  } else {
    media.pause();
    focusPauseButton.textContent = 'Play';
  }
});
focusCloseButton.addEventListener('click', () => stopContinuousPlayback('Focus playback closed.'));
focusPlayerDialog.addEventListener('cancel', (event) => {
  event.preventDefault();
  stopContinuousPlayback('Focus playback closed.');
});
workspaceEntries.addEventListener('click', (event) => {
  const sectionButton = event.target.closest('[data-section-start]');
  if (sectionButton) {
    const entry = dashboardState.entries.find((item) => item.id === sectionButton.dataset.entryId);
    const section = dashboardState.sections.find((item) => item.entry_id === entry?.id && item.timestamp_seconds === Number(sectionButton.dataset.sectionStart));
    if (entry && section) playConversationEntries([{ ...entry, playback_start: section.timestamp_seconds, playback_end: section.end_seconds, section_title: section.label, section_summary: section.summary }]);
    return;
  }
  const voiceButton = event.target.closest('[data-generate-voice]');
  if (voiceButton) {
    const entry = dashboardState.entries.find((item) => item.id === voiceButton.dataset.generateVoice);
    if (!entry) return;
    const status = workspaceEntries.querySelector(`[data-voice-error="${entry.id}"]`);
    voiceButton.disabled = true;
    voiceButton.textContent = 'Generating…';
    if (status) status.textContent = 'Generating voice and saving it…';
    generateTextAudio(entry).catch((error) => {
      voiceButton.disabled = false;
      voiceButton.textContent = 'Try generating again';
      if (status) status.textContent = error.message;
    });
    return;
  }
  const transcriptButton = event.target.closest('[data-transcribe-media]');
  if (transcriptButton) {
    const entry = dashboardState.entries.find((item) => item.id === transcriptButton.dataset.transcribeMedia);
    if (!entry) return;
    const status = workspaceEntries.querySelector(`[data-transcript-error="${entry.id}"]`);
    transcriptButton.disabled = true;
    transcriptButton.textContent = 'Generating transcript…';
    if (status) status.textContent = 'Listening to the recording…';
    transcribeMediaEntry(entry).catch((error) => {
      transcriptButton.disabled = false;
      transcriptButton.textContent = 'Try transcription again';
      if (status) status.textContent = error.message;
    });
    return;
  }
  const button = event.target.closest('[data-play-index]');
  if (!button) return;
  playConversationEntries(expandPlaybackEntries(dashboardState.entries.slice(Number(button.dataset.playIndex))));
});
document.querySelector('#closeResponsePrompt').addEventListener('click', () => responsePromptDialog.close());
document.querySelector('#promptRecordAudio').addEventListener('click', () => {
  responsePromptDialog.close();
  startRecording('audio');
});
document.querySelector('#promptRecordVideo').addEventListener('click', () => {
  responsePromptDialog.close();
  startRecording('video');
});
document.querySelector('#promptRecordScreen').addEventListener('click', () => {
  responsePromptDialog.close();
  startRecording('screen');
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
  conversationFormMessage.textContent = 'Creating your Drop…';

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
    conversationFormMessage.textContent = `Could not create Drop: ${error.message}`;
  } finally {
    createConversationButton.disabled = false;
    createConversationButton.textContent = 'Create Drop';
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
