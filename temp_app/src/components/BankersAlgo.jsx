import React, { useState } from "react";

const BankersAlgo = React.forwardRef(() => {
  const [numProcesses, setNumProcesses] = useState(1);
  const [numResources, setNumResources] = useState(1);

  const [allocation, setAllocation] = useState([[0]]);
  const [max, setMax] = useState([[0]]);
  const [available, setAvailable] = useState([0]);
  const [result, setResult] = useState(null);
  const [processDetails, setProcessDetails] = useState([]);
  const [logW, setLogW] = useState([]);

  const handleMatrixChange = (r, c, val, type) => {
    const newVal = val === "" ? "" : parseInt(val);

    if (type === "allocation") {
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
    const newVal = val === "" ? "" : parseInt(val);
    const newAvail = [...available];
    newAvail[c] = newVal;
    setAvailable(newAvail);
  };

  const updateDimensions = (p, r) => {
    const newP = p === "" ? "" : parseInt(p);
    const newR = r === "" ? "" : parseInt(r);

    const limitedR = typeof newR === "number" ? Math.min(newR, 5) : newR;

    setNumProcesses(newP);
    setNumResources(limitedR);

    if (typeof newP === "number" && typeof limitedR === "number") {
      const pCount = Math.max(1, newP);
      const rCount = Math.max(1, limitedR);

      setAllocation(
        Array(pCount)
          .fill(0)
          .map((_, i) =>
            Array(rCount)
              .fill(0)
              .map((_, j) =>
                allocation[i] && allocation[i][j] !== undefined
                  ? allocation[i][j]
                  : 0
              )
          )
      );
      setMax(
        Array(pCount)
          .fill(0)
          .map((_, i) =>
            Array(rCount)
              .fill(0)
              .map((_, j) =>
                max[i] && max[i][j] !== undefined ? max[i][j] : 0
              )
          )
      );
      setAvailable(
        Array(rCount)
          .fill(0)
          .map((_, j) => (available[j] !== undefined ? available[j] : 0))
      );
      setResult(null);
      setProcessDetails([]);
    }
  };

  const runSafetyAlgorithm = () => {
    const parseVal = (v) => (v === "" || isNaN(v) ? 0 : v);

    const safeAllocation = allocation.map((row) => row.map(parseVal));
    const safeMax = max.map((row) => row.map(parseVal));
    const safeAvailable = available.map(parseVal);

    const pCount = safeAllocation.length;
    const rCount = safeAvailable.length;

    if (pCount === 0 || rCount === 0) {
      setResult({ error: "Please enter valid dimensions." });
      return;
    }

    let work = [...safeAvailable];
    let finish = Array(pCount).fill(false);
    let safeSeq = [];
    let need = safeMax.map((row, i) =>
      row.map((val, j) => val - safeAllocation[i][j])
    );

    for (let i = 0; i < pCount; i++) {
      for (let j = 0; j < rCount; j++) {
        if (need[i][j] < 0) {
          setResult({
            error: `Error: Process P${i} has Allocation > Max for Resource ${String.fromCharCode(
              65 + j
            )}`,
          });
          return;
        }
      }
    }

    let details = [];
    let count = 0;
    let processedSet = new Set();

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
            let processInfo = {
              process: `P${p}`,
              resources: [],
            };

            for (let j = 0; j < rCount; j++) {
              processInfo.resources.push({
                instance: String.fromCharCode(65 + j),
                need: need[p][j],
                available: work[j],
                finish: true,
              });
              work[j] += safeAllocation[p][j];
            }

            details.push(processInfo);
            safeSeq.push(`P${p}`);
            finish[p] = true;
            found = true;
            count++;
            processedSet.add(p);
          }
        }
      }

      if (!found) {
        for (let p = 0; p < pCount; p++) {
          if (!finish[p] && !processedSet.has(p)) {
            let processInfo = {
              process: `P${p}`,
              resources: [],
            };

            for (let j = 0; j < rCount; j++) {
              processInfo.resources.push({
                instance: String.fromCharCode(65 + j),
                need: need[p][j],
                available: work[j],
                finish: false,
              });

              if (need[p][j] > work[j]) break;
            }

            details.push(processInfo);
            processedSet.add(p);
          }
        }

        setResult({ safe: false, sequence: [] });
        setProcessDetails(details);
        return;
      }
    }

    setResult({ safe: true, sequence: safeSeq });
    setProcessDetails(details);
    setLogW(work);
  };

  return (
    <div
      className="glass-panel"
      style={{ padding: "4rem 2rem", marginTop: "4rem" }}
    >
      <h2 style={{ marginBottom: "1.5rem" }}>
        OS Resource Allocation (Banker's Algorithm)
      </h2>

      <div style={{ display: "flex", gap: "2rem", marginBottom: "2rem" }}>
        <div>
          <label
            style={{
              display: "block",
              marginBottom: "0.5rem",
              color: "var(--text-color)",
              opacity: 0.6,
            }}
          >
            Processes
          </label>
          <input
            type="number"
            value={numProcesses}
            onChange={(e) => updateDimensions(e.target.value, numResources)}
            className="glass-input"
            style={{ width: "80px" }}
            min="1"
          />
        </div>
        <div>
          <label
            style={{
              display: "block",
              marginBottom: "0.5rem",
              color: "var(--text-color)",
              opacity: 0.6,
            }}
          >
            Instances
          </label>
          <input
            type="number"
            value={numResources}
            onChange={(e) => updateDimensions(numProcesses, e.target.value)}
            className="glass-input"
            style={{ width: "80px" }}
            min="1"
            max="5"
          />
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "2rem",
            minWidth: "800px",
          }}
        >
          <div>
            <h4
              style={{ marginBottom: "1rem", color: "var(--secondary-color)" }}
            >
              Allocation
            </h4>
            <table style={{ borderCollapse: "collapse", width: "100%" }}>
              <thead>
                <tr>
                  <th style={{ width: "60px" }}></th>
                  {Array(typeof numResources === "number" ? numResources : 0)
                    .fill(0)
                    .map((_, i) => (
                      <th
                        key={i}
                        style={{
                          padding: "0.5rem",
                          color: "var(--text-color)",
                          opacity: 0.5,
                        }}
                      >
                        {String.fromCharCode(65 + i)}
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {allocation.map((row, i) => (
                  <tr key={i}>
                    <td
                      style={{
                        padding: "0.5rem",
                        color: "var(--text-color)",
                        opacity: 0.5,
                      }}
                    >
                      P{i}
                    </td>
                    {row.map((val, j) => (
                      <td key={j} style={{ padding: "0.25rem" }}>
                        <input
                          type="number"
                          value={val}
                          onChange={(e) =>
                            handleMatrixChange(
                              i,
                              j,
                              e.target.value,
                              "allocation"
                            )
                          }
                          className="glass-input"
                          style={{ width: "100%" }}
                          min="0"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div>
            <h4 style={{ marginBottom: "1rem", color: "var(--primary-color)" }}>
              Max
            </h4>
            <table style={{ borderCollapse: "collapse", width: "100%" }}>
              <thead>
                <tr>
                  <th style={{ width: "60px" }}></th>
                  {Array(typeof numResources === "number" ? numResources : 0)
                    .fill(0)
                    .map((_, i) => (
                      <th
                        key={i}
                        style={{
                          padding: "0.5rem",
                          color: "var(--text-color)",
                          opacity: 0.5,
                        }}
                      >
                        {String.fromCharCode(65 + i)}
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {max.map((row, i) => (
                  <tr key={i}>
                    <td
                      style={{
                        padding: "0.5rem",
                        color: "var(--text-color)",
                        opacity: 0.5,
                      }}
                    >
                      P{i}
                    </td>
                    {row.map((val, j) => (
                      <td key={j} style={{ padding: "0.25rem" }}>
                        <input
                          type="number"
                          value={val}
                          onChange={(e) =>
                            handleMatrixChange(i, j, e.target.value, "max")
                          }
                          className="glass-input"
                          style={{ width: "100%" }}
                          min="0"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "100%",
            }}
          >
            <div>
              <h4
                style={{ marginBottom: "1rem", color: "var(--accent-color)" }}
              >
                Available
              </h4>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${
                    typeof numResources === "number" ? numResources : 1
                  }, 1fr)`,
                  gap: "0.5rem",
                }}
              >
                {available.map((val, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        padding: "0.5rem",
                        color: "var(--text-color)",
                        opacity: 0.5,
                        fontWeight: "bold",
                      }}
                    >
                      {String.fromCharCode(65 + i)}
                    </div>

                    <div style={{ padding: "0.25rem", width: "100%" }}>
                      <input
                        type="number"
                        value={val}
                        onChange={(e) =>
                          handleAvailableChange(i, e.target.value)
                        }
                        className="glass-input"
                        style={{ width: "100%" }}
                        min="0"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              className="btn-primary"
              onClick={runSafetyAlgorithm}
              style={{
                marginTop: "2rem",
                width: "100%",
                alignSelf: "flex-end",
              }}
            >
              Check Safety
            </button>
          </div>
        </div>
      </div>

      {result && (
        <div
          style={{
            marginTop: "2rem",
            padding: "1.5rem",
            background: result.safe
              ? "rgba(16, 185, 129, 0.1)"
              : "rgba(239, 68, 68, 0.1)",
            borderRadius: "0.5rem",
            border: `1px solid ${
              result.safe ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.3)"
            }`,
          }}
        >
          {result.error ? (
            <h3 style={{ color: "#ef4444" }}>{result.error}</h3>
          ) : (
            <>
              <h3
                style={{
                  color: result.safe ? "#10b981" : "#ef4444",
                  marginBottom: "1rem",
                }}
              >
                {result.safe
                  ? "System is in a SAFE state"
                  : "System is in an UNSAFE state (Deadlock possible)"}
              </h3>

              <h4 style={{ marginBottom: "1rem" }}>Process Details</h4>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(auto-fit, minmax(280px, 1fr))`,
                  gap: "1rem",
                  overflowX: "auto",
                }}
              >
                {processDetails.map((proc, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: "1rem",
                      borderRadius: "0.5rem",
                      border: "1px solid var(--glass-border)",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: "bold",
                        marginBottom: "0.75rem",
                        color: "var(--text-color)",
                        fontSize: "1.1rem",
                      }}
                    >
                      ● {proc.process}
                    </div>

                    <div
                      style={{
                        fontSize: "0.9rem",
                        lineHeight: "1.6",
                        color: "var(--text-color)",
                      }}
                    >
                      {proc.resources.map((res, resIdx) => (
                        <div
                          key={resIdx}
                          style={{
                            marginBottom: "0.5rem",
                            padding: "0.5rem",
                            background: res.finish
                              ? "rgba(16, 185, 129, 0.05)"
                              : "rgba(239, 68, 68, 0.05)",
                            borderRadius: "0.25rem",
                            borderLeft: `3px solid ${
                              res.finish ? "#10b981" : "#ef4444"
                            }`,
                          }}
                        >
                          <span style={{ fontWeight: "500" }}>
                            {res.instance}
                          </span>{" "}
                          → Need: {res.need}, Available: {res.available},
                          Finish:{" "}
                          <span
                            style={{
                              fontWeight: "bold",
                              color: res.finish ? "#10b981" : "#ef4444",
                            }}
                          >
                            {res.finish ? "T" : "F"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {result.safe && (
                <>
                  <h4 style={{ marginBottom: "0.75rem", marginTop: "2rem" }}>
                    Final Available Instances
                  </h4>
                  <div
                    style={{
                      display: "flex",
                      gap: "1rem",
                      flexWrap: "wrap",
                    }}
                  >
                    {logW.map((val, i) => (
                      <div
                        key={i}
                        style={{
                          background: "rgba(16, 185, 129, 0.1)",
                          border: "1px solid rgba(16, 185, 129, 0.3)",
                          borderRadius: "0.5rem",
                          padding: "0.5rem 1rem",
                          fontWeight: "500",
                          minWidth: "100px",
                          textAlign: "center",
                        }}
                      >
                        {String.fromCharCode(65 + i)}: {val}
                      </div>
                    ))}
                  </div>

                  <p style={{ fontWeight: "bold", marginTop: "2rem" }}>
                    Safe Sequence{" "}
                    <p
                      style={{ marginTop: '0.5rem',fontWeight: "400", color: "var(--text-color)" }}

                    >
                      {result.sequence.join(" → ")}
                    </p>
                  </p>
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
});

export default BankersAlgo;
