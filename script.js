document.addEventListener('DOMContentLoaded', () => {
    // --- Configuration ---
    // Change this URL to your deployed Google Apps Script Web App URL
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwRs11Js-Pjgkp0GSVLIS3fztT33GzB9Eqa5e_i5ehTnw7LWLxRPnwawjhpeajrhUw/exec';

    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    const loadingDiv = document.getElementById('loading');
    const resultContainer = document.getElementById('resultContainer');

    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const query = searchInput.value.trim();

        if (!query) {
            showNotification('กรุณากรอกข้อมูลเพื่อค้นหา', 'error');
            return;
        }

        // UI State: Loading
        loadingDiv.classList.remove('hidden');
        resultContainer.classList.add('hidden');
        resultContainer.innerHTML = '';

        try {
            // Fetch data from Google Apps Script
            // Note: In a real scenario with CORS, you might need 'no-cors' or handle it via a proxy if GAS is strict.
            // Usually, GAS Web Apps published as 'Anyone, even anonymous' work fine with simple GET/POST.

            // For now, I'll simulate the fetch to show you how it works visually.
            // Replace the setTimeout block with the actual fetch call below when ready.

            /* 
            const response = await fetch(`${GOOGLE_SCRIPT_URL}?q=${encodeURIComponent(query)}`);
            const data = await response.json();
            */

            // --- MOCK DATA SIMULATION (Remove this block when using real API) ---
            await new Promise(r => setTimeout(r, 1500)); // Fake delay
            const mockData = [
                { id: '1234567890123', name: 'นายสมชาย ใจดี', date: '10 มี.ค. 2569', time: '09:00 - 10:00', doctor: 'นพ. สมศักดิ์ เก่งมาก', dept: 'อายุรกรรม', status: 'confirmed' },
                { id: '0812345678', name: 'นายสมชาย ใจดี', date: '15 เม.ย. 2569', time: '13:00', doctor: 'พญ. ใจทิพย์', dept: 'สูตินารีเวช', status: 'pending' }
            ];
            const data = mockData.filter(item => item.id.includes(query) || item.name.includes(query));
            // --- END MOCK DATA ---

            if (data && data.length > 0) {
                renderResults(data);
                resultContainer.classList.remove('hidden');
            } else {
                showEmptyState();
                resultContainer.classList.remove('hidden');
            }

        } catch (error) {
            console.error('Error fetching data:', error);
            showNotification('เกิดข้อผิดพลาดในการเชื่อมต่อ', 'error');
            resultContainer.innerHTML = '<p style="text-align:center; color:red;">ไม่สามารถเชื่อมต่อกับฐานข้อมูลได้</p>';
            resultContainer.classList.remove('hidden');
        } finally {
            loadingDiv.classList.add('hidden');
        }
    });

    function renderResults(data) {
        data.forEach(item => {
            const card = document.createElement('div');
            card.className = 'result-card';

            const statusClass = item.status === 'confirmed' ? 'status-confirmed' : 'status-pending';
            const statusText = item.status === 'confirmed' ? 'ยืนยันแล้ว' : 'รอการยืนยัน';

            card.innerHTML = `
                <div class="card-header">
                   <div class="card-date">
                        <i class="fa-regular fa-calendar-check" style="margin-right: 6px;"></i>
                        ${item.date}
                   </div>
                   <span class="card-status ${statusClass}">${statusText}</span>
                </div>
                <div class="card-body">
                    <p><span class="label">ชื่อ-นามสกุล</span> <span class="value">${item.name}</span></p>
                    <p><span class="label">เวลา</span> <span class="value">${item.time} น.</span></p>
                    <p><span class="label">แพทย์</span> <span class="value">${item.doctor}</span></p>
                    <p><span class="label">แผนก</span> <span class="value">${item.dept}</span></p>
                </div>
            `;
            resultContainer.appendChild(card);
        });
    }

    function showEmptyState() {
        resultContainer.innerHTML = `
            <div style="text-align: center; color: #64748b; padding: 2rem;">
                <i class="fa-solid fa-file-circle-xmark" style="font-size: 3rem; margin-bottom: 1rem; color: #cbd5e1;"></i>
                <p>ไม่พบข้อมูลการนัดหมาย</p>
                <small>กรุณาตรวจสอบเลขบัตรประชาชน หรือ ชื่อ-นามสกุล อีกครั้ง</small>
            </div>
        `;
    }

    function showNotification(msg, type) {
        // Simple alert for now, can be upgraded to a toast
        alert(msg);
    }
});
