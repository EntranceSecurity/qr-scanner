const USER_GUIDE_HTML = `
<h2>User Guide</h2>

<h3>Contents</h3>

<ol>
<li>Login</li>
<li>Scan QR</li>
<li>Manual Verification</li>
<li>Add New User</li>
<li>Result Screen</li>
<li>Troubleshooting</li>
</ol>

<hr>

<h3>1. Login</h3>

<ul>
<li>Use the Authority dropdown and Passcode field on the main screen.</li>
<li>Click LOGIN to sign in.</li>
<li>After login, the scanner starts and the action buttons appear.</li>
</ul>

<h3>2. Scan QR</h3>

<ul>
<li>Point the camera at the user’s QR code.</li>
<li>Wait for the app to verify the code.</li>
<li>Approved scans show a green-approved screen with user details.</li>
<li>Denied scans show a red-denied screen with "Unknown QR Code."</li>
<li>Press CONTINUE to return to scanning for the next user.</li>
</ul>

<h3>3. Manual Verification</h3>

<ul>
<li>Use MANUAL VERIFY when the QR code cannot be scanned or is missing.</li>
<li>Enter either the Unique ID OR all of: Name, Facilitator, and Passcode.</li>
<li>Click VERIFY to check the user.</li>
<li>If multiple matches appear, select the correct user from the list.</li>
<li>Approved manual verification shows the user details and a QR code for screenshot or reprint.</li>
</ul>

<h3>4. Add New User</h3>

<ul>
<li>Click ADD NEW USER to open the registration form.</li>
<li>Enter Name, Gender, Age, Facilitator, and Passcode.</li>
<li>Click GENERATE ID to create a Unique ID.</li>
<li>If a matching registration exists, confirm before creating a new user.</li>
<li>Click CREATE USER after the ID is generated.</li>
<li>Take a screenshot of the generated QR code and give it to the user.</li>
<li>Note: users aged 5 or below are not registered through this app.</li>
</ul>

<h3>5. Result Screen</h3>

<ul>
<li>After any verification or user creation, press CONTINUE to go back to scanning.</li>
<li>Review the displayed Unique ID, Name, Facilitator, and Passcode when approved.</li>
<li>For newly created users, save the displayed QR code immediately.</li>
</ul>

<h3>6. Troubleshooting</h3>

<ul>
<li>If login fails, check the selected Authority and entered Passcode.</li>
<li>If the camera does not scan, adjust QR position, distance, or lighting.</li>
<li>If a valid user is denied, use MANUAL VERIFY with the user’s details.</li>
<li>If no facilitator list appears, refresh the page and try again.</li>
</ul>

<hr>

<p>
Version 1.0
</p>
`;

function openHelpModal(){

    document
    .getElementById(
      "helpContent"
    )
    .innerHTML = USER_GUIDE_HTML;

    document
    .getElementById(
      "helpModal"
    )
    .style.display = "block";

}

function closeHelpModal(){

    document
    .getElementById(
      "helpModal"
    )
    .style.display = "none";

}

