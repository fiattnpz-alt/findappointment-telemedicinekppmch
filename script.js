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
            // Note: GAS Web App must be deployed as "Anyone, even anonymous" for this to work without CORS issues on simple GET requests.

            const response = await fetch(`${GOOGLE_SCRIPT_URL}?q=${encodeURIComponent(query)}`);
            const data = await response.json();

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
                <i class="fa-solid fa-file-circle-xmark" style="font-size: 3rem; margin-bottom: 1rem; color: #ff0000ff;"></i>
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
