document.addEventListener('DOMContentLoaded', () => {
    // Update footer year
    const footer = document.getElementById('app-footer');
    const currentYear = new Date().getFullYear();
    footer.innerHTML = `© ${currentYear} Laboratorium Teknik Elektro dan Komputer`;

    // === 1. DOM Element Selectors ===
    const themeToggle = document.getElementById('theme-toggle');
    const reportTitleInput = document.getElementById('report-title');
    const inventoryLocationInput = document.getElementById('inventory-location');
    const inventoryDateInput = document.getElementById('inventory-date');
    const reportDateInput = document.getElementById('report-date');
    const itemCodePrefixInput = document.getElementById('item-code-prefix');
    const editSignaturesBtn = document.getElementById('edit-signatures-btn');
    const searchInput = document.getElementById('search-input');
    const addItemBtn = document.getElementById('add-item-btn');
    const saveFileBtn = document.getElementById('save-file-btn');
    const loadFileBtn = document.getElementById('load-file-btn');
    const fileInput = document.getElementById('file-input');
    const printPdfBtn = document.getElementById('print-pdf-btn');
    const resetDataBtn = document.getElementById('reset-data-btn');
    const inventoryTableBody = document.getElementById('inventory-table-body');
    const totalQuantityCell = document.getElementById('total-quantity');
    const responsibleNameInput = document.getElementById('responsible-name');
    const responsibleTitleInput = document.getElementById('responsible-title');
    const responsibleIdInput = document.getElementById('responsible-id');
    const approverNameInput = document.getElementById('approver-name');
    const approverTitleInput = document.getElementById('approver-title');
    const approverIdInput = document.getElementById('approver-id');
    const witnessNameInput = document.getElementById('witness-name');
    const witnessTitleInput = document.getElementById('witness-title');
    const witnessIdInput = document.getElementById('witness-id');
    const displayResponsible = {
        title: document.getElementById('display-responsible-title'),
        name: document.getElementById('display-responsible-name'),
        id: document.getElementById('display-responsible-id'),
        box: document.getElementById('display-responsible')
    };
    const displayApprover = {
        title: document.getElementById('display-approver-title'),
        name: document.getElementById('display-approver-name'),
        id: document.getElementById('display-approver-id'),
        box: document.getElementById('display-approver')
    };
    const displayWitness = {
        title: document.getElementById('display-witness-title'),
        name: document.getElementById('display-witness-name'),
        id: document.getElementById('display-witness-id'),
        box: document.getElementById('display-witness')
    };
    const signatureSection = document.querySelector('.signature-section');
    const itemModal = document.getElementById('item-modal');
    const modalCloseBtn = itemModal.querySelector('.close-btn');
    const itemForm = document.getElementById('item-form');
    const modalTitle = document.getElementById('modal-title');
    const itemIdInput = document.getElementById('item-id');
    const itemNameInput = document.getElementById('item-name');
    const itemSpecInput = document.getElementById('item-spec');
    const itemQuantityInput = document.getElementById('item-quantity');
    const itemUnitInput = document.getElementById('item-unit');
    const itemConditionInput = document.getElementById('item-condition');
    const itemDescriptionInput = document.getElementById('item-description');
    const parentIdInput = document.getElementById('parent-id');
    const notification = document.getElementById('notification');
    const detailsModal = document.getElementById('details-modal');
    const detailsModalTitle = document.getElementById('details-modal-title');
    const detailsList = document.getElementById('details-list');
    const addDetailForm = document.getElementById('add-detail-form');
    const newDetailTextInput = document.getElementById('new-detail-text');
    const newDetailQuantityInput = document.getElementById('new-detail-quantity');
    const newDetailConditionInput = document.getElementById('new-detail-condition');
    const signatureModal = document.getElementById('signature-modal');
    const signatureForm = document.getElementById('signature-form');
    const closeSignatureModalBtn = signatureModal.querySelector('.close-btn');
    const toggleSignaturePrint = document.getElementById('toggle-signature-print');
    
    // === 2. Application State ===
    let currentDetailItemId = null;
    let state = {
        reportDetails: {
            title: "Laporan Inventaris Barang",
            location: "",
            inventoryDate: new Date().toISOString().slice(0, 10),
            reportDate: new Date().toISOString().slice(0, 10),
            prefix: "BRG",
            responsible: { name: "", title: "", id: "" },
            approver: { name: "", title: "", id: "" },
            witness: { name: "", title: "", id: "" }
        },
        inventory: [],
        nextId: 1,
        settings: {
            printSignatures: true
        }
    };

    // === 3. Function Definitions ===

    const saveState = () => {
        // Update state from UI before saving
        state.reportDetails.title = reportTitleInput.value;
        state.reportDetails.location = inventoryLocationInput.value;
        state.reportDetails.inventoryDate = inventoryDateInput.value;
        state.reportDetails.reportDate = reportDateInput.value;
        state.reportDetails.prefix = itemCodePrefixInput.value || 'BRG';
        state.reportDetails.responsible = {
            name: responsibleNameInput.value,
            title: responsibleTitleInput.value,
            id: responsibleIdInput.value
        };
        state.reportDetails.approver = {
            name: approverNameInput.value,
            title: approverTitleInput.value,
            id: approverIdInput.value
        };
        state.reportDetails.witness = {
            name: witnessNameInput.value,
            title: witnessTitleInput.value,
            id: witnessIdInput.value
        };
        state.settings.printSignatures = toggleSignaturePrint.checked;
        localStorage.setItem('inventoryReportState', JSON.stringify(state));
    };

    const loadState = () => {
        const savedState = localStorage.getItem('inventoryReportState');
        if (savedState) {
            const loadedState = JSON.parse(savedState);
            
            const defaultStateForMerge = {
                reportDetails: {
                    title: "Laporan Inventaris Barang",
                    location: "",
                    inventoryDate: new Date().toISOString().slice(0, 10),
                    reportDate: new Date().toISOString().slice(0, 10),
                    prefix: "BRG",
                    responsible: { name: "", title: "", id: "" },
                    approver: { name: "", title: "", id: "" },
                    witness: { name: "", title: "", id: "" }
                },
                inventory: [],
                nextId: 1,
                settings: {
                    printSignatures: true
                }
            };

            state = {
                ...defaultStateForMerge,
                ...loadedState,
                reportDetails: {
                    ...defaultStateForMerge.reportDetails,
                    ...(loadedState.reportDetails || {}),
                    responsible: { ...defaultStateForMerge.reportDetails.responsible, ...(loadedState.reportDetails?.responsible || {}) },
                    approver: { ...defaultStateForMerge.reportDetails.approver, ...(loadedState.reportDetails?.approver || {}) },
                    witness: { ...defaultStateForMerge.reportDetails.witness, ...(loadedState.reportDetails?.witness || {}) },
                },
                settings: {
                    ...defaultStateForMerge.settings,
                    ...(loadedState.settings || {})
                }
            };

            state.inventory.forEach(item => {
                if (item.isExpanded === undefined) {
                    item.isExpanded = false;
                }
                const migrateDetails = (details) => {
                    if (details && details.length > 0 && typeof details[0] === 'string') {
                        return details.map(detailText => ({ 
                            id: Date.now() + Math.random(),
                            text: detailText, 
                            quantity: 1,
                            condition: 'Baik',
                            print: false 
                        }));
                    }
                    if(details && details.length > 0 && details[0].text && !details[0].quantity) {
                         return details.map(d => ({
                            id: d.id || Date.now() + Math.random(),
                            text: d.text,
                            quantity: d.quantity || 1,
                            condition: d.condition || 'Baik',
                            print: d.print !== undefined ? d.print : false
                        }));
                    }
                    return details || [];
                };
                item.details = migrateDetails(item.details);
            });
        }
        reportTitleInput.value = state.reportDetails.title;
        inventoryLocationInput.value = state.reportDetails.location;
        inventoryDateInput.value = state.reportDetails.inventoryDate;
        reportDateInput.value = state.reportDetails.reportDate;
        itemCodePrefixInput.value = state.reportDetails.prefix;
        responsibleNameInput.value = state.reportDetails.responsible.name;
        responsibleTitleInput.value = state.reportDetails.responsible.title;
        responsibleIdInput.value = state.reportDetails.responsible.id;
        approverNameInput.value = state.reportDetails.approver.name;
        approverTitleInput.value = state.reportDetails.approver.title;
        approverIdInput.value = state.reportDetails.approver.id;
        witnessNameInput.value = state.reportDetails.witness.name;
        witnessTitleInput.value = state.reportDetails.witness.title;
        witnessIdInput.value = state.reportDetails.witness.id;

        toggleSignaturePrint.checked = state.settings.printSignatures;
        updateSignaturePrintClass();
        renderTable();
        renderSignatures();
    };

    const updateSignaturePrintClass = () => {
        if (toggleSignaturePrint.checked) {
            signatureSection.classList.remove('no-print');
        } else {
            signatureSection.classList.add('no-print');
        }
    };

    const findItemById = (items, id) => {
        for (const item of items) {
            if (item.id == id) return item;
            if (item.subItems) {
                const found = findItemById(item.subItems, id);
                if (found) return found;
            }
        }
        return null;
    };
    
    const renderUnprintedSummary = () => {
        const summaryContainer = document.getElementById('unprinted-summary-container');
        const summary = {};

        const collectUnprinted = (items) => {
            items.forEach(item => {
                if(item.details) {
                    item.details.forEach(detail => {
                         if (!detail.print) {
                            const quantity = parseInt(detail.quantity, 10) || 0;
                            summary[detail.condition] = (summary[detail.condition] || 0) + quantity;
                         }
                    });
                }
                
                if (!item.includeInPrint) {
                    const quantity = parseInt(item.quantity, 10) || 0;
                    summary[item.condition] = (summary[item.condition] || 0) + quantity;
                }

                if (item.subItems) {
                    collectUnprinted(item.subItems);
                }
            });
        };

        collectUnprinted(state.inventory);

        if (Object.keys(summary).length === 0) {
            summaryContainer.innerHTML = '';
            return;
        }

        const summaryList = Object.entries(summary)
            .map(([condition, total]) => `<li><strong>${condition}:</strong> ${total} unit</li>`)
            .join('');
        
        summaryContainer.innerHTML = `
            <h3>Ringkasan Barang Tidak Tercetak</h3>
            <ul>${summaryList}</ul>
        `;
    };

    const renderTable = () => {
        const searchTerm = searchInput.value.toLowerCase();
        inventoryTableBody.innerHTML = '';
        let totalQuantity = 0;
        let counter = 0;

        const filterAndClone = (items) => {
            const results = [];
            for (const item of items) {
                const subItems = item.subItems ? filterAndClone(item.subItems) : [];
                
                const matchesSearch = item.name.toLowerCase().includes(searchTerm) ||
                                    item.code.toLowerCase().includes(searchTerm) ||
                                    item.spec.toLowerCase().includes(searchTerm) ||
                                    item.condition.toLowerCase().includes(searchTerm) ||
                                    item.description.toLowerCase().includes(searchTerm);

                if (matchesSearch || subItems.length > 0) {
                    const clonedItem = { ...item, subItems: subItems };
                    results.push(clonedItem);
                }
            }
            return results;
        };
        
        const filteredInventory = searchTerm ? filterAndClone(state.inventory) : state.inventory;

        const renderRows = (items, level = 0) => {
            items.forEach((item) => {
                counter++;
                const row = document.createElement('tr');
                row.dataset.id = item.id;
                row.className = `item-row ${level > 0 ? 'sub-item-row' : ''}`;
                if (!item.includeInPrint) {
                    row.classList.add('item-row-no-print');
                }

                row.innerHTML = `
                    <td class="row-number">${!level > 0 ? counter : ''}</td>
                    <td>${item.code}</td>
                    <td>${item.name}</td>
                    <td>${item.spec}</td>
                    <td>${item.quantity}</td>
                    <td>${item.unit}</td>
                    <td>${item.condition}</td>
                    <td>${item.description}</td>
                    <td class="no-print"><input type="checkbox" class="print-toggle" ${item.includeInPrint ? 'checked' : ''}></td>
                    <td class="action-buttons no-print">
                         <div class="action-buttons-wrapper">
                            <button class="add-detail-btn" title="Tambah Detail">➕</button>
                            <button class="edit-btn" title="Edit Item">✏️</button>
                            <button class="delete-btn danger" title="Hapus Item">🗑️</button>
                        </div>
                    </td>
                `;
                inventoryTableBody.appendChild(row);

                // Render Details as individual rows
                if (item.details && item.details.length > 0) {
                    item.details.forEach(detail => {
                        const detailRow = document.createElement('tr');
                        if (!detail.print) {
                            detailRow.classList.add('no-print');
                        }
                        detailRow.classList.add('detail-row');
                        detailRow.dataset.parentId = item.id;
                        detailRow.dataset.detailId = detail.id;

                        detailRow.innerHTML = `
                            <td></td>
                            <td></td>
                            <td class="detail-text-cell">${detail.text}</td>
                            <td></td>
                            <td>${detail.quantity}</td>
                            <td>Unit</td>
                            <td>${detail.condition}</td>
                            <td></td>
                            <td class="no-print"><input type="checkbox" class="detail-print-toggle" ${detail.print ? 'checked' : ''}></td>
                            <td class="action-buttons no-print">
                                <div class="action-buttons-wrapper">
                                    <button class="edit-detail-btn" title="Edit Detail">✏️</button>
                                    <button class="delete-detail-btn danger" title="Hapus Detail">🗑️</button>
                                </div>
                            </td>
                        `;
                        inventoryTableBody.appendChild(detailRow);
                    });
                }

                if (item.includeInPrint) {
                    totalQuantity += parseInt(item.quantity, 10) || 0;
                }
                
                if (item.details) {
                    item.details.forEach(d => {
                        if (d.print) {
                            totalQuantity += parseInt(d.quantity, 10) || 0;
                        }
                    });
                }
            });
        };

        if (filteredInventory.length === 0) {
            inventoryTableBody.innerHTML = `<tr><td colspan="10" style="text-align: center;">Tidak ada barang yang cocok dengan pencarian.</td></tr>`;
        } else {
            renderRows(filteredInventory);
        }
        totalQuantityCell.textContent = totalQuantity;
        renderUnprintedSummary();
    };
    
    const showNotification = (message, isError = false) => {
        notification.textContent = message;
        notification.className = 'notification show';
        if (isError) notification.classList.add('error');
        setTimeout(() => notification.classList.remove('show'), 3000);
    };

    const generateItemCode = (id) => {
        const prefix = state.reportDetails.prefix.toUpperCase();
        const paddedId = String(id).padStart(4, '0');
        return `${prefix}-${paddedId}`;
    };
    
    const openModal = () => itemModal.style.display = 'flex';
    const closeModal = () => itemModal.style.display = 'none';

    const resetForm = () => {
        itemForm.reset();
        itemIdInput.value = '';
        parentIdInput.value = '';
        modalTitle.innerText = '➕ Tambah Barang Baru';
        itemQuantityInput.value = 1;
    };

    const renderSignatures = () => {
        const { responsible, approver, witness } = state.reportDetails;

        displayResponsible.title.textContent = responsible.title;
        displayResponsible.name.textContent = responsible.name;
        displayResponsible.id.textContent = responsible.id;

        displayApprover.title.textContent = approver.title;
        displayApprover.name.textContent = approver.name;
        displayApprover.id.textContent = approver.id;

        displayWitness.title.textContent = witness.title;
        displayWitness.name.textContent = witness.name;
        displayWitness.id.textContent = witness.id;

        const isWitnessEmpty = !witness.name && !witness.title && !witness.id;
        displayWitness.box.style.display = isWitnessEmpty ? 'none' : 'block';
    };

    const openSignatureModal = () => {
        responsibleNameInput.value = state.reportDetails.responsible.name;
        responsibleTitleInput.value = state.reportDetails.responsible.title;
        responsibleIdInput.value = state.reportDetails.responsible.id;
        approverNameInput.value = state.reportDetails.approver.name;
        approverTitleInput.value = state.reportDetails.approver.title;
        approverIdInput.value = state.reportDetails.approver.id;
        witnessNameInput.value = state.reportDetails.witness.name;
        witnessTitleInput.value = state.reportDetails.witness.title;
        witnessIdInput.value = state.reportDetails.witness.id;
        signatureModal.style.display = 'flex';
    };

    const closeSignatureModal = () => {
        signatureModal.style.display = 'none';
    };

    const deleteItem = (id) => {
        state.inventory = state.inventory.filter(item => item.id != id);
    };

    const openEditDetailModal = (item, detail) => {
        modalTitle.innerText = '✏️ Edit Detail';
        itemIdInput.value = detail.id;
        parentIdInput.value = item.id;
        
        // Populate modal with detail data
        itemNameInput.value = detail.text;
        itemSpecInput.value = ''; // Details don't have specs
        itemQuantityInput.value = detail.quantity;
        itemUnitInput.value = 'Unit'; // Default for details
        itemConditionInput.value = detail.condition;
        itemDescriptionInput.value = ''; // Details don't have descriptions

        // Hide fields not relevant to details
        document.querySelector('label[for="item-spec"]').style.display = 'none';
        itemSpecInput.style.display = 'none';
        document.querySelector('label[for="item-description"]').style.display = 'none';
        itemDescriptionInput.style.display = 'none';

        openModal();
    };

    const resetItemModal = () => {
        modalTitle.innerText = '➕ Tambah Barang Baru';
        // Ensure all fields are visible again
        document.querySelector('label[for="item-spec"]').style.display = 'block';
        itemSpecInput.style.display = 'block';
        document.querySelector('label[for="item-description"]').style.display = 'block';
        itemDescriptionInput.style.display = 'block';
        resetForm();
    };
    
    // === 4. Event Listeners ===
    
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        themeToggle.innerText = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
        saveState();
    });
    
    document.querySelector('.report-header-container').addEventListener('change', saveState);

    editSignaturesBtn.addEventListener('click', openSignatureModal);
    closeSignatureModalBtn.addEventListener('click', closeSignatureModal);

    signatureForm.addEventListener('submit', (e) => {
        e.preventDefault();
        state.reportDetails.responsible = {
            title: responsibleTitleInput.value,
            name: responsibleNameInput.value,
            id: responsibleIdInput.value
        };
        state.reportDetails.approver = {
            title: approverTitleInput.value,
            name: approverNameInput.value,
            id: approverIdInput.value
        };
        state.reportDetails.witness = {
            title: witnessTitleInput.value,
            name: witnessNameInput.value,
            id: witnessIdInput.value
        };
        saveState();
        renderSignatures();
        closeSignatureModal();
        showNotification('Data penanda tangan berhasil diperbarui.');
    });

    addItemBtn.addEventListener('click', () => {
        resetItemModal();
        openModal();
    });

    printPdfBtn.addEventListener('click', () => {
        document.getElementById('print-report-title').innerText = state.reportDetails.title;
        document.getElementById('print-location').innerText = state.reportDetails.location;
        document.getElementById('print-inv-date').innerText = new Date(state.reportDetails.inventoryDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
        document.getElementById('print-rep-date').innerText = new Date(state.reportDetails.reportDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
        
        window.print();
    });

    modalCloseBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        if (e.target === itemModal) closeModal();
    });

    itemForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = itemIdInput.value;
        const parentId = parentIdInput.value;

        // Check if we are editing a detail
        if (parentId) {
            const parentItem = findItemById(state.inventory, parentId);
            const detail = parentItem.details.find(d => d.id == id);
            if (detail) {
                detail.text = itemNameInput.value.trim();
                detail.quantity = parseInt(itemQuantityInput.value, 10) || 1;
                detail.condition = itemConditionInput.value.trim();
            }
            showNotification('✅ Detail berhasil diperbarui!');
        } else { // It's a main item
            const itemData = {
                name: itemNameInput.value.trim(),
                spec: itemSpecInput.value.trim(),
                quantity: parseInt(itemQuantityInput.value, 10) || 1,
                unit: itemUnitInput.value.trim(),
                condition: itemConditionInput.value.trim(),
                description: itemDescriptionInput.value.trim(),
                details: id ? (findItemById(state.inventory, id)?.details || []) : [],
                includeInPrint: true
            };
    
            if (id) {
                const item = findItemById(state.inventory, id);
                if (item) {
                    // Preserve existing details, don't overwrite with empty array from form
                    itemData.details = item.details; 
                    Object.assign(item, itemData);
                    showNotification('✅ Barang berhasil diperbarui!');
                }
            } else {
                itemData.id = state.nextId;
                itemData.code = generateItemCode(state.nextId);
                state.inventory.push(itemData);
                state.nextId++;
                showNotification('✅ Barang baru berhasil ditambahkan!');
            }
        }

        saveState();
        renderTable();
        closeModal();
    });

    inventoryTableBody.addEventListener('click', (e) => {
        const target = e.target;
        if (!target) return;
        
        const row = target.closest('tr');
        if (!row) return;

        const isDetail = row.classList.contains('detail-row');
        
        if (isDetail) {
            const parentId = row.dataset.parentId;
            const detailId = row.dataset.detailId;
            const parentItem = findItemById(state.inventory, parentId);
            const detail = parentItem.details.find(d => d.id == detailId);

            if (target.closest('.edit-detail-btn')) {
                openEditDetailModal(parentItem, detail);
            } else if (target.closest('.delete-detail-btn')) {
                if (confirm(`Yakin ingin menghapus detail "${detail.text}"?`)) {
                    parentItem.details = parentItem.details.filter(d => d.id != detailId);
                    saveState();
                    renderTable();
                }
            } else if (target.classList.contains('detail-print-toggle')) {
                detail.print = target.checked;
                saveState();
                renderTable();
            }
        } else { // It's a main item row
            const id = row.dataset.id;
            const item = findItemById(state.inventory, id);
            if (!item) return;

            if (target.closest('.edit-btn')) {
                resetItemModal();
                modalTitle.innerText = '✨ Edit Barang';
                itemIdInput.value = item.id;
                parentIdInput.value = '';
                itemNameInput.value = item.name;
                itemSpecInput.value = item.spec;
                itemQuantityInput.value = item.quantity;
                itemUnitInput.value = item.unit;
                itemConditionInput.value = item.condition;
                itemDescriptionInput.value = item.description;
                openModal();
            } else if (target.closest('.delete-btn')) {
                if (confirm(`Yakin ingin menghapus "${item.name}"?`)) {
                    deleteItem(id);
                    saveState();
                    renderTable();
                    showNotification('♻️ Barang berhasil dihapus.');
                }
            } else if (target.closest('.add-detail-btn')) {
                if (!item.details) {
                    item.details = [];
                }
                item.details.push({
                    id: Date.now(),
                    text: 'Detail Baru',
                    quantity: 1,
                    condition: 'Baik',
                    print: false
                });
                saveState();
                renderTable();
            } else if (target.classList.contains('print-toggle')) {
                item.includeInPrint = target.checked;
                renderTable(); 
                saveState();
            }
        }
    });

    searchInput.addEventListener('input', renderTable);

    resetDataBtn.addEventListener('click', () => {
        if (confirm('APAKAH ANDA YAKIN? Semua data laporan dan inventaris akan dihapus permanen.')) {
            localStorage.removeItem('inventoryReportState');
            state = {
                reportDetails: {
                    title: "Laporan Inventaris Barang",
                    location: "",
                    inventoryDate: new Date().toISOString().slice(0, 10),
                    reportDate: new Date().toISOString().slice(0, 10),
                    prefix: "BRG",
                    responsible: { name: "", title: "", id: "" },
                    approver: { name: "", title: "", id: "" },
                    witness: { name: "", title: "", id: "" }
                },
                inventory: [],
                nextId: 1,
                settings: {
                    printSignatures: true
                }
            };
            loadState();
            showNotification('♻️ Semua data berhasil di-reset.');
        }
    });
    
    saveFileBtn.addEventListener('click', () => {
        saveState();
        const dataStr = JSON.stringify(state, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const fileName = state.reportDetails.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        a.href = url;
        a.download = `${fileName}_${new Date().toISOString().slice(0,10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        showNotification('💾 Laporan berhasil disimpan.');
    });

    loadFileBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const loadedData = JSON.parse(event.target.result);
                if (loadedData.reportDetails && Array.isArray(loadedData.inventory)) {
                    if (confirm('Ini akan menimpa data saat ini. Lanjutkan?')) {
                        localStorage.setItem('inventoryReportState', JSON.stringify(loadedData));
                        loadState();
                        showNotification('📁 Data berhasil dimuat.');
                    }
                } else {
                    throw new Error('Format file tidak valid.');
                }
            } catch (error) {
                showNotification(`❌ Gagal memuat file: ${error.message}`, true);
            } finally {
                fileInput.value = '';
            }
        };
        reader.readAsText(file);
    });
    
    addDetailForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const item = findItemById(state.inventory, currentDetailItemId);
        if (item) {
            if (!item.details) {
                item.details = [];
            }
            const newDetail = {
                id: Date.now(),
                text: newDetailTextInput.value,
                quantity: parseInt(newDetailQuantityInput.value, 10) || 1,
                condition: newDetailConditionInput.value || 'Baik',
                print: false
            };
            item.details.push(newDetail);
            addDetailForm.reset();
            newDetailQuantityInput.value = 1;
            renderDetailsList(item.details);
            saveState();
        }
    });

    detailsList.addEventListener('click', (e) => {
        const item = findItemById(state.inventory, currentDetailItemId);
        if (!item || !item.details) return;

        const detailItemEl = e.target.closest('.detail-item');
        if (!detailItemEl) return;
        const detailId = detailItemEl.dataset.detailId;
        const detail = item.details.find(d => d.id == detailId);

        if (e.target.classList.contains('delete-detail-btn')) {
            if (confirm(`Yakin ingin menghapus detail "${detail.text}"?`)) {
                item.details = item.details.filter(d => d.id != detailId);
                renderDetailsList(item.details);
                saveState();
            }
        }

        if (e.target.classList.contains('edit-detail-btn')) {
            detailItemEl.querySelector('.detail-item-view').style.display = 'none';
            detailItemEl.querySelector('.detail-item-edit').style.display = 'flex';
        }
        
        if (e.target.classList.contains('cancel-edit-btn')) {
            detailItemEl.querySelector('.detail-item-view').style.display = 'flex';
            detailItemEl.querySelector('.detail-item-edit').style.display = 'none';
        }

        if (e.target.classList.contains('save-detail-btn')) {
            const newText = detailItemEl.querySelector('.edit-detail-text').value;
            const newQuantity = parseInt(detailItemEl.querySelector('.edit-detail-quantity').value, 10);
            const newCondition = detailItemEl.querySelector('.edit-detail-condition').value;

            if (newText && newQuantity > 0) {
                detail.text = newText;
                detail.quantity = newQuantity;
                detail.condition = newCondition;
                saveState();
                renderDetailsList(item.details);
                renderTable();
            }
        }

        if (e.target.classList.contains('detail-print-toggle')) {
            detail.print = e.target.checked;
            saveState();
        }
    });

    detailsModal.querySelector('.close-btn').addEventListener('click', closeDetailsModal);
    
    toggleSignaturePrint.addEventListener('change', () => {
        updateSignaturePrintClass();
        saveState();
    });

    // === 5. Initial Load ===
    try {
        loadState();
    } catch (e) {
        console.error("Gagal memuat status aplikasi:", e);
        // Bisa tampilkan notifikasi ke pengguna jika perlu
    }
}); 