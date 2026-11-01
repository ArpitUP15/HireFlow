export default function InterviewScorecard({
  scores = {},
  onChange,
  readOnly = false,
}) {
  return (
    <fieldset className="portal-form-grid">
      <legend>Interview scorecard (0 to 10)</legend>
      {["dsa", "react", "node", "communication"].map((key) => (
        <label key={key}>
          {key}
          <input
            type="number"
            min="0"
            max="10"
            step="0.5"
            value={scores[key] ?? ""}
            readOnly={readOnly}
            onChange={(e) =>
              onChange?.({
                ...scores,
                [key]:
                  e.target.value === "" ? undefined : Number(e.target.value),
              })
            }
          />
        </label>
      ))}
    </fieldset>
  );
}
