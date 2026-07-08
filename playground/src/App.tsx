import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { 
  ThemeProvider, 
  createTheme, 
  CssBaseline, 
  Tabs, 
  Tab, 
  Box, 
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Snackbar
} from '@mui/material';
import { AutoAwesome, PlayArrow, Code, Storage, CheckCircle, Share } from '@mui/icons-material';
// @ts-ignore
import { transpile } from './canonflow/Library.js';
import { samples } from './samples';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#9c66ff',
    },
    secondary: {
      main: '#ff4081',
    },
    background: {
      default: '#0f1115',
      paper: '#1e1e24',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
});

function TabPanel(props: { children?: React.ReactNode; index: number; value: number }) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      className="h-full"
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 0, height: '100%' }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function App() {
  const getInitialSql = () => {
    try {
      const hash = window.location.hash;
      if (hash.startsWith('#code=')) {
        return decodeURIComponent(atob(hash.substring(6)));
      }
    } catch (e) {
      console.error("Failed to parse code from URL", e);
    }
    return samples['sangam-credit'] || '-- Write your DDL here';
  };

  const [sql, setSql] = useState<string>(getInitialSql());
  const [activeTab, setActiveTab] = useState(0);
  const [output, setOutput] = useState<any>(null);
  const [sampleKey, setSampleKey] = useState<string>('sangam-credit');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleTranspile = () => {
    try {
      console.log('Transpiling SQL...');
      const res = transpile(sql);
      setOutput(res);
    } catch (err) {
      console.error(err);
      setOutput({ error: String(err), diagnostics: [] });
    }
  };

  useEffect(() => {
    handleTranspile();
  }, [sql]);

  const handleSampleChange = (e: any) => {
    const key = e.target.value;
    setSampleKey(key);
    setSql(samples[key] || '');
    window.location.hash = '';
  };

  const handleShare = () => {
    const encoded = btoa(encodeURIComponent(sql));
    window.location.hash = `code=${encoded}`;
    navigator.clipboard.writeText(window.location.href).then(() => {
      setSnackbarOpen(true);
    }).catch(err => {
      console.error("Failed to copy clipboard", err);
    });
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className="flex flex-col h-screen overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]">
        
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 glass-panel m-4 z-10 border-b border-white/10 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="bg-primary/20 p-2 rounded-lg border border-primary/30">
              <AutoAwesome sx={{ color: '#9c66ff' }} />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#9c66ff] to-[#ff4081] m-0">
                CanonFlow Playground
              </h1>
              <p className="text-xs text-text-secondary m-0 tracking-wide uppercase font-semibold">Semantic Schema Transpiler</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <FormControl size="small" className="w-64">
              <InputLabel id="sample-select-label">Load Sample</InputLabel>
              <Select
                labelId="sample-select-label"
                value={sampleKey}
                label="Load Sample"
                onChange={handleSampleChange}
                className="bg-black/20"
              >
                {Object.keys(samples).map(k => (
                  <MenuItem key={k} value={k}>{k.replace('-core', '').toUpperCase()}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button 
              variant="outlined" 
              color="primary" 
              startIcon={<Share />}
              onClick={handleShare}
              className="font-bold border-primary/50 hover:bg-primary/10 transition-all"
            >
              Share URL
            </Button>
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<PlayArrow />}
              onClick={handleTranspile}
              className="bg-gradient-to-r from-primary to-secondary font-bold shadow-[0_0_15px_rgba(156,102,255,0.5)] hover:shadow-[0_0_25px_rgba(156,102,255,0.7)] transition-all"
            >
              Transpile
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex flex-1 gap-4 px-4 pb-4 overflow-hidden">
          
          {/* Input Panel */}
          <div className="flex-1 flex flex-col glass-panel overflow-hidden relative group">
            <div className="px-4 py-2 bg-black/40 border-b border-white/10 flex items-center gap-2">
              <Storage fontSize="small" className="text-primary" />
              <Typography variant="subtitle2" className="text-text-primary font-semibold tracking-wide">PostgreSQL DDL (Truth)</Typography>
            </div>
            <div className="flex-1">
              <Editor
                height="100%"
                defaultLanguage="pgsql"
                theme="vs-dark"
                value={sql}
                onChange={(val) => setSql(val || '')}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                  padding: { top: 16 },
                  scrollBeyondLastLine: false,
                  smoothScrolling: true,
                  cursorBlinking: "smooth",
                  cursorSmoothCaretAnimation: "on",
                }}
              />
            </div>
          </div>

          {/* Output Panel */}
          <div className="flex-1 flex flex-col glass-panel overflow-hidden relative">
            <Box sx={{ borderBottom: 1, borderColor: 'rgba(255,255,255,0.1)', bgcolor: 'rgba(0,0,0,0.4)' }}>
              <Tabs 
                value={activeTab} 
                onChange={(_, v) => setActiveTab(v)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  '& .MuiTab-root': { color: 'rgba(255,255,255,0.6)', minHeight: 48 },
                  '& .Mui-selected': { color: '#9c66ff' },
                  '& .MuiTabs-indicator': { backgroundColor: '#9c66ff', height: 3, borderRadius: '3px 3px 0 0' }
                }}
              >
                <Tab icon={<Code fontSize="small" />} iconPosition="start" label="TypeScript" />
                <Tab icon={<Code fontSize="small" />} iconPosition="start" label="Kotlin" />
                <Tab icon={<Code fontSize="small" />} iconPosition="start" label="Swift" />
                <Tab icon={<CheckCircle fontSize="small" />} iconPosition="start" label="FsCheck" />
                <Tab label={`Diagnostics ${output?.diagnostics?.length ? `(${output.diagnostics.length})` : ''}`} />
              </Tabs>
            </Box>
            
            <div className="flex-1 overflow-hidden">
              <TabPanel value={activeTab} index={0}>
                <Editor
                  height="100%"
                  defaultLanguage="typescript"
                  theme="vs-dark"
                  value={output?.typescript || '// No output'}
                  options={{ readOnly: true, minimap: { enabled: false }, padding: { top: 16 } }}
                />
              </TabPanel>
              <TabPanel value={activeTab} index={1}>
                <Editor
                  height="100%"
                  defaultLanguage="kotlin"
                  theme="vs-dark"
                  value={output?.kotlin || '// No output'}
                  options={{ readOnly: true, minimap: { enabled: false }, padding: { top: 16 } }}
                />
              </TabPanel>
              <TabPanel value={activeTab} index={2}>
                <Editor
                  height="100%"
                  defaultLanguage="swift"
                  theme="vs-dark"
                  value={output?.swift || '// No output'}
                  options={{ readOnly: true, minimap: { enabled: false }, padding: { top: 16 } }}
                />
              </TabPanel>
              <TabPanel value={activeTab} index={3}>
                <Editor
                  height="100%"
                  defaultLanguage="fsharp"
                  theme="vs-dark"
                  value={output?.fscheck || '// No output'}
                  options={{ readOnly: true, minimap: { enabled: false }, padding: { top: 16 } }}
                />
              </TabPanel>
              <TabPanel value={activeTab} index={4}>
                <div className="p-6 h-full overflow-auto bg-[#1e1e1e] text-[#d4d4d4] font-mono text-sm leading-relaxed">
                  {output?.error ? (
                    <div className="text-red-400 mb-4 p-4 bg-red-900/20 rounded border border-red-500/30">
                      <h3 className="font-bold mb-2">Error during transpilation:</h3>
                      <pre className="whitespace-pre-wrap">{output.error}</pre>
                    </div>
                  ) : null}
                  
                  {output?.diagnostics && output.diagnostics.length > 0 ? (
                    <ul className="space-y-3">
                      {output.diagnostics.map((d: string, i: number) => (
                        <li key={i} className="flex gap-3 bg-black/20 p-3 rounded-lg border border-white/5">
                          <span className="text-yellow-500">⚠️</span>
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-white/40 space-y-4">
                      <div className="text-4xl">✨</div>
                      <p>No diagnostics found. The schema is semantically sound.</p>
                    </div>
                  )}
                </div>
              </TabPanel>
            </div>
          </div>
        </div>
      </div>
      
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message="Link copied to clipboard!"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </ThemeProvider>
  );
}
