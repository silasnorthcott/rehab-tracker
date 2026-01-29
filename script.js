const sessionForm = document.getElementById('sessionForm');
const sessionsList = document.getElementById('sessions');
const exportBtn = document.getElementById('exportBtn');
const submitBtn = document.getElementById('submitBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');

let sessions = JSON.parse(localStorage.getItem('rehabSessions')) || [];
let editIndex = null;

function displaySessions() {
    sessionsList.innerHTML = '';
    sessions.forEach((s, i) => {
        let painColor = s.pain >= 7 ? 'pain-high' : s.pain >= 4 ? 'pain-medium' : 'pain-low';
        let li = document.createElement('li');
        li.innerHTML = `
            <span class="exercise">${s.exercise} — ${s.date}</span>
            | Sets: ${s.sets || '-'} | Effort: ${s.effort || '-'} | 
            Pain: <span class="pain ${painColor}">${s.pain}</span> | 
            ROM: ${s.rom || '-'}° | Adherence: ${s.adherence || '-'}%
            <br>${s.notes || ''}
            <div style="margin-top:0.5rem;">
                <button onclick="editSession(${i})">Edit</button>
                <button onclick="deleteSession(${i})">Delete</button>
            </div>
        `;
        sessionsList.appendChild(li);
    });
}

function saveSessions() {
    localStorage.setItem('rehabSessions', JSON.stringify(sessions));
    displaySessions();
}

if(sessionForm){
    sessionForm.addEventListener('submit', function(e){
        e.preventDefault();
        const newSession = {
            exercise: document.getElementById('exerciseName').value,
            category: document.getElementById('category').value,
            sets: document.getElementById('reps').value,
            weight: document.getElementById('weight').value,
            effort: Number(document.getElementById('effort').value),
            pain: Number(document.getElementById('pain').value),
            rom: Number(document.getElementById('rom').value),
            adherence: Number(document.getElementById('adherence').value),
            notes: document.getElementById('notes').value,
            date: new Date().toLocaleDateString(),
            timestamp: Date.now()
        };

        if(editIndex !== null){
            sessions[editIndex] = newSession;
            editIndex = null;
            submitBtn.textContent = "Add Session";
            cancelEditBtn.style.display = "none";
        } else {
            sessions.push(newSession);
        }

        saveSessions();
        sessionForm.reset();
    });
}

function editSession(index) {
    const s = sessions[index];
    document.getElementById('exerciseName').value = s.exercise;
    document.getElementById('category').value = s.category || '';
    document.getElementById('reps').value = s.sets || '';
    document.getElementById('weight').value = s.weight || '';
    document.getElementById('effort').value = s.effort || '';
    document.getElementById('pain').value = s.pain || '';
    document.getElementById('rom').value = s.rom || '';
    document.getElementById('adherence').value = s.adherence || '';
    document.getElementById('notes').value = s.notes || '';

    editIndex = index;
    submitBtn.textContent = "Save Changes";
    cancelEditBtn.style.display = "inline-block";
}

if(cancelEditBtn){
    cancelEditBtn.addEventListener('click', () => {
        editIndex = null;
        sessionForm.reset();
        submitBtn.textContent = "Add Session";
        cancelEditBtn.style.display = "none";
    });
}

function deleteSession(index){
    sessions.splice(index, 1);
    saveSessions();
}

if(exportBtn){
    exportBtn.addEventListener('click', () => {
        if(!sessions.length){ alert('No sessions to export'); return; }
        let csv = 'Date,Exercise,Category,Reps,Weight,Effort,Pain,ROM,Adherence,Notes\n';
        sessions.forEach(s=>{
            csv += `${s.date},${s.exercise},${s.category || ''},${s.sets || ''},${s.weight || ''},${s.effort},${s.pain},${s.rom || ''},${s.adherence || ''},"${s.notes.replace(/"/g,'""')}"\n`;
        });
        const blob = new Blob([csv], {type:'text/csv'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'rehab_sessions.csv';
        a.click();
    });
}

displaySessions();
