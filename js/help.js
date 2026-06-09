const USER_GUIDE_HTML = `
<h2>User Guide</h2>

<h3>Contents</h3>

<ol>
<li>Login</li>
<li>QR Scan</li>
<li>Manual Verification</li>
<li>Add New User</li>
<li>Troubleshooting</li>
</ol>

<hr>

<h3>1. Login</h3>

<ul>
<li>Select Security Authority.</li>
<li>Enter Passcode.</li>
<li>Click LOGIN.</li>
</ul>

<h3>2. QR Scan</h3>

<ul>
<li>Point camera at QR code.</li>
<li>Wait for vibration and verification.</li>
<li>Green screen = Approved.</li>
<li>Red screen = Denied.</li>
<li>Press CONTINUE for next scan.</li>
</ul>

<h3>3. Manual Verification</h3>

<ul>
<li>Use when QR code is unavailable.</li>
<li>Enter either Unique ID OR Name + Facilitator + Passcode.</li>
<li>If verified, user details and QR code are displayed.</li>
<li>Take screenshot if QR needs reprinting.</li>
</ul>

<h3>4. Add New User</h3>

<ul>
<li>Enter Name, Gender, Age, Facilitator and Passcode.</li>
<li>Click GENERATE ID.</li>
<li>Verify generated ID.</li>
<li>Click CREATE USER.</li>
<li>Take screenshot of generated QR code.</li>
<li>Provide QR code to user for future entry.</li>
</ul>

<h3>5. Troubleshooting</h3>

<ul>
<li>If scanner does not respond, press CONTINUE and scan again.</li>
<li>If login fails, verify Authority and Passcode.</li>
<li>If Facilitator is unavailable, contact Superadmin.</li>
<li>If network is unavailable, reconnect and retry.</li>
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

