// Application State
const appState = {
  sidebarOpen: true,
  currentView: 'packager-tasks',
  selectedTask: null,
  selectedOption: null,
  isDarkMode: false,
  isMaximized: false,
  modalOpen: false,
  packageWrapperOpen: false,
  activePackageTab: 'general'
};

// DOM Elements
const menuButton = document.getElementById('menuButton');
const themeToggle = document.getElementById('themeToggle');
const navigationSidebar = document.getElementById('navigationSidebar');
const currentView = document.getElementById('currentView');
const taskBreadcrumb = document.getElementById('taskBreadcrumb');
const optionBreadcrumb = document.getElementById('optionBreadcrumb');
const taskName = document.getElementById('taskName');
const optionName = document.getElementById('optionName');
const comingSoonText = document.getElementById('comingSoonText');
const emptyStateText = document.getElementById('emptyStateText');

// Window Controls
const minimizeButton = document.getElementById('minimizeButton');
const maximizeButton = document.getElementById('maximizeButton');
const closeButton = document.getElementById('closeButton');

// Modal Elements
const psadtModal = document.getElementById('psadtModal');
const modalCloseButton = document.getElementById('modalCloseButton');
const createPackageButton = document.getElementById('createPackageButton');
const cancelButton = document.getElementById('cancelButton');
const packageLocationInput = document.getElementById('packageLocation');
const browseButton = document.querySelector('.browse-button');

// Package Identity Modal Elements
const packageIdentityModal = document.getElementById('packageIdentityModal');
const packageIdentityCloseButton = document.getElementById('packageIdentityCloseButton');
const savePackageIdentityButton = document.getElementById('savePackageIdentityButton');
const cancelPackageIdentityButton = document.getElementById('cancelPackageIdentityButton');

// Package Wrapper Elements
const packageWrapperWindow = document.getElementById('packageWrapperWindow');
const packageWrapperCloseButton = document.getElementById('packageWrapperCloseButton');

// Views and Options
const packagerTasksView = document.getElementById('packagerTasksView');
const otherTasksView = document.getElementById('otherTasksView');
const createPackageOptions = document.getElementById('createPackageOptions');
const editPackageOptions = document.getElementById('editPackageOptions');
const testPackageOptions = document.getElementById('testPackageOptions');
const emptyOptions = document.getElementById('emptyOptions');

// Utility Functions
function getViewDisplayName(view) {
  return view.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}

function getTaskDisplayName(task) {
  if (!task) return null;
  return task.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}

function getOptionDisplayName(option) {
  if (!option) return null;
  const optionNames = {
    'ps1': 'PS1',
    'intunewin': 'IntuneWin',
    'psadt': 'PSAppDeployToolkit',
    'edit-ps1': 'PS1',
    'edit-psadt': 'PSAppDeployToolkit',
    'test-ps1': 'PS1',
    'test-psadt': 'PSAppDeployToolkit'
  };
  return optionNames[option] || option;
}

// Modal Functions
function openPSADTModal() {
  appState.modalOpen = true;
  psadtModal.classList.remove('hidden');
  
  // Generate a new package location with current timestamp
  const now = new Date();
  const timestamp = now.getFullYear().toString() + 
    (now.getMonth() + 1).toString().padStart(2, '0') + 
    now.getDate().toString().padStart(2, '0') + '-' +
    now.getHours().toString().padStart(2, '0') + 
    now.getMinutes().toString().padStart(2, '0') + 
    now.getSeconds().toString().padStart(2, '0');
  
  packageLocationInput.value = `C:\\PKG\\PKG-${timestamp}`;
  
  // Prevent body scroll when modal is open
  document.body.style.overflow = 'hidden';
  
  console.log('PSAppDeployToolkit modal opened');
}

function closePSADTModal() {
  appState.modalOpen = false;
  psadtModal.classList.add('hidden');
  
  // Re-enable body scroll
  document.body.style.overflow = '';
  
  console.log('PSAppDeployToolkit modal closed');
}

function handleCreatePackage() {
  const templateSelect = document.getElementById('templateSelect');
  const selectedTemplate = templateSelect.value;
  const packageLocation = packageLocationInput.value;
  
  console.log('Creating PSAppDeployToolkit package:', {
    template: selectedTemplate,
    location: packageLocation
  });
  
  // Close the first modal
  closePSADTModal();
  
  // Open the Package Wrapper window
  openPackageWrapperWindow();
}

function handleBrowseLocation() {
  // In a real application, this would open a file/folder picker dialog
  console.log('Browse button clicked - would open file picker');
  
  // For demo purposes, we'll just show an alert
  alert('In a real application, this would open a folder picker dialog');
}

// Package Wrapper Functions
function openPackageWrapperWindow() {
  appState.packageWrapperOpen = true;
  packageWrapperWindow.classList.remove('hidden');
  
  // Update the title with the current package location
  const packageLocation = packageLocationInput.value;
  const packageName = packageLocation.split('\\').pop();
  const titleElement = packageWrapperWindow.querySelector('.package-wrapper-title');
  titleElement.textContent = `Package Wrapper - ${packageName}`;
  
  // Prevent body scroll when package wrapper is open
  document.body.style.overflow = 'hidden';
  
  console.log('Package Wrapper window opened');
}

function closePackageWrapperWindow() {
  appState.packageWrapperOpen = false;
  packageWrapperWindow.classList.add('hidden');
  
  // Re-enable body scroll
  document.body.style.overflow = '';
  
  console.log('Package Wrapper window closed');
}

// Package Identity Modal Functions
function openPackageIdentityModal() {
  packageIdentityModal.classList.remove('hidden');
  
  // Load current values into the form
  loadPackageIdentityValues();
  
  // Prevent body scroll when modal is open
  document.body.style.overflow = 'hidden';
  
  console.log('Package Identity modal opened');
}

function closePackageIdentityModal() {
  packageIdentityModal.classList.add('hidden');
  
  // Re-enable body scroll
  document.body.style.overflow = '';
  
  console.log('Package Identity modal closed');
}

function loadPackageIdentityValues() {
  // Get current values from the package wrapper display
  const fields = document.querySelectorAll('.package-field-value');
  const values = {};
  
  // Map the current values (this would normally come from your data model)
  values.name = 'None';
  values.revision = '01';
  values.vendor = 'None';
  values.scriptVersion = '1.0.0';
  values.version = 'None';
  values.scriptDate = '22.07.2025';
  values.architecture = 'None';
  values.scriptAuthor = 'CKED01';
  values.language = 'EN';
  
  // Set form values
  document.getElementById('editName').value = values.name === 'None' ? '' : values.name;
  document.getElementById('editRevision').value = values.revision;
  document.getElementById('editVendor').value = values.vendor === 'None' ? '' : values.vendor;
  document.getElementById('editScriptVersion').value = values.scriptVersion;
  document.getElementById('editVersion').value = values.version === 'None' ? '' : values.version;
  document.getElementById('editScriptDate').value = values.scriptDate;
  document.getElementById('editArchitecture').value = values.architecture === 'None' ? '' : values.architecture;
  document.getElementById('editScriptAuthor').value = values.scriptAuthor;
  document.getElementById('editLanguage').value = values.language;
}

function savePackageIdentityValues() {
  // Get form values
  const values = {
    name: document.getElementById('editName').value || 'None',
    revision: document.getElementById('editRevision').value || '01',
    vendor: document.getElementById('editVendor').value || 'None',
    scriptVersion: document.getElementById('editScriptVersion').value || '1.0.0',
    version: document.getElementById('editVersion').value || 'None',
    scriptDate: document.getElementById('editScriptDate').value || new Date().toLocaleDateString('de-DE'),
    architecture: document.getElementById('editArchitecture').value || 'None',
    scriptAuthor: document.getElementById('editScriptAuthor').value || 'CKED01',
    language: document.getElementById('editLanguage').value || 'EN'
  };
  
  // Update the display values in the package wrapper
  updatePackageIdentityDisplay(values);
  
  // Close the modal
  closePackageIdentityModal();
  
  console.log('Package Identity values saved:', values);
}

function updatePackageIdentityDisplay(values) {
  const fieldElements = document.querySelectorAll('.package-field');
  
  fieldElements.forEach(field => {
    const label = field.querySelector('.package-field-label').textContent.toLowerCase();
    const valueElement = field.querySelector('.package-field-value');
    
    switch(label) {
      case 'name':
        valueElement.textContent = values.name;
        break;
      case 'revision':
        valueElement.textContent = values.revision;
        break;
      case 'vendor':
        valueElement.textContent = values.vendor;
        break;
      case 'script version':
        valueElement.textContent = values.scriptVersion;
        break;
      case 'version':
        valueElement.textContent = values.version;
        break;
      case 'script date':
        valueElement.textContent = values.scriptDate;
        break;
      case 'architecture':
        valueElement.textContent = values.architecture;
        break;
      case 'script author':
        valueElement.textContent = values.scriptAuthor;
        break;
      case 'language':
        valueElement.textContent = values.language;
        break;
    }
  });
}

function switchPackageTab(tabName) {
  appState.activePackageTab = tabName;
  
  // Update tab buttons
  document.querySelectorAll('.package-tab').forEach(button => {
    button.classList.remove('active');
  });
  
  const activeButton = document.querySelector(`[data-package-tab="${tabName}"]`);
  if (activeButton) {
    activeButton.classList.add('active');
  }
  
  // Update tab content
  document.querySelectorAll('.package-tab-content').forEach(content => {
    content.classList.add('hidden');
  });
  
  const activeTab = document.getElementById(tabName + 'Tab');
  if (activeTab) {
    activeTab.classList.remove('hidden');
  }
  
  console.log('Package tab switched to:', tabName);
}

// Window Controls Functions
function minimizeWindow() {
  console.log('Minimize window requested');
  // In a real application, this would minimize the window
  // For demo purposes, we'll just log the action
}

function toggleMaximizeWindow() {
  appState.isMaximized = !appState.isMaximized;
  
  if (appState.isMaximized) {
    // Update maximize button to restore icon
    maximizeButton.innerHTML = `
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <rect x="1" y="1" width="5" height="5" stroke="currentColor" stroke-width="1" fill="none"/>
        <rect x="3" y="3" width="5" height="5" stroke="currentColor" stroke-width="1" fill="none"/>
      </svg>
    `;
    maximizeButton.title = 'Restore Down';
    console.log('Window maximized');
  } else {
    // Update to maximize icon
    maximizeButton.innerHTML = `
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <rect x="2" y="2" width="6" height="6" stroke="currentColor" stroke-width="1" fill="none"/>
      </svg>
    `;
    maximizeButton.title = 'Maximize';
    console.log('Window restored');
  }
  
  // In a real application, this would maximize/restore the window
}

function closeWindow() {
  console.log('Close window requested');
  // In a real application, this would close the window
  // For demo purposes, we'll show a confirmation
  if (confirm('Are you sure you want to close the application?')) {
    console.log('Application would close now');
    // window.close(); // This would close the window in a real app
  }
}

// Theme Management
function initializeTheme() {
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
    appState.isDarkMode = true;
    document.documentElement.classList.add('dark');
  } else {
    appState.isDarkMode = false;
    document.documentElement.classList.remove('dark');
  }
}

function toggleTheme() {
  appState.isDarkMode = !appState.isDarkMode;
  
  if (appState.isDarkMode) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
}

// Sidebar Management
function toggleSidebar() {
  appState.sidebarOpen = !appState.sidebarOpen;
  
  if (appState.sidebarOpen) {
    navigationSidebar.classList.remove('hidden');
  } else {
    navigationSidebar.classList.add('hidden');
  }
}

// Navigation Management
function updateBreadcrumb() {
  currentView.textContent = getViewDisplayName(appState.currentView);
  
  if (appState.selectedTask) {
    taskBreadcrumb.classList.remove('hidden');
    taskName.textContent = getTaskDisplayName(appState.selectedTask);
  } else {
    taskBreadcrumb.classList.add('hidden');
  }
  
  if (appState.selectedOption) {
    optionBreadcrumb.classList.remove('hidden');
    optionName.textContent = getOptionDisplayName(appState.selectedOption);
  } else {
    optionBreadcrumb.classList.add('hidden');
  }
}

function setCurrentView(view) {
  appState.currentView = view;
  appState.selectedTask = null;
  appState.selectedOption = null;
  
  // Update navigation active state
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });
  
  const activeNavItem = document.querySelector(`[data-view="${view}"]`);
  if (activeNavItem) {
    activeNavItem.classList.add('active');
  }
  
  // Update task views
  if (view === 'packager-tasks') {
    packagerTasksView.classList.remove('hidden');
    otherTasksView.classList.add('hidden');
  } else {
    packagerTasksView.classList.add('hidden');
    otherTasksView.classList.remove('hidden');
    comingSoonText.textContent = `${getViewDisplayName(view)} coming soon...`;
  }
  
  // Update options
  updateOptionsView();
  updateBreadcrumb();
}

function setSelectedTask(taskId) {
  appState.selectedTask = taskId;
  appState.selectedOption = null;
  
  // Update task selection visual state
  document.querySelectorAll('.task-item').forEach(item => {
    item.classList.remove('selected');
  });
  
  const selectedTaskItem = document.querySelector(`[data-task="${taskId}"]`);
  if (selectedTaskItem) {
    selectedTaskItem.classList.add('selected');
  }
  
  updateOptionsView();
  updateBreadcrumb();
}

function setSelectedOption(optionId) {
  appState.selectedOption = optionId;
  
  // Update option selection visual state
  document.querySelectorAll('.option-item').forEach(item => {
    item.classList.remove('selected');
  });
  
  const selectedOptionItem = document.querySelector(`[data-option="${optionId}"]`);
  if (selectedOptionItem) {
    selectedOptionItem.classList.add('selected');
  }
  
  updateBreadcrumb();
}

function updateOptionsView() {
  // Hide all option views first
  createPackageOptions.classList.add('hidden');
  editPackageOptions.classList.add('hidden');
  testPackageOptions.classList.add('hidden');
  emptyOptions.classList.add('hidden');
  
  if (appState.currentView === 'packager-tasks') {
    if (appState.selectedTask === 'create-package') {
      createPackageOptions.classList.remove('hidden');
    } else if (appState.selectedTask === 'edit-package') {
      editPackageOptions.classList.remove('hidden');
    } else if (appState.selectedTask === 'test-package') {
      testPackageOptions.classList.remove('hidden');
    } else {
      emptyOptions.classList.remove('hidden');
      if (appState.selectedTask) {
        emptyStateText.textContent = 'Select an option';
      } else {
        emptyStateText.textContent = 'Select a task';
      }
    }
  } else {
    emptyOptions.classList.remove('hidden');
    emptyStateText.textContent = 'Select a task';
  }
}

// Tab Management
function switchTab(tabName) {
  // Update tab buttons
  document.querySelectorAll('.tab-button').forEach(button => {
    button.classList.remove('active');
  });
  
  const activeButton = document.querySelector(`[data-tab="${tabName}"]`);
  if (activeButton) {
    activeButton.classList.add('active');
  }
  
  // Update tab content
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.add('hidden');
  });
  
  const activeTab = document.getElementById(tabName + 'Tab');
  if (activeTab) {
    activeTab.classList.remove('hidden');
  }
}

// Event Listeners
function initializeEventListeners() {
  // Menu button
  menuButton.addEventListener('click', toggleSidebar);
  
  // Theme toggle
  themeToggle.addEventListener('click', toggleTheme);
  
  // Window controls
  minimizeButton.addEventListener('click', minimizeWindow);
  maximizeButton.addEventListener('click', toggleMaximizeWindow);
  closeButton.addEventListener('click', closeWindow);
  
  // Modal controls
  modalCloseButton.addEventListener('click', closePSADTModal);
  createPackageButton.addEventListener('click', handleCreatePackage);
  cancelButton.addEventListener('click', closePSADTModal);
  browseButton.addEventListener('click', handleBrowseLocation);
  
  // Package Wrapper controls
  packageWrapperCloseButton.addEventListener('click', closePackageWrapperWindow);
  
  // Package Identity Modal controls
  packageIdentityCloseButton.addEventListener('click', closePackageIdentityModal);
  savePackageIdentityButton.addEventListener('click', savePackageIdentityValues);
  cancelPackageIdentityButton.addEventListener('click', closePackageIdentityModal);
  
  // Package Edit Button
  document.querySelector('.package-edit-button').addEventListener('click', openPackageIdentityModal);
  
  // Package Wrapper tabs
  document.querySelectorAll('.package-tab[data-package-tab]').forEach(button => {
    button.addEventListener('click', () => {
      const tab = button.getAttribute('data-package-tab');
      switchPackageTab(tab);
    });
  });
  
  // Close modal on overlay click
  psadtModal.addEventListener('click', (e) => {
    if (e.target === psadtModal) {
      closePSADTModal();
    }
  });
  
  // Close package identity modal on overlay click
  packageIdentityModal.addEventListener('click', (e) => {
    if (e.target === packageIdentityModal) {
      closePackageIdentityModal();
    }
  });
  
  // Navigation items
  document.querySelectorAll('.nav-item[data-view]').forEach(item => {
    item.addEventListener('click', () => {
      const view = item.getAttribute('data-view');
      setCurrentView(view);
    });
  });
  
  // Task items
  document.querySelectorAll('.task-item[data-task]').forEach(item => {
    item.addEventListener('click', () => {
      const task = item.getAttribute('data-task');
      setSelectedTask(task);
    });
  });
  
  // Option items (including PSAppDeployToolkit options)
  document.querySelectorAll('.option-item[data-option]').forEach(item => {
    item.addEventListener('click', () => {
      const option = item.getAttribute('data-option');
      
      // Check if this is a PSAppDeployToolkit option
      if (option === 'psadt' || option === 'edit-psadt' || option === 'test-psadt') {
        openPSADTModal();
        return;
      }
      
      setSelectedOption(option);
    });
  });
  
  // Tab buttons
  document.querySelectorAll('.tab-button[data-tab]').forEach(button => {
    button.addEventListener('click', () => {
      const tab = button.getAttribute('data-tab');
      switchTab(tab);
    });
  });
  
  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    // Escape key to close modal or package wrapper
    if (e.key === 'Escape') {
      if (appState.packageWrapperOpen) {
        closePackageWrapperWindow();
        return;
      }
      if (!packageIdentityModal.classList.contains('hidden')) {
        closePackageIdentityModal();
        return;
      }
      if (appState.modalOpen) {
        closePSADTModal();
        return;
      }
    }
    
    // Alt+A for quit (just for demo)
    if (e.altKey && e.key === 'a') {
      e.preventDefault();
      closeWindow();
    }
    
    // Alt+F4 for close (Windows standard)
    if (e.altKey && e.key === 'F4') {
      e.preventDefault();
      closeWindow();
    }
    
    // F11 for fullscreen toggle
    if (e.key === 'F11') {
      e.preventDefault();
      toggleMaximizeWindow();
    }
  });
  
  // Handle window resize for responsive sidebar
  window.addEventListener('resize', () => {
    if (window.innerWidth <= 768) {
      // On mobile, sidebar should be hidden by default
      if (appState.sidebarOpen) {
        navigationSidebar.classList.remove('hidden');
      }
    }
  });
  
  // Double-click title bar to maximize/restore
  document.querySelector('.title-bar').addEventListener('dblclick', (e) => {
    // Only trigger if clicking on the title bar itself, not buttons
    if (e.target.closest('button')) return;
    toggleMaximizeWindow();
  });
}

// Initialization
function initializeApp() {
  initializeTheme();
  initializeEventListeners();
  updateBreadcrumb();
  updateOptionsView();
  
  // Set initial tab
  switchTab('tasks');
  
  // Set initial package tab
  switchPackageTab('general');
  
  console.log('Launcher initialized with PSAppDeployToolkit Package Wrapper support');
}

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);

// System theme change listener
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  if (!localStorage.getItem('theme')) {
    appState.isDarkMode = e.matches;
    if (e.matches) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
});