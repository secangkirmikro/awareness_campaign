(() => {
  'use strict';
  const DAY = 86400000, WIB = 7 * 3600000;
  function dayNumber(date) { return Math.floor((date.getTime() + WIB) / DAY); }
  function ordered(items) {
    return [...items].sort((a,b) => {
      const number = item => Number.isFinite(Number(item.order)) && item.order !== undefined ? Number(item.order) : Number(item.id.match(/\d+$/)?.[0] || 0);
      return number(a) - number(b) || a.id.localeCompare(b.id);
    });
  }
  function select(items, date, startDate) {
    const list = ordered(items);
    if (!list.length) return null;
    const start = Date.parse(startDate + 'T00:00:00+07:00');
    if (!Number.isFinite(start)) throw new Error('Tanggal mulai rotasi tidak valid.');
    const elapsed = Math.max(0, dayNumber(date) - dayNumber(new Date(start)));
    const index = elapsed % list.length;
    return { item:list[index], index, total:list.length, day:dayNumber(date) };
  }
  function nextMidnight(date) { return (dayNumber(date) + 1) * DAY - WIB; }
  window.CampaignRotation = { select, ordered, nextMidnight };
})();
