import React, { useState } from 'react';

const BankersAlgo = () => {
    const [numProcesses, setNumProcesses] = useState(5);
    const [numResources, setNumResources] = useState(3);

    // Initial state for 5 processes and 3 resources (P0-P4, A-C)
    const [allocation, setAllocation] = useState([
        [0, 1, 0], // P0
        [2, 0, 0], // P1
        [3, 0, 2], // P2
        [2, 1, 1], // P3
        [0, 0, 2]  // P4
    ]);

    const [max, setMax] = useState([
        [7, 5, 3], // P0
        [3, 2, 2], // P1
        [9, 0, 2], // P2
        [2, 2, 2], // P3
        [4, 3, 3]  // P4
    ]);

    const [available, setAvailable] = useState([3, 3, 2]);
    const [result, setResult] = useState(null);
    const [log, setLog] = useState([]);

    const handleMatrixChange = (r, c, val, type) => {
        // Allow empty string or number
        const newVal = val === '' ? '' : parseInt(val);

        if (type === 'allocation') {
            const newAlloc = [...allocation];
            newAlloc[r][c] = newVal;
            setAllocation(newAlloc);
        } else {
            const newMax = [...max];
            newMax[r][c] = newVal;
            setMax(newMax);
        }
    };

    const handleAvailableChange = (c, val) => {
        const newVal = val === '' ? '' : parseInt(val);
        const newAvail = [...available];
        newAvail[c] = newVal;
        setAvailable(newAvail);
    };

    const updateDimensions = (p, r) => {
        // Allow empty string for better typing experience
        const newP = p === '' ? '' : parseInt(p);
        const newR = r === '' ? '' : parseInt(r);

        setNumProcesses(newP);
        setNumResources(newR);

        // Only resize if we have valid numbers
        if (typeof newP === 'number' && typeof newR === 'number') {
            const pCount = Math.max(0, newP);
            const rCount = Math.max(0, newR);

            // Resize matrices while preserving existing data where possible
            setAllocation(Array(pCount).fill(0).map((_, i) =>
                Array(rCount).fill(0).map((_, j) => (allocation[i] && allocation[i][j] !== undefined) ? allocation[i][j] : 0)
            ));
            setMax(Array(pCount).fill(0).map((_, i) =>
                Array(rCount).fill(0).map((_, j) => (max[i] && max[i][j] !== undefined) ? max[i][j] : 0)
            ));
            setAvailable(Array(rCount).fill(0).map((_, j) => available[j] !== undefined ? available[j] : 0));
            setResult(null);
            setLog([]);
        }
    };

    const runSafetyAlgorithm = () => {
        // Parse values strictly as numbers for calculation (treat empty as 0)
        const parseVal = (v) => (v === '' || isNaN(v)) ? 0 : v;

        const safeAllocation = allocation.map(row => row.map(parseVal));
        const safeMax = max.map(row => row.map(parseVal));
        const safeAvailable = available.map(parseVal);

        // Use current dimensions or defaults if invalid
        const pCount = safeAllocation.length;
        const rCount = safeAvailable.length;

        if (pCount === 0 || rCount === 0) {
            setResult({ error: "Please enter valid dimensions." });
            return;
        }

        let work = [...safeAvailable];
        let finish = Array(pCount).fill(false);
        let safeSeq = [];
        let processLog = [];
        let need = safeMax.map((row, i) => row.map((val, j) => val - safeAllocation[i][j]));

        // Check for negative needs (Allocation > Max)
        for (let i = 0; i < pCount; i++) {
            for (let j = 0; j < rCount; j++) {
                if (need[i][j] < 0) {
                    setResult({ error: `Error: Process P${i} has Allocation > Max for Resource ${String.fromCharCode(65 + j)}` });
                    return;
                }
            }
        }

        let count = 0;
        while (count < pCount) {
            let found = false;
            for (let p = 0; p < pCount; p++) {
                if (!finish[p]) {
                    let canAllocate = true;
                    for (let j = 0; j < rCount; j++) {
                        if (need[p][j] > work[j]) {
                            canAllocate = false;
                            break;
                        }
                    }

                    if (canAllocate) {
                        for (let j = 0; j < rCount; j++) {
                            work[j] += safeAllocation[p][j];
                        }
                        safeSeq.push(`P${p}`);
                        finish[p] = true;
                        found = true;
                        count++;
                        processLog.push(`P${p} executed. New Available: [${work.join(', ')}]`);
                    }
                }
            }
            if (!found) {
                setResult({ safe: false, sequence: [] });
                setLog(processLog);
                return;
            }
        }

        setResult({ safe: true, sequence: safeSeq });
        setLog(processLog);
    };

    return (
        <div className="glass-panel" style={{ padding: '4rem 2rem', marginTop: '4rem' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>OS Resource Allocation (Banker's Algorithm)</h2>

            <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-color)', opacity: 0.6 }}>Processes</label>
                    <input
                        type="number"
                        value={numProcesses}
                        onChange={(e) => updateDimensions(e.target.value, numResources)}
                        className="glass-input"
                        style={{ width: '80px' }}
                        min="0"
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-color)', opacity: 0.6 }}>Resources</label>
                    <input
                        type="number"
                        value={numResources}
                        onChange={(e) => updateDimensions(numProcesses, e.target.value)}
                        className="glass-input"
                        style={{ width: '80px' }}
                        min="0"
                    />
                </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr 1fr', gap: '2rem', minWidth: '800px' }}>

                    {/* Allocation Matrix */}
                    <div>
                        <h4 style={{ marginBottom: '1rem', color: 'var(--secondary-color)' }}>Allocation</h4>
                        <table style={{ borderCollapse: 'collapse' }}>
                            <thead>
                                <tr>
                                    <th></th>
                                    {Array(typeof numResources === 'number' ? numResources : 0).fill(0).map((_, i) => (
                                        <th key={i} style={{ padding: '0.5rem', color: 'var(--text-color)', opacity: 0.5 }}>{String.fromCharCode(65 + i)}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {allocation.map((row, i) => (
                                    <tr key={i}>
                                        <td style={{ padding: '0.5rem', color: 'var(--text-color)', opacity: 0.5 }}>P{i}</td>
                                        {row.map((val, j) => (
                                            <td key={j} style={{ padding: '0.25rem' }}>
                                                <input
                                                    type="number"
                                                    value={val}
                                                    onChange={(e) => handleMatrixChange(i, j, e.target.value, 'allocation')}
                                                    className="glass-input"
                                                />
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Max Matrix */}
                    <div>
                        <h4 style={{ marginBottom: '1rem', color: 'var(--primary-color)' }}>Max</h4>
                        <table style={{ borderCollapse: 'collapse' }}>
                            <thead>
                                <tr>
                                    <th></th>
                                    {Array(typeof numResources === 'number' ? numResources : 0).fill(0).map((_, i) => (
                                        <th key={i} style={{ padding: '0.5rem', color: 'var(--text-color)', opacity: 0.5 }}>{String.fromCharCode(65 + i)}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {max.map((row, i) => (
                                    <tr key={i}>
                                        <td style={{ padding: '0.5rem', color: 'var(--text-color)', opacity: 0.5 }}>P{i}</td>
                                        {row.map((val, j) => (
                                            <td key={j} style={{ padding: '0.25rem' }}>
                                                <input
                                                    type="number"
                                                    value={val}
                                                    onChange={(e) => handleMatrixChange(i, j, e.target.value, 'max')}
                                                    className="glass-input"
                                                />
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Available Vector */}
                    <div>
                        <h4 style={{ marginBottom: '1rem', color: 'var(--accent-color)' }}>Available</h4>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {available.map((val, i) => (
                                <div key={i} style={{ textAlign: 'center' }}>
                                    <div style={{ marginBottom: '0.5rem', color: 'var(--text-color)', opacity: 0.5 }}>{String.fromCharCode(65 + i)}</div>
                                    <input
                                        type="number"
                                        value={val}
                                        onChange={(e) => handleAvailableChange(i, e.target.value)}
                                        className="glass-input"
                                    />
                                </div>
                            ))}
                        </div>

                        <button
                            className="btn-primary"
                            onClick={runSafetyAlgorithm}
                            style={{ marginTop: '2rem', width: '100%' }}
                        >
                            Check Safety
                        </button>
                    </div>
                </div>
            </div>

            {/* Results */}
            {result && (
                <div style={{ marginTop: '2rem', padding: '1.5rem', background: result.safe ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', borderRadius: '0.5rem', border: `1px solid ${result.safe ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}` }}>
                    {result.error ? (
                        <h3 style={{ color: '#ef4444' }}>{result.error}</h3>
                    ) : result.safe ? (
                        <>
                            <h3 style={{ color: '#10b981', marginBottom: '0.5rem' }}>System is in a SAFE state</h3>
                            <p style={{ fontSize: '1.1rem' }}>Safe Sequence: <span style={{ fontWeight: 'bold', color: 'var(--text-color)' }}>{result.sequence.join(' → ')}</span></p>
                        </>
                    ) : (
                        <h3 style={{ color: '#ef4444' }}>System is in an UNSAFE state (Deadlock possible)</h3>
                    )}
                </div>
            )}
        </div>
    );
};

export default BankersAlgo;
