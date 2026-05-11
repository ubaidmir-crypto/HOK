export default function Toast({ toast }) {
  if (!toast) return null;
  return <div className={`toast show ${toast.kind}`}>{toast.msg}</div>;
}