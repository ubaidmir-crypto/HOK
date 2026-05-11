export const money = (n) => '\u20B9' + Number(n || 0).toLocaleString('en-IN');

export const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

export const formatDateShort = (d) =>
  new Date(d).toLocaleDateString('en-IN');

export const formatTime = (d) =>
  new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

export const trimSeconds = (t) => (t ? t.slice(0, 5) : '');
