export default function UserBubble({ text }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'flex-end',
      marginBottom: '1rem',
    }}>
      <div
        className="font-zodiak"
        style={{
          backgroundColor: '#F2E0B6',
          color: '#1a1a1a',
          padding: '0.75rem 1rem',
          borderRadius: '4px',
          maxWidth: '320px',
          fontSize: '0.9rem',
          lineHeight: '1.6',
          border: '1px solid #ccc',
        }}
      >
        {text}
      </div>
    </div>
  )
}
