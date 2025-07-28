document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const imageUploadInput = document.getElementById('imageUploadInput');
    const psadtModal = document.getElementById('psadtModal');
    const modalCloseButton = document.getElementById('modalCloseButton');
    const createPackageButton = document.getElementById('createPackageButton');
    const cancelButton = document.getElementById('cancelButton');
    const packageLocationInput = document.getElementById('packageLocation');
    const browseButton = document.querySelector('.browse-button');

    const packageWrapperWindow = document.getElementById('packageWrapperWindow');
    const packageWrapperHeader = document.getElementById('packageWrapperHeader');
    const packageWrapperCloseButton = document.getElementById('packageWrapperCloseButton');
    const packageAppearanceSection = document.getElementById('packageAppearanceSection');
    const editBannerButton = document.getElementById('editBannerButton');
    const editIconButton = document.getElementById('editIconButton');
    const editLogoButton = document.getElementById('editLogoButton');
    const packageEditButton = document.getElementById('packageEditButton');
    const packageSaveButton = document.getElementById('packageSaveButton');
    const packageCancelButton = document.getElementById('packageCancelButton');
    const packageIdentityGrid = document.getElementById('packageIdentityGrid');
    const packageIdentityInputs = document.querySelectorAll('.package-field-input');

    // Designer Elements
    const designerTree = document.querySelector('.designer-tree');
    const fileExplorerView = document.getElementById('fileExplorerView');
    const codeEditorView = document.getElementById('codeEditorView');
    const designerContentTitle = document.getElementById('designerContentTitle');
    const codeEditorTitle = document.getElementById('codeEditorTitle');
    const fileListBody = document.getElementById('fileListBody');
    const addFileBtn = document.getElementById('addFileBtn');
    const addFileOptionsBtn = document.getElementById('addFileOptionsBtn');
    const deleteFileBtn = document.getElementById('deleteFileBtn');
    const collapseAllBtn = document.getElementById('collapseAllBtn');
    const importSection = document.getElementById('importSection');
    
    // Editor Footer Buttons
    const addCodeBtn = document.getElementById('addCodeBtn');
    const recentBtn = document.getElementById('recentBtn');
    const helpBtn = document.getElementById('helpBtn');

    // --- CodeMirror Instance ---
    let editor;
    try {
        editor = CodeMirror.fromTextArea(document.getElementById('codeEditor'), {
            lineNumbers: true,
            mode: 'powershell',
            theme: 'dracula',
            lineWrapping: true
        });
    } catch (e) {
        console.error("CodeMirror failed to initialize.", e);
    }

    // --- State ---
    const psadtState = {
        isEditing: false,
        originalValues: {},
        currentImageType: null,
        lastActiveEditorId: 'pre-install' // Keep track of the last viewed script section
    };
    
    const scriptTemplate = `[CmdletBinding()]
Param (
    [Parameter(Mandatory = $false)]
    [ValidateSet('Install', 'Uninstall', 'Repair')]
    [String]$DeploymentType = 'Install',
    [Parameter(Mandatory = $false)]
    [ValidateSet('Interactive', 'Silent', 'NonInteractive')]
    [String]$DeployMode = 'Interactive',
    [Parameter(Mandatory = $false)]
    [switch]$AllowRebootPassThru = $false,
    [Parameter(Mandatory = $false)]
    [switch]$TerminalServerMode = $false,
    [Parameter(Mandatory = $false)]
    [switch]$DisableLogging = $false
)

Try {
    ## Set the script execution policy for this process
    Try {
        Set-ExecutionPolicy -ExecutionPolicy 'ByPass' -Scope 'Process' -Force -ErrorAction 'Stop'
    } Catch {
    }

    ##*===============================================
    #region VARIABLE DECLARATION
    ##*===============================================
    ## Variables: Application
    [String]$appVendor = ''
    [String]$appName = ''
    [String]$appVersion = ''
    [String]$appArch = ''
    [String]$appLang = 'EN'
    [String]$appRevision = '01'
    [String]$appScriptVersion = '1.0.0'
    [String]$appScriptDate = 'XX/XX/20XX'
    [String]$appScriptAuthor = '<author name>'
    ##*===============================================
    ## Variables: Install Titles (Only set here to override defaults set by the toolkit)
    [String]$installName = ''
    [String]$installTitle = ''

    ##* Do not modify section below
    #region DoNotModify

    ## Variables: Exit Code
    [Int32]$mainExitCode = 0

    ## Variables: Script
    [String]$deployAppScriptFriendlyName = 'Deploy Application'
    [Version]$deployAppScriptVersion = [Version]'3.10.2'
    [String]$deployAppScriptDate = '08/13/2024'
    [Hashtable]$deployAppScriptParameters = $PsBoundParameters

    ## Variables: Environment
    If (Test-Path -LiteralPath 'variable:HostInvocation') {
        $InvocationInfo = $HostInvocation
    }
    Else {
        $InvocationInfo = $MyInvocation
    }
    [String]$scriptDirectory = Split-Path -Path $InvocationInfo.MyCommand.Definition -Parent

    ## Dot source the required App Deploy Toolkit Functions
    Try {
        [String]$moduleAppDeployToolkitMain = "$scriptDirectory\\AppDeployToolkit\\AppDeployToolkitMain.ps1"
        If (-not (Test-Path -LiteralPath $moduleAppDeployToolkitMain -PathType 'Leaf')) {
            Throw "Module does not exist at the specified location [$moduleAppDeployToolkitMain]."
        }
        If ($DisableLogging) {
            . $moduleAppDeployToolkitMain -DisableLogging
        }
        Else {
            . $moduleAppDeployToolkitMain
        }
    }
    Catch {
        If ($mainExitCode -eq 0) {
            [Int32]$mainExitCode = 60008
        }
        Write-Error -Message "Module [$moduleAppDeployToolkitMain] failed to load: \`n$($_.Exception.Message)\`n \`n$($_.InvocationInfo.PositionMessage)" -ErrorAction 'Continue'
        ## Exit the script, returning the exit code to SCCM
        If (Test-Path -LiteralPath 'variable:HostInvocation') {
            $script:ExitCode = $mainExitCode; Exit
        }
        Else {
            Exit $mainExitCode
        }
    }

    #endregion
    ##* Do not modify section above
    ##*===============================================
    #endregion END VARIABLE DECLARATION
    ##*===============================================

    If ($deploymentType -ine 'Uninstall' -and $deploymentType -ine 'Repair') {
        ##*===============================================
        ##* MARK: PRE-INSTALLATION
        ##*===============================================
        [String]$installPhase = 'Pre-Installation'
##_pre-install_##

        ##*===============================================
        ##* MARK: INSTALLATION
        ##*===============================================
        [String]$installPhase = 'Installation'
##_install_##

        ##*===============================================
        ##* MARK: POST-INSTALLATION
        ##*===============================================
        [String]$installPhase = 'Post-Installation'
##_post-install_##
        
    }
    ElseIf ($deploymentType -ieq 'Uninstall') {
        ##*===============================================
        ##* MARK: PRE-UNINSTALLATION
        ##*===============================================
        [String]$installPhase = 'Pre-Uninstallation'
##_pre-uninstall_##

        ##*===============================================
        ##* MARK: UNINSTALLATION
        ##*===============================================
        [String]$installPhase = 'Uninstallation'
##_uninstall-action_##

        ##*===============================================
        ##* MARK: POST-UNINSTALLATION
        ##*===============================================
        [String]$installPhase = 'Post-Uninstallation'
##_post-uninstall_##

    }
    ElseIf ($deploymentType -ieq 'Repair') {
        ##*===============================================
        ##* MARK: PRE-REPAIR
        ##*===============================================
        [String]$installPhase = 'Pre-Repair'
##_pre-repair_##

        ##*===============================================
        ##* MARK: REPAIR
        ##*===============================================
        [String]$installPhase = 'Repair'
##_repair-action_##

        ##*===============================================
        ##* MARK: POST-REPAIR
        ##*===============================================
        [String]$installPhase = 'Post-Repair'
##_post-repair_##
    }

    ## Call the Exit-Script function to perform final cleanup operations
    Exit-Script -ExitCode $mainExitCode
}
Catch {
    [Int32]$mainExitCode = 60001
    [String]$mainErrorMessage = "$(Resolve-Error)"
    Write-Log -Message $mainErrorMessage -Severity 3 -Source $deployAppScriptFriendlyName
    Show-DialogBox -Text $mainErrorMessage -Icon 'Stop'
    Exit-Script -ExitCode $mainExitCode
}`;

    // --- Designer Data ---
    const designerContentMap = {
        'installation': { title: 'Primary Installation Files', files: `<tr><td><div class="file-name-cell"><svg width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M4 20q-.825 0-1.412-.587T2 18V6q0-.825.588-1.412T4 4h6l2 2h8q.825 0 1.413.588T22 8v10q0 .825-.587 1.413T20 20z"/></svg><span>Files</span></div></td><td>Folder</td><td>0 Bytes</td></tr>` },
        'support': { title: 'Supporting Resources or Assets', files: `<tr><td><div class="file-name-cell"><svg width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M4 20q-.825 0-1.412-.587T2 18V6q0-.825.588-1.412T4 4h6l2 2h8q.825 0 1.413.588T22 8v10q0 .825-.587 1.413T20 20z"/></svg><span>SupportFiles</span></div></td><td>Folder</td><td>0 Bytes</td></tr>` },
        'pre-install': { title: 'Pre-Installation Actions', code: `
        ## Show Welcome Message, close Internet Explorer if required, allow up to 3 deferrals, verify there is enough disk space to complete the install, and persist the prompt
        Show-InstallationWelcome -CloseApps 'iexplore' -AllowDefer -DeferTimes 3 -CheckDiskSpace -PersistPrompt

        ## Show Progress Message (with the default message)
        Show-InstallationProgress

        ## <Perform Pre-Installation tasks here>` },
        'install': { title: 'Installation Actions', code: `
        ## <Perform Installation tasks here>` },
        'post-install': { title: 'Post-Installation Actions', code: `
        ## <Perform Post-Installation tasks here>` },
        'pre-repair': { title: 'Pre-Repair Actions', code: `
        ## Show Welcome Message, close Internet Explorer with a 60 second countdown before automatically closing
        Show-InstallationWelcome -CloseApps 'iexplore' -CloseAppsCountdown 60

        ## Show Progress Message (with the default message)
        Show-InstallationProgress
        
        ## <Perform Pre-Repair tasks here>` },
        'repair-action': { title: 'Repair Actions', code: `
        ## <Perform Repair tasks here>` },
        'post-repair': { title: 'Post-Repair Actions', code: `
        ## <Perform Post-Repair tasks here>` },
        'pre-uninstall': { title: 'Pre-Uninstallation Actions', code: `
        ## Show Welcome Message, close Internet Explorer with a 60 second countdown before automatically closing
        Show-InstallationWelcome -CloseApps 'iexplore' -CloseAppsCountdown 60

        ## Show Progress Message (with the default message)
        Show-InstallationProgress

        ## <Perform Pre-Uninstallation tasks here>` },
        'uninstall-action': { title: 'Uninstallation Actions', code: `
        ## <Perform Uninstallation tasks here>` },
        'post-uninstall': { title: 'Post-Uninstallation Actions', code: `
        ## <Perform Post-Uninstallation tasks here>` },
        'raw-script': { title: 'Raw Deployment Script' }
    };
    
    // --- Modal Functions ---
    function openPSADTModal() {
        appState.modalOpen = true;
        psadtModal.classList.remove('hidden');
        const now = new Date();
        const timestamp = now.getFullYear().toString() + (now.getMonth() + 1).toString().padStart(2, '0') + now.getDate().toString().padStart(2, '0') + '-' + now.getHours().toString().padStart(2, '0') + now.getMinutes().toString().padStart(2, '0') + now.getSeconds().toString().padStart(2, '0');
        packageLocationInput.value = `C:\\PKG\\PKG-${timestamp}`;
        document.body.style.overflow = 'hidden';
        console.log('PSAppDeployToolkit modal opened');
    }

    function closePSADTModal() {
        appState.modalOpen = false;
        psadtModal.classList.add('hidden');
        document.body.style.overflow = '';
        console.log('PSAppDeployToolkit modal closed');
    }
    
    function handleCreatePackage() {
        console.log('Creating PSAppDeployToolkit package:', {
            template: document.getElementById('templateSelect').value,
            location: packageLocationInput.value
        });
        closePSADTModal();
        openPackageWrapperWindow();
    }

    // --- Package Wrapper Functions ---
    function openPackageWrapperWindow() {
        appState.packageWrapperOpen = true;
        packageWrapperWindow.classList.remove('hidden');
        const packageName = packageLocationInput.value.split('\\').pop();
        packageWrapperWindow.querySelector('.package-wrapper-title').textContent = `Package Wrapper - ${packageName}`;
        document.body.style.overflow = 'hidden';
        console.log('Package Wrapper window opened');
    }

    function closePackageWrapperWindow() {
        if (psadtState.isEditing) {
            if (confirm('You have unsaved changes. Are you sure you want to close?')) {
                handlePackageCancel();
            } else {
                return;
            }
        }
        appState.packageWrapperOpen = false;
        packageWrapperWindow.classList.add('hidden');
        document.body.style.overflow = '';
        console.log('Package Wrapper window closed');
    }
    
    // --- Edit Mode Functions ---
    function handlePackageEdit() {
        psadtState.isEditing = true;
        packageIdentityInputs.forEach(input => {
            psadtState.originalValues[input.id] = input.value;
        });
        packageAppearanceSection.classList.add('edit-mode');
        packageIdentityGrid.classList.add('edit-mode');
        packageEditButton.classList.add('hidden');
        packageSaveButton.classList.remove('hidden');
        packageCancelButton.classList.remove('hidden');
        packageIdentityInputs.forEach(input => input.readOnly = false);
        document.getElementById('pkg-name').focus();
        console.log('Package edit mode enabled');
    }

    function handlePackageSave() {
        console.log('Saving package identity...');
        finishEditing();
        console.log('Package edit mode disabled, changes saved.');
    }

    function handlePackageCancel() {
        packageIdentityInputs.forEach(input => {
            input.value = psadtState.originalValues[input.id];
        });
        finishEditing();
        console.log('Package edit mode disabled, changes canceled.');
    }
    
    function finishEditing() {
        psadtState.isEditing = false;
        packageAppearanceSection.classList.remove('edit-mode');
        packageIdentityGrid.classList.remove('edit-mode');
        packageEditButton.classList.remove('hidden');
        packageSaveButton.classList.add('hidden');
        packageCancelButton.classList.add('hidden');
        packageIdentityInputs.forEach(input => input.readOnly = true);
    }

    function handleImageEdit(type) {
        if (!psadtState.isEditing) return;
        psadtState.currentImageType = type;
        imageUploadInput.click();
    }
    
    function onImageSelected(event) {
        const file = event.target.files[0];
        if (file && psadtState.currentImageType) {
            console.log(`Selected ${psadtState.currentImageType}: ${file.name}`);
            alert(`Selected file for ${psadtState.currentImageType}: ${file.name}\n(Preview not implemented)`);
        }
        event.target.value = '';
        psadtState.currentImageType = null;
    }
    
    // --- Draggable Window ---
    function makeDraggable(element, handle) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        if (handle) {
            handle.onmousedown = dragMouseDown;
        }

        function dragMouseDown(e) {
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
    
    // --- Designer Functions ---
    function buildRawScript() {
        // Save the currently active editor before building the raw script
        if (editor && designerContentMap[psadtState.lastActiveEditorId]) {
             designerContentMap[psadtState.lastActiveEditorId].code = editor.getValue();
        }
        
        let rawScript = scriptTemplate;
        for (const key in designerContentMap) {
            if (designerContentMap[key].code) {
                const placeholder = `##_${key}_##`;
                rawScript = rawScript.replace(placeholder, designerContentMap[key].code);
            }
        }
        return rawScript;
    }
    
    function handleTreeItemClick(e) {
        const target = e.target.closest('.tree-item');
        if (!target) return;

        // Save current editor content before switching
        if (editor && !codeEditorView.classList.contains('hidden') && designerContentMap[psadtState.lastActiveEditorId]) {
            designerContentMap[psadtState.lastActiveEditorId].code = editor.getValue();
        }

        designerTree.querySelectorAll('.tree-item').forEach(item => item.classList.remove('active'));
        target.classList.add('active');

        const viewType = target.dataset.view;
        const contentId = target.dataset.id;
        
        if (viewType === 'explorer') {
            fileExplorerView.classList.remove('hidden');
            codeEditorView.classList.add('hidden');
            const content = designerContentMap[contentId];
            if (content) {
                designerContentTitle.textContent = content.title;
                fileListBody.innerHTML = content.files || '';
            }
        } else if (viewType === 'editor') {
            fileExplorerView.classList.add('hidden');
            codeEditorView.classList.remove('hidden');
            
            const content = designerContentMap[contentId];
            codeEditorTitle.textContent = content.title;
            
            let codeToShow = content.code;
            if (contentId === 'raw-script') {
                codeToShow = buildRawScript();
            }

            if (editor) {
                editor.setValue(codeToShow || `## Script for ${content.title}`);
                setTimeout(() => editor.refresh(), 1);
                psadtState.lastActiveEditorId = contentId;
            }
        }
    }

    // --- Event Listeners ---
    imageUploadInput.addEventListener('change', onImageSelected);
    document.querySelectorAll('.psadt-option').forEach(item => item.addEventListener('click', openPSADTModal));
    modalCloseButton.addEventListener('click', closePSADTModal);
    createPackageButton.addEventListener('click', handleCreatePackage);
    cancelButton.addEventListener('click', closePSADTModal);
    browseButton.addEventListener('click', () => alert('File browser not implemented.'));
    packageWrapperCloseButton.addEventListener('click', closePackageWrapperWindow);
    editBannerButton.addEventListener('click', () => handleImageEdit('banner'));
    editIconButton.addEventListener('click', () => handleImageEdit('icon'));
    editLogoButton.addEventListener('click', () => handleImageEdit('logo'));
    packageEditButton.addEventListener('click', handlePackageEdit);
    packageSaveButton.addEventListener('click', handlePackageSave);
    packageCancelButton.addEventListener('click', handlePackageCancel);

    document.querySelectorAll('.package-tab[data-package-tab]').forEach(button => {
        button.addEventListener('click', (e) => {
            const tabName = e.currentTarget.dataset.packageTab;
            document.querySelectorAll('.package-tab').forEach(btn => btn.classList.remove('active'));
            e.currentTarget.classList.add('active');
            document.querySelectorAll('.package-tab-content').forEach(content => {
                content.classList.toggle('hidden', content.id !== `${tabName}Tab`);
            });
            // Refresh CodeMirror if the designer tab becomes visible
            if (tabName === 'designer' && editor) {
                 setTimeout(() => editor.refresh(), 1);
            }
        });
    });

    if (designerTree) {
        designerTree.addEventListener('click', handleTreeItemClick);
        addFileBtn.addEventListener('click', () => importSection.classList.toggle('hidden'));
        addFileOptionsBtn.addEventListener('click', () => alert('Add options not implemented.'));
        deleteFileBtn.addEventListener('click', () => alert('Delete functionality not implemented.'));
        collapseAllBtn.addEventListener('click', () => alert('Collapse all not implemented.'));
        addCodeBtn.addEventListener('click', () => alert('Add code snippet not implemented.'));
        recentBtn.addEventListener('click', () => alert('Recent snippets not implemented.'));
        helpBtn.addEventListener('click', () => alert('Help not implemented.'));
    }

    makeDraggable(packageWrapperWindow, packageWrapperHeader);
    
    // Initialize first view in designer
    const initialActiveItem = designerTree.querySelector('.tree-item.active');
    if (initialActiveItem) {
       handleTreeItemClick({ target: initialActiveItem });
    }
});