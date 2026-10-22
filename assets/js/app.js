// 1. Ambil Nama Tamu dari URL (?invite=Nama+Tamu)
window.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const guest = urlParams.get('invite');
  if (guest) {
    document.getElementById('guest-name').innerText = decodeURIComponent(guest);
  }
  loadWishes();
  initCountdown();
});

// 2. Kontrol Buka Undangan & Background Audio
const audio = document.getElementById('wedding-audio');
let isPlaying = false;

function openInvitation() {
  const cover = document.getElementById('cover-screen');
  cover.classList.add('-translate-y-full');
  setTimeout(() => cover.classList.add('hidden'), 700);

  document.getElementById('bottom-nav').classList.remove('hidden');
  document.getElementById('audio-control').classList.remove('hidden');
  document.getElementById('audio-control').classList.add('flex');

  audio.play().then(() => {
    isPlaying = true;
  }).catch(e => console.log('Autoplay dicegah browser:', e));
}

function toggleAudio() {
  const icon = document.getElementById('audio-icon');
  if (isPlaying) {
    audio.pause();
    icon.classList.remove('animate-spin');
    icon.classList.replace('fa-compact-disc', 'fa-play');
    isPlaying = false;
  } else {
    audio.play();
    icon.classList.add('animate-spin');
    icon.classList.replace('fa-play', 'fa-compact-disc');
    isPlaying = true;
  }
}

// 3. Countdown Timer (Target: 13 April 2026)
function initCountdown() {
  const targetDate = new Date('April 13, 2026 08:00:00').getTime();

  setInterval(() => {
    const now = new Date().getTime();
    const diff = targetDate - now;

    if (diff > 0) {
      document.getElementById('days').innerText = Math.floor(diff / (1000 * 60 * 60 * 24)).toString().padStart(2, '0');
      document.getElementById('hours').innerText = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
      document.getElementById('minutes').innerText = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
      document.getElementById('seconds').innerText = Math.floor((diff % (1000 * 60)) / 1000).toString().padStart(2, '0');
    }
  }, 1000);
}

// 4. Salin Nomor Rekening
function copyToClipboard(id) {
  const text = document.getElementById(id).innerText;
  navigator.clipboard.writeText(text).then(() => {
    const toast = document.getElementById('toast');
    toast.classList.remove('opacity-0');
    setTimeout(() => toast.classList.add('opacity-0'), 2200);
  });
}

// 5. Buku Tamu (Penyimpanan Sementara di LocalStorage)
function submitWish(e) {
  e.preventDefault();
  const name = document.getElementById('sender-name').value;
  const attendance = document.getElementById('attendance').value;
  const message = document.getElementById('sender-message').value;

  const newWish = { name, attendance, message };
  const wishes = JSON.parse(localStorage.getItem('wedding_wishes') || '[]');
  wishes.unshift(newWish);
  localStorage.setItem('wedding_wishes', JSON.stringify(wishes));

  document.getElementById('wishes-form').reset();
  loadWishes();
}

function loadWishes() {
  const defaultWishes = [
    { name: 'Alumni SMK Insan Nasional', attendance: 'Hadir', message: 'Selamat untuk Sopian dan Cici! Semoga berkah dan langgeng selalu.' }
  ];
  const wishes = JSON.parse(localStorage.getItem('wedding_wishes')) || defaultWishes;
  const list = document.getElementById('wishes-list');
  list.innerHTML = wishes.map(w => `
    <div class="bg-jawa-dark/60 p-3 rounded-xl border border-jawa-gold/20">
      <div class="flex justify-between items-center mb-1">
        <span class="font-bold text-jawa-goldlight">${w.name}</span>
        <span class="text-[10px] bg-jawa-surface px-2 py-0.5 rounded text-gray-300">${w.attendance}</span>
      </div>
      <p class="text-gray-300 text-xs">${w.message}</p>
    </div>
  `).join('');
}