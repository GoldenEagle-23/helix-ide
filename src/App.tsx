import { useState } from 'react';

type Tab = 'code' | 'chat' | 'terminal' | 'search';

type FileNode = {
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  icon?: string;
};

type ChatMessage = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  model?: string;
};

const FILE_TREE: FileNode[] = [
  {
    name: 'project',
    type: 'folder',
    icon: '⊞',
    children: [
      {
        name: 'src',
        type: 'folder',
        icon: '⊟',
        children: [
          { name: 'index.ts', type: 'file', icon: '⌘' },
          { name: 'main.ts', type: 'file', icon: '⌘' },
          { name: 'utils.ts', type: 'file', icon: '⌘' },
          {
            name: 'components',
            type: 'folder',
            icon: '⊟',
            children: [
              { name: 'App.tsx', type: 'file', icon: '⌘' },
              { name: 'Header.tsx', type: 'file', icon: '⌘' },
            ],
          },
        ],
      },
      { name: 'package.json', type: 'file', icon: '◰' },
      { name: 'tsconfig.json', type: 'file', icon: '◰' },
      { name: 'README.md', type: 'file', icon: '◫' },
    ],
  },
];

const HELIX_COMMANDS = [
  { cmd: '/chat', desc: 'Start a conversation with Helix AI' },
  { cmd: '/spec', desc: 'Generate or update project specification' },
  { cmd: '/read', desc: 'Read and analyze a file' },
  { cmd: '/write', desc: 'Write or modify a file' },
  { cmd: '/run', desc: 'Execute a shell command' },
  { cmd: '/plan', desc: 'Generate a plan for a task' },
  { cmd: '/agent', desc: 'Spawn an AI agent for a subtask' },
  { cmd: '/review', desc: 'Review code changes' },
  { cmd: '/commit', desc: 'Create a git commit' },
  { cmd: '/search', desc: 'Search across the codebase' },
  { cmd: '/model', desc: 'Switch AI model' },
  { cmd: '/mcp', desc: 'Manage MCP connections' },
];

const s = {
  flexCenter: { display: 'flex', alignItems: 'center' } as const,
  card: {
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 8,
  },
  input: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 8,
    padding: '10px 14px',
    color: '#f5f5f5',
    fontSize: 13,
    fontFamily: "'Inter', sans-serif",
    width: '100%',
    outline: 'none',
  },
};

function FileTreeItem({ node, depth = 0 }: { node: FileNode; depth?: number }) {
  const [open, setOpen] = useState(true);
  const isFolder = node.type === 'folder';
  return (
    <div>
      <div
        onClick={() => isFolder && setOpen(!open)}
        style={{
          ...s.flexCenter,
          gap: 6,
          padding: '4px 8px',
          paddingLeft: 12 + depth * 16,
          cursor: isFolder ? 'pointer' : 'default',
          borderRadius: 4,
          fontSize: 13,
          color: 'rgba(255,255,255,0.6)',
          userSelect: 'none',
        }}
      >
        <span style={{ fontSize: 10, width: 12, textAlign: 'center' }}>
          {isFolder ? (open ? '▾' : '▸') : '·'}
        </span>
        <span style={{ opacity: 0.5 }}>{node.icon || (isFolder ? '⊟' : '⌘')}</span>
        <span style={{ marginLeft: 4 }}>{node.name}</span>
      </div>
      {isFolder &&
        open &&
        node.children?.map((child, i) => (
          <FileTreeItem key={child.name + i} node={child} depth={depth + 1} />
        ))}
    </div>
  );
}

const CODE_SAMPLE = `import { Helix } from '@aether/helix-sdk'

const helix = new Helix({
  model: 'aether-orion-v1',
  tools: ['filesystem', 'shell', 'git'],
})

const result = await helix.agent('Write a test suite')
const { files, summary } = result

console.log(summary)
for (const f of files) {
  await fs.writeFile(f.path, f.content)
}`;

export default function App() {
  const [tab, setTab] = useState<Tab>('code');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        "Welcome to Helix IDE. I'm your AI development partner. I can help you write code, debug issues, and manage your project. Try a command like `/plan build a REST API` or just ask me a question.",
      model: 'aether-orion-v1',
    },
  ]);
  const [input, setInput] = useState('');
  const [showCommands, setShowCommands] = useState(false);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setInput('');
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: 'user', content: text },
      {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `I'll help you with "${text}". This would invoke the Helix SDK with model aether-orion-v1 to process your request.`,
        model: 'aether-orion-v1',
      },
    ]);
  };

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        background: '#050505',
        color: '#f5f5f5',
        fontFamily: "'Inter', sans-serif",
        overflow: 'hidden',
      }}
    >
      {/* Activity Bar */}
      <div
        style={{
          width: 52,
          background: '#0a0a0a',
          borderRight: '1px solid rgba(255,255,255,0.04)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '12px 0',
          gap: 4,
          flexShrink: 0,
        }}
      >
        {[
          { id: 'code' as Tab, icon: '⌘', label: 'Code' },
          { id: 'chat' as Tab, icon: '✦', label: 'Chat' },
          { id: 'terminal' as Tab, icon: '⌨', label: 'Terminal' },
          { id: 'search' as Tab, icon: '◰', label: 'Search' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              cursor: 'pointer',
              border: 'none',
              background: tab === item.id ? 'rgba(214,169,78,0.12)' : 'none',
              color: tab === item.id ? '#D6A94E' : 'rgba(255,255,255,0.3)',
              fontSize: 18,
              fontFamily: "'Inter', sans-serif",
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s',
            }}
          >
            {item.icon}
          </button>
        ))}
      </div>

      {/* Sidebar */}
      <div
        style={{
          width: 240,
          background: '#0a0a0a',
          borderRight: '1px solid rgba(255,255,255,0.04)',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            padding: '12px 16px',
            borderBottom: '1px solid rgba(255,255,255,0.04)',
            ...s.flexCenter,
            gap: 8,
          }}
        >
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: 6,
              background: 'linear-gradient(135deg,#D6A94E,#FF6A1A)',
              ...s.flexCenter,
              justifyContent: 'center',
              fontSize: 12,
              fontWeight: 700,
              color: '#050505',
            }}
          >
            H
          </div>
          <span
            style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: 15,
              fontWeight: 700,
              letterSpacing: '1px',
            }}
          >
            HELIX
          </span>
        </div>
        <div style={{ flex: 1, overflow: 'auto', padding: '8px 0' }}>
          {tab === 'code' && (
            <div>
              {FILE_TREE.map((node, i) => (
                <FileTreeItem key={node.name + i} node={node} />
              ))}
            </div>
          )}
          {tab === 'chat' && (
            <div style={{ padding: '0 12px' }}>
              <div
                style={{
                  fontSize: 11,
                  color: 'rgba(255,255,255,0.3)',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  padding: '8px 0',
                }}
              >
                Helix Commands
              </div>
              {HELIX_COMMANDS.slice(0, 8).map((c) => (
                <button
                  key={c.cmd}
                  onClick={() => {
                    setInput(c.cmd + ' ');
                    setTab('chat');
                  }}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '6px 10px',
                    background: 'none',
                    border: 'none',
                    color: 'rgba(255,255,255,0.5)',
                    cursor: 'pointer',
                    fontSize: 12,
                    textAlign: 'left',
                    borderRadius: 4,
                    fontFamily: "'Fira Code', monospace",
                  }}
                >
                  <span style={{ color: '#D6A94E' }}>{c.cmd}</span>
                  <span style={{ marginLeft: 8, opacity: 0.5, fontFamily: "'Inter', sans-serif" }}>
                    {c.desc}
                  </span>
                </button>
              ))}
            </div>
          )}
          {tab === 'search' && (
            <div style={{ padding: '0 12px', marginTop: 8 }}>
              <input
                placeholder="Search files..."
                style={{ ...s.input, padding: '8px 12px', fontSize: 12 }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Main Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Tab bar */}
        <div
          style={{
            display: 'flex',
            background: '#0a0a0a',
            borderBottom: '1px solid rgba(255,255,255,0.04)',
            padding: '0 8px',
            flexShrink: 0,
          }}
        >
          {['index.ts', 'main.ts', 'App.tsx'].map((file) => (
            <div
              key={file}
              style={{
                ...s.flexCenter,
                gap: 6,
                padding: '8px 14px',
                fontSize: 12,
                borderBottom: file === 'index.ts' ? '2px solid #D6A94E' : '2px solid transparent',
                color: file === 'index.ts' ? '#f5f5f5' : 'rgba(255,255,255,0.4)',
                cursor: 'pointer',
              }}
            >
              <span style={{ opacity: 0.4, fontSize: 10 }}>⌘</span>
              {file}
            </div>
          ))}
        </div>

        {/* Editor / Chat */}
        <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
          {tab === 'chat' ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
                {messages.map((m) => (
                  <div
                    key={m.id}
                    style={{
                      display: 'flex',
                      gap: 12,
                      marginBottom: 16,
                      flexDirection: m.role === 'user' ? 'row-reverse' : 'row',
                    }}
                  >
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 6,
                        flexShrink: 0,
                        ...s.flexCenter,
                        justifyContent: 'center',
                        fontSize: 12,
                        background:
                          m.role === 'user' ? 'rgba(214,169,78,0.15)' : 'rgba(255,255,255,0.04)',
                        color: m.role === 'user' ? '#D6A94E' : 'rgba(255,255,255,0.4)',
                      }}
                    >
                      {m.role === 'user' ? 'U' : 'H'}
                    </div>
                    <div style={{ flex: 1, maxWidth: '75%' }}>
                      <p
                        style={{
                          fontSize: 14,
                          lineHeight: 1.6,
                          whiteSpace: 'pre-wrap',
                          color: m.role === 'user' ? '#f5f5f5' : 'rgba(255,255,255,0.8)',
                        }}
                      >
                        {m.content}
                      </p>
                      {m.model && (
                        <span
                          style={{
                            fontSize: 10,
                            color: 'rgba(255,255,255,0.2)',
                            marginTop: 4,
                            display: 'block',
                          }}
                        >
                          {m.model}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div
                style={{ padding: '12px 20px 16px', borderTop: '1px solid rgba(255,255,255,0.04)' }}
              >
                <div
                  style={{
                    position: 'relative',
                    ...s.flexCenter,
                    gap: 8,
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 10,
                    padding: '6px 6px 6px 14px',
                  }}
                >
                  <input
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value);
                      setShowCommands(e.target.value.startsWith('/'));
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        send();
                      }
                    }}
                    placeholder="Ask Helix or use a command..."
                    style={{
                      flex: 1,
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      color: '#f5f5f5',
                      fontSize: 14,
                      fontFamily: "'Inter', sans-serif",
                    }}
                  />
                  {showCommands && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '100%',
                        left: 0,
                        marginBottom: 4,
                        width: 320,
                        background: '#0a0a0a',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: 10,
                        boxShadow: '0 10px 40px rgba(0,0,0,0.6)',
                        maxHeight: 240,
                        overflow: 'auto',
                        zIndex: 10,
                      }}
                    >
                      {HELIX_COMMANDS.filter((c) => c.cmd.startsWith(input.toLowerCase())).map(
                        (c) => (
                          <button
                            key={c.cmd}
                            onClick={() => {
                              setInput(c.cmd + ' ');
                              setShowCommands(false);
                            }}
                            style={{
                              display: 'flex',
                              gap: 12,
                              padding: '10px 14px',
                              width: '100%',
                              background: 'none',
                              border: 'none',
                              color: '#f5f5f5',
                              cursor: 'pointer',
                              fontSize: 13,
                              textAlign: 'left',
                              fontFamily: "'Inter', sans-serif",
                            }}
                          >
                            <span
                              style={{
                                color: '#D6A94E',
                                fontFamily: "'Fira Code', monospace",
                                minWidth: 60,
                              }}
                            >
                              {c.cmd}
                            </span>
                            <span style={{ color: 'rgba(255,255,255,0.4)' }}>{c.desc}</span>
                          </button>
                        ),
                      )}
                    </div>
                  )}
                  <button
                    onClick={send}
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 8,
                      background: 'linear-gradient(135deg,#D6A94E,#FF6A1A)',
                      border: 'none',
                      cursor: 'pointer',
                      ...s.flexCenter,
                      justifyContent: 'center',
                      color: '#050505',
                      fontSize: 16,
                    }}
                  >
                    ➤
                  </button>
                </div>
              </div>
            </div>
          ) : tab === 'terminal' ? (
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                fontFamily: "'Fira Code', monospace",
                fontSize: 13,
                padding: 16,
                background: '#000',
              }}
            >
              <div style={{ color: 'rgba(255,255,255,0.4)', marginBottom: 12 }}>
                $ <span style={{ color: '#D6A94E' }}>helix</span>{' '}
                <span style={{ color: '#22c55e' }}>--help</span>
              </div>
              <div style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.8, marginBottom: 12 }}>
                {`Usage: helix <command> [options]

Commands:
  chat       Start interactive session
  spec       Generate project specification
  read       Read file contents
  write      Write/modify files
  run        Execute shell commands
  plan       Generate task plans
  agent      Spawn AI agents
  review     Review code changes
  commit     Create git commits
  search     Search codebase
  model      Switch AI models
  mcp        Manage MCP connections`}
              </div>
              <div style={{ ...s.flexCenter, gap: 8, marginTop: 'auto' }}>
                <span style={{ color: '#22c55e' }}>$</span>
                <input
                  autoFocus
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: '#f5f5f5',
                    fontSize: 13,
                    fontFamily: "'Fira Code', monospace",
                  }}
                  placeholder="Type a command..."
                />
              </div>
            </div>
          ) : tab === 'search' ? (
            <div style={{ flex: 1, padding: 24 }}>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 20 }}>
                Search across all project files
              </div>
              <div style={{ display: 'flex', gap: 16 }}>
                {['Files', 'Code', 'Symbols', 'Commits'].map((s) => (
                  <button
                    key={s}
                    style={{
                      padding: '6px 14px',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      borderRadius: 6,
                      color: 'rgba(255,255,255,0.5)',
                      cursor: 'pointer',
                      fontSize: 12,
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div
              style={{
                flex: 1,
                padding: 0,
                fontFamily: "'Fira Code', monospace",
                fontSize: 13,
                overflow: 'auto',
                background: '#0a0a0a',
              }}
            >
              <div
                style={{
                  ...s.flexCenter,
                  padding: '8px 16px',
                  background: '#050505',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                  fontSize: 11,
                  color: 'rgba(255,255,255,0.3)',
                  gap: 16,
                }}
              >
                <span>index.ts</span>
                <span style={{ color: '#22c55e' }}>●</span>
                <span>TypeScript</span>
              </div>
              <pre
                style={{
                  padding: '16px 20px',
                  lineHeight: 1.6,
                  color: 'rgba(255,255,255,0.8)',
                  whiteSpace: 'pre',
                }}
              >
                <code>{CODE_SAMPLE}</code>
              </pre>
            </div>
          )}
        </div>

        {/* Status Bar */}
        <div
          style={{
            ...s.flexCenter,
            justifyContent: 'space-between',
            padding: '4px 16px',
            background: '#0a0a0a',
            borderTop: '1px solid rgba(255,255,255,0.04)',
            fontSize: 11,
            color: 'rgba(255,255,255,0.3)',
            flexShrink: 0,
          }}
        >
          <div style={{ ...s.flexCenter, gap: 16 }}>
            <span style={{ color: '#22c55e' }}>● Helix AI Ready</span>
            <span>Model: aether-orion-v1</span>
            <span>MCP: 3 connected</span>
          </div>
          <div style={{ ...s.flexCenter, gap: 16 }}>
            <span>UTF-8</span>
            <span>TypeScript</span>
            <span>Ln 12, Col 24</span>
          </div>
        </div>
      </div>
    </div>
  );
}
