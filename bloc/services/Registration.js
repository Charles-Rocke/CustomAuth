// Registration.js

import { startRegistration } from '@simplewebauthn/browser'

// Function to start WebAuthn registration
async function startWebAuthnRegistration () {
  console.log('Running Start WebAuthn')
  /* Generate signup options for your user */
  const resp = await fetch('/api/signup')
  const opts = await resp.json()

  // Start WebAuthn Registration
  let regResp
  try {
    regResp = await startRegistration(opts)
    if (regResp.transports) {
      if (regResp.transports.length === 2) {
        regResp.transports.pop(1)
      }
    }
  } catch (err) {
    if (err === undefined || typeof err === 'undefined') {
      console.log('err is undefined')
    }
    throw new Error(err)
  }

  /* Send response to server */
  const verificationResp = await fetch('/api/verify_signup', {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(regResp)
  })

  // Report validation response
  const verificationRespJSON = await verificationResp.json()
  const { verified, msg } = verificationRespJSON
  if (verified) {
    /* Redirect to your "login required" page */
    // 4. EDIT this location to redirect the user to your login required page
    window.location = '/'
  } else {
    console.log('not authenticated')
  }
}

// Export the function to be called from PasskeyButton
export { startWebAuthnRegistration }
