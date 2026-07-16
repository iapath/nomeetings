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
  localStorage.setItem('nomeetings-theme', isDark ? 'dark' : 'light');
}

function addMarker(label, time) {
  const row = document.createElement('li');
  row.innerHTML = `<b>${time}</b> ${label}`;
  markerLog.prepend(row);
  markerLabel.value = '';
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

renderAgenda();
renderEntries();
setTheme(localStorage.getItem('nomeetings-theme') !== 'light');
refreshSession();
