export default function StatusPill({ status }) {
  return <span className={`status-pill st-${status}`}>{status}</span>;
}
