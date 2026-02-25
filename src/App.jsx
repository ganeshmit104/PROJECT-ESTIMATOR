import { useState, useEffect } from 'react';

export default function App() {
const defaultPhases = [
{ id: 'req', name: 'Requirements', weeks: 2, enabled: true },
{ id: 'plan', name: 'Planning & Design', weeks: 2, enabled: true },
{ id: 'dev', name: 'Development', weeks: 8, enabled: true },
{ id: 'sit', name: 'SIT', weeks: 2, enabled: true },
{ id: 'uat', name: 'UAT', weeks: 2, enabled: true },
{ id: 'deploy', name: 'Deployment', weeks: 1, enabled: true },
{ id: 'hyper', name: 'HyperCare', weeks: 2, enabled: true },
{ id: 'training', name: 'Training & KT', weeks: 1, enabled: false }
];

const allResourceTypes = [
{ id: 'dw_arch', name: 'DW Architect', category: 'Architecture' },
{ id: 'sol_arch', name: 'Solution Architect', category: 'Architecture' },
{ id: 'data_modeler', name: 'Data Modeler', category: 'Architecture' },
{ id: 'etl_lead', name: 'ETL Lead', category: 'ETL' },
{ id: 'etl_dev', name: 'ETL Developer', category: 'ETL' },
{ id: 'data_eng', name: 'Data Engineer', category: 'ETL' },
{ id: 'cognos_lead', name: 'Cognos Lead', category: 'Reporting' },
{ id: 'cognos_dev', name: 'Cognos Developer', category: 'Reporting' },
{ id: 'bi_dev', name: 'BI Developer', category: 'Reporting' },
{ id: 'report_dev', name: 'Report Developer', category: 'Reporting' },
{ id: 'dba', name: 'DBA', category: 'Database' },
{ id: 'cloud_arch', name: 'Cloud Architect', category: 'Cloud' },
{ id: 'cloud_eng', name: 'Cloud Engineer', category: 'Cloud' },
{ id: 'devops', name: 'DevOps Engineer', category: 'Cloud' },
{ id: 'data_analyst', name: 'Data Analyst', category: 'Analysis' },
{ id: 'ba', name: 'Business Analyst', category: 'Analysis' },
{ id: 'test_lead', name: 'Test Lead', category: 'Testing' },
{ id: 'tester', name: 'Tester', category: 'Testing' },
{ id: 'perf_tester', name: 'Performance Tester', category: 'Testing' },
{ id: 'qa_analyst', name: 'QA Analyst', category: 'Testing' },
{ id: 'pm', name: 'Project Manager', category: 'Management' },
{ id: 'scrum', name: 'Scrum Master', category: 'Management' },
{ id: 'tech_writer', name: 'Technical Writer', category: 'Support' },
{ id: 'security', name: 'Security Analyst', category: 'Support' }
];

const defaultEnabledResources = [
'dw_arch', 'etl_lead', 'etl_dev', 'cognos_dev', 'bi_dev',
'dba', 'data_analyst', 'ba', 'test_lead', 'tester', 'pm'
];

const getDefaultRates = () => ({
onsite: {
dw_arch: 150, sol_arch: 160, data_modeler: 130,
etl_lead: 120, etl_dev: 100, data_eng: 110,
cognos_lead: 115, cognos_dev: 100, bi_dev: 95, report_dev: 85,
dba: 110, cloud_arch: 155, cloud_eng: 120, devops: 115,
data_analyst: 85, ba: 90,
test_lead: 90, tester: 75, perf_tester: 95, qa_analyst: 80,
pm: 130, scrum: 100, tech_writer: 70, security: 125
},
offshore: {
dw_arch: 75, sol_arch: 80, data_modeler: 60,
etl_lead: 55, etl_dev: 45, data_eng: 50,
cognos_lead: 52, cognos_dev: 45, bi_dev: 42, report_dev: 38,
dba: 50, cloud_arch: 72, cloud_eng: 55, devops: 52,
data_analyst: 38, ba: 40,
test_lead: 40, tester: 32, perf_tester: 45, qa_analyst: 35,
pm: 60, scrum: 45, tech_writer: 30, security: 58
}
});

const [projectName, setProjectName] = useState('New DW Project');
const [clientName, setClientName] = useState('');
const [phases, setPhases] = useState(defaultPhases);
const [rates, setRates] = useState(getDefaultRates());
const [hoursPerWeek, setHoursPerWeek] = useState(40);
const [currency, setCurrency] = useState('USD');
const [allocations, setAllocations] = useState({});
const [enabledResources, setEnabledResources] = useState(defaultEnabledResources);
const [showRates, setShowRates] = useState(false);
const [showResourceSelector, setShowResourceSelector] = useState(false);
const [estimate, setEstimate] = useState(null);
const [savedProjects, setSavedProjects] = useState([]);
const [showSaveModal, setShowSaveModal] = useState(false);
const [showLoadModal, setShowLoadModal] = useState(false);
const [activeTab, setActiveTab] = useState('config');

const currencySymbols = { USD: '$', EUR: '€', GBP: '£', INR: '₹', AUD: 'A$', CAD: 'C$' };

const resourceTypes = allResourceTypes.filter(r => enabledResources.includes(r.id));

const allGroupedResources = allResourceTypes.reduce((acc, r) => {
if (!acc[r.category]) acc[r.category] = [];
acc[r.category].push(r);
return acc;
}, {});

const groupedResources = resourceTypes.reduce((acc, r) => {
if (!acc[r.category]) acc[r.category] = [];
acc[r.category].push(r);
return acc;
}, {});

useEffect(() => {
const saved = localStorage.getItem('dw_estimator_projects');
if (saved) setSavedProjects(JSON.parse(saved));
}, []);

const toggleResource = (id) => {
setEnabledResources(prev =>
prev.includes(id) ? prev.filter(x => x !== id) : […prev, id]
);
};

const toggleCategoryResources = (category, enable) => {
const ids = allResourceTypes.filter(r => r.category === category).map(r => r.id);
if (enable) setEnabledResources(prev => […new Set([…prev, …ids])]);
else setEnabledResources(prev => prev.filter(id => !ids.includes(id)));
};

const updatePhase = (id, field, value) => {
setPhases(phases.map(p =>
p.id === id ? { …p, [field]: field === 'weeks' ? Number(value) : value } : p
));
};

const updateAllocation = (phaseId, resourceId, location, value) => {
setAllocations(prev => ({
…prev,
[phaseId]: {
…prev[phaseId],
[resourceId]: { …prev[phaseId]?.[resourceId], [location]: Number(value) || 0 }
}
}));
};

const updateRate = (location, resourceId, value) => {
setRates(prev => ({
…prev,
[location]: { …prev[location], [resourceId]: Number(value) || 0 }
}));
};

const calculateEstimate = () => {
const enabledPhases = phases.filter(p => p.enabled);
const totalWeeks = enabledPhases.reduce((sum, p) => sum + p.weeks, 0);
let totalCost = 0, totalOnsiteCost = 0, totalOffshoreCost = 0;
let totalOnsiteHours = 0, totalOffshoreHours = 0;
const phaseBreakdown = [];
const resourceSummary = {};

```
enabledPhases.forEach(phase => {
  const phaseHours = phase.weeks * hoursPerWeek;
  let phaseCost = 0, phaseOnsiteCost = 0, phaseOffshoreCost = 0;
  const phaseResources = [];

  resourceTypes.forEach(resource => {
    const alloc = allocations[phase.id]?.[resource.id] || { onsite: 0, offshore: 0 };
    if (alloc.onsite > 0 || alloc.offshore > 0) {
      const onsiteHours = alloc.onsite * phaseHours;
      const offshoreHours = alloc.offshore * phaseHours;
      const onsiteCost = onsiteHours * rates.onsite[resource.id];
      const offshoreCost = offshoreHours * rates.offshore[resource.id];

      phaseCost += onsiteCost + offshoreCost;
      phaseOnsiteCost += onsiteCost;
      phaseOffshoreCost += offshoreCost;
      totalOnsiteHours += onsiteHours;
      totalOffshoreHours += offshoreHours;

      phaseResources.push({
        id: resource.id, name: resource.name, category: resource.category,
        onsite: alloc.onsite, offshore: alloc.offshore,
        onsiteHours, offshoreHours, onsiteCost, offshoreCost,
        totalCost: onsiteCost + offshoreCost
      });

      if (!resourceSummary[resource.id]) {
        resourceSummary[resource.id] = {
          id: resource.id, name: resource.name, category: resource.category,
          onsiteHours: 0, offshoreHours: 0, onsiteCost: 0, offshoreCost: 0
        };
      }
      resourceSummary[resource.id].onsiteHours += onsiteHours;
      resourceSummary[resource.id].offshoreHours += offshoreHours;
      resourceSummary[resource.id].onsiteCost += onsiteCost;
      resourceSummary[resource.id].offshoreCost += offshoreCost;
    }
  });

  totalCost += phaseCost;
  totalOnsiteCost += phaseOnsiteCost;
  totalOffshoreCost += phaseOffshoreCost;
  phaseBreakdown.push({
    id: phase.id, name: phase.name, weeks: phase.weeks,
    cost: phaseCost, onsiteCost: phaseOnsiteCost,
    offshoreCost: phaseOffshoreCost, resources: phaseResources
  });
});

setEstimate({
  projectName, clientName, currency, totalWeeks,
  totalCost, totalOnsiteCost, totalOffshoreCost,
  totalOnsiteHours, totalOffshoreHours, phaseBreakdown,
  resourceSummary: Object.values(resourceSummary),
  onsitePercent: totalCost > 0 ? (totalOnsiteCost / totalCost * 100).toFixed(1) : 0,
  offshorePercent: totalCost > 0 ? (totalOffshoreCost / totalCost * 100).toFixed(1) : 0,
  generatedAt: new Date().toISOString()
});
setActiveTab('results');
```

};

const saveProject = () => {
const project = {
id: Date.now(), name: projectName, clientName,
savedAt: new Date().toISOString(),
data: { projectName, clientName, phases, rates, hoursPerWeek, currency, allocations, enabledResources }
};
const updated = […savedProjects.filter(p => p.name !== projectName), project];
setSavedProjects(updated);
localStorage.setItem('dw_estimator_projects', JSON.stringify(updated));
setShowSaveModal(false);
};

const loadProject = (project) => {
const { data } = project;
setProjectName(data.projectName);
setClientName(data.clientName || '');
setPhases(data.phases);
setRates(data.rates);
setHoursPerWeek(data.hoursPerWeek);
setCurrency(data.currency || 'USD');
setAllocations(data.allocations);
setEnabledResources(data.enabledResources || defaultEnabledResources);
setShowLoadModal(false);
setEstimate(null);
};

const deleteProject = (id) => {
const updated = savedProjects.filter(p => p.id !== id);
setSavedProjects(updated);
localStorage.setItem('dw_estimator_projects', JSON.stringify(updated));
};

const exportToCSV = () => {
if (!estimate) return;
const sym = currencySymbols[currency];
let csv = [
['Data Warehouse Project Estimate'],
['Project Name', estimate.projectName],
…(estimate.clientName ? [['Client', estimate.clientName]] : []),
['Generated', new Date(estimate.generatedAt).toLocaleString()],
[],
['SUMMARY'],
['Total Duration (weeks)', estimate.totalWeeks],
['Total Cost', `${sym}${estimate.totalCost.toLocaleString()}`],
['Onsite Cost', `${sym}${estimate.totalOnsiteCost.toLocaleString()}`, `${estimate.onsitePercent}%`],
['Offshore Cost', `${sym}${estimate.totalOffshoreCost.toLocaleString()}`, `${estimate.offshorePercent}%`],
[],
['PHASE BREAKDOWN'],
['Phase', 'Weeks', 'Onsite Cost', 'Offshore Cost', 'Total Cost'],
…estimate.phaseBreakdown.map(p => [
p.name, p.weeks,
`${sym}${p.onsiteCost.toLocaleString()}`,
`${sym}${p.offshoreCost.toLocaleString()}`,
`${sym}${p.cost.toLocaleString()}`
]),
[],
['RESOURCE BREAKDOWN'],
['Resource', 'Category', 'Onsite Hours', 'Offshore Hours', 'Onsite Cost', 'Offshore Cost', 'Total Cost'],
…estimate.resourceSummary.map(r => [
r.name, r.category, r.onsiteHours, r.offshoreHours,
`${sym}${r.onsiteCost.toLocaleString()}`,
`${sym}${r.offshoreCost.toLocaleString()}`,
`${sym}${(r.onsiteCost + r.offshoreCost).toLocaleString()}`
])
];
const csvContent = csv.map(row => row.map(c => `"${c}"`).join(',')).join('\n');
const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
const link = document.createElement('a');
link.href = URL.createObjectURL(blob);
link.download = `${projectName.replace(/\s+/g, '_')}_Estimate_${new Date().toISOString().split('T')[0]}.csv`;
link.click();
};

const categoryColors = {
Architecture: '#a855f7', ETL: '#22c55e', Reporting: '#3b82f6',
Database: '#f59e0b', Cloud: '#06b6d4', Analysis: '#ec4899',
Testing: '#ef4444', Management: '#8b5cf6', Support: '#64748b'
};

const inp = {
padding: '8px 10px', borderRadius: '6px',
border: '1px solid rgba(255,255,255,0.2)',
background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '0.9rem'
};
const sec = {
background: 'rgba(255,255,255,0.03)', borderRadius: '12px',
padding: '20px', marginBottom: '20px',
border: '1px solid rgba(255,255,255,0.08)'
};
const btn = {
padding: '10px 16px', borderRadius: '6px', border: 'none',
cursor: 'pointer', fontSize: '0.9rem', fontWeight: '500', transition: 'all 0.2s'
};
const tab = (active) => ({
padding: '12px 24px', borderRadius: '8px 8px 0 0', border: 'none',
background: active ? 'rgba(59,130,246,0.2)' : 'transparent',
color: active ? '#3b82f6' : '#94a3b8', cursor: 'pointer',
fontSize: '0.95rem', fontWeight: '500',
borderBottom: active ? '2px solid #3b82f6' : '2px solid transparent'
});

return (
<div style={{
minHeight: '100vh',
background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
padding: '30px 20px',
fontFamily: '-apple-system, BlinkMacSystemFont, “Segoe UI”, Roboto, sans-serif'
}}>
<style>{`@media print { body * { visibility: hidden; } .print-area, .print-area * { visibility: visible; } .print-area { position: absolute; left: 0; top: 0; width: 100%; } .no-print { display: none !important; } }`}</style>

```
  <div style={{ maxWidth: '1500px', margin: '0 auto' }}>
    {/* Header */}
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }} className="no-print">
      <div>
        <h1 style={{ color: '#fff', fontSize: '1.8rem', fontWeight: '700', marginBottom: '4px' }}>
          🏗️ DW Project Cost Estimator
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Data Warehouse & BI Project Estimation Tool</p>
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={() => setShowLoadModal(true)} style={{ ...btn, background: 'rgba(255,255,255,0.1)', color: '#fff' }}>📂 Load</button>
        <button onClick={() => setShowSaveModal(true)} style={{ ...btn, background: 'rgba(34,197,94,0.2)', color: '#22c55e' }}>💾 Save</button>
      </div>
    </div>

    {/* Tabs */}
    <div style={{ display: 'flex', gap: '4px' }} className="no-print">
      {['config', 'allocation', 'results'].map(t => (
        <button key={t} style={tab(activeTab === t)} onClick={() => setActiveTab(t)} disabled={t === 'results' && !estimate}>
          {t === 'config' ? '⚙️ Configuration' : t === 'allocation' ? '👥 Resource Allocation' : `📊 Results${estimate ? ' ✓' : ''}`}
        </button>
      ))}
    </div>

    <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '0 12px 12px 12px', padding: '24px', border: '1px solid rgba(255,255,255,0.08)' }}>

      {/* CONFIG TAB */}
      {activeTab === 'config' && (
        <div className="no-print">
          <div style={sec}>
            <h3 style={{ color: '#e2e8f0', marginBottom: '16px', fontSize: '1rem' }}>📋 Project Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              {[
                { label: 'Project Name *', val: projectName, set: setProjectName, ph: '' },
                { label: 'Client Name', val: clientName, set: setClientName, ph: 'Optional' }
              ].map(({ label, val, set, ph }) => (
                <div key={label}>
                  <label style={{ color: '#94a3b8', fontSize: '0.85rem', display: 'block', marginBottom: '6px' }}>{label}</label>
                  <input type="text" value={val} onChange={e => set(e.target.value)} placeholder={ph} style={{ ...inp, width: '100%' }} />
                </div>
              ))}
              <div>
                <label style={{ color: '#94a3b8', fontSize: '0.85rem', display: 'block', marginBottom: '6px' }}>Hours/Week</label>
                <input type="number" value={hoursPerWeek} onChange={e => setHoursPerWeek(Number(e.target.value))} style={{ ...inp, width: '100%' }} />
              </div>
              <div>
                <label style={{ color: '#94a3b8', fontSize: '0.85rem', display: 'block', marginBottom: '6px' }}>Currency</label>
                <select value={currency} onChange={e => setCurrency(e.target.value)} style={{ ...inp, width: '100%', cursor: 'pointer' }}>
                  {Object.entries(currencySymbols).map(([code, sym]) => (
                    <option key={code} value={code} style={{ background: '#1e293b' }}>{code} ({sym})</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Phases */}
          <div style={sec}>
            <h3 style={{ color: '#e2e8f0', marginBottom: '16px', fontSize: '1rem' }}>📅 Project Phases</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
              {phases.map(phase => (
                <div key={phase.id} style={{
                  padding: '14px', borderRadius: '8px',
                  border: phase.enabled ? '1px solid rgba(59,130,246,0.4)' : '1px solid rgba(255,255,255,0.1)',
                  background: phase.enabled ? 'rgba(59,130,246,0.1)' : 'transparent',
                  opacity: phase.enabled ? 1 : 0.6
                }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input type="checkbox" checked={phase.enabled} onChange={e => updatePhase(phase.id, 'enabled', e.target.checked)} style={{ accentColor: '#3b82f6' }} />
                    <span style={{ color: '#e2e8f0', fontSize: '0.9rem' }}>{phase.name}</span>
                  </label>
                  {phase.enabled && (
                    <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input type="number" value={phase.weeks} onChange={e => updatePhase(phase.id, 'weeks', e.target.value)} min="1" style={{ ...inp, width: '60px', textAlign: 'center' }} />
                      <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>weeks</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div style={{ marginTop: '12px', color: '#64748b', fontSize: '0.8rem' }}>
              Total: {phases.filter(p => p.enabled).reduce((s, p) => s + p.weeks, 0)} weeks
            </div>
          </div>

          {/* Role Selector */}
          <div style={sec}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 style={{ color: '#e2e8f0', fontSize: '1rem', margin: 0 }}>👥 Select Roles</h3>
                <p style={{ color: '#64748b', fontSize: '0.8rem', margin: '4px 0 0' }}>
                  {enabledResources.length} / {allResourceTypes.length} selected
                </p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => setEnabledResources(allResourceTypes.map(r => r.id))} style={{ ...btn, background: 'rgba(34,197,94,0.2)', color: '#22c55e', padding: '6px 12px', fontSize: '0.8rem' }}>All</button>
                <button onClick={() => setEnabledResources([])} style={{ ...btn, background: 'rgba(239,68,68,0.2)', color: '#ef4444', padding: '6px 12px', fontSize: '0.8rem' }}>Clear</button>
                <button onClick={() => setShowResourceSelector(!showResourceSelector)} style={{ ...btn, background: 'rgba(255,255,255,0.1)', color: '#94a3b8', padding: '6px 12px', fontSize: '0.8rem' }}>
                  {showResourceSelector ? '▲ Collapse' : '▼ Expand'}
                </button>
              </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: showResourceSelector ? '16px' : 0 }}>
              {Object.entries(allGroupedResources).map(([cat, res]) => {
                const allOn = res.every(r => enabledResources.includes(r.id));
                const someOn = res.some(r => enabledResources.includes(r.id));
                return (
                  <button key={cat} onClick={() => toggleCategoryResources(cat, !allOn)} style={{
                    padding: '6px 12px', borderRadius: '20px',
                    border: `1px solid ${categoryColors[cat]}40`,
                    background: allOn ? `${categoryColors[cat]}30` : someOn ? `${categoryColors[cat]}15` : 'transparent',
                    color: allOn || someOn ? categoryColors[cat] : '#64748b',
                    cursor: 'pointer', fontSize: '0.8rem', fontWeight: '500'
                  }}>
                    {allOn ? '✓ ' : someOn ? '◐ ' : ''}{cat} ({res.filter(r => enabledResources.includes(r.id)).length}/{res.length})
                  </button>
                );
              })}
            </div>
            {showResourceSelector && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
                {Object.entries(allGroupedResources).map(([cat, res]) => (
                  <div key={cat} style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '8px', padding: '12px', border: `1px solid ${categoryColors[cat]}30` }}>
                    <div style={{ color: categoryColors[cat], fontSize: '0.85rem', fontWeight: '600', marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
                      <span>{cat}</span>
                      <span style={{ fontSize: '0.7rem', background: `${categoryColors[cat]}20`, padding: '2px 6px', borderRadius: '10px' }}>
                        {res.filter(r => enabledResources.includes(r.id)).length}/{res.length}
                      </span>
                    </div>
                    {res.map(r => (
                      <label key={r.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '6px 8px', borderRadius: '4px', background: enabledResources.includes(r.id) ? 'rgba(255,255,255,0.05)' : 'transparent' }}>
                        <input type="checkbox" checked={enabledResources.includes(r.id)} onChange={() => toggleResource(r.id)} style={{ accentColor: categoryColors[cat] }} />
                        <span style={{ color: enabledResources.includes(r.id) ? '#e2e8f0' : '#64748b', fontSize: '0.85rem' }}>{r.name}</span>
                      </label>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Rates */}
          <div style={sec}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ color: '#e2e8f0', fontSize: '1rem', margin: 0 }}>💰 Hourly Rates</h3>
              <button onClick={() => setShowRates(!showRates)} style={{ ...btn, background: 'rgba(255,255,255,0.1)', color: '#94a3b8', padding: '8px 12px' }}>
                {showRates ? '▲ Hide' : '▼ Show'} Rate Editor
              </button>
            </div>
            {showRates && (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      {['Resource', 'Category', `Onsite (${currencySymbols[currency]}/hr)`, `Offshore (${currencySymbols[currency]}/hr)`].map((h, i) => (
                        <th key={h} style={{ color: i === 2 ? '#22c55e' : i === 3 ? '#3b82f6' : '#94a3b8', textAlign: i > 1 ? 'center' : 'left', padding: '10px 8px', fontSize: '0.8rem' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {resourceTypes.map(r => (
                      <tr key={r.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ color: '#cbd5e1', padding: '8px', fontSize: '0.85rem' }}>{r.name}</td>
                        <td style={{ color: categoryColors[r.category], padding: '8px', fontSize: '0.8rem' }}>{r.category}</td>
                        {['onsite', 'offshore'].map(loc => (
                          <td key={loc} style={{ textAlign: 'center', padding: '6px' }}>
                            <input type="number" value={rates[loc][r.id]} onChange={e => updateRate(loc, r.id, e.target.value)} style={{ ...inp, width: '80px', textAlign: 'center' }} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <button onClick={() => setActiveTab('allocation')} disabled={enabledResources.length === 0}
            style={{ ...btn, background: enabledResources.length === 0 ? '#374151' : '#3b82f6', color: '#fff', width: '100%', padding: '14px', cursor: enabledResources.length === 0 ? 'not-allowed' : 'pointer' }}>
            {enabledResources.length === 0 ? 'Please select at least one role' : 'Next: Resource Allocation →'}
          </button>
        </div>
      )}

      {/* ALLOCATION TAB */}
      {activeTab === 'allocation' && (
        <div className="no-print">
          <div style={sec}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <h3 style={{ color: '#e2e8f0', fontSize: '1rem', margin: 0 }}>👥 Resource Allocation Matrix</h3>
              <div style={{ color: '#64748b', fontSize: '0.8rem' }}>{enabledResources.length} roles × {phases.filter(p => p.enabled).length} phases</div>
            </div>
            {resourceTypes.length === 0 ? (
              <p style={{ color: '#64748b', textAlign: 'center', padding: '40px' }}>No roles selected. Go back to Configuration.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
                  <thead>
                    <tr>
                      <th style={{ color: '#94a3b8', textAlign: 'left', padding: '10px 8px', fontSize: '0.8rem', position: 'sticky', left: 0, background: '#1a2536', zIndex: 1, minWidth: '160px' }}>Resource</th>
                      {phases.filter(p => p.enabled).map(phase => (
                        <th key={phase.id} colSpan={2} style={{ color: '#e2e8f0', textAlign: 'center', padding: '10px 4px', fontSize: '0.8rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                          {phase.name}<div style={{ color: '#64748b', fontSize: '0.7rem', fontWeight: 'normal' }}>({phase.weeks}w)</div>
                        </th>
                      ))}
                    </tr>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                      <th style={{ position: 'sticky', left: 0, background: '#1a2536', zIndex: 1 }}></th>
                      {phases.filter(p => p.enabled).flatMap(phase => [
                        <th key={`${phase.id}-on`} style={{ color: '#22c55e', fontSize: '0.7rem', padding: '4px' }}>On</th>,
                        <th key={`${phase.id}-off`} style={{ color: '#3b82f6', fontSize: '0.7rem', padding: '4px' }}>Off</th>
                      ])}
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(groupedResources).map(([cat, res]) => (
                      <>
                        <tr key={`cat-${cat}`}>
                          <td colSpan={1 + phases.filter(p => p.enabled).length * 2}
                            style={{ color: categoryColors[cat], padding: '12px 8px 6px', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', position: 'sticky', left: 0, background: '#1a2536' }}>
                            {cat}
                          </td>
                        </tr>
                        {res.map(resource => (
                          <tr key={resource.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                            <td style={{ color: '#cbd5e1', padding: '6px 8px', fontSize: '0.85rem', position: 'sticky', left: 0, background: '#1a2536', zIndex: 1 }}>{resource.name}</td>
                            {phases.filter(p => p.enabled).flatMap(phase => [
                              <td key={`${phase.id}-${resource.id}-on`} style={{ padding: '4px', textAlign: 'center' }}>
                                <input type="number" min="0" step="0.5" value={allocations[phase.id]?.[resource.id]?.onsite || ''} onChange={e => updateAllocation(phase.id, resource.id, 'onsite', e.target.value)} placeholder="0" style={{ ...inp, width: '50px', padding: '6px', textAlign: 'center' }} />
                              </td>,
                              <td key={`${phase.id}-${resource.id}-off`} style={{ padding: '4px', textAlign: 'center' }}>
                                <input type="number" min="0" step="0.5" value={allocations[phase.id]?.[resource.id]?.offshore || ''} onChange={e => updateAllocation(phase.id, resource.id, 'offshore', e.target.value)} placeholder="0" style={{ ...inp, width: '50px', padding: '6px', textAlign: 'center' }} />
                              </td>
                            ])}
                          </tr>
                        ))}
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div style={{ marginTop: '16px', display: 'flex', gap: '20px', color: '#64748b', fontSize: '0.8rem', flexWrap: 'wrap' }}>
              <span>💡 FTE: 1 = full-time, 0.5 = half-time</span>
              <span>🟢 On = Onsite &nbsp; 🔵 Off = Offshore</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={() => setActiveTab('config')} style={{ ...btn, background: 'rgba(255,255,255,0.1)', color: '#fff', flex: 1, padding: '14px' }}>← Back</button>
            <button onClick={calculateEstimate} style={{ ...btn, background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', color: '#fff', flex: 2, padding: '14px' }}>📊 Calculate Estimate</button>
          </div>
        </div>
      )}

      {/* RESULTS TAB */}
      {activeTab === 'results' && estimate && (
        <div className="print-area">
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }} className="no-print">
            <button onClick={exportToCSV} style={{ ...btn, background: 'rgba(34,197,94,0.2)', color: '#22c55e' }}>📥 Export CSV</button>
            <button onClick={() => window.print()} style={{ ...btn, background: 'rgba(239,68,68,0.2)', color: '#ef4444' }}>📄 Print / PDF</button>
          </div>

          {/* Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            {[
              { label: 'Total Project Cost', val: `${currencySymbols[currency]}${estimate.totalCost.toLocaleString()}`, color: '#fff', size: '2rem', bg: 'rgba(59,130,246,0.2)' },
              { label: `Onsite (${estimate.onsitePercent}%)`, val: `${currencySymbols[currency]}${estimate.totalOnsiteCost.toLocaleString()}`, sub: `${estimate.totalOnsiteHours.toLocaleString()} hrs`, color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
              { label: `Offshore (${estimate.offshorePercent}%)`, val: `${currencySymbols[currency]}${estimate.totalOffshoreCost.toLocaleString()}`, sub: `${estimate.totalOffshoreHours.toLocaleString()} hrs`, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
              { label: 'Duration', val: `${estimate.totalWeeks} weeks`, sub: `~${Math.ceil(estimate.totalWeeks / 4)} months`, color: '#a855f7', bg: 'rgba(168,85,247,0.1)' }
            ].map(({ label, val, sub, color, size, bg }) => (
              <div key={label} style={{ background: bg, borderRadius: '12px', padding: '20px', textAlign: 'center', border: `1px solid ${color}30` }}>
                <div style={{ color, fontSize: '0.85rem' }}>{label}</div>
                <div style={{ color: '#fff', fontSize: size || '1.5rem', fontWeight: size ? '700' : '600' }}>{val}</div>
                {sub && <div style={{ color: '#64748b', fontSize: '0.8rem' }}>{sub}</div>}
              </div>
            ))}
          </div>

          {/* Phase Table */}
          <div style={sec}>
            <h3 style={{ color: '#e2e8f0', marginBottom: '16px', fontSize: '1rem' }}>📅 Cost by Phase</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  {['Phase', 'Weeks', 'Onsite', 'Offshore', 'Total'].map((h, i) => (
                    <th key={h} style={{ color: i === 2 ? '#22c55e' : i === 3 ? '#3b82f6' : i === 4 ? '#fff' : '#94a3b8', textAlign: i === 0 ? 'left' : 'right', padding: '10px 8px', fontSize: '0.85rem' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {estimate.phaseBreakdown.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ color: '#e2e8f0', padding: '10px 8px' }}>{p.name}</td>
                    <td style={{ color: '#94a3b8', textAlign: 'right', padding: '10px 8px' }}>{p.weeks}</td>
                    <td style={{ color: '#22c55e', textAlign: 'right', padding: '10px 8px' }}>{currencySymbols[currency]}{p.onsiteCost.toLocaleString()}</td>
                    <td style={{ color: '#3b82f6', textAlign: 'right', padding: '10px 8px' }}>{currencySymbols[currency]}{p.offshoreCost.toLocaleString()}</td>
                    <td style={{ color: '#fff', textAlign: 'right', padding: '10px 8px', fontWeight: '500' }}>{currencySymbols[currency]}{p.cost.toLocaleString()}</td>
                  </tr>
                ))}
                <tr style={{ borderTop: '2px solid rgba(255,255,255,0.1)', fontWeight: '700' }}>
                  <td style={{ color: '#fff', padding: '12px 8px' }}>TOTAL</td>
                  <td style={{ color: '#fff', textAlign: 'right', padding: '12px 8px' }}>{estimate.totalWeeks}</td>
                  <td style={{ color: '#22c55e', textAlign: 'right', padding: '12px 8px' }}>{currencySymbols[currency]}{estimate.totalOnsiteCost.toLocaleString()}</td>
                  <td style={{ color: '#3b82f6', textAlign: 'right', padding: '12px 8px' }}>{currencySymbols[currency]}{estimate.totalOffshoreCost.toLocaleString()}</td>
                  <td style={{ color: '#fff', textAlign: 'right', padding: '12px 8px' }}>{currencySymbols[currency]}{estimate.totalCost.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Resource Table */}
          {estimate.resourceSummary.length > 0 && (
            <div style={sec}>
              <h3 style={{ color: '#e2e8f0', marginBottom: '16px', fontSize: '1rem' }}>👥 Cost by Resource</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    {['Resource', 'Category', 'Onsite Hrs', 'Offshore Hrs', 'Total Cost'].map((h, i) => (
                      <th key={h} style={{ color: i === 2 ? '#22c55e' : i === 3 ? '#3b82f6' : '#94a3b8', textAlign: i < 2 ? 'left' : 'right', padding: '10px 8px', fontSize: '0.85rem' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {estimate.resourceSummary.map(r => (
                    <tr key={r.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ color: '#e2e8f0', padding: '8px' }}>{r.name}</td>
                      <td style={{ color: categoryColors[r.category], padding: '8px', fontSize: '0.85rem' }}>{r.category}</td>
                      <td style={{ color: '#22c55e', textAlign: 'right', padding: '8px' }}>{r.onsiteHours.toLocaleString()}</td>
                      <td style={{ color: '#3b82f6', textAlign: 'right', padding: '8px' }}>{r.offshoreHours.toLocaleString()}</td>
                      <td style={{ color: '#fff', textAlign: 'right', padding: '8px', fontWeight: '500' }}>{currencySymbols[currency]}{(r.onsiteCost + r.offshoreCost).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div style={{ textAlign: 'center', color: '#64748b', fontSize: '0.8rem', marginTop: '20px' }}>
            Generated on {new Date(estimate.generatedAt).toLocaleString()}
          </div>
        </div>
      )}
    </div>
  </div>

  {/* Save Modal */}
  {showSaveModal && (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
      <div style={{ background: '#1e293b', borderRadius: '12px', padding: '24px', width: '400px', maxWidth: '90%' }}>
        <h3 style={{ color: '#fff', marginBottom: '16px' }}>💾 Save Project</h3>
        <p style={{ color: '#94a3b8', marginBottom: '16px', fontSize: '0.9rem' }}>Save as: <strong style={{ color: '#fff' }}>{projectName}</strong></p>
        {savedProjects.some(p => p.name === projectName) && (
          <p style={{ color: '#f59e0b', fontSize: '0.85rem', marginBottom: '16px' }}>⚠️ This will overwrite the existing project.</p>
        )}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => setShowSaveModal(false)} style={{ ...btn, background: 'rgba(255,255,255,0.1)', color: '#fff', flex: 1 }}>Cancel</button>
          <button onClick={saveProject} style={{ ...btn, background: '#22c55e', color: '#fff', flex: 1 }}>Save</button>
        </div>
      </div>
    </div>
  )}

  {/* Load Modal */}
  {showLoadModal && (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
      <div style={{ background: '#1e293b', borderRadius: '12px', padding: '24px', width: '500px', maxWidth: '90%', maxHeight: '80vh', overflow: 'auto' }}>
        <h3 style={{ color: '#fff', marginBottom: '16px' }}>📂 Load Project</h3>
        {savedProjects.length === 0 ? (
          <p style={{ color: '#94a3b8', textAlign: 'center', padding: '20px' }}>No saved projects yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {savedProjects.map(project => (
              <div key={project.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                <div>
                  <div style={{ color: '#fff', fontWeight: '500' }}>{project.name}</div>
                  <div style={{ color: '#64748b', fontSize: '0.8rem' }}>{project.clientName && `${project.clientName} • `}Saved {new Date(project.savedAt).toLocaleDateString()}</div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => loadProject(project)} style={{ ...btn, background: '#3b82f6', color: '#fff', padding: '6px 12px' }}>Load</button>
                  <button onClick={() => deleteProject(project.id)} style={{ ...btn, background: 'rgba(239,68,68,0.2)', color: '#ef4444', padding: '6px 12px' }}>🗑️</button>
                </div>
              </div>
            ))}
          </div>
        )}
        <button onClick={() => setShowLoadModal(false)} style={{ ...btn, background: 'rgba(255,255,255,0.1)', color: '#fff', width: '100%', marginTop: '16px' }}>Close</button>
      </div>
    </div>
  )}
</div>
```

);
}
