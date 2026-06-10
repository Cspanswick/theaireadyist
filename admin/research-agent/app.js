/**
 * Research News Agent Control Centre — app.js
 * Handles: schedule toggle, payload generation, localStorage, JSON export
 */

// =====================================================
// SCHEDULE MODE TOGGLE
// =====================================================

/**
 * Switch between "frequency" and "specific date" scheduling modes.
 * Shows/hides the relevant input fields and updates toggle button state.
 * @param {string} mode - 'frequency' or 'specific'
 */
function setScheduleMode(mode) {
  const freqOptions  = document.getElementById('frequency-options');
  const specOptions  = document.getElementById('specific-options');
  const btnFreq      = document.getElementById('btn-frequency');
  const btnSpec      = document.getElementById('btn-specific');

  if (mode === 'frequency') {
    freqOptions.classList.remove('hidden');
    specOptions.classList.add('hidden');
    btnFreq.classList.add('active');
    btnFreq.setAttribute('aria-pressed', 'true');
    btnSpec.classList.remove('active');
    btnSpec.setAttribute('aria-pressed', 'false');
  } else {
    freqOptions.classList.add('hidden');
    specOptions.classList.remove('hidden');
    btnSpec.classList.add('active');
    btnSpec.setAttribute('aria-pressed', 'true');
    btnFreq.classList.remove('active');
    btnFreq.setAttribute('aria-pressed', 'false');
  }
}

// =====================================================
// READ FORM VALUES
// =====================================================

/**
 * Determine the current active schedule mode.
 * @returns {string} 'frequency' or 'specific'
 */
function getScheduleMode() {
  return document.getElementById('btn-frequency').classList.contains('active')
    ? 'frequency'
    : 'specific';
}

/**
 * Read all checked values from a checkbox group container.
 * @param {string} id - container element ID
 * @returns {string[]}
 */
function getMultiSelect(id) {
  return Array.from(document.querySelectorAll('#' + CSS.escape(id) + ' input[type="checkbox"]:checked'))
    .map(cb => cb.value);
}

/**
 * Collect all checked checkbox values within a container.
 * @param {string[]} ids - array of checkbox element IDs
 * @returns {string[]}
 */
function getCheckedValues(ids) {
  return ids
    .map(id => document.getElementById(id))
    .filter(el => el && el.checked)
    .map(el => el.value);
}

/**
 * Build the full configuration payload from the current form state.
 * @returns {Object} structured agent configuration
 */
function buildPayload() {
  const mode = getScheduleMode();

  const schedule = {
    mode,
    preferredRunTime: document.getElementById('run-time').value || '08:00'
  };

  if (mode === 'frequency') {
    schedule.frequencyAmount = parseInt(document.getElementById('freq-amount').value, 10) || 1;
    schedule.frequencyUnit   = document.getElementById('freq-unit').value;
    schedule.specificDate    = '';
  } else {
    schedule.frequencyAmount = null;
    schedule.frequencyUnit   = null;
    schedule.specificDate    = document.getElementById('run-date').value;
  }

  const sourcePreferenceIds = [
    'src-official', 'src-regulators', 'src-analysts',
    'src-trade', 'src-vendor', 'src-academic'
  ];

  const guardrailIds = [
    'gr-citations', 'gr-separate', 'gr-flag',
    'gr-approval', 'gr-record', 'gr-confidence'
  ];

  const payload = {
    agentName: 'Market News Research Agent',
    businessOutcome: 'Produce scheduled, evidence-led market news and research briefs on a selected subject.',
    topic:       document.getElementById('topic').value.trim(),
    marketFocus: getMultiSelect('market-focus'),
    region:      getMultiSelect('region'),
    schedule,
    output: {
      documentLengthWords: parseInt(document.getElementById('doc-length').value, 10),
      outputFormat:        document.getElementById('output-format').value,
      tone:                document.getElementById('tone').value
    },
    sourcePreferences: {
      preferredSourceTypes: getCheckedValues(sourcePreferenceIds),
      excludedSources:      document.getElementById('excluded-sources').value.trim()
    },
    guardrails: getCheckedValues(guardrailIds),
    workflow: [
      {
        step:   1,
        agent:  'Research Agent',
        action: 'Search recent, credible public sources for the selected topic, sector and region.',
        output: 'Research document with source register and confidence levels.'
      },
      {
        step:   2,
        agent:  'Synthesis Agent',
        action: 'Group findings into themes, identify implications, and flag weak or conflicting evidence.',
        output: 'Executive-ready synthesis brief.'
      },
      {
        step:   3,
        agent:  'Publishing Preparation Agent',
        action: 'Prepare article-ready copy only when requested.',
        output: 'Draft title, excerpt, body copy, tags, metadata and publishing checklist.'
      }
    ],
    approvalRequiredFor: [
      'Publishing to a website or CMS',
      'Sending by email',
      'Posting to social media',
      'Changing external records',
      'Using weak evidence for strong claims'
    ],
    auditTrail: [
      'Original configuration',
      'Run timestamp',
      'Search queries used',
      'Sources found',
      'Sources excluded',
      'Confidence level for each finding',
      'Human approval status'
    ],
    generatedAt: new Date().toISOString()
  };

  return payload;
}

// =====================================================
// GENERATE BRIEF
// =====================================================

/**
 * Generate the agent brief from the current form state and render it in the preview panel.
 */
function generateBrief() {
  const payload    = buildPayload();
  const jsonString = JSON.stringify(payload, null, 2);
  const highlighted = syntaxHighlight(jsonString);

  // Render in preview
  const previewBody   = document.getElementById('preview-body');
  const previewStatus = document.getElementById('preview-status');

  previewBody.innerHTML = `<pre class="json-output">${highlighted}</pre>`;
  previewStatus.textContent = 'Generated';
  previewStatus.classList.add('ready');

  // Enable export
  document.getElementById('btn-export').disabled = false;

  // Store payload globally for export
  window._currentPayload = payload;

  showMessage('Agent brief generated successfully.', 'success');
}

// =====================================================
// SYNTAX HIGHLIGHTING
// =====================================================

/**
 * Apply basic JSON syntax highlighting by wrapping tokens in <span> tags.
 * @param {string} json - JSON string
 * @returns {string} HTML string with spans
 */
function syntaxHighlight(json) {
  // Escape HTML entities first
  json = json
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    function (match) {
      let cls = 'json-number';
      if (/^"/.test(match)) {
        cls = /:$/.test(match) ? 'json-key' : 'json-string';
      } else if (/true|false/.test(match)) {
        cls = 'json-bool';
      } else if (/null/.test(match)) {
        cls = 'json-null';
      }
      return `<span class="${cls}">${match}</span>`;
    }
  );
}

// =====================================================
// SAVE / LOAD / RESET
// =====================================================

const STORAGE_KEY = 'researchAgentConfig_v1';

/**
 * Serialize current form state to localStorage.
 */
function saveConfig() {
  const config = readFormState();
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    showMessage('Configuration saved.', 'success');
  } catch (e) {
    showMessage('Save failed — localStorage may be unavailable.', 'error');
  }
}

/**
 * Restore form state from localStorage.
 */
function loadConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      showMessage('No saved configuration found.', 'info');
      return;
    }
    const config = JSON.parse(raw);
    applyFormState(config);
    showMessage('Configuration loaded.', 'success');
  } catch (e) {
    showMessage('Load failed — saved data may be corrupted.', 'error');
  }
}

/**
 * Clear localStorage and reset all form fields to defaults.
 */
function resetForm() {
  if (!confirm('Reset all fields to defaults and clear saved configuration?')) return;

  localStorage.removeItem(STORAGE_KEY);
  window._currentPayload = null;

  // Reset fields
  setScheduleMode('frequency');
  document.getElementById('freq-amount').value  = '1';
  document.getElementById('freq-unit').value    = 'week';
  document.getElementById('run-date').value     = '';
  document.getElementById('run-time').value     = '08:00';
  document.getElementById('doc-length').value   = '1000';
  document.getElementById('topic').value        = '';
  document.getElementById('output-format').value = 'executive-brief';
  document.getElementById('tone').value         = 'Executive';
  document.getElementById('excluded-sources').value = '';

  // Clear multi-selects
  clearMultiSelect('market-focus');
  clearMultiSelect('region');

  // Reset source checkboxes (uncheck all)
  ['src-official','src-regulators','src-analysts','src-trade','src-vendor','src-academic']
    .forEach(id => { document.getElementById(id).checked = false; });

  // Reset guardrails to all checked
  ['gr-citations','gr-separate','gr-flag','gr-approval','gr-record','gr-confidence']
    .forEach(id => { document.getElementById(id).checked = true; });

  // Reset preview
  document.getElementById('preview-body').innerHTML = `
    <div class="preview-empty">
      <div class="preview-empty-icon">◎</div>
      <p>Configure the agent and click <strong>Generate Agent Brief</strong> to produce the configuration payload.</p>
      <p class="preview-empty-sub">The JSON will appear here and can be exported for backend integration.</p>
    </div>`;
  document.getElementById('preview-status').textContent = 'Awaiting generation';
  document.getElementById('preview-status').classList.remove('ready');
  document.getElementById('btn-export').disabled = true;

  showMessage('Form reset to defaults.', 'info');
}

/**
 * Deselect all options in a multi-select element.
 * @param {string} id
 */
function clearMultiSelect(id) {
  document.querySelectorAll('#' + CSS.escape(id) + ' input[type="checkbox"]')
    .forEach(cb => { cb.checked = false; });
}

// =====================================================
// FORM STATE SERIALISATION
// =====================================================

/**
 * Read the current form state into a plain object for storage.
 * @returns {Object}
 */
function readFormState() {
  return {
    scheduleMode:      getScheduleMode(),
    freqAmount:        document.getElementById('freq-amount').value,
    freqUnit:          document.getElementById('freq-unit').value,
    runDate:           document.getElementById('run-date').value,
    runTime:           document.getElementById('run-time').value,
    docLength:         document.getElementById('doc-length').value,
    marketFocus:       getMultiSelect('market-focus'),
    region:            getMultiSelect('region'),
    topic:             document.getElementById('topic').value,
    outputFormat:      document.getElementById('output-format').value,
    tone:              document.getElementById('tone').value,
    excludedSources:   document.getElementById('excluded-sources').value,
    srcOfficial:       document.getElementById('src-official').checked,
    srcRegulators:     document.getElementById('src-regulators').checked,
    srcAnalysts:       document.getElementById('src-analysts').checked,
    srcTrade:          document.getElementById('src-trade').checked,
    srcVendor:         document.getElementById('src-vendor').checked,
    srcAcademic:       document.getElementById('src-academic').checked,
    grCitations:       document.getElementById('gr-citations').checked,
    grSeparate:        document.getElementById('gr-separate').checked,
    grFlag:            document.getElementById('gr-flag').checked,
    grApproval:        document.getElementById('gr-approval').checked,
    grRecord:          document.getElementById('gr-record').checked,
    grConfidence:      document.getElementById('gr-confidence').checked
  };
}

/**
 * Apply a saved form state object back onto the form.
 * @param {Object} config
 */
function applyFormState(config) {
  setScheduleMode(config.scheduleMode || 'frequency');

  setValue('freq-amount',      config.freqAmount     || '1');
  setValue('freq-unit',        config.freqUnit       || 'week');
  setValue('run-date',         config.runDate        || '');
  setValue('run-time',         config.runTime        || '08:00');
  setValue('doc-length',       config.docLength      || '1000');
  setValue('topic',            config.topic          || '');
  setValue('output-format',    config.outputFormat   || 'executive-brief');
  setValue('tone',             config.tone           || 'Executive');
  setValue('excluded-sources', config.excludedSources || '');

  setMultiSelect('market-focus', config.marketFocus || []);
  setMultiSelect('region',       config.region      || []);

  setChecked('src-official',   config.srcOfficial);
  setChecked('src-regulators', config.srcRegulators);
  setChecked('src-analysts',   config.srcAnalysts);
  setChecked('src-trade',      config.srcTrade);
  setChecked('src-vendor',     config.srcVendor);
  setChecked('src-academic',   config.srcAcademic);

  setChecked('gr-citations',  config.grCitations);
  setChecked('gr-separate',   config.grSeparate);
  setChecked('gr-flag',       config.grFlag);
  setChecked('gr-approval',   config.grApproval);
  setChecked('gr-record',     config.grRecord);
  setChecked('gr-confidence', config.grConfidence);
}

/** Helper: set value of an input/select/textarea by ID */
function setValue(id, val) {
  const el = document.getElementById(id);
  if (el) el.value = val;
}

/** Helper: set checked state of a checkbox by ID */
function setChecked(id, val) {
  const el = document.getElementById(id);
  if (el) el.checked = !!val;
}

/** Helper: set selected options of a multi-select by value array */
function setMultiSelect(id, values) {
  document.querySelectorAll('#' + CSS.escape(id) + ' input[type="checkbox"]')
    .forEach(cb => { cb.checked = values.includes(cb.value); });
}

// =====================================================
// EXPORT JSON
// =====================================================

/**
 * Download the current payload as a .json file.
 */
function exportJSON() {
  const payload = window._currentPayload || buildPayload();
  const jsonString = JSON.stringify(payload, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const filename  = `research-agent-config-${timestamp}.json`;

  const link = document.createElement('a');
  link.href     = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  showMessage(`Exported: ${filename}`, 'success');
}

// =====================================================
// UI HELPERS
// =====================================================

/**
 * Show a temporary status message in the action area.
 * @param {string} text
 * @param {'success'|'error'|'info'} type
 */
function showMessage(text, type) {
  const el = document.getElementById('action-message');
  el.textContent = text;
  el.className   = `action-message ${type}`;

  // Clear after 3.5 seconds
  clearTimeout(window._msgTimer);
  window._msgTimer = setTimeout(() => {
    el.textContent = '';
    el.className   = 'action-message';
  }, 3500);
}

// =====================================================
// INIT
// =====================================================

/**
 * On page load, set today's date as the default for the date picker.
 */
document.addEventListener('DOMContentLoaded', function () {
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('run-date').value = today;
});
