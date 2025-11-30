const runSafetyAlgorithm = () => {
  const parseVal = (v) => (v === "" || isNaN(v) ? 0 : v);

  const safeAllocation = allocation.map((r) => r.map(parseVal));
  const safeMax = max.map((r) => r.map(parseVal));
  const safeAvailable = available.map(parseVal);

  const pCount = safeAllocation.length;
  const rCount = safeAvailable.length;

  let work = [...safeAvailable];
  let finish = Array(pCount).fill(false);
  let safeSeq = [];

  const need = safeMax.map((row, i) =>
    row.map((val, j) => val - safeAllocation[i][j])
  );

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

          finish[p] = true;
          safeSeq.push(`P${p}`);
          count++;
          found = true;
        }
      }
    }

    if (!found) {
      return { safe: false };
    }
  }

  return { safe: true, sequence: safeSeq };
};
